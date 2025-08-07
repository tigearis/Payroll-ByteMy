#!/usr/bin/env node

/**
 * 🔄 CONSOLE LOGGING MIGRATION SCRIPT
 * 
 * Automated migration tool to replace console statements with structured logging.
 * Processes files based on priority (security, webhooks, business logic, components).
 * 
 * Usage:
 *   node scripts/migrate-logging.js --file path/to/file.ts
 *   node scripts/migrate-logging.js --priority high
 *   node scripts/migrate-logging.js --dry-run --all
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Priority levels based on analysis
const MIGRATION_PRIORITIES = {
  critical: [
    'app/api/webhooks/clerk/route.ts',
    'lib/permissions/hierarchical-permissions.ts',
    'lib/apollo/links/auth-link.ts',
  ],
  high: [
    'domains/payrolls/components/advanced-payroll-scheduler.tsx',
    'hooks/use-payroll-versioning.ts',
    'domains/billing/services/tier1-billing-engine.ts',
  ],
  medium: [
    'app/api/',
    'domains/',
    'lib/',
    'hooks/',
  ],
  low: [
    'components/',
    'utils/',
  ],
};

// Console pattern matching
const CONSOLE_PATTERNS = [
  {
    // Error patterns: console.error("❌ message", data)
    regex: /console\.error\(\s*["'`]([❌]?\s*[^"'`]+)["'`]\s*,?\s*([^)]*)\s*\)/g,
    replacement: (match, message, data) => {
      const cleanMessage = message.replace(/^❌\s*/, '');
      const loggerCall = data.trim() 
        ? `logger.error("${cleanMessage}", { metadata: ${data} })` 
        : `logger.error("${cleanMessage}")`;
      return `// Migrated from console.error\n${loggerCall}`;
    },
    imports: ['logger'],
  },
  {
    // Success patterns: console.log("✅ message", data)  
    regex: /console\.log\(\s*["'`]([✅]?\s*[^"'`]+)["'`]\s*,?\s*([^)]*)\s*\)/g,
    replacement: (match, message, data) => {
      const cleanMessage = message.replace(/^✅\s*/, '');
      const loggerCall = data.trim()
        ? `logger.info("${cleanMessage}", { metadata: ${data} })`
        : `logger.info("${cleanMessage}")`;
      return `// Migrated from console.log\n${loggerCall}`;
    },
    imports: ['logger'],
  },
  {
    // Warning patterns: console.warn("⚠️ message", data)
    regex: /console\.warn\(\s*["'`]([⚠️]?\s*[^"'`]+)["'`]\s*,?\s*([^)]*)\s*\)/g,
    replacement: (match, message, data) => {
      const cleanMessage = message.replace(/^⚠️\s*/, '');
      const loggerCall = data.trim()
        ? `logger.warn("${cleanMessage}", { metadata: ${data} })`
        : `logger.warn("${cleanMessage}")`;
      return `// Migrated from console.warn\n${loggerCall}`;
    },
    imports: ['logger'],
  },
  {
    // Debug patterns: console.log("🔍 DEBUG_NAMESPACE: message", data)
    regex: /console\.log\(\s*["'`]([🔍🎯]?\s*[A-Z_]*DEBUG[^"'`]+)["'`]\s*,?\s*([^)]*)\s*\)/g,
    replacement: (match, message, data) => {
      // Extract namespace from DEBUG pattern
      const namespaceMatch = message.match(/([A-Z_]+)_DEBUG:/);
      const namespace = namespaceMatch ? namespaceMatch[1].toLowerCase() : 'debug';
      const cleanMessage = message.replace(/^[🔍🎯]\s*/, '').replace(/[A-Z_]+_DEBUG:\s*/, '');
      
      const context = data.trim() 
        ? `{ namespace: "${namespace}", metadata: ${data} }`
        : `{ namespace: "${namespace}" }`;
      
      return `// Migrated from debug console.log\nlogger.debug("${cleanMessage}", ${context})`;
    },
    imports: ['logger'],
  },
  {
    // Scheduler-specific patterns
    regex: /console\.log\(\s*["'`]([^"'`]*SCHEDULER[^"'`]+)["'`]\s*,?\s*([^)]*)\s*\)/g,
    replacement: (match, message, data) => {
      const cleanMessage = message.replace(/^[✅❌⚠️🔍🎯]\s*/, '').replace(/SCHEDULER_DEBUG:\s*/, '');
      const context = data.trim()
        ? `{ namespace: "payroll_scheduler", metadata: ${data} }`
        : `{ namespace: "payroll_scheduler" }`;
      return `// Migrated from scheduler console.log\nlogger.debug("${cleanMessage}", ${context})`;
    },
    imports: ['logger'],
  },
];

// Import patterns to add
const IMPORT_PATTERNS = {
  logger: `import { logger } from '@/lib/logging/enterprise-logger';`,
  createLogger: `import { createLogger } from '@/lib/logging/enterprise-logger';`,
  migrationConsole: `import { migrationConsole as console } from '@/lib/logging/migration-utils';`,
};

class LoggingMigrator {
  constructor(options = {}) {
    this.dryRun = options.dryRun || false;
    this.verbose = options.verbose || false;
    this.stats = {
      filesProcessed: 0,
      statementsReplaced: 0,
      importsAdded: 0,
      errors: [],
    };
  }

  /**
   * Migrate a single file
   */
  migrateFile(filePath) {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const originalContent = fs.readFileSync(filePath, 'utf8');
      let content = originalContent;
      let hasChanges = false;
      const requiredImports = new Set();

      // Apply each console pattern
      for (const pattern of CONSOLE_PATTERNS) {
        const matches = [...content.matchAll(pattern.regex)];
        if (matches.length > 0) {
          hasChanges = true;
          this.stats.statementsReplaced += matches.length;
          
          // Add required imports
          pattern.imports.forEach(imp => requiredImports.add(imp));
          
          // Replace matches
          content = content.replace(pattern.regex, pattern.replacement);
          
          if (this.verbose) {
            console.log(`  Found ${matches.length} matches for pattern in ${filePath}`);
          }
        }
      }

      // Add missing imports
      if (requiredImports.size > 0 && hasChanges) {
        content = this.addImports(content, Array.from(requiredImports));
        this.stats.importsAdded += requiredImports.size;
      }

      // Write changes
      if (hasChanges) {
        if (!this.dryRun) {
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`✅ Migrated: ${filePath} (${this.stats.statementsReplaced} statements)`);
        } else {
          console.log(`🔍 Would migrate: ${filePath} (${this.stats.statementsReplaced} statements)`);
        }
      } else {
        if (this.verbose) {
          console.log(`⚪ No changes: ${filePath}`);
        }
      }

      this.stats.filesProcessed++;
      
    } catch (error) {
      this.stats.errors.push({ file: filePath, error: error.message });
      console.error(`❌ Error migrating ${filePath}: ${error.message}`);
    }
  }

  /**
   * Add import statements to file content
   */
  addImports(content, imports) {
    const existingImports = content.match(/^import\s+.*?;$/gm) || [];
    const lastImportIndex = existingImports.length > 0 
      ? content.lastIndexOf(existingImports[existingImports.length - 1]) + existingImports[existingImports.length - 1].length
      : 0;

    // Check which imports are already present
    const newImports = imports.filter(imp => {
      const importStatement = IMPORT_PATTERNS[imp];
      return !content.includes(importStatement.split(' from ')[0].split(' ').slice(-1)[0]);
    });

    if (newImports.length === 0) {
      return content;
    }

    // Build import statements
    const importStatements = newImports.map(imp => IMPORT_PATTERNS[imp]).join('\n') + '\n\n';

    // Insert imports after existing imports or at the beginning
    if (lastImportIndex > 0) {
      return content.slice(0, lastImportIndex) + '\n' + importStatements + content.slice(lastImportIndex + 1);
    } else {
      return importStatements + content;
    }
  }

  /**
   * Get files by priority level
   */
  getFilesByPriority(priority) {
    const patterns = MIGRATION_PRIORITIES[priority] || [];
    const files = [];

    for (const pattern of patterns) {
      if (pattern.endsWith('.ts') || pattern.endsWith('.tsx')) {
        // Specific file
        if (fs.existsSync(pattern)) {
          files.push(pattern);
        }
      } else {
        // Directory pattern
        if (fs.existsSync(pattern)) {
          const dirFiles = this.getFilesInDirectory(pattern, /\.(ts|tsx)$/);
          files.push(...dirFiles);
        }
      }
    }

    return files;
  }

  /**
   * Recursively get files in directory
   */
  getFilesInDirectory(dir, pattern) {
    const files = [];
    
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          files.push(...this.getFilesInDirectory(fullPath, pattern));
        } else if (entry.isFile() && pattern.test(entry.name)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Ignore permission errors
    }

    return files;
  }

  /**
   * Print migration statistics
   */
  printStats() {
    console.log('\n📊 MIGRATION STATISTICS');
    console.log('========================');
    console.log(`Files processed: ${this.stats.filesProcessed}`);
    console.log(`Console statements replaced: ${this.stats.statementsReplaced}`);
    console.log(`Import statements added: ${this.stats.importsAdded}`);
    
    if (this.stats.errors.length > 0) {
      console.log(`\n❌ Errors encountered: ${this.stats.errors.length}`);
      for (const error of this.stats.errors) {
        console.log(`  - ${error.file}: ${error.error}`);
      }
    }

    if (this.dryRun) {
      console.log('\n🔍 This was a dry run - no files were modified');
    }
  }
}

// Command line interface
function main() {
  const args = process.argv.slice(2);
  const options = {
    dryRun: args.includes('--dry-run'),
    verbose: args.includes('--verbose'),
  };

  const migrator = new LoggingMigrator(options);

  console.log('🔄 CONSOLE LOGGING MIGRATION TOOL');
  console.log('==================================');
  
  if (options.dryRun) {
    console.log('🔍 DRY RUN MODE - No files will be modified');
  }
  
  console.log('');

  // Handle different execution modes
  const fileIndex = args.findIndex(arg => arg === '--file');
  const priorityIndex = args.findIndex(arg => arg === '--priority');
  
  if (fileIndex !== -1 && args[fileIndex + 1]) {
    // Single file migration
    const filePath = args[fileIndex + 1];
    console.log(`Migrating single file: ${filePath}`);
    migrator.migrateFile(filePath);
    
  } else if (priorityIndex !== -1 && args[priorityIndex + 1]) {
    // Priority-based migration
    const priority = args[priorityIndex + 1];
    console.log(`Migrating files with priority: ${priority}`);
    
    const files = migrator.getFilesByPriority(priority);
    console.log(`Found ${files.length} files to process`);
    
    for (const file of files) {
      migrator.migrateFile(file);
    }
    
  } else if (args.includes('--all')) {
    // Migrate all files
    console.log('Migrating all TypeScript files...');
    
    const allFiles = migrator.getFilesInDirectory('.', /\.(ts|tsx)$/);
    const filteredFiles = allFiles.filter(file => 
      !file.includes('node_modules') && 
      !file.includes('.next') && 
      !file.includes('.git') &&
      !file.includes('dist')
    );
    
    console.log(`Found ${filteredFiles.length} files to process`);
    
    for (const file of filteredFiles) {
      migrator.migrateFile(file);
    }
    
  } else {
    // Show help
    console.log('Usage:');
    console.log('  node scripts/migrate-logging.js --file path/to/file.ts');
    console.log('  node scripts/migrate-logging.js --priority critical|high|medium|low');
    console.log('  node scripts/migrate-logging.js --all');
    console.log('');
    console.log('Options:');
    console.log('  --dry-run    Show what would be changed without modifying files');
    console.log('  --verbose    Show detailed progress information');
    console.log('');
    console.log('Priority levels:');
    console.log('  critical: Security-critical files (webhooks, auth, permissions)');
    console.log('  high:     Business-critical files (scheduler, billing, versioning)');
    console.log('  medium:   API routes, domain services, libraries');
    console.log('  low:      Components and utilities');
    return;
  }

  migrator.printStats();
  
  if (migrator.stats.errors.length > 0) {
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { LoggingMigrator };