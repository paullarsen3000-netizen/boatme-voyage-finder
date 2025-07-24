import React from 'react';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { StarRating } from '@/components/reviews/StarRating';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReviewFlowDemo() {
  // Demo review data
  const demoReview = {
    id: '1',
    booking_id: 'booking-123',
    author_id: 'user-1',
    recipient_id: 'owner-1',
    rating: 5,
    review_text: 'Amazing boat rental experience! The owner was very helpful and the boat was in excellent condition.',
    created_at: new Date().toISOString(),
    owner_reply: 'Thank you for the wonderful review! We hope to see you again soon.',
    owner_reply_at: new Date().toISOString(),
    status: 'published',
    moderated_by: null,
    moderated_at: null
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Review System Demo</h1>
        <p className="text-muted-foreground">
          Complete review flow with ratings, submissions, owner replies, and admin moderation.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Review Submission */}
        <Card>
          <CardHeader>
            <CardTitle>Review Submission</CardTitle>
          </CardHeader>
          <CardContent>
            <ReviewForm
              bookingId="demo-booking"
              recipientId="demo-owner"
              recipientName="Boat Owner"
              onSuccess={() => console.log('Review submitted!')}
            />
          </CardContent>
        </Card>

        {/* Review Display */}
        <Card>
          <CardHeader>
            <CardTitle>Review Display</CardTitle>
          </CardHeader>
          <CardContent>
            <ReviewCard
              review={demoReview}
              authorName="John Doe"
              canReply={true}
            />
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Features Implemented</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">✅ Star Rating Component</h3>
              <StarRating value={4} onChange={(rating) => console.log(rating)} />
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">✅ Review Submission</h3>
              <p className="text-sm text-muted-foreground">
                Form with star ratings and text reviews, unique constraint per booking
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">✅ Owner Replies</h3>
              <p className="text-sm text-muted-foreground">
                Boat owners can reply to reviews with timestamps
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">✅ Admin Moderation</h3>
              <p className="text-sm text-muted-foreground">
                Admin interface to approve, hide, or manage reviews
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">✅ RLS Security</h3>
              <p className="text-sm text-muted-foreground">
                Row-level security ensures proper access control
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}