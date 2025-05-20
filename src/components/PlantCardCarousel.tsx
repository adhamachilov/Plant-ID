import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PlantCard, { PlantInfo } from './PlantCard';

interface PlantCardCarouselProps {
  plants: PlantInfo[];
  title?: string;
  description?: string;
}

const PlantCardCarousel: React.FC<PlantCardCarouselProps> = ({ 
  plants, 
  title, 
  description 
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchThreshold = 50; // Minimum swipe distance to trigger slide

  // Handle next and previous slide actions
  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex === plants.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? plants.length - 1 : prevIndex - 1));
  };

  // Touch event handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;

    if (Math.abs(diffX) > touchThreshold) {
      if (diffX > 0) {
        // Swipe left, go to next slide
        nextSlide();
      } else {
        // Swipe right, go to previous slide
        prevSlide();
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  // Get visible cards including the center card and its adjacent cards
  const getVisibleCards = () => {
    const result = [];
    
    // Previous card (or the last card if active is first)
    const prevIndex = activeIndex === 0 ? plants.length - 1 : activeIndex - 1;
    
    // Next card (or the first card if active is last)
    const nextIndex = activeIndex === plants.length - 1 ? 0 : activeIndex + 1;
    
    // Return visible cards with indexes: [prev, active, next]
    return [
      { index: prevIndex, plant: plants[prevIndex], position: 'left' },
      { index: activeIndex, plant: plants[activeIndex], position: 'center' },
      { index: nextIndex, plant: plants[nextIndex], position: 'right' },
    ];
  };

  return (
    <section className="py-8 overflow-hidden">
      <div className="container mx-auto px-4">
        {(title || description) && (
          <div className="text-center mb-12">
            {title && <h2 className="text-3xl font-bold text-white mb-3">{title}</h2>}
            {description && <p className="text-emerald-300 max-w-2xl mx-auto">{description}</p>}
          </div>
        )}

        <div 
          className="relative py-10"
          ref={carouselRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Cards container */}
          <div className="flex justify-center items-center min-h-[500px] relative">
            {getVisibleCards().map(({ index, plant, position }) => (
              <div 
                key={plant.id} 
                className={`absolute transition-all duration-500 ease-in-out z-20 ${
                  position === 'center' ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <PlantCard plant={plant} featured={false} />
              </div>
            ))}
          </div>

          {/* Navigation buttons */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-emerald-800/80 hover:bg-emerald-700 text-white rounded-full p-2 z-30"
            aria-label="Previous card"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-emerald-800/80 hover:bg-emerald-700 text-white rounded-full p-2 z-30"
            aria-label="Next card"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {plants.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === index 
                    ? 'w-8 bg-emerald-500' 
                    : 'w-2.5 bg-emerald-800/50 hover:bg-emerald-700/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* View All button */}
          <div className="flex justify-center mt-8">
            <Link 
              to="/plants" 
              className="inline-flex items-center justify-center bg-emerald-700/40 hover:bg-emerald-600/70 text-emerald-300 hover:text-white text-base font-medium transition-all duration-300 gap-1 py-2.5 px-7 rounded-full border border-emerald-500/40 backdrop-blur-sm"
            >
              <span>View All Plants</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="m9 18 6-6-6-6"/></svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlantCardCarousel;
