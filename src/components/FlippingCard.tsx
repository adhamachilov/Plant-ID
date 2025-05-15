import React, { useState, useEffect } from 'react';
import { Camera, Search, Leaf, ChevronRight, ChevronLeft } from 'lucide-react';
import { useDeviceContext } from '../contexts/DeviceContext';
import '../styles/flipCard.css';

interface CardContent {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const FlippingCard: React.FC = () => {
  const { isMobile, isTablet } = useDeviceContext();
  const isMobileOrTablet = isMobile || isTablet;
  
  // Enhanced state management for animations
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  
  const cards: CardContent[] = [
    {
      icon: <Camera className="h-8 w-8 text-white" />,
      title: 'Take a Photo',
      description: 'Use your camera to snap a clear photo of any plant you want to identify.',
      color: 'from-emerald-600 to-emerald-500'
    },
    {
      icon: <Search className="h-8 w-8 text-white" />,
      title: 'AI Analysis',
      description: 'Our advanced AI analyzes the image, comparing it with our database of thousands of plant species.',
      color: 'from-emerald-700 to-emerald-600'
    },
    {
      icon: <Leaf className="h-8 w-8 text-white" />,
      title: 'Get Results',
      description: 'Receive detailed information about your plant, including care tips and fun facts.',
      color: 'from-emerald-800 to-emerald-700'
    }
  ];

  // Effect to handle the fading animation after flipping
  useEffect(() => {
    if (nextIndex !== null && !isFlipping) {
      setIsFading(true);
      const timer = setTimeout(() => {
        setCurrentIndex(nextIndex);
        setNextIndex(null);
        setIsFading(false);
      }, 300); // Short fade animation
      
      return () => clearTimeout(timer);
    }
  }, [nextIndex, isFlipping]);

  // Move to the next card with rotation and fade animation
  const nextCard = () => {
    if (currentIndex < cards.length - 1 && !isFlipping && !isFading) {
      if (isMobileOrTablet) {
        // Simple transition for mobile
        setCurrentIndex(currentIndex + 1);
      } else {
        // Start flipping animation
        setIsFlipping(true);
        setDirection('next');
        
        // Store the next index
        setNextIndex(currentIndex + 1);
        
        // End the flipping animation and start fading
        setTimeout(() => {
          setIsFlipping(false);
        }, 600); // Duration of flip animation
      }
    }
  };

  // Move to the previous card with rotation and fade animation
  const prevCard = () => {
    if (currentIndex > 0 && !isFlipping && !isFading) {
      if (isMobileOrTablet) {
        // Simple transition for mobile
        setCurrentIndex(currentIndex - 1);
      } else {
        // Start flipping animation
        setIsFlipping(true);
        setDirection('prev');
        
        // Store the previous index
        setNextIndex(currentIndex - 1);
        
        // End the flipping animation and start fading
        setTimeout(() => {
          setIsFlipping(false);
        }, 600); // Duration of flip animation
      }
    }
  };

  // Simple card for mobile devices with improved transitions
  const renderMobileCard = () => (
    <div className="relative overflow-hidden rounded-xl" style={{ height: '300px' }}>
      <div 
        className={`p-5 bg-gradient-to-r ${cards[currentIndex].color} h-full transition-all duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}
      >
        <div className="flex flex-col items-center text-center h-full">
          <div className="mb-3 bg-white/20 p-3 rounded-full">
            {cards[currentIndex].icon}
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{cards[currentIndex].title}</h3>
          <p className="text-white/90 mb-4 text-sm">{cards[currentIndex].description}</p>
          
          <div className="flex justify-between w-full px-2 absolute bottom-4 left-0 right-0">
            {currentIndex > 0 && (
              <button 
                onClick={prevCard}
                className="p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors duration-300 focus:outline-none"
                aria-label="Previous Card"
                disabled={isFlipping || isFading}
              >
                <ChevronLeft className="h-4 w-4 text-white" />
              </button>
            )}
            
            <div className="flex-1" />
            
            {currentIndex < cards.length - 1 && (
              <button 
                onClick={nextCard}
                className="p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors duration-300 focus:outline-none"
                aria-label="Next Card"
                disabled={isFlipping || isFading}
              >
                <ChevronRight className="h-4 w-4 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced desktop card with flip animation and text fading effects
  const renderDesktopCard = () => {
    // Generate classes for the animations
    const flipClass = isFlipping ? (direction === 'next' ? 'flipping' : 'flipping-back') : '';
    const currentCard = cards[currentIndex];
    
    return (
      <div className="flip-card">
        <div className={`flip-card-container ${flipClass}`}>
          {/* The card face */}
          <div 
            className={`flip-card-side flip-card-front p-5 bg-gradient-to-r ${currentCard.color}`}
          >
            <div className="flex flex-col items-center text-center h-full">
              {/* Apply card-content-fade-in class for staggered text animations */}
              <div className={`w-full ${isFlipping || isFading ? '' : 'card-content-fade-in'}`}>
                <div className="mb-3 bg-white/20 p-3 rounded-full mx-auto w-fit card-icon">
                  {currentCard.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 card-title">{currentCard.title}</h3>
                <p className="text-white/90 mb-4 text-sm card-description">{currentCard.description}</p>
              </div>
              
              <div className="flex justify-between w-full px-2 mt-auto mb-2 card-buttons">
                {currentIndex > 0 && (
                  <button 
                    onClick={prevCard}
                    className="p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors duration-300 focus:outline-none"
                    aria-label="Previous Card"
                    disabled={isFlipping || isFading}
                  >
                    <ChevronLeft className="h-4 w-4 text-white" />
                  </button>
                )}
                
                <div className="flex-1" />
                
                {currentIndex < cards.length - 1 && (
                  <button 
                    onClick={nextCard}
                    className="p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors duration-300 focus:outline-none"
                    aria-label="Next Card"
                    disabled={isFlipping || isFading}
                  >
                    <ChevronRight className="h-4 w-4 text-white" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="w-full flex flex-col items-center justify-center py-4">
      <div className="w-full max-w-xs mx-auto">
        {isMobileOrTablet ? renderMobileCard() : renderDesktopCard()}
        
        {/* Card indicator dots */}
        <div className="flex justify-center space-x-2 mt-3">
          {cards.map((_, index) => (
            <div 
              key={index} 
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-5 bg-emerald-400' : 'w-2 bg-emerald-800/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlippingCard;
