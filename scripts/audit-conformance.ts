#!/usr/bin/env npx tsx
/**
 * CLAUDE.md Conformance Audit Script
 * Automated analysis tool to identify non-conforming patterns
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join, relative } from 'path';
import { execSync } from 'child_process';

interface AuditResult {
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  file: string;
  line?: number;
  issue: string;
  recommendation: string;
}

const results: AuditResult[] = [];

// Utility to recursively find files
function findFiles(dir: string, extension: string): string[] {
  const files: string[] = [];
  
  function walk(currentDir: string) {
    const entries = readdirSync(currentDir);
    for (const entry of entries) {
      const fullPath = join(currentDir, entry);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory() && !entry.includes('node_modules') && !entry.startsWith('.')) {
        walk(fullPath);
      } else if (stat.isFile() && entry.endsWith(extension)) {
        files.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return files;
}

// Audit API Routes for old patterns
function auditApiRoutes() {
  console.log('🔍 Auditing API Routes...');
  const apiDir = join(process.cwd(), 'app', 'api');
  const apiFiles = findFiles(apiDir, '.ts');
  
  for (const file of apiFiles) {
    const content = readFileSync(file, 'utf-8');
    const relativePath = relative(process.cwd(), file);
    
    // Check for old Apollo pattern
    if (content.includes('adminApolloClient.query') || content.includes('serverApolloClient.query')) {
      if (!content.includes('executeTypedQuery')) {
        results.push({
          category: 'API Routes',
          severity: 'high',
          file: relativePath,
          issue: 'Using old manual Apollo client pattern',
          recommendation: 'Migrate to executeTypedQuery/executeTypedMutation pattern'
        });
      }
    }
    
    // Check for manual token handling
    if (content.includes('getHasuraToken()') && !content.includes('executeTypedQuery')) {
      results.push({
        category: 'API Routes',
        severity: 'high',
        file: relativePath,
        issue: 'Manual Hasura token handling',
        recommendation: 'Use executeTypedQuery which handles tokens automatically'
      });
    }
    
    // Check for withAuth wrapper
    if (content.includes('export const') && (content.includes('GET') || content.includes('POST'))) {
      if (!content.includes('withAuth') && !content.includes('webhook') && !content.includes('cron')) {
        results.push({
          category: 'Security',
          severity: 'critical',
          file: relativePath,
          issue: 'API route missing withAuth() wrapper',
          recommendation: 'Add withAuth() or withAuthParams() wrapper'
        });
      }
    }
  }
}

// Audit React components for permission guards
function auditComponents() {
  console.log('🔍 Auditing React Components...');
  const componentPaths = [
    join(process.cwd(), 'components'),
    join(process.cwd(), 'domains')
  ];
  
  const sensitivePatterns = [
    'payroll',
    'salary',
    'tax',
    'billing',
    'invoice',
    'payment',
    'user-management',
    'staff-management',
    'role-management',
    'permission',
    'admin'
  ];
  
  for (const basePath of componentPaths) {
    const files = findFiles(basePath, '.tsx');
    
    for (const file of files) {
      const content = readFileSync(file, 'utf-8');
      const relativePath = relative(process.cwd(), file);
      const fileName = file.toLowerCase();
      
      // Check if file might contain sensitive operations
      const isSensitive = sensitivePatterns.some(pattern => fileName.includes(pattern));
      
      if (isSensitive) {
        // Check for permission guards
        if (!content.includes('PermissionGuard') && 
            !content.includes('useEnhancedPermissions') &&
            !content.includes('hasPermission') &&
            !content.includes('canAssignRole')) {
          
          // Check if it's actually a component that needs protection
          if (content.includes('export') && (content.includes('function') || content.includes('const'))) {
            results.push({
              category: 'Security',
              severity: 'critical',
              file: relativePath,
              issue: 'Sensitive component missing permission protection',
              recommendation: 'Add PermissionGuard wrapper or useEnhancedPermissions hook'
            });
          }
        }
      }
    }
  }
}

// Audit GraphQL usage
function auditGraphQL() {
  console.log('🔍 Auditing GraphQL Implementation...');
  const domainDir = join(process.cwd(), 'domains');
  const domains = readdirSync(domainDir).filter(d => statSync(join(domainDir, d)).isDirectory());
  
  for (const domain of domains) {
    const graphqlDir = join(domainDir, domain, 'graphql');
    
    // Check if domain has graphql folder
    try {
      statSync(graphqlDir);
    } catch {
      results.push({
        category: 'GraphQL',
        severity: 'medium',
        file: `domains/${domain}`,
        issue: 'Domain missing GraphQL folder',
        recommendation: 'Add graphql folder with operations and generated types'
      });
      continue;
    }
    
    // Check for generated types
    const generatedPath = join(graphqlDir, 'generated', 'graphql.ts');
    try {
      statSync(generatedPath);
    } catch {
      results.push({
        category: 'GraphQL',
        severity: 'high',
        file: `domains/${domain}/graphql`,
        issue: 'Missing generated GraphQL types',
        recommendation: 'Run pnpm codegen to generate types'
      });
    }
  }
}

// Audit TypeScript any usage
function auditTypeScript() {
  console.log('🔍 Auditing TypeScript Compliance...');
  const tsFiles = findFiles(process.cwd(), '.ts').concat(findFiles(process.cwd(), '.tsx'));
  
  for (const file of tsFiles) {
    if (file.includes('node_modules') || file.includes('.next')) continue;
    
    const content = readFileSync(file, 'utf-8');
    const relativePath = relative(process.cwd(), file);
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // Check for any usage
      if (line.includes(': any') && !line.includes('// eslint-disable')) {
        results.push({
          category: 'TypeScript',
          severity: 'medium',
          file: relativePath,
          line: index + 1,
          issue: 'Using any type',
          recommendation: 'Replace with specific type or unknown'
        });
      }
      
      // Check for @ts-ignore
      if (line.includes('@ts-ignore')) {
        results.push({
          category: 'TypeScript',
          severity: 'medium',
          file: relativePath,
          line: index + 1,
          issue: 'Using @ts-ignore',
          recommendation: 'Fix the underlying type issue instead'
        });
      }
    });
  }
}

// Generate report
function generateReport() {
  console.log('\n📊 Generating Conformance Report...\n');
  
  const bySeverity = {
    critical: results.filter(r => r.severity === 'critical'),
    high: results.filter(r => r.severity === 'high'),
    medium: results.filter(r => r.severity === 'medium'),
    low: results.filter(r => r.severity === 'low')
  };
  
  const byCategory = results.reduce((acc, result) => {
    if (!acc[result.category]) acc[result.category] = [];
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, AuditResult[]>);
  
  // Console output
  console.log('=== CONFORMANCE AUDIT RESULTS ===\n');
  console.log(`Total Issues: ${results.length}`);
  console.log(`Critical: ${bySeverity.critical.length}`);
  console.log(`High: ${bySeverity.high.length}`);
  console.log(`Medium: ${bySeverity.medium.length}`);
  console.log(`Low: ${bySeverity.low.length}\n`);
  
  // Critical issues
  if (bySeverity.critical.length > 0) {
    console.log('🚨 CRITICAL ISSUES (Fix Immediately):');
    bySeverity.critical.forEach(r => {
      console.log(`\n  File: ${r.file}${r.line ? `:${r.line}` : ''}`);
      console.log(`  Issue: ${r.issue}`);
      console.log(`  Fix: ${r.recommendation}`);
    });
  }
  
  // High priority issues
  if (bySeverity.high.length > 0) {
    console.log('\n⚠️  HIGH PRIORITY ISSUES:');
    bySeverity.high.forEach(r => {
      console.log(`\n  File: ${r.file}${r.line ? `:${r.line}` : ''}`);
      console.log(`  Issue: ${r.issue}`);
      console.log(`  Fix: ${r.recommendation}`);
    });
  }
  
  // Category summary
  console.log('\n📈 ISSUES BY CATEGORY:');
  Object.entries(byCategory).forEach(([category, issues]) => {
    console.log(`\n${category}: ${issues.length} issues`);
  });
  
  // Generate detailed report file
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: results.length,
      critical: bySeverity.critical.length,
      high: bySeverity.high.length,
      medium: bySeverity.medium.length,
      low: bySeverity.low.length
    },
    byCategory,
    bySeverity,
    details: results
  };
  
  writeFileSync(
    join(process.cwd(), 'audit-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log('\n✅ Detailed report saved to audit-report.json');
}

// Main execution
async function main() {
  console.log('🚀 Starting CLAUDE.md Conformance Audit...\n');
  
  try {
    auditApiRoutes();
    auditComponents();
    auditGraphQL();
    auditTypeScript();
    generateReport();
    
    // Exit with error code if critical issues found
    const criticalCount = results.filter(r => r.severity === 'critical').length;
    if (criticalCount > 0) {
      console.log(`\n❌ Audit failed with ${criticalCount} critical issues`);
      process.exit(1);
    } else {
      console.log('\n✅ Audit completed successfully');
    }
  } catch (error) {
    console.error('Error during audit:', error);
    process.exit(1);
  }
}

main();