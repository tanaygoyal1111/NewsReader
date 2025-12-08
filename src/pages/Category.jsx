import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { fetchCategoryData } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import Loader from '../components/Loader';
import PullToRefresh from '../components/PullToRefresh';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';

const Category = () => {
  const { id } = useParams(); // Matches route /category/:id
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search')?.toLowerCase() || '';
  const { language } = useLanguage();
  const { addToast } = useToast();

  const load = async () => {
    setLoading(true);
    window.scrollTo(0, 0);
    const result = await fetchCategoryData(id, language);
    if (result) {
      setArticles(result);
    } else {
      addToast(`Failed to load ${id} news.`, "error");
    }
    // Wait for 2 seconds before hiding loader
    await new Promise(resolve => setTimeout(resolve, 300));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [id, language]);

  const handleRefresh = async () => {
    setLoading(true);
    const result = await fetchCategoryData(id, language, true);
    if (result) {
      setArticles(result);
    }
    setLoading(false);
  };

  if (loading) return <Loader />;

  const filteredArticles = searchTerm 
    ? articles.filter(article => 
        article.title?.toLowerCase().includes(searchTerm) ||
        article.description?.toLowerCase().includes(searchTerm)
      )
    : articles;

  if (searchTerm && filteredArticles.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 text-center border-b border-slate-200 pb-8">
          <h2 className="text-5xl font-black font-serif uppercase tracking-tight mb-2">
            {id}
          </h2>
        </div>
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">No search found</h2>
          <p className="text-slate-500">We couldn't find any articles matching "{searchTerm}" in {id}</p>
        </div>
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 text-center border-b border-slate-200 pb-8">
          <h2 className="text-5xl font-black font-serif uppercase tracking-tight mb-2">
            {id}
          </h2>
          <p className="text-slate-500 font-serif text-lg">
            The latest news and analysis from our {id} desk.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredArticles.map((article, idx) => (
            <ArticleCard key={idx} article={article} variant="standard" category={id} />
          ))}
        </div>
      </div>
    </PullToRefresh>
  );
};

export default Category;