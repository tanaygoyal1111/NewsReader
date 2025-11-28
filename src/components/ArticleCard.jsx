import React, { useState, useEffect, useRef } from 'react';
import { Share2, Heart, Volume2, StopCircle } from 'lucide-react';
import { addToFavorites, removeFromFavorites, isFavorite } from '../services/db';
import ShareMenu from './ShareMenu';
import { useLanguage } from '../context/LanguageContext';
import placeholderGeneral from '../assets/placeholder-general.png';
import placeholderBusiness from '../assets/placeholder-business.png';
import placeholderPolitics from '../assets/placeholder-politics.png';
import placeholderTechnology from '../assets/placeholder-technology.png';
import placeholderEntertainment from '../assets/placeholder-entertainment.png';
import placeholderSports from '../assets/placeholder-sports.png';
import placeholderScience from '../assets/placeholder-science.png';

const placeholders = {
  general: placeholderGeneral,
  business: placeholderBusiness,
  politics: placeholderPolitics,
  technology: placeholderTechnology,
  entertainment: placeholderEntertainment,
  sports: placeholderSports,
  science: placeholderScience,
  health: placeholderScience,
};

const ArticleCard = ({ article, variant = 'standard', category = 'general' }) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const shareRef = useRef(null);
  const { language } = useLanguage();
  const placeholderImage = placeholders[category.toLowerCase()] || placeholders.general;

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (article.url) {
        const status = await isFavorite(article.url);
        setIsBookmarked(status);
      }
    };
    checkFavoriteStatus();
  }, [article.url]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareRef.current && !shareRef.current.contains(event.target)) {
        setIsShareOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleBookmark = async (e) => {
    e.stopPropagation();
    if (isBookmarked) {
      await removeFromFavorites(article.url);
      setIsBookmarked(false);
    } else {
      await addToFavorites(article);
      setIsBookmarked(true);
    }
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(`${article.title}. ${article.description}`);
      
      let voices = window.speechSynthesis.getVoices();
      
      const selectVoice = () => {
        // Determine target language code based on app language
        // Mapping: 'en' -> 'en-US', 'hi' -> 'hi-IN', etc.
        const langCode = language === 'en' ? 'en-US' : `${language}-IN`;
        utterance.lang = langCode;

        // Filter voices for the active language
        const availableVoices = voices.filter(v => v.lang.includes(language));
        
        let bestVoice;

        if (language === 'en') {
          // English Priority: Ava (User Preference) -> Google -> Microsoft -> Samantha
          bestVoice = availableVoices.find(v => v.name.includes('Ava'))
                   || availableVoices.find(v => v.name.includes('Google US English'))
                   || availableVoices.find(v => v.name.includes('Samantha'))
                   || availableVoices[0];
        } else if (language === 'hi') {
          // Hindi Priority: Kyra/Kiyara (User Preference) -> Lekha -> Google
          bestVoice = availableVoices.find(v => v.name.includes('Kiyara'))
                   || availableVoices.find(v => v.name.includes('Kyra'))
                   || availableVoices.find(v => v.name.includes('Lekha'))
                   || availableVoices.find(v => v.name.includes('Google'))
                   || availableVoices[0];
        } else {
          // Other languages: Default to first available
          bestVoice = availableVoices[0];
        }

        if (bestVoice) {
          utterance.voice = bestVoice;
        }
      };

      if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          voices = window.speechSynthesis.getVoices();
          selectVoice();
          window.speechSynthesis.speak(utterance);
        };
      } else {
        selectVoice();
      }

      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };
  
  // Stop speaking if component unmounts
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const diff = Math.floor((new Date() - date) / 1000 / 60);
    if (diff < 60) return `${diff} MINS AGO`;
    return `${Math.floor(diff / 60)} HRS AGO`;
  };

  const handleCardClick = () => {
    if (article.url) {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };

  // 1. HERO VARIANT
  if (variant === 'hero') {
    return (
      <div className="group cursor-pointer" onClick={handleCardClick}>
        <div className="relative overflow-hidden mb-4">
          <img 
            src={article.urlToImage || placeholderImage} 
            alt={article.title} 
            className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => e.target.src = placeholderImage}
          />
          <div className="absolute bottom-0 left-0 bg-red-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-widest">
            Top Story
          </div>
        </div>
        <div className="text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold font-serif leading-tight mb-4 group-hover:text-red-700 transition-colors">
            {article.title}
          </h2>
          <p className="text-xl text-slate-600 font-serif leading-relaxed mb-4">
            {article.description}
          </p>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex justify-center gap-2 items-center font-sans">
            <span className="text-red-600">{article.source.name}</span>
            <span>•</span>
            <span>{timeAgo(article.publishedAt)}</span>
          </div>
        </div>
        <div className="w-24 h-1 bg-black mx-auto mt-8 mb-8"></div>
      </div>
    );
  }

  // 2. COMPACT VARIANT (Sidebar)
  if (variant === 'compact') {
    return (
      <div className="border-b border-slate-200 py-4 group cursor-pointer hover:bg-slate-50 transition-colors px-2" onClick={handleCardClick}>
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider font-sans">
            {article.source.name}
          </span>
          <span className="text-xs text-slate-400 font-sans">{timeAgo(article.publishedAt)}</span>
        </div>
        <h3 className="text-lg font-bold font-serif leading-snug group-hover:text-red-700">
          {article.title}
        </h3>
      </div>
    );
  }

  // 3. STANDARD VARIANT
  return (
    <div className="flex flex-col h-full group cursor-pointer border border-slate-200 hover:shadow-lg transition-shadow bg-white" onClick={handleCardClick}>
      <div className="h-48 overflow-hidden relative">
         <img 
            src={article.urlToImage || placeholderImage} 
            alt={article.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => e.target.src = placeholderImage}
          />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-2 flex items-center gap-2">
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
                {article.source.name}
            </span>
        </div>
        <h3 className="text-xl font-bold font-serif leading-tight mb-2 group-hover:text-red-700 transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-slate-600 font-serif leading-relaxed mb-4 line-clamp-3">
          {article.description}
        </p>
        <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center text-slate-400">
          <span className="text-xs font-sans">{timeAgo(article.publishedAt)}</span>
          <div className="flex items-center gap-3">
             <button
              onClick={(e) => {
                e.stopPropagation();
                isSpeaking ? handleStop() : handleSpeak();
              }}
              className="hover:text-black transition-colors"
             >
               {isSpeaking ? <StopCircle className="w-4 h-4 text-red-600" /> : <Volume2 className="w-4 h-4" />}
             </button>
             <Heart 
              className={`w-4 h-4 cursor-pointer transition-colors ${isBookmarked ? 'fill-red-600 text-red-600' : 'hover:text-black'}`}
              onClick={toggleBookmark}
            />
            <div className="relative" ref={shareRef}>
              <Share2 
                className={`w-4 h-4 hover:text-black cursor-pointer transition-colors ${isShareOpen ? 'text-black' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsShareOpen(!isShareOpen);
                }}
              />
              {isShareOpen && (
                <ShareMenu article={article} onClose={() => setIsShareOpen(false)} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;