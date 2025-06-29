#!/usr/bin/env node

/**
 * Authentication System Reorganization Script
 * 
 * This script safely moves complex permission files to legacy-permissions/
 * while preserving git history and maintaining core authentication functionality.
 * 
 * Usage: node scripts/reorganize-auth-permissions.js
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LEGACY_DIR = 'legacy-permissions';

// Files and directories to move to legacy-permissions (preserve git history)
const MOVE_FILES = [
  // Core permission system
  'lib/auth/permissions.ts',
  'lib/auth/enhanced-auth-context.tsx',
  'types/permissions.ts',
  
  // Permission components
  'components/auth/permission-guard.tsx',
  'components/auth/permission-denied.tsx', 
  'components/auth/role-guard.tsx',
  'components/auth/route-guard.tsx',
  'components/auth/strict-database-guard.tsx',
  'components/auth/developer-only.tsx',
  
  // Permission domains
  'domains/permissions',
  
  // Security monitoring
  'lib/security/role-monitoring.ts',
  'lib/security/role-monitoring-client.ts',
  'lib/security/auth-audit.ts',
  'lib/security/enhanced-route-monitor.ts',
  'lib/security/audit',
  
  // Permission hooks
  'hooks/use-subscription-permissions.ts',
  'hooks/use-user-management.ts',
  'hooks/use-staff-management.ts',
  
  // Admin permission components
  'components/admin/permission-override-manager.tsx',
  
  // Debug tools
  'components/debug/debug-permissions.tsx',
  'components/debug/debug-permission-info.tsx',
  'components/debug/auth-debug-panel.tsx',
  
  // Permission-related scripts
  'scripts/migrate-user-allowed-roles.ts',
  'scripts/fix-component-permissions.ts',
  'scripts/fix-hasura-permissions.js',
  
  // Documentation (permission-specific)
  'docs/PERMISSION_SYSTEM_GUIDE.md',
  'docs/security/COMPONENT_PERMISSION_IMPLEMENTATION.md',
  'docs/security/ENHANCED_JWT_TEMPLATE_GUIDE.md',
];

// Files to modify (keep but simplify)
const MODIFY_FILES = [
  'middleware.ts',
  'lib/auth/api-auth.ts',
  'config/routes.ts', 
  'lib/auth/index.ts',
  'hooks/use-user-role.ts',
  'app/providers.tsx',
  'components/sidebar.tsx',
];

// New simplified files to create
const CREATE_FILES = [
  'lib/auth/simple-permissions.ts',
  'components/auth/simple-auth-guard.tsx',
  'lib/auth/simple-auth-context.tsx',
  'hooks/use-simple-auth.ts',
  'components/auth/admin-only.tsx',
  'lib/auth/basic-audit.ts',
];

function createLegacyDirectory() {
  console.log('📁 Creating legacy-permissions directory structure...');
  
  if (!fs.existsSync(LEGACY_DIR)) {
    fs.mkdirSync(LEGACY_DIR, { recursive: true });
  }
  
  // Create subdirectories
  const subDirs = [
    'lib/auth',
    'lib/security',
    'components/auth',
    'components/admin',
    'components/debug',
    'hooks',
    'types',
    'domains',
    'scripts',
    'docs/security',
  ];
  
  subDirs.forEach(dir => {
    const fullPath = path.join(LEGACY_DIR, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
  
  console.log('✅ Legacy directory structure created');
}

function moveFilesWithHistory() {
  console.log('🚚 Moving complex permission files to legacy...');
  
  let movedCount = 0;
  let skippedCount = 0;
  
  MOVE_FILES.forEach(file => {
    if (fs.existsSync(file)) {
      const targetPath = path.join(LEGACY_DIR, file);
      const targetDir = path.dirname(targetPath);
      
      // Ensure target directory exists
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      try {
        // Use git mv to preserve history
        execSync(`git mv "${file}" "${targetPath}"`, { stdio: 'pipe' });
        console.log(`  ✅ Moved: ${file} → ${targetPath}`);
        movedCount++;
      } catch (error) {
        console.log(`  ⚠️ Failed to move ${file}: ${error.message}`);
        skippedCount++;
      }
    } else {
      console.log(`  ⏭️ Skipped (not found): ${file}`);
      skippedCount++;
    }
  });
  
  console.log(`\n📊 Move Summary: ${movedCount} moved, ${skippedCount} skipped`);
}

function createLegacyReadme() {
  const readmeContent = `# Legacy Permissions System

This folder contains the complex enterprise-grade permission system that was moved during the authentication system rebuild.

## What's in this folder

### Core Permission System
- **Complex RBAC**: 5-tier role hierarchy with 23 granular permissions
- **SOC2 Compliance**: Enterprise audit logging and security monitoring
- **Permission Overrides**: User-specific permission customization
- **Advanced Guards**: Component-level permission enforcement

### Key Components
- \`lib/auth/permissions.ts\` - Core permission definitions and logic
- \`lib/auth/enhanced-auth-context.tsx\` - Complex authentication context
- \`components/auth/permission-guard.tsx\` - Component-level RBAC
- \`lib/security/role-monitoring.ts\` - Advanced security monitoring

### Why moved to legacy
- **Over-engineering**: System became too complex for current needs
- **Performance**: Multiple permission checks creating overhead
- **Maintenance**: Complex interdependencies making changes difficult
- **Simplification**: Moving to basic role-based access control

## Restoration Guide

If you need to restore the complex permission system:

1. **Copy files back** to their original locations
2. **Update imports** throughout the codebase
3. **Restore database schemas** for permission tables
4. **Re-enable SOC2 compliance** features
5. **Update environment variables** for security monitoring

## Architecture Overview

The legacy system implemented a sophisticated 5-layer security model:
\`\`\`
Clerk → Middleware → Apollo → Hasura → PostgreSQL
\`\`\`

With comprehensive features:
- 23 granular permissions across 6 categories
- Role escalation monitoring
- Real-time security alerts
- Component-level protection
- API-level authorization
- Database row-level security

## Documentation

See the docs/ folder for comprehensive documentation on the legacy permission system architecture and implementation details.

---

**Created**: ${new Date().toISOString()}
**Reason**: Authentication system simplification
**Status**: Safe for future restoration
`;

  fs.writeFileSync(path.join(LEGACY_DIR, 'README.md'), readmeContent);
  console.log('📝 Created legacy-permissions/README.md');
}

function createManifest() {
  const manifest = {
    createdAt: new Date().toISOString(),
    reason: 'Authentication system simplification',
    originalFiles: MOVE_FILES,
    modifiedFiles: MODIFY_FILES,
    newFiles: CREATE_FILES,
    statistics: {
      filesMovedToLegacy: MOVE_FILES.length,
      filesToModify: MODIFY_FILES.length,
      newFilesToCreate: CREATE_FILES.length,
    },
    restorationInstructions: 'See README.md for restoration guide',
  };
  
  fs.writeFileSync(
    path.join(LEGACY_DIR, 'MANIFEST.json'), 
    JSON.stringify(manifest, null, 2)
  );
  console.log('📋 Created legacy-permissions/MANIFEST.json');
}

function showModificationInstructions() {
  console.log('\n🔧 Files requiring manual modification:');
  console.log('   (Remove complex permissions, keep basic role hierarchy)\n');
  
  MODIFY_FILES.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`   📝 ${file}`);
      
      // Provide specific instructions for key files
      switch (file) {
        case 'middleware.ts':
          console.log('      → Remove granular permission checking');
          console.log('      → Keep basic role hierarchy (developer > org_admin > manager > consultant > viewer)');
          console.log('      → Preserve OAuth flow handling');
          break;
        case 'lib/auth/api-auth.ts':
          console.log('      → Remove complex permission validation');
          console.log('      → Keep basic withAuth() wrapper with role checking');
          console.log('      → Preserve rate limiting and audit logging');
          break;
        case 'lib/auth/index.ts':
          console.log('      → Remove enhanced auth context exports');
          console.log('      → Keep basic role types and token utilities');
          break;
      }
      console.log('');
    }
  });
}

function showNewFileInstructions() {
  console.log('🆕 New simplified files to create:\n');
  
  CREATE_FILES.forEach(file => {
    console.log(`   📝 ${file}`);
    
    switch (file) {
      case 'lib/auth/simple-permissions.ts':
        console.log('      → Basic 5-role hierarchy');
        console.log('      → Simple admin/manager/authenticated checks');
        break;
      case 'components/auth/simple-auth-guard.tsx':
        console.log('      → Replace complex PermissionGuard');
        console.log('      → Props: requireAdmin, requireManager, requireAuth');
        break;
      case 'lib/auth/simple-auth-context.tsx':
        console.log('      → Basic auth context: isAuthenticated, userRole, isAdmin');
        console.log('      → Remove complex permission checking');
        break;
    }
    console.log('');
  });
}

function gitCommitReorganization() {
  try {
    execSync('git add .', { stdio: 'pipe' });
    execSync('git commit -m "📦 Move complex permissions to legacy-permissions/\n\nMoved enterprise-grade permission system to legacy folder\nto simplify authentication to basic role-based access control.\n\nFiles moved:\n- Complex RBAC system (23 permissions)\n- SOC2 compliance features\n- Advanced security monitoring\n- Component-level permission guards\n\nCore authentication preserved:\n- Clerk integration\n- OAuth flows\n- Basic role hierarchy\n- Token management"', { stdio: 'pipe' });
    console.log('\n✅ Changes committed to git');
  } catch (error) {
    console.log('\n⚠️ Git commit failed - please commit manually');
    console.log('   Suggested commit message:');
    console.log('   "📦 Move complex permissions to legacy-permissions/"');
  }
}

function main() {
  console.log('🚀 Starting Authentication System Reorganization\n');
  console.log('This will move complex permission files to legacy-permissions/');
  console.log('while preserving core authentication functionality.\n');
  
  try {
    // Phase 1: Setup
    createLegacyDirectory();
    
    // Phase 2: Move files
    moveFilesWithHistory();
    
    // Phase 3: Documentation
    createLegacyReadme();
    createManifest();
    
    // Phase 4: Instructions
    showModificationInstructions();
    showNewFileInstructions();
    
    // Phase 5: Commit
    gitCommitReorganization();
    
    console.log('\n🎉 Phase 1 Complete: File Reorganization');
    console.log('\nNext Steps:');
    console.log('1. Create new simplified auth files');
    console.log('2. Modify existing files to remove complex permissions');
    console.log('3. Update imports throughout codebase');
    console.log('4. Test core authentication flows');
    console.log('5. Update documentation');
    
    console.log('\n📁 Legacy system safely stored in:', LEGACY_DIR);
    console.log('📋 See MANIFEST.json for complete file listing');
    
  } catch (error) {
    console.error('❌ Reorganization failed:', error.message);
    console.error('Please resolve the issue and try again.');
    process.exit(1);
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  moveFilesWithHistory,
  MOVE_FILES,
  MODIFY_FILES,
  CREATE_FILES,
  LEGACY_DIR,
};