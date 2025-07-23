import { supabase } from './supabase';
import { emailService, BookingEmailData } from './email';

export interface ScheduledEmail {
  id?: string;
  email_type: 'booking_reminder' | 'document_followup' | 'marketing';
  recipient_email: string;
  scheduled_for: string;
  data: any;
  status: 'pending' | 'sent' | 'failed';
  created_at?: string;
}

class EmailScheduler {
  // Schedule a booking reminder email
  async scheduleBookingReminder(bookingData: BookingEmailData, reminderDate: Date): Promise<boolean> {
    try {
      const scheduledEmail: ScheduledEmail = {
        email_type: 'booking_reminder',
        recipient_email: bookingData.guestEmail,
        scheduled_for: reminderDate.toISOString(),
        data: bookingData,
        status: 'pending'
      };

      // In a real implementation, this would insert into a scheduled_emails table
      // For now, we'll use localStorage as a mock
      const existingScheduled = JSON.parse(localStorage.getItem('scheduled_emails') || '[]');
      existingScheduled.push({
        ...scheduledEmail,
        id: `reminder_${Date.now()}`,
        created_at: new Date().toISOString()
      });
      localStorage.setItem('scheduled_emails', JSON.stringify(existingScheduled));

      console.log('Booking reminder scheduled for:', reminderDate);
      return true;
    } catch (error) {
      console.error('Failed to schedule booking reminder:', error);
      return false;
    }
  }

  // Schedule document follow-up for pending verifications
  async scheduleDocumentFollowup(userEmail: string, userName: string, followupDate: Date): Promise<boolean> {
    try {
      const scheduledEmail: ScheduledEmail = {
        email_type: 'document_followup',
        recipient_email: userEmail,
        scheduled_for: followupDate.toISOString(),
        data: {
          name: userName,
          status: 'pending'
        },
        status: 'pending'
      };

      const existingScheduled = JSON.parse(localStorage.getItem('scheduled_emails') || '[]');
      existingScheduled.push({
        ...scheduledEmail,
        id: `followup_${Date.now()}`,
        created_at: new Date().toISOString()
      });
      localStorage.setItem('scheduled_emails', JSON.stringify(existingScheduled));

      console.log('Document followup scheduled for:', followupDate);
      return true;
    } catch (error) {
      console.error('Failed to schedule document followup:', error);
      return false;
    }
  }

  // Schedule review reminder email (24h after booking completion)
  scheduleReviewReminderEmail(booking: Booking, recipientEmail: string, userName: string) {
    // Calculate 24 hours after booking end date
    const reminderDate = new Date(booking.endDate);
    reminderDate.setHours(reminderDate.getHours() + 24);

    const job: EmailJob = {
      id: `review_reminder_${booking.id}_${Date.now()}`,
      type: 'review_reminder',
      scheduledFor: reminderDate,
      recipient: recipientEmail,
      data: { booking, userName },
      status: 'pending',
      attempts: 0
    };

    this.jobs.push(job);
    console.log(`Review reminder email scheduled for ${reminderDate.toISOString()}`);
  }

  // Cancel review reminder if review is submitted
  cancelReviewReminder(bookingId: string) {
    this.jobs = this.jobs.map(job => {
      if (job.type === 'review_reminder' && 
          job.data.booking?.id === bookingId && 
          job.status === 'pending') {
        return { ...job, status: 'cancelled' as const };
      }
      return job;
    });
  }

  // Check if booking is eligible for review reminder
  private isEligibleForReviewReminder(booking: Booking): boolean {
    // Only send reminders for completed bookings
    if (booking.status !== 'completed') return false;
    
    // Don't send reminders for bookings older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    if (new Date(booking.endDate) < thirtyDaysAgo) return false;
    
    // TODO: Check if review already submitted (would need review data)
    // For now, assume we can proceed
    return true;
  }
      }

      // Save updated scheduled emails
      localStorage.setItem('scheduled_emails', JSON.stringify(scheduledEmails));
    } catch (error) {
      console.error('Failed to process pending emails:', error);
    }
  }

  private async sendScheduledEmail(scheduledEmail: ScheduledEmail): Promise<boolean> {
    try {
      switch (scheduledEmail.email_type) {
        case 'booking_reminder':
          const reminderResult = await emailService.sendBookingReminder(scheduledEmail.data);
          return reminderResult.success;
          
        case 'document_followup':
          const followupResult = await emailService.sendDocumentStatusEmail(
            scheduledEmail.data,
            'pending'
          );
          return followupResult.success;
          
        default:
          console.warn('Unknown email type:', scheduledEmail.email_type);
          return false;
      }
    } catch (error) {
      console.error('Failed to send scheduled email:', error);
      return false;
    }
  }

  // Get all scheduled emails for a user (for dashboard display)
  getScheduledEmails(userEmail?: string): ScheduledEmail[] {
    try {
      const scheduledEmails: ScheduledEmail[] = JSON.parse(localStorage.getItem('scheduled_emails') || '[]');
      
      if (userEmail) {
        return scheduledEmails.filter(email => email.recipient_email === userEmail);
      }
      
      return scheduledEmails;
    } catch (error) {
      console.error('Failed to get scheduled emails:', error);
      return [];
    }
  }

  // Cancel a scheduled email
  cancelScheduledEmail(emailId: string): boolean {
    try {
      const scheduledEmails: ScheduledEmail[] = JSON.parse(localStorage.getItem('scheduled_emails') || '[]');
      const filteredEmails = scheduledEmails.filter(email => email.id !== emailId);
      localStorage.setItem('scheduled_emails', JSON.stringify(filteredEmails));
      return true;
    } catch (error) {
      console.error('Failed to cancel scheduled email:', error);
      return false;
    }
  }
}

export const emailScheduler = new EmailScheduler();

// Auto-process emails every 15 minutes (in a real app, this would be a server-side cron job)
if (typeof window !== 'undefined') {
  setInterval(() => {
    emailScheduler.processPendingEmails();
  }, 15 * 60 * 1000); // 15 minutes
}