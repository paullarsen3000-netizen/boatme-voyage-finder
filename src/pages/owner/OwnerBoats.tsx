import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  Calendar,
  MapPin,
  Users,
  DollarSign,
  MoreVertical,
  Star
} from "lucide-react"
import { Link } from "react-router-dom"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const mockBoats = [
  {
    id: "1",
    name: "Sea Breeze",
    type: "Speedboat",
    location: "Vaal Dam, Gauteng",
    waterBodies: ["Vaal Dam"],
    price: 1200,
    capacity: 8,
    status: "active",
    bookings: 15,
    rating: 4.8,
    images: ["/placeholder.svg"],
    lastBooked: "2024-02-10",
    skipperRequired: false,
    skipperIncluded: false
  },
  {
    id: "2",
    name: "Wave Runner",
    type: "Jetski",
    location: "Hartbeespoort Dam, North West",
    waterBodies: ["Hartbeespoort Dam"],
    price: 800,
    capacity: 2,
    status: "active",
    bookings: 23,
    rating: 4.9,
    images: ["/placeholder.svg"],
    lastBooked: "2024-02-12",
    skipperRequired: false,
    skipperIncluded: false
  },
  {
    id: "3",
    name: "Sunset Cruiser",
    type: "Pontoon",
    location: "Knysna Lagoon, Western Cape",
    waterBodies: ["Knysna Lagoon"],
    price: 2500,
    capacity: 12,
    status: "pending_verification",
    bookings: 0,
    rating: 0,
    images: ["/placeholder.svg"],
    lastBooked: null,
    skipperRequired: true,
    skipperIncluded: true
  }
]

export default function OwnerBoats() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredBoats = mockBoats.filter(boat => {
    const matchesSearch = boat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         boat.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         boat.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || boat.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "inactive": return "bg-gray-100 text-gray-800"
      case "pending_verification": return "bg-yellow-100 text-yellow-800"
      case "rejected": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Active"
      case "inactive": return "Inactive"
      case "pending_verification": return "Pending Verification"
      case "rejected": return "Rejected"
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-brand font-bold text-primary">My Boats</h1>
            <p className="text-muted-foreground mt-1">
              Manage your boat listings and availability
            </p>
          </div>
          <Link to="/owner/boats/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Boat
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search boats..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                  size="sm"
                >
                  All
                </Button>
                <Button 
                  variant={filterStatus === "active" ? "default" : "outline"}
                  onClick={() => setFilterStatus("active")}
                  size="sm"
                >
                  Active
                </Button>
                <Button 
                  variant={filterStatus === "pending_verification" ? "default" : "outline"}
                  onClick={() => setFilterStatus("pending_verification")}
                  size="sm"
                >
                  Pending
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredBoats.length} boat{filteredBoats.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Boats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBoats.map((boat) => (
            <Card key={boat.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="relative">
                  <img
                    src={boat.images[0]}
                    alt={boat.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className={`absolute top-3 left-3 ${getStatusColor(boat.status)}`}>
                    {getStatusText(boat.status)}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-3 right-3 bg-white"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="w-4 h-4 mr-2" />
                        Manage Calendar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Public Page
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{boat.name}</h3>
                    <p className="text-sm text-muted-foreground">{boat.type}</p>
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    {boat.location}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      Up to {boat.capacity} people
                    </div>
                    <div className="flex items-center font-medium">
                      <DollarSign className="w-4 h-4 mr-1" />
                      R{boat.price}/day
                    </div>
                  </div>

                  {boat.rating > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{boat.rating}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {boat.bookings} booking{boat.bookings !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}

                  {boat.lastBooked && (
                    <div className="text-xs text-muted-foreground">
                      Last booked: {new Date(boat.lastBooked).toLocaleDateString()}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {boat.skipperRequired && (
                      <Badge variant="outline" className="text-xs">
                        Skipper Required
                      </Badge>
                    )}
                    {boat.skipperIncluded && (
                      <Badge variant="outline" className="text-xs">
                        Skipper Included
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>

              <div className="p-4 pt-0 flex gap-2">
                <Button variant="outline" className="flex-1" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" className="flex-1" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Calendar
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredBoats.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No boats found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterStatus !== "all" 
                ? "Try adjusting your search criteria"
                : "Get started by adding your first boat listing"
              }
            </p>
            {!searchTerm && filterStatus === "all" && (
              <Link to="/owner/boats/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Boat
                </Button>
              </Link>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}