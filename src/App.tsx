
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import BoatRentals from "./pages/BoatRentals";
import SearchResults from "./pages/SearchResults";
import BoatDetails from "./pages/BoatDetails";
import SkipperCourses from "./pages/SkipperCourses";
import SkipperCourseDetails from "./pages/SkipperCourseDetails";
import OwnerRegister from "./pages/owner/OwnerRegister";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerBoats from "./pages/owner/OwnerBoats";
import OwnerBookings from "./pages/owner/OwnerBookings";
import OwnerDocuments from "./pages/owner/OwnerDocuments";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import ReceiptView from "./pages/ReceiptView";
import BookingHistory from "./pages/BookingHistory";
import OwnerEarnings from "./pages/owner/OwnerEarnings";
import OwnerPayouts from "./pages/owner/OwnerPayouts";
import OwnerPayoutSettings from "./pages/owner/OwnerPayoutSettings";
import OwnerAnalytics from "./pages/owner/OwnerAnalytics";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminPayouts from "./pages/admin/AdminPayouts";
import OwnerReviews from "./pages/owner/OwnerReviews";
import ReviewSubmission from "./pages/ReviewSubmission";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminDisputes from "./pages/admin/AdminDisputes";
import CourseProviderAnalytics from "./pages/CourseProviderAnalytics";
import Dashboard from "./pages/Dashboard";
import ProfileEdit from "./pages/ProfileEdit";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import HowItWorks from "./pages/HowItWorks";
import NotFound from "./pages/NotFound";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Sitemap from "./pages/Sitemap";
import RobotsTxt from "./pages/RobotsTxt";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <AuthProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/rent" element={<BoatRentals />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/boats/:id" element={<BoatDetails />} />
            <Route path="/skipper-courses" element={<SkipperCourses />} />
            <Route path="/skippers/:id" element={<SkipperCourseDetails />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            
            {/* Auth Routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile/edit" element={
              <ProtectedRoute>
                <ProfileEdit />
              </ProtectedRoute>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/confirmation" element={
              <ProtectedRoute>
                <Confirmation />
              </ProtectedRoute>
            } />
            <Route path="/receipt/:bookingId" element={
              <ProtectedRoute>
                <ReceiptView />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/bookings" element={
              <ProtectedRoute>
                <BookingHistory />
              </ProtectedRoute>
            } />
            
            {/* Owner Protected Routes */}
            <Route path="/owner/register" element={<OwnerRegister />} />
            <Route path="/owner/dashboard" element={
              <ProtectedRoute requireOwner>
                <OwnerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/owner/boats" element={
              <ProtectedRoute requireOwner>
                <OwnerBoats />
              </ProtectedRoute>
            } />
            <Route path="/owner/bookings" element={
              <ProtectedRoute requireOwner>
                <OwnerBookings />
              </ProtectedRoute>
            } />
            <Route path="/owner/documents" element={
              <ProtectedRoute requireOwner>
                <OwnerDocuments />
              </ProtectedRoute>
            } />
            <Route path="/owner/earnings" element={
              <ProtectedRoute requireOwner>
                <OwnerEarnings />
              </ProtectedRoute>
            } />
            <Route path="/owner/analytics" element={
              <ProtectedRoute requireOwner>
                <OwnerAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/owner/payouts" element={
              <ProtectedRoute requireOwner>
                <OwnerPayouts />
              </ProtectedRoute>
            } />
            <Route path="/owner/settings" element={
              <ProtectedRoute requireOwner>
                <OwnerPayoutSettings />
              </ProtectedRoute>
            } />
            <Route path="/owner/reviews" element={
              <ProtectedRoute requireOwner>
                <OwnerReviews />
              </ProtectedRoute>
            } />
            <Route path="/reviews/new/:bookingId" element={
              <ProtectedRoute>
                <ReviewSubmission />
              </ProtectedRoute>
            } />
            
          {/* Admin Routes */}
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/payouts" element={<AdminPayouts />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/disputes" element={<AdminDisputes />} />
            
            {/* Course Provider Routes */}
            <Route path="/provider/analytics" element={<CourseProviderAnalytics />} />
            
            {/* Blog Routes */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            
            {/* SEO Routes */}
            <Route path="/sitemap.xml" element={<Sitemap />} />
            <Route path="/robots.txt" element={<RobotsTxt />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </HelmetProvider>
  </QueryClientProvider>
);

export default App;
