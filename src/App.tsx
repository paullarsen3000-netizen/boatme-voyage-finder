import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          <Route path="/owner/register" element={<OwnerRegister />} />
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/boats" element={<OwnerBoats />} />
          <Route path="/owner/bookings" element={<OwnerBookings />} />
          <Route path="/owner/documents" element={<OwnerDocuments />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation" element={<Confirmation />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
