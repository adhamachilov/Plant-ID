import React from 'react';
import { Camera, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDeviceContext } from '../contexts/DeviceContext';

// Make sure 3D model is copied to public folder
const CopyBeeModel = () => {
  // This is just a client-side reminder - the actual copying should be done
  // by your build process or manually
  console.log('Remember to ensure bee model is in public/3d/ folder');
  
  return null;
};

const Hero: React.FC = () => {
  const { isMobile, isTablet, isDesktop } = useDeviceContext();
  const isMobileOrTablet = isMobile || isTablet;
  
  return (
    <div className="relative pt-20 pb-0 md:pt-16 md:pb-0">
      {/* Reminder to copy 3D model */}
      <CopyBeeModel />

      <div className="container mx-auto px-4 relative z-10">
        <div className={`grid grid-cols-1 ${isDesktop ? 'md:grid-cols-2' : ''} gap-8 items-center ${isMobileOrTablet ? 'mt-4' : '-mt-2'}`}>
          {/* Hero Text */}
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight animate-fadeIn">
              Identify Any Plant <span className="text-emerald-400">Instantly</span>
            </h1>
            <p className="text-lg md:text-xl text-emerald-100 mb-8 max-w-md animate-fadeIn animation-delay-200">
              Take a photo of any plant and our AI will identify it in seconds. Get detailed information, care tips, and interesting facts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fadeIn animation-delay-400">
              <Link
                to="/identify"
                className="flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-emerald-950 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-emerald-500/30"
              >
                <Camera className="h-5 w-5" />
                <span>Identify Now</span>
              </Link>
              <Link
                to="/plants"
                className="flex items-center justify-center space-x-2 bg-transparent border border-emerald-500 hover:bg-emerald-950 text-emerald-400 px-6 py-3 rounded-full font-medium transition-all duration-300"
              >
                <span>Browse Plants</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
          {/* 3D Bee Model container - only visible on desktop */}
          {isDesktop && (
            <div className="relative" style={{ height: "600px", position: "relative" }}>
              <iframe 
                src="/transparent-bee.html" 
                title="3D Bee Model"
                className="absolute"
                style={{
                  width: "120%", /* Increased from 100% to 120% */
                  height: "850px", /* Increased from 750px to 850px */
                  border: "none",
                  background: "transparent",
                  pointerEvents: "auto", // Enable interaction with the bee
                  top: "-230px", /* Adjusted to position bee slightly lower */
                  left: "-20%" /* Shifts 20% to the left */
                }}
                frameBorder="0"
                scrolling="no"
                allowTransparency={true}
              ></iframe>
            </div>
          )}
          
          {/* No image needed for mobile/tablet - removed to clean up the UI */}
        </div>
      </div>
    </div>
  );
};

export default Hero;