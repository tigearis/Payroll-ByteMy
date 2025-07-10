#!/usr/bin/env node

/**
 * Permission System Seeding Script
 * 
 * This script sets up the initial roles, resources, permissions, and role-permission mappings
 * required for the enhanced permission system to function.
 */

import dotenv from "dotenv";
import { Client } from "pg";
import { v4 as uuidv4 } from "uuid";

// Load environment variables
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env.development.local" });
dotenv.config({ path: ".env" });

const DATABASE_URL = process.env.DATABASE_URL;
const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in environment variables");
  process.exit(1);
}

// Define the role hierarchy
const ROLES = [
  { name: 'developer', display_name: 'Developer', description: 'Full system access including developer tools', priority: 5, is_systemrole: true },
  { name: 'org_admin', display_name: 'Organization Admin', description: 'Organization-wide administration', priority: 4, is_systemrole: true },
  { name: 'manager', display_name: 'Manager', description: 'Team management and oversight', priority: 3, is_systemrole: true },
  { name: 'consultant', display_name: 'Consultant', description: 'Payroll processing and client management', priority: 2, is_systemrole: true },
  { name: 'viewer', display_name: 'Viewer', description: 'Read-only access to data and reports', priority: 1, is_systemrole: true },
];

// Define all resources
const RESOURCES = [
  { name: 'dashboard', display_name: 'Dashboard', description: 'Main dashboard and overview screens' },
  { name: 'clients', display_name: 'Clients', description: 'Client management and relationships' },
  { name: 'payrolls', display_name: 'Payrolls', description: 'Payroll processing and management' },
  { name: 'schedule', display_name: 'Schedule', description: 'Payroll schedules and dates' },
  { name: 'workschedule', display_name: 'Work Schedule', description: 'Staff work schedules and capacity' },
  { name: 'staff', display_name: 'Staff', description: 'Staff and user management' },
  { name: 'leave', display_name: 'Leave', description: 'Leave management and approvals' },
  { name: 'ai', display_name: 'AI Assistant', description: 'AI-powered features and assistance' },
  { name: 'bulkupload', display_name: 'Bulk Upload', description: 'Bulk data upload and processing' },
  { name: 'reports', display_name: 'Reports', description: 'Reporting and analytics' },
  { name: 'billing', display_name: 'Billing', description: 'Billing and financial operations' },
  { name: 'email', display_name: 'Email', description: 'Email templates and communication' },
  { name: 'invitations', display_name: 'Invitations', description: 'User invitations and onboarding' },
  { name: 'settings', display_name: 'Settings', description: 'System and account settings' },
  { name: 'security', display_name: 'Security', description: 'Security settings and audit logs' },
  { name: 'developer', display_name: 'Developer Tools', description: 'Developer and debugging tools' },
];

// Define all actions
const ACTIONS = [
  'read', 'create', 'update', 'delete', 'archive', 
  'approve', 'export', 'list', 'manage', 'process',
  'assign', 'configure', 'audit', 'override', 'execute'
];

// Role-based permission mappings
const ROLE_PERMISSIONS = {
  developer: [
    // Full access to everything
    'dashboard.read', 'dashboard.export',
    'clients.read', 'clients.create', 'clients.update', 'clients.delete', 'clients.archive', 'clients.approve', 'clients.export', 'clients.manage',
    'payrolls.read', 'payrolls.create', 'payrolls.update', 'payrolls.delete', 'payrolls.archive', 'payrolls.approve', 'payrolls.export', 'payrolls.manage', 'payrolls.process', 'payrolls.assign',
    'schedule.read', 'schedule.create', 'schedule.update', 'schedule.delete', 'schedule.approve', 'schedule.export', 'schedule.manage', 'schedule.assign',
    'workschedule.read', 'workschedule.create', 'workschedule.update', 'workschedule.delete', 'workschedule.approve', 'workschedule.export', 'workschedule.manage', 'workschedule.assign',
    'staff.read', 'staff.create', 'staff.update', 'staff.delete', 'staff.archive', 'staff.approve', 'staff.export', 'staff.manage',
    'leave.read', 'leave.create', 'leave.update', 'leave.delete', 'leave.approve', 'leave.export', 'leave.manage', 'leave.assign',
    'ai.read', 'ai.create', 'ai.update', 'ai.manage',
    'bulkupload.read', 'bulkupload.create', 'bulkupload.update', 'bulkupload.delete', 'bulkupload.approve', 'bulkupload.export', 'bulkupload.manage', 'bulkupload.process',
    'reports.read', 'reports.create', 'reports.update', 'reports.delete', 'reports.export', 'reports.manage',
    'billing.read', 'billing.create', 'billing.update', 'billing.delete', 'billing.approve', 'billing.export', 'billing.manage', 'billing.process',
    'email.read', 'email.create', 'email.update', 'email.delete', 'email.export', 'email.manage',
    'invitations.read', 'invitations.create', 'invitations.update', 'invitations.delete', 'invitations.manage',
    'settings.read', 'settings.update', 'settings.manage', 'settings.configure',
    'security.read', 'security.update', 'security.manage', 'security.audit', 'security.configure',
    'developer.read', 'developer.create', 'developer.update', 'developer.delete', 'developer.manage', 'developer.execute', 'developer.configure',
  ],
  
  org_admin: [
    // Organization administration
    'dashboard.read', 'dashboard.export',
    'clients.read', 'clients.create', 'clients.update', 'clients.delete', 'clients.archive', 'clients.approve', 'clients.export', 'clients.manage',
    'payrolls.read', 'payrolls.create', 'payrolls.update', 'payrolls.delete', 'payrolls.archive', 'payrolls.approve', 'payrolls.export', 'payrolls.manage', 'payrolls.process', 'payrolls.assign',
    'schedule.read', 'schedule.create', 'schedule.update', 'schedule.delete', 'schedule.approve', 'schedule.export', 'schedule.manage', 'schedule.assign',
    'workschedule.read', 'workschedule.create', 'workschedule.update', 'workschedule.delete', 'workschedule.approve', 'workschedule.export', 'workschedule.manage', 'workschedule.assign',
    'staff.read', 'staff.create', 'staff.update', 'staff.delete', 'staff.archive', 'staff.approve', 'staff.export', 'staff.manage',
    'leave.read', 'leave.create', 'leave.update', 'leave.delete', 'leave.approve', 'leave.export', 'leave.manage', 'leave.assign',
    'ai.read', 'ai.create', 'ai.update', 'ai.manage',
    'bulkupload.read', 'bulkupload.create', 'bulkupload.update', 'bulkupload.delete', 'bulkupload.approve', 'bulkupload.export', 'bulkupload.manage', 'bulkupload.process',
    'reports.read', 'reports.create', 'reports.update', 'reports.delete', 'reports.export', 'reports.manage',
    'billing.read', 'billing.create', 'billing.update', 'billing.delete', 'billing.approve', 'billing.export', 'billing.manage', 'billing.process',
    'email.read', 'email.create', 'email.update', 'email.delete', 'email.export', 'email.manage',
    'invitations.read', 'invitations.create', 'invitations.update', 'invitations.delete', 'invitations.manage',
    'settings.read', 'settings.update', 'settings.manage', 'settings.configure',
    'security.read', 'security.update', 'security.manage', 'security.audit',
  ],
  
  manager: [
    // Team management with oversight capabilities
    'dashboard.read', 'dashboard.export',
    'clients.read', 'clients.create', 'clients.update', 'clients.export', 'clients.manage',
    'payrolls.read', 'payrolls.create', 'payrolls.update', 'payrolls.approve', 'payrolls.export', 'payrolls.manage', 'payrolls.process', 'payrolls.assign',
    'schedule.read', 'schedule.create', 'schedule.update', 'schedule.approve', 'schedule.export', 'schedule.manage', 'schedule.assign',
    'workschedule.read', 'workschedule.create', 'workschedule.update', 'workschedule.approve', 'workschedule.export', 'workschedule.manage', 'workschedule.assign',
    'staff.read', 'staff.update', 'staff.export', 'staff.manage',
    'leave.read', 'leave.create', 'leave.update', 'leave.approve', 'leave.export', 'leave.manage', 'leave.assign',
    'ai.read', 'ai.create', 'ai.update',
    'bulkupload.read', 'bulkupload.create', 'bulkupload.update', 'bulkupload.approve', 'bulkupload.export', 'bulkupload.process',
    'reports.read', 'reports.create', 'reports.update', 'reports.export', 'reports.manage',
    'billing.read', 'billing.create', 'billing.update', 'billing.approve', 'billing.export', 'billing.manage', 'billing.process',
    'email.read', 'email.create', 'email.update', 'email.export', 'email.manage',
    'invitations.read', 'invitations.create', 'invitations.update', 'invitations.manage',
    'settings.read', 'settings.update',
    'security.read', 'security.audit',
  ],
  
  consultant: [
    // Payroll processing with limited admin access
    'dashboard.read',
    'clients.read', 'clients.export',
    'payrolls.read', 'payrolls.create', 'payrolls.update', 'payrolls.export', 'payrolls.process',
    'schedule.read', 'schedule.create', 'schedule.update', 'schedule.export',
    'workschedule.read', 'workschedule.create', 'workschedule.update', 'workschedule.export',
    'staff.read', 'staff.export',
    'leave.read', 'leave.create', 'leave.update', 'leave.export',
    'ai.read', 'ai.create',
    'bulkupload.read', 'bulkupload.create', 'bulkupload.update', 'bulkupload.export',
    'reports.read', 'reports.export',
    'billing.read', 'billing.create', 'billing.update', 'billing.export',
    'email.read', 'email.create', 'email.update', 'email.export',
    'invitations.read',
    'settings.read',
  ],
  
  viewer: [
    // Read-only access
    'dashboard.read',
    'clients.read',
    'payrolls.read',
    'schedule.read',
    'workschedule.read',
    'staff.read',
    'leave.read',
    'ai.read',
    'bulkupload.read',
    'reports.read',
    'billing.read',
    'email.read',
    'invitations.read',
    'settings.read',
  ],
};

class PermissionSeeder {
  constructor() {
    this.client = new Client({ connectionString: DATABASE_URL });
    this.stats = {
      roles: 0,
      resources: 0,
      permissions: 0,
      rolePermissions: 0,
    };
  }

  async connect() {
    await this.client.connect();
    console.log("✅ Connected to database");
  }

  async disconnect() {
    await this.client.end();
    console.log("✅ Disconnected from database");
  }

  async seedRoles() {
    console.log("\n🔧 Seeding roles...");
    
    for (const role of ROLES) {
      try {
        const result = await this.client.query(`
          INSERT INTO roles (name, display_name, description, priority, is_systemrole)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (name) DO UPDATE SET
            display_name = EXCLUDED.display_name,
            description = EXCLUDED.description,
            priority = EXCLUDED.priority,
            is_systemrole = EXCLUDED.is_systemrole,
            updated_at = NOW()
          RETURNING id
        `, [role.name, role.display_name, role.description, role.priority, role.is_systemrole]);

        this.stats.roles++;
        if (VERBOSE) {
          console.log(`  ✓ Role: ${role.name} (${role.display_name})`);
        }
      } catch (error) {
        console.error(`  ❌ Failed to seed role ${role.name}:`, error.message);
      }
    }
    
    console.log(`✅ Seeded ${this.stats.roles} roles`);
  }

  async seedResources() {
    console.log("\n🔧 Seeding resources...");
    
    for (const resource of RESOURCES) {
      try {
        await this.client.query(`
          INSERT INTO resources (name, display_name, description)
          VALUES ($1, $2, $3)
          ON CONFLICT (name) DO UPDATE SET
            display_name = EXCLUDED.display_name,
            description = EXCLUDED.description,
            updated_at = NOW()
        `, [resource.name, resource.display_name, resource.description]);

        this.stats.resources++;
        if (VERBOSE) {
          console.log(`  ✓ Resource: ${resource.name} (${resource.display_name})`);
        }
      } catch (error) {
        console.error(`  ❌ Failed to seed resource ${resource.name}:`, error.message);
      }
    }
    
    console.log(`✅ Seeded ${this.stats.resources} resources`);
  }

  async seedPermissions() {
    console.log("\n🔧 Seeding permissions...");
    
    // Get all resources
    const resourcesResult = await this.client.query('SELECT id, name FROM resources');
    const resourceMap = new Map(resourcesResult.rows.map(r => [r.name, r.id]));
    
    for (const resource of RESOURCES) {
      const resourceId = resourceMap.get(resource.name);
      if (!resourceId) continue;
      
      for (const action of ACTIONS) {
        try {
          await this.client.query(`
            INSERT INTO permissions (resource_id, action, description)
            VALUES ($1, $2, $3)
            ON CONFLICT (resource_id, action) DO UPDATE SET
              description = EXCLUDED.description,
              updated_at = NOW()
          `, [resourceId, action, `Permission to ${action} ${resource.displayname.toLowerCase()}`]);

          this.stats.permissions++;
          if (VERBOSE) {
            console.log(`  ✓ Permission: ${resource.name}.${action}`);
          }
        } catch (error) {
          console.error(`  ❌ Failed to seed permission ${resource.name}.${action}:`, error.message);
        }
      }
    }
    
    console.log(`✅ Seeded ${this.stats.permissions} permissions`);
  }

  async seedRolePermissions() {
    console.log("\n🔧 Seeding role-permission mappings...");
    
    // Get all roles
    const rolesResult = await this.client.query('SELECT id, name FROM roles');
    const roleMap = new Map(rolesResult.rows.map(r => [r.name, r.id]));
    
    // Get all permissions
    const permissionsResult = await this.client.query(`
      SELECT p.id, r.name as resource_name, p.action 
      FROM permissions p 
      JOIN resources r ON p.resource_id = r.id
    `);
    const permissionMap = new Map(permissionsResult.rows.map(p => [`${p.resource_name}.${p.action}`, p.id]));
    
    for (const [roleName, permissions] of Object.entries(ROLE_PERMISSIONS)) {
      const roleId = roleMap.get(roleName);
      if (!roleId) continue;
      
      for (const permissionName of permissions) {
        const permissionId = permissionMap.get(permissionName);
        if (!permissionId) {
          if (VERBOSE) {
            console.log(`  ⚠️ Permission not found: ${permissionName}`);
          }
          continue;
        }
        
        try {
          await this.client.query(`
            INSERT INTO role_permissions (role_id, permission_id)
            VALUES ($1, $2)
            ON CONFLICT (role_id, permission_id) DO NOTHING
          `, [roleId, permissionId]);

          this.stats.rolePermissions++;
          if (VERBOSE) {
            console.log(`  ✓ ${roleName} -> ${permissionName}`);
          }
        } catch (error) {
          console.error(`  ❌ Failed to assign ${permissionName} to ${roleName}:`, error.message);
        }
      }
    }
    
    console.log(`✅ Assigned ${this.stats.rolePermissions} role-permission mappings`);
  }

  async verifySeeding() {
    console.log("\n🔍 Verifying seeded data...");
    
    const checks = [
      { name: 'Roles', query: 'SELECT COUNT(*) FROM roles' },
      { name: 'Resources', query: 'SELECT COUNT(*) FROM resources' },
      { name: 'Permissions', query: 'SELECT COUNT(*) FROM permissions' },
      { name: 'Role Permissions', query: 'SELECT COUNT(*) FROM role_permissions' },
    ];

    for (const check of checks) {
      try {
        const result = await this.client.query(check.query);
        const count = parseInt(result.rows[0].count);
        console.log(`  ✓ ${check.name}: ${count}`);
      } catch (error) {
        console.log(`  ❌ ${check.name}: Error - ${error.message}`);
      }
    }
  }

  async run() {
    try {
      await this.connect();
      
      if (DRY_RUN) {
        console.log("🏃 DRY RUN MODE - No data will be modified");
        return;
      }
      
      console.log("🚀 Starting permission system seeding...");
      
      await this.seedRoles();
      await this.seedResources();
      await this.seedPermissions();
      await this.seedRolePermissions();
      await this.verifySeeding();
      
      console.log("\n✅ Permission seeding completed successfully!");
      console.log(`📊 Summary: ${this.stats.roles} roles, ${this.stats.resources} resources, ${this.stats.permissions} permissions, ${this.stats.rolePermissions} mappings`);
      
    } catch (error) {
      console.error("❌ Seeding failed:", error);
      process.exit(1);
    } finally {
      await this.disconnect();
    }
  }
}

// Run the seeder
const seeder = new PermissionSeeder();
seeder.run().catch(console.error);