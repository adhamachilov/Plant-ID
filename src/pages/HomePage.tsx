import React from 'react';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import FeatureHighlights from '../components/FeatureHighlights';
import PlantGrid from '../components/PlantGrid';
import { getFeaturedPlants } from '../services/plantService';
import AnimatedElement from '../components/AnimatedElement';

const HomePage: React.FC = () => {
  const popularPlants = getFeaturedPlants(4);

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10">
        <AnimatedElement>
          <Hero />
        </AnimatedElement>
        
        <AnimatedElement delay={0.2} className="pt-0 pb-0 mt-0 md:mt-0">
          <PlantGrid 
            plants={popularPlants} 
            title="Popular Plants"
            description="Our community's favorite plants to grow at home"
          />
        </AnimatedElement>
        
        <AnimatedElement delay={0.4}>
          <HowItWorks />
        </AnimatedElement>
        
        <AnimatedElement delay={0.6}>
          <FeatureHighlights />
        </AnimatedElement>
      </div>
    </div>
  );
};

export default HomePage;