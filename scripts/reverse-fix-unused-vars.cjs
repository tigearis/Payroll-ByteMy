#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Patterns to reverse the underscore prefixes added by fix-unused-vars.cjs
const REVERSE_PATTERNS = [
  // Variable declarations and destructuring
  { from: /const \{ ([^}]*), _([a-zA-Z_][a-zA-Z0-9_]*)/g, to: 'const { $1, $2' },
  { from: /const \{ _([a-zA-Z_][a-zA-Z0-9_]*)/g, to: 'const { $1' },
  { from: /const _([a-zA-Z_][a-zA-Z0-9_]*)/g, to: 'const $1' },
  { from: /let _([a-zA-Z_][a-zA-Z0-9_]*)/g, to: 'let $1' },
  { from: /var _([a-zA-Z_][a-zA-Z0-9_]*)/g, to: 'var $1' },
  
  // Function parameters
  { from: /\(_([a-zA-Z_][a-zA-Z0-9_]*)\)/g, to: '($1)' },
  { from: /\(([^,)]*), _([a-zA-Z_][a-zA-Z0-9_]*)\)/g, to: '($1, $2)' },
  
  // Arrow function parameters
  { from: /=> _([a-zA-Z_][a-zA-Z0-9_]*)/g, to: '=> $1' },
  
  // Object properties and method calls
  { from: /_([a-zA-Z_][a-zA-Z0-9_]*)\./g, to: '$1.' },
  
  // Type annotations (TypeScript)
  { from: /: _([A-Z][a-zA-Z0-9_]*)/g, to: ': $1' },
  
  // Specific problematic patterns we observed
  { from: /_role/g, to: 'role' },
  { from: /_request/g, to: 'request' },
  { from: /_session/g, to: 'session' },
  { from: /_ipAddress/g, to: 'ipAddress' },
  { from: /_permissionError/g, to: 'permissionError' },
  { from: /_Client/g, to: 'Client' },
  { from: /_data/g, to: 'data' },
  { from: /requirederror/g, to: 'required_error' },
];

function reverseFixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    for (const pattern of REVERSE_PATTERNS) {
      const originalContent = content;
      content = content.replace(pattern.from, pattern.to);
      if (content !== originalContent) {
        changed = true;
      }
    }
    
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Reversed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function reverseFixDirectory(dir) {
  let totalFixed = 0;
  
  function processDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const itemPath = path.join(currentDir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules, .git, .next, etc.
        if (!['node_modules', '.git', '.next', 'dist', 'build'].includes(item)) {
          processDirectory(itemPath);
        }
      } else if (stat.isFile()) {
        // Process TypeScript, JavaScript, and JSX files
        if (/\.(ts|tsx|js|jsx)$/.test(item)) {
          if (reverseFixFile(itemPath)) {
            totalFixed++;
          }
        }
      }
    }
  }
  
  console.log('🔄 Reversing underscore prefixes from unused variable fixes...');
  processDirectory(dir);
  console.log(`\n✨ Reverse operation complete! Fixed ${totalFixed} files.`);
}

// Run the reverse fix
const projectRoot = path.join(__dirname, '..');
reverseFixDirectory(projectRoot);