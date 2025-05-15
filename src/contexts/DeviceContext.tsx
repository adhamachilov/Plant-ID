import React, { createContext, useContext, ReactNode } from 'react';
import useDevice, { DeviceType } from '../hooks/useDevice';

// Define the context type
interface DeviceContextType {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceType: DeviceType;
  renderForDevice: <T,>(config: {
    mobile?: T;
    tablet?: T;
    desktop: T;
  }) => T;
}

// Create the context with default values
const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

// DeviceProvider props type
interface DeviceProviderProps {
  children: ReactNode;
}

// Provider component
export const DeviceProvider: React.FC<DeviceProviderProps> = ({ children }) => {
  const deviceData = useDevice();
  
  return (
    <DeviceContext.Provider value={deviceData}>
      {children}
    </DeviceContext.Provider>
  );
};

// Custom hook to use the device context
export const useDeviceContext = (): DeviceContextType => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDeviceContext must be used within a DeviceProvider');
  }
  return context;
};

export default DeviceContext;
