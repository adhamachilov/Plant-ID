import React, { useState } from 'react';
import { ArrowLeft, Droplets, Sun, ThermometerSnowflake, BookOpen, Share2, CheckCircle, AlertOctagon } from 'lucide-react';
import { PlantInfo } from './PlantCard';
import PlantLikeButton from './PlantLikeButton';

interface PlantResultProps {
  plant: PlantInfo;
  image: string | null;
  onReset: () => void;
}

const PlantResult: React.FC<PlantResultProps> = ({ plant, image, onReset }) => {
  // State to track the like operation status
  const [likeStatus, setLikeStatus] = useState<'success' | 'error' | null>(null);
  // Temperature conversion functions
  const convertToCelsius = (fahrenheit: string): string => {
    // Extract numbers from string like "65-75"
    const matches = fahrenheit.match(/([\d.]+)-([\d.]+)/); 
    if (!matches) return "";
    
    const lowF = parseFloat(matches[1]);
    const highF = parseFloat(matches[2]);
    
    // Convert to Celsius: (F - 32) * 5/9
    const lowC = Math.round((lowF - 32) * 5 / 9);
    const highC = Math.round((highF - 32) * 5 / 9);
    
    return `${lowC}-${highC}°C`;
  };
  
  const convertToFahrenheit = (celsius: string): string => {
    // Extract numbers from string like "18-24°C"
    const matches = celsius.match(/([\d.]+)-([\d.]+)/); 
    if (!matches) return "";
    
    const lowC = parseFloat(matches[1]);
    const highC = parseFloat(matches[2]);
    
    // Convert to Fahrenheit: (C * 9/5) + 32
    const lowF = Math.round((lowC * 9 / 5) + 32);
    const highF = Math.round((highC * 9 / 5) + 32);
    
    return `${lowF}-${highF}°F`;
  };

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
              className={`w-6 sm:w-8 h-1.5 sm:h-2 rounded-full ${value <= levels[level] ? 'bg-emerald-500' : 'bg-emerald-900'}`}
            />
          ))}
          <span className="ml-2 text-sm capitalize text-emerald-300 font-medium">{level}</span>
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
    <div className="bg-emerald-900/70 backdrop-blur-md rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl animate-fadeIn">
      <div className="p-4 sm:p-6 md:p-8">
        <button
          onClick={onReset}
          className="flex items-center text-emerald-400 hover:text-emerald-300 mb-4 sm:mb-6 transition-colors duration-300"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Try Another</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
          <div>
            {image && (
              <div className="mb-4 sm:mb-6 rounded-xl sm:rounded-2xl overflow-hidden">
                <img 
                  src={image} 
                  alt={plant.name} 
                  className="w-full h-auto"
                />
              </div>
            )}
            
            <div className="bg-emerald-950/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-emerald-400" />
                Interesting Facts
              </h3>
              <ul className="space-y-3">
                {plantFacts.map((fact, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mt-1.5 mr-2 flex-shrink-0"></span>
                    <span className="text-emerald-200 text-xs sm:text-sm">{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Status message for like operation */}
            {likeStatus && (
              <div className={`mb-4 p-2 sm:p-3 rounded-lg sm:rounded-xl flex items-center ${likeStatus === 'success' ? 'bg-emerald-800/50 text-emerald-300' : 'bg-red-900/30 text-red-300'}`}>
                {likeStatus === 'success' ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2 text-emerald-400" />
                    <span className="text-xs sm:text-sm">Plant liked successfully!</span>
                  </>
                ) : (
                  <>
                    <AlertOctagon className="h-5 w-5 mr-2 text-red-400" />
                    <span className="text-xs sm:text-sm">Failed to like plant. Please try again.</span>
                  </>
                )}
              </div>
            )}

            <div className="flex space-x-4">
              <div className="flex-grow">
                <PlantLikeButton 
                  plantId={plant.id} 
                  className="flex items-center justify-center space-x-2 w-full bg-emerald-500 hover:bg-emerald-600 text-emerald-950 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-all duration-300"
                />
              </div>
              <button className="flex items-center justify-center space-x-2 bg-transparent border border-emerald-500 hover:bg-emerald-800 text-emerald-400 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-all duration-300">
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </button>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">{plant.name}</h2>
            <p className="text-emerald-400 italic text-sm sm:text-base mb-3 sm:mb-4">{plant.scientificName}</p>
            
            <p className="text-emerald-200 text-sm sm:text-base mb-4 sm:mb-6">{plant.description}</p>
            
            <div className="space-y-4 mb-8">
              {renderLevelIndicator(plant.wateringNeeds, 'Water Needs')}
              {renderLevelIndicator(plant.sunlight, 'Sunlight')}
              <div className="flex flex-col">
                <span className="text-sm text-emerald-300 mb-1">Temperature</span>
                <div className="flex items-center">
                  <ThermometerSnowflake className="h-5 w-5 text-emerald-400 mr-2" />
                  <div className="text-emerald-300 font-medium flex items-center">
                    {plant.temperature.includes('°F') ? (
                      <>
                        <span>{plant.temperature}</span>
                        <span className="mx-2 h-3.5 w-0.5 bg-emerald-500/60"></span>
                        <span>{convertToCelsius(plant.temperature)}</span>
                      </>
                    ) : plant.temperature.includes('°C') ? (
                      <>
                        <span>{convertToFahrenheit(plant.temperature)}</span>
                        <span className="mx-2 h-3.5 w-0.5 bg-emerald-500/60"></span>
                        <span>{plant.temperature}</span>
                      </>
                    ) : (
                      <>
                        <span>{plant.temperature}°F</span>
                        <span className="mx-2 h-3.5 w-0.5 bg-emerald-500/60"></span>
                        <span>{convertToCelsius(plant.temperature + '°F')}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-emerald-950/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-4 sm:mb-6">
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
