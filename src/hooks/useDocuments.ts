import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

type Document = Database['public']['Tables']['documents']['Row'];
type DocumentType = Database['public']['Enums']['document_type'];

export function useDocuments() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchDocuments();
    } else {
      setDocuments([]);
      setLoading(false);
    }
  }, [user]);

  const fetchDocuments = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;

      setDocuments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (file: File, type: DocumentType) => {
    if (!user) return { error: 'No user logged in' };

    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${type}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // Save document record to database
      const { data, error } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          type,
          url: urlData.publicUrl,
          verified: false
        })
        .select()
        .single();

      if (error) throw error;

      await fetchDocuments(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload document';
      return { error: errorMessage };
    }
  };

  return { documents, loading, error, uploadDocument, refetch: fetchDocuments };
}