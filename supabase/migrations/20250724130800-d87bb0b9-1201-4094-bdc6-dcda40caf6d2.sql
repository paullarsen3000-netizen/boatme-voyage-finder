-- Add role field to profiles table
ALTER TABLE public.profiles ADD COLUMN role user_role NOT NULL DEFAULT 'renter';