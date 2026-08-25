const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log('Checking for product-images bucket...');
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error('Error listing buckets:', listError);
    process.exit(1);
  }

  const exists = buckets.find(b => b.name === 'product-images');

  if (exists) {
    console.log('Bucket "product-images" already exists.');
    
    // Ensure it is public
    if (!exists.public) {
        console.log('Bucket is not public. Updating to public...');
        const { error: updateError } = await supabase.storage.updateBucket('product-images', {
            public: true
        });
        if (updateError) {
            console.error('Error making bucket public:', updateError);
        } else {
            console.log('Bucket successfully made public.');
        }
    }
  } else {
    console.log('Bucket "product-images" does not exist. Creating it...');
    const { data, error } = await supabase.storage.createBucket('product-images', {
      public: true,
      allowedMimeTypes: ['image/*'],
    });

    if (error) {
      console.error('Error creating bucket:', error);
      process.exit(1);
    }
    
    console.log('Successfully created public bucket "product-images"!');
  }
}

main();
