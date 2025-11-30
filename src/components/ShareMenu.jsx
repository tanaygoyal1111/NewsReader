import React, { useState } from 'react';
import { Copy, Twitter, Linkedin, Facebook, MessageCircle, Check } from 'lucide-react';

const ShareMenu = ({ article, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = article.url;
  const shareText = article.title;
  

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        onClose();
      }, 800);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const openSocial = (url) => {
    window.open(url, '_blank', 'width=600,height=400');
    onClose();
  };

  const shareLinks = [
    {
      name: copied ? 'Copied!' : 'Copy Link',
      icon: copied ? Check : Copy,
      action: handleCopy,
      color: copied ? 'text-green-600' : 'text-slate-600',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      action: () => openSocial(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`),
      color: 'text-blue-400',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      action: () => openSocial(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`),
      color: 'text-green-500',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      action: () => openSocial(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`),
      color: 'text-blue-700',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      action: () => openSocial(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`),
      color: 'text-blue-600',
    },
  ];

  return (
    <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
      <div className="py-1">
        {shareLinks.map((item, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              item.action();
            }}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left group"
          >
            <item.icon className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform`} />
            <span className="text-sm font-medium text-slate-700">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShareMenu;
