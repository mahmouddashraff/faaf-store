'use server';

import { createClient } from '@/utils/supabase/server';

export async function submitReview(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to review.' };
  }

  const productId = formData.get('productId') as string;
  const rating = parseInt(formData.get('rating') as string, 10);
  const reviewText = formData.get('reviewText') as string;

  if (!productId || !rating || !reviewText) {
    return { error: 'Missing required fields.' };
  }

  // Check if verified purchase
  const { data: orders } = await supabase
    .from('orders')
    .select('id')
    .eq('user_id', user.id);

  let isVerified = false;
  if (orders && orders.length > 0) {
    const orderIds = orders.map(o => o.id);
    const { data: purchasedItems } = await supabase
      .from('order_items')
      .select('id')
      .in('order_id', orderIds)
      .eq('product_id', productId);
    
    if (purchasedItems && purchasedItems.length > 0) {
      isVerified = true;
    }
  }

  // Get user details
  const { data: profile } = await supabase
    .from('user_roles')
    .select('first_name, last_name')
    .eq('user_id', user.id)
    .single();

  // Fallback to email username if no name
  let customerName = 'Anonymous';
  if (profile?.first_name) {
    customerName = `${profile.first_name} ${profile.last_name || ''}`.trim();
  } else if (user.email) {
    customerName = user.email.split('@')[0];
  }

  // Insert review
  const { error } = await supabase
    .from('product_reviews')
    .insert({
      product_id: productId,
      user_id: user.id,
      rating,
      review_text: reviewText,
      customer_name: customerName,
      is_verified_purchase: isVerified,
    });

  if (error) {
    if (error.code === '23505') { // Unique violation
      return { error: 'You have already reviewed this product.' };
    }
    return { error: 'Failed to submit review.' };
  }

  // Update product average rating (optional, could be done via DB trigger)
  
  return { success: true };
}
