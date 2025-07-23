import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, Flag, Reply } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RatingDisplay } from "./RatingDisplay";
import { Review } from "@/types/review";

interface ReviewCardProps {
  review: Review;
  showListingName?: boolean;
  showActions?: boolean;
  onFlag?: (reviewId: string) => void;
  onRespond?: (reviewId: string) => void;
}

export function ReviewCard({ 
  review, 
  showListingName = false, 
  showActions = false,
  onFlag,
  onRespond 
}: ReviewCardProps) {
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {review.reviewerInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-foreground">{review.reviewerName}</span>
                <Badge variant="secondary" className="text-xs">
                  Verified Booking
                </Badge>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <RatingDisplay rating={review.rating} size="sm" showNumber={false} />
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                </span>
              </div>
              {showListingName && (
                <p className="text-sm text-muted-foreground mb-2">
                  {review.listingType === 'boat' ? 'Boat: ' : 'Course: '}{review.listingName}
                </p>
              )}
            </div>
          </div>
          {showActions && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFlag?.(review.id)}
                className="h-8 w-8 p-0"
              >
                <Flag className="h-3 w-3" />
              </Button>
              {!review.ownerResponse && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRespond?.(review.id)}
                  className="h-8 w-8 p-0"
                >
                  <Reply className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </div>

        {review.comment && (
          <p className="text-foreground mb-3 leading-relaxed">{review.comment}</p>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-3 w-3" />
            <span>{review.wouldRecommend ? 'Recommends' : 'Does not recommend'}</span>
          </div>
        </div>

        {review.ownerResponse && (
          <div className="mt-4 pl-4 border-l-2 border-border bg-muted/50 rounded-r-md p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-sm text-foreground">
                Response from {review.ownerResponse.responderName}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(review.ownerResponse.respondedAt), { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm text-foreground">{review.ownerResponse.response}</p>
          </div>
        )}

        {review.isFlagged && (
          <div className="mt-3 p-2 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-xs text-destructive font-medium">
              This review has been flagged for moderation
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}