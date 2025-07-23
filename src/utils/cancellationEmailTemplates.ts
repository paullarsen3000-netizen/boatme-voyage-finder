interface CancellationEmailData {
  bookingId: string;
  itemName: string;
  guestName: string;
  ownerName: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  cancellationReason: string;
  reasonComments?: string;
  cancelledBy: 'renter' | 'owner';
}

interface DisputeEmailData {
  bookingId: string;
  itemName: string;
  disputeReason: string;
  disputantName: string;
}

interface ResolutionEmailData {
  bookingId: string;
  itemName: string;
  resolutionNotes: string;
  recipientName: string;
}

export function generateCancellationNoticeEmail(data: CancellationEmailData) {
  const { 
    bookingId, 
    itemName, 
    guestName, 
    ownerName, 
    startDate, 
    endDate, 
    totalAmount, 
    cancellationReason, 
    reasonComments, 
    cancelledBy 
  } = data;

  const isOwnerCancelling = cancelledBy === 'owner';
  const recipientName = isOwnerCancelling ? guestName : ownerName;
  const cancellerName = isOwnerCancelling ? ownerName : guestName;
  const cancellerRole = isOwnerCancelling ? 'boat owner' : 'guest';

  const subject = `Booking Cancelled - ${itemName} (${bookingId})`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Cancellation Notice</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .booking-details { background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #ef4444; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
        .detail-row:last-child { border-bottom: none; }
        .label { font-weight: 600; color: #475569; }
        .value { color: #1e293b; }
        .reason-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 15px; margin: 15px 0; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .footer { background: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
        .alert { color: #dc2626; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Cancellation Notice</h1>
          <p>Your booking has been cancelled</p>
        </div>
        
        <div class="content">
          <p>Dear ${recipientName},</p>
          
          <p>We're writing to inform you that your booking has been cancelled by the ${cancellerRole} (${cancellerName}).</p>
          
          <div class="booking-details">
            <h3>Booking Details</h3>
            <div class="detail-row">
              <span class="label">Booking ID:</span>
              <span class="value">${bookingId}</span>
            </div>
            <div class="detail-row">
              <span class="label">Item:</span>
              <span class="value">${itemName}</span>
            </div>
            <div class="detail-row">
              <span class="label">Guest:</span>
              <span class="value">${guestName}</span>
            </div>
            <div class="detail-row">
              <span class="label">Owner:</span>
              <span class="value">${ownerName}</span>
            </div>
            <div class="detail-row">
              <span class="label">Dates:</span>
              <span class="value">${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}</span>
            </div>
            <div class="detail-row">
              <span class="label">Total Amount:</span>
              <span class="value">R${totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <div class="reason-box">
            <h4>Cancellation Reason</h4>
            <p><strong>Reason:</strong> ${cancellationReason.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
            ${reasonComments ? `<p><strong>Additional Comments:</strong> ${reasonComments}</p>` : ''}
          </div>
          
          <p>Our team will process the refund according to our cancellation policy. You can expect to receive your refund within 5-7 business days.</p>
          
          <p>If you believe this cancellation was made in error or you have concerns about the cancellation, you can request an admin review.</p>
          
          <a href="https://boatme.co.za/dashboard/bookings" class="button">View Your Bookings</a>
          
          <p>If you have any questions, please don't hesitate to contact our support team.</p>
          
          <p>Best regards,<br>The BoatMe.co.za Team</p>
        </div>
        
        <div class="footer">
          <p>© 2024 BoatMe.co.za. All rights reserved.</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Booking Cancellation Notice
    
    Dear ${recipientName},
    
    Your booking has been cancelled by the ${cancellerRole} (${cancellerName}).
    
    Booking Details:
    - Booking ID: ${bookingId}
    - Item: ${itemName}
    - Guest: ${guestName}
    - Owner: ${ownerName}
    - Dates: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}
    - Total Amount: R${totalAmount.toFixed(2)}
    
    Cancellation Reason: ${cancellationReason.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
    ${reasonComments ? `Additional Comments: ${reasonComments}` : ''}
    
    Our team will process the refund according to our cancellation policy. You can expect to receive your refund within 5-7 business days.
    
    If you believe this cancellation was made in error or you have concerns, you can request an admin review by visiting: https://boatme.co.za/dashboard/bookings
    
    Best regards,
    The BoatMe.co.za Team
  `;

  return { subject, html, text };
}

export function generateDisputeEscalationEmail(data: DisputeEmailData) {
  const { bookingId, itemName, disputeReason, disputantName } = data;

  const subject = `Dispute Escalation - Admin Review Required (${bookingId})`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Dispute Escalation</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .alert-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .footer { background: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 Dispute Escalation Alert</h1>
          <p>Admin review required for booking ${bookingId}</p>
        </div>
        
        <div class="content">
          <p>Dear Admin,</p>
          
          <p>A dispute has been escalated for the following booking and requires your immediate attention:</p>
          
          <div class="alert-box">
            <h3>Dispute Details</h3>
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>Item:</strong> ${itemName}</p>
            <p><strong>Disputant:</strong> ${disputantName}</p>
            <p><strong>Dispute Reason:</strong></p>
            <p>${disputeReason}</p>
          </div>
          
          <p>Please review this dispute and take appropriate action to resolve the issue.</p>
          
          <a href="https://boatme.co.za/admin/disputes" class="button">Review Dispute</a>
          
          <p>Best regards,<br>BoatMe.co.za System</p>
        </div>
        
        <div class="footer">
          <p>© 2024 BoatMe.co.za. All rights reserved.</p>
          <p>This is an automated system notification.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Dispute Escalation Alert
    
    Dear Admin,
    
    A dispute has been escalated for booking ${bookingId} and requires your immediate attention.
    
    Dispute Details:
    - Booking ID: ${bookingId}
    - Item: ${itemName}
    - Disputant: ${disputantName}
    - Dispute Reason: ${disputeReason}
    
    Please review this dispute at: https://boatme.co.za/admin/disputes
    
    Best regards,
    BoatMe.co.za System
  `;

  return { subject, html, text };
}

export function generateResolutionSummaryEmail(data: ResolutionEmailData) {
  const { bookingId, itemName, resolutionNotes, recipientName } = data;

  const subject = `Dispute Resolved - ${itemName} (${bookingId})`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Dispute Resolution</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #059669, #047857); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .resolution-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .button { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .footer { background: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Dispute Resolved</h1>
          <p>Your dispute has been resolved by our admin team</p>
        </div>
        
        <div class="content">
          <p>Dear ${recipientName},</p>
          
          <p>We're pleased to inform you that your dispute regarding booking ${bookingId} has been resolved by our admin team.</p>
          
          <div class="resolution-box">
            <h3>Resolution Summary</h3>
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>Item:</strong> ${itemName}</p>
            <p><strong>Resolution:</strong></p>
            <p>${resolutionNotes}</p>
          </div>
          
          <p>If you have any further questions or concerns about this resolution, please don't hesitate to contact our support team.</p>
          
          <a href="https://boatme.co.za/dashboard/bookings" class="button">View Your Bookings</a>
          
          <p>Thank you for your patience during the resolution process.</p>
          
          <p>Best regards,<br>The BoatMe.co.za Team</p>
        </div>
        
        <div class="footer">
          <p>© 2024 BoatMe.co.za. All rights reserved.</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Dispute Resolved
    
    Dear ${recipientName},
    
    Your dispute regarding booking ${bookingId} has been resolved by our admin team.
    
    Resolution Summary:
    - Booking ID: ${bookingId}
    - Item: ${itemName}
    - Resolution: ${resolutionNotes}
    
    If you have any further questions about this resolution, please contact our support team.
    
    View your bookings at: https://boatme.co.za/dashboard/bookings
    
    Thank you for your patience during the resolution process.
    
    Best regards,
    The BoatMe.co.za Team
  `;

  return { subject, html, text };
}