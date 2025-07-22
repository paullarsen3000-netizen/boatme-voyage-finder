import { BoatCard } from "./BoatCard"
import { Badge } from "@/components/ui/badge"

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

interface BoatGridProps {
  boats: Boat[]
}

export function BoatGrid({ boats }: BoatGridProps) {
  if (boats.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <span className="text-3xl">🛥️</span>
          </div>
          <h3 className="text-xl font-brand font-semibold text-foreground mb-2">
            No boats found
          </h3>
          <p className="text-muted-foreground font-body">
            Try adjusting your search filters to find more boats in your area.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-brand font-semibold">
            {boats.length} boats available
          </h2>
          <Badge variant="secondary" className="font-body">
            Updated just now
          </Badge>
        </div>
      </div>

      {/* Boats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boats.map((boat) => (
          <BoatCard key={boat.id} boat={boat} />
        ))}
      </div>
    </div>
  )
}