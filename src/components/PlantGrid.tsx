import React from 'react';
import PlantCard, { PlantInfo } from './PlantCard';
import PlantCardCarousel from './PlantCardCarousel';
import { useDeviceContext } from '../contexts/DeviceContext';

interface PlantGridProps {
  plants: PlantInfo[];
  title?: string;
  description?: string;
  featured?: boolean;
}

const PlantGrid: React.FC<PlantGridProps> = ({ 
  plants, 
  title, 
  description,
  featured = false
}) => {
  const { isMobile, isTablet } = useDeviceContext();
  
  // Use carousel for mobile/tablet views
  if (isMobile || isTablet) {
    return <PlantCardCarousel plants={plants} title={title} description={description} />;
  }
  
  // Use grid layout for desktop
  return (
    <section className="py-16 pt-10">
      <div className="container mx-auto px-4">
        {(title || description) && (
          <div className="text-center mb-28" style={{ position: 'relative', zIndex: 10 }}>
            {title && <h2 className="text-4xl font-bold text-white mb-5">{title}</h2>}
            {description && <p className="text-emerald-300 max-w-2xl mx-auto text-lg mb-0">{description}</p>}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 gap-y-20 mx-auto mt-0 justify-items-center" style={{ position: 'relative', zIndex: 5 }}>
          {plants.map((plant) => (
            <PlantCard 
              key={plant.id} 
              plant={plant}
              featured={featured}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlantGrid;