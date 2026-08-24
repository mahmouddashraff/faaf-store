const { createClient } = require('@supabase/supabase-js');
const url = 'https://wmgzaughcouqrbqaodwr.supabase.co';
const key = 'sb_publishable_ZbB6xNeuQRaMeXs-kPVCeQ_Gqk2Os61';
const supabase = createClient(url, key);

async function test() {
  const { data, error } = await supabase.from('orders').insert({
    order_number: 'FAAF-123458',
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
  console.log('Error:', JSON.stringify(error, null, 2));
  console.log('Data:', data);
}
test();
