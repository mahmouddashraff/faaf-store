import { createClient } from '@/utils/supabase/client';
import { Product, ProductVariant } from './products';

export async function fetchProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data: dbProducts, error } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('is_archived', false);

  if (error || !dbProducts) {
    console.error('Error fetching products:', error);
    return [];
  }

  return dbProducts.map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    originalPrice: p.original_price || undefined,
    rating: p.rating,
    reviews: p.reviews,
    accent: p.accent,
    image: p.image || undefined,
    flavors: p.flavors ? p.flavors.split(',').map((f: string) => f.trim()).filter((f: string) => f) : [],
    category: p.category as any,
    tag: p.tag || undefined,
    shortDescription: p.short_description,
    description: p.description,
    nutritionHighlights: typeof p.nutrition_highlights === 'string' 
      ? JSON.parse(p.nutrition_highlights) 
      : p.nutrition_highlights,
    variants: p.product_variants.map((v: any) => ({
      id: v.variant_id, // Map DB variant_id back to UI id
      name: v.name,
      price: v.price || undefined,
      inStock: v.in_stock,
      stockQuantity: v.stock_quantity,
    })),
  }));
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createClient();
  const { data: p, error } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('slug', slug)
    .eq('is_archived', false)
    .single();

  if (error || !p) return null;

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    originalPrice: p.original_price || undefined,
    rating: p.rating,
    reviews: p.reviews,
    accent: p.accent,
    image: p.image || undefined,
    flavors: p.flavors ? p.flavors.split(',').map((f: string) => f.trim()).filter((f: string) => f) : [],
    category: p.category as any,
    tag: p.tag || undefined,
    shortDescription: p.short_description,
    description: p.description,
    nutritionHighlights: typeof p.nutrition_highlights === 'string' 
      ? JSON.parse(p.nutrition_highlights) 
      : p.nutrition_highlights,
    variants: p.product_variants.map((v: any) => ({
      id: v.variant_id,
      name: v.name,
      price: v.price || undefined,
      inStock: v.in_stock,
      stockQuantity: v.stock_quantity,
    })),
  };
}
