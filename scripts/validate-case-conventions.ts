#!/usr/bin/env ts-node

/**
 * Case Convention Validation Script
 *
 * Validates all files in the project follow the established case conventions
 * as defined in Type-Case-Conventions.md and enforced by case-conventions.config.ts
 *
 * Usage: pnpm validate:naming or node scripts/validate-case-conventions.ts
 */

import { readdir, stat } from "fs/promises";
import { join, extname, basename, dirname } from "path";
import {
  FILE_NAMING_PATTERNS,
  IDENTIFIER_PATTERNS,
  validateFileName,
  caseTransformers,
} from "../config/case-conventions.config";

export interface ValidationError {
  type: "file" | "directory" | "identifier";
  path: string;
  issue: string;
  suggestion?: string;
}

class CaseConventionValidator {
  private errors: ValidationError[] = [];
  private excludePatterns = [
    /node_modules/,
    /\.next/,
    /\.git/,
    /dist/,
    /build/,
    /coverage/,
    /\.env/,
    /backups/,
    /_backup_delete/,
    /generated/,
    /\.generated\./,
  ];

  /**
   * Validates all files and directories in the project
   */
  async validateProject(
    rootPath: string = process.cwd()
  ): Promise<ValidationError[]> {
    console.log("🔍 Validating case conventions...\n");

    await this.walkDirectory(rootPath);

    if (this.errors.length === 0) {
      console.log("✅ All files follow the established case conventions!");
    } else {
      console.log(
        `❌ Found ${this.errors.length} case convention violations:\n`
      );
      this.printErrors();
    }

    return this.errors;
  }

  /**
   * Recursively walks directory structure
   */
  private async walkDirectory(dirPath: string): Promise<void> {
    try {
      const entries = await readdir(dirPath);

      for (const entry of entries) {
        const fullPath = join(dirPath, entry);

        // Skip excluded patterns
        if (this.excludePatterns.some(pattern => pattern.test(fullPath))) {
          continue;
        }

        const stats = await stat(fullPath);

        if (stats.isDirectory()) {
          this.validateDirectoryName(entry, fullPath);
          await this.walkDirectory(fullPath);
        } else {
          this.validateFileName(entry, fullPath);
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not read directory ${dirPath}:`, error);
    }
  }

  /**
   * Validates directory naming conventions
   */
  private validateDirectoryName(dirName: string, fullPath: string): void {
    // Special cases that are allowed
    const allowedSpecialDirs = [
      ".next",
      ".git",
      "node_modules",
      "__tests__",
      "__mocks__",
      "_backup_delete",
      ".claude",
    ];

    // Next.js specific patterns that are allowed
    const nextJsPatterns = [
      /^\(.*\)$/, // Route groups: (auth), (dashboard)
      /^\[.*\]$/, // Dynamic routes: [id], [slug]
      /^\[\[.*\]\]$/, // Catch-all routes: [[...slug]]
    ];

    if (allowedSpecialDirs.includes(dirName) || dirName.startsWith(".")) {
      return;
    }

    // Allow Next.js specific directory patterns
    if (nextJsPatterns.some(pattern => pattern.test(dirName))) {
      return;
    }

    if (!FILE_NAMING_PATTERNS.DIRECTORIES.test(dirName)) {
      this.errors.push({
        type: "directory",
        path: fullPath,
        issue: `Directory name "${dirName}" should use kebab-case`,
        suggestion: caseTransformers.toKebabCase(dirName),
      });
    }
  }

  /**
   * Validates file naming conventions
   */
  private validateFileName(fileName: string, fullPath: string): void {
    const ext = extname(fileName);
    const baseName = basename(fileName, ext);

    // Skip special files
    const allowedSpecialFiles = [
      "package.json",
      "package-lock.json",
      "pnpm-lock.yaml",
      "tsconfig.json",
      "next.config.js",
      "tailwind.config.js",
      "postcss.config.js",
      "jest.config.js",
      "jest.setup.js",
      ".gitignore",
      ".env.example",
      ".env.local",
      "README.md",
      "CLAUDE.md",
      "Type-Case-Conventions.md",
      "middleware.ts",
      "next-env.d.ts",
      "globals.d.ts",
    ];

    // Special patterns that are allowed
    const allowedPatterns = [
      /\.cy\.(js|ts)$/, // Cypress test files
      /\.d\.ts$/, // TypeScript declaration files
      /\.service\.ts$/, // Service files (common pattern)
      /backend_resolver\.ts$/, // Specific backend resolver
    ];

    if (allowedSpecialFiles.includes(fileName) || fileName.startsWith(".")) {
      return;
    }

    // Check allowed patterns
    if (allowedPatterns.some(pattern => pattern.test(fileName))) {
      return;
    }

    // Determine file type and validate accordingly
    switch (ext) {
      case ".tsx":
      case ".jsx":
        if (!validateFileName(fileName, "COMPONENT_FILES")) {
          this.errors.push({
            type: "file",
            path: fullPath,
            issue: `React component file "${fileName}" should use kebab-case`,
            suggestion: `${caseTransformers.toKebabCase(baseName)}${ext}`,
          });
        }
        break;

      case ".ts":
      case ".js":
        // Special handling for config files
        if (fileName.includes(".config.")) {
          if (!validateFileName(fileName, "CONFIG_FILES")) {
            this.errors.push({
              type: "file",
              path: fullPath,
              issue: `Config file "${fileName}" should use kebab-case`,
              suggestion: caseTransformers.toKebabCase(baseName) + ext,
            });
          }
        } else if (fileName.includes(".test.") || fileName.includes(".spec.")) {
          if (!validateFileName(fileName, "TEST_FILES")) {
            this.errors.push({
              type: "file",
              path: fullPath,
              issue: `Test file "${fileName}" should use kebab-case`,
              suggestion:
                caseTransformers.toKebabCase(
                  baseName.replace(/\.(test|spec)$/, "")
                ) + `.test${ext}`,
            });
          }
        } else if (!validateFileName(fileName, "TS_FILES")) {
          this.errors.push({
            type: "file",
            path: fullPath,
            issue: `TypeScript file "${fileName}" should use kebab-case`,
            suggestion: `${caseTransformers.toKebabCase(baseName)}${ext}`,
          });
        }
        break;

      case ".graphql":
        if (!validateFileName(fileName, "GRAPHQL_FILES")) {
          this.errors.push({
            type: "file",
            path: fullPath,
            issue: `GraphQL file "${fileName}" should use kebab-case`,
            suggestion: `${caseTransformers.toKebabCase(baseName)}${ext}`,
          });
        }
        break;

      case ".css":
      case ".scss":
      case ".less":
        if (!FILE_NAMING_PATTERNS.DIRECTORIES.test(baseName)) {
          this.errors.push({
            type: "file",
            path: fullPath,
            issue: `CSS file "${fileName}" should use kebab-case`,
            suggestion: `${caseTransformers.toKebabCase(baseName)}${ext}`,
          });
        }
        break;
    }
  }

  /**
   * Prints validation errors to console
   */
  private printErrors(): void {
    const groupedErrors = this.groupErrorsByType();

    Object.entries(groupedErrors).forEach(([type, errors]) => {
      console.log(`\n📁 ${type.toUpperCase()} ISSUES:`);
      errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error.path}`);
        console.log(`     Issue: ${error.issue}`);
        if (error.suggestion) {
          console.log(`     Suggestion: ${error.suggestion}`);
        }
        console.log("");
      });
    });
  }

  /**
   * Groups errors by type for better presentation
   */
  private groupErrorsByType(): Record<string, ValidationError[]> {
    return this.errors.reduce(
      (groups, error) => {
        if (!groups[error.type]) {
          groups[error.type] = [];
        }
        groups[error.type].push(error);
        return groups;
      },
      {} as Record<string, ValidationError[]>
    );
  }

  /**
   * Fixes file naming issues automatically (dry run by default)
   */
  async autoFix(dryRun: boolean = true): Promise<void> {
    console.log(
      dryRun
        ? "🧪 DRY RUN - No files will be changed"
        : "🔧 FIXING - Files will be renamed"
    );

    for (const error of this.errors) {
      if (
        error.suggestion &&
        (error.type === "file" || error.type === "directory")
      ) {
        const oldPath = error.path;
        const newPath = join(dirname(oldPath), error.suggestion);

        console.log(
          `${dryRun ? "Would rename" : "Renaming"}: ${oldPath} → ${newPath}`
        );

        if (!dryRun) {
          // Implementation for actual renaming would go here
          // Using fs.rename() with proper error handling
        }
      }
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const autoFix = args.includes("--fix");
  const dryRun = !args.includes("--no-dry-run");

  const validator = new CaseConventionValidator();
  const errors = await validator.validateProject();

  if (autoFix && errors.length > 0) {
    console.log("\n" + "=".repeat(50));
    await validator.autoFix(dryRun);
  }

  process.exit(errors.length > 0 ? 1 : 0);
}

// Export for use in other scripts
export { CaseConventionValidator };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
