import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Calendar, Anchor, Shield, Users, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-brand font-bold text-foreground mb-6">
            How BoatMe Works
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your journey to safe and enjoyable boating starts here. Learn how to rent boats, 
            get your skipper license, or list your vessel with confidence.
          </p>
        </div>

        {/* For Renters */}
        <section className="mb-16">
          <h2 className="text-3xl font-brand font-bold text-center mb-12">For Boat Renters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="h-full flex flex-col justify-between">
              <CardHeader className="text-center">
                <Search className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>1. Search & Discover</CardTitle>
                <CardDescription>
                  Browse verified boats in your preferred location using our smart search
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Filter by boat type, location, price, and amenities to find the perfect vessel for your adventure.
                </p>
              </CardContent>
            </Card>

            <Card className="h-full flex flex-col justify-between">
              <CardHeader className="text-center">
                <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>2. Book Securely</CardTitle>
                <CardDescription>
                  Reserve your boat with our secure booking system and instant confirmation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Get instant booking confirmation, secure payment processing, and comprehensive insurance coverage.
                </p>
              </CardContent>
            </Card>

            <Card className="h-full flex flex-col justify-between">
              <CardHeader className="text-center">
                <Anchor className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>3. Set Sail</CardTitle>
                <CardDescription>
                  Meet your boat owner, complete the handover, and enjoy your boating experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Receive a thorough boat orientation and safety briefing before embarking on your adventure.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* For Owners */}
        <section className="mb-16">
          <h2 className="text-3xl font-brand font-bold text-center mb-12">For Boat Owners</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="h-full flex flex-col justify-between">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>1. List Your Boat</CardTitle>
                <CardDescription>
                  Create a compelling listing with photos and detailed descriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Upload high-quality photos, set your availability, and describe your boat's unique features.
                </p>
              </CardContent>
            </Card>

            <Card className="h-full flex flex-col justify-between">
              <CardHeader className="text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>2. Get Verified</CardTitle>
                <CardDescription>
                  Complete our verification process to build trust with renters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Verify your identity, boat documentation, and insurance for maximum credibility.
                </p>
              </CardContent>
            </Card>

            <Card className="h-full flex flex-col justify-between">
              <CardHeader className="text-center">
                <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>3. Earn Money</CardTitle>
                <CardDescription>
                  Accept bookings and earn money from your boat when you're not using it
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Set your own rates, manage bookings through our platform, and receive secure payments.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Skipper Courses */}
        <section className="mb-16">
          <div className="bg-muted/20 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-brand font-bold mb-6">Get Your Skipper License</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Become a certified boat operator with our SAMSA-approved skipper courses. 
              Learn navigation, safety, and boat handling from experienced instructors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/skipper-courses">View Courses</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/rent">Browse Boats</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Safety & Trust */}
        <section className="text-center">
          <h2 className="text-3xl font-brand font-bold mb-8">Safety & Trust</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Verified Owners</h3>
              <p className="text-sm text-muted-foreground">All boat owners are verified and background-checked</p>
            </div>
            <div>
              <Anchor className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Insured Rentals</h3>
              <p className="text-sm text-muted-foreground">Comprehensive insurance coverage on every booking</p>
            </div>
            <div>
              <Users className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">Round-the-clock customer support for peace of mind</p>
            </div>
            <div>
              <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">SAMSA Certified</h3>
              <p className="text-sm text-muted-foreground">All courses meet South African maritime standards</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
