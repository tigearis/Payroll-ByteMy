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

// Security classification header
const SECURITY_HEADER = `/**
 * THIS FILE IS AUTO-GENERATED - DO NOT EDIT
 * 
 * SOC2 Compliant GraphQL Operations
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

// Scalar mappings
const SCALARS = {
  UUID: "string",
  uuid: "string",
  timestamptz: "string",
  timestamp: "string",
  date: "string",
  jsonb: "any",
  numeric: "number",
  bpchar: "string",
  _Any: "any",
  Int: "number",
  Float: "number",
  String: "string",
  Boolean: "boolean",
  ID: "string",
  user_role: "UserRole",
  payroll_status: "PayrollStatus",
  payroll_cycle_type: "PayrollCycleType",
  payroll_date_type: "PayrollDateType",
  status: "Status",
};

// Base plugin configuration
const basePluginConfig = {
  withHooks: true,
  withComponent: false,
  withHOC: false,
  enumsAsTypes: false,
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
  scalars: SCALARS,
  addDocBlocks: true,
  commentDescriptions: true,
  includeDirectives: true,
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
    "graphql-operations/**/*.graphql",
    "!graphql-operations/generated/**/*",
  ],
  generates: {
    // Base types and enums
    "graphql-operations/generated/types.ts": {
      plugins: [
        {
          add: {
            content: SECURITY_HEADER,
          },
        },
        "typescript",
      ],
      config: {
        ...basePluginConfig,
        enumsAsTypes: false,
        maybeValue: "T | null | undefined",
        namingConvention: {
          typeNames: "pascal-case#pascalCase",
          enumValues: "keep",
        },
      },
    },

    // All operations and hooks
    "graphql-operations/generated/": {
      preset: "client",
      plugins: [],
      config: {
        ...basePluginConfig,
        documentMode: "string",
        gqlTagName: "gql",
        fragmentMasking: false,
      },
    },

    // Separate files by domain for better organisation
    "graphql-operations/generated/domains/users/": {
      documents: [
        "graphql-operations/fragments/users/*.graphql",
        "graphql-operations/queries/users/*.graphql",
        "graphql-operations/mutations/users/*.graphql",
      ],
      preset: "client",
      plugins: [],
      config: {
        ...basePluginConfig,
        documentMode: "string",
        gqlTagName: "gql",
        fragmentMasking: false,
      },
    },

    "graphql-operations/generated/domains/clients/": {
      documents: [
        "graphql-operations/fragments/clients/*.graphql",
        "graphql-operations/queries/clients/*.graphql",
        "graphql-operations/mutations/clients/*.graphql",
      ],
      preset: "client",
      plugins: [],
      config: {
        ...basePluginConfig,
        documentMode: "string",
        gqlTagName: "gql",
        fragmentMasking: false,
      },
    },

    "graphql-operations/generated/domains/payrolls/": {
      documents: [
        "graphql-operations/fragments/payrolls/*.graphql",
        "graphql-operations/queries/payrolls/*.graphql",
        "graphql-operations/mutations/payrolls/*.graphql",
      ],
      preset: "client",
      plugins: [],
      config: {
        ...basePluginConfig,
        documentMode: "string",
        gqlTagName: "gql",
        fragmentMasking: false,
      },
    },

    "graphql-operations/generated/domains/audit/": {
      documents: [
        "graphql-operations/fragments/audit/*.graphql",
        "graphql-operations/queries/audit/*.graphql",
      ],
      preset: "client",
      plugins: [],
      config: {
        ...basePluginConfig,
        documentMode: "string",
        gqlTagName: "gql",
        fragmentMasking: false,
      },
    },

    // Apollo client hooks
    "graphql-operations/generated/apollo-hooks.ts": {
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
        ...basePluginConfig,
        withHooks: true,
        withResultType: true,
        documentMode: "documentNode",
      },
    },

    // MSW handlers for testing
    "graphql-operations/generated/msw-handlers.ts": {
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
      config: {
        ...basePluginConfig,
      },
    },

    // Schema documentation
    "graphql-operations/generated/schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeDirectives: true,
        commentDescriptions: true,
      },
    },

    // Introspection
    "graphql-operations/generated/introspection.json": {
      plugins: ["introspection"],
      config: {
        minify: false,
        descriptions: true,
        specifiedByUrl: false,
        directiveIsRepeatable: true,
        schemaDescription: true,
      },
    },

    // Security metadata extraction
    "graphql-operations/generated/security-metadata.ts": {
      plugins: [
        {
          add: {
            content: `${SECURITY_HEADER}
// Auto-generated security metadata from GraphQL operations

export interface OperationSecurityMetadata {
  operationName: string;
  operationType: 'query' | 'mutation' | 'subscription';
  securityLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  requiredRole?: string;
  audit: boolean;
  mfa?: boolean;
  rateLimit?: string;
  approval?: boolean;
}

// This will be populated by a custom plugin in the future
export const operationSecurityMetadata: Record<string, OperationSecurityMetadata> = {};

// Helper function to get security metadata for an operation
export function getOperationSecurity(operationName: string): OperationSecurityMetadata | undefined {
  return operationSecurityMetadata[operationName];
}

// Helper to check if operation requires audit
export function requiresAudit(operationName: string): boolean {
  const metadata = getOperationSecurity(operationName);
  return metadata?.audit ?? false;
}

// Helper to check if operation requires MFA
export function requiresMFA(operationName: string): boolean {
  const metadata = getOperationSecurity(operationName);
  return metadata?.mfa ?? false;
}
`,
          },
        },
      ],
    },
  },
  hooks: {
    afterAllFileWrite: [
      // Format generated files
      "prettier --write",
      // Run linting
      "eslint --fix",
    ],
  },
  ignoreNoDocuments: false,
};

export default config;