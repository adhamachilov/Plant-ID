import React from 'react';
import { Heart } from 'lucide-react';
import usePlantLikes from '../hooks/usePlantLikes';

interface PlantLikeButtonProps {
  plantId: string;
  className?: string;
}

/**
 * A reusable like button component for plants
 */
const PlantLikeButton: React.FC<PlantLikeButtonProps> = ({ plantId, className = '' }) => {
  const { isLiked, likesCount, isLoading, toggleLike } = usePlantLikes(plantId);
  
  // Handle like button click
  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike();
  };
  
  return (
    <button
      onClick={handleLikeClick}
      disabled={isLoading}
      className={`${className} relative flex items-center justify-center gap-2 transition-all duration-300`}
      aria-label={isLiked ? "Unlike this plant" : "Like this plant"}
    >
      <Heart 
        className={`w-6 h-6 ${isLiked ? 'fill-current text-red-500' : ''} transition-all duration-300`} 
      />
      
      <span>{isLiked ? 'Liked' : 'Like'}</span>
      
      {likesCount > 0 && (
        <span className="ml-1 text-sm bg-emerald-600/40 px-1.5 py-0.5 rounded-full">
          {likesCount}
        </span>
      )}
      
      {/* Animation when liking */}
      {isLiked && (
        <span className="absolute inset-0 rounded-lg animate-ping-once bg-red-100/10 opacity-75"></span>
      )}
    </button>
  );
};

export default PlantLikeButton;
