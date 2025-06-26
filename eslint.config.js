import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

const compat = new FlatCompat({
  baseDirectory: _dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript"],
  }),
  {
    rules: {
      // Next.js specific rules
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-img-element": "warn",

      // React rules
      "react/no-unescaped-entities": "off",
      "react/display-name": "off",
      "react/prop-types": "off",

      // TypeScript rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "off", // Allow empty interfaces for extending

      // ================================
      // CASE CONVENTION RULES - Updated to ignore GraphQL patterns
      // ================================
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          selector: "default",
          format: ["camelCase"],
        },
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
        },
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        {
          selector: "import",
          format: null, // Allow any format for imports (React, Link, etc.)
        },
        {
          selector: "enumMember",
          format: ["UPPER_CASE", "camelCase", "PascalCase"], // Allow all formats for enum members
          filter: {
            // Ignore common GraphQL and database naming patterns
            regex:
              "^(id|name|email|createdAt|updatedAt|userId|roleId|permissionId|.*Id|.*At|.*By|.*Type|.*Status|.*Name|.*Value|.*Key|.*Pkey|.*_pkey|.*_key|.*_.*|Create|Read|Update|Delete|List|Manage|Approve|Reject)$",
            match: false,
          },
        },
        {
          selector: "objectLiteralProperty",
          format: null, // Allow any format for object properties
          filter: {
            // Allow GraphQL patterns, API routes, and other special cases
            regex:
              "^(__|_|[A-Z]|-|/|\\d+|\\d+\\.\\d+|.*_.*|.*Pkey|.*_pkey|.*_key|bool_and|bool_or|data-|x-hasura-).*",
            match: true,
          },
        },
        {
          selector: "typeProperty",
          format: null, // Allow any format for type properties
          filter: {
            // Allow GraphQL patterns like __typename, _set, _inc, etc.
            regex:
              "^(__|_|bool_|.*_.*|.*Pkey|.*_pkey|.*_key|ID|String|Boolean|Int|Float).*",
            match: true,
          },
        },
        {
          selector: "classProperty",
          format: ["camelCase", "UPPER_CASE"], // Allow constants in classes
        },
      ],

      // General JavaScript rules
      "no-console": "off", // Allow console logs during development
      "no-unused-vars": "off", // Handled by TypeScript rule above
      "prefer-const": "error",
      "no-var": "error",

      // Import rules (relaxed)
      "import/order": "warn",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // TypeScript-specific overrides (none needed currently)
    },
  },
  {
    files: ["**/*.js", "**/*.jsx"],
    rules: {
      // JavaScript-specific overrides (none needed currently)
    },
  },
  {
    files: ["**/api/**/*.ts", "**/api/**/*.js"],
    rules: {
      // API routes specific rules
      "no-console": "off", // Allow console logs in API routes
    },
  },
  {
    files: ["**/*.config.js", "**/*.config.ts", "**/middleware.ts"],
    rules: {
      // Config files specific rules
      "no-console": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/naming-convention": "off", // Allow __filename, __dirname in config files
    },
  },
  {
    files: ["**/design-tokens/**/*.ts"],
    rules: {
      "@typescript-eslint/naming-convention": "off", // CSS variables need dashes
    },
  },
  {
    files: ["**/security/**/*.ts", "**/logging/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn", // Gradual migration
    },
  },
  // ================================
  // GRAPHQL-SPECIFIC OVERRIDES
  // ================================
  {
    files: ["**/graphql/**/*.ts", "**/*.generated.ts", "**/generated/**/*.ts"],
    rules: {
      "@typescript-eslint/naming-convention": "off", // Disable all naming conventions for GraphQL files
    },
  },
  {
    files: ["**/domains/**/graphql/**/*.ts"],
    rules: {
      "@typescript-eslint/naming-convention": "off", // Disable for domain GraphQL files
    },
  },
  {
    files: ["**/shared/types/**/*.ts", "**/types/**/*.ts"],
    rules: {
      "@typescript-eslint/naming-convention": "off", // Disable for shared type files (often contain GraphQL types)
    },
  },
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "build/**",
      "dist/**",
      ".vercel/**",
      "**/*.generated.ts",
      "**/generated/**",
      "**/*.d.ts",
      "coverage/**",
      ".env*",
      "public/**",
      "hasura/**/*.yaml",
      "hasura/**/*.yml",
      "**/*.sql",
      "docs/**/*.md",
      "*.md",
      "graphql/schema/schema.graphql",
      "backups/**",
      "_backup_delete/**",
      "*.md",
      ".cursorrules",
      "eslint.config.js",
      "tsconfig.json",
      "tsconfig.production.json",
      "tsconfig.test.json",
      "tsconfig.test.production.json",
      "tsconfig.test.production.json",
    ],
  },

  // Auto-fix rules for unused variables
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
    },
  },
];

export default eslintConfig;
