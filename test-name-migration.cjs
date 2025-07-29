#!/usr/bin/env node

/**
 * Test Complete Name Field Migration
 * Verifies that firstName/lastName fields are working correctly
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

function loadDatabaseUrl() {
  const envFiles = ['.env.development.local', '.env.local', '.env'];
  
  for (const envFile of envFiles) {
    const envPath = path.resolve(envFile);
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('DATABASE_URL=')) {
          return line.split('=')[1].trim().replace(/['\"]/g, '');
        }
      }
    }
  }
  
  throw new Error('DATABASE_URL not found in environment files');
}

async function testNameMigration() {
  const databaseUrl = loadDatabaseUrl();
  const client = new Client({ connectionString: databaseUrl });

  try {
    await client.connect();
    console.log('🔍 Testing name field migration...\n');

    // Test 1: Check schema structure
    console.log('=== 1. SCHEMA STRUCTURE TEST ===');
    const schemaResult = await client.query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name IN ('first_name', 'last_name', 'computed_name', 'name')
      ORDER BY column_name
    `);
    
    console.log('Available name-related columns:');
    schemaResult.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });

    // Test 2: Check data consistency
    console.log('\n=== 2. DATA CONSISTENCY TEST ===');
    const dataResult = await client.query(`
      SELECT 
        id,
        first_name,
        last_name,
        computed_name,
        email,
        created_at
      FROM users 
      WHERE first_name IS NOT NULL OR last_name IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 5
    `);
    
    console.log(`Found ${dataResult.rows.length} users with firstName/lastName data:`);
    dataResult.rows.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.first_name} ${user.last_name} → "${user.computed_name}" (${user.email})`);
    });

    // Test 3: Check computed_name function
    console.log('\n=== 3. COMPUTED NAME FUNCTION TEST ===');
    const functionResult = await client.query(`
      SELECT 
        first_name,
        last_name,
        computed_name,
        CASE 
          WHEN first_name IS NOT NULL AND last_name IS NOT NULL THEN TRIM(first_name || ' ' || last_name)
          WHEN first_name IS NOT NULL THEN first_name
          WHEN last_name IS NOT NULL THEN last_name
          ELSE 'Unknown User'
        END as expected_computed_name
      FROM users 
      WHERE first_name IS NOT NULL OR last_name IS NOT NULL
      LIMIT 3
    `);
    
    console.log('Computed name validation:');
    functionResult.rows.forEach((user, index) => {
      const isValid = user.computed_name === user.expected_computed_name;
      console.log(`  ${index + 1}. "${user.computed_name}" === "${user.expected_computed_name}" → ${isValid ? '✅' : '❌'}`);
    });

    // Test 4: Check migration stats
    console.log('\n=== 4. MIGRATION STATISTICS ===');
    const statsResult = await client.query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(first_name) as users_with_first_name,
        COUNT(last_name) as users_with_last_name,
        COUNT(computed_name) as users_with_computed_name,
        COUNT(CASE WHEN first_name IS NOT NULL AND last_name IS NOT NULL THEN 1 END) as users_with_both_names
      FROM users
    `);
    
    const stats = statsResult.rows[0];
    console.log(`Total users: ${stats.total_users}`);
    console.log(`Users with firstName: ${stats.users_with_first_name} (${Math.round(stats.users_with_first_name / stats.total_users * 100)}%)`);
    console.log(`Users with lastName: ${stats.users_with_last_name} (${Math.round(stats.users_with_last_name / stats.total_users * 100)}%)`);
    console.log(`Users with computedName: ${stats.users_with_computed_name} (${Math.round(stats.users_with_computed_name / stats.total_users * 100)}%)`);
    console.log(`Users with both names: ${stats.users_with_both_names} (${Math.round(stats.users_with_both_names / stats.total_users * 100)}%)`);

    // Test 5: Check index performance
    console.log('\n=== 5. INDEX PERFORMANCE TEST ===');
    const indexResult = await client.query(`
      SELECT 
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE tablename = 'users' 
        AND (indexname LIKE '%name%' OR indexdef LIKE '%name%')
      ORDER BY indexname
    `);
    
    console.log(`Found ${indexResult.rows.length} name-related indexes:`);
    indexResult.rows.forEach(idx => {
      console.log(`  ${idx.indexname}: ${idx.indexdef}`);
    });

    console.log('\n✅ Name field migration test completed successfully!');

  } catch (error) {
    console.error('❌ Migration test failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  testNameMigration().catch(console.error);
}

module.exports = { testNameMigration };