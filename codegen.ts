import type { CodegenConfig } from "@graphql-codegen/cli";
import * as dotenv from "dotenv";
import { resolve } from "path";
import { existsSync, readFileSync } from "fs";

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

// Load environment variables
const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
const HASURA_SECRET = process.env.HASURA_ADMIN_SECRET;

if (!HASURA_URL || !HASURA_SECRET) {
  throw new Error(
    "Missing required environment variables: NEXT_PUBLIC_HASURA_GRAPHQL_URL or HASURA_ADMIN_SECRET"
  );
}

// Define domains that have GraphQL files
// Final streamlined domain structure for payroll management system
const domains = [
  // Core Business Domains (6) - Essential payroll management functionality
  "payrolls",    // Core payroll processing and scheduling
  "clients",     // Client management (absorbs external-systems, notes)
  "users",       // User/staff management (consolidates staff + users)
  "billing",     // Invoice and billing management
  "leave",       // Employee leave management  
  "work-schedule", // Work scheduling and time tracking
  
  // Infrastructure Domains (3) - Security and system functionality
  "auth",        // Authentication and security
  "audit",       // SOC2 compliance and logging
  "shared",      // Common GraphQL infrastructure
  
  // Note: Removed domains
  // - "employees": Empty placeholder, no business value
  // - "holidays": Empty files, managed via API sync
  // - "notes": Empty files, integrated into clients/payrolls
  // - "external-systems": Merged into clients domain
  // - "permissions": Simplified RBAC moved to users domain
  // - "staff": Consolidated into users domain
];

const SHARED_SCALARS = {
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
};

const sharedPlugins = ["typescript", "typescript-operations"];

const sharedConfig = {
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
  scalars: SHARED_SCALARS,
};

// Helper function to check if a GraphQL file has actual operations
const hasGraphQLContent = (filePath: string): boolean => {
  if (!existsSync(filePath)) return false;
  
  const content = readFileSync(filePath, 'utf8');
  // Remove comments and whitespace
  const cleanContent = content
    .replace(/#[^\n\r]*/g, '') // Remove comments
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  // Check if file is empty after removing comments
  if (cleanContent.length === 0) return false;
  
  // Check if it has actual GraphQL operations (not just scalar/enum definitions)
  return /\b(query|mutation|subscription|fragment)\s+\w+/i.test(cleanContent);
};

// Helper function to check if domain has any valid GraphQL operations
const domainHasValidOperations = (domain: string): boolean => {
  const base = `./domains/${domain}/graphql`;
  const graphqlFiles = [
    `${base}/fragments.graphql`,
    `${base}/queries.graphql`, 
    `${base}/mutations.graphql`,
    `${base}/subscriptions.graphql`,
  ];
  
  return graphqlFiles.some(hasGraphQLContent);
};

const generatePerDomain = domains
  .filter(domainHasValidOperations) // Only include domains with valid operations
  .reduce((acc, domain) => {
    const base = `./domains/${domain}/graphql`;
    const gen = `${base}/generated/`;

    // Check which GraphQL files actually have content
    const graphqlFiles = [
      `${base}/fragments.graphql`,
      `${base}/queries.graphql`, 
      `${base}/mutations.graphql`,
      `${base}/subscriptions.graphql`,
    ];

    const validFiles = graphqlFiles.filter(hasGraphQLContent);

    // Generate for valid files
    acc[gen] = {
      documents: validFiles,
      preset: "client",
      plugins: [],
      config: {
        ...sharedConfig,
        documentMode: "documentNode",
        gqlTagName: "gql",
      },
    };

    return acc;
  }, {} as CodegenConfig["generates"]);

const config: CodegenConfig = {
  overwrite: true,
  schema: {
    [HASURA_URL]: {
      headers: {
        "x-hasura-admin-secret": HASURA_SECRET,
      },
    },
  },
  generates: {
    // Shared base types (schema types)
    "./shared/types/generated/graphql.ts": {
      plugins: ["typescript"],
      config: {
        ...sharedConfig,
        enumsAsTypes: true,
        maybeValue: "T | null | undefined",
      },
    },

    // Generate for each domain
    ...generatePerDomain,

    // Schema file for reference
    "./graphql/schema/schema.graphql": {
      plugins: ["schema-ast"],
    },

    // Full introspection output
    "./graphql/schema/introspection.json": {
      plugins: ["introspection"],
      config: {
        minify: false,
        descriptions: true,
        specifiedByUrl: false,
        directiveIsRepeatable: true,
        schemaDescription: false,
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
