import React from 'react';
import { fetchProducts } from '@/lib/supabaseProducts';
import ShopClient from './ShopClient';

export default async function ShopPage() {
  const products = await fetchProducts();
  return <ShopClient products={products} />;
}
