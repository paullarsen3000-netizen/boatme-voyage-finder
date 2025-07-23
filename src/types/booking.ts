export interface Booking {
  id: string;
  bookingId: string;
  userId: string;
  ownerId: string;
  itemId: string;
  itemName: string;
  itemType: 'boat' | 'course';
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  ownerName: string;
  ownerEmail: string;
  startDate: string;
  endDate: string;
  bookingDate: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'confirmed';
  totalAmount: number;
  baseAmount: number;
  serviceFee: number;
  ownerEarnings: number;
  paymentMethod: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface EarningsSummary {
  totalEarnings: number;
  monthlyEarnings: number;
  totalBookings: number;
  monthlyBookings: number;
  pendingPayouts: number;
  completedBookings: number;
  averageBookingValue: number;
}

export interface BookingFilters {
  dateRange?: {
    from: Date;
    to: Date;
  };
  status?: Booking['status'][];
  itemType?: 'boat' | 'course';
  sortBy?: 'date' | 'amount' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}