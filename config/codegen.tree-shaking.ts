/**
 * Tree-Shaking Optimized GraphQL Code Generator Configuration
 *
 * PERFORMANCE OPTIMIZATION:
 * - Uses client preset for modern React/Apollo patterns
 * - Generates only operation types with shared fragment validation
 * - Enables better tree-shaking with selective imports
 */

import type { CodegenConfig } from "@graphql-codegen/cli";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const ESSENTIAL_SCALARS = {
  uuid: "string",
  timestamptz: "string",
  date: "string",
  json: "any",
  jsonb: "any",
  bigint: "string",
  numeric: "number",
  time: "string",
  timetz: "string",
};

const config: CodegenConfig = {
  overwrite: true,
  schema: {
    [process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL ||
    "https://bytemy.hasura.app/v1/graphql"]: {
      headers: {
        "x-hasura-admin-secret":
          process.env.HASURA_GRAPHQL_ADMIN_SECRET ||
          process.env.HASURA_ADMIN_SECRET!,
      },
    },
  },
  generates: {
    // Use client preset for each domain with shared fragment inclusion
    "./domains/payrolls/graphql/generated/": {
      preset: "client",
      documents: [
        "./domains/payrolls/graphql/*.graphql",
        "./shared/graphql/fragments.graphql", // Include shared fragments
      ],
      presetConfig: {
        gqlTagName: "gql",
        fragmentMasking: false,
        enumsAsTypes: true,
        dedupeFragments: true,
      },
      config: {
        scalars: ESSENTIAL_SCALARS,
        skipTypename: false,
        useTypeImports: true, // Tree-shaking optimization
        onlyOperationTypes: true, // Only generate operation types
      },
    },

    "./domains/clients/graphql/generated/": {
      preset: "client",
      documents: [
        "./domains/clients/graphql/*.graphql",
        "./shared/graphql/fragments.graphql", // Include shared fragments
      ],
      presetConfig: {
        gqlTagName: "gql",
        fragmentMasking: false,
        enumsAsTypes: true,
        dedupeFragments: true,
      },
      config: {
        scalars: ESSENTIAL_SCALARS,
        skipTypename: false,
        useTypeImports: true,
        onlyOperationTypes: true,
      },
    },

    "./domains/billing/graphql/generated/": {
      preset: "client",
      documents: [
        "./domains/billing/graphql/queries.graphql",
        "./domains/billing/graphql/mutations.graphql",
        "./domains/billing/graphql/subscriptions.graphql",
        "./domains/billing/graphql/fragments.graphql",
        "./domains/billing/graphql/enhanced-operations.graphql",
        "./shared/graphql/fragments.graphql", // Include shared fragments
        "!./domains/billing/graphql/*analytics*.graphql", // Exclude analytics
      ],
      presetConfig: {
        gqlTagName: "gql",
        fragmentMasking: false,
        enumsAsTypes: true,
        dedupeFragments: true,
      },
      config: {
        scalars: ESSENTIAL_SCALARS,
        skipTypename: false,
        useTypeImports: true,
        onlyOperationTypes: true,
      },
    },

    "./domains/users/graphql/generated/": {
      preset: "client",
      documents: [
        "./domains/users/graphql/*.graphql",
        "./shared/graphql/fragments.graphql", // Include shared fragments
      ],
      presetConfig: {
        gqlTagName: "gql",
        fragmentMasking: false,
        enumsAsTypes: true,
        dedupeFragments: true,
      },
      config: {
        scalars: ESSENTIAL_SCALARS,
        skipTypename: false,
        useTypeImports: true,
        onlyOperationTypes: true,
      },
    },

    // Minimal shared types only
    "./shared/types/generated/": {
      preset: "client",
      documents: [
        "./shared/graphql/fragments.graphql", // Only shared fragments
      ],
      presetConfig: {
        gqlTagName: "gql",
        fragmentMasking: false,
        enumsAsTypes: true,
      },
      config: {
        scalars: ESSENTIAL_SCALARS,
        skipTypename: false,
      },
    },
  },
  hooks: {
    afterAllFileWrite: ["pnpm prettier --write"],
  },
};

export default config;
