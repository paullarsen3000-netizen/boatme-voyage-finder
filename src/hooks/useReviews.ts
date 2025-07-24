import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

type Review = Database['public']['Tables']['reviews']['Row'];

export function useReviews(bookingId?: string) {
  const { user } = useAuth();
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

  const submitReview = async (reviewData: {
    booking_id: string;
    recipient_id: string;
    rating: number;
    review_text?: string;
  }) => {
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit review';
      return { error: errorMessage };
    }
  };

  const addOwnerReply = async (reviewId: string, reply: string) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({
          owner_reply: reply,
          owner_reply_at: new Date().toISOString()
        })
        .eq('id', reviewId)
        .select()
        .single();

      if (error) throw error;

      await fetchReviews();
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add reply';
      return { error: errorMessage };
    }
  };

  const moderateReview = async (reviewId: string, status: 'pending' | 'published' | 'hidden') => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({
          status,
          moderated_by: user.id,
          moderated_at: new Date().toISOString()
        })
        .eq('id', reviewId)
        .select()
        .single();

      if (error) throw error;

      await fetchReviews();
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to moderate review';
      return { error: errorMessage };
    }
  };

  return { 
    reviews, 
    loading, 
    error, 
    submitReview,
    addOwnerReply,
    moderateReview,
    refetch: fetchReviews 
  };
}