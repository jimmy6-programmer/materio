require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const sql = fs.readFileSync('fix-articles-rls.sql', 'utf8');

async function applyRLS() {
  try {
    // Split SQL into statements
    const statements = sql.split(';').filter(s => s.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.trim());
        // Note: Supabase client doesn't support raw SQL, so this won't work.
        // User needs to run this in Supabase SQL editor.
      }
    }

    console.log('Please run the SQL in Supabase SQL editor manually.');
  } catch (err) {
    console.error('Failed:', err);
  }
}

applyRLS();