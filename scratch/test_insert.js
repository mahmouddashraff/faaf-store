require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runTest() {
  console.log('Testing insert...');
  const newPlan = {
    slug: 'test-slug', title: 'Test', level: 'Beginner', duration: '4 Weeks', days_per_week: 3,
    goal: 'Fat Loss', category: 'Strength', equipment: 'Full Gym', description: 'desc',
    highlights: [], recommended_supplements: [], badge: '', sort_order: 0
  };
  
  const { data, error } = await supabase.from('workout_plans').insert([newPlan]);
  console.log('Insert Result:', data, error);
}
runTest();
