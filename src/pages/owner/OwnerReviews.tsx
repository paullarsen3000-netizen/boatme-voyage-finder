import { useState } from "react";
import { MessageSquare, Star, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ReviewSummary } from "@/components/reviews/ReviewSummary";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { getOwnerReviews, getReviewSummary } from "@/lib/reviewData";
import { useToast } from "@/hooks/use-toast";

export default function OwnerReviews() {
  const [reviews] = useState(getOwnerReviews("owner-001"));
  const [activeTab, setActiveTab] = useState("all");
  const [responseText, setResponseText] = useState("");
  const [respondingToReview, setRespondingToReview] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock overall summary across all listings
  const overallSummary = {
    averageRating: 4.6,
    totalReviews: reviews.length,
    ratingDistribution: { 5: 8, 4: 4, 3: 1, 2: 0, 1: 0 }
  };

  const filteredReviews = reviews.filter(review => {
    switch (activeTab) {
      case "boats":
        return review.listingType === "boat";
      case "courses":
        return review.listingType === "course";
      case "pending":
        return !review.ownerResponse;
      default:
        return true;
    }
  });

  const handleRespond = (reviewId: string) => {
    setRespondingToReview(reviewId);
    setResponseText("");
  };

  const handleSubmitResponse = async () => {
    if (!responseText.trim()) {
      toast({
        title: "Response Required",
        description: "Please enter a response before submitting.",
        variant: "destructive"
      });
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Response Submitted",
      description: "Your response has been added to the review."
    });
    
    setRespondingToReview(null);
    setResponseText("");
  };

  const getTabCounts = () => ({
    all: reviews.length,
    boats: reviews.filter(r => r.listingType === "boat").length,
    courses: reviews.filter(r => r.listingType === "course").length,
    pending: reviews.filter(r => !r.ownerResponse).length
  });

  const tabCounts = getTabCounts();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reviews & Ratings</h1>
        <p className="text-muted-foreground">
          Manage customer feedback and respond to reviews
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                <p className="text-2xl font-bold text-foreground">
                  {overallSummary.averageRating.toFixed(1)}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
                <p className="text-2xl font-bold text-foreground">{overallSummary.totalReviews}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Responses</p>
                <p className="text-2xl font-bold text-foreground">{tabCounts.pending}</p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recommendation Rate</p>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round((reviews.filter(r => r.wouldRecommend).length / reviews.length) * 100)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ReviewSummary summary={overallSummary} />
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({tabCounts.all})</TabsTrigger>
              <TabsTrigger value="boats">Boats ({tabCounts.boats})</TabsTrigger>
              <TabsTrigger value="courses">Courses ({tabCounts.courses})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({tabCounts.pending})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredReviews.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No reviews found</h3>
                  <p className="text-muted-foreground">
                    {activeTab === "pending" 
                      ? "All reviews have been responded to."
                      : "No reviews match the current filter."}
                  </p>
                </div>
              ) : (
                filteredReviews.map((review) => (
                  <div key={review.id} className="p-4 border rounded-lg">
                    <p>Review by {review.reviewerName} - {review.rating}/5 stars</p>
                    <p>{review.comment}</p>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Response Dialog */}
      <Dialog open={!!respondingToReview} onOpenChange={() => setRespondingToReview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Write your response to this review..."
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              className="min-h-[100px]"
              maxLength={300}
            />
            <p className="text-xs text-muted-foreground text-right">
              {responseText.length}/300 characters
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setRespondingToReview(null)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitResponse}>
                Submit Response
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}