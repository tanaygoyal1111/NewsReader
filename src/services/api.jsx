import axios from 'axios';

const API_KEY = "738a87defb0e42c0c4eedfc56501992b";
const BASE_URL = "https://news-gnews-proxy.goyaltanay-1111.workers.dev";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    token: API_KEY,
  }
});

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
  try {
    // GNews topics: breaking-news, world, nation, business, technology, entertainment, sports, science, health
    const [general, politics, business] = await Promise.all([
      apiClient.get('/top-headlines', { params: { lang, max: 6 } }),
      apiClient.get('/top-headlines', { params: { lang, topic: 'nation', max: 4 } }),
      apiClient.get('/top-headlines', { params: { lang, topic: 'business', max: 4 } })
    ]);

    return {
      general: mapArticles(general.data.articles),
      politics: mapArticles(politics.data.articles),
      business: mapArticles(business.data.articles)
    };
  } catch (error) {
    console.error("Error fetching home data:", error);
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
    return mapArticles(response.data.articles);
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
