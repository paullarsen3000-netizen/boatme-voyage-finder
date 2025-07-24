import { useState, useEffect } from "react"
import { SearchFilters } from "@/components/boat-rentals/SearchFilters"
import { BoatGrid } from "@/components/boat-rentals/BoatGrid"
import { MapView } from "@/components/boat-rentals/MapView"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Grid, Map, Filter, AlertCircle } from "lucide-react"
import { useBoats } from "@/hooks/useBoats"
import { Database } from "@/integrations/supabase/types"

interface BoatFilters {
  location?: string;
  type?: Database['public']['Enums']['boat_type'];
  priceMin?: number;
  priceMax?: number;
  availableOnly?: boolean;
}

export default function BoatRentals() {
  const [filters, setFilters] = useState<BoatFilters>({})
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid")
  const [showFilters, setShowFilters] = useState(false)
  
  const { boats, loading, error } = useBoats(filters)

  const handleFiltersChange = (newFilters: any) => {
    const boatFilters: BoatFilters = {
      location: newFilters.location || undefined,
      type: newFilters.boatType !== "all" ? newFilters.boatType : undefined,
      priceMin: newFilters.priceRange?.[0],
      priceMax: newFilters.priceRange?.[1],
      availableOnly: newFilters.availableOnly
    }
    setFilters(boatFilters)
  }

  // Transform Supabase boat data to match the expected format
  const transformedBoats = boats.map(boat => ({
    id: boat.id,
    name: boat.title,
    type: boat.type,
    images: Array.isArray(boat.images) ? boat.images.map(img => String(img)) : [],
    pricePerDay: Number(boat.price_per_day),
    location: boat.location,
    waterBody: "ocean", // Could be derived from location or added to schema
    rating: 4.5, // Could come from reviews aggregation
    reviewCount: 0, // Could come from reviews count
    description: boat.description || "",
    capacity: 8, // Could be added to schema
    length: "Unknown", // Could be added to schema
    skipperRequired: false, // Could be added to schema
    availability: boat.status === 'active'
  }))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur-md sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-brand font-bold text-foreground">
                Rent a Boat
              </h1>
              <p className="text-muted-foreground font-body">
                {transformedBoats.length} boats available across South Africa
              </p>
            </div>
            
            {/* View Toggle & Filter Button */}
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              <div className="hidden md:flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("map")}
                  className="rounded-l-none"
                >
                  <Map className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <SearchFilters onFiltersChange={handleFiltersChange} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {loading ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="h-48 w-full rounded-lg" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              </div>
            ) : error ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : viewMode === "grid" ? (
              <BoatGrid boats={transformedBoats} />
            ) : (
              <MapView boats={transformedBoats} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}