const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, serviceKey);
const supabaseAnon = createClient(supabaseUrl, anonKey);

async function run() {
  const email = 'testadmin1@example.com';
  const password = 'Password123!';

  // 1. Create admin user
  let { data: { user }, error: createErr } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });
  
  if (createErr && createErr.message.includes('already been registered')) {
    // try to get the user
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    user = users.users.find(u => u.email === email);
    if (user) {
      await supabaseAdmin.auth.admin.updateUserById(user.id, { password });
    }
  } else if (createErr) {
    console.error('Create user error:', createErr);
    return;
  }
  
  // 2. Set as admin in user_roles
  if (user) {
    await supabaseAdmin.from('user_roles').upsert({ user_id: user.id, role: 'admin' });
    console.log('User created and set as admin:', user.id);
  }

  // 3. Login
  const { data: { session }, error: authErr } = await supabaseAnon.auth.signInWithPassword({
    email,
    password
  });
  
  if (authErr || !session) {
    console.error('Auth failed:', authErr);
    return;
  }
  
  console.log('Logged in. Token:', session.access_token.substring(0, 15) + '...');
  
  // 4. Fetch the test API route with the cookie
  const ref = supabaseUrl.split('.')[0].replace('https://', '');
  const cookieName = `sb-${ref}-auth-token`;
  const cookieValue = JSON.stringify([session.access_token, session.refresh_token, null, null, null]);
  
  try {
    const res = await fetch('http://localhost:3000/api/test-rls', {
      headers: {
        'Cookie': `${cookieName}=${encodeURIComponent(cookieValue)}`
      }
    });
    
    const text = await res.text();
    console.log('API Response status:', res.status);
    console.log('API Response body:', text);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}
run();
