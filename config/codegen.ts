import type { CodegenConfig } from "@graphql-codegen/cli";
import * as dotenv from "dotenv";
import { resolve } from "path";

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
const domains = [
  "payrolls",
  "clients",
  "staff",
  "users",
  "holidays",
  "notes",
  "billing",
  "audit",
  "permissions",
  "leave",
  "work-schedule",
  "external-systems",
  // Future domains can be added here
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

const generatePerDomain = domains.reduce((acc, domain) => {
  const base = `./domains/${domain}/graphql`;
  const gen = `${base}/generated/`;

  // Generate hooks and operations using client preset
  acc[gen] = {
    documents: [
      `${base}/fragments.graphql`,
      `${base}/queries.graphql`,
      `${base}/mutations.graphql`,
      `${base}/subscriptions.graphql`,
    ],
    preset: "client",
    plugins: [],
    config: {
      ...sharedConfig,
      documentMode: "string",
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
