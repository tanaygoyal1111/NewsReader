import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/ToastContainer';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Category from './pages/Category';
import Favorites from './pages/Favorites';
import OfflineNotice from './components/OfflineNotice';

function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <Router>
        <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
          <OfflineNotice />
          <ToastContainer />

          <Header />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/category/:id" element={<Category />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </div>
          <Footer />
        </div>
        </Router>
      </ToastProvider>
    </LanguageProvider>
  );
}

export default App;