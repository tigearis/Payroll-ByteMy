#!/usr/bin/env npx tsx
/**
 * Fix Critical Permission Issues
 * Adds PermissionGuard protection to sensitive components
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface ComponentFix {
  file: string;
  permission: string;
  wrapExport?: boolean;
}

const criticalComponents: ComponentFix[] = [
  // Payroll components
  { file: 'domains/payrolls/components/payrolls-table.tsx', permission: 'payroll:read' },
  { file: 'domains/payrolls/components/payrolls-table-unified.tsx', permission: 'payroll:read' },
  { file: 'domains/payrolls/components/edit-payroll-dialog.tsx', permission: 'payroll:write' },
  { file: 'domains/payrolls/components/payroll-details-card.tsx', permission: 'payroll:read' },
  { file: 'domains/payrolls/components/payroll-list-card.tsx', permission: 'payroll:read' },
  { file: 'domains/payrolls/components/payroll-schedule.tsx', permission: 'payroll:read' },
  { file: 'domains/payrolls/components/upcoming-payrolls.tsx', permission: 'payroll:read' },
  
  // Financial components
  { file: 'components/australian-tax-calculator.tsx', permission: 'payroll:read' },
  { file: 'components/export-csv.tsx', permission: 'payroll:export' },
  { file: 'components/export-pdf.tsx', permission: 'payroll:export' },
  
  // User management components
  { file: 'domains/users/components/user-table.tsx', permission: 'staff:read' },
  { file: 'domains/users/components/users-table-unified.tsx', permission: 'staff:read' },
  { file: 'domains/users/components/user-role-management.tsx', permission: 'staff:write' },
  { file: 'domains/users/components/user-form-modal.tsx', permission: 'staff:write' },
  { file: 'components/invitations/invitation-management-table.tsx', permission: 'staff:write' },
];

function addPermissionGuard(filePath: string, permission: string) {
  const fullPath = join(process.cwd(), filePath);
  
  try {
    let content = readFileSync(fullPath, 'utf-8');
    
    // Check if already has permission protection
    if (content.includes('PermissionGuard') || 
        content.includes('useEnhancedPermissions') ||
        content.includes('hasPermission')) {
      console.log(`✓ ${filePath} already has permission protection`);
      return;
    }
    
    // Add import if not present
    if (!content.includes('PermissionGuard')) {
      const importStatement = `import { PermissionGuard } from "@/components/auth/permission-guard";\n`;
      
      // Find the last import statement
      const importRegex = /^import\s+.*$/gm;
      const imports = content.match(importRegex);
      if (imports) {
        const lastImport = imports[imports.length - 1];
        content = content.replace(lastImport, `${lastImport}\n${importStatement}`);
      } else {
        // No imports found, add at the beginning
        content = importStatement + content;
      }
    }
    
    // Find the main export and wrap it
    const exportRegex = /export\s+(default\s+)?function\s+(\w+)|export\s+const\s+(\w+)\s*=/;
    const match = content.match(exportRegex);
    
    if (match) {
      const componentName = match[2] || match[3];
      
      // For default exports
      if (match[0].includes('default')) {
        // Find the return statement of the component
        const functionBody = content.substring(content.indexOf(match[0]));
        const returnMatch = functionBody.match(/return\s*\(/);
        
        if (returnMatch) {
          // Wrap the return content
          content = content.replace(
            /return\s*\(/,
            `return (\n    <PermissionGuard permission="${permission}">\n      `
          );
          
          // Find the closing of the return statement
          let openParens = 1;
          let i = content.indexOf('return (') + 8;
          while (openParens > 0 && i < content.length) {
            if (content[i] === '(') openParens++;
            if (content[i] === ')') openParens--;
            i++;
          }
          
          // Insert closing tag before the last closing paren
          content = content.substring(0, i - 1) + '\n    </PermissionGuard>\n  )' + content.substring(i);
        }
      } else {
        // For named exports, we'll add a check at the beginning
        const componentStart = content.indexOf('{', content.indexOf(match[0]));
        if (componentStart !== -1) {
          const insertPos = componentStart + 1;
          const permissionCheck = `
  const { hasPermission } = useEnhancedPermissions();
  
  if (!hasPermission('${permission}')) {
    return null;
  }
`;
          content = content.substring(0, insertPos) + permissionCheck + content.substring(insertPos);
          
          // Add the hook import
          if (!content.includes('useEnhancedPermissions')) {
            content = content.replace(
              'import { PermissionGuard } from "@/components/auth/permission-guard";',
              'import { PermissionGuard } from "@/components/auth/permission-guard";\nimport { useEnhancedPermissions } from "@/lib/auth/enhanced-auth-context";'
            );
          }
        }
      }
    }
    
    writeFileSync(fullPath, content);
    console.log(`✅ Fixed ${filePath} with ${permission} permission`);
    
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error);
  }
}

// Fix API routes with missing auth
function fixApiAuth() {
  const apiRoutes = [
    'app/api/fallback/route.ts',
    'app/api/signed/payroll-operations/route.ts',
    'app/api/sync-current-user/route.ts',
  ];
  
  for (const route of apiRoutes) {
    const fullPath = join(process.cwd(), route);
    
    try {
      let content = readFileSync(fullPath, 'utf-8');
      
      // Check if already has withAuth
      if (content.includes('withAuth')) {
        console.log(`✓ ${route} already has withAuth`);
        continue;
      }
      
      // Add import
      if (!content.includes('withAuth')) {
        content = `import { withAuth } from "@/lib/auth/api-auth";\n` + content;
      }
      
      // Wrap exports
      content = content.replace(
        /export\s+const\s+(GET|POST|PUT|DELETE|PATCH)\s*=\s*async/g,
        'export const $1 = withAuth(async'
      );
      
      // Add closing parenthesis
      content = content.replace(
        /};(\s*)$/,
        '});$1'
      );
      
      writeFileSync(fullPath, content);
      console.log(`✅ Fixed ${route} with withAuth wrapper`);
      
    } catch (error) {
      console.error(`❌ Error fixing ${route}:`, error);
    }
  }
}

// Main execution
async function main() {
  console.log('🔧 Fixing Critical Permission Issues...\n');
  
  console.log('📋 Adding PermissionGuard to sensitive components...');
  for (const component of criticalComponents) {
    addPermissionGuard(component.file, component.permission);
  }
  
  console.log('\n🔐 Adding withAuth to API routes...');
  fixApiAuth();
  
  console.log('\n✅ Critical fixes complete!');
  console.log('\nNext steps:');
  console.log('1. Run "pnpm type-check" to verify no TypeScript errors were introduced');
  console.log('2. Run "npx tsx scripts/audit-conformance.ts" to verify critical issues are resolved');
  console.log('3. Test the application to ensure components still render correctly');
}

main().catch(console.error);