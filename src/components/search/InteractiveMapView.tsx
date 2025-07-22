import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Maximize2, MapPin, Ship, GraduationCap } from 'lucide-react';

interface MapListing {
  id: string;
  type: 'boat' | 'course';
  name: string;
  location: string;
  price: number;
  image?: string;
  coordinates: { lat: number; lng: number };
  available?: boolean;
}

interface InteractiveMapViewProps {
  listings: MapListing[];
  onListingClick: (listing: MapListing) => void;
  className?: string;
}

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  listings,
  onListingClick,
  className = "",
}) => {
  const [selectedListing, setSelectedListing] = useState<MapListing | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock map center (roughly center of South Africa)
  const mapCenter = { lat: -28.5, lng: 24.5 };

  // Calculate pin positions relative to map container
  const getMarkerPosition = (coordinates: { lat: number; lng: number }) => {
    // Simple conversion for demo - in real implementation would use proper map projection
    const latPercent = ((mapCenter.lat - coordinates.lat) / 10) * 50 + 50;
    const lngPercent = ((coordinates.lng - mapCenter.lng) / 10) * 50 + 50;
    
    return {
      top: `${Math.max(5, Math.min(95, latPercent))}%`,
      left: `${Math.max(5, Math.min(95, lngPercent))}%`,
    };
  };

  const handleMarkerClick = (listing: MapListing) => {
    setSelectedListing(listing);
    onListingClick(listing);
  };

  return (
    <div className={`relative ${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      <Card className="relative h-full min-h-[400px] overflow-hidden">
        {/* Map Background */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-50 to-blue-200"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 60% 20%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)
            `,
          }}
        >
          {/* Map Grid Overlay */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        {/* Fullscreen Toggle */}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>

        {/* Map Markers */}
        {listings.map((listing) => {
          const position = getMarkerPosition(listing.coordinates);
          return (
            <button
              key={listing.id}
              className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
              style={position}
              onClick={() => handleMarkerClick(listing)}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white
                ${listing.type === 'boat' ? 'bg-blue-500' : 'bg-green-500'}
                ${selectedListing?.id === listing.id ? 'ring-4 ring-primary/50' : ''}
              `}>
                {listing.type === 'boat' ? (
                  <Ship className="h-4 w-4 text-white" />
                ) : (
                  <GraduationCap className="h-4 w-4 text-white" />
                )}
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-background/90 backdrop-blur-sm rounded px-2 py-1 text-xs whitespace-nowrap shadow-sm">
                R{listing.price}
              </div>
            </button>
          );
        })}

        {/* Selected Listing Card */}
        {selectedListing && (
          <Card className="absolute bottom-4 left-4 right-4 z-30 p-4 bg-background/95 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center shrink-0">
                {selectedListing.type === 'boat' ? (
                  <Ship className="h-6 w-6 text-muted-foreground" />
                ) : (
                  <GraduationCap className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold truncate">{selectedListing.name}</h4>
                  <Badge variant={selectedListing.type === 'boat' ? 'default' : 'secondary'}>
                    {selectedListing.type}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3 mr-1" />
                  {selectedListing.location}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">
                    R{selectedListing.price}
                    {selectedListing.type === 'boat' ? '/day' : ''}
                  </span>
                  {selectedListing.available !== undefined && (
                    <Badge variant={selectedListing.available ? 'default' : 'secondary'}>
                      {selectedListing.available ? 'Available' : 'Booked'}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Map Legend */}
        <div className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-sm rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <Ship className="h-2 w-2 text-white" />
            </div>
            <span>Boats</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <GraduationCap className="h-2 w-2 text-white" />
            </div>
            <span>Courses</span>
          </div>
        </div>
      </Card>
    </div>
  );
};