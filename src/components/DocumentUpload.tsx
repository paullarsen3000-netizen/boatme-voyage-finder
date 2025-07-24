import { useState, useCallback } from 'react';
import { FileUpload, FileUploadConfig } from '@/components/FileUpload';
import { useDocuments } from '@/hooks/useDocuments';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type DocumentType = Database['public']['Enums']['document_type'];

interface DocumentUploadProps {
  documentType: DocumentType;
  onUploadSuccess?: (documentId: string) => void;
  className?: string;
  disabled?: boolean;
}

const DOCUMENT_CONFIGS: Record<DocumentType, Partial<FileUploadConfig>> = {
  identity: {
    maxSize: 10,
    allowedTypes: ['image/*', 'application/pdf'],
    folder: 'documents/identity'
  },
  license: {
    maxSize: 10,
    allowedTypes: ['application/pdf', 'image/*'],
    folder: 'documents/license'
  },
  insurance: {
    maxSize: 10,
    allowedTypes: ['application/pdf', 'image/*'],
    folder: 'documents/insurance'
  },
  registration: {
    maxSize: 10,
    allowedTypes: ['application/pdf', 'image/*'],
    folder: 'documents/registration'
  },
  safety_certificate: {
    maxSize: 10,
    allowedTypes: ['application/pdf', 'image/*'],
    folder: 'documents/safety'
  }
};

const DOCUMENT_LABELS: Record<DocumentType, string> = {
  identity: 'Identity Document',
  license: 'Skipper License',
  insurance: 'Insurance Certificate',
  registration: 'Boat Registration',
  safety_certificate: 'Safety Certificate'
};

export function DocumentUpload({ 
  documentType, 
  onUploadSuccess, 
  className,
  disabled = false 
}: DocumentUploadProps) {
  const { uploadDocument, loading } = useDocuments();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const config: FileUploadConfig = {
    bucket: 'documents',
    multiple: false,
    showPreview: true,
    ...DOCUMENT_CONFIGS[documentType]
  } as FileUploadConfig;

  const handleUploadComplete = useCallback(async (files: Array<{ file: File; url: string }>) => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      const { data, error } = await uploadDocument(files[0].file, documentType);
      
      if (error) {
        throw new Error(error);
      }

      toast({
        title: "Document uploaded successfully",
        description: `${DOCUMENT_LABELS[documentType]} has been uploaded and is pending verification.`,
      });

      onUploadSuccess?.(data?.id || '');
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }, [uploadDocument, documentType, onUploadSuccess, toast]);

  const handleUploadError = useCallback((error: string) => {
    toast({
      title: "Upload error",
      description: error,
      variant: "destructive",
    });
  }, [toast]);

  return (
    <div className={className}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{DOCUMENT_LABELS[documentType]}</h3>
        <p className="text-sm text-muted-foreground">
          Upload your {DOCUMENT_LABELS[documentType].toLowerCase()} for verification
        </p>
      </div>
      
      <FileUpload
        config={config}
        onUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
        disabled={disabled || loading || uploading}
      />
    </div>
  );
}