import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function ResendEmailTrigger() {
  const [email, setEmail] = useState('paul@unitedagri.co.za');
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('resend-auth-email', {
        body: {
          email: email,
          emailType: 'signup'
        }
      });

      if (error) {
        console.error('Error:', error);
        toast.error(`Failed to resend email: ${error.message}`);
      } else {
        console.log('Success:', data);
        toast.success(`Confirmation email resent to ${email}`);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Resend Confirmation Email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address"
        />
        <Button 
          onClick={handleResend} 
          disabled={loading || !email}
          className="w-full"
        >
          {loading ? 'Sending...' : 'Resend Email'}
        </Button>
      </CardContent>
    </Card>
  );
}