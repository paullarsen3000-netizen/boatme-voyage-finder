import React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Database } from '@/integrations/supabase/types';

type Message = Database['public']['Tables']['messages']['Row'];

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  return (
    <div className={cn("flex", isOwnMessage ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[70%] rounded-lg px-3 py-2 text-sm",
          isOwnMessage
            ? "bg-primary text-primary-foreground ml-4"
            : "bg-muted mr-4"
        )}
      >
        <p className="break-words">{message.message}</p>
        <p className={cn(
          "text-xs mt-1 opacity-70",
          isOwnMessage ? "text-right" : "text-left"
        )}>
          {format(new Date(message.created_at), 'HH:mm')}
        </p>
      </div>
    </div>
  );
}