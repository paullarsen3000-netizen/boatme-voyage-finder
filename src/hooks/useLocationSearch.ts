import { useState, useCallback, useMemo } from 'react';
import { SearchResult, SearchFilters, Coordinates } from '@/types/location';

// Mock search data - would be replaced with API calls
const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    type: 'boat',
    name: 'Luxury Speedboat',
    location: 'Hartbeespoort Dam',
    province: 'North West',
    coordinates: { lat: -25.7461, lng: 27.8890 },
    price: 1500,
    available: true,
    rating: 4.8,
    waterBody: 'Hartbeespoort Dam',
  },
  {
    id: '2',
    type: 'boat',
    name: 'Family Pontoon',
    location: 'Vaal Dam',
    province: 'Free State',
    coordinates: { lat: -26.8738, lng: 28.1120 },
    price: 800,
    available: true,
    rating: 4.5,
    waterBody: 'Vaal Dam',
  },
  {
    id: '3',
    type: 'course',
    name: 'PWC License Course',
    location: 'Cape Town',
    province: 'Western Cape',
    coordinates: { lat: -33.9249, lng: 18.4241 },
    price: 2500,
    available: true,
    rating: 4.9,
  },
  {
    id: '4',
    type: 'boat',
    name: 'Sport Fishing Boat',
    location: 'Albert Falls Dam',
    province: 'KwaZulu-Natal',
    coordinates: { lat: -29.4167, lng: 30.2833 },
    price: 1200,
    available: false,
    rating: 4.6,
    waterBody: 'Albert Falls Dam',
  },
  {
    id: '5',
    type: 'course',
    name: 'Day Skipper Course',
    location: 'Durban',
    province: 'KwaZulu-Natal',
    coordinates: { lat: -29.8587, lng: 31.0218 },
    price: 3500,
    available: true,
    rating: 4.7,
  },
];

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (point1: Coordinates, point2: Coordinates): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLng = (point2.lng - point1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const useLocationSearch = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    radius: 50,
    province: 'all-provinces',
    listingType: 'all-types',
    waterBody: 'all-water-bodies',
  });
  const [isLoading, setIsLoading] = useState(false);

  const filteredResults = useMemo(() => {
    let results = [...mockSearchResults];

    // Apply text search
    if (filters.query) {
      results = results.filter(result => 
        result.name.toLowerCase().includes(filters.query!.toLowerCase()) ||
        result.location.toLowerCase().includes(filters.query!.toLowerCase()) ||
        result.province.toLowerCase().includes(filters.query!.toLowerCase())
      );
    }

    // Apply listing type filter
    if (filters.listingType !== 'all-types') {
      const type = filters.listingType === 'boats' ? 'boat' : 'course';
      results = results.filter(result => result.type === type);
    }

    // Apply province filter
    if (filters.province !== 'all-provinces') {
      results = results.filter(result => result.province === filters.province);
    }

    // Apply water body filter
    if (filters.waterBody !== 'all-water-bodies') {
      results = results.filter(result => result.waterBody === filters.waterBody);
    }

    // Apply distance filter
    if (filters.centerPoint) {
      results = results
        .map(result => ({
          ...result,
          distance: calculateDistance(filters.centerPoint!, result.coordinates),
        }))
        .filter(result => result.distance! <= filters.radius)
        .sort((a, b) => a.distance! - b.distance!);
    }

    return results;
  }, [filters]);

  const search = useCallback(async (query: string, location?: Coordinates) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setFilters(prev => ({
      ...prev,
      query,
      centerPoint: location,
    }));
    
    setIsLoading(false);
  }, []);

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      radius: 50,
      province: 'all-provinces',
      listingType: 'all-types',
      waterBody: 'all-water-bodies',
    });
  }, []);

  const clearLocation = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      centerPoint: undefined,
      query: undefined,
    }));
  }, []);

  return {
    results: filteredResults,
    filters,
    isLoading,
    search,
    updateFilters,
    clearFilters,
    clearLocation,
    totalResults: filteredResults.length,
  };
};