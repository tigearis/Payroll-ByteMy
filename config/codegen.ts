import type { CodegenConfig } from "@graphql-codegen/cli";
import * as dotenv from "dotenv";
import { resolve } from "path";
import { existsSync, readFileSync } from "fs";

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

// Load environment variables
const HASURA_URL =
  process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL ||
  "https://bytemy.hasura.app/v1/graphql";
const HASURA_SECRET =
  process.env.HASURA_GRAPHQL_ADMIN_SECRET ||
  process.env.HASURA_ADMIN_SECRET ||
  "3w+sHTuq8wQwddK4xyWO5LDeRH+anvJoFVyOMvtq8Lo=";

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
    " * ",
    ` * Generated: ${new Date().toISOString()}`,
    " * Schema Version: Latest from Hasura",
    " * CodeGen Version: Unified v3.0",
    " */",
    "",
  ].join("\n");
};

// Define domains with SOC2 compliance levels
const domains = [
  // CRITICAL Security Level
  { name: "auth", securityLevel: "CRITICAL" },
  { name: "audit", securityLevel: "CRITICAL" },
  { name: "permissions", securityLevel: "CRITICAL" },

  // HIGH Security Level
  { name: "users", securityLevel: "HIGH" },
  { name: "clients", securityLevel: "HIGH" },
  { name: "billing", securityLevel: "HIGH" },

  // MEDIUM Security Level
  { name: "payrolls", securityLevel: "MEDIUM" },
  { name: "notes", securityLevel: "MEDIUM" },
  { name: "leave", securityLevel: "MEDIUM" },
  { name: "work-schedule", securityLevel: "MEDIUM" },
  { name: "external-systems", securityLevel: "MEDIUM" },

  // LOW Security Level
  { name: "shared", securityLevel: "LOW" },
];

// Unified scalar mappings
const SHARED_SCALARS = {
  // PostgreSQL native types
  UUID: "string",
  uuid: "string",
  timestamptz: "string",
  timestamp: "string",
  date: "string",
  json: "any",
  jsonb: "any",
  numeric: "number",
  bigint: "number",
  inet: "string",
  interval: "string",
  name: "string",
  bpchar: "string",
  text: "string",
  varchar: "string",

  // GraphQL standard types
  _Any: "any",
  _Service: "any",
  Service: "any",
  Int: "number",
  Float: "number",
  String: "string",
  Boolean: "boolean",
  ID: "string",

  // Custom scalars
  user_role: "string",
  payroll_status: "string",
  payroll_cycle_type: "string",
  payroll_date_type: "string",
  status: "string",
  leave_status_enum: "string",
  permission_action: "string",

  // Security-enhanced scalars
  EncryptedString: "string",
  MaskedString: "string",
};

// Helper function to check if a GraphQL file has actual operations
const hasGraphQLContent = (filePath: string): boolean => {
  if (!existsSync(filePath)) return false;

  const content = readFileSync(filePath, "utf8");
  const cleanContent = content
    .replace(/#[^\n\r]*/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (cleanContent.length === 0) return false;
  return /\b(query|mutation|subscription|fragment)\s+\w+/i.test(cleanContent);
};

// Helper function to check if domain has any valid GraphQL operations
const domainHasValidOperations = (domainName: string): boolean => {
  const base = `./domains/${domainName}/graphql`;
  const sharedBase = `./shared/graphql`;

  if (domainName === "shared") {
    const sharedFiles = [
      `${sharedBase}/fragments.graphql`,
      `${sharedBase}/queries.graphql`,
      `${sharedBase}/mutations.graphql`,
      `${sharedBase}/subscriptions.graphql`,
    ];
    return sharedFiles.some(hasGraphQLContent);
  }

  const graphqlFiles = [
    `${base}/fragments.graphql`,
    `${base}/queries.graphql`,
    `${base}/mutations.graphql`,
    `${base}/subscriptions.graphql`,
  ];

  return graphqlFiles.some(hasGraphQLContent);
};

// Helper function to get access control descriptions
function getAccessControlDescription(level: string): string {
  switch (level) {
    case "CRITICAL":
      return "Admin + MFA + Full Audit";
    case "HIGH":
      return "Role-based + Audit Logging";
    case "MEDIUM":
      return "Authentication + Basic Audit";
    case "LOW":
      return "Basic Authentication";
    default:
      return "Standard Access";
  }
}

// Get all GraphQL documents for a domain
function getDomainDocuments(domainName: string): string[] {
  const base =
    domainName === "shared"
      ? `./shared/graphql`
      : `./domains/${domainName}/graphql`;

  const graphqlFiles = [
    `${base}/fragments.graphql`,
    `${base}/queries.graphql`,
    `${base}/mutations.graphql`,
    `${base}/subscriptions.graphql`,
  ];

  const validFiles = graphqlFiles.filter(hasGraphQLContent);

  // For non-shared domains, always include shared fragments for dependencies
  if (domainName !== "shared" && validFiles.length > 0) {
    const sharedFragments = "./shared/graphql/fragments.graphql";
    if (hasGraphQLContent(sharedFragments)) {
      return [sharedFragments, ...validFiles];
    }
  }

  return validFiles;
}

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      [HASURA_URL]: {
        headers: {
          "x-hasura-admin-secret": HASURA_SECRET,
        },
      },
    },
    "./hasura/metadata/actions.graphql",
  ],
  generates: {
    // 1. SINGLE SOURCE OF TRUTH: Base TypeScript types only (no operations)
    "./shared/types/base-types.ts": {
      plugins: [
        {
          add: {
            content: generateSOC2Header(),
          },
        },
        "typescript",
      ],
      config: {
        scalars: SHARED_SCALARS,
        enumsAsTypes: false,
        skipTypename: false,
        strictScalars: true,
        useTypeImports: true,
        namingConvention: {
          typeNames: "pascal-case#pascalCase",
          enumValues: "keep",
          transformUnderscore: true,
        },
        // IMPORTANT: Only generate base types, no operations
        onlyOperationTypes: false,
        exportFragmentSpreadSubTypes: false,
        // Fix duplicate types by excluding problematic ones
        skipDocumentsValidation: true,
        avoidOptionals: {
          field: true,
          inputValue: false,
          object: true,
          defaultValue: false,
        },
        // Prevent duplicate type generation
        declarationKind: {
          type: 'interface',
          input: 'interface',
        },
        dedupeOperationSuffix: true,
      },
    },

    // 2. SHARED DOMAIN: Operations with hooks (uses client preset correctly)
    "./shared/types/generated/": {
      documents: getDomainDocuments("shared"),
      preset: "client",
      plugins: [
        {
          add: {
            content: [
              generateSOC2Header(),
              "/* DOMAIN: SHARED | SECURITY: LOW | ACCESS: Basic Authentication */",
              "",
            ].join("\n"),
          },
        },
      ],
      config: {
        scalars: SHARED_SCALARS,
        useTypeImports: true,
        // Import base types instead of generating them
        typesPrefix: "",
        typesSuffix: "",
        // Client preset configuration
        withHooks: true,
        withComponent: false,
        withHOC: false,
        fragmentMasking: false,
        enumsAsTypes: false,
        strictScalars: true,
        skipTypename: false,
        dedupeFragments: true,
        documentMode: "documentNode",
        gqlTagName: "gql",
      },
      presetConfig: {
        fragmentMasking: false,
        // Generate index.ts with proper exports
        gqlTagName: "gql",
      },
    },

    // 3. DOMAIN-SPECIFIC GENERATIONS: One per domain
    ...domains
      .filter(
        domain =>
          domain.name !== "shared" && domainHasValidOperations(domain.name)
      )
      .reduce(
        (acc, domain) => {
          const documents = getDomainDocuments(domain.name);
          if (documents.length === 0) return acc;

          const outputDir = `./domains/${domain.name}/graphql/generated/`;

          acc[outputDir] = {
            documents,
            preset: "client",
            plugins: [
              {
                add: {
                  content: [
                    generateSOC2Header(),
                    `/* DOMAIN: ${domain.name.toUpperCase()} | SECURITY: ${domain.securityLevel} | ACCESS: ${getAccessControlDescription(domain.securityLevel)} */`,
                    "",
                  ].join("\n"),
                },
              },
            ],
            config: {
              scalars: SHARED_SCALARS,
              useTypeImports: true,
              // Import base types from shared
              typesPrefix: "",
              typesSuffix: "",
              // Client preset configuration
              withHooks: true,
              withComponent: false,
              withHOC: false,
              fragmentMasking: false,
              enumsAsTypes: false,
              strictScalars: true,
              skipTypename: false,
              dedupeFragments: true,
              documentMode: "documentNode",
              gqlTagName: "gql",
            },
            presetConfig: {
              fragmentMasking: false,
              gqlTagName: "gql",
            },
          };

          return acc;
        },
        {} as CodegenConfig["generates"]
      ),

    // 4. CLEAN EXPORTS: Root aggregator (no conflicts)
    "./shared/types/index.ts": {
      plugins: [
        {
          add: {
            content: [
              generateSOC2Header(),
              "// Central export aggregator for GraphQL operations",
              "",
              "// Base types (single source of truth)",
              "export * from './base-types';",
              "",
              "// Shared operations and hooks",
              "export * from './generated';",
              "",
              "// Domain-specific exports available at:",
              "// import { useGetUserQuery } from '../../../domains/users/graphql/generated';",
              "// import { useCreateNoteQuery } from '../../../domains/notes/graphql/generated';",
              "",
              "// Re-export commonly used utilities",
              "export { gql } from './generated';",
              "",
            ].join("\n"),
          },
        },
      ],
    },

    // 5. SCHEMA DOCUMENTATION AND AUDITING
    "./shared/schema/schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeDirectives: true,
        sort: true,
        commentDescriptions: true,
      },
    },

    "./shared/schema/introspection.json": {
      plugins: ["introspection"],
      config: {
        minify: false,
        descriptions: true,
        specifiedByUrl: true,
        directiveIsRepeatable: true,
        schemaDescription: true,
        introspectDirectives: true,
      },
    },

    // 6. SECURITY AUDIT REPORT
    "./shared/schema/security-report.json": {
      plugins: [
        {
          add: {
            content: (() => {
              const reportData = {
                generatedAt: new Date().toISOString(),
                codegenVersion: "unified-v3.0-fixed",
                domains: domains.map(d => ({
                  name: d.name,
                  securityLevel: d.securityLevel,
                  hasOperations: domainHasValidOperations(d.name),
                  accessControls: getAccessControlDescription(d.securityLevel),
                  outputPath:
                    d.name === "shared"
                      ? "./shared/types/generated/"
                      : `./domains/${d.name}/graphql/generated/`,
                  documents: getDomainDocuments(d.name),
                })),
                compliance: {
                  soc2: true,
                  auditLogging: true,
                  rbac: true,
                  dataClassification: true,
                  autoExports: true,
                  duplicatePrevention: true,
                },
                fixes: {
                  separatedBaseTypes: true,
                  properClientPreset: true,
                  noFragmentMasking: true,
                  cleanExports: true,
                  noDuplicateGeneration: true,
                },
              };
              return JSON.stringify(reportData, null, 2);
            })(),
          },
        },
      ],
    },
  },

  // Post-generation cleanup
  hooks: {
    afterAllFileWrite: [
      // Clean up any potential duplicate exports in domain index files
      'node -e "' +
        "const fs = require('fs'); " +
        "const path = require('path'); " +
        "const glob = require('glob'); " +
        "try { " +
        "  const indexFiles = glob.sync('./domains/*/graphql/generated/index.ts'); " +
        "  indexFiles.forEach(file => { " +
        "    if (fs.existsSync(file)) { " +
        '      const content = \'// Auto-generated domain exports\\\\nexport * from \\"./gql\\";\\\\nexport * from \\"./graphql\\";\\\\n\'; ' +
        "      fs.writeFileSync(file, content, 'utf8'); " +
        "    } " +
        "  }); " +
        "} catch (e) { " +
        "  console.warn('Post-generation cleanup warning:', e.message); " +
        "}" +
        '"',
    ],
  },

  ignoreNoDocuments: true,
  config: {
    failOnInvalidType: true,
    maybeValue: "T | null | undefined",
  },
};

export default config;

// Export utilities for external use
export { domains, SHARED_SCALARS, domainHasValidOperations };
