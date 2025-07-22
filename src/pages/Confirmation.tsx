import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Download, Mail, ArrowRight } from "lucide-react";

export default function Confirmation() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const amount = searchParams.get('amount');
  
  const [bookingDetails] = useState({
    itemName: 'Luxury Speedboat - Cape Town',
    dates: 'Dec 15 - Dec 17, 2024',
    location: 'V&A Waterfront Marina',
    checkIn: '09:00',
    checkOut: '18:00',
    totalPaid: amount ? parseInt(amount) : 9000,
    paymentMethod: '**** 3456',
    confirmationDate: new Date().toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  });

  const generateCalendarLink = () => {
    const startDate = new Date('2024-12-15T09:00:00');
    const endDate = new Date('2024-12-17T18:00:00');
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(bookingDetails.itemName)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent(`Booking ID: ${bookingId}\nLocation: ${bookingDetails.location}`)}`;
    
    return googleCalendarUrl;
  };

  if (!bookingId) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No booking information found. Please check your booking confirmation email.
            </p>
            <Button asChild className="w-full mt-4">
              <Link to="/">Return Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-green-700 mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">
            Your payment has been processed successfully
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Booking Details
              <span className="text-sm font-normal text-muted-foreground">
                #{bookingId}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">{bookingDetails.itemName}</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><strong>Dates:</strong> {bookingDetails.dates}</p>
                  <p><strong>Location:</strong> {bookingDetails.location}</p>
                  <p><strong>Check-in:</strong> {bookingDetails.checkIn}</p>
                  <p><strong>Check-out:</strong> {bookingDetails.checkOut}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Payment Summary</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><strong>Amount Paid:</strong> R{bookingDetails.totalPaid.toLocaleString()}</p>
                  <p><strong>Payment Method:</strong> Card ending in {bookingDetails.paymentMethod}</p>
                  <p><strong>Confirmation Date:</strong> {bookingDetails.confirmationDate}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Button variant="outline" asChild>
            <a 
              href={generateCalendarLink()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Add to Calendar
            </a>
          </Button>
          
          <Button variant="outline" onClick={() => window.print()}>
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  Confirmation Email Sent
                </h3>
                <p className="text-sm text-blue-700 mb-3">
                  We've sent a detailed confirmation email with all booking information, 
                  contact details, and important instructions to your email address.
                </p>
                <p className="text-sm text-blue-600">
                  <strong>What's Next:</strong> The boat owner will contact you within 24 hours 
                  to confirm pickup details and provide any additional instructions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button asChild className="flex-1">
            <Link to="/owner/bookings" className="flex items-center justify-center gap-2">
              View My Bookings
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="flex-1">
            <Link to="/">
              Book Another Experience
            </Link>
          </Button>
        </div>

        <div className="text-center mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Need help? Contact our support team at{" "}
            <a href="mailto:support@boatme.co.za" className="text-primary hover:underline">
              support@boatme.co.za
            </a>{" "}
            or{" "}
            <a href="tel:+27123456789" className="text-primary hover:underline">
              +27 12 345 6789
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}