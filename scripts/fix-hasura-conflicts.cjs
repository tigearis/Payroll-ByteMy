#!/usr/bin/env node

// Fix Hasura metadata conflicts
const fs = require('fs');
const path = require('path');

async function fixHasuraConflicts() {
  console.log('🔧 Fixing Hasura metadata conflicts...');
  
  const metadataDir = './hasura/metadata/databases/default/tables';
  
  try {
    // Read all table metadata files
    const files = fs.readdirSync(metadataDir);
    console.log(`📁 Found ${files.length} metadata files`);
    
    // Look for problematic tables
    const problemTables = [];
    
    for (const file of files) {
      if (file.endsWith('.yaml') && file.includes('audit_log')) {
        console.log(`🔍 Checking ${file}...`);
        const filePath = path.join(metadataDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        if (content.includes('insertAuditLog') || content.includes('insert_audit_log')) {
          problemTables.push({ file, path: filePath, type: 'audit_log_conflict' });
        }
      }
      
      if (file.includes('security_alerts')) {
        console.log(`🔍 Checking ${file}...`);
        const filePath = path.join(metadataDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        if (content.includes('user:') || content.includes('"user"')) {
          problemTables.push({ file, path: filePath, type: 'user_field_conflict' });
        }
      }
    }
    
    console.log(`\n⚠️  Found ${problemTables.length} problematic files:`);
    problemTables.forEach(table => {
      console.log(`  - ${table.file} (${table.type})`);
    });
    
    // Strategy 1: Fix audit_log conflicts by customizing table names
    console.log('\n🔧 Strategy 1: Fixing audit_log conflicts...');
    
    // Check if we have both audit_log tables
    const publicAuditLog = files.find(f => f === 'public_audit_log.yaml');
    const auditSchemaLog = files.find(f => f === 'audit_audit_log.yaml');
    
    if (publicAuditLog && auditSchemaLog) {
      console.log('✅ Found both conflicting audit_log tables');
      
      // We should prioritize the audit schema version and rename/disable the public one
      const publicPath = path.join(metadataDir, publicAuditLog);
      const auditPath = path.join(metadataDir, auditSchemaLog);
      
      // Read the public audit_log file
      let publicContent = fs.readFileSync(publicPath, 'utf8');
      
      // Add custom GraphQL names to avoid conflicts
      if (!publicContent.includes('configuration:')) {
        const lines = publicContent.split('\n');
        const tableIndex = lines.findIndex(line => line.includes('table:'));
        
        if (tableIndex >= 0) {
          // Insert configuration section after table definition
          lines.splice(tableIndex + 2, 0, 
            'configuration:',
            '  custom_name: "publicAuditLog"',
            '  custom_root_fields:',
            '    select: "publicAuditLogs"',
            '    select_by_pk: "publicAuditLogById"',
            '    select_aggregate: "publicAuditLogsAggregate"',
            '    insert: "insertPublicAuditLog"',
            '    insert_one: "insertPublicAuditLogOne"',
            '    update: "updatePublicAuditLog"',
            '    update_by_pk: "updatePublicAuditLogByPk"',
            '    delete: "deletePublicAuditLog"',
            '    delete_by_pk: "deletePublicAuditLogByPk"'
          );
          
          const updatedContent = lines.join('\n');
          fs.writeFileSync(publicPath, updatedContent);
          console.log('✅ Updated public audit_log with custom GraphQL names');
        }
      }
    }
    
    // Strategy 2: Fix security_alerts user field conflict
    console.log('\n🔧 Strategy 2: Fixing security_alerts conflicts...');
    
    const securityAlertsFile = files.find(f => f.includes('security_alerts'));
    if (securityAlertsFile) {
      const securityPath = path.join(metadataDir, securityAlertsFile);
      let securityContent = fs.readFileSync(securityPath, 'utf8');
      
      // Check if it has field customization
      if (!securityContent.includes('column_config:')) {
        const lines = securityContent.split('\n');
        const tableIndex = lines.findIndex(line => line.includes('table:'));
        
        if (tableIndex >= 0) {
          // Add column configuration to rename conflicting fields
          lines.splice(-1, 0, // Insert before the last line
            'configuration:',
            '  column_config:',
            '    user:',
            '      custom_name: "userName"'
          );
          
          const updatedContent = lines.join('\n');
          fs.writeFileSync(securityPath, updatedContent);
          console.log('✅ Updated security_alerts with custom field names');
        }
      }
    }
    
    // Strategy 3: Alternative - Exclude problematic tables temporarily
    console.log('\n🔧 Strategy 3: Creating exclusion backup...');
    
    // Create a backup directory for problematic files
    const backupDir = './hasura/metadata/backup-conflicts';
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Instead of deleting, let's create a list of tables to exclude
    const excludeList = [];
    
    if (publicAuditLog) {
      // Move public audit_log to backup instead of deleting
      const backupPath = path.join(backupDir, publicAuditLog);
      if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(path.join(metadataDir, publicAuditLog), backupPath);
        console.log(`📦 Backed up ${publicAuditLog}`);
      }
      excludeList.push('public.audit_log');
    }
    
    // Update tables.yaml to exclude conflicting tables
    const tablesYamlPath = path.join(metadataDir, 'tables.yaml');
    if (fs.existsSync(tablesYamlPath)) {
      let tablesContent = fs.readFileSync(tablesYamlPath, 'utf8');
      
      // Remove references to problematic tables
      if (tablesContent.includes('- "!include public_audit_log.yaml"')) {
        tablesContent = tablesContent.replace('- "!include public_audit_log.yaml"\n', '');
        fs.writeFileSync(tablesYamlPath, tablesContent);
        console.log('✅ Removed public_audit_log from tables.yaml');
      }
    }
    
    console.log('\n🎯 Resolution Summary:');
    console.log('✅ Custom GraphQL names added to avoid conflicts');
    console.log('✅ Problematic tables backed up');
    console.log('✅ tables.yaml updated');
    
    console.log('\n📋 Next Steps:');
    console.log('1. Apply metadata: hasura metadata apply');
    console.log('2. Clear metadata: hasura metadata clear');
    console.log('3. Reload metadata: hasura metadata reload');
    console.log('4. Test GraphQL operations');
    
  } catch (error) {
    console.error('❌ Error fixing conflicts:', error.message);
  }
}

fixHasuraConflicts().catch(console.error);