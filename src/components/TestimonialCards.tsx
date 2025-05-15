import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Avatar from './Avatar';
import { useDeviceContext } from '../contexts/DeviceContext';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar?: string;
}

interface TestimonialCardsProps {
  testimonials: Testimonial[];
}

const TestimonialCards: React.FC<TestimonialCardsProps> = ({ testimonials }) => {
  const { isMobile, isTablet } = useDeviceContext();
  const isMobileOrTablet = isMobile || isTablet;
  
  // Core state - control which card is on top and the order of cards
  const [deck, setDeck] = useState([...testimonials]);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Animation state - only for desktop version
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipedCard, setSwipedCard] = useState<null | {
    card: typeof testimonials[0];
    direction: 'left' | 'right';
    stage: 'moving' | 'returning';
  }>(null);
  
  // Interaction state - only for desktop version
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  
  // Refs
  const cardStackRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Constants - adjust for mobile
  const SWIPE_THRESHOLD = isMobileOrTablet ? 80 : 120;
  const ANIMATION_DURATION = isMobileOrTablet ? 350 : 450;
  const MAX_ROTATION = isMobileOrTablet ? 15 : 20;
  
  // Move to next card - simplified for mobile/tablet
  const nextCard = () => {
    if (isMobileOrTablet) {
      // Simple index-based navigation for mobile/tablet
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      return;
    }
    
    // Rich animation for desktop
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Get the card that's currently at the front of the deck
    const topCard = deck[0];
    
    // Create a new array without the top card
    const newDeck = [...deck.slice(1)];
    
    // Create a swiped card animation object
    setSwipedCard({
      card: topCard,
      direction: 'right',
      stage: 'moving'
    });
    
    // Wait for the animation to complete, then update the deck
    setTimeout(() => {
      // Put the top card at the back
      setDeck([...newDeck, topCard]);
      
      // Change the animation stage to returning (coming from back to the deck)
      setSwipedCard(prev => prev ? {
        ...prev,
        stage: 'returning' 
      } : null);
      
      // After the second animation completes, reset animation state
      setTimeout(() => {
        setSwipedCard(null);
        setIsAnimating(false);
      }, ANIMATION_DURATION);
    }, ANIMATION_DURATION);
  };
  
  // Move to previous card - simplified for mobile/tablet
  const prevCard = () => {
    if (isMobileOrTablet) {
      // Simple index-based navigation for mobile/tablet
      setActiveIndex((prevIndex) => 
        prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
      );
      return;
    }
    
    // Rich animation for desktop
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Get the card that's currently at the back of the deck
    const bottomCard = deck[deck.length - 1];
    
    // First put the bottom card at the top position, but make it appear to be swiping in
    setSwipedCard({
      card: bottomCard,
      direction: 'left',
      stage: 'returning'
    });
    
    // Wait for the animation to complete, then update the deck
    setTimeout(() => {
      // Create a new deck with the bottom card at the top
      setDeck([bottomCard, ...deck.slice(0, deck.length - 1)]);
      setSwipedCard(null);
      setIsAnimating(false);
    }, ANIMATION_DURATION);
  };
  
  // Handle mouse/touch drag start
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isAnimating || isMobileOrTablet) return; // Skip for mobile/tablet as we use simpler navigation
    
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStartX(clientX);
    setDragOffset(0);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };
  
  // Handle drag movement
  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || isAnimating || isMobileOrTablet) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const offset = clientX - dragStartX;
    setDragOffset(offset);
  };
  
  // Handle drag end
  const handleDragEnd = () => {
    if (!isDragging || isAnimating || isMobileOrTablet) return;
    setIsDragging(false);
    
    if (Math.abs(dragOffset) > SWIPE_THRESHOLD) {
      // Swipe was decisive enough to trigger a card change
      if (dragOffset > 0) {
        nextCard(); // Swipe right
      } else {
        prevCard(); // Swipe left
      }
    }
    
    // Reset drag offset (for when the swipe wasn't strong enough)
    setDragOffset(0);
  };
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevCard();
      } else if (e.key === 'ArrowRight') {
        nextCard();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOrTablet]);
  
  // Setup global mouse/touch event handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleDragMove(e as any);
    const handleTouchMove = (e: TouchEvent) => handleDragMove(e as any);
    const handleMouseUp = () => handleDragEnd();
    const handleTouchEnd = () => handleDragEnd();
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleTouchEnd);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, isAnimating]);

  const renderMobileCard = (card: Testimonial) => (
    <div className="w-full rounded-xl bg-white overflow-hidden shadow-xl transition-all duration-300 mb-4">
      <div className="p-5">
        <p className="text-gray-700 mb-5 relative">
          <span className="absolute top-0 left-0 text-emerald-400 text-6xl opacity-20 -translate-x-2 -translate-y-3">"</span>
          {card.content}
        </p>
        <div className="flex items-center pt-2 border-t border-gray-100">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-emerald-100 flex-shrink-0 mr-3">
            {card.avatar ? (
              <img 
                src={card.avatar} 
                alt={card.name} 
                className="h-full w-full object-cover"
              />
            ) : (
              <Avatar name={card.name} className="h-full w-full text-lg" />
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{card.name}</h3>
            <p className="text-sm text-gray-500">{card.role}</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobileOrTablet) {
    return (
      <div className="py-8 px-4">
        <div 
          className="relative w-full max-w-md mx-auto"
          role="region"
          aria-label="Testimonial carousel"
          tabIndex={0}
        >
          {/* Show only the current active card */}
          {renderMobileCard(testimonials[activeIndex])}
          
          {/* Simple Navigation */}
          <div className="flex justify-between items-center mt-4">
            <button 
              onClick={prevCard}
              className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            {/* Card Indicator Dots */}
            <div className="flex justify-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={`dot-${index}`}
                  className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-6 bg-emerald-500' : 'w-2 bg-emerald-300/50'}`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={nextCard}
              className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center py-4 sm:py-6">
      <div className="w-full max-w-xs sm:max-w-sm mx-auto">
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-6 sm:mb-10 text-center">What Our Users Say</h2>
        
        {/* Card Stack Container */}
        <div 
          ref={cardStackRef}
          className="relative h-[260px] sm:h-[280px] w-full mx-auto touch-none"
        >
          {/* Render visible cards in the stack (typically top 3) */}
          {deck.slice(0, 3).map((card, index) => {
            // Calculate z-index (top card has highest z-index)
            const zIndex = 100 - index;
            
            // Calculate styling for stacked effect
            const isTopCard = index === 0;
            const scale = 1 - index * 0.05; // Each card is 5% smaller than the one above
            const translateY = index * 6; // Each card is moved down by 6px
            const translateX = isTopCard ? dragOffset : 0; // Only top card moves horizontally when dragged
            const rotation = isTopCard && dragOffset ? (dragOffset / window.innerWidth) * MAX_ROTATION : 0;
            
            return (
              <div
                key={`deck-${card.id}`}
                className={`
                  absolute left-0 right-0 mx-auto w-[96%] max-w-md rounded-xl bg-white overflow-hidden shadow-xl select-none
                  transition-all ${isTopCard && isDragging ? '' : 'duration-300 ease-out'}
                `}
                style={{
                  zIndex,
                  transform: `
                    translateX(${translateX}px) 
                    translateY(${translateY}px) 
                    rotate(${rotation}deg) 
                    scale(${scale})
                  `
                }}
                onMouseDown={isTopCard ? handleDragStart : undefined}
                onTouchStart={isTopCard ? handleDragStart : undefined}
              >
                <div className="p-4 sm:p-6 pb-6 sm:pb-8">
                  <p className="text-gray-700 mb-4 sm:mb-6 relative text-sm sm:text-base">
                    <span className="absolute top-0 left-0 text-emerald-400 text-5xl sm:text-6xl opacity-20 -translate-x-2 -translate-y-3">"</span>
                    {card.content}
                  </p>
                  <div className="flex items-center pt-2 border-t border-gray-100 mt-2">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden bg-emerald-100 flex-shrink-0 mr-3 sm:mr-4">
                      {card.avatar ? (
                        <img 
                          src={card.avatar} 
                          alt={card.name} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Avatar name={card.name} className="h-full w-full text-lg sm:text-xl" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base">{card.name}</h3>
                      <p className="text-gray-500 text-xs sm:text-sm">{card.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Render the currently animated card (being moved to back or coming from back) */}
          {swipedCard && (
            <div
              className="absolute left-0 right-0 mx-auto w-[96%] max-w-md rounded-xl bg-white overflow-hidden shadow-xl select-none transition-all duration-300"
              style={{
                zIndex: swipedCard.stage === 'moving' ? 200 : 0, // Above everything when moving out, below everything when returning
                transform: swipedCard.stage === 'moving'
                  // Moving from top to out of screen
                  ? `translateX(${swipedCard.direction === 'right' ? '150%' : '-150%'}) rotate(${swipedCard.direction === 'right' ? 15 : -15}deg) scale(0.9)`
                  // Moving from out of screen to bottom of stack
                  : `translateX(${swipedCard.direction === 'right' ? '-150%' : '150%'}) translateY(12px) rotate(${swipedCard.direction === 'right' ? -5 : 5}deg) scale(0.9)`,
                opacity: swipedCard.stage === 'moving' ? 0.5 : 1
              }}
            >
              <div className="p-6 pb-8">
                <p className="text-gray-700 mb-6 relative">
                  <span className="absolute top-0 left-0 text-emerald-400 text-6xl opacity-20 -translate-x-2 -translate-y-3">"</span>
                  {swipedCard.card.content}
                </p>
                <div className="flex items-center pt-2 border-t border-gray-100">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-emerald-100 flex-shrink-0 mr-4">
                    {swipedCard.card.avatar ? (
                      <img 
                        src={swipedCard.card.avatar} 
                        alt={swipedCard.card.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Avatar name={swipedCard.card.name} className="h-full w-full text-xl" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{swipedCard.card.name}</h3>
                    <p className="text-white/90 mb-4 sm:mb-6 text-sm sm:text-base card-description">{swipedCard.card.content}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Render the currently animated card (being moved to back or coming from back) */}
        {swipedCard && (
          <div
            className="absolute left-0 right-0 mx-auto w-[96%] max-w-md rounded-xl bg-white overflow-hidden shadow-xl select-none transition-all duration-300"
            style={{
              zIndex: swipedCard.stage === 'moving' ? 200 : 0, // Above everything when moving out, below everything when returning
              transform: swipedCard.stage === 'moving'
                // Moving from top to out of screen
                ? `translateX(${swipedCard.direction === 'right' ? '150%' : '-150%'}) rotate(${swipedCard.direction === 'right' ? 15 : -15}deg) scale(0.9)`
                // Moving from out of screen to bottom of stack
                : `translateX(${swipedCard.direction === 'right' ? '-150%' : '150%'}) translateY(12px) rotate(${swipedCard.direction === 'right' ? -5 : 5}deg) scale(0.9)`,
              opacity: swipedCard.stage === 'moving' ? 0.5 : 1
            }}
          >
            <div className="p-6 pb-8">
              <p className="text-gray-700 mb-6 relative">
                <span className="absolute top-0 left-0 text-emerald-400 text-6xl opacity-20 -translate-x-2 -translate-y-3">"</span>
                {swipedCard.card.content}
              </p>
              <div className="flex items-center pt-2 border-t border-gray-100">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-emerald-100 flex-shrink-0 mr-4">
                  {swipedCard.card.avatar ? (
                    <img 
                      src={swipedCard.card.avatar} 
                      alt={swipedCard.card.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Avatar name={swipedCard.card.name} className="h-full w-full text-xl" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{swipedCard.card.name}</h3>
                  <p className="text-sm text-gray-500">{swipedCard.card.role}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
            {/* Arrow Navigation */}
      <div className="flex justify-between absolute left-0 right-0 top-1/2 -translate-y-3/4 px-4">
        <button 
          onClick={prevCard}
          className="p-2 rounded-full bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors duration-300"
          aria-label="Previous testimonial"
          disabled={isAnimating}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button 
          onClick={nextCard}
          className="p-2 rounded-full bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors duration-300"
          aria-label="Next testimonial"
          disabled={isAnimating}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      
      {/* Card Indicator Dots */}
      <div className="flex justify-center mt-8 space-x-2">
        {deck.map((card, index) => (
          <div
            key={`dot-${card.id}`}
            className={`h-2 rounded-full transition-all duration-300 ${index === 0 ? 'w-6 bg-emerald-500' : 'w-2 bg-emerald-300/50'}`}
          />
        ))}
      </div>
      
      {/* Interaction Hint */}
      <div className="absolute bottom-0 left-0 right-0 text-center text-sm text-emerald-400/70">
        Swipe cards or use arrow keys <span className="inline-block px-2 py-0.5 mx-1 bg-emerald-900/30 rounded text-xs">←</span><span className="inline-block px-2 py-0.5 mx-1 bg-emerald-900/30 rounded text-xs">→</span>
      </div>
    </div>
  );
};

export default TestimonialCards;
