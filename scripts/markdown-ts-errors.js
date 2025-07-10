#!/usr/bin/env node

import { execSync } from "child_process";
import { writeFileSync } from "fs";

/**
 * TypeScript & Lint Error Markdown Reporter
 *
 * This script generates comprehensive markdown reports of:
 * - TypeScript compilation errors
 * - ESLint warnings and errors
 * - Organized by file and severity
 * - Progress tracking capabilities
 */

class ErrorMarkdownReporter {
  constructor(options = {}) {
    this.outputFile = options.outputFile || "TSLINTERRORS_REPORT.md";
    this.includeWarnings = options.includeWarnings !== false;
    this.includeSuggestions = options.includeSuggestions !== false;
    this.groupByFile = options.groupByFile !== false;
    this.timestamp = new Date().toISOString();
  }

  async generateReport() {
    console.log("🔍 Generating TypeScript and Lint Error Report...");

    const report = {
      typescript: await this.getTypeScriptErrors(),
      lint: await this.getLintErrors(),
      summary: {},
    };

    // Calculate summary
    report.summary = this.calculateSummary(report);

    // Generate markdown
    const markdown = this.formatAsMarkdown(report);

    // Write to file
    writeFileSync(this.outputFile, markdown);

    console.log(`✅ Report generated: ${this.outputFile}`);
    console.log(
      `📊 Summary: ${report.summary.totalErrors} errors, ${report.summary.totalWarnings} warnings`
    );

    return report;
  }

  async getTypeScriptErrors() {
    console.log("  📝 Checking TypeScript errors...");

    try {
      // Run TypeScript compiler in check mode
      const output = execSync("pnpm type-check", {
        encoding: "utf8",
        stdio: "pipe",
      });

      return {
        success: true,
        errors: [],
        output: output,
      };
    } catch (error) {
      // Parse TypeScript errors
      const errors = this.parseTypeScriptErrors(error.stdout || error.message);

      return {
        success: false,
        errors: errors,
        output: error.stdout || error.message,
      };
    }
  }

  async getLintErrors() {
    console.log("  🔍 Checking ESLint issues...");

    try {
      const output = execSync("pnpm lint", {
        encoding: "utf8",
        stdio: "pipe",
      });

      return {
        success: true,
        issues: [],
        output: output,
      };
    } catch (error) {
      // Parse ESLint errors
      const issues = this.parseLintErrors(error.stdout || error.message);

      return {
        success: false,
        issues: issues,
        output: error.stdout || error.message,
      };
    }
  }

  parseTypeScriptErrors(output) {
    const errors = [];
    const lines = output.split("\n");

    let currentError = null;

    for (const line of lines) {
      // Match TypeScript error format: src/file.ts(line,col): error TS2345: message
      const errorMatch = line.match(
        /^(.+?)\((\d+),(\d+)\): (error|warning) (TS\d+): (.+)$/
      );

      if (errorMatch) {
        if (currentError) {
          errors.push(currentError);
        }

        currentError = {
          file: errorMatch[1],
          line: parseInt(errorMatch[2]),
          column: parseInt(errorMatch[3]),
          severity: errorMatch[4],
          code: errorMatch[5],
          message: errorMatch[6],
          details: [],
        };
      } else if (currentError && line.trim()) {
        // Additional context lines
        currentError.details.push(line.trim());
      }
    }

    if (currentError) {
      errors.push(currentError);
    }

    return errors;
  }

  parseLintErrors(output) {
    const issues = [];
    const lines = output.split("\n");

    let currentFile = null;

    for (const line of lines) {
      // Match file path: ./path/to/file.tsx
      const fileMatch = line.match(/^\.\/(.+\.tsx?)$/);

      if (fileMatch) {
        currentFile = fileMatch[1];
        continue;
      }

      // Match lint issue: 32:21  Warning: message  rule-name
      const issueMatch = line.match(
        /^\s*(\d+):(\d+)\s+(Error|Warning):\s+(.+?)\s+(@[\w-]+\/[\w-]+|\w+\/\w+)$/
      );

      if (issueMatch && currentFile) {
        issues.push({
          file: currentFile,
          line: parseInt(issueMatch[1]),
          column: parseInt(issueMatch[2]),
          severity: issueMatch[3].toLowerCase(),
          message: issueMatch[4],
          rule: issueMatch[5],
        });
      }
    }

    return issues;
  }

  calculateSummary(report) {
    const summary = {
      totalErrors: 0,
      totalWarnings: 0,
      typeScriptErrors: report.typescript.errors.length,
      lintErrors: 0,
      lintWarnings: 0,
      fileCount: 0,
      topIssues: [],
      ruleBreakdown: {},
    };

    // Count lint issues
    report.lint.issues.forEach(issue => {
      if (issue.severity === "error") {
        summary.lintErrors++;
      } else {
        summary.lintWarnings++;
      }

      // Track rule breakdown
      if (!summary.ruleBreakdown[issue.rule]) {
        summary.ruleBreakdown[issue.rule] = 0;
      }
      summary.ruleBreakdown[issue.rule]++;
    });

    summary.totalErrors = summary.typeScriptErrors + summary.lintErrors;
    summary.totalWarnings = summary.lintWarnings;

    // Get unique files
    const files = new Set();
    report.typescript.errors.forEach(error => files.add(error.file));
    report.lint.issues.forEach(issue => files.add(issue.file));
    summary.fileCount = files.size;

    // Top issues by rule
    summary.topIssues = Object.entries(summary.ruleBreakdown)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([rule, count]) => ({ rule, count }));

    return summary;
  }

  formatAsMarkdown(report) {
    let md = `# TypeScript & Lint Error Report\n\n`;
    md += `**Generated:** ${this.timestamp}\n\n`;

    // Executive Summary
    md += `## 📊 Executive Summary\n\n`;
    md += `| Metric | Count |\n`;
    md += `|--------|-------|\n`;
    md += `| **Total Errors** | ${report.summary.totalErrors} |\n`;
    md += `| **Total Warnings** | ${report.summary.totalWarnings} |\n`;
    md += `| TypeScript Errors | ${report.summary.typeScriptErrors} |\n`;
    md += `| ESLint Errors | ${report.summary.lintErrors} |\n`;
    md += `| ESLint Warnings | ${report.summary.lintWarnings} |\n`;
    md += `| Files Affected | ${report.summary.fileCount} |\n\n`;

    // Top Issues
    if (report.summary.topIssues.length > 0) {
      md += `## 🔥 Top Issues by Rule\n\n`;
      md += `| Rule | Count | Priority |\n`;
      md += `|------|-------|----------|\n`;

      report.summary.topIssues.forEach((issue, index) => {
        const priority =
          index < 3 ? "🔴 High" : index < 6 ? "🟡 Medium" : "🟢 Low";
        md += `| \`${issue.rule}\` | ${issue.count} | ${priority} |\n`;
      });
      md += `\n`;
    }

    // TypeScript Errors
    if (report.typescript.errors.length > 0) {
      md += `## 🚨 TypeScript Errors\n\n`;

      if (this.groupByFile) {
        const errorsByFile = this.groupByFileHelper(report.typescript.errors);

        Object.entries(errorsByFile).forEach(([file, errors]) => {
          md += `### \`${file}\`\n\n`;

          errors.forEach(error => {
            md += `**Line ${error.line}:${error.column}** - \`${error.code}\`\n`;
            md += `> ${error.message}\n\n`;

            if (error.details.length > 0) {
              md += `<details>\n<summary>Details</summary>\n\n`;
              md += `\`\`\`\n${error.details.join("\n")}\n\`\`\`\n\n`;
              md += `</details>\n\n`;
            }
          });
        });
      } else {
        report.typescript.errors.forEach(error => {
          md += `- **${error.file}:${error.line}:${error.column}** - \`${error.code}\`: ${error.message}\n`;
        });
        md += `\n`;
      }
    }

    // ESLint Issues
    if (report.lint.issues.length > 0) {
      md += `## 🔍 ESLint Issues\n\n`;

      if (this.groupByFile) {
        const issuesByFile = this.groupByFileHelper(report.lint.issues);

        Object.entries(issuesByFile).forEach(([file, issues]) => {
          md += `### \`${file}\`\n\n`;

          const errors = issues.filter(i => i.severity === "error");
          const warnings = issues.filter(i => i.severity === "warning");

          if (errors.length > 0) {
            md += `#### ❌ Errors (${errors.length})\n\n`;
            errors.forEach(error => {
              md += `- **Line ${error.line}:${error.column}** - \`${error.rule}\`\n`;
              md += `  > ${error.message}\n\n`;
            });
          }

          if (warnings.length > 0 && this.includeWarnings) {
            md += `#### ⚠️ Warnings (${warnings.length})\n\n`;
            warnings.forEach(warning => {
              md += `- **Line ${warning.line}:${warning.column}** - \`${warning.rule}\`\n`;
              md += `  > ${warning.message}\n\n`;
            });
          }
        });
      }
    }

    // Recommendations
    if (this.includeSuggestions) {
      md += `## 💡 Recommendations\n\n`;

      if (
        report.summary.ruleBreakdown["@typescript-eslint/no-explicit-any"] > 0
      ) {
        md += `### 🎯 High Priority: Type Safety\n`;
        md += `- **${report.summary.ruleBreakdown["@typescript-eslint/no-explicit-any"]} \`any\` types** need to be replaced with proper types\n`;
        md += `- Focus on GraphQL operations and form handlers first\n`;
        md += `- Run \`pnpm codegen\` to generate GraphQL types\n\n`;
      }

      if (
        report.summary.ruleBreakdown["@typescript-eslint/no-unused-vars"] > 0
      ) {
        md += `### 🧹 Quick Wins: Unused Variables\n`;
        md += `- **${report.summary.ruleBreakdown["@typescript-eslint/no-unused-vars"]} unused variables** can be prefixed with \`_\`\n`;
        md += `- Run automated fixer: \`pnpm lint:fix-comprehensive --phase=2\`\n\n`;
      }

      if (
        report.summary.ruleBreakdown["@typescript-eslint/naming-convention"] > 0
      ) {
        md += `### 📝 Code Quality: Naming Conventions\n`;
        md += `- **${report.summary.ruleBreakdown["@typescript-eslint/naming-convention"]} naming issues** need attention\n`;
        md += `- Convert snake_case to camelCase where appropriate\n`;
        md += `- Preserve API property names\n\n`;
      }
    }

    // Progress Tracking
    md += `## 📈 Progress Tracking\n\n`;
    md += `Use this section to track your progress:\n\n`;
    md += `- [ ] Phase 1: Fix automated issues (import order, formatting)\n`;
    md += `- [ ] Phase 2: Fix unused variables (${report.summary.ruleBreakdown["@typescript-eslint/no-unused-vars"] || 0} issues)\n`;
    md += `- [ ] Phase 3: Fix naming conventions (${report.summary.ruleBreakdown["@typescript-eslint/naming-convention"] || 0} issues)\n`;
    md += `- [ ] Phase 4: Improve type safety (${report.summary.ruleBreakdown["@typescript-eslint/no-explicit-any"] || 0} issues)\n`;
    md += `- [ ] Phase 5: Address TypeScript errors (${report.summary.typeScriptErrors} issues)\n\n`;

    // Footer
    md += `---\n\n`;
    md += `**Next Steps:**\n`;
    md += `1. Review the [Lint Remediation Plan](./LINTREMEDIATIONPLAN.md)\n`;
    md += `2. Run \`pnpm lint:fix-dry-run\` to preview automated fixes\n`;
    md += `3. Execute fixes in phases with proper testing\n`;
    md += `4. Re-run this report to track progress: \`pnpm report:errors\`\n`;

    return md;
  }

  groupByFileHelper(items) {
    return items.reduce((acc, item) => {
      if (!acc[item.file]) {
        acc[item.file] = [];
      }
      acc[item.file].push(item);
      return acc;
    }, {});
  }
}

// CLI Interface
const args = process.argv.slice(2);
const options = {
  outputFile:
    args.find(arg => arg.startsWith("--output="))?.split("=")[1] ||
    "TSLINTERRORS_REPORT.md",
  includeWarnings: !args.includes("--no-warnings"),
  includeSuggestions: !args.includes("--no-suggestions"),
  groupByFile: !args.includes("--no-grouping"),
};

const reporter = new ErrorMarkdownReporter(options);
reporter.generateReport().catch(console.error);
