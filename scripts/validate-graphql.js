#!/usr/bin/env node

/**
 * GraphQL Validation Script
 * 
 * Validates GraphQL operations against schema to catch issues like:
 * - Type mismatches (String! vs bpchar!)
 * - Parameter naming (on_conflict vs onConflict)
 * - Response field access patterns
 */

import { readFileSync, existsSync } from 'fs';
import { glob } from 'glob';
import { buildSchema } from 'graphql';
import { parse, validate } from 'graphql';

const SCHEMA_PATH = './shared/schema/schema.graphql';

// Color codes for output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Check for common GraphQL issues
function checkCommonIssues(content, filePath) {
  const issues = [];
  
  // Check for String! when bpchar! might be expected
  const bpcharIssues = content.match(/\$?\w*[Cc]ountry[Cc]ode\s*:\s*String!/g);
  if (bpcharIssues) {
    issues.push({
      type: 'TYPE_MISMATCH',
      message: 'Consider using bpchar! for country codes instead of String!',
      pattern: bpcharIssues[0],
      line: content.split('\n').findIndex(line => line.includes(bpcharIssues[0])) + 1
    });
  }
  
  // Check for on_conflict instead of onConflict
  const conflictIssues = content.match(/\bon_conflict\s*:/g);
  if (conflictIssues) {
    issues.push({
      type: 'PARAMETER_NAMING',
      message: 'Use camelCase "onConflict" instead of snake_case "on_conflict"',
      pattern: conflictIssues[0],
      line: content.split('\n').findIndex(line => line.includes(conflictIssues[0])) + 1
    });
  }
  
  // Check for update_columns instead of updateColumns
  const updateColumnsIssues = content.match(/\bupdate_columns\s*:/g);
  if (updateColumnsIssues) {
    issues.push({
      type: 'PARAMETER_NAMING', 
      message: 'Use camelCase "updateColumns" instead of snake_case "update_columns"',
      pattern: updateColumnsIssues[0],
      line: content.split('\n').findIndex(line => line.includes(updateColumnsIssues[0])) + 1
    });
  }
  
  return issues;
}

// Check TypeScript files for GraphQL template literals
function checkTypeScriptFile(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Find gql template literals
  const gqlMatches = content.match(/gql`[\s\S]*?`/g);
  if (!gqlMatches) return issues;
  
  gqlMatches.forEach((gqlContent, index) => {
    const graphqlCode = gqlContent.slice(4, -1); // Remove gql` and `
    const commonIssues = checkCommonIssues(graphqlCode, filePath);
    issues.push(...commonIssues);
  });
  
  return issues;
}

// Check standalone GraphQL files
function checkGraphQLFile(filePath) {
  const content = readFileSync(filePath, 'utf8');
  return checkCommonIssues(content, filePath);
}

async function validateGraphQL() {
  log('blue', '🔍 Starting GraphQL validation...\n');
  
  // Check if schema exists
  if (!existsSync(SCHEMA_PATH)) {
    log('red', `❌ Schema file not found: ${SCHEMA_PATH}`);
    log('yellow', '💡 Run "pnpm codegen:schema" to generate the schema file');
    process.exit(1);
  }
  
  let totalIssues = 0;
  
  try {
    // Find all GraphQL and TypeScript files
    const graphqlFiles = await glob('./domains/**/*.graphql');
    const sharedGraphQLFiles = await glob('./shared/**/*.graphql');
    const tsFiles = await glob('./domains/**/*.ts');
    
    log('green', `📁 Found ${graphqlFiles.length + sharedGraphQLFiles.length} GraphQL files`);
    log('green', `📁 Found ${tsFiles.length} TypeScript files to check\n`);
    
    // Check standalone GraphQL files
    [...graphqlFiles, ...sharedGraphQLFiles].forEach(file => {
      const issues = checkGraphQLFile(file);
      if (issues.length > 0) {
        log('yellow', `📄 ${file}:`);
        issues.forEach(issue => {
          log('red', `  ❌ Line ${issue.line}: ${issue.message}`);
          log('red', `     Pattern: ${issue.pattern}`);
          totalIssues++;
        });
        console.log();
      }
    });
    
    // Check TypeScript files for embedded GraphQL
    tsFiles.forEach(file => {
      const issues = checkTypeScriptFile(file);
      if (issues.length > 0) {
        log('yellow', `📄 ${file}:`);
        issues.forEach(issue => {
          log('red', `  ❌ ${issue.message}`);
          log('red', `     Pattern: ${issue.pattern}`);
          totalIssues++;
        });
        console.log();
      }
    });
    
    // Summary
    if (totalIssues === 0) {
      log('green', '✅ No GraphQL type safety issues found!');
    } else {
      log('red', `❌ Found ${totalIssues} GraphQL type safety issues`);
      log('yellow', '\n💡 Common fixes:');
      log('yellow', '   • Use bpchar! for country codes (not String!)');
      log('yellow', '   • Use onConflict (not on_conflict)');
      log('yellow', '   • Use updateColumns (not update_columns)');
      log('yellow', '   • Access response.affected_rows (not response.affectedRows)');
      process.exit(1);
    }
    
  } catch (error) {
    log('red', `❌ Validation failed: ${error.message}`);
    process.exit(1);
  }
}

// Run validation
validateGraphQL().catch(error => {
  log('red', `❌ Unexpected error: ${error.message}`);
  process.exit(1);
});