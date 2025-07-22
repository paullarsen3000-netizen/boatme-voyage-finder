import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BoatRentals from "./pages/BoatRentals";
import BoatDetails from "./pages/BoatDetails";
import SkipperCourses from "./pages/SkipperCourses";
import SkipperCourseDetails from "./pages/SkipperCourseDetails";
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
          <Route path="/boats/:id" element={<BoatDetails />} />
          <Route path="/skipper-courses" element={<SkipperCourses />} />
          <Route path="/skippers/:id" element={<SkipperCourseDetails />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
