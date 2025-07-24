import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

type Payout = Database['public']['Tables']['payouts']['Row'];
type PayoutStatus = Database['public']['Enums']['payout_status'];
type BankingDetails = Database['public']['Tables']['banking_details']['Row'];

interface PayoutSummary {
  totalEarnings: number;
  totalPaid: number;
  pendingAmount: number;
  availableBalance: number;
  minimumThreshold: number;
}

export function usePayouts() {
  const { user } = useAuth();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [summary, setSummary] = useState<PayoutSummary | null>(null);
  const [bankingDetails, setBankingDetails] = useState<BankingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchPayouts();
      fetchSummary();
      fetchBankingDetails();
    } else {
      setPayouts([]);
      setSummary(null);
      setBankingDetails(null);
      setLoading(false);
    }
  }, [user]);

  const fetchPayouts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('payouts')
        .select('*')
        .eq('owner_id', user.id)
        .order('requested_at', { ascending: false });

      if (error) throw error;

      setPayouts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payouts');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    if (!user) return;

    try {
      // Get completed bookings for this owner
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          total_price,
          boats!inner(owner_id)
        `)
        .eq('boats.owner_id', user.id)
        .eq('status', 'completed');

      if (bookingsError) throw bookingsError;

      // Get existing payouts
      const { data: payoutsData, error: payoutsError } = await supabase
        .from('payouts')
        .select('amount, status')
        .eq('owner_id', user.id);

      if (payoutsError) throw payoutsError;

      const totalEarnings = bookingsData?.reduce((sum, booking) => sum + Number(booking.total_price), 0) || 0;
      const totalPaid = payoutsData
        ?.filter(p => p.status === 'paid')
        .reduce((sum, payout) => sum + Number(payout.amount), 0) || 0;
      const pendingAmount = payoutsData
        ?.filter(p => p.status === 'pending')
        .reduce((sum, payout) => sum + Number(payout.amount), 0) || 0;

      setSummary({
        totalEarnings,
        totalPaid,
        pendingAmount,
        availableBalance: totalEarnings - totalPaid - pendingAmount,
        minimumThreshold: 100 // R100 minimum payout
      });
    } catch (err) {
      console.error('Failed to fetch payout summary:', err);
    }
  };

  const fetchBankingDetails = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('banking_details')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // Ignore "not found" errors
      setBankingDetails(data || null);
    } catch (err) {
      console.error('Failed to fetch banking details:', err);
    }
  };

  const requestPayout = async (amount: number) => {
    if (!user) return { error: 'No user logged in' };

    try {
      // Get a completed booking for this amount (simplified for demo)
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          id,
          boats!inner(owner_id)
        `)
        .eq('boats.owner_id', user.id)
        .eq('status', 'completed')
        .limit(1);

      if (bookingsError) throw bookingsError;
      if (!bookings?.length) throw new Error('No completed bookings found');

      const { data, error } = await supabase
        .from('payouts')
        .insert({
          amount,
          booking_id: bookings[0].id,
          owner_id: user.id,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      await fetchPayouts();
      await fetchSummary();
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request payout';
      return { error: errorMessage };
    }
  };

  const saveBankingDetails = async (details: Omit<BankingDetails, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { data, error } = await supabase
        .from('banking_details')
        .upsert({
          ...details,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setBankingDetails(data);
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save banking details';
      return { error: errorMessage };
    }
  };

  return { 
    payouts, 
    summary, 
    bankingDetails,
    loading, 
    error, 
    requestPayout,
    saveBankingDetails,
    refetch: () => {
      fetchPayouts();
      fetchSummary();
      fetchBankingDetails();
    }
  };
}