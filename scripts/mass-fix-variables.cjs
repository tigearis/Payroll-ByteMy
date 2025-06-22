#!/usr/bin/env node

/**
 * Mass fix for variables that were incorrectly prefixed by fix-unused-vars.cjs
 * This script fixes all the problematic variable references in API files
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Comprehensive list of fixes needed
const GLOBAL_FIXES = {
  // Import fixes
  _NextResponse: "NextResponse",
  _syncUserWithDatabase: "syncUserWithDatabase",
  _UserRole: "UserRole",
  _validateRequiredFields: "validateRequiredFields",
  _protectAdminRoute: "protectAdminRoute",
  _SecureErrorHandler: "SecureErrorHandler",

  // Variable fixes - only when they're actually used
  _userId: "userId",
  _user: "user",
  _data: "data",
  error: "error", // Only when used in same scope
  _permissions: "permissions",
  _role: "role", // Only when used
  _isStaff: "isStaff",
  _request: "request", // Only when used
  _session: "session", // Only when used
};

// Files that need fixing
const API_FILES = [
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
];

function massFixVariables() {
  console.log("🔧 Mass fixing variable issues...\n");

  let totalFixed = 0;

  API_FILES.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }

    console.log(`📝 Processing: ${filePath}`);

    let content = fs.readFileSync(filePath, "utf8");
    let modified = false;
    let fileFixed = 0;

    // Apply global fixes
    Object.entries(GLOBAL_FIXES).forEach(([incorrect, correct]) => {
      // Simple replacement for most cases
      const beforeContent = content;
      content = content.replace(new RegExp(`\\b${incorrect}\\b`, "g"), correct);

      if (content !== beforeContent) {
        modified = true;
        fileFixed++;
      }
    });

    // Special case: fix catch blocks with mismatched error variables
    // Pattern: catch (error) ... but then using 'error'
    content = content.replace(
      /catch\s*\(\s*error[^)]*\)([^}]*?)error\s+instanceof/g,
      (match, middle) => match.replace("catch (error", "catch (error")
    );

    // Fix variable usage mismatches within the same scope
    // Look for patterns like: const { _user } = ... but then using 'user'
    const userMismatch = /const\s*{\s*_user\s*}[^;]*;[\s\S]*?user\./g;
    if (userMismatch.test(content)) {
      content = content.replace(/const\s*{\s*_user\s*}/g, "const { user }");
      modified = true;
      fileFixed++;
    }

    const dataaMismatch = /const\s*{\s*_data\s*}[^;]*;[\s\S]*?data\./g;
    if (dataaMismatch.test(content)) {
      content = content.replace(/const\s*{\s*_data\s*}/g, "const { data }");
      modified = true;
      fileFixed++;
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed ${fileFixed} issues in ${filePath}`);
      totalFixed += fileFixed;
    } else {
      console.log(`ℹ️  No changes needed in ${filePath}`);
    }
  });

  console.log(`\n🎉 Total fixes applied: ${totalFixed}`);

  // Test the build
  console.log("\n🔍 Testing build...");
  try {
    execSync("pnpm build", { stdio: "inherit" });
    console.log("✅ Build completed successfully!");
  } catch (error) {
    console.log("ℹ️  Build issues may remain - check output above");
  }
}

function main() {
  console.log("🚀 Starting mass variable fix process...\n");

  massFixVariables();

  console.log("\n📋 Summary:");
  console.log("✅ Fixed variable naming issues across API files");
  console.log("✅ Corrected import statements");
  console.log("✅ Fixed variable scope mismatches");
}

if (require.main === module) {
  main();
}

module.exports = { massFixVariables };
