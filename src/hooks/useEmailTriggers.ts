import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { emailService, BookingEmailData, UserData, PayoutEmailData, ReviewReminderData } from '@/lib/email';
import { toast } from '@/hooks/use-toast';

interface UseEmailTriggersProps {
  enableWelcomeEmail?: boolean;
  enableBookingEmails?: boolean;
  enableDocumentEmails?: boolean;
  enableReminderEmails?: boolean;
}

export function useEmailTriggers({
  enableWelcomeEmail = true,
  enableBookingEmails = true,
  enableDocumentEmails = true,
  enableReminderEmails = true
}: UseEmailTriggersProps = {}) {
  const { user } = useAuth();

  // Welcome email trigger
  useEffect(() => {
    if (!enableWelcomeEmail || !user) return;

    const hasWelcomeEmailSent = localStorage.getItem(`welcome-email-${user.id}`);
    
    if (!hasWelcomeEmailSent) {
      const userData: UserData = {
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        role: user.user_metadata?.role || 'renter'
      };

      emailService.sendWelcomeEmail(userData).then(result => {
        if (result.success) {
          localStorage.setItem(`welcome-email-${user.id}`, 'sent');
          toast({
            title: "Welcome email sent!",
            description: "Check your inbox for your welcome message.",
          });
        } else {
          console.error('Failed to send welcome email:', result.error);
        }
      });
    }
  }, [user, enableWelcomeEmail]);

  // Manual email sending functions
  const sendBookingConfirmation = async (bookingData: BookingEmailData) => {
    if (!enableBookingEmails) return { success: false, error: 'Booking emails disabled' };
    
    try {
      const result = await emailService.sendBookingConfirmation(bookingData);
      
      if (result.success) {
        toast({
          title: "Booking confirmation sent!",
          description: "Confirmation emails have been sent to all parties.",
        });
      } else {
        toast({
          title: "Email failed",
          description: result.error || "Failed to send booking confirmation.",
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      console.error('Booking email error:', error);
      return { success: false, error: 'Failed to send booking emails' };
    }
  };

  const sendDocumentStatusUpdate = async (
    userData: UserData, 
    status: 'approved' | 'rejected' | 'pending',
    reason?: string
  ) => {
    if (!enableDocumentEmails) return { success: false, error: 'Document emails disabled' };
    
    try {
      const result = await emailService.sendDocumentStatusEmail(userData, status, reason);
      
      if (result.success) {
        toast({
          title: "Status email sent!",
          description: `Document ${status} email has been sent.`,
        });
      } else {
        toast({
          title: "Email failed",
          description: result.error || "Failed to send status update.",
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      console.error('Document status email error:', error);
      return { success: false, error: 'Failed to send document status email' };
    }
  };

  const sendBookingReminder = async (bookingData: BookingEmailData) => {
    if (!enableReminderEmails) return { success: false, error: 'Reminder emails disabled' };
    
    try {
      const result = await emailService.sendBookingReminder(bookingData);
      
      if (result.success) {
        toast({
          title: "Reminder sent!",
          description: "Booking reminder email has been sent.",
        });
      } else {
        toast({
          title: "Email failed",
          description: result.error || "Failed to send reminder.",
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      console.error('Reminder email error:', error);
      return { success: false, error: 'Failed to send booking reminder' };
    }
  };

  const resendWelcomeEmail = async () => {
    if (!user) return { success: false, error: 'No user found' };
    
    const userData: UserData = {
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      role: user.user_metadata?.role || 'renter'
    };

    try {
      const result = await emailService.sendWelcomeEmail(userData);
      
      if (result.success) {
        toast({
          title: "Welcome email resent!",
          description: "Check your inbox for your welcome message.",
        });
      } else {
        toast({
          title: "Email failed",
          description: result.error || "Failed to resend welcome email.",
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      console.error('Welcome email error:', error);
      return { success: false, error: 'Failed to resend welcome email' };
    }
  };

  const sendPayoutStatusUpdate = async (payoutData: PayoutEmailData) => {
    try {
      const result = await emailService.sendPayoutStatusEmail(payoutData);
      
      if (result.success) {
        toast({
          title: "Payout email sent!",
          description: `Payout ${payoutData.status} email has been sent.`,
        });
      } else {
        toast({
          title: "Email failed",
          description: result.error || "Failed to send payout update.",
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      console.error('Payout email error:', error);
      return { success: false, error: 'Failed to send payout status email' };
    }
  };

  const sendReviewReminderEmail = async (reminderData: ReviewReminderData) => {
    try {
      const result = await emailService.sendReviewReminder(reminderData);
      
      if (result.success) {
        toast({
          title: "Review reminder sent!",
          description: "Review reminder email has been sent to the guest.",
        });
      } else {
        toast({
          title: "Email failed",
          description: result.error || "Failed to send review reminder.",
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      console.error('Review reminder email error:', error);
      return { success: false, error: 'Failed to send review reminder' };
    }
  };

  return {
    sendBookingConfirmation,
    sendDocumentStatusUpdate,
    sendBookingReminder,
    sendPayoutStatusUpdate,
    sendReviewReminderEmail,
    resendWelcomeEmail
  };
}