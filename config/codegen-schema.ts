import type { CodegenConfig } from "@graphql-codegen/cli";

// Load environment variables - NEVER hardcode secrets!
const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || "https://hasura.bytemy.com.au/v1/graphql";
const HASURA_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

if (!HASURA_SECRET) {
  throw new Error("HASURA_GRAPHQL_ADMIN_SECRET environment variable is required for GraphQL codegen");
}

const config: CodegenConfig = {
  schema: {
    [HASURA_URL]: {
      headers: {
        "x-hasura-admin-secret": HASURA_SECRET,
      },
    },
  },
  generates: {
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
  },
  watch: false,
  verbose: false,
  debug: false,
};

export default config;
