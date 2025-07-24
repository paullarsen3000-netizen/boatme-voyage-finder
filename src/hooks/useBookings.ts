import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

type Booking = Database['public']['Tables']['bookings']['Row'];
type BookingStatus = Database['public']['Enums']['booking_status'];

interface BookingFilters {
  status?: BookingStatus[];
  startDate?: string;
  endDate?: string;
}

export function useBookings(filters?: BookingFilters) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchBookings();
    } else {
      setBookings([]);
      setLoading(false);
    }
  }, [user, filters]);

  const fetchBookings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('bookings')
        .select('*')
        .or(`renter_id.eq.${user.id},boat_id.in.(select id from boats where owner_id = ${user.id})`);

      if (filters?.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }

      if (filters?.startDate) {
        query = query.gte('start_date', filters.startDate);
      }

      if (filters?.endDate) {
        query = query.lte('end_date', filters.endDate);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      setBookings(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData: {
    boat_id: string;
    start_date: string;
    end_date: string;
    total_price: number;
  }) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ...bookingData,
          renter_id: user.id,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      await fetchBookings(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create booking';
      return { error: errorMessage };
    }
  };

  const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;

      await fetchBookings(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update booking';
      return { error: errorMessage };
    }
  };

  return { 
    bookings, 
    loading, 
    error, 
    createBooking, 
    updateBookingStatus, 
    refetch: fetchBookings 
  };
}