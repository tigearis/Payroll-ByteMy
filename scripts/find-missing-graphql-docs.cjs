#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

async function findMissingGraphQLDocuments() {
  console.log('🔍 Scanning for missing GraphQL document imports...');
  
  // Find all TypeScript files
  const files = glob.sync('**/*.{ts,tsx}', {
    ignore: ['node_modules/**', '.next/**', 'dist/**', '**/generated/**']
  });
  
  const missingDocs = new Map();
  const importPattern = /import\s+{[^}]*(\w+Document)[^}]*}\s+from\s+['"]([^'"]+)['"];?/g;
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      let match;
      
      while ((match = importPattern.exec(content)) !== null) {
        const documentName = match[1];
        const importPath = match[2];
        
        // Check if this is a GraphQL generated import
        if (importPath.includes('graphql/generated')) {
          const resolvedPath = path.resolve(path.dirname(file), importPath);
          
          // Check if the generated file exists and contains the document
          try {
            const generatedContent = fs.readFileSync(resolvedPath + '.ts', 'utf8');
            if (!generatedContent.includes(`export const ${documentName}`)) {
              const key = `${documentName}@${importPath}`;
              if (!missingDocs.has(key)) {
                missingDocs.set(key, []);
              }
              missingDocs.get(key).push(file);
            }
          } catch (error) {
            // Generated file doesn't exist
            const key = `${documentName}@${importPath}`;
            if (!missingDocs.has(key)) {
              missingDocs.set(key, []);
            }
            missingDocs.get(key).push(file);
          }
        }
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }
  
  if (missingDocs.size === 0) {
    console.log('✅ No missing GraphQL documents found!');
    return;
  }
  
  console.log(`\n❌ Found ${missingDocs.size} missing GraphQL documents:\n`);
  
  for (const [docPath, files] of missingDocs.entries()) {
    const [docName, importPath] = docPath.split('@');
    console.log(`📄 ${docName}`);
    console.log(`   Import path: ${importPath}`);
    console.log(`   Used in:`);
    files.forEach(file => console.log(`     - ${file}`));
    console.log('');
  }
  
  console.log('💡 To fix these issues:');
  console.log('1. Add the missing GraphQL operations to the appropriate .graphql files');
  console.log('2. Run `pnpm codegen` to regenerate types');
  console.log('3. Verify the build passes with `pnpm build`');
}

if (require.main === module) {
  findMissingGraphQLDocuments().catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
}

module.exports = { findMissingGraphQLDocuments };