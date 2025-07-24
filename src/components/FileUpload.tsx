import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

export interface FileUploadConfig {
  maxSize: number; // in MB
  allowedTypes: string[];
  bucket: string;
  folder?: string;
  multiple?: boolean;
  showPreview?: boolean;
}

export interface UploadedFile {
  file: File;
  url?: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

interface FileUploadProps {
  config: FileUploadConfig;
  onUploadComplete?: (files: Array<{ file: File; url: string }>) => void;
  onUploadError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
}

export function FileUpload({ 
  config, 
  onUploadComplete, 
  onUploadError, 
  className,
  disabled = false 
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > config.maxSize * 1024 * 1024) {
      return `File size must be less than ${config.maxSize}MB`;
    }

    // Check file type
    const fileType = file.type;
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    const isValidType = config.allowedTypes.some(type => {
      if (type.includes('/')) {
        // MIME type check
        return fileType === type || fileType.startsWith(type.replace('*', ''));
      } else {
        // Extension check
        return fileExtension === type.replace('.', '');
      }
    });

    if (!isValidType) {
      return `File type not allowed. Supported types: ${config.allowedTypes.join(', ')}`;
    }

    return null;
  }, [config]);

  const uploadFile = useCallback(async (file: File, index: number): Promise<void> => {
    try {
      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = config.folder ? `${config.folder}/${fileName}` : fileName;

      // Start upload
      setFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, status: 'uploading' as const, progress: 0 } : f
      ));

      const { data, error } = await supabase.storage
        .from(config.bucket)
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(config.bucket)
        .getPublicUrl(filePath);

      // Update file status
      setFiles(prev => prev.map((f, i) => 
        i === index ? { 
          ...f, 
          status: 'success' as const, 
          progress: 100, 
          url: urlData.publicUrl 
        } : f
      ));

      // Call success callback
      const successfulFiles = files
        .map((f, i) => i === index ? { ...f, url: urlData.publicUrl } : f)
        .filter(f => f.status === 'success' && f.url)
        .map(f => ({ file: f.file, url: f.url! }));

      if (successfulFiles.length > 0) {
        onUploadComplete?.(successfulFiles);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      setFiles(prev => prev.map((f, i) => 
        i === index ? { 
          ...f, 
          status: 'error' as const, 
          error: errorMessage 
        } : f
      ));

      onUploadError?.(errorMessage);
    }
  }, [config, files, onUploadComplete, onUploadError]);

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles || disabled) return;

    const fileArray = Array.from(selectedFiles);
    const newFiles: UploadedFile[] = [];

    fileArray.forEach(file => {
      const validationError = validateFile(file);
      if (validationError) {
        onUploadError?.(validationError);
        return;
      }

      newFiles.push({
        file,
        progress: 0,
        status: 'uploading'
      });
    });

    if (newFiles.length === 0) return;

    // Update files state
    setFiles(prev => config.multiple ? [...prev, ...newFiles] : newFiles);

    // Start uploads
    const startIndex = config.multiple ? files.length : 0;
    newFiles.forEach((_, index) => {
      uploadFile(fileArray[index], startIndex + index);
    });
  }, [config.multiple, files.length, validateFile, uploadFile, onUploadError, disabled]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return <Upload className="h-4 w-4 animate-pulse text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <Card 
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Upload className={cn(
            "h-8 w-8 mb-4",
            isDragging ? "text-primary" : "text-muted-foreground"
          )} />
          <p className="text-sm font-medium mb-2">
            {isDragging ? "Drop files here" : "Click to upload or drag and drop"}
          </p>
          <p className="text-xs text-muted-foreground">
            {config.allowedTypes.join(', ')} • Max {config.maxSize}MB
            {config.multiple && " • Multiple files allowed"}
          </p>
        </CardContent>
      </Card>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={config.multiple}
        accept={config.allowedTypes.join(',')}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        disabled={disabled}
      />

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((uploadedFile, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center space-x-3">
                {/* File Preview/Icon */}
                <div className="flex-shrink-0">
                  {config.showPreview && uploadedFile.file.type.startsWith('image/') ? (
                    <img
                      src={getFileIcon(uploadedFile.file) || ''}
                      alt="Preview"
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  
                  {/* Progress Bar */}
                  {uploadedFile.status === 'uploading' && (
                    <Progress value={uploadedFile.progress} className="mt-2 h-1" />
                  )}
                  
                  {/* Error Message */}
                  {uploadedFile.status === 'error' && uploadedFile.error && (
                    <Alert className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        {uploadedFile.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Status Icon */}
                <div className="flex items-center space-x-2">
                  {getStatusIcon(uploadedFile.status)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={uploadedFile.status === 'uploading'}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}