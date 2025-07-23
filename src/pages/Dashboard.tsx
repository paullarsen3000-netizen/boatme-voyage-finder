import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Ship, GraduationCap, Settings, LogOut } from 'lucide-react';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isOwner = user?.user_metadata?.user_type === 'owner';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-brand font-bold">
              Welcome back, {user?.user_metadata?.first_name || 'User'}!
            </h1>
            <p className="text-muted-foreground font-body">
              Manage your bookings and explore new adventures
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant={isOwner ? "default" : "secondary"}>
              {isOwner ? 'Boat Owner' : 'Renter'}
            </Badge>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Dashboard Stats Cards */}
          {isOwner ? (
            <>
              {/* Owner Stats */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Ship className="h-8 w-8 text-primary" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Active Listings</p>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold">3</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">This Month Earnings</p>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold">R12,450</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <MapPin className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Pending Bookings</p>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold">5</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Settings className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Documents Status</p>
                      <div className="flex items-center">
                        <span className="text-sm text-orange-600 font-medium">2 Pending</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {/* Renter Stats */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-primary" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Upcoming Trips</p>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold">2</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Ship className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold">7</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <GraduationCap className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Courses Completed</p>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold">1</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <MapPin className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Favorite Locations</p>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold">4</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  {isOwner ? 'Manage your business' : 'Explore and book'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {isOwner ? (
                    <>
                      <Button 
                        className="h-auto p-4 flex flex-col items-start" 
                        variant="outline"
                        onClick={() => navigate('/owner/boats')}
                      >
                        <Ship className="h-6 w-6 mb-2" />
                        <span className="font-medium">Add New Boat</span>
                        <span className="text-sm text-muted-foreground">List a new boat for rent</span>
                      </Button>
                      <Button 
                        className="h-auto p-4 flex flex-col items-start" 
                        variant="outline"
                        onClick={() => navigate('/owner/bookings')}
                      >
                        <Calendar className="h-6 w-6 mb-2" />
                        <span className="font-medium">Manage Bookings</span>
                        <span className="text-sm text-muted-foreground">View and respond to requests</span>
                      </Button>
                      <Button 
                        className="h-auto p-4 flex flex-col items-start" 
                        variant="outline"
                        onClick={() => navigate('/owner/documents')}
                      >
                        <Settings className="h-6 w-6 mb-2" />
                        <span className="font-medium">Complete KYC</span>
                        <span className="text-sm text-muted-foreground">Upload required documents</span>
                      </Button>
                      <Button 
                        className="h-auto p-4 flex flex-col items-start" 
                        variant="outline"
                        onClick={() => navigate('/owner/dashboard')}
                      >
                        <GraduationCap className="h-6 w-6 mb-2" />
                        <span className="font-medium">Owner Dashboard</span>
                        <span className="text-sm text-muted-foreground">Full business overview</span>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        className="h-auto p-4 flex flex-col items-start" 
                        variant="outline"
                        onClick={() => navigate('/rent')}
                      >
                        <Ship className="h-6 w-6 mb-2" />
                        <span className="font-medium">Browse Boats</span>
                        <span className="text-sm text-muted-foreground">Find your next adventure</span>
                      </Button>
                      <Button 
                        className="h-auto p-4 flex flex-col items-start" 
                        variant="outline"
                        onClick={() => navigate('/skipper-courses')}
                      >
                        <GraduationCap className="h-6 w-6 mb-2" />
                        <span className="font-medium">Skipper Courses</span>
                        <span className="text-sm text-muted-foreground">Learn to navigate safely</span>
                      </Button>
                      <Button 
                        className="h-auto p-4 flex flex-col items-start" 
                        variant="outline"
                        onClick={() => navigate('/search')}
                      >
                        <MapPin className="h-6 w-6 mb-2" />
                        <span className="font-medium">Search Locations</span>
                        <span className="text-sm text-muted-foreground">Discover new destinations</span>
                      </Button>
                      <Button 
                        className="h-auto p-4 flex flex-col items-start" 
                        variant="outline"
                        onClick={() => navigate('/owner/register')}
                      >
                        <Settings className="h-6 w-6 mb-2" />
                        <span className="font-medium">Become an Owner</span>
                        <span className="text-sm text-muted-foreground">Start earning with your boat</span>
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notifications */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Recent updates and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isOwner ? (
                    <>
                      <div className="flex items-start space-x-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
                        <Settings className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">2 documents pending verification</p>
                          <p className="text-xs text-muted-foreground">Complete KYC to activate listings</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">New booking request</p>
                          <p className="text-xs text-muted-foreground">Respond within 24 hours</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 rounded-lg bg-green-50 border border-green-200">
                        <Ship className="h-5 w-5 text-green-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Listing approved</p>
                          <p className="text-xs text-muted-foreground">Your yacht is now live</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Trip reminder</p>
                          <p className="text-xs text-muted-foreground">Yacht booking in 3 days</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 rounded-lg bg-green-50 border border-green-200">
                        <GraduationCap className="h-5 w-5 text-green-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Course completed</p>
                          <p className="text-xs text-muted-foreground">Certificate ready for download</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 rounded-lg bg-purple-50 border border-purple-200">
                        <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Special offer</p>
                          <p className="text-xs text-muted-foreground">20% off Cape Town boats this weekend</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Profile Section */}
        <Card className="mt-8">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Your profile details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <p className="text-sm text-muted-foreground">
                    {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <p className="text-sm text-muted-foreground">
                    {user?.user_metadata?.phone || 'Not provided'}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Account Type</label>
                  <p className="text-sm text-muted-foreground">
                    {isOwner ? 'Boat Owner / Course Provider' : 'Renter'}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}