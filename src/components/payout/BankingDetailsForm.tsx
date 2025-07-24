import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { usePayouts } from '@/hooks/usePayouts';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

interface BankingDetailsFormData {
  full_name: string;
  business_name?: string;
  bank_name: string;
  account_type: 'cheque' | 'savings' | 'business';
  account_number: string;
  branch_code: string;
  swift_code?: string;
  vat_number?: string;
}

export function BankingDetailsForm() {
  const { toast } = useToast();
  const { bankingDetails, saveBankingDetails, loading } = usePayouts();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<BankingDetailsFormData>({
    defaultValues: {
      full_name: bankingDetails?.full_name || '',
      business_name: bankingDetails?.business_name || '',
      bank_name: bankingDetails?.bank_name || '',
      account_type: (bankingDetails?.account_type as 'cheque' | 'savings' | 'business') || 'cheque',
      account_number: bankingDetails?.account_number || '',
      branch_code: bankingDetails?.branch_code || '',
      swift_code: bankingDetails?.swift_code || '',
      vat_number: bankingDetails?.vat_number || '',
    }
  });

  const onSubmit = async (data: BankingDetailsFormData) => {
    try {
      const result = await saveBankingDetails({
        full_name: data.full_name,
        business_name: data.business_name || '',
        bank_name: data.bank_name,
        account_type: data.account_type,
        account_number: data.account_number,
        branch_code: data.branch_code,
        swift_code: data.swift_code || '',
        vat_number: data.vat_number || '',
        verification_status: 'pending',
        verification_notes: null,
      });
      
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Banking details saved",
          description: "Your banking details have been submitted for verification.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save banking details. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getVerificationBadge = () => {
    if (!bankingDetails) return null;

    switch (bankingDetails.verification_status) {
      case 'approved':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
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
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                {...register('full_name', { required: 'Full name is required' })}
                disabled={bankingDetails?.verification_status === 'approved'}
              />
              {errors.full_name && (
                <p className="text-sm text-red-600">{errors.full_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_name">Business Name (Optional)</Label>
              <Input
                id="business_name"
                {...register('business_name')}
                disabled={bankingDetails?.verification_status === 'approved'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bank_name">Bank Name *</Label>
              <Input
                id="bank_name"
                {...register('bank_name', { required: 'Bank name is required' })}
                disabled={bankingDetails?.verification_status === 'approved'}
              />
              {errors.bank_name && (
                <p className="text-sm text-red-600">{errors.bank_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="account_type">Account Type *</Label>
              <Select
                onValueChange={(value) => setValue('account_type', value as 'cheque' | 'savings' | 'business')}
                disabled={bankingDetails?.verification_status === 'approved'}
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
              <Label htmlFor="account_number">Account Number *</Label>
              <Input
                id="account_number"
                {...register('account_number', { required: 'Account number is required' })}
                disabled={bankingDetails?.verification_status === 'approved'}
              />
              {errors.account_number && (
                <p className="text-sm text-red-600">{errors.account_number.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch_code">Branch Code *</Label>
              <Input
                id="branch_code"
                {...register('branch_code', { required: 'Branch code is required' })}
                disabled={bankingDetails?.verification_status === 'approved'}
              />
              {errors.branch_code && (
                <p className="text-sm text-red-600">{errors.branch_code.message}</p>
              )}
            </div>
          </div>

          {bankingDetails?.verification_status !== 'approved' && (
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Saving...' : 'Save Banking Details'}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}