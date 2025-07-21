import { Button } from "@/components/ui/button"
import { ArrowRight, Phone } from "lucide-react"

export function CallToAction() {
  return (
    <section className="py-20 bg-hero-gradient text-white">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Boating Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of South Africans who trust BoatMe for their boating adventures.
            Get started today and discover the freedom of the water.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90">
              <ArrowRight className="mr-2 h-5 w-5" />
              Get My Skipper Licence
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent hover:bg-white/10 text-white border-white/50">
              Browse Boat Rentals
            </Button>
          </div>

          <div className="border-t border-white/20 pt-8">
            <p className="text-blue-100 mb-4">Need help choosing? Speak to our boating experts</p>
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <Phone className="mr-2 h-5 w-5" />
              Call (021) 123-4567
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}