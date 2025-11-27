import React, { useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Search, Menu, X, Globe, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  // const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, languages } = useLanguage();

  const handleSearch = (e) => {
    const term = e.target.value;
    if (term) {
      setSearchParams({ ...Object.fromEntries(searchParams), search: term });
    } else {
      const newParams = Object.fromEntries(searchParams);
      delete newParams.search;
      setSearchParams(newParams);
    }
  };

  const isActive = (path) => location.pathname.includes(path);

  const categories = [
    { id: 'politics', name: 'Politics' },
    { id: 'business', name: 'Business' },
    { id: 'technology', name: 'Tech' },
    { id: 'science', name: 'Science' },
    { id: 'health', name: 'Health' },
    { id: 'sports', name: 'Sports' },
    { id: 'entertainment', name: 'Entertainment' },
  ];

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white py-1 px-4 text-xs font-bold tracking-widest flex justify-between items-center">
        <span>{currentDate}</span>
        <div className="flex items-center gap-4">
            <span>TRENDING NOW</span>
            <div className="flex items-center gap-2">
                <Globe className="w-3 h-3" />
                <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-slate-800 text-white border-none text-xs focus:ring-0 cursor-pointer"
                >
                    {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>

          <Link to="/" className="text-4xl md:text-6xl font-black tracking-tighter cursor-pointer font-serif text-center flex-grow md:flex-grow-0 hover:text-slate-900">
            POLITICO<span className="text-red-600">.</span>
          </Link>

          <div className="flex items-center gap-4">
            {isSearchOpen && (
              <input
                type="text"
                placeholder="Search news..."
                className="border border-slate-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:border-red-600 transition-all"
                value={searchParams.get('search') || ''}
                onChange={handleSearch}
                autoFocus
              />
            )}
            <button 
              className="p-2 hover:bg-slate-100 rounded-full"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>
            <Link to="/favorites" className="p-2 hover:bg-slate-100 rounded-full text-slate-900">
              <Heart className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <nav className="hidden md:flex justify-center gap-8 mt-6 border-t border-slate-200 pt-3 text-sm font-bold tracking-widest text-slate-700 font-sans">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className={`uppercase hover:text-red-600 transition-colors pb-2 border-b-2 ${
                isActive(cat.id) ? 'border-red-600 text-red-600' : 'border-transparent'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>

      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl p-4 md:hidden flex flex-col gap-4 font-bold font-sans">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-left uppercase p-2 border-l-4 border-black bg-slate-50">
            Home
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              onClick={() => setIsMenuOpen(false)}
              className="text-left uppercase p-2 hover:bg-slate-50 border-l-4 border-transparent hover:border-red-600"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;