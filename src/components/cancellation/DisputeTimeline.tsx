import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, AlertCircle, CheckCircle, MessageSquare } from 'lucide-react';
import { Dispute } from '@/types/cancellation';

interface DisputeTimelineProps {
  dispute: Dispute;
}

interface TimelineEvent {
  id: string;
  type: 'created' | 'status_change' | 'admin_note' | 'resolved';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
  status?: string;
}

export function DisputeTimeline({ dispute }: DisputeTimelineProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'destructive';
      case 'investigating':
        return 'secondary';
      case 'resolved':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4" />;
      case 'investigating':
        return <Clock className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Generate timeline events from dispute data
  const timelineEvents: TimelineEvent[] = [
    {
      id: '1',
      type: 'created',
      title: 'Dispute Created',
      description: dispute.dispute_reason,
      timestamp: dispute.created_at,
      icon: <AlertCircle className="h-4 w-4" />
    },
    // Add status change events if status changed
    ...(dispute.status !== 'open' ? [{
      id: '2',
      type: 'status_change' as const,
      title: 'Status Updated',
      description: `Dispute status changed to ${dispute.status}`,
      timestamp: dispute.updated_at,
      icon: <Clock className="h-4 w-4" />,
      status: dispute.status
    }] : []),
    // Add admin notes if they exist
    ...(dispute.admin_notes ? [{
      id: '3',
      type: 'admin_note' as const,
      title: 'Admin Note Added',
      description: dispute.admin_notes,
      timestamp: dispute.updated_at,
      icon: <MessageSquare className="h-4 w-4" />
    }] : []),
    // Add resolution if resolved
    ...(dispute.status === 'resolved' && dispute.resolution_notes ? [{
      id: '4',
      type: 'resolved' as const,
      title: 'Dispute Resolved',
      description: dispute.resolution_notes,
      timestamp: dispute.resolved_at || dispute.updated_at,
      icon: <CheckCircle className="h-4 w-4" />
    }] : [])
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Dispute Timeline
          </span>
          <Badge variant={getStatusColor(dispute.status)} className="flex items-center gap-1">
            {getStatusIcon(dispute.status)}
            {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timelineEvents.map((event, index) => (
            <div key={event.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {event.icon}
                </div>
                {index < timelineEvents.length - 1 && (
                  <div className="h-8 w-px bg-border mt-2" />
                )}
              </div>
              <div className="flex-1 space-y-1 pb-4">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{event.title}</h4>
                  {event.status && (
                    <Badge variant={getStatusColor(event.status)} className="text-xs">
                      {event.status}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{event.description}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(event.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {dispute.evidence_urls && dispute.evidence_urls.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-medium mb-2">Evidence Files</h4>
            <div className="space-y-1">
              {dispute.evidence_urls.map((url, index) => (
                <div key={index} className="text-sm text-blue-600 hover:underline">
                  Evidence file {index + 1}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}