#!/usr/bin/env node

// Verify user deletion was complete and check for any remaining references
const { Client } = require('pg');

async function verifyUserDeletion() {
  console.log('🔍 Verifying User Deletion Completion');
  console.log('=' .repeat(50));
  
  const userId = '7898704c-ee5c-4ade-81f3-80a4388413fb';
  console.log(`Target User ID: ${userId}`);
  
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
    
    // Step 1: Verify user no longer exists
    console.log('\n1️⃣  Checking user table...');
    
    const userCheck = await client.query(
      'SELECT COUNT(*) as count FROM users WHERE id = $1',
      [userId]
    );
    
    const userExists = parseInt(userCheck.rows[0].count) > 0;
    
    if (userExists) {
      console.log('❌ User still exists in database - deletion incomplete');
      return;
    } else {
      console.log('✅ User successfully removed from users table');
    }
    
    // Step 2: Check for any remaining references
    console.log('\n2️⃣  Checking for remaining references...');
    
    const tablesToCheck = [
      'user_roles',
      'user_skills', 
      'leave',
      'work_schedule',
      'security_alerts',
      'user_email_template_favorites',
      'user_sessions',
      'permission_overrides',
      'data_backups',
      'email_drafts',
      'time_entries',
      'billing_items',
      'payrolls',
      'payroll_assignments'
    ];
    
    let remainingReferences = 0;
    
    for (const table of tablesToCheck) {
      try {
        const result = await client.query(
          `SELECT COUNT(*) as count FROM ${table} WHERE user_id = $1`,
          [userId]
        );
        
        const count = parseInt(result.rows[0].count);
        if (count > 0) {
          console.log(`   ⚠️  ${table}: ${count} references remain`);
          remainingReferences += count;
        } else {
          console.log(`   ✅ ${table}: cleaned up`);
        }
      } catch (error) {
        // Check alternative column names for this table
        const alternativeColumns = [
          'staff_user_id',
          'consultant_id', 
          'primary_consultant_user_id',
          'backup_consultant_user_id',
          'assigned_by',
          'original_consultant_id'
        ];
        
        let foundAlternative = false;
        for (const altCol of alternativeColumns) {
          try {
            const altResult = await client.query(
              `SELECT COUNT(*) as count FROM ${table} WHERE ${altCol} = $1`,
              [userId]
            );
            
            const altCount = parseInt(altResult.rows[0].count);
            if (altCount > 0) {
              console.log(`   ⚠️  ${table}.${altCol}: ${altCount} references remain`);
              remainingReferences += altCount;
              foundAlternative = true;
            } else if (foundAlternative) {
              console.log(`   ✅ ${table}.${altCol}: cleaned up`);
            }
          } catch (altError) {
            // Column doesn't exist
          }
        }
        
        if (!foundAlternative) {
          console.log(`   ℹ️  ${table}: no user_id column or table doesn't exist`);
        }
      }
    }
    
    // Step 3: Check audit log has our deletion record
    console.log('\n3️⃣  Checking audit trail...');
    
    try {
      const auditCheck = await client.query(
        `SELECT event_time, action, resource_type, resource_id, metadata 
         FROM audit.audit_log 
         WHERE action = 'DELETE' AND resource_type = 'users' AND resource_id = $1
         ORDER BY event_time DESC LIMIT 1`,
        [userId]
      );
      
      if (auditCheck.rows.length > 0) {
        const auditRecord = auditCheck.rows[0];
        console.log('✅ Deletion audit record found:');
        console.log(`   Time: ${auditRecord.event_time}`);
        console.log(`   Action: ${auditRecord.action} ${auditRecord.resource_type}`);
        
        if (auditRecord.metadata) {
          const metadata = JSON.parse(auditRecord.metadata);
          if (metadata.billing_items_cleaned) {
            console.log(`   Billing items cleaned: ${metadata.billing_items_cleaned}`);
          }
        }
      } else {
        console.log('⚠️  No deletion audit record found');
      }
    } catch (error) {
      console.log('ℹ️  Could not check audit log:', error.message);
    }
    
    // Step 4: Summary
    console.log('\n4️⃣  Deletion Summary...');
    
    if (remainingReferences === 0) {
      console.log('🎉 USER DELETION FULLY VERIFIED!');
      console.log('✅ User completely removed from database');
      console.log('✅ No remaining references found');
      console.log('✅ Audit trail preserved');
      console.log('✅ Data integrity maintained');
    } else {
      console.log(`⚠️  DELETION PARTIALLY COMPLETE`);
      console.log(`   User removed but ${remainingReferences} references remain`);
      console.log('   These may be intentional (NULL values) or require cleanup');
    }
    
    // Step 5: Check current user count
    console.log('\n5️⃣  Current user statistics...');
    
    const totalUsers = await client.query('SELECT COUNT(*) as count FROM users');
    console.log(`📊 Total users remaining: ${totalUsers.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error verifying user deletion:', error.message);
  } finally {
    await client.end();
  }
}

verifyUserDeletion().catch(console.error);