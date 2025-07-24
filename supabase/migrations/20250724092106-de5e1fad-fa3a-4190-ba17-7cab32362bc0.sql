-- Add owner reply and moderation fields to reviews table
ALTER TABLE public.reviews 
ADD COLUMN status text DEFAULT 'published' CHECK (status IN ('pending', 'published', 'hidden')),
ADD COLUMN owner_reply text,
ADD COLUMN owner_reply_at timestamp with time zone,
ADD COLUMN moderated_by uuid,
ADD COLUMN moderated_at timestamp with time zone;

-- Add unique constraint to ensure one review per booking
ALTER TABLE public.reviews 
ADD CONSTRAINT unique_review_per_booking UNIQUE (booking_id, author_id);

-- Add index for better performance
CREATE INDEX idx_reviews_recipient_status ON public.reviews(recipient_id, status);
CREATE INDEX idx_reviews_booking_author ON public.reviews(booking_id, author_id);