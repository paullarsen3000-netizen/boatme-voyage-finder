import React from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, X } from 'lucide-react';

interface LocationFiltersProps {
  radius: number;
  onRadiusChange: (radius: number) => void;
  province: string;
  onProvinceChange: (province: string) => void;
  listingType: string;
  onListingTypeChange: (type: string) => void;
  waterBody: string;
  onWaterBodyChange: (waterBody: string) => void;
  activeLocation?: string;
  onClearLocation?: () => void;
  onClearAll: () => void;
}

const provinces = [
  'all-provinces',
  'Western Cape',
  'Eastern Cape',
  'Northern Cape',
  'Free State',
  'KwaZulu-Natal',
  'North West',
  'Gauteng',
  'Mpumalanga',
  'Limpopo'
];

const waterBodies = [
  'all-water-bodies',
  'Hartbeespoort Dam',
  'Vaal Dam',
  'Albert Falls Dam',
  'Gariep Dam',
  'Midmar Dam',
  'Bloemhof Dam',
  'Sterkfontein Dam',
  'Orange River',
  'Breede River',
  'Berg River'
];

export const LocationFilters: React.FC<LocationFiltersProps> = ({
  radius,
  onRadiusChange,
  province,
  onProvinceChange,
  listingType,
  onListingTypeChange,
  waterBody,
  onWaterBodyChange,
  activeLocation,
  onClearLocation,
  onClearAll,
}) => {
  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onClearAll}>
          Clear All
        </Button>
      </div>

      {activeLocation && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {activeLocation}
            {onClearLocation && (
              <button onClick={onClearLocation} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Search Radius: {radius}km</label>
        <Slider
          value={[radius]}
          onValueChange={(value) => onRadiusChange(value[0])}
          max={200}
          min={10}
          step={10}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>10km</span>
          <span>200km</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Listing Type</label>
        <Select value={listingType} onValueChange={onListingTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-types">All Types</SelectItem>
            <SelectItem value="boats">Boats</SelectItem>
            <SelectItem value="courses">Skipper Courses</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Province</label>
        <Select value={province} onValueChange={onProvinceChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select province" />
          </SelectTrigger>
          <SelectContent>
            {provinces.map((prov) => (
              <SelectItem key={prov} value={prov}>
                {prov === 'all-provinces' ? 'All Provinces' : prov}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Water Body</label>
        <Select value={waterBody} onValueChange={onWaterBodyChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select water body" />
          </SelectTrigger>
          <SelectContent>
            {waterBodies.map((body) => (
              <SelectItem key={body} value={body}>
                {body === 'all-water-bodies' ? 'All Water Bodies' : body}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};