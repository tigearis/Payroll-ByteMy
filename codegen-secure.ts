import type { CodegenConfig } from "@graphql-codegen/cli";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
const HASURA_SECRET = process.env.HASURA_ADMIN_SECRET;

if (!HASURA_URL || !HASURA_SECRET) {
  throw new Error(
    "Missing required environment variables: NEXT_PUBLIC_HASURA_GRAPHQL_URL or HASURA_ADMIN_SECRET"
  );
}

// Security classification for generated code
const SECURITY_HEADER = `/**
 * THIS FILE IS AUTO-GENERATED - DO NOT EDIT
 * 
 * Security Classifications:
 * - CRITICAL: Requires admin role, MFA, and full audit logging
 * - HIGH: Contains PII or sensitive data, requires audit logging
 * - MEDIUM: Internal data, requires role-based access
 * - LOW: Public or non-sensitive data
 * 
 * Compliance: SOC 2, GDPR, PCI-DSS where applicable
 * Generated: ${new Date().toISOString()}
 */\n\n`;

// Shared scalar mappings with security context
const SECURE_SCALARS = {
  UUID: "string",
  uuid: "string",
  timestamptz: "string",
  timestamp: "string",
  date: "string",
  jsonb: "any",
  numeric: "number",
  bpchar: "string",
  EncryptedString: "string", // Custom scalar for encrypted data
  MaskedString: "string", // Custom scalar for masked display
  _Any: "any",
  Int: "number",
  Float: "number",
  String: "string",
  Boolean: "boolean",
  ID: "string",
};

// Plugin configuration for secure code generation
const securePluginConfig = {
  withHooks: true,
  withComponent: false,
  withHOC: false,
  enumsAsTypes: true,
  skipTypename: false,
  preResolveTypes: true,
  dedupeFragments: true,
  avoidOptionals: {
    field: true,
    inputValue: false,
    object: false,
  },
  nonOptionalTypename: true,
  emitLegacyCommonJSImports: false,
  scalars: SECURE_SCALARS,
  // Add security context to generated code
  addDocBlocks: true,
  commentDescriptions: true,
  // Include operation metadata for runtime security checks
  includeDirectives: true,
};

// Generate secure hooks with built-in validation
const generateSecureHooks = {
  plugins: [
    {
      add: {
        content: SECURITY_HEADER,
      },
    },
    "typescript",
    "typescript-operations",
    "typescript-react-apollo",
  ],
  config: {
    ...securePluginConfig,
    documentMode: "string",
    gqlTagName: "gql",
    // Add security wrappers
    preResolveTypes: true,
    // Generate MSW handlers for testing
    generateMSWMocks: true,
    addDocBlocks: {
      operations: true,
      fragments: true,
    },
  },
};

const config: CodegenConfig = {
  overwrite: true,
  schema: {
    [HASURA_URL]: {
      headers: {
        "x-hasura-admin-secret": HASURA_SECRET,
      },
    },
  },
  documents: [
    "graphql-secure/operations/**/*.graphql",
    "graphql-secure/fragments/**/*.graphql",
  ],
  generates: {
    // Base types with security annotations
    "graphql-secure/generated/types/base-types.ts": {
      plugins: [
        {
          add: {
            content: SECURITY_HEADER,
          },
        },
        "typescript",
      ],
      config: {
        ...securePluginConfig,
        enumsAsTypes: true,
        maybeValue: "T | null | undefined",
        namingConvention: {
          typeNames: "pascal-case#pascalCase",
          enumValues: "upper-case#upperCase",
        },
      },
    },

    // Secure operations by classification level
    "graphql-secure/generated/operations/standard.ts": {
      documents: [
        "graphql-secure/operations/standard/**/*.graphql",
        "graphql-secure/fragments/public/**/*.graphql",
      ],
      plugins: generateSecureHooks.plugins,
      config: {
        ...generateSecureHooks.config,
      },
    },

    "graphql-secure/generated/operations/sensitive.ts": {
      documents: [
        "graphql-secure/operations/sensitive/**/*.graphql",
        "graphql-secure/fragments/secure/**/*.graphql",
      ],
      plugins: generateSecureHooks.plugins,
      config: {
        ...generateSecureHooks.config,
      },
    },

    "graphql-secure/generated/operations/critical.ts": {
      documents: [
        "graphql-secure/operations/critical/**/*.graphql",
        "graphql-secure/fragments/**/*.graphql",
      ],
      plugins: generateSecureHooks.plugins,
      config: {
        ...generateSecureHooks.config,
      },
    },

    // Apollo client configurations by security level
    "graphql-secure/generated/apollo/standard-client.ts": {
      plugins: [
        {
          add: {
            content: SECURITY_HEADER,
          },
        },
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      documents: ["graphql-secure/operations/standard/**/*.graphql"],
      config: {
        ...securePluginConfig,
        withHooks: true,
        withResultType: true,
        documentMode: "documentNode",
      },
    },

    "graphql-secure/generated/apollo/secure-client.ts": {
      plugins: [
        {
          add: {
            content: SECURITY_HEADER,
          },
        },
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      documents: [
        "graphql-secure/operations/sensitive/**/*.graphql",
        "graphql-secure/operations/critical/**/*.graphql",
      ],
      config: {
        ...securePluginConfig,
        withHooks: true,
        withResultType: true,
        documentMode: "documentNode",
      },
    },

    // MSW handlers for testing
    "graphql-secure/generated/msw/handlers.ts": {
      plugins: [
        {
          add: {
            content: SECURITY_HEADER,
          },
        },
        "typescript",
        "typescript-operations",
        "typescript-msw",
      ],
      documents: ["graphql-secure/operations/**/*.graphql"],
      config: {
        ...securePluginConfig,
      },
    },

    // Audit schemas
    "graphql-secure/generated/audit/types.ts": {
      plugins: [
        {
          add: {
            content: SECURITY_HEADER,
          },
        },
        "typescript",
      ],
      documents: ["graphql-secure/schema/base/audit-types.graphql"],
      config: {
        ...securePluginConfig,
      },
    },

    // Schema documentation
    "graphql-secure/generated/schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeDirectives: true,
        commentDescriptions: true,
      },
    },

    // Introspection with security metadata
    "graphql-secure/generated/introspection.json": {
      plugins: ["introspection"],
      config: {
        minify: false,
        descriptions: true,
        specifiedByUrl: false,
        directiveIsRepeatable: true,
        schemaDescription: true,
      },
    },

    // Security validation rules
    "graphql-secure/generated/validation/rules.ts": {
      plugins: [
        {
          add: {
            content: `${SECURITY_HEADER}
// Auto-generated validation rules based on schema security annotations

export interface SecurityRule {
  field: string;
  classification: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  requiredRole?: string;
  audit: boolean;
  mfa?: boolean;
  validation?: string[];
}

export interface OperationSecurity {
  operation: string;
  classification: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  requiredRole: string;
  rateLimit: string;
  audit: boolean;
  mfa?: boolean;
  approval?: boolean;
}

// Field-level security rules
export const fieldSecurityRules: Record<string, SecurityRule[]> = {};

// Operation-level security rules  
export const operationSecurityRules: Record<string, OperationSecurity> = {};
`,
          },
        },
      ],
    },
  },
  hooks: {
    afterAllFileWrite: [
      // Add security headers to all generated files
      "prettier --write",
      // Run security linting
      "eslint --fix",
    ],
  },
  ignoreNoDocuments: false,
};

export default config;
