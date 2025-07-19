#!/usr/bin/env node

/**
 * Database Seeding Script for Pitch Deck AI
 * 
 * This script populates the database with sample pitch decks and slides
 * across various industries for development and demonstration purposes.
 * 
 * Usage:
 *   node seed.js [--reset] [--users]
 * 
 * Options:
 *   --reset  Drop existing data before seeding
 *   --users  Also create sample users (requires admin privileges)
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Environment configuration
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration. Please check your .env file.');
  console.error('Required variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Sample user data for testing
 */
const SAMPLE_USERS = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'sarah.chen@taskflow.ai',
    password: 'demo123!',
    metadata: { 
      full_name: 'Sarah Chen',
      company: 'TaskFlow AI',
      role: 'CEO & Co-founder'
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'maya.patel@ecothreads.com',
    password: 'demo123!',
    metadata: { 
      full_name: 'Maya Patel',
      company: 'EcoThreads',
      role: 'Founder & CEO'
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    email: 'marcus.rodriguez@neobiz.com',
    password: 'demo123!',
    metadata: { 
      full_name: 'Marcus Rodriguez',
      company: 'NeoBiz Financial',
      role: 'CEO'
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    email: 'lisa.kim@mindbridge.health',
    password: 'demo123!',
    metadata: { 
      full_name: 'Dr. Lisa Kim',
      company: 'MindBridge Health',
      role: 'CEO & Co-founder'
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    email: 'alex.thompson@skillforge.com',
    password: 'demo123!',
    metadata: { 
      full_name: 'Alex Thompson',
      company: 'SkillForge',
      role: 'Founder & CEO'
    }
  }
];

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  return {
    reset: args.includes('--reset'),
    users: args.includes('--users'),
    help: args.includes('--help') || args.includes('-h')
  };
}

/**
 * Display help information
 */
function showHelp() {
  console.log(`
📚 Pitch Deck AI Database Seeding Script

Usage: node seed.js [options]

Options:
  --reset   Drop existing sample data before seeding
  --users   Create sample users (requires service role key)
  --help    Show this help message

Examples:
  node seed.js                    # Seed data with existing users
  node seed.js --reset            # Clear existing data and reseed
  node seed.js --users --reset    # Create users and seed all data

Note: Creating users requires SUPABASE_SERVICE_ROLE_KEY in your .env file.
For production, users should be created through the Supabase Auth interface.
  `);
}

/**
 * Clean existing sample data
 */
async function cleanExistingData() {
  console.log('🧹 Cleaning existing sample data...');
  
  try {
    // Delete in reverse order of dependencies
    await supabase.from('slide_versions').delete().in('slide_id', [
      '660e8400-e29b-41d4-a716-446655440002'
    ]);
    
    await supabase.from('slides').delete().in('pitch_deck_id', [
      '550e8400-e29b-41d4-a716-446655440001',
      '550e8400-e29b-41d4-a716-446655440002',
      '550e8400-e29b-41d4-a716-446655440003',
      '550e8400-e29b-41d4-a716-446655440004',
      '550e8400-e29b-41d4-a716-446655440005'
    ]);
    
    await supabase.from('pitch_decks').delete().in('id', [
      '550e8400-e29b-41d4-a716-446655440001',
      '550e8400-e29b-41d4-a716-446655440002',
      '550e8400-e29b-41d4-a716-446655440003',
      '550e8400-e29b-41d4-a716-446655440004',
      '550e8400-e29b-41d4-a716-446655440005'
    ]);
    
    console.log('✅ Existing sample data cleaned');
  } catch (error) {
    console.warn('⚠️  Some cleanup operations failed (this is normal if data doesn\'t exist)');
    console.warn('Error:', error.message);
  }
}

/**
 * Create sample users (requires service role key)
 */
async function createSampleUsers() {
  console.log('👥 Creating sample users...');
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY not found. Skipping user creation.');
    console.warn('   Sample data will use placeholder user IDs.');
    console.warn('   Create users manually in Supabase Auth dashboard, then update the sample data.');
    return false;
  }
  
  let successCount = 0;
  
  for (const user of SAMPLE_USERS) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        user_metadata: user.metadata,
        email_confirm: true
      });
      
      if (error) {
        if (error.message.includes('already registered')) {
          console.log(`   ⏭️  User ${user.email} already exists`);
        } else {
          console.error(`   ❌ Failed to create user ${user.email}:`, error.message);
        }
      } else {
        console.log(`   ✅ Created user: ${user.email}`);
        successCount++;
      }
    } catch (error) {
      console.error(`   ❌ Error creating user ${user.email}:`, error.message);
    }
  }
  
  console.log(`✅ User creation completed. ${successCount}/${SAMPLE_USERS.length} users created.`);
  return true;
}

/**
 * Execute SQL file
 */
async function executeSqlFile(filepath) {
  console.log(`📄 Executing SQL file: ${path.basename(filepath)}`);
  
  try {
    const sql = fs.readFileSync(filepath, 'utf8');
    
    // Split SQL into individual statements (simple approach)
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
      .filter(stmt => !stmt.match(/^\s*$/));
    
    let successCount = 0;
    let skipCount = 0;
    
    for (const statement of statements) {
      try {
        if (statement.toLowerCase().includes('insert into')) {
          // Execute INSERT statements using supabase-js for better error handling
          const match = statement.match(/INSERT INTO (\w+)/i);
          if (match) {
            // For complex inserts, use raw SQL
            const { error } = await supabase.rpc('execute_sql', { 
              sql_query: statement + ';' 
            });
            
            if (error) {
              // Try direct method if RPC not available
              const response = await fetch(`${supabaseUrl}/rest/v1/rpc/execute_sql`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${supabaseKey}`,
                  'apikey': supabaseKey
                },
                body: JSON.stringify({ sql_query: statement + ';' })
              });
              
              if (!response.ok) {
                console.warn(`   ⚠️  Skipping statement (may already exist)`);
                skipCount++;
                continue;
              }
            }
          }
        }
        successCount++;
      } catch (error) {
        if (error.message && error.message.includes('already exists')) {
          console.log(`   ⏭️  Data already exists, skipping...`);
          skipCount++;
        } else {
          console.warn(`   ⚠️  Statement failed:`, error.message);
          skipCount++;
        }
      }
    }
    
    console.log(`✅ SQL execution completed. ${successCount} statements succeeded, ${skipCount} skipped.`);
    return true;
  } catch (error) {
    console.error('❌ Failed to execute SQL file:', error.message);
    return false;
  }
}

/**
 * Seed data using direct Supabase client
 */
async function seedData() {
  console.log('🌱 Seeding sample data...');
  
  try {
    // Read and parse the sample data
    const sqlPath = path.join(__dirname, 'sample-data.sql');
    
    if (!fs.existsSync(sqlPath)) {
      console.error('❌ Sample data file not found:', sqlPath);
      return false;
    }
    
    return await executeSqlFile(sqlPath);
  } catch (error) {
    console.error('❌ Failed to seed data:', error.message);
    return false;
  }
}

/**
 * Verify seeded data
 */
async function verifyData() {
  console.log('🔍 Verifying seeded data...');
  
  try {
    const { data: decks, error: decksError } = await supabase
      .from('pitch_decks')
      .select('id, title, company_name')
      .limit(10);
    
    if (decksError) {
      console.error('❌ Failed to verify pitch decks:', decksError.message);
      return false;
    }
    
    const { data: slides, error: slidesError } = await supabase
      .from('slides')
      .select('id, title, slide_type')
      .limit(10);
    
    if (slidesError) {
      console.error('❌ Failed to verify slides:', slidesError.message);
      return false;
    }
    
    console.log(`✅ Verification complete:`);
    console.log(`   📊 ${decks?.length || 0} pitch decks found`);
    console.log(`   📄 ${slides?.length || 0} slides found`);
    
    if (decks && decks.length > 0) {
      console.log(`\n📚 Sample Pitch Decks:`);
      decks.forEach((deck, index) => {
        console.log(`   ${index + 1}. ${deck.company_name}: ${deck.title}`);
      });
    }
    
    return true;
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    return false;
  }
}

/**
 * Main execution function
 */
async function main() {
  const args = parseArgs();
  
  if (args.help) {
    showHelp();
    return;
  }
  
  console.log('🚀 Starting Pitch Deck AI Database Seeding\n');
  console.log(`📡 Supabase URL: ${supabaseUrl}`);
  console.log(`🔑 Using ${process.env.SUPABASE_SERVICE_ROLE_KEY ? 'service role' : 'anon'} key\n`);
  
  try {
    // Step 1: Clean existing data if requested
    if (args.reset) {
      await cleanExistingData();
    }
    
    // Step 2: Create sample users if requested
    if (args.users) {
      await createSampleUsers();
    }
    
    // Step 3: Seed the data
    const seedSuccess = await seedData();
    if (!seedSuccess) {
      console.error('❌ Seeding failed. Check the errors above.');
      process.exit(1);
    }
    
    // Step 4: Verify the data
    const verifySuccess = await verifyData();
    if (!verifySuccess) {
      console.warn('⚠️  Verification had issues, but seeding may have succeeded.');
    }
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Visit your Pitch Deck AI application');
    console.log('   2. Sign in with one of the sample user accounts (if created)');
    console.log('   3. Explore the sample pitch decks');
    console.log('   4. Use the sample data as templates for new pitch decks');
    
    if (!args.users && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log('\n💡 Tip: To create sample users automatically, add SUPABASE_SERVICE_ROLE_KEY');
      console.log('   to your .env file and run: node seed.js --users --reset');
    }
    
  } catch (error) {
    console.error('❌ Seeding process failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = {
  main,
  createSampleUsers,
  seedData,
  verifyData,
  SAMPLE_USERS
};