import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Booking } from "@/types/booking";

interface ReviewFormProps {
  booking: Booking;
  onSubmit?: (reviewData: {
    rating: number;
    comment: string;
    wouldRecommend: boolean;
  }) => void;
  onCancel?: () => void;
}

export function ReviewForm({ booking, onSubmit, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSubmit?.({
        rating,
        comment,
        wouldRecommend
      });
      
      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback! Your review has been submitted successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-lg">
          Review: {booking.itemName}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Share your experience to help future renters
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Overall Rating *</Label>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => {
                const starValue = i + 1;
                const filled = starValue <= (hoveredRating || rating);
                
                return (
                  <button
                    key={i}
                    type="button"
                    className="p-1 rounded transition-transform hover:scale-110"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoveredRating(starValue)}
                    onMouseLeave={() => setHoveredRating(0)}
                  >
                    <Star
                      className={cn(
                        "h-8 w-8 transition-colors",
                        filled
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-muted text-muted-foreground hover:fill-yellow-200 hover:text-yellow-200"
                      )}
                    />
                  </button>
                );
              })}
              {rating > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating} out of 5 stars
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-sm font-medium">
              Your Review (Optional)
            </Label>
            <Textarea
              id="comment"
              placeholder="Tell us about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {comment.length}/500 characters
            </p>
          </div>

          {/* Recommendation */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <Label className="text-sm font-medium">
                Would you recommend this {booking.itemType}?
              </Label>
              <p className="text-xs text-muted-foreground">
                Help others make informed decisions
              </p>
            </div>
            <Switch
              checked={wouldRecommend}
              onCheckedChange={setWouldRecommend}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || rating === 0}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}