import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { useReviews } from '@/hooks/useReviews';
import { useToast } from '@/hooks/use-toast';

export default function AdminReviewModeration() {
  const { reviews, loading, error, moderateReview } = useReviews();
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'pending' | 'published' | 'hidden'>('all');

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    return review.status === filter;
  });

  const handleModerate = async (reviewId: string, status: 'pending' | 'published' | 'hidden') => {
    const result = await moderateReview(reviewId, status);
    
    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Review Updated",
        description: `Review has been ${status}.`,
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'published': return 'default';
      case 'hidden': return 'destructive';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Review Moderation</h1>
        <p className="text-muted-foreground">
          Manage and moderate user reviews across the platform.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center gap-4">
          <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Badge variant="secondary">
              Total: {reviews.length}
            </Badge>
            <Badge variant="secondary">
              Pending: {reviews.filter(r => r.status === 'pending').length}
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                {filter === 'all' ? 'No reviews found.' : `No ${filter} reviews found.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredReviews.map((review) => (
            <Card key={review.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Review ID: {review.id.slice(0, 8)}...
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(review.status || 'published')}>
                      {review.status || 'published'}
                    </Badge>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleModerate(review.id, 'published')}
                        disabled={review.status === 'published'}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleModerate(review.id, 'pending')}
                        disabled={review.status === 'pending'}
                      >
                        Pending
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleModerate(review.id, 'hidden')}
                        disabled={review.status === 'hidden'}
                      >
                        Hide
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ReviewCard
                  review={review}
                  authorName="Anonymous User"
                />
                
                <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong>Booking ID:</strong> {review.booking_id}
                    </div>
                    <div>
                      <strong>Author ID:</strong> {review.author_id}
                    </div>
                    <div>
                      <strong>Recipient ID:</strong> {review.recipient_id}
                    </div>
                    <div>
                      <strong>Created:</strong> {new Date(review.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}