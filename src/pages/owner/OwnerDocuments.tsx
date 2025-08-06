
import { useState, useEffect } from 'react';
import { DocumentManager } from '@/components/DocumentManager';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type DocumentType = Database['public']['Tables']['documents']['Row'];

export default function OwnerDocuments() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('user_id', user.id)
          .order('uploaded_at', { ascending: false });
        
        if (error) {
          setError(error.message);
        } else {
          setDocuments(data || []);
        }
      } catch (err) {
        setError('Failed to fetch documents');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []); // Empty deps array prevents re-fetch loops

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-brand font-bold text-primary mb-4">
            Document Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload and manage your verification documents to activate your boat listings
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading documents...</p>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <DocumentManager 
            initialDocuments={documents} 
            onDocumentsChange={setDocuments}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
