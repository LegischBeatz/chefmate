
import React from 'react';
import { ViewState } from '../types';

interface FooterProps {
  onNavigate: (view: ViewState) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white py-12 border-t border-gray-100 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-chef-dark text-sm mb-4 md:mb-0">© 2024 ChefMate AI. All rights reserved.</p>
        <div className="flex flex-wrap justify-center space-x-6 md:space-x-8">
          <button onClick={() => onNavigate('pricing')} className="text-chef-dark hover:text-chef-black text-sm transition-colors">Pricing</button>
          <button onClick={() => onNavigate('about')} className="text-chef-dark hover:text-chef-black text-sm transition-colors">About</button>
          <button onClick={() => onNavigate('impressum')} className="text-chef-dark hover:text-chef-black text-sm transition-colors">Impressum</button>
          <button onClick={() => onNavigate('privacy')} className="text-chef-dark hover:text-chef-black text-sm transition-colors">Privacy</button>
          <button onClick={() => onNavigate('terms')} className="text-chef-dark hover:text-chef-black text-sm transition-colors">Terms</button>
          <button onClick={() => onNavigate('contact')} className="text-chef-dark hover:text-chef-black text-sm transition-colors">Contact</button>
        </div>
      </div>
    </footer>
  );
};
