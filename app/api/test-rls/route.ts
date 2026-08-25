import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authErr } = await supabase.auth.getUser();

  if (authErr) {
    console.log('API getUser error:', authErr);
  }

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized user', authErr: authErr?.message }, { status: 401 });
  }

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (roleData?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data: insert, error: insertErr } = await supabase.from('products').insert([{
    name: 'API Test Product',
    slug: 'api-test-product',
    price: 5.99,
    category: 'Test',
    short_description: 'Test',
    description: 'Test'
  }]);

  return NextResponse.json({
    user: user.id,
    role: roleData,
    insertErr: insertErr?.message || null
  });
}
