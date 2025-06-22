#!/usr/bin/env node

/**
 * Targeted Syntax Error Fixer
 * Fixes the specific syntax errors identified by the diagnostic tool
 */

import { promises as fs } from "fs";

// Exact fixes needed based on diagnostic output
const TARGETED_FIXES = [
  {
    file: "./app/(dashboard)/staff/page.tsx",
    line: 1973,
    find: '"Create Staff Member&quot;}',
    replace: '"Create Staff Member"}',
    description: "Fix unterminated string with wrong entity",
  },
  {
    file: "./components/auth/step-up-auth.tsx",
    line: 211,
    find: '|| "&quot;,',
    replace: '|| "",',
    description: "Fix empty string with wrong entity",
  },
  {
    file: "./components/notes-list-with-add.tsx",
    line: 317,
    find: '"Save Changes&quot;}',
    replace: '"Save Changes"}',
    description: "Fix unterminated string with wrong entity",
  },
  {
    file: "./components/ui/accessibility.tsx",
    line: 242,
    find: '"sr-only&quot;);',
    replace: '"sr-only");',
    description: "Fix unterminated string with wrong entity",
  },
  {
    file: "./lib/api-auth.ts",
    line: 389,
    find: '"CRON_SECRET not configured&quot;);',
    replace: '"CRON_SECRET not configured");',
    description: "Fix unterminated string with wrong entity",
  },
];

class TargetedSyntaxFixer {
  constructor() {
    this.fixedFiles = [];
    this.errors = [];
  }

  async fixFile(fixInfo) {
    const { file, line, find, replace, description } = fixInfo;

    try {
      console.log(`🔧 Fixing: ${file}`);
      console.log(`   Issue: ${description}`);

      // Read file
      const content = await fs.readFile(file, "utf8");
      const lines = content.split("\n");

      // Create backup
      const backupPath = `${file}.syntax-backup-${Date.now()}`;
      await fs.writeFile(backupPath, content);

      // Check if the expected text is on the expected line
      const targetLineIndex = line - 1;
      const targetLine = lines[targetLineIndex];

      if (!targetLine) {
        console.log(`   ❌ Line ${line} not found in file`);
        return;
      }

      if (!targetLine.includes(find)) {
        console.log(`   ⚠️  Expected text not found on line ${line}`);
        console.log(`   Expected: "${find}"`);
        console.log(`   Actual:   "${targetLine.trim()}"`);
        console.log(`   Skipping this file - may have been fixed already`);
        // Remove backup since no changes made
        await fs.unlink(backupPath);
        return;
      }

      // Apply the fix
      const newLine = targetLine.replace(find, replace);
      lines[targetLineIndex] = newLine;

      // Write back the fixed content
      const fixedContent = lines.join("\n");
      await fs.writeFile(file, fixedContent);

      console.log(`   ✅ Fixed successfully`);
      console.log(`   Before: ${targetLine.trim()}`);
      console.log(`   After:  ${newLine.trim()}`);
      console.log(`   Backup: ${backupPath}`);

      this.fixedFiles.push({
        path: file,
        description,
        backup: backupPath,
        lineBefore: targetLine.trim(),
        lineAfter: newLine.trim(),
      });
    } catch (error) {
      console.error(`❌ Error fixing ${file}:`, error.message);
      this.errors.push({ path: file, error: error.message });
    }

    console.log("");
  }

  async fixPerformanceOptimizedPage() {
    // This one needs special handling - it's a JSX syntax issue
    const file = "./components/performance-optimized-page.tsx";

    try {
      console.log(`🔧 Fixing: ${file}`);
      console.log(`   Issue: JSX syntax error around line 137`);

      const content = await fs.readFile(file, "utf8");
      const backupPath = `${file}.syntax-backup-${Date.now()}`;
      await fs.writeFile(backupPath, content);

      // Look for common JSX issues around line 137
      const lines = content.split("\n");
      const targetArea = lines.slice(130, 145); // Lines around 137

      console.log("   Context around line 137:");
      targetArea.forEach((line, index) => {
        const lineNum = 131 + index;
        console.log(`   ${lineNum}: ${line}`);
      });

      console.log(`   ⚠️  This needs manual inspection`);
      console.log(`   The diagnostic shows an unexpected "/" token`);
      console.log(`   Look for malformed JSX tags around line 137`);

      // Remove backup since we didn't fix it
      await fs.unlink(backupPath);
    } catch (error) {
      console.error(`❌ Error reading ${file}:`, error.message);
      this.errors.push({ path: file, error: error.message });
    }

    console.log("");
  }

  async processAllFixes() {
    console.log("🎯 TARGETED SYNTAX ERROR FIXER");
    console.log("=".repeat(80));
    console.log("Fixing the specific syntax errors identified by diagnostic\n");

    // Fix the string literal errors
    for (const fixInfo of TARGETED_FIXES) {
      await this.fixFile(fixInfo);
    }

    // Handle the JSX syntax error separately
    await this.fixPerformanceOptimizedPage();

    this.printSummary();
  }

  printSummary() {
    console.log("📊 TARGETED FIX SUMMARY");
    console.log("=".repeat(80));
    console.log(`✅ Files processed: ${TARGETED_FIXES.length + 1}`);
    console.log(`✅ Files fixed: ${this.fixedFiles.length}`);
    console.log(`❌ Files with errors: ${this.errors.length}`);

    if (this.fixedFiles.length > 0) {
      console.log("\n🔧 SUCCESSFULLY FIXED:");
      this.fixedFiles.forEach(({ path, description, backup }) => {
        console.log(`  ✅ ${path}`);
        console.log(`     Fix: ${description}`);
        console.log(`     Backup: ${backup}`);
      });
    }

    if (this.errors.length > 0) {
      console.log("\n❌ ERRORS:");
      this.errors.forEach(({ path, error }) => {
        console.log(`  ${path}: ${error}`);
      });
    }

    console.log("\n📝 REMAINING MANUAL FIXES:");
    console.log("1. ./components/performance-optimized-page.tsx:137");
    console.log("   - Inspect JSX syntax around line 137");
    console.log("   - Look for malformed tags or missing closing elements");

    console.log("\n🧪 NEXT STEPS:");
    console.log("1. Check if app compiles: pnpm dev");
    console.log(
      "2. If compilation works, run entity fixer for remaining issues"
    );
    console.log("3. Final lint check: pnpm lint");

    console.log("\n✨ Targeted syntax fixes complete!");
  }
}

// Execute the fixer
async function main() {
  const fixer = new TargetedSyntaxFixer();
  await fixer.processAllFixes();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

export default TargetedSyntaxFixer;
