import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { receiptGenerator, BookingData } from '@/lib/receiptGenerator';
import { useToast } from '@/hooks/use-toast';

export default function ReceiptView() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [receiptHTML, setReceiptHTML] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!bookingId) {
      navigate('/dashboard');
      return;
    }

    // Mock booking data - in real app, fetch from Supabase
    const mockBooking: BookingData = {
      id: bookingId,
      bookingId: bookingId,
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      customerPhone: '+27 82 123 4567',
      providerName: 'Cape Town Boat Rentals',
      providerEmail: 'info@ctboats.co.za',
      itemName: 'Luxury Yacht Charter',
      itemType: 'boat',
      bookingDate: new Date().toLocaleDateString('en-ZA'),
      startDate: '2025-01-25',
      endDate: '2025-01-27',
      baseAmount: 4500,
      serviceFee: 450,
      vatAmount: 0,
      totalAmount: 4950,
      paymentMethod: 'Credit Card',
      location: 'V&A Waterfront Marina, Cape Town',
      createdAt: new Date().toISOString()
    };

    setBooking(mockBooking);
    
    // Generate receipt HTML
    receiptGenerator.generateReceiptHTML(mockBooking, 'receipt').then((html) => {
      setReceiptHTML(html);
      setIsLoading(false);
    });
  }, [bookingId, navigate]);

  const handleDownload = async () => {
    if (!booking) return;
    
    try {
      await receiptGenerator.downloadReceipt(booking, 'receipt');
      toast({
        title: "Receipt Downloaded",
        description: "Your receipt has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download receipt. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Receipt not found.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="print:hidden">
            <CardTitle>Receipt View</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div 
              className="receipt-container"
              dangerouslySetInnerHTML={{ __html: receiptHTML }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}