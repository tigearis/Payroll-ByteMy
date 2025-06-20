# Payroll ByteMy - Complete System Documentation

## Overview

Payroll ByteMy is an enterprise-grade payroll management system built with Next.js 15, React 19, TypeScript, and Hasura GraphQL. The system implements SOC2-compliant security, comprehensive audit logging, and role-based access control for secure payroll processing and employee management.

## 📚 Core Documentation

This project's documentation has been consolidated into a set of authoritative guides. Please refer to these documents for detailed information.

- **[System Architecture](./COMPLETE_SYSTEM_ARCHITECTURE.md)**: The single source of truth for architecture, business logic, and data models.
- **[Authentication System](./AUTHENTICATION_SYSTEM_DOCUMENTATION.md)**: A deep dive into Clerk integration, JWTs, session management, and role synchronization.
- **[Security Report](./SECURITY_IMPROVEMENT_REPORT.md)**: A comprehensive security audit, risk analysis, and description of key security implementations.
- **[Payroll System](./PAYROLL_SYSTEM_DOCUMENTATION.md)**: Detailed documentation on the core payroll processing functionality, compliance, and architecture.
- **[Hasura & GraphQL API](./HASURA_DOCUMENTATION.md)**: An overview of the Hasura configuration, security model, actions, and GraphQL schema.
- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)**: Step-by-step instructions for deploying the application to production.
- **[GraphQL Code Generation](./CODEGEN_SYSTEM.md)**: Documentation for the automated system that generates TypeScript types and hooks.

## Technology Stack

- **Frontend**: Next.js 15 (App Router) + React 19 + TypeScript
- **Authentication**: Clerk with custom JWT templates for Hasura integration
- **Database**: PostgreSQL (Neon) with comprehensive row-level security
- **GraphQL API**: Hasura GraphQL Engine with metadata-driven configuration
- **Styling**: Tailwind CSS + shadcn/ui components
- **Package Manager**: pnpm 10.12.1
- **Hosting**: Vercel with serverless functions

## Architecture Overview

### Enterprise Architecture Features

- **Domain-Driven Design**: Business logic organized by functional domains
- **Security-First Approach**: SOC2 compliance with comprehensive audit logging
- **Role-Based Access Control**: 5-tier hierarchical role system with 18 granular permissions
- **Native Clerk Integration**: Optimized authentication eliminating 1,200+ lines of custom code
- **Metadata-Driven GraphQL**: Complete Hasura configuration with automated deployments

### Security & Compliance

- **SOC2 Type II Compliance**: Comprehensive audit trails and data protection
- **Multi-Layer Authentication**: Clerk + Database user verification + Component-level guards
- **Data Classification**: 4-level data classification system (CRITICAL, HIGH, MEDIUM, LOW)
- **Automated Audit Logging**: Complete audit trail for all business operations
- **7-Year Retention**: Compliance-driven data retention and lifecycle management

## Documentation Structure

This documentation is organized by the actual folder structure of the application:

### 📁 Core Application Documentation

#### [App Directory (`/app`)](./app/README.md)

Complete Next.js App Router implementation with authentication and business logic:

- **Route Groups**: `(auth)` and `(dashboard)` organization
- **API Routes**: RESTful endpoints with role-based access control
- **Authentication Flow**: Clerk integration with custom JWT templates
- **Security Middleware**: Comprehensive route protection and audit logging

#### [Dashboard Routes (`/app/(dashboard)`)](./app/dashboard/README.md)

Protected application routes for payroll management:

- **Payroll Management**: Complete payroll processing workflows
- **Staff Management**: Employee lifecycle and role management
- **Client Management**: Customer relationship management
- **Security Dashboard**: SOC2 compliance and audit interfaces

### 🧩 Component Architecture

#### [Components (`/components`)](./components/README.md)

Layered component architecture with security integration:

- **Authentication Guards**: Role-based and permission-based access control
- **Business Components**: Domain-specific UI components
- **Error Boundaries**: Comprehensive error handling and recovery
- **Design System**: shadcn/ui based design system with enterprise extensions

### 🚀 API & Backend

#### [API Routes (`/app/api`)](./pages/api/README.md)

RESTful API layer with enterprise security:

- **Authentication Endpoints**: Token management and validation
- **Staff Operations**: Employee management with Clerk integration
- **Payroll Processing**: Financial calculations and approval workflows
- **Webhook Handlers**: External system integration and user synchronization

#### [Library Functions (`/lib`)](./lib/README.md)

Core infrastructure and shared utilities:

- **Authentication System**: Clerk integration and session management
- **Apollo GraphQL**: Unified client factory with automatic token injection
- **Security Infrastructure**: Permission system and audit logging
- **Utility Functions**: Date handling, error management, and formatting

### 🏢 Business Logic Organization

#### [Domains (`/domains`)](./domains/README.md)

Domain-driven design with security classification:

- **Authentication Domain** (CRITICAL): Core security operations
- **Users Domain** (HIGH): Employee PII and role management
- **Clients Domain** (HIGH): Customer data and relationships
- **Payrolls Domain** (MEDIUM): Payroll processing and calculations
- **Audit Domain** (CRITICAL): Compliance and audit logging

#### [Custom Hooks (`/hooks`)](./hooks/README.md)

React hooks with business logic encapsulation:

- **Authentication Hooks**: User role and permission management
- **Data Management**: GraphQL operations with error handling
- **Business Logic**: Payroll creation and versioning workflows
- **Real-time Features**: Subscriptions and polling strategies

### 🗄️ Data Layer

#### [Hasura Configuration (`/hasura`)](./hasura/README.md)

Metadata-driven GraphQL API with comprehensive security:

- **Role-Based Permissions**: 5-tier role hierarchy with row-level security
- **Custom Functions**: Business logic enforcement at database level
- **Audit Integration**: Complete audit trail for all data operations
- **Performance Optimization**: Strategic indexing and query optimization

#### [Shared Utilities (`/shared`)](./shared/README.md)

Cross-domain utilities and type definitions:

- **Common Types**: Shared TypeScript definitions and GraphQL scalars
- **Validation Schemas**: Business rule validation and input sanitization
- **Utility Functions**: Date calculations, formatting, and constants
- **Configuration**: Feature flags and environment management

## 🔒 Security Analysis

### [Security Improvement Report](./SECURITY_IMPROVEMENT_REPORT.md)

Comprehensive security audit with actionable recommendations:

- **Critical Security Issues**: 4 critical vulnerabilities requiring immediate attention
- **SOC2 Compliance Analysis**: Compliance gaps and remediation steps
- **Technical Debt Inventory**: Code quality issues affecting security
- **Business Logic Risks**: Client-side exposure and validation gaps

## Key System Features

### Authentication & Authorization

- **Clerk Native Integration**: JWT templates with Hasura claims
- **Multi-Layer Security**: Route, component, and data-level protection
- **Role Hierarchy**: Developer > Org Admin > Manager > Consultant > Viewer
- **Permission System**: 18 granular permissions across 5 categories

### Business Operations

- **Payroll Processing**: Complete payroll lifecycle with calculations
- **Employee Management**: Onboarding, role management, and offboarding
- **Client Management**: CRM with engagement and financial tracking
- **Audit & Compliance**: SOC2-compliant logging and reporting

### Data Protection

- **Row-Level Security**: Hasura RLS policies for data protection
- **Data Classification**: Security-based data handling and retention
- **Audit Logging**: Complete audit trail for compliance
- **Encryption**: Data encryption in transit and at rest

### Performance & Scalability

- **Apollo GraphQL**: Unified client with WebSocket subscriptions
- **Server-Side Rendering**: Optimized page loads with security
- **Real-time Updates**: Live data synchronization across clients
- **Efficient Caching**: Strategic caching with invalidation policies

## Development Workflow

### Environment Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Generate GraphQL types
pnpm codegen

# Run linting and validation
pnpm lint
pnpm validate:naming
```

### Security & Compliance

```bash
# Run security audit
pnpm audit

# Validate case conventions
pnpm validate:naming

# Check SOC2 compliance
pnpm audit:compliance
```

### Code Generation

```bash
# Generate all GraphQL types
pnpm codegen

# Watch mode for development
pnpm codegen:watch

# Validate generated types
pnpm validate:types
```

## Quick Navigation

### 🚨 Critical Areas

- [Security Report](./SECURITY_IMPROVEMENT_REPORT.md) - **START HERE** for security analysis
- [Authentication System](./AUTHENTICATION_SYSTEM_DOCUMENTATION.md) - Core auth implementation
- [API Security](./pages/api/README.md#security-implementation) - Backend security patterns
- [Hasura Permissions](./hasura/README.md#security-architecture) - Database-level security

### 🏗️ Architecture Deep Dives

- [Complete System Architecture](./COMPLETE_SYSTEM_ARCHITECTURE.md) - The single source of truth for architecture, business logic, and data models.

### 🔧 Developer Resources

- [Shared Utilities](./shared/README.md) - Reusable functions and types
- [Custom Hooks](./hooks/README.md) - React hook patterns
- [Code Conventions](./shared/README.md#configuration-management) - Naming and style guidelines
- [Testing Strategy](./components/README.md#testing-strategy) - Testing approaches

## Getting Started

1. **Security First**: Review the **[Security Report](./SECURITY_IMPROVEMENT_REPORT.md)**.
2. **Understand the Big Picture**: Read the **[System Architecture](./COMPLETE_SYSTEM_ARCHITECTURE.md)** document.
3. **Authentication Flow**: Study the **[Authentication System](./AUTHENTICATION_SYSTEM_DOCUMENTATION.md)** guide.
4. **Deployment**: Familiarize yourself with the **[Deployment Guide](./DEPLOYMENT_GUIDE.md)**.
5. **Core Business Logic**: Dive into the **[Payroll System](./PAYROLL_SYSTEM_DOCUMENTATION.md)** documentation.

## Contributing

### Code Quality Standards

- **TypeScript Strict Mode**: No `any` types allowed in production code
- **Case Conventions**: Enforced kebab-case for files, PascalCase for components
- **Security Reviews**: All changes require security impact assessment
- **Audit Compliance**: All business operations must include audit logging

### Security Requirements

- **Permission Validation**: All new features require permission checking
- **Input Validation**: Zod schemas required for all API endpoints
- **Audit Logging**: Business operations must include comprehensive audit trails
- **SOC2 Compliance**: All changes must maintain SOC2 compliance requirements

This documentation provides a comprehensive guide to understanding, maintaining, and extending the Payroll ByteMy system while ensuring security, compliance, and code quality standards are maintained.
