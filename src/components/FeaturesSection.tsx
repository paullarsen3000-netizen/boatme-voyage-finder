import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Anchor, MapPin, Shield, Star } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Anchor,
      title: "Skipper Courses",
      description: "SAMSA-certified skipper training courses across South Africa. Learn from qualified instructors and get your boating licence.",
      stats: "50+ Courses Available"
    },
    {
      icon: MapPin,
      title: "Boat Rentals",
      description: "Rent verified boats from trusted owners. From fishing boats to luxury yachts, find the perfect vessel for your adventure.",
      stats: "200+ Boats Listed"
    },
    {
      icon: Shield,
      title: "Fully Insured",
      description: "All rentals include comprehensive insurance coverage. Boat safely knowing you're protected on the water.",
      stats: "100% Coverage"
    },
    {
      icon: Star,
      title: "Trusted Community",
      description: "Join thousands of satisfied customers. Our verified reviews system ensures quality experiences every time.",
      stats: "4.8/5 Rating"
    }
  ]

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Why Choose BoatMe?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            South Africa's most trusted platform for boating education and rentals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow border-border/50">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <div className="text-sm font-semibold text-primary">{feature.stats}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}