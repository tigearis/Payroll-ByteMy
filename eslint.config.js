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
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-empty-object-type": "off", // Allow empty interfaces for extending
      
      // ================================
      // CASE CONVENTION RULES
      // ================================
      "@typescript-eslint/naming-convention": [
        "error",
        // Variables, functions, and methods - camelCase
        {
          selector: "variableLike",
          format: ["camelCase"],
          leadingUnderscore: "allow",
          filter: {
            // Allow PascalCase for React components
            regex: "^(React|Component|Element|JSX)",
            match: false,
          },
        },
        {
          selector: "function",
          format: ["camelCase", "PascalCase"], // Allow PascalCase for React components
        },
        {
          selector: "method",
          format: ["camelCase"],
        },
        
        // Constants - SCREAMING_SNAKE_CASE or camelCase
        {
          selector: "variable",
          modifiers: ["const"],
          format: ["camelCase", "UPPER_CASE", "PascalCase"], // Flexible for different constant types
        },
        
        // Types, interfaces, enums - PascalCase
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        {
          selector: "interface",
          format: ["PascalCase"],
        },
        {
          selector: "typeAlias",
          format: ["PascalCase"],
        },
        {
          selector: "enum",
          format: ["PascalCase"],
        },
        {
          selector: "enumMember",
          format: ["PascalCase", "UPPER_CASE"],
        },
        
        // Class-related - PascalCase
        {
          selector: "class",
          format: ["PascalCase"],
        },
        {
          selector: "property",
          format: ["camelCase", "PascalCase", "snake_case"], // Allow snake_case for database fields
          leadingUnderscore: "allow",
        },
        
        // Parameters - camelCase
        {
          selector: "parameter",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        
        // Import names - flexible
        {
          selector: "import",
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
        },
      ],
      
      // General JavaScript rules
      "no-console": "off", // Allow console logs during development
      "no-unused-vars": "off", // Handled by TypeScript rule above
      "prefer-const": "error",
      "no-var": "error",
      
      // Import rules (relaxed)
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "ignore",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
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
];

export default eslintConfig;