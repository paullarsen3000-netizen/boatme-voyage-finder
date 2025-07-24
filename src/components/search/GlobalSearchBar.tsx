import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Filter } from 'lucide-react';
import { useSearchFilters } from '@/hooks/useSearchFilters';

interface GlobalSearchBarProps {
  onToggleFilters?: () => void;
  showFiltersButton?: boolean;
}

export function GlobalSearchBar({ onToggleFilters, showFiltersButton = true }: GlobalSearchBarProps) {
  const { filters, updateFilters } = useSearchFilters();

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search boats, courses, or destinations..."
          value={filters.query}
          onChange={(e) => updateFilters({ query: e.target.value })}
          className="pl-10 pr-4"
        />
      </div>
      
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Location"
          value={filters.location}
          onChange={(e) => updateFilters({ location: e.target.value })}
          className="pl-10 pr-4 min-w-[200px]"
        />
      </div>

      {showFiltersButton && (
        <Button 
          variant="outline" 
          onClick={onToggleFilters}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      )}
    </div>
  );
}