'use server';

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { redirect } from 'next/navigation';

export async function submitCheckout(formData: FormData) {
  // 1. Initialize clients
  const supabase = await createClient(); // For auth
  const adminAuth = createAdminClient(); // For secure DB ops (bypasses RLS)

  const { data: { user } } = await supabase.auth.getUser();

  // 2. Extract and validate fields
  const cartItemsStr = formData.get('cartItems') as string;
  if (!cartItemsStr) {
    return { error: 'Cart is empty' };
  }

  let items;
  try {
    items = JSON.parse(cartItemsStr);
  } catch (e) {
    return { error: 'Invalid cart data' };
  }

  if (!items || items.length === 0) {
    return { error: 'Cart is empty' };
  }

  // 3. Re-fetch the products/variants from Supabase for server-side validation
  const variantIds = items.map((item: any) => item.variant.id);
  const { data: dbVariants, error: fetchError } = await adminAuth
    .from('product_variants')
    .select('*, products(name, price)')
    .in('variant_id', variantIds);

  if (fetchError || !dbVariants || dbVariants.length === 0) {
    console.error('Error fetching variants:', fetchError);
    return { error: 'Failed to validate products. Please try again.' };
  }

  let serverSubtotal = 0;
  const validatedOrderItems = [];

  for (const item of items) {
    const dbVariant = dbVariants.find(v => v.variant_id === item.variant.id);
    
    // 4. Verify every product/variant exists
    if (!dbVariant) {
      return { error: `Product variant not found: ${item.variant.name}` };
    }

    // 5. Verify sufficient stock
    if (dbVariant.stock_quantity < item.quantity) {
      return { error: `Insufficient stock for ${dbVariant.name}. Only ${dbVariant.stock_quantity} remaining.` };
    }

    // 6. Use DATABASE prices, not prices supplied by the browser
    const priceAtPurchase = dbVariant.price !== null ? dbVariant.price : dbVariant.products.price;
    serverSubtotal += priceAtPurchase * item.quantity;

    validatedOrderItems.push({
      product_id: dbVariant.product_id,
      variant_id: dbVariant.id, // Must use the UUID, not the text slug
      product_name: dbVariant.products.name,
      variant_name: dbVariant.name,
      price_at_purchase: priceAtPurchase,
      quantity: item.quantity,
      // For stock deduction later
      current_stock: dbVariant.stock_quantity,
      text_slug: dbVariant.variant_id
    });
  }

  // 7. Calculate subtotal server-side
  // (Done above)

  // 8. Calculate delivery fee server-side
  const deliveryFee = serverSubtotal >= 99 ? 0 : 9.99;

  // 9. Calculate total server-side
  const total = serverSubtotal + deliveryFee;

  const orderNumber = `FAAF-${Math.floor(100000 + Math.random() * 900000)}`;

  const orderData = {
    order_number: orderNumber,
    user_id: user ? user.id : null,
    customer_first_name: formData.get('firstName'),
    customer_last_name: formData.get('lastName'),
    customer_email: formData.get('email'),
    customer_phone: formData.get('phone'),
    country: formData.get('country'),
    city: formData.get('city'),
    address: formData.get('address'),
    apartment: formData.get('apartment') || null,
    delivery_notes: formData.get('notes') || null,
    subtotal: serverSubtotal,
    delivery_fee: deliveryFee,
    total: total,
    payment_method: 'cash_on_delivery',
    payment_status: 'pending',
    order_status: 'pending',
  };

  // 10. Create the order (Using adminAuth to ensure we get the returned record even if user is guest)
  const { data: order, error: orderError } = await adminAuth
    .from('orders')
    .insert(orderData)
    .select('id')
    .single();

  if (orderError || !order) {
    console.error('Order creation error:', JSON.stringify(orderError, null, 2));
    return { error: 'Failed to create order', details: orderError };
  }

  // 11. Create all order_items & 12. Deduct inventory safely
  for (const item of validatedOrderItems) {
    const { error: itemError } = await adminAuth.from('order_items').insert({
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      product_name: item.product_name,
      variant_name: item.variant_name,
      price_at_purchase: item.price_at_purchase,
      quantity: item.quantity,
    });

    if (itemError) {
      console.error('Order item insertion error:', JSON.stringify(itemError, null, 2));
      return { 
        error: `Failed to save order item ${item.product_name}. Please contact support.`,
        details: itemError 
      };
    }

    const newStock = Math.max(0, item.current_stock - item.quantity);
    const { error: stockError } = await adminAuth
      .from('product_variants')
      .update({ stock_quantity: newStock, in_stock: newStock > 0 })
      .eq('id', item.variant_id);
      
    if (stockError) {
      console.error('Stock deduction error:', JSON.stringify(stockError, null, 2));
      return { 
        error: `Failed to update inventory for ${item.product_name}. Please contact support.`,
        details: stockError 
      };
    }
  }

  // 13 & 14. Redirect to success page
  redirect(`/order-confirmation?order=${order.id}`);
}
