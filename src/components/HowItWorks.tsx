import React from 'react';
import FlippingCard from './FlippingCard';
import '../styles/flipCard.css';
import { useDeviceContext } from '../contexts/DeviceContext';

const HowItWorks: React.FC = () => {
  const { isMobile, isTablet, isDesktop } = useDeviceContext();
  const isMobileOrTablet = isMobile || isTablet;
  
  return (
    <section className={`pt-0 pb-8 ${isDesktop ? 'pb-12' : ''} relative`}>
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-4">
          <h2 className={`${isMobileOrTablet ? 'text-2xl' : 'text-3xl md:text-4xl'} font-bold text-white mb-2`}>How It Works</h2>
          <div className="h-2 w-24 bg-yellow-400 mx-auto mb-3"></div>
          <p className="text-emerald-300 max-w-2xl mx-auto text-sm md:text-base">
            Identifying plants is easy with our three simple steps. Our AI-powered technology ensures accurate results in seconds.
          </p>
        </div>

        {/* Layout depends on device - One column for mobile/tablet, two columns for desktop */}
        <div className={`flex flex-col ${isDesktop ? 'md:flex-row' : ''} items-center`}>
          {/* Flower Animation - Only shown on desktop */}
          {isDesktop && (
            <div className="md:w-3/5 flex justify-center items-center" style={{ height: '500px' }}>
              <div className="transform scale-90 w-full h-full">
                <iframe 
                  src="../../../assets/flower/flower.html" 
                  title="Flower Animation" 
                  className="w-full h-full border-0 overflow-hidden bg-transparent rounded-2xl" 
                  style={{ 
                    pointerEvents: 'none', 
                    transform: 'scale(0.95)', 
                    marginTop: '-5px',
                    borderRadius: '24px',
                    height: '500px'
                  }}
                  frameBorder="0"
                  scrolling="no"
                />
              </div>
            </div>
          )}
          
          {/* Flipping Cards - Centered layout for mobile/tablet */}
          <div 
            className={`w-full ${isDesktop ? 'md:w-2/5 md:pl-6' : ''} flex items-center justify-center`}
            style={{ height: isDesktop ? '500px' : 'auto' }}
          >
            <FlippingCard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;