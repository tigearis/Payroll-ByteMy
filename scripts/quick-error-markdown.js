#!/usr/bin/env node

import { execSync } from "child_process";
import { writeFileSync } from "fs";

/**
 * Quick Lint Output to Markdown Converter
 *
 * This is a simpler version that takes current lint output
 * and formats it nicely for documentation/GitHub issues
 */

function convertLintToMarkdown() {
  console.log("🔍 Converting lint output to markdown...");

  try {
    // Get current lint output
    const lintOutput = execSync("pnpm lint", {
      encoding: "utf8",
      stdio: "pipe",
    });

    console.log("✅ No lint errors found!");
    return "# Lint Report\n\n✅ **No errors found!** Your code is clean.\n";
  } catch (error) {
    const output = error.stdout || error.message;
    return formatLintOutput(output);
  }
}

function formatLintOutput(output) {
  const lines = output.split("\n");
  let markdown = "# Lint Error Report\n\n";
  markdown += `**Generated:** ${new Date().toISOString()}\n\n`;

  // Parse the output
  let currentFile = null;
  let errorCount = 0;
  let warningCount = 0;
  const fileErrors = {};

  for (const line of lines) {
    // Check for file path
    const fileMatch = line.match(/^\.\/(.+\.tsx?)$/);
    if (fileMatch) {
      currentFile = fileMatch[1];
      continue;
    }

    // Check for lint issues
    const issueMatch = line.match(
      /^\s*(\d+):(\d+)\s+(Error|Warning):\s+(.+?)\s+(@[\w-]+\/[\w-]+|\w+\/\w+)$/
    );
    if (issueMatch && currentFile) {
      const [, line, column, severity, message, rule] = issueMatch;

      if (!fileErrors[currentFile]) {
        fileErrors[currentFile] = { errors: [], warnings: [] };
      }

      const issue = {
        line: parseInt(line),
        column: parseInt(column),
        message,
        rule,
      };

      if (severity === "Error") {
        fileErrors[currentFile].errors.push(issue);
        errorCount++;
      } else {
        fileErrors[currentFile].warnings.push(issue);
        warningCount++;
      }
    }
  }

  // Add summary
  markdown += `## 📊 Summary\n\n`;
  markdown += `- **Errors:** ${errorCount}\n`;
  markdown += `- **Warnings:** ${warningCount}\n`;
  markdown += `- **Files affected:** ${Object.keys(fileErrors).length}\n\n`;

  // Add rule breakdown
  const ruleCount = {};
  Object.values(fileErrors).forEach(file => {
    [...file.errors, ...file.warnings].forEach(issue => {
      ruleCount[issue.rule] = (ruleCount[issue.rule] || 0) + 1;
    });
  });

  const topRules = Object.entries(ruleCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  if (topRules.length > 0) {
    markdown += `## 🔥 Top Issues\n\n`;
    topRules.forEach(([rule, count]) => {
      markdown += `- **${rule}**: ${count} occurrences\n`;
    });
    markdown += "\n";
  }

  // Add detailed errors by file
  Object.entries(fileErrors).forEach(([file, issues]) => {
    markdown += `## \`${file}\`\n\n`;

    if (issues.errors.length > 0) {
      markdown += `### ❌ Errors (${issues.errors.length})\n\n`;
      issues.errors.forEach(error => {
        markdown += `**Line ${error.line}:${error.column}** - \`${error.rule}\`\n`;
        markdown += `> ${error.message}\n\n`;
      });
    }

    if (issues.warnings.length > 0) {
      markdown += `### ⚠️ Warnings (${issues.warnings.length})\n\n`;
      issues.warnings.forEach(warning => {
        markdown += `**Line ${warning.line}:${warning.column}** - \`${warning.rule}\`\n`;
        markdown += `> ${warning.message}\n\n`;
      });
    }
  });

  // Add next steps
  markdown += `---\n\n`;
  markdown += `## 🚀 Next Steps\n\n`;
  markdown += `1. **Quick wins**: Run \`pnpm lint:fix\` for auto-fixable issues\n`;
  markdown += `2. **Systematic approach**: Use \`pnpm lint:fix-comprehensive\` for bulk fixes\n`;
  markdown += `3. **Track progress**: Re-run \`pnpm report:quick\` after fixes\n\n`;

  return markdown;
}

// Main execution
const markdown = convertLintToMarkdown();
const outputFile = process.argv.includes("--stdout") ? null : "LINT_REPORT.md";

if (outputFile) {
  writeFileSync(outputFile, markdown);
  console.log(`✅ Report saved to ${outputFile}`);
} else {
  console.log(markdown);
}
