
import { Anchor, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <Anchor className="h-8 w-8 text-primary" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background" />
              </div>
              <span className="text-xl font-bold text-primary tracking-wide">BoatMe</span>
            </div>
            <p className="text-muted mb-4">South Africa's premier platform for boating education and boat rentals.</p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-muted hover:text-primary cursor-pointer" />
              <Instagram className="h-5 w-5 text-muted hover:text-primary cursor-pointer" />
              <Twitter className="h-5 w-5 text-muted hover:text-primary cursor-pointer" />
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4 text-background">Services</h3>
            <ul className="space-y-2 text-muted">
              <li><a href="/skipper-courses" className="hover:text-primary">Skipper Courses</a></li>
              <li><a href="/rent" className="hover:text-primary">Boat Rentals</a></li>
              <li><a href="/owner/register" className="hover:text-primary">List Your Boat</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4 text-background">Support</h3>
            <ul className="space-y-2 text-muted">
              <li><a href="/how-it-works" className="hover:text-primary">How It Works</a></li>
              <li><a href="/blog" className="hover:text-primary">Blog</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-background">Contact</h3>
            <div className="space-y-3 text-muted">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>(021) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>hello@boatme.co.za</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Cape Town, South Africa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-muted text-sm">
          <p>&copy; 2024 BoatMe.co.za. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="text-muted">More pages coming soon</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
