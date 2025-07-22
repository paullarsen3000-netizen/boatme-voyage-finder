import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Star, Users, Clock, Award, Phone, Mail, Shield, CheckCircle } from "lucide-react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

const mockCourse = {
  id: "1",
  title: "Recreational Skipper License (Category R)",
  provider: "Cape Town Marine Academy",
  location: "V&A Waterfront, Cape Town",
  province: "Western Cape",
  category: "R",
  price: 2850,
  duration: "2 days",
  nextDate: "2024-02-15",
  rating: 4.8,
  reviewCount: 124,
  images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
  description: "Our SAMSA-accredited Recreational Skipper License course is perfect for anyone wanting to operate recreational boats up to 9 nautical miles from shore. This comprehensive 2-day course combines essential theory with hands-on practical training.",
  includes: [
    "Complete theory course covering navigation, safety, and maritime law",
    "Practical training on the water with certified instructors", 
    "SAMSA certificate upon successful completion",
    "Course materials and logbook",
    "Lunch and refreshments included",
    "Free parking at the marina"
  ],
  schedule: [
    {
      day: "Day 1",
      activities: [
        "08:00 - Registration and welcome",
        "08:30 - Maritime law and regulations", 
        "10:00 - Navigation basics and chart reading",
        "12:00 - Lunch break",
        "13:00 - Safety equipment and procedures",
        "15:00 - Weather and tides",
        "16:30 - Theory assessment"
      ]
    },
    {
      day: "Day 2", 
      activities: [
        "08:00 - Boat familiarization",
        "08:30 - Practical training on water",
        "10:30 - Mooring and anchoring",
        "12:00 - Lunch break",
        "13:00 - Advanced boat handling",
        "15:00 - Emergency procedures",
        "16:00 - Practical assessment",
        "17:00 - Certificate presentation"
      ]
    }
  ],
  provider_info: {
    name: "Cape Town Marine Academy",
    established: "2008",
    samsa_accredited: true,
    courses_completed: "5,000+",
    pass_rate: "98%",
    phone: "+27 21 123 4567",
    email: "info@capetownmarine.co.za",
    website: "www.capetownmarine.co.za"
  },
  reviews: [
    {
      name: "Sarah M.",
      rating: 5,
      date: "January 2024",
      comment: "Excellent course! The instructors were knowledgeable and patient. I felt confident on the water by the end of day 2."
    },
    {
      name: "Mike P.", 
      rating: 5,
      date: "December 2023",
      comment: "Well organized course with great practical training. Highly recommend for anyone wanting to get their skipper license."
    },
    {
      name: "Lisa K.",
      rating: 4,
      date: "November 2023", 
      comment: "Good course overall. Theory was comprehensive and practical training was very helpful."
    }
  ],
  upcoming_dates: [
    "2024-02-15",
    "2024-02-29", 
    "2024-03-14",
    "2024-03-28"
  ]
}

export default function SkipperCourseDetails() {
  const { id } = useParams()
  const [selectedDate, setSelectedDate] = useState("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link to="/skipper-courses" className="hover:text-primary">Skipper Courses</Link>
            <span>/</span>
            <span className="text-foreground">{mockCourse.title}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-primary text-primary-foreground">
                  Category {mockCourse.category}
                </Badge>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <Shield className="w-3 h-3 mr-1" />
                  SAMSA Accredited
                </Badge>
              </div>
              <h1 className="text-3xl font-brand font-bold mb-2">{mockCourse.title}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-medium">{mockCourse.rating}</span>
                  <span className="ml-1">({mockCourse.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {mockCourse.location}
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="space-y-4">
              <img
                src={mockCourse.images[currentImageIndex]}
                alt={mockCourse.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="flex gap-2">
                {mockCourse.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="provider">Provider</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Course Description</h3>
                  <p className="text-muted-foreground">{mockCourse.description}</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">What's Included</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {mockCourse.includes.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-card rounded-lg">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium">{mockCourse.duration}</p>
                    <p className="text-sm text-muted-foreground">Duration</p>
                  </div>
                  <div className="text-center p-4 bg-card rounded-lg">
                    <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium">Max 12</p>
                    <p className="text-sm text-muted-foreground">Students</p>
                  </div>
                  <div className="text-center p-4 bg-card rounded-lg">
                    <Award className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium">Certificate</p>
                    <p className="text-sm text-muted-foreground">SAMSA Approved</p>
                  </div>
                  <div className="text-center p-4 bg-card rounded-lg">
                    <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium">Licensed</p>
                    <p className="text-sm text-muted-foreground">Instructors</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-6">
                {mockCourse.schedule.map((day, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{day.day}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {day.activities.map((activity, actIndex) => (
                          <div key={actIndex} className="text-sm">
                            <span className="font-medium text-primary">
                              {activity.split(' - ')[0]}
                            </span>
                            <span className="text-muted-foreground ml-2">
                              - {activity.split(' - ')[1]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="provider" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {mockCourse.provider_info.name}
                      <Badge className="ml-2 bg-green-100 text-green-800">
                        <Shield className="w-3 h-3 mr-1" />
                        SAMSA Accredited
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Established</p>
                        <p className="font-medium">{mockCourse.provider_info.established}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Courses Completed</p>
                        <p className="font-medium">{mockCourse.provider_info.courses_completed}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Pass Rate</p>
                        <p className="font-medium">{mockCourse.provider_info.pass_rate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rating</p>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="font-medium">{mockCourse.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        <a href={`tel:${mockCourse.provider_info.phone}`} className="hover:text-primary">
                          {mockCourse.provider_info.phone}
                        </a>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        <a href={`mailto:${mockCourse.provider_info.email}`} className="hover:text-primary">
                          {mockCourse.provider_info.email}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <div className="space-y-4">
                  {mockCourse.reviews.map((review, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium mr-3">
                              {review.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">{review.name}</p>
                              <p className="text-sm text-muted-foreground">{review.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <div className="text-center">
                  <p className="text-3xl font-bold">R{mockCourse.price.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">per person</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Date</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  >
                    <option value="">Choose a date</option>
                    {mockCourse.upcoming_dates.map(date => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString('en-GB', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </option>
                    ))}
                  </select>
                </div>

                <Button className="w-full" disabled={!selectedDate}>
                  Book Now - R{mockCourse.price.toLocaleString()}
                </Button>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>✓ Free cancellation up to 48 hours before</p>
                  <p>✓ SAMSA certificate included</p>
                  <p>✓ Small group sizes (max 12 students)</p>
                </div>

                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    Contact Provider
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}