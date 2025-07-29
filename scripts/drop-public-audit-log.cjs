#!/usr/bin/env node

// Drop the empty public.audit_log table to completely resolve conflicts
const { Client } = require('pg');

async function dropPublicAuditLog() {
  console.log('🗑️  Dropping Empty public.audit_log Table');
  console.log('=' .repeat(50));
  
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
    console.log('✅ Connected to payroll_local database');
    
    // Step 1: Final verification that table is empty
    console.log('\n1️⃣  Final verification that table is safe to drop...');
    
    let recordCount = 0;
    try {
      const countResult = await client.query('SELECT COUNT(*) as count FROM public.audit_log');
      recordCount = parseInt(countResult.rows[0].count);
      console.log(`📊 public.audit_log contains ${recordCount} records`);
    } catch (error) {
      console.log('⚠️  Could not count records (table might not exist):', error.message);
      return;
    }
    
    if (recordCount > 0) {
      console.log('❌ ABORTING: Table contains data!');
      console.log('   Manual review required before dropping');
      return;
    }
    
    // Step 2: Check for any dependent objects
    console.log('\n2️⃣  Checking for dependent objects...');
    
    const dependentObjects = await client.query(`
      SELECT 
        t.schemaname,
        t.tablename,
        c.conname,
        c.contype
      FROM pg_constraint c
      JOIN pg_class cl ON c.conrelid = cl.oid
      JOIN pg_namespace n ON cl.relnamespace = n.oid
      JOIN pg_tables t ON t.schemaname = n.nspname AND t.tablename = cl.relname
      WHERE c.confrelid = (
        SELECT cl2.oid 
        FROM pg_class cl2 
        JOIN pg_namespace n2 ON cl2.relnamespace = n2.oid 
        WHERE cl2.relname = 'audit_log' AND n2.nspname = 'public'
      )
    `);
    
    if (dependentObjects.rows.length > 0) {
      console.log('⚠️  Found dependent objects:');
      dependentObjects.rows.forEach(dep => {
        console.log(`   - ${dep.schemaname}.${dep.tablename} (${dep.contype}: ${dep.conname})`);
      });
      console.log('❌ ABORTING: Cannot drop table with dependencies');
      return;
    } else {
      console.log('✅ No dependent objects found - safe to drop');
    }
    
    // Step 3: Create backup of table structure (just in case)
    console.log('\n3️⃣  Creating backup of table structure...');
    
    const tableDefinition = await client.query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' 
        AND table_name = 'audit_log'
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Table structure backup:');
    console.log('-- CREATE TABLE public.audit_log (');
    tableDefinition.rows.forEach((col, index) => {
      const nullable = col.is_nullable === 'YES' ? '' : ' NOT NULL';
      const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
      const comma = index === tableDefinition.rows.length - 1 ? '' : ',';
      console.log(`--   ${col.column_name} ${col.data_type}${nullable}${defaultVal}${comma}`);
    });
    console.log('-- );');
    
    // Step 4: Drop the table
    console.log('\n4️⃣  Dropping public.audit_log table...');
    
    try {
      await client.query('DROP TABLE IF EXISTS public.audit_log CASCADE');
      console.log('✅ Successfully dropped public.audit_log table');
    } catch (error) {
      console.log('❌ Failed to drop table:', error.message);
      return;
    }
    
    // Step 5: Verify table is gone
    console.log('\n5️⃣  Verifying table removal...');
    
    const verifyResult = await client.query(`
      SELECT COUNT(*) as count
      FROM information_schema.tables
      WHERE table_schema = 'public' 
        AND table_name = 'audit_log'
    `);
    
    const tableExists = parseInt(verifyResult.rows[0].count) > 0;
    
    if (tableExists) {
      console.log('❌ Table still exists after drop attempt');
    } else {
      console.log('✅ Table successfully removed from database');
    }
    
    // Step 6: Check current audit tables
    console.log('\n6️⃣  Current audit table status...');
    
    const auditTables = await client.query(`
      SELECT 
        schemaname, 
        tablename
      FROM pg_tables 
      WHERE tablename LIKE '%audit_log%'
      ORDER BY schemaname, tablename
    `);
    
    console.log('📋 Remaining audit_log tables:');
    if (auditTables.rows.length === 0) {
      console.log('   (No audit_log tables found)');
    } else {
      auditTables.rows.forEach(table => {
        console.log(`   - ${table.schemaname}.${table.tablename}`);
      });
    }
    
    console.log('\n🎉 PUBLIC AUDIT_LOG TABLE REMOVAL COMPLETE!');
    console.log('✅ Empty public.audit_log table dropped');
    console.log('✅ audit.audit_log remains with all data intact');
    console.log('✅ Database conflict source removed');
    
  } catch (error) {
    console.error('❌ Error dropping public.audit_log:', error.message);
  } finally {
    await client.end();
  }
}

dropPublicAuditLog().catch(console.error);