import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  MessageSquare,
  Eye
} from "lucide-react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const mockBookings = [
  {
    id: "1",
    boatName: "Sea Breeze",
    boatImage: "/placeholder.svg",
    guestName: "Sarah Johnson",
    guestPhone: "+27 82 123 4567",
    guestEmail: "sarah.j@email.com",
    dates: {
      start: "2024-02-15",
      end: "2024-02-17"
    },
    status: "pending",
    amount: 2400,
    commission: 360,
    payout: 2040,
    guestCount: 6,
    specialRequests: "Would like to bring a small BBQ for lunch",
    bookingDate: "2024-02-10",
    skipperRequired: false
  },
  {
    id: "2",
    boatName: "Wave Runner",
    boatImage: "/placeholder.svg",
    guestName: "Mike Peters",
    guestPhone: "+27 83 987 6543",
    guestEmail: "mike.peters@email.com",
    dates: {
      start: "2024-02-20",
      end: "2024-02-21"
    },
    status: "confirmed",
    amount: 1800,
    commission: 270,
    payout: 1530,
    guestCount: 4,
    specialRequests: null,
    bookingDate: "2024-02-12",
    skipperRequired: false
  },
  {
    id: "3",
    boatName: "Sea Breeze",
    boatImage: "/placeholder.svg",
    guestName: "Tom Wilson",
    guestPhone: "+27 84 555 1234",
    guestEmail: "tom.wilson@email.com",
    dates: {
      start: "2024-02-05",
      end: "2024-02-07"
    },
    status: "completed",
    amount: 2400,
    commission: 360,
    payout: 2040,
    guestCount: 8,
    specialRequests: "Corporate team building event",
    bookingDate: "2024-01-28",
    skipperRequired: false
  }
]

export default function OwnerBookings() {
  const [selectedTab, setSelectedTab] = useState("all")

  const filterBookings = (status: string) => {
    if (status === "all") return mockBookings
    return mockBookings.filter(booking => booking.status === status)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "completed": return "bg-blue-100 text-blue-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed": return <CheckCircle className="w-4 h-4" />
      case "pending": return <Clock className="w-4 h-4" />
      case "completed": return <CheckCircle className="w-4 h-4" />
      case "cancelled": return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const handleApprove = (bookingId: string) => {
    console.log("Approve booking:", bookingId)
    // Implementation for booking approval
  }

  const handleReject = (bookingId: string) => {
    console.log("Reject booking:", bookingId)
    // Implementation for booking rejection
  }

  const BookingCard = ({ booking }: { booking: typeof mockBookings[0] }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <img
              src={booking.boatImage}
              alt={booking.boatName}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-semibold text-lg">{booking.boatName}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(booking.dates.start).toLocaleDateString()} - {new Date(booking.dates.end).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(booking.status)}>
            {getStatusIcon(booking.status)}
            <span className="ml-1 capitalize">{booking.status}</span>
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <User className="w-4 h-4 mr-2 text-muted-foreground" />
              {booking.guestName}
            </div>
            <div className="flex items-center text-sm">
              <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
              {booking.guestPhone}
            </div>
            <div className="flex items-center text-sm">
              <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
              {booking.guestEmail}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <User className="w-4 h-4 mr-2 text-muted-foreground" />
              {booking.guestCount} guests
            </div>
            <div className="flex items-center text-sm">
              <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
              R{booking.amount.toLocaleString()} total
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              Booked {new Date(booking.bookingDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        {booking.specialRequests && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium mb-1">Special Requests:</p>
            <p className="text-sm text-muted-foreground">{booking.specialRequests}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm">
            <span className="text-muted-foreground">Your payout: </span>
            <span className="font-semibold">R{booking.payout.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground ml-2">
              (R{booking.commission} commission)
            </span>
          </div>
          <div className="flex space-x-2">
            {booking.status === "pending" && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleReject(booking.id)}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Decline
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleApprove(booking.id)}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve
                </Button>
              </>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Booking Details - {booking.boatName}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Guest Information</h4>
                      <div className="space-y-1 text-sm">
                        <p><strong>Name:</strong> {booking.guestName}</p>
                        <p><strong>Phone:</strong> {booking.guestPhone}</p>
                        <p><strong>Email:</strong> {booking.guestEmail}</p>
                        <p><strong>Guests:</strong> {booking.guestCount} people</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Booking Details</h4>
                      <div className="space-y-1 text-sm">
                        <p><strong>Dates:</strong> {new Date(booking.dates.start).toLocaleDateString()} - {new Date(booking.dates.end).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> {booking.status}</p>
                        <p><strong>Booked:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Payment Breakdown</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Total Amount:</span>
                        <span>R{booking.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>BoatMe Commission (15%):</span>
                        <span>-R{booking.commission.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-2">
                        <span>Your Payout:</span>
                        <span>R{booking.payout.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  {booking.specialRequests && (
                    <div>
                      <h4 className="font-medium mb-2">Special Requests</h4>
                      <p className="text-sm bg-gray-50 p-3 rounded-lg">{booking.specialRequests}</p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm">
              <MessageSquare className="w-4 h-4 mr-1" />
              Message
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-brand font-bold text-primary">Bookings Management</h1>
          <p className="text-muted-foreground mt-1">
            View and manage your boat rental bookings
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Bookings</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filterBookings("all").map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {filterBookings("pending").map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>

          <TabsContent value="confirmed" className="space-y-4">
            {filterBookings("confirmed").map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {filterBookings("completed").map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {filterBookings("cancelled").length > 0 ? (
              filterBookings("cancelled").map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No cancelled bookings</h3>
                <p className="text-muted-foreground">Great! You haven't had any cancellations yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {filterBookings(selectedTab).length === 0 && selectedTab !== "cancelled" && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
            <p className="text-muted-foreground">
              {selectedTab === "all" 
                ? "You don't have any bookings yet. Make sure your boats are listed and available!"
                : `No ${selectedTab} bookings at this time.`
              }
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}