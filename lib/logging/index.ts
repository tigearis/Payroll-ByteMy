/**
 * 📊 LOGGING SYSTEM ENTRY POINT
 * 
 * Centralized logging configuration and exports for the Payroll Matrix application.
 * Provides enterprise-grade structured logging with SOC2 compliance.
 */

// Core logging infrastructure
export {
  EnterpriseLogger,
  ContextualLogger,
  logger,
  createLogger,
  LogLevel,
  DataClassification,
  type LogContext,
  type LogEntry,
  type LoggerConfig,
  LoggingPatterns,
} from './enterprise-logger';

// Migration utilities for console.log replacement
export {
  configureMigration,
  structuredLog,
  structuredError,
  structuredWarn,
  createComponentLogger,
  createOperationLogger,
  createWebhookLogger,
  createGraphQLLogger,
  createSchedulerLogger,
  migrationConsole,
  timeOperation,
  auditLog,
  securityLog,
  migrationStats,
  MigrationMode,
} from './migration-utils';

// Default logger instances for common use cases
import { createLogger, DataClassification } from './enterprise-logger';

// Pre-configured loggers for common scenarios
export const schedulerLogger = createLogger({
  namespace: 'payroll_scheduler',
  component: 'advanced_payroll_scheduler',
  classification: DataClassification.INTERNAL,
});

export const authLogger = createLogger({
  namespace: 'authentication',
  classification: DataClassification.CONFIDENTIAL,
});

export const graphqlLogger = createLogger({
  namespace: 'graphql_operations',
  classification: DataClassification.INTERNAL,
});

export const billingLogger = createLogger({
  namespace: 'billing_engine',
  classification: DataClassification.CONFIDENTIAL,
});

export const auditLogger = createLogger({
  namespace: 'audit_trail',
  classification: DataClassification.RESTRICTED,
});

// Environment-based configuration
export const loggingConfig = {
  development: {
    level: 'debug',
    enableConsole: true,
    enableFile: false,
    preserveEmojiPatterns: true,
    migrationMode: 'dual_output',
  },
  staging: {
    level: 'info',
    enableConsole: true,
    enableFile: true,
    preserveEmojiPatterns: false,
    migrationMode: 'structured_only',
  },
  production: {
    level: 'info',
    enableConsole: false,
    enableFile: true,
    enableRemote: true,
    preserveEmojiPatterns: false,
    migrationMode: 'structured_only',
    sensitiveDataRedaction: true,
    auditLogging: true,
  },
};

// Initialize logging based on environment
const currentEnv = process.env.NODE_ENV as keyof typeof loggingConfig || 'development';
const envConfig = loggingConfig[currentEnv];

// Development helpers
if (process.env.NODE_ENV === 'development') {
  // Import migration stats dynamically to avoid module loading issues
  import('./migration-utils').then(({ migrationStats }) => {
    console.log('🔧 Logging System Initialized');
    console.log(`📊 Migration Progress: ${migrationStats.getMigrationProgress()}%`);
    console.log(`📋 Console statements remaining: ${migrationStats.getTotalConsoleStatements() - migrationStats.getReplacedStatements()}`);
  }).catch(() => {
    console.log('🔧 Logging System Initialized');
  });
}

/**
 * Quick start guide for migrating console statements:
 * 
 * Before:
 * console.log("✅ Payroll updated successfully", { payrollId, changes });
 * console.error("❌ GraphQL error:", error);
 * console.warn("⚠️ Performance issue detected");
 * 
 * After:
 * import { logger, schedulerLogger } from '@/lib/logging';
 * 
 * logger.info("Payroll updated successfully", { payrollId, changes });
 * logger.error("GraphQL operation failed", { error: error.message });
 * logger.warn("Performance issue detected", { operation, duration });
 * 
 * // Or use pre-configured loggers:
 * schedulerLogger.info("Schedule updated", { payrollId });
 * authLogger.error("Authentication failed", { userId, reason });
 */