require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkServices() {
  try {
    console.log('Fetching home services...');
    const { data, error } = await supabase
      .from('home_services')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch error:', error);
    } else {
      console.log('Services found:', data.length);
      data.forEach(service => {
        console.log(`- ${service.title} (${service.status})`);
      });
    }
  } catch (err) {
    console.error('Failed:', err);
  }
}

checkServices();