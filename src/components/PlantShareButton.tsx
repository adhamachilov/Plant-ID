import React from 'react';
import { Share2 } from 'lucide-react';

interface PlantShareButtonProps {
  plant?: {
    id: string;
    name: string;
    scientificName?: string;
  };
  plantId?: string;
  plantName?: string;
  scientificName?: string;
  className?: string;
}

/**
 * A reusable share button component for plants that uses the native system share sheet
 * Can be used with either a plant object or individual plantId/plantName props
 */
const PlantShareButton: React.FC<PlantShareButtonProps> = ({ 
  plant, 
  plantId, 
  plantName, 
  scientificName, 
  className = '' 
}) => {
  // Get plant information from either the plant object or individual props
  const id = plant?.id || plantId || '';
  const name = plant?.name || plantName || 'this plant';
  const scientific = plant?.scientificName || scientificName || '';
  
  // Create share URL and text
  const shareUrl = `${window.location.origin}/plants/${id}`;
  const shareTitle = `Check out this ${name}${scientific ? ` (${scientific})` : ''} I found on PlantID!`;
  
  // Use the Web Share API to open the native share dialog
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if Web Share API is supported
    if (navigator.share) {
      navigator.share({
        title: name,
        text: shareTitle,
        url: shareUrl,
      })
      .catch(error => {
        console.error('Error sharing:', error);
        // Fallback to copying to clipboard if sharing fails
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert('Link copied to clipboard!');
        });
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Link copied to clipboard!');
      });
    }
  };
  
  return (
    <button
      onClick={handleShare}
      className={`${className} flex items-center justify-center gap-2 transition-all duration-300`}
      aria-label="Share this plant"
    >
      <Share2 className="w-6 h-6" />
      <span>Share</span>
    </button>
  );
};

export default PlantShareButton;
