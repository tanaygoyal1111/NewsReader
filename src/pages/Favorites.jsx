import React, { useState, useEffect } from 'react';
import { getFavorites } from '../services/db';
import ArticleCard from '../components/ArticleCard';
import SectionHeader from '../components/SectionHeader';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const savedArticles = await getFavorites();
        setFavorites(savedArticles);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionHeader title="My Favorites" />
      
      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading favorites...</div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-slate-500 mb-4">No favorites yet.</p>
          <p className="text-slate-400">Bookmark articles to see them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((article, index) => (
            <ArticleCard key={index} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
