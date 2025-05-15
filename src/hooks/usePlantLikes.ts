import { useState, useEffect, useCallback } from 'react';
import { likePlant, unlikePlant, isPlantLiked } from '../services/supabasePlantService';
import useDeviceId from './useDeviceId';

/**
 * Hook for managing plant likes/unlikes
 */
export const usePlantLikes = (plantId: string) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const deviceId = useDeviceId();

  // Check if the plant is already liked when component mounts
  useEffect(() => {
    if (!deviceId || !plantId) return;
    
    const checkIfLiked = async () => {
      try {
        const liked = await isPlantLiked(plantId, deviceId);
        setIsLiked(liked);
      } catch (error) {
        console.error('Error checking if plant is liked:', error);
      }
    };
    
    checkIfLiked();
  }, [deviceId, plantId]);

  // Toggle like status
  const toggleLike = useCallback(async () => {
    if (!deviceId || !plantId || isLoading) return;
    
    setIsLoading(true);
    try {
      let success;
      
      if (isLiked) {
        // Unlike the plant
        success = await unlikePlant(plantId, deviceId);
        if (success) {
          setIsLiked(false);
          setLikesCount(prev => Math.max(0, prev - 1));
        }
      } else {
        // Like the plant
        success = await likePlant(plantId, deviceId);
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
  }, [deviceId, plantId, isLiked, isLoading]);

  return {
    isLiked,
    likesCount,
    isLoading,
    toggleLike
  };
};

export default usePlantLikes;
