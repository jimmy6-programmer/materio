require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testHomeServices() {
  try {
    console.log('Testing home_services query...');
    const { data, error } = await supabase
      .from('home_services')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Query error:', error);
    } else {
      console.log('Home services data:', data);
      console.log('Count:', data.length);
    }
  } catch (err) {
    console.error('Failed:', err);
  }
}

testHomeServices();