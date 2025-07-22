import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Grid3X3, Map, MapPin, Star, Ship, GraduationCap } from 'lucide-react';
import { SearchResult } from '@/types/location';
import { InteractiveMapView } from './InteractiveMapView';

interface SearchResultsViewProps {
  results: SearchResult[];
  totalResults: number;
  isLoading: boolean;
  onResultClick: (result: SearchResult) => void;
}

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  results,
  totalResults,
  isLoading,
  onResultClick,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const mapListings = results.map(result => ({
    id: result.id,
    type: result.type,
    name: result.name,
    location: result.location,
    price: result.price,
    image: result.image,
    coordinates: result.coordinates,
    available: result.available,
  }));

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-muted rounded animate-pulse w-32"></div>
          <div className="h-10 bg-muted rounded animate-pulse w-24"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-4 space-y-3">
              <div className="h-32 bg-muted rounded animate-pulse"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            {totalResults} {totalResults === 1 ? 'result' : 'results'} found
          </h2>
        </div>
        
        {/* View Toggle */}
        <div className="flex rounded-lg border">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="rounded-r-none"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('map')}
            className="rounded-l-none"
          >
            <Map className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results Content */}
      {viewMode === 'map' ? (
        <InteractiveMapView
          listings={mapListings}
          onListingClick={onResultClick}
          className="h-[600px]"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((result) => (
            <Card
              key={result.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onResultClick(result)}
            >
              <div className="p-4 space-y-3">
                {/* Image Placeholder */}
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  {result.type === 'boat' ? (
                    <Ship className="h-8 w-8 text-muted-foreground" />
                  ) : (
                    <GraduationCap className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold line-clamp-2">{result.name}</h3>
                    <Badge variant={result.type === 'boat' ? 'default' : 'secondary'}>
                      {result.type}
                    </Badge>
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {result.location}
                    {result.distance && (
                      <span className="ml-2">• {Math.round(result.distance)}km away</span>
                    )}
                  </div>

                  {result.rating && (
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{result.rating}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">
                      R{result.price.toLocaleString()}
                      {result.type === 'boat' ? '/day' : ''}
                    </span>
                    {result.available !== undefined && (
                      <Badge variant={result.available ? 'default' : 'secondary'}>
                        {result.available ? 'Available' : 'Booked'}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && totalResults === 0 && (
        <Card className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or expanding your search radius.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};