#!/usr/bin/env node

// Check what's in the database
const { Client } = require('pg');
// Load environment files in correct order
require('dotenv').config({ path: '.env.development.local' });
require('dotenv').config({ path: '.env.local', override: true });

async function checkDatabase() {
  console.log('🔍 Checking database contents...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    // Check what schemas exist
    const schemas = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast', 'pg_temp_1', 'pg_toast_temp_1')
      ORDER BY schema_name
    `);
    
    console.log('\n📋 Schemas in database:');
    schemas.rows.forEach(row => {
      console.log(`  - ${row.schema_name}`);
    });
    
    // Check tables in each schema
    for (const schema of schemas.rows) {
      const tables = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = $1 
        ORDER BY table_name
      `, [schema.schema_name]);
      
      console.log(`\n📄 Tables in ${schema.schema_name} schema: ${tables.rows.length}`);
      if (tables.rows.length > 0) {
        tables.rows.slice(0, 5).forEach(row => {
          console.log(`  - ${row.table_name}`);
        });
        if (tables.rows.length > 5) {
          console.log(`  ... and ${tables.rows.length - 5} more tables`);
        }
      }
    }
    
    // Check if this is an empty database or has different data
    const allTables = await client.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log(`\n📊 Total tables in public schema: ${allTables.rows[0].count}`);
    
    if (allTables.rows[0].count === '0') {
      console.log('\n❗ Database appears to be empty. The migration may have created a different database.');
      console.log('   Check if "payroll_local" database exists and contains the data.');
    }
    
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
  } finally {
    await client.end();
  }
}

checkDatabase().catch(console.error);