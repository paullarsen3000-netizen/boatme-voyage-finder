import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Users, Ruler, MapPin, AlertCircle } from "lucide-react"
import { Link } from "react-router-dom"

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

interface BoatCardProps {
  boat: Boat
}

export function BoatCard({ boat }: BoatCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  const formatBoatType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1')
  }

  const formatWaterBody = (waterBody: string) => {
    return waterBody.charAt(0).toUpperCase() + waterBody.slice(1)
  }

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${!boat.availability ? 'opacity-60' : ''}`}>
      <div className="relative">
        {/* Boat Image */}
        <div className="aspect-[4/3] overflow-hidden rounded-t-lg bg-muted">
          <img
            src={boat.images[0]}
            alt={boat.name}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {formatBoatType(boat.type)}
          </Badge>
          {boat.skipperRequired && (
            <Badge variant="outline" className="bg-background/90 backdrop-blur-sm border-orange-500 text-orange-700">
              Skipper Required
            </Badge>
          )}
          {!boat.availability && (
            <Badge variant="destructive" className="bg-background/90 backdrop-blur-sm">
              Not Available
            </Badge>
          )}
        </div>

        {/* Water Body Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-background/90 backdrop-blur-sm">
            {formatWaterBody(boat.waterBody)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Boat Details */}
        <div className="space-y-3">
          {/* Name and Rating */}
          <div className="flex items-start justify-between">
            <h3 className="font-brand font-semibold text-lg leading-tight text-foreground group-hover:text-primary transition-colors">
              {boat.name}
            </h3>
            <div className="flex items-center space-x-1 text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{boat.rating}</span>
              <span className="text-muted-foreground">({boat.reviewCount})</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-2 text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="font-body text-sm">{boat.location}</span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground font-body text-sm leading-relaxed line-clamp-2">
            {boat.description}
          </p>

          {/* Specs */}
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{boat.capacity} people</span>
            </div>
            <div className="flex items-center space-x-1">
              <Ruler className="h-4 w-4" />
              <span>{boat.length}</span>
            </div>
          </div>

          {/* Price and CTA */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="space-y-1">
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-brand font-bold text-foreground">
                  R{boat.pricePerDay.toLocaleString()}
                </span>
                <span className="text-muted-foreground font-body">/day</span>
              </div>
              {boat.skipperRequired && (
                <div className="flex items-center space-x-1 text-xs text-orange-600">
                  <AlertCircle className="h-3 w-3" />
                  <span>License required</span>
                </div>
              )}
            </div>
            
            <Link to={`/boats/${boat.id}`}>
              <Button 
                variant={boat.availability ? "default" : "secondary"}
                disabled={!boat.availability}
                className="font-medium"
              >
                {boat.availability ? "View Details" : "Unavailable"}
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}