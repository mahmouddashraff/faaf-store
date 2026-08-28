-- 1. Programs: Convert price from TEXT to NUMERIC safely
ALTER TABLE public.programs ADD COLUMN new_price NUMERIC NOT NULL DEFAULT 0;

UPDATE public.programs 
SET new_price = COALESCE(NULLIF(regexp_replace(price, '[^0-9.]', '', 'g'), ''), '0')::NUMERIC;

ALTER TABLE public.programs DROP COLUMN price;
ALTER TABLE public.programs RENAME COLUMN new_price TO price;

-- 2. Manual Therapy: Add price
ALTER TABLE public.manual_therapy ADD COLUMN IF NOT EXISTS price NUMERIC NOT NULL DEFAULT 0;

-- 3. Lifestyle Pillars: Add price
ALTER TABLE public.lifestyle_pillars ADD COLUMN IF NOT EXISTS price NUMERIC NOT NULL DEFAULT 0;

-- 4. Lifestyle Tips: Add price
ALTER TABLE public.lifestyle_tips ADD COLUMN IF NOT EXISTS price NUMERIC NOT NULL DEFAULT 0;

-- 5. Reload Schema Cache
NOTIFY pgrst, 'reload schema';
