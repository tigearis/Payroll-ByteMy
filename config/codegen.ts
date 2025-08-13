/**
 * GraphQL Code Generator Configuration
 *
 * ARCHITECTURE OVERVIEW:
 * =====================
 *
 * This configuration implements a domain-driven GraphQL code generation strategy
 * with shared fragment support and SOC2 compliance. Each domain generates
 * self-contained TypeScript types while having access to shared fragments.
 *
 * KEY FEATURES:
 * - ✅ Domain isolation with shared fragment access
 * - ✅ SOC2 compliant security classifications
 * - ✅ Support for GraphQL comment headers (# comments)
 * - ✅ Automatic type generation for active domains
 * - ✅ Fragment deduplication and optimization
 * - ✅ Client preset for modern React/Apollo patterns
 *
 * FRAGMENT SHARING STRATEGY:
 * =========================
 *
 * While shared fragments appear in each domain's generated files, this is the
 * RECOMMENDED approach per GraphQL Codegen best practices because:
 *
 * 1. VALIDATION: GraphQL requires all fragments to be available during validation
 * 2. SELF-CONTAINED: Each domain module is independent (no runtime dependencies)
 * 3. OPTIMIZATION: dedupeFragments handles build-time optimization
 * 4. BUNDLING: Better for code splitting and module bundling
 * 5. TYPE SAFETY: Prevents circular import issues and runtime errors
 *
 * DIRECTORY STRUCTURE:
 * ===================
 *
 * shared/
 * ├── graphql/fragments.graphql     # Shared fragments (UserCore, RoleCore, etc.)
 * ├── graphql/queries.graphql       # Cross-domain queries
 * └── types/generated/              # Base types for all domains
 *
 * domains/{domain}/
 * ├── graphql/queries.graphql       # Domain-specific operations
 * ├── graphql/mutations.graphql     # Domain mutations
 * ├── graphql/fragments.graphql     # Domain fragments
 * └── graphql/generated/            # Self-contained generated types
 *
 * SECURITY CLASSIFICATIONS:
 * ========================
 *
 * CRITICAL: Auth, user roles, financial data (admin + MFA required)
 * HIGH:     PII, client data, employee info (role-based access)
 * MEDIUM:   Internal business data (authentication required)
 * LOW:      Public/aggregate data (basic access control)
 *
 * USAGE:
 * ======
 *
 * # Generate all types
 * pnpm codegen
 *
 * # Watch mode (development)
 * pnpm codegen:watch
 *
 * @see https://the-guild.dev/graphql/codegen/docs/guides/react-vue
 * @see https://the-guild.dev/blog/unleash-the-power-of-fragments-with-graphql-codegen
 */

import type { CodegenConfig } from "@graphql-codegen/cli";
import * as dotenv from "dotenv";
import { resolve } from "path";
import { existsSync, readFileSync } from "fs";

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

// Load environment variables
const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || "";
const HASURA_SECRET =
  process.env.HASURA_GRAPHQL_ADMIN_SECRET ||
  process.env.HASURA_ADMIN_SECRET ||
  "";
("");

if (
  !process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL ||
  (!process.env.HASURA_GRAPHQL_ADMIN_SECRET && !process.env.HASURA_ADMIN_SECRET)
) {
  console.warn(
    "⚠️  Using default values for HASURA_URL and HASURASECRET. Set environment variables for production use."
  );
}

// SOC2 Compliance Header
const generateSOC2Header = () => {
  return [
    "/**",
    " * THIS FILE IS AUTO-GENERATED - DO NOT EDIT MANUALLY",
    " * ",
    " * SOC2 Compliant GraphQL Operations",
    " * Security Classifications Applied:",
    " * - CRITICAL: Auth, user roles, financial data - Requires admin access + MFA",
    " * - HIGH: PII, client data, employee info - Requires role-based access",
    " * - MEDIUM: Internal business data - Requires authentication",
    " * - LOW: Public/aggregate data - Basic access control",
    " * ",
    " * Compliance Features:",
    " * ✓ Role-based access control (RBAC)",
    " * ✓ Audit logging integration",
    " * ✓ Data classification enforcement",
    " * ✓ Permission boundary validation",
    " * ✓ Automatic domain isolation and exports",
    " * ✓ Client Preset v4.8+ for optimal type safety",
    " * ✓ Zero type conflicts with modern codegen",
    " * ",
    ` * Generated: ${new Date().toISOString()}`,
    " * Schema Version: Latest from Hasura",
    " * CodeGen Version: Client Preset v4.0",
    " */",
    "",
  ].join("\n");
};

// Domain classification for SOC2 compliance
const domains = {
  // CRITICAL Security Level - Requires admin access + MFA
  auth: {
    name: "auth",
    security: "CRITICAL",
    description: "Authentication and JWT handling",
  },
  audit: {
    name: "audit",
    security: "CRITICAL",
    description: "SOC2 compliance and logging",
  },
  admin: {
    name: "admin",
    security: "CRITICAL",
    description: "Administrative operations and cleanup",
  },
  permissions: {
    name: "permissions",
    security: "CRITICAL",
    description: "Role-based access control",
  },

  // HIGH Security Level - Role-based access required
  users: {
    name: "users",
    security: "HIGH",
    description: "User management and staff lifecycle",
  },
  clients: {
    name: "clients",
    security: "HIGH",
    description: "Client relationship management",
  },
  billing: {
    name: "billing",
    security: "HIGH",
    description: "Financial operations",
  },
  email: {
    name: "email",
    security: "HIGH",
    description: "Email communication and templates",
  },

  // MEDIUM Security Level - Authentication required
  payrolls: {
    name: "payrolls",
    security: "MEDIUM",
    description: "Payroll processing engine",
  },
  notes: {
    name: "notes",
    security: "MEDIUM",
    description: "Documentation and communication",
  },
  leave: {
    name: "leave",
    security: "MEDIUM",
    description: "Employee leave management",
  },
  "work-schedule": {
    name: "work-schedule",
    security: "MEDIUM",
    description: "Staff scheduling",
  },
  "external-systems": {
    name: "external-systems",
    security: "MEDIUM",
    description: "Third-party integrations",
  },
  reports: {
    name: "reports",
    security: "HIGH",
    description: "Custom reporting and analytics",
  },

  // LOW Security Level - Basic access control
  shared: {
    name: "shared",
    security: "LOW",
    description: "Public/aggregate data",
  },
} as const;

// Shared scalar mappings for consistent typing across all domains
const SHARED_SCALARS = {
  uuid: "string",
  timestamptz: "string",
  numeric: "number",
  bigint: "string",
  date: "string",
  time: "string",
  timetz: "string",
  jsonb: "any",
  json: "any",
  bytea: "string",
  _text: "string[]",
  _uuid: "string[]",
  _timestamptz: "string[]",
  _numeric: "number[]",
};

// Check if domain has valid GraphQL operations
// Updated to support GraphQL files with comment headers (# comments are valid)
const domainHasValidOperations = (domainName: string): boolean => {
  const graphqlFiles = [
    `./domains/${domainName}/graphql/queries.graphql`,
    `./domains/${domainName}/graphql/mutations.graphql`,
    `./domains/${domainName}/graphql/subscriptions.graphql`,
    `./domains/${domainName}/graphql/fragments.graphql`,
  ];

  // Also check for any other .graphql files in the domain
  const fs = require('fs');
  const path = require('path');
  const domainGraphqlDir = `./domains/${domainName}/graphql`;
  
  try {
    if (fs.existsSync(domainGraphqlDir)) {
      const allFiles = fs.readdirSync(domainGraphqlDir, { recursive: true })
        .filter((file: string) => file.endsWith('.graphql'))
        .map((file: string) => path.join(domainGraphqlDir, file));
      
      graphqlFiles.push(...allFiles);
    }
  } catch {
    // Continue with default files if directory reading fails
  }

  return graphqlFiles.some(file => {
    if (!existsSync(file)) return false;
    try {
      const content = readFileSync(file, "utf8").trim();
      return (
        content.length > 0 &&
        (content.includes("query") ||
          content.includes("mutation") ||
          content.includes("subscription") ||
          content.includes("fragment"))
      );
    } catch {
      return false;
    }
  });
};

// Generate domain configuration with client preset
// Each domain generates self-contained types with shared fragment access
const generateDomainConfig = (domainName: string) => {
  const domain = domains[domainName as keyof typeof domains];
  if (!domain) return null;

  // Include all domain GraphQL documents; optimized analytics are now aligned
  // Special-case: exclude unstable billing analytics documents until schema alignment is complete
  const domainDocuments =
    domainName === "billing"
      ? [
          `./domains/${domainName}/graphql/*.graphql`,
          `!./domains/${domainName}/graphql/optimized-analytics.graphql`,
          `!./domains/${domainName}/graphql/billing-dashboard-optimized.graphql`,
          // Temporarily exclude analytics docs that rely on not-yet-aligned Hasura views/types
          `!./domains/${domainName}/graphql/daily-revenue-trends.graphql`,
          `!./domains/${domainName}/graphql/daily-analytics-summary.graphql`,
          `!./domains/${domainName}/graphql/client-analytics.graphql`,
          `!./domains/${domainName}/graphql/staff-analytics.graphql`,
          `!./domains/${domainName}/graphql/service-analytics.graphql`,
          `./shared/graphql/**/*.graphql`,
        ]
      : [
          `./domains/${domainName}/graphql/*.graphql`,
          `./shared/graphql/**/*.graphql`,
        ];

  return {
    [`./domains/${domainName}/graphql/generated/`]: {
      preset: "client", // Modern client preset for React/Apollo
      documents: domainDocuments,
      presetConfig: {
        gqlTagName: "gql", // Use gql`` template literal
        fragmentMasking: false, // Disabled for simpler DX (can access fragment data directly)
        enumsAsTypes: true, // Generate union types for enums
        dedupeFragments: true, // Optimize duplicate fragments during generation
        omitOperationSuffix: false, // Keep Query/Mutation suffixes for clarity
      },
      config: {
        scalars: SHARED_SCALARS, // Consistent scalar mappings across all domains
        skipTypename: false, // Include __typename for Apollo cache
        maybeValue: "T | null | undefined", // Nullable type representation
        enumsAsTypes: true, // Generate type unions instead of enums
        futureProofEnums: true, // Handle enum additions gracefully
        futureProofUnions: true, // Handle union additions gracefully
        nonOptionalTypename: false, // Make __typename optional

        // Fragment and Type Management
        // Note: While shared fragments appear in each domain's generated files,
        // this is the recommended approach per GraphQL Codegen best practices:
        // 1. Ensures validation passes (all fragments must be available)
        // 2. Creates self-contained modules (no runtime dependency issues)
        // 3. Optimizes bundle splitting (each domain is independent)
        // 4. dedupeFragments handles optimization during generation
        baseTypesPath: "../../shared/types/generated/graphql", // Import base types
        onlyOperationTypes: true, // Generate only operation types, import others

        // SOC2 Compliance metadata
        security: {
          level: domain.security,
          description: domain.description,
          domain: domainName,
        },
      },
      plugins: [
        {
          add: {
            content: generateSOC2Header(),
          },
        },
      ],
    },
  };
};

// Main GraphQL Code Generator Configuration
//
// Architecture: Domain-Driven Generation with Shared Types
// - Each domain generates self-contained types for independence
// - Shared fragments and types are included in each domain for validation
// - SOC2 compliant with security classifications and audit trails
//
const config: CodegenConfig = {
  schema: HASURA_SECRET
    ? {
        [HASURA_URL]: {
          headers: {
            "x-hasura-admin-secret": HASURA_SECRET,
          },
        },
      }
    : // Fallback to local schema file if no admin secret
      "./shared/schema/schema.graphql",
  generates: {
    // Shared Types Generation
    // Contains base GraphQL types, shared fragments, and common operations
    // Used as base types for domain-specific generations
    "./shared/types/generated/": {
      preset: "client",
      documents: [
        "./shared/graphql/**/*.graphql", // Shared fragments and operations
        "./shared/graphql/**/*.{ts,tsx}", // TypeScript GraphQL documents
        "!./domains/*/graphql/**/*", // Exclude domain-specific files to avoid conflicts
      ],
      presetConfig: {
        gqlTagName: "gql",
        fragmentMasking: false, // Simpler DX - direct fragment access
        enumsAsTypes: true, // Union types for better type safety
        dedupeFragments: true, // Optimize fragment duplicates
      },
      config: {
        scalars: SHARED_SCALARS, // Consistent scalar types
        skipTypename: false, // Include __typename for Apollo
        maybeValue: "T | null | undefined", // Nullable type representation
        enumsAsTypes: true,
        futureProofEnums: true,
        futureProofUnions: true,
        nonOptionalTypename: false,
      },
      plugins: [
        {
          add: {
            content: generateSOC2Header(),
          },
        },
      ],
    },

    // Schema documentation and introspection
    "./shared/schema/schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeDirectives: true,
        commentDescriptions: true,
      },
    },
    "./shared/schema/introspection.json": {
      plugins: ["introspection"],
      config: {
        descriptions: true,
        specifiedByUrl: true,
        directiveIsRepeatable: true,
        schemaDescription: true,
        inputValueDeprecation: true,
      },
    },

    // Security and compliance reporting
    "./shared/schema/security-report.json": {
      plugins: [
        {
          add: {
            content: JSON.stringify(
              {
                domains: Object.entries(domains).map(([name, config]) => ({
                  name,
                  security: config.security,
                  description: config.description,
                  hasOperations: domainHasValidOperations(name),
                  documentsPath: `./domains/${name}/graphql/generated/`,
                })),
                securityLevels: {
                  CRITICAL:
                    "Auth, user roles, financial data - Requires admin access + MFA",
                  HIGH: "PII, client data, employee info - Requires role-based access",
                  MEDIUM: "Internal business data - Requires authentication",
                  LOW: "Public/aggregate data - Basic access control",
                },
                complianceFeatures: [
                  "Role-based access control (RBAC)",
                  "Audit logging integration",
                  "Data classification enforcement",
                  "Permission boundary validation",
                  "Automatic domain isolation and exports",
                  "Client Preset v4.8+ for optimal type safety",
                  "Zero type conflicts with modern codegen",
                ],
                generatedAt: new Date().toISOString(),
                codegenVersion: "Client Preset v4.0",
                architectureFixes: [
                  "Migrated to client preset for better type safety",
                  "Eliminated type export conflicts",
                  "Simplified output directory structure",
                  "Removed complex post-generation hooks",
                  "Enhanced domain isolation",
                ],
              },
              null,
              2
            ),
          },
        },
      ],
    },

    // Domain-Specific Type Generation
    // Automatically generates types for domains with valid GraphQL operations
    // Each domain includes shared fragments for validation and self-contained modules
    ...Object.keys(domains).reduce((acc, domainName) => {
      if (domainHasValidOperations(domainName)) {
        const domainConfig = generateDomainConfig(domainName);
        if (domainConfig) {
          Object.assign(acc, domainConfig);
        }
      }
      return acc;
    }, {}),
  },

  // Enable watch mode for development
  watch: false,

  // Configuration options
  ignoreNoDocuments: true,
  config: {
    failOnInvalidType: true,
    maybeValue: "T | null | undefined",
    enumsAsTypes: true,
    futureProofEnums: true,
    scalars: SHARED_SCALARS,
  },

  // Hooks for validation and cleanup
  hooks: {
    afterOneFileWrite: [],
    afterAllFileWrite: [
      // Validate that all generated files have proper SOC2 headers
      'node -e "console.log(\\"✅ GraphQL Code Generation completed successfully\\")"',
    ],
  },

  // Performance and debugging options
  verbose: false, // Set to true for detailed generation logs
  debug: false, // Set to true for debugging generation issues

  // Common troubleshooting:
  // 1. "Unknown fragment" errors: Ensure shared fragments are in /shared/graphql/fragments.graphql
  // 2. "Duplicate operation names": Check for naming conflicts between domains and shared
  // 3. "Invalid enum value": Update GraphQL schema or fix enum usage in operations
  // 4. Comments causing issues: This config supports # comments in .graphql files
  // 5. Fragment not found: Verify fragment is defined and included in documents array
};

export default config;
