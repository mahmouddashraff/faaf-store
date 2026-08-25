-- Create product-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true) 
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to product-images
CREATE POLICY "Public Read Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'product-images');

-- Allow admins to insert/update/delete in product-images
CREATE POLICY "Admin Insert Access" ON storage.objects 
FOR INSERT WITH CHECK (
    bucket_id = 'product-images' 
    AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admin Update Access" ON storage.objects 
FOR UPDATE USING (
    bucket_id = 'product-images' 
    AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admin Delete Access" ON storage.objects 
FOR DELETE USING (
    bucket_id = 'product-images' 
    AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
