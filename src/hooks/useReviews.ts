import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

type Review = Database['public']['Tables']['reviews']['Row'];

export function useReviews(bookingId?: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [bookingId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('reviews').select('*');
      
      if (bookingId) {
        query = query.eq('booking_id', bookingId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      setReviews(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const createReview = async (reviewData: {
    booking_id: string;
    recipient_id: string;
    rating: number;
    review_text?: string;
  }) => {
    const { user } = useAuth();
    if (!user) return { error: 'No user logged in' };

    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          ...reviewData,
          author_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      await fetchReviews(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create review';
      return { error: errorMessage };
    }
  };

  return { reviews, loading, error, createReview, refetch: fetchReviews };
}