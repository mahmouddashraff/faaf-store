import { createClient as createServerClient } from '@/utils/supabase/server';
import { createClient as createBrowserClient } from '@/utils/supabase/client';

export type StoreSettings = {
  storeName: string;
  contactEmail: string;
  contactPhone: string;
  shippingFee: number;
  freeShippingThreshold: number;
  announcementActive: boolean;
  announcementText: string;
  socialInstagram: string;
  socialFacebook: string;
};

export type HomepageConfig = {
  heroTag: string;
  heroTitle: string;
  heroDescription: string;
  heroButtonText: string;
  heroButtonLink: string;
  showFeatured: boolean;
  featuredTitle: string;
  showWhyFaaf: boolean;
  showTestimonials: boolean;
};

export type CategoryConfig = {
  name: string;
  slug: string;
  accentClass: string;
  isVisible: boolean;
  sortOrder: number;
};

export type PromotionConfig = {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  isActive: boolean;
};

export async function fetchAppConfig<T>(key: string, isServer: boolean = true): Promise<T | null> {
  const supabase = isServer ? await createServerClient() : createBrowserClient();
  const { data, error } = await supabase
    .from('app_config')
    .select('value')
    .eq('key', key)
    .single();

  if (error || !data) {
    return null;
  }
  return data.value as T;
}

export async function updateAppConfig(key: string, value: any) {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from('app_config')
    .upsert({ key, value, updated_at: new Date().toISOString() });
    
  if (error) {
    console.error(`Failed to update config ${key}:`, error);
    throw new Error('Failed to update configuration.');
  }
}
