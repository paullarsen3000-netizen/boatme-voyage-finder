import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useSearchFilters } from '@/hooks/useSearchFilters';
import { X } from 'lucide-react';

interface SearchFiltersProps {
  onClose?: () => void;
  showCloseButton?: boolean;
}

export function SearchFilters({ onClose, showCloseButton = false }: SearchFiltersProps) {
  const { filters, updateFilters, clearFilters } = useSearchFilters();

  const boatTypes = [
    { value: 'sailing', label: 'Sailing Yacht' },
    { value: 'motorboat', label: 'Motorboat' },
    { value: 'jetski', label: 'Jet Ski' },
    { value: 'pontoon', label: 'Pontoon' },
    { value: 'other', label: 'Other' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Filters</CardTitle>
            <CardDescription>Refine your search results</CardDescription>
          </div>
          {showCloseButton && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Boat Type Filter */}
        <div className="space-y-2">
          <Label htmlFor="boat-type">Boat Type</Label>
          <Select
            value={filters.boatType}
            onValueChange={(value) => updateFilters({ boatType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All boat types" />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              <SelectItem value="">All boat types</SelectItem>
              {boatTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Price Range */}
        <div className="space-y-4">
          <Label>Price Range (per day)</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="min-price" className="text-xs text-muted-foreground">
                Min Price
              </Label>
              <Input
                id="min-price"
                type="number"
                placeholder="0"
                value={filters.minPrice || ''}
                onChange={(e) => 
                  updateFilters({ 
                    minPrice: e.target.value ? Number(e.target.value) : null 
                  })
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="max-price" className="text-xs text-muted-foreground">
                Max Price
              </Label>
              <Input
                id="max-price"
                type="number"
                placeholder="10000"
                value={filters.maxPrice || ''}
                onChange={(e) => 
                  updateFilters({ 
                    maxPrice: e.target.value ? Number(e.target.value) : null 
                  })
                }
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Sort By */}
        <div className="space-y-2">
          <Label htmlFor="sort-by">Sort By</Label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => 
              updateFilters({ sortBy: value as typeof filters.sortBy })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Clear Filters */}
        <Button 
          variant="outline" 
          onClick={clearFilters}
          className="w-full"
        >
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  );
}