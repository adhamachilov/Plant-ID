import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  tags?: string[];
}

interface FeatureCardCarouselProps {
  features: FeatureCardProps[];
}

const FeatureCardCarousel: React.FC<FeatureCardCarouselProps> = ({ features }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Handle next and previous slide actions
  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex === features.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? features.length - 1 : prevIndex - 1));
  };

  // Set up touch swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: () => nextSlide(),
    onSwipedRight: () => prevSlide(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: false
  });

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  // Get visible cards (previous, active, next)
  const getVisibleCards = () => {
    // Previous card (or the last card if active is first)
    const prevIndex = activeIndex === 0 ? features.length - 1 : activeIndex - 1;
    
    // Next card (or the first card if active is last)
    const nextIndex = activeIndex === features.length - 1 ? 0 : activeIndex + 1;
    
    return [
      { index: prevIndex, feature: features[prevIndex], position: 'left' },
      { index: activeIndex, feature: features[activeIndex], position: 'center' },
      { index: nextIndex, feature: features[nextIndex], position: 'right' },
    ];
  };

  return (
    <div className="relative py-6" {...handlers}>
      {/* Cards container */}
      <div className="flex justify-center items-center min-h-[380px] relative">
        {getVisibleCards().map(({ index, feature, position }) => (
          <div 
            key={index} 
            className={`absolute transition-opacity duration-500 ease-in-out z-20 ${
              position === 'center' ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="bg-emerald-900/40 backdrop-blur-xl rounded-2xl p-5 border border-emerald-500/30 w-[260px] h-[300px] flex flex-col border-line-animation featured-line-animation">
              <span></span>
              <span></span>
              <div className="stacked-card-header mb-3">
                <div className="icon-wrapper mb-4 bg-emerald-950/50 p-3 inline-block rounded-xl">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              </div>
              
              <p className="text-emerald-100 text-sm flex-grow">
                {feature.description}
              </p>
              
              {feature.tags && feature.tags.length > 0 && (
                <div className="card-tags mt-3">
                  {feature.tags.map((tag, i) => (
                    <span key={i} className="text-xs px-3 py-1 bg-emerald-800/50 rounded-full text-emerald-300 mr-2 inline-block mb-1">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button 
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-emerald-800/80 hover:bg-emerald-700 text-white rounded-full p-2 z-30"
        aria-label="Previous feature"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-800/80 hover:bg-emerald-700 text-white rounded-full p-2 z-30"
        aria-label="Next feature"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots indicator */}
      <div className="flex justify-center mt-4 gap-1.5">
        {features.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeIndex === index 
                ? 'w-5 bg-emerald-500' 
                : 'w-2 bg-emerald-800/50 hover:bg-emerald-700/70'
            }`}
            aria-label={`Go to feature ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeatureCardCarousel;
