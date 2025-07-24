import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from './StarRating';
import { useReviews } from '@/hooks/useReviews';
import { useToast } from '@/hooks/use-toast';

interface ReviewFormProps {
  bookingId: string;
  recipientId: string;
  recipientName?: string;
  onSuccess?: () => void;
}

export function ReviewForm({ bookingId, recipientId, recipientName, onSuccess }: ReviewFormProps) {
  const { submitReview } = useReviews();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const result = await submitReview({
      booking_id: bookingId,
      recipient_id: recipientId,
      rating,
      review_text: reviewText.trim() || undefined,
    });

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Review Submitted",
        description: "Your review has been submitted successfully.",
      });
      setRating(0);
      setReviewText('');
      onSuccess?.();
    }
    setSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Leave a Review {recipientName && `for ${recipientName}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              How would you rate your experience?
            </label>
            <StarRating value={rating} onChange={setRating} size="lg" />
          </div>

          <div>
            <label htmlFor="review-text" className="block text-sm font-medium mb-2">
              Share your experience (optional)
            </label>
            <Textarea
              id="review-text"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell others about your experience..."
              rows={4}
            />
          </div>

          <Button 
            type="submit" 
            disabled={rating === 0 || submitting}
            className="w-full"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}