import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PayoutRequest } from '@/types/payout';
import { getAllPayouts } from '@/lib/payoutData';
import { Search, Filter, Download, Eye, Check, X, Clock, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminPayouts() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [filteredPayouts, setFilteredPayouts] = useState<PayoutRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPayout, setSelectedPayout] = useState<PayoutRequest | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'mark-paid'>('approve');
  const [actionNote, setActionNote] = useState('');

  useEffect(() => {
    fetchPayouts();
  }, []);

  useEffect(() => {
    let filtered = payouts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        payout =>
          payout.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payout.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payout.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payout => payout.status === statusFilter);
    }

    setFilteredPayouts(filtered);
  }, [payouts, searchTerm, statusFilter]);

  const fetchPayouts = async () => {
    try {
      const data = getAllPayouts();
      setPayouts(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load payout requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedPayout) return;

    try {
      // In a real implementation, this would update the payout status
      console.log(`${actionType} payout:`, selectedPayout.id, actionNote);
      
      toast({
        title: "Action completed",
        description: `Payout has been ${actionType === 'mark-paid' ? 'marked as paid' : actionType + 'd'}.`,
      });
      
      setActionDialogOpen(false);
      setSelectedPayout(null);
      setActionNote('');
      fetchPayouts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payout status",
        variant: "destructive",
      });
    }
  };

  const openActionDialog = (payout: PayoutRequest, action: 'approve' | 'reject' | 'mark-paid') => {
    setSelectedPayout(payout);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const getStatusBadge = (status: PayoutRequest['status']) => {
    const variants = {
      pending: 'secondary',
      approved: 'default',
      paid: 'outline',
      rejected: 'destructive',
    } as const;

    const labels = {
      pending: 'Pending',
      approved: 'Approved',
      paid: 'Paid',
      rejected: 'Rejected',
    };

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const getActionButtons = (payout: PayoutRequest) => {
    switch (payout.status) {
      case 'pending':
        return (
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => openActionDialog(payout, 'approve')}
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => openActionDialog(payout, 'reject')}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        );
      case 'approved':
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => openActionDialog(payout, 'mark-paid')}
          >
            Mark Paid
          </Button>
        );
      default:
        return null;
    }
  };

  const summaryStats = {
    pending: payouts.filter(p => p.status === 'pending').length,
    approved: payouts.filter(p => p.status === 'approved').length,
    totalPendingAmount: payouts
      .filter(p => p.status === 'pending' || p.status === 'approved')
      .reduce((sum, p) => sum + p.amount, 0),
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payout Management</h1>
          <p className="text-muted-foreground">
            Review and process withdrawal requests
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Requests</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.approved}</div>
            <p className="text-xs text-muted-foreground">
              Ready for payment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{summaryStats.totalPendingAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Pending + approved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user or payout ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payouts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Requests</CardTitle>
          <CardDescription>
            Review and manage all payout requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Processed Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayouts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-muted-foreground">
                        <p>No payout requests found</p>
                        <p className="text-sm">Try adjusting your filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payout.userName}</p>
                          <p className="text-sm text-muted-foreground">{payout.userEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        R{payout.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(payout.status)}
                      </TableCell>
                      <TableCell>
                        {format(new Date(payout.requestDate), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        {payout.processedDate ? (
                          format(new Date(payout.processedDate), 'MMM dd, yyyy')
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Payout Details",
                                description: `Viewing details for payout #${payout.id}`,
                              });
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {getActionButtons(payout)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' && 'Approve Payout'}
              {actionType === 'reject' && 'Reject Payout'}
              {actionType === 'mark-paid' && 'Mark as Paid'}
            </DialogTitle>
            <DialogDescription>
              {selectedPayout && (
                <>
                  {actionType === 'approve' && `Approve payout request for R${selectedPayout.amount.toFixed(2)} to ${selectedPayout.userName}?`}
                  {actionType === 'reject' && `Reject payout request for R${selectedPayout.amount.toFixed(2)} from ${selectedPayout.userName}?`}
                  {actionType === 'mark-paid' && `Mark payout of R${selectedPayout.amount.toFixed(2)} to ${selectedPayout.userName} as paid?`}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {actionType === 'reject' ? 'Rejection Reason' : 'Notes (Optional)'}
              </label>
              <Textarea
                placeholder={actionType === 'reject' ? 'Please provide a reason for rejection...' : 'Add any notes...'}
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                required={actionType === 'reject'}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAction}>
              {actionType === 'approve' && 'Approve'}
              {actionType === 'reject' && 'Reject'}
              {actionType === 'mark-paid' && 'Mark as Paid'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}