#!/usr/bin/env npx tsx
/**
 * Fix Component Permission Issues
 * Batch fixes for components that have broken permission guards
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// Components that need permission fixes
const componentFixes = [
  { file: 'domains/payrolls/components/payroll-schedule.tsx', permission: 'payroll:read' },
  { file: 'domains/payrolls/components/upcoming-payrolls.tsx', permission: 'payroll:read' },
  { file: 'domains/users/components/user-table.tsx', permission: 'staff:read' },
  { file: 'domains/users/components/users-table-unified.tsx', permission: 'staff:read' },
  { file: 'domains/users/components/user-form-modal.tsx', permission: 'staff:write' },
  { file: 'domains/users/components/sync-user-button.tsx', permission: 'staff:write' },
  { file: 'domains/users/components/user-sync-fallback.tsx', permission: 'staff:read' },
];

function fixComponentPermission(filePath: string, permission: string) {
  const fullPath = join(process.cwd(), filePath);
  
  try {
    if (!statSync(fullPath).isFile()) {
      console.log(`⚠️  ${filePath} - File not found`);
      return;
    }

    let content = readFileSync(fullPath, 'utf-8');
    
    // Check if already has permission protection
    if (content.includes('PermissionGuard') || 
        content.includes('useEnhancedPermissions') ||
        content.includes('hasPermission')) {
      console.log(`✓ ${filePath} already has permission protection`);
      return;
    }
    
    // Add necessary imports
    if (!content.includes('useEnhancedPermissions')) {
      // Find the last import
      const lines = content.split('\n');
      let lastImportIndex = -1;
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('import ') && !lines[i].includes('type ')) {
          lastImportIndex = i;
        }
      }
      
      if (lastImportIndex !== -1) {
        lines.splice(lastImportIndex + 1, 0, 'import { useEnhancedPermissions } from "@/lib/auth/enhanced-auth-context";');
        content = lines.join('\n');
      }
    }
    
    // Find the main export function
    const exportMatch = content.match(/export\s+(function|const)\s+(\w+)/);
    if (!exportMatch) {
      console.log(`⚠️  ${filePath} - Could not find export function`);
      return;
    }
    
    const functionName = exportMatch[2];
    
    // Find the function opening brace
    const functionStart = content.indexOf('{', content.indexOf(exportMatch[0]));
    if (functionStart === -1) {
      console.log(`⚠️  ${filePath} - Could not find function body`);
      return;
    }
    
    // Insert permission check after opening brace
    const permissionCheck = `
  const { hasPermission } = useEnhancedPermissions();
  
  if (!hasPermission('${permission}')) {
    return null;
  }
`;
    
    content = content.substring(0, functionStart + 1) + permissionCheck + content.substring(functionStart + 1);
    
    writeFileSync(fullPath, content);
    console.log(`✅ Fixed ${filePath} with ${permission} permission`);
    
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error);
  }
}

// Fix specific known broken files
function fixBrokenComponents() {
  console.log('🔧 Fixing broken component imports...\n');
  
  const brokenFiles = [
    'domains/payrolls/components/payroll-schedule.tsx',
    'domains/payrolls/components/upcoming-payrolls.tsx'
  ];
  
  for (const file of brokenFiles) {
    const fullPath = join(process.cwd(), file);
    
    try {
      if (!statSync(fullPath).isFile()) continue;
      
      let content = readFileSync(fullPath, 'utf-8');
      
      // Fix import statements that got corrupted
      content = content.replace(
        /import\s*{\s*import\s*{\s*PermissionGuard.*?;/gs,
        'import { PermissionGuard } from "@/components/auth/permission-guard";\nimport { useEnhancedPermissions } from "@/lib/auth/enhanced-auth-context";'
      );
      
      // Fix function parameter issues
      content = content.replace(
        /export\s+(function|const)\s+(\w+)\s*\(\s*{\s*const\s*{\s*hasPermission.*?}\s*=\s*useEnhancedPermissions\(\);\s*if\s*\(\s*!hasPermission.*?\)\s*{\s*return\s*null;\s*}\s*([^}]+),/gs,
        (match, exportType, functionName, params) => {
          return `export ${exportType} ${functionName}({\n  ${params.trim()},`;
        }
      );
      
      writeFileSync(fullPath, content);
      console.log(`✅ Fixed import issues in ${file}`);
      
    } catch (error) {
      console.error(`❌ Error fixing ${file}:`, error);
    }
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting Component Permission Fixes...\n');
  
  // Fix broken imports first
  fixBrokenComponents();
  
  console.log('\n📋 Adding permission guards to remaining components...');
  for (const component of componentFixes) {
    fixComponentPermission(component.file, component.permission);
  }
  
  console.log('\n✅ Component fixes complete!');
  console.log('\nNext steps:');
  console.log('1. Run "pnpm type-check" to verify fixes');
  console.log('2. Test components to ensure they render correctly');
}

main().catch(console.error);