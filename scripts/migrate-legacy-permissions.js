#!/usr/bin/env node

/**
 * Migration script to replace legacy permission system with enhanced permission system
 * This script helps identify files using the legacy permission system and provides
 * guidance on how to migrate them to the enhanced permission system.
 */

import { execSync } from "child_process";

// Configuration
const SEARCH_DIRS = ["app", "components", "hooks", "lib", "domains"];

const LEGACY_PATTERNS = [
  "useRoleHierarchy",
  "useUserRole",
  "PermissionGuard",
  "AdminGuard",
  "DeveloperGuard",
  "ManagerGuard",
  "EditorGuard",
];

const REPLACEMENT_MAP = {
  useRoleHierarchy: "useEnhancedPermissions",
  useUserRole: "useEnhancedPermissions",
  PermissionGuard: "EnhancedPermissionGuard",
  AdminGuard: "EnhancedPermissionGuard.AdminGuard",
  DeveloperGuard: "EnhancedPermissionGuard.DeveloperGuard",
  ManagerGuard: "EnhancedPermissionGuard.ManagerGuard",
  EditorGuard: "EnhancedPermissionGuard.CanEditPayrolls",
};

// Function to search for legacy patterns in files
function searchFiles(dir, pattern) {
  try {
    const result = execSync(
      `grep -r "${pattern}" ${dir} --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" | grep -v "node_modules" | grep -v "migrate-legacy-permissions.js"`,
      { encoding: "utf8" }
    );
    return result
      .trim()
      .split("\n")
      .filter((line) => line.length > 0);
  } catch (error) {
    // grep returns exit code 1 if no matches found
    if (error.status === 1) {
      return [];
    }
    console.error(`Error searching for ${pattern} in ${dir}:`, error);
    return [];
  }
}

// Function to generate replacement guidance
function generateReplacementGuidance(matches, pattern) {
  const replacement = REPLACEMENT_MAP[pattern];
  if (!replacement) {
    return `No direct replacement for ${pattern}`;
  }

  const fileMatches = {};
  matches.forEach((match) => {
    const [filePath, ...rest] = match.split(":");
    if (!fileMatches[filePath]) {
      fileMatches[filePath] = [];
    }
    fileMatches[filePath].push(rest.join(":"));
  });

  let guidance = "";
  for (const [filePath, lines] of Object.entries(fileMatches)) {
    guidance += `\n\nFile: ${filePath}\n`;
    guidance += `Replace "${pattern}" with "${replacement}"\n`;
    guidance += `Lines:\n${lines.map((line) => `  ${line.trim()}`).join("\n")}`;
  }

  return guidance;
}

// Function to perform automatic replacements
function performReplacements(pattern, replacement) {
  try {
    // This will replace the pattern in all files (careful!)
    console.log(`Replacing ${pattern} with ${replacement}...`);

    // Special handling for EditorGuard -> CanEditPayrolls
    if (pattern === "EditorGuard") {
      // First replace the component definition in EnhancedPermissionGuard.tsx
      execSync(
        `sed -i '' 's/EnhancedPermissionGuard.EditorGuard = ({/EnhancedPermissionGuard.CanEditPayrolls = ({/g' components/auth/EnhancedPermissionGuard.tsx`,
        { encoding: "utf8" }
      );
      execSync(
        `sed -i '' 's/<EnhancedPermissionGuard minimumRole="editor" fallback={fallback}>/<EnhancedPermissionGuard permission="custom:payroll:write" fallback={fallback}>/g' components/auth/EnhancedPermissionGuard.tsx`,
        { encoding: "utf8" }
      );

      // Then replace all usages
      execSync(
        `find app components -type f -name "*.tsx" -exec sed -i '' 's/<EnhancedPermissionGuard.EditorGuard>/<EnhancedPermissionGuard.CanEditPayrolls>/g' {} \\;`,
        { encoding: "utf8" }
      );
      execSync(
        `find app components -type f -name "*.tsx" -exec sed -i '' 's/<\\/EnhancedPermissionGuard.EditorGuard>/<\\/EnhancedPermissionGuard.CanEditPayrolls>/g' {} \\;`,
        { encoding: "utf8" }
      );
    } else {
      // Standard replacement for other patterns
      execSync(
        `find app components hooks lib domains -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -exec sed -i '' 's/${pattern}/${replacement}/g' {} \\;`,
        { encoding: "utf8" }
      );
    }

    console.log(`Replacement complete for ${pattern}`);
  } catch (error) {
    console.error(`Error replacing ${pattern} with ${replacement}:`, error);
  }
}

// Main execution
console.log("🔍 Scanning for legacy permission system usage...");

let totalMatches = 0;
const matchesByPattern = {};

// Search for each legacy pattern
LEGACY_PATTERNS.forEach((pattern) => {
  let patternMatches = [];
  SEARCH_DIRS.forEach((dir) => {
    const matches = searchFiles(dir, pattern);
    patternMatches = [...patternMatches, ...matches];
  });

  matchesByPattern[pattern] = patternMatches;
  totalMatches += patternMatches.length;
});

// Output results
console.log(
  `\n✅ Scan complete. Found ${totalMatches} instances of legacy permission system usage.\n`
);

if (totalMatches === 0) {
  console.log(
    "No legacy permission system usage found. Your codebase is already using the enhanced permission system."
  );
} else {
  console.log("📝 Replacement guidance:");

  for (const [pattern, matches] of Object.entries(matchesByPattern)) {
    if (matches.length > 0) {
      console.log(`\n--- ${pattern} (${matches.length} instances) ---`);
      console.log(generateReplacementGuidance(matches, pattern));
    }
  }

  // Ask for confirmation to perform automatic replacements
  console.log("\n⚠️  Would you like to perform automatic replacements? (y/n)");
  process.stdout.write("> ");

  process.stdin.once("data", (data) => {
    const input = data.toString().trim().toLowerCase();
    if (input === "y" || input === "yes") {
      console.log("\n🔄 Performing automatic replacements...");

      for (const [pattern, replacement] of Object.entries(REPLACEMENT_MAP)) {
        if (matchesByPattern[pattern] && matchesByPattern[pattern].length > 0) {
          performReplacements(pattern, replacement);
        }
      }

      console.log(
        "\n✅ Replacements complete. Please review the changes and test your application."
      );
    } else {
      console.log(
        "\n❌ Automatic replacements cancelled. Please make the changes manually based on the guidance provided."
      );
    }

    process.exit(0);
  });
}
