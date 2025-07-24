import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';
import { Send, WifiOff } from 'lucide-react';

interface ChatInterfaceProps {
  bookingId: string;
  receiverId: string;
  receiverName?: string;
}

export function ChatInterface({ bookingId, receiverId, receiverName }: ChatInterfaceProps) {
  const { user } = useAuth();
  const { messages, loading, error, sendMessage, isOnline, typingUsers } = useMessages(bookingId);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !isOnline || sending) return;

    setSending(true);
    const result = await sendMessage({
      receiver_id: receiverId,
      message: newMessage.trim(),
      booking_id: bookingId,
    });

    if (!result.error) {
      setNewMessage('');
    }
    setSending(false);
  };

  if (loading) {
    return (
      <Card className="h-96">
        <CardContent className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-96 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          Chat {receiverName && `with ${receiverName}`}
          {!isOnline && <WifiOff className="h-4 w-4 text-muted-foreground" />}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {error && (
          <Alert className="mx-4 mb-2" variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isOnline && (
          <Alert className="mx-4 mb-2" variant="destructive">
            <WifiOff className="h-4 w-4" />
            <AlertDescription>You're offline. Messages will be sent when connection is restored.</AlertDescription>
          </Alert>
        )}

        <ScrollArea className="flex-1 px-4" ref={scrollRef}>
          <div className="space-y-3 py-2">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwnMessage={message.sender_id === user?.id}
                />
              ))
            )}
            
            {typingUsers.size > 0 && (
              <TypingIndicator users={Array.from(typingUsers)} />
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isOnline ? "Type a message..." : "Offline - messages will be sent when connected"}
              disabled={!isOnline || sending}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={!newMessage.trim() || !isOnline || sending}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}