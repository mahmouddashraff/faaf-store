require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: { user }, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'elkberfahd@gmail.com', // Admin email
    password: 'Password123!' // Assuming standard password or I can just check the DB
  });
  console.log('User:', user?.id, 'AuthErr:', authErr?.message);
  
  if (user) {
    const { data: role, error: roleErr } = await supabase.from('user_roles').select('*').eq('user_id', user.id).single();
    console.log('Role:', role, 'RoleErr:', roleErr?.message);
    
    // Test insert product
    const { data: insert, error: insertErr } = await supabase.from('products').insert([{
      name: 'Test Product',
      slug: 'test-product',
      price: 10.99,
      category: 'Test',
      short_description: 'Test',
      description: 'Test'
    }]);
    
    console.log('InsertErr:', insertErr?.message);
  }
}
run();
