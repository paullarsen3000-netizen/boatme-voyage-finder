-- Create cancellations table
CREATE TABLE public.cancellations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id TEXT NOT NULL,
  cancelled_by UUID NOT NULL,
  cancelled_by_role TEXT NOT NULL CHECK (cancelled_by_role IN ('renter', 'owner')),
  cancellation_reason TEXT NOT NULL CHECK (cancellation_reason IN ('weather-related', 'mechanical-issues', 'customer-changed-plans', 'owner-unavailable', 'other')),
  reason_comments TEXT,
  refund_eligible BOOLEAN DEFAULT true,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'disputed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create disputes table
CREATE TABLE public.disputes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cancellation_id UUID NOT NULL REFERENCES public.cancellations(id),
  booking_id TEXT NOT NULL,
  initiated_by UUID NOT NULL,
  dispute_reason TEXT NOT NULL,
  evidence_urls TEXT[],
  admin_notes TEXT,
  resolution_notes TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved')),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cancellations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

-- Create policies for cancellations
CREATE POLICY "Users can view their own cancellations" 
ON public.cancellations 
FOR SELECT 
USING (auth.uid() = cancelled_by);

CREATE POLICY "Users can create cancellations" 
ON public.cancellations 
FOR INSERT 
WITH CHECK (auth.uid() = cancelled_by);

CREATE POLICY "Users can update their own cancellations" 
ON public.cancellations 
FOR UPDATE 
USING (auth.uid() = cancelled_by);

-- Create policies for disputes
CREATE POLICY "Users can view their own disputes" 
ON public.disputes 
FOR SELECT 
USING (auth.uid() = initiated_by);

CREATE POLICY "Users can create disputes" 
ON public.disputes 
FOR INSERT 
WITH CHECK (auth.uid() = initiated_by);

-- Admin policies (will need to create admin role check function)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- This is a placeholder - you'll need to implement proper admin role checking
  -- For now, returning false to be safe
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE POLICY "Admins can view all cancellations" 
ON public.cancellations 
FOR ALL 
USING (public.is_admin());

CREATE POLICY "Admins can view all disputes" 
ON public.disputes 
FOR ALL 
USING (public.is_admin());

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_cancellations_updated_at
BEFORE UPDATE ON public.cancellations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_disputes_updated_at
BEFORE UPDATE ON public.disputes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_cancellations_booking_id ON public.cancellations(booking_id);
CREATE INDEX idx_cancellations_cancelled_by ON public.cancellations(cancelled_by);
CREATE INDEX idx_cancellations_status ON public.cancellations(status);
CREATE INDEX idx_disputes_cancellation_id ON public.disputes(cancellation_id);
CREATE INDEX idx_disputes_booking_id ON public.disputes(booking_id);
CREATE INDEX idx_disputes_status ON public.disputes(status);