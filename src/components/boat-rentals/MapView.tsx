import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Maximize2 } from "lucide-react"

interface Boat {
  id: string
  name: string
  type: string
  images: string[]
  pricePerDay: number
  location: string
  waterBody: string
  rating: number
  reviewCount: number
  description: string
  capacity: number
  length: string
  skipperRequired: boolean
  availability: boolean
}

interface MapViewProps {
  boats: Boat[]
}

export function MapView({ boats }: MapViewProps) {
  const [selectedBoat, setSelectedBoat] = useState<Boat | null>(null)

  // Mock coordinates for South African water bodies
  const getCoordinates = (location: string) => {
    const coords: { [key: string]: [number, number] } = {
      "Hermanus, Western Cape": [-34.4187, 19.2345],
      "Vaal Dam, Gauteng": [-26.8833, 28.1167],
      "Knysna Lagoon, Western Cape": [-34.0361, 23.0475],
      "Durban Beachfront, KwaZulu-Natal": [-29.8587, 31.0218],
      "Hartebeespoort Dam, North West": [-25.7461, 27.8516],
      "Orange River, Northern Cape": [-28.7364, 24.7649]
    }
    return coords[location] || [-29.0, 24.0] // Default to South Africa center
  }

  return (
    <div className="space-y-6">
      {/* Map Placeholder */}
      <Card className="h-96 bg-muted relative overflow-hidden">
        <CardContent className="p-0 h-full">
          {/* This would be replaced with an actual map component like Mapbox or Google Maps */}
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-2">
                <MapPin className="h-8 w-8 text-blue-600 mx-auto" />
                <p className="font-medium text-blue-800">Interactive Map</p>
                <p className="text-sm text-blue-600">Map integration coming soon</p>
              </div>
            </div>
            
            {/* Mock map pins for boats */}
            {boats.map((boat, index) => {
              const [lat, lng] = getCoordinates(boat.location)
              const x = ((lng + 35) / 15) * 100 // Rough positioning
              const y = ((lat + 35) / 10) * 100
              
              return (
                <div
                  key={boat.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ 
                    left: `${Math.max(10, Math.min(90, x))}%`, 
                    top: `${Math.max(10, Math.min(90, y))}%` 
                  }}
                  onClick={() => setSelectedBoat(boat)}
                >
                  <div className={`bg-white rounded-full p-2 shadow-lg border-2 transition-all ${
                    selectedBoat?.id === boat.id ? 'border-primary scale-110' : 'border-gray-300 hover:border-primary hover:scale-105'
                  }`}>
                    <div className="w-3 h-3 bg-primary rounded-full" />
                  </div>
                  {selectedBoat?.id === boat.id && (
                    <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 whitespace-nowrap z-10">
                      <p className="font-medium text-sm">{boat.name}</p>
                      <p className="text-xs text-muted-foreground">R{boat.pricePerDay}/day</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          
          {/* Fullscreen button */}
          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Selected Boat Details */}
      {selectedBoat && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <img
                src={selectedBoat.images[0]}
                alt={selectedBoat.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-brand font-semibold text-lg">{selectedBoat.name}</h3>
                  <Badge variant={selectedBoat.availability ? "default" : "secondary"}>
                    {selectedBoat.availability ? "Available" : "Unavailable"}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm">{selectedBoat.location}</p>
                <p className="text-muted-foreground text-sm line-clamp-2">{selectedBoat.description}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xl font-brand font-bold">R{selectedBoat.pricePerDay.toLocaleString()}/day</span>
                  <Button disabled={!selectedBoat.availability}>
                    {selectedBoat.availability ? "View Details" : "Unavailable"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Boat List */}
      <div className="space-y-4">
        <h3 className="font-brand font-semibold text-lg">All Boats</h3>
        <div className="grid gap-4">
          {boats.map((boat) => (
            <Card 
              key={boat.id} 
              className={`cursor-pointer transition-all ${
                selectedBoat?.id === boat.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedBoat(boat)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={boat.images[0]}
                    alt={boat.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{boat.name}</h4>
                    <p className="text-sm text-muted-foreground">{boat.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-brand font-semibold">R{boat.pricePerDay.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">/day</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}