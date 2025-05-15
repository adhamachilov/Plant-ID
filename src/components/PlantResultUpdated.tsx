import React from 'react';
import { ArrowLeft, Droplets, Sun, ThermometerSnowflake, BookOpen } from 'lucide-react';
import PlantLikeButton from './PlantLikeButton';
import PlantShareButton from './PlantShareButton';
import { PlantInfo } from './PlantInfo';

interface PlantResultProps {
  plant: PlantInfo;
  image: string | null;
  onReset: () => void;
}

const PlantResult: React.FC<PlantResultProps> = ({ plant, image, onReset }) => {
  // Helper function to render the appropriate level indicators
  const renderLevelIndicator = (level: 'low' | 'medium' | 'high', label: string) => {
    const levels = {
      low: 1,
      medium: 2,
      high: 3
    };
    
    return (
      <div className="flex flex-col">
        <span className="text-sm text-emerald-300 mb-1">{label}</span>
        <div className="flex space-x-1 items-center">
          {[1, 2, 3].map((value) => (
            <div 
              key={value}
              className={`w-8 h-2 rounded-full ${value <= levels[level] ? 'bg-emerald-500' : 'bg-emerald-900'}`}
            />
          ))}
          <span className="ml-2 text-sm capitalize">{level}</span>
        </div>
      </div>
    );
  };

  // Generate facts if not provided
  const plantFacts = plant.facts || generateFactsFromDescription(plant.description);
  
  // Generate care instructions if not provided
  const careInstructions = plant.careInstructions || generateCareInstructions(
    plant.name,
    plant.wateringNeeds,
    plant.sunlight,
    plant.temperature,
    plant.description
  );

  return (
    <div className="bg-emerald-900/70 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl animate-fadeIn">
      <div className="p-6 md:p-8">
        <button
          onClick={onReset}
          className="flex items-center text-emerald-400 hover:text-emerald-300 mb-6 transition-colors duration-300"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Try Another</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {image && (
              <div className="mb-6 rounded-2xl overflow-hidden">
                <img 
                  src={image} 
                  alt={plant.name} 
                  className="w-full h-auto"
                />
              </div>
            )}
            
            <div className="bg-emerald-950/50 rounded-2xl p-5 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-emerald-400" />
                Interesting Facts
              </h3>
              <ul className="space-y-3">
                {plantFacts.map((fact, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mt-1.5 mr-2 flex-shrink-0"></span>
                    <span className="text-emerald-200 text-sm">{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex space-x-4">
              <PlantLikeButton 
                plantId={plant.id} 
                className="flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-emerald-950 flex-1 py-3 rounded-xl font-medium transition-all duration-300" 
              />
              <PlantShareButton 
                plant={plant}
                className="flex items-center justify-center space-x-2 bg-transparent border border-emerald-500 hover:bg-emerald-800 text-emerald-400 flex-1 py-3 rounded-xl font-medium transition-all duration-300"
              />
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{plant.name}</h2>
            <p className="text-emerald-400 italic mb-4">{plant.scientificName}</p>
            
            <p className="text-emerald-200 mb-6">{plant.description}</p>
            
            <div className="space-y-4 mb-8">
              {renderLevelIndicator(plant.wateringNeeds, 'Water Needs')}
              {renderLevelIndicator(plant.sunlight, 'Sunlight')}
              <div className="flex flex-col">
                <span className="text-sm text-emerald-300 mb-1">Temperature</span>
                <div className="flex items-center">
                  <ThermometerSnowflake className="h-5 w-5 text-emerald-400 mr-2" />
                  <span className="text-white">{plant.temperature}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-emerald-950/50 rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-white mb-4">Care Instructions</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-emerald-400 font-medium mb-1">Watering</h4>
                  <p className="text-emerald-200 text-sm">{careInstructions.watering}</p>
                </div>
                <div>
                  <h4 className="text-emerald-400 font-medium mb-1">Light</h4>
                  <p className="text-emerald-200 text-sm">{careInstructions.light}</p>
                </div>
                <div>
                  <h4 className="text-emerald-400 font-medium mb-1">Soil</h4>
                  <p className="text-emerald-200 text-sm">{careInstructions.soil}</p>
                </div>
                <div>
                  <h4 className="text-emerald-400 font-medium mb-1">Humidity</h4>
                  <p className="text-emerald-200 text-sm">{careInstructions.humidity}</p>
                </div>
                <div>
                  <h4 className="text-emerald-400 font-medium mb-1">Fertilizing</h4>
                  <p className="text-emerald-200 text-sm">{careInstructions.fertilizing}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to generate care instructions based on plant characteristics
function generateCareInstructions(
  plantName: string,
  wateringNeeds: 'low' | 'medium' | 'high',
  sunlight: 'low' | 'medium' | 'high',
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
  
  return careInstructions;
}

// Extract facts from the description when possible
function generateFactsFromDescription(description: string): string[] {
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

export default PlantResult;
