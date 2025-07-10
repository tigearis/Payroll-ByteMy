#!/usr/bin/env node

/**
 * Fix Custom Name Issue in Hasura Metadata
 * 
 * This script fixes the specific issue where "custom_name" should be "customName"
 * in the column configuration sections.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

let fixedFiles = 0;
let totalIssues = 0;

/**
 * Fix custom_name issue in a metadata file
 */
function fixCustomNameInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const tableName = path.basename(filePath, '.yaml').replace('public_', '');
    
    // Look for the specific pattern where custom_name should be customName
    let modified = false;
    const lines = content.split('\n');
    const fixedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Fix the custom_name entries that are wrong
      if (line.includes('custom_name:') && !line.includes('customName')) {
        const indent = line.match(/^\s*/)[0];
        const tableCamelCase = toCamelCase(tableName);
        
        // Check if this is a table name assignment (not a column)
        if (line.trim() === `custom_name: ${tableName}` || line.trim() === `custom_name: ${tableCamelCase}`) {
          fixedLines.push(`${indent}custom_name: ${tableCamelCase}`);
          if (line.trim() !== `custom_name: ${tableCamelCase}`) {
            modified = true;
            totalIssues++;
            console.log(`  ✅ Fixed: custom_name: ${tableCamelCase}`);
          }
        } else {
          fixedLines.push(line);
        }
      } else {
        fixedLines.push(line);
      }
    }
    
    if (modified) {
      const newContent = fixedLines.join('\n');
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Fixed ${tableName}`);
      fixedFiles++;
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Convert snake_case to camelCase
 */
function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

/**
 * Main execution
 */
async function main() {
  console.log('🔧 Fixing Custom Name Issues in Hasura Metadata\n');
  
  const metadataDir = path.join(__dirname, '../hasura/metadata/databases/default/tables');
  
  if (!fs.existsSync(metadataDir)) {
    console.error('❌ Hasura metadata directory not found:', metadataDir);
    process.exit(1);
  }

  const metadataFiles = fs.readdirSync(metadataDir)
    .filter(file => file.endsWith('.yaml') && file.startsWith('public_'))
    .map(file => path.join(metadataDir, file));
    
  console.log(`Found ${metadataFiles.length} table metadata files\n`);
  
  // Fix each file
  for (const filePath of metadataFiles) {
    const tableName = path.basename(filePath, '.yaml').replace('public_', '');
    process.stdout.write(`Checking ${tableName}... `);
    
    const fixed = fixCustomNameInFile(filePath);
    if (!fixed) {
      console.log('✅ Already correct');
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Fix Summary:');
  console.log(`  Files modified: ${fixedFiles}`);
  console.log(`  Issues fixed: ${totalIssues}`);
  
  if (fixedFiles === 0) {
    console.log('\n🎉 All files already have correct custom_name configuration!');
  } else {
    console.log(`\n✅ Successfully fixed ${fixedFiles} files!`);
    console.log('\n💡 Remember to:');
    console.log('  1. Apply metadata changes with: hasura metadata apply');
    console.log('  2. Regenerate GraphQL types with: pnpm codegen');
  }
}

// Run the fix
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main };