#!/usr/bin/env node

// Direct database migration using Node.js to avoid pg_dump version issues
const { Client } = require('pg');

// Load environment files in correct order
require('dotenv').config({ path: '.env.development.local' });
require('dotenv').config({ path: '.env.local', override: true });

async function migrateData() {
  console.log('🔄 Starting direct database migration...');
  console.log('From: payroll_local → To: payroll');
  
  const sourceClient = new Client({
    host: '192.168.1.229',
    port: 5432,
    database: 'payroll_local',
    user: 'admin',
    password: 'PostH4rr!51604',
    ssl: false
  });
  
  const targetClient = new Client({
    host: '192.168.1.229',
    port: 5432,
    database: 'payroll',
    user: 'admin',
    password: 'PostH4rr!51604',
    ssl: false
  });

  try {
    // Connect to both databases
    await sourceClient.connect();
    await targetClient.connect();
    
    console.log('✅ Connected to both databases');
    
    // Check source data
    const sourceUsers = await sourceClient.query('SELECT COUNT(*) as count FROM public.users');
    console.log(`📊 Source database has ${sourceUsers.rows[0].count} users`);
    
    if (sourceUsers.rows[0].count === '0') {
      console.log('❌ Source database is empty - nothing to migrate');
      return;
    }
    
    // Get all tables from source
    const tables = await sourceClient.query(`
      SELECT schemaname, tablename 
      FROM pg_tables 
      WHERE schemaname IN ('public', 'audit', 'hdb_catalog')
      ORDER BY schemaname, tablename
    `);
    
    console.log(`📋 Found ${tables.rows.length} tables to migrate`);
    
    // Drop and recreate schema structure in target
    console.log('🧹 Cleaning target database...');
    
    // Disable triggers and constraints temporarily
    await targetClient.query('SET session_replication_role = replica;');
    
    // Drop all tables in target
    for (const table of tables.rows) {
      try {
        await targetClient.query(`DROP TABLE IF EXISTS ${table.schemaname}.${table.tablename} CASCADE`);
      } catch (error) {
        // Ignore errors for non-existent tables
      }
    }
    
    console.log('📝 Copying schema structure...');
    
    // Get schema structure from source
    const schemaDump = await sourceClient.query(`
      SELECT 
        schemaname,
        tablename,
        'CREATE TABLE ' || schemaname || '.' || tablename || ' AS TABLE ' || schemaname || '.' || tablename || ' WITH NO DATA;' as create_stmt
      FROM pg_tables 
      WHERE schemaname IN ('public', 'audit', 'hdb_catalog')
      ORDER BY schemaname, tablename
    `);
    
    // Create tables in target with same structure
    for (const stmt of schemaDump.rows) {
      try {
        await targetClient.query(stmt.create_stmt);
      } catch (error) {
        console.log(`⚠️  Could not create ${stmt.schemaname}.${stmt.tablename}: ${error.message}`);
      }
    }
    
    console.log('📦 Copying data...');
    
    // Copy data table by table
    let successCount = 0;
    for (const table of tables.rows) {
      try {
        // Get data from source
        const data = await sourceClient.query(`SELECT * FROM ${table.schemaname}.${table.tablename}`);
        
        if (data.rows.length > 0) {
          // Clear target table
          await targetClient.query(`DELETE FROM ${table.schemaname}.${table.tablename}`);
          
          // Insert data into target
          const columns = Object.keys(data.rows[0]);
          const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
          const insertQuery = `
            INSERT INTO ${table.schemaname}.${table.tablename} (${columns.join(', ')}) 
            VALUES (${placeholders})
          `;
          
          for (const row of data.rows) {
            const values = columns.map(col => row[col]);
            await targetClient.query(insertQuery, values);
          }
          
          console.log(`  ✅ ${table.schemaname}.${table.tablename}: ${data.rows.length} rows`);
          successCount++;
        } else {
          console.log(`  ⚪ ${table.schemaname}.${table.tablename}: empty`);
        }
      } catch (error) {
        console.log(`  ❌ ${table.schemaname}.${table.tablename}: ${error.message}`);
      }
    }
    
    // Re-enable triggers and constraints
    await targetClient.query('SET session_replication_role = DEFAULT;');
    
    // Verify migration
    const targetUsers = await targetClient.query('SELECT COUNT(*) as count FROM public.users');
    
    console.log('\n🔍 Migration verification:');
    console.log(`  Source users: ${sourceUsers.rows[0].count}`);
    console.log(`  Target users: ${targetUsers.rows[0].count}`);
    console.log(`  Tables processed: ${successCount}/${tables.rows.length}`);
    
    if (sourceUsers.rows[0].count === targetUsers.rows[0].count) {
      console.log('\n🎉 Migration completed successfully!');
      console.log('Your application should now work with the payroll database.');
    } else {
      console.log('\n⚠️  Migration may have issues - user counts don\'t match');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await sourceClient.end();
    await targetClient.end();
  }
}

migrateData().catch(console.error);