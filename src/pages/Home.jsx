import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchHomeData, fetchLatestHeadline } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import SectionHeader from '../components/SectionHeader';
import Loader from '../components/Loader';
import NotificationToast from '../components/NotificationToast';

import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';



import PullToRefresh from '../components/PullToRefresh';

const Home = () => {
  const [data, setData] = useState({ general: [], politics: [], business: [] });
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [latestArticleTime, setLatestArticleTime] = useState(null);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search')?.toLowerCase() || '';
  const { language } = useLanguage();
  const { addToast } = useToast();


  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const result = await fetchHomeData(language);
      if (result) {
        setData(result);
        if (result.general && result.general.length > 0) {
          setLatestArticleTime(result.general[0].publishedAt);
        }
      } else {
        // Fallback or Mock data logic here if desired
        console.log("Failed to load or using mock");
        addToast("Failed to load news. Please check your connection.", "error");
      }
      // Wait for 2 seconds before hiding loader
    await new Promise(resolve => setTimeout(resolve, 300));
      setLoading(false);
    };
    load();
  }, [language]); // Reload when language changes

  // Polling for new articles
  useEffect(() => {
    if (!latestArticleTime) return;

    const intervalId = setInterval(async () => {
      const latest = await fetchLatestHeadline(language);
      if (latest && latest.publishedAt !== latestArticleTime) {
        // Simple check: if timestamps differ, assume new content
        // In a real app, you might compare dates more strictly (new > old)
        if (new Date(latest.publishedAt) > new Date(latestArticleTime)) {
            setShowNotification(true);
        }
      }
    }, 15 * 60 * 1000); // Check every 15 minutes

    return () => clearInterval(intervalId);
  }, [latestArticleTime, language]);

  if (loading) return <Loader />;

  const handleRefresh = async () => {
    setLoading(true);
    const result = await fetchHomeData(language);
    if (result) {
      setData(result);
      if (result.general && result.general.length > 0) {
        setLatestArticleTime(result.general[0].publishedAt);
      }
      setShowNotification(false);
    }
    setLoading(false);
  };

  const filterArticles = (articles) => {
    if (!searchTerm) return articles;
    return articles.filter(article => 
      article.title?.toLowerCase().includes(searchTerm) ||
      article.description?.toLowerCase().includes(searchTerm)
    );
  };

  const filteredGeneral = filterArticles(data.general);
  const filteredPolitics = filterArticles(data.politics);
  const filteredBusiness = filterArticles(data.business);

  const hasResults = filteredGeneral.length > 0 || filteredPolitics.length > 0 || filteredBusiness.length > 0;

  if (searchTerm && !hasResults) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">No search found</h2>
        <p className="text-slate-500">We couldn't find any articles matching "{searchTerm}"</p>
      </div>
    );
  }



  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <main className="container mx-auto px-4 py-8 relative">
        {showNotification && (
          <NotificationToast 
            onRefresh={handleRefresh} 
            onClose={() => setShowNotification(false)} 
          />
        )}
        
        {/* Top Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-8">
            {filteredGeneral[0] && <ArticleCard article={filteredGeneral[0]} variant="hero" category="general" />}
          </div>
          <div className="lg:col-span-4 pl-0 lg:pl-8 lg:border-l border-slate-200">
            <h4 className="font-bold text-sm tracking-widest uppercase text-slate-500 mb-4 border-b border-slate-200 pb-2">
              Top Headlines
            </h4>
            <div className="flex flex-col">
              {filteredGeneral.slice(1, 6).map((article, idx) => (
                <ArticleCard key={idx} article={article} variant="compact" category="general" />
              ))}
            </div>
          </div>
        </section>

        {/* Politics Section */}
        <SectionHeader title="Politics & Policy" linkTo="/category/politics" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPolitics.map((article, idx) => (
            <ArticleCard key={idx} article={article} variant="standard" category="politics" />
          ))}
        </div>

        {/* Business Section */}
        <SectionHeader title="Business & Markets" linkTo="/category/business" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBusiness.map((article, idx) => (
            <ArticleCard key={idx} article={article} variant="standard" category="business" />
          ))}
        </div>
      </main>
    </PullToRefresh>
  );
};

export default Home;