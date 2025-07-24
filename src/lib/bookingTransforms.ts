import { Database } from '@/integrations/supabase/types';
import { Booking } from '@/types/booking';

type SupabaseBooking = Database['public']['Tables']['bookings']['Row'];

// Transform Supabase booking data to match the UI expectations
export function transformSupabaseBooking(booking: SupabaseBooking): Booking {
  return {
    id: booking.id,
    bookingId: booking.id,
    userId: booking.renter_id,
    ownerId: '', // Could be fetched via join
    itemId: booking.boat_id,
    itemName: 'Boat', // Could be fetched via join
    itemType: 'boat' as const,
    guestName: 'Guest', // Could be fetched via join
    guestEmail: '', // Could be fetched via join
    guestPhone: '',
    ownerName: 'Owner', // Could be fetched via join
    ownerEmail: '', // Could be fetched via join
    startDate: booking.start_date,
    endDate: booking.end_date,
    bookingDate: booking.created_at,
    status: booking.status === 'pending' ? 'upcoming' : 
            booking.status === 'confirmed' ? 'confirmed' :
            booking.status === 'cancelled' ? 'cancelled' : 'completed',
    totalAmount: Number(booking.total_price),
    baseAmount: Number(booking.total_price) * 0.85, // Estimate
    serviceFee: Number(booking.total_price) * 0.15, // Estimate
    ownerEarnings: Number(booking.total_price) * 0.85, // Estimate
    paymentMethod: 'Card', // Default
    location: 'Location', // Could be fetched via join
    createdAt: booking.created_at,
    updatedAt: booking.updated_at
  };
}

export function transformSupabaseBookings(bookings: SupabaseBooking[]): Booking[] {
  return bookings.map(transformSupabaseBooking);
}