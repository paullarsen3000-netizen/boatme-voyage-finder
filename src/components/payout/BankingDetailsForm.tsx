import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BankingDetails } from '@/types/payout';
import { getUserBankingDetails } from '@/lib/payoutData';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface BankingDetailsFormData {
  fullName: string;
  businessName?: string;
  bankName: string;
  accountType: 'cheque' | 'savings' | 'business';
  accountNumber: string;
  branchCode: string;
  swiftCode?: string;
  vatNumber?: string;
}

export function BankingDetailsForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get existing banking details
  const existingDetails = user ? getUserBankingDetails(user.id) : undefined;
  const isVerified = existingDetails?.verificationStatus === 'approved';
  const isRejected = existingDetails?.verificationStatus === 'rejected';
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<BankingDetailsFormData>({
    defaultValues: existingDetails ? {
      fullName: existingDetails.fullName,
      businessName: existingDetails.businessName || '',
      bankName: existingDetails.bankName,
      accountType: existingDetails.accountType,
      accountNumber: existingDetails.accountNumber,
      branchCode: existingDetails.branchCode,
      swiftCode: existingDetails.swiftCode || '',
      vatNumber: existingDetails.vatNumber || '',
    } : undefined
  });

  const onSubmit = async (data: BankingDetailsFormData) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would save to Supabase
      console.log('Saving banking details:', data);
      
      toast({
        title: "Banking details saved",
        description: "Your banking information has been updated and is pending verification.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save banking details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getVerificationBadge = () => {
    if (!existingDetails) return null;
    
    switch (existingDetails.verificationStatus) {
      case 'approved':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            Verified
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            <XCircle className="w-4 h-4 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Clock className="w-4 h-4 mr-1" />
            Pending Verification
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Banking Details</CardTitle>
            <CardDescription>
              Manage your banking information for payout processing
            </CardDescription>
          </div>
          {getVerificationBadge()}
        </div>
        {isRejected && existingDetails?.verificationNotes && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              <strong>Rejection Reason:</strong> {existingDetails.verificationNotes}
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                {...register('fullName', { required: 'Full name is required' })}
                disabled={isVerified}
              />
              {errors.fullName && (
                <p className="text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                {...register('businessName')}
                disabled={isVerified}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name *</Label>
              <Input
                id="bankName"
                {...register('bankName', { required: 'Bank name is required' })}
                disabled={isVerified}
              />
              {errors.bankName && (
                <p className="text-sm text-red-600">{errors.bankName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountType">Account Type *</Label>
              <Select
                onValueChange={(value) => setValue('accountType', value as any)}
                defaultValue={existingDetails?.accountType}
                disabled={isVerified}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cheque">Cheque Account</SelectItem>
                  <SelectItem value="savings">Savings Account</SelectItem>
                  <SelectItem value="business">Business Account</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number *</Label>
              <Input
                id="accountNumber"
                {...register('accountNumber', { required: 'Account number is required' })}
                disabled={isVerified}
              />
              {errors.accountNumber && (
                <p className="text-sm text-red-600">{errors.accountNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="branchCode">Branch Code *</Label>
              <Input
                id="branchCode"
                {...register('branchCode', { required: 'Branch code is required' })}
                disabled={isVerified}
              />
              {errors.branchCode && (
                <p className="text-sm text-red-600">{errors.branchCode.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="swiftCode">SWIFT Code</Label>
              <Input
                id="swiftCode"
                {...register('swiftCode')}
                disabled={isVerified}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vatNumber">VAT Number</Label>
              <Input
                id="vatNumber"
                {...register('vatNumber')}
                disabled={isVerified}
              />
            </div>
          </div>

          {!isVerified && (
            <div className="flex justify-end space-x-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Banking Details'}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}