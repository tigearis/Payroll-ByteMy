#!/usr/bin/env node

// Clean up neon_auth schema from the database
const { Client } = require('pg');
// Load environment files in correct order
require('dotenv').config({ path: '.env.development.local' });
require('dotenv').config({ path: '.env.local', override: true });

async function cleanupNeonAuth() {
  console.log('🧹 Cleaning up neon_auth schema...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    // Check if neon_auth schema exists
    const schemaExists = await client.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.schemata 
      WHERE schema_name = 'neon_auth'
    `);
    
    if (schemaExists.rows[0].count === '0') {
      console.log('✅ neon_auth schema does not exist - cleanup not needed');
      return;
    }
    
    console.log('📋 neon_auth schema found - removing...');
    
    // Drop the neon_auth schema and all its contents
    await client.query('DROP SCHEMA IF EXISTS neon_auth CASCADE;');
    
    console.log('✅ neon_auth schema removed successfully');
    
    // Verify cleanup
    const verifyCleanup = await client.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.schemata 
      WHERE schema_name = 'neon_auth'
    `);
    
    if (verifyCleanup.rows[0].count === '0') {
      console.log('✅ Cleanup verified - neon_auth schema no longer exists');
    } else {
      console.log('⚠️  Cleanup verification failed - schema may still exist');
    }
    
    // Show final schema list
    const finalSchemas = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast', 'pg_temp_1', 'pg_toast_temp_1')
      ORDER BY schema_name
    `);
    
    console.log('\n📋 Final schemas in database:');
    finalSchemas.rows.forEach(row => {
      console.log(`  - ${row.schema_name}`);
    });
    
    console.log('\n🎉 Database cleanup completed!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
  } finally {
    await client.end();
  }
}

cleanupNeonAuth().catch(console.error);