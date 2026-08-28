-- 1. Create Workout Plans Table
CREATE TABLE IF NOT EXISTS public.workout_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    level TEXT NOT NULL,
    duration TEXT NOT NULL,
    days_per_week INTEGER NOT NULL,
    goal TEXT NOT NULL,
    category TEXT NOT NULL,
    equipment TEXT NOT NULL,
    description TEXT NOT NULL,
    highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
    recommended_supplements JSONB NOT NULL DEFAULT '[]'::jsonb,
    badge TEXT,
    image_url TEXT,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Create Programs Table
CREATE TABLE IF NOT EXISTS public.programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    tagline TEXT NOT NULL,
    duration TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    goal TEXT NOT NULL,
    category TEXT NOT NULL,
    short_description TEXT NOT NULL,
    overview TEXT NOT NULL,
    target_audience JSONB NOT NULL DEFAULT '[]'::jsonb,
    weekly_schedule JSONB NOT NULL DEFAULT '[]'::jsonb,
    equipment_needed JSONB NOT NULL DEFAULT '[]'::jsonb,
    key_benefits JSONB NOT NULL DEFAULT '[]'::jsonb,
    included_modules JSONB NOT NULL DEFAULT '[]'::jsonb,
    accent_color TEXT NOT NULL,
    rating NUMERIC NOT NULL DEFAULT 0,
    reviews INTEGER NOT NULL DEFAULT 0,
    enrolled_count INTEGER NOT NULL DEFAULT 0,
    price TEXT NOT NULL,
    image_url TEXT,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Create Manual Therapy Table
CREATE TABLE IF NOT EXISTS public.manual_therapy (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    tag TEXT NOT NULL,
    icon TEXT NOT NULL,
    duration TEXT NOT NULL,
    short_description TEXT NOT NULL,
    focus_areas JSONB NOT NULL DEFAULT '[]'::jsonb,
    best_for TEXT NOT NULL,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Create Meal Plans Table
CREATE TABLE IF NOT EXISTS public.meal_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    goal TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC NOT NULL,
    daily_calories INTEGER NOT NULL,
    macros JSONB NOT NULL,
    meals_per_day INTEGER NOT NULL,
    duration TEXT NOT NULL,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
    sample_meals JSONB NOT NULL DEFAULT '[]'::jsonb,
    badge TEXT,
    dietary_tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    image_url TEXT,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Create Lifestyle Pillars Table
CREATE TABLE IF NOT EXISTS public.lifestyle_pillars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon_svg TEXT NOT NULL,
    bullets JSONB NOT NULL DEFAULT '[]'::jsonb,
    link_text TEXT NOT NULL,
    link_url TEXT NOT NULL,
    css_class TEXT NOT NULL,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Create Lifestyle Tips Table
CREATE TABLE IF NOT EXISTS public.lifestyle_tips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    number_label TEXT UNIQUE NOT NULL,
    badge TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. Enable Row Level Security
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manual_therapy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lifestyle_pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lifestyle_tips ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to ensure idempotency)
DROP POLICY IF EXISTS "Public SELECT Active Workout Plans" ON public.workout_plans;
DROP POLICY IF EXISTS "Admin ALL Workout Plans" ON public.workout_plans;

DROP POLICY IF EXISTS "Public SELECT Active Programs" ON public.programs;
DROP POLICY IF EXISTS "Admin ALL Programs" ON public.programs;

DROP POLICY IF EXISTS "Public SELECT Active Manual Therapy" ON public.manual_therapy;
DROP POLICY IF EXISTS "Admin ALL Manual Therapy" ON public.manual_therapy;

DROP POLICY IF EXISTS "Public SELECT Active Meal Plans" ON public.meal_plans;
DROP POLICY IF EXISTS "Admin ALL Meal Plans" ON public.meal_plans;

DROP POLICY IF EXISTS "Public SELECT Active Lifestyle Pillars" ON public.lifestyle_pillars;
DROP POLICY IF EXISTS "Admin ALL Lifestyle Pillars" ON public.lifestyle_pillars;

DROP POLICY IF EXISTS "Public SELECT Active Lifestyle Tips" ON public.lifestyle_tips;
DROP POLICY IF EXISTS "Admin ALL Lifestyle Tips" ON public.lifestyle_tips;

-- 8. Create Policies for Workout Plans
CREATE POLICY "Public SELECT Active Workout Plans" ON public.workout_plans FOR SELECT USING (is_archived = false);
CREATE POLICY "Admin ALL Workout Plans" ON public.workout_plans
FOR ALL USING ( EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin') ) 
WITH CHECK ( EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin') );

-- 9. Create Policies for Programs
CREATE POLICY "Public SELECT Active Programs" ON public.programs FOR SELECT USING (is_archived = false);
CREATE POLICY "Admin ALL Programs" ON public.programs
FOR ALL USING ( EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin') ) 
WITH CHECK ( EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin') );

-- 10. Create Policies for Manual Therapy
CREATE POLICY "Public SELECT Active Manual Therapy" ON public.manual_therapy FOR SELECT USING (is_archived = false);
CREATE POLICY "Admin ALL Manual Therapy" ON public.manual_therapy
FOR ALL USING ( EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin') ) 
WITH CHECK ( EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin') );

-- 11. Create Policies for Meal Plans
CREATE POLICY "Public SELECT Active Meal Plans" ON public.meal_plans FOR SELECT USING (is_archived = false);
CREATE POLICY "Admin ALL Meal Plans" ON public.meal_plans
FOR ALL USING ( EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin') ) 
WITH CHECK ( EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin') );

-- 12. Create Policies for Lifestyle Pillars
CREATE POLICY "Public SELECT Active Lifestyle Pillars" ON public.lifestyle_pillars FOR SELECT USING (is_archived = false);
CREATE POLICY "Admin ALL Lifestyle Pillars" ON public.lifestyle_pillars
FOR ALL USING ( EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin') ) 
WITH CHECK ( EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin') );

-- 13. Create Policies for Lifestyle Tips
CREATE POLICY "Public SELECT Active Lifestyle Tips" ON public.lifestyle_tips FOR SELECT USING (is_archived = false);
CREATE POLICY "Admin ALL Lifestyle Tips" ON public.lifestyle_tips
FOR ALL USING ( EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin') ) 
WITH CHECK ( EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin') );

-- 14. Create CMS Images Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('cms-images', 'cms-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access CMS Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload CMS Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete CMS Images" ON storage.objects;

CREATE POLICY "Public Access CMS Images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'cms-images' );

CREATE POLICY "Admin Upload CMS Images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'cms-images' AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin') );

CREATE POLICY "Admin Delete CMS Images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'cms-images' AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin') );

-- 15. Reload Schema Cache
NOTIFY pgrst, 'reload schema';
