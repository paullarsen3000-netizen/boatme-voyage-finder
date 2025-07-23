import { emailService, BookingEmailData } from './email';

export interface ScheduledEmail {
  id?: string;
  email_type: 'booking_reminder' | 'document_followup' | 'marketing' | 'review_reminder';
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
  async scheduleReviewReminder(bookingData: any, reminderDate: Date): Promise<boolean> {
    try {
      const scheduledEmail: ScheduledEmail = {
        email_type: 'review_reminder',
        recipient_email: bookingData.guestEmail,
        scheduled_for: reminderDate.toISOString(),
        data: bookingData,
        status: 'pending'
      };

      const existingScheduled = JSON.parse(localStorage.getItem('scheduled_emails') || '[]');
      existingScheduled.push({
        ...scheduledEmail,
        id: `review_reminder_${Date.now()}`,
        created_at: new Date().toISOString()
      });
      localStorage.setItem('scheduled_emails', JSON.stringify(existingScheduled));

      console.log('Review reminder scheduled for:', reminderDate);
      return true;
    } catch (error) {
      console.error('Failed to schedule review reminder:', error);
      return false;
    }
  }

  // Process pending emails that are due to be sent
  async processPendingEmails(): Promise<void> {
    try {
      const scheduledEmails: ScheduledEmail[] = JSON.parse(localStorage.getItem('scheduled_emails') || '[]');
      const now = new Date();

      for (const email of scheduledEmails) {
        if (email.status === 'pending' && new Date(email.scheduled_for) <= now) {
          console.log('Processing scheduled email:', email.id);
          
          const success = await this.sendScheduledEmail(email);
          email.status = success ? 'sent' : 'failed';
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

        case 'review_reminder':
          // Mock implementation for review reminders
          console.log('Sending review reminder email:', scheduledEmail.data);
          return true;
          
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