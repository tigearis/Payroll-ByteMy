#!/usr/bin/env node

// Simple database connection test using the environment configuration
const { Client } = require('pg');
// Load environment files in correct order
require('dotenv').config({ path: '.env.development.local' });
require('dotenv').config({ path: '.env.local', override: true });

async function testConnection() {
  console.log('🔍 Testing database connection...');
  console.log('Using DATABASE_URL from .env.local');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('✅ Database connection successful!');
    
    // Test basic query
    const result = await client.query('SELECT COUNT(*) as user_count FROM public.users');
    console.log(`✅ Users table accessible: ${result.rows[0].user_count} users found`);
    
    // Test schema structure
    const schemaResult = await client.query(`
      SELECT schemaname, COUNT(*) as table_count 
      FROM pg_tables 
      WHERE schemaname IN ('public', 'audit', 'hdb_catalog') 
      GROUP BY schemaname 
      ORDER BY schemaname
    `);
    
    console.log('✅ Schema verification:');
    schemaResult.rows.forEach(row => {
      console.log(`  ${row.schemaname}: ${row.table_count} tables`);
    });
    
    // Test for neon_auth exclusion
    const neonAuthCheck = await client.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.schemata 
      WHERE schema_name = 'neon_auth'
    `);
    
    if (neonAuthCheck.rows[0].count === '0') {
      console.log('✅ neon_auth schema successfully excluded');
    } else {
      console.log('⚠️  neon_auth schema still exists');
    }
    
    console.log('');
    console.log('🎉 Database migration verification complete!');
    console.log('Your application should now work with the local PostgreSQL database.');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('');
    console.log('💡 Troubleshooting tips:');
    console.log('1. Verify PostgreSQL is running on 192.168.1.229:5432');
    console.log('2. Check that user "admin" has access to "payroll" database');
    console.log('3. Verify password is correct');
    console.log('4. Check PostgreSQL authentication configuration');
  } finally {
    await client.end();
  }
}

testConnection().catch(console.error);