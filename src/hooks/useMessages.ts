import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

type Message = Database['public']['Tables']['messages']['Row'];

export function useMessages(bookingId?: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchMessages();
    } else {
      setMessages([]);
      setLoading(false);
    }
  }, [user, bookingId]);

  const fetchMessages = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (bookingId) {
        query = query.eq('booking_id', bookingId);
      }

      const { data, error } = await query.order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (messageData: {
    receiver_id: string;
    message: string;
    booking_id?: string;
  }) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          ...messageData,
          sender_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      await fetchMessages(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      return { error: errorMessage };
    }
  };

  return { messages, loading, error, sendMessage, refetch: fetchMessages };
}