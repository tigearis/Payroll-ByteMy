#!/usr/bin/env node

// Check user exists and analyze dependencies before deletion
const { Client } = require('pg');

async function checkUserForDeletion() {
  console.log('🔍 Analyzing User for Safe Deletion');
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
    
    // Step 1: Verify user exists
    console.log('\n1️⃣  Checking if user exists...');
    
    const userCheck = await client.query(
      'SELECT id, first_name, last_name, email, role, created_at FROM users WHERE id = $1',
      [userId]
    );
    
    if (userCheck.rows.length === 0) {
      console.log('❌ User not found in database');
      return;
    }
    
    const user = userCheck.rows[0];
    console.log('✅ User found:');
    console.log(`   Name: ${user.first_name} ${user.last_name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Created: ${user.created_at}`);
    
    // Step 2: Check foreign key dependencies
    console.log('\n2️⃣  Analyzing foreign key dependencies...');
    
    const dependencies = [
      // User roles
      { table: 'user_roles', column: 'user_id', description: 'Role assignments' },
      
      // Audit logs
      { table: 'audit.audit_log', column: 'user_id', description: 'Audit trail entries' },
      
      // Permission audit
      { table: 'permission_audit_log', column: 'user_id', description: 'Permission change logs (performed by)' },
      { table: 'permission_audit_log', column: 'target_user_id', description: 'Permission change logs (target)' },
      
      // User invitations
      { table: 'user_invitations', column: 'invited_by', description: 'Invitations sent' },
      
      // Leave requests
      { table: 'leave', column: 'user_id', description: 'Leave requests' },
      { table: 'leave', column: 'approved_by', description: 'Leave approvals' },
      
      // Work schedule
      { table: 'work_schedule', column: 'user_id', description: 'Work schedule entries' },
      
      // User skills
      { table: 'user_skills', column: 'user_id', description: 'User skills' },
      
      // Security alerts
      { table: 'security_alerts', column: 'user_id', description: 'Security alerts (subject)' },
      { table: 'security_alerts', column: 'resolved_by', description: 'Security alerts (resolver)' },
      
      // Billing
      { table: 'billing_event_log', column: 'created_by', description: 'Billing events' },
      
      // Notes
      { table: 'notes', column: 'created_by', description: 'Notes created' },
      { table: 'notes', column: 'updated_by', description: 'Notes updated' },
      
      // Permission overrides
      { table: 'permission_overrides', column: 'user_id', description: 'Permission overrides (subject)' },
      { table: 'permission_overrides', column: 'created_by', description: 'Permission overrides (creator)' },
      
      // Email templates
      { table: 'user_email_template_favorites', column: 'user_id', description: 'Email template favorites' },
      
      // User sessions
      { table: 'user_sessions', column: 'user_id', description: 'User sessions' }
    ];
    
    const dependencyData = [];
    
    for (const dep of dependencies) {
      try {
        const result = await client.query(
          `SELECT COUNT(*) as count FROM ${dep.table} WHERE ${dep.column} = $1`,
          [userId]
        );
        
        const count = parseInt(result.rows[0].count);
        if (count > 0) {
          dependencyData.push({
            ...dep,
            count: count
          });
          console.log(`   📊 ${dep.table}.${dep.column}: ${count} records (${dep.description})`);
        }
      } catch (error) {
        console.log(`   ⚠️  Could not check ${dep.table}.${dep.column}: ${error.message}`);
      }
    }
    
    if (dependencyData.length === 0) {
      console.log('✅ No foreign key dependencies found - safe to delete');
    } else {
      console.log(`⚠️  Found ${dependencyData.length} tables with dependencies`);
    }
    
    // Step 3: Check for any cascading delete constraints
    console.log('\n3️⃣  Checking foreign key constraints...');
    
    const constraints = await client.query(`
      SELECT 
        tc.constraint_name,
        tc.table_schema,
        tc.table_name,
        kcu.column_name,
        ccu.table_schema AS foreign_table_schema,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        rc.delete_rule
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      JOIN information_schema.referential_constraints AS rc
        ON tc.constraint_name = rc.constraint_name
        AND tc.table_schema = rc.constraint_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND ccu.table_name = 'users'
        AND ccu.column_name = 'id'
    `);
    
    if (constraints.rows.length > 0) {
      console.log('🔗 Foreign key constraints pointing to users table:');
      constraints.rows.forEach(constraint => {
        console.log(`   - ${constraint.table_schema}.${constraint.table_name}.${constraint.column_name} → users.id`);
        console.log(`     Delete rule: ${constraint.delete_rule}`);
      });
    } else {
      console.log('ℹ️  No foreign key constraints found (deletion will require manual cleanup)');
    }
    
    // Step 4: Recommendation
    console.log('\n4️⃣  Deletion Strategy Recommendation...');
    
    const totalDependencies = dependencyData.reduce((sum, dep) => sum + dep.count, 0);
    
    if (totalDependencies === 0) {
      console.log('✅ SAFE DELETION: No dependent records found');
      console.log('   Strategy: Direct DELETE FROM users WHERE id = ...');
    } else if (totalDependencies < 10) {
      console.log('⚠️  LOW RISK DELETION: Few dependent records');
      console.log('   Strategy: Manual cleanup of dependent records first, then delete user');
    } else {
      console.log('🚨 HIGH RISK DELETION: Many dependent records');
      console.log('   Strategy: Consider anonymization instead of deletion to preserve data integrity');
      console.log(`   Total dependent records: ${totalDependencies}`);
    }
    
    console.log('\n📋 Next Steps:');
    console.log('1. Review dependency analysis above');
    console.log('2. Decide on deletion strategy based on risk level');
    console.log('3. Create backup before deletion');
    console.log('4. Execute deletion with appropriate cascade handling');
    
  } catch (error) {
    console.error('❌ Error analyzing user:', error.message);
  } finally {
    await client.end();
  }
}

checkUserForDeletion().catch(console.error);