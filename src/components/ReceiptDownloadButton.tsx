import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Loader2 } from 'lucide-react';
import { receiptGenerator, BookingData } from '@/lib/receiptGenerator';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ReceiptDownloadButtonProps {
  booking: BookingData;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export function ReceiptDownloadButton({ 
  booking, 
  variant = 'outline', 
  size = 'sm' 
}: ReceiptDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleDownload = async (type: 'receipt' | 'invoice') => {
    setIsGenerating(true);
    try {
      await receiptGenerator.downloadReceipt(booking, type);
      await receiptGenerator.saveReceiptRecord(booking, type);
      
      toast({
        title: "Download Complete",
        description: `${type === 'receipt' ? 'Receipt' : 'Invoice'} downloaded successfully.`,
      });
    } catch (error) {
      console.error('Error generating receipt:', error);
      toast({
        title: "Download Failed",
        description: "Failed to generate the document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          {isGenerating ? 'Generating...' : 'Download'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleDownload('receipt')}>
          <FileText className="h-4 w-4 mr-2" />
          Download Receipt
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDownload('invoice')}>
          <FileText className="h-4 w-4 mr-2" />
          Download Tax Invoice
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}