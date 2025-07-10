#!/usr/bin/env node

/**
 * Simple Hasura Metadata Analyzer
 * 
 * Analyzes Hasura metadata files for typecase and relationship naming issues
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Analysis results
let analysisResults = {
  totalFiles: 0,
  issues: [],
  goodPractices: [],
  recommendations: []
};

/**
 * Convert snake_case to camelCase
 */
function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

/**
 * Analyze a metadata file
 */
function analyzeMetadataFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const tableName = path.basename(filePath, '.yaml').replace('public_', '');
    
    console.log(`\n📋 Analyzing ${tableName}:`);
    
    let issues = [];
    let goodPractices = [];
    
    // Check for custom column names
    let inCustomColumnNames = false;
    let inObjectRelationships = false;
    let inArrayRelationships = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      // Track sections
      if (trimmed === 'custom_column_names:') {
        inCustomColumnNames = true;
        continue;
      }
      if (trimmed === 'object_relationships:') {
        inObjectRelationships = true;
        inCustomColumnNames = false;
        continue;
      }
      if (trimmed === 'array_relationships:') {
        inArrayRelationships = true;
        inObjectRelationships = false;
        continue;
      }
      if (trimmed.endsWith(':') && !trimmed.startsWith('  ')) {
        inCustomColumnNames = false;
        inObjectRelationships = false;
        inArrayRelationships = false;
      }
      
      // Analyze custom column names
      if (inCustomColumnNames && trimmed.includes(':')) {
        const [dbColumn, customName] = trimmed.split(':').map(s => s.trim());
        const expectedCamelCase = toCamelCase(dbColumn);
        
        if (customName === expectedCamelCase) {
          goodPractices.push(`✅ Column ${dbColumn} → ${customName} (correct camelCase)`);
        } else {
          issues.push(`❌ Column ${dbColumn} → ${customName} (should be ${expectedCamelCase})`);
        }
      }
      
      // Analyze relationship names
      if ((inObjectRelationships || inArrayRelationships) && trimmed.startsWith('- name:')) {
        const relationshipName = trimmed.replace('- name:', '').trim();
        const relType = inObjectRelationships ? 'object' : 'array';
        
        // Check for meaningful names
        if (relationshipName.includes('user') || relationshipName.includes('client') || 
            relationshipName.includes('payroll') || relationshipName.includes('billing')) {
          goodPractices.push(`✅ ${relType} relationship: ${relationshipName} (meaningful name)`);
        } else if (relationshipName.length < 3) {
          issues.push(`❌ ${relType} relationship: ${relationshipName} (too short/unclear)`);
        }
      }
    }
    
    // Display results for this table
    if (goodPractices.length > 0) {
      console.log('  Good Practices:');
      goodPractices.slice(0, 3).forEach(practice => console.log(`    ${practice}`));
      if (goodPractices.length > 3) {
        console.log(`    ... and ${goodPractices.length - 3} more`);
      }
    }
    
    if (issues.length > 0) {
      console.log('  Issues Found:');
      issues.forEach(issue => console.log(`    ${issue}`));
    }
    
    if (issues.length === 0 && goodPractices.length > 0) {
      console.log('  🎉 No issues found! This table follows good practices.');
    }
    
    return { issues, goodPractices };
    
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error.message);
    return { issues: [], goodPractices: [] };
  }
}

/**
 * Check specific relationships for meaningful names
 */
function checkRelationshipQuality(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const tableName = path.basename(filePath, '.yaml').replace('public_', '');
  
  const relationshipPatterns = [
    // Good patterns
    { pattern: /managerUser|primaryConsultant|backupConsultant|createdByUser/, score: 'excellent' },
    { pattern: /client|user|payroll|billing/, score: 'good' },
    { pattern: /approver|creator|assigned/, score: 'acceptable' },
    // Poor patterns
    { pattern: /^[a-z]{1,3}$/, score: 'poor' }
  ];
  
  const relationships = content.match(/- name: \w+/g) || [];
  const qualityReport = {
    excellent: [],
    good: [],
    acceptable: [],
    poor: []
  };
  
  relationships.forEach(rel => {
    const name = rel.replace('- name: ', '');
    let scored = false;
    
    for (const { pattern, score } of relationshipPatterns) {
      if (pattern.test(name)) {
        qualityReport[score].push(name);
        scored = true;
        break;
      }
    }
    
    if (!scored) {
      qualityReport.acceptable.push(name);
    }
  });
  
  return qualityReport;
}

/**
 * Generate summary report
 */
function generateSummaryReport() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 HASURA METADATA ANALYSIS SUMMARY');
  console.log('='.repeat(60));
  
  const totalIssues = analysisResults.issues.length;
  const totalGoodPractices = analysisResults.goodPractices.length;
  
  console.log(`\n📈 Results:`);
  console.log(`  Files analyzed: ${analysisResults.totalFiles}`);
  console.log(`  Total issues found: ${totalIssues}`);
  console.log(`  Good practices found: ${totalGoodPractices}`);
  
  if (totalIssues === 0) {
    console.log('\n🎉 Excellent! All metadata follows proper naming conventions.');
  } else {
    console.log('\n⚠️  Issues Summary:');
    
    // Group issues by type
    const issuesByType = {};
    analysisResults.issues.forEach(issue => {
      const type = issue.includes('Column') ? 'Column Naming' : 'Relationship Naming';
      issuesByType[type] = (issuesByType[type] || 0) + 1;
    });
    
    Object.entries(issuesByType).forEach(([type, count]) => {
      console.log(`    ${type}: ${count} issues`);
    });
  }
  
  console.log('\n💡 Recommendations:');
  if (totalIssues > 0) {
    console.log('  1. Update column names to use consistent camelCase');
    console.log('  2. Use meaningful relationship names that describe business context');
    console.log('  3. Ensure relationship names are descriptive (e.g., "primaryConsultant" not "user")');
  }
  console.log('  4. Add SOC2 compliance comments to table metadata');
  console.log('  5. Consider using consistent naming patterns across all tables');
  
  console.log('\n🔧 To fix issues automatically, run: node scripts/fix-hasura-metadata.js --fix');
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Analyzing Hasura Metadata for TypeCase and Relationship Naming\n');
  
  const metadataDir = path.join(__dirname, '../hasura/metadata/databases/default/tables');
  
  if (!fs.existsSync(metadataDir)) {
    console.error('❌ Hasura metadata directory not found:', metadataDir);
    process.exit(1);
  }

  const metadataFiles = fs.readdirSync(metadataDir)
    .filter(file => file.endsWith('.yaml') && file.startsWith('public_'))
    .map(file => path.join(metadataDir, file));
    
  console.log(`Found ${metadataFiles.length} table metadata files`);
  analysisResults.totalFiles = metadataFiles.length;
  
  // Analyze each file
  for (const filePath of metadataFiles) {
    const { issues, goodPractices } = analyzeMetadataFile(filePath);
    analysisResults.issues.push(...issues);
    analysisResults.goodPractices.push(...goodPractices);
  }
  
  // Special analysis for key tables
  console.log('\n🔍 Relationship Quality Analysis:');
  const keyTables = ['publicusers.yaml', 'publicpayrolls.yaml', 'publicclients.yaml', 'publicbillingitems.yaml'];
  
  keyTables.forEach(table => {
    const filePath = path.join(metadataDir, table);
    if (fs.existsSync(filePath)) {
      const quality = checkRelationshipQuality(filePath);
      const tableName = table.replace('public_', '').replace('.yaml', '');
      
      console.log(`\n  ${tableName}:`);
      if (quality.excellent.length > 0) {
        console.log(`    🌟 Excellent: ${quality.excellent.join(', ')}`);
      }
      if (quality.good.length > 0) {
        console.log(`    ✅ Good: ${quality.good.join(', ')}`);
      }
      if (quality.poor.length > 0) {
        console.log(`    ❌ Needs improvement: ${quality.poor.join(', ')}`);
      }
    }
  });
  
  generateSummaryReport();
  
  // Save detailed results
  const reportPath = path.join(__dirname, '../audit-reports/hasura-metadata-analysis.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(analysisResults, null, 2));
  
  console.log(`\n📄 Detailed analysis saved to: ${reportPath}`);
  
  process.exit(analysisResults.issues.length > 0 ? 1 : 0);
}

// Run the analysis
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main };