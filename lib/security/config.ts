/**
 * Security Configuration
 * 
 * Central configuration for security features including MFA, session management,
 * and security policies.
 */

export interface SecurityConfig {
  mfa: MFAConfig;
  session: SessionConfig;
  audit: AuditConfig;
  rateLimit: RateLimitConfig;
  encryption: EncryptionConfig;
}

export interface MFAConfig {
  enabled: boolean;
  required: boolean;
  methods: MFAMethod[];
  backupCodes: BackupCodesConfig;
  timeout: number; // seconds
}

export interface MFAMethod {
  type: 'totp' | 'sms' | 'email' | 'backup_codes';
  enabled: boolean;
  required: boolean;
}

export interface BackupCodesConfig {
  enabled: boolean;
  count: number;
  length: number;
}

export interface SessionConfig {
  maxAge: number; // seconds
  refreshThreshold: number; // seconds
  maxConcurrentSessions: number;
  requireReauthForSensitive: boolean;
}

export interface AuditConfig {
  enabled: boolean;
  logLevel: 'minimal' | 'standard' | 'detailed';
  retentionDays: number;
  sensitiveActions: string[];
}

export interface RateLimitConfig {
  enabled: boolean;
  requests: {
    auth: { limit: number; window: number }; // requests per window
    api: { limit: number; window: number };
    sensitive: { limit: number; window: number };
  };
}

export interface EncryptionConfig {
  algorithm: string;
  keyRotationDays: number;
  saltRounds: number;
}

/**
 * Default security configuration
 */
export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  mfa: {
    enabled: true,
    required: false, // Can be enabled per organization
    methods: [
      { type: 'totp', enabled: true, required: false },
      { type: 'email', enabled: true, required: false },
      { type: 'backup_codes', enabled: true, required: false },
    ],
    backupCodes: {
      enabled: true,
      count: 10,
      length: 8,
    },
    timeout: 300, // 5 minutes
  },
  session: {
    maxAge: 86400, // 24 hours
    refreshThreshold: 3600, // 1 hour
    maxConcurrentSessions: 5,
    requireReauthForSensitive: true,
  },
  audit: {
    enabled: true,
    logLevel: 'standard',
    retentionDays: 90,
    sensitiveActions: [
      'user.role.update',
      'user.delete',
      'permission.grant',
      'permission.revoke',
      'security.config.update',
      'payroll.approve',
      'client.delete',
    ],
  },
  rateLimit: {
    enabled: true,
    requests: {
      auth: { limit: 5, window: 300 }, // 5 attempts per 5 minutes
      api: { limit: 100, window: 60 }, // 100 requests per minute
      sensitive: { limit: 10, window: 300 }, // 10 sensitive operations per 5 minutes
    },
  },
  encryption: {
    algorithm: 'AES-256-GCM',
    keyRotationDays: 90,
    saltRounds: 12,
  },
};

/**
 * Environment-specific security configurations
 */
export const SECURITY_CONFIGS = {
  development: {
    ...DEFAULT_SECURITY_CONFIG,
    mfa: {
      ...DEFAULTSECURITYCONFIG.mfa,
      required: false,
    },
    rateLimit: {
      ...DEFAULTSECURITYCONFIG.rateLimit,
      enabled: false, // Disabled in development
    },
  },
  staging: {
    ...DEFAULT_SECURITY_CONFIG,
    audit: {
      ...DEFAULTSECURITYCONFIG.audit,
      logLevel: 'detailed' as const,
    },
  },
  production: {
    ...DEFAULT_SECURITY_CONFIG,
    mfa: {
      ...DEFAULTSECURITYCONFIG.mfa,
      required: true, // MFA required in production
    },
    session: {
      ...DEFAULTSECURITYCONFIG.session,
      maxAge: 43200, // 12 hours in production
    },
    audit: {
      ...DEFAULTSECURITYCONFIG.audit,
      logLevel: 'detailed' as const,
      retentionDays: 365, // 1 year retention in production
    },
  },
};

/**
 * Get security config for current environment
 */
export function getSecurityConfig(): SecurityConfig {
  const env = process.env.NODE_ENV || 'development';
  return SECURITY_CONFIGS[env as keyof typeof SECURITY_CONFIGS] || DEFAULT_SECURITY_CONFIG;
}

/**
 * Security feature flags
 */
export const SECURITY_FEATURES = {
  MFA_ENFORCEMENT: 'mfa_enforcement',
  AUDIT_LOGGING: 'audit_logging',
  RATE_LIMITING: 'rate_limiting',
  SESSION_MONITORING: 'session_monitoring',
  ENCRYPTION_AT_REST: 'encryption_at_rest',
  STEP_UP_AUTH: 'step_up_auth',
} as const;

/**
 * Check if security feature is enabled
 */
export function isSecurityFeatureEnabled(feature: string): boolean {
  const config = getSecurityConfig();
  
  switch (feature) {
    case SECURITYFEATURES.MFA_ENFORCEMENT:
      return config.mfa.enabled && config.mfa.required;
    case SECURITYFEATURES.AUDIT_LOGGING:
      return config.audit.enabled;
    case SECURITYFEATURES.RATE_LIMITING:
      return config.rateLimit.enabled;
    case SECURITYFEATURES.SESSION_MONITORING:
      return config.session.maxConcurrentSessions > 0;
    case SECURITYFEATURES.ENCRYPTION_AT_REST:
      return true; // Always enabled
    case SECURITYFEATURES.STEP_UP_AUTH:
      return config.session.requireReauthForSensitive;
    default:
      return false;
  }
}

/**
 * Security constants
 */
export const SECURITY_CONSTANTS = {
  MIN_PASSWORD_LENGTH: 12,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 900, // 15 minutes
  SESSION_WARNING_THRESHOLD: 300, // 5 minutes before expiry
  MFA_CODE_LENGTH: 6,
  BACKUP_CODE_LENGTH: 8,
  API_KEY_LENGTH: 32,
  CSRF_TOKEN_LENGTH: 32,
} as const;

/**
 * Security error codes
 */
export const SECURITY_ERROR_CODES = {
  MFA_REQUIRED: 'MFA_REQUIRED',
  MFA_INVALID: 'MFA_INVALID',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  RATE_LIMITED: 'RATE_LIMITED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  STEP_UP_REQUIRED: 'STEP_UP_REQUIRED',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
} as const;

export type SecurityErrorCode = typeof SECURITY_ERROR_CODES[keyof typeof SECURITY_ERROR_CODES];