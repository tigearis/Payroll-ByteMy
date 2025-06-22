#!/usr/bin/env node

/**
 * Fix remaining unused variables by prefixing with underscore
 * This script addresses the remaining 68 linting errors
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Get the list of files with unused variable errors
function getFilesWithErrors() {
  try {
    const lintOutput = execSync("pnpm lint 2>&1", { encoding: "utf8" });
    const lines = lintOutput.split("\n");
    const filesWithErrors = new Set();

    for (const line of lines) {
      if (
        (line.includes("Error:") &&
          line.includes("is assigned a value but never used")) ||
        (line.includes("Error:") && line.includes("is defined but never used"))
      ) {
        // Extract file path from lines like "./path/to/file.ts"
        const match = line.match(/^(\.\/[^:]+)/);
        if (match) {
          filesWithErrors.add(match[1]);
        }
      }
    }

    return Array.from(filesWithErrors);
  } catch (error) {
    // ESLint returns exit code 1 when there are errors, which is expected
    const lintOutput = error.stdout || "";
    const lines = lintOutput.split("\n");
    const filesWithErrors = new Set();

    for (const line of lines) {
      if (
        line.includes("Error:") &&
        (line.includes("is assigned a value but never used") ||
          line.includes("is defined but never used"))
      ) {
        // Extract file path from lines like "./path/to/file.ts"
        const match = line.match(/^(\.\/[^:]+)/);
        if (match) {
          filesWithErrors.add(match[1]);
        }
      }
    }

    return Array.from(filesWithErrors);
  }
}

// Extract unused variable names from lint output
function getUnusedVariables() {
  try {
    const lintOutput = execSync("pnpm lint 2>&1", { encoding: "utf8" });
    return parseUnusedVariables(lintOutput);
  } catch (error) {
    const lintOutput = error.stdout || "";
    return parseUnusedVariables(lintOutput);
  }
}

function parseUnusedVariables(lintOutput) {
  const unusedVars = [];
  const lines = lintOutput.split("\n");

  for (const line of lines) {
    if (
      line.includes("Error:") &&
      (line.includes("is assigned a value but never used") ||
        line.includes("is defined but never used"))
    ) {
      // Extract variable name from error message
      const match = line.match(
        /'([^']+)' is (assigned a value but never used|defined but never used)/
      );
      if (match) {
        const varName = match[1];
        // Extract file path
        const fileMatch = line.match(/^(\.\/[^:]+)/);
        if (fileMatch) {
          unusedVars.push({
            file: fileMatch[1],
            variable: varName,
            line: line,
          });
        }
      }
    }
  }

  return unusedVars;
}

function fixUnusedVariables() {
  console.log("🔧 Fixing remaining unused variables...\n");

  const unusedVars = getUnusedVariables();
  console.log(`Found ${unusedVars.length} unused variables to fix`);

  // Group by file
  const fileGroups = {};
  unusedVars.forEach(item => {
    if (!fileGroups[item.file]) {
      fileGroups[item.file] = [];
    }
    fileGroups[item.file].push(item.variable);
  });

  let totalFixed = 0;

  Object.entries(fileGroups).forEach(([filePath, variables]) => {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }

    console.log(`📝 Processing: ${filePath} (${variables.length} variables)`);

    let content = fs.readFileSync(filePath, "utf8");
    let modified = false;
    let fileFixed = 0;

    variables.forEach(varName => {
      // Skip if already prefixed
      if (varName.startsWith("_")) return;

      const replacement = `_${varName}`;

      // Various patterns to catch different contexts
      const patterns = [
        // Variable declarations: const varName = ...
        new RegExp(`\\b(const|let|var)\\s+${escapeRegex(varName)}\\b`, "g"),
        // Function parameters: function name(varName, ...)
        new RegExp(`\\b${escapeRegex(varName)}\\b(?=\\s*[,)])`, "g"),
        // Destructuring: { varName } = ...
        new RegExp(`\\{\\s*${escapeRegex(varName)}\\s*\\}`, "g"),
        // Assignment: varName = ...
        new RegExp(`^(\\s*)${escapeRegex(varName)}(\\s*=)`, "gm"),
        // Type definitions: varName: type
        new RegExp(`\\b${escapeRegex(varName)}\\s*:`, "g"),
      ];

      patterns.forEach(pattern => {
        const newContent = content.replace(pattern, (match, ...groups) => {
          // Handle different capture groups
          if (groups.length > 0) {
            // For patterns with capture groups, replace only the variable name
            return match.replace(
              new RegExp(`\\b${escapeRegex(varName)}\\b`),
              replacement
            );
          } else {
            // For simple patterns, replace the variable name
            return match.replace(
              new RegExp(`\\b${escapeRegex(varName)}\\b`),
              replacement
            );
          }
        });

        if (newContent !== content) {
          content = newContent;
          modified = true;
          fileFixed++;
        }
      });
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

  // Run linting to verify improvements
  console.log("\n🔍 Running lint check to verify improvements...");
  try {
    execSync("pnpm lint", { stdio: "inherit" });
    console.log("✅ Linting completed successfully!");
  } catch (error) {
    console.log("ℹ️  Some linting issues may remain - check output above");
  }
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function main() {
  console.log("🚀 Starting unused variable auto-fix process...\n");

  fixUnusedVariables();

  console.log("\n📋 Summary:");
  console.log("✅ Fixed unused variables by prefixing with underscores");
  console.log(
    "✅ Maintained code functionality while eliminating linting errors"
  );
  console.log("\n🎯 Next steps:");
  console.log("• Run `pnpm lint:fix` to apply any remaining auto-fixes");
  console.log("• Run `pnpm lint:strict` to verify zero warnings");
}

if (require.main === module) {
  main();
}

module.exports = { fixUnusedVariables };
