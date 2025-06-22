import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
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
      // CASE CONVENTION RULES
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
          selector: "enumMember",
          format: ["UPPER_CASE"],
        },
        {
          selector: "objectLiteralProperty",
          format: null,
          filter: {
            regex: "^(--|[A-Z]|-|/api/|\\d+|\\d+\\.\\d+).*",
            match: true,
          },
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
    ],
  },

  // Auto-fix rules for unused variables
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_",
          "destructuredArrayIgnorePattern": "^_"
        }
      ]
    }
  },
];

export default eslintConfig;
