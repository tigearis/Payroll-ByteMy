#!/usr/bin/env node

// Analyze the duplicate audit_log tables to understand the conflict
const { Client } = require('pg');

async function analyzeDuplicateAuditTables() {
  console.log('🔍 Analyzing Duplicate Audit Log Tables');
  console.log('=' .repeat(60));
  
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
    
    // Step 1: Compare table structures
    console.log('\n1️⃣  COMPARING TABLE STRUCTURES');
    console.log('-'.repeat(40));
    
    const publicStructure = await client.query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length
      FROM information_schema.columns
      WHERE table_schema = 'public' 
        AND table_name = 'audit_log'
      ORDER BY ordinal_position
    `);
    
    const auditStructure = await client.query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length
      FROM information_schema.columns
      WHERE table_schema = 'audit' 
        AND table_name = 'audit_log'
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 public.audit_log structure:');
    if (publicStructure.rows.length === 0) {
      console.log('   ❌ Table does not exist or has no columns');
    } else {
      publicStructure.rows.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type}${col.character_maximum_length ? `(${col.character_maximum_length})` : ''} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
      });
    }
    
    console.log('\n📋 audit.audit_log structure:');
    if (auditStructure.rows.length === 0) {
      console.log('   ❌ Table does not exist or has no columns');
    } else {
      auditStructure.rows.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type}${col.character_maximum_length ? `(${col.character_maximum_length})` : ''} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
      });
    }
    
    // Step 2: Compare record counts
    console.log('\n2️⃣  COMPARING DATA VOLUME');
    console.log('-'.repeat(40));
    
    let publicCount = 0;
    let auditCount = 0;
    
    try {
      const publicCountResult = await client.query('SELECT COUNT(*) as count FROM public.audit_log');
      publicCount = parseInt(publicCountResult.rows[0].count);
    } catch (error) {
      console.log('   ⚠️  Could not count public.audit_log records:', error.message);
    }
    
    try {
      const auditCountResult = await client.query('SELECT COUNT(*) as count FROM audit.audit_log');
      auditCount = parseInt(auditCountResult.rows[0].count);
    } catch (error) {
      console.log('   ⚠️  Could not count audit.audit_log records:', error.message);
    }
    
    console.log(`📊 Record counts:`);
    console.log(`   - public.audit_log: ${publicCount} records`);
    console.log(`   - audit.audit_log: ${auditCount} records`);
    
    // Step 3: Sample data comparison
    console.log('\n3️⃣  SAMPLE DATA COMPARISON');
    console.log('-'.repeat(40));
    
    if (publicCount > 0) {
      try {
        const publicSample = await client.query(`
          SELECT id, action, resource_type, user_email, event_time 
          FROM public.audit_log 
          ORDER BY event_time DESC 
          LIMIT 3
        `);
        
        console.log('\n📄 Recent public.audit_log entries:');
        publicSample.rows.forEach(row => {
          console.log(`   - ${row.action} on ${row.resource_type} by ${row.user_email} at ${row.event_time}`);
        });
      } catch (error) {
        console.log('   ⚠️  Could not retrieve public.audit_log sample:', error.message);
      }
    }
    
    if (auditCount > 0) {
      try {
        const auditSample = await client.query(`
          SELECT id, action, resource_type, user_email, event_time 
          FROM audit.audit_log 
          ORDER BY event_time DESC 
          LIMIT 3
        `);
        
        console.log('\n📄 Recent audit.audit_log entries:');
        auditSample.rows.forEach(row => {
          console.log(`   - ${row.action} on ${row.resource_type} by ${row.user_email} at ${row.event_time}`);
        });
      } catch (error) {
        console.log('   ⚠️  Could not retrieve audit.audit_log sample:', error.message);
      }
    }
    
    // Step 4: Check for overlapping data
    console.log('\n4️⃣  CHECKING FOR DATA OVERLAP');
    console.log('-'.repeat(40));
    
    if (publicCount > 0 && auditCount > 0) {
      try {
        // Check if there are common IDs between tables
        const overlapCheck = await client.query(`
          SELECT COUNT(*) as overlap_count
          FROM public.audit_log p
          INNER JOIN audit.audit_log a ON p.id = a.id
        `);
        
        const overlapCount = parseInt(overlapCheck.rows[0].overlap_count);
        console.log(`🔄 Overlapping records (same ID): ${overlapCount}`);
        
        if (overlapCount > 0) {
          console.log('   ⚠️  Tables have overlapping data - need careful migration');
        } else {
          console.log('   ✅ No overlapping IDs - tables contain different data');
        }
      } catch (error) {
        console.log('   ⚠️  Could not check for overlapping data:', error.message);
      }
    }
    
    // Step 5: Check foreign key dependencies
    console.log('\n5️⃣  CHECKING FOREIGN KEY DEPENDENCIES');
    console.log('-'.repeat(40));
    
    const publicForeignKeys = await client.query(`
      SELECT 
        tc.table_name,
        kcu.column_name,
        tc.constraint_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND ccu.table_name = 'audit_log'
        AND ccu.table_schema = 'public'
    `);
    
    console.log('\n🔗 Tables referencing public.audit_log:');
    if (publicForeignKeys.rows.length === 0) {
      console.log('   ✅ No foreign key dependencies on public.audit_log');
    } else {
      publicForeignKeys.rows.forEach(fk => {
        console.log(`   - ${fk.table_name}.${fk.column_name} (${fk.constraint_name})`);
      });
    }
    
    // Step 6: Recommendations
    console.log('\n6️⃣  RECOMMENDATIONS');
    console.log('-'.repeat(40));
    
    if (publicCount === 0) {
      console.log('✅ SAFE TO REMOVE: public.audit_log is empty');
      console.log('   Action: Untrack and drop public.audit_log table');
    } else if (auditCount === 0) {
      console.log('⚠️  MIGRATE DATA: audit.audit_log is empty but public has data');
      console.log('   Action: Migrate data from public to audit schema');
    } else if (publicCount > 0 && auditCount > 0) {
      console.log('🔄 COMPLEX MIGRATION: Both tables contain data');
      console.log('   Action: Check for data overlap and merge appropriately');
    }
    
    console.log('\n📋 Next Steps:');
    console.log('1. Review the analysis above');
    console.log('2. Check application code for public.audit_log references');
    console.log('3. Plan data migration strategy based on findings');
    console.log('4. Untrack public.audit_log from Hasura');
    console.log('5. Implement chosen migration strategy');
    
  } catch (error) {
    console.error('❌ Error analyzing audit tables:', error.message);
  } finally {
    await client.end();
  }
}

analyzeDuplicateAuditTables().catch(console.error);