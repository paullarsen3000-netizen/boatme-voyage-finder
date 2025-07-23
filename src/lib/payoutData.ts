import { BankingDetails, PayoutRequest, PayoutSummary } from '@/types/payout';

// Mock banking details
export const mockBankingDetails: BankingDetails[] = [
  {
    id: '1',
    userId: 'user-1',
    fullName: 'John Smith',
    businessName: 'Smith Marine Rentals',
    bankName: 'First National Bank',
    accountType: 'business',
    accountNumber: '1234567890',
    branchCode: '250655',
    vatNumber: '1234567890',
    verificationStatus: 'approved',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
];

// Mock payout requests
export const mockPayoutRequests: PayoutRequest[] = [
  {
    id: '1',
    userId: 'user-1',
    userName: 'John Smith',
    userEmail: 'john@example.com',
    amount: 2500.00,
    currency: 'ZAR',
    status: 'paid',
    requestDate: '2024-01-20T10:00:00Z',
    processedDate: '2024-01-22T15:30:00Z',
    processedBy: 'admin-1',
    linkedBookings: ['booking-1', 'booking-2'],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-22T15:30:00Z',
  },
  {
    id: '2',
    userId: 'user-1',
    userName: 'John Smith',
    userEmail: 'john@example.com',
    amount: 1800.00,
    currency: 'ZAR',
    status: 'pending',
    requestDate: '2024-02-01T09:15:00Z',
    linkedBookings: ['booking-3', 'booking-4'],
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-01T09:15:00Z',
  },
  {
    id: '3',
    userId: 'user-2',
    userName: 'Sarah Johnson',
    userEmail: 'sarah@example.com',
    amount: 3200.00,
    currency: 'ZAR',
    status: 'approved',
    requestDate: '2024-02-05T14:20:00Z',
    processedBy: 'admin-1',
    linkedBookings: ['booking-5'],
    createdAt: '2024-02-05T14:20:00Z',
    updatedAt: '2024-02-06T10:45:00Z',
  },
];

// Mock payout summary
export const mockPayoutSummary: PayoutSummary = {
  totalEarnings: 15750.00,
  totalWithdrawn: 8500.00,
  pendingPayouts: 1800.00,
  availableBalance: 5450.00,
  minimumThreshold: 500.00,
  lastPayoutDate: '2024-01-22T15:30:00Z',
};

// Utility functions
export const calculateAvailableBalance = (userId: string): number => {
  // In a real implementation, this would query completed bookings
  // and subtract already withdrawn amounts
  return mockPayoutSummary.availableBalance;
};

export const getUserBankingDetails = (userId: string): BankingDetails | undefined => {
  return mockBankingDetails.find(details => details.userId === userId);
};

export const getUserPayouts = (userId: string): PayoutRequest[] => {
  return mockPayoutRequests.filter(payout => payout.userId === userId);
};

export const getAllPayouts = (): PayoutRequest[] => {
  return mockPayoutRequests;
};

export const getPayoutSummary = (userId: string): PayoutSummary => {
  return mockPayoutSummary;
};