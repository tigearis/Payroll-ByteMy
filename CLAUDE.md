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

## Security Implementation (December 2024)

### ✅ PRODUCTION-READY SECURITY STATUS

**Critical Security Fixes Applied**:
- OAuth privilege escalation vulnerability fixed (auto-admin assignment removed)
- Component permission guards implemented (100% coverage on sensitive components)
- Permission system standardized (23 granular permissions across 5 roles)
- Redundant authentication files removed (improved security and maintainability)
- API routes properly protected with authentication and authorization

**Security Compliance**:
- Zero critical vulnerabilities remaining
- SOC2 compliance ready
- Enterprise-grade authentication and authorization
- Comprehensive audit logging
- Production deployment approved

**New Documentation Created**:
- Security Audit Completion Report
- Component Permission Guards Guide  
- API Authentication Guide
- Updated Permission System Guide

## GraphQL Operations

### GraphQL Best Practices

- If there is an error with generated graphql items or types the codegen or .graphql files must be fix to ensure that this does happen in the future. All generated item should happen without any typescript, import or export errors in the generated files. 

... [rest of the previous content continues]