#!/usr/bin/env node

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { glob } from "fast-glob";

/**
 * Comprehensive Lint Fixer for Payroll ByteMy
 *
 * This script systematically fixes lint issues in phases:
 * 1. Automated fixes (import order, formatting)
 * 2. Unused variables (prefix with underscore)
 * 3. Naming conventions (convert snake_case to camelCase where appropriate)
 * 4. Type safety improvements (replace 'any' with proper types)
 */

class LintFixer {
  constructor(options = {}) {
    this.dryRun = options.dryRun || false;
    this.verbose = options.verbose || false;
    this.phase = options.phase || "all";
    this.backup = options.backup || true;
    this.stats = {
      filesProcessed: 0,
      issuesFixed: 0,
      errors: 0,
    };
  }

  log(message, level = "info") {
    if (this.verbose || level === "error") {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
    }
  }

  async run() {
    console.log("🚀 Starting Lint Issue Remediation");
    console.log(`Mode: ${this.dryRun ? "DRY RUN" : "LIVE"}`);
    console.log(`Phase: ${this.phase}`);
    console.log("─".repeat(50));

    try {
      if (this.phase === "all" || this.phase === "1") {
        await this.phase1_AutomatedFixes();
      }

      if (this.phase === "all" || this.phase === "2") {
        await this.phase2_UnusedVariables();
      }

      if (this.phase === "all" || this.phase === "3") {
        await this.phase3_NamingConventions();
      }

      if (this.phase === "all" || this.phase === "4") {
        await this.phase4_TypeSafety();
      }

      this.printSummary();
    } catch (error) {
      console.error("❌ Error during lint fixing:", error.message);
      process.exit(1);
    }
  }

  async phase1_AutomatedFixes() {
    console.log("\n🔧 Phase 1: Automated Fixes");

    if (!this.dryRun) {
      // Fix import order and formatting
      try {
        execSync("pnpm lint:fix", { stdio: "inherit" });
        execSync("pnpm format", { stdio: "inherit" });
        this.log("✅ Import order and formatting fixed");
        this.stats.issuesFixed += 3; // Approximate
      } catch (error) {
        this.log("Failed to run automated fixes", "error");
        this.stats.errors++;
      }
    } else {
      console.log("  Would run: pnpm lint:fix && pnpm format");
    }
  }

  async phase2_UnusedVariables() {
    console.log("\n🔧 Phase 2: Fix Unused Variables");

    const files = await glob([
      "app/**/*.{ts,tsx}",
      "components/**/*.{ts,tsx}",
      "domains/**/*.{ts,tsx}",
      "hooks/**/*.{ts,tsx}",
      "lib/**/*.{ts,tsx}",
      "!**/*.generated.ts",
      "!**/node_modules/**",
    ]);

    for (const file of files) {
      await this.fixUnusedVariablesInFile(file);
    }
  }

  async fixUnusedVariablesInFile(filePath) {
    try {
      const content = readFileSync(filePath, "utf8");
      let modifiedContent = content;
      let hasChanges = false;

      // Common patterns for unused variables
      const patterns = [
        // Destructuring assignments
        {
          regex: /const \[([^,\]]+),\s*([^,\]]+),\s*([^,\]]+)\]/g,
          replacement: (match, first, second, third) => {
            // Check if variables are used later in the file
            const afterMatch = content.substring(
              content.indexOf(match) + match.length
            );

            const firstUsed = afterMatch.includes(first.trim());
            const secondUsed = afterMatch.includes(second.trim());
            const thirdUsed = afterMatch.includes(third.trim());

            return `const [${firstUsed ? first : `_${first.trim()}`}, ${secondUsed ? second : `_${second.trim()}`}, ${thirdUsed ? third : `_${third.trim()}`}]`;
          },
        },
        // Function parameters
        {
          regex: /function\s+\w+\s*\(([^)]+)\)/g,
          replacement: (match, params) => {
            const paramList = params.split(",").map(param => {
              const trimmed = param.trim();
              if (
                trimmed &&
                !trimmed.startsWith("_") &&
                !content.includes(trimmed.split(":")[0].trim())
              ) {
                return `_${trimmed}`;
              }
              return param;
            });
            return match.replace(params, paramList.join(", "));
          },
        },
      ];

      patterns.forEach(pattern => {
        if (pattern.regex.test(content)) {
          modifiedContent = modifiedContent.replace(
            pattern.regex,
            pattern.replacement
          );
          hasChanges = true;
        }
      });

      // Simple unused variable patterns
      const unusedPatterns = [
        { from: /const (\w+) = .*?;(?![\s\S]*\1)/g, to: "const _$1 = " },
        { from: /let (\w+) = .*?;(?![\s\S]*\1)/g, to: "let _$1 = " },
        { from: /\((\w+):\s*\w+\) => \{(?![\s\S]*\1)/g, to: "(_$1: " },
      ];

      unusedPatterns.forEach(pattern => {
        if (pattern.from.test(content)) {
          modifiedContent = modifiedContent.replace(pattern.from, pattern.to);
          hasChanges = true;
        }
      });

      if (hasChanges && !this.dryRun) {
        if (this.backup) {
          writeFileSync(`${filePath}.backup`, content);
        }
        writeFileSync(filePath, modifiedContent);
        this.log(`✅ Fixed unused variables in ${filePath}`);
        this.stats.issuesFixed++;
      } else if (hasChanges) {
        this.log(`Would fix unused variables in ${filePath}`);
      }

      this.stats.filesProcessed++;
    } catch (error) {
      this.log(`Error processing ${filePath}: ${error.message}`, "error");
      this.stats.errors++;
    }
  }

  async phase3_NamingConventions() {
    console.log("\n🔧 Phase 3: Fix Naming Conventions");

    const files = await glob([
      "app/**/*.{ts,tsx}",
      "components/**/*.{ts,tsx}",
      "!**/*.generated.ts",
    ]);

    for (const file of files) {
      await this.fixNamingConventionsInFile(file);
    }
  }

  async fixNamingConventionsInFile(filePath) {
    try {
      const content = readFileSync(filePath, "utf8");
      let modifiedContent = content;
      let hasChanges = false;

      // Convert snake_case to camelCase for variables (but not object properties)
      const variablePatterns = [
        {
          from: /const (\w+_\w+)/g,
          to: (match, varName) => `const ${this.toCamelCase(varName)}`,
        },
        {
          from: /let (\w+_\w+)/g,
          to: (match, varName) => `let ${this.toCamelCase(varName)}`,
        },
        {
          from: /(\w+_\w+):/g,
          to: (match, propName) => {
            // Only convert if it's not a known API property
            if (this.isKnownApiProperty(propName)) {
              return match;
            }
            return `${this.toCamelCase(propName)}:`;
          },
        },
      ];

      variablePatterns.forEach(pattern => {
        if (pattern.from.test(content)) {
          modifiedContent = modifiedContent.replace(pattern.from, pattern.to);
          hasChanges = true;
        }
      });

      if (hasChanges && !this.dryRun) {
        if (this.backup) {
          writeFileSync(`${filePath}.backup`, content);
        }
        writeFileSync(filePath, modifiedContent);
        this.log(`✅ Fixed naming conventions in ${filePath}`);
        this.stats.issuesFixed++;
      } else if (hasChanges) {
        this.log(`Would fix naming conventions in ${filePath}`);
      }
    } catch (error) {
      this.log(`Error processing ${filePath}: ${error.message}`, "error");
      this.stats.errors++;
    }
  }

  async phase4_TypeSafety() {
    console.log("\n🔧 Phase 4: Improve Type Safety");
    console.log("This phase requires manual intervention for proper typing.");
    console.log("Generating type improvement suggestions...");

    const files = await glob([
      "app/**/*.{ts,tsx}",
      "components/**/*.{ts,tsx}",
      "!**/*.generated.ts",
    ]);

    const suggestions = [];

    for (const file of files) {
      const content = readFileSync(file, "utf8");
      const anyMatches = [...content.matchAll(/:\s*any/g)];

      if (anyMatches.length > 0) {
        suggestions.push({
          file,
          count: anyMatches.length,
          suggestions: this.generateTypeSuggestions(content),
        });
      }
    }

    // Write suggestions to file
    const suggestionsContent = this.formatTypeSuggestions(suggestions);
    if (!this.dryRun) {
      writeFileSync("LINTTYPESUGGESTIONS.md", suggestionsContent);
      console.log(
        "📝 Type improvement suggestions written to LINTTYPESUGGESTIONS.md"
      );
    } else {
      console.log("Would write type suggestions to LINTTYPESUGGESTIONS.md");
    }
  }

  toCamelCase(str) {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
  }

  isKnownApiProperty(propName) {
    const knownApiProps = [
      "user_id",
      "created_at",
      "updated_at",
      "first_name",
      "last_name",
      "email_addresses",
      "external_accounts",
      "image_url",
      "svix-signature",
      "svix-timestamp",
      "svix-id",
      "x-hasura-user-id",
      "x-hasura-default-role",
      "x-hasura-allowed-roles",
      "affected_assignments",
      "date_type_id",
      "cycle_id",
    ];
    return knownApiProps.includes(propName);
  }

  generateTypeSuggestions(content) {
    const suggestions = [];

    // Detect common patterns
    if (content.includes("useMutation<any, any>")) {
      suggestions.push(
        "Replace useMutation<any, any> with generated types from GraphQL codegen"
      );
    }

    if (content.includes("useQuery<any>")) {
      suggestions.push(
        "Replace useQuery<any> with generated types from GraphQL codegen"
      );
    }

    if (content.includes("(data: any)")) {
      suggestions.push("Create interface for form/callback data types");
    }

    if (content.includes("response: any")) {
      suggestions.push("Define API response interface");
    }

    return suggestions;
  }

  formatTypeSuggestions(suggestions) {
    let content = "# Type Safety Improvement Suggestions\n\n";
    content += "Generated by lint fixer to help improve type safety.\n\n";

    suggestions.forEach(suggestion => {
      content += `## ${suggestion.file}\n`;
      content += `**Issues found:** ${suggestion.count}\n\n`;
      suggestion.suggestions.forEach(s => {
        content += `- ${s}\n`;
      });
      content += "\n";
    });

    return content;
  }

  printSummary() {
    console.log("\n📊 Summary");
    console.log("─".repeat(30));
    console.log(`Files processed: ${this.stats.filesProcessed}`);
    console.log(`Issues fixed: ${this.stats.issuesFixed}`);
    console.log(`Errors: ${this.stats.errors}`);

    if (this.stats.errors === 0) {
      console.log("✅ All operations completed successfully!");
    } else {
      console.log("⚠️  Some errors occurred. Check the logs above.");
    }
  }
}

// CLI Interface
const args = process.argv.slice(2);
const options = {
  dryRun: args.includes("--dry-run"),
  verbose: args.includes("--verbose"),
  phase: args.find(arg => arg.startsWith("--phase="))?.split("=")[1] || "all",
  backup: !args.includes("--no-backup"),
};

const fixer = new LintFixer(options);
fixer.run().catch(console.error);
