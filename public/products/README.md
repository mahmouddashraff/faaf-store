# FAAF Fitness Magic — Product Images

Place your product image files in this directory (`/public/products/`).

Recommended naming conventions matching product slugs:
- `pure-whey-isolate.png` (or `.jpg` / `.webp`)
- `protein-crunch-bar.png`
- `creatine-monohydrate.png`
- `hydro-bcaa-electrolytes.png`
- `ready-protein-shake.png`
- `thermo-ignition-pre-workout.png`
- `double-protein-snack-bites.png`
- `recovery-electrolyte-drink.png`
- `ultimate-transformation-bundle.png`
- `daily-performance-snack-pack.png`

Recommended aspect ratio: 1:1 or 4:5 with transparent or clean background.
The `ProductCard` component and `Product` model in `lib/products.ts` will automatically load `image: '/products/your-image.png'` whenever provided.
