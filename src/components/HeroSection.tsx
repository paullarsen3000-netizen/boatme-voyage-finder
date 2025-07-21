import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Search } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-hero-gradient text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Find Your Perfect
            <span className="block text-accent">Boating Experience</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Discover skipper courses, rent boats, or list your vessel on South Africa's premier boating platform
          </p>

          {/* Search Bar */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-3xl mx-auto shadow-xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input 
                  placeholder="Where do you want to boat? (e.g., Cape Town, Knysna, Vaal Dam)"
                  className="pl-10 h-12 text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Button size="lg" className="h-12 px-8 bg-primary hover:bg-primary/90">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
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