import React from 'react';
import Link from 'next/link';
import { fetchAppConfig, HomepageConfig, CategoryConfig } from '@/lib/config';
import { fetchProducts } from '@/lib/supabaseProducts';
import { formatPrice } from '@/lib/products';
import { mealPlans } from '@/lib/mealPlans';
import ProductCard from '@/components/ProductCard';
import MealPlanCard from '@/components/MealPlanCard';
import Newsletter from '@/components/Newsletter';
import CategoryInquiryBanner from '@/components/CategoryInquiry';
import HomepageClient from './HomepageClient'; // We need to move the interactive parts (tabs, quick add) to a client component

export default async function Home() {
  const [homeConfig, categories, allProducts] = await Promise.all([
    fetchAppConfig<HomepageConfig>('homepage_config'),
    fetchAppConfig<CategoryConfig[]>('categories'),
    fetchProducts()
  ]);

  // Provide defaults
  const config = homeConfig || {
    heroTag: "NEW GENERATION ATHLETIC FUEL",
    heroTitle: "UNLOCK YOUR FITNESS MAGIC.",
    heroDescription: "Clinically formulated performance nutrition, ultra-filtered whey isolate, and science-backed supplements engineered to help you conquer every workout.",
    heroButtonText: "EXPLORE CATALOG →",
    heroButtonLink: "/shop",
    showFeatured: true,
    featuredTitle: "BEST SELLING FORMULAS",
    showWhyFaaf: true,
    showTestimonials: true
  };

  const visibleCategories = (categories || []).filter(c => c.isVisible).sort((a, b) => a.sortOrder - b.sortOrder);
  
  // Filter only visible products
  const visibleProducts = allProducts.filter((p: any) => p.is_visible !== false);
  
  // Hero product could be the first featured product, or just the first product
  const heroProduct = visibleProducts.find((p: any) => p.is_featured) || visibleProducts[0];
  
  // Featured products for the slider/grid
  const featuredProducts = visibleProducts.filter((p: any) => p.is_featured);

  return (
    <main>
      <HomepageClient 
        config={config}
        categories={visibleCategories}
        heroProduct={heroProduct}
        featuredProducts={featuredProducts.length > 0 ? featuredProducts : visibleProducts}
      />
    </main>
  );
}
