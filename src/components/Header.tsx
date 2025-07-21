import { Button } from "@/components/ui/button"
import { Anchor, Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-background/95 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Anchor className="h-10 w-10 text-primary stroke-[1.5]" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-background" />
            </div>
            <span className="text-2xl font-brand font-bold text-primary tracking-wide">BoatMe</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/rent" className="text-foreground hover:text-primary transition-colors">Rent a Boat</a>
            <a href="/skipper-courses" className="text-foreground hover:text-primary transition-colors">Skipper Courses</a>
            <a href="/list-boat" className="text-foreground hover:text-primary transition-colors">List Your Boat</a>
            <a href="/how-it-works" className="text-foreground hover:text-primary transition-colors">How It Works</a>
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
            <a href="/rent" className="block text-foreground hover:text-primary transition-colors">Rent a Boat</a>
            <a href="/skipper-courses" className="block text-foreground hover:text-primary transition-colors">Skipper Courses</a>
            <a href="/list-boat" className="block text-foreground hover:text-primary transition-colors">List Your Boat</a>
            <a href="/how-it-works" className="block text-foreground hover:text-primary transition-colors">How It Works</a>
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