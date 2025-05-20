import { useState, useEffect, useCallback } from 'react';
import { likePlant, unlikePlant, isPlantLiked, getPlantLikesCount } from '../services/localStorageLikesService';

/**
 * Hook for managing plant likes/unlikes using local storage
 */
const usePlantLikes = (plantId: string) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Check if the plant is already liked when component mounts
  useEffect(() => {
    if (!plantId) return;
    
    const checkIfLiked = () => {
      try {
        // Check if plant is liked in local storage
        const liked = isPlantLiked(plantId);
        setIsLiked(liked);
        
        // Get the current likes count
        const count = getPlantLikesCount(plantId);
        setLikesCount(count);
      } catch (error) {
        console.error('Error checking if plant is liked:', error);
      }
    };
    
    checkIfLiked();
  }, [plantId]);

  // Toggle like status
  const toggleLike = useCallback(() => {
    if (!plantId || isLoading) return;
    
    setIsLoading(true);
    try {
      let success;
      
      if (isLiked) {
        // Unlike the plant
        success = unlikePlant(plantId);
        if (success) {
          setIsLiked(false);
          setLikesCount(prev => Math.max(0, prev - 1));
        }
      } else {
        // Like the plant
        success = likePlant(plantId);
        if (success) {
          setIsLiked(true);
          setLikesCount(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Error toggling plant like:', error);
    } finally {
      setIsLoading(false);
    }
  }, [plantId, isLiked, isLoading]);

  return {
    isLiked,
    likesCount,
    isLoading,
    toggleLike
  };
};

export default usePlantLikes;
