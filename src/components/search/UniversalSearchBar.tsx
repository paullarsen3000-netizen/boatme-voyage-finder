import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation, Search } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { toast } from 'sonner';

interface SearchSuggestion {
  id: string;
  name: string;
  type: 'city' | 'dam' | 'river' | 'province';
  province: string;
  coordinates?: { lat: number; lng: number };
}

interface UniversalSearchBarProps {
  placeholder?: string;
  onSearch: (query: string, location?: { lat: number; lng: number }) => void;
  onLocationSelect?: (suggestion: SearchSuggestion) => void;
  className?: string;
  showLocationButton?: boolean;
}

// Mock location data - would be replaced with real API
const mockSuggestions: SearchSuggestion[] = [
  { id: '1', name: 'Cape Town', type: 'city', province: 'Western Cape', coordinates: { lat: -33.9249, lng: 18.4241 } },
  { id: '2', name: 'Durban', type: 'city', province: 'KwaZulu-Natal', coordinates: { lat: -29.8587, lng: 31.0218 } },
  { id: '3', name: 'Johannesburg', type: 'city', province: 'Gauteng', coordinates: { lat: -26.2041, lng: 28.0473 } },
  { id: '4', name: 'Hartbeespoort Dam', type: 'dam', province: 'North West', coordinates: { lat: -25.7461, lng: 27.8890 } },
  { id: '5', name: 'Vaal Dam', type: 'dam', province: 'Free State', coordinates: { lat: -26.8738, lng: 28.1120 } },
  { id: '6', name: 'Albert Falls Dam', type: 'dam', province: 'KwaZulu-Natal', coordinates: { lat: -29.4167, lng: 30.2833 } },
  { id: '7', name: 'Gariep Dam', type: 'dam', province: 'Free State', coordinates: { lat: -30.6333, lng: 25.5167 } },
  { id: '8', name: 'Orange River', type: 'river', province: 'Northern Cape', coordinates: { lat: -28.7282, lng: 17.0847 } },
];

export const UniversalSearchBar: React.FC<UniversalSearchBarProps> = ({
  placeholder = "Search by city, dam, or water body...",
  onSearch,
  onLocationSelect,
  className = "",
  showLocationButton = true,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { getCurrentLocation, isLoading: isGettingLocation, coordinates } = useGeolocation();

  const handleInputChange = (value: string) => {
    setQuery(value);
    
    if (value.length > 1) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.name.toLowerCase().includes(value.toLowerCase()) ||
        suggestion.province.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);
    onLocationSelect?.(suggestion);
    onSearch(suggestion.name, suggestion.coordinates);
  };

  const handleUseMyLocation = () => {
    getCurrentLocation();
  };

  React.useEffect(() => {
    if (coordinates) {
      toast.success('Location detected successfully');
      onSearch('Current Location', coordinates);
    }
  }, [coordinates, onSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder={placeholder}
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => query.length > 1 && setShowSuggestions(true)}
              className="pl-10 pr-4"
            />
          </div>
          
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-background border border-border rounded-md shadow-lg z-50 mt-1">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="px-4 py-3 hover:bg-accent cursor-pointer flex items-center gap-2"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{suggestion.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)} in {suggestion.province}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {showLocationButton && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleUseMyLocation}
            disabled={isGettingLocation}
            className="shrink-0"
          >
            <Navigation className={`h-4 w-4 ${isGettingLocation ? 'animate-spin' : ''}`} />
          </Button>
        )}
        
        <Button type="submit" className="shrink-0">
          <Search className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};