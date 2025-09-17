#!/usr/bin/env bun

// Script to create ESPN-style views in Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Try anon key if service key not available
const supabaseKey = supabaseServiceKey || process.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.log('Please ensure you have set:');
  console.log('  VITE_SUPABASE_URL');
  console.log('  VITE_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createESPNViews() {
  console.log('📊 Creating ESPN-style views in Supabase...\n');

  // Read the SQL file
  const sqlPath = path.join(process.cwd(), 'database', 'create-espn-views.sql');
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');

  // Split into individual statements (by semicolon followed by newline)
  const statements = sqlContent
    .split(/;\s*\n/)
    .filter(stmt => stmt.trim() && !stmt.trim().startsWith('--'))
    .map(stmt => stmt.trim() + ';');

  console.log(`Found ${statements.length} SQL statements to execute\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];

    // Extract view/grant name for logging
    const viewMatch = statement.match(/CREATE OR REPLACE VIEW (\w+)/);
    const grantMatch = statement.match(/GRANT .* ON (\w+)/);
    const name = viewMatch?.[1] || grantMatch?.[1] || `Statement ${i + 1}`;

    console.log(`${i + 1}. Executing: ${name}...`);

    try {
      // Execute the SQL statement using RPC
      const { error } = await supabase.rpc('exec_sql', {
        sql: statement
      }).single();

      if (error) {
        // Try direct execution as fallback
        console.log('   ⚠️  RPC failed, trying alternative method...');

        // For now, we'll just note that the view needs to be created manually
        console.log(`   ℹ️  Please create this view manually in Supabase SQL Editor`);
        errorCount++;
      } else {
        console.log(`   ✅ Successfully created ${name}`);
        successCount++;
      }
    } catch (err) {
      console.error(`   ❌ Error: ${err}`);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📋 SUMMARY:');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successCount} statements`);
  if (errorCount > 0) {
    console.log(`⚠️  Failed: ${errorCount} statements`);
    console.log('\n📌 Manual Steps Required:');
    console.log('1. Go to your Supabase project SQL Editor');
    console.log(`2. Copy the SQL from: database/create-espn-views.sql`);
    console.log('3. Execute the SQL statements manually');
    console.log('\nThis is needed because creating views requires admin privileges.');
  } else {
    console.log('✅ All views created successfully!');
  }

  // Test if the views work
  console.log('\n🧪 Testing ESPN views...\n');

  try {
    const { data, error } = await supabase
      .from('player_tournament_results_espn')
      .select('*')
      .eq('player_id', 1)
      .limit(1);

    if (!error && data) {
      console.log('✅ ESPN view is working!');
      console.log(`   Found ${data.length} results`);
    } else if (error?.code === '42P01') {
      console.log('⚠️  ESPN view does not exist yet');
      console.log('   Please create it manually in Supabase SQL Editor');
    } else {
      console.log('⚠️  Could not verify ESPN view:', error?.message);
    }
  } catch (err) {
    console.log('⚠️  Could not test ESPN view:', err);
  }
}

// Run the script
createESPNViews().catch(console.error);