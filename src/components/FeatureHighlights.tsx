import React from 'react';
import { BookOpen, Droplets, Sun, Compass, Thermometer } from 'lucide-react';
import { useDeviceContext } from '../contexts/DeviceContext';
import FeatureCardCarousel from './FeatureCardCarousel';

export interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  tags?: string[];
}

const features: FeatureItem[] = [
  {
    icon: <BookOpen className="h-10 w-10 text-emerald-500" />,
    title: 'Detailed Information',
    description: 'Get comprehensive data about any plant, including scientific name, common names, and family.',
    tags: ['Care Guide']
  },
  {
    icon: <Droplets className="h-10 w-10 text-emerald-500" />,
    title: 'Care Instructions',
    description: 'Learn exactly how to care for your plant with watering, light, and soil recommendations.',
    tags: ['Water Tips']
  },
  {
    icon: <Sun className="h-10 w-10 text-emerald-500" />,
    title: 'Growth Conditions',
    description: 'Understand optimal growing conditions including light requirements and humidity levels.',
    tags: ['Essential', 'Featured']
  },
  {
    icon: <Compass className="h-10 w-10 text-emerald-500" />,
    title: 'Native Habitat',
    description: 'Discover where your plant originates from and its natural growing environment.',
    tags: ['Geography']
  },
  {
    icon: <Thermometer className="h-10 w-10 text-emerald-500" />,
    title: 'Fun Facts',
    description: 'Impress your friends with interesting trivia and unique facts about your plants.',
    tags: ['Plant Trivia']
  }
];

const FeatureHighlights: React.FC = () => {
  const { isMobile, isTablet, isDesktop } = useDeviceContext();
  const isMobileOrTablet = isMobile || isTablet;
  return (
    <section className="pt-8 pb-4 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything You Need to Know</h2>
          <p className="text-emerald-300 max-w-2xl mx-auto">
            Our AI-powered plant identification gives you more than just a name. 
            Get complete insights about your plants with a single photo.
          </p>
        </div>

        {/* Use carousel for mobile/tablet */}
        {isMobileOrTablet ? (
          <FeatureCardCarousel features={features} />
        ) : (
          /* Desktop stacked cards layout */
          <div className="flex justify-center items-center">
            <div className="flex flex-wrap justify-center max-w-[1200px] mx-auto relative pt-10 pb-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  style={{
                    zIndex: index === 2 ? 30 : 20 - Math.abs(index - 2),
                    marginLeft: index > 0 ? '-30px' : '0',
                    transform: `translateY(${index === 2 ? '-20px' : '0'})`
                  }}
                  className={`stacked-card bg-emerald-900/40 backdrop-blur-xl rounded-2xl p-6 border-line-animation ${
                    index === 2 ? 'w-[260px] md:w-[280px] featured-line-animation border border-emerald-400/30' : 'w-[220px] md:w-[240px] border border-emerald-700/50'
                  } flex flex-col h-[340px] md:h-[360px]`}
                >
                  <div className="stacked-card-header mb-4">
                    <div className="icon-wrapper mb-6 bg-emerald-950/50 p-4 inline-block rounded-xl">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  </div>
                  
                  <p className={`${index === 2 ? 'text-emerald-100' : 'text-emerald-200'} flex-grow`}>
                    {feature.description}
                  </p>
                  
                  <div className="card-tags mt-4">
                    {feature.tags && feature.tags.map((tag, i) => (
                      <span key={i} className="text-xs px-3 py-1 bg-emerald-800/50 rounded-full text-emerald-300 mr-2 inline-block mb-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Empty spans needed for border animation */}
                  <span></span>
                  <span></span>
                </div>
              ))}
            </div>
          </div>
        )}


      </div>
    </section>
  );
};

export default FeatureHighlights;