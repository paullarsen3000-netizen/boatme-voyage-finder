import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Ship, 
  FileCheck, 
  Calendar, 
  MessageSquare, 
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  MapPin
} from "lucide-react"
import { Link } from "react-router-dom"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

const mockData = {
  owner: {
    name: "John Doe",
    verificationStatus: "approved",
    joinDate: "2024-01-15"
  },
  stats: {
    activeListings: 3,
    pendingVerifications: 1,
    upcomingBookings: 5,
    unreadMessages: 2,
    totalEarnings: 15420,
    monthlyBookings: 12
  },
  recentBookings: [
    {
      id: "1",
      boatName: "Sea Breeze",
      guestName: "Sarah Johnson",
      dates: "2024-02-15 - 2024-02-17",
      status: "confirmed",
      amount: 2400
    },
    {
      id: "2", 
      boatName: "Wave Runner",
      guestName: "Mike Peters",
      dates: "2024-02-20 - 2024-02-21",
      status: "pending",
      amount: 1800
    }
  ],
  notifications: [
    {
      id: "1",
      type: "verification",
      message: "COF document for 'Sea Breeze' expires in 30 days",
      time: "2 hours ago",
      priority: "high"
    },
    {
      id: "2",
      type: "booking",
      message: "New booking request for 'Wave Runner'",
      time: "5 hours ago",
      priority: "medium"
    },
    {
      id: "3",
      type: "system",
      message: "Monthly earnings report is available",
      time: "1 day ago",
      priority: "low"
    }
  ]
}

export default function OwnerDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "medium": return <Clock className="w-4 h-4 text-yellow-500" />
      case "low": return <CheckCircle className="w-4 h-4 text-green-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-brand font-bold text-primary">
                Welcome back, {mockData.owner.name}!
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your boat listings and track your rental business
              </p>
            </div>
            <div className="text-right">
              <Badge variant={mockData.owner.verificationStatus === "approved" ? "default" : "secondary"} className="mb-2">
                {mockData.owner.verificationStatus === "approved" ? "Verified Owner" : "Pending Verification"}
              </Badge>
              <p className="text-sm text-muted-foreground">
                Member since {new Date(mockData.owner.joinDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Listings</p>
                  <p className="text-2xl font-bold">{mockData.stats.activeListings}</p>
                </div>
                <Ship className="w-8 h-8 text-primary" />
              </div>
              <Link to="/owner/boats">
                <Button variant="link" className="p-0 h-auto mt-2">
                  Manage Boats →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Verifications</p>
                  <p className="text-2xl font-bold">{mockData.stats.pendingVerifications}</p>
                </div>
                <FileCheck className="w-8 h-8 text-yellow-500" />
              </div>
              <Link to="/owner/documents">
                <Button variant="link" className="p-0 h-auto mt-2">
                  View Documents →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Upcoming Bookings</p>
                  <p className="text-2xl font-bold">{mockData.stats.upcomingBookings}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
              <Link to="/owner/bookings">
                <Button variant="link" className="p-0 h-auto mt-2">
                  View Calendar →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Messages</p>
                  <p className="text-2xl font-bold">{mockData.stats.unreadMessages}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-green-500" />
              </div>
              <Button variant="link" className="p-0 h-auto mt-2">
                View Messages →
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Earnings Overview */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Earnings Overview</span>
                </CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant={selectedPeriod === "week" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setSelectedPeriod("week")}
                  >
                    Week
                  </Button>
                  <Button 
                    variant={selectedPeriod === "month" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setSelectedPeriod("month")}
                  >
                    Month
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                    <p className="text-2xl font-bold text-primary">R{mockData.stats.totalEarnings.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold text-blue-600">{mockData.stats.monthlyBookings} bookings</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Bookings</CardTitle>
                <Link to="/owner/bookings">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Ship className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{booking.boatName}</p>
                          <p className="text-sm text-muted-foreground">{booking.guestName}</p>
                          <p className="text-xs text-muted-foreground">{booking.dates}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                        <p className="text-sm font-medium mt-1">R{booking.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/owner/boats/new" className="block">
                  <Button className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Boat
                  </Button>
                </Link>
                <Link to="/owner/boats" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Ship className="w-4 h-4 mr-2" />
                    Manage Listings
                  </Button>
                </Link>
                <Link to="/owner/documents" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <FileCheck className="w-4 h-4 mr-2" />
                    Update Documents
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockData.notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      {getPriorityIcon(notification.priority)}
                      <div className="flex-1">
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="link" className="w-full mt-3 p-0">
                  View all notifications
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}