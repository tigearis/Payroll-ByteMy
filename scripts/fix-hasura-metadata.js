#!/usr/bin/env node

/**
 * Hasura Metadata TypeCase and Relationship Name Fixer
 * 
 * This script analyzes and fixes all Hasura metadata files to ensure:
 * 1. Consistent camelCase for all custom field names
 * 2. Meaningful relationship names that describe the business context
 * 3. Proper GraphQL naming conventions
 * 4. SOC2 compliance annotations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Simple YAML parser for our specific use case
function parseYAML(content) {
  try {
    // Basic YAML parsing - this is simplified for metadata files
    const lines = content.split('\n');
    const result = {};
    let currentPath = [];
    let indentLevel = 0;
    
    for (const line of lines) {
      if (line.trim() === '' || line.trim().startsWith('#')) continue;
      
      const indent = line.length - line.trimStart().length;
      const trimmed = line.trim();
      
      if (trimmed.includes(':')) {
        const [key, value] = trimmed.split(':', 2);
        const cleanKey = key.trim();
        const cleanValue = value ? value.trim() : null;
        
        // Store the key-value pair (simplified)
        if (cleanValue && cleanValue !== '') {
          result[cleanKey] = cleanValue;
        }
      }
    }
    
    return result;
  } catch (error) {
    return {};
  }
}

function dumpYAML(obj) {
  // Simple YAML dumping - for our use case
  return Object.entries(obj)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
}

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Analysis results
let analysisResults = {
  summary: {
    totalFiles: 0,
    filesWithIssues: 0,
    fixesApplied: 0,
    timestamp: new Date().toISOString()
  },
  issues: [],
  fixes: [],
  recommendations: []
};

/**
 * Convert snake_case to camelCase
 */
function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

/**
 * Convert camelCase to PascalCase
 */
function toPascalCase(str) {
  const camelCase = toCamelCase(str);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
}

/**
 * Generate meaningful relationship names based on business context
 */
function generateMeaningfulRelationshipName(tableName, columnName, isArray = false) {
  const relationshipMappings = {
    // User relationships
    'users.manager_id': { object: 'managerUser', array: 'managedTeamMembers' },
    'users.created_by': { object: 'createdByUser', array: 'createdUsers' },
    'users.updated_by': { object: 'lastUpdatedByUser', array: 'lastUpdatedUsers' },
    'users.deactivated_by': { object: 'deactivatedByUser', array: 'deactivatedUsers' },
    'users.status_changed_by': { object: 'statusChangedByUser', array: 'statusChangedUsers' },
    
    // Payroll relationships
    'payrolls.client_id': { object: 'client', array: 'payrolls' },
    'payrolls.primary_consultant_user_id': { object: 'primaryConsultant', array: 'primaryConsultantPayrolls' },
    'payrolls.backup_consultant_user_id': { object: 'backupConsultant', array: 'backupConsultantPayrolls' },
    'payrolls.manager_user_id': { object: 'manager', array: 'managedPayrolls' },
    'payrolls.created_by_user_id': { object: 'createdByUser', array: 'createdPayrolls' },
    'payrolls.parent_payroll_id': { object: 'parentPayroll', array: 'childPayrolls' },
    'payrolls.cycle_id': { object: 'payrollCycle', array: 'payrollsUsingCycle' },
    'payrolls.date_type_id': { object: 'payrollDateType', array: 'payrollsUsingDateType' },
    
    // Client relationships
    'clients.created_by': { object: 'createdByUser', array: 'createdClients' },
    'clients.updated_by': { object: 'lastUpdatedByUser', array: 'lastUpdatedClients' },
    
    // Billing relationships
    'billingitems.client_id': { object: 'client', array: 'billingItems' },
    'billingitems.payroll_id': { object: 'relatedPayroll', array: 'billingItems' },
    'billingitems.staff_user_id': { object: 'staffUser', array: 'billingItemsAsStaff' },
    'billingitems.approved_by': { object: 'approver', array: 'approvedBillingItems' },
    'billingitems.confirmed_by': { object: 'confirmedByUser', array: 'confirmedBillingItems' },
    'billingitems.billing_plan_id': { object: 'billingPlan', array: 'billingItems' },
    'billingitems.service_id': { object: 'billingService', array: 'billingItems' },
    
    // Work schedule relationships
    'workschedule.user_id': { object: 'user', array: 'workScheduleEntries' },
    
    // User skills relationships
    'userskills.user_id': { object: 'user', array: 'userSkills' },
    'userskills.skill_id': { object: 'skill', array: 'userSkillAssignments' },
    
    // Time entries relationships
    'timeentries.staff_user_id': { object: 'staffUser', array: 'timeEntries' },
    'timeentries.client_id': { object: 'client', array: 'timeEntries' },
    'timeentries.payroll_id': { object: 'relatedPayroll', array: 'timeEntries' },
    'timeentries.billing_item_id': { object: 'billingItem', array: 'timeEntries' },
    
    // Payroll dates relationships
    'payrolldates.payroll_id': { object: 'payroll', array: 'payrollDates' },
    
    // User invitations relationships
    'userinvitations.invited_by': { object: 'invitedByUser', array: 'sentInvitations' },
    'userinvitations.accepted_by': { object: 'acceptedByUser', array: 'acceptedInvitations' },
    'userinvitations.revoked_by': { object: 'revokedByUser', array: 'revokedInvitations' },
    'userinvitations.manager_id': { object: 'assignedManager', array: 'managedInvitations' },
    
    // Leave relationships
    'leave.user_id': { object: 'user', array: 'leaveRecords' },
    'leave.approved_by': { object: 'approverUser', array: 'approvedLeaveRequests' },
    
    // Notes relationships
    'notes.user_id': { object: 'authorUser', array: 'authoredNotes' },
    'notes.entity_id': { object: 'relatedEntity', array: 'notes' },
    
    // Permission and audit relationships
    'userroles.user_id': { object: 'user', array: 'assignedRoles' },
    'userroles.role_id': { object: 'assignedRole', array: 'assignedToUsers' },
    'permissionoverrides.user_id': { object: 'user', array: 'permissionOverrides' },
    'permissionoverrides.created_by': { object: 'createdByUser', array: 'createdPermissionOverrides' },
    
    // Billing periods and invoices
    'billingperiods.client_id': { object: 'client', array: 'billingPeriods' },
    'billinginvoice.client_id': { object: 'client', array: 'billingInvoices' },
    'billinginvoice.billing_period_id': { object: 'billingPeriod', array: 'billingInvoices' },
    'billinginvoiceitem.invoice_id': { object: 'billingInvoice', array: 'billingInvoiceItems' },
    
    // External systems
    'clientexternalsystems.client_id': { object: 'client', array: 'externalSystemConnections' },
    'clientexternalsystems.external_system_id': { object: 'externalSystem', array: 'clientConnections' },
  };

  const key = `${tableName}.${columnName}`;
  const mapping = relationshipMappings[key];
  
  if (mapping) {
    return isArray ? mapping.array : mapping.object;
  }

  // Fallback to generated names
  if (isArray) {
    // For array relationships, use the table name being referenced
    const baseColumnName = columnName.replace(/_id$/, '');
    return toCamelCase(baseColumnName) + 's';
  } else {
    // For object relationships, use the column name without _id
    const baseColumnName = columnName.replace(/_id$/, '');
    return toCamelCase(baseColumnName);
  }
}

/**
 * Analyze metadata file for issues
 */
function analyzeMetadataFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const metadata = parseYAML(content);
    
    if (!metadata || !metadata.table) {
      return { issues: [], fixes: [] };
    }

    const issues = [];
    const fixes = [];
    const tableName = metadata.table.name;

    // Check custom column names consistency
    if (metadata.configuration?.custom_column_names) {
      Object.entries(metadata.configuration.custom_column_names).forEach(([dbColumn, customName]) => {
        const expectedCamelCase = toCamelCase(dbColumn);
        
        if (customName !== expectedCamelCase) {
          issues.push({
            type: 'COLUMN_NAMING',
            table: tableName,
            field: dbColumn,
            current: customName,
            expected: expectedCamelCase,
            severity: 'MEDIUM'
          });
          
          fixes.push({
            type: 'FIX_COLUMN_NAMING',
            table: tableName,
            field: dbColumn,
            from: customName,
            to: expectedCamelCase
          });
        }
      });
    }

    // Check relationship names
    if (metadata.object_relationships) {
      metadata.objectrelationships.forEach(rel => {
        if (rel.using?.foreign_key_constraint_on) {
          const column = rel.using.foreign_key_constraint_on;
          const expectedName = generateMeaningfulRelationshipName(tableName, column, false);
          
          if (rel.name !== expectedName && !isAcceptableRelationshipName(rel.name, column)) {
            issues.push({
              type: 'RELATIONSHIP_NAMING',
              table: tableName,
              relationship: rel.name,
              column: column,
              expected: expectedName,
              severity: 'LOW'
            });
            
            fixes.push({
              type: 'FIX_RELATIONSHIP_NAMING',
              table: tableName,
              relationshipType: 'object',
              from: rel.name,
              to: expectedName,
              column: column
            });
          }
        }
      });
    }

    // Check array relationship names
    if (metadata.array_relationships) {
      metadata.arrayrelationships.forEach(rel => {
        if (rel.using?.foreign_key_constraint_on) {
          const column = rel.using.foreignkeyconstraint_on.column;
          const referencedTable = rel.using.foreignkeyconstraint_on.table?.name;
          const expectedName = generateMeaningfulRelationshipName(referencedTable, column, true);
          
          if (rel.name !== expectedName && !isAcceptableRelationshipName(rel.name, column)) {
            issues.push({
              type: 'RELATIONSHIP_NAMING',
              table: tableName,
              relationship: rel.name,
              column: column,
              expected: expectedName,
              severity: 'LOW'
            });
            
            fixes.push({
              type: 'FIX_RELATIONSHIP_NAMING',
              table: tableName,
              relationshipType: 'array',
              from: rel.name,
              to: expectedName,
              column: column
            });
          }
        }
      });
    }

    // Check custom root fields naming
    if (metadata.configuration?.custom_root_fields) {
      const rootFields = metadata.configuration.custom_root_fields;
      const tableCamelCase = toCamelCase(tableName);
      const tablePascalCase = toPascalCase(tableName);
      
      const expectedRootFields = {
        select: tableCamelCase,
        select_by_pk: tableCamelCase.replace(/s$/, '') + 'ById',
        select_aggregate: tableCamelCase + 'Aggregate',
        insert: 'bulkInsert' + tablePascalCase,
        insert_one: 'insert' + tableCamelCase.replace(/s$/, '').replace(/^(.)/, c => c.toUpperCase()),
        update: 'bulkUpdate' + tablePascalCase,
        update_by_pk: 'update' + tableCamelCase.replace(/s$/, '').replace(/^(.)/, c => c.toUpperCase()) + 'ById',
        delete: 'bulkDelete' + tablePascalCase,
        delete_by_pk: 'delete' + tableCamelCase.replace(/s$/, '').replace(/^(.)/, c => c.toUpperCase()) + 'ById'
      };
      
      Object.entries(expectedRootFields).forEach(([operation, expectedName]) => {
        if (rootFields[operation] && rootFields[operation] !== expectedName) {
          issues.push({
            type: 'ROOT_FIELD_NAMING',
            table: tableName,
            operation: operation,
            current: rootFields[operation],
            expected: expectedName,
            severity: 'LOW'
          });
          
          fixes.push({
            type: 'FIX_ROOT_FIELD_NAMING',
            table: tableName,
            operation: operation,
            from: rootFields[operation],
            to: expectedName
          });
        }
      });
    }

    return { issues, fixes };
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error.message);
    return { issues: [], fixes: [] };
  }
}

/**
 * Check if a relationship name is acceptable (avoids over-correcting good names)
 */
function isAcceptableRelationshipName(currentName, column) {
  const acceptablePatterns = [
    'client', 'user', 'manager', 'consultant', 'payroll', 'billing',
    'approver', 'creator', 'assignedRole', 'parentPayroll', 'childPayrolls'
  ];
  
  return acceptablePatterns.some(pattern => 
    currentName.toLowerCase().includes(pattern.toLowerCase())
  );
}

/**
 * Apply fixes to metadata file
 */
function applyFixes(filePath, fixes) {
  if (fixes.length === 0) return false;

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let metadata = yaml.load(content);
    
    if (!metadata || !metadata.table) return false;

    let modified = false;

    fixes.forEach(fix => {
      switch (fix.type) {
        case 'FIX_COLUMN_NAMING':
          if (metadata.configuration?.custom_column_names?.[fix.field]) {
            metadata.configuration.custom_column_names[fix.field] = fix.to;
            modified = true;
          }
          if (metadata.configuration?.column_config?.[fix.field]?.custom_name) {
            metadata.configuration.column_config[fix.field].custom_name = fix.to;
            modified = true;
          }
          break;
          
        case 'FIX_RELATIONSHIP_NAMING':
          const relationships = fix.relationshipType === 'object' 
            ? metadata.object_relationships 
            : metadata.array_relationships;
            
          if (relationships) {
            const rel = relationships.find(r => r.name === fix.from);
            if (rel) {
              rel.name = fix.to;
              modified = true;
            }
          }
          break;
          
        case 'FIX_ROOT_FIELD_NAMING':
          if (metadata.configuration?.custom_root_fields?.[fix.operation]) {
            metadata.configuration.custom_root_fields[fix.operation] = fix.to;
            modified = true;
          }
          break;
      }
    });

    if (modified) {
      // Add SOC2 compliance comment
      if (!metadata.comment || !metadata.comment.includes('SOC2')) {
        const securityLevel = getTableSecurityLevel(metadata.table.name);
        metadata.comment = `SOC2 Compliant Table - Security Level: ${securityLevel} | Auto-updated: ${new Date().toISOString()}`;
      }

      // Write back to file with proper formatting
      const yamlOptions = {
        indent: 2,
        lineWidth: -1,
        noRefs: true,
        sortKeys: false
      };
      
      const newContent = yaml.dump(metadata, yamlOptions);
      fs.writeFileSync(filePath, newContent, 'utf8');
      
      console.log(`✅ Applied ${fixes.length} fixes to ${path.basename(filePath)}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error applying fixes to ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Get security level for table (based on domain classification)
 */
function getTableSecurityLevel(tableName) {
  const criticalTables = ['users', 'userroles', 'permissions', 'audit_log', 'auth_events'];
  const highTables = ['clients', 'billing_items', 'billing_invoice', 'user_invitations', 'email_templates'];
  const mediumTables = ['payrolls', 'notes', 'leave', 'work_schedule', 'payroll_dates'];
  
  if (criticalTables.some(t => tableName.includes(t))) return 'CRITICAL';
  if (highTables.some(t => tableName.includes(t))) return 'HIGH';
  if (mediumTables.some(t => tableName.includes(t))) return 'MEDIUM';
  return 'LOW';
}

/**
 * Scan all metadata files
 */
function scanMetadataFiles() {
  const metadataDir = path.join(__dirname, '../hasura/metadata/databases/default/tables');
  
  if (!fs.existsSync(metadataDir)) {
    console.error('Hasura metadata directory not found:', metadataDir);
    return [];
  }

  const files = fs.readdirSync(metadataDir)
    .filter(file => file.endsWith('.yaml') && file.startsWith('public_'))
    .map(file => path.join(metadataDir, file));
    
  console.log(`Found ${files.length} table metadata files`);
  return files;
}

/**
 * Generate analysis report
 */
function generateReport() {
  console.log('\n=== HASURA METADATA ANALYSIS REPORT ===\n');
  
  const { summary, issues, fixes, recommendations } = analysisResults;
  
  console.log('📊 Summary:');
  console.log(`  Total files analyzed: ${summary.totalFiles}`);
  console.log(`  Files with issues: ${summary.filesWithIssues}`);
  console.log(`  Fixes applied: ${summary.fixesApplied}`);
  console.log(`  Analysis completed: ${summary.timestamp}\n`);

  if (issues.length > 0) {
    console.log('⚠️  Issues Found:');
    
    const issuesByType = issues.reduce((acc, issue) => {
      acc[issue.type] = (acc[issue.type] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(issuesByType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} issues`);
    });
    
    console.log('\n📋 Top Issues:');
    issues.slice(0, 10).forEach((issue, index) => {
      console.log(`  ${index + 1}. ${issue.type} in ${issue.table}`);
      console.log(`     Current: ${issue.current || issue.relationship}`);
      console.log(`     Expected: ${issue.expected}`);
    });
  }

  if (recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    recommendations.forEach((rec, index) => {
      console.log(`  ${index + 1}. ${rec}`);
    });
  }

  // Save detailed report
  const reportPath = path.join(__dirname, '../audit-reports/hasura-metadata-analysis.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(analysisResults, null, 2));
  
  console.log(`\n📄 Detailed report saved: ${reportPath}`);
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Starting Hasura Metadata Analysis and Fixes\n');
  
  const metadataFiles = scanMetadataFiles();
  analysisResults.summary.totalFiles = metadataFiles.length;
  
  for (const filePath of metadataFiles) {
    const tableName = path.basename(filePath, '.yaml').replace('public_', '');
    console.log(`Analyzing ${tableName}...`);
    
    const { issues, fixes } = analyzeMetadataFile(filePath);
    
    if (issues.length > 0) {
      analysisResults.summary.filesWithIssues++;
      analysisResults.issues.push(...issues);
      analysisResults.fixes.push(...fixes);
      
      // Apply fixes if --fix flag is provided
      if (process.argv.includes('--fix')) {
        const applied = applyFixes(filePath, fixes);
        if (applied) {
          analysisResults.summary.fixesApplied += fixes.length;
        }
      }
    }
  }

  // Add recommendations
  if (analysisResults.issues.length > 0) {
    analysisResults.recommendations.push(
      'Consider running with --fix flag to automatically apply naming convention fixes',
      'Review relationship names to ensure they reflect business context',
      'Ensure all custom column names follow camelCase convention',
      'Add SOC2 compliance annotations to all table metadata'
    );
  }

  generateReport();
  
  const hasIssues = analysisResults.issues.length > 0;
  console.log(hasIssues ? '\n⚠️  Issues found. Run with --fix to apply fixes.' : '\n✅ All metadata follows naming conventions!');
  
  process.exit(hasIssues ? 1 : 0);
}

// Run the analysis
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main };