import { supabase, isSupabaseConfigured } from './supabaseClient';
import { PlantInfo } from '../components/PlantCard';
import { v4 as uuidv4 } from 'uuid';
import { analyzeImageWithGemini } from './geminiService';

// Fallback to the original service if Supabase is not configured
import * as originalPlantService from './plantServiceUpdated';

/**
 * Converts a Supabase plant row to our application's PlantInfo type
 */
const convertToPlantInfo = async (plantRow: any): Promise<PlantInfo> => {
  // Get care instructions for this plant
  const { data: careData } = await supabase
    .from('plant_care_instructions')
    .select('*')
    .eq('plant_id', plantRow.id)
    .single();
  
  // Get facts for this plant
  const { data: factsData } = await supabase
    .from('plant_facts')
    .select('fact')
    .eq('plant_id', plantRow.id);
  
  const facts = factsData ? factsData.map(item => item.fact) : [];

  return {
    id: plantRow.id,
    name: plantRow.name,
    scientificName: plantRow.scientific_name,
    image: plantRow.image_url,
    wateringNeeds: plantRow.watering_needs,
    sunlight: plantRow.sunlight,
    temperature: plantRow.temperature,
    description: plantRow.description,
    careInstructions: careData ? {
      watering: careData.watering,
      light: careData.light,
      soil: careData.soil,
      humidity: careData.humidity,
      fertilizing: careData.fertilizing
    } : undefined,
    facts: facts.length > 0 ? facts : undefined
  };
};

/**
 * Identifies a plant from an image using Gemini API and stores results in Supabase
 */
export const identifyPlant = async (imageUrl: string): Promise<PlantInfo> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, using original plant service');
    return originalPlantService.identifyPlant(imageUrl);
  }

  try {
    console.log("Starting plant identification process with Supabase integration...");
    
    // Send the image to the Gemini API for analysis
    const geminiResponse = await analyzeImageWithGemini(imageUrl);
    console.log("Received response from Gemini API");
    
    // Parse the JSON response from Gemini (reusing existing logic)
    let plantData: any;
    try {
      // First, check if the response contains a JSON string embedded in code blocks
      const jsonMatch = geminiResponse.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        console.log("JSON code block found in response, extracting content");
        plantData = JSON.parse(jsonMatch[1].trim());
      } else {
        // If no code block, try parsing the entire response as JSON
        plantData = JSON.parse(geminiResponse);
      }
      
      console.log("Successfully parsed JSON:", plantData);
    } catch (parseError: any) {
      console.error('Failed to parse Gemini response as JSON:', parseError);
      throw new Error(`Invalid JSON response: ${parseError.message}`);
    }
    
    // Generate a unique ID for the plant
    const plantId = plantData.scientificName 
      ? plantData.scientificName.toLowerCase().replace(/\s+/g, '-') 
      : `plant-${uuidv4().slice(0, 8)}`;
    
    // Check if this plant already exists in our database
    const { data: existingPlant } = await supabase
      .from('plants')
      .select('*')
      .eq('id', plantId)
      .single();
    
    // Generate care instructions based on the plant's needs
    const careInstructions = originalPlantService.generateCareInstructions(
      plantData.name,
      plantData.wateringNeeds,
      plantData.sunlight,
      plantData.temperature,
      plantData.description
    );
    
    // Extract facts from the description if possible
    const facts = originalPlantService.extractFactsFromDescription(plantData.description);
    
    // If the plant doesn't exist, add it to the database
    if (!existingPlant) {
      // Insert plant base information
      const { error: plantError } = await supabase
        .from('plants')
        .insert({
          id: plantId,
          name: plantData.name || 'Unknown Plant',
          scientific_name: plantData.scientificName || 'Species unknown',
          image_url: imageUrl,
          watering_needs: plantData.wateringNeeds || 'medium',
          sunlight: plantData.sunlight || 'medium',
          temperature: plantData.temperature || '65-75°F',
          likes_count: 0,
          description: originalPlantService.cleanDescription(plantData.description) || 'No description available.'
        });
      
      if (plantError) {
        console.error('Error inserting plant:', plantError);
        throw plantError;
      }
      
      // Insert care instructions
      await supabase
        .from('plant_care_instructions')
        .insert({
          plant_id: plantId,
          watering: careInstructions.watering,
          light: careInstructions.light,
          soil: careInstructions.soil,
          humidity: careInstructions.humidity,
          fertilizing: careInstructions.fertilizing
        });
      
      // Insert facts
      const factsToInsert = facts.map(fact => ({
        plant_id: plantId,
        fact: fact
      }));
      
      await supabase
        .from('plant_facts')
        .insert(factsToInsert);
    }
    
    // Record the identification in the history
    await supabase
      .from('identification_history')
      .insert({
        image_url: imageUrl,
        identified_plant_id: plantId
      });
    
    // Create a plant info object with the data
    const identifiedPlant: PlantInfo = {
      id: plantId,
      name: plantData.name || 'Unknown Plant',
      scientificName: plantData.scientificName || 'Species unknown',
      image: imageUrl,
      wateringNeeds: plantData.wateringNeeds || 'medium',
      sunlight: plantData.sunlight || 'medium',
      temperature: plantData.temperature || '65-75°F',
      description: originalPlantService.cleanDescription(plantData.description) || 'No description available.',
      careInstructions: careInstructions,
      facts: facts
    };
    
    console.log("Final identified plant object with Supabase:", identifiedPlant);
    
    return identifiedPlant;
  } catch (error) {
    console.error('Error identifying plant with Supabase:', error);
    
    // Fallback to the original service's error handling
    return originalPlantService.handleIdentificationError(imageUrl);
  }
};

/**
 * Gets all plants from the database
 */
export const getAllPlants = async (): Promise<PlantInfo[]> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, using original plant service');
    return originalPlantService.getAllPlants();
  }

  try {
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    
    // Convert to PlantInfo objects
    const plants = await Promise.all(data.map(convertToPlantInfo));
    return plants;
  } catch (error) {
    console.error('Error fetching plants from Supabase:', error);
    return originalPlantService.getAllPlants(); // Fallback to original
  }
};

/**
 * Gets featured plants for homepage
 */
export const getFeaturedPlants = async (count: number = 3): Promise<PlantInfo[]> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, using original plant service');
    return originalPlantService.getFeaturedPlants(count);
  }

  try {
    // Get some random plants as "featured"
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .limit(count);
    
    if (error) throw error;
    
    // Convert to PlantInfo objects
    const plants = await Promise.all(data.map(convertToPlantInfo));
    return plants;
  } catch (error) {
    console.error('Error fetching featured plants from Supabase:', error);
    return originalPlantService.getFeaturedPlants(count); // Fallback to original
  }
};

/**
 * Gets a plant by ID
 */
export const getPlantById = async (id: string): Promise<PlantInfo | undefined> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, using original plant service');
    return originalPlantService.getPlantById(id);
  }

  try {
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) return undefined;
    
    return convertToPlantInfo(data);
  } catch (error) {
    console.error('Error fetching plant by ID from Supabase:', error);
    return originalPlantService.getPlantById(id); // Fallback to original
  }
};

/**
 * Searches plants by name
 */
export const searchPlants = async (query: string): Promise<PlantInfo[]> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, using original plant service');
    return originalPlantService.searchPlants(query);
  }

  try {
    // Search both name and scientific name
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .or(`name.ilike.%${query}%,scientific_name.ilike.%${query}%`);
    
    if (error) throw error;
    
    // Convert to PlantInfo objects
    const plants = await Promise.all(data.map(convertToPlantInfo));
    return plants;
  } catch (error) {
    console.error('Error searching plants in Supabase:', error);
    return originalPlantService.searchPlants(query); // Fallback to original
  }
};

/**
 * Likes a plant, incrementing its like count
 * Uses a device ID to prevent multiple likes from the same device
 */
export const likePlant = async (plantId: string, deviceId: string): Promise<boolean> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, like functionality not available');
    return false;
  }

  try {
    // Check if this device already liked this plant
    const { data: existingLike } = await supabase
      .from('plant_likes')
      .select('*')
      .eq('plant_id', plantId)
      .eq('device_id', deviceId)
      .single();
    
    // If already liked, return early
    if (existingLike) return true;
    
    // Start a transaction to handle this as an atomic operation
    // First, record the like
    const { error: likeError } = await supabase
      .from('plant_likes')
      .insert({
        plant_id: plantId,
        device_id: deviceId
      });
    
    if (likeError) throw likeError;
    
    // Then increment the likes_count in the plants table
    const { error: updateError } = await supabase
      .from('plants')
      .update({ 
        likes_count: supabase.rpc('increment_likes', { row_id: plantId })
      })
      .eq('id', plantId);
    
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error('Error liking plant:', error);
    return false;
  }
};

/**
 * Unlike a plant, decrementing its like count
 */
export const unlikePlant = async (plantId: string, deviceId: string): Promise<boolean> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, unlike functionality not available');
    return false;
  }

  try {
    // Check if this device has liked this plant
    const { data: existingLike } = await supabase
      .from('plant_likes')
      .select('*')
      .eq('plant_id', plantId)
      .eq('device_id', deviceId)
      .single();
    
    // If not liked, can't unlike
    if (!existingLike) return false;
    
    // First remove the like record
    const { error: deleteError } = await supabase
      .from('plant_likes')
      .delete()
      .eq('id', existingLike.id);
    
    if (deleteError) throw deleteError;
    
    // Then decrement the likes count
    const { error: updateError } = await supabase
      .from('plants')
      .update({ 
        likes_count: supabase.rpc('decrement_likes', { row_id: plantId })
      })
      .eq('id', plantId);
    
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error('Error unliking plant:', error);
    return false;
  }
};

/**
 * Check if a plant is liked by this device
 */
export const isPlantLiked = async (plantId: string, deviceId: string): Promise<boolean> => {
  if (!isSupabaseConfigured()) {
    return false;
  }

  try {
    const { data } = await supabase
      .from('plant_likes')
      .select('id')
      .eq('plant_id', plantId)
      .eq('device_id', deviceId)
      .single();
    
    return !!data;
  } catch (error) {
    console.error('Error checking if plant is liked:', error);
    return false;
  }
};

/**
 * Gets popular plants based on like count
 */
export const getPopularPlants = async (count: number = 6): Promise<PlantInfo[]> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, using original plant service');
    return originalPlantService.getFeaturedPlants(count);
  }

  try {
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .order('likes_count', { ascending: false })
      .limit(count);
    
    if (error) throw error;
    
    // Convert to PlantInfo objects
    const plants = await Promise.all(data.map(convertToPlantInfo));
    return plants;
  } catch (error) {
    console.error('Error fetching popular plants from Supabase:', error);
    return originalPlantService.getFeaturedPlants(count); // Fallback to original
  }
};
