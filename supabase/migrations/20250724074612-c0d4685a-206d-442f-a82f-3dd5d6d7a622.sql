-- BoatMe.co.za Complete Database Schema
-- Creating enums first
CREATE TYPE public.user_role AS ENUM ('renter', 'owner', 'provider', 'admin');
CREATE TYPE public.boat_type AS ENUM ('sailing', 'motorboat', 'jetski', 'pontoon', 'other');
CREATE TYPE public.listing_status AS ENUM ('pending', 'active', 'suspended');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE public.payout_status AS ENUM ('pending', 'paid', 'failed');
CREATE TYPE public.document_type AS ENUM ('license', 'insurance', 'registration', 'safety_certificate', 'identity');

-- 1. Users table (profiles)
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'renter',
  phone TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Boats table
CREATE TABLE public.boats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  latitude FLOAT,
  longitude FLOAT,
  type boat_type NOT NULL,
  price_per_day NUMERIC(10,2) NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  status listing_status NOT NULL DEFAULT 'pending',
  documents_uploaded BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  renter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  boat_id UUID NOT NULL REFERENCES public.boats(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  total_price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- 4. Courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  available_dates JSONB DEFAULT '[]'::jsonb,
  status listing_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Payouts table
CREATE TABLE public.payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  status payout_status NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  paid_at TIMESTAMP WITH TIME ZONE
);

-- 6. Reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_review_per_booking UNIQUE(booking_id, author_id)
);

-- 7. Messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 8. Documents table
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type document_type NOT NULL,
  url TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 9. Blog posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category TEXT,
  seo_meta JSONB DEFAULT '{}'::jsonb,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 10. Email logs table
CREATE TABLE public.email_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  template_type TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  email_address TEXT NOT NULL,
  status TEXT DEFAULT 'sent'
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role FROM public.users 
    WHERE user_id = auth.uid() AND role = 'admin'
  ) IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Helper function to get current user's profile id
CREATE OR REPLACE FUNCTION public.get_current_user_profile_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT id FROM public.users 
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all users" ON public.users
  FOR ALL USING (is_admin());

-- RLS Policies for boats table
CREATE POLICY "Anyone can view active boats" ON public.boats
  FOR SELECT USING (status = 'active');

CREATE POLICY "Owners can view their own boats" ON public.boats
  FOR SELECT USING (owner_id = get_current_user_profile_id());

CREATE POLICY "Owners can manage their own boats" ON public.boats
  FOR ALL USING (owner_id = get_current_user_profile_id());

CREATE POLICY "Admins can manage all boats" ON public.boats
  FOR ALL USING (is_admin());

-- RLS Policies for bookings table
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (
    renter_id = get_current_user_profile_id() OR 
    boat_id IN (SELECT id FROM public.boats WHERE owner_id = get_current_user_profile_id())
  );

CREATE POLICY "Renters can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (renter_id = get_current_user_profile_id());

CREATE POLICY "Booking parties can update bookings" ON public.bookings
  FOR UPDATE USING (
    renter_id = get_current_user_profile_id() OR 
    boat_id IN (SELECT id FROM public.boats WHERE owner_id = get_current_user_profile_id())
  );

CREATE POLICY "Admins can manage all bookings" ON public.bookings
  FOR ALL USING (is_admin());

-- RLS Policies for courses table
CREATE POLICY "Anyone can view active courses" ON public.courses
  FOR SELECT USING (status = 'active');

CREATE POLICY "Providers can view their own courses" ON public.courses
  FOR SELECT USING (provider_id = get_current_user_profile_id());

CREATE POLICY "Providers can manage their own courses" ON public.courses
  FOR ALL USING (provider_id = get_current_user_profile_id());

CREATE POLICY "Admins can manage all courses" ON public.courses
  FOR ALL USING (is_admin());

-- RLS Policies for payouts table
CREATE POLICY "Owners can view their own payouts" ON public.payouts
  FOR SELECT USING (owner_id = get_current_user_profile_id());

CREATE POLICY "Owners can request payouts" ON public.payouts
  FOR INSERT WITH CHECK (owner_id = get_current_user_profile_id());

CREATE POLICY "Admins can manage all payouts" ON public.payouts
  FOR ALL USING (is_admin());

-- RLS Policies for reviews table
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Booking participants can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (
    author_id = get_current_user_profile_id() AND
    booking_id IN (
      SELECT id FROM public.bookings 
      WHERE renter_id = get_current_user_profile_id() 
      OR boat_id IN (SELECT id FROM public.boats WHERE owner_id = get_current_user_profile_id())
    )
  );

CREATE POLICY "Authors can update their own reviews" ON public.reviews
  FOR UPDATE USING (author_id = get_current_user_profile_id());

CREATE POLICY "Admins can manage all reviews" ON public.reviews
  FOR ALL USING (is_admin());

-- RLS Policies for messages table
CREATE POLICY "Users can view their own messages" ON public.messages
  FOR SELECT USING (
    sender_id = get_current_user_profile_id() OR 
    receiver_id = get_current_user_profile_id()
  );

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (sender_id = get_current_user_profile_id());

CREATE POLICY "Admins can view all messages" ON public.messages
  FOR ALL USING (is_admin());

-- RLS Policies for documents table
CREATE POLICY "Users can view their own documents" ON public.documents
  FOR SELECT USING (user_id = get_current_user_profile_id());

CREATE POLICY "Users can upload their own documents" ON public.documents
  FOR INSERT WITH CHECK (user_id = get_current_user_profile_id());

CREATE POLICY "Users can update their own documents" ON public.documents
  FOR UPDATE USING (user_id = get_current_user_profile_id());

CREATE POLICY "Admins can manage all documents" ON public.documents
  FOR ALL USING (is_admin());

-- RLS Policies for blog_posts table
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts
  FOR SELECT USING (published = true);

CREATE POLICY "Authors can view their own blog posts" ON public.blog_posts
  FOR SELECT USING (author_id = get_current_user_profile_id());

CREATE POLICY "Authors can manage their own blog posts" ON public.blog_posts
  FOR ALL USING (author_id = get_current_user_profile_id());

CREATE POLICY "Admins can manage all blog posts" ON public.blog_posts
  FOR ALL USING (is_admin());

-- RLS Policies for email_logs table
CREATE POLICY "Users can view their own email logs" ON public.email_logs
  FOR SELECT USING (user_id = get_current_user_profile_id());

CREATE POLICY "Admins can view all email logs" ON public.email_logs
  FOR ALL USING (is_admin());

CREATE POLICY "System can insert email logs" ON public.email_logs
  FOR INSERT WITH CHECK (true);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('boat-images', 'boat-images', true),
  ('profile-images', 'profile-images', true),
  ('documents', 'documents', false);

-- Storage policies for boat images
CREATE POLICY "Anyone can view boat images" ON storage.objects
  FOR SELECT USING (bucket_id = 'boat-images');

CREATE POLICY "Authenticated users can upload boat images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'boat-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own boat images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'boat-images' AND auth.uid() IS NOT NULL);

-- Storage policies for profile images
CREATE POLICY "Anyone can view profile images" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-images');

CREATE POLICY "Users can upload their own profile images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'profile-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own profile images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'profile-images' AND auth.uid() IS NOT NULL);

-- Storage policies for documents
CREATE POLICY "Users can view their own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can upload their own documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents' AND is_admin());

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_boats_updated_at
  BEFORE UPDATE ON public.boats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_users_user_id ON public.users(user_id);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_boats_owner_id ON public.boats(owner_id);
CREATE INDEX idx_boats_status ON public.boats(status);
CREATE INDEX idx_boats_location ON public.boats(location);
CREATE INDEX idx_bookings_renter_id ON public.bookings(renter_id);
CREATE INDEX idx_bookings_boat_id ON public.bookings(boat_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_dates ON public.bookings(start_date, end_date);
CREATE INDEX idx_courses_provider_id ON public.courses(provider_id);
CREATE INDEX idx_courses_status ON public.courses(status);
CREATE INDEX idx_payouts_owner_id ON public.payouts(owner_id);
CREATE INDEX idx_payouts_status ON public.payouts(status);
CREATE INDEX idx_reviews_booking_id ON public.reviews(booking_id);
CREATE INDEX idx_reviews_recipient_id ON public.reviews(recipient_id);
CREATE INDEX idx_messages_participants ON public.messages(sender_id, receiver_id);
CREATE INDEX idx_documents_user_id ON public.documents(user_id);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (user_id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'renter')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();