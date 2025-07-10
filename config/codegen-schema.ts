import type { CodegenConfig } from "@graphql-codegen/cli";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

// Load environment variables
const HASURA_URL = "";
const HASURA_SECRET = "";

const config: CodegenConfig = {
  schema: {
    [HASURA_URL]: {
      headers: {
        "x-hasura-admin-secret": HASURA_SECRET,
      },
    },
  },
  generates: {
    // Generate schema file
    "./shared/schema/schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeDirectives: true,
        commentDescriptions: true,
      },
    },
    // Generate introspection JSON
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
