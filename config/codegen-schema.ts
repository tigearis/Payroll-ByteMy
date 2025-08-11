import type { CodegenConfig } from "@graphql-codegen/cli";
import * as dotenv from "dotenv";
import { resolve } from "path";

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
