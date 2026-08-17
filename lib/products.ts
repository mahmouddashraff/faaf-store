export type ProductVariant = {
  id: string;
  name: string;
  price?: number;
  inStock?: boolean;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  accent: string;
  category: 'Powder' | 'Bars' | 'Snacks' | 'Shakes' | 'Supplements' | 'Bundles' | 'Drinks';
  tag?: 'BESTSELLER' | 'NEW' | 'POPULAR' | 'HOT' | 'SAVE 20%';
  shortDescription: string;
  description: string;
  nutritionHighlights: string[];
  variants: ProductVariant[];
  image?: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: 'FAAF 100% Pure Whey Isolate',
    slug: 'pure-whey-isolate',
    price: 34.99,
    originalPrice: 42.99,
    rating: 4.9,
    reviews: 582,
    accent: 'blue',
    category: 'Powder',
    tag: 'BESTSELLER',
    shortDescription: 'Ultra-pure micro-filtered whey isolate with 27g protein & 0g sugar.',
    description: 'Fuel muscle repair and rapid recovery with our cold-filtered whey isolate. Engineered with ultra-low lactose and zero fillers for maximum bioavailability and smooth mixing.',
    nutritionHighlights: ['27g Protein', '0g Sugar', '5.8g BCAAs', '110 Calories'],
    variants: [
      { id: 'choc-silk', name: 'Chocolate Silk (2 lbs)' },
      { id: 'vanilla-ice', name: 'Vanilla Bean (2 lbs)' },
      { id: 'salted-caramel', name: 'Salted Caramel (2 lbs)' },
      { id: 'choc-4lb', name: 'Chocolate Silk (4 lbs)', price: 59.99 },
    ],
  },
  {
    id: 2,
    name: 'FAAF High-Protein Crunch Bar',
    slug: 'protein-crunch-bar',
    price: 12.99,
    originalPrice: 15.99,
    rating: 4.8,
    reviews: 429,
    accent: 'orange',
    category: 'Bars',
    tag: 'POPULAR',
    shortDescription: 'Triple-layer baked protein snack with crispy crunch and real cocoa.',
    description: 'Satisfy sweet cravings while keeping your macro targets locked in. Contains 20g of clean milk protein isolate, prebiotic fiber, and only 2g net carbs.',
    nutritionHighlights: ['20g Protein', '2g Net Carbs', '10g Fiber', '190 Calories'],
    variants: [
      { id: 'choc-peanut', name: 'Chocolate Peanut Butter (4-Pack)' },
      { id: 'cookies-cream', name: 'Cookies & Cream (4-Pack)' },
      { id: 'salted-almond', name: 'Salted Dark Almond (4-Pack)' },
      { id: 'box-12', name: 'Variety Box (12-Pack)', price: 32.99 },
    ],
  },
  {
    id: 3,
    name: 'FAAF Performance Creatine Monohydrate',
    slug: 'creatine-monohydrate',
    price: 24.99,
    rating: 4.9,
    reviews: 318,
    accent: 'teal',
    category: 'Supplements',
    tag: 'BESTSELLER',
    shortDescription: '100% Micronized Creapure for explosive strength and power output.',
    description: 'Enhance ATP regeneration, muscle hydration, and cognitive focus. Unflavored and instantly dissolvable in your pre-workout, shake, or water.',
    nutritionHighlights: ['5g Pure Creatine', '0 Calories', '100 Servings', 'Unflavored'],
    variants: [
      { id: 'unflavored-500g', name: 'Unflavored (500g / 100 Servings)' },
      { id: 'unflavored-1kg', name: 'Unflavored (1kg / 200 Servings)', price: 42.99 },
    ],
  },
  {
    id: 4,
    name: 'FAAF Hydro-BCAA + Electrolytes',
    slug: 'hydro-bcaa-electrolytes',
    price: 21.99,
    originalPrice: 26.99,
    rating: 4.7,
    reviews: 194,
    accent: 'purple',
    category: 'Supplements',
    tag: 'NEW',
    shortDescription: '2:1:1 Fermented BCAAs paired with Himalayan pink salt & coconut water.',
    description: 'Keep cramps away and maintain cellular hydration during grueling training sessions. Zero artificial dyes and naturally sweetened with Stevia.',
    nutritionHighlights: ['7g BCAAs', 'Electrolyte Matrix', 'Coconut Water', '0g Sugar'],
    variants: [
      { id: 'blue-razz', name: 'Blue Raspberry Crush (30 Servings)' },
      { id: 'watermelon-ice', name: 'Watermelon Lemonade (30 Servings)' },
      { id: 'island-punch', name: 'Tropical Island Punch (30 Servings)' },
    ],
  },
  {
    id: 5,
    name: 'FAAF Ready-to-Drink Protein Shake',
    slug: 'ready-protein-shake',
    price: 18.99,
    rating: 4.8,
    reviews: 245,
    accent: 'pink',
    category: 'Shakes',
    tag: 'HOT',
    shortDescription: 'Creamy on-the-go shake packed with 30g protein and 24 vitamins.',
    description: 'Grab, shake, and drink. Lactose-free, ultra-smooth texture with zero chalky aftertaste. Ideal for post-workout recovery or busy travel days.',
    nutritionHighlights: ['30g Protein', '1g Sugar', '24 Vitamins & Minerals', '160 Calories'],
    variants: [
      { id: 'shake-choc', name: 'Dark Velvet Cocoa (4-Pack)' },
      { id: 'shake-vanilla', name: 'French Vanilla Cream (4-Pack)' },
      { id: 'shake-mocha', name: 'Mocha Espresso (4-Pack)' },
      { id: 'shake-12', name: '12-Bottle Case (Variety)', price: 48.99 },
    ],
  },
  {
    id: 6,
    name: 'FAAF Thermo Ignition Pre-Workout',
    slug: 'thermo-ignition-pre-workout',
    price: 29.99,
    originalPrice: 36.99,
    rating: 4.7,
    reviews: 212,
    accent: 'red',
    category: 'Supplements',
    tag: 'POPULAR',
    shortDescription: 'High-octane energy, skin-splitting pumps, and laser sharp focus.',
    description: 'Clinically dosed with 3.2g Beta-Alanine, 6g L-Citrulline Malate, and dual-source natural caffeine for clean energy with zero jitters or post-workout crash.',
    nutritionHighlights: ['300mg Caffeine', '6g L-Citrulline', '3.2g Beta-Alanine', 'Zero Crash'],
    variants: [
      { id: 'sour-apple', name: 'Sour Green Apple (30 Servings)' },
      { id: 'electric-berry', name: 'Electric Berry Blast (30 Servings)' },
      { id: 'crimson-punch', name: 'Crimson Fruit Punch (30 Servings)' },
    ],
  },
  {
    id: 7,
    name: 'FAAF Double Protein Snack Bites',
    slug: 'double-protein-snack-bites',
    price: 11.99,
    rating: 4.6,
    reviews: 167,
    accent: 'gold',
    category: 'Snacks',
    shortDescription: 'Bite-sized roasted nut and whey protein clusters for instant fuel.',
    description: 'Crispy, chewy, and naturally sweetened. The ultimate guilt-free snack to fuel high-intensity endurance workouts or mid-day cravings.',
    nutritionHighlights: ['15g Protein', 'Gluten Free', 'Real Honey & Nuts', '150 Calories'],
    variants: [
      { id: 'almond-honey', name: 'Almond Honey Crunch (6 Pouches)' },
      { id: 'dark-choc-sea-salt', name: 'Dark Choc Sea Salt (6 Pouches)' },
    ],
  },
  {
    id: 8,
    name: 'FAAF Rapid Recovery Electrolyte Drink',
    slug: 'recovery-electrolyte-drink',
    price: 19.99,
    rating: 4.5,
    reviews: 104,
    accent: 'green',
    category: 'Drinks',
    shortDescription: 'Hypertonic rapid rehydration beverage with key minerals and magnesium.',
    description: 'Formulated to replenish vital ions lost through intense sweat. Features chelated magnesium, potassium citrate, and bio-available vitamins B6 & B12.',
    nutritionHighlights: ['6 Essential Minerals', 'Zero Sugar', 'B-Complex Vitamins', '10 Calories'],
    variants: [
      { id: 'citrus-lime', name: 'Citrus Lime Zing (6 Cans)' },
      { id: 'mango-passion', name: 'Mango Passion Fruit (6 Cans)' },
      { id: 'wild-grape', name: 'Wild Concord Grape (6 Cans)' },
    ],
  },
  {
    id: 9,
    name: 'FAAF Ultimate Transformation Bundle',
    slug: 'ultimate-transformation-bundle',
    price: 69.99,
    originalPrice: 89.99,
    rating: 4.9,
    reviews: 95,
    accent: 'blue',
    category: 'Bundles',
    tag: 'SAVE 20%',
    shortDescription: 'The complete powerhouse stack: Whey Isolate + Creatine + Pre-Workout + Shaker.',
    description: 'Everything you need to break plateaus. Includes 2lbs 100% Pure Whey Isolate, 500g Micronized Creatine, 30-serving Pre-Workout, and a free FAAF Stainless Shaker bottle.',
    nutritionHighlights: ['Full 30-Day Stack', 'Free Stainless Shaker', 'Save $20', 'Free Express Shipping'],
    variants: [
      { id: 'bundle-choc-berry', name: 'Chocolate Whey + Berry Pre-Workout' },
      { id: 'bundle-vanilla-apple', name: 'Vanilla Whey + Sour Apple Pre-Workout' },
    ],
  },
  {
    id: 10,
    name: 'FAAF Daily Performance & Snack Pack',
    slug: 'daily-performance-snack-pack',
    price: 44.99,
    originalPrice: 54.99,
    rating: 4.8,
    reviews: 82,
    accent: 'orange',
    category: 'Bundles',
    tag: 'POPULAR',
    shortDescription: 'All-day fuel pack: 12 Crunch Bars + 4 RTD Shakes + Snack Bites.',
    description: 'Never miss a meal or protein target. Packed with our highest-rated protein bars, ready-to-drink shakes, and nutrient-dense snack bites for peak daily performance.',
    nutritionHighlights: ['12x Crunch Bars', '4x RTD Shakes', '6x Snack Bites', 'Save $10'],
    variants: [
      { id: 'snack-bundle-variety', name: 'All-Flavors Variety Box' },
      { id: 'snack-bundle-chocolate', name: 'All-Chocolate Lover Edition' },
    ],
  },
];

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}
