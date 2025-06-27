/**
 * GraphQL Code Generator Configuration - Schema Only
 * 
 * This configuration is specifically for retrieving the GraphQL schema
 * and introspection data from Hasura without any document validation.
 * 
 * Usage:
 * pnpm graphql-codegen --config config/codegen-schema.ts
 */

import type { CodegenConfig } from "@graphql-codegen/cli";
import * as dotenv from "dotenv";
import { resolve } from "path";

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

if (!HASURA_URL || !HASURA_SECRET) {
  console.error("❌ Missing required environment variables:");
  console.error("   - NEXT_PUBLIC_HASURA_GRAPHQL_URL");
  console.error("   - HASURA_GRAPHQL_ADMIN_SECRET or HASURA_ADMIN_SECRET");
  process.exit(1);
}

console.log("🔍 Fetching schema from:", HASURA_URL);

const config: CodegenConfig = {
  // Schema endpoint configuration
  schema: {
    [HASURA_URL]: {
      headers: {
        "x-hasura-admin-secret": HASURA_SECRET,
      },
    },
  },
  
  // Only generate schema files, no document processing
  generates: {
    // Generate human-readable GraphQL SDL schema
    "./shared/schema/schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeDirectives: true,
        includeIntrospectionTypes: false,
        commentDescriptions: true,
        federation: false,
      },
    },
    
    // Generate introspection JSON for tooling
    "./shared/schema/introspection.json": {
      plugins: ["introspection"],
      config: {
        descriptions: true,
        specifiedByUrl: true,
        directiveIsRepeatable: true,
        schemaDescription: true,
        inputValueDeprecation: true,
        minify: false,
      },
    },
    
    // Generate a TypeScript schema type file
    "./shared/schema/schema.ts": {
      plugins: ["typescript"],
      config: {
        enumsAsTypes: true,
        scalars: {
          uuid: "string",
          timestamptz: "string",
          timestamp: "string",
          numeric: "number",
          bigint: "string",
          date: "string",
          time: "string",
          timetz: "string",
          jsonb: "any",
          json: "any",
          bytea: "string",
          inet: "string",
          _text: "string[]",
          _uuid: "string[]",
          _timestamptz: "string[]",
          _numeric: "number[]",
        },
        avoidOptionals: false,
        maybeValue: "T | null | undefined",
        inputMaybeValue: "T | null | undefined",
        namingConvention: {
          typeNames: "keep",
          enumValues: "keep",
        },
      },
    },
    
    // Generate a schema summary report
    "./shared/schema/schema-summary.json": {
      plugins: [
        {
          add: {
            content: `{
  "generated": "${new Date().toISOString()}",
  "endpoint": "${HASURA_URL}",
  "purpose": "Schema introspection and documentation",
  "files": {
    "schema.graphql": "Human-readable GraphQL SDL",
    "introspection.json": "Full introspection data for tooling",
    "schema.ts": "TypeScript type definitions",
    "schema-summary.json": "This summary file"
  }
}`
          },
        },
      ],
    },
  },
  
  // Configuration options
  config: {
    // Don't fail on missing documents since we're only fetching schema
    ignoreNoDocuments: true,
    // Don't validate documents
    skipDocumentsValidation: true,
    // Include deprecated fields in schema
    includeDeprecated: true,
  },
  
  // Hooks for logging
  hooks: {
    afterAllFileWrite: [
      'echo "✅ Schema files generated successfully!"',
      'echo "📁 Generated files:"',
      'echo "   - shared/schema/schema.graphql (GraphQL SDL)"',
      'echo "   - shared/schema/introspection.json (Introspection data)"',
      'echo "   - shared/schema/schema.ts (TypeScript types)"',
      'echo "   - shared/schema/schema-summary.json (Summary)"',
    ],
  },
  
  // Performance options
  verbose: true,
  debug: false,
};

export default config;