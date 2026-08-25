'use server';

import { createAdminClient } from '@/utils/supabase/admin';

export interface Promotion {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_order_amount: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getPromotionsAction() {
  const adminAuth = createAdminClient();
  const { data, error } = await adminAuth
    .from('promotions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching promotions:', error);
    return { error: 'Failed to fetch promotions' };
  }
  return { promotions: data as Promotion[] };
}

export async function savePromotionAction(promo: Partial<Promotion>) {
  const adminAuth = createAdminClient();
  
  // Format code
  const code = promo.code?.toUpperCase().replace(/\s+/g, '');
  if (!code) return { error: 'Code is required' };

  // Validate discount value
  let discount_value = promo.discount_value || 0;
  if (promo.discount_type === 'percentage') {
    discount_value = Math.max(0, Math.min(100, discount_value));
  }

  let min_order_amount = promo.min_order_amount || 0;
  if (min_order_amount < 0) min_order_amount = 0;

  const payload = {
    code,
    discount_type: promo.discount_type || 'percentage',
    discount_value,
    min_order_amount,
    active: promo.active ?? true,
    updated_at: new Date().toISOString()
  };

  if (promo.id && !promo.id.startsWith('new_')) {
    // Update existing
    const { data, error } = await adminAuth
      .from('promotions')
      .update(payload)
      .eq('id', promo.id)
      .select()
      .single();
    
    if (error) {
      if (error.code === '23505') return { error: 'Duplicate coupon code' };
      return { error: error.message };
    }
    return { success: true, promotion: data as Promotion };
  } else {
    // Insert new
    const { data, error } = await adminAuth
      .from('promotions')
      .insert([payload])
      .select()
      .single();
      
    if (error) {
      if (error.code === '23505') return { error: 'Duplicate coupon code' };
      return { error: error.message };
    }
    return { success: true, promotion: data as Promotion };
  }
}

export async function deletePromotionAction(id: string) {
  const adminAuth = createAdminClient();
  const { error } = await adminAuth
    .from('promotions')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }
  return { success: true };
}
