import React from 'react';
import { BankingDetailsForm } from '@/components/payout/BankingDetailsForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OwnerPayoutSettings() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/owner/payouts">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Payouts
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payout Settings</h1>
          <p className="text-muted-foreground">
            Manage your banking details for payout processing
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <BankingDetailsForm />
      </div>
    </div>
  );
}