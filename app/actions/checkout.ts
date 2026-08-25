'use server';

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { redirect } from 'next/navigation';
import { Resend } from 'resend';
import { fetchAppConfig, StoreSettings } from '@/lib/config';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const contactEmail = process.env.CONTACT_EMAIL || 'elkberfahd@gmail.com';
export async function validateCouponAction(code: string) {
  const adminAuth = createAdminClient();
  const { data: coupon, error } = await adminAuth
    .from('promotions')
    .select('*')
    .eq('code', code)
    .eq('active', true)
    .single();
    
  if (error || !coupon) {
    return { error: 'Invalid or inactive coupon' };
  }
  
  return { success: true, coupon };
}

export async function submitCheckout(formData: FormData) {
  // 1. Initialize clients
  const supabase = await createClient(); // For auth
  const adminAuth = createAdminClient(); // For secure DB ops (bypasses RLS)

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Authentication required to checkout. Please log in or create an account.' };
  }

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
    .select('*, products(name, price, flavors)')
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
      return { 
        error: `Insufficient stock for ${dbVariant.name}. Only ${dbVariant.stock_quantity} remaining.`,
        outOfStockCartItemId: item.cartItemId,
        availableQuantity: dbVariant.stock_quantity
      };
    }

    // 6. Use DATABASE prices, not prices supplied by the browser
    const priceAtPurchase = dbVariant.price !== null ? dbVariant.price : dbVariant.products.price;
    serverSubtotal += priceAtPurchase * item.quantity;

    // Verify flavor if selected
    if (item.flavor) {
      const allowedFlavors = dbVariant.products.flavors ? dbVariant.products.flavors.split(',').map((f: string) => f.trim()).filter((f: string) => f) : [];
      if (allowedFlavors.length > 0 && !allowedFlavors.includes(item.flavor)) {
        return { error: `Invalid flavor selected for ${dbVariant.products.name}.` };
      }
    }

    validatedOrderItems.push({
      product_id: dbVariant.product_id,
      variant_id: dbVariant.id, // Must use the UUID, not the text slug
      product_name: dbVariant.products.name,
      variant_name: dbVariant.name,
      price_at_purchase: priceAtPurchase,
      quantity: item.quantity,
      flavor: item.flavor || null,
      // For stock deduction later
      current_stock: dbVariant.stock_quantity,
      text_slug: dbVariant.variant_id
    });
  }

  // 7. Calculate subtotal server-side
  // (Done above)

  // 8. Calculate delivery fee server-side
  const settings = await fetchAppConfig<StoreSettings>('store_settings');
  const threshold = settings?.freeShippingThreshold ?? 99;
  const standardFee = settings?.shippingFee ?? 9.99;
  
  const deliveryFee = serverSubtotal >= threshold ? 0 : standardFee;

  // 9. Calculate total server-side
  let finalDiscountAmount = 0;
  const couponCode = formData.get('couponCode') as string;
  
  if (couponCode) {
    const res = await validateCouponAction(couponCode);
    if (res.coupon && serverSubtotal >= res.coupon.min_order_amount) {
      if (res.coupon.discount_type === 'percentage') {
        finalDiscountAmount = serverSubtotal * (res.coupon.discount_value / 100);
      } else if (res.coupon.discount_type === 'fixed') {
        finalDiscountAmount = res.coupon.discount_value;
      }
      finalDiscountAmount = Math.min(finalDiscountAmount, serverSubtotal);
    }
  }

  const total = serverSubtotal - finalDiscountAmount + deliveryFee;

  const orderNumber = `FAAF-${Math.floor(100000 + Math.random() * 900000)}`;

  // 9b. Safe mapping for payment method to match Postgres enum
  const frontendPaymentMethod = formData.get('paymentMethod') as string;
  let dbPaymentMethod = 'cash_on_delivery'; // default fallback
  
  if (frontendPaymentMethod === 'cod' || frontendPaymentMethod === 'Cash on Delivery') {
    dbPaymentMethod = 'cash_on_delivery';
  } else if (frontendPaymentMethod) {
    dbPaymentMethod = frontendPaymentMethod;
  }

  const orderData = {
    order_number: orderNumber,
    user_id: user.id,
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
    payment_method: dbPaymentMethod,
    payment_status: 'pending',
    order_status: 'pending',
    idempotency_key: formData.get('idempotencyKey') || null,
    coupon_code: couponCode || null,
    discount_amount: finalDiscountAmount > 0 ? finalDiscountAmount : null
  };

  // 10. Create the order AND items AND deduct stock atomically via RPC
  const { data: rpcResult, error: rpcError } = await adminAuth.rpc('process_checkout', {
    p_order_data: orderData,
    p_order_items: validatedOrderItems
  });

  if (rpcError || !rpcResult) {
    console.error('Checkout RPC error:', JSON.stringify(rpcError, null, 2));
    
    // Check if the RPC threw our custom INSUFFICIENT_STOCK json error
    if (rpcError?.message && rpcError.message.includes('INSUFFICIENT_STOCK')) {
      try {
        const errorData = JSON.parse(rpcError.message);
        const matchingItem = validatedOrderItems.find(i => i.variant_id === errorData.variant_id);
        if (matchingItem) {
          return {
            error: `Insufficient stock for ${matchingItem.product_name}. Only ${errorData.available} remaining.`,
            outOfStockCartItemId: `${matchingItem.product_id}-${errorData.variant_id}`,
            availableQuantity: parseInt(errorData.available)
          };
        }
      } catch(e) {}
    }
    
    if (rpcError?.message && rpcError.message.includes('INVALID_COUPON')) {
      try {
        const errorData = JSON.parse(rpcError.message);
        return { error: errorData.message || 'Invalid or inactive coupon code.' };
      } catch(e) {
        return { error: 'Invalid or inactive coupon code.' };
      }
    }
    
    return { error: 'Failed to create order', details: rpcError };
  }

  const orderId = rpcResult.order_id;
  
  // Optional: If it was a duplicate, we could just redirect them to success anyway
  // if (rpcResult.is_duplicate) { console.log('Duplicate order prevented'); }

  // 11. Send Confirmation Emails via Resend
  if (resend && !rpcResult.is_duplicate) {
    try {
      const emailHtml = `
        <h2>Order Confirmed: ${orderNumber}</h2>
        <p>Thank you for your order, ${orderData.customer_first_name}!</p>
        <h3>Order Summary</h3>
        <ul>
          ${validatedOrderItems.map(item => `<li>${item.quantity}x ${item.product_name} (${item.variant_name})</li>`).join('')}
        </ul>
        <p><strong>Total:</strong> $${total.toFixed(2)}</p>
        <p><strong>Payment Method:</strong> Cash on Delivery</p>
        <p><strong>Delivery Address:</strong><br/>
          ${orderData.address} ${orderData.apartment ? `, ${orderData.apartment}` : ''}<br/>
          ${orderData.city}, ${orderData.country}
        </p>
      `;

      // Customer Email
      const customerRes = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: [orderData.customer_email as string],
        subject: `Your FAAF Order ${orderNumber} is Confirmed!`,
        html: emailHtml
      });
      
      if (customerRes.error) {
        console.error('Customer Email Resend API Error:', JSON.stringify(customerRes.error));
      } else {
        console.log('Customer Email Success:', customerRes.data);
      }

      // Admin Email
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: [contactEmail],
        subject: `🚨 New Order Received: ${orderNumber}`,
        html: `<h1>New Order Received!</h1>${emailHtml}<p><strong>Customer Phone:</strong> ${orderData.customer_phone}</p>`
      });
    } catch (emailErr) {
      console.error('Failed to send confirmation emails:', emailErr);
      // We don't want to abort the checkout if email fails, so we just log it
    }
  }

  // 12. Redirect to success page
  redirect(`/order-confirmation?order=${orderId}`);
}
