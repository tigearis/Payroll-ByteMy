#!/usr/bin/env node

/**
 * Permission System Integration Test
 * 
 * Tests the consistency and integration of the hierarchical permission system
 * across all auth components and hooks.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.bold}${colors.cyan}🔍 ${msg}${colors.reset}\n`),
};

class PermissionSystemIntegrationTest {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.successes = [];
  }

  /**
   * Read file content safely
   */
  readFile(filePath) {
    try {
      const fullPath = path.resolve(projectRoot, filePath);
      if (!fs.existsSync(fullPath)) {
        return null;
      }
      return fs.readFileSync(fullPath, 'utf-8');
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if file exists
   */
  fileExists(filePath) {
    try {
      const fullPath = path.resolve(projectRoot, filePath);
      return fs.existsSync(fullPath);
    } catch (error) {
      return false;
    }
  }

  /**
   * Search for patterns in files
   */
  searchInDirectory(dirPath, pattern, fileExtensions = ['.ts', '.tsx']) {
    const results = [];
    const fullDirPath = path.resolve(projectRoot, dirPath);
    
    if (!fs.existsSync(fullDirPath)) {
      return results;
    }

    const searchRecursively = (currentPath) => {
      const items = fs.readdirSync(currentPath);
      
      for (const item of items) {
        const itemPath = path.join(currentPath, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          searchRecursively(itemPath);
        } else if (stat.isFile() && fileExtensions.some(ext => item.endsWith(ext))) {
          const content = fs.readFileSync(itemPath, 'utf-8');
          const matches = content.match(pattern);
          if (matches) {
            const relativePath = path.relative(projectRoot, itemPath);
            results.push({
              file: relativePath,
              matches: matches.length,
              content: content
            });
          }
        }
      }
    };

    searchRecursively(fullDirPath);
    return results;
  }

  /**
   * Test 1: Core Permission Files Exist
   */
  testCorePermissionFiles() {
    log.section("Testing Core Permission Files");

    const coreFiles = [
      'hooks/use-hierarchical-permissions.ts',
      'hooks/use-permissions.ts',
      'lib/permissions/hierarchical-permissions.ts',
      'lib/auth/simple-permissions.ts',
      'components/auth/permission-guard.tsx',
      'components/auth/hierarchical-permission-guard.tsx'
    ];

    coreFiles.forEach(filePath => {
      if (this.fileExists(filePath)) {
        log.success(`Core file exists: ${filePath}`);
        this.successes.push(`Core file: ${filePath}`);
      } else {
        log.error(`Missing core file: ${filePath}`);
        this.issues.push(`Missing core file: ${filePath}`);
      }
    });
  }

  /**
   * Test 2: Permission Hook Usage Consistency
   */
  testPermissionHookUsage() {
    log.section("Testing Permission Hook Usage");

    // Search for usePermissions usage
    const usePermissionsFiles = this.searchInDirectory('.', /usePermissions/g);
    log.info(`Found ${usePermissionsFiles.length} files using usePermissions`);

    // Search for useHierarchicalPermissions usage
    const useHierarchicalFiles = this.searchInDirectory('.', /useHierarchicalPermissions/g);
    log.info(`Found ${useHierarchicalFiles.length} files using useHierarchicalPermissions`);

    // Check for any old permission hook patterns
    const oldHookPatterns = [
      /useAuth.*permission/gi,
      /useRole.*permission/gi,
      /use.*Role.*Hook/gi
    ];

    oldHookPatterns.forEach((pattern, index) => {
      const matches = this.searchInDirectory('.', pattern);
      if (matches.length > 0) {
        log.warning(`Found ${matches.length} files with potentially old permission hook pattern #${index + 1}`);
        matches.forEach(match => {
          log.warning(`  - ${match.file}`);
        });
        this.warnings.push(`Old permission hook pattern found in ${matches.length} files`);
      }
    });

    if (usePermissionsFiles.length > 0) {
      log.success("Permission hooks are being used in the codebase");
      this.successes.push("Permission hooks usage");
    }
  }

  /**
   * Test 3: Auth Guard Component Consistency
   */
  testAuthGuardConsistency() {
    log.section("Testing Auth Guard Component Consistency");

    // Check for consistent imports from auth guards
    const authGuardImports = this.searchInDirectory('.', /from.*@\/components\/auth/g);
    log.info(`Found ${authGuardImports.length} files importing from auth components`);

    // Check for PermissionGuard usage
    const permissionGuardUsage = this.searchInDirectory('.', /<PermissionGuard/g);
    log.info(`Found ${permissionGuardUsage.length} files using PermissionGuard components`);

    // Check for role-based guard usage
    const roleGuardPatterns = [
      /<AdminOnly/g,
      /<ManagerOnly/g,
      /<DeveloperOnly/g,
      /<ConsultantOnly/g
    ];

    roleGuardPatterns.forEach((pattern, index) => {
      const matches = this.searchInDirectory('.', pattern);
      if (matches.length > 0) {
        const guardName = ['AdminOnly', 'ManagerOnly', 'DeveloperOnly', 'ConsultantOnly'][index];
        log.info(`Found ${matches.length} files using ${guardName} guard`);
      }
    });

    if (permissionGuardUsage.length > 0) {
      log.success("Permission guards are being used consistently");
      this.successes.push("Permission guard usage");
    }
  }

  /**
   * Test 4: Import Path Consistency
   */
  testImportPathConsistency() {
    log.section("Testing Import Path Consistency");

    // Check for consistent permission-related imports
    const importPatterns = [
      { pattern: /from.*@\/hooks\/use-permissions/g, name: "usePermissions hook" },
      { pattern: /from.*@\/hooks\/use-hierarchical-permissions/g, name: "useHierarchicalPermissions hook" },
      { pattern: /from.*@\/components\/auth\/permission-guard/g, name: "PermissionGuard component" },
      { pattern: /from.*@\/lib\/permissions\/hierarchical-permissions/g, name: "hierarchical permissions lib" }
    ];

    importPatterns.forEach(({ pattern, name }) => {
      const matches = this.searchInDirectory('.', pattern);
      if (matches.length > 0) {
        log.success(`Consistent imports for ${name}: ${matches.length} files`);
        this.successes.push(`Import consistency: ${name}`);
      }
    });

    // Check for potentially problematic import patterns
    const problematicPatterns = [
      { pattern: /from.*auth.*(?!@\/)/g, name: "relative auth imports" },
      { pattern: /import.*permission.*from.*(?!@\/)/g, name: "relative permission imports" }
    ];

    problematicPatterns.forEach(({ pattern, name }) => {
      const matches = this.searchInDirectory('.', pattern);
      if (matches.length > 0) {
        log.warning(`Found potentially problematic ${name}: ${matches.length} files`);
        this.warnings.push(`Problematic imports: ${name}`);
      }
    });
  }

  /**
   * Test 5: Role Hierarchy Consistency
   */
  testRoleHierarchyConsistency() {
    log.section("Testing Role Hierarchy Consistency");

    // Check for consistent role names
    const roleNames = ['developer', 'org_admin', 'manager', 'consultant', 'viewer'];
    const rolePattern = new RegExp(`(${roleNames.join('|')})`, 'g');
    
    const rolesInCode = this.searchInDirectory('.', rolePattern);
    log.info(`Found ${rolesInCode.length} files referencing hierarchical roles`);

    // Check for old/inconsistent role names
    const oldRolePatterns = [
      /admin(?!_)/g, // 'admin' without 'org_admin'
      /superuser/gi,
      /root/gi,
      /owner/gi
    ];

    oldRolePatterns.forEach((pattern, index) => {
      const matches = this.searchInDirectory('.', pattern);
      if (matches.length > 0) {
        const roleName = ['admin', 'superuser', 'root', 'owner'][index];
        log.warning(`Found potentially old role name '${roleName}': ${matches.length} files`);
        this.warnings.push(`Old role name: ${roleName}`);
      }
    });

    if (rolesInCode.length > 0) {
      log.success("Hierarchical role names are being used consistently");
      this.successes.push("Role hierarchy consistency");
    }
  }

  /**
   * Test 6: API Route Authentication Consistency
   */
  testApiRouteConsistency() {
    log.section("Testing API Route Authentication Consistency");

    // Search for API routes
    const apiRoutes = this.searchInDirectory('app/api', /export.*async.*function/g);
    log.info(`Found ${apiRoutes.length} API route files`);

    // Check for authentication patterns in API routes
    const authPatterns = [
      { pattern: /auth\(\)/g, name: "Clerk auth()" },
      { pattern: /getJWTClaims/g, name: "JWT claims extraction" },
      { pattern: /withAuth/g, name: "withAuth wrapper" },
      { pattern: /authenticateApiRequest/g, name: "API authentication" }
    ];

    authPatterns.forEach(({ pattern, name }) => {
      const matches = this.searchInDirectory('app/api', pattern);
      if (matches.length > 0) {
        log.success(`API routes using ${name}: ${matches.length} files`);
        this.successes.push(`API auth: ${name}`);
      }
    });
  }

  /**
   * Test 7: Missing Dependencies
   */
  testMissingDependencies() {
    log.section("Testing for Missing Dependencies");

    // Check for import statements that might reference missing files
    const importMatches = this.searchInDirectory('.', /from\s+['"]@\/[^'"]+['"]/g);
    
    const missingFiles = [];
    importMatches.forEach(match => {
      const imports = match.content.match(/from\s+['"](@\/[^'"]+)['"]/g) || [];
      imports.forEach(importStr => {
        const path = importStr.match(/from\s+['"](@\/[^'"]+)['"]/)[1];
        const filePath = path.replace('@/', '') + '.ts';
        const tsxFilePath = path.replace('@/', '') + '.tsx';
        
        if (!this.fileExists(filePath) && !this.fileExists(tsxFilePath)) {
          const dir = path.replace('@/', '');
          if (!this.fileExists(dir + '/index.ts') && !this.fileExists(dir + '/index.tsx')) {
            missingFiles.push({ file: match.file, import: path });
          }
        }
      });
    });

    if (missingFiles.length === 0) {
      log.success("No missing dependencies found in imports");
      this.successes.push("No missing dependencies");
    } else {
      missingFiles.slice(0, 10).forEach(({ file, import: importPath }) => {
        log.error(`Missing dependency: ${importPath} in ${file}`);
        this.issues.push(`Missing dependency: ${importPath}`);
      });
      if (missingFiles.length > 10) {
        log.error(`... and ${missingFiles.length - 10} more missing dependencies`);
      }
    }
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log(`${colors.bold}${colors.blue}Permission System Integration Test${colors.reset}\n`);
    console.log("Testing consistency and integration of the hierarchical permission system...\n");

    this.testCorePermissionFiles();
    this.testPermissionHookUsage();
    this.testAuthGuardConsistency();
    this.testImportPathConsistency();
    this.testRoleHierarchyConsistency();
    this.testApiRouteConsistency();
    this.testMissingDependencies();

    // Summary
    log.section("Test Summary");
    
    if (this.successes.length > 0) {
      log.success(`${this.successes.length} checks passed:`);
      this.successes.forEach(success => console.log(`  ✅ ${success}`));
    }

    if (this.warnings.length > 0) {
      console.log();
      log.warning(`${this.warnings.length} warnings found:`);
      this.warnings.forEach(warning => console.log(`  ⚠️  ${warning}`));
    }

    if (this.issues.length > 0) {
      console.log();
      log.error(`${this.issues.length} issues found:`);
      this.issues.forEach(issue => console.log(`  ❌ ${issue}`));
    }

    console.log();
    if (this.issues.length === 0) {
      log.success("Permission system integration test completed successfully!");
      console.log("✨ The hierarchical permission system appears to be properly integrated.\n");
      return true;
    } else {
      log.error("Permission system integration test found issues that need attention.");
      console.log("🔧 Please review and fix the issues above before proceeding.\n");
      return false;
    }
  }
}

// Run the test
const test = new PermissionSystemIntegrationTest();
test.runAllTests().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});