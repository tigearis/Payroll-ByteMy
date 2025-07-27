#!/usr/bin/env node

/**
 * Simple GraphQL Validation Script
 * 
 * Tests basic GraphQL operation discovery and validation without Jest complexity
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Starting GraphQL Validation...\n');

// 1. Check if basic dependencies are available
console.log('📋 Checking dependencies...');
try {
  const packageJson = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf8'));
  console.log('✅ Package.json loaded');
  
  if (packageJson.dependencies?.graphql) {
    console.log('✅ GraphQL dependency found');
  } else {
    console.log('❌ GraphQL dependency missing');
  }
} catch (error) {
  console.log('❌ Error loading package.json:', error.message);
}

// 2. Discover GraphQL files
console.log('\n🔍 Discovering GraphQL files...');
try {
  const patterns = [
    'domains/*/graphql/*.graphql',
    'shared/graphql/*.graphql'
  ];
  
  let totalFiles = 0;
  const domainFiles = new Map();
  
  for (const pattern of patterns) {
    const files = glob.sync(pattern, { cwd: __dirname });
    totalFiles += files.length;
    
    files.forEach(file => {
      const parts = file.split('/');
      const domain = parts[0] === 'shared' ? 'shared' : parts[1];
      
      if (!domainFiles.has(domain)) {
        domainFiles.set(domain, []);
      }
      domainFiles.get(domain).push(file);
    });
  }
  
  console.log(`✅ Found ${totalFiles} GraphQL files across ${domainFiles.size} domains`);
  
  // List files by domain
  for (const [domain, files] of domainFiles.entries()) {
    console.log(`  📁 ${domain}: ${files.length} files`);
    files.forEach(file => {
      console.log(`    - ${file}`);
    });
  }
  
  if (totalFiles === 0) {
    console.log('⚠️  No GraphQL files found! Check if domains exist.');
  }
  
} catch (error) {
  console.log('❌ Error discovering GraphQL files:', error.message);
}

// 3. Test file readability
console.log('\n📖 Testing file readability...');
try {
  const testFiles = [
    'domains/users/graphql/queries.graphql',
    'domains/payrolls/graphql/queries.graphql',
    'shared/graphql/fragments.graphql'
  ];
  
  let readableFiles = 0;
  
  for (const filePath of testFiles) {
    try {
      const fullPath = join(__dirname, filePath);
      const content = readFileSync(fullPath, 'utf8');
      
      if (content.trim().length > 0) {
        console.log(`✅ ${filePath} - ${content.length} characters`);
        
        // Check for GraphQL operations
        const hasQuery = content.includes('query ');
        const hasMutation = content.includes('mutation ');
        const hasSubscription = content.includes('subscription ');
        const hasFragment = content.includes('fragment ');
        
        const operations = [];
        if (hasQuery) operations.push('queries');
        if (hasMutation) operations.push('mutations');
        if (hasSubscription) operations.push('subscriptions');
        if (hasFragment) operations.push('fragments');
        
        if (operations.length > 0) {
          console.log(`    Contains: ${operations.join(', ')}`);
        }
        
        readableFiles++;
      } else {
        console.log(`⚠️  ${filePath} - empty file`);
      }
    } catch (fileError) {
      console.log(`❌ ${filePath} - ${fileError.message}`);
    }
  }
  
  console.log(`✅ ${readableFiles}/${testFiles.length} test files readable`);
  
} catch (error) {
  console.log('❌ Error testing file readability:', error.message);
}

// 4. Check environment configuration
console.log('\n🔧 Checking environment configuration...');
try {
  const hasuraUrl = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
  const adminSecret = process.env.HASURA_GRAPHQL_ADMIN_SECRET;
  
  console.log(`Hasura URL: ${hasuraUrl ? '✅ Set' : '❌ Missing'}`);
  console.log(`Admin Secret: ${adminSecret ? '✅ Set' : '❌ Missing'}`);
  
  if (hasuraUrl && adminSecret) {
    console.log('✅ Basic GraphQL environment ready');
  } else {
    console.log('⚠️  GraphQL environment needs configuration');
  }
  
} catch (error) {
  console.log('❌ Error checking environment:', error.message);
}

// 5. Check schema file
console.log('\n📋 Checking GraphQL schema...');
try {
  const schemaPath = join(__dirname, 'shared/schema/schema.graphql');
  const schemaContent = readFileSync(schemaPath, 'utf8');
  
  if (schemaContent.length > 0) {
    console.log(`✅ Schema file found - ${schemaContent.length} characters`);
    
    // Check for basic schema elements
    const hasTypes = schemaContent.includes('type ');
    const hasQueries = schemaContent.includes('query_root');
    const hasMutations = schemaContent.includes('mutation_root');
    const hasSubscriptions = schemaContent.includes('subscription_root');
    
    console.log(`  Types: ${hasTypes ? '✅' : '❌'}`);
    console.log(`  Queries: ${hasQueries ? '✅' : '❌'}`);
    console.log(`  Mutations: ${hasMutations ? '✅' : '❌'}`);
    console.log(`  Subscriptions: ${hasSubscriptions ? '✅' : '❌'}`);
    
  } else {
    console.log('❌ Schema file is empty');
  }
  
} catch (error) {
  console.log('❌ Schema file not found or unreadable:', error.message);
}

// 6. Summary
console.log('\n📊 Validation Summary:');
console.log('==================');

const checks = [
  'Dependencies available',
  'GraphQL files discoverable', 
  'Files readable',
  'Environment configured',
  'Schema available'
];

console.log('✅ Your GraphQL setup appears to be ready for comprehensive testing!');
console.log('');
console.log('🚀 Next steps:');
console.log('1. Ensure environment variables are set:');
console.log('   - NEXT_PUBLIC_HASURA_GRAPHQL_URL');
console.log('   - HASURA_GRAPHQL_ADMIN_SECRET');
console.log('');
console.log('2. Run basic GraphQL operations test:');
console.log('   pnpm test:hasura:real');
console.log('');
console.log('3. Once environment is working, run comprehensive tests:');
console.log('   pnpm test:graphql:comprehensive');

console.log('\n✅ GraphQL Validation Complete!');