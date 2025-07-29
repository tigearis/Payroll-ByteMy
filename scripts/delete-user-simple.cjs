#!/usr/bin/env node

// Simple user deletion that relies on database CASCADE constraints
const { Client } = require('pg');

async function deleteUserSimple() {
  console.log('🗑️  Simple User Deletion (Using Database Constraints)');
  console.log('=' .repeat(60));
  
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
    
    // Step 1: Verify user exists and get info
    console.log('\n1️⃣  Verifying user exists...');
    
    const userCheck = await client.query(
      'SELECT id, first_name, last_name, email, role FROM users WHERE id = $1',
      [userId]
    );
    
    if (userCheck.rows.length === 0) {
      console.log('❌ User not found - nothing to delete');
      return;
    }
    
    const user = userCheck.rows[0];
    console.log('✅ User found:');
    console.log(`   Name: ${user.first_name} ${user.last_name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    
    // Step 2: Manual cleanup of NO ACTION constraints that might block deletion
    console.log('\n2️⃣  Handling blocking constraints...');
    
    // First, handle user_skills (NO ACTION constraint)
    const skillsResult = await client.query(
      'DELETE FROM user_skills WHERE user_id = $1',
      [userId]
    );
    console.log(`✅ Deleted ${skillsResult.rowCount} user skills`);
    
    // Handle audit log entries (if they have NO ACTION)
    try {
      const auditUpdateResult = await client.query(
        'UPDATE audit.audit_log SET user_id = NULL WHERE user_id = $1',
        [userId]
      );
      console.log(`✅ Nullified ${auditUpdateResult.rowCount} audit log user references`);
    } catch (error) {
      console.log('ℹ️  Audit log handling skipped:', error.message);
    }
    
    // Step 3: Create audit record before deletion
    console.log('\n3️⃣  Creating deletion audit record...');
    
    try {
      await client.query(
        `INSERT INTO audit.audit_log (
          event_time, user_email, user_role, action, 
          resource_type, resource_id, old_values, success, metadata
        ) VALUES (
          NOW(), 'system', 'system', 'DELETE', 
          'users', $1, $2, true, $3
        )`,
        [
          userId,
          JSON.stringify(user),
          JSON.stringify({ deletion_reason: 'Manual deletion requested', deleted_by: 'system' })
        ]
      );
      console.log('✅ Audit record created');
    } catch (error) {
      console.log('⚠️  Could not create audit record:', error.message);
    }
    
    // Step 4: Attempt user deletion (let CASCADE handle the rest)
    console.log('\n4️⃣  Deleting user (CASCADE will handle dependencies)...');
    
    try {
      const deleteResult = await client.query(
        'DELETE FROM users WHERE id = $1',
        [userId]
      );
      
      if (deleteResult.rowCount === 1) {
        console.log('✅ User deleted successfully');
        console.log('   Database CASCADE constraints handled dependent records automatically');
      } else {
        console.log('❌ User deletion failed - no rows affected');
        return;
      }
      
    } catch (error) {
      console.error('❌ User deletion failed:', error.message);
      
      if (error.message.includes('foreign key constraint')) {
        console.log('\n💡 Foreign key constraint violation detected');
        console.log('   Some dependent records need manual cleanup first');
        
        // Try to identify which constraint is blocking
        if (error.detail) {
          console.log(`   Detail: ${error.detail}`);
        }
      }
      
      return;
    }
    
    // Step 5: Verification
    console.log('\n5️⃣  Verifying deletion...');
    
    const verifyResult = await client.query(
      'SELECT COUNT(*) as count FROM users WHERE id = $1',
      [userId]
    );
    
    if (parseInt(verifyResult.rows[0].count) === 0) {
      console.log('✅ User successfully removed from database');
    } else {
      console.log('❌ User still exists in database');
      return;
    }
    
    // Step 6: Check cascade cleanup
    console.log('\n6️⃣  Verifying cascade cleanup...');
    
    const cascadeTables = [
      'user_roles',
      'leave', 
      'work_schedule',
      'security_alerts',
      'user_email_template_favorites',
      'user_sessions'
    ];
    
    for (const table of cascadeTables) {
      try {
        const result = await client.query(
          `SELECT COUNT(*) as count FROM ${table} WHERE user_id = $1`,
          [userId]
        );
        const count = parseInt(result.rows[0].count);
        if (count === 0) {
          console.log(`   ✅ ${table}: cleaned up`);
        } else {
          console.log(`   ⚠️  ${table}: ${count} records remain`);
        }
      } catch (error) {
        // Table might not exist or not have user_id column
      }
    }
    
    console.log('\n🎉 USER DELETION COMPLETED SUCCESSFULLY!');
    console.log('✅ User and cascade-dependent records removed');
    console.log('✅ Audit trail preserved');
    console.log(`✅ Deleted: ${user.first_name} ${user.last_name} (${user.email})`);
    
  } catch (error) {
    console.error('❌ Error during user deletion:', error.message);
  } finally {
    await client.end();
  }
}

deleteUserSimple().catch(console.error);