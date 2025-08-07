import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { resetOwner } from '@/utils/resetOwner';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

export function ResetOwnerButton() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "No user logged in",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await resetOwner(user.id);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "All owner data has been reset successfully. You can now start fresh with the registration process.",
        });
        
        // Reload the page to reflect changes
        window.location.reload();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to reset owner data",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred during reset",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="flex items-center gap-2">
          <Trash2 className="h-4 w-4" />
          Reset Owner Data
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>All uploaded documents and files</li>
              <li>All boat listings</li>
              <li>All payout records</li>
              <li>All related owner data</li>
            </ul>
            <strong className="block mt-2 text-destructive">
              Only use this for testing purposes!
            </strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleReset}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Resetting..." : "Yes, reset everything"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}