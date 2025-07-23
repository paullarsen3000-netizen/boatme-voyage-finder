import { Booking, EarningsSummary } from '@/types/booking';

// Mock bookings data
export const mockBookings: Booking[] = [
  {
    id: '1',
    bookingId: 'BME-2025-001',
    userId: 'user-1',
    ownerId: 'owner-1',
    itemId: 'boat-1',
    itemName: 'Luxury Yacht Charter',
    itemType: 'boat',
    guestName: 'John Doe',
    guestEmail: 'john.doe@example.com',
    guestPhone: '+27 82 123 4567',
    ownerName: 'Cape Town Boat Rentals',
    ownerEmail: 'info@ctboats.co.za',
    startDate: '2025-01-25',
    endDate: '2025-01-27',
    bookingDate: '2025-01-15',
    status: 'upcoming',
    totalAmount: 4950,
    baseAmount: 4500,
    serviceFee: 450,
    ownerEarnings: 4275,
    paymentMethod: 'Credit Card',
    location: 'V&A Waterfront Marina, Cape Town',
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
  },
  {
    id: '2',
    bookingId: 'BME-2024-195',
    userId: 'user-2',
    ownerId: 'owner-1',
    itemId: 'boat-2',
    itemName: 'Sunset Cruise Boat',
    itemType: 'boat',
    guestName: 'Sarah Wilson',
    guestEmail: 'sarah.wilson@example.com',
    guestPhone: '+27 83 456 7890',
    ownerName: 'Cape Town Boat Rentals',
    ownerEmail: 'info@ctboats.co.za',
    startDate: '2024-12-20',
    endDate: '2024-12-20',
    bookingDate: '2024-12-18',
    status: 'completed',
    totalAmount: 2400,
    baseAmount: 2200,
    serviceFee: 200,
    ownerEarnings: 2090,
    paymentMethod: 'Credit Card',
    location: 'Hout Bay Harbor, Cape Town',
    createdAt: '2024-12-18T14:20:00Z',
    updatedAt: '2024-12-20T18:00:00Z',
  },
  {
    id: '3',
    bookingId: 'BME-2024-187',
    userId: 'user-3',
    ownerId: 'owner-2',
    itemId: 'course-1',
    itemName: 'Day Skipper Course',
    itemType: 'course',
    guestName: 'Mike Johnson',
    guestEmail: 'mike.johnson@example.com',
    guestPhone: '+27 84 789 0123',
    ownerName: 'Ocean Academy',
    ownerEmail: 'courses@oceanacademy.co.za',
    startDate: '2024-12-10',
    endDate: '2024-12-12',
    bookingDate: '2024-11-25',
    status: 'completed',
    totalAmount: 3200,
    baseAmount: 3000,
    serviceFee: 200,
    ownerEarnings: 2850,
    paymentMethod: 'Bank Transfer',
    location: 'Royal Cape Yacht Club, Cape Town',
    createdAt: '2024-11-25T09:15:00Z',
    updatedAt: '2024-12-12T16:30:00Z',
  },
  {
    id: '4',
    bookingId: 'BME-2024-156',
    userId: 'user-4',
    ownerId: 'owner-1',
    itemId: 'boat-3',
    itemName: 'Speed Boat Adventure',
    itemType: 'boat',
    guestName: 'Lisa Chen',
    guestEmail: 'lisa.chen@example.com',
    ownerName: 'Cape Town Boat Rentals',
    ownerEmail: 'info@ctboats.co.za',
    startDate: '2024-11-15',
    endDate: '2024-11-15',
    bookingDate: '2024-11-10',
    status: 'cancelled',
    totalAmount: 1800,
    baseAmount: 1650,
    serviceFee: 150,
    ownerEarnings: 0,
    paymentMethod: 'Credit Card',
    location: 'Gordon\'s Bay Marina',
    createdAt: '2024-11-10T11:45:00Z',
    updatedAt: '2024-11-12T09:20:00Z',
  },
  {
    id: '5',
    bookingId: 'BME-2024-203',
    userId: 'user-5',
    ownerId: 'owner-3',
    itemId: 'boat-4',
    itemName: 'Catamaran Day Trip',
    itemType: 'boat',
    guestName: 'David Brown',
    guestEmail: 'david.brown@example.com',
    guestPhone: '+27 85 234 5678',
    ownerName: 'Atlantic Sailing',
    ownerEmail: 'bookings@atlanticsailing.co.za',
    startDate: '2025-02-05',
    endDate: '2025-02-05',
    bookingDate: '2025-01-20',
    status: 'confirmed',
    totalAmount: 3600,
    baseAmount: 3300,
    serviceFee: 300,
    ownerEarnings: 3135,
    paymentMethod: 'Credit Card',
    location: 'Clifton Beach, Cape Town',
    createdAt: '2025-01-20T16:30:00Z',
    updatedAt: '2025-01-20T16:30:00Z',
  },
];

// Mock earnings summary
export const mockEarningsSummary: EarningsSummary = {
  totalEarnings: 12450,
  monthlyEarnings: 7410,
  totalBookings: 23,
  monthlyBookings: 8,
  pendingPayouts: 1580,
  completedBookings: 18,
  averageBookingValue: 2890,
};

// Helper functions to filter data by user role
export const getBookingsForUser = (userId: string, role: 'renter' | 'owner'): Booking[] => {
  if (role === 'renter') {
    return mockBookings.filter(booking => booking.userId === userId);
  } else {
    return mockBookings.filter(booking => booking.ownerId === userId);
  }
};

export const getEarningsForOwner = (ownerId: string): EarningsSummary => {
  const ownerBookings = mockBookings.filter(booking => booking.ownerId === ownerId);
  const completedBookings = ownerBookings.filter(booking => booking.status === 'completed');
  
  const totalEarnings = completedBookings.reduce((sum, booking) => sum + booking.ownerEarnings, 0);
  const currentMonth = new Date().getMonth();
  const monthlyBookings = ownerBookings.filter(
    booking => new Date(booking.createdAt).getMonth() === currentMonth
  );
  const monthlyEarnings = monthlyBookings
    .filter(booking => booking.status === 'completed')
    .reduce((sum, booking) => sum + booking.ownerEarnings, 0);
  
  return {
    totalEarnings,
    monthlyEarnings,
    totalBookings: ownerBookings.length,
    monthlyBookings: monthlyBookings.length,
    pendingPayouts: ownerBookings
      .filter(booking => booking.status === 'upcoming' || booking.status === 'confirmed')
      .reduce((sum, booking) => sum + booking.ownerEarnings, 0),
    completedBookings: completedBookings.length,
    averageBookingValue: completedBookings.length > 0 
      ? totalEarnings / completedBookings.length 
      : 0,
  };
};