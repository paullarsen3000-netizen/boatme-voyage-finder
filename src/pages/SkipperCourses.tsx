import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Star, Users, Clock, Award } from "lucide-react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Link } from "react-router-dom"

const mockCourses = [
  {
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
    image: "/placeholder.svg",
    description: "Perfect for recreational boating up to 9 nautical miles from shore.",
    includes: ["Theory course", "Practical training", "SAMSA certificate", "Lunch included"],
    type: "theory-practical"
  },
  {
    id: "2", 
    title: "Powerboat Certificate (Category B)",
    provider: "Durban Boating School",
    location: "Durban Marina, KZN",
    province: "KwaZulu-Natal",
    category: "B",
    price: 4200,
    duration: "3 days",
    nextDate: "2024-02-20",
    rating: 4.9,
    reviewCount: 89,
    image: "/placeholder.svg",
    description: "Commercial powerboat license for vessels up to 15m.",
    includes: ["Advanced theory", "Practical sea training", "Navigation skills", "Safety equipment"],
    type: "theory-practical"
  },
  {
    id: "3",
    title: "Commercial Yacht License (Category C)",
    provider: "Knysna Maritime Institute",
    location: "Knysna Lagoon, Western Cape",
    province: "Western Cape", 
    category: "C",
    price: 8500,
    duration: "5 days",
    nextDate: "2024-03-01",
    rating: 4.7,
    reviewCount: 45,
    image: "/placeholder.svg",
    description: "Professional yacht master certification for vessels up to 40m.",
    includes: ["Comprehensive theory", "Extended practical", "Radio operator license", "First aid training"],
    type: "theory-practical"
  },
  {
    id: "4",
    title: "Jet Ski License (Category E)",
    provider: "Vaal Dam Water Sports",
    location: "Vaal Dam, Gauteng",
    province: "Gauteng",
    category: "E",
    price: 1850,
    duration: "1 day",
    nextDate: "2024-02-18",
    rating: 4.6,
    reviewCount: 156,
    image: "/placeholder.svg",
    description: "Personal watercraft license for jet skis and similar vessels.",
    includes: ["Theory course", "Practical training", "Safety briefing", "Certificate"],
    type: "theory-practical"
  }
]

export default function SkipperCourses() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProvince, setSelectedProvince] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [priceRange, setPriceRange] = useState("")

  const provinces = ["Western Cape", "KwaZulu-Natal", "Gauteng", "Eastern Cape", "Free State", "Limpopo", "Mpumalanga", "Northern Cape", "North West"]
  const categories = [
    { value: "E", label: "Category E (Jet Ski)" },
    { value: "R", label: "Category R (Recreational)" }, 
    { value: "B", label: "Category B (Powerboat)" },
    { value: "C", label: "Category C (Commercial Yacht)" }
  ]

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProvince = !selectedProvince || course.province === selectedProvince
    const matchesCategory = !selectedCategory || course.category === selectedCategory
    const matchesPrice = !priceRange || 
      (priceRange === "under-3000" && course.price < 3000) ||
      (priceRange === "3000-5000" && course.price >= 3000 && course.price <= 5000) ||
      (priceRange === "5000-8000" && course.price >= 5000 && course.price <= 8000) ||
      (priceRange === "over-8000" && course.price > 8000)
    
    return matchesSearch && matchesProvince && matchesCategory && matchesPrice
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-brand font-bold text-primary mb-4">
            SAMSA Skipper License Courses
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get your skipper license from SAMSA-accredited training providers across South Africa
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card border rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <Input
                placeholder="Search courses, providers, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Select value={selectedProvince} onValueChange={setSelectedProvince}>
              <SelectTrigger>
                <SelectValue placeholder="Province" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Provinces</SelectItem>
                {provinces.map(province => (
                  <SelectItem key={province} value={province}>{province}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="License Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Price</SelectItem>
                <SelectItem value="under-3000">Under R3,000</SelectItem>
                <SelectItem value="3000-5000">R3,000 - R5,000</SelectItem>
                <SelectItem value="5000-8000">R5,000 - R8,000</SelectItem>
                <SelectItem value="over-8000">Over R8,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge 
                    className="absolute top-3 left-3 bg-primary text-primary-foreground"
                  >
                    Category {course.category}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">{course.provider}</p>
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    {course.location}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      Next: {new Date(course.nextDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.duration}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{course.rating}</span>
                      <span className="text-sm text-muted-foreground ml-1">
                        ({course.reviewCount})
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">R{course.price.toLocaleString()}</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {course.description}
                  </p>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Link to={`/skippers/${course.id}`} className="w-full">
                  <Button className="w-full">
                    View Details & Book
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <Award className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or browse all available courses.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}