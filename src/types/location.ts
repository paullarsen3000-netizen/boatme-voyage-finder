export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationData {
  id: string;
  name: string;
  type: 'city' | 'dam' | 'river' | 'province';
  province: string;
  coordinates: Coordinates;
  waterBodies?: string[];
}

export interface SearchResult {
  id: string;
  type: 'boat' | 'course';
  name: string;
  location: string;
  province: string;
  coordinates: Coordinates;
  price: number;
  image?: string;
  available?: boolean;
  distance?: number; // in km from search center
  rating?: number;
  description?: string;
  waterBody?: string;
}

export interface SearchFilters {
  radius: number;
  province: string;
  listingType: string;
  waterBody: string;
  centerPoint?: Coordinates;
  query?: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  filters: SearchFilters;
  center?: Coordinates;
}