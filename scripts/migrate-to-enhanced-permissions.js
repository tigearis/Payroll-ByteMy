#!/usr/bin/env node

/**
 * Migration script to update imports throughout the codebase to use the consolidated types and auth wrappers
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// Configuration
const SEARCH_DIRS = ["app", "components", "hooks", "lib", "domains"];

const IMPORT_REPLACEMENTS = [
  // Auth wrapper imports
  {
    pattern: /import\s+{\s*withAuth\s*}\s*from\s*["']@\/lib\/api-auth["']/g,
    replacement: `import { withAuth } from "@/lib/auth/auth-wrappers"`,
  },
  {
    pattern:
      /import\s+{\s*withAuthParams\s*}\s*from\s*["']@\/lib\/api-auth["']/g,
    replacement: `import { withAuthParams } from "@/lib/auth/auth-wrappers"`,
  },
  {
    pattern:
      /import\s+{\s*withEnhancedAuth\s*}\s*from\s*["']@\/lib\/auth\/enhanced-api-auth["']/g,
    replacement: `import { withEnhancedAuth } from "@/lib/auth/auth-wrappers"`,
  },
  {
    pattern:
      /import\s+{\s*withEnhancedAuthParams\s*}\s*from\s*["']@\/lib\/auth\/enhanced-api-auth["']/g,
    replacement: `import { withEnhancedAuthParams } from "@/lib/auth/auth-wrappers"`,
  },

  // Permission type imports
  {
    pattern:
      /import\s+{\s*UserRole\s*}\s*from\s*["']@\/lib\/auth\/custom-permissions["']/g,
    replacement: `import { UserRole } from "@/types/permissions"`,
  },
  {
    pattern: /import\s+{\s*Role\s*}\s*from\s*["']@\/lib\/auth\/roles["']/g,
    replacement: `import { Role } from "@/types/permissions"`,
  },
  {
    pattern:
      /import\s+{\s*CustomPermission\s*}\s*from\s*["']@\/lib\/auth\/custom-permissions["']/g,
    replacement: `import { CustomPermission } from "@/types/permissions"`,
  },

  // Multiple imports
  {
    pattern:
      /import\s+{([^}]*)UserRole([^}]*)}\s*from\s*["']@\/lib\/auth\/custom-permissions["']/g,
    replacement: (match, before, after) => {
      return `import {${before}${after}} from "@/lib/auth/custom-permissions";\nimport { UserRole } from "@/types/permissions"`;
    },
  },
  {
    pattern:
      /import\s+{([^}]*)Role([^}]*)}\s*from\s*["']@\/lib\/auth\/roles["']/g,
    replacement: (match, before, after) => {
      return `import {${before}${after}} from "@/lib/auth/roles";\nimport { Role } from "@/types/permissions"`;
    },
  },
  {
    pattern:
      /import\s+{([^}]*)CustomPermission([^}]*)}\s*from\s*["']@\/lib\/auth\/custom-permissions["']/g,
    replacement: (match, before, after) => {
      return `import {${before}${after}} from "@/lib/auth/custom-permissions";\nimport { CustomPermission } from "@/types/permissions"`;
    },
  },

  // Auth context imports
  {
    pattern:
      /import\s+{\s*AuthContext\s*}\s*from\s*["']@\/lib\/auth\/enhanced-api-auth["']/g,
    replacement: `import { AuthContext } from "@/lib/auth/auth-wrappers"`,
  },

  // EditorGuard replacements
  {
    pattern: /<EnhancedPermissionGuard\.EditorGuard>/g,
    replacement: `<EnhancedPermissionGuard.CanEditPayrolls>`,
  },
  {
    pattern: /<\/EnhancedPermissionGuard\.EditorGuard>/g,
    replacement: `</EnhancedPermissionGuard.CanEditPayrolls>`,
  },
];

// Find all TypeScript files in the specified directories
function findTsFiles(dir) {
  const result = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      result.push(...findTsFiles(filePath));
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      result.push(filePath);
    }
  }

  return result;
}

// Update imports in a file
function updateImports(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let hasChanges = false;

  for (const replacement of IMPORT_REPLACEMENTS) {
    const originalContent = content;
    content = content.replace(replacement.pattern, replacement.replacement);

    if (content !== originalContent) {
      hasChanges = true;
    }
  }

  if (hasChanges) {
    console.log(`✅ Updated imports in: ${filePath}`);
    fs.writeFileSync(filePath, content);
    return true;
  }

  return false;
}

// Main function
async function main() {
  console.log("🔍 Searching for TypeScript files...");

  const tsFiles = [];
  for (const dir of SEARCH_DIRS) {
    if (fs.existsSync(dir)) {
      tsFiles.push(...findTsFiles(dir));
    }
  }

  console.log(`📁 Found ${tsFiles.length} TypeScript files`);

  let updatedFiles = 0;
  for (const file of tsFiles) {
    if (updateImports(file)) {
      updatedFiles++;
    }
  }

  console.log(`\n✨ Migration complete!`);
  console.log(`📊 Updated imports in ${updatedFiles} files`);

  if (updatedFiles > 0) {
    console.log("\n🧹 Running ESLint to fix any formatting issues...");
    try {
      execSync("pnpm lint --fix", { stdio: "inherit" });
    } catch (error) {
      console.log(
        "⚠️ ESLint encountered errors. Please review and fix manually."
      );
    }
  }
}

main().catch(error => {
  console.error("❌ Error:", error);
  process.exit(1);
});
