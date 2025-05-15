import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * Custom hook to generate and manage a persistent device ID
 * This is used for tracking likes without requiring user accounts
 */
export const useDeviceId = (): string => {
  const [deviceId, setDeviceId] = useState<string>('');
  
  useEffect(() => {
    // Try to get the existing device ID from localStorage
    const storedDeviceId = localStorage.getItem('plant-id-device-id');
    
    if (storedDeviceId) {
      // If found, use the existing ID
      setDeviceId(storedDeviceId);
    } else {
      // If not found, generate a new UUID and store it
      const newDeviceId = uuidv4();
      localStorage.setItem('plant-id-device-id', newDeviceId);
      setDeviceId(newDeviceId);
    }
  }, []);
  
  return deviceId;
};

export default useDeviceId;
