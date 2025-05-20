/**
 * Local storage-based service for managing plant likes
 */

// Constants for localStorage keys
const LIKED_PLANTS_KEY = 'plantId_liked_plants';
const LIKES_COUNT_KEY = 'plantId_likes_count';

/**
 * Check if a plant is liked by the current user
 * @param plantId The ID of the plant to check
 * @returns True if the plant is liked, false otherwise
 */
export const isPlantLiked = (plantId: string): boolean => {
  try {
    const likedPlants = getLikedPlants();
    return likedPlants.includes(plantId);
  } catch (error) {
    console.error('Error checking if plant is liked:', error);
    return false;
  }
};

/**
 * Like a plant
 * @param plantId The ID of the plant to like
 * @returns True if the operation was successful
 */
export const likePlant = (plantId: string): boolean => {
  try {
    const likedPlants = getLikedPlants();
    
    if (!likedPlants.includes(plantId)) {
      likedPlants.push(plantId);
      localStorage.setItem(LIKED_PLANTS_KEY, JSON.stringify(likedPlants));
      
      // Increment likes count for this plant
      const likesCount = getPlantLikesCount(plantId);
      setPlantLikesCount(plantId, likesCount + 1);
    }
    
    return true;
  } catch (error) {
    console.error('Error liking plant:', error);
    return false;
  }
};

/**
 * Unlike a plant
 * @param plantId The ID of the plant to unlike
 * @returns True if the operation was successful
 */
export const unlikePlant = (plantId: string): boolean => {
  try {
    const likedPlants = getLikedPlants();
    const plantIndex = likedPlants.indexOf(plantId);
    
    if (plantIndex !== -1) {
      likedPlants.splice(plantIndex, 1);
      localStorage.setItem(LIKED_PLANTS_KEY, JSON.stringify(likedPlants));
      
      // Decrement likes count for this plant
      const likesCount = getPlantLikesCount(plantId);
      setPlantLikesCount(plantId, Math.max(0, likesCount - 1));
    }
    
    return true;
  } catch (error) {
    console.error('Error unliking plant:', error);
    return false;
  }
};

/**
 * Get all liked plants from localStorage
 * @returns Array of plant IDs that are liked
 */
export const getLikedPlants = (): string[] => {
  try {
    const likedPlants = localStorage.getItem(LIKED_PLANTS_KEY);
    return likedPlants ? JSON.parse(likedPlants) : [];
  } catch (error) {
    console.error('Error getting liked plants:', error);
    return [];
  }
};

/**
 * Get the number of likes for a specific plant
 * @param plantId The ID of the plant
 * @returns The number of likes for the plant
 */
export const getPlantLikesCount = (plantId: string): number => {
  try {
    const likesCountMap = getLikesCountMap();
    return likesCountMap[plantId] || 0;
  } catch (error) {
    console.error('Error getting plant likes count:', error);
    return 0;
  }
};

/**
 * Set the number of likes for a specific plant
 * @param plantId The ID of the plant
 * @param count The new like count
 */
export const setPlantLikesCount = (plantId: string, count: number): void => {
  try {
    const likesCountMap = getLikesCountMap();
    likesCountMap[plantId] = count;
    localStorage.setItem(LIKES_COUNT_KEY, JSON.stringify(likesCountMap));
  } catch (error) {
    console.error('Error setting plant likes count:', error);
  }
};

/**
 * Get the likes count map from localStorage
 * @returns Map of plant IDs to their like counts
 */
export const getLikesCountMap = (): Record<string, number> => {
  try {
    const likesCountMap = localStorage.getItem(LIKES_COUNT_KEY);
    return likesCountMap ? JSON.parse(likesCountMap) : {};
  } catch (error) {
    console.error('Error getting likes count map:', error);
    return {};
  }
};
