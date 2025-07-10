#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const GRAPHQL_IMPORT_PATTERN = /from\s+["'](@\/domains\/[^\/]+\/graphql\/generated)["']/g;
const REPLACEMENT = 'from "$1/graphql"';

async function fixGraphQLImports() {
  console.log('🔧 Fixing GraphQL import paths...');
  
  // Find all TypeScript files
  const files = glob.sync('**/*.{ts,tsx}', {
    ignore: ['node_modules/**', '.next/**', 'dist/**']
  });
  
  let fixedFiles = 0;
  let totalFixes = 0;
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const newContent = content.replace(GRAPHQL_IMPORT_PATTERN, (match, importPath) => {
        totalFixes++;
        return `from "${importPath}/graphql"`;
      });
      
      if (content !== newContent) {
        fs.writeFileSync(file, newContent);
        fixedFiles++;
        console.log(`✅ Fixed ${file}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }
  
  console.log(`\n🎉 Fixed ${totalFixes} imports in ${fixedFiles} files`);
}

// Specific fixes for bulk upload files
async function fixBulkUploadImports() {
  console.log('🔧 Fixing bulk upload import issues...');
  
  const bulkUploadFixes = [
    {
      file: 'app/api/bulk-upload/clients/route.ts',
      fixes: [
        {
          from: 'import { CreateClientDocument } from "@/domains/clients/graphql/generated";',
          to: 'import { CreateClientDocument } from "@/domains/clients/graphql/generated/graphql";'
        }
      ]
    },
    {
      file: 'app/api/bulk-upload/combined/route.ts',
      fixes: [
        {
          from: 'import { CreateClientDocument } from "@/domains/clients/graphql/generated";',
          to: 'import { CreateClientDocument } from "@/domains/clients/graphql/generated/graphql";'
        },
        {
          from: 'import { CreatePayrollDocument } from "@/domains/payrolls/graphql/generated";',
          to: 'import { CreatePayrollDocument } from "@/domains/payrolls/graphql/generated/graphql";'
        },
        {
          from: 'import { GetClientsDocument } from "@/domains/clients/graphql/generated";',
          to: 'import { GetClientsDocument } from "@/domains/clients/graphql/generated/graphql";'
        },
        {
          from: 'import { GetUsersDocument } from "@/domains/users/graphql/generated";',
          to: 'import { GetUsersDocument } from "@/domains/users/graphql/generated/graphql";'
        }
      ]
    },
    {
      file: 'app/api/bulk-upload/payrolls/route.ts',
      fixes: [
        {
          from: 'import { CreatePayrollDocument } from "@/domains/payrolls/graphql/generated";',
          to: 'import { CreatePayrollDocument } from "@/domains/payrolls/graphql/generated/graphql";'
        },
        {
          from: 'import { GetClientsListDocument } from "@/domains/clients/graphql/generated";',
          to: 'import { GetClientsListDocument } from "@/domains/clients/graphql/generated/graphql";'
        }
      ]
    }
  ];
  
  for (const { file, fixes } of bulkUploadFixes) {
    if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');
      let changed = false;
      
      for (const { from, to } of fixes) {
        if (content.includes(from)) {
          content = content.replace(from, to);
          changed = true;
        }
      }
      
      if (changed) {
        fs.writeFileSync(file, content);
        console.log(`✅ Fixed imports in ${file}`);
      }
    }
  }
}

// Run fixes
if (require.main === module) {
  Promise.all([
    fixGraphQLImports(),
    fixBulkUploadImports()
  ]).then(() => {
    console.log('\n🎉 All GraphQL import fixes completed!');
    console.log('Run `pnpm codegen && pnpm type-check` to verify fixes.');
  }).catch(error => {
    console.error('❌ Fix script failed:', error);
    process.exit(1);
  });
}

module.exports = { fixGraphQLImports, fixBulkUploadImports };