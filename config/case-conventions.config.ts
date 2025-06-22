/**
 * Case Convention Configuration for Payroll-ByteMy
 *
 * This configuration enforces consistent naming conventions across the entire
 * codebase following the Type-Case-Conventions.md reference document.
 *
 * Security Classification: LOW - Development configuration
 * SOC2 Compliance: N/A - Development tooling
 */

// ================================
// FILE & DIRECTORY NAMING RULES
// ================================

/**
 * File naming patterns following kebab-case convention
 */
export const FILE_NAMING_PATTERNS = {
  // React components (kebab-case files, PascalCase exports)
  COMPONENT_FILES: /^[a-z][a-z0-9]*(-[a-z0-9]+)*\.(tsx|jsx)$/,

  // TypeScript/JavaScript files
  TS_FILES: /^[a-z][a-z0-9]*(-[a-z0-9]+)*\.(ts|js)$/,

  // GraphQL files
  GRAPHQL_FILES: /^[a-z][a-z0-9]*(-[a-z0-9]+)*\.graphql$/,

  // Test files
  TEST_FILES: /^[a-z][a-z0-9]*(-[a-z0-9]+)*\.(test|spec)\.(ts|tsx|js|jsx)$/,

  // Configuration files
  CONFIG_FILES: /^[a-z][a-z0-9]*(-[a-z0-9]+)*\.config\.(ts|js|json)$/,

  // Type definition files
  TYPE_FILES: /^[a-z][a-z0-9]*(-[a-z0-9]+)*\.d\.ts$/,

  // Directory naming
  DIRECTORIES: /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/,
} as const;

// ================================
// IDENTIFIER NAMING RULES
// ================================

/**
 * TypeScript identifier patterns following camelCase/PascalCase conventions
 */
export const IDENTIFIER_PATTERNS = {
  // React Components - PascalCase
  REACT_COMPONENTS: /^[A-Z][a-zA-Z0-9]*$/,

  // Functions and variables - camelCase
  FUNCTIONS: /^[a-z][a-zA-Z0-9]*$/,
  VARIABLES: /^[a-z][a-zA-Z0-9]*$/,

  // Custom hooks - camelCase starting with 'use'
  HOOKS: /^use[A-Z][a-zA-Z0-9]*$/,

  // Event handlers - camelCase with handle/on prefix
  EVENT_HANDLERS: /^(handle|on)[A-Z][a-zA-Z0-9]*$/,

  // Constants - SCREAMING_SNAKE_CASE
  CONSTANTS: /^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$/,

  // Types and Interfaces - PascalCase
  TYPES: /^[A-Z][a-zA-Z0-9]*$/,
  INTERFACES: /^[A-Z][a-zA-Z0-9]*$/,

  // Enums - PascalCase
  ENUMS: /^[A-Z][a-zA-Z0-9]*$/,
  ENUM_MEMBERS: /^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$/,

  // GraphQL operations - PascalCase
  GRAPHQL_OPERATIONS: /^[A-Z][a-zA-Z0-9]*$/,
  GRAPHQL_VARIABLES: /^[a-z][a-zA-Z0-9]*$/,

  // CSS classes - kebab-case
  CSS_CLASSES: /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/,

  // Database fields - snake_case
  DB_FIELDS: /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/,

  // Environment variables - SCREAMING_SNAKE_CASE
  ENV_VARS: /^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$/,
} as const;

// ================================
// DOMAIN-SPECIFIC NAMING PATTERNS
// ================================

/**
 * Business domain-specific naming conventions for Payroll-ByteMy
 */
export const DOMAIN_PATTERNS = {
  // Payroll-specific entities
  PAYROLL_ENTITIES: {
    types:
      /^(Payroll|PayrollDate|PayrollCycle|PayrollStatus|AdjustmentRule)[A-Z][a-zA-Z0-9]*$/,
    enums:
      /^(PayrollStatus|PayrollCycleType|PayrollDateType)[A-Z][a-zA-Z0-9]*$/,
    functions:
      /^(generate|process|calculate|validate|adjust)[A-Z][a-zA-Z0-9]*Payroll[A-Z][a-zA-Z0-9]*$/,
  },

  // Client management entities
  CLIENT_ENTITIES: {
    types: /^(Client|ClientExternalSystem)[A-Z][a-zA-Z0-9]*$/,
    functions:
      /^(create|update|delete|get)[A-Z][a-zA-Z0-9]*Client[A-Z][a-zA-Z0-9]*$/,
  },

  // User and role management
  AUTH_ENTITIES: {
    types: /^(User|Role|Permission|AuthState|UserMetadata)[A-Z][a-zA-Z0-9]*$/,
    enums: /^(Role|PermissionAction|AuthStatus)[A-Z][a-zA-Z0-9]*$/,
    functions:
      /^(authenticate|authorize|validate|check|assign)[A-Z][a-zA-Z0-9]*$/,
    hooks: /^use(Auth|User|Role|Permission)[A-Z][a-zA-Z0-9]*$/,
  },

  // Audit and compliance
  AUDIT_ENTITIES: {
    types: /^(AuditLog|ComplianceReport|SecurityEvent)[A-Z][a-zA-Z0-9]*$/,
    functions: /^(log|audit|track|monitor|report)[A-Z][a-zA-Z0-9]*$/,
  },

  // GraphQL operations by domain
  GRAPHQL_OPERATIONS: {
    payroll:
      /^(Get|Create|Update|Delete|Generate|Process)[A-Z][a-zA-Z0-9]*Payroll[A-Z][a-zA-Z0-9]*$/,
    client:
      /^(Get|Create|Update|Delete)[A-Z][a-zA-Z0-9]*Client[A-Z][a-zA-Z0-9]*$/,
    user: /^(Get|Create|Update|Delete|Assign)[A-Z][a-zA-Z0-9]*User[A-Z][a-zA-Z0-9]*$/,
    audit: /^(Get|Log|Track)[A-Z][a-zA-Z0-9]*Audit[A-Z][a-zA-Z0-9]*$/,
  },
} as const;

// ================================
// VALIDATION FUNCTIONS
// ================================

/**
 * Validates file naming conventions
 */
export function validateFileName(
  fileName: string,
  fileType: keyof typeof FILE_NAMING_PATTERNS
): boolean {
  const pattern = FILE_NAMING_PATTERNS[fileType];
  return pattern.test(fileName);
}

/**
 * Validates identifier naming conventions
 */
export function validateIdentifier(
  identifier: string,
  identifierType: keyof typeof IDENTIFIER_PATTERNS
): boolean {
  const pattern = IDENTIFIER_PATTERNS[identifierType];
  return pattern.test(identifier);
}

/**
 * Validates domain-specific naming conventions
 */
export function validateDomainEntity(
  entityName: string,
  domain: keyof typeof DOMAIN_PATTERNS,
  entityType: string
): boolean {
  const domainPatterns = DOMAIN_PATTERNS[domain];
  if (!domainPatterns || !(entityType in domainPatterns)) {
    return false;
  }
  const pattern = (domainPatterns as any)[entityType];
  return pattern.test(entityName);
}

// ================================
// TRANSFORMATION UTILITIES
// ================================

/**
 * Transforms strings between different case conventions
 */
export const caseTransformers = {
  /**
   * Converts camelCase or PascalCase to kebab-case
   */
  toKebabCase: (str: string): string => {
    return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  },

  /**
   * Converts kebab-case or snake_case to camelCase
   */
  toCamelCase: (str: string): string => {
    return str
      .replace(/[-_](.)/g, (_, char) => char.toUpperCase())
      .replace(/^[A-Z]/, char => char.toLowerCase());
  },

  /**
   * Converts any case to PascalCase
   */
  toPascalCase: (str: string): string => {
    const camelCase = caseTransformers.toCamelCase(str);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
  },

  /**
   * Converts any case to snake_case
   */
  toSnakeCase: (str: string): string => {
    return str
      .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
      .replace(/[-\s]/g, "_")
      .toLowerCase();
  },

  /**
   * Converts any case to SCREAMING_SNAKE_CASE
   */
  toScreamingSnakeCase: (str: string): string => {
    return caseTransformers.toSnakeCase(str).toUpperCase();
  },
} as const;

// ================================
// CONFIGURATION PRESETS
// ================================

/**
 * Predefined configuration presets for different file types
 */
export const CONVENTION_PRESETS = {
  REACT_COMPONENT: {
    fileName: FILE_NAMING_PATTERNS.COMPONENT_FILES,
    componentName: IDENTIFIER_PATTERNS.REACT_COMPONENTS,
    props: IDENTIFIER_PATTERNS.TYPES,
    hooks: IDENTIFIER_PATTERNS.HOOKS,
    handlers: IDENTIFIER_PATTERNS.EVENT_HANDLERS,
  },

  TYPESCRIPT_MODULE: {
    fileName: FILE_NAMING_PATTERNS.TS_FILES,
    functions: IDENTIFIER_PATTERNS.FUNCTIONS,
    variables: IDENTIFIER_PATTERNS.VARIABLES,
    types: IDENTIFIER_PATTERNS.TYPES,
    constants: IDENTIFIER_PATTERNS.CONSTANTS,
  },

  GRAPHQL_SCHEMA: {
    fileName: FILE_NAMING_PATTERNS.GRAPHQL_FILES,
    operations: IDENTIFIER_PATTERNS.GRAPHQL_OPERATIONS,
    variables: IDENTIFIER_PATTERNS.GRAPHQL_VARIABLES,
    types: IDENTIFIER_PATTERNS.TYPES,
  },

  API_ROUTE: {
    fileName: FILE_NAMING_PATTERNS.TS_FILES,
    handlers: IDENTIFIER_PATTERNS.FUNCTIONS,
    types: IDENTIFIER_PATTERNS.TYPES,
    constants: IDENTIFIER_PATTERNS.CONSTANTS,
  },
} as const;

// ================================
// LINT RULE CONFIGURATION
// ================================

/**
 * ESLint rule configuration for case conventions
 */
export const ESLINT_NAMING_RULES = {
  "@typescript-eslint/naming-convention": [
    "error",
    // Variables, functions, and methods - camelCase
    {
      selector: "variableLike",
      format: ["camelCase"],
      leadingUnderscore: "allow",
    },
    {
      selector: "function",
      format: ["camelCase"],
    },
    {
      selector: "method",
      format: ["camelCase"],
    },

    // Constants - SCREAMING_SNAKE_CASE
    {
      selector: "variable",
      modifiers: ["const", "global"],
      format: ["UPPER_CASE", "camelCase"], // Allow both for flexibility
    },

    // Types, interfaces, enums - PascalCase
    {
      selector: "typeLike",
      format: ["PascalCase"],
    },
    {
      selector: "interface",
      format: ["PascalCase"],
    },
    {
      selector: "typeAlias",
      format: ["PascalCase"],
    },
    {
      selector: "enum",
      format: ["PascalCase"],
    },
    {
      selector: "enumMember",
      format: ["PascalCase", "UPPER_CASE"],
    },

    // Class-related - PascalCase
    {
      selector: "class",
      format: ["PascalCase"],
    },
    {
      selector: "property",
      format: ["camelCase", "PascalCase"], // Allow PascalCase for React props
    },

    // Parameters - camelCase
    {
      selector: "parameter",
      format: ["camelCase"],
      leadingUnderscore: "allow",
    },
  ],
} as const;

export default {
  FILE_NAMING_PATTERNS,
  IDENTIFIER_PATTERNS,
  DOMAIN_PATTERNS,
  validateFileName,
  validateIdentifier,
  validateDomainEntity,
  caseTransformers,
  CONVENTION_PRESETS,
  ESLINT_NAMING_RULES,
};
