import React, { useState } from 'react';
import { format } from 'date-fns';
import { MessageSquare, Reply } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from './StarRating';
import { useReviews } from '@/hooks/useReviews';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type Review = Database['public']['Tables']['reviews']['Row'];

interface ReviewCardProps {
  review: Review;
  authorName?: string;
  canReply?: boolean;
}

export function ReviewCard({ review, authorName, canReply = false }: ReviewCardProps) {
  const { user } = useAuth();
  const { addOwnerReply } = useReviews();
  const { toast } = useToast();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;

    setSubmitting(true);
    const result = await addOwnerReply(review.id, replyText.trim());

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Reply Posted",
        description: "Your reply has been posted successfully.",
      });
      setReplyText('');
      setShowReplyForm(false);
    }
    setSubmitting(false);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <StarRating value={review.rating} readonly size="sm" />
              <span className="text-sm text-muted-foreground">
                {review.rating}/5
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{authorName || 'Anonymous'}</span>
              <span>•</span>
              <span>{format(new Date(review.created_at), 'MMM dd, yyyy')}</span>
            </div>
          </div>

          {review.status && review.status !== 'published' && (
            <span className={`px-2 py-1 text-xs rounded-full ${
              review.status === 'pending' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {review.status}
            </span>
          )}
        </div>

        {review.review_text && (
          <p className="text-foreground mb-4 leading-relaxed">
            {review.review_text}
          </p>
        )}

        {/* Owner Reply Section */}
        {review.owner_reply && (
          <div className="mt-4 pl-4 border-l-2 border-muted">
            <div className="flex items-center gap-2 mb-2">
              <Reply className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Owner Reply</span>
              {review.owner_reply_at && (
                <span className="text-xs text-muted-foreground">
                  {format(new Date(review.owner_reply_at), 'MMM dd, yyyy')}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {review.owner_reply}
            </p>
          </div>
        )}

        {/* Reply Form */}
        {canReply && !review.owner_reply && (
          <div className="mt-4">
            {showReplyForm ? (
              <div className="space-y-3">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your reply..."
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleReplySubmit}
                    disabled={!replyText.trim() || submitting}
                  >
                    {submitting ? 'Posting...' : 'Post Reply'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowReplyForm(false);
                      setReplyText('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowReplyForm(true)}
                className="gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Reply to Review
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}