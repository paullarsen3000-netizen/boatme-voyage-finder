import React from 'react';

interface TypingIndicatorProps {
  users: string[];
}

export function TypingIndicator({ users }: TypingIndicatorProps) {
  if (users.length === 0) return null;

  return (
    <div className="flex justify-start">
      <div className="bg-muted rounded-lg px-3 py-2 mr-4">
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">
            {users.length === 1 ? 'Someone is' : `${users.length} people are`} typing
          </span>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}