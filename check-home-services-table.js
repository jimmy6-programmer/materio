require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkTable() {
  try {
    console.log('Checking home_services table...');
    const { data, error } = await supabase
      .from('home_services')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Table check error:', error);
    } else {
      console.log('Table exists, current data:', data);
    }
  } catch (err) {
    console.error('Failed:', err);
  }
}

checkTable();