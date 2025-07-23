import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, FileText, Loader2, Upload } from 'lucide-react';
import { DisputeRequest } from '@/types/cancellation';
import { toast } from 'sonner';

interface DisputeFormProps {
  cancellationId: string;
  bookingId: string;
  onSubmit: (request: DisputeRequest) => Promise<void>;
}

export function DisputeForm({ cancellationId, bookingId, onSubmit }: DisputeFormProps) {
  const [disputeReason, setDisputeReason] = useState('');
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      
      if (!isValidType) {
        toast.error(`${file.name} is not a valid file type. Please upload images or PDFs.`);
        return false;
      }
      
      if (!isValidSize) {
        toast.error(`${file.name} is too large. Please upload files under 5MB.`);
        return false;
      }
      
      return true;
    });

    setEvidenceFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setEvidenceFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!disputeReason.trim()) {
      toast.error('Please provide a reason for the dispute');
      return;
    }

    setIsSubmitting(true);
    try {
      // For now, we'll simulate file upload URLs
      // In a real implementation, you'd upload files to storage first
      const evidenceUrls = evidenceFiles.map(file => `placeholder-url-${file.name}`);

      await onSubmit({
        cancellation_id: cancellationId,
        booking_id: bookingId,
        dispute_reason: disputeReason,
        evidence_urls: evidenceUrls.length > 0 ? evidenceUrls : undefined
      });

      // Reset form
      setDisputeReason('');
      setEvidenceFiles([]);
      toast.success('Dispute submitted successfully. An admin will review your case.');
    } catch (error) {
      console.error('Failed to submit dispute:', error);
      toast.error('Failed to submit dispute. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-destructive/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          Escalate to Admin Review
        </CardTitle>
        <CardDescription>
          If you disagree with this cancellation or believe there was an error, you can request admin intervention. 
          Please provide details and any supporting evidence.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="dispute-reason">Dispute reason *</Label>
          <Textarea
            id="dispute-reason"
            placeholder="Explain why you're disputing this cancellation..."
            value={disputeReason}
            onChange={(e) => setDisputeReason(e.target.value)}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="evidence">Supporting evidence (optional)</Label>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
              <div className="mt-2">
                <Input
                  id="evidence"
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('evidence')?.click()}
                >
                  Upload Files
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Images and PDFs up to 5MB each
              </p>
            </div>
          </div>

          {evidenceFiles.length > 0 && (
            <div className="space-y-2">
              <Label>Uploaded files:</Label>
              {evidenceFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{file.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </Badge>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button 
          onClick={handleSubmit} 
          disabled={!disputeReason.trim() || isSubmitting}
          className="w-full"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Dispute for Admin Review
        </Button>
      </CardContent>
    </Card>
  );
}