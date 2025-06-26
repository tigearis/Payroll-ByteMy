# Payroll Matrix - Enterprise Payroll Management System

[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)
[![Clerk](https://img.shields.io/badge/Clerk-6.20.2-purple)](https://clerk.com/)
[![GraphQL](https://img.shields.io/badge/GraphQL-Hasura-pink)](https://hasura.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue)](https://neon.tech/)
[![SOC2](https://img.shields.io/badge/SOC2-Type%20II-green)](https://www.aicpa.org/soc2)

A comprehensive, SOC2-compliant payroll management system built for Australian businesses. Features enterprise-grade security, role-based access control, and complete payroll processing workflows with real-time GraphQL operations.

## 🏗️ System Architecture

**Payroll Matrix** is built using modern enterprise architecture patterns:

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript 5.8
- **Authentication**: Clerk with JWT integration and MFA support
- **Database**: PostgreSQL (Neon) with Row Level Security
- **API Layer**: Hasura GraphQL Engine with custom business logic
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Apollo Client with optimistic updates
- **Infrastructure**: Vercel serverless deployment

### Domain-Driven Design

The application follows DDD principles with 11 isolated business domains:

```
domains/
├── auth/          # User authentication and authorization (CRITICAL)
├── users/         # User management and staff lifecycle (HIGH)
├── clients/       # Client relationship management (HIGH)
├── payrolls/      # Core payroll processing engine (MEDIUM)
├── audit/         # SOC2 compliance and audit logging (CRITICAL)
├── billing/       # Billing and invoicing system (HIGH)
└── external/      # Third-party integrations (MEDIUM)
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17+ (LTS recommended)
- pnpm 10.12.1+
- PostgreSQL database (or Neon account)
- Clerk account for authentication
- Hasura Cloud account

### Installation

```bash
# Clone the repository
git clone https://github.com/yourorg/payroll-matrix.git
cd payroll-matrix

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Generate GraphQL types
pnpm codegen

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`.

## 📋 Core Features

### 🔐 Enterprise Authentication

- **Clerk Integration**: Modern authentication with social logins
- **Role-Based Access Control**: 5-tier role hierarchy (Developer → Org Admin → Manager → Consultant → Viewer)
- **Multi-Factor Authentication**: Enhanced security for sensitive operations
- **JWT with Hasura Claims**: Seamless GraphQL authorization

### 💼 Payroll Management

- **Multiple Frequencies**: Weekly, fortnightly, bi-monthly, monthly, quarterly
- **Australian Tax Compliance**: ATO-compliant calculations with automatic updates
- **Business Day Logic**: Intelligent holiday and weekend adjustments
- **EFT Processing**: Configurable processing lead times
- **Version Control**: Complete payroll versioning with audit trails

### 👥 Staff & Client Management

- **Hierarchical User Management**: Manager-staff relationships
- **Client Onboarding**: Comprehensive client setup workflows
- **Staff Assignments**: Flexible consultant and backup assignment
- **Leave Management**: Integrated leave tracking and approval

### 🛡️ Security & Compliance

**🔒 Production-Ready Security (Updated December 2024)**
- **SOC2 Type II Compliance**: 95%+ compliance score with comprehensive audit logging
- **Zero Critical Vulnerabilities**: All security issues resolved and validated
- **Enterprise-Grade Protection**: 23 granular permissions across 5 role levels
- **OAuth Security**: Fixed privilege escalation with least-privilege defaults
- **Component Guards**: 100% coverage on sensitive UI components
- **API Security**: Complete authentication and authorization on all endpoints
- **Data Classification**: 4-tier security levels (CRITICAL, HIGH, MEDIUM, LOW)
- **Row Level Security**: Database-level access controls
- **Comprehensive Audit Trail**: All user actions logged for compliance

### 📊 Real-Time Operations

- **GraphQL Subscriptions**: Live updates across all clients
- **Optimistic Updates**: Immediate UI feedback with conflict resolution
- **Intelligent Caching**: Apollo Client with smart cache management
- **Background Jobs**: Automated payroll date generation and processing

## 🏢 User Roles & Permissions

| Role           | Access Level    | Key Permissions                                         |
| -------------- | --------------- | ------------------------------------------------------- |
| **Developer**  | Full System     | System administration, debugging tools, database access |
| **Org Admin**  | Administrative  | User management, system settings, compliance reports    |
| **Manager**    | Team Management | Payroll oversight, staff assignments, client management |
| **Consultant** | Operational     | Payroll processing, client interaction, task completion |
| **Viewer**     | Read-Only       | Dashboard access, report viewing, limited data access   |

## 📚 Documentation Structure

### Core Documentation

- **[Architecture Guide](docs/COMPLETE_SYSTEM_ARCHITECTURE.md)** - System design and technical architecture
- **[Authentication System](docs/AUTHENTICATION_SYSTEM_DOCUMENTATION.md)** - Clerk integration and security model
- **[Security Analysis](docs/SECURITY_IMPROVEMENT_REPORT.md)** - Security implementation and SOC2 compliance
- **[SOC2 Compliance](docs/SOC2_COMPLIANCE_OVERVIEW.md)** - Detailed compliance documentation
- **[Payroll System](docs/PAYROLL_SYSTEM_DOCUMENTATION.md)** - Core payroll processing logic

### 🔒 Security Documentation (Updated December 2024)

- **[Security Audit Completion Report](docs/security/SECURITY_AUDIT_COMPLETION_REPORT.md)** - ✅ **NEW**: Complete security fixes summary
- **[Permission System Guide](docs/PERMISSION_SYSTEM_GUIDE.md)** - Updated with 23 granular permissions
- **[Component Permission Guards](docs/security/COMPONENT_PERMISSION_GUARDS_GUIDE.md)** - ✅ **NEW**: Component protection guide
- **[API Authentication Guide](docs/security/API_AUTHENTICATION_GUIDE.md)** - ✅ **NEW**: Production-ready API security

### Development Guides

- **[Setup & Configuration](docs/DEPLOYMENT_GUIDE.md)** - Development environment setup
- **[GraphQL Development](docs/hasura/GRAPHQL_DEVELOPMENT_WORKFLOW.md)** - GraphQL schema and operations
- **[Code Generation](docs/CODEGEN_SYSTEM.md)** - TypeScript code generation workflow
- **[Component Architecture](docs/components/README.md)** - UI component patterns and usage

### Business Logic

- **[Payroll Calculations](docs/business-logic/paycalculator-logic.md)** - Australian tax calculation engine
- **[Payroll Processing](docs/business-logic/payroll-processing.md)** - Complete payroll workflows
- **[Validation Rules](docs/business-logic/payroll-restrictions-and-validation.md)** - Business rule enforcement

### API Documentation

- **[API Routes](docs/pages/api/README.md)** - Complete API endpoint documentation
- **[GraphQL Schema](docs/hasura/README.md)** - GraphQL operations and relationships
- **[Authentication API](docs/app/README.md)** - Authentication and authorization endpoints

## 🎯 Application Flow

### User Journey

1. **Authentication** → Clerk-managed login with role assignment
2. **Dashboard** → Personalized dashboard with role-based widgets
3. **Client Management** → Create and manage client relationships
4. **Payroll Setup** → Configure payroll frequencies and processing rules
5. **Staff Assignment** → Assign consultants and managers to payrolls
6. **Processing** → Execute payroll runs with automatic calculations
7. **Compliance** → Generate reports and maintain audit trails

### Data Flow Architecture

```
Frontend (Next.js) → Apollo Client → Hasura GraphQL → PostgreSQL
                  ↓
               Clerk Auth → JWT Claims → Row Level Security
                  ↓
            Audit Logger → Compliance Database → SOC2 Reports
```

## 🔧 Development Workflow

### Code Generation

```bash
# Generate GraphQL types and operations
pnpm codegen

# Watch for GraphQL changes during development
pnpm codegen:watch
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run type checking
pnpm type-check
```

### Database Operations

```bash
# Apply Hasura migrations
pnpm hasura:migrate

# Update Hasura metadata
pnpm hasura:metadata
```

## 🌍 Deployment

### Environment Variables

Essential environment variables for deployment:

```bash
# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Database & GraphQL
HASURA_GRAPHQL_URL=
HASURA_ADMIN_SECRET=
DATABASE_URL=

# OpenAI Integration
OPENAI_API_KEY=

# Deployment
NEXT_PUBLIC_SITE_URL=
```

### Deployment Platforms

- **Primary**: Vercel (recommended)
- **Database**: Neon PostgreSQL
- **GraphQL**: Hasura Cloud
- **Authentication**: Clerk

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes following conventional commits
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for Next.js and TypeScript
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks for quality assurance
- **Conventional Commits**: Standardized commit messages

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For development support and questions:

- **Documentation**: Start with the `/docs` directory
- **Issues**: Create GitHub issues for bugs and feature requests
- **Security**: Report security issues privately to the security team

## 🔗 Related Resources

- **[Next.js Documentation](https://nextjs.org/docs)** - Next.js framework guide
- **[Clerk Documentation](https://clerk.com/docs)** - Authentication provider
- **[Hasura Documentation](https://hasura.io/docs/)** - GraphQL engine
- **[Apollo Client](https://www.apollographql.com/docs/react/)** - GraphQL client
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Utility-first CSS
- **[shadcn/ui](https://ui.shadcn.com/)** - Component library

---

**Payroll Matrix** - Enterprise-grade payroll management for modern businesses.
