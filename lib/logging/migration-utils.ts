/**
 * 🔄 CONSOLE LOGGING MIGRATION UTILITIES
 * 
 * Tools to help migrate from 1,836 console statements to structured logging
 * while maintaining existing debug patterns and developer experience.
 * 
 * Features:
 * - Backward compatibility with existing console patterns
 * - Gradual migration support
 * - Development-friendly debug experience
 * - Production-ready structured logging
 */

import { logger, LogContext, DataClassification, createLogger } from './enterprise-logger';

// Migration mode configuration
export enum MigrationMode {
  CONSOLE_ONLY = 'console_only',      // Original console.log behavior
  DUAL_OUTPUT = 'dual_output',        // Both console and structured logging
  STRUCTURED_ONLY = 'structured_only' // Only structured logging
}

// Migration configuration
interface MigrationConfig {
  mode: MigrationMode;
  namespaceMapping: Record<string, string>;
  enableDeprecationWarnings: boolean;
  preserveEmojiPatterns: boolean;
}

// Default migration config
const DEFAULT_MIGRATION_CONFIG: MigrationConfig = {
  mode: process.env.NODE_ENV === 'production' 
    ? MigrationMode.STRUCTURED_ONLY 
    : MigrationMode.DUAL_OUTPUT,
  namespaceMapping: {
    'SCHEDULER_DEBUG': 'payroll_scheduler',
    'WEBHOOK_DEBUG': 'webhook_processing',
    'AUTH_DEBUG': 'authentication',
    'GRAPHQL_DEBUG': 'graphql_operations',
    'BILLING_DEBUG': 'billing_engine',
  },
  enableDeprecationWarnings: process.env.NODE_ENV === 'development',
  preserveEmojiPatterns: process.env.NODE_ENV === 'development',
};

let migrationConfig = { ...DEFAULT_MIGRATION_CONFIG };

/**
 * Configure migration behavior
 */
export function configureMigration(config: Partial<MigrationConfig>): void {
  migrationConfig = { ...migrationConfig, ...config };
}

/**
 * Emoji pattern recognition for existing console statements
 */
const EMOJI_PATTERNS = {
  '✅': { level: 'info', category: 'success' },
  '❌': { level: 'error', category: 'failure' },
  '⚠️': { level: 'warn', category: 'warning' },
  '🔄': { level: 'info', category: 'processing' },
  '🔍': { level: 'debug', category: 'inspection' },
  '🎯': { level: 'debug', category: 'debug_namespace' },
  '🔐': { level: 'info', category: 'security', classification: DataClassification.CONFIDENTIAL },
  '📊': { level: 'info', category: 'metrics' },
  '🚀': { level: 'info', category: 'startup' },
  '🏗️': { level: 'info', category: 'build' },
  '📝': { level: 'debug', category: 'documentation' },
  '💡': { level: 'info', category: 'insight' },
  '🔧': { level: 'debug', category: 'configuration' },
  '📋': { level: 'debug', category: 'data_inspection' },
  '🎭': { level: 'debug', category: 'role_permissions' },
  '🌱': { level: 'info', category: 'initialization' },
  '🛡️': { level: 'info', category: 'security_validation' },
  '🔒': { level: 'info', category: 'access_control' },
};

/**
 * Extract namespace from debug patterns like "SCHEDULER_DEBUG:", "🔍 BILLING:"
 */
function extractNamespace(message: string): string | undefined {
  // Pattern: "🎯 NAMESPACE_DEBUG:" or "NAMESPACE_DEBUG:"
  const namespaceMatch = message.match(/(?:🎯\s*)?([A-Z_]+)_DEBUG:/);
  if (namespaceMatch) {
    const namespace = namespaceMatch[1].toLowerCase();
    return migrationConfig.namespaceMapping[`${namespaceMatch[1]}_DEBUG`] || namespace;
  }

  // Pattern: "🔍 NAMESPACE:" 
  const inspectionMatch = message.match(/🔍\s*([A-Z_]+):/);
  if (inspectionMatch) {
    return inspectionMatch[1].toLowerCase();
  }

  return undefined;
}

/**
 * Parse emoji-based console message to extract structured information
 */
function parseConsoleMessage(message: string): {
  emoji?: string | undefined;
  cleanMessage: string;
  level: string;
  category: string;
  namespace?: string | undefined;
  classification?: DataClassification | undefined;
} {
  // Extract emoji from start of message
  const emojiMatch = message.match(/^([✅❌⚠️🔄🔍🎯🔐📊🚀🏗️📝💡🔧📋🎭🌱🛡️🔒])\s*/);
  const emoji = emojiMatch?.[1];
  
  // Get emoji pattern info
  const emojiInfo = emoji ? EMOJI_PATTERNS[emoji as keyof typeof EMOJI_PATTERNS] : { level: 'debug', category: 'general' };
  
  // Extract namespace
  const namespace = extractNamespace(message);
  
  // Clean message (remove emoji and namespace prefixes)
  let cleanMessage = message;
  if (emoji) {
    cleanMessage = cleanMessage.replace(/^[✅❌⚠️🔄🔍🎯🔐📊🚀🏗️📝💡🔧📋🎭🌱🛡️🔒]\s*/, '');
  }
  if (namespace) {
    cleanMessage = cleanMessage.replace(/[A-Z_]+_DEBUG:\s*/, '');
    cleanMessage = cleanMessage.replace(/🔍\s*[A-Z_]+:\s*/, '');
  }

  return {
    emoji: emoji || undefined,
    cleanMessage,
    level: emojiInfo.level || 'debug',
    category: emojiInfo.category || 'general',
    namespace: namespace || undefined,
    classification: ('classification' in emojiInfo) ? emojiInfo.classification as DataClassification : undefined,
  };
}

/**
 * Enhanced console.log replacement with structured logging
 */
export function structuredLog(message: string, data?: any, context: LogContext = {}): void {
  const parsed = parseConsoleMessage(message);
  const logContext: LogContext = {
    ...context,
    ...(parsed.namespace && { namespace: parsed.namespace }),
    ...(context.namespace && { namespace: context.namespace }),
    ...(parsed.classification && { classification: parsed.classification }),
    ...(context.classification && { classification: context.classification }),
    metadata: data ? { ...context.metadata, ...data } : context.metadata,
  };

  // Add deprecation warning in development
  if (migrationConfig.enableDeprecationWarnings && migrationConfig.mode !== MigrationMode.STRUCTURED_ONLY) {
    const stackTrace = new Error().stack;
    const caller = stackTrace?.split('\n')[2]?.trim();
    logger.debug('Console statement needs migration', {
      namespace: 'migration',
      metadata: {
        original_message: message,
        caller: caller,
        suggested_replacement: `logger.${parsed.level}("${parsed.cleanMessage}", context)`,
      },
    });
  }

  // Output based on migration mode
  switch (migrationConfig.mode) {
    case MigrationMode.CONSOLE_ONLY:
      // Original console behavior
      if (data) {
        console.log(message, data);
      } else {
        console.log(message);
      }
      break;

    case MigrationMode.DUAL_OUTPUT:
      // Both console and structured logging
      if (data) {
        console.log(message, data);
      } else {
        console.log(message);
      }
      // Fall through to structured logging

    case MigrationMode.STRUCTURED_ONLY:
      // Only structured logging
      switch (parsed.level) {
        case 'error':
          logger.error(parsed.cleanMessage, logContext);
          break;
        case 'warn':
          logger.warn(parsed.cleanMessage, logContext);
          break;
        case 'info':
          logger.info(parsed.cleanMessage, logContext);
          break;
        case 'debug':
        default:
          logger.debug(parsed.cleanMessage, logContext);
          break;
      }
      break;
  }
}

/**
 * Enhanced console.error replacement
 */
export function structuredError(message: string, error?: any, context: LogContext = {}): void {
  const logContext: LogContext = {
    ...context,
    classification: context.classification || DataClassification.INTERNAL,
    auditRequired: true,
    metadata: {
      ...context.metadata,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack?.substring(0, 500),
      } : error,
    },
  };

  switch (migrationConfig.mode) {
    case MigrationMode.CONSOLE_ONLY:
      if (error) {
        console.error(message, error);
      } else {
        console.error(message);
      }
      break;

    case MigrationMode.DUAL_OUTPUT:
      if (error) {
        console.error(message, error);
      } else {
        console.error(message);
      }
      // Fall through

    case MigrationMode.STRUCTURED_ONLY:
      logger.error(message, logContext);
      break;
  }
}

/**
 * Enhanced console.warn replacement  
 */
export function structuredWarn(message: string, data?: any, context: LogContext = {}): void {
  const logContext: LogContext = {
    ...context,
    metadata: data ? { ...context.metadata, ...data } : context.metadata,
  };

  switch (migrationConfig.mode) {
    case MigrationMode.CONSOLE_ONLY:
      if (data) {
        console.warn(message, data);
      } else {
        console.warn(message);
      }
      break;

    case MigrationMode.DUAL_OUTPUT:
      if (data) {
        console.warn(message, data);
      } else {
        console.warn(message);
      }
      // Fall through

    case MigrationMode.STRUCTURED_ONLY:
      logger.warn(message, logContext);
      break;
  }
}

/**
 * Component-specific logger factory for easy migration
 */
export function createComponentLogger(componentName: string, defaultContext: LogContext = {}) {
  const context: LogContext = {
    ...defaultContext,
    component: componentName,
    namespace: defaultContext.namespace || componentName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
  };

  return createLogger(context);
}

/**
 * Operation-specific logger factory for business logic
 */
export function createOperationLogger(operation: string, context: LogContext = {}) {
  return createLogger({
    ...context,
    operation,
    namespace: context.namespace || 'business_operations',
    classification: context.classification || DataClassification.INTERNAL,
  });
}

/**
 * Webhook-specific logger for high-volume logging
 */
export function createWebhookLogger(webhookType: string, context: LogContext = {}) {
  return createLogger({
    ...context,
    namespace: 'webhook_processing',
    operation: webhookType,
    classification: DataClassification.CONFIDENTIAL,
    auditRequired: true,
  });
}

/**
 * GraphQL operation logger for Apollo Client integration
 */
export function createGraphQLLogger(operationName: string, context: LogContext = {}) {
  return createLogger({
    ...context,
    namespace: 'graphql_operations',
    operation: operationName,
    classification: DataClassification.INTERNAL,
  });
}

/**
 * Advanced Scheduler specific logger (high-priority migration)
 */
export function createSchedulerLogger(context: LogContext = {}) {
  return createLogger({
    ...context,
    namespace: 'payroll_scheduler',
    component: 'advanced_payroll_scheduler',
    classification: DataClassification.INTERNAL,
  });
}

/**
 * Migration helper: Drop-in replacement for console.log with pattern detection
 */
export const migrationConsole = {
  log: (message: string, ...args: any[]) => {
    if (args.length === 1 && typeof args[0] === 'object') {
      structuredLog(message, args[0]);
    } else if (args.length > 1) {
      structuredLog(message, { args });
    } else {
      structuredLog(message);
    }
  },

  error: (message: string, ...args: any[]) => {
    if (args.length === 1) {
      structuredError(message, args[0]);
    } else if (args.length > 1) {
      structuredError(message, { args });
    } else {
      structuredError(message);
    }
  },

  warn: (message: string, ...args: any[]) => {
    if (args.length === 1 && typeof args[0] === 'object') {
      structuredWarn(message, args[0]);
    } else if (args.length > 1) {
      structuredWarn(message, { args });
    } else {
      structuredWarn(message);
    }
  },
};

/**
 * Performance timing helper for operations
 */
export function timeOperation<T>(
  operationName: string,
  fn: () => T | Promise<T>,
  context: LogContext = {}
): T | Promise<T> {
  return logger.timeOperation(operationName, fn, {
    ...context,
    namespace: context.namespace || 'performance_monitoring',
  });
}

/**
 * Audit logging helper for SOC2 compliance
 */
export function auditLog(
  action: string,
  resourceType: string,
  resourceId: string,
  context: LogContext = {}
): void {
  logger.info(`Audit: ${action} ${resourceType}`, {
    ...context,
    operation: action,
    classification: DataClassification.CONFIDENTIAL,
    auditRequired: true,
    metadata: {
      ...context.metadata,
      resource_type: resourceType,
      resource_id: resourceId,
      audit_action: action,
    },
  });
}

/**
 * Security event logging for authentication and authorization
 */
export function securityLog(
  event: string,
  severity: 'low' | 'medium' | 'high' | 'critical',
  context: LogContext = {}
): void {
  const level = severity === 'critical' || severity === 'high' ? 'error' : 
               severity === 'medium' ? 'warn' : 'info';

  const logContext: LogContext = {
    ...context,
    namespace: 'security',
    classification: DataClassification.CONFIDENTIAL,
    auditRequired: true,
    metadata: {
      ...context.metadata,
      security_event: event,
      severity,
    },
  };

  switch (level) {
    case 'error':
      logger.error(`Security Event: ${event}`, logContext);
      break;
    case 'warn':
      logger.warn(`Security Event: ${event}`, logContext);
      break;
    case 'info':
      logger.info(`Security Event: ${event}`, logContext);
      break;
  }
}

// Export migration statistics for monitoring
export const migrationStats = {
  getTotalConsoleStatements: (): number => 1836, // From analysis
  getReplacedStatements: (): number => {
    // This would be tracked in a real implementation
    return 0;
  },
  getMigrationProgress: (): number => {
    const total = migrationStats.getTotalConsoleStatements();
    const replaced = migrationStats.getReplacedStatements();
    return Math.round((replaced / total) * 100);
  },
};