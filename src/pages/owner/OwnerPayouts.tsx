import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PayoutRequestCard } from '@/components/payout/PayoutRequestCard';
import { PayoutHistoryTable } from '@/components/payout/PayoutHistoryTable';
import { usePayouts } from '@/hooks/usePayouts';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OwnerPayouts() {
  const { toast } = useToast();
  const { 
    payouts, 
    summary, 
    bankingDetails, 
    loading, 
    error, 
    requestPayout 
  } = usePayouts();

  const handleRequestPayout = async (amount: number) => {
    try {
      const result = await requestPayout(amount);
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payout requested",
          description: `Your payout request for R${amount.toFixed(2)} has been submitted successfully.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request payout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const hasActivePayout = payouts.some(p => p.status === 'pending');
  const hasVerifiedBanking = bankingDetails?.verification_status === 'approved';

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-8 w-8" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load payout data: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Unable to load payout data</h1>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payouts</h1>
          <p className="text-muted-foreground">
            Manage your earnings and withdrawal requests
          </p>
        </div>
        <Link to="/owner/payout-settings">
          <Button variant="outline">
            Banking Settings
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Earnings</p>
              <p className="text-2xl font-bold text-green-600">
                R{summary.totalEarnings.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              Total Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Paid</p>
              <p className="text-2xl font-bold text-blue-600">
                R{summary.totalPaid.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              Pending Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Pending Amount</p>
              <p className="text-2xl font-bold text-orange-600">
                R{summary.pendingAmount.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold text-green-600">
                R{summary.availableBalance.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Payout History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PayoutRequestCard
              summary={summary}
              hasActivePayout={hasActivePayout}
              hasVerifiedBanking={hasVerifiedBanking}
              onRequestPayout={handleRequestPayout}
            />

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Manage your payout settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link to="/owner/payout-settings" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    Update Banking Details
                  </Button>
                </Link>
                <Link to="/owner/earnings" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    View Earnings Report
                  </Button>
                </Link>
                <Link to="/owner/bookings" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    Review Completed Bookings
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <PayoutHistoryTable 
            payouts={payouts.map(p => ({
              id: p.id,
              userId: p.owner_id,
              userName: 'Current User',
              userEmail: 'user@example.com',
              amount: Number(p.amount),
              currency: 'ZAR',
              status: p.status === 'failed' ? 'rejected' : (p.status as 'pending' | 'paid' | 'approved'),
              requestDate: p.requested_at,
              processedDate: p.paid_at || undefined,
              processedBy: undefined,
              rejectionReason: undefined,
              linkedBookings: [p.booking_id],
              createdAt: p.requested_at,
              updatedAt: p.requested_at
            }))}
            onViewDetails={(payout) => {
              toast({
                title: "Payout Details",
                description: `Payout request #${payout.id} for R${payout.amount.toFixed(2)}`,
              });
            }}
            onDownloadRemittance={(payout) => {
              toast({
                title: "Download Started",
                description: "Remittance advice will be downloaded shortly.",
              });
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}