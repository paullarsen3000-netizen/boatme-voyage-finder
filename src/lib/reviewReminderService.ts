import { Booking } from '@/types/booking';
import { sendEmail } from './email';
import { reviewReminderEmailTemplate, reviewReminderSubjectLines } from '../utils/reviewReminderTemplate';

export interface ReviewReminderService {
  scheduleReviewReminder: (booking: Booking) => Promise<boolean>;
  sendReviewReminderEmail: (booking: Booking, userName: string, userEmail: string) => Promise<boolean>;
  checkAndSendPendingReminders: () => Promise<void>;
}

class ReviewReminderManager implements ReviewReminderService {
  
  async scheduleReviewReminder(booking: Booking): Promise<boolean> {
    try {
      // Calculate 24 hours after booking completion
      const reminderDate = new Date(booking.endDate);
      reminderDate.setHours(reminderDate.getHours() + 24);

      // Store reminder in localStorage (in production, use database)
      const reminders = JSON.parse(localStorage.getItem('review_reminders') || '[]');
      const reminder = {
        id: `review_${booking.id}_${Date.now()}`,
        bookingId: booking.id,
        userEmail: booking.guestEmail,
        userName: booking.guestName,
        scheduledFor: reminderDate.toISOString(),
        status: 'pending',
        booking
      };

      reminders.push(reminder);
      localStorage.setItem('review_reminders', JSON.stringify(reminders));
      
      console.log(`Review reminder scheduled for ${reminderDate.toISOString()}`);
      return true;
    } catch (error) {
      console.error('Failed to schedule review reminder:', error);
      return false;
    }
  }

  async sendReviewReminderEmail(booking: Booking, userName: string, userEmail: string): Promise<boolean> {
    try {
      const reviewUrl = `${window.location.origin}/reviews/new/${booking.id}`;
      
      // Random subject line for A/B testing
      const subjectTemplate = reviewReminderSubjectLines[
        Math.floor(Math.random() * reviewReminderSubjectLines.length)
      ];
      const subject = subjectTemplate.replace('${itemType}', booking.itemType);
      
      const htmlContent = reviewReminderEmailTemplate(
        userName,
        booking.id,
        booking.itemName,
        booking.itemType,
        `${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}`,
        reviewUrl
      );

      const result = await sendEmail({
        to: userEmail,
        subject,
        html: htmlContent,
        text: `Hi ${userName}, please leave a review for your recent ${booking.itemType} booking: ${booking.itemName}. Visit ${reviewUrl} to share your experience.`
      });

      return result.success;
    } catch (error) {
      console.error('Failed to send review reminder email:', error);
      return false;
    }
  }

  async checkAndSendPendingReminders(): Promise<void> {
    try {
      const reminders = JSON.parse(localStorage.getItem('review_reminders') || '[]');
      const now = new Date();

      for (const reminder of reminders) {
        if (reminder.status === 'pending' && new Date(reminder.scheduledFor) <= now) {
          const success = await this.sendReviewReminderEmail(
            reminder.booking,
            reminder.userName,
            reminder.userEmail
          );

          // Update reminder status
          reminder.status = success ? 'sent' : 'failed';
          reminder.sentAt = now.toISOString();
        }
      }

      // Clean up old reminders (older than 30 days)
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      const filteredReminders = reminders.filter((r: any) => 
        new Date(r.scheduledFor) > cutoff
      );

      localStorage.setItem('review_reminders', JSON.stringify(filteredReminders));
    } catch (error) {
      console.error('Failed to process review reminders:', error);
    }
  }

  // Cancel reminder when review is submitted
  cancelReminder(bookingId: string): void {
    try {
      const reminders = JSON.parse(localStorage.getItem('review_reminders') || '[]');
      const updatedReminders = reminders.map((r: any) => 
        r.bookingId === bookingId ? { ...r, status: 'cancelled' } : r
      );
      localStorage.setItem('review_reminders', JSON.stringify(updatedReminders));
    } catch (error) {
      console.error('Failed to cancel review reminder:', error);
    }
  }
}

export const reviewReminderService = new ReviewReminderManager();

// Auto-check for pending reminders every hour
if (typeof window !== 'undefined') {
  setInterval(() => {
    reviewReminderService.checkAndSendPendingReminders();
  }, 60 * 60 * 1000); // 1 hour
}