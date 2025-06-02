import type { CodegenConfig } from "@graphql-codegen/cli";
import "dotenv/config";

// Define domains that exist or will exist
const domains = [
  "auth",
  "payrolls",
  "clients",
  "staff",
  "users",
  "holidays",
  "notes",
  // Future domains
  "billing",
  "scheduling",
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

  // Include all GraphQL documents for the domain
  const domainDocuments = [
    `${base}/fragments.graphql`,
    `${base}/queries.graphql`,
    `${base}/mutations.graphql`,
    `${base}/subscriptions.graphql`,
  ];

  // Generate fragments.ts with fragment definitions
  acc[`${gen}fragments.ts`] = {
    documents: domainDocuments,
    plugins: [
      {
        add: {
          content: `// Auto-generated fragments for ${domain} domain\nimport * as Types from '../../../shared/types/generated/graphql';`,
        },
      },
      "typescript-react-apollo",
    ],
    config: {
      ...sharedConfig,
      onlyOperationTypes: false,
      documentMode: "documentNode",
      fragmentVariableSuffix: "FragmentDoc",
    },
  };

  // Generate gql.ts with gql template literals
  acc[`${gen}gql.ts`] = {
    documents: domainDocuments,
    plugins: ["typescript-document-nodes"],
    config: {
      ...sharedConfig,
      typesPrefix: "",
      gqlImport: "@apollo/client#gql",
    },
  };

  // Generate graphql.ts with hooks and operations
  acc[`${gen}graphql.ts`] = {
    documents: domainDocuments,
    plugins: [
      {
        add: {
          content: `// Auto-generated hooks and operations for ${domain} domain\nimport * as Types from '../../../shared/types/generated/graphql';`,
        },
      },
      "typescript-react-apollo",
    ],
    config: {
      ...sharedConfig,
      onlyOperationTypes: true,
      withHooks: true,
    },
  };

  // Generate index.ts barrel file
  acc[`${gen}index.ts`] = {
    plugins: [
      {
        add: {
          content: `// Auto-generated barrel file for ${domain} domain
export * from './graphql';
export * from './gql';
export * from './fragments';`,
        },
      },
    ],
  };

  return acc;
}, {} as CodegenConfig["generates"]);

const config: CodegenConfig = {
  overwrite: true,
  schema: {
    [process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!]: {
      headers: {
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET!,
      },
    },
  },
  generates: {
    // Shared base types (schema types + operations types)
    "./shared/types/generated/graphql.ts": {
      documents: [
        "./domains/**/graphql/fragments.graphql",
        "./domains/**/graphql/queries.graphql",
        "./domains/**/graphql/mutations.graphql",
        "./domains/**/graphql/subscriptions.graphql",
        // Include legacy graphql files during migration
        "./graphql/fragments/**/*.graphql",
        "./graphql/queries/**/*.graphql",
        "./graphql/mutations/**/*.graphql",
        "./graphql/subscriptions/**/*.graphql",
      ],
      plugins: sharedPlugins,
      config: sharedConfig,
    },

    ...generatePerDomain,

    // Schema file for reference
    "./schema.graphql": {
      plugins: ["schema-ast"],
    },

    // Full introspection output
    "./introspection.json": {
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
