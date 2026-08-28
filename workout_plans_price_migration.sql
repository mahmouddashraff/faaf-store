-- Add price column to workout_plans safely
ALTER TABLE public.workout_plans 
ADD COLUMN IF NOT EXISTS price NUMERIC NOT NULL DEFAULT 0;
