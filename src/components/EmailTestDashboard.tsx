import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEmailTriggers } from '@/hooks/useEmailTriggers';
import { emailScheduler } from '@/lib/emailScheduler';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Mail, Send, Clock, CheckCircle, X } from 'lucide-react';

export function EmailTestDashboard() {
  const { sendBookingConfirmation, sendDocumentStatusUpdate, sendBookingReminder } = useEmailTriggers();
  
  const [testBookingData, setTestBookingData] = useState({
    bookingId: 'BM-' + Date.now(),
    guestName: 'John Doe',
    guestEmail: 'john@example.com',
    ownerName: 'Jane Smith',
    ownerEmail: 'jane@example.com',
    boatName: 'Ocean Explorer',
    startDate: new Date().toLocaleDateString(),
    endDate: new Date(Date.now() + 86400000).toLocaleDateString(),
    totalAmount: 2500,
    location: 'Cape Town Harbour'
  });

  const [documentTestData, setDocumentTestData] = useState({
    name: 'Test User',
    email: 'test@example.com',
    status: 'approved' as 'approved' | 'rejected' | 'pending',
    reason: ''
  });

  const [scheduledEmails] = useState(() => emailScheduler.getScheduledEmails());

  const handleBookingTest = async () => {
    await sendBookingConfirmation(testBookingData);
  };

  const handleDocumentTest = async () => {
    await sendDocumentStatusUpdate(
      { name: documentTestData.name, email: documentTestData.email, role: 'owner' },
      documentTestData.status,
      documentTestData.reason || undefined
    );
  };

  const handleReminderTest = async () => {
    await sendBookingReminder(testBookingData);
  };

  const handleScheduleReminder = async () => {
    const reminderDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    const success = await emailScheduler.scheduleBookingReminder(testBookingData, reminderDate);
    if (success) {
      alert('Reminder scheduled successfully!');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email System Test Dashboard
          </CardTitle>
          <CardDescription>
            Test and manage email notifications for BoatMe.co.za
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Booking Confirmation Test */}
      <Card>
        <CardHeader>
          <CardTitle>Test Booking Confirmation Emails</CardTitle>
          <CardDescription>
            Test booking confirmation emails sent to both guest and owner
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guestName">Guest Name</Label>
              <Input
                id="guestName"
                value={testBookingData.guestName}
                onChange={(e) => setTestBookingData(prev => ({ ...prev, guestName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guestEmail">Guest Email</Label>
              <Input
                id="guestEmail"
                type="email"
                value={testBookingData.guestEmail}
                onChange={(e) => setTestBookingData(prev => ({ ...prev, guestEmail: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerName">Owner Name</Label>
              <Input
                id="ownerName"
                value={testBookingData.ownerName}
                onChange={(e) => setTestBookingData(prev => ({ ...prev, ownerName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerEmail">Owner Email</Label>
              <Input
                id="ownerEmail"
                type="email"
                value={testBookingData.ownerEmail}
                onChange={(e) => setTestBookingData(prev => ({ ...prev, ownerEmail: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="boatName">Boat Name</Label>
              <Input
                id="boatName"
                value={testBookingData.boatName}
                onChange={(e) => setTestBookingData(prev => ({ ...prev, boatName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Total Amount (R)</Label>
              <Input
                id="amount"
                type="number"
                value={testBookingData.totalAmount}
                onChange={(e) => setTestBookingData(prev => ({ ...prev, totalAmount: parseInt(e.target.value) }))}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleBookingTest}>
              <Send className="mr-2 h-4 w-4" />
              Send Booking Confirmation
            </Button>
            <Button variant="outline" onClick={handleReminderTest}>
              <Mail className="mr-2 h-4 w-4" />
              Send Reminder
            </Button>
            <Button variant="outline" onClick={handleScheduleReminder}>
              <Clock className="mr-2 h-4 w-4" />
              Schedule Reminder
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Document Status Test */}
      <Card>
        <CardHeader>
          <CardTitle>Test Document Status Emails</CardTitle>
          <CardDescription>
            Test document verification status notification emails
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userName">User Name</Label>
              <Input
                id="userName"
                value={documentTestData.name}
                onChange={(e) => setDocumentTestData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userEmail">User Email</Label>
              <Input
                id="userEmail"
                type="email"
                value={documentTestData.email}
                onChange={(e) => setDocumentTestData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={documentTestData.status}
                onValueChange={(value: 'approved' | 'rejected' | 'pending') => 
                  setDocumentTestData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {documentTestData.status === 'rejected' && (
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for rejection..."
                value={documentTestData.reason}
                onChange={(e) => setDocumentTestData(prev => ({ ...prev, reason: e.target.value }))}
              />
            </div>
          )}
          
          <Button onClick={handleDocumentTest}>
            <Send className="mr-2 h-4 w-4" />
            Send Document Status Email
          </Button>
        </CardContent>
      </Card>

      {/* Scheduled Emails */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Emails</CardTitle>
          <CardDescription>
            View and manage scheduled email notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {scheduledEmails.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No scheduled emails found
            </p>
          ) : (
            <div className="space-y-3">
              {scheduledEmails.map((email, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-muted">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{email.email_type.replace('_', ' ')}</p>
                      <p className="text-sm text-muted-foreground">{email.recipient_email}</p>
                      <p className="text-xs text-muted-foreground">
                        Scheduled for: {new Date(email.scheduled_for).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={email.status === 'sent' ? 'default' : email.status === 'failed' ? 'destructive' : 'secondary'}>
                      {email.status === 'sent' && <CheckCircle className="mr-1 h-3 w-3" />}
                      {email.status === 'failed' && <X className="mr-1 h-3 w-3" />}
                      {email.status === 'pending' && <Clock className="mr-1 h-3 w-3" />}
                      {email.status}
                    </Badge>
                    {email.status === 'pending' && email.id && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (email.id && emailScheduler.cancelScheduledEmail(email.id)) {
                            alert('Email cancelled successfully!');
                          }
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> This is a development testing interface. In production, emails would be sent via 
          Supabase Edge Functions with proper email providers like SendGrid or Mailgun for better deliverability.
        </p>
      </div>
    </div>
  );
}