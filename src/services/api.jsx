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
export const fetchHomeData = async (lang = 'en') => {


  try{
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


    return data;
  } catch (error) {
    console.error("Error fetching home data:", error);
    // Return cached data if available even if expired/force refresh failed? 
    // For now, just return null as per original behavior, or maybe stale cache could be a fallback feature.
    return null;
  }
};

// Fetch function for specific categories
export const fetchCategoryData = async (category, lang = 'en') => {


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

    return data;
  } catch (error) {
    console.error(`Error fetching ${category}:`, error);
    return null;
  }
};

// Fetch just the latest headline to check for updates
export const fetchLatestHeadline = async (lang = 'en') => {
  try {
    const response = await apiClient.get('/top-headlines', { 
      params: { lang, max: 1 } 
    });
    
    if (response.data.articles && response.data.articles.length > 0) {
      return response.data.articles[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching latest headline:", error);
    return null;
  }
};
