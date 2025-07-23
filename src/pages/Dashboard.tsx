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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
            <CardTitle className="flex items-center">
                <Ship className="mr-2 h-5 w-5" />
                Boat Rentals
              </CardTitle>
              <CardDescription>
                Find and book boats for your next adventure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => navigate('/rent')}
              >
                Browse Boats
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="mr-2 h-5 w-5" />
                Skipper Courses
              </CardTitle>
              <CardDescription>
                Learn to navigate waters safely with certified instructors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => navigate('/skipper-courses')}
              >
                View Courses
              </Button>
            </CardContent>
          </Card>

          {/* Owner Dashboard Access */}
          {isOwner && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Owner Dashboard
                </CardTitle>
                <CardDescription>
                  Manage your boats and bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/owner/dashboard')}
                >
                  Manage Listings
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your latest bookings and activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity</p>
                <p className="text-sm">Start by booking a boat or enrolling in a course!</p>
              </div>
            </CardContent>
          </Card>

          {/* Profile Section */}
          <Card className="md:col-span-2 lg:col-span-3">
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
    </div>
  );
}