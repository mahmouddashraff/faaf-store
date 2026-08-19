export type MealGoal = 'Weight Loss' | 'Muscle Gain' | 'High Protein' | 'Balanced Nutrition' | 'Performance';

export interface MealItem {
  time: string;
  name: string;
  items: string[];
  calories: number;
  macros: { protein: number; carbs: number; fats: number };
}

export interface MealPlan {
  id: string;
  slug: string;
  title: string;
  goal: string;
  category: MealGoal;
  price: number;
  dailyCalories: number;
  macros: {
    protein: string;
    carbs: string;
    fats: string;
  };
  mealsPerDay: number;
  duration: string;
  shortDescription: string;
  description: string;
  highlights: string[];
  sampleMeals: MealItem[];
  badge?: string;
  dietaryTags: string[];
}

export const mealPlans: MealPlan[] = [
  {
    id: 'weight-loss-plan',
    slug: 'weight-loss-plan',
    title: 'Weight Loss & Shred Plan',
    goal: 'Targeted calorie deficit for rapid fat loss while preserving lean muscle',
    category: 'Weight Loss',
    price: 29.99,
    dailyCalories: 1750,
    macros: {
      protein: '160g',
      carbs: '135g',
      fats: '48g',
    },
    mealsPerDay: 4,
    duration: '8 Weeks',
    shortDescription: 'High-satiety, nutrient-dense whole foods structured for consistent fat reduction with zero metabolic crash.',
    description: 'Engineered specifically for athletes and fitness enthusiasts who want to shed body fat without sacrificing strength or lean tissue. Every meal combines lean proteins, complex fiber-rich carbohydrates, and essential healthy fats to eliminate hunger spikes and stabilize insulin levels.',
    highlights: [
      'Pre-calculated calorie deficit with macro breakdown',
      'High-volume, fiber-rich meals for all-day satiety',
      'Strategic carbohydrate timing around training',
      'Weekly printable grocery checklist & prep guide',
      '15-minute quick batch cooking recipes'
    ],
    dietaryTags: ['High Protein', 'Gluten-Free Friendly', 'Low Glycemic'],
    badge: 'POPULAR CHOICE',
    sampleMeals: [
      {
        time: 'Meal 1 (Breakfast)',
        name: 'Power Scramble & Berry Oats',
        items: ['4 Egg whites + 1 whole egg scrambled with baby spinach', '1/2 cup rolled oats with unsweetened almond milk', '1/2 cup fresh blueberries & cinnamon'],
        calories: 390,
        macros: { protein: 32, carbs: 42, fats: 10 }
      },
      {
        time: 'Meal 2 (Lunch)',
        name: 'Grilled Herb Chicken & Quinoa Bowl',
        items: ['160g Lemon-herb grilled chicken breast', '1/2 cup cooked organic quinoa', 'Steamed asparagus spears & roasted bell peppers', '1 tsp extra virgin olive oil'],
        calories: 440,
        macros: { protein: 44, carbs: 36, fats: 12 }
      },
      {
        time: 'Meal 3 (Post-Workout)',
        name: 'Clean Fuel Recovery Shake',
        items: ['1 Scoop FAAF 100% Pure Whey Isolate', '1 cup cold water or unsweetened almond milk', '1 Small banana', '1 tbsp organic chia seeds'],
        calories: 280,
        macros: { protein: 30, carbs: 28, fats: 5 }
      },
      {
        time: 'Meal 4 (Dinner)',
        name: 'Baked Atlantic Salmon & Green Medley',
        items: ['150g Wild-caught Atlantic salmon fillet', '1 Medium roasted sweet potato (120g)', 'Generous steamed broccoli with lemon zest'],
        calories: 460,
        macros: { protein: 38, carbs: 29, fats: 19 }
      }
    ]
  },
  {
    id: 'muscle-gain-plan',
    slug: 'muscle-gain-plan',
    title: 'Hypertrophy Muscle Gain Plan',
    goal: 'Clean caloric surplus engineered for maximal muscle growth & strength',
    category: 'Muscle Gain',
    price: 34.99,
    dailyCalories: 3150,
    macros: {
      protein: '210g',
      carbs: '375g',
      fats: '82g',
    },
    mealsPerDay: 5,
    duration: '12 Weeks',
    shortDescription: 'High-calorie, nutrient-rich fueling protocol for lean mass accretion without unwanted excess fat gain.',
    description: 'Designed for hardgainers, bodybuilders, and dedicated lifters aiming to pack on solid muscle mass. This blueprint utilizes high-density whole food carbohydrates, premium bioavailable animal proteins, and healthy lipids to keep your body in a continuous anabolic state while supporting heavy training sessions.',
    highlights: [
      'Optimized 300-400 kcal surplus to avoid fat spillover',
      'Dense carbohydrate distribution for glycogen loading',
      'Anabolic pre- & post-workout nutrient timing',
      'High-calorie clean shake recipes for easy digestion',
      'Digestive enzyme and gut-health food pairing guide'
    ],
    dietaryTags: ['High Calorie', 'High Protein', 'Mass Building'],
    badge: 'BESTSELLER',
    sampleMeals: [
      {
        time: 'Meal 1 (Breakfast)',
        name: 'Anabolic Sunrise Feast',
        items: ['4 Whole pasture-raised eggs + 2 slices sourdough toast', '1 tbsp grass-fed butter', '1 Large banana & 1 glass orange juice'],
        calories: 680,
        macros: { protein: 38, carbs: 74, fats: 26 }
      },
      {
        time: 'Meal 2 (Mid-Morning)',
        name: 'High-Calorie Monster Shake',
        items: ['1.5 Scoops FAAF Pure Whey Isolate', '1 cup whole oats blended', '2 tbsp natural peanut butter', '1.5 cups whole milk or oat milk', '1 tbsp raw honey'],
        calories: 690,
        macros: { protein: 52, carbs: 78, fats: 20 }
      },
      {
        time: 'Meal 3 (Lunch)',
        name: 'Extra Lean Beef & Jasmine Rice Stack',
        items: ['200g Lean ground beef (93/7)', '1.5 cups steamed jasmine rice', 'Sautéed zucchini & garlic in olive oil'],
        calories: 660,
        macros: { protein: 48, carbs: 68, fats: 18 }
      },
      {
        time: 'Meal 4 (Pre/Post Workout)',
        name: 'Chicken Breast & Sweet Potato Mash',
        items: ['180g Seasoned chicken breast', '250g Roasted sweet potato mash', 'Steamed green beans'],
        calories: 540,
        macros: { protein: 45, carbs: 65, fats: 8 }
      },
      {
        time: 'Meal 5 (Dinner / Night)',
        name: 'Greek Yogurt & Nut Parfait',
        items: ['1.5 cups Plain Greek yogurt (0%)', '1/3 cup raw almonds & walnuts', '1/2 cup mixed berries & drizzle of raw honey'],
        calories: 580,
        macros: { protein: 42, carbs: 48, fats: 22 }
      }
    ]
  },
  {
    id: 'high-protein-plan',
    slug: 'high-protein-plan',
    title: 'High Protein Recomposition Plan',
    goal: 'Maximum protein density for simultaneous fat loss & muscle definition',
    category: 'High Protein',
    price: 34.99,
    dailyCalories: 2450,
    macros: {
      protein: '220g',
      carbs: '210g',
      fats: '60g',
    },
    mealsPerDay: 4,
    duration: '8 Weeks',
    shortDescription: 'Ultra-high protein intake with moderate carbs designed to optimize nitrogen balance and muscle hardness.',
    description: 'The definitive blueprint for achieving a shredded, vascular, and defined athletic physique. Centered around 1g-1.2g of protein per pound of body weight, this plan maximizes muscle protein synthesis (MPS) around the clock while keeping net carbohydrates dialed in for peak definition.',
    highlights: [
      '220g of pure bioavailable protein daily',
      'Targeted amino acid & MPS stimulation every 3-4 hours',
      'Low sodium & anti-bloat whole food ingredients',
      'Carb cycling protocol for heavy vs light training days',
      'Macro swap cheat sheets for dining out'
    ],
    dietaryTags: ['Ultra High Protein', 'Low Fat', 'Lean Shred'],
    badge: 'ATHLETE FAVORITE',
    sampleMeals: [
      {
        time: 'Meal 1 (Breakfast)',
        name: 'Pro-Oats & Egg White Omelet',
        items: ['1 cup Egg whites with mushrooms & bell peppers', '1/2 cup rolled oats stirred with 1 scoop FAAF Vanilla Isolate', 'Handful of fresh raspberries'],
        calories: 510,
        macros: { protein: 55, carbs: 48, fats: 7 }
      },
      {
        time: 'Meal 2 (Lunch)',
        name: 'Turkey Tenderloin & Brown Rice Bowl',
        items: ['200g Grilled turkey breast tenderloin', '1 cup cooked brown basmati rice', 'Steamed broccoli florets with balsamic drizzle'],
        calories: 560,
        macros: { protein: 58, carbs: 54, fats: 11 }
      },
      {
        time: 'Meal 3 (Post-Workout)',
        name: 'Seared Tuna Steak & Quinoa Medley',
        items: ['180g Pan-seared Yellowfin tuna steak', '3/4 cup cooked quinoa', 'Side garden salad with lemon-tahini dressing'],
        calories: 530,
        macros: { protein: 54, carbs: 46, fats: 13 }
      },
      {
        time: 'Meal 4 (Dinner)',
        name: 'Flank Steak & Roasted Asparagus',
        items: ['180g Grilled lean flank steak', '150g Roasted baby potatoes', 'Grilled asparagus & olive oil spray'],
        calories: 570,
        macros: { protein: 53, carbs: 42, fats: 20 }
      }
    ]
  },
  {
    id: 'performance-plan',
    slug: 'performance-plan',
    title: 'Elite Athletic Performance Plan',
    goal: 'High-glycogen endurance & explosive power fueling for elite athletes',
    category: 'Performance',
    price: 39.99,
    dailyCalories: 2850,
    macros: {
      protein: '175g',
      carbs: '340g',
      fats: '68g',
    },
    mealsPerDay: 5,
    duration: '10 Weeks',
    shortDescription: 'Sustained stamina, intra-workout fueling, and rapid cellular glycogen restoration for intense sessions.',
    description: 'Engineered for competitive athletes, CrossFitters, sprinters, and endurance lifters who burn thousands of active calories and demand fast recovery. Features clean complex starches, electrolyte-rich hydration foods, and strategic intra-workout nutrient delivery.',
    highlights: [
      'Rapid glycogen replenishment matrix',
      'Electrolyte & hydration timing strategies',
      'Anti-inflammatory recovery foods (omega-3s, tart cherry)',
      'Intra-workout carbohydrate fueling protocols',
      'Weekly energy load calibration guide'
    ],
    dietaryTags: ['High Energy', 'Endurance Fuel', 'Electrolyte Rich'],
    badge: 'PRO TIER',
    sampleMeals: [
      {
        time: 'Meal 1 (Morning Fuel)',
        name: 'Athletic Power Oats & Banana',
        items: ['1 cup Rolled oats cooked in almond milk', '1 Scoop FAAF Pure Whey Isolate', '1 Sliced banana & 1 tbsp chia seeds', '1 tbsp raw organic honey'],
        calories: 590,
        macros: { protein: 38, carbs: 86, fats: 11 }
      },
      {
        time: 'Meal 2 (Lunch)',
        name: 'Chicken & Sweet Potato Performance Bowl',
        items: ['180g Grilled chicken breast', '250g Baked sweet potato', '1/2 Sliced avocado & mixed greens'],
        calories: 610,
        macros: { protein: 48, carbs: 64, fats: 18 }
      },
      {
        time: 'Meal 3 (Intra/Post Workout)',
        name: 'Glycogen Rapid Reload Shake',
        items: ['1 Scoop FAAF Whey Isolate', '1 cup Coconut water (electrolytes)', '1/2 cup pure rice flour / cluster dextrin or 2 ripe bananas'],
        calories: 380,
        macros: { protein: 28, carbs: 62, fats: 2 }
      },
      {
        time: 'Meal 4 (Dinner)',
        name: 'Wild Salmon & Scented Jasmine Rice',
        items: ['170g Wild Alaskan salmon', '1.25 cups Jasmine rice', 'Steamed kale & snap peas with sesame oil'],
        calories: 680,
        macros: { protein: 44, carbs: 68, fats: 24 }
      },
      {
        time: 'Meal 5 (Night Recovery)',
        name: 'Casein & Berries Bowl',
        items: ['1 cup Low-fat cottage cheese or micellar casein', '1/2 cup fresh blackberries', '1 tbsp almond butter'],
        calories: 320,
        macros: { protein: 32, carbs: 18, fats: 13 }
      }
    ]
  },
  {
    id: 'balanced-nutrition-plan',
    slug: 'balanced-nutrition-plan',
    title: 'Balanced Nutrition & Vitality Plan',
    goal: 'Sustainable daily wellness, gut health, and continuous metabolic vitality',
    category: 'Balanced Nutrition',
    price: 29.99,
    dailyCalories: 2100,
    macros: {
      protein: '145g',
      carbs: '210g',
      fats: '60g',
    },
    mealsPerDay: 4,
    duration: '8 Weeks',
    shortDescription: 'A flexible, sustainable Mediterranean-inspired whole food blueprint for effortless daily energy and longevity.',
    description: 'Designed for everyday individuals who want to eat clean, look lean, and feel energized without extreme dietary restrictions. Emphasizes antioxidant-rich vegetables, lean proteins, prebiotic fibers, and healthy fats that support digestion, mental focus, and cardiovascular health.',
    highlights: [
      'Mediterranean-inspired heart-healthy fat profile',
      'Prebiotic & probiotic gut microbiome support',
      'No restrictive bans—balanced and flexible macros',
      'Family-friendly recipes ready in under 20 minutes',
      'Dining out & travel navigation cheat sheet'
    ],
    dietaryTags: ['Balanced Macros', 'Gut Health', 'Whole Foods'],
    badge: 'SUSTAINABLE LIFESTYLE',
    sampleMeals: [
      {
        time: 'Meal 1 (Breakfast)',
        name: 'Greek Yogurt Vitality Parfait',
        items: ['1 cup Low-fat Greek yogurt', '1/3 cup whole grain granola', 'Fresh sliced strawberries & raw walnuts', '1 tsp manuka honey'],
        calories: 450,
        macros: { protein: 30, carbs: 50, fats: 14 }
      },
      {
        time: 'Meal 2 (Lunch)',
        name: 'Mediterranean Chicken & Olive Salad',
        items: ['150g Grilled herb chicken breast', '3/4 cup cooked quinoa', 'Kalamata olives, diced cucumbers, tomatoes & feta', '1 tbsp extra virgin olive oil vinaigrette'],
        calories: 560,
        macros: { protein: 42, carbs: 48, fats: 19 }
      },
      {
        time: 'Meal 3 (Afternoon Fuel)',
        name: 'FAAF Snack & Apple Crunch',
        items: ['1 FAAF High-Protein Crunch Bar or Snack Bites', '1 Crisp green apple with cinnamon', 'Cup of antioxidant green tea'],
        calories: 290,
        macros: { protein: 22, carbs: 36, fats: 6 }
      },
      {
        time: 'Meal 4 (Dinner)',
        name: 'Herb-Crusted Cod & Wild Rice',
        items: ['180g Baked cod with lemon & parsley', '3/4 cup wild rice pilaf', 'Roasted asparagus & carrots with olive oil'],
        calories: 520,
        macros: { protein: 42, carbs: 49, fats: 16 }
      }
    ]
  }
];
