require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const seededTitles = [
  'Professional Cleaning Service',
  'Gardening & Landscaping',
  'Home Repairs & Maintenance',
  'Pest Control Services',
  'Home Security Installation',
  'Interior Painting'
];

async function deleteSeededServices() {
  try {
    console.log('Deleting seeded home services...');
    const { data, error } = await supabase
      .from('home_services')
      .delete()
      .in('title', seededTitles)
      .select();

    if (error) {
      console.error('Delete error:', error);
    } else {
      console.log('Delete successful:', data.length, 'services deleted');
    }
  } catch (err) {
    console.error('Failed:', err);
  }
}

deleteSeededServices();