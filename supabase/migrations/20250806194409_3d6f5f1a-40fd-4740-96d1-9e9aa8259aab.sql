
-- Create owner_documents table to store document metadata
CREATE TABLE public.owner_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  document_type text NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  uploaded_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(owner_id, document_type)
);

-- Add RLS policies
ALTER TABLE public.owner_documents ENABLE ROW LEVEL SECURITY;

-- Users can view their own document records
CREATE POLICY "Users can view their own document records" 
  ON public.owner_documents 
  FOR SELECT 
  USING (owner_id = auth.uid());

-- Users can insert their own document records
CREATE POLICY "Users can insert their own document records" 
  ON public.owner_documents 
  FOR INSERT 
  WITH CHECK (owner_id = auth.uid());

-- Users can update their own document records
CREATE POLICY "Users can update their own document records" 
  ON public.owner_documents 
  FOR UPDATE 
  USING (owner_id = auth.uid());

-- Users can delete their own document records
CREATE POLICY "Users can delete their own document records" 
  ON public.owner_documents 
  FOR DELETE 
  USING (owner_id = auth.uid());

-- Admins can manage all document records
CREATE POLICY "Admins can manage all document records" 
  ON public.owner_documents 
  FOR ALL 
  USING (is_admin());

-- Add trigger for updated_at
CREATE TRIGGER update_owner_documents_updated_at
  BEFORE UPDATE ON public.owner_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
