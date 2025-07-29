#!/usr/bin/env node

// Direct database connection test without env files
const { Client } = require('pg');

async function checkDatabase() {
  console.log('🔍 Checking database state with direct connection...');
  
  const client = new Client({
    host: '192.168.1.229',
    database: 'payroll_local',
    user: 'admin',
    password: 'PostH4rr!51604',
    port: 5432,
    ssl: false
  });

  try {
    await client.connect();
    console.log('✅ Connected to database successfully');
    
    // Check if database exists and has tables
    console.log('\n📋 Checking database structure...');
    
    // Get all schemas
    const schemas = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast', 'pg_temp_1', 'pg_toast_temp_1')
      ORDER BY schema_name
    `);
    
    console.log('📁 Schemas found:');
    for (const schema of schemas.rows) {
      console.log(`  - ${schema.schema_name}`);
      
      // Count tables in each schema
      const tableCount = await client.query(`
        SELECT COUNT(*) as count
        FROM information_schema.tables
        WHERE table_schema = $1
      `, [schema.schema_name]);
      
      console.log(`    Tables: ${tableCount.rows[0].count}`);
    }
    
    // Check for users table specifically
    console.log('\n👥 Checking users table...');
    try {
      const userCount = await client.query('SELECT COUNT(*) as count FROM users');
      console.log(`✅ Users table found with ${userCount.rows[0].count} records`);
      
      // Get sample user data
      const sampleUsers = await client.query('SELECT id, email, first_name, last_name FROM users LIMIT 3');
      console.log('Sample users:');
      sampleUsers.rows.forEach(user => {
        console.log(`  - ${user.first_name} ${user.last_name} (${user.email})`);
      });
      
    } catch (error) {
      console.log('❌ Users table not found or not accessible');
      console.log('Error:', error.message);
    }
    
    // Check for other critical tables
    console.log('\n🏢 Checking other critical tables...');
    const criticalTables = ['clients', 'payrolls', 'user_invitations'];
    
    for (const table of criticalTables) {
      try {
        const count = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`✅ ${table}: ${count.rows[0].count} records`);
      } catch (error) {
        console.log(`❌ ${table}: Not found or not accessible`);
      }
    }
    
    // Total table count
    const totalTables = await client.query(`
      SELECT COUNT(*) as count
      FROM information_schema.tables
      WHERE table_schema NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
    `);
    
    console.log(`\n📊 Total tables in database: ${totalTables.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error connecting to database:', error.message);
    console.error('Full error:', error);
  } finally {
    await client.end();
  }
}

checkDatabase().catch(console.error);