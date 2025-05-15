import React from 'react';
import { EmailIcon } from './ContactIcons';

const SocialIcons: React.FC = () => {
  // Only showing email icon centered
  return (
    <div
      className="flex justify-center py-4 opacity-0 animate-fadeIn"
      style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}
    >
      <a
        href="mailto:adhamachilovusa@gmail.com"
        target="_blank"
        rel="noopener noreferrer"
        className="group opacity-0 animate-fadeIn hover:scale-110 transition-transform animate-float"
        style={{ 
          animationDelay: `0.9s`, 
          animationFillMode: 'forwards',
          transformOrigin: 'center'
        }}
      >
        <div className="w-20 h-20 rounded-full bg-emerald-600 flex items-center justify-center shadow-lg group-hover:bg-emerald-500 transition-colors duration-300 ring-1 ring-emerald-400/30">
          <EmailIcon className="w-10 h-10 text-white" />
        </div>
        <div className="text-center mt-2 text-emerald-300 font-medium text-sm">
          Contact Us
        </div>
      </a>
    </div>
  );
};

export default SocialIcons;
