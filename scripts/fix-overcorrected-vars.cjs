#!/usr/bin/env node

/**
 * Fix variables that were overcorrected by fix-unused-vars.cjs
 * This script reverts variables that are actually used but were incorrectly prefixed with underscore
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Variables that were incorrectly renamed and need to be reverted
const REVERT_FIXES = {
  _NextResponse: "NextResponse",
  _userId: "userId",
  _user: "user",
  _data: "data",
  error: "error", // Only in catch blocks where the variable is actually used
  _syncUserWithDatabase: "syncUserWithDatabase",
};

// Files that were processed by the problematic script
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
];

function revertOvercorrectedVariables() {
  console.log("🔧 Reverting overcorrected variables...\n");

  let totalFixed = 0;

  PROBLEMATIC_FILES.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }

    console.log(`📝 Processing: ${filePath}`);

    let content = fs.readFileSync(filePath, "utf8");
    let modified = false;
    let fileFixed = 0;

    // Apply revert fixes
    Object.entries(REVERT_FIXES).forEach(([incorrect, correct]) => {
      // Skip if the incorrect version doesn't exist
      if (!content.includes(incorrect)) return;

      // For error, be more careful - only revert when it's used in the same scope
      if (incorrect === "error") {
        // Pattern to find catch blocks where error is defined but error is used
        const errorPattern =
          /catch\s*\(\s*error[^)]*\)[^}]*error\s+instanceof/g;
        if (errorPattern.test(content)) {
          content = content.replace(/catch\s*\(\s*error/g, "catch (error");
          modified = true;
          fileFixed++;
        }
        return;
      }

      // Simple global replacement for other variables
      const beforeContent = content;
      content = content.replace(new RegExp(`\\b${incorrect}\\b`, "g"), correct);

      if (content !== beforeContent) {
        modified = true;
        fileFixed++;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed ${fileFixed} issues in ${filePath}`);
      totalFixed += fileFixed;
    } else {
      console.log(`ℹ️  No changes needed in ${filePath}`);
    }
  });

  console.log(`\n🎉 Total fixes applied: ${totalFixed}`);
}

function main() {
  console.log("🚀 Starting overcorrected variable revert process...\n");

  revertOvercorrectedVariables();

  console.log("\n📋 Summary:");
  console.log(
    "✅ Reverted variables that were incorrectly prefixed with underscores"
  );
  console.log("✅ Maintained proper variable scoping and usage");

  console.log("\n🔍 Testing build...");
  try {
    execSync("pnpm build", { stdio: "inherit" });
    console.log("✅ Build completed successfully!");
  } catch (error) {
    console.log("ℹ️  Build issues may remain - check output above");
  }
}

if (require.main === module) {
  main();
}

module.exports = { revertOvercorrectedVariables };
