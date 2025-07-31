import type { CodegenConfig } from "@graphql-codegen/cli";

// Load environment variables or use constants
const HASURA_URL = "https://hasura.bytemy.com.au/v1/graphql";
const HASURA_SECRET = "3w+sHTuq8wQwddK4xyWO5LDeRH+anvJoFVyOMvtq8Lo=";

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
