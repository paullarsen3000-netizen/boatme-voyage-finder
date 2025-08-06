
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
type OwnerDocumentType = Database['public']['Tables']['owner_documents']['Row'];

interface DocumentState {
  name: string;
  url: string;
  id?: string;
  file_name?: string;
}

export default function OwnerDocuments() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [idDocument, setIdDocument] = useState<DocumentState | null>(null);
  const [proofOwnership, setProofOwnership] = useState<DocumentState | null>(null);
  const [cofDocument, setCofDocument] = useState<DocumentState | null>(null);
  const [insuranceDocument, setInsuranceDocument] = useState<DocumentState | null>(null);
  const [additionalDocs, setAdditionalDocs] = useState<DocumentState[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocs = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch from documents table (for DocumentManager)
        const { data: dbDocs, error: dbError } = await supabase
          .from('documents')
          .select('*')
          .eq('user_id', user.id)
          .order('uploaded_at', { ascending: false });
        
        if (dbError) {
          setError(dbError.message);
        } else {
          setDocuments(dbDocs || []);
        }

        // Fetch from owner_documents table (for registration docs)
        const { data: ownerDocs, error: ownerDocsError } = await supabase
          .from('owner_documents')
          .select('*')
          .eq('owner_id', user.id);

        if (ownerDocsError) {
          console.error('Error fetching owner documents:', ownerDocsError);
        } else if (ownerDocs) {
          // Get public URLs for each document and transform to expected structure
          const enrichedDocs = ownerDocs.map(doc => {
            const { data: { publicUrl } } = supabase
              .storage
              .from('owner-documents')
              .getPublicUrl(doc.file_path);
            return { 
              ...doc, 
              url: publicUrl,
              name: doc.file_name // Map file_name to name for compatibility
            };
          });

          // Map each document to its corresponding state
          const idDoc = enrichedDocs.find(d => d.document_type === 'idDocument');
          const proofDoc = enrichedDocs.find(d => d.document_type === 'proofOwnership');
          const cofDoc = enrichedDocs.find(d => d.document_type === 'cofDocument');
          const insuranceDoc = enrichedDocs.find(d => d.document_type === 'insuranceDocument');

          setIdDocument(idDoc ? { name: idDoc.file_name, url: idDoc.url, id: idDoc.id, file_name: idDoc.file_name } : null);
          setProofOwnership(proofDoc ? { name: proofDoc.file_name, url: proofDoc.url, id: proofDoc.id, file_name: proofDoc.file_name } : null);
          setCofDocument(cofDoc ? { name: cofDoc.file_name, url: cofDoc.url, id: cofDoc.id, file_name: cofDoc.file_name } : null);
          setInsuranceDocument(insuranceDoc ? { name: insuranceDoc.file_name, url: insuranceDoc.url, id: insuranceDoc.id, file_name: insuranceDoc.file_name } : null);

          // Additional docs are those that don't match the required types
          const requiredTypes = ['idDocument', 'proofOwnership', 'cofDocument', 'insuranceDocument'];
          const additionalDocuments = enrichedDocs
            .filter(d => !requiredTypes.includes(d.document_type))
            .map(d => ({ 
              name: d.file_name, 
              url: d.url, 
              id: d.id, 
              file_name: d.file_name 
            }));
          setAdditionalDocs(additionalDocuments);
        }
      } catch (err) {
        setError('Failed to fetch documents');
        console.error('Error loading documents:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDocs();
  }, [user]);

  const handleDocumentsChange = (updatedDocuments: DocumentType[]) => {
    setDocuments(updatedDocuments);
  };

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
          <div className="space-y-8">
            <DocumentManager 
              initialDocuments={documents} 
              onDocumentsChange={handleDocumentsChange}
            />
            
            {/* Required Documents from Owner Registration */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Required Documents from Registration</h2>
              <div className="bg-white rounded-lg border p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">ID Document</h3>
                      <p className="text-sm text-muted-foreground">Valid identification document</p>
                    </div>
                    <div>
                      {idDocument ? (
                        <a 
                          href={idDocument.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-primary hover:underline"
                        >
                          {idDocument.name}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">Not uploaded</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Proof of Ownership</h3>
                      <p className="text-sm text-muted-foreground">Document proving boat ownership</p>
                    </div>
                    <div>
                      {proofOwnership ? (
                        <a 
                          href={proofOwnership.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-primary hover:underline"
                        >
                          {proofOwnership.name}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">Not uploaded</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">COF Document</h3>
                      <p className="text-sm text-muted-foreground">Certificate of Fitness document</p>
                    </div>
                    <div>
                      {cofDocument ? (
                        <a 
                          href={cofDocument.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-primary hover:underline"
                        >
                          {cofDocument.name}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">Not uploaded</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Insurance Document</h3>
                      <p className="text-sm text-muted-foreground">Current insurance certificate</p>
                    </div>
                    <div>
                      {insuranceDocument ? (
                        <a 
                          href={insuranceDocument.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-primary hover:underline"
                        >
                          {insuranceDocument.name}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">Not uploaded</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {additionalDocs.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Additional Documents</h2>
                <div className="bg-white rounded-lg border p-6">
                  <ul className="space-y-2">
                    {additionalDocs.map(doc => (
                      <li key={doc.id} className="flex items-center justify-between">
                        <span className="truncate">{doc.name}</span>
                        <a 
                          href={doc.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-primary hover:underline"
                        >
                          View
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
