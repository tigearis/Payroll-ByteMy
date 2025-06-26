# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm codegen` - Generate GraphQL types from schema
- `pnpm codegen:watch` - Watch mode for GraphQL code generation

... [previous content remains unchanged]

## GraphQL Operations

### GraphQL Best Practices

- If there is an error with generated graphql items or types the codegen or .graphql files must be fix to ensure that this does happen in the future. All generated item should happen without any typescript, import or export errors in the generated files. 

... [rest of the previous content continues]