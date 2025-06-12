/**
 * Security Configuration
 * Centralised security settings for the application
 * Compliant with SOC2 and security best practices
 */

export const securityConfig = {
  // Authentication settings
  auth: {
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    mfaRequired: false, // MFA enforcement disabled
    passwordPolicy: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      preventReuse: 5, // Prevent reuse of last 5 passwords
      maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
    },
  },

  // Session management
  session: {
    cookieName: "payroll-session",
    secure: true, // HTTPS only
    httpOnly: true,
    sameSite: "strict" as const,
    maxAge: 30 * 60 * 1000, // 30 minutes
    rolling: true, // Extend session on activity
  },

  // CORS settings
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
    exposedHeaders: ["X-Request-ID"],
    maxAge: 86400, // 24 hours
  },

  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    // Different limits for different endpoints
    endpoints: {
      "/api/auth/login": { windowMs: 15 * 60 * 1000, max: 5 },
      "/api/auth/register": { windowMs: 60 * 60 * 1000, max: 3 },
      "/api/auth/reset-password": { windowMs: 60 * 60 * 1000, max: 3 },
      "/api/export": { windowMs: 60 * 60 * 1000, max: 10 },
    },
  },

  // Content Security Policy
  csp: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        "https://cdn.jsdelivr.net",
      ],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || ""],
      mediaSrc: ["'none'"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"],
      workerSrc: ["'self'", "blob:"],
      childSrc: ["'none'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      manifestSrc: ["'self'"],
      upgradeInsecureRequests: [],
    },
  },

  // Security headers
  headers: {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  },

  // Input validation
  validation: {
    maxRequestSize: "10mb",
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFileTypes: [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    sanitizeOptions: {
      allowedTags: [],
      allowedAttributes: {},
      disallowedTagsMode: "discard",
    },
  },

  // Encryption settings
  encryption: {
    algorithm: "aes-256-gcm",
    keyDerivation: "pbkdf2",
    iterations: 100000,
    saltLength: 32,
    tagLength: 16,
    ivLength: 16,
  },

  // Audit logging
  audit: {
    enabled: true,
    logLevel: "info",
    sensitiveFields: [
      "password",
      "token",
      "secret",
      "key",
      "authorization",
      "cookie",
      "session",
      "creditCard",
      "ssn",
      "taxId",
      "bankAccount",
    ],
    retentionDays: 2555, // 7 years for SOC2 compliance
  },

  // API security
  api: {
    requireAuthentication: true,
    requireHttps: process.env.NODE_ENV === "production",
    apiKeyHeader: "X-API-Key",
    signatureHeader: "X-Signature",
    timestampHeader: "X-Timestamp",
    timestampTolerance: 5 * 60 * 1000, // 5 minutes
  },

  // Data classification
  dataClassification: {
    levels: {
      CRITICAL: {
        name: "Critical",
        description: "Highly sensitive data requiring maximum protection",
        encryptionRequired: true,
        auditRequired: true,
        accessRestricted: true,
      },
      HIGH: {
        name: "High",
        description: "Sensitive data requiring strong protection",
        encryptionRequired: true,
        auditRequired: true,
        accessRestricted: true,
      },
      MEDIUM: {
        name: "Medium",
        description: "Internal data requiring standard protection",
        encryptionRequired: false,
        auditRequired: true,
        accessRestricted: false,
      },
      LOW: {
        name: "Low",
        description: "Public or non-sensitive data",
        encryptionRequired: false,
        auditRequired: false,
        accessRestricted: false,
      },
    },
  },
};
