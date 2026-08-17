export type WorkoutLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type WorkoutGoal = 'Strength' | 'Fat Loss' | 'Muscle Building' | 'Athletic Performance' | 'Home Conditioning';

export interface WorkoutPlan {
  id: string;
  slug: string;
  title: string;
  level: WorkoutLevel;
  duration: string;
  daysPerWeek: number;
  goal: string;
  category: 'Strength' | 'Fat Loss' | 'Home' | 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: string;
  description: string;
  highlights: string[];
  recommendedSupplements: string[];
  badge?: string;
}

export const workoutPlans: WorkoutPlan[] = [
  {
    id: 'beginner-strength',
    slug: 'beginner-strength',
    title: 'Beginner Strength Foundation',
    level: 'Beginner',
    duration: '4 Weeks',
    daysPerWeek: 3,
    goal: 'Build fundamental strength & compound lift technique',
    category: 'Beginner',
    equipment: 'Barbell, Dumbbells, Bench',
    description: 'Master the core foundational lifts: squat, bench press, deadlift, and overhead press. Perfect for lifters starting their fitness journey or returning after a break.',
    highlights: ['Full body compound split', 'Linear weight progression', 'Mobility & warm-up protocols', 'Form check video guidelines'],
    recommendedSupplements: ['FAAF 100% Pure Whey Isolate', 'FAAF Performance Creatine Monohydrate'],
    badge: 'POPULAR START',
  },
  {
    id: 'muscle-builder',
    slug: 'muscle-builder',
    title: 'Hypertrophy Muscle Builder',
    level: 'Intermediate',
    duration: '8 Weeks',
    daysPerWeek: 4,
    goal: 'Maximal muscle hypertrophy & targeted volume',
    category: 'Strength',
    equipment: 'Full Gym Access (Cables, Free Weights)',
    description: 'An upper/lower split engineered with high-tension rep ranges, drop sets, and progressive volume overload to trigger maximum muscle growth.',
    highlights: ['Upper/Lower 4-day split', 'RPE & volume load tracker', 'Targeted arm & shoulder finishers', 'Deload week protocol included'],
    recommendedSupplements: ['FAAF 100% Pure Whey Isolate', 'FAAF Thermo Ignition Pre-Workout', 'FAAF Creatine'],
    badge: 'BESTSELLER',
  },
  {
    id: 'fat-loss-conditioning',
    slug: 'fat-loss-conditioning',
    title: 'Fat Loss & High Conditioning',
    level: 'Intermediate',
    duration: '6 Weeks',
    daysPerWeek: 5,
    goal: 'Shred body fat while preserving lean muscle mass',
    category: 'Fat Loss',
    equipment: 'Dumbbells, Kettlebells, Cardio Equipment',
    description: 'High-density resistance circuits combined with anaerobic intervals (HIIT) to keep metabolic rate elevated for hours post-workout.',
    highlights: ['Metabolic resistance training', 'HIIT cardio intervals', 'Macro calorie-deficit tips', 'Heart rate zone targets'],
    recommendedSupplements: ['FAAF Hydro-BCAA + Electrolytes', 'FAAF High-Protein Crunch Bar'],
    badge: 'HIGH BURN',
  },
  {
    id: 'home-workout',
    slug: 'home-workout',
    title: 'Zero-Gym Home Warrior',
    level: 'Beginner',
    duration: '4 Weeks',
    daysPerWeek: 4,
    goal: 'Build functional strength and endurance anywhere',
    category: 'Home',
    equipment: 'Minimal (Bodyweight, Resistance Bands)',
    description: 'No gym membership required. High-energy bodyweight progressions, tempo control, and resistance band routines you can perform in your living room or outdoors.',
    highlights: ['No heavy weights needed', 'Joint-friendly calisthenics', 'Quick 35-minute sessions', 'Follow-along timer structure'],
    recommendedSupplements: ['FAAF Ready-to-Drink Protein Shake', 'FAAF Double Protein Snack Bites'],
    badge: 'NO GYM NEEDED',
  },
  {
    id: 'athletic-performance',
    slug: 'athletic-performance',
    title: 'Athletic Power & Speed Matrix',
    level: 'Advanced',
    duration: '8 Weeks',
    daysPerWeek: 5,
    goal: 'Explosive power, sprint speed & functional agility',
    category: 'Advanced',
    equipment: 'Trap Bar, Plyo Boxes, Medicine Balls, Barbells',
    description: 'Designed for competitive athletes and high performers. Combines triphasic strength methods, plyometrics, and rotational power drills.',
    highlights: ['Olympic lift variations', 'Contrast plyometric training', 'Rotational core power', 'Speed & deceleration drills'],
    recommendedSupplements: ['FAAF Thermo Ignition Pre-Workout', 'FAAF Hydro-BCAA + Electrolytes', 'FAAF Whey Isolate'],
    badge: 'PRO ATHLETE',
  },
  {
    id: 'hybrid-conditioning-strength',
    slug: 'hybrid-conditioning-strength',
    title: 'Hybrid Athlete Strength & Stamina',
    level: 'Intermediate',
    duration: '8 Weeks',
    daysPerWeek: 5,
    goal: 'Combine heavy lifting with 10k running endurance',
    category: 'Strength',
    equipment: 'Full Gym & Running Shoes',
    description: 'The ultimate blueprint for those who refuse to choose between big squats and fast miles. Balanced energy systems training with smart recovery protocols.',
    highlights: ['Periodized strength & aerobic split', 'Zone 2 base building', 'Post-run recovery sequences', 'Nutritional fueling timing'],
    recommendedSupplements: ['FAAF Rapid Recovery Electrolyte Drink', 'FAAF 100% Pure Whey Isolate'],
    badge: 'HYBRID',
  },
];
