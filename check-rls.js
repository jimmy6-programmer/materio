require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkRLS() {
  try {
    // Check if articles table exists and RLS is enabled
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'articles');

    if (tableError) {
      console.error('Error checking tables:', tableError);
      return;
    }

    if (tables.length === 0) {
      console.log('Articles table does not exist');
      return;
    }

    console.log('Articles table exists');

    // Check RLS policies
    const { data: policies, error: policyError } = await supabase
      .rpc('get_policies_for_table', { table_name: 'articles' });

    if (policyError) {
      console.error('Error checking policies:', policyError);
      // Fallback: try direct query if rpc doesn't work
      const { data: directPolicies, error: directError } = await supabase
        .from('pg_policies')
        .select('*')
        .eq('tablename', 'articles');

      if (directError) {
        console.error('Direct policy check error:', directError);
      } else {
        console.log('RLS Policies for articles:', directPolicies);
      }
    } else {
      console.log('RLS Policies for articles:', policies);
    }

  } catch (err) {
    console.error('Failed:', err);
  }
}

checkRLS();