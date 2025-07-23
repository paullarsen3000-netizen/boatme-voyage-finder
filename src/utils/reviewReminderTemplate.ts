export const reviewReminderEmailTemplate = (
  userName: string,
  bookingId: string,
  itemName: string,
  itemType: 'boat' | 'course',
  bookingDates: string,
  reviewUrl: string
) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Review Reminder - BoatMe</title>
    <style>
        body {
            font-family: 'Inter', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 10px;
        }
        .stars {
            font-size: 24px;
            margin: 20px 0;
            text-align: center;
        }
        .star {
            color: #fbbf24;
            margin: 0 2px;
        }
        .cta-button {
            background: linear-gradient(135deg, #1e40af, #3b82f6);
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            display: inline-block;
            margin: 20px 0;
            transition: transform 0.2s;
        }
        .cta-button:hover {
            transform: translateY(-2px);
        }
        .booking-details {
            background: #f1f5f9;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 14px;
        }
        .highlight {
            color: #1e40af;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🚤 BoatMe</div>
            <h1 style="color: #1e40af; margin: 0;">How was your experience?</h1>
            <p style="color: #64748b; margin: 10px 0 0 0;">Share your thoughts and help others discover amazing experiences</p>
        </div>

        <div class="stars">
            <span class="star">⭐</span>
            <span class="star">⭐</span>
            <span class="star">⭐</span>
            <span class="star">⭐</span>
            <span class="star">⭐</span>
        </div>

        <p>Hi <strong>${userName}</strong>,</p>
        
        <p>We hope you had an amazing time with your recent ${itemType === 'boat' ? 'boat rental' : 'skipper course'}! Your experience matters to us and helps other adventurers make informed decisions.</p>

        <div class="booking-details">
            <h3 style="margin-top: 0; color: #1e40af;">${itemName}</h3>
            <p style="margin: 5px 0; color: #64748b;">
                <strong>Dates:</strong> ${bookingDates}
            </p>
            <p style="margin: 5px 0; color: #64748b;">
                <strong>Booking ID:</strong> ${bookingId}
            </p>
        </div>

        <p>Could you spare <span class="highlight">just 1 minute</span> to leave a review? Your feedback helps:</p>
        <ul style="color: #64748b;">
            <li>Other customers choose the right ${itemType}</li>
            <li>${itemType === 'boat' ? 'Boat owners' : 'Course providers'} improve their service</li>
            <li>Build trust within our boating community</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
            <a href="${reviewUrl}" class="cta-button">
                ⭐ Leave a Review
            </a>
        </div>

        <p style="color: #64748b; font-size: 14px;">
            <em>This review invitation expires in 30 days. If you've already left a review, please ignore this email.</em>
        </p>

        <div class="footer">
            <p><strong>BoatMe.co.za</strong> - South Africa's Premier Boat Rental Platform</p>
            <p>
                Questions? Contact us at 
                <a href="mailto:support@boatme.co.za" style="color: #1e40af;">support@boatme.co.za</a>
            </p>
            <p style="margin-top: 15px;">
                <a href="#" style="color: #64748b; text-decoration: none; margin: 0 10px;">Unsubscribe</a> | 
                <a href="#" style="color: #64748b; text-decoration: none; margin: 0 10px;">Manage Preferences</a>
            </p>
        </div>
    </div>
</body>
</html>
`;

export const reviewReminderSubjectLines = [
  "How was your experience? ⭐ Tell us in 1 minute",
  "Share your adventure story! ⭐ Quick review needed",
  "Help others discover amazing experiences ⭐",
  "Your feedback matters! ⭐ 1-minute review",
  "Rate your recent ${itemType} experience ⭐"
];