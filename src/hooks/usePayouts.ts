import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

type Payout = Database['public']['Tables']['payouts']['Row'];
type PayoutStatus = Database['public']['Enums']['payout_status'];

interface PayoutSummary {
  totalEarnings: number;
  totalPaid: number;
  pendingAmount: number;
  availableBalance: number;
}

export function usePayouts() {
  const { user } = useAuth();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [summary, setSummary] = useState<PayoutSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchPayouts();
      fetchSummary();
    } else {
      setPayouts([]);
      setSummary(null);
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
      const { data, error } = await supabase
        .from('payouts')
        .select('amount, status')
        .eq('owner_id', user.id);

      if (error) throw error;

      const totalEarnings = data.reduce((sum, payout) => sum + Number(payout.amount), 0);
      const totalPaid = data
        .filter(p => p.status === 'paid')
        .reduce((sum, payout) => sum + Number(payout.amount), 0);
      const pendingAmount = data
        .filter(p => p.status === 'pending')
        .reduce((sum, payout) => sum + Number(payout.amount), 0);

      setSummary({
        totalEarnings,
        totalPaid,
        pendingAmount,
        availableBalance: totalEarnings - totalPaid - pendingAmount
      });
    } catch (err) {
      // Don't set error for summary fetch failure
      console.error('Failed to fetch payout summary:', err);
    }
  };

  const requestPayout = async (payoutData: {
    booking_id: string;
    amount: number;
  }) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { data, error } = await supabase
        .from('payouts')
        .insert({
          ...payoutData,
          owner_id: user.id,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      await fetchPayouts(); // Refresh the list
      await fetchSummary(); // Refresh the summary
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request payout';
      return { error: errorMessage };
    }
  };

  return { 
    payouts, 
    summary, 
    loading, 
    error, 
    requestPayout, 
    refetch: () => {
      fetchPayouts();
      fetchSummary();
    }
  };
}