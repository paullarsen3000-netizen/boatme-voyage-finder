export interface BankingDetails {
  id: string;
  userId: string;
  fullName: string;
  businessName?: string;
  bankName: string;
  accountType: 'cheque' | 'savings' | 'business';
  accountNumber: string;
  branchCode: string;
  swiftCode?: string;
  vatNumber?: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  verificationNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayoutRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  requestDate: string;
  processedDate?: string;
  processedBy?: string;
  rejectionReason?: string;
  linkedBookings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PayoutSummary {
  totalEarnings: number;
  totalWithdrawn: number;
  pendingPayouts: number;
  availableBalance: number;
  minimumThreshold: number;
  lastPayoutDate?: string;
}

export interface PayoutFilters {
  status?: PayoutRequest['status'][];
  dateRange?: {
    from: Date;
    to: Date;
  };
  minAmount?: number;
  maxAmount?: number;
  userId?: string;
}