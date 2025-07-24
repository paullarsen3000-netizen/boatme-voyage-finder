import { useState } from "react";
import { Search, Filter, Flag, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getAllReviewsForAdmin } from "@/lib/reviewData";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function AdminReviews() {
  const [reviews] = useState(getAllReviewsForAdmin());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRating, setSelectedRating] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  const filteredReviews = reviews.filter(review => {
    // Search filter
    const matchesSearch = searchTerm === "" || 
      review.reviewerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.listingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (review.comment && review.comment.toLowerCase().includes(searchTerm.toLowerCase()));

    // Rating filter
    const matchesRating = selectedRating === "all" || 
      review.rating.toString() === selectedRating;

    // Type filter
    const matchesType = selectedType === "all" || 
      review.listingType === selectedType;

    // Tab filter
    const matchesTab = (() => {
      switch (activeTab) {
        case "flagged":
          return review.isFlagged;
        case "responded":
          return !!review.ownerResponse;
        case "unresponded":
          return !review.ownerResponse;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesRating && matchesType && matchesTab;
  });

  const handleFlag = (reviewId: string) => {
    toast({
      title: "Review Flagged",
      description: "The review has been flagged for moderation.",
      variant: "destructive"
    });
  };

  const handleDelete = (reviewId: string) => {
    toast({
      title: "Review Deleted",
      description: "The review has been permanently deleted.",
      variant: "destructive"
    });
  };

  const getTabCounts = () => ({
    all: reviews.length,
    flagged: reviews.filter(r => r.isFlagged).length,
    responded: reviews.filter(r => r.ownerResponse).length,
    unresponded: reviews.filter(r => !r.ownerResponse).length
  });

  const tabCounts = getTabCounts();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Review Management</h1>
        <p className="text-muted-foreground">
          Monitor and moderate customer reviews across the platform
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
                <p className="text-2xl font-bold text-foreground">{tabCounts.all}</p>
              </div>
              <Eye className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Flagged Reviews</p>
                <p className="text-2xl font-bold text-foreground">{tabCounts.flagged}</p>
              </div>
              <Flag className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round((tabCounts.responded / tabCounts.all) * 100)}%
                </p>
              </div>
              <Badge className="h-8 w-8 p-0" variant="secondary">R</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                <p className="text-2xl font-bold text-foreground">
                  {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
                </p>
              </div>
              <div className="text-yellow-400">⭐</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search reviews, customers, or listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedRating} onValueChange={setSelectedRating}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="boat">Boats</SelectItem>
                <SelectItem value="course">Courses</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setSelectedRating("all");
              setSelectedType("all");
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({tabCounts.all})</TabsTrigger>
              <TabsTrigger value="flagged">Flagged ({tabCounts.flagged})</TabsTrigger>
              <TabsTrigger value="responded">Responded ({tabCounts.responded})</TabsTrigger>
              <TabsTrigger value="unresponded">No Response ({tabCounts.unresponded})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredReviews.length === 0 ? (
                <div className="text-center py-8">
                  <Eye className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No reviews found</h3>
                  <p className="text-muted-foreground">
                    No reviews match the current filters.
                  </p>
                </div>
              ) : (
                filteredReviews.map((review) => (
                  <div key={review.id} className="relative">
                    {/* TODO: Update to use new ReviewCard component */}
                    <div className="p-4 border rounded-lg">
                      <p>Review by {review.reviewerName} - {review.rating}/5 stars</p>
                      <p>{review.comment}</p>
                    </div>
                    
                    {/* Admin Actions */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFlag(review.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Flag className="h-3 w-3" />
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Review</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                              Are you sure you want to permanently delete this review? This action cannot be undone.
                            </p>
                            <div className="flex justify-end gap-3">
                              <Button variant="outline">Cancel</Button>
                              <Button 
                                variant="destructive"
                                onClick={() => handleDelete(review.id)}
                              >
                                Delete Review
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}