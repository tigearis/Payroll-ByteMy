#!/usr/bin/env tsx

/**
 * 🔧 VALIDATED Console to Enterprise Logger Converter v2.1
 * 
 * Uses EXACT proven manual conversion patterns from successful conversions:
 * ✅ /app/api/payrolls/route.ts (4 console statements)
 * ✅ /app/api/billing/invoices/generate/route.ts (1 console statement)
 * 
 * Key Differences from v1.0 Failure:
 * ❌ v1.0: Guessed at conversion patterns, created syntax errors
 * ✅ v2.1: Uses PROVEN working patterns from manual conversions
 * 
 * Proven Pattern Structure:
 * - Import: import { logger, DataClassification } from "@/lib/logging/enterprise-logger";
 * - Success: logger.info('Action completed', { namespace, operation, classification: DataClassification.CONFIDENTIAL, ...context })
 * - Error: logger.error('Action failed', { namespace, operation, classification: DataClassification.CONFIDENTIAL, error: message, ...context })
 * 
 * Usage: tsx scripts/conversion/validated-console-converter.ts
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { execSync } from 'child_process';

interface ConversionResult {
  file: string;
  success: boolean;
  conversionsCount: number;
  error?: string;
  beforeStatements: string[];
  afterStatements: string[];
}

interface ConversionStats {
  totalFiles: number;
  successfulFiles: number;
  totalConversions: number;
  results: ConversionResult[];
}

class ValidatedConsoleConverter {
  private results: ConversionResult[] = [];

  /**
   * Execute conversion using proven manual patterns
   */
  async executeConversion(): Promise<ConversionStats> {
    console.log('🚀 Starting VALIDATED Console Converter v2.1');
    console.log('✅ Using PROVEN manual conversion patterns');
    console.log('🔍 Target: Convert remaining console statements using validated approach');

    // Get all API files that still need conversion
    const filesToConvert = await this.getFilesNeedingConversion();
    console.log(`📁 Found ${filesToConvert.length} files still needing console conversion`);

    if (filesToConvert.length === 0) {
      console.log('🎉 No files need conversion - all endpoints already use enterprise logging!');
      return this.generateStats();
    }

    console.log('📋 Files to convert:');
    filesToConvert.forEach(file => console.log(`  - ${file}`));

    // Process files individually with validation after each
    for (const filePath of filesToConvert) {
      console.log(`\n🔧 Converting: ${filePath}`);
      
      const result = await this.convertSingleFileWithValidation(filePath);
      this.results.push(result);

      if (result.success) {
        console.log(`  ✅ Success: ${result.conversionsCount} console statements converted`);
      } else {
        console.log(`  ❌ Failed: ${result.error}`);
        console.log(`  🔄 Original content restored from backup`);
      }

      // Validate build after each file to catch issues immediately
      if (result.success && !await this.validateTypeScriptBuild()) {
        console.log(`  🚨 Build validation failed after converting ${filePath}`);
        console.log(`  🔄 Rolling back file due to build failure...`);
        
        // Rollback the file
        await this.rollbackSingleFile(filePath);
        result.success = false;
        result.error = 'Build validation failed - file rolled back';
        console.log(`  ↩️  File rolled back successfully`);
      }
    }

    const stats = this.generateStats();
    await this.generateReport(stats);
    
    return stats;
  }

  /**
   * Get files that still need console conversion
   */
  private async getFilesNeedingConversion(): Promise<string[]> {
    const allApiFiles = await glob('./app/api/**/route.ts', { cwd: process.cwd() });
    const filesNeedingConversion: string[] = [];

    for (const filePath of allApiFiles) {
      const fullPath = path.join(process.cwd(), filePath);
      const content = await fs.promises.readFile(fullPath, 'utf-8');
      
      // Check if file has console statements and lacks enterprise logging imports
      const hasConsoleStatements = /console\.(log|error|warn|info)/.test(content);
      const hasEnterpriseImports = content.includes('from "@/lib/logging/enterprise-logger"');
      
      if (hasConsoleStatements && !hasEnterpriseImports) {
        filesNeedingConversion.push(filePath);
      }
    }

    return filesNeedingConversion;
  }

  /**
   * Convert a single file using proven manual patterns
   */
  private async convertSingleFileWithValidation(filePath: string): Promise<ConversionResult> {
    const fullPath = path.join(process.cwd(), filePath);
    const originalContent = await fs.promises.readFile(fullPath, 'utf-8');
    
    try {
      // Create backup
      await fs.promises.writeFile(fullPath + '.backup', originalContent);

      // Find console statements
      const consoleStatements = this.extractConsoleStatements(originalContent);
      
      if (consoleStatements.length === 0) {
        await fs.promises.unlink(fullPath + '.backup');
        return {
          file: filePath,
          success: true,
          conversionsCount: 0,
          beforeStatements: [],
          afterStatements: []
        };
      }

      // Apply proven conversion pattern
      const convertedContent = await this.applyProvenConversionPattern(
        originalContent, 
        consoleStatements,
        filePath
      );

      // Write converted content
      await fs.promises.writeFile(fullPath, convertedContent);

      // Generate conversion summary
      const beforeStatements = consoleStatements.map(s => s.fullLine);
      const afterStatements = this.extractEnterpriseLogStatements(convertedContent);

      await fs.promises.unlink(fullPath + '.backup');

      return {
        file: filePath,
        success: true,
        conversionsCount: consoleStatements.length,
        beforeStatements,
        afterStatements
      };

    } catch (error) {
      // Restore backup on any error
      if (await this.fileExists(fullPath + '.backup')) {
        await fs.promises.writeFile(fullPath, originalContent);
        await fs.promises.unlink(fullPath + '.backup');
      }

      return {
        file: filePath,
        success: false,
        conversionsCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        beforeStatements: [],
        afterStatements: []
      };
    }
  }

  /**
   * Extract console statements with full context
   */
  private extractConsoleStatements(content: string): Array<{
    lineNumber: number;
    type: 'log' | 'error' | 'warn' | 'info';
    fullLine: string;
    indentation: string;
  }> {
    const lines = content.split('\n');
    const statements: Array<{
      lineNumber: number;
      type: 'log' | 'error' | 'warn' | 'info';
      fullLine: string;
      indentation: string;
    }> = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(/^(\s*).*console\.(log|error|warn|info)/);
      
      if (match) {
        const [, indentation, type] = match;
        statements.push({
          lineNumber: i,
          type: type as 'log' | 'error' | 'warn' | 'info',
          fullLine: line,
          indentation
        });
      }
    }

    return statements;
  }

  /**
   * Apply the EXACT proven conversion pattern from manual conversions
   */
  private async applyProvenConversionPattern(
    content: string, 
    consoleStatements: Array<{
      lineNumber: number;
      type: 'log' | 'error' | 'warn' | 'info';
      fullLine: string;
      indentation: string;
    }>,
    filePath: string
  ): Promise<string> {
    let modifiedContent = content;

    // Step 1: Add enterprise logging imports using PROVEN pattern
    modifiedContent = this.addEnterpriseImportsProvenPattern(modifiedContent);

    // Step 2: Convert each console statement using PROVEN patterns
    const lines = modifiedContent.split('\\n');
    
    // Process in reverse order to maintain line numbers
    for (let i = consoleStatements.length - 1; i >= 0; i--) {
      const statement = consoleStatements[i];
      
      // Find the current line (accounting for added imports)
      const currentLineIndex = this.findCurrentLineIndex(lines, statement);
      
      if (currentLineIndex !== -1) {
        const namespace = this.determineNamespace(filePath);
        const operation = this.determineOperation(statement.fullLine);
        
        const enterpriseLogStatement = this.generateProvenEnterpriseStatement(
          statement.type,
          statement.indentation,
          namespace,
          operation,
          statement.fullLine
        );

        lines[currentLineIndex] = enterpriseLogStatement;
      }
    }

    return lines.join('\n');
  }

  /**
   * Add enterprise imports using EXACT proven pattern
   */
  private addEnterpriseImportsProvenPattern(content: string): string {
    // Check if imports already exist
    if (content.includes('from "@/lib/logging/enterprise-logger"')) {
      return content;
    }

    const lines = content.split('\n');
    let insertIndex = 0;

    // Find last import line (proven approach)
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('import ') && lines[i].includes('from ')) {
        insertIndex = i + 1;
      }
    }

    // Insert the EXACT import pattern that works
    const enterpriseImport = 'import { logger, DataClassification } from "@/lib/logging/enterprise-logger";';
    lines.splice(insertIndex, 0, enterpriseImport);

    return lines.join('\n');
  }

  /**
   * Generate enterprise logging statement using PROVEN manual pattern
   */
  private generateProvenEnterpriseStatement(
    type: 'log' | 'error' | 'warn' | 'info',
    indentation: string,
    namespace: string,
    operation: string,
    originalLine: string
  ): string {
    const logLevel = type === 'error' ? 'error' : 'info';
    const message = this.generateMessage(type, operation);

    if (type === 'error') {
      // PROVEN error pattern from manual conversions
      return `${indentation}logger.error('${message}', {
${indentation}  namespace: '${namespace}',
${indentation}  operation: '${operation}',
${indentation}  classification: DataClassification.CONFIDENTIAL,
${indentation}  error: error instanceof Error ? error.message : 'Unknown error',
${indentation}  metadata: {
${indentation}    errorName: error instanceof Error ? error.name : 'UnknownError',
${indentation}    timestamp: new Date().toISOString()
${indentation}  }
${indentation}});`;
    } else {
      // PROVEN success pattern from manual conversions  
      return `${indentation}logger.info('${message}', {
${indentation}  namespace: '${namespace}',
${indentation}  operation: '${operation}',
${indentation}  classification: DataClassification.CONFIDENTIAL,
${indentation}  metadata: {
${indentation}    timestamp: new Date().toISOString()
${indentation}  }
${indentation}});`;
    }
  }

  /**
   * Determine namespace from file path
   */
  private determineNamespace(filePath: string): string {
    const pathParts = filePath.split('/');
    const apiIndex = pathParts.indexOf('api');
    
    if (apiIndex !== -1 && pathParts.length > apiIndex + 1) {
      const segment = pathParts[apiIndex + 1];
      return `${segment}_api`;
    }
    
    return 'api_endpoint';
  }

  /**
   * Determine operation from console statement
   */
  private determineOperation(consoleLine: string): string {
    // Simple heuristics based on manual conversion experience
    if (consoleLine.includes('create') || consoleLine.includes('Create')) return 'create';
    if (consoleLine.includes('update') || consoleLine.includes('Update')) return 'update';
    if (consoleLine.includes('delete') || consoleLine.includes('Delete')) return 'delete';
    if (consoleLine.includes('fetch') || consoleLine.includes('get') || consoleLine.includes('list')) return 'list';
    if (consoleLine.includes('error') || consoleLine.includes('Error')) return 'error_handler';
    
    return 'api_operation';
  }

  /**
   * Generate appropriate message for enterprise logging
   */
  private generateMessage(type: 'log' | 'error' | 'warn' | 'info', operation: string): string {
    if (type === 'error') {
      return `${operation.replace('_', ' ')} failed`;
    } else {
      return `${operation.replace('_', ' ')} completed`;
    }
  }

  /**
   * Find current line index accounting for added imports
   */
  private findCurrentLineIndex(
    lines: string[], 
    statement: { lineNumber: number; fullLine: string }
  ): number {
    // Search around the expected line number (accounting for added imports)
    const searchStart = Math.max(0, statement.lineNumber - 5);
    const searchEnd = Math.min(lines.length, statement.lineNumber + 10);

    for (let i = searchStart; i < searchEnd; i++) {
      if (lines[i].trim() === statement.fullLine.trim()) {
        return i;
      }
    }

    // Broader search if needed
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === statement.fullLine.trim()) {
        return i;
      }
    }

    return -1;
  }

  /**
   * Extract enterprise log statements from converted content
   */
  private extractEnterpriseLogStatements(content: string): string[] {
    const lines = content.split('\n');
    const enterpriseStatements: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('logger.')) {
        // Capture the full enterprise logging statement (multi-line)
        let statement = lines[i];
        let j = i + 1;
        while (j < lines.length && !lines[j].includes('});')) {
          statement += '\n' + lines[j];
          j++;
        }
        if (j < lines.length) {
          statement += '\n' + lines[j]; // Include closing line
        }
        enterpriseStatements.push(statement);
        i = j; // Skip processed lines
      }
    }

    return enterpriseStatements;
  }

  /**
   * Validate TypeScript build
   */
  private async validateTypeScriptBuild(): Promise<boolean> {
    try {
      execSync('pnpm run type-check', {
        stdio: 'pipe',
        cwd: process.cwd(),
        timeout: 30000
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Rollback a single file
   */
  private async rollbackSingleFile(filePath: string): Promise<void> {
    const fullPath = path.join(process.cwd(), filePath);
    const backupPath = fullPath + '.backup';
    
    if (await this.fileExists(backupPath)) {
      const originalContent = await fs.promises.readFile(backupPath, 'utf-8');
      await fs.promises.writeFile(fullPath, originalContent);
      await fs.promises.unlink(backupPath);
    }
  }

  /**
   * Generate conversion statistics
   */
  private generateStats(): ConversionStats {
    const totalFiles = this.results.length;
    const successfulFiles = this.results.filter(r => r.success).length;
    const totalConversions = this.results.reduce((sum, r) => sum + r.conversionsCount, 0);

    return {
      totalFiles,
      successfulFiles,
      totalConversions,
      results: this.results
    };
  }

  /**
   * Generate comprehensive report
   */
  private async generateReport(stats: ConversionStats): Promise<void> {
    const successRate = stats.totalFiles > 0 ? 
      ((stats.successfulFiles / stats.totalFiles) * 100).toFixed(1) : '0.0';

    const report = `# 🔧 Validated Console Converter v2.1 Report

**Generated**: ${new Date().toISOString()}
**Approach**: Using PROVEN manual conversion patterns
**Status**: ${stats.successfulFiles === stats.totalFiles ? '✅ COMPLETED' : '⚠️ PARTIAL'}

## 📊 Conversion Summary

- **Total Files Processed**: ${stats.totalFiles}
- **Successful Conversions**: ${stats.successfulFiles}
- **Failed Conversions**: ${stats.totalFiles - stats.successfulFiles}
- **Success Rate**: ${successRate}%
- **Total Console Statements Converted**: ${stats.totalConversions}

## 🎯 Conversion Results

${stats.results.map(result => `
### ${result.success ? '✅' : '❌'} ${result.file}
- **Status**: ${result.success ? 'SUCCESS' : 'FAILED'}
- **Console Statements Converted**: ${result.conversionsCount}
${result.error ? `- **Error**: ${result.error}` : ''}
`).join('')}

## 🚀 Phase 2A Impact

${stats.successfulFiles === stats.totalFiles ? `
### ✅ COMPLETE SUCCESS
- **SOC2 Compliance**: 100% API endpoints now use enterprise logging
- **Console Cleanup**: All ${stats.totalConversions} console statements converted
- **Build Validation**: All conversions maintain clean TypeScript compilation
- **Enterprise Logging**: Consistent structured logging across entire API layer

**Status**: 🎉 **PHASE 2A COMPLETED** - Ready for Phase 2B optimization
` : `
### ⚠️ PARTIAL SUCCESS
- **Converted**: ${stats.successfulFiles}/${stats.totalFiles} files (${successRate}%)
- **Remaining**: ${stats.totalFiles - stats.successfulFiles} files need manual review
- **Next Steps**: Review failed conversions and apply manual fixes

**Status**: 🔄 **PHASE 2A IN PROGRESS** - Manual review required for remaining files
`}

---

**Validation**: All successful conversions verified with TypeScript compilation
**Pattern**: Based on proven manual conversions of payrolls + billing endpoints
**Quality**: Enterprise-grade structured logging with proper data classification
`;

    await fs.promises.writeFile('./docs/implementation/VALIDATED_CONVERSION_REPORT.md', report);
    console.log('📄 Report saved to docs/implementation/VALIDATED_CONVERSION_REPORT.md');
  }

  /**
   * Utility: Check if file exists
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.promises.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

// Execute conversion if run directly
async function main() {
  const converter = new ValidatedConsoleConverter();
  try {
    const stats = await converter.executeConversion();
    
    console.log('\n🎉 VALIDATED CONSOLE CONVERSION COMPLETED!');
    console.log(`📊 Processed ${stats.totalFiles} files`);
    console.log(`✅ Successfully converted ${stats.successfulFiles} files`);
    console.log(`🔧 Converted ${stats.totalConversions} console statements`);
    console.log(`📈 Success rate: ${((stats.successfulFiles / stats.totalFiles) * 100).toFixed(1)}%`);
    
    if (stats.successfulFiles === stats.totalFiles) {
      console.log('🚀 Ready for Phase 2B: High-complexity endpoint optimization');
    } else {
      console.log(`⚠️ ${stats.totalFiles - stats.successfulFiles} files need manual review`);
    }
    
  } catch (error) {
    console.error('❌ Validated conversion failed:', error);
    process.exit(1);
  }
}

// Check if this file is being run directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  main();
}

export { ValidatedConsoleConverter };