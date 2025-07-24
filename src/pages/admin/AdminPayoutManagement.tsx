import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { usePayouts } from '@/hooks/usePayouts';
import { CheckCircle, XCircle, Clock, Eye, DollarSign } from 'lucide-react';

export default function AdminPayoutManagement() {
  const { toast } = useToast();
  const { payouts, loading } = usePayouts();
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [actionNotes, setActionNotes] = useState('');

  const handlePayoutAction = async (payoutId: string, action: 'approve' | 'reject' | 'mark_paid') => {
    try {
      // In real implementation, this would call a Supabase function
      toast({
        title: `Payout ${action}d`,
        description: `Payout request has been ${action}d successfully.`,
      });
      setSelectedPayout(null);
      setActionNotes('');
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} payout request.`,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'paid':
        return <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />Paid</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Payout Management</h1>
        <p className="text-muted-foreground">Review and process payout requests</p>
      </div>

      <div className="grid gap-6">
        {payouts.map((payout) => (
          <Card key={payout.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">R{Number(payout.amount).toFixed(2)}</CardTitle>
                  <CardDescription>
                    Requested on {new Date(payout.requested_at).toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(payout.status)}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Payout Request Details</DialogTitle>
                        <DialogDescription>
                          Review and take action on this payout request
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Amount</Label>
                            <p className="font-semibold">R{Number(payout.amount).toFixed(2)}</p>
                          </div>
                          <div>
                            <Label>Status</Label>
                            <div className="mt-1">{getStatusBadge(payout.status)}</div>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="notes">Admin Notes</Label>
                          <Textarea
                            id="notes"
                            value={actionNotes}
                            onChange={(e) => setActionNotes(e.target.value)}
                            placeholder="Add notes for this action..."
                          />
                        </div>

                        {payout.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => handlePayoutAction(payout.id, 'approve')}
                              className="flex-1"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              variant="destructive"
                              onClick={() => handlePayoutAction(payout.id, 'reject')}
                              className="flex-1"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}

                        {payout.status === 'pending' && (
                          <Button 
                            onClick={() => handlePayoutAction(payout.id, 'mark_paid')}
                            className="w-full"
                          >
                            <DollarSign className="h-4 w-4 mr-1" />
                            Mark as Paid
                          </Button>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}