import React, { useEffect, useRef } from 'react';
import { useDeviceContext } from '../contexts/DeviceContext';

interface AnimatedBackgroundProps {
  variant?: 'default' | 'darker';
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ variant = 'default' }) => {
  const interactiveRef = useRef<HTMLDivElement>(null);
  const { deviceType } = useDeviceContext();
  const isMobileOrTablet = deviceType === 'mobile' || deviceType === 'tablet';
  
  // For interactive gradient movement - only on desktop
  useEffect(() => {
    if (isMobileOrTablet) return; // Skip animation for mobile/tablet devices
    
    const interBubble = interactiveRef.current;
    if (!interBubble) return;
    
    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;

    const move = () => {
      curX += (tgX - curX) / 20;
      curY += (tgY - curY) / 20;
      if (interBubble) {
        interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
      }
      requestAnimationFrame(move);
    };

    const handleMouseMove = (event: MouseEvent) => {
      tgX = event.clientX;
      tgY = event.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    move();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobileOrTablet]);

  // Adjust colors based on variant
  const gradientColors = variant === 'darker' ? {
    g1: 'rgba(13, 148, 103, 0.8)',  // Darker emerald
    g2: 'rgba(4, 120, 87, 0.8)',    // Darker emerald
    g3: 'rgba(5, 76, 56, 0.8)',     // Darker emerald
    g4: 'rgba(3, 96, 69, 0.8)',     // Darker emerald
    g5: 'rgba(16, 66, 36, 0.8)',    // Darker emerald
    interactive: 'rgba(41, 168, 122, 0.8)' // Darker interactive
  } : {
    g1: 'rgba(16, 185, 129, 0.8)',  // Default emerald
    g2: 'rgba(5, 150, 105, 0.8)',   // Default emerald
    g3: 'rgba(6, 95, 70, 0.8)',     // Default emerald
    g4: 'rgba(4, 120, 87, 0.8)',    // Default emerald
    g5: 'rgba(20, 83, 45, 0.8)',    // Default emerald
    interactive: 'rgba(52, 211, 153, 0.8)' // Default interactive
  };

  // Simple static background for mobile/tablet devices
  if (isMobileOrTablet) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden bg-emerald-950" style={{ backgroundColor: '#0F3D2F' }}>
        {/* Simple noise SVG filter - lighter for mobile/tablet */}
        <svg 
          viewBox="0 0 100vw 100vw"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full opacity-20 mix-blend-soft-light">
          <filter id="noiseFilterMobile">
            <feTurbulence 
              type="fractalNoise"
              baseFrequency="0.5"
              stitchTiles="stitch" />
          </filter>
          <rect
            width="100%"
            height="100%"
            filter="url(#noiseFilterMobile)" />
        </svg>
        
        {/* Simple gradient overlay */}
        <div className="absolute inset-0" 
             style={{ 
               background: `radial-gradient(circle at center, ${gradientColors.g1} 0, ${gradientColors.g1.replace(', 0.8', ', 0.3')} 70%, transparent 100%)`,
               mixBlendMode: 'soft-light',
             }}>                
        </div>
      </div>
    );
  }

  // Rich animated background for desktop
  return (
    <div className="absolute inset-0 z-0 gradient-bg overflow-hidden bg-emerald-950" style={{ backgroundColor: '#0F3D2F' }}>
      {/* Noise SVG filter */}
      <svg 
        viewBox="0 0 100vw 100vw"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full opacity-30 mix-blend-soft-light">
        <filter id="noiseFilter">
          <feTurbulence 
            type="fractalNoise"
            baseFrequency="0.6"
            stitchTiles="stitch" />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#noiseFilter)" />
      </svg>
      
      {/* SVG blur filter for gradients */}
      <svg xmlns="http://www.w3.org/2000/svg" className="hidden">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      
      {/* Gradient bubbles */}
      <div className="gradients-container absolute inset-0" style={{ filter: 'url(#goo) blur(40px)' }}>
        <div className="g1 absolute w-4/5 h-4/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-moveVertical" 
             style={{ 
               background: `radial-gradient(circle at center, ${gradientColors.g1} 0, ${gradientColors.g1.replace(', 0.8', ', 0')} 50%)`,
               mixBlendMode: 'hard-light',
               transformOrigin: 'center center'
             }}></div>
             
        <div className="g2 absolute w-4/5 h-4/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-moveInCircle" 
             style={{ 
               background: `radial-gradient(circle at center, ${gradientColors.g2} 0, ${gradientColors.g2.replace(', 0.8', ', 0')} 50%)`,
               mixBlendMode: 'hard-light',
               transformOrigin: 'calc(50% - 400px)'
             }}></div>
             
        <div className="g3 absolute w-4/5 h-4/5 top-[calc(50%-200px)] left-[calc(50%+300px)] animate-moveInCircleReverse" 
             style={{ 
               background: `radial-gradient(circle at center, ${gradientColors.g3} 0, ${gradientColors.g3.replace(', 0.8', ', 0')} 50%)`,
               mixBlendMode: 'hard-light',
               transformOrigin: 'calc(50% + 400px)'
             }}></div>
             
        <div className="g4 absolute w-4/5 h-4/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-moveHorizontal" 
             style={{ 
               background: `radial-gradient(circle at center, ${gradientColors.g4} 0, ${gradientColors.g4.replace(', 0.8', ', 0')} 50%)`,
               mixBlendMode: 'hard-light',
               transformOrigin: 'calc(50% - 200px)',
               opacity: 0.7
             }}></div>
             
        <div className="g5 absolute w-[160%] h-[160%] top-0 left-0 -translate-x-1/4 -translate-y-1/4 animate-moveInCircle" 
             style={{ 
               background: `radial-gradient(circle at center, ${gradientColors.g5} 0, ${gradientColors.g5.replace(', 0.8', ', 0')} 50%)`,
               mixBlendMode: 'hard-light',
               transformOrigin: 'calc(50% - 800px) calc(50% + 200px)'
             }}></div>
             
        {/* Interactive gradient that follows mouse movement */}
        <div 
          ref={interactiveRef}
          className="interactive absolute w-full h-full top-[-50%] left-[-50%]" 
          style={{ 
            background: `radial-gradient(circle at center, ${gradientColors.interactive} 0, ${gradientColors.interactive.replace(', 0.8', ', 0')} 50%)`,
            mixBlendMode: 'hard-light',
            opacity: 0.6
          }}>
        </div>
      </div>
    </div>
  );
};

export default AnimatedBackground;
