const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const url = 'https://wmgzaughcouqrbqaodwr.supabase.co';
const key = 'sb_publishable_ZbB6xNeuQRaMeXs-kPVCeQ_Gqk2Os61';
const supabase = createClient(url, key);

async function test() {
  const orderId = crypto.randomUUID();
  const { error } = await supabase.from('orders').insert({
    id: orderId,
    order_number: 'FAAF-123459',
    user_id: null,
    customer_first_name: 'Test',
    customer_last_name: 'User',
    customer_email: 'test_auto@example.com',
    customer_phone: '1234567890',
    country: 'US',
    city: 'NY',
    address: '123 Test St',
    subtotal: 10.0,
    delivery_fee: 5.0,
    total: 15.0,
    payment_method: 'cash_on_delivery',
    payment_status: 'pending',
    order_status: 'pending'
  });
  console.log('Order Error:', error);

  if (!error) {
    const { error: itemError } = await supabase.from('order_items').insert({
      order_id: orderId,
      product_name: 'Test',
      variant_name: 'Test Variant',
      price_at_purchase: 10.0,
      quantity: 1
    });
    console.log('Order Item Error:', itemError);
  }
}
test();
