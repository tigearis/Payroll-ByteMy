#!/usr/bin/env node

/**
 * Codebase Improvement Automation Script
 * Addresses critical issues identified in the comprehensive codebase review
 *
 * Usage: node fix-codebase.js [--dry-run] [--backup] [--fix=auth,graphql,errors]
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

class CodebaseFixer {
  constructor(options = {}) {
    this.dryRun = options.dryRun || false;
    this.createBackup = options.backup || false;
    this.fixes = options.fixes || ["auth", "errors"];
    this.rootDir = process.cwd();
    this.stats = {
      filesScanned: 0,
      filesModified: 0,
      authImportsFixed: 0,
      errorHandlersStandardized: 0,
      duplicateCodeFound: 0,
      backupsCreated: 0,
    };
  }

  log(message, type = "info") {
    const timestamp = new Date().toISOString();
    const prefix = this.dryRun ? "[DRY RUN] " : "";
    const symbols = { info: "ℹ️", success: "✅", warning: "⚠️", error: "❌" };
    console.log(`${symbols[type]} ${prefix}${timestamp} - ${message}`);
  }

  async createBackupIfNeeded(filePath) {
    if (!this.createBackup) return;

    const backupDir = path.join(this.rootDir, ".codebase-fixes-backup");
    await fs.mkdir(backupDir, { recursive: true });

    const relativePath = path.relative(this.rootDir, filePath);
    const backupPath = path.join(backupDir, relativePath);
    const backupDirPath = path.dirname(backupPath);

    await fs.mkdir(backupDirPath, { recursive: true });
    await fs.copyFile(filePath, backupPath);
    this.stats.backupsCreated++;
  }

  async scanFiles(pattern = "**/*.{ts,tsx,js,jsx}") {
    const glob = await import("fast-glob");
    const files = await glob.default(pattern, {
      cwd: this.rootDir,
      ignore: [
        "node_modules/**",
        ".git/**",
        "dist/**",
        "build/**",
        ".next/**",
        "**/*.d.ts",
        ".codebase-fixes-backup/**",
      ],
    });
    return files.map(f => path.join(this.rootDir, f));
  }

  // Fix 1: Authentication System Consolidation (Critical)
  async fixAuthenticationImports() {
    if (!this.fixes.includes("auth")) return;

    this.log("🔐 Starting authentication import fixes...", "info");

    const files = await this.scanFiles("app/api/**/*.{ts,tsx}");
    const deprecatedImport = 'from "@/lib/auth/auth-wrappers"';
    const newImport = 'from "@/lib/auth/enhanced-api-auth"';

    for (const filePath of files) {
      try {
        const content = await fs.readFile(filePath, "utf8");
        this.stats.filesScanned++;

        if (content.includes(deprecatedImport)) {
          await this.createBackupIfNeeded(filePath);

          const updatedContent = content.replace(
            new RegExp(
              deprecatedImport.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
              "g"
            ),
            newImport
          );

          if (!this.dryRun) {
            await fs.writeFile(filePath, updatedContent, "utf8");
          }

          this.stats.filesModified++;
          this.stats.authImportsFixed++;
          this.log(
            `Fixed auth import in: ${path.relative(this.rootDir, filePath)}`,
            "success"
          );
        }
      } catch (error) {
        this.log(`Error processing ${filePath}: ${error.message}`, "error");
      }
    }
  }

  // Fix 2: Standardize Error Handling Patterns
  async standardizeErrorHandling() {
    if (!this.fixes.includes("errors")) return;

    this.log("🔧 Standardizing error handling patterns...", "info");

    // First, create the shared error handler utility
    await this.createErrorHandlerUtility();

    const files = await this.scanFiles("app/api/**/*.{ts,tsx}");
    const errorPattern = /try\s*{[\s\S]*?}\s*catch\s*\([^)]*\)\s*{[\s\S]*?}/g;

    for (const filePath of files) {
      try {
        const content = await fs.readFile(filePath, "utf8");
        this.stats.filesScanned++;

        const matches = content.match(errorPattern);

        if (matches && matches.length > 0) {
          // Check if file already uses standardized error handling
          if (!content.includes("handleApiError")) {
            await this.createBackupIfNeeded(filePath);

            const updatedContent = this.replaceErrorHandling(content, filePath);

            if (!this.dryRun && updatedContent !== content) {
              await fs.writeFile(filePath, updatedContent, "utf8");
              this.stats.filesModified++;
              this.stats.errorHandlersStandardized++;
              this.log(
                `Standardized error handling in: ${path.relative(
                  this.rootDir,
                  filePath
                )}`,
                "success"
              );
            }
          }
        }
      } catch (error) {
        this.log(`Error processing ${filePath}: ${error.message}`, "error");
      }
    }
  }

  async createErrorHandlerUtility() {
    const utilityPath = path.join(
      this.rootDir,
      "lib",
      "shared",
      "error-handling.ts"
    );
    const utilityDir = path.dirname(utilityPath);

    const errorHandlerContent = `import { NextResponse } from 'next/server';

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}

export function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'message' in error;
}

export function handleApiError(error: unknown, operation: string): NextResponse {
  console.error(\`❌ Error \${operation}:\`, error);
  
  if (isApiError(error) && error.statusCode) {
    return NextResponse.json({
      error: \`Failed to \${operation}\`,
      details: error.message
    }, { status: error.statusCode });
  }
  
  return NextResponse.json({
    error: \`Failed to \${operation}\`,
    details: error instanceof Error ? error.message : "Unknown error"
  }, { status: 500 });
}

export function createSuccessResponse<T>(data: T, message?: string) {
  return NextResponse.json({
    success: true,
    data,
    message
  });
}

export function createErrorResponse(message: string, statusCode: number = 400) {
  return NextResponse.json({
    success: false,
    error: message
  }, { status: statusCode });
}`;

    if (!this.dryRun) {
      await fs.mkdir(utilityDir, { recursive: true });

      try {
        await fs.access(utilityPath);
        this.log("Error handler utility already exists", "info");
      } catch {
        await fs.writeFile(utilityPath, errorHandlerContent, "utf8");
        this.log("Created error handler utility", "success");
      }
    } else {
      this.log(`Would create error handler utility at: ${utilityPath}`, "info");
    }
  }

  replaceErrorHandling(content, filePath) {
    const routeType = this.detectRouteType(filePath);

    // Add import if not present
    let updatedContent = content;
    if (!content.includes("handleApiError")) {
      const importStatement =
        'import { handleApiError, createSuccessResponse } from "@/lib/shared/error-handling";\n';
      updatedContent = importStatement + updatedContent;
    }

    // Replace basic try-catch patterns
    const basicPattern =
      /try\s*{([\s\S]*?)}\s*catch\s*\([^)]*\)\s*{[\s\S]*?console\.error[\s\S]*?return\s+NextResponse\.json[\s\S]*?}/g;

    updatedContent = updatedContent.replace(basicPattern, (match, tryBlock) => {
      return `try {${tryBlock}} catch (error) {
    return handleApiError(error, "${routeType}");
  }`;
    });

    return updatedContent;
  }

  detectRouteType(filePath) {
    const segments = filePath.split(path.sep);
    const apiIndex = segments.indexOf("api");
    if (apiIndex !== -1 && apiIndex < segments.length - 1) {
      return segments[apiIndex + 1];
    }
    return "process request";
  }

  // Fix 3: Detect and Report Code Duplication
  async analyzeCodeDuplication() {
    this.log("🔍 Analyzing code duplication...", "info");

    const files = await this.scanFiles();
    const codeBlocks = new Map();
    const duplicates = [];

    for (const filePath of files) {
      try {
        const content = await fs.readFile(filePath, "utf8");
        const blocks = this.extractCodeBlocks(content);

        blocks.forEach(block => {
          const hash = this.hashCode(block.code);
          if (!codeBlocks.has(hash)) {
            codeBlocks.set(hash, []);
          }
          codeBlocks.get(hash).push({
            file: filePath,
            line: block.line,
            code: block.code,
          });
        });
      } catch (error) {
        this.log(`Error analyzing ${filePath}: ${error.message}`, "error");
      }
    }

    // Find duplicates
    codeBlocks.forEach((locations, hash) => {
      if (locations.length > 1) {
        duplicates.push({
          hash,
          locations,
          codeLength: locations[0].code.length,
        });
        this.stats.duplicateCodeFound++;
      }
    });

    // Sort by impact (number of duplicates * code length)
    duplicates.sort(
      (a, b) =>
        b.locations.length * b.codeLength - a.locations.length * a.codeLength
    );

    this.generateDuplicationReport(duplicates);
  }

  extractCodeBlocks(content) {
    const lines = content.split("\n");
    const blocks = [];

    // Extract function definitions
    const functionPattern = /^\s*(export\s+)?(async\s+)?function\s+\w+/;
    // Extract try-catch blocks
    const tryCatchPattern = /^\s*try\s*{/;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (functionPattern.test(line) || tryCatchPattern.test(line)) {
        const block = this.extractBlock(lines, i);
        if (block && block.length > 50) {
          // Only consider blocks with substantial content
          blocks.push({
            line: i + 1,
            code: block,
          });
        }
      }
    }

    return blocks;
  }

  extractBlock(lines, startIndex) {
    let braceCount = 0;
    let block = "";
    let started = false;

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      block += line + "\n";

      for (const char of line) {
        if (char === "{") {
          braceCount++;
          started = true;
        } else if (char === "}") {
          braceCount--;
        }
      }

      if (started && braceCount === 0) {
        break;
      }
    }

    return block.trim();
  }

  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  generateDuplicationReport(duplicates) {
    const reportPath = path.join(this.rootDir, "code-duplication-report.md");

    let report = `# Code Duplication Analysis Report\n\n`;
    report += `Generated: ${new Date().toISOString()}\n\n`;
    report += `## Summary\n\n`;
    report += `- Total duplicate code blocks found: ${duplicates.length}\n`;
    report += `- Estimated duplicate lines: ${duplicates.reduce(
      (sum, d) => sum + (d.locations.length - 1) * d.code.split("\n").length,
      0
    )}\n\n`;

    report += `## Top Duplications (by impact)\n\n`;

    duplicates.slice(0, 10).forEach((dup, index) => {
      report += `### ${index + 1}. Duplicate Block (${
        dup.locations.length
      } occurrences)\n\n`;
      report += `**Impact Score:** ${
        dup.locations.length * dup.codeLength
      }\n\n`;
      report += `**Locations:**\n`;
      dup.locations.forEach(loc => {
        report += `- ${path.relative(this.rootDir, loc.file)}:${loc.line}\n`;
      });
      report += `\n**Code Preview:**\n\`\`\`typescript\n${dup.locations[0].code.substring(
        0,
        200
      )}...\n\`\`\`\n\n`;
    });

    if (!this.dryRun) {
      fs.writeFile(reportPath, report, "utf8");
      this.log(`Generated duplication report: ${reportPath}`, "success");
    } else {
      this.log(`Would generate duplication report at: ${reportPath}`, "info");
    }
  }

  // Fix 4: Create Shared Utilities
  async createSharedUtilities() {
    const utilities = [
      {
        path: "lib/shared/validation.ts",
        content: this.getValidationUtilityContent(),
      },
      {
        path: "lib/shared/responses.ts",
        content: this.getResponseUtilityContent(),
      },
      {
        path: "lib/shared/audit-logging.ts",
        content: this.getAuditLoggingContent(),
      },
    ];

    for (const utility of utilities) {
      const fullPath = path.join(this.rootDir, utility.path);
      const dir = path.dirname(fullPath);

      if (!this.dryRun) {
        await fs.mkdir(dir, { recursive: true });

        try {
          await fs.access(fullPath);
          this.log(`Utility already exists: ${utility.path}`, "info");
        } catch {
          await fs.writeFile(fullPath, utility.content, "utf8");
          this.log(`Created utility: ${utility.path}`, "success");
        }
      } else {
        this.log(`Would create utility: ${utility.path}`, "info");
      }
    }
  }

  getValidationUtilityContent() {
    return `import { z } from 'zod';

export const commonSchemas = {
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  uuid: z.string().uuid('Invalid UUID format'),
  nonEmptyString: z.string().min(1, 'This field is required'),
  positiveNumber: z.number().positive('Must be a positive number'),
};

export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { 
  success: true; 
  data: T 
} | { 
  success: false; 
  errors: string[] 
} {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(e => \`\${e.path.join('.')}: \${e.message}\`)
      };
    }
    return { success: false, errors: ['Validation failed'] };
  }
}`;
  }

  getResponseUtilityContent() {
    return `import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function successResponse<T>(data: T, message?: string): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    message
  } as ApiResponse<T>);
}

export function errorResponse(error: string, status: number = 400): NextResponse {
  return NextResponse.json({
    success: false,
    error
  } as ApiResponse, { status });
}

export function validationErrorResponse(errors: string[]): NextResponse {
  return NextResponse.json({
    success: false,
    error: 'Validation failed',
    details: errors
  } as ApiResponse, { status: 400 });
}`;
  }

  getAuditLoggingContent() {
    return `export interface AuditLogEntry {
  userId: string;
  userRole: string;
  action: string;
  entityType: string;
  entityId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export const auditLogger = {
  logDataAccess(userId: string, userRole: string, entityType: string, entityId?: string) {
    const entry: AuditLogEntry = {
      userId,
      userRole,
      action: 'READ',
      entityType,
      entityId,
      timestamp: new Date()
    };
    
    console.log(\`📊 [AUDIT] Data Access: \${userRole} (\${userId}) accessed \${entityType}\${entityId ? \` (\${entityId})\` : ''}\`);
    // TODO: Send to audit logging service
    return entry;
  },

  logDataModification(userId: string, userRole: string, operation: string, entityType: string, entityId?: string, metadata?: Record<string, any>) {
    const entry: AuditLogEntry = {
      userId,
      userRole,
      action: operation,
      entityType,
      entityId,
      timestamp: new Date(),
      metadata
    };
    
    console.log(\`✏️ [AUDIT] Data Modification: \${userRole} (\${userId}) \${operation} \${entityType}\${entityId ? \` (\${entityId})\` : ''}\`);
    // TODO: Send to audit logging service
    return entry;
  }
};`;
  }

  // Main execution method
  async run() {
    this.log("🚀 Starting codebase improvement automation...", "info");
    this.log(`Working directory: ${this.rootDir}`, "info");
    this.log(`Fixes to apply: ${this.fixes.join(", ")}`, "info");

    try {
      // Critical fixes first
      await this.fixAuthenticationImports();
      await this.standardizeErrorHandling();
      await this.createSharedUtilities();

      // Analysis and reporting
      await this.analyzeCodeDuplication();

      this.printSummary();
    } catch (error) {
      this.log(`Fatal error: ${error.message}`, "error");
      process.exit(1);
    }
  }

  printSummary() {
    this.log("\n📊 EXECUTION SUMMARY", "success");
    console.log("━".repeat(50));
    console.log(`Files scanned: ${this.stats.filesScanned}`);
    console.log(`Files modified: ${this.stats.filesModified}`);
    console.log(`Auth imports fixed: ${this.stats.authImportsFixed}`);
    console.log(
      `Error handlers standardized: ${this.stats.errorHandlersStandardized}`
    );
    console.log(
      `Duplicate code blocks found: ${this.stats.duplicateCodeFound}`
    );
    console.log(`Backups created: ${this.stats.backupsCreated}`);
    console.log("━".repeat(50));

    if (this.dryRun) {
      this.log("This was a dry run. No changes were made.", "warning");
      this.log("Run without --dry-run to apply changes.", "info");
    } else {
      this.log("Codebase improvements completed successfully!", "success");
    }
  }
}

// CLI handling
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    dryRun: false,
    backup: false,
    fixes: ["auth", "errors"],
  };

  args.forEach(arg => {
    if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--backup") {
      options.backup = true;
    } else if (arg.startsWith("--fix=")) {
      options.fixes = arg.split("=")[1].split(",");
    }
  });

  return options;
}

// Main execution - check if this file is being run directly
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

if (isMainModule) {
  const options = parseArgs();
  const fixer = new CodebaseFixer(options);
  fixer.run().catch(console.error);
}

export default CodebaseFixer;
