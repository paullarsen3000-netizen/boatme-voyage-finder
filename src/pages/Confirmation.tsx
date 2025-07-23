import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Download, Eye, ArrowRight } from 'lucide-react';
import { ReceiptDownloadButton } from '@/components/ReceiptDownloadButton';
import { BookingData } from '@/lib/receiptGenerator';

export default function Confirmation() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const amount = searchParams.get('amount');
  
  const [bookingDetails] = useState({
    bookingId: bookingId || 'BME-2025-001',
    boatName: 'Luxury Yacht Charter',
    startDate: '2025-01-25',
    endDate: '2025-01-27',
    location: 'V&A Waterfront Marina, Cape Town',
    totalPaid: amount ? parseInt(amount) : 4950,
    confirmationDate: new Date().toLocaleDateString('en-ZA'),
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com'
  });

  // Mock booking data for receipt generation
  const mockBookingData: BookingData = {
    id: bookingDetails.bookingId,
    bookingId: bookingDetails.bookingId,
    customerName: bookingDetails.customerName,
    customerEmail: bookingDetails.customerEmail,
    customerPhone: '+27 82 123 4567',
    providerName: 'Cape Town Boat Rentals',
    providerEmail: 'info@ctboats.co.za',
    itemName: bookingDetails.boatName,
    itemType: 'boat',
    bookingDate: bookingDetails.confirmationDate,
    startDate: bookingDetails.startDate,
    endDate: bookingDetails.endDate,
    baseAmount: 4500,
    serviceFee: 450,
    vatAmount: 0,
    totalAmount: bookingDetails.totalPaid,
    paymentMethod: 'Credit Card',
    location: bookingDetails.location,
    createdAt: new Date().toISOString()
  };

  const generateCalendarLink = () => {
    const startDate = new Date(bookingDetails.startDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(bookingDetails.endDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const title = encodeURIComponent(`Boat Rental: ${bookingDetails.boatName}`);
    const details = encodeURIComponent(`Booking ID: ${bookingDetails.bookingId}\nLocation: ${bookingDetails.location}`);
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}`;
  };

  if (!bookingId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">No booking information found.</p>
            <Link to="/">
              <Button>Return Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Booking Confirmed!</CardTitle>
            <p className="text-muted-foreground">
              Your booking has been successfully confirmed and paid.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Booking Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Booking ID:</span>
                  <span className="font-medium">{bookingDetails.bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Boat:</span>
                  <span className="font-medium">{bookingDetails.boatName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dates:</span>
                  <span className="font-medium">
                    {bookingDetails.startDate} - {bookingDetails.endDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">{bookingDetails.location}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-muted-foreground">Total Paid:</span>
                  <span className="font-bold text-lg">R{bookingDetails.totalPaid.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => window.open(generateCalendarLink(), '_blank')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Add to Calendar
              </Button>
              <div className="flex-1">
                <ReceiptDownloadButton 
                  booking={mockBookingData}
                  variant="outline"
                  size="default"
                />
              </div>
            </div>

            <div className="text-center space-y-2">
              <Link to={`/receipt/${bookingDetails.bookingId}`}>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Receipt Online
                </Button>
              </Link>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">📧 Confirmation Email Sent</h4>
              <p className="text-sm text-blue-700">
                A confirmation email with your booking details and receipt has been sent to {bookingDetails.customerEmail}.
                You'll also receive a reminder email 24 hours before your booking starts.
              </p>
            </div>

            <div className="flex gap-3">
              <Link to="/dashboard" className="flex-1">
                <Button variant="outline" className="w-full">
                  View My Bookings
                </Button>
              </Link>
              <Link to="/" className="flex-1">
                <Button className="w-full">
                  Book Another Experience
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="text-center text-sm text-muted-foreground border-t pt-4">
              <p>Need help? Contact us at</p>
              <a href="mailto:support@boatme.co.za" className="text-primary hover:underline">
                support@boatme.co.za
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}