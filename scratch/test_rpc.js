require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runTest() {
  const { data, error } = await supabase.rpc('exec_sql', { sql: "select table_name from information_schema.tables where table_schema='public'" });
  console.log('RPC exec_sql:', data, error);
}
runTest();
