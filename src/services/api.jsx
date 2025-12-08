import axios from 'axios';

const API_KEYS = [
  "b309ad546043576ee8a1a44c457d6b1b", // Primary key
  "830b18d37e652538242417e82f0fc92d",
  "e67f3a4454da58a5fe4b58f472de0032",
  "738a87defb0e42c0c4eedfc56501992b",
  "9c4ee924819d06879c0f3ea084ef27b3"
];

let currentKeyIndex = 0;
const BASE_URL = "/api";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    token: API_KEYS[currentKeyIndex],
  }
});

// Add interceptor to rotate keys on 429 (Rate Limit) or 401 (Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response && (error.response.status === 429 || error.response.status === 401)) {
      // Initialize retry count to track how many keys we've tried for this specific request
      originalRequest._retryCount = originalRequest._retryCount || 0;

      // Only retry if we haven't tried all keys yet
      if (originalRequest._retryCount < API_KEYS.length - 1) {
        originalRequest._retryCount++;
        
        // Move to next key
        currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
        console.warn(`API Key exhausted. Switching to key index ${currentKeyIndex}`);
        
        const newKey = API_KEYS[currentKeyIndex];
        
        // Update default params for future requests
        apiClient.defaults.params.token = newKey;
        
        // Update params for this retry
        originalRequest.params.token = newKey;
        
        return apiClient(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

// Cache configuration
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
const CACHE_PREFIX = 'news_app_cache_';

// Helper to get data from cache
const getFromCache = (key) => {
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;

    if (age < CACHE_DURATION) {
      console.log(`[Cache Hit] ${key}`);
      return data;
    } else {
      console.log(`[Cache Expired] ${key}`);
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
  } catch (error) {
    console.error("Cache read error:", error);
    return null;
  }
};

// Helper to save data to cache
const saveToCache = (key, data) => {
  try {
    const cacheItem = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheItem));
  } catch (error) {
    console.error("Cache write error:", error);
  }
};

// Helper to map GNews format to NewsAPI format (to keep UI compatible)
const mapArticles = (articles) => {
  if (!articles) return [];
  return articles.map(article => ({
    ...article,
    // GNews uses 'image', NewsAPI uses 'urlToImage'
    urlToImage: article.image, 
    // GNews source is { name, url }, NewsAPI is { id, name }
    source: { name: article.source.name, url: article.source.url }
  }));
};

// Fetch function for the dashboard (Home)
export const fetchHomeData = async (lang = 'en', forceRefresh = false) => {
  const cacheKey = `home_data_${lang}`;
  
  if (!forceRefresh) {
    const cachedData = getFromCache(cacheKey);
    if (cachedData) return cachedData;
  }

  try {
    // GNews topics: breaking-news, world, nation, business, technology, entertainment, sports, science, health
    const [general, politics, business] = await Promise.all([
      apiClient.get('/top-headlines', { params: { lang, max: 6 } }),
      apiClient.get('/top-headlines', { params: { lang, topic: 'nation', max: 4 } }),
      apiClient.get('/top-headlines', { params: { lang, topic: 'business', max: 4 } })
    ]);

    const data = {
      general: mapArticles(general.data.articles),
      politics: mapArticles(politics.data.articles),
      business: mapArticles(business.data.articles)
    };

    saveToCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Error fetching home data:", error);
    // Return cached data if available even if expired/force refresh failed? 
    // For now, just return null as per original behavior, or maybe stale cache could be a fallback feature.
    return null;
  }
};

// Fetch function for specific categories
export const fetchCategoryData = async (category, lang = 'en', forceRefresh = false) => {
  const cacheKey = `category_${category}_${lang}`;

  if (!forceRefresh) {
    const cachedData = getFromCache(cacheKey);
    if (cachedData) return cachedData;
  }

  // Map categories to GNews topics
  const topicMap = {
    politics: 'nation',
    general: 'breaking-news',
    health: 'health',
    science: 'science',
    sports: 'sports',
    technology: 'technology',
    entertainment: 'entertainment',
    business: 'business'
  };
  
  const topic = topicMap[category.toLowerCase()] || 'breaking-news';

  try {
    const response = await apiClient.get('/top-headlines', { 
      params: { topic, lang, max: 20 } 
    });
    const data = mapArticles(response.data.articles);
    saveToCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error fetching ${category}:`, error);
    return null;
  }
};

// Fetch just the latest headline to check for updates
export const fetchLatestHeadline = async (lang = 'en') => {
  // Short cache for latest headline check (e.g., 2 minutes)
  const cacheKey = `latest_headline_${lang}`;
  const SHORT_CACHE_DURATION = 2 * 60 * 1000;

  try {
    const cached = localStorage.getItem(CACHE_PREFIX + cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < SHORT_CACHE_DURATION) {
        return data;
      }
    }

    const response = await apiClient.get('/top-headlines', { 
      params: { lang, max: 1 } 
    });
    
    if (response.data.articles && response.data.articles.length > 0) {
      const data = response.data.articles[0];
      // Save with short duration logic (manually handled here or just use same saveToCache but ignore standard duration in read)
      // We'll just use saveToCache and rely on the read logic above to check SHORT_CACHE_DURATION
      // Actually saveToCache just saves timestamp. The read logic determines validity.
      // But getFromCache uses global CACHE_DURATION. So we manually read/write here or make getFromCache flexible.
      // Let's just manually write/read for this specific case to keep it simple.
      localStorage.setItem(CACHE_PREFIX + cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
      return data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching latest headline:", error);
    return null;
  }
};
