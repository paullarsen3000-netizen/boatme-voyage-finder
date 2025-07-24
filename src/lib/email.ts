import { supabase } from './supabase';

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
  cc?: string[];
  bcc?: string[];
}

export interface BookingEmailData {
  bookingId: string;
  guestName: string;
  guestEmail: string;
  ownerName: string;
  ownerEmail: string;
  boatName: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  location: string;
}

export interface UserData {
  name: string;
  email: string;
  role?: 'renter' | 'owner' | 'provider';
}

export interface PayoutEmailData {
  payoutId: string;
  ownerName: string;
  ownerEmail: string;
  amount: number;
  status: 'pending' | 'paid' | 'rejected';
  requestDate: string;
}

export interface ReviewReminderData {
  bookingId: string;
  guestName: string;
  guestEmail: string;
  boatName: string;
  ownerName: string;
  endDate: string;
}

class EmailService {
  private adminEmail = 'admin@boatme.co.za';
  
  async sendEmail(emailData: EmailData & { templateType?: string; userId?: string }): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          ...emailData,
          templateType: emailData.templateType,
          userId: emailData.userId
        }
      });

      if (error) {
        console.error('Email sending failed:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Email service error:', error);
      return { success: false, error: 'Failed to send email' };
    }
  }

  async sendWelcomeEmail(userData: UserData): Promise<{ success: boolean; error?: string }> {
    const template = this.getWelcomeTemplate(userData);
    
    return this.sendEmail({
      to: userData.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      templateType: 'welcome',
      bcc: [this.adminEmail]
    });
  }

  async sendBookingConfirmation(bookingData: BookingEmailData): Promise<{ success: boolean; error?: string }> {
    const guestTemplate = this.getBookingConfirmationTemplate(bookingData, 'guest');
    const ownerTemplate = this.getBookingConfirmationTemplate(bookingData, 'owner');

    // Generate receipt PDF for attachment
    // Note: This would require implementing PDF generation in the edge function
    // For now, we'll include a link to view the receipt online

    // Send to guest
    const guestResult = await this.sendEmail({
      to: bookingData.guestEmail,
      subject: guestTemplate.subject,
      html: guestTemplate.html,
      text: guestTemplate.text,
      templateType: 'booking_confirmation_guest'
    });

    // Send to owner
    const ownerResult = await this.sendEmail({
      to: bookingData.ownerEmail,
      subject: ownerTemplate.subject,
      html: ownerTemplate.html,
      text: ownerTemplate.text,
      templateType: 'booking_confirmation_owner',
      bcc: [this.adminEmail]
    });

    return {
      success: guestResult.success && ownerResult.success,
      error: guestResult.error || ownerResult.error
    };
  }

  async sendDocumentStatusEmail(
    userData: UserData, 
    status: 'approved' | 'rejected' | 'pending',
    reason?: string
  ): Promise<{ success: boolean; error?: string }> {
    const template = this.getDocumentStatusTemplate(userData, status, reason);
    
    return this.sendEmail({
      to: userData.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      templateType: `document_${status}`,
      bcc: [this.adminEmail]
    });
  }

  async sendBookingReminder(bookingData: BookingEmailData): Promise<{ success: boolean; error?: string }> {
    const template = this.getBookingReminderTemplate(bookingData);
    
    return this.sendEmail({
      to: bookingData.guestEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
      templateType: 'booking_reminder'
    });
  }

  async sendPayoutStatusEmail(payoutData: PayoutEmailData): Promise<{ success: boolean; error?: string }> {
    const template = this.getPayoutStatusTemplate(payoutData);
    
    return this.sendEmail({
      to: payoutData.ownerEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
      templateType: `payout_${payoutData.status}`,
      bcc: [this.adminEmail]
    });
  }

  async sendReviewReminder(reminderData: ReviewReminderData): Promise<{ success: boolean; error?: string }> {
    const template = this.getReviewReminderTemplate(reminderData);
    
    return this.sendEmail({
      to: reminderData.guestEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
      templateType: 'review_reminder'
    });
  }

  private getWelcomeTemplate(userData: UserData): EmailTemplate {
    const roleText = userData.role === 'owner' ? 'boat owner' : userData.role === 'provider' ? 'course provider' : 'member';
    
    return {
      subject: 'Welcome to BoatMe.co.za! 🚤',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0ea5e9; margin: 0;">BoatMe.co.za</h1>
            <p style="color: #64748b; margin: 5px 0;">Your Gateway to Water Adventures</p>
          </div>
          
          <h2 style="color: #334155;">Welcome aboard, ${userData.name}! 🌊</h2>
          
          <p style="color: #475569; line-height: 1.6;">
            Thank you for joining BoatMe.co.za as a ${roleText}. We're excited to have you as part of our maritime community!
          </p>
          
          ${userData.role === 'owner' ? `
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #334155; margin-top: 0;">Next Steps for Boat Owners:</h3>
              <ul style="color: #475569; padding-left: 20px;">
                <li>Complete your profile verification</li>
                <li>Upload your boat documentation</li>
                <li>Create your first boat listing</li>
                <li>Set your availability and pricing</li>
              </ul>
            </div>
          ` : `
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #334155; margin-top: 0;">Ready to Explore:</h3>
              <ul style="color: #475569; padding-left: 20px;">
                <li>Browse available boats in your area</li>
                <li>Book skipper courses to enhance your skills</li>
                <li>Complete your profile for faster bookings</li>
              </ul>
            </div>
          `}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NODE_ENV === 'production' ? 'https://boatme.co.za' : 'http://localhost:5173'}/dashboard" 
               style="background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Complete Your Profile
            </a>
          </div>
          
          <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 40px;">
            Need help? Contact us at <a href="mailto:support@boatme.co.za" style="color: #0ea5e9;">support@boatme.co.za</a>
          </p>
        </div>
      `,
      text: `Welcome to BoatMe.co.za, ${userData.name}! Thank you for joining us as a ${roleText}. Visit your dashboard to get started: ${process.env.NODE_ENV === 'production' ? 'https://boatme.co.za' : 'http://localhost:5173'}/dashboard`
    };
  }

  private getBookingConfirmationTemplate(bookingData: BookingEmailData, recipient: 'guest' | 'owner'): EmailTemplate {
    if (recipient === 'guest') {
      return {
        subject: `Booking Confirmed: ${bookingData.boatName} 🚤`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #0ea5e9; margin: 0;">BoatMe.co.za</h1>
            </div>
            
            <h2 style="color: #334155;">Your Booking is Confirmed! ✅</h2>
            
            <p style="color: #475569;">Hi ${bookingData.guestName},</p>
            <p style="color: #475569;">Great news! Your booking for <strong>${bookingData.boatName}</strong> has been confirmed.</p>
            
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #334155; margin-top: 0;">Booking Details:</h3>
              <table style="width: 100%; color: #475569;">
                <tr><td><strong>Booking ID:</strong></td><td>${bookingData.bookingId}</td></tr>
                <tr><td><strong>Boat:</strong></td><td>${bookingData.boatName}</td></tr>
                <tr><td><strong>Dates:</strong></td><td>${bookingData.startDate} - ${bookingData.endDate}</td></tr>
                <tr><td><strong>Location:</strong></td><td>${bookingData.location}</td></tr>
                <tr><td><strong>Total:</strong></td><td>R${bookingData.totalAmount.toLocaleString()}</td></tr>
              </table>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="color: #92400e; margin: 0;"><strong>Important:</strong> You'll receive a reminder email 24 hours before your booking starts.</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NODE_ENV === 'production' ? 'https://boatme.co.za' : 'http://localhost:5173'}/dashboard" 
                 style="background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 10px;">
                View My Bookings
              </a>
              <a href="${process.env.NODE_ENV === 'production' ? 'https://boatme.co.za' : 'http://localhost:5173'}/receipt/${bookingData.bookingId}" 
                 style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View Receipt
              </a>
            </div>
          </div>
        `,
        text: `Your booking for ${bookingData.boatName} is confirmed! Booking ID: ${bookingData.bookingId}. Dates: ${bookingData.startDate} - ${bookingData.endDate}. Total: R${bookingData.totalAmount.toLocaleString()}`
      };
    } else {
      return {
        subject: `New Booking: ${bookingData.boatName} 📅`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #0ea5e9; margin: 0;">BoatMe.co.za</h1>
            </div>
            
            <h2 style="color: #334155;">New Booking Received! 🎉</h2>
            
            <p style="color: #475569;">Hi ${bookingData.ownerName},</p>
            <p style="color: #475569;">You have a new booking for your boat <strong>${bookingData.boatName}</strong>.</p>
            
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #334155; margin-top: 0;">Booking Details:</h3>
              <table style="width: 100%; color: #475569;">
                <tr><td><strong>Booking ID:</strong></td><td>${bookingData.bookingId}</td></tr>
                <tr><td><strong>Guest:</strong></td><td>${bookingData.guestName}</td></tr>
                <tr><td><strong>Contact:</strong></td><td>${bookingData.guestEmail}</td></tr>
                <tr><td><strong>Dates:</strong></td><td>${bookingData.startDate} - ${bookingData.endDate}</td></tr>
                <tr><td><strong>Amount:</strong></td><td>R${bookingData.totalAmount.toLocaleString()}</td></tr>
              </table>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NODE_ENV === 'production' ? 'https://boatme.co.za' : 'http://localhost:5173'}/owner/bookings" 
                 style="background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Manage Booking
              </a>
            </div>
          </div>
        `,
        text: `New booking for ${bookingData.boatName}! Guest: ${bookingData.guestName} (${bookingData.guestEmail}). Dates: ${bookingData.startDate} - ${bookingData.endDate}`
      };
    }
  }

  private getDocumentStatusTemplate(userData: UserData, status: 'approved' | 'rejected' | 'pending', reason?: string): EmailTemplate {
    const statusColors = {
      approved: '#10b981',
      rejected: '#ef4444',
      pending: '#f59e0b'
    };

    const statusText = {
      approved: 'Your documents have been approved! ✅',
      rejected: 'Your documents require attention ❌',
      pending: 'Document verification reminder ⏰'
    };

    return {
      subject: `Document Status: ${statusText[status]}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0ea5e9; margin: 0;">BoatMe.co.za</h1>
          </div>
          
          <h2 style="color: ${statusColors[status]};">${statusText[status]}</h2>
          
          <p style="color: #475569;">Hi ${userData.name},</p>
          
          ${status === 'approved' ? `
            <p style="color: #475569;">Congratulations! Your documents have been verified and approved. You can now start listing your boats and accepting bookings.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NODE_ENV === 'production' ? 'https://boatme.co.za' : 'http://localhost:5173'}/owner/boats" 
                 style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Create Your First Listing
              </a>
            </div>
          ` : status === 'rejected' ? `
            <p style="color: #475569;">We've reviewed your submitted documents and they require some updates before we can approve them.</p>
            ${reason ? `<div style="background: #fef2f2; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="color: #dc2626; margin: 0;"><strong>Reason:</strong> ${reason}</p>
            </div>` : ''}
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NODE_ENV === 'production' ? 'https://boatme.co.za' : 'http://localhost:5173'}/owner/documents" 
                 style="background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Update Documents
              </a>
            </div>
          ` : `
            <p style="color: #475569;">Your documents have been pending verification for more than 3 days. Please ensure all required documents are uploaded correctly.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NODE_ENV === 'production' ? 'https://boatme.co.za' : 'http://localhost:5173'}/owner/documents" 
                 style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Check Documents
              </a>
            </div>
          `}
        </div>
      `,
      text: `${statusText[status]} - ${userData.name}, please check your BoatMe dashboard for more details.`
    };
  }

  private getBookingReminderTemplate(bookingData: BookingEmailData): EmailTemplate {
    return {
      subject: `Reminder: Your boat booking starts tomorrow! 🚤`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0ea5e9; margin: 0;">BoatMe.co.za</h1>
          </div>
          
          <h2 style="color: #334155;">Your Adventure Starts Tomorrow! ⛵</h2>
          
          <p style="color: #475569;">Hi ${bookingData.guestName},</p>
          <p style="color: #475569;">Just a friendly reminder that your booking for <strong>${bookingData.boatName}</strong> starts tomorrow!</p>
          
          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #334155; margin-top: 0;">Reminder Details:</h3>
            <table style="width: 100%; color: #475569;">
              <tr><td><strong>Boat:</strong></td><td>${bookingData.boatName}</td></tr>
              <tr><td><strong>Start Date:</strong></td><td>${bookingData.startDate}</td></tr>
              <tr><td><strong>Location:</strong></td><td>${bookingData.location}</td></tr>
              <tr><td><strong>Booking ID:</strong></td><td>${bookingData.bookingId}</td></tr>
            </table>
          </div>
          
          <div style="background: #dbeafe; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="color: #1d4ed8; margin: 0;"><strong>Don't forget:</strong> Bring valid ID, sunscreen, and any personal items you'll need for your trip!</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NODE_ENV === 'production' ? 'https://boatme.co.za' : 'http://localhost:5173'}/dashboard" 
               style="background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Booking Details
            </a>
          </div>
        </div>
      `,
      text: `Reminder: Your booking for ${bookingData.boatName} starts tomorrow (${bookingData.startDate}). Booking ID: ${bookingData.bookingId}`
    };
  }

  private getPayoutStatusTemplate(payoutData: PayoutEmailData): EmailTemplate {
    const statusColors = {
      pending: '#f59e0b',
      paid: '#10b981',
      rejected: '#ef4444'
    };

    const statusText = {
      pending: 'Payout Request Received',
      paid: 'Payout Completed',
      rejected: 'Payout Request Rejected'
    };

    return {
      subject: `${statusText[payoutData.status]}: R${payoutData.amount.toLocaleString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0ea5e9; margin: 0;">BoatMe.co.za</h1>
          </div>
          
          <h2 style="color: ${statusColors[payoutData.status]};">${statusText[payoutData.status]} ${payoutData.status === 'paid' ? '✅' : payoutData.status === 'rejected' ? '❌' : '⏰'}</h2>
          
          <p style="color: #475569;">Hi ${payoutData.ownerName},</p>
          
          ${payoutData.status === 'pending' ? `
            <p style="color: #475569;">We've received your payout request and it's currently being processed.</p>
            <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="color: #92400e; margin: 0;"><strong>Processing Time:</strong> Payouts typically take 3-5 business days to process.</p>
            </div>
          ` : payoutData.status === 'paid' ? `
            <p style="color: #475569;">Great news! Your payout has been processed and should appear in your bank account within 1-2 business days.</p>
            <div style="background: #f0fdf4; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="color: #166534; margin: 0;"><strong>Payment Details:</strong> The funds have been transferred to your registered bank account.</p>
            </div>
          ` : `
            <p style="color: #475569;">Unfortunately, we couldn't process your payout request at this time. Please review your banking details and try again.</p>
            <div style="background: #fef2f2; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="color: #dc2626; margin: 0;"><strong>Next Steps:</strong> Please verify your banking information and submit a new payout request.</p>
            </div>
          `}
          
          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #334155; margin-top: 0;">Payout Details:</h3>
            <table style="width: 100%; color: #475569;">
              <tr><td><strong>Payout ID:</strong></td><td>${payoutData.payoutId}</td></tr>
              <tr><td><strong>Amount:</strong></td><td>R${payoutData.amount.toLocaleString()}</td></tr>
              <tr><td><strong>Request Date:</strong></td><td>${payoutData.requestDate}</td></tr>
              <tr><td><strong>Status:</strong></td><td style="color: ${statusColors[payoutData.status]}; font-weight: bold;">${payoutData.status.toUpperCase()}</td></tr>
            </table>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NODE_ENV === 'production' ? 'https://boatme.co.za' : 'http://localhost:5173'}/owner/payouts" 
               style="background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Payout History
            </a>
          </div>
        </div>
      `,
      text: `${statusText[payoutData.status]}: R${payoutData.amount.toLocaleString()}. Payout ID: ${payoutData.payoutId}. Status: ${payoutData.status.toUpperCase()}`
    };
  }

  private getReviewReminderTemplate(reminderData: ReviewReminderData): EmailTemplate {
    return {
      subject: `How was your experience with ${reminderData.boatName}? ⭐`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0ea5e9; margin: 0;">BoatMe.co.za</h1>
          </div>
          
          <h2 style="color: #334155;">How was your boat experience? 🚤</h2>
          
          <p style="color: #475569;">Hi ${reminderData.guestName},</p>
          <p style="color: #475569;">We hope you had an amazing time with <strong>${reminderData.boatName}</strong>! Your feedback helps other guests and supports boat owners like ${reminderData.ownerName}.</p>
          
          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #334155; margin-top: 0;">Your Recent Booking:</h3>
            <table style="width: 100%; color: #475569;">
              <tr><td><strong>Boat:</strong></td><td>${reminderData.boatName}</td></tr>
              <tr><td><strong>Owner:</strong></td><td>${reminderData.ownerName}</td></tr>
              <tr><td><strong>Completed:</strong></td><td>${reminderData.endDate}</td></tr>
              <tr><td><strong>Booking ID:</strong></td><td>${reminderData.bookingId}</td></tr>
            </table>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="color: #92400e; margin: 0;"><strong>Quick Review:</strong> Your review takes less than 2 minutes and helps the BoatMe community!</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NODE_ENV === 'production' ? 'https://boatme.co.za' : 'http://localhost:5173'}/review/${reminderData.bookingId}" 
               style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 16px;">
              ⭐ Write Your Review
            </a>
          </div>
          
          <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 40px;">
            Reviews help maintain quality and trust in our community.<br>
            Thank you for being part of BoatMe.co.za!
          </p>
        </div>
      `,
      text: `Thanks for booking ${reminderData.boatName}! Please share your experience by leaving a review. Visit: ${process.env.NODE_ENV === 'production' ? 'https://boatme.co.za' : 'http://localhost:5173'}/review/${reminderData.bookingId}`
    };
  }
}

export const emailService = new EmailService();