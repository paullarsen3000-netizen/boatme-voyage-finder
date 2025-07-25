import { Button } from "@/components/ui/button"
import { Search, Anchor, Users } from "lucide-react"
import { UniversalSearchBar } from "@/components/search/UniversalSearchBar"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

export function HeroSection() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSearch = (query: string, location?: { lat: number; lng: number }) => {
    // Navigate to boat rentals with search params
    const searchParams = new URLSearchParams();
    searchParams.set('q', query);
    if (location) {
      searchParams.set('lat', location.lat.toString());
      searchParams.set('lng', location.lng.toString());
    }
    navigate(`/rent?${searchParams.toString()}`);
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-hero-gradient text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Brand Logo Prominence */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="relative">
              <Anchor className="h-16 w-16 text-white/90 stroke-[1.5]" />
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-accent rounded-full border-3 border-white/20" />
            </div>
            <h1 className="text-4xl md:text-6xl font-brand font-bold text-white tracking-wide">BoatMe</h1>
          </div>
          <p className="text-lg md:text-xl text-white/80 font-medium">South Africa's Premier Boating Platform</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-brand font-bold mb-6 leading-tight text-white">
            Find Your Perfect
            <span className="block text-accent font-brand">Boating Experience</span>
          </h2>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto font-body">
            Discover skipper courses, rent boats, or list your vessel with confidence
          </p>

          {/* Search Bar */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-3xl mx-auto shadow-xl">
            <UniversalSearchBar
              placeholder="Where do you want to boat? (e.g., Cape Town, Knysna, Vaal Dam)"
              onSearch={handleSearch}
              className="h-12"
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 bg-white/20 hover:bg-white/30 text-white border-white/30">
              Get My Skipper Licence
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent hover:bg-white/10 text-white border-white/50">
              Rent a Boat
            </Button>
            <Button size="lg" variant="ghost" className="text-lg px-8 py-6 text-white hover:bg-white/10">
              List My Boat
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 text-blue-100">
            <p className="text-sm mb-4">Trusted by 1000+ boat owners and sailors across South Africa</p>
            <div className="flex flex-wrap justify-center gap-8 text-xs">
              <span>✓ SAMSA Certified Courses</span>
              <span>✓ Insured Rentals</span>
              <span>✓ Verified Boat Owners</span>
              <span>✓ 24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}