import React, { useEffect, useState, useRef } from 'react';
import '../styles/ribbonAnimation.css';
// Import the hero image
// @ts-ignore
import plantImage from '../../assets/hero/1.png';

// Simple animation component for a plant image with ribbon-style drawing effect
const PlantAnimation: React.FC = () => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const [textVisible, setTextVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);

  // Animation duration in milliseconds
  const ANIMATION_DURATION = 2000;
  
  // Setup Intersection Observer to trigger animation when scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animation loop using requestAnimationFrame
  useEffect(() => {
    if (!isVisible) return;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
      
      setAnimationProgress(progress);
      
      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        // Animation completed, show text
        setTextVisible(true);
      }
    };

    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [isVisible]);

  // Convert progress to SVG path for the clipping mask
  const getClipPath = () => {
    if (animationProgress === 0) return 'polygon(0% 0%, 0% 0%, 0% 0%)';
    if (animationProgress <= 0.25) {
      const p = animationProgress * 4; // Scale to 0-1 range for this segment
      return `polygon(0% 0%, ${p * 100}% 0%, 0% ${p * 25}%)`;
    } else if (animationProgress <= 0.5) {
      const p = (animationProgress - 0.25) * 4; // Scale to 0-1 range for this segment
      return `polygon(0% 0%, 100% 0%, ${p * 100}% ${p * 50}%, 0% 50%)`;
    } else if (animationProgress <= 0.75) {
      const p = (animationProgress - 0.5) * 4; // Scale to 0-1 range for this segment
      return `polygon(0% 0%, 100% 0%, 100% ${p * 75}%, 0% ${50 + p * 50}%)`;
    } else {
      const p = (animationProgress - 0.75) * 4; // Scale to 0-1 range for this segment
      return `polygon(0% 0%, 100% 0%, 100% ${75 + p * 25}%, 0% 100%)`;
    }
  };

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        height: '400px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <div 
        style={{
          position: 'relative',
          width: '300px',
          height: '300px',
        }}
      >
        {/* Image with clipping animation */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <img 
            src={plantImage} 
            alt="Plant Illustration"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              clipPath: getClipPath(),
              WebkitClipPath: getClipPath(),
              transition: 'clip-path 0.1s ease, -webkit-clip-path 0.1s ease',
            }}
          />
        </div>
        
        {/* Text overlay */}
        <div 
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            color: '#ffffff',
            fontSize: '28px',
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(0,0,0,0.6)',
            opacity: textVisible ? 1 : 0,
            transition: 'opacity 0.8s ease',
          }}
        >
          Plant ID
        </div>
      </div>
    </div>
  );
};

// Export as FlowerAnimation for backwards compatibility
const FlowerAnimation = PlantAnimation;
export default FlowerAnimation;
