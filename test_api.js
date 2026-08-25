const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wmgzaughcouqrbqaodwr.supabase.co';
const supabaseKey = 'sb_publishable_ZbB6xNeuQRaMeXs-kPVCeQ_Gqk2Os61';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  // 1. Sign in
  const { data: { session }, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'elkberfahd@gmail.com', // Admin email
    password: 'Password123!' 
  });
  
  if (authErr || !session) {
    console.error('Auth failed:', authErr);
    return;
  }
  
  console.log('Logged in successfully. Token:', session.access_token.substring(0, 15) + '...');
  
  // 2. Fetch the test API route with the cookie
  // Supabase sets sb-[ref]-auth-token cookie.
  // Next.js @supabase/ssr expects specific cookie names depending on configuration, usually sb-[ref]-auth-token.
  
  const ref = supabaseUrl.split('.')[0].replace('https://', '');
  const cookieName = `sb-${ref}-auth-token`;
  
  // Construct the cookie value
  // Supabase SSR auth token is a JSON array: [access_token, refresh_token] OR sometimes base64 encoded.
  // In Next.js with @supabase/ssr, the cookie value is JSON stringified array of tokens.
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
