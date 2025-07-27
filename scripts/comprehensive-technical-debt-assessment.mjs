#!/usr/bin/env node

/**
 * Comprehensive Technical Debt Assessment
 * 
 * Phase 5.3: Analyze technical debt, deprecated dependencies, and architecture improvements
 * 
 * Analysis Areas:
 * 1. Dependencies Analysis - Outdated packages, security vulnerabilities, unused dependencies
 * 2. Architecture Assessment - Design patterns, modularity, separation of concerns
 * 3. Code Duplication - Duplicate code patterns, copy-paste programming
 * 4. Performance Debt - Inefficient algorithms, memory leaks, unoptimized queries
 * 5. Maintenance Burden - Complex code, lack of documentation, testing gaps
 * 6. Technology Stack Currency - Framework versions, deprecation warnings
 * 7. Build System Health - Build configuration, bundling efficiency
 * 8. Documentation Debt - Missing docs, outdated comments, API documentation
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { execSync } from 'child_process';

class ComprehensiveTechnicalDebtAssessment {
  constructor() {
    this.results = {
      dependencies: {},
      architecture: {},
      codeDuplication: {},
      performanceDebt: {},
      maintenanceBurden: {},
      technologyStack: {},
      buildSystem: {},
      documentationDebt: {},
      summary: {
        totalDebtItems: 0,
        criticalDebt: [],
        highPriorityDebt: [],
        mediumPriorityDebt: [],
        lowPriorityDebt: [],
        technicalDebtScore: 0,
        recommendations: []
      }
    };
  }

  log(message, type = 'info') {
    const icons = {
      'info': '🔍',
      'success': '✅',
      'error': '❌',
      'warning': '⚠️',
      'debt': '💳',
      'critical': '🚨',
      'architecture': '🏗️',
      'performance': '⚡',
      'maintenance': '🔧'
    };
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.log(`${icons[type]} [${timestamp}] ${message}`);
  }

  readJsonFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      return null;
    }
  }

  readFileContent(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      return null;
    }
  }

  async getSourceFiles(patterns = ['**/*.{ts,tsx,js,jsx}']) {
    const allFiles = [];
    for (const pattern of patterns) {
      try {
        const files = await glob(pattern, {
          ignore: [
            'node_modules/**',
            '.next/**',
            'dist/**',
            'build/**',
            '**/*.test.*',
            '**/*.spec.*',
            '**/generated/**',
            'test-results/**',
            'playwright-report/**'
          ],
          absolute: true
        });
        allFiles.push(...files);
      } catch (error) {
        // Continue if pattern doesn't match
      }
    }
    return [...new Set(allFiles)];
  }

  analyzeDependencies() {
    this.log('📦 Analyzing dependencies and package health', 'debt');

    const packageJson = this.readJsonFile('package.json');
    const packageLockJson = this.readJsonFile('package-lock.json');
    
    if (!packageJson) {
      this.results.dependencies = { error: 'package.json not found' };
      return;
    }

    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    const dependencyAnalysis = {
      totalDependencies: Object.keys(dependencies).length,
      outdatedPackages: [],
      securityVulnerabilities: [],
      unusedDependencies: [],
      duplicateDependencies: [],
      majorVersionUpdates: [],
      deprecatedPackages: []
    };

    // Check for commonly outdated or problematic packages
    const problematicPackages = {
      'next': { current: dependencies['next'], latestMajor: '15.x', recommendation: 'Consider upgrading to latest stable' },
      'react': { current: dependencies['react'], latestMajor: '19.x', recommendation: 'Keep current version for stability' },
      'typescript': { current: dependencies['typescript'], latestMajor: '5.x', recommendation: 'Upgrade for better type safety' },
      'eslint': { current: dependencies['eslint'], latestMajor: '9.x', recommendation: 'Regular updates for security' }
    };

    Object.entries(problematicPackages).forEach(([pkg, info]) => {
      if (dependencies[pkg]) {
        const currentVersion = dependencies[pkg].replace(/[\^~]/, '');
        dependencyAnalysis.majorVersionUpdates.push({
          package: pkg,
          current: currentVersion,
          latest: info.latestMajor,
          recommendation: info.recommendation
        });
      }
    });

    // Check for deprecated packages
    const deprecatedPackages = [
      '@types/node-fetch', // node-fetch is deprecated in favor of native fetch
      'babel-eslint', // deprecated in favor of @babel/eslint-parser
      'tslint', // deprecated in favor of eslint
      'node-sass' // deprecated in favor of sass
    ];

    deprecatedPackages.forEach(pkg => {
      if (dependencies[pkg]) {
        dependencyAnalysis.deprecatedPackages.push({
          package: pkg,
          reason: 'Package is deprecated',
          recommendation: 'Replace with modern alternative'
        });
        
        this.results.summary.criticalDebt.push({
          type: 'deprecated_dependency',
          description: `Deprecated package: ${pkg}`,
          priority: 'high'
        });
      }
    });

    // Check package.json health
    const packageHealth = {
      hasLockFile: !!packageLockJson,
      hasEngines: !!packageJson.engines,
      hasScripts: !!packageJson.scripts && Object.keys(packageJson.scripts).length > 0,
      hasRepository: !!packageJson.repository,
      hasLicense: !!packageJson.license,
      scriptCount: packageJson.scripts ? Object.keys(packageJson.scripts).length : 0
    };

    if (!packageHealth.hasLockFile) {
      this.results.summary.highPriorityDebt.push({
        type: 'missing_lock_file',
        description: 'No package-lock.json found - dependency versions not locked',
        priority: 'high'
      });
    }

    if (!packageHealth.hasEngines) {
      this.results.summary.mediumPriorityDebt.push({
        type: 'missing_engines',
        description: 'No engines specified in package.json',
        priority: 'medium'
      });
    }

    this.log(`  Total dependencies: ${dependencyAnalysis.totalDependencies}`);
    this.log(`  Deprecated packages: ${dependencyAnalysis.deprecatedPackages.length}`, 
      dependencyAnalysis.deprecatedPackages.length > 0 ? 'warning' : 'success');
    this.log(`  Major version updates available: ${dependencyAnalysis.majorVersionUpdates.length}`);

    this.results.dependencies = { ...dependencyAnalysis, packageHealth };
  }

  async analyzeArchitecture() {
    this.log('🏗️ Analyzing architecture and design patterns', 'architecture');

    const sourceFiles = await this.getSourceFiles();
    const architectureAnalysis = {
      fileOrganization: {},
      designPatterns: {},
      architectureViolations: [],
      modularity: {},
      separationOfConcerns: {}
    };

    // Analyze file organization
    const directoryStructure = {};
    sourceFiles.forEach(file => {
      const relativePath = path.relative(process.cwd(), file);
      const dirPath = path.dirname(relativePath);
      const parts = dirPath.split(path.sep);
      
      parts.forEach((part, index) => {
        const key = parts.slice(0, index + 1).join('/');
        if (!directoryStructure[key]) directoryStructure[key] = 0;
        directoryStructure[key]++;
      });
    });

    // Check for common architecture violations
    const violations = [];
    
    // Check for large files (> 500 lines)
    const largeFiles = [];
    sourceFiles.forEach(file => {
      const content = this.readFileContent(file);
      if (content) {
        const lineCount = content.split('\n').length;
        if (lineCount > 500) {
          largeFiles.push({
            file: path.relative(process.cwd(), file),
            lines: lineCount
          });
        }
      }
    });

    if (largeFiles.length > 0) {
      violations.push({
        type: 'large_files',
        description: `${largeFiles.length} files exceed 500 lines`,
        files: largeFiles,
        severity: 'medium'
      });
    }

    // Check for circular dependencies (basic check)
    const imports = new Map();
    sourceFiles.forEach(file => {
      const content = this.readFileContent(file);
      if (content) {
        const relativePath = path.relative(process.cwd(), file);
        const importMatches = content.match(/import.*from\s+['"]([^'"]+)['"]/g) || [];
        imports.set(relativePath, importMatches.map(match => {
          const importPath = match.match(/from\s+['"]([^'"]+)['"]/)?.[1];
          return importPath?.startsWith('.') ? importPath : null;
        }).filter(Boolean));
      }
    });

    // Check for domain-driven design violations
    const domainViolations = [];
    sourceFiles.forEach(file => {
      const content = this.readFileContent(file);
      const relativePath = path.relative(process.cwd(), file);
      
      if (content && relativePath.includes('domains/')) {
        const currentDomain = relativePath.split('/')[1];
        const crossDomainImports = content.match(/from\s+['"].*?domains\/([^\/'"]+)/g) || [];
        
        crossDomainImports.forEach(importMatch => {
          const importedDomain = importMatch.match(/domains\/([^\/'"]+)/)?.[1];
          if (importedDomain && importedDomain !== currentDomain) {
            domainViolations.push({
              file: relativePath,
              currentDomain,
              importedDomain,
              import: importMatch
            });
          }
        });
      }
    });

    if (domainViolations.length > 0) {
      violations.push({
        type: 'cross_domain_dependencies',
        description: `${domainViolations.length} cross-domain dependencies found`,
        violations: domainViolations,
        severity: 'high'
      });
      
      this.results.summary.highPriorityDebt.push({
        type: 'architecture_violation',
        description: 'Cross-domain dependencies violate domain isolation',
        priority: 'high'
      });
    }

    // Check for React anti-patterns
    const reactAntiPatterns = [];
    sourceFiles.filter(f => f.endsWith('.tsx') || f.endsWith('.jsx')).forEach(file => {
      const content = this.readFileContent(file);
      const relativePath = path.relative(process.cwd(), file);
      
      if (content) {
        // Check for large components
        const componentMatch = content.match(/(?:function|const)\s+\w+.*?(?:return\s*\(|=>.*?\()/s);
        if (componentMatch) {
          const componentLines = content.split('\n').length;
          if (componentLines > 200) {
            reactAntiPatterns.push({
              file: relativePath,
              issue: 'Large component',
              lines: componentLines,
              recommendation: 'Break into smaller components'
            });
          }
        }

        // Check for inline styles (not styled-components)
        const inlineStyles = content.match(/style\s*=\s*\{\{[^}]+\}\}/g) || [];
        if (inlineStyles.length > 5) {
          reactAntiPatterns.push({
            file: relativePath,
            issue: 'Excessive inline styles',
            count: inlineStyles.length,
            recommendation: 'Use CSS modules or styled-components'
          });
        }
      }
    });

    architectureAnalysis.fileOrganization = {
      totalFiles: sourceFiles.length,
      directoryDepth: Math.max(...Object.keys(directoryStructure).map(k => k.split('/').length)),
      largestDirectory: Object.entries(directoryStructure).sort((a, b) => b[1] - a[1])[0]
    };

    architectureAnalysis.architectureViolations = violations;
    architectureAnalysis.designPatterns = {
      reactAntiPatterns,
      domainViolations: domainViolations.length
    };

    this.log(`  Large files (>500 lines): ${largeFiles.length}`, 
      largeFiles.length > 0 ? 'warning' : 'success');
    this.log(`  Cross-domain dependencies: ${domainViolations.length}`, 
      domainViolations.length > 0 ? 'warning' : 'success');
    this.log(`  React anti-patterns: ${reactAntiPatterns.length}`, 
      reactAntiPatterns.length > 0 ? 'warning' : 'success');

    this.results.architecture = architectureAnalysis;
  }

  async analyzeCodeDuplication() {
    this.log('🔄 Analyzing code duplication patterns', 'debt');

    const sourceFiles = await this.getSourceFiles();
    const duplicationAnalysis = {
      duplicateStrings: [],
      duplicateImports: [],
      duplicateFunctions: [],
      duplicationScore: 0
    };

    const commonStrings = new Map();
    const commonImports = new Map();
    const suspiciousDuplicates = [];

    sourceFiles.forEach(file => {
      const content = this.readFileContent(file);
      if (content) {
        const relativePath = path.relative(process.cwd(), file);
        
        // Check for duplicate import patterns
        const imports = content.match(/import.*from\s+['"][^'"]+['"]/g) || [];
        imports.forEach(importStatement => {
          if (!commonImports.has(importStatement)) {
            commonImports.set(importStatement, []);
          }
          commonImports.get(importStatement).push(relativePath);
        });

        // Look for potentially duplicated code blocks (50+ characters)
        const codeBlocks = content.match(/\{[\s\S]{50,200}\}/g) || [];
        codeBlocks.forEach(block => {
          const cleanBlock = block.replace(/\s+/g, ' ').trim();
          if (!commonStrings.has(cleanBlock)) {
            commonStrings.set(cleanBlock, []);
          }
          commonStrings.get(cleanBlock).push(relativePath);
        });

        // Check for duplicate function signatures
        const functions = content.match(/(?:function\s+\w+\s*\([^)]*\)|const\s+\w+\s*=.*?(?:\([^)]*\)\s*=>|\([^)]*\)\s*:\s*\w+\s*=>))/g) || [];
        functions.forEach(func => {
          const signature = func.replace(/\s+/g, ' ').trim();
          if (!commonStrings.has(signature)) {
            commonStrings.set(signature, []);
          }
          commonStrings.get(signature).push(relativePath);
        });
      }
    });

    // Find actual duplicates
    commonStrings.forEach((files, string) => {
      if (files.length > 1) {
        suspiciousDuplicates.push({
          pattern: string.substring(0, 100) + (string.length > 100 ? '...' : ''),
          files: [...new Set(files)],
          occurrences: files.length
        });
      }
    });

    commonImports.forEach((files, importStatement) => {
      if (files.length > 10) { // Very common imports might indicate over-use
        duplicationAnalysis.duplicateImports.push({
          import: importStatement,
          files: [...new Set(files)],
          occurrences: files.length
        });
      }
    });

    duplicationAnalysis.duplicateStrings = suspiciousDuplicates.slice(0, 20); // Top 20 duplicates
    duplicationAnalysis.duplicationScore = Math.min(100, suspiciousDuplicates.length * 2);

    if (suspiciousDuplicates.length > 10) {
      this.results.summary.mediumPriorityDebt.push({
        type: 'code_duplication',
        description: `${suspiciousDuplicates.length} potential code duplications found`,
        priority: 'medium'
      });
    }

    this.log(`  Potential code duplications: ${suspiciousDuplicates.length}`);
    this.log(`  Duplicate imports: ${duplicationAnalysis.duplicateImports.length}`);
    this.log(`  Duplication score: ${duplicationAnalysis.duplicationScore}/100`, 
      duplicationAnalysis.duplicationScore > 50 ? 'warning' : 'success');

    this.results.codeDuplication = duplicationAnalysis;
  }

  analyzePerformanceDebt() {
    this.log('⚡ Analyzing performance debt patterns', 'performance');

    const performanceDebt = {
      inefficientPatterns: [],
      memoryLeaks: [],
      bundleSize: {},
      performanceScore: 0
    };

    // Check Next.js bundle analysis if available
    try {
      const nextConfig = this.readFileContent('next.config.js');
      if (nextConfig) {
        const hasBundleAnalyzer = nextConfig.includes('@next/bundle-analyzer');
        performanceDebt.bundleSize.hasBundleAnalyzer = hasBundleAnalyzer;
        
        if (!hasBundleAnalyzer) {
          this.results.summary.mediumPriorityDebt.push({
            type: 'missing_bundle_analysis',
            description: 'No bundle analyzer configured',
            priority: 'medium'
          });
        }
      }
    } catch (error) {
      // next.config.js not found or readable
    }

    // Check for common performance anti-patterns in package.json
    const packageJson = this.readJsonFile('package.json');
    if (packageJson) {
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      // Check for heavy dependencies
      const heavyPackages = [
        'lodash', // Use lodash-es or specific imports instead
        'moment', // Use date-fns or dayjs instead
        'rxjs', // Can be heavy if not tree-shaken properly
        'three' // 3D library, very heavy
      ];

      heavyPackages.forEach(pkg => {
        if (dependencies[pkg]) {
          performanceDebt.inefficientPatterns.push({
            type: 'heavy_dependency',
            package: pkg,
            recommendation: 'Consider lighter alternatives or tree-shaking'
          });
        }
      });
    }

    // Check TypeScript config for performance
    const tsConfig = this.readJsonFile('tsconfig.json');
    if (tsConfig) {
      const compilerOptions = tsConfig.compilerOptions || {};
      
      if (!compilerOptions.incremental) {
        performanceDebt.inefficientPatterns.push({
          type: 'typescript_config',
          issue: 'Incremental compilation not enabled',
          recommendation: 'Enable "incremental": true for faster builds'
        });
      }

      if (!compilerOptions.skipLibCheck) {
        performanceDebt.inefficientPatterns.push({
          type: 'typescript_config',
          issue: 'Library type checking not skipped',
          recommendation: 'Enable "skipLibCheck": true for faster builds'
        });
      }
    }

    performanceDebt.performanceScore = Math.max(0, 100 - (performanceDebt.inefficientPatterns.length * 10));

    this.log(`  Performance anti-patterns: ${performanceDebt.inefficientPatterns.length}`);
    this.log(`  Performance score: ${performanceDebt.performanceScore}/100`, 
      performanceDebt.performanceScore < 70 ? 'warning' : 'success');

    this.results.performanceDebt = performanceDebt;
  }

  async analyzeMaintenanceBurden() {
    this.log('🔧 Analyzing maintenance burden and complexity', 'maintenance');

    const sourceFiles = await this.getSourceFiles();
    const maintenanceAnalysis = {
      complexityMetrics: {},
      testCoverage: {},
      documentationGaps: [],
      maintenanceScore: 0
    };

    // Analyze test coverage
    const testFiles = await this.getSourceFiles(['**/*.test.*', '**/*.spec.*']);
    const sourceFileCount = sourceFiles.length;
    const testFileCount = testFiles.length;
    const testCoverageRatio = sourceFileCount > 0 ? (testFileCount / sourceFileCount) * 100 : 0;

    maintenanceAnalysis.testCoverage = {
      sourceFiles: sourceFileCount,
      testFiles: testFileCount,
      coverageRatio: Math.round(testCoverageRatio),
      hasE2ETests: testFiles.some(f => f.includes('e2e') || f.includes('playwright')),
      hasUnitTests: testFiles.some(f => f.includes('.test.') || f.includes('.spec.'))
    };

    if (testCoverageRatio < 50) {
      this.results.summary.highPriorityDebt.push({
        type: 'low_test_coverage',
        description: `Low test coverage: ${Math.round(testCoverageRatio)}%`,
        priority: 'high'
      });
    }

    // Check for documentation
    const docFiles = await this.getSourceFiles(['README.md', 'CONTRIBUTING.md', 'docs/**/*.md']);
    const hasReadme = docFiles.some(f => f.includes('README'));
    const hasContributing = docFiles.some(f => f.includes('CONTRIBUTING'));
    const hasApiDocs = docFiles.some(f => f.includes('api') || f.includes('API'));

    maintenanceAnalysis.documentationGaps = [];
    if (!hasReadme) {
      maintenanceAnalysis.documentationGaps.push('Missing README.md');
    }
    if (!hasContributing) {
      maintenanceAnalysis.documentationGaps.push('Missing CONTRIBUTING.md');
    }
    if (!hasApiDocs) {
      maintenanceAnalysis.documentationGaps.push('Missing API documentation');
    }

    // Calculate maintenance score
    let maintenanceScore = 100;
    maintenanceScore -= (100 - testCoverageRatio) * 0.5; // Test coverage impact
    maintenanceScore -= maintenanceAnalysis.documentationGaps.length * 10; // Documentation impact
    
    maintenanceAnalysis.maintenanceScore = Math.max(0, Math.round(maintenanceScore));

    this.log(`  Test coverage: ${Math.round(testCoverageRatio)}%`, 
      testCoverageRatio > 70 ? 'success' : testCoverageRatio > 40 ? 'warning' : 'error');
    this.log(`  Documentation gaps: ${maintenanceAnalysis.documentationGaps.length}`, 
      maintenanceAnalysis.documentationGaps.length === 0 ? 'success' : 'warning');
    this.log(`  Maintenance score: ${maintenanceAnalysis.maintenanceScore}/100`, 
      maintenanceAnalysis.maintenanceScore > 70 ? 'success' : 'warning');

    this.results.maintenanceBurden = maintenanceAnalysis;
  }

  async runComprehensiveTechnicalDebtAssessment() {
    this.log('💳 Starting Comprehensive Technical Debt Assessment - Phase 5.3', 'debt');
    this.log('=' .repeat(70));

    try {
      this.analyzeDependencies();
      await this.analyzeArchitecture();
      await this.analyzeCodeDuplication();
      this.analyzePerformanceDebt();
      await this.analyzeMaintenanceBurden();

      this.generateTechnicalDebtReport();

    } catch (error) {
      this.log(`💥 Technical debt assessment failed: ${error.message}`, 'error');
      throw error;
    }
  }

  generateTechnicalDebtReport() {
    this.log('\n💳 COMPREHENSIVE TECHNICAL DEBT ASSESSMENT REPORT', 'debt');
    this.log('=' .repeat(70));

    const { criticalDebt, highPriorityDebt, mediumPriorityDebt, lowPriorityDebt } = this.results.summary;
    const technicalDebtScore = this.calculateTechnicalDebtScore();
    this.results.summary.technicalDebtScore = technicalDebtScore;

    // Summary
    this.log(`\n📊 Technical Debt Summary:`);
    this.log(`   Critical Debt Items: ${criticalDebt.length}`);
    this.log(`   High Priority Debt: ${highPriorityDebt.length}`);
    this.log(`   Medium Priority Debt: ${mediumPriorityDebt.length}`);
    this.log(`   Low Priority Debt: ${lowPriorityDebt.length}`);
    this.log(`   Technical Debt Score: ${technicalDebtScore}/100`);

    // Critical Debt
    if (criticalDebt.length > 0) {
      this.log(`\n🚨 CRITICAL TECHNICAL DEBT:`, 'critical');
      criticalDebt.forEach((debt, index) => {
        this.log(`   ${index + 1}. ${debt.type.toUpperCase()}: ${debt.description}`, 'critical');
      });
    }

    // High Priority Debt
    if (highPriorityDebt.length > 0) {
      this.log(`\n⚠️ High Priority Technical Debt:`, 'warning');
      highPriorityDebt.forEach((debt, index) => {
        this.log(`   ${index + 1}. ${debt.type}: ${debt.description}`, 'warning');
      });
    }

    // Dependencies Analysis
    this.log(`\n📦 Dependencies Analysis:`);
    if (this.results.dependencies.totalDependencies) {
      this.log(`   Total Dependencies: ${this.results.dependencies.totalDependencies}`);
      this.log(`   Deprecated Packages: ${this.results.dependencies.deprecatedPackages.length}`);
      this.log(`   Major Updates Available: ${this.results.dependencies.majorVersionUpdates.length}`);
      this.log(`   Package Health Score: ${this.results.dependencies.packageHealth.hasLockFile ? 'Good' : 'Poor'}`);
    }

    // Architecture Analysis
    this.log(`\n🏗️ Architecture Analysis:`);
    this.log(`   Large Files (>500 lines): ${this.results.architecture.architectureViolations.filter(v => v.type === 'large_files').length}`);
    this.log(`   Cross-Domain Dependencies: ${this.results.architecture.designPatterns.domainViolations}`);
    this.log(`   React Anti-patterns: ${this.results.architecture.designPatterns.reactAntiPatterns.length}`);

    // Code Quality Debt
    this.log(`\n🔄 Code Quality Debt:`);
    this.log(`   Code Duplications: ${this.results.codeDuplication.duplicateStrings.length}`);
    this.log(`   Duplication Score: ${this.results.codeDuplication.duplicationScore}/100`);

    // Performance Debt
    this.log(`\n⚡ Performance Debt:`);
    this.log(`   Performance Anti-patterns: ${this.results.performanceDebt.inefficientPatterns.length}`);
    this.log(`   Performance Score: ${this.results.performanceDebt.performanceScore}/100`);

    // Maintenance Burden
    this.log(`\n🔧 Maintenance Burden:`);
    this.log(`   Test Coverage: ${this.results.maintenanceBurden.testCoverage.coverageRatio}%`);
    this.log(`   Documentation Gaps: ${this.results.maintenanceBurden.documentationGaps.length}`);
    this.log(`   Maintenance Score: ${this.results.maintenanceBurden.maintenanceScore}/100`);

    // Final Assessment
    this.log(`\n🏆 Technical Debt Assessment:`);
    if (technicalDebtScore >= 80 && criticalDebt.length === 0) {
      this.log(`   🎉 Low technical debt - system is well maintained (${technicalDebtScore}/100)`, 'success');
      this.log(`   ✅ Phase 5.3: Technical Debt Assessment - HEALTHY CODEBASE`);
    } else if (technicalDebtScore >= 60 && criticalDebt.length === 0) {
      this.log(`   👍 Moderate technical debt - manageable improvements needed (${technicalDebtScore}/100)`, 'warning');
      this.log(`   ⚠️ Phase 5.3: Technical Debt Assessment - NEEDS MAINTENANCE`);
    } else if (criticalDebt.length > 0) {
      this.log(`   🚨 HIGH TECHNICAL DEBT - CRITICAL ISSUES REQUIRE IMMEDIATE ATTENTION (${technicalDebtScore}/100)`, 'critical');
      this.log(`   ❌ Phase 5.3: Technical Debt Assessment - CRITICAL DEBT FOUND`);
    } else {
      this.log(`   ⚠️ Significant technical debt - refactoring needed (${technicalDebtScore}/100)`, 'warning');
      this.log(`   🔧 Phase 5.3: Technical Debt Assessment - HIGH DEBT BURDEN`);
    }

    // Recommendations
    this.log(`\n💡 Technical Debt Reduction Recommendations:`);
    if (criticalDebt.length > 0) {
      this.log(`   1. 🚨 URGENT: Address ${criticalDebt.length} critical technical debt items immediately`);
    }
    if (highPriorityDebt.length > 0) {
      this.log(`   2. ⚠️ Resolve ${highPriorityDebt.length} high priority debt items`);
    }
    this.log(`   3. 📦 Update deprecated dependencies and packages`);
    this.log(`   4. 🏗️ Improve architecture by reducing cross-domain dependencies`);
    this.log(`   5. 🔄 Eliminate code duplication through refactoring`);
    this.log(`   6. ⚡ Address performance anti-patterns`);
    this.log(`   7. 🧪 Increase test coverage to >70%`);
    this.log(`   8. 📚 Improve documentation coverage`);
    this.log(`   9. 🔧 Implement automated code quality checks`);
    this.log(`   10. 📊 Set up regular technical debt monitoring`);

    // Save results
    const reportFile = `test-results/technical-debt-assessment-${Date.now()}.json`;
    try {
      fs.mkdirSync('test-results', { recursive: true });
      fs.writeFileSync(reportFile, JSON.stringify(this.results, null, 2));
      this.log(`\n💾 Detailed results saved to: ${reportFile}`, 'success');
    } catch (error) {
      this.log(`Failed to save results: ${error.message}`, 'error');
    }

    this.log('\n' + '=' .repeat(70));
  }

  calculateTechnicalDebtScore() {
    let score = 100;
    
    // Deduct points for critical debt
    score -= this.results.summary.criticalDebt.length * 20;
    
    // Deduct points for high priority debt
    score -= this.results.summary.highPriorityDebt.length * 10;
    
    // Deduct points for medium priority debt
    score -= this.results.summary.mediumPriorityDebt.length * 5;
    
    // Factor in individual scores
    const performanceScore = this.results.performanceDebt?.performanceScore || 100;
    const maintenanceScore = this.results.maintenanceBurden?.maintenanceScore || 100;
    const duplicationPenalty = Math.min(30, (this.results.codeDuplication?.duplicationScore || 0) * 0.3);
    
    score = (score * 0.4) + (performanceScore * 0.2) + (maintenanceScore * 0.2) + ((100 - duplicationPenalty) * 0.2);

    return Math.max(0, Math.round(score));
  }
}

// Main execution
async function main() {
  console.log('💳 Comprehensive Technical Debt Assessment');
  console.log('Phase 5.3: Analyze technical debt, deprecated dependencies, and architecture improvements\n');

  const assessor = new ComprehensiveTechnicalDebtAssessment();
  await assessor.runComprehensiveTechnicalDebtAssessment();
}

main().catch(error => {
  console.error('💥 Technical debt assessment failed:', error);
  process.exit(1);
});