import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PayoutRequest } from '@/types/payout';
import { Download, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface PayoutHistoryTableProps {
  payouts: PayoutRequest[];
  showUserColumn?: boolean;
  onViewDetails?: (payout: PayoutRequest) => void;
  onDownloadRemittance?: (payout: PayoutRequest) => void;
}

export function PayoutHistoryTable({ 
  payouts, 
  showUserColumn = false,
  onViewDetails,
  onDownloadRemittance 
}: PayoutHistoryTableProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payout History</CardTitle>
        <CardDescription>
          Track your withdrawal requests and payments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                {showUserColumn && <TableHead>User</TableHead>}
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Processed Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={showUserColumn ? 6 : 5} className="text-center py-8">
                    <div className="text-muted-foreground">
                      <p>No payout requests found</p>
                      <p className="text-sm">Your payout history will appear here</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                payouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell>
                      {format(new Date(payout.requestDate), 'MMM dd, yyyy')}
                    </TableCell>
                    {showUserColumn && (
                      <TableCell>
                        <div>
                          <p className="font-medium">{payout.userName}</p>
                          <p className="text-sm text-muted-foreground">{payout.userEmail}</p>
                        </div>
                      </TableCell>
                    )}
                    <TableCell className="font-medium">
                      R{payout.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(payout.status)}
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
                        {onViewDetails && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewDetails(payout)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {payout.status === 'paid' && onDownloadRemittance && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDownloadRemittance(payout)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
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
  );
}