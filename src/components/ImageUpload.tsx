import { useState, useCallback } from 'react';
import { FileUpload, FileUploadConfig } from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { X, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  images?: string[];
  onImagesChange?: (images: string[]) => void;
  maxImages?: number;
  className?: string;
  disabled?: boolean;
  folder?: string;
}

const IMAGE_CONFIG: FileUploadConfig = {
  maxSize: 5, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  bucket: 'boat-images',
  multiple: true,
  showPreview: true
};

export function ImageUpload({ 
  images = [], 
  onImagesChange, 
  maxImages = 10,
  className,
  disabled = false,
  folder = 'boats'
}: ImageUploadProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const config: FileUploadConfig = {
    ...IMAGE_CONFIG,
    folder,
    multiple: images.length < maxImages
  };

  const handleUploadComplete = useCallback(async (files: Array<{ file: File; url: string }>) => {
    const newImageUrls = files.map(f => f.url);
    const updatedImages = [...images, ...newImageUrls].slice(0, maxImages);
    
    onImagesChange?.(updatedImages);
    
    toast({
      title: "Images uploaded successfully",
      description: `${files.length} image(s) have been uploaded.`,
    });
  }, [images, maxImages, onImagesChange, toast]);

  const handleUploadError = useCallback((error: string) => {
    toast({
      title: "Upload error",
      description: error,
      variant: "destructive",
    });
  }, [toast]);

  const removeImage = useCallback(async (index: number) => {
    const imageUrl = images[index];
    
    try {
      // Extract file path from URL for deletion
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = folder ? `${folder}/${fileName}` : fileName;
      
      // Delete from storage
      await supabase.storage
        .from(config.bucket)
        .remove([filePath]);
      
      // Update images array
      const updatedImages = images.filter((_, i) => i !== index);
      onImagesChange?.(updatedImages);
      
      toast({
        title: "Image removed",
        description: "Image has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete image. Please try again.",
        variant: "destructive",
      });
    }
  }, [images, folder, config.bucket, onImagesChange, toast]);

  const canAddMore = images.length < maxImages;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Existing Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square relative">
                  <img
                    src={imageUrl}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {!disabled && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(index)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Add More Button */}
          {canAddMore && !disabled && (
            <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary transition-colors">
              <CardContent className="p-0">
                <div className="aspect-square flex items-center justify-center">
                  <div className="text-center">
                    <Plus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Add Image</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Upload Component */}
      {(images.length === 0 || canAddMore) && !disabled && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium">
              {images.length === 0 ? 'Upload Images' : 'Add More Images'}
            </p>
            <p className="text-xs text-muted-foreground">
              {images.length}/{maxImages} images
            </p>
          </div>
          
          <FileUpload
            config={config}
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            disabled={uploading}
          />
        </div>
      )}

      {/* Image Limit Message */}
      {images.length >= maxImages && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Maximum number of images ({maxImages}) reached
        </p>
      )}
    </div>
  );
}
