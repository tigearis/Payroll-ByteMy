#!/usr/bin/env node

/**
 * GraphQL Codegen Size Comparison Script
 * 
 * Compares the size of generated files between current and optimized configurations
 * to measure performance improvements.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Helper functions
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const getFileSize = (filePath) => {
  try {
    return existsSync(filePath) ? statSync(filePath).size : 0;
  } catch {
    return 0;
  }
};

const countLines = (filePath) => {
  try {
    if (!existsSync(filePath)) return 0;
    const content = readFileSync(filePath, 'utf-8');
    return content.split('\n').length;
  } catch {
    return 0;
  }
};

const scanDirectory = (dir) => {
  const results = { files: 0, totalSize: 0, totalLines: 0 };
  
  if (!existsSync(dir)) return results;
  
  const scan = (currentDir) => {
    try {
      const items = readdirSync(currentDir);
      for (const item of items) {
        const fullPath = join(currentDir, item);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          scan(fullPath);
        } else if (item.endsWith('.ts') && !item.endsWith('.d.ts')) {
          results.files++;
          results.totalSize += stat.size;
          results.totalLines += countLines(fullPath);
        }
      }
    } catch (err) {
      // Ignore errors (permission issues, etc.)
    }
  };
  
  scan(dir);
  return results;
};

// Analysis functions
const analyzeCurrent = () => {
  console.log('🔍 Analyzing CURRENT GraphQL codegen output...\n');
  
  // Shared types
  const sharedResults = scanDirectory(join(projectRoot, 'shared/types/generated'));
  
  // Domain types
  const domainDirs = [
    'auth', 'users', 'clients', 'billing', 'payrolls', 
    'notes', 'leave', 'work-schedule', 'email', 'external-systems', 'audit'
  ];
  
  let totalDomainResults = { files: 0, totalSize: 0, totalLines: 0 };
  const domainBreakdown = [];
  
  for (const domain of domainDirs) {
    const domainPath = join(projectRoot, `domains/${domain}/graphql/generated`);
    const domainResults = scanDirectory(domainPath);
    
    if (domainResults.files > 0) {
      totalDomainResults.files += domainResults.files;
      totalDomainResults.totalSize += domainResults.totalSize;
      totalDomainResults.totalLines += domainResults.totalLines;
      
      domainBreakdown.push({
        domain,
        ...domainResults
      });
    }
  }
  
  return {
    shared: sharedResults,
    domains: totalDomainResults,
    domainBreakdown,
    total: {
      files: sharedResults.files + totalDomainResults.files,
      totalSize: sharedResults.totalSize + totalDomainResults.totalSize,
      totalLines: sharedResults.totalLines + totalDomainResults.totalLines
    }
  };
};

const analyzeOptimized = () => {
  console.log('🎯 Analyzing OPTIMIZED GraphQL codegen output...\n');
  
  // Base types (instead of massive shared types)
  const baseResults = scanDirectory(join(projectRoot, 'shared/types/base'));
  
  // Domain types (should be much smaller)
  const domainDirs = [
    'auth', 'users', 'clients', 'billing', 'payrolls',
    'notes', 'leave', 'work-schedule', 'email', 'external-systems', 'audit'
  ];
  
  let totalDomainResults = { files: 0, totalSize: 0, totalLines: 0 };
  const domainBreakdown = [];
  
  for (const domain of domainDirs) {
    const domainPath = join(projectRoot, `domains/${domain}/graphql/generated`);
    const domainResults = scanDirectory(domainPath);
    
    if (domainResults.files > 0) {
      totalDomainResults.files += domainResults.files;
      totalDomainResults.totalSize += domainResults.totalSize;
      totalDomainResults.totalLines += domainResults.totalLines;
      
      domainBreakdown.push({
        domain,
        ...domainResults
      });
    }
  }
  
  return {
    base: baseResults,
    domains: totalDomainResults,
    domainBreakdown,
    total: {
      files: baseResults.files + totalDomainResults.files,
      totalSize: baseResults.totalSize + totalDomainResults.totalSize,
      totalLines: baseResults.totalLines + totalDomainResults.totalLines
    }
  };
};

// Main comparison
const main = () => {
  console.log('📊 GraphQL Codegen Size Comparison\n');
  console.log('=' .repeat(50));
  
  const current = analyzeCurrent();
  
  // Check if optimized files exist
  const hasOptimizedFiles = existsSync(join(projectRoot, 'shared/types/base'));
  
  if (hasOptimizedFiles) {
    const optimized = analyzeOptimized();
    
    console.log('\n📈 COMPARISON RESULTS\n');
    console.log('Current Configuration:');
    console.log(`  Shared Types: ${current.shared.files} files, ${formatBytes(current.shared.totalSize)}, ${current.shared.totalLines.toLocaleString()} lines`);
    console.log(`  Domain Types: ${current.domains.files} files, ${formatBytes(current.domains.totalSize)}, ${current.domains.totalLines.toLocaleString()} lines`);
    console.log(`  TOTAL: ${current.total.files} files, ${formatBytes(current.total.totalSize)}, ${current.total.totalLines.toLocaleString()} lines\n`);
    
    console.log('Optimized Configuration:');
    console.log(`  Base Types: ${optimized.base.files} files, ${formatBytes(optimized.base.totalSize)}, ${optimized.base.totalLines.toLocaleString()} lines`);
    console.log(`  Domain Types: ${optimized.domains.files} files, ${formatBytes(optimized.domains.totalSize)}, ${optimized.domains.totalLines.toLocaleString()} lines`);
    console.log(`  TOTAL: ${optimized.total.files} files, ${formatBytes(optimized.total.totalSize)}, ${optimized.total.totalLines.toLocaleString()} lines\n`);
    
    // Calculate improvements
    const sizeSavings = current.total.totalSize - optimized.total.totalSize;
    const lineSavings = current.total.totalLines - optimized.total.totalLines;
    const sizeReduction = ((sizeSavings / current.total.totalSize) * 100);
    const lineReduction = ((lineSavings / current.total.totalLines) * 100);
    
    console.log('🎉 IMPROVEMENTS:');
    console.log(`  Size Reduction: ${formatBytes(sizeSavings)} (${sizeReduction.toFixed(1)}%)`);
    console.log(`  Lines Reduction: ${lineSavings.toLocaleString()} lines (${lineReduction.toFixed(1)}%)`);
    console.log(`  Files Reduction: ${current.total.files - optimized.total.files} files`);
    
    if (sizeReduction > 70) {
      console.log('\n✅ EXCELLENT: >70% reduction achieved! This will significantly improve compilation speed.');
    } else if (sizeReduction > 50) {
      console.log('\n✅ GOOD: >50% reduction achieved! Noticeable performance improvement expected.');
    } else if (sizeReduction > 30) {
      console.log('\n⚠️  MODERATE: >30% reduction achieved. Some improvement expected.');
    } else {
      console.log('\n❌ MINIMAL: <30% reduction. Consider additional optimizations.');
    }
    
  } else {
    console.log('\nCurrent Configuration:');
    console.log(`  Shared Types: ${current.shared.files} files, ${formatBytes(current.shared.totalSize)}, ${current.shared.totalLines.toLocaleString()} lines`);
    console.log(`  Domain Types: ${current.domains.files} files, ${formatBytes(current.domains.totalSize)}, ${current.domains.totalLines.toLocaleString()} lines`);
    console.log(`  TOTAL: ${current.total.files} files, ${formatBytes(current.total.totalSize)}, ${current.total.totalLines.toLocaleString()} lines\n`);
    
    console.log('🔨 Next Steps:');
    console.log('  1. Run: pnpm codegen:optimized');
    console.log('  2. Run: pnpm codegen:compare (this script again)');
    console.log('  3. Compare the results to see the improvements');
  }
  
  // Module compilation estimate
  const estimatedModules = Math.ceil(current.total.totalLines / 30); // Rough estimate
  console.log(`\n📈 Estimated module compilation impact:`);
  console.log(`  Current: ~${estimatedModules.toLocaleString()} modules`);
  
  if (hasOptimizedFiles) {
    const optimized = analyzeOptimized();
    const optimizedModules = Math.ceil(optimized.total.totalLines / 30);
    console.log(`  Optimized: ~${optimizedModules.toLocaleString()} modules`);
    console.log(`  Reduction: ~${(estimatedModules - optimizedModules).toLocaleString()} modules (${(((estimatedModules - optimizedModules) / estimatedModules) * 100).toFixed(1)}%)`);
  }
  
  console.log('\n' + '=' .repeat(50));
};

main();