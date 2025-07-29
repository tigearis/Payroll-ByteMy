#!/usr/bin/env node

// Check for audit_log tables in different schemas
const { Client } = require('pg');

async function checkAuditTables() {
  console.log('🔍 Checking for audit_log tables in all schemas...');
  
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
    console.log('✅ Connected to database');
    
    // Check for audit_log tables in all schemas
    const auditTables = await client.query(`
      SELECT 
        schemaname, 
        tablename, 
        tableowner
      FROM pg_tables 
      WHERE tablename LIKE '%audit_log%'
      ORDER BY schemaname, tablename
    `);
    
    console.log('\n📋 Found audit_log tables:');
    if (auditTables.rows.length === 0) {
      console.log('  (No audit_log tables found)');
    } else {
      auditTables.rows.forEach(table => {
        console.log(`  - ${table.schemaname}.${table.tablename} (owner: ${table.tableowner})`);
      });
    }
    
    // Check specifically for the conflicting names
    const conflictCheck = await client.query(`
      SELECT 
        schemaname, 
        tablename
      FROM pg_tables 
      WHERE tablename = 'audit_log'
      ORDER BY schemaname
    `);
    
    console.log('\n🔍 Tables named exactly "audit_log":');
    if (conflictCheck.rows.length === 0) {
      console.log('  (No tables named exactly "audit_log")');
    } else {
      conflictCheck.rows.forEach(table => {
        console.log(`  - ${table.schemaname}.${table.tablename}`);
      });
    }
    
    // Check table counts in each schema
    console.log('\n📊 Tables per schema:');
    const schemaStats = await client.query(`
      SELECT 
        schemaname,
        COUNT(*) as table_count
      FROM pg_tables 
      WHERE schemaname NOT IN ('information_schema', 'pg_catalog')
      GROUP BY schemaname
      ORDER BY schemaname
    `);
    
    schemaStats.rows.forEach(stat => {
      console.log(`  - ${stat.schemaname}: ${stat.table_count} tables`);
    });
    
    // Check if there are any views that might cause conflicts
    console.log('\n👁️  Checking for audit_log views:');
    const auditViews = await client.query(`
      SELECT 
        schemaname, 
        viewname
      FROM pg_views 
      WHERE viewname LIKE '%audit_log%'
      ORDER BY schemaname, viewname
    `);
    
    if (auditViews.rows.length === 0) {
      console.log('  (No audit_log views found)');
    } else {
      auditViews.rows.forEach(view => {
        console.log(`  - ${view.schemaname}.${view.viewname}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking audit tables:', error.message);
  } finally {
    await client.end();
  }
}

checkAuditTables().catch(console.error);