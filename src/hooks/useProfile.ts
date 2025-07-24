import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

type UserProfile = Database['public']['Tables']['users']['Row'];

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Omit<UserProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    try {
      // Get current user session directly from Supabase to ensure fresh auth state
      const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
      
      console.log('Update Profile Debug:', { currentUser, authError, updates });
      
      if (authError || !currentUser) {
        console.error('Authentication failed:', authError);
        return { error: 'Authentication required. Please log in again.' };
      }

      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('user_id', currentUser.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      return { error: errorMessage };
    }
  };

  return { profile, loading, error, updateProfile, refetch: fetchProfile };
}