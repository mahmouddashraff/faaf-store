import React from 'react';
import { fetchProducts } from '@/lib/supabaseProducts';
import { fetchAppConfig, CategoryConfig } from '@/lib/config';
import ShopClient from './ShopClient';

export default async function ShopPage() {
  const [allProducts, categories] = await Promise.all([
    fetchProducts(),
    fetchAppConfig<CategoryConfig[]>('categories')
  ]);

  // Filter out products marked as hidden by admin
  const visibleProducts = allProducts.filter((p: any) => p.is_visible !== false);
  
  const visibleCategories = (categories || []).filter(c => c.isVisible).sort((a, b) => a.sortOrder - b.sortOrder);

  return <ShopClient products={visibleProducts} categories={visibleCategories} />;
}
