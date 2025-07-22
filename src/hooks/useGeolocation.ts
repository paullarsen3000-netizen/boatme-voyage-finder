import { useState, useEffect } from 'react';

interface GeolocationState {
  coordinates: {
    lat: number;
    lng: number;
  } | null;
  isLoading: boolean;
  error: string | null;
  isPermissionGranted: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    isLoading: false,
    error: null,
    isPermissionGranted: false,
  });

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser',
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          isLoading: false,
          error: null,
          isPermissionGranted: true,
        });
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = 'Location access denied by user';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = 'Location information is unavailable';
        } else if (error.code === error.TIMEOUT) {
          errorMessage = 'Location request timed out';
        }
        
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
          isPermissionGranted: false,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  return {
    ...state,
    getCurrentLocation,
  };
};