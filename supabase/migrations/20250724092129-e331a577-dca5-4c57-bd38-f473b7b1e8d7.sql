-- Add owner reply and moderation fields to reviews table (only if they don't exist)
DO $$ 
BEGIN
    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='status') THEN
        ALTER TABLE public.reviews ADD COLUMN status text DEFAULT 'published' CHECK (status IN ('pending', 'published', 'hidden'));
    END IF;
    
    -- Add owner_reply column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='owner_reply') THEN
        ALTER TABLE public.reviews ADD COLUMN owner_reply text;
    END IF;
    
    -- Add owner_reply_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='owner_reply_at') THEN
        ALTER TABLE public.reviews ADD COLUMN owner_reply_at timestamp with time zone;
    END IF;
    
    -- Add moderated_by column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='moderated_by') THEN
        ALTER TABLE public.reviews ADD COLUMN moderated_by uuid;
    END IF;
    
    -- Add moderated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='moderated_at') THEN
        ALTER TABLE public.reviews ADD COLUMN moderated_at timestamp with time zone;
    END IF;
END $$;