import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { CancellationRequest } from '@/types/cancellation';
import { Booking } from '@/types/booking';

interface CancelBookingModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (request: CancellationRequest) => Promise<void>;
  userRole: 'renter' | 'owner';
}

const CANCELLATION_REASONS = [
  { value: 'weather-related', label: 'Weather-related' },
  { value: 'mechanical-issues', label: 'Mechanical issues' },
  { value: 'customer-changed-plans', label: 'Customer changed plans' },
  { value: 'owner-unavailable', label: 'Owner unavailable' },
  { value: 'other', label: 'Other' }
] as const;

export function CancelBookingModal({ 
  booking, 
  isOpen, 
  onClose, 
  onConfirm, 
  userRole 
}: CancelBookingModalProps) {
  const [reason, setReason] = useState<CancellationRequest['cancellation_reason'] | ''>('');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason) return;

    setIsSubmitting(true);
    try {
      await onConfirm({
        booking_id: booking.bookingId,
        cancellation_reason: reason,
        reason_comments: comments || undefined,
        cancelled_by_role: userRole
      });
      onClose();
      // Reset form
      setReason('');
      setComments('');
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = reason !== '';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Cancel Booking
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium">{booking.itemName}</h4>
            <p className="text-sm text-muted-foreground">
              {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Total: R{booking.totalAmount.toFixed(2)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Cancellation reason *</Label>
            <Select value={reason} onValueChange={(value) => setReason(value as CancellationRequest['cancellation_reason'])}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason for cancellation" />
              </SelectTrigger>
              <SelectContent>
                {CANCELLATION_REASONS.map((reasonOption) => (
                  <SelectItem key={reasonOption.value} value={reasonOption.value}>
                    {reasonOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Additional comments (optional)</Label>
            <Textarea
              id="comments"
              placeholder="Provide any additional details about the cancellation..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Keep Booking
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleSubmit} 
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Cancel Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}