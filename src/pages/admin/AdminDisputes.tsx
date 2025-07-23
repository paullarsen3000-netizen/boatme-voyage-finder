import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AlertCircle, CheckCircle, Clock, Eye, MessageSquare, FileText, Calendar } from 'lucide-react';
import { Dispute, Cancellation } from '@/types/cancellation';
import { DisputeTimeline } from '@/components/cancellation/DisputeTimeline';
import { toast } from 'sonner';

// Mock data for development
const mockDisputes: (Dispute & { cancellation: Cancellation; booking: any })[] = [
  {
    id: '1',
    cancellation_id: 'canc_1',
    booking_id: 'BK001',
    initiated_by: 'user_1',
    dispute_reason: 'Boat owner cancelled last minute without valid reason. Weather was perfect.',
    evidence_urls: ['evidence1.jpg', 'evidence2.pdf'],
    status: 'open',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z',
    cancellation: {
      id: 'canc_1',
      booking_id: 'BK001',
      cancelled_by: 'owner_1',
      cancelled_by_role: 'owner',
      cancellation_reason: 'owner-unavailable',
      reason_comments: 'Emergency came up',
      refund_eligible: true,
      status: 'disputed',
      created_at: '2024-01-20T09:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    },
    booking: {
      itemName: 'Luxury Yacht "Sea Dream"',
      guestName: 'Sarah Johnson',
      ownerName: 'Mike Thompson',
      startDate: '2024-01-25',
      totalAmount: 2500
    }
  },
  {
    id: '2',
    cancellation_id: 'canc_2',
    booking_id: 'BK002',
    initiated_by: 'owner_2',
    dispute_reason: 'Customer damaged the boat and is refusing to pay for repairs.',
    status: 'investigating',
    admin_notes: 'Requested photos of damage from owner. Waiting for response.',
    created_at: '2024-01-19T14:30:00Z',
    updated_at: '2024-01-19T16:00:00Z',
    cancellation: {
      id: 'canc_2',
      booking_id: 'BK002',
      cancelled_by: 'user_2',
      cancelled_by_role: 'renter',
      cancellation_reason: 'other',
      reason_comments: 'Found issues with the boat condition',
      refund_eligible: false,
      status: 'disputed',
      created_at: '2024-01-19T14:00:00Z',
      updated_at: '2024-01-19T16:00:00Z'
    },
    booking: {
      itemName: 'Sport Fishing Boat',
      guestName: 'John Davis',
      ownerName: 'Lisa Chen',
      startDate: '2024-01-18',
      totalAmount: 800
    }
  }
];

export default function AdminDisputes() {
  const [disputes, setDisputes] = useState(mockDisputes);
  const [selectedDispute, setSelectedDispute] = useState<typeof mockDisputes[0] | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [newStatus, setNewStatus] = useState<Dispute['status']>('open');

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

  const filterDisputes = (status?: string) => {
    if (!status || status === 'all') return disputes;
    return disputes.filter(dispute => dispute.status === status);
  };

  const handleUpdateStatus = async (disputeId: string, status: Dispute['status'], notes?: string) => {
    try {
      // In a real implementation, this would make an API call
      setDisputes(prev => prev.map(dispute => 
        dispute.id === disputeId 
          ? { 
              ...dispute, 
              status, 
              admin_notes: notes || dispute.admin_notes,
              updated_at: new Date().toISOString(),
              ...(status === 'resolved' && { resolved_at: new Date().toISOString() })
            }
          : dispute
      ));
      toast.success('Dispute status updated successfully');
    } catch (error) {
      toast.error('Failed to update dispute status');
    }
  };

  const handleResolveDispute = async () => {
    if (!selectedDispute || !resolutionNotes.trim()) {
      toast.error('Please provide resolution notes');
      return;
    }

    try {
      const updatedDispute = {
        ...selectedDispute,
        status: 'resolved' as const,
        resolution_notes: resolutionNotes,
        admin_notes: adminNotes || selectedDispute.admin_notes,
        resolved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setDisputes(prev => prev.map(dispute => 
        dispute.id === selectedDispute.id ? updatedDispute : dispute
      ));

      setSelectedDispute(null);
      setAdminNotes('');
      setResolutionNotes('');
      toast.success('Dispute resolved successfully');
    } catch (error) {
      toast.error('Failed to resolve dispute');
    }
  };

  const getTabCounts = () => {
    return {
      all: disputes.length,
      open: disputes.filter(d => d.status === 'open').length,
      investigating: disputes.filter(d => d.status === 'investigating').length,
      resolved: disputes.filter(d => d.status === 'resolved').length
    };
  };

  const tabCounts = getTabCounts();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dispute Resolution</h1>
          <p className="text-muted-foreground">
            Manage and resolve booking cancellation disputes
          </p>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            All Disputes <Badge variant="secondary">{tabCounts.all}</Badge>
          </TabsTrigger>
          <TabsTrigger value="open" className="flex items-center gap-2">
            Open <Badge variant="destructive">{tabCounts.open}</Badge>
          </TabsTrigger>
          <TabsTrigger value="investigating" className="flex items-center gap-2">
            Investigating <Badge variant="secondary">{tabCounts.investigating}</Badge>
          </TabsTrigger>
          <TabsTrigger value="resolved" className="flex items-center gap-2">
            Resolved <Badge variant="default">{tabCounts.resolved}</Badge>
          </TabsTrigger>
        </TabsList>

        {(['all', 'open', 'investigating', 'resolved'] as const).map(status => (
          <TabsContent key={status} value={status}>
            <Card>
              <CardHeader>
                <CardTitle>
                  {status === 'all' ? 'All Disputes' : `${status.charAt(0).toUpperCase() + status.slice(1)} Disputes`}
                </CardTitle>
                <CardDescription>
                  {filterDisputes(status).length} dispute(s) found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Dispute Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Parties</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterDisputes(status).map((dispute) => (
                      <TableRow key={dispute.id}>
                        <TableCell className="font-medium">{dispute.booking_id}</TableCell>
                        <TableCell className="max-w-xs">
                          <p className="truncate" title={dispute.dispute_reason}>
                            {dispute.dispute_reason}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(dispute.status)} className="flex items-center gap-1 w-fit">
                            {getStatusIcon(dispute.status)}
                            {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            {new Date(dispute.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Guest: {dispute.booking.guestName}</div>
                            <div>Owner: {dispute.booking.ownerName}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedDispute(dispute)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>
                                    Dispute Details - {dispute.booking_id}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Review dispute information and manage resolution
                                  </DialogDescription>
                                </DialogHeader>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Booking Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-2">
                                        <div><strong>Item:</strong> {dispute.booking.itemName}</div>
                                        <div><strong>Guest:</strong> {dispute.booking.guestName}</div>
                                        <div><strong>Owner:</strong> {dispute.booking.ownerName}</div>
                                        <div><strong>Start Date:</strong> {new Date(dispute.booking.startDate).toLocaleDateString()}</div>
                                        <div><strong>Amount:</strong> R{dispute.booking.totalAmount}</div>
                                      </CardContent>
                                    </Card>

                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Cancellation Details</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-2">
                                        <div><strong>Cancelled by:</strong> {dispute.cancellation.cancelled_by_role}</div>
                                        <div><strong>Reason:</strong> {dispute.cancellation.cancellation_reason}</div>
                                        {dispute.cancellation.reason_comments && (
                                          <div><strong>Comments:</strong> {dispute.cancellation.reason_comments}</div>
                                        )}
                                        <div><strong>Refund Eligible:</strong> {dispute.cancellation.refund_eligible ? 'Yes' : 'No'}</div>
                                      </CardContent>
                                    </Card>

                                    {dispute.evidence_urls && dispute.evidence_urls.length > 0 && (
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">Evidence</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="space-y-2">
                                            {dispute.evidence_urls.map((url, index) => (
                                              <div key={index} className="flex items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                <span className="text-sm">Evidence file {index + 1}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                  </div>

                                  <div className="space-y-4">
                                    <DisputeTimeline dispute={dispute} />

                                    {dispute.status !== 'resolved' && (
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">Admin Actions</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                          <div className="space-y-2">
                                            <Label>Update Status</Label>
                                            <Select 
                                              value={newStatus} 
                                              onValueChange={(value) => setNewStatus(value as Dispute['status'])}
                                            >
                                              <SelectTrigger>
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="open">Open</SelectItem>
                                                <SelectItem value="investigating">Investigating</SelectItem>
                                                <SelectItem value="resolved">Resolved</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>

                                          <div className="space-y-2">
                                            <Label>Admin Notes</Label>
                                            <Textarea
                                              placeholder="Add internal notes about this dispute..."
                                              value={adminNotes}
                                              onChange={(e) => setAdminNotes(e.target.value)}
                                              rows={3}
                                            />
                                          </div>

                                          {newStatus === 'resolved' && (
                                            <div className="space-y-2">
                                              <Label>Resolution Notes *</Label>
                                              <Textarea
                                                placeholder="Describe how this dispute was resolved..."
                                                value={resolutionNotes}
                                                onChange={(e) => setResolutionNotes(e.target.value)}
                                                rows={3}
                                              />
                                            </div>
                                          )}

                                          <div className="flex gap-2">
                                            {newStatus !== 'resolved' ? (
                                              <Button
                                                onClick={() => handleUpdateStatus(dispute.id, newStatus, adminNotes)}
                                                className="flex-1"
                                              >
                                                Update Status
                                              </Button>
                                            ) : (
                                              <Button
                                                onClick={handleResolveDispute}
                                                className="flex-1"
                                                disabled={!resolutionNotes.trim()}
                                              >
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                Resolve Dispute
                                              </Button>
                                            )}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filterDisputes(status).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="mx-auto h-12 w-12 mb-4" />
                    <p>No {status !== 'all' ? status : ''} disputes found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}