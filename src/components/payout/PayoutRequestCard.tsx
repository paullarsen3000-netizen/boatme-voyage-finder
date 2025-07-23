import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { PayoutSummary } from '@/types/payout';
import { Banknote, AlertCircle } from 'lucide-react';

interface PayoutRequestCardProps {
  summary: PayoutSummary;
  hasActivePayout: boolean;
  hasVerifiedBanking: boolean;
  onRequestPayout: () => void;
}

export function PayoutRequestCard({ 
  summary, 
  hasActivePayout, 
  hasVerifiedBanking,
  onRequestPayout 
}: PayoutRequestCardProps) {
  const { toast } = useToast();
  const [isRequesting, setIsRequesting] = useState(false);

  const canRequestPayout = hasVerifiedBanking && 
    summary.availableBalance >= summary.minimumThreshold && 
    !hasActivePayout;

  const handleRequestPayout = async () => {
    if (!canRequestPayout) return;
    
    setIsRequesting(true);
    try {
      onRequestPayout();
      toast({
        title: "Payout requested",
        description: `Requested R${summary.availableBalance.toFixed(2)} for withdrawal.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request payout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRequesting(false);
    }
  };

  const getStatusMessage = () => {
    if (!hasVerifiedBanking) {
      return "Banking details must be verified before requesting payouts";
    }
    if (hasActivePayout) {
      return "You have a pending payout request";
    }
    if (summary.availableBalance < summary.minimumThreshold) {
      return `Minimum payout amount is R${summary.minimumThreshold.toFixed(2)}`;
    }
    return "Ready to request payout";
  };

  const getStatusVariant = () => {
    if (!hasVerifiedBanking || hasActivePayout || summary.availableBalance < summary.minimumThreshold) {
      return "secondary";
    }
    return "default";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Banknote className="h-5 w-5" />
          Request Payout
        </CardTitle>
        <CardDescription>
          Withdraw your available earnings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Available Balance</p>
            <p className="text-2xl font-bold text-green-600">
              R{summary.availableBalance.toFixed(2)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Pending Payouts</p>
            <p className="text-2xl font-bold text-orange-600">
              R{summary.pendingPayouts.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Badge variant={getStatusVariant()}>
            {getStatusMessage()}
          </Badge>
        </div>

        {!canRequestPayout && !hasVerifiedBanking && (
          <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-orange-800">
              Complete and verify your banking details in settings to enable payouts.
            </div>
          </div>
        )}

        <div className="pt-2">
          <Button 
            onClick={handleRequestPayout}
            disabled={!canRequestPayout || isRequesting}
            className="w-full"
          >
            {isRequesting ? 'Requesting...' : `Request Payout (R${summary.availableBalance.toFixed(2)})`}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Minimum payout: R{summary.minimumThreshold.toFixed(2)}</p>
          <p>• Processing time: 3-5 business days</p>
          <p>• Only completed booking earnings are eligible</p>
        </div>
      </CardContent>
    </Card>
  );
}