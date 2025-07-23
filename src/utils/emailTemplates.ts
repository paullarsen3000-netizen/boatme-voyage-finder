// Email template utilities for BoatMe.co.za
// These can be used for testing and as examples for the actual email service

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export const generateBookingConfirmationEmail = (data: {
  guestName: string;
  boatName: string;
  bookingId: string;
  startDate: string;
  endDate: string;
  location: string;
  totalAmount: number;
}, isOwner: boolean = false): EmailTemplate => {
  if (isOwner) {
    return {
      subject: `New Booking: ${data.boatName}`,
      html: `
        <h2>New Booking Received!</h2>
        <p>You have a new booking for ${data.boatName}</p>
        <ul>
          <li>Guest: ${data.guestName}</li>
          <li>Dates: ${data.startDate} - ${data.endDate}</li>
          <li>Location: ${data.location}</li>
          <li>Amount: R${data.totalAmount.toLocaleString()}</li>
          <li>Booking ID: ${data.bookingId}</li>
        </ul>
      `,
      text: `New booking for ${data.boatName} from ${data.guestName}. Dates: ${data.startDate} - ${data.endDate}. Amount: R${data.totalAmount.toLocaleString()}`
    };
  }
  
  return {
    subject: `Booking Confirmed: ${data.boatName}`,
    html: `
      <h2>Your Booking is Confirmed!</h2>
      <p>Hi ${data.guestName}, your booking for ${data.boatName} has been confirmed.</p>
      <ul>
        <li>Boat: ${data.boatName}</li>
        <li>Dates: ${data.startDate} - ${data.endDate}</li>
        <li>Location: ${data.location}</li>
        <li>Total: R${data.totalAmount.toLocaleString()}</li>
        <li>Booking ID: ${data.bookingId}</li>
      </ul>
      <p>You'll receive a reminder 24 hours before your booking.</p>
    `,
    text: `Your booking for ${data.boatName} is confirmed! Dates: ${data.startDate} - ${data.endDate}. Total: R${data.totalAmount.toLocaleString()}. Booking ID: ${data.bookingId}`
  };
};

export const generateWelcomeEmail = (userData: {
  name: string;
  role: 'renter' | 'owner' | 'provider';
}): EmailTemplate => {
  const roleText = userData.role === 'owner' ? 'boat owner' : userData.role === 'provider' ? 'course provider' : 'member';
  
  return {
    subject: 'Welcome to BoatMe.co.za! 🚤',
    html: `
      <h2>Welcome aboard, ${userData.name}!</h2>
      <p>Thank you for joining BoatMe.co.za as a ${roleText}.</p>
      ${userData.role === 'owner' ? `
        <h3>Next Steps for Boat Owners:</h3>
        <ul>
          <li>Complete your profile verification</li>
          <li>Upload your boat documentation</li>
          <li>Create your first boat listing</li>
          <li>Set your availability and pricing</li>
        </ul>
      ` : `
        <h3>Ready to Explore:</h3>
        <ul>
          <li>Browse available boats in your area</li>
          <li>Book skipper courses to enhance your skills</li>
          <li>Complete your profile for faster bookings</li>
        </ul>
      `}
      <p><a href="/dashboard">Complete Your Profile</a></p>
    `,
    text: `Welcome to BoatMe.co.za, ${userData.name}! Thank you for joining us as a ${roleText}. Visit your dashboard to get started.`
  };
};

export const generateDocumentStatusEmail = (
  userData: { name: string },
  status: 'approved' | 'rejected' | 'pending',
  reason?: string
): EmailTemplate => {
  const statusTexts = {
    approved: 'Your documents have been approved! ✅',
    rejected: 'Your documents require attention ❌',
    pending: 'Document verification reminder ⏰'
  };

  return {
    subject: `Document Status: ${statusTexts[status]}`,
    html: `
      <h2>${statusTexts[status]}</h2>
      <p>Hi ${userData.name},</p>
      ${status === 'approved' ? `
        <p>Congratulations! Your documents have been verified and approved. You can now start listing your boats and accepting bookings.</p>
        <p><a href="/owner/boats">Create Your First Listing</a></p>
      ` : status === 'rejected' ? `
        <p>We've reviewed your submitted documents and they require some updates before we can approve them.</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
        <p><a href="/owner/documents">Update Documents</a></p>
      ` : `
        <p>Your documents have been pending verification for more than 3 days. Please ensure all required documents are uploaded correctly.</p>
        <p><a href="/owner/documents">Check Documents</a></p>
      `}
    `,
    text: `${statusTexts[status]} - ${userData.name}, please check your BoatMe dashboard for more details.`
  };
};

export const generateBookingReminderEmail = (data: {
  guestName: string;
  boatName: string;
  bookingId: string;
  startDate: string;
  location: string;
}): EmailTemplate => {
  return {
    subject: 'Reminder: Your boat booking starts tomorrow! 🚤',
    html: `
      <h2>Your Adventure Starts Tomorrow! ⛵</h2>
      <p>Hi ${data.guestName}, just a friendly reminder that your booking for ${data.boatName} starts tomorrow!</p>
      <ul>
        <li>Boat: ${data.boatName}</li>
        <li>Start Date: ${data.startDate}</li>
        <li>Location: ${data.location}</li>
        <li>Booking ID: ${data.bookingId}</li>
      </ul>
      <p><strong>Don't forget:</strong> Bring valid ID, sunscreen, and any personal items you'll need for your trip!</p>
      <p><a href="/dashboard">View Booking Details</a></p>
    `,
    text: `Reminder: Your booking for ${data.boatName} starts tomorrow (${data.startDate}). Booking ID: ${data.bookingId}`
  };
};