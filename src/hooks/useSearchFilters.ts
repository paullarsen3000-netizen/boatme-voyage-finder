import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface SearchFilters {
  query: string;
  location: string;
  boatType: string;
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: 'newest' | 'price_low' | 'price_high' | 'rating';
}

const defaultFilters: SearchFilters = {
  query: '',
  location: '',
  boatType: '',
  minPrice: null,
  maxPrice: null,
  sortBy: 'newest',
};

export function useSearchFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>(() => {
    // Initialize from URL params
    return {
      query: searchParams.get('q') || '',
      location: searchParams.get('location') || '',
      boatType: searchParams.get('type') || '',
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null,
      sortBy: (searchParams.get('sort') as SearchFilters['sortBy']) || 'newest',
    };
  });

  // Update URL params when filters change
  const updateSearchParams = useCallback((newFilters: SearchFilters) => {
    const params = new URLSearchParams();
    
    if (newFilters.query) params.set('q', newFilters.query);
    if (newFilters.location) params.set('location', newFilters.location);
    if (newFilters.boatType) params.set('type', newFilters.boatType);
    if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice.toString());
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice.toString());
    if (newFilters.sortBy !== 'newest') params.set('sort', newFilters.sortBy);

    setSearchParams(params);
  }, [setSearchParams]);

  const updateFilters = useCallback((updates: Partial<SearchFilters>) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    updateSearchParams(newFilters);
  }, [filters, updateSearchParams]);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return {
    filters,
    updateFilters,
    clearFilters,
  };
}