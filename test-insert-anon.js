require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsertAnon() {
  try {
    console.log('Testing insert with anon key...');
    const { data, error } = await supabase
      .from('articles')
      .insert([{
        title: 'Test Article Anon',
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

testInsertAnon();