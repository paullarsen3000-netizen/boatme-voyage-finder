import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Mail, Bell, FileCheck, Calendar, Send } from 'lucide-react';
import { useEmailTriggers } from '@/hooks/useEmailTriggers';
import { useAuth } from '@/contexts/AuthContext';

export function EmailSettings() {
  const { user } = useAuth();
  const [emailPreferences, setEmailPreferences] = useState({
    welcomeEmails: true,
    bookingConfirmations: true,
    documentUpdates: true,
    bookingReminders: true,
    marketingEmails: false,
    adminNotifications: user?.user_metadata?.role === 'owner'
  });

  const { resendWelcomeEmail } = useEmailTriggers({
    enableWelcomeEmail: emailPreferences.welcomeEmails,
    enableBookingEmails: emailPreferences.bookingConfirmations,
    enableDocumentEmails: emailPreferences.documentUpdates,
    enableReminderEmails: emailPreferences.bookingReminders
  });

  const handlePreferenceChange = (key: string, value: boolean) => {
    setEmailPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleResendWelcome = async () => {
    await resendWelcomeEmail();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Preferences
        </CardTitle>
        <CardDescription>
          Manage your email notifications and communication preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Transactional Emails */}
        <div>
          <h3 className="text-sm font-medium mb-3">Transactional Emails</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Send className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="welcome">Welcome emails</Label>
                  <p className="text-xs text-muted-foreground">
                    Onboarding and account setup emails
                  </p>
                </div>
              </div>
              <Switch
                id="welcome"
                checked={emailPreferences.welcomeEmails}
                onCheckedChange={(checked) => handlePreferenceChange('welcomeEmails', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="bookings">Booking confirmations</Label>
                  <p className="text-xs text-muted-foreground">
                    Booking confirmations and updates
                  </p>
                </div>
              </div>
              <Switch
                id="bookings"
                checked={emailPreferences.bookingConfirmations}
                onCheckedChange={(checked) => handlePreferenceChange('bookingConfirmations', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileCheck className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="documents">Document status updates</Label>
                  <p className="text-xs text-muted-foreground">
                    Verification status and document requests
                  </p>
                </div>
              </div>
              <Switch
                id="documents"
                checked={emailPreferences.documentUpdates}
                onCheckedChange={(checked) => handlePreferenceChange('documentUpdates', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="reminders">Booking reminders</Label>
                  <p className="text-xs text-muted-foreground">
                    24-hour reminders before your bookings
                  </p>
                </div>
              </div>
              <Switch
                id="reminders"
                checked={emailPreferences.bookingReminders}
                onCheckedChange={(checked) => handlePreferenceChange('bookingReminders', checked)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Marketing & Updates */}
        <div>
          <h3 className="text-sm font-medium mb-3">Marketing & Updates</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="marketing">Marketing emails</Label>
                  <p className="text-xs text-muted-foreground">
                    Special offers, new features, and tips
                  </p>
                </div>
              </div>
              <Switch
                id="marketing"
                checked={emailPreferences.marketingEmails}
                onCheckedChange={(checked) => handlePreferenceChange('marketingEmails', checked)}
              />
            </div>

            {user?.user_metadata?.role === 'owner' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor="admin">Owner notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Platform updates and owner-specific news
                    </p>
                  </div>
                </div>
                <Switch
                  id="admin"
                  checked={emailPreferences.adminNotifications}
                  onCheckedChange={(checked) => handlePreferenceChange('adminNotifications', checked)}
                />
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Email Actions */}
        <div>
          <h3 className="text-sm font-medium mb-3">Email Actions</h3>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              onClick={handleResendWelcome}
              className="w-full justify-start"
            >
              <Send className="h-4 w-4 mr-2" />
              Resend Welcome Email
            </Button>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> Critical emails like booking confirmations and security alerts cannot be disabled.
            You can unsubscribe from marketing emails using the link in any marketing email.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}