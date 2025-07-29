#!/usr/bin/env node

// Check current users in database and analyze potential filtering issues
const { Client } = require('pg');

async function checkCurrentUsers() {
  console.log('👥 Analyzing Current Users in Database');
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
    
    // Step 1: Get all users with key details
    console.log('\n1️⃣  All users in database...');
    
    const allUsers = await client.query(`
      SELECT 
        id, 
        first_name, 
        last_name, 
        email, 
        role, 
        status,
        created_at,
        updated_at,
        manager_id
      FROM users 
      ORDER BY created_at
    `);
    
    console.log(`📊 Total users: ${allUsers.rows.length}`);
    console.log('\n📋 User details:');
    
    allUsers.rows.forEach((user, index) => {
      console.log(`${index + 1}. ${user.first_name} ${user.last_name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Status: ${user.status || 'NULL'}`);
      console.log(`   Manager ID: ${user.manager_id || 'NULL'}`);
      console.log(`   Created: ${user.created_at}`);
      console.log('');
    });
    
    // Step 2: Check user roles and status distribution
    console.log('\n2️⃣  User distribution analysis...');
    
    const roleDistribution = await client.query(`
      SELECT role, COUNT(*) as count
      FROM users
      GROUP BY role
      ORDER BY count DESC
    `);
    
    console.log('📊 By Role:');
    roleDistribution.rows.forEach(row => {
      console.log(`   ${row.role}: ${row.count} users`);
    });
    
    const statusDistribution = await client.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM users
      GROUP BY status
      ORDER BY count DESC
    `);
    
    console.log('\n📊 By Status:');
    statusDistribution.rows.forEach(row => {
      console.log(`   ${row.status || 'NULL'}: ${row.count} users`);
    });
    
    // Step 3: Check for any users that might be filtered out
    console.log('\n3️⃣  Potential filtering conditions...');
    
    // Check for inactive/archived users
    const inactiveUsers = await client.query(`
      SELECT COUNT(*) as count
      FROM users
      WHERE status = 'inactive' OR status = 'archived' OR status = 'deleted'
    `);
    
    console.log(`🔍 Inactive/Archived users: ${inactiveUsers.rows[0].count}`);
    
    // Check for users without roles
    const noRoleUsers = await client.query(`
      SELECT COUNT(*) as count
      FROM users
      WHERE role IS NULL OR role = ''
    `);
    
    console.log(`🔍 Users without role: ${noRoleUsers.rows[0].count}`);
    
    // Check for users with specific roles that might be filtered
    const nonStaffRoles = await client.query(`
      SELECT role, COUNT(*) as count
      FROM users
      WHERE role NOT IN ('consultant', 'manager', 'org_admin')
      GROUP BY role
    `);
    
    if (nonStaffRoles.rows.length > 0) {
      console.log('🔍 Non-staff roles that might be filtered:');
      nonStaffRoles.rows.forEach(row => {
        console.log(`   ${row.role}: ${row.count} users`);
      });
    }
    
    // Step 4: Check user_roles table for role assignments
    console.log('\n4️⃣  Checking user_roles assignments...');
    
    const userRoleAssignments = await client.query(`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.role as user_role,
        r.name as assigned_role
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      ORDER BY u.first_name
    `);
    
    console.log('👥 User role assignments:');
    userRoleAssignments.rows.forEach(user => {
      const assignedRole = user.assigned_role || 'No role assignment';
      console.log(`   ${user.first_name} ${user.last_name}: ${user.user_role} (assigned: ${assignedRole})`);
    });
    
    // Step 5: Identify potential hidden user
    console.log('\n5️⃣  Analysis for staff page filtering...');
    
    if (allUsers.rows.length === 6) {
      console.log('✅ Database contains exactly 6 users as expected');
      console.log('🔍 Potential reasons for staff page showing only 5:');
      console.log('   1. Role-based filtering (excluding non-staff roles)');
      console.log('   2. Status-based filtering (excluding inactive users)');
      console.log('   3. Permission-based filtering (current user cannot see certain users)');
      console.log('   4. Component logic filtering out specific conditions');
      console.log('   5. GraphQL query differences between pages');
    } else {
      console.log(`⚠️  Expected 6 users but found ${allUsers.rows.length}`);
    }
    
  } catch (error) {
    console.error('❌ Error checking users:', error.message);
  } finally {
    await client.end();
  }
}

checkCurrentUsers().catch(console.error);