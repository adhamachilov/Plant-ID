import { PlantInfo } from '../components/PlantInfo';
import { analyzeImageWithGemini } from './geminiService';
import { v4 as uuidv4 } from 'uuid';

// Mock plant database for fallback
const plantDatabase: PlantInfo[] = [
  {
    id: 'monstera-deliciosa',
    name: 'Monstera Deliciosa',
    scientificName: 'Monstera deliciosa',
    image: 'https://images.pexels.com/photos/3097770/pexels-photo-3097770.jpeg',
    wateringNeeds: 'medium',
    sunlight: 'medium',
    temperature: '65-85°F',
    description: 'The Monstera deliciosa is a species of flowering plant native to tropical forests of southern Mexico, south to Panama.'
  },
  // other plants can remain in the original plantService.ts file
];

// Plant identification service using Google Gemini API
export const identifyPlant = async (imageUrl: string): Promise<PlantInfo> => {
  try {
    console.log("Starting plant identification process...");
    
    // Send the image to the Gemini API for analysis
    const geminiResponse = await analyzeImageWithGemini(imageUrl);
    console.log("Received response from Gemini API");
    
    // Parse the JSON response from Gemini
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
      
      // Validate that we have the required fields
      if (!plantData.name || !plantData.scientificName) {
        console.warn("Parsed JSON is missing required fields:", plantData);
      }
    } catch (parseError: any) {
      console.error('Failed to parse Gemini response as JSON:', parseError);
      throw new Error(`Invalid JSON response: ${parseError.message}`);
    }
    
    // Generate care instructions based on the plant's needs
    const careInstructions = generateCareInstructions(
      plantData.name,
      plantData.wateringNeeds,
      plantData.sunlight,
      plantData.temperature,
      plantData.description
    );
    
    // Extract facts from the description if possible
    const facts = extractFactsFromDescription(plantData.description);
    
    // Create a plant info object with the data from Gemini
    const identifiedPlant: PlantInfo = {
      id: plantData.scientificName 
        ? plantData.scientificName.toLowerCase().replace(/\s+/g, '-') 
        : `plant-${uuidv4().slice(0, 8)}`,
      name: plantData.name || 'Unknown Plant',
      scientificName: plantData.scientificName || 'Species unknown',
      image: imageUrl, // Use the uploaded image as the plant image
      wateringNeeds: plantData.wateringNeeds || 'medium',
      sunlight: plantData.sunlight || 'medium',
      temperature: plantData.temperature || '65-75°F',
      description: cleanDescription(plantData.description) || 'No description available.',
      careInstructions: careInstructions,
      facts: facts
    };
    
    console.log("Final identified plant object:", identifiedPlant);
    
    return identifiedPlant;
  } catch (error) {
    console.error('Error identifying plant:', error);
    
      return handleIdentificationError(imageUrl);
  }
};

// Handle identification errors with friendly user message
export const handleIdentificationError = (imageUrl: string): PlantInfo => {
  // Create a friendly error message for the user
  const unknownPlant: PlantInfo = {
    id: `unknown-plant-${uuidv4().slice(0, 8)}`,
    name: 'Plant Identification Error',
    scientificName: 'Try again in a moment',
    image: imageUrl,
    wateringNeeds: 'medium',
    sunlight: 'medium',
    temperature: '65-75°F',
    description: `We encountered a temporary error while analyzing your plant image. This could be due to API limits or network issues. Please try again in a few moments.`,
    careInstructions: {
      watering: "Not available at the moment",
      light: "Not available at the moment",
      soil: "Not available at the moment",
      humidity: "Not available at the moment",
      fertilizing: "Not available at the moment"
    },
    facts: [
      "Plant identification service is temporarily unavailable.",
      "Try uploading a clearer image of the plant.",
      "Ensure the plant is well-lit and the main subject of the photo.",
      "Our AI works best with images that show distinct plant features.",
      "You can try again in a few moments."
    ]
  };
  
  return unknownPlant;
};

// Clean description to remove any JSON or code formatting
export function cleanDescription(description: string): string {
  if (!description) return '';
  
  // Remove any markdown code blocks
  description = description.replace(/```json[\s\S]*?```/g, '');
  description = description.replace(/```[\s\S]*?```/g, '');
  
  // Remove any JSON formatting characters
  description = description.replace(/[{}\[\]"]/g, '');
  
  // Clean up any label: value pairs
  description = description.replace(/(\w+):\s*([^,]+)(,|$)/g, '$2$3');
  
  // Remove excessive whitespace
  description = description.replace(/\s+/g, ' ').trim();
  
  return description;
}

// Helper function to generate care instructions based on plant characteristics
export function generateCareInstructions(
  plantName: string,
  wateringNeeds: string,
  sunlight: string,
  temperature: string,
  description: string
) {
  // Default instructions that will be customized
  const careInstructions = {
    watering: "",
    light: "",
    soil: "Well-draining soil appropriate for this plant type.",
    humidity: "Average household humidity is typically sufficient.",
    fertilizing: "Use a balanced fertilizer during the growing season."
  };
  
  // Customize watering instructions based on needs
  switch (wateringNeeds) {
    case 'low':
      careInstructions.watering = `Water sparingly, allowing soil to dry out completely between waterings. ${plantName} is drought-tolerant and susceptible to overwatering.`;
      break;
    case 'medium':
      careInstructions.watering = `Water when the top inch of soil feels dry to the touch. ${plantName} prefers consistent moisture but not soggy conditions.`;
      break;
    case 'high':
      careInstructions.watering = `Keep soil consistently moist but not waterlogged. ${plantName} requires regular watering and doesn't tolerate drying out.`;
      break;
    default:
      careInstructions.watering = `Water moderately, adjusting based on environmental conditions and season.`;
  }
  
  // Customize light instructions based on needs
  switch (sunlight) {
    case 'low':
      careInstructions.light = `Place in low to indirect light conditions. ${plantName} can tolerate shade and is sensitive to direct sunlight.`;
      break;
    case 'medium':
      careInstructions.light = `Provide bright, indirect light. ${plantName} thrives in filtered sunlight but should be protected from harsh afternoon sun.`;
      break;
    case 'high':
      careInstructions.light = `Position in a location with plenty of direct sunlight. ${plantName} requires at least 6 hours of sun daily for optimal growth.`;
      break;
    default:
      careInstructions.light = `Provide moderate light conditions, adjusting based on seasonal changes.`;
  }
  
  // Add temperature information
  careInstructions.humidity += ` Maintain temperature around ${temperature}.`;
  
  // Try to extract soil information from description
  if (description && description.toLowerCase().includes('soil')) {
    const soilMatch = description.match(/soil[^.!?]*[.!?]/i);
    if (soilMatch) {
      careInstructions.soil = soilMatch[0].trim();
    }
  }
  
  return careInstructions;
}

// Extract facts from the description when possible
export function extractFactsFromDescription(description: string): string[] {
  if (!description) return [
    "Plant identification complete.",
    "Check out our other features to learn more about plants.",
    "You can save this plant to your collection.",
    "Share this information with fellow plant enthusiasts.",
    "Every plant has unique care requirements."
  ];
  
  // Try to identify sentence boundaries and create facts
  const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  // Take up to 5 facts from the description
  const facts = sentences.slice(0, 5).map(s => s.trim() + '.');
  
  // If we don't have enough facts, add some generic ones
  while (facts.length < 5) {
    const genericFacts = [
      "This plant can be a beautiful addition to your home or garden.",
      "Regular care will help this plant thrive for years.",
      "Many plants can improve air quality in your home.",
      "Understanding your plant's needs is key to successful growth.",
      "Plants respond to consistent care routines."
    ];
    
    // Add a generic fact we haven't used yet
    const unusedFact = genericFacts.find(f => !facts.includes(f));
    if (unusedFact) facts.push(unusedFact);
    else break; // No more unique facts to add
  }
  
  return facts;
}

// Other exported functions from the original file
export const getAllPlants = (): PlantInfo[] => {
  return plantDatabase;
};

export const getFeaturedPlants = (count: number = 3): PlantInfo[] => {
  return plantDatabase.slice(0, count);
};

export const getPlantById = (id: string): PlantInfo | undefined => {
  return plantDatabase.find(plant => plant.id === id);
};

export const searchPlants = (query: string): PlantInfo[] => {
  const lowercaseQuery = query.toLowerCase();
  return plantDatabase.filter(plant => 
    plant.name.toLowerCase().includes(lowercaseQuery) || 
    plant.scientificName.toLowerCase().includes(lowercaseQuery)
  );
};
