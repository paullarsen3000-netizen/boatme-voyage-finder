import { useState } from "react"
import { SearchFilters } from "@/components/boat-rentals/SearchFilters"
import { BoatGrid } from "@/components/boat-rentals/BoatGrid"
import { MapView } from "@/components/boat-rentals/MapView"
import { Button } from "@/components/ui/button"
import { Grid, Map, Filter } from "lucide-react"

// Mock boat data - in production this would come from an API
const mockBoats = [
  {
    id: "1",
    name: "Sea Ray Sundancer",
    type: "speedboat",
    images: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    pricePerDay: 2500,
    location: "Hermanus, Western Cape",
    waterBody: "ocean",
    rating: 4.8,
    reviewCount: 24,
    description: "Luxurious speedboat perfect for whale watching and coastal cruising",
    capacity: 8,
    length: "8.5m",
    skipperRequired: false,
    availability: true
  },
  {
    id: "2", 
    name: "Pontoon Paradise",
    type: "pontoon",
    images: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    pricePerDay: 1800,
    location: "Vaal Dam, Gauteng",
    waterBody: "dam",
    rating: 4.6,
    reviewCount: 18,
    description: "Spacious pontoon boat ideal for family gatherings and relaxing",
    capacity: 12,
    length: "7.2m",
    skipperRequired: false,
    availability: true
  },
  {
    id: "3",
    name: "Knysna Explorer",
    type: "houseboat",
    images: ["https://images.unsplash.com/photo-1570479334780-5ca3c5b1173f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    pricePerDay: 3200,
    location: "Knysna Lagoon, Western Cape",
    waterBody: "lagoon",
    rating: 4.9,
    reviewCount: 31,
    description: "Fully equipped houseboat for multi-day adventures on the lagoon",
    capacity: 6,
    length: "12m",
    skipperRequired: true,
    availability: true
  },
  {
    id: "4",
    name: "JetSki Duo",
    type: "jetski",
    images: ["https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    pricePerDay: 800,
    location: "Durban Beachfront, KwaZulu-Natal",
    waterBody: "ocean",
    rating: 4.7,
    reviewCount: 45,
    description: "High-performance jetski for thrilling water adventures",
    capacity: 2,
    length: "3.5m",
    skipperRequired: false,
    availability: true
  },
  {
    id: "5",
    name: "Hartebeespoort Cruiser",
    type: "speedboat",
    images: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    pricePerDay: 1950,
    location: "Hartebeespoort Dam, North West",
    waterBody: "dam",
    rating: 4.5,
    reviewCount: 22,
    description: "Perfect for water sports and sunset cruises on the dam",
    capacity: 10,
    length: "6.8m",
    skipperRequired: false,
    availability: false
  },
  {
    id: "6",
    name: "River Kayak Set",
    type: "kayak",
    images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    pricePerDay: 350,
    location: "Orange River, Northern Cape",
    waterBody: "river",
    rating: 4.4,
    reviewCount: 12,
    description: "Peaceful river kayaking with beautiful scenery and wildlife",
    capacity: 2,
    length: "4.2m",
    skipperRequired: false,
    availability: true
  }
]

export default function BoatRentals() {
  const [filteredBoats, setFilteredBoats] = useState(mockBoats)
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid")
  const [showFilters, setShowFilters] = useState(false)

  const handleFiltersChange = (filters: any) => {
    let filtered = [...mockBoats]
    
    if (filters.location) {
      filtered = filtered.filter(boat => 
        boat.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }
    
    if (filters.boatType && filters.boatType !== "all") {
      filtered = filtered.filter(boat => boat.type === filters.boatType)
    }
    
    if (filters.waterBody && filters.waterBody !== "all") {
      filtered = filtered.filter(boat => boat.waterBody === filters.waterBody)
    }
    
    if (filters.priceRange) {
      filtered = filtered.filter(boat => 
        boat.pricePerDay >= filters.priceRange[0] && 
        boat.pricePerDay <= filters.priceRange[1]
      )
    }
    
    if (filters.availableOnly) {
      filtered = filtered.filter(boat => boat.availability)
    }
    
    setFilteredBoats(filtered)
  }

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
                {filteredBoats.length} boats available across South Africa
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
            {viewMode === "grid" ? (
              <BoatGrid boats={filteredBoats} />
            ) : (
              <MapView boats={filteredBoats} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}