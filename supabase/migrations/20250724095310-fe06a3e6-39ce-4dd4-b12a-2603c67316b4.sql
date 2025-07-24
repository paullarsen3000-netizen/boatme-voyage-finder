-- Create banking_details table for storing user banking information
CREATE TABLE public.banking_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  business_name TEXT,
  bank_name TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('cheque', 'savings', 'business')),
  account_number TEXT NOT NULL,
  branch_code TEXT NOT NULL,
  swift_code TEXT,
  vat_number TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  verification_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Ensure one banking detail record per user
  CONSTRAINT unique_banking_per_user UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE public.banking_details ENABLE ROW LEVEL SECURITY;

-- Create policies for banking_details
CREATE POLICY "Users can view their own banking details" 
ON public.banking_details 
FOR SELECT 
USING (user_id = get_current_user_profile_id());

CREATE POLICY "Users can manage their own banking details" 
ON public.banking_details 
FOR ALL 
USING (user_id = get_current_user_profile_id());

CREATE POLICY "Admins can manage all banking details" 
ON public.banking_details 
FOR ALL 
USING (is_admin());

-- Create trigger for updated_at
CREATE TRIGGER update_banking_details_updated_at
  BEFORE UPDATE ON public.banking_details
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for performance
CREATE INDEX idx_banking_details_user_id ON public.banking_details(user_id);
CREATE INDEX idx_banking_details_verification_status ON public.banking_details(verification_status);