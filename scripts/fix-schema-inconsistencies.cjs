#!/usr/bin/env node

/**
 * Fix Database Schema Inconsistencies
 * Removes references to non-existent columns from Hasura metadata
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Known problematic columns that don't exist in the database
const PROBLEMATIC_COLUMNS = [
  'created_at',
  'updated_at',
  'id'  // payroll_triggers_status doesn't have an id column
];

// Tables with issues (from the inconsistency report)
const PROBLEMATIC_TABLES = [
  'public_payroll_version_results.yaml',
  'public_leave.yaml', 
  'public_payroll_activation_results.yaml',
  'public_payroll_dashboard_stats.yaml',
  'public_billing_event_log.yaml',
  'public_feature_flags.yaml',
  'public_payroll_version_history_results.yaml',
  'public_users_role_backup.yaml',
  'public_permission_audit_log.yaml',
  'public_billing_items.yaml',
  'public_payroll_assignment_audit.yaml',
  'public_payroll_triggers_status.yaml',
  'public_app_settings.yaml',
  'public_latest_payroll_version_results.yaml'
];

const METADATA_DIR = path.join(__dirname, '..', 'hasura', 'metadata', 'databases', 'default', 'tables');

function fixTableMetadata(filePath) {
  console.log(`\n🔧 Fixing ${path.basename(filePath)}...`);
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const metadata = yaml.load(fileContent);
    
    let changed = false;
    
    // Fix select permissions
    if (metadata.select_permissions) {
      metadata.select_permissions.forEach(permission => {
        if (permission.permission && permission.permission.columns) {
          const originalColumns = permission.permission.columns;
          
          // Skip if using wildcard
          if (originalColumns === '*') {
            return;
          }
          
          // Only process if it's an array
          if (Array.isArray(originalColumns)) {
            // Remove problematic columns
            const filteredColumns = originalColumns.filter(col => {
              if (PROBLEMATIC_COLUMNS.includes(col)) {
                console.log(`  ❌ Removing non-existent column: ${col} from ${permission.role} role`);
                changed = true;
                return false;
              }
              return true;
            });
            
            permission.permission.columns = filteredColumns;
          }
        }
      });
    }
    
    // Fix column configuration
    if (metadata.configuration && metadata.configuration.column_config) {
      PROBLEMATIC_COLUMNS.forEach(col => {
        if (metadata.configuration.column_config[col]) {
          console.log(`  ❌ Removing column config for: ${col}`);
          delete metadata.configuration.column_config[col];
          changed = true;
        }
      });
    }
    
    // Fix custom column names
    if (metadata.configuration && metadata.configuration.custom_column_names) {
      PROBLEMATIC_COLUMNS.forEach(col => {
        if (metadata.configuration.custom_column_names[col]) {
          console.log(`  ❌ Removing custom column name for: ${col}`);
          delete metadata.configuration.custom_column_names[col];
          changed = true;
        }
      });
    }
    
    if (changed) {
      // Write back the fixed metadata
      const yamlContent = yaml.dump(metadata, { 
        lineWidth: -1,
        noRefs: true,
        sortKeys: false
      });
      
      fs.writeFileSync(filePath, yamlContent, 'utf8');
      console.log(`  ✅ Fixed and saved ${path.basename(filePath)}`);
      return true;
    } else {
      console.log(`  ⚪ No changes needed for ${path.basename(filePath)}`);
      return false;
    }
    
  } catch (error) {
    console.error(`  ❌ Error fixing ${path.basename(filePath)}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🔍 Starting Database Schema Inconsistency Fix...\n');
  
  let totalFixed = 0;
  
  PROBLEMATIC_TABLES.forEach(tableFile => {
    const filePath = path.join(METADATA_DIR, tableFile);
    
    if (fs.existsSync(filePath)) {
      if (fixTableMetadata(filePath)) {
        totalFixed++;
      }
    } else {
      console.log(`⚠️  File not found: ${tableFile}`);
    }
  });
  
  console.log(`\n📊 SUMMARY:`);
  console.log(`✅ Fixed ${totalFixed} table metadata files`);
  console.log(`📁 Total files processed: ${PROBLEMATIC_TABLES.length}`);
  
  if (totalFixed > 0) {
    console.log(`\n📝 Next steps:`);
    console.log(`1. Run: hasura metadata apply`);
    console.log(`2. Verify: hasura metadata ic list`);
    console.log(`3. Test permission flows`);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { fixTableMetadata };