import { PlantInfo } from '../components/PlantCard';
import { analyzeImageWithGemini } from './geminiService';
import { v4 as uuidv4 } from 'uuid';

// Plant database - exported so it can be accessed and modified
export const plantDatabase: PlantInfo[] = [
  {
    id: 'red-gerbera-daisy',
    name: 'Red Gerbera Daisy',
    scientificName: 'Gerbera jamesonii',
    image: '/assets/plants/1.png',
    wateringNeeds: 'medium',
    sunlight: 'medium',
    temperature: '65-85°F',
    price: 'Rs. 359/-',
    description: 'Gerbera Daisies are known for their large, vibrant flowers.',
    careInstructions: {
      watering: "Water when the top inch of soil is dry. Avoid overhead watering as wet leaves can lead to powdery mildew and other fungal diseases. Use room temperature water whenever possible.",
      light: "Place in bright, indirect light for 6-8 hours daily. Morning sun with afternoon shade is ideal, especially in hot climates. Too little light results in fewer blooms.",
      soil: "Plant in rich, well-draining soil with a pH between 5.5 and 6.5. A mix formulated for flowering houseplants with added perlite works well to ensure proper drainage.",
      humidity: "Prefers moderate humidity (40-50%). In dry environments, use a pebble tray with water near the plant, but avoid misting as this can promote leaf diseases.",
      fertilizing: "Apply a phosphorus-rich, water-soluble fertilizer (such as 15-30-15) diluted to half strength every 2 weeks during the growing season. Reduce to monthly in winter."
    },
    facts: [
      "Discovered in 1880 by Robert Jameson in South Africa during a gold mining operation.",
      "Available in all colors except true blue - any blue gerbera daisies are artificially colored.",
      "Fifth most popular cut flower worldwide, after roses, carnations, chrysanthemums, and tulips.",
      "Can last up to 14 days in a vase with proper care.",
      "The flower is actually a composite of hundreds of tiny individual flowers."
    ]
  },
  {
    id: 'gerbera-daisy',
    name: 'Gerbera Daisy',
    scientificName: 'Gerbera jamesonii',
    image: '/assets/plants/2.png',
    wateringNeeds: 'medium',
    sunlight: 'high',
    temperature: '65-75°F',
    price: 'Rs. 359/-',
    description: 'Gerbera Daisies are vibrant flowering plants known for their large, daisy-like blooms in a variety of colors.',
    careInstructions: {
      watering: "Water when the top inch of soil is dry. Avoid overhead watering as wet leaves can lead to powdery mildew and other fungal diseases. Use room temperature water whenever possible.",
      light: "Place in bright, indirect light for 6-8 hours daily. Morning sun with afternoon shade is ideal, especially in hot climates. Too little light results in fewer blooms.",
      soil: "Plant in rich, well-draining soil with a pH between 5.5 and 6.5. A mix formulated for flowering houseplants with added perlite works well to ensure proper drainage.",
      humidity: "Prefers moderate humidity (40-50%). In dry environments, use a pebble tray with water near the plant, but avoid misting as this can promote leaf diseases.",
      fertilizing: "Apply a phosphorus-rich, water-soluble fertilizer (such as 15-30-15) diluted to half strength every 2 weeks during the growing season. Reduce to monthly in winter."
    },
    facts: [
      "Discovered in 1880 by Robert Jameson in South Africa during a gold mining operation.",
      "Available in all colors except true blue - any blue gerbera daisies are artificially colored.",
      "Fifth most popular cut flower worldwide, after roses, carnations, chrysanthemums, and tulips.",
      "Can last up to 14 days in a vase with proper care.",
      "The flower is actually a composite of hundreds of tiny individual flowers."
    ]
  },
  {
    id: 'pink-adenium',
    name: 'Pink Adenium',
    scientificName: 'Adenium obesum',
    image: '/assets/plants/3.png',
    wateringNeeds: 'medium',
    sunlight: 'high',
    temperature: '60-85°F',
    price: 'Rs. 359/-',
    description: 'The Pink Adenium, also known as Desert Rose, is a succulent plant with thick stems and striking pink flowers.',
    careInstructions: {
      watering: "Water thoroughly but infrequently, allowing soil to dry completely between waterings. During active growth (spring/summer), water once every 7-10 days. In winter, reduce to once every 3-4 weeks or when the plant shows signs of thirst.",
      light: "Demands at least 6-8 hours of direct sunlight daily. Place in your brightest window, preferably south-facing. Insufficient light results in leggy growth and few flowers.",
      soil: "Must have extremely well-draining soil. Use a mix of 50% cactus soil, 25% perlite, and 25% coarse sand or pumice. Never use regular potting soil as it retains too much moisture.",
      humidity: "Prefers dry air conditions (30-40% humidity). Excessive humidity can lead to root rot and fungal problems. Ensure good air circulation around the plant at all times.",
      fertilizing: "Apply a phosphorus-rich, low-nitrogen fertilizer (such as 5-15-5) diluted to half strength once monthly during spring and summer growing season. Do not fertilize in fall or winter."
    },
    facts: [
      "Often called 'Desert Rose' because of its rose-like flowers and ability to thrive in arid conditions.",
      "The swollen caudex (base) stores water, allowing it to survive long periods of drought.",
      "All parts of the plant contain toxic cardiac glycosides, so care should be taken around children and pets.",
      "Highly prized for bonsai cultivation due to its thick trunk and miniaturization potential.",
      "In its native habitat, can grow up to 10 feet tall and live for decades."
    ]
  },
  {
    id: 'chinese-hibiscus',
    name: 'Chinese Hibiscus',
    scientificName: 'Hibiscus rosa-sinensis',
    image: '/assets/plants/4.png',
    wateringNeeds: 'medium',
    sunlight: 'high',
    temperature: '65-80°F',
    price: 'Rs. 359/-',
    description: 'The Chinese hibiscus is a flowering plant known for its large, showy flowers.',
    careInstructions: {
      watering: "Keep soil consistently moist but not waterlogged. Water thoroughly when the top inch of soil feels dry. Increase watering during blooming and hot periods; reduce in winter.",
      light: "Requires at least 6 hours of direct sunlight daily for abundant flowering. Place near south or west-facing windows when grown indoors. Protect from intense afternoon sun in very hot regions.",
      soil: "Plant in rich, well-draining soil with a pH between 6.0-6.5. A mix of quality potting soil with 25% perlite or pumice ensures good drainage while retaining necessary moisture.",
      humidity: "Thrives in moderate to high humidity (50-60%). Increase humidity by grouping plants together or using a humidity tray. Regular misting benefits the plant in dry climates.",
      fertilizing: "Feed with a high-potassium fertilizer (such as 10-10-20) every 2 weeks during growing season. Reduce to monthly in fall and stop completely in winter to allow dormancy."
    },
    facts: [
      "The national flower of Malaysia and the state flower of Hawaii.",
      "Individual flowers last only 1-2 days, but plants bloom continuously throughout the season.",
      "Contains vitamin C and is used to make herbal teas in many cultures.",
      "Has been used in traditional medicine for centuries to treat high blood pressure.",
      "The red varieties are especially popular in religious ceremonies in Hindu culture."
    ]
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
      // With our improved Gemini service, the response should always be valid JSON
      plantData = JSON.parse(geminiResponse);
      console.log("Successfully parsed JSON:", plantData);
    } catch (parseError: any) {
      console.error('Failed to parse Gemini response as JSON:', parseError);
      throw new Error(`Invalid JSON response: ${parseError.message}`);
    }
    
    // Generate care instructions based on the plant's needs
    const careInstructions = {
      watering: getWateringInstructions(plantData.name, plantData.wateringNeeds),
      light: getLightInstructions(plantData.name, plantData.sunlight),
      soil: "Use well-draining soil that's appropriate for this plant type.",
      humidity: `Maintain typical indoor humidity and temperature around ${plantData.temperature}.`,
      fertilizing: "Apply a balanced fertilizer during the growing season as needed."
    };
    
    // Extract facts from the description
    const facts = generateFactsFromDescription(plantData.description);
    
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
      description: plantData.description || 'No description available.',
      careInstructions: careInstructions,
      facts: facts
    };
    
    console.log("Final identified plant object:", identifiedPlant);
    return identifiedPlant;
  } catch (error) {
    console.error('Error identifying plant:', error);
    
    // Create a user-friendly error message
    const unknownPlant: PlantInfo = {
      id: `unknown-plant-${uuidv4().slice(0, 8)}`,
      name: 'Try Again',
      scientificName: 'Image processing issue',
      image: imageUrl,
      wateringNeeds: 'medium',
      sunlight: 'medium',
      temperature: '65-75°F',
      description: `We had trouble processing this image. Try uploading a clear, well-lit photo of the plant with visible leaves and flowers if possible.`,
      careInstructions: {
        watering: "Not available for this image",
        light: "Not available for this image",
        soil: "Not available for this image",
        humidity: "Not available for this image",
        fertilizing: "Not available for this image"
      },
      facts: [
        "Clear images help AI identify plants more accurately.",
        "Try to capture the whole plant including leaves and flowers.",
        "Good lighting improves identification accuracy.",
        "Avoid blurry or dark images for better results.",
        "You can try with a different image of the same plant."
      ]
    };
    
    return unknownPlant;
  }
};

// Helper functions for generating care instructions
function getWateringInstructions(plantName: string, wateringNeeds: string): string {
  switch (wateringNeeds) {
    case 'low':
      return `Water sparingly. Allow soil to dry completely between waterings. ${plantName} is drought-tolerant.`;
    case 'medium':
      return `Water when the top inch of soil feels dry to the touch. ${plantName} prefers consistent moisture but not soggy conditions.`;
    case 'high':
      return `Keep soil consistently moist. ${plantName} requires regular watering and doesn't tolerate drying out.`;
    default:
      return `Water moderately, adjusting based on season and environment.`;
  }
}

function getLightInstructions(plantName: string, sunlight: string): string {
  switch (sunlight) {
    case 'low':
      return `Place in shade or indirect light. ${plantName} can thrive in low light conditions.`;
    case 'medium':
      return `Provide bright, filtered light. ${plantName} does best with indirect sunlight.`;
    case 'high':
      return `Position in a bright location with direct sunlight. ${plantName} needs at least 6 hours of sun daily.`;
    default:
      return `Provide moderate light, avoiding harsh direct sunlight.`;
  }
}

function generateFactsFromDescription(description: string): string[] {
  if (!description || description.length < 10) {
    return [
      "Plants improve air quality and reduce stress.",
      "Regular care helps plants thrive and stay healthy.",
      "Proper light is essential for photosynthesis.",
      "Most houseplants originated in tropical regions.",
      "Plants can communicate through chemical signals."
    ];
  }
  
  // Try to create facts from the description
  const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  // Take up to 5 facts from the description
  const facts = sentences.slice(0, 5).map(s => s.trim() + '.');
  
  // If we don't have enough facts, add some generic ones
  while (facts.length < 5) {
    const genericFacts = [
      `${description.split(' ')[0]} plants can enhance your home decor.`,
      "Consistent care routine leads to healthier plants.",
      "Plants respond to their environment and care.",
      "Observing your plant helps you understand its needs.",
      "Plants are living organisms that change and grow over time."
    ];
    
    // Add a generic fact
    const unusedFact = genericFacts.find(f => !facts.includes(f));
    if (unusedFact) facts.push(unusedFact);
    else break;
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

// Add an identified plant to the database
export const savePlantToDatabase = (plant: PlantInfo): boolean => {
  try {
    // Check if plant with same ID already exists
    const existingPlantIndex = plantDatabase.findIndex(p => p.id === plant.id);
    
    if (existingPlantIndex >= 0) {
      // Update existing plant
      plantDatabase[existingPlantIndex] = plant;
    } else {
      // Add new plant
      plantDatabase.push(plant);
    }
    
    console.log('Plant saved to database:', plant.name);
    return true;
  } catch (error) {
    console.error('Error saving plant to database:', error);
    return false;
  }
};
