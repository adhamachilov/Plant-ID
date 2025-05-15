import React, { useState } from 'react';
import { Share2, Copy, Check, Twitter, Facebook, Linkedin } from 'lucide-react';

interface PlantShareButtonProps {
  plant: {
    id: string;
    name: string;
    scientificName: string;
  };
  className?: string;
}

/**
 * A reusable share button component for plants with share options
 */
const PlantShareButton: React.FC<PlantShareButtonProps> = ({ plant, className = '' }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Create share URL
  const shareUrl = `${window.location.origin}/plants/${plant.id}`;
  const shareTitle = `Check out this ${plant.name} (${plant.scientificName}) I found on PlantID!`;
  
  // Copy to clipboard
  const copyToClipboard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  // Share on social media
  const shareOnTwitter = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank');
  };
  
  const shareOnFacebook = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };
  
  const shareOnLinkedIn = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };
  
  // Toggle share options
  const toggleOptions = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowOptions(prev => !prev);
  };
  
  return (
    <div className="relative">
      <button
        onClick={toggleOptions}
        className={`${className} flex items-center justify-center gap-2 transition-all duration-300`}
        aria-label="Share this plant"
      >
        <Share2 className="w-5 h-5" />
        <span>Share</span>
      </button>
      
      {/* Share options dropdown */}
      {showOptions && (
        <div className="absolute z-50 top-full mt-2 right-0 bg-emerald-950 border border-emerald-800 rounded-lg shadow-xl p-3 min-w-[200px] animate-fadeIn">
          <div className="flex flex-col space-y-2">
            <button 
              onClick={copyToClipboard}
              className="flex items-center space-x-2 p-2 hover:bg-emerald-900 rounded-md transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
            
            <div className="border-t border-emerald-800 my-1 pt-1">
              <p className="text-xs text-emerald-400 mb-2">Share on:</p>
              <div className="flex justify-between">
                <button 
                  onClick={shareOnTwitter}
                  className="flex items-center justify-center bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 p-2 rounded-md transition-colors w-10 h-10"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                </button>
                
                <button 
                  onClick={shareOnFacebook}
                  className="flex items-center justify-center bg-[#4267B2]/10 hover:bg-[#4267B2]/20 p-2 rounded-md transition-colors w-10 h-10"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-5 h-5 text-[#4267B2]" />
                </button>
                
                <button 
                  onClick={shareOnLinkedIn}
                  className="flex items-center justify-center bg-[#0077B5]/10 hover:bg-[#0077B5]/20 p-2 rounded-md transition-colors w-10 h-10"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-[#0077B5]" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Close overlay when clicking outside */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={toggleOptions}
            style={{ display: showOptions ? 'block' : 'none' }}
          />
        </div>
      )}
    </div>
  );
};

export default PlantShareButton;
