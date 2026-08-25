-- Add is_archived to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT false;

-- Force schema cache reload
NOTIFY pgrst, 'reload schema';
