export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  listingId: string;
  listingName: string;
  listingType: 'boat' | 'course';
  rating: number; // 1-5
  comment?: string;
  wouldRecommend: boolean;
  isPublic: boolean;
  isFlagged: boolean;
  reviewerName: string;
  reviewerInitials: string;
  createdAt: string;
  updatedAt: string;
  ownerResponse?: {
    id: string;
    response: string;
    respondedAt: string;
    responderName: string;
  };
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface ReviewFilters {
  rating?: number[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  listingType?: 'boat' | 'course';
  hasComment?: boolean;
  isFlagged?: boolean;
}