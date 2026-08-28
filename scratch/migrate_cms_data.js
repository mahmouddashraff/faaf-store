require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Note: I will need to transpile the TypeScript files to JS to require them, or parse the TS directly.
// The easiest way is to use ts-node to execute this script.

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function migrateData() {
  console.log('Starting CMS data migration...');

  try {
    // 1. Workout Plans
    console.log('Migrating Workout Plans...');
    const { workoutPlans } = require('../lib/workoutPlans');
    for (const plan of workoutPlans) {
      const { id, ...data } = plan;
      const { error } = await supabase.from('workout_plans').upsert({
        slug: data.slug,
        title: data.title,
        level: data.level,
        duration: data.duration,
        days_per_week: data.daysPerWeek,
        goal: data.goal,
        category: data.category,
        equipment: data.equipment,
        description: data.description,
        highlights: data.highlights,
        recommended_supplements: data.recommendedSupplements,
        badge: data.badge,
        is_archived: false,
      }, { onConflict: 'slug' });
      
      if (error) console.error('Error on workout plan:', plan.slug, error);
    }

    // 2. Programs
    console.log('Migrating Programs...');
    const { programs } = require('../lib/programs');
    for (const prog of programs) {
      const { id, ...data } = prog;
      const { error } = await supabase.from('programs').upsert({
        slug: data.slug,
        title: data.title,
        tagline: data.tagline,
        duration: data.duration,
        difficulty: data.difficulty,
        goal: data.goal,
        category: data.category,
        short_description: data.shortDescription,
        overview: data.overview,
        target_audience: data.targetAudience,
        weekly_schedule: data.weeklySchedule,
        equipment_needed: data.equipmentNeeded,
        key_benefits: data.keyBenefits,
        included_modules: data.includedModules,
        accent_color: data.accentColor,
        rating: data.rating,
        reviews: data.reviews,
        enrolled_count: data.enrolledCount,
        price: data.price,
        is_archived: false,
      }, { onConflict: 'slug' });
      
      if (error) console.error('Error on program:', prog.slug, error);
    }

    // 3. Meal Plans
    console.log('Migrating Meal Plans...');
    const { mealPlans } = require('../lib/mealPlans');
    for (const meal of mealPlans) {
      const { id, ...data } = meal;
      const { error } = await supabase.from('meal_plans').upsert({
        slug: data.slug,
        title: data.title,
        goal: data.goal,
        category: data.category,
        price: data.price,
        daily_calories: data.dailyCalories,
        macros: data.macros,
        meals_per_day: data.mealsPerDay,
        duration: data.duration,
        short_description: data.shortDescription,
        description: data.description,
        highlights: data.highlights,
        sample_meals: data.sampleMeals,
        badge: data.badge,
        dietary_tags: data.dietaryTags,
        is_archived: false,
      }, { onConflict: 'slug' });
      
      if (error) console.error('Error on meal plan:', meal.slug, error);
    }

    // 4. Manual Therapy (Hardcoded in page.tsx)
    console.log('Migrating Manual Therapy...');
    const therapyServices = [
      {
        id: 'sports-massage',
        name: 'Sports Massage',
        tag: 'ATHLETIC RECOVERY',
        icon: '🏃‍♂️',
        duration: '60 / 90 Minutes',
        shortDescription: 'Targeted hands-on therapy tailored for athletes and active lifters to reduce muscle tension, enhance local blood flow, and accelerate recovery between hard training sessions.',
        focusAreas: ['Pre- & post-training muscle priming', 'Targeted tension relief for heavy lifters', 'Enhanced tissue elasticity & circulation'],
        bestFor: 'Athletes prepping for events or recovering from high-intensity training cycles.'
      },
      {
        id: 'deep-tissue-therapy',
        name: 'Deep Tissue Therapy',
        tag: 'TENSION RELEASE',
        icon: '🎯',
        duration: '60 / 90 Minutes',
        shortDescription: 'Focused, firm pressure applied to deeper muscle layers and connective tissues to release chronic tightness, stubborn adhesions, and posture-related physical strain.',
        focusAreas: ['Relief for dense, tight muscle fibers', 'Targeted trigger point pressure release', 'Posture-related muscular strain recovery'],
        bestFor: 'Individuals with persistent muscle stiffness or localized postural tension.'
      },
      {
        id: 'recovery-session',
        name: 'Recovery Session',
        tag: 'FULL-BODY FLUSH',
        icon: '🔋',
        duration: '45 / 60 Minutes',
        shortDescription: 'A comprehensive restorative protocol blending gentle myofascial techniques, assisted stretching, and lymphatic flushing to promote whole-body physical restoration.',
        focusAreas: ['Full-body physical de-escalation', 'Gentle myofascial tissue relaxation', 'Circulatory flush & system reset'],
        bestFor: 'Deload weeks, rest days, or busy athletes needing complete physical reset.'
      },
      {
        id: 'mobility-flexibility',
        name: 'Mobility & Flexibility',
        tag: 'RANGE OF MOTION',
        icon: '🧘‍♂️',
        duration: '45 / 60 Minutes',
        shortDescription: 'Hands-on joint mobilization and dynamic assisted stretching designed to expand functional range of motion, improve movement efficiency, and unlock athletic fluidity.',
        focusAreas: ['Assisted PNF stretching protocols', 'Hip, shoulder & thoracic spine mobility', 'Improved joint tracking & movement fluidity'],
        bestFor: 'Lifters, runners, and athletes looking to improve depth, form, and overall movement quality.'
      },
      {
        id: 'muscle-relaxation',
        name: 'Muscle Relaxation',
        tag: 'CALM & RESTORE',
        icon: '🌿',
        duration: '60 Minutes',
        shortDescription: 'A smooth, rhythmic manual session focused on calming the nervous system, alleviating physical fatigue, and restoring deep muscular ease after demanding workweeks.',
        focusAreas: ['Down-regulation of physical tension', 'Rhythmic soothing manual strokes', 'Promotes restful sleep & calm state'],
        bestFor: 'Anyone experiencing physical burnout, stress, or overall body fatigue.'
      },
      {
        id: 'personalized-manual-therapy',
        name: 'Personalized Manual Therapy',
        tag: 'SIGNATURE PROTOCOL',
        icon: '👑',
        duration: '60 / 90 Minutes',
        shortDescription: 'A bespoke, multi-technique session custom-built for your sport, body, and training volume. Combines deep tissue release, targeted mobility, and recovery flush.',
        focusAreas: ['Comprehensive movement & tension assessment', 'Multi-modality customized session plan', 'Dedicated focus on your priority muscle groups'],
        bestFor: 'Dedicated fitness enthusiasts seeking an all-in-one personalized recovery session.'
      }
    ];

    for (const service of therapyServices) {
      const { id, ...data } = service;
      const { error } = await supabase.from('manual_therapy').upsert({
        name: data.name,
        tag: data.tag,
        icon: data.icon,
        duration: data.duration,
        short_description: data.shortDescription,
        focus_areas: data.focusAreas,
        best_for: data.bestFor,
        is_archived: false,
      }, { onConflict: 'name' });
      
      if (error) console.error('Error on manual therapy:', service.name, error);
    }

    // 5. Lifestyle Pillars (Hardcoded in page.tsx)
    console.log('Migrating Lifestyle Pillars...');
    const lifestylePillars = [
      {
        title: 'Pure Nutrition',
        description: 'Fuel your cells with whole unprocessed foods, balanced macronutrients, clean whey isolate, and zero artificial shortcuts.',
        icon_svg: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>',
        bullets: ['1.6g - 2.2g Protein per kg bodyweight', 'Focus on micronutrient-dense meals', 'Hydrate with natural electrolytes'],
        link_text: 'Explore Nutrition →',
        link_url: '/shop?category=Powder',
        css_class: 'nutrition'
      },
      {
        title: 'Purposeful Training',
        description: 'Move with intention. Progressive overload, functional movement patterns, and cardiovascular conditioning that prepares you for life.',
        icon_svg: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 5v14"></path><path d="M18 5v14"></path><path d="M2 9h4v6H2z"></path><path d="M18 9h4v6h-4z"></path><path d="M6 12h12"></path></svg>',
        bullets: ['Master compound movements', 'Track progressive overload weekly', 'Incorporate Zone 2 aerobic base work'],
        link_text: 'View Workout Plans →',
        link_url: '/workout-plans',
        css_class: 'training'
      },
      {
        title: 'Active Recovery',
        description: 'Muscle and mental resilience are built during rest. Prioritize deep restorative sleep, mobility flows, and cellular repair.',
        icon_svg: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"></path></svg>',
        bullets: ['7-9 hours uninterrupted sleep', 'Daily 10-minute mobility routines', 'Post-workout BCAA & magnesium support'],
        link_text: 'Recovery Fuels →',
        link_url: '/shop?category=Supplements',
        css_class: 'recovery'
      },
      {
        title: 'Habit Stacking',
        description: 'Consistency beats motivation every single day. Micro-habits stacked over weeks create massive compounding transformations.',
        icon_svg: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
        bullets: ['Morning hydration and sunlight priming', 'Structured evening wind-down routine', 'Weekly progress and macro review'],
        link_text: 'Guided Programs →',
        link_url: '/programs',
        css_class: 'habits'
      }
    ];

    for (const pillar of lifestylePillars) {
      const { error } = await supabase.from('lifestyle_pillars').upsert({
        ...pillar,
        is_archived: false,
      }, { onConflict: 'title' });
      
      if (error) console.error('Error on lifestyle pillar:', pillar.title, error);
    }

    // 6. Lifestyle Tips (Hardcoded in page.tsx)
    console.log('Migrating Lifestyle Tips...');
    const lifestyleTips = [
      { number_label: '01', badge: 'HYDRATION', title: 'Stay Hydrated', description: 'Drink 3-4 liters of water daily. Add a pinch of sea salt or FAAF Electrolytes during intense training sessions to maintain optimal cellular osmotic balance.' },
      { number_label: '02', badge: 'PROTEIN', title: 'Prioritize Protein', description: 'Anchor every meal around 25-35g of bioavailable protein. Spread your intake across 3-4 feedings to continuously stimulate muscle protein synthesis (MPS).' },
      { number_label: '03', badge: 'MOVEMENT', title: 'Move Every Day', description: 'Aim for 8,000 - 10,000 steps daily outside your workouts. Low-intensity walking increases blood circulation, aids recovery, and manages cortisol levels.' },
      { number_label: '04', badge: 'SLEEP', title: 'Sleep & Recover', description: 'Keep your bedroom cold and dark. Limit blue light 60 minutes before bed to allow growth hormone and testosterone release during deep slow-wave sleep.' },
      { number_label: '05', badge: 'MINDSET', title: 'Stay Consistent', description: 'A 70% workout executed with consistency outperforms a 100% workout done occasionally. Show up on the days you don\'t feel like it.' },
      { number_label: '06', badge: 'SUPPLEMENTS', title: 'Fuel Your Goals', description: 'Use supplements as strategic amplifiers: Pure Whey Isolate post-workout, Creatine Monohydrate daily, and clean Pre-Workout when extra focus is needed.' }
    ];

    for (const tip of lifestyleTips) {
      const { error } = await supabase.from('lifestyle_tips').upsert({
        ...tip,
        is_archived: false,
      }, { onConflict: 'number_label' });
      
      if (error) console.error('Error on lifestyle tip:', tip.title, error);
    }

    console.log('CMS data migration completed!');
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

migrateData();
