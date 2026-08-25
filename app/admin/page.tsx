import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { fetchAppConfig } from '@/lib/config';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // We fetch EVERYTHING here in parallel so the client component has everything it needs for instant tab switching.
  
  const [
    { data: orders },
    { data: products },
    { data: reviews },
    storeSettings,
    homepageConfig,
    categories,
    promotions
  ] = await Promise.all([
    supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false }),
    supabase
      .from('products')
      .select('*, product_variants(*)')
      .order('id', { ascending: true }),
    supabase
      .from('product_reviews')
      .select('*, products(name)')
      .order('created_at', { ascending: false }),
    fetchAppConfig('store_settings'),
    fetchAppConfig('homepage_config'),
    fetchAppConfig('categories'),
    fetchAppConfig('promotions')
  ]);

  const initialData = {
    orders: orders || [],
    products: products || [],
    reviews: reviews || [],
    storeSettings: storeSettings || {},
    homepageConfig: homepageConfig || {},
    categories: categories || [],
    promotions: promotions || []
  };

  return <AdminDashboardClient initialData={initialData} />;
}
