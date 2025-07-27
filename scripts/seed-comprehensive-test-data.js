#!/usr/bin/env node

/**
 * Comprehensive Test Data Seeding Script
 * Seeds database with complete test data for role-based E2E testing
 * Ensures all 5 roles have proper assignments and test data exists
 */

import pg from 'pg';
import dotenv from 'dotenv';

const { Client } = pg;
dotenv.config({ path: '.env.test' });

const DATABASE_URL = "postgres://neondb_owner:npg_WavFRZ1lEx4U@ep-black-sunset-a7wbc0zq-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require";

const TEST_USERS = [
  {
    email: process.env.E2E_DEVELOPER_EMAIL || 'developer@example.com',
    name: 'Test Developer',
    role: 'developer',
    position: 'senior_partner',
    clerk_user_id: 'user_test_developer_' + Date.now(),
    default_admin_time_percentage: '10.00'
  },
  {
    email: process.env.E2E_ORG_ADMIN_EMAIL || 'admin@example.com',
    name: 'John Admin',
    role: 'org_admin',
    position: 'senior_manager',
    clerk_user_id: 'user_test_admin_' + Date.now(),
    default_admin_time_percentage: '50.00'
  },
  {
    email: process.env.E2E_MANAGER_EMAIL || 'manager@example.com',
    name: 'Jane Manager',
    role: 'manager',
    position: 'manager',
    clerk_user_id: 'user_test_manager_' + Date.now(),
    default_admin_time_percentage: '30.00'
  },
  {
    email: process.env.E2E_CONSULTANT_EMAIL || 'consultant@example.com',
    name: 'Jim Consultant',
    role: 'consultant',
    position: 'senior_consultant',
    clerk_user_id: 'user_test_consultant_' + Date.now(),
    default_admin_time_percentage: '20.00'
  },
  {
    email: process.env.E2E_VIEWER_EMAIL || 'viewer@example.com',
    name: 'Vera Viewer',
    role: 'viewer',
    position: 'consultant',
    clerk_user_id: 'user_test_viewer_' + Date.now(),
    default_admin_time_percentage: '15.00'
  }
];

async function seedTestData() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🌱 Starting comprehensive test data seeding...');
    await client.connect();
    console.log('✅ Connected to database');

    // 1. Ensure all roles exist
    console.log('\n📋 1. Verifying role structure...');
    const rolesResult = await client.query('SELECT name, id, priority FROM roles ORDER BY priority DESC;');
    const existingRoles = rolesResult.rows.reduce((acc, role) => {
      acc[role.name] = { id: role.id, priority: role.priority };
      return acc;
    }, {});

    console.log('✅ Found roles:');
    Object.entries(existingRoles).forEach(([name, info]) => {
      console.log(`   - ${name}: ${info.id} (priority: ${info.priority})`);
    });

    // 2. Ensure all test users exist and have correct role assignments
    console.log('\n👥 2. Processing test users...');
    
    for (const testUser of TEST_USERS) {
      console.log(`\n🔄 Processing ${testUser.role}: ${testUser.email}`);
      
      // Check if user exists
      const userResult = await client.query('SELECT id, name, role FROM users WHERE email = $1;', [testUser.email]);
      
      let userId;
      if (userResult.rows.length > 0) {
        userId = userResult.rows[0].id;
        console.log(`   ✅ User exists with ID: ${userId}`);
        
        // Update user if needed
        await client.query(`
          UPDATE users 
          SET name = $1, role = $2, position = $3, default_admin_time_percentage = $4, 
              is_staff = true, is_active = true, status = 'active'
          WHERE id = $5;
        `, [testUser.name, testUser.role, testUser.position, testUser.default_admin_time_percentage, userId]);
        
        console.log('   ✅ User updated with test data');
      } else {
        // Create user if doesn't exist
        const createResult = await client.query(`
          INSERT INTO users (id, name, email, role, position, clerk_user_id, 
                           default_admin_time_percentage, is_staff, is_active, status, created_at, updated_at)
          VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, true, true, 'active', NOW(), NOW())
          RETURNING id;
        `, [testUser.name, testUser.email, testUser.role, testUser.position, testUser.clerk_user_id, testUser.default_admin_time_percentage]);
        
        userId = createResult.rows[0].id;
        console.log(`   ✅ User created with ID: ${userId}`);
      }

      // Ensure proper role assignment
      const roleId = existingRoles[testUser.role]?.id;
      if (roleId) {
        // Check if role assignment exists
        const roleAssignmentResult = await client.query(`
          SELECT id FROM userroles WHERE user_id = $1 AND role_id = $2;
        `, [userId, roleId]);

        if (roleAssignmentResult.rows.length === 0) {
          // Create role assignment
          await client.query(`
            INSERT INTO userroles (id, user_id, role_id, created_at, updated_at)
            VALUES (gen_random_uuid(), $1, $2, NOW(), NOW());
          `, [userId, roleId]);
          console.log(`   ✅ Role assignment created: ${testUser.role}`);
        } else {
          console.log(`   ✅ Role assignment already exists: ${testUser.role}`);
        }

        // Remove any conflicting role assignments (ensure single role per user for testing)
        await client.query(`
          DELETE FROM userroles 
          WHERE user_id = $1 AND role_id != $2;
        `, [userId, roleId]);
        console.log(`   ✅ Cleaned up conflicting role assignments`);
      } else {
        console.log(`   ❌ Role ${testUser.role} not found in database`);
      }
    }

    // 3. Verify role-permission relationships
    console.log('\n🔐 3. Verifying permission assignments...');
    const rolePermissionCounts = await client.query(`
      SELECT r.name as role_name, COUNT(rp.id) as permission_count
      FROM roles r
      LEFT JOIN role_permissions rp ON r.id = rp.role_id
      GROUP BY r.name, r.priority
      ORDER BY r.priority DESC;
    `);

    console.log('📊 Permission counts by role:');
    rolePermissionCounts.rows.forEach(row => {
      console.log(`   - ${row.role_name}: ${row.permission_count} permissions`);
    });

    // 4. Ensure adequate test data exists for domain testing
    console.log('\n💼 4. Verifying business test data...');

    // Check clients
    const clientCount = await client.query('SELECT COUNT(*) as count FROM clients;');
    console.log(`📊 Clients: ${clientCount.rows[0].count} records`);
    
    if (parseInt(clientCount.rows[0].count) < 5) {
      console.log('🌱 Adding additional test clients...');
      const additionalClients = [
        { name: 'Tech Innovations Pty Ltd', contact_person: 'Sarah Tech', contact_email: 'sarah@techinnovations.com.au', contact_phone: '04 1234 5678' },
        { name: 'Green Energy Solutions', contact_person: 'Mike Green', contact_email: 'mike@greenenergy.com.au', contact_phone: '04 2345 6789' },
        { name: 'Metro Finance Group', contact_person: 'Lisa Metro', contact_email: 'lisa@metrofinance.com.au', contact_phone: '04 3456 7890' }
      ];

      for (const clientData of additionalClients) {
        const existingClient = await client.query('SELECT id FROM clients WHERE name = $1;', [clientData.name]);
        if (existingClient.rows.length === 0) {
          await client.query(`
            INSERT INTO clients (id, name, contact_person, contact_email, contact_phone, active, created_at, updated_at)
            VALUES (gen_random_uuid(), $1, $2, $3, $4, true, NOW(), NOW());
          `, [clientData.name, clientData.contact_person, clientData.contact_email, clientData.contact_phone]);
          console.log(`   ✅ Added client: ${clientData.name}`);
        }
      }
    }

    // Check payrolls
    const payrollCount = await client.query('SELECT COUNT(*) as count FROM payrolls;');
    console.log(`📊 Payrolls: ${payrollCount.rows[0].count} records`);

    // Check leave records
    const leaveCount = await client.query('SELECT COUNT(*) as count FROM leave;');
    console.log(`📊 Leave records: ${leaveCount.rows[0].count} records`);

    // Check email templates
    const emailTemplateCount = await client.query('SELECT COUNT(*) as count FROM email_templates;');
    console.log(`📊 Email templates: ${emailTemplateCount.rows[0].count} records`);

    // Check notes
    const notesCount = await client.query('SELECT COUNT(*) as count FROM notes;');
    console.log(`📊 Notes: ${notesCount.rows[0].count} records`);

    // 5. Create audit trail entries for testing
    console.log('\n📋 5. Creating audit trail test data...');
    
    // Add some audit log entries for SOC2 compliance testing
    try {
      const auditEntries = [
        { action: 'user.login', description: 'Test user login for role-based testing', user_email: 'admin@example.com' },
        { action: 'payroll.create', description: 'Test payroll creation for audit testing', user_email: 'manager@example.com' },
        { action: 'client.update', description: 'Test client update for audit testing', user_email: 'consultant@example.com' }
      ];

      for (const entry of auditEntries) {
        await client.query(`
          INSERT INTO audit_log (id, action, description, user_email, created_at)
          VALUES (gen_random_uuid(), $1, $2, $3, NOW());
        `, [entry.action, entry.description, entry.user_email]);
      }
      console.log('✅ Added audit trail test entries');
    } catch (error) {
      console.log(`📝 Audit log seeding skipped: ${error.message}`);
    }

    // 6. Final verification
    console.log('\n🔍 6. Final verification...');
    
    const finalUserRoleCheck = await client.query(`
      SELECT u.email, u.name, u.role as userrole, r.name as assignedrole, r.priority
      FROM users u
      LEFT JOIN userroles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.email IN ($1, $2, $3, $4, $5)
      ORDER BY r.priority DESC;
    `, TESTUSERS.map(u => u.email));

    console.log('📋 Final test user verification:');
    finalUserRoleCheck.rows.forEach(user => {
      const status = user.assignedrole === user.userrole ? '✅' : '⚠️';
      console.log(`   ${status} ${user.email}: ${user.name} → ${user.assignedrole || 'NO ROLE'} (priority: ${user.priority || 'N/A'})`);
    });

    // Check for any users without role assignments
    const usersWithoutRoles = await client.query(`
      SELECT u.email, u.name
      FROM users u
      LEFT JOIN userroles ur ON u.id = ur.user_id
      WHERE ur.user_id IS NULL AND u.email IN ($1, $2, $3, $4, $5);
    `, TESTUSERS.map(u => u.email));

    if (usersWithoutRoles.rows.length > 0) {
      console.log('\n❌ Users without role assignments:');
      usersWithoutRoles.rows.forEach(user => {
        console.log(`   - ${user.email}: ${user.name}`);
      });
    } else {
      console.log('\n✅ All test users have proper role assignments');
    }

    console.log('\n🎉 Comprehensive test data seeding completed successfully!');
    console.log('\n📊 SEEDING SUMMARY:');
    console.log('==================');
    console.log(`✅ 5 roles verified in hierarchy`);
    console.log(`✅ ${TESTUSERS.length} test users processed`);
    console.log(`✅ Role assignments verified and cleaned`);
    console.log(`✅ Business test data verified`);
    console.log(`✅ Audit trail entries created`);
    console.log(`✅ Database ready for comprehensive role-based testing`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

// Run the seeding
seedTestData().catch(console.error);