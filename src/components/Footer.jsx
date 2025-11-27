import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-12 border-t-8 border-red-600 mt-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Brand & Copyright */}
        <div className="text-center md:text-left">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <h2 className="text-3xl font-serif font-bold mb-2">POLITICO</h2>
          </Link>
          <p className="text-slate-400 text-sm">
            © {currentYear} POLITICO LLC. All rights reserved.
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-6">
          <a 
            href="https://twitter.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition-colors transform hover:scale-110"
            aria-label="Twitter"
          >
            <Twitter className="w-6 h-6" />
          </a>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition-colors transform hover:scale-110"
            aria-label="Instagram"
          >
            <Instagram className="w-6 h-6" />
          </a>
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition-colors transform hover:scale-110"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-6 h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
