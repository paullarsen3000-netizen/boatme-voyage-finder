import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';

type OwnerDocument = Database['public']['Tables']['owner_documents']['Row'] & {
  url: string;
};

export function useOwnerDocuments() {
  const { user } = useAuth();
  const [docs, setDocs] = useState<OwnerDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocs() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('owner_documents')
          .select('*')
          .eq('owner_id', user.id);

        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }

        // Convert file_path to publicURL
        const enriched = (data || []).map(d => {
          const { data: { publicUrl } } = supabase.storage
            .from('owner-documents')
            .getPublicUrl(d.file_path);
          return { ...d, url: publicUrl };
        });

        setDocs(enriched);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch documents');
        setLoading(false);
        console.error('Error fetching owner documents:', err);
      }
    }

    fetchDocs();
  }, [user]);

  return { docs, loading, error };
}