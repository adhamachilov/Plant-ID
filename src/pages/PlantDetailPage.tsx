import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Droplets, Sun, ThermometerSnowflake, BookOpen } from 'lucide-react';
// Import both services to ensure we have a fallback
import * as supabaseService from '../services/supabasePlantService';
import * as localService from '../services/plantService';
import { PlantInfo } from '../components/PlantCard';
import PlantGrid from '../components/PlantGrid';
import AnimatedElement from '../components/AnimatedElement';
import PlantLikeButton from '../components/PlantLikeButton';
import PlantShareButton from '../components/PlantShareButton';

const PlantDetailPage: React.FC = () => {
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
  const { id } = useParams<{ id: string }>();
  const [plant, setPlant] = useState<PlantInfo | null>(null);
  const [similarPlants, setSimilarPlants] = useState<PlantInfo[]>([]);
  
  // Fetch similar plants
  useEffect(() => {
    const fetchSimilarPlants = async () => {
      try {
        // Try Supabase first, fall back to local service
        let plants;
        try {
          plants = await supabaseService.getFeaturedPlants(4);
        } catch (e) {
          console.log('Falling back to local service for featured plants');
          plants = localService.getFeaturedPlants(4);
        }
        setSimilarPlants(plants);
      } catch (error) {
        console.error('Error fetching similar plants:', error);
      }
    };
    
    fetchSimilarPlants();
  }, []);

  // Added loading state
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPlantData = async () => {
      if (id) {
        setLoading(true);
        console.log('Attempting to fetch plant with ID:', id);
        
        // Skip Supabase and directly use local service for reliable results
        const plantData = localService.getPlantById(id);
        console.log('Plant data retrieved from local service:', plantData);
        
        if (plantData) {
          // Extract care instructions and facts if they exist, or generate them
          let careInst = plantData.careInstructions;
          if (!careInst) {
            careInst = {
              watering: `Water ${plantData.name} when the top inch of soil feels dry.`,
              light: `Provide ${plantData.sunlight === 'high' ? 'bright direct' : plantData.sunlight === 'medium' ? 'bright indirect' : 'low to moderate'} light.`,
              soil: 'Well-draining potting mix appropriate for this plant type.',
              humidity: `Maintain typical indoor humidity and temperature around ${plantData.temperature}.`,
              fertilizing: 'Apply a balanced fertilizer during the growing season as needed.'
            };
          }
          
          let factsList = plantData.facts;
          if (!factsList || factsList.length === 0) {
            factsList = [
              `${plantData.name} is known for its beauty and is popular among plant enthusiasts.`,
              `${plantData.name} requires ${plantData.wateringNeeds === 'high' ? 'regular' : plantData.wateringNeeds === 'medium' ? 'moderate' : 'minimal'} watering.`,
              `${plantData.name} thrives in ${plantData.sunlight === 'high' ? 'bright' : plantData.sunlight === 'medium' ? 'medium' : 'low'} light conditions.`,
              `The ideal temperature range for ${plantData.name} is ${plantData.temperature}.`,
              `With proper care, ${plantData.name} can thrive for many years.`
            ];
          }
          
          // Set the plant with guaranteed care instructions and facts
          setPlant({
            ...plantData,
            careInstructions: careInst,
            facts: factsList
          });
        } else {
          console.error('Plant not found with ID:', id);
          
          // Create a fallback plant for better user experience
          const fallbackPlant: PlantInfo = {
            id: id || 'unknown',
            name: 'Unknown Plant',
            scientificName: 'Species unknown',
            image: '/assets/plants/1.png', // Default image
            wateringNeeds: 'medium',
            sunlight: 'medium',
            temperature: '65-75°F',
            description: 'Details for this plant are not available. It may have been removed or is still being added to our database.',
            price: '',
            careInstructions: {
              watering: 'Not available',
              light: 'Not available',
              soil: 'Not available',
              humidity: 'Not available',
              fertilizing: 'Not available'
            },
            facts: [
              'This plant information is currently unavailable.',
              'Try checking another plant from our featured collection.',
              'Our database is constantly being updated with new plants.',
              'You can identify your own plants using our identification tool.',
              'If you believe this is an error, please contact support.'
            ]
          };
          setPlant(fallbackPlant);
        }
        setLoading(false);
      }
    };
    
    fetchPlantData();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-emerald-950 min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-emerald-400 text-lg mb-4">Loading plant details...</p>
        </div>
      </div>
    );
  }
  
  if (!plant) {
    return (
      <div className="bg-emerald-950 min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-emerald-400 text-lg mb-4">Plant not found</p>
          <Link 
            to="/plants" 
            className="inline-flex items-center text-emerald-500 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Plants
          </Link>
        </div>
      </div>
    );
  }

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
          <span className="ml-2 text-sm text-emerald-300 capitalize">{level}</span>
        </div>
      </div>
    );
  };

  // Generate plant facts based on the plant type with accurate information from research
  const generateFacts = (plant: PlantInfo) => {
    if (plant.name.includes('Gerbera')) {
      return [
        "Discovered in 1880 by Robert Jameson in South Africa during a gold mining operation.",
        "Available in all colors except true blue - any blue gerbera daisies are artificially colored.",
        "Fifth most popular cut flower worldwide, after roses, carnations, chrysanthemums, and tulips.",
        "Can last up to 14 days in a vase with proper care.",
        "The flower is actually a composite of hundreds of tiny individual flowers."
      ];
    } 
    else if (plant.name.includes('Hibiscus')) {
      return [
        "The national flower of Malaysia and the state flower of Hawaii.",
        "Individual flowers last only 1-2 days, but plants bloom continuously throughout the season.",
        "Contains vitamin C and is used to make herbal teas in many cultures.",
        "Has been used in traditional medicine for centuries to treat high blood pressure.",
        "The red varieties are especially popular in religious ceremonies in Hindu culture."
      ];
    }
    else if (plant.name.includes('Adenium')) {
      return [
        "Often called 'Desert Rose' because of its rose-like flowers and ability to thrive in arid conditions.",
        "The swollen caudex (base) stores water, allowing it to survive long periods of drought.",
        "All parts of the plant contain toxic cardiac glycosides, so care should be taken around children and pets.",
        "Highly prized for bonsai cultivation due to its thick trunk and miniaturization potential.",
        "In its native habitat, can grow up to 10 feet tall and live for decades."
      ];
    }
    else {
      return [
        "Features bright, showy flowers that attract pollinators.",
        "Adds a pop of color to gardens and indoor spaces.",
        "Relatively easy to care for with proper attention.",
        "Popular for both beginners and experienced gardeners.",
        "Can enhance mood and create a positive environment."
      ];
    }
  };
  
  // Always ensure we have facts - either from the plant or generate them
  let facts = plant.facts || generateFacts(plant);
  
  // Always ensure facts is an array with content
  if (!facts || !Array.isArray(facts) || facts.length === 0) {
    facts = [
      `${plant.name} is known for its beauty and is popular among plant enthusiasts.`,
      `${plant.name} requires ${plant.wateringNeeds === 'high' ? 'regular' : plant.wateringNeeds === 'medium' ? 'moderate' : 'minimal'} watering.`,
      `${plant.name} thrives in ${plant.sunlight === 'high' ? 'bright' : plant.sunlight === 'medium' ? 'medium' : 'low'} light conditions.`,
      `The ideal temperature range for ${plant.name} is ${plant.temperature}.`,
      `With proper care, ${plant.name} can thrive for many years.`
    ];
  }

  // Generate care instructions based on the plant type with accurate information from research
  const generateCareInstructions = (plant: PlantInfo) => {
    if (plant.name.includes('Gerbera')) {
      return {
        watering: "Water when the top inch of soil is dry. Avoid overhead watering as wet leaves can lead to powdery mildew and other fungal diseases. Use room temperature water whenever possible.",
        light: "Place in bright, indirect light for 6-8 hours daily. Morning sun with afternoon shade is ideal, especially in hot climates. Too little light results in fewer blooms.",
        soil: "Plant in rich, well-draining soil with a pH between 5.5 and 6.5. A mix formulated for flowering houseplants with added perlite works well to ensure proper drainage.",
        humidity: "Prefers moderate humidity (40-50%). In dry environments, use a pebble tray with water near the plant, but avoid misting as this can promote leaf diseases.",
        fertilizing: "Apply a phosphorus-rich, water-soluble fertilizer (such as 15-30-15) diluted to half strength every 2 weeks during the growing season. Reduce to monthly in winter."
      };
    } 
    else if (plant.name.includes('Hibiscus')) {
      return {
        watering: "Keep soil consistently moist but not waterlogged. Water thoroughly when the top inch of soil feels dry. Increase watering during blooming and hot periods; reduce in winter.",
        light: "Requires at least 6 hours of direct sunlight daily for abundant flowering. Place near south or west-facing windows when grown indoors. Protect from intense afternoon sun in very hot regions.",
        soil: "Plant in rich, well-draining soil with a pH between 6.0-6.5. A mix of quality potting soil with 25% perlite or pumice ensures good drainage while retaining necessary moisture.",
        humidity: "Thrives in moderate to high humidity (50-60%). Increase humidity by grouping plants together or using a humidity tray. Regular misting benefits the plant in dry climates.",
        fertilizing: "Feed with a high-potassium fertilizer (such as 10-10-20) every 2 weeks during growing season. Reduce to monthly in fall and stop completely in winter to allow dormancy."
      };
    }
    else if (plant.name.includes('Adenium')) {
      return {
        watering: "Water thoroughly but infrequently, allowing soil to dry completely between waterings. During active growth (spring/summer), water once every 7-10 days. In winter, reduce to once every 3-4 weeks or when the plant shows signs of thirst.",
        light: "Demands at least 6-8 hours of direct sunlight daily. Place in your brightest window, preferably south-facing. Insufficient light results in leggy growth and few flowers.",
        soil: "Must have extremely well-draining soil. Use a mix of 50% cactus soil, 25% perlite, and 25% coarse sand or pumice. Never use regular potting soil as it retains too much moisture.",
        humidity: "Prefers dry air conditions (30-40% humidity). Excessive humidity can lead to root rot and fungal problems. Ensure good air circulation around the plant at all times.",
        fertilizing: "Apply a phosphorus-rich, low-nitrogen fertilizer (such as 5-15-5) diluted to half strength once monthly during spring and summer growing season. Do not fertilize in fall or winter."
      };
    }
    else {
      return {
        watering: plant.wateringNeeds === 'high' ? 
          "Keep soil consistently moist." : 
          plant.wateringNeeds === 'medium' ? 
          "Water when the top inch of soil feels dry." : 
          "Allow soil to dry between waterings.",
        light: plant.sunlight === 'high' ? 
          "Thrives in bright, direct sunlight." : 
          plant.sunlight === 'medium' ? 
          "Prefers bright, indirect light." : 
          "Does well in low to moderate light conditions.",
        soil: "Well-draining potting mix appropriate for this plant type.",
        humidity: `Maintain typical indoor humidity and temperature around ${plant.temperature}.`,
        fertilizing: "Apply a balanced fertilizer during the growing season as needed."
      };
    }
  };
  
  // Get care instructions from the plant if they exist, otherwise generate them
  let careInstructions = plant.careInstructions;
  if (!careInstructions) {
    careInstructions = generateCareInstructions(plant);
  }

  return (
    <div className="bg-emerald-950 min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <AnimatedElement>
            <Link 
              to="/plants" 
              className="inline-flex items-center text-emerald-400 hover:text-emerald-300 mb-8 transition-colors duration-300"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Plants
            </Link>
          </AnimatedElement>

          <AnimatedElement delay={0.1}>
            <div className="bg-emerald-900/70 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl mb-16 border border-emerald-500/30">
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <AnimatedElement delay={0.2}>
                      <div className="mb-6 rounded-2xl overflow-hidden">
                        <img 
                          src={plant.image} 
                          alt={plant.name} 
                          className="w-full h-auto"
                        />
                      </div>
                    </AnimatedElement>
                    
                    <AnimatedElement delay={0.3}>
                      <div className="bg-emerald-950/50 rounded-2xl p-5 mb-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                          <BookOpen className="h-5 w-5 mr-2 text-emerald-400" />
                          Interesting Facts
                        </h3>
                        <ul className="space-y-3">
                          {facts.map((fact, index) => (
                            <li key={index} className="flex items-start">
                              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mt-1.5 mr-2 flex-shrink-0"></span>
                              <span className="text-emerald-200 text-sm">{fact}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </AnimatedElement>
                    
                    <AnimatedElement delay={0.4}>
                      <div className="flex space-x-4">
                        <PlantLikeButton 
                          plantId={plant.id} 
                          className="flex-1 py-3 rounded-xl font-medium transition-all duration-300 bg-emerald-500/80 hover:bg-emerald-600 text-emerald-950"
                        />
                        <PlantShareButton 
                          plantName={plant.name} 
                          plantId={plant.id}
                          className="flex-1 py-4 rounded-xl font-medium transition-all duration-300 bg-transparent border border-emerald-500 hover:bg-emerald-800 text-emerald-400 text-lg"
                        />
                      </div>
                    </AnimatedElement>
                  </div>
                  
                  <div>
                    <AnimatedElement delay={0.2}>
                      <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{plant.name}</h1>
                      <p className="text-emerald-400 italic mb-4">{plant.scientificName}</p>
                      
                      <p className="text-emerald-200 mb-6">{plant.description}</p>
                    </AnimatedElement>
                    
                    <AnimatedElement delay={0.3}>
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
                    </AnimatedElement>
                    
                    <AnimatedElement delay={0.4}>
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
                    </AnimatedElement>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedElement>
        </div>

        <AnimatedElement delay={0.5}>
          {similarPlants.length > 0 ? (
            <PlantGrid 
              plants={similarPlants.filter(p => p.id !== plant.id)} 
              title="Similar Plants You Might Like"
              description="Browse other plants with similar care requirements"
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-emerald-400">Loading similar plants...</p>
            </div>
          )}
        </AnimatedElement>
      </div>
    </div>
  );
};

export default PlantDetailPage;