import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { SEOSchema } from "@/utils/seoSchema"
import { SocialMeta } from "@/utils/socialMeta"
import { 
  ArrowLeft, 
  Star, 
  Users, 
  Ruler, 
  MapPin, 
  Shield, 
  Camera,
  Heart,
  Share2,
  AlertCircle,
  Calendar,
  Clock,
  CreditCard
} from "lucide-react"

// Mock boat data - in production this would come from an API
const mockBoatDetails = {
  "1": {
    id: "1",
    name: "Sea Ray Sundancer",
    type: "speedboat",
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1570479334780-5ca3c5b1173f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    pricePerDay: 2500,
    location: "Hermanus, Western Cape",
    waterBody: "ocean",
    rating: 4.8,
    reviewCount: 24,
    description: "Experience the ultimate in luxury and performance with our Sea Ray Sundancer. Perfect for whale watching, coastal cruising, and entertaining guests. This meticulously maintained speedboat offers comfort, style, and unforgettable memories on the beautiful waters of Hermanus.",
    capacity: 8,
    length: "8.5m",
    year: 2019,
    engine: "Twin 350hp Mercury",
    maxSpeed: "45 knots",
    skipperRequired: false,
    skipperIncluded: false,
    features: [
      "GPS Navigation",
      "Sound System",
      "Swim Platform",
      "Cooler Box",
      "Safety Equipment",
      "Sun Deck",
      "Cabin Space",
      "Marine Radio"
    ],
    rules: [
      "No smoking on board",
      "Maximum 8 passengers",
      "Life jackets must be worn",
      "No glass containers",
      "Return with full fuel tank",
      "Report any damage immediately"
    ],
    cancellationPolicy: "Free cancellation up to 48 hours before departure. 50% refund for cancellations within 48 hours.",
    owner: {
      name: "Captain Mike Thompson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      joinedDate: "2019",
      verified: true,
      responseTime: "Within 1 hour",
      responseRate: "100%"
    },
    reviews: [
      {
        id: "1",
        author: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        rating: 5,
        date: "2024-01-15",
        comment: "Absolutely incredible experience! The boat was immaculate and Mike was an excellent host. Perfect for our whale watching trip."
      },
      {
        id: "2", 
        author: "David Wilson",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        rating: 5,
        date: "2024-01-10",
        comment: "Top-notch boat and service. Highly recommended for anyone looking to explore the Hermanus coastline."
      }
    ],
    availability: true,
    coordinates: [-34.4187, 19.2345]
  }
}

export default function BoatDetails() {
  const { id } = useParams()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showAllImages, setShowAllImages] = useState(false)

  const boat = mockBoatDetails[id as keyof typeof mockBoatDetails]

  if (!boat) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-brand font-bold mb-4">Boat Not Found</h1>
          <p className="text-muted-foreground mb-6">The boat you're looking for doesn't exist.</p>
          <Link to="/rent">
            <Button>Back to Boat Rentals</Button>
          </Link>
        </div>
      </div>
    )
  }

  // SEO Schema data
  const seoData = {
    name: boat.name,
    description: boat.description,
    image: boat.images[0],
    averageRating: boat.rating,
    reviewCount: boat.reviewCount,
    reviews: boat.reviews.map(review => ({
      author: review.author,
      rating: review.rating,
      reviewText: review.comment,
      datePublished: review.date
    })),
    offers: {
      price: boat.pricePerDay,
      currency: 'ZAR',
      availability: 'InStock'
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SocialMeta
        title={`Rent ${boat.name} in ${boat.location}`}
        description={`${boat.description.slice(0, 160)}... Starting from R${boat.pricePerDay}/day. Book now!`}
        image={boat.images[0]}
        url={`/boats/${id}`}
        type="product"
      />
      <SEOSchema data={seoData} type="product" />
      {/* Back Navigation */}
      <div className="border-b bg-background/95 backdrop-blur-md sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <Link to="/rent" className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-body">Back to boat rentals</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative">
                <div className="aspect-[16/10] bg-muted">
                  <img
                    src={boat.images[currentImageIndex]}
                    alt={boat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Image Navigation */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button variant="outline" size="sm" className="bg-background/90 backdrop-blur-sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-background/90 backdrop-blur-sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-background/90 backdrop-blur-sm">
                    <Camera className="h-4 w-4 mr-2" />
                    {boat.images.length}
                  </Button>
                </div>

                {/* Image Thumbnails */}
                <div className="absolute bottom-4 left-4 flex space-x-2">
                  {boat.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Boat Info */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Header */}
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h1 className="text-3xl font-brand font-bold text-foreground">{boat.name}</h1>
                      <div className="flex items-center space-x-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{boat.rating}</span>
                        <span className="text-muted-foreground">({boat.reviewCount} reviews)</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{boat.location}</span>
                      </div>
                      <Badge variant="outline">{boat.type}</Badge>
                      <Badge variant="outline">{boat.waterBody}</Badge>
                    </div>
                  </div>

                  <Separator />

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-brand font-semibold mb-3">About this boat</h3>
                    <p className="text-muted-foreground font-body leading-relaxed">{boat.description}</p>
                  </div>

                  <Separator />

                  {/* Specifications */}
                  <div>
                    <h3 className="text-lg font-brand font-semibold mb-4">Specifications</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">Capacity</span>
                        </div>
                        <p className="font-medium">{boat.capacity} people</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Ruler className="h-4 w-4" />
                          <span className="text-sm">Length</span>
                        </div>
                        <p className="font-medium">{boat.length}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">Year</span>
                        </div>
                        <p className="font-medium">{boat.year}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">Max Speed</span>
                        </div>
                        <p className="font-medium">{boat.maxSpeed}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Features */}
                  <div>
                    <h3 className="text-lg font-brand font-semibold mb-4">What's included</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {boat.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {boat.skipperRequired && (
                    <>
                      <Separator />
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-orange-800">Skipper License Required</h4>
                            <p className="text-sm text-orange-700 mt-1">
                              You'll need a valid skipper's license to operate this boat. Don't have one? 
                              <Link to="/skipper-courses" className="underline ml-1">Find courses near you</Link>
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Host Information */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={boat.owner.avatar} alt={boat.owner.name} />
                    <AvatarFallback>{boat.owner.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-brand font-semibold">{boat.owner.name}</h3>
                      {boat.owner.verified && (
                        <Shield className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">Host since {boat.owner.joinedDate}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Response rate:</span>
                        <p className="font-medium">{boat.owner.responseRate}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Response time:</span>
                        <p className="font-medium">{boat.owner.responseTime}</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline">Contact Host</Button>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="font-brand">Reviews ({boat.reviewCount})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {boat.reviews.map((review) => (
                  <div key={review.id} className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Avatar>
                        <AvatarImage src={review.avatar} alt={review.author} />
                        <AvatarFallback>{review.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">{review.author}</h4>
                          <div className="flex items-center space-x-1">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{review.date}</p>
                        <p className="text-sm leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">Show all reviews</Button>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-32">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Price */}
                  <div>
                    <div className="flex items-baseline space-x-2 mb-2">
                      <span className="text-3xl font-brand font-bold">R{boat.pricePerDay.toLocaleString()}</span>
                      <span className="text-muted-foreground">/day</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{boat.rating}</span>
                      <span className="text-muted-foreground">• {boat.reviewCount} reviews</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Capacity:</span>
                      <p className="font-medium">{boat.capacity} people</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Length:</span>
                      <p className="font-medium">{boat.length}</p>
                    </div>
                  </div>

                  <Separator />

                  <Link to={`/book/${boat.id}`}>
                    <Button size="lg" className="w-full">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Book Now
                    </Button>
                  </Link>

                  <p className="text-xs text-center text-muted-foreground">
                    You won't be charged yet
                  </p>

                  <Separator />

                  {/* Cancellation Policy */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Cancellation Policy</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {boat.cancellationPolicy}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}