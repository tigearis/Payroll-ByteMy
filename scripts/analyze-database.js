#!/usr/bin/env node

/**
 * Database Analysis Script
 * Analyzes current database state for users, roles, permissions, and entities
 */

import dotenv from "dotenv";
import { Client } from "pg";

// Load environment variables
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env.development.local" });
dotenv.config({ path: ".env" });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in environment variables");
  process.exit(1);
}

async function analyzeDatabase() {
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    await client.connect();
    console.log("🔍 Analyzing database state...\n");

    // Check users
    const usersResult = await client.query(`
      SELECT u.id, u.email, u.name, u.clerk_user_id, u.created_at, u.role as oldrole,
             r.name as role_name, r.display_name as role_display_name
      FROM users u
      LEFT JOIN userroles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      ORDER BY u.created_at DESC
    `);
    
    console.log(`👥 USERS (${usersResult.rows.length} total):`);
    usersResult.rows.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.email} (${user.name})`);
      console.log(`     New Role: ${user.role_name || 'NO ROLE'} (${user.role_display_name || 'N/A'})`);
      console.log(`     Old Role: ${user.oldrole || 'None'}`);
      console.log(`     Created: ${user.createdat.toISOString().split('T')[0]}`);
      console.log(`     Clerk ID: ${user.clerk_user_id ? 'Yes' : 'No'}`);
      console.log();
    });

    // Check roles
    const rolesResult = await client.query(`
      SELECT r.id, r.name, r.display_name, r.description, r.priority,
             COUNT(ur.user_id) as user_count,
             COUNT(rp.permission_id) as permission_count
      FROM roles r
      LEFT JOIN userroles ur ON r.id = ur.role_id
      LEFT JOIN role_permissions rp ON r.id = rp.role_id
      GROUP BY r.id, r.name, r.display_name, r.description, r.priority
      ORDER BY r.priority DESC
    `);
    
    console.log(`🎭 ROLES (${rolesResult.rows.length} total):`);
    rolesResult.rows.forEach((role, index) => {
      console.log(`  ${index + 1}. ${role.name} (${role.display_name})`);
      console.log(`     Description: ${role.description || 'None'}`);
      console.log(`     Priority: ${role.priority}`);
      console.log(`     Users: ${role.user_count}, Permissions: ${role.permission_count}`);
      console.log();
    });

    // Check resources
    const resourcesResult = await client.query(`
      SELECT r.id, r.name, r.display_name, r.description,
             COUNT(p.id) as permission_count
      FROM resources r
      LEFT JOIN permissions p ON r.id = p.resource_id
      GROUP BY r.id, r.name, r.display_name, r.description
      ORDER BY r.name
    `);
    
    console.log(`🛠️ RESOURCES (${resourcesResult.rows.length} total):`);
    resourcesResult.rows.forEach((resource, index) => {
      console.log(`  ${index + 1}. ${resource.name} (${resource.display_name})`);
      console.log(`     Description: ${resource.description || 'None'}`);
      console.log(`     Permissions: ${resource.permission_count}`);
      console.log();
    });

    // Check permissions summary
    const permissionsResult = await client.query(`
      SELECT COUNT(*) as total_permissions
      FROM permissions
    `);
    
    console.log(`🔐 PERMISSIONS: ${permissionsResult.rows[0].total_permissions} total`);

    // Check role-permission assignments
    const rolePermResult = await client.query(`
      SELECT r.name as role_name, res.name as resource_name, p.action,
             COUNT(*) as assignment_count
      FROM role_permissions rp
      JOIN roles r ON rp.role_id = r.id
      JOIN permissions p ON rp.permission_id = p.id
      JOIN resources res ON p.resource_id = res.id
      GROUP BY r.name, res.name, p.action
      ORDER BY r.name, res.name, p.action
    `);
    
    console.log(`\n📋 ROLE-PERMISSION ASSIGNMENTS (${rolePermResult.rows.length} total):`);
    let currentRole = '';
    rolePermResult.rows.forEach((assignment) => {
      if (assignment.role_name !== currentRole) {
        console.log(`  ${assignment.role_name}:`);
        currentRole = assignment.role_name;
      }
      console.log(`    ${assignment.resource_name}.${assignment.action}`);
    });

    // Check clients
    const clientsResult = await client.query(`
      SELECT COUNT(*) as total_clients
      FROM clients
    `);
    
    console.log(`\n🏢 CLIENTS: ${clientsResult.rows[0].total_clients} total`);

    // Check payrolls
    const payrollsResult = await client.query(`
      SELECT COUNT(*) as total_payrolls
      FROM payrolls
    `);
    
    console.log(`📊 PAYROLLS: ${payrollsResult.rows[0].total_payrolls} total`);

    // Check other entities
    const entitiesQueries = [
      { name: 'staff', table: 'users', condition: 'WHERE role IS NOT NULL' },
      { name: 'work_schedule', table: 'work_schedule' },
      { name: 'leave', table: 'leave' },
      { name: 'billing_plans', table: 'billing_plan' },
      { name: 'billing_invoices', table: 'billing_invoice' },
    ];

    console.log("\n📈 OTHER ENTITIES:");
    for (const entity of entitiesQueries) {
      try {
        const result = await client.query(`SELECT COUNT(*) as count FROM ${entity.table} ${entity.condition || ''}`);
        console.log(`  ${entity.name}: ${result.rows[0].count}`);
      } catch (error) {
        console.log(`  ${entity.name}: Table not found or error`);
      }
    }

    // Check for missing critical data
    console.log("\n⚠️  MISSING DATA ANALYSIS:");
    
    // Users without roles
    const usersWithoutRoles = await client.query(`
      SELECT COUNT(*) as count
      FROM users u
      LEFT JOIN userroles ur ON u.id = ur.user_id
      WHERE ur.role_id IS NULL
    `);
    
    if (usersWithoutRoles.rows[0].count > 0) {
      console.log(`  - ${usersWithoutRoles.rows[0].count} users without roles`);
    }

    // Roles without permissions
    const rolesWithoutPermissions = await client.query(`
      SELECT r.name
      FROM roles r
      LEFT JOIN role_permissions rp ON r.id = rp.role_id
      WHERE rp.permission_id IS NULL
    `);
    
    if (rolesWithoutPermissions.rows.length > 0) {
      console.log(`  - Roles without permissions: ${rolesWithoutPermissions.rows.map(r => r.name).join(', ')}`);
    }

    // Resources without permissions
    const resourcesWithoutPermissions = await client.query(`
      SELECT r.name
      FROM resources r
      LEFT JOIN permissions p ON r.id = p.resource_id
      WHERE p.id IS NULL
    `);
    
    if (resourcesWithoutPermissions.rows.length > 0) {
      console.log(`  - Resources without permissions: ${resourcesWithoutPermissions.rows.map(r => r.name).join(', ')}`);
    }

    console.log("\n✅ Database analysis complete");

  } catch (error) {
    console.error("❌ Database analysis failed:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run the analysis
analyzeDatabase().catch(console.error);