export interface ProgramScheduleItem {
  day: string;
  title: string;
  focus: string;
  duration: string;
}

export interface FitnessProgram {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  goal: string;
  category: 'Muscle Building' | 'Fat Loss' | 'Strength' | 'Beginner Fitness' | 'Home Fitness' | 'Athletic Performance' | 'Lifestyle Transformation';
  shortDescription: string;
  overview: string;
  targetAudience: string[];
  weeklySchedule: ProgramScheduleItem[];
  equipmentNeeded: string[];
  keyBenefits: string[];
  includedModules: string[];
  accentColor: string;
  rating: number;
  reviews: number;
  enrolledCount: number;
  price: string;
}

export const programs: FitnessProgram[] = [
  {
    id: '90-day-transformation',
    slug: '90-day-transformation',
    title: '90-DAY TRANSFORMATION',
    tagline: 'The Ultimate Total Body Recomposition Protocol',
    duration: '90 Days (12 Weeks)',
    difficulty: 'All Levels',
    goal: 'Complete body recomposition: drop body fat, pack on dense lean muscle, and rewire daily habits',
    category: 'Lifestyle Transformation',
    shortDescription: 'A comprehensive 3-phase system combining progressive resistance, customized macro targets, and habit mastery for lasting transformation.',
    overview: 'The 90-Day Transformation is our flagship lifestyle and physique system. Broken down into three distinct 4-week phases (Foundation & Priming, Hypertrophy & Metabolism, and Peak Definition), this program removes all guesswork from your training and nutrition.',
    targetAudience: [
      'Individuals looking for a complete physical and mental transformation',
      'Lifters who hit a stubborn physique plateau',
      'Anyone wanting a step-by-step nutrition and training roadmap with zero fluff',
    ],
    weeklySchedule: [
      { day: 'Day 1', title: 'Upper Body Power & Chest/Back Focus', focus: 'Compound Strength', duration: '50 mins' },
      { day: 'Day 2', title: 'Lower Body Quad & Core Builder', focus: 'Hypertrophy & Mobility', duration: '55 mins' },
      { day: 'Day 3', title: 'Active Recovery & Zone 2 Cardio', focus: 'Aerobic Base & Tissue Flushes', duration: '30 mins' },
      { day: 'Day 4', title: 'Upper Body Hypertrophy & Delts/Arms', focus: 'Time Under Tension', duration: '45 mins' },
      { day: 'Day 5', title: 'Posterior Chain & Hamstring/Glute Blast', focus: 'Deadlifts & Power', duration: '50 mins' },
      { day: 'Day 6', title: 'Metabolic Conditioning Circuit', focus: 'High Calorie Burn & Stamina', duration: '35 mins' },
      { day: 'Day 7', title: 'Full Rest & Nutritional Meal Prep', focus: 'Deep Recovery & Mindset', duration: 'Rest' },
    ],
    equipmentNeeded: [
      'Standard Commercial Gym Equipment (Barbells, Dumbbells, Cables)',
      'Adjustable Incline Bench',
      'Digital Food Scale & Workout Journal',
    ],
    keyBenefits: [
      '3-Phase Periodized Training System designed for maximum progressive overload',
      'Complete Nutrition Guide with custom calorie and macro calculators',
      'Weekly Habit Trackers and recovery protocols for sustainable progress',
      'Comprehensive Video Exercise Library with proper form breakdowns',
    ],
    includedModules: [
      'Complete 90-Day Training Schedule (PDF & Interactive App Format)',
      'Macronutrient & Meal Planning Blueprint with 40+ high-protein recipes',
      'Supplement Optimization Protocol tailored to your goals',
      'Private Community Access & 24/7 Coach Q&A Support',
    ],
    accentColor: 'blue',
    rating: 4.9,
    reviews: 740,
    enrolledCount: 14200,
    price: 'FREE with FAAF Community',
  },
  {
    id: 'lean-and-strong',
    slug: 'lean-and-strong',
    title: 'LEAN & STRONG',
    tagline: 'High-Density Hypertrophy & Conditioning Matrix',
    duration: '8 Weeks',
    difficulty: 'Intermediate',
    goal: 'Build dense, functional lean muscle while accelerating fat loss and cardiovascular output',
    category: 'Fat Loss',
    shortDescription: 'Engineered for lifters who want an athletic, defined physique without spending hours on boring cardio machines.',
    overview: 'Lean & Strong utilizes high-density resistance training (HDRT) and timed supersets to keep your heart rate in optimal metabolic zones while lifting heavy. You will build lean mass, boost insulin sensitivity, and strip unwanted body fat simultaneously.',
    targetAudience: [
      'Intermediate lifters who want a lean, athletic physique with visible definition',
      'Busy professionals who need efficient, high-impact 45-minute gym sessions',
      'Athletes looking to shed fat without losing hard-earned strength numbers',
    ],
    weeklySchedule: [
      { day: 'Monday', title: 'Push Power & High-Density Chest/Triceps', focus: 'Hypertrophy & Tempo', duration: '45 mins' },
      { day: 'Tuesday', title: 'Pull Strength & Back/Bicep Supersets', focus: 'Volume Overload', duration: '45 mins' },
      { day: 'Wednesday', title: 'Low-Impact Recovery & Mobility Flow', focus: 'Joint Health & Flexibility', duration: '30 mins' },
      { day: 'Thursday', title: 'Quad Dominance & Core Stability', focus: 'Strength & Conditioning', duration: '50 mins' },
      { day: 'Friday', title: 'Full Body Density Gauntlet', focus: 'Metabolic Output & Endurance', duration: '40 mins' },
      { day: 'Weekend', title: 'Active Lifestyle & Outdoor Movement', focus: 'Recharge & Rest', duration: 'Flexible' },
    ],
    equipmentNeeded: [
      'Dumbbells (Light, Medium, Heavy)',
      'Pull-Up Bar & Resistance Bands',
      'Kettlebells & Foam Roller',
    ],
    keyBenefits: [
      'Supercharged metabolic burn with intelligent timed rest intervals',
      'Preserves 100% of lean muscle tissue in caloric deficits',
      'Builds real athletic endurance and joint durability',
      'Includes hydration and electrolyte timing guides',
    ],
    includedModules: [
      '8-Week Periodized Workout Plan',
      'High-Protein Nutrition & Intermittent Fasting Guide',
      'Pre & Post Workout Nutrient Timing Protocols',
    ],
    accentColor: 'amber',
    rating: 4.8,
    reviews: 512,
    enrolledCount: 9800,
    price: 'FREE with FAAF Community',
  },
  {
    id: 'foundation',
    slug: 'foundation',
    title: 'FOUNDATION',
    tagline: 'Master the Basics. Build Unstoppable Momentum.',
    duration: '6 Weeks',
    difficulty: 'Beginner',
    goal: 'Build fundamental lifting technique, core stability, and consistent daily fitness habits',
    category: 'Beginner Fitness',
    shortDescription: 'The essential starting point. Learn proper lifting mechanics, eliminate joint pain, and create a workout routine you will actually stick to.',
    overview: 'Going to the gym can feel intimidating when you do not have a clear plan. Foundation provides a supportive, scientifically proven path to master compound movements, avoid common beginner injuries, and establish rock-solid workout consistency.',
    targetAudience: [
      'Beginners looking for clear, non-intimidating workout guidance',
      'Lifters returning to training after an injury or long hiatus',
      'Anyone wanting to bulletproof their joints and fix posture imbalances',
    ],
    weeklySchedule: [
      { day: 'Monday', title: 'Full Body A: Squat, Push & Core', focus: 'Movement Mastery', duration: '40 mins' },
      { day: 'Wednesday', title: 'Full Body B: Hinge, Pull & Carry', focus: 'Posterior Strength', duration: '40 mins' },
      { day: 'Friday', title: 'Full Body C: Lunge, Press & Rotate', focus: 'Balance & Stability', duration: '40 mins' },
      { day: 'Tue/Thu/Sat', title: 'Daily 20-Min Brisk Walking & Hydration', focus: 'Habit Formation', duration: '20 mins' },
      { day: 'Sunday', title: 'Rest & Weekly Self-Reflection', focus: 'Recovery', duration: 'Rest' },
    ],
    equipmentNeeded: [
      'Basic Dumbbells or Kettlebells',
      'Exercise Mat & Resistance Loop',
    ],
    keyBenefits: [
      'Step-by-step video tutorials for all 6 fundamental movement patterns',
      'Joint-friendly progression designed to eliminate lower back & knee pain',
      'Actionable daily habit system: water, sleep, protein, and steps',
      'Zero confusion—every set, rep, and rest period clearly mapped out',
    ],
    includedModules: [
      '6-Week Beginner Full-Body Training Blueprint',
      'Beginner Nutrition Simplified Guide',
      'Warm-up & Mobility Sequence for Stiff Joints',
    ],
    accentColor: 'teal',
    rating: 4.9,
    reviews: 388,
    enrolledCount: 11400,
    price: 'FREE with FAAF Community',
  },
  {
    id: 'performance',
    slug: 'performance',
    title: 'PERFORMANCE',
    tagline: 'Unleash Explosive Speed, Power & High-Level Conditioning',
    duration: '12 Weeks',
    difficulty: 'Advanced',
    goal: 'Maximize power output, sprint velocity, vertical jump, and high-intensity stamina',
    category: 'Athletic Performance',
    shortDescription: 'Advanced sports-performance protocols combining contrast plyometrics, Olympic lifting variations, and energy systems training.',
    overview: 'Built for competitive athletes, CrossFitters, and serious fitness enthusiasts. Performance uses triphasic training methods and contrast potentiation (heavy loads paired with explosive bodyweight drills) to forge an explosive, resilient athletic machine.',
    targetAudience: [
      'Competitive sports players, sprinters, and combat athletes',
      'Advanced lifters seeking explosive rate of force development (RFD)',
      'Anyone who wants to train and perform like an elite pro athlete',
    ],
    weeklySchedule: [
      { day: 'Monday', title: 'Max Power & Olympic Complex / Sprint Starts', focus: 'Neural Drive & RFD', duration: '60 mins' },
      { day: 'Tuesday', title: 'Rotational Power & Upper Body Dynamic Effort', focus: 'Explosive Velocity', duration: '55 mins' },
      { day: 'Wednesday', title: 'Tissue Regeneration & Contrast Hydrotherapy', focus: 'CNS Recovery', duration: '40 mins' },
      { day: 'Thursday', title: 'Lower Body Triphasic Strength & Plyometrics', focus: 'Elastic Power', duration: '60 mins' },
      { day: 'Friday', title: 'Upper Body Heavy Compound & Grip Matrix', focus: 'Raw Force Output', duration: '50 mins' },
      { day: 'Saturday', title: 'Anaerobic Lactic Capacity & Agility Drills', focus: 'Game-Speed Stamina', duration: '45 mins' },
      { day: 'Sunday', title: 'Active Restoration & Parasympathetic Breathing', focus: 'Deep Recovery', duration: 'Rest' },
    ],
    equipmentNeeded: [
      'Olympic Barbell & Bumper Plates',
      'Plyometric Jump Boxes & Medicine Balls',
      'Trap Bar & Sled / Turf Track',
    ],
    keyBenefits: [
      'Triphasic eccentric/isometric/concentric strength adaptation',
      'Noticeable improvement in vertical jump, sprint times, and agility',
      'Advanced recovery methods to handle high neural demands',
      'Nutrition and electrolyte guidelines for two-a-day or high-volume output',
    ],
    includedModules: [
      '12-Week Advanced Athletic Periodization System',
      'Speed & Agility Video Masterclass',
      'Pre-Competition Priming & Peaking Guide',
      'Injury Prevention & Rotator Cuff Bulletproofing',
    ],
    accentColor: 'purple',
    rating: 4.9,
    reviews: 420,
    enrolledCount: 6500,
    price: 'FREE with FAAF Community',
  },
];
