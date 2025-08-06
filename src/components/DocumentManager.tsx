
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DocumentUpload } from '@/components/DocumentUpload';
import { useToast } from '@/hooks/use-toast';
import { FileText, CheckCircle, Clock, AlertTriangle, Upload, AlertCircle } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type DocumentType = Database['public']['Enums']['document_type'];
type Document = Database['public']['Tables']['documents']['Row'];

interface RequiredDocument {
  type: DocumentType;
  title: string;
  description: string;
  required: boolean;
}

interface DocumentManagerProps {
  initialDocuments?: Document[];
  onDocumentsChange?: (documents: Document[]) => void;
}

const REQUIRED_DOCUMENTS: RequiredDocument[] = [
  {
    type: 'identity',
    title: 'Identity Document',
    description: 'Valid ID, passport, or driver\'s license',
    required: true
  },
  {
    type: 'license',
    title: 'Skipper License',
    description: 'Valid skipper/boat license certificate',
    required: true
  },
  {
    type: 'insurance',
    title: 'Insurance Certificate',
    description: 'Current boat insurance documentation',
    required: true
  },
  {
    type: 'registration',
    title: 'Boat Registration',
    description: 'Official boat registration documents',
    required: false
  },
  {
    type: 'safety_certificate',
    title: 'Safety Certificate',
    description: 'Boat safety equipment certificate',
    required: false
  }
];

export function DocumentManager({ 
  initialDocuments = [], 
  onDocumentsChange 
}: DocumentManagerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeUpload, setActiveUpload] = useState<DocumentType | null>(null);

  // Update local state when initialDocuments change
  useEffect(() => {
    setDocuments(initialDocuments);
  }, [initialDocuments]);

  const uploadDocument = async (file: File, documentType: DocumentType) => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);
    
    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${documentType}-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // Save document record to database
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          type: documentType,
          url: publicUrl,
          verified: false
        })
        .select()
        .single();

      if (docError) throw docError;

      // Update local state
      const updatedDocuments = [...documents, docData];
      setDocuments(updatedDocuments);
      onDocumentsChange?.(updatedDocuments);

      return { data: docData, error: null };
    } catch (err) {
      return { 
        data: null, 
        error: err instanceof Error ? err.message : 'Upload failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const getDocumentStatus = (docType: DocumentType) => {
    const doc = documents.find(d => d.type === docType);
    if (!doc) return { status: 'missing', document: null };
    
    return {
      status: doc.verified ? 'verified' : 'pending',
      document: doc
    };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'missing':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Required
          </Badge>
        );
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'missing':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleUploadSuccess = async (documentType: DocumentType, file: File) => {
    const result = await uploadDocument(file, documentType);
    
    if (result.error) {
      toast({
        title: "Upload failed",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    setActiveUpload(null);
    toast({
      title: "Document uploaded",
      description: "Your document has been uploaded and is being reviewed.",
    });
  };

  const handleUploadClick = (documentType: DocumentType) => {
    setActiveUpload(documentType);
  };

  if (loading && documents.length === 0) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const requiredDocs = REQUIRED_DOCUMENTS.filter(doc => doc.required);
  const optionalDocs = REQUIRED_DOCUMENTS.filter(doc => !doc.required);
  const completedRequired = requiredDocs.filter(doc => 
    getDocumentStatus(doc.type).status === 'verified'
  ).length;

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Document Verification Status</span>
            <Badge variant={completedRequired === requiredDocs.length ? "default" : "secondary"}>
              {completedRequired}/{requiredDocs.length} Required Complete
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-900">Verified</p>
              <p className="text-2xl font-bold text-green-600">
                {documents.filter(d => d.verified).length}
              </p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-yellow-900">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {documents.filter(d => !d.verified).length}
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-900">Total</p>
              <p className="text-2xl font-bold text-blue-600">
                {documents.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Required Documents */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Required Documents</h3>
        <div className="space-y-4">
          {requiredDocs.map((docConfig) => {
            const { status, document } = getDocumentStatus(docConfig.type);
            const isUploading = activeUpload === docConfig.type;

            return (
              <Card key={docConfig.type} className="overflow-hidden">
                <CardContent className="p-6">
                  {isUploading ? (
                    <DocumentUpload
                      documentType={docConfig.type}
                      onUploadSuccess={(file) => handleUploadSuccess(docConfig.type, file)}
                    />
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(status)}
                        <div>
                          <h4 className="font-medium">{docConfig.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {docConfig.description}
                          </p>
                          {document && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Uploaded: {new Date(document.uploaded_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(status)}
                        {status !== 'verified' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUploadClick(docConfig.type)}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {status === 'missing' ? 'Upload' : 'Replace'}
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Optional Documents */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Optional Documents</h3>
        <div className="space-y-4">
          {optionalDocs.map((docConfig) => {
            const { status, document } = getDocumentStatus(docConfig.type);
            const isUploading = activeUpload === docConfig.type;

            return (
              <Card key={docConfig.type} className="overflow-hidden">
                <CardContent className="p-6">
                  {isUploading ? (
                    <DocumentUpload
                      documentType={docConfig.type}
                      onUploadSuccess={(file) => handleUploadSuccess(docConfig.type, file)}
                    />
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(status)}
                        <div>
                          <h4 className="font-medium">{docConfig.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {docConfig.description}
                          </p>
                          {document && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Uploaded: {new Date(document.uploaded_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {status !== 'missing' && getStatusBadge(status)}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUploadClick(docConfig.type)}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {status === 'missing' ? 'Upload' : 'Replace'}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Document Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <p>Ensure documents are clear and readable</p>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <p>Upload files in PDF, JPEG, PNG, or WebP format</p>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <p>Maximum file size is 10MB per document</p>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <p>All documents must be current and valid</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
