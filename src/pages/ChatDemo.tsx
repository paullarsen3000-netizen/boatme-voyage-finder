import React from 'react';
import { ChatInterface } from '@/components/messaging/ChatInterface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ChatDemo() {
  // Demo booking ID and receiver ID - in real app these would come from props/routing
  const demoBookingId = "550e8400-e29b-41d4-a716-446655440000";
  const demoReceiverId = "550e8400-e29b-41d4-a716-446655440001";

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Real-Time Messaging Demo</h1>
        <p className="text-muted-foreground">
          Chat functionality with real-time updates, typing indicators, and offline support.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Chat as User 1</CardTitle>
          </CardHeader>
          <CardContent>
            <ChatInterface 
              bookingId={demoBookingId}
              receiverId={demoReceiverId}
              receiverName="Boat Owner"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Real-Time Updates</h3>
              <p className="text-sm text-muted-foreground">
                Messages appear instantly using Supabase real-time subscriptions
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Offline Support</h3>
              <p className="text-sm text-muted-foreground">
                Graceful handling when connection is lost with visual indicators
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Security</h3>
              <p className="text-sm text-muted-foreground">
                RLS policies ensure users can only see messages they're involved in
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">UX Features</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Auto-scroll to new messages</li>
                <li>• Message timestamps</li>
                <li>• Send button with loading states</li>
                <li>• Typing indicators (ready for implementation)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}