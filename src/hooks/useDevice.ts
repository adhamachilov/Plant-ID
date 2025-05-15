import { useMemo } from 'react';
import useMediaQuery from './useMediaQuery';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

/**
 * Hook that provides device type detection and responsive UI helpers
 * @returns Object with device type information and responsive helpers
 */
export const useDevice = () => {
  // Media queries for different device types
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  
  // Determine the current device type
  const deviceType = useMemo<DeviceType>(() => {
    if (isMobile) return 'mobile';
    if (isTablet) return 'tablet';
    return 'desktop';
  }, [isMobile, isTablet]);

  // Helper function for conditional rendering based on device type
  const renderForDevice = <T,>(config: {
    mobile?: T;
    tablet?: T;
    desktop: T;
  }): T => {
    if (isMobile && config.mobile !== undefined) return config.mobile;
    if (isTablet && config.tablet !== undefined) return config.tablet;
    return config.desktop;
  };

  return {
    isMobile,
    isTablet,
    isDesktop,
    deviceType,
    renderForDevice,
  };
};

export default useDevice;
