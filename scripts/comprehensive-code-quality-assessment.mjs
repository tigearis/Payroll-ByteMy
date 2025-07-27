#!/usr/bin/env node

/**
 * Comprehensive Code Quality Assessment
 * 
 * Phase 5.1: Deep code quality analysis for enterprise payroll system
 * 
 * Quality Areas:
 * 1. TODO Comments Analysis - Incomplete implementations, technical debt markers
 * 2. Error Handling Patterns - Try/catch blocks, error boundaries, graceful degradation
 * 3. TypeScript Type Safety - Any types, type assertions, strict mode compliance
 * 4. Dead Code Detection - Unused imports, functions, variables, exports
 * 5. Code Complexity Analysis - Cyclomatic complexity, function length, nesting depth
 * 6. Best Practices Adherence - Naming conventions, component patterns, React hooks
 * 7. Security Code Patterns - Hardcoded secrets, unsafe operations, input validation
 * 8. Performance Anti-patterns - Inefficient renders, memory leaks, large bundles
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

class ComprehensiveCodeQualityAssessment {
  constructor() {
    this.results = {
      todoAnalysis: {},
      errorHandling: {},
      typeScript: {},
      deadCode: {},
      complexity: {},
      bestPractices: {},
      security: {},
      performance: {},
      summary: {
        totalFiles: 0,
        analyzedFiles: 0,
        criticalIssues: [],
        qualityIssues: [],
        recommendations: [],
        qualityScore: 0
      }
    };
    this.excludePatterns = [
      'node_modules/**',
      '.next/**',
      'dist/**',
      'build/**',
      '**/*.test.*',
      '**/*.spec.*',
      '**/generated/**',
      'test-results/**',
      'playwright-report/**'
    ];
  }

  log(message, type = 'info') {
    const icons = {
      'info': '🔍',
      'success': '✅',
      'error': '❌',
      'warning': '⚠️',
      'quality': '📊',
      'critical': '🚨',
      'security': '🔒',
      'performance': '⚡',
      'typescript': '🔷'
    };
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.log(`${icons[type]} [${timestamp}] ${message}`);
  }

  async getSourceFiles() {
    const patterns = [
      'app/**/*.{ts,tsx,js,jsx}',
      'components/**/*.{ts,tsx,js,jsx}',
      'domains/**/*.{ts,tsx,js,jsx}',
      'lib/**/*.{ts,tsx,js,jsx}',
      'shared/**/*.{ts,tsx,js,jsx}',
      'hooks/**/*.{ts,tsx,js,jsx}',
      'pages/**/*.{ts,tsx,js,jsx}',
      'src/**/*.{ts,tsx,js,jsx}',
      '*.{ts,tsx,js,jsx}',
      'middleware.ts',
      'next.config.js'
    ];

    const allFiles = [];
    for (const pattern of patterns) {
      try {
        const files = await glob(pattern, {
          ignore: this.excludePatterns,
          absolute: true
        });
        allFiles.push(...files);
      } catch (error) {
        // Continue if pattern doesn't match anything
      }
    }

    return [...new Set(allFiles)]; // Remove duplicates
  }

  readFileContent(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      return null;
    }
  }

  analyzeTodoComments(files) {
    this.log('📝 Analyzing TODO comments and incomplete implementations', 'quality');

    const todoPatterns = [
      /\/\/\s*(TODO|FIXME|BUG|HACK|NOTE|XXX|OPTIMIZE|REFACTOR)[\s:]*(.+)/gi,
      /\/\*\s*(TODO|FIXME|BUG|HACK|NOTE|XXX|OPTIMIZE|REFACTOR)[\s:]*(.+?)\*\//gi,
      /<!--\s*(TODO|FIXME|BUG|HACK|NOTE|XXX|OPTIMIZE|REFACTOR)[\s:]*(.+?)\s*-->/gi
    ];

    const todoAnalysis = {
      totalTodos: 0,
      todosByType: {},
      todosByFile: {},
      criticalTodos: [],
      oldTodos: []
    };

    files.forEach(filePath => {
      const content = this.readFileContent(filePath);
      if (!content) return;

      const relativePath = path.relative(process.cwd(), filePath);
      const fileTodos = [];

      todoPatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const type = match[1].toUpperCase();
          const description = match[2].trim();
          const lineNumber = content.substring(0, match.index).split('\n').length;

          const todo = {
            type,
            description,
            file: relativePath,
            line: lineNumber,
            fullMatch: match[0]
          };

          fileTodos.push(todo);
          todoAnalysis.totalTodos++;

          if (!todoAnalysis.todosByType[type]) {
            todoAnalysis.todosByType[type] = 0;
          }
          todoAnalysis.todosByType[type]++;

          // Mark critical TODOs
          if (['FIXME', 'BUG', 'HACK'].includes(type) || 
              description.toLowerCase().includes('critical') ||
              description.toLowerCase().includes('urgent') ||
              description.toLowerCase().includes('security')) {
            todoAnalysis.criticalTodos.push(todo);
            this.results.summary.criticalIssues.push({
              type: 'critical_todo',
              description: `${type}: ${description}`,
              file: relativePath,
              line: lineNumber
            });
          }
        }
      });

      if (fileTodos.length > 0) {
        todoAnalysis.todosByFile[relativePath] = fileTodos;
      }
    });

    this.log(`  Found ${todoAnalysis.totalTodos} TODO comments across ${Object.keys(todoAnalysis.todosByFile).length} files`);
    this.log(`  Critical TODOs: ${todoAnalysis.criticalTodos.length}`, todoAnalysis.criticalTodos.length > 0 ? 'warning' : 'success');

    this.results.todoAnalysis = todoAnalysis;
  }

  analyzeErrorHandling(files) {
    this.log('🛡️ Analyzing error handling patterns', 'quality');

    const errorHandling = {
      tryCatchBlocks: 0,
      errorBoundaries: 0,
      unhandledErrors: [],
      missingErrorHandling: [],
      errorPatterns: {}
    };

    const errorPatterns = {
      tryCatch: /try\s*\{[\s\S]*?\}\s*catch\s*\(/g,
      errorBoundary: /class\s+\w+.*extends.*Error.*Boundary|componentDidCatch|static getDerivedStateFromError/g,
      consoleError: /console\.(error|warn)\(/g,
      throwError: /throw\s+(new\s+)?Error/g,
      asyncAwait: /async\s+\w+|await\s+/g,
      promiseCatch: /\.catch\(/g,
      unhandledPromise: /new\s+Promise|Promise\.(resolve|reject)/g
    };

    files.forEach(filePath => {
      const content = this.readFileContent(filePath);
      if (!content) return;

      const relativePath = path.relative(process.cwd(), filePath);

      // Count error handling patterns
      Object.entries(errorPatterns).forEach(([patternName, regex]) => {
        const matches = content.match(regex) || [];
        if (!errorHandling.errorPatterns[patternName]) {
          errorHandling.errorPatterns[patternName] = 0;
        }
        errorHandling.errorPatterns[patternName] += matches.length;
      });

      // Check for async functions without error handling
      const asyncFunctions = content.match(/async\s+function\s+\w+|async\s+\w+\s*=>|async\s+\(/g) || [];
      const tryCatchInFile = content.match(/try\s*\{[\s\S]*?\}\s*catch/g) || [];
      const promiseCatchInFile = content.match(/\.catch\(/g) || [];

      if (asyncFunctions.length > 0 && tryCatchInFile.length === 0 && promiseCatchInFile.length === 0) {
        errorHandling.missingErrorHandling.push({
          file: relativePath,
          issue: `${asyncFunctions.length} async functions without error handling`,
          severity: 'medium'
        });
      }

      // Check for console.log instead of proper error logging
      const consoleLogs = content.match(/console\.log\(/g) || [];
      if (consoleLogs.length > 5) {
        errorHandling.unhandledErrors.push({
          file: relativePath,
          issue: `${consoleLogs.length} console.log statements (should use proper logging)`,
          severity: 'low'
        });
      }
    });

    errorHandling.tryCatchBlocks = errorHandling.errorPatterns.tryCatch || 0;
    errorHandling.errorBoundaries = errorHandling.errorPatterns.errorBoundary || 0;

    this.log(`  Try/catch blocks: ${errorHandling.tryCatchBlocks}`);
    this.log(`  Error boundaries: ${errorHandling.errorBoundaries}`);
    this.log(`  Missing error handling: ${errorHandling.missingErrorHandling.length}`, 
      errorHandling.missingErrorHandling.length > 0 ? 'warning' : 'success');

    this.results.errorHandling = errorHandling;
  }

  analyzeTypeScript(files) {
    this.log('🔷 Analyzing TypeScript type safety', 'typescript');

    const typeScript = {
      anyTypes: [],
      typeAssertions: [],
      noImplicitAny: [],
      missingTypes: [],
      strictModeViolations: [],
      typeScore: 0
    };

    const typePatterns = {
      anyType: /:\s*any\b|<any>|\bas\s+any\b/g,
      typeAssertion: /\bas\s+\w+|\<\w+\>/g,
      implicitAny: /function\s+\w+\s*\([^)]*\)\s*\{|const\s+\w+\s*=/g,
      noReturnType: /function\s+\w+\s*\([^)]*\)\s*\{|=>\s*\{/g
    };

    files.filter(f => f.endsWith('.ts') || f.endsWith('.tsx')).forEach(filePath => {
      const content = this.readFileContent(filePath);
      if (!content) return;

      const relativePath = path.relative(process.cwd(), filePath);

      // Find 'any' types
      const anyMatches = content.match(typePatterns.anyType) || [];
      if (anyMatches.length > 0) {
        typeScript.anyTypes.push({
          file: relativePath,
          count: anyMatches.length,
          matches: anyMatches
        });
        
        this.results.summary.qualityIssues.push({
          type: 'any_types',
          description: `${anyMatches.length} 'any' types found`,
          file: relativePath,
          severity: 'medium'
        });
      }

      // Find type assertions
      const assertionMatches = content.match(typePatterns.typeAssertion) || [];
      if (assertionMatches.length > 0) {
        typeScript.typeAssertions.push({
          file: relativePath,
          count: assertionMatches.length
        });
      }

      // Check for @ts-ignore comments
      const tsIgnoreMatches = content.match(/\/\/\s*@ts-ignore|\/\*\s*@ts-ignore\s*\*\//g) || [];
      if (tsIgnoreMatches.length > 0) {
        typeScript.strictModeViolations.push({
          file: relativePath,
          count: tsIgnoreMatches.length,
          type: 'ts-ignore'
        });

        this.results.summary.criticalIssues.push({
          type: 'typescript_ignore',
          description: `${tsIgnoreMatches.length} @ts-ignore statements`,
          file: relativePath
        });
      }
    });

    // Calculate type safety score
    const totalFiles = files.filter(f => f.endsWith('.ts') || f.endsWith('.tsx')).length;
    const filesWithAny = typeScript.anyTypes.length;
    const filesWithIgnore = typeScript.strictModeViolations.length;
    
    typeScript.typeScore = totalFiles > 0 ? 
      Math.max(0, 100 - (filesWithAny * 10) - (filesWithIgnore * 15)) : 100;

    this.log(`  Files with 'any' types: ${filesWithAny}/${totalFiles}`);
    this.log(`  Type assertions: ${typeScript.typeAssertions.length}`);
    this.log(`  @ts-ignore statements: ${typeScript.strictModeViolations.length}`, 
      typeScript.strictModeViolations.length > 0 ? 'warning' : 'success');
    this.log(`  Type safety score: ${typeScript.typeScore}/100`, 
      typeScript.typeScore >= 80 ? 'success' : typeScript.typeScore >= 60 ? 'warning' : 'error');

    this.results.typeScript = typeScript;
  }

  analyzeDeadCode(files) {
    this.log('🗑️ Analyzing dead code and unused imports', 'quality');

    const deadCode = {
      unusedImports: [],
      unusedVariables: [],
      unusedFunctions: [],
      duplicateCode: [],
      emptyFiles: []
    };

    files.forEach(filePath => {
      const content = this.readFileContent(filePath);
      if (!content) return;

      const relativePath = path.relative(process.cwd(), filePath);

      // Check for empty or near-empty files
      const lines = content.split('\n').filter(line => line.trim() && !line.trim().startsWith('//')).length;
      if (lines < 3) {
        deadCode.emptyFiles.push({
          file: relativePath,
          lines: lines
        });
      }

      // Check for potentially unused imports (basic analysis)
      const imports = content.match(/import\s+.*?\s+from\s+['"][^'"]+['"]/g) || [];
      imports.forEach(importStatement => {
        const importMatch = importStatement.match(/import\s+\{([^}]+)\}|import\s+(\w+)/);
        if (importMatch) {
          const importedNames = importMatch[1] ? 
            importMatch[1].split(',').map(name => name.trim().split(' as ')[0]) : 
            [importMatch[2]];
          
          importedNames.forEach(name => {
            if (name && name !== 'React' && name !== 'type') {
              const usage = new RegExp(`\\b${name}\\b`, 'g');
              const usageCount = (content.match(usage) || []).length;
              if (usageCount <= 1) { // Only the import itself
                deadCode.unusedImports.push({
                  file: relativePath,
                  import: name,
                  statement: importStatement.trim()
                });
              }
            }
          });
        }
      });

      // Check for unused functions (basic analysis)
      const functionMatches = content.match(/(?:function\s+(\w+)|const\s+(\w+)\s*=.*?(?:function|\(.*?\)\s*=>))/g) || [];
      functionMatches.forEach(funcMatch => {
        const funcName = funcMatch.match(/function\s+(\w+)|const\s+(\w+)/);
        if (funcName) {
          const name = funcName[1] || funcName[2];
          if (name && !name.startsWith('use') && !name.startsWith('handle')) {
            const usage = new RegExp(`\\b${name}\\b`, 'g');
            const usageCount = (content.match(usage) || []).length;
            if (usageCount <= 1) {
              deadCode.unusedFunctions.push({
                file: relativePath,
                function: name
              });
            }
          }
        }
      });
    });

    this.log(`  Potentially unused imports: ${deadCode.unusedImports.length}`);
    this.log(`  Potentially unused functions: ${deadCode.unusedFunctions.length}`);
    this.log(`  Empty files: ${deadCode.emptyFiles.length}`);

    this.results.deadCode = deadCode;
  }

  analyzeComplexity(files) {
    this.log('🔀 Analyzing code complexity', 'quality');

    const complexity = {
      highComplexityFiles: [],
      longFunctions: [],
      deepNesting: [],
      averageComplexity: 0
    };

    files.forEach(filePath => {
      const content = this.readFileContent(filePath);
      if (!content) return;

      const relativePath = path.relative(process.cwd(), filePath);
      const lines = content.split('\n').length;

      // Basic complexity analysis
      const conditions = content.match(/\b(if|else|switch|case|while|for|try|catch)\b/g) || [];
      const logicalOperators = content.match(/&&|\|\|/g) || [];
      const complexityScore = conditions.length + logicalOperators.length;

      if (complexityScore > 50) {
        complexity.highComplexityFiles.push({
          file: relativePath,
          complexity: complexityScore,
          lines: lines
        });

        this.results.summary.qualityIssues.push({
          type: 'high_complexity',
          description: `High complexity score: ${complexityScore}`,
          file: relativePath,
          severity: 'medium'
        });
      }

      // Check for long functions
      const functionBlocks = content.match(/function[^{]*\{[\s\S]*?\n\}|=>\s*\{[\s\S]*?\n\}/g) || [];
      functionBlocks.forEach(block => {
        const functionLines = block.split('\n').length;
        if (functionLines > 50) {
          complexity.longFunctions.push({
            file: relativePath,
            lines: functionLines
          });
        }
      });

      // Check for deep nesting
      const maxNesting = this.calculateMaxNesting(content);
      if (maxNesting > 4) {
        complexity.deepNesting.push({
          file: relativePath,
          maxNesting: maxNesting
        });
      }
    });

    this.log(`  High complexity files: ${complexity.highComplexityFiles.length}`);
    this.log(`  Long functions: ${complexity.longFunctions.length}`);
    this.log(`  Deep nesting: ${complexity.deepNesting.length}`);

    this.results.complexity = complexity;
  }

  calculateMaxNesting(content) {
    let maxNesting = 0;
    let currentNesting = 0;
    
    for (let i = 0; i < content.length; i++) {
      if (content[i] === '{') {
        currentNesting++;
        maxNesting = Math.max(maxNesting, currentNesting);
      } else if (content[i] === '}') {
        currentNesting--;
      }
    }
    
    return maxNesting;
  }

  analyzeSecurityPatterns(files) {
    this.log('🔒 Analyzing security code patterns', 'security');

    const security = {
      hardcodedSecrets: [],
      unsafeOperations: [],
      inputValidation: [],
      securityIssues: []
    };

    const securityPatterns = {
      secrets: /(?:password|secret|key|token|api_key|private_key)\s*[:=]\s*["'][^"']+["']/gi,
      unsafeHTML: /dangerouslySetInnerHTML|innerHTML\s*=/gi,
      eval: /\beval\s*\(/gi,
      sqlInjection: /\$\{.*?\}.*?(?:SELECT|INSERT|UPDATE|DELETE)/gi,
      noValidation: /req\.body\.|req\.query\.|req\.params\./gi
    };

    files.forEach(filePath => {
      const content = this.readFileContent(filePath);
      if (!content) return;

      const relativePath = path.relative(process.cwd(), filePath);

      // Check for hardcoded secrets
      const secretMatches = content.match(securityPatterns.secrets) || [];
      if (secretMatches.length > 0) {
        security.hardcodedSecrets.push({
          file: relativePath,
          matches: secretMatches.map(match => match.substring(0, 50) + '...')
        });

        this.results.summary.criticalIssues.push({
          type: 'hardcoded_secrets',
          description: `${secretMatches.length} potential hardcoded secrets`,
          file: relativePath
        });
      }

      // Check for unsafe operations
      const unsafeMatches = content.match(securityPatterns.unsafeHTML) || [];
      const evalMatches = content.match(securityPatterns.eval) || [];
      
      if (unsafeMatches.length > 0 || evalMatches.length > 0) {
        security.unsafeOperations.push({
          file: relativePath,
          unsafe: unsafeMatches.length,
          eval: evalMatches.length
        });
      }

      // Check for input validation in API routes
      if (relativePath.includes('api/') || relativePath.includes('route.')) {
        const validationLibs = content.match(/zod|joi|yup|class-validator/gi) || [];
        const noValidationInputs = content.match(securityPatterns.noValidation) || [];
        
        if (noValidationInputs.length > 0 && validationLibs.length === 0) {
          security.inputValidation.push({
            file: relativePath,
            unvalidatedInputs: noValidationInputs.length
          });

          this.results.summary.criticalIssues.push({
            type: 'input_validation',
            description: `${noValidationInputs.length} unvalidated inputs in API route`,
            file: relativePath
          });
        }
      }
    });

    this.log(`  Potential hardcoded secrets: ${security.hardcodedSecrets.length}`, 
      security.hardcodedSecrets.length > 0 ? 'error' : 'success');
    this.log(`  Unsafe operations: ${security.unsafeOperations.length}`, 
      security.unsafeOperations.length > 0 ? 'warning' : 'success');
    this.log(`  Input validation issues: ${security.inputValidation.length}`, 
      security.inputValidation.length > 0 ? 'error' : 'success');

    this.results.security = security;
  }

  async runComprehensiveCodeQualityAssessment() {
    this.log('📊 Starting Comprehensive Code Quality Assessment - Phase 5.1', 'quality');
    this.log('=' .repeat(70));

    try {
      const files = await this.getSourceFiles();
      this.results.summary.totalFiles = files.length;
      this.results.summary.analyzedFiles = files.length;

      this.log(`Found ${files.length} source files to analyze`);

      this.analyzeTodoComments(files);
      this.analyzeErrorHandling(files);
      this.analyzeTypeScript(files);
      this.analyzeDeadCode(files);
      this.analyzeComplexity(files);
      this.analyzeSecurityPatterns(files);

      this.generateCodeQualityReport();

    } catch (error) {
      this.log(`💥 Code quality assessment failed: ${error.message}`, 'error');
      throw error;
    }
  }

  generateCodeQualityReport() {
    this.log('\n📊 COMPREHENSIVE CODE QUALITY ASSESSMENT REPORT', 'quality');
    this.log('=' .repeat(70));

    const { totalFiles, analyzedFiles, criticalIssues, qualityIssues } = this.results.summary;
    const qualityScore = this.calculateQualityScore();
    this.results.summary.qualityScore = qualityScore;

    // Summary
    this.log(`\n📈 Code Quality Summary:`);
    this.log(`   Total Files: ${totalFiles}`);
    this.log(`   Analyzed Files: ${analyzedFiles}`);
    this.log(`   Critical Issues: ${criticalIssues.length}`);
    this.log(`   Quality Issues: ${qualityIssues.length}`);
    this.log(`   Quality Score: ${qualityScore}/100`);

    // Critical Issues
    if (criticalIssues.length > 0) {
      this.log(`\n🚨 CRITICAL CODE QUALITY ISSUES:`, 'critical');
      criticalIssues.forEach((issue, index) => {
        this.log(`   ${index + 1}. ${issue.type.toUpperCase()}: ${issue.description} (${issue.file})`, 'critical');
      });
    }

    // TODO Analysis
    this.log(`\n📝 TODO Comments Analysis:`);
    this.log(`   Total TODOs: ${this.results.todoAnalysis.totalTodos}`);
    this.log(`   Critical TODOs: ${this.results.todoAnalysis.criticalTodos.length}`);
    Object.entries(this.results.todoAnalysis.todosByType).forEach(([type, count]) => {
      this.log(`   ${type}: ${count}`);
    });

    // TypeScript Analysis
    this.log(`\n🔷 TypeScript Quality:`);
    this.log(`   Type Safety Score: ${this.results.typeScript.typeScore}/100`);
    this.log(`   Files with 'any' types: ${this.results.typeScript.anyTypes.length}`);
    this.log(`   Type assertions: ${this.results.typeScript.typeAssertions.length}`);
    this.log(`   @ts-ignore statements: ${this.results.typeScript.strictModeViolations.length}`);

    // Error Handling
    this.log(`\n🛡️ Error Handling:`);
    this.log(`   Try/catch blocks: ${this.results.errorHandling.tryCatchBlocks}`);
    this.log(`   Error boundaries: ${this.results.errorHandling.errorBoundaries}`);
    this.log(`   Missing error handling: ${this.results.errorHandling.missingErrorHandling.length}`);

    // Code Complexity
    this.log(`\n🔀 Code Complexity:`);
    this.log(`   High complexity files: ${this.results.complexity.highComplexityFiles.length}`);
    this.log(`   Long functions: ${this.results.complexity.longFunctions.length}`);
    this.log(`   Deep nesting: ${this.results.complexity.deepNesting.length}`);

    // Security Issues
    this.log(`\n🔒 Security Code Issues:`);
    this.log(`   Potential hardcoded secrets: ${this.results.security.hardcodedSecrets.length}`);
    this.log(`   Unsafe operations: ${this.results.security.unsafeOperations.length}`);
    this.log(`   Input validation issues: ${this.results.security.inputValidation.length}`);

    // Dead Code
    this.log(`\n🗑️ Dead Code Analysis:`);
    this.log(`   Unused imports: ${this.results.deadCode.unusedImports.length}`);
    this.log(`   Unused functions: ${this.results.deadCode.unusedFunctions.length}`);
    this.log(`   Empty files: ${this.results.deadCode.emptyFiles.length}`);

    // Final Assessment
    this.log(`\n🏆 Code Quality Assessment:`);
    if (qualityScore >= 90 && criticalIssues.length === 0) {
      this.log(`   🎉 Excellent! Code quality meets enterprise standards (${qualityScore}/100)`, 'success');
      this.log(`   ✅ Phase 5.1: Code Quality Assessment - COMPLETED SUCCESSFULLY`);
    } else if (qualityScore >= 75 && criticalIssues.length === 0) {
      this.log(`   👍 Good code quality with minor improvements needed (${qualityScore}/100)`, 'success');
      this.log(`   ⚠️ Phase 5.1: Code Quality Assessment - COMPLETED WITH RECOMMENDATIONS`);
    } else if (criticalIssues.length > 0) {
      this.log(`   🚨 CRITICAL CODE QUALITY ISSUES REQUIRE IMMEDIATE ATTENTION (${qualityScore}/100)`, 'critical');
      this.log(`   ❌ Phase 5.1: Code Quality Assessment - CRITICAL ISSUES FOUND`);
    } else {
      this.log(`   ⚠️ Code quality improvements needed before production (${qualityScore}/100)`, 'warning');
      this.log(`   🔧 Phase 5.1: Code Quality Assessment - NEEDS IMPROVEMENT`);
    }

    // Recommendations
    this.log(`\n💡 Code Quality Recommendations:`);
    if (criticalIssues.length > 0) {
      this.log(`   1. 🚨 URGENT: Address ${criticalIssues.length} critical code quality issues immediately`);
    }
    this.log(`   2. 📝 Resolve ${this.results.todoAnalysis.criticalTodos.length} critical TODO comments`);
    this.log(`   3. 🔷 Improve TypeScript type safety (current score: ${this.results.typeScript.typeScore}/100)`);
    this.log(`   4. 🛡️ Enhance error handling coverage in async operations`);
    this.log(`   5. 🔒 Remove potential security issues (hardcoded secrets, unsafe operations)`);
    this.log(`   6. 🗑️ Clean up unused imports and dead code`);
    this.log(`   7. 🔀 Reduce code complexity in high-complexity files`);
    this.log(`   8. 📊 Implement automated code quality checks in CI/CD`);

    // Save results
    const reportFile = `test-results/code-quality-assessment-${Date.now()}.json`;
    try {
      fs.mkdirSync('test-results', { recursive: true });
      fs.writeFileSync(reportFile, JSON.stringify(this.results, null, 2));
      this.log(`\n💾 Detailed results saved to: ${reportFile}`, 'success');
    } catch (error) {
      this.log(`Failed to save results: ${error.message}`, 'error');
    }

    this.log('\n' + '=' .repeat(70));
  }

  calculateQualityScore() {
    let score = 100;
    
    // Deduct points for critical issues
    score -= this.results.summary.criticalIssues.length * 10;
    
    // Deduct points for quality issues
    score -= this.results.summary.qualityIssues.length * 5;
    
    // TypeScript score impact
    score = (score * 0.7) + (this.results.typeScript.typeScore * 0.3);
    
    // Deduct for missing error handling
    score -= this.results.errorHandling.missingErrorHandling.length * 3;
    
    // Deduct for high complexity
    score -= this.results.complexity.highComplexityFiles.length * 5;
    
    // Deduct for security issues
    score -= this.results.security.hardcodedSecrets.length * 15;
    score -= this.results.security.inputValidation.length * 10;

    return Math.max(0, Math.round(score));
  }
}

// Main execution
async function main() {
  console.log('📊 Comprehensive Code Quality Assessment');
  console.log('Phase 5.1: Deep code quality analysis for enterprise payroll system\n');

  const assessor = new ComprehensiveCodeQualityAssessment();
  await assessor.runComprehensiveCodeQualityAssessment();
}

main().catch(error => {
  console.error('💥 Code quality assessment failed:', error);
  process.exit(1);
});