import { Button } from "@/components/ui/button"
import { Anchor, Menu, X } from "lucide-react"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <header className="bg-background/95 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              <Anchor className="h-10 w-10 text-primary stroke-[1.5]" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-background" />
            </div>
            <span className="text-2xl font-brand font-bold text-primary tracking-wide">BoatMe</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/rent" 
              className={`text-foreground hover:text-primary transition-colors ${
                location.pathname === '/rent' ? 'text-primary font-medium' : ''
              }`}
            >
              Rent a Boat
            </Link>
            <Link 
              to="/skipper-courses" 
              className={`text-foreground hover:text-primary transition-colors ${
                location.pathname === '/skipper-courses' ? 'text-primary font-medium' : ''
              }`}
            >
              Skipper Courses
            </Link>
            <Link 
              to="/owner/register" 
              className={`text-foreground hover:text-primary transition-colors ${
                location.pathname.startsWith('/owner') ? 'text-primary font-medium' : ''
              }`}
            >
              List Your Boat
            </Link>
            <Link 
              to="/how-it-works" 
              className={`text-foreground hover:text-primary transition-colors ${
                location.pathname === '/how-it-works' ? 'text-primary font-medium' : ''
              }`}
            >
              How It Works
            </Link>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost">Sign In</Button>
            <Button>Get Started</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t space-y-4">
            <Link 
              to="/rent" 
              className={`block text-foreground hover:text-primary transition-colors ${
                location.pathname === '/rent' ? 'text-primary font-medium' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Rent a Boat
            </Link>
            <Link 
              to="/skipper-courses" 
              className={`block text-foreground hover:text-primary transition-colors ${
                location.pathname === '/skipper-courses' ? 'text-primary font-medium' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Skipper Courses
            </Link>
            <Link 
              to="/owner/register" 
              className={`block text-foreground hover:text-primary transition-colors ${
                location.pathname.startsWith('/owner') ? 'text-primary font-medium' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              List Your Boat
            </Link>
            <Link 
              to="/how-it-works" 
              className={`block text-foreground hover:text-primary transition-colors ${
                location.pathname === '/how-it-works' ? 'text-primary font-medium' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <div className="flex flex-col space-y-2 pt-4">
              <Button variant="ghost" className="w-full">Sign In</Button>
              <Button className="w-full">Get Started</Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}