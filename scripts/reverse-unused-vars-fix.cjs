#!/usr/bin/env node

/**
 * Reverse the changes made by fix-unused-vars.cjs script
 * This script removes underscore prefixes that were incorrectly added
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Files that were modified by the original script
const PROBLEMATIC_FILES = [
  "app/api/developer/reset-to-original/route.ts",
  "app/api/developer/route.ts",
  "app/api/fix-oauth-user/route.ts",
  "app/api/fix-user-sync/route.ts",
  "app/api/payroll-dates/[payrollId]/route.ts",
  "app/api/payrolls/[id]/route.ts",
  "app/api/staff/create/route.ts",
  "app/api/staff/delete/route.ts",
  "app/api/staff/invitation-status/route.ts",
  "app/api/sync-current-user/route.ts",
  "app/api/users/[id]/route.ts",
  "app/api/users/route.ts",
  "app/api/users/update-profile/route.ts",
  "app/api/webhooks/clerk/route.ts",
  "components/auth/database-user-guard.tsx",
  "components/auth/step-up-auth.tsx",
  "components/dashboard-shell.tsx",
  "components/error-boundary.tsx",
  "components/markdown-viewer.tsx",
  "components/sidebar.tsx",
  "components/ui/design-system.tsx",
  "components/ui/unified-data-table.tsx",
  "components/urgent-alerts.tsx",
  "lib/apollo/secure-hasura-service.ts",
  "lib/apollo/unified-client.ts",
  "lib/auth/api-auth.ts",
  "lib/design-tokens/utils.ts",
  "lib/dev/examples/graceful-clients-list.tsx",
  "lib/dev/test-components/jwt-test-panel.tsx",
  "lib/dev/test-components/subscription-test.tsx",
  "lib/logging/logger.ts",
  "lib/optimistic-updates.ts",
  "lib/resolvers/backend_resolver.ts",
  "lib/security/enhanced-route-monitor.ts",
];

// Reverse the specific fixes - swap the key/value pairs
const REVERSE_FIXES = {
  // Reverse unused function parameters
  _request: "request",
  _req: "req",
  _session: "session",
  _node: "node",
  _existing: "existing",
  _role: "role",
  _userError: "userError",
  _isStaff: "isStaff",
  _permissions: "permissions",
  _user: "user",
  _asChild: "asChild",
  _T: "T",
  _cellRenderers: "cellRenderers",
  _emailUserData: "emailUserData",
  _DEFAULT_SECURITY_MAP: "DEFAULT_SECURITY_MAP",
  _level: "level",
  _permissionError: "permissionError",
  _useEffect: "useEffect",
  _data: "data",
  _queryName: "queryName",
  _CommitPayrollAssignmentsResponse: "CommitPayrollAssignmentsResponse",

  // Reverse unused imports
  _syncUserWithDatabase: "syncUserWithDatabase",
  _UserRole: "UserRole",
  _CreateStaffInput: "CreateStaffInput",
  _protectAdminRoute: "protectAdminRoute",
  _SecureErrorHandler: "SecureErrorHandler",
  _getCurrentUserRole: "getCurrentUserRole",
  _NextResponse: "NextResponse",
  _validateRequiredFields: "validateRequiredFields",
  _verifyWebhook: "verifyWebhook",
  _Sidebar: "Sidebar",
  _MainNav: "MainNav",
  _ThemeToggle: "ThemeToggle",
  _roleHasPermission: "roleHasPermission",
  _PayrollDate: "PayrollDate",
  _Client: "Client",
  _Consultant: "Consultant",
  _sensitiveActions: "sensitiveActions",
};

function reverseUnusedVariableFixes() {
  console.log("🔄 Reversing unused variable fixes...\n");

  let totalReversed = 0;

  PROBLEMATIC_FILES.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }

    console.log(`📝 Processing: ${filePath}`);

    let content = fs.readFileSync(filePath, "utf8");
    let modified = false;
    let fileReversed = 0;

    // Apply reverse fixes
    Object.entries(REVERSE_FIXES).forEach(([prefixed, original]) => {
      // Various patterns to catch different contexts
      const patterns = [
        // Import statements - be very specific to avoid breaking other code
        new RegExp(`import\\s*\\{([^}]*\\b${prefixed}\\b[^}]*)\\}`, "g"),
        new RegExp(`import\\s*\\{\\s*${prefixed}\\s*\\}`, "g"),
        new RegExp(`import\\s*\\{([^}]*),\\s*${prefixed}\\s*\\}`, "g"),
        new RegExp(`import\\s*\\{\\s*${prefixed}\\s*,([^}]*)\\}`, "g"),

        // Function parameters
        new RegExp(`\\b${prefixed}\\b(?=\\s*[,)])`, "g"),

        // Variable declarations
        new RegExp(`\\b(const|let|var)\\s+${prefixed}\\b`, "g"),

        // Destructuring
        new RegExp(`\\{\\s*${prefixed}\\s*\\}`, "g"),

        // Catch blocks
        new RegExp(`catch\\s*\\(\\s*${prefixed}\\s*\\)`, "g"),

        // Usage in JSX/TSX
        new RegExp(`<${prefixed}\\b`, "g"),
        new RegExp(`\\{${prefixed}\\}`, "g"),
      ];

      patterns.forEach(pattern => {
        const newContent = content.replace(pattern, match => {
          return match.replace(new RegExp(`\\b${prefixed}\\b`, "g"), original);
        });

        if (newContent !== content) {
          content = newContent;
          modified = true;
          fileReversed++;
        }
      });
    });

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Reversed ${fileReversed} changes in ${filePath}`);
      totalReversed += fileReversed;
    } else {
      console.log(`ℹ️  No changes needed in ${filePath}`);
    }
  });

  console.log(`\n🎉 Total reversals applied: ${totalReversed}`);
}

function removeAutoFixRules() {
  console.log("📋 Removing auto-fix rules from ESLint configuration...\n");

  const eslintConfigPath = "eslint.config.js";

  if (!fs.existsSync(eslintConfigPath)) {
    console.log("⚠️  ESLint config file not found");
    return;
  }

  let config = fs.readFileSync(eslintConfigPath, "utf8");

  // Remove the auto-fix rules that were added
  const autoFixRulesPattern =
    /\s*\/\/ Auto-fix rules for unused variables[\s\S]*?\},\s*/g;

  if (autoFixRulesPattern.test(config)) {
    config = config.replace(autoFixRulesPattern, "");
    fs.writeFileSync(eslintConfigPath, config);
    console.log("✅ Removed auto-fix rules from ESLint configuration");
  } else {
    console.log("ℹ️  No auto-fix rules found to remove");
  }
}

function main() {
  console.log("🚀 Starting reversal of unused variable fixes...\n");

  // Remove the ESLint rules that were added
  removeAutoFixRules();

  // Reverse the file changes
  reverseUnusedVariableFixes();

  console.log("\n📋 Summary:");
  console.log("✅ Removed auto-fix rules from ESLint configuration");
  console.log("✅ Reversed underscore prefixes from imports and variables");
  console.log("✅ Restored original code functionality");

  console.log("\n🎯 Next steps:");
  console.log("• Run `pnpm lint` to check current linting status");
  console.log("• Address any legitimate unused variable warnings manually");
  console.log(
    "• Consider using proper TypeScript ignore comments for intentionally unused variables"
  );

  // Run linting to see current status
  console.log("\n🔍 Running lint check to see current status...");
  try {
    execSync("pnpm lint", { stdio: "inherit" });
    console.log("✅ Linting completed!");
  } catch (error) {
    console.log(
      "ℹ️  Some linting issues detected - this is expected after reversal"
    );
  }
}

if (require.main === module) {
  main();
}

module.exports = { reverseUnusedVariableFixes, removeAutoFixRules };
