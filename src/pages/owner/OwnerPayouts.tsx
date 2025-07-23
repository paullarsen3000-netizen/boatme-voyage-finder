import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PayoutRequestCard } from '@/components/payout/PayoutRequestCard';
import { PayoutHistoryTable } from '@/components/payout/PayoutHistoryTable';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { PayoutRequest, PayoutSummary } from '@/types/payout';
import { getPayoutSummary, getUserPayouts, getUserBankingDetails } from '@/lib/payoutData';
import { DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OwnerPayouts() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<PayoutSummary | null>(null);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [bankingDetails, setBankingDetails] = useState(null);

  useEffect(() => {
    if (user) {
      fetchPayoutData();
    }
  }, [user]);

  const fetchPayoutData = async () => {
    try {
      if (!user) return;
      
      const summaryData = getPayoutSummary(user.id);
      const payoutData = getUserPayouts(user.id);
      const bankingData = getUserBankingDetails(user.id);
      
      setSummary(summaryData);
      setPayouts(payoutData);
      setBankingDetails(bankingData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load payout data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = () => {
    // In a real implementation, this would create a payout request
    toast({
      title: "Payout requested",
      description: "Your payout request has been submitted for processing.",
    });
    fetchPayoutData(); // Refresh data
  };

  const hasActivePayout = payouts.some(p => p.status === 'pending' || p.status === 'approved');
  const hasVerifiedBanking = bankingDetails?.verificationStatus === 'approved';

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Unable to load payout data</p>
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
        <Link to="/owner/settings">
          <Button variant="outline">
            Banking Settings
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{summary.totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              All-time earnings from bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawn</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{summary.totalWithdrawn.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Successfully paid out
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{summary.pendingPayouts.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              In processing queue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">R{summary.availableBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Ready for withdrawal
            </p>
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
                <Link to="/owner/settings" className="block">
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
            payouts={payouts}
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