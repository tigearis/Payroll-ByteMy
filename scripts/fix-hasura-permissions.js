#!/usr/bin/env node

/**
 * Hasura Permissions Validation and Fix Script
 * 
 * This script automatically:
 * 1. Validates all permission definitions against custom column mappings
 * 2. Fixes missing fields in role permissions
 * 3. Ensures permission consistency across all tables
 * 4. Creates backups before making changes
 */

import fs from 'fs/promises';
import path from 'path';
import yaml from 'yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const METADATA_DIR = './hasura/metadata/databases/default/tables';
const BACKUP_DIR = './hasura/metadata-backup';

// Standard role hierarchy
const ROLE_HIERARCHY = [
  'developer',
  'org_admin', 
  'manager',
  'consultant',
  'viewer'
];

// Core fields that should be available to all roles
const CORE_FIELDS = ['id', 'created_at', 'updated_at'];

class HasuraPermissionsFixer {
  constructor() {
    this.issues = [];
    this.fixes = [];
    this.dryRun = process.argv.includes('--dry-run');
  }

  async run() {
    console.log('🔍 Starting Hasura Permissions Analysis...\n');
    
    try {
      // Create backup
      if (!this.dryRun) {
        await this.createBackup();
      }

      // Get all table metadata files
      const tableFiles = await this.getTableFiles();
      
      // Process each table
      for (const file of tableFiles) {
        await this.processTable(file);
      }

      // Report results
      this.reportResults();

      // Apply fixes if not dry run
      if (!this.dryRun && this.fixes.length > 0) {
        await this.applyFixes();
      }

    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  }

  async createBackup() {
    console.log('📁 Creating metadata backup...');
    await fs.mkdir(BACKUP_DIR, { recursive: true });
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, `metadata-${timestamp}`);
    
    await fs.cp(METADATA_DIR, backupPath, { recursive: true });
    console.log(`✅ Backup created at: ${backupPath}\n`);
  }

  async getTableFiles() {
    const files = await fs.readdir(METADATA_DIR);
    return files.filter(file => file.endsWith('.yaml') && file.startsWith('public_'));
  }

  async processTable(filename) {
    const filePath = path.join(METADATA_DIR, filename);
    const content = await fs.readFile(filePath, 'utf8');
    const metadata = yaml.parse(content);
    
    const tableName = metadata.table?.name;
    if (!tableName) return;

    console.log(`🔍 Analyzing table: ${tableName}`);
    
    // Extract custom column mappings
    const customColumns = this.extractCustomColumns(metadata);
    
    // Get all database columns (both custom and regular)
    const allColumns = this.getAllColumns(metadata, customColumns);
    
    // Analyze permissions for each role
    const selectPermissions = metadata.select_permissions || [];
    const missingPermissions = this.findMissingPermissions(selectPermissions, allColumns, tableName);
    
    if (missingPermissions.length > 0) {
      this.issues.push({
        table: tableName,
        file: filename,
        missing: missingPermissions
      });

      // Create fix
      const updatedMetadata = this.createPermissionsFix(metadata, missingPermissions, allColumns);
      this.fixes.push({
        file: filePath,
        content: yaml.stringify(updatedMetadata, { 
          lineWidth: 0,
          doubleQuotedAsJSON: false,
          quotingType: '"'
        })
      });
    }
  }

  extractCustomColumns(metadata) {
    const customColumns = {};
    
    // From custom_column_names mapping
    if (metadata.configuration?.custom_column_names) {
      Object.entries(metadata.configuration.custom_column_names).forEach(([dbCol, graphqlCol]) => {
        customColumns[dbCol] = graphqlCol;
      });
    }
    
    return customColumns;
  }

  getAllColumns(metadata, customColumns) {
    const columns = new Set();
    
    // Add core fields
    CORE_FIELDS.forEach(field => columns.add(field));
    
    // Add custom mapped columns (database names)
    Object.keys(customColumns).forEach(dbCol => columns.add(dbCol));
    
    // Extract columns from existing permissions to get full schema
    const selectPermissions = metadata.select_permissions || [];
    selectPermissions.forEach(perm => {
      if (Array.isArray(perm.permission?.columns)) {
        perm.permission.columns.forEach(col => columns.add(col));
      }
    });
    
    return Array.from(columns).sort();
  }

  findMissingPermissions(selectPermissions, allColumns, tableName) {
    const missing = [];
    
    ROLE_HIERARCHY.forEach(role => {
      const rolePermission = selectPermissions.find(p => p.role === role);
      
      if (!rolePermission) {
        missing.push({
          role,
          issue: 'missing_role_permission',
          missingColumns: allColumns
        });
        return;
      }

      // Check if using wildcard (should be fine)
      if (rolePermission.permission?.columns === '*') {
        return;
      }

      // Check for missing columns
      const roleColumns = rolePermission.permission?.columns || [];
      const missingColumns = allColumns.filter(col => !roleColumns.includes(col));
      
      if (missingColumns.length > 0) {
        missing.push({
          role,
          issue: 'missing_columns',
          missingColumns
        });
      }
    });
    
    return missing;
  }

  createPermissionsFix(metadata, missingPermissions, allColumns) {
    const updatedMetadata = JSON.parse(JSON.stringify(metadata));
    
    if (!updatedMetadata.select_permissions) {
      updatedMetadata.select_permissions = [];
    }

    missingPermissions.forEach(({ role, issue, missingColumns }) => {
      if (issue === 'missing_role_permission') {
        // Add complete role permission
        const newPermission = this.createRolePermission(role, allColumns);
        updatedMetadata.select_permissions.push(newPermission);
      } else if (issue === 'missing_columns') {
        // Update existing role permission
        const existingPerm = updatedMetadata.select_permissions.find(p => p.role === role);
        if (existingPerm && existingPerm.permission?.columns !== '*') {
          const currentColumns = new Set(existingPerm.permission.columns || []);
          missingColumns.forEach(col => currentColumns.add(col));
          existingPerm.permission.columns = Array.from(currentColumns).sort();
        }
      }
    });

    return updatedMetadata;
  }

  createRolePermission(role, allColumns) {
    const basePermission = {
      role,
      permission: {
        columns: allColumns.slice(), // copy array
        filter: {},
      }
    };

    // Customize based on role
    switch (role) {
      case 'developer':
        basePermission.permission.columns = '*';
        basePermission.permission.allow_aggregations = true;
        basePermission.comment = 'Developer role has full system access';
        break;
      
      case 'org_admin':
        basePermission.permission.allow_aggregations = true;
        basePermission.comment = 'Org admins can view all data';
        break;
      
      case 'manager':
        basePermission.permission.allow_aggregations = true;
        basePermission.comment = 'Managers can view all data';
        break;
      
      case 'consultant':
        // Consultants might have filtered access
        basePermission.comment = 'Consultants can view relevant data';
        break;
      
      case 'viewer':
        // Remove sensitive columns for viewers
        basePermission.permission.columns = basePermission.permission.columns.filter(
          col => !['clerk_user_id', 'created_by_user_id'].includes(col)
        );
        basePermission.comment = 'Viewers can see basic information';
        break;
    }

    return basePermission;
  }

  reportResults() {
    console.log('\n📊 ANALYSIS RESULTS\n' + '='.repeat(50));
    
    if (this.issues.length === 0) {
      console.log('✅ No permission issues found!');
      return;
    }

    console.log(`❌ Found ${this.issues.length} tables with permission issues:\n`);
    
    this.issues.forEach(({ table, missing }) => {
      console.log(`🔸 Table: ${table}`);
      missing.forEach(({ role, issue, missingColumns }) => {
        if (issue === 'missing_role_permission') {
          console.log(`  - Missing complete permission for role: ${role}`);
        } else {
          console.log(`  - Role ${role} missing columns: ${missingColumns.join(', ')}`);
        }
      });
      console.log('');
    });

    if (this.dryRun) {
      console.log('🔍 DRY RUN - No changes will be applied');
      console.log('Run without --dry-run to apply fixes');
    } else {
      console.log(`🔧 ${this.fixes.length} files will be updated`);
    }
  }

  async applyFixes() {
    console.log('\n🔧 Applying fixes...\n');
    
    for (const { file, content } of this.fixes) {
      await fs.writeFile(file, content, 'utf8');
      console.log(`✅ Updated: ${path.basename(file)}`);
    }
    
    console.log('\n🎉 All fixes applied!');
    console.log('\n📝 Next steps:');
    console.log('1. Run: cd hasura && hasura metadata apply');
    console.log('2. Run: pnpm codegen');
    console.log('3. Test authentication flows');
  }
}

// Run the script
if (import.meta.url === `file://${__filename}`) {
  const fixer = new HasuraPermissionsFixer();
  fixer.run().catch(console.error);
}