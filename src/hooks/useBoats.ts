import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Boat = Database['public']['Tables']['boats']['Row'];

interface BoatFilters {
  location?: string;
  type?: Database['public']['Enums']['boat_type'];
  priceMin?: number;
  priceMax?: number;
  availableOnly?: boolean;
}

export function useBoats(filters?: BoatFilters) {
  const [boats, setBoats] = useState<Boat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBoats();
  }, [filters]);

  const fetchBoats = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('boats')
        .select('*')
        .eq('status', 'active');

      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters?.type && filters.type !== 'other') {
        query = query.eq('type', filters.type);
      }

      if (filters?.priceMin) {
        query = query.gte('price_per_day', filters.priceMin);
      }

      if (filters?.priceMax) {
        query = query.lte('price_per_day', filters.priceMax);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      setBoats(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch boats');
    } finally {
      setLoading(false);
    }
  };

  return { boats, loading, error, refetch: fetchBoats };
}

export function useBoatById(id: string) {
  const [boat, setBoat] = useState<Boat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchBoat = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('boats')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        setBoat(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch boat');
      } finally {
        setLoading(false);
      }
    };

    fetchBoat();
  }, [id]);

  return { boat, loading, error };
}