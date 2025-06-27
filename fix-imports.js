#!/usr/bin/env node

/**
 * Fix GraphQL imports after codegen client preset migration
 * 
 * The client preset doesn't generate hooks automatically.
 * This script fixes import paths and adds necessary useQuery imports.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Get all TypeScript/TSX files that might have import issues
const files = execSync('find . -name "*.tsx" -o -name "*.ts" | grep -v node_modules | grep -v .next | grep -v generated', { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean);

const fixes = [
  {
    // Fix missing hooks - replace hook imports with document imports + useQuery
    pattern: /import \{ ([^}]*use\w+Query[^}]*) \} from ['"]([^'"]*graphql\/generated\/graphql)['"];?/g,
    replacement: (match, imports, path) => {
      const documents = imports.replace(/use(\w+)Query/g, '$1Document');
      return `import { ${documents} } from '${path}';\nimport { useQuery } from '@apollo/client';`;
    }
  },
  {
    // Fix missing mutation hooks
    pattern: /import \{ ([^}]*use\w+Mutation[^}]*) \} from ['"]([^'"]*graphql\/generated\/graphql)['"];?/g,
    replacement: (match, imports, path) => {
      const documents = imports.replace(/use(\w+)Mutation/g, '$1Document');
      return `import { ${documents} } from '${path}';\nimport { useMutation } from '@apollo/client';`;
    }
  },
  {
    // Fix generated path issues - remove /generated from paths
    pattern: /from ['"]([^'"]*\/graphql\/generated)['"];?/g,
    replacement: "from '$1/graphql';"
  },
  {
    // Fix hook usage in code
    pattern: /const \{([^}]*)\} = (use\w+Query)\(/g,
    replacement: (match, destructuring, hookName) => {
      const docName = hookName.replace('use', '').replace('Query', 'Document');
      return `const {${destructuring}} = useQuery(${docName}, `;
    }
  },
  {
    // Fix mutation usage
    pattern: /const \[([^,]*),\s*\{([^}]*)\}\] = (use\w+Mutation)\(/g,
    replacement: (match, mutationFn, options, hookName) => {
      const docName = hookName.replace('use', '').replace('Mutation', 'Document');
      return `const [${mutationFn}, {${options}}] = useMutation(${docName}, `;
    }
  }
];

let totalFixed = 0;

files.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    fixes.forEach(fix => {
      if (typeof fix.replacement === 'function') {
        const newContent = content.replace(fix.pattern, fix.replacement);
        if (newContent !== content) {
          content = newContent;
          modified = true;
        }
      } else {
        const newContent = content.replace(fix.pattern, fix.replacement);
        if (newContent !== content) {
          content = newContent;
          modified = true;
        }
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed: ${filePath}`);
      totalFixed++;
    }
  } catch (error) {
    console.log(`❌ Error processing ${filePath}:`, error.message);
  }
});

console.log(`\n🎉 Fixed ${totalFixed} files`);
console.log('\n⚠️  Manual fixes still needed:');
console.log('1. Check for any remaining import errors');
console.log('2. Verify useQuery/useMutation calls have correct syntax');
console.log('3. Run build again to catch remaining issues');