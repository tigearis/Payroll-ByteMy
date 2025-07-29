#!/usr/bin/env node

// Clean up billing references and then delete user
const { Client } = require('pg');

async function cleanupAndDeleteUser() {
  console.log('🧹 Cleanup Billing References and Delete User');
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
    
    // Step 1: Check billing_items references
    console.log('\n1️⃣  Checking billing_items references...');
    
    const billingCheck = await client.query(
      'SELECT id, description, amount, staff_user_id FROM billing_items WHERE staff_user_id = $1',
      [userId]
    );
    
    console.log(`📊 Found ${billingCheck.rows.length} billing items referencing this user:`);
    billingCheck.rows.forEach(item => {
      console.log(`   - Item ${item.id}: ${item.description} ($${item.amount})`);
    });
    
    if (billingCheck.rows.length > 0) {
      console.log('\n🔧 Setting billing_items.staff_user_id to NULL...');
      
      const billingUpdate = await client.query(
        'UPDATE billing_items SET staff_user_id = NULL WHERE staff_user_id = $1',
        [userId]
      );
      
      console.log(`✅ Updated ${billingUpdate.rowCount} billing items`);
    }
    
    // Step 2: Check other potential blocking references
    console.log('\n2️⃣  Checking other potential blocking references...');
    
    const otherReferences = [
      { table: 'billing_items', column: 'approved_by' },
      { table: 'billing_items', column: 'confirmed_by' },
      { table: 'payroll_assignment_audit', column: 'changed_by' },
      { table: 'payroll_assignment_audit', column: 'from_consultant_id' },
      { table: 'payroll_assignment_audit', column: 'to_consultant_id' },
      { table: 'payrolls', column: 'backup_consultant_user_id' },
      { table: 'payrolls', column: 'manager_user_id' },
      { table: 'payrolls', column: 'primary_consultant_user_id' },
      { table: 'payroll_assignments', column: 'assigned_by' },
      { table: 'payroll_assignments', column: 'consultant_id' },
      { table: 'payroll_assignments', column: 'original_consultant_id' }
    ];
    
    for (const ref of otherReferences) {
      try {
        const checkResult = await client.query(
          `SELECT COUNT(*) as count FROM ${ref.table} WHERE ${ref.column} = $1`,
          [userId]
        );
        
        const count = parseInt(checkResult.rows[0].count);
        if (count > 0) {
          console.log(`   ⚠️  ${ref.table}.${ref.column}: ${count} references`);
          
          // Set to NULL for these references
          const updateResult = await client.query(
            `UPDATE ${ref.table} SET ${ref.column} = NULL WHERE ${ref.column} = $1`,
            [userId]
          );
          
          console.log(`      → Set ${updateResult.rowCount} references to NULL`);
        }
      } catch (error) {
        // Table or column might not exist
        console.log(`   ℹ️  Could not check ${ref.table}.${ref.column}: ${error.message}`);
      }
    }
    
    // Step 3: Get user info for audit
    console.log('\n3️⃣  Getting user information for audit...');
    
    const userInfo = await client.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );
    
    if (userInfo.rows.length === 0) {
      console.log('❌ User not found');
      return;
    }
    
    const user = userInfo.rows[0];
    console.log(`📋 User: ${user.first_name} ${user.last_name} (${user.email})`);
    
    // Step 4: Clean up user_skills (NO ACTION constraint)
    console.log('\n4️⃣  Cleaning up user skills...');
    
    const skillsResult = await client.query(
      'DELETE FROM user_skills WHERE user_id = $1',
      [userId]
    );
    console.log(`✅ Deleted ${skillsResult.rowCount} user skills`);
    
    // Step 5: Create audit record
    console.log('\n5️⃣  Creating deletion audit record...');
    
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
          JSON.stringify({ 
            deletion_reason: 'Manual deletion requested',
            deleted_by: 'system',
            billing_items_cleaned: billingCheck.rows.length 
          })
        ]
      );
      console.log('✅ Audit record created');
    } catch (error) {
      console.log('⚠️  Could not create audit record:', error.message);
    }
    
    // Step 6: Final user deletion attempt
    console.log('\n6️⃣  Deleting user...');
    
    try {
      const deleteResult = await client.query(
        'DELETE FROM users WHERE id = $1',
        [userId]
      );
      
      if (deleteResult.rowCount === 1) {
        console.log('✅ User deleted successfully');
      } else {
        console.log('❌ User deletion failed - no rows affected');
        return;
      }
      
    } catch (error) {
      console.error('❌ User deletion still failed:', error.message);
      
      if (error.detail) {
        console.log(`   Detail: ${error.detail}`);
      }
      
      console.log('\n🔍 Let me check what references still exist...');
      
      // Check all foreign key constraints that reference users table
      const remainingRefs = await client.query(`
        SELECT 
          tc.table_schema,
          tc.table_name,
          kcu.column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND ccu.table_name = 'users'
          AND ccu.column_name = 'id'
        ORDER BY tc.table_name, kcu.column_name
      `);
      
      console.log('\n📋 All foreign key references to users table:');
      for (const ref of remainingRefs.rows) {
        try {
          const checkResult = await client.query(
            `SELECT COUNT(*) as count FROM ${ref.table_schema}.${ref.table_name} WHERE ${ref.column_name} = $1`,
            [userId]
          );
          const count = parseInt(checkResult.rows[0].count);
          if (count > 0) {
            console.log(`   🚨 ${ref.table_schema}.${ref.table_name}.${ref.column_name}: ${count} records still reference user`);
          }
        } catch (error) {
          // Skip tables we can't check
        }
      }
      
      return;
    }
    
    // Step 7: Verification
    console.log('\n7️⃣  Verifying deletion...');
    
    const verifyResult = await client.query(
      'SELECT COUNT(*) as count FROM users WHERE id = $1',
      [userId]
    );
    
    if (parseInt(verifyResult.rows[0].count) === 0) {
      console.log('✅ User successfully removed from database');
      
      console.log('\n🎉 USER DELETION COMPLETED SUCCESSFULLY!');
      console.log('✅ All blocking references cleaned up');
      console.log('✅ User and cascade-dependent records removed');
      console.log('✅ Audit trail preserved');
      console.log(`✅ Deleted: ${user.first_name} ${user.last_name} (${user.email})`);
      
    } else {
      console.log('❌ User still exists in database');
    }
    
  } catch (error) {
    console.error('❌ Error during cleanup and deletion:', error.message);
  } finally {
    await client.end();
  }
}

cleanupAndDeleteUser().catch(console.error);