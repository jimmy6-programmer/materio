require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function testInsert() {
  try {
    console.log('Testing insert with service role...');
    const { data, error } = await supabase
      .from('articles')
      .insert([{
        title: 'Test Article',
        description: 'Test description',
        content: 'Test content',
        status: 'draft',
        image: 'test.jpg'
      }])
      .select();

    if (error) {
      console.error('Insert error:', error);
    } else {
      console.log('Insert successful:', data);
    }
  } catch (err) {
    console.error('Failed:', err);
  }
}

testInsert();