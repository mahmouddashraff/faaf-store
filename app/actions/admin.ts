'use server';

import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { updateAppConfig } from '@/lib/config';

async function requireAdmin() {
  const { cookies } = await import('next/headers');
  const cookieStore = cookies();
  console.log('requireAdmin Cookies:', cookieStore.getAll().map(c => c.name));
  
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    console.error('requireAdmin userError:', userError);
  }
  
  if (!user) {
    throw new Error('RequireAdmin: No user found. userError: ' + (userError?.message || 'none'));
  }
  
  const { data: roleData, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (roleError) {
    console.error('requireAdmin roleError:', roleError);
    throw new Error('RequireAdmin: Role check failed: ' + roleError.message);
  }

  if (roleData?.role !== 'admin') {
    throw new Error('RequireAdmin: Forbidden, role is ' + roleData?.role);
  }
  return supabase;
}

// ------------------------------------------------------------------
// PRODUCTS & INVENTORY
// ------------------------------------------------------------------

export async function saveProductAction(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const id = formData.get('id') as string;
  const isNew = formData.get('isNew') === 'true';
  const name = formData.get('name') as string;
  
  // Extract values
  const payload: any = {
    name,
    price: parseFloat(formData.get('price') as string),
    original_price: formData.get('original_price') ? parseFloat(formData.get('original_price') as string) : null,
    category: formData.get('category'),
    tag: formData.get('tag') || null,
    badge: formData.get('badge') || null,
    short_description: formData.get('short_description'),
    description: formData.get('description'),
    is_visible: formData.get('is_visible') === 'on',
    is_featured: formData.get('is_featured') === 'on',
    accent: formData.get('accent') || '#dfb76c',
  };

  // Handle Flavors (comma separated)
  const rawFlavors = formData.get('flavors') as string;
  payload.flavors = rawFlavors 
    ? rawFlavors.split(',').map(f => f.trim()).filter(f => f).join(', ') 
    : null;

  // Generate slug only if it's a new product
  if (isNew) {
    payload.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  // Handle Nutrition Highlights
  let nutrition = [];
  try {
    const rawNutrition = formData.get('nutrition_highlights') as string;
    nutrition = JSON.parse(rawNutrition);
  } catch (err) {}
  payload.nutrition_highlights = nutrition;

  // Handle Image Upload
  const imageFile = formData.get('imageFile') as File;
  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split('.').pop() || 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    
    // Convert File to Buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Use Service Role key for upload to bypass Storage RLS requirement
    const adminSupabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: uploadData, error: uploadError } = await adminSupabase.storage
      .from('product-images')
      .upload(filename, buffer, {
        contentType: imageFile.type,
      });

    if (uploadError) {
      console.error('saveProductAction image upload error:', uploadError);
      throw new Error(`Image upload failed: ${uploadError.message}`);
    }

    const { data: publicUrlData } = adminSupabase.storage
      .from('product-images')
      .getPublicUrl(filename);
      
    payload.image = publicUrlData.publicUrl;
  }
  
  if (isNew) {
    // We must have an image on insert, fallback just in case
    if (!payload.image) {
      payload.image = '/placeholder.jpg';
    }

    const { data, error } = await supabase.from('products').insert([payload]).select().single();
    if (error) {
      console.error('saveProductAction insert error:', error);
      throw new Error(`Insert failed: ${error.message} (Code: ${error.code})`);
    }
    // Create a default variant
    const { error: variantError } = await supabase.from('product_variants').insert([{
      product_id: data.id,
      variant_id: `${payload.slug}-default`,
      name: 'Default',
      price: null,
      stock_quantity: 100,
      in_stock: true
    }]);
    if (variantError) {
      console.error('saveProductAction variant insert error:', variantError);
      throw new Error(`Variant insert failed: ${variantError.message} (Code: ${variantError.code})`);
    }
  } else {
    const { error } = await supabase.from('products').update(payload).eq('id', id);
    if (error) {
      console.error('saveProductAction update error:', error);
      throw new Error(`Update failed: ${error.message} (Code: ${error.code})`);
    }
  }
  revalidatePath('/admin');
  revalidatePath('/shop');
  revalidatePath('/');
}

export async function archiveProductAction(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from('products').update({ is_archived: true, is_visible: false }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin');
  revalidatePath('/shop');
  revalidatePath('/');
}

export async function restoreProductAction(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from('products').update({ is_archived: false, is_visible: true }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin');
  revalidatePath('/shop');
  revalidatePath('/');
}

export async function permanentlyDeleteProductAction(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin');
  revalidatePath('/shop');
  revalidatePath('/');
}

export async function toggleProductFlagAction(productId: string, flag: 'is_visible' | 'is_featured', currentValue: boolean) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from('products').update({ [flag]: !currentValue }).eq('id', productId);
  if (error) throw error;
  revalidatePath('/admin');
  revalidatePath('/shop');
  revalidatePath('/');
}

export async function updateStockAction(variantId: string, newStock: number) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from('product_variants').update({ 
    stock_quantity: newStock,
    in_stock: newStock > 0 
  }).eq('variant_id', variantId);
  if (error) throw error;
  revalidatePath('/admin');
  revalidatePath('/shop');
}

// ------------------------------------------------------------------
// APP CONFIGURATIONS
// ------------------------------------------------------------------

export async function saveAppConfigAction(key: string, value: any) {
  await requireAdmin();
  await updateAppConfig(key, value);
  revalidatePath('/admin');
  revalidatePath('/shop');
  revalidatePath('/');
}

// ------------------------------------------------------------------
// ORDERS
// ------------------------------------------------------------------

export async function updateOrderStatusAction(orderId: string, status: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from('orders').update({ order_status: status }).eq('id', orderId);
  if (error) throw error;
  revalidatePath('/admin');
}

// ------------------------------------------------------------------
// REVIEWS
// ------------------------------------------------------------------

export async function updateReviewStatusAction(reviewId: string, status: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from('product_reviews').update({ status }).eq('id', reviewId);
  if (error) throw error;
  revalidatePath('/admin');
}

export async function deleteReviewAction(reviewId: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from('product_reviews').delete().eq('id', reviewId);
  if (error) throw error;
  revalidatePath('/admin');
}
