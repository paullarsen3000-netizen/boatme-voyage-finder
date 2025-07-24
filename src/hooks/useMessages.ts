import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

type Message = Database['public']['Tables']['messages']['Row'];

export function useMessages(bookingId?: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    if (user) {
      fetchMessages();
      setupRealtimeSubscription();
    } else {
      setMessages([]);
      setLoading(false);
    }

    // Online/offline listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
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

  const setupRealtimeSubscription = useCallback(() => {
    if (!user) return;

    const channel = supabase
      .channel('messages_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: bookingId ? `booking_id=eq.${bookingId}` : undefined,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          // Only add message if user is involved
          if (newMessage.sender_id === user.id || newMessage.receiver_id === user.id) {
            setMessages(prev => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, bookingId]);

  const sendMessage = async (messageData: {
    receiver_id: string;
    message: string;
    booking_id?: string;
  }) => {
    if (!user || !isOnline) return { error: 'No user logged in or offline' };

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

      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      return { error: errorMessage };
    }
  };

  const setTyping = useCallback((isTyping: boolean) => {
    if (!user || !bookingId) return;
    
    // Implementation for typing indicators would go here
    // This could use a separate realtime channel for typing events
  }, [user, bookingId]);

  return { 
    messages, 
    loading, 
    error, 
    sendMessage, 
    refetch: fetchMessages,
    typingUsers,
    isOnline,
    setTyping
  };
}