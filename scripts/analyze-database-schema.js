#!/usr/bin/env node

/**
 * Database Schema Analysis Script
 * Analyzes the current database structure and existing test data
 * to determine what needs to be seeded for comprehensive role-based testing
 */

import pg from 'pg';
import dotenv from 'dotenv';

const { Client } = pg;
dotenv.config({ path: '.env.test' });

const DATABASE_URL = "postgres://neondb_owner:npg_WavFRZ1lEx4U@ep-black-sunset-a7wbc0zq-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require";

async function analyzeDatabase() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔍 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database successfully');

    // Analyze database schema
    console.log('\n📋 ANALYZING DATABASE SCHEMA');
    console.log('=====================================');

    // Get all tables
    const tablesResult = await client.query(`
      SELECT table_name, table_schema 
      FROM informationschema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log(`📊 Found ${tablesResult.rows.length} tables:`);
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });

    // Analyze key tables for testing
    const keyTables = ['users', 'roles', 'userroles', 'role_permissions', 'permissions', 'clients', 'payrolls'];
    
    for (const tableName of keyTables) {
      console.log(`\n🔍 Analyzing table: ${tableName}`);
      console.log('-'.repeat(40));
      
      try {
        // Check if table exists
        const tableExists = await client.query(`
          SELECT EXISTS (
            SELECT FROM informationschema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          );
        `, [tableName]);

        if (!tableExists.rows[0].exists) {
          console.log(`❌ Table ${tableName} does not exist`);
          continue;
        }

        // Get table structure
        const columnsResult = await client.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM informationschema.columns 
          WHERE table_schema = 'public' 
          AND table_name = $1 
          ORDER BY ordinal_position;
        `, [tableName]);

        console.log(`📋 Columns (${columnsResult.rows.length}):`);
        columnsResult.rows.forEach(col => {
          console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
        });

        // Get row count
        const countResult = await client.query(`SELECT COUNT(*) as count FROM ${tableName};`);
        console.log(`📊 Row count: ${countResult.rows[0].count}`);

        // Get sample data for key tables
        if (parseInt(countResult.rows[0].count) > 0) {
          const sampleResult = await client.query(`SELECT * FROM ${tableName} LIMIT 3;`);
          console.log(`📋 Sample data:`);
          sampleResult.rows.forEach((row, index) => {
            console.log(`   Row ${index + 1}:`, JSON.stringify(row, null, 2));
          });
        }

      } catch (error) {
        console.log(`❌ Error analyzing ${tableName}: ${error.message}`);
      }
    }

    // Analyze user roles and permissions
    console.log('\n🎭 ANALYZING USER ROLES AND PERMISSIONS');
    console.log('=========================================');

    try {
      // Check existing roles
      const rolesResult = await client.query('SELECT * FROM roles ORDER BY priority DESC;');
      console.log(`📊 Found ${rolesResult.rows.length} roles:`);
      rolesResult.rows.forEach(role => {
        console.log(`   - ${role.name} (${role.display_name}) - Priority: ${role.priority}`);
      });

      // Check existing users
      const usersResult = await client.query('SELECT id, email, first_name, last_name FROM users LIMIT 10;');
      console.log(`\n👥 Found ${usersResult.rows.length} users:`);
      usersResult.rows.forEach(user => {
        console.log(`   - ${user.email} (${user.first_name} ${user.last_name})`);
      });

      // Check user role assignments
      const userRolesResult = await client.query(`
        SELECT u.email, r.name as role_name, r.display_name
        FROM users u
        JOIN userroles ur ON u.id = ur.user_id
        JOIN roles r ON ur.role_id = r.id
        ORDER BY u.email;
      `);
      console.log(`\n🔗 Found ${userRolesResult.rows.length} user-role assignments:`);
      userRolesResult.rows.forEach(assignment => {
        console.log(`   - ${assignment.email} → ${assignment.role_name} (${assignment.display_name})`);
      });

      // Check permissions
      const permissionsResult = await client.query('SELECT COUNT(*) as count FROM permissions;');
      console.log(`\n🔐 Found ${permissionsResult.rows[0].count} permissions in system`);

      // Check role permissions
      const rolePermissionsResult = await client.query(`
        SELECT r.name as role_name, COUNT(rp.id) as permission_count
        FROM roles r
        LEFT JOIN role_permissions rp ON r.id = rp.role_id
        GROUP BY r.name, r.priority
        ORDER BY r.priority DESC;
      `);
      console.log('📋 Permissions per role:');
      rolePermissionsResult.rows.forEach(rolePermission => {
        console.log(`   - ${rolePermission.role_name}: ${rolePermission.permission_count} permissions`);
      });

    } catch (error) {
      console.log(`❌ Error analyzing roles/permissions: ${error.message}`);
    }

    // Check test users from environment
    console.log('\n🧪 CHECKING TEST USER CREDENTIALS');
    console.log('==================================');

    const testUsers = [
      { role: 'developer', email: process.env.E2E_DEVELOPER_EMAIL, password: process.env.E2E_DEVELOPER_PASSWORD },
      { role: 'org_admin', email: process.env.E2E_ORG_ADMIN_EMAIL, password: process.env.E2E_ORG_ADMIN_PASSWORD },
      { role: 'manager', email: process.env.E2E_MANAGER_EMAIL, password: process.env.E2E_MANAGER_PASSWORD },
      { role: 'consultant', email: process.env.E2E_CONSULTANT_EMAIL, password: process.env.E2E_CONSULTANT_PASSWORD },
      { role: 'viewer', email: process.env.E2E_VIEWER_EMAIL, password: process.env.E2E_VIEWER_PASSWORD }
    ];

    for (const testUser of testUsers) {
      if (testUser.email) {
        try {
          const userResult = await client.query('SELECT id, email FROM users WHERE email = $1;', [testUser.email]);
          if (userResult.rows.length > 0) {
            console.log(`✅ ${testUser.role}: ${testUser.email} exists in database`);
            
            // Check role assignment
            const roleResult = await client.query(`
              SELECT r.name as role_name
              FROM users u
              JOIN userroles ur ON u.id = ur.user_id
              JOIN roles r ON ur.role_id = r.id
              WHERE u.email = $1;
            `, [testUser.email]);
            
            if (roleResult.rows.length > 0) {
              console.log(`   → Assigned role: ${roleResult.rows[0].role_name}`);
            } else {
              console.log(`   ⚠️  No role assigned`);
            }
          } else {
            console.log(`❌ ${testUser.role}: ${testUser.email} NOT found in database`);
          }
        } catch (error) {
          console.log(`❌ Error checking ${testUser.role}: ${error.message}`);
        }
      } else {
        console.log(`⚠️  ${testUser.role}: No email configured in environment`);
      }
    }

    // Analyze business data for testing
    console.log('\n💼 ANALYZING BUSINESS DATA FOR TESTING');
    console.log('======================================');

    const businessTables = ['clients', 'payrolls', 'staff', 'billing', 'invoices'];
    
    for (const table of businessTables) {
      try {
        const countResult = await client.query(`SELECT COUNT(*) as count FROM ${table};`);
        console.log(`📊 ${table}: ${countResult.rows[0].count} records`);
      } catch (error) {
        console.log(`📊 ${table}: Table does not exist or error (${error.message})`);
      }
    }

    console.log('\n✅ Database analysis complete!');

  } catch (error) {
    console.error('❌ Database analysis failed:', error);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

// Run the analysis
analyzeDatabase().catch(console.error);