#!/usr/bin/env node

// Check the current state of the payroll database
const { Client } = require('pg');

async function checkPayrollDatabase() {
  console.log('🔍 Checking payroll database state...');
  
  const client = new Client({
    host: '192.168.1.229',
    database: 'payroll',
    user: 'admin',
    password: 'PostH4rr!51604',
    port: 5432,
    ssl: false
  });

  try {
    await client.connect();
    console.log('✅ Connected to payroll database successfully');
    
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
        WHERE table_schema = $1 AND table_type = 'BASE TABLE'
      `, [schema.schema_name]);
      
      console.log(`    Tables: ${tableCount.rows[0].count}`);
    }
    
    // Check for users table specifically
    console.log('\n👥 Checking for existing data...');
    try {
      const userCount = await client.query('SELECT COUNT(*) as count FROM users');
      console.log(`✅ Users table found with ${userCount.rows[0].count} records`);
    } catch (error) {
      console.log('❌ Users table not found - database appears empty');
    }
    
    // Total table count
    const totalTables = await client.query(`
      SELECT COUNT(*) as count
      FROM information_schema.tables
      WHERE table_schema NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
      AND table_type = 'BASE TABLE'
    `);
    
    console.log(`\n📊 Total tables in payroll database: ${totalTables.rows[0].count}`);
    
    if (totalTables.rows[0].count === '0') {
      console.log('🔄 Database is empty - ready for migration');
    } else {
      console.log('⚠️  Database contains data - will need to clear before migration');
    }
    
  } catch (error) {
    console.error('❌ Error connecting to payroll database:', error.message);
    
    if (error.message.includes('database "payroll" does not exist')) {
      console.log('\n💡 Need to create payroll database first');
    }
  } finally {
    await client.end();
  }
}

checkPayrollDatabase().catch(console.error);