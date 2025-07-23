import { Review, ReviewSummary } from '@/types/review';

export const mockReviews: Review[] = [
  {
    id: "rev-001",
    bookingId: "book-001",
    userId: "user-001",
    listingId: "boat-001",
    listingName: "Luxury Yacht Adventure",
    listingType: "boat",
    rating: 5,
    comment: "Amazing experience! The boat was in excellent condition and the owner was very helpful. Perfect for our anniversary celebration.",
    wouldRecommend: true,
    isPublic: true,
    isFlagged: false,
    reviewerName: "Sarah Thompson",
    reviewerInitials: "ST",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    ownerResponse: {
      id: "resp-001",
      response: "Thank you so much for the wonderful review! It was a pleasure hosting you both. Hope to see you again soon!",
      respondedAt: "2024-01-16T09:00:00Z",
      responderName: "Captain Mike"
    }
  },
  {
    id: "rev-002",
    bookingId: "book-002",
    userId: "user-002",
    listingId: "boat-001",
    listingName: "Luxury Yacht Adventure",
    listingType: "boat",
    rating: 4,
    comment: "Great boat and location. Only minor issue was the late arrival, but everything else was perfect.",
    wouldRecommend: true,
    isPublic: true,
    isFlagged: false,
    reviewerName: "James Wilson",
    reviewerInitials: "JW",
    createdAt: "2024-01-10T14:30:00Z",
    updatedAt: "2024-01-10T14:30:00Z"
  },
  {
    id: "rev-003",
    bookingId: "book-003",
    userId: "user-003",
    listingId: "course-001",
    listingName: "Basic Boat Handling Course",
    listingType: "course",
    rating: 5,
    comment: "Excellent instructor and comprehensive course material. Learned so much in just one day!",
    wouldRecommend: true,
    isPublic: true,
    isFlagged: false,
    reviewerName: "Maria Garcia",
    reviewerInitials: "MG",
    createdAt: "2024-01-08T16:45:00Z",
    updatedAt: "2024-01-08T16:45:00Z"
  },
  {
    id: "rev-004",
    bookingId: "book-004",
    userId: "user-004",
    listingId: "boat-002",
    listingName: "Speed Boat Rental",
    listingType: "boat",
    rating: 3,
    comment: "Boat was okay but could use some maintenance. The engine made strange noises.",
    wouldRecommend: false,
    isPublic: true,
    isFlagged: false,
    reviewerName: "Robert Chen",
    reviewerInitials: "RC",
    createdAt: "2024-01-05T11:20:00Z",
    updatedAt: "2024-01-05T11:20:00Z"
  },
  {
    id: "rev-005",
    bookingId: "book-005",
    userId: "user-005",
    listingId: "course-002",
    listingName: "Advanced Navigation Course",
    listingType: "course",
    rating: 4,
    comment: "Very informative course with hands-on practice. Would have liked more time on the water.",
    wouldRecommend: true,
    isPublic: true,
    isFlagged: false,
    reviewerName: "Lisa Anderson",
    reviewerInitials: "LA",
    createdAt: "2024-01-03T13:15:00Z",
    updatedAt: "2024-01-03T13:15:00Z"
  }
];

export const getReviewSummary = (listingId: string): ReviewSummary => {
  const listingReviews = mockReviews.filter(review => 
    review.listingId === listingId && review.isPublic && !review.isFlagged
  );
  
  if (listingReviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  }

  const totalRating = listingReviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / listingReviews.length;

  const ratingDistribution = listingReviews.reduce((dist, review) => {
    dist[review.rating as keyof typeof dist]++;
    return dist;
  }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews: listingReviews.length,
    ratingDistribution
  };
};

export const getOwnerReviews = (ownerId: string): Review[] => {
  // Mock function - in real app would filter by owner's listings
  return mockReviews.filter(review => review.isPublic && !review.isFlagged);
};

export const getAllReviewsForAdmin = (): Review[] => {
  return mockReviews;
};