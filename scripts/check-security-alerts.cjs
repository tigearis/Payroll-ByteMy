#!/usr/bin/env node

// Check the actual structure of security_alerts table
const { Client } = require('pg');

async function checkSecurityAlerts() {
  console.log('🔍 Checking security_alerts table structure...');
  
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
    
    // Get all columns in security_alerts table
    const columns = await client.query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' 
        AND table_name = 'security_alerts'
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Columns in public.security_alerts:');
    if (columns.rows.length === 0) {
      console.log('  (No columns found - table may not exist)');
    } else {
      columns.rows.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type}, nullable: ${col.is_nullable})`);
      });
    }
    
    // Check if there are any foreign keys to users table
    const foreignKeys = await client.query(`
      SELECT 
        tc.constraint_name,
        kcu.column_name,
        ccu.table_schema AS foreign_table_schema,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
        AND tc.table_name = 'security_alerts'
    `);
    
    console.log('\n🔗 Foreign key relationships:');
    if (foreignKeys.rows.length === 0) {
      console.log('  (No foreign keys found)');
    } else {
      foreignKeys.rows.forEach(fk => {
        console.log(`  - ${fk.column_name} → ${fk.foreign_table_schema}.${fk.foreign_table_name}.${fk.foreign_column_name}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking security_alerts:', error.message);
  } finally {
    await client.end();
  }
}

checkSecurityAlerts().catch(console.error);