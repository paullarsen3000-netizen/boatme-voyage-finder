import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { mockBookings } from "@/lib/mockData";
import { Booking } from "@/types/booking";

export default function ReviewSubmission() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching booking data
    const fetchBooking = async () => {
      setLoading(true);
      // In real app, fetch from API
      const foundBooking = mockBookings.find(b => b.id === bookingId);
      
      if (!foundBooking || foundBooking.status !== 'completed') {
        navigate('/dashboard');
        return;
      }
      
      setBooking(foundBooking);
      setLoading(false);
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId, navigate]);

  const handleSubmit = (reviewData: any) => {
    console.log('Review submitted:', reviewData);
    // In real app, submit to API
    navigate('/dashboard');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading booking details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The booking you're trying to review could not be found or is not eligible for review.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Submit Review</h1>
          <p className="text-muted-foreground">
            Share your experience to help other users
          </p>
        </div>

        <ReviewForm
          bookingId={booking.id}
          recipientId={booking.ownerId}
          recipientName={booking.ownerName}
          onSuccess={() => navigate('/dashboard')}
        />
      </div>
    </div>
  );
}