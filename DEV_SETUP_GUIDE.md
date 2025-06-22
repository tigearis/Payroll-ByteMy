# Payroll ByteMy - Development Environment Setup Guide

This guide will help you set up a complete development environment for the Payroll ByteMy application with real data access.

## 🚀 Quick Start

Your development environment is already configured and ready to go! Here's what's currently set up:

### ✅ Current Status

- ✅ **Dependencies installed**: All packages are up to date
- ✅ **GraphQL types generated**: Code generation completed successfully
- ✅ **Development server running**: Available at http://localhost:3000
- ✅ **Database connected**: Neon PostgreSQL with real data
- ✅ **Authentication configured**: Clerk with JWT integration
- ✅ **GraphQL API connected**: Hasura GraphQL Engine

## 🔧 Development Environment Overview

### Current Configuration

```bash
# Application URL
http://localhost:3000

# GraphQL Playground
https://bytemy.hasura.app/console

# Database
PostgreSQL (Neon) - Connected with real production data

# Authentication
Clerk - Live authentication system
```

## 🛠️ Development Workflow

### 1. Start Development Server

```bash
pnpm dev
```

The server runs with Turbopack for fast hot reloading.

### 2. GraphQL Development

```bash
# Generate types after schema changes
pnpm codegen

# Watch for changes during development
pnpm codegen:watch

# Debug GraphQL generation
pnpm codegen:debug
```

### 3. Code Quality

```bash
# Run linting
pnpm lint

# Fix linting issues
pnpm lint:fix

# Check formatting
pnpm format:check

# Fix formatting
pnpm format

# Complete quality check
pnpm quality:check
```

## 📊 Real Data Access

Your development environment is connected to real production data:

### Database Connection

- **Host**: `ep-black-sunset-a7wbc0zq-pooler.ap-southeast-2.aws.neon.tech`
- **Database**: `neondb`
- **SSL**: Required
- **Connection Pooling**: Enabled

### GraphQL API

- **Endpoint**: `https://bytemy.hasura.app/v1/graphql`
- **Admin Secret**: Configured in environment
- **JWT Authentication**: Integrated with Clerk

### Authentication

- **Provider**: Clerk (Live)
- **Domain**: `https://clerk.bytemy.com.au`
- **JWT Integration**: Configured for Hasura

## 🔐 User Roles & Access

The system has 5 user roles with different access levels:

| Role           | Access Level    | Description                            |
| -------------- | --------------- | -------------------------------------- |
| **Developer**  | Full System     | System administration, debugging tools |
| **Org Admin**  | Administrative  | User management, system settings       |
| **Manager**    | Team Management | Payroll oversight, staff assignments   |
| **Consultant** | Operational     | Payroll processing, client interaction |
| **Viewer**     | Read-Only       | Dashboard access, report viewing       |

## 🧪 Testing & Debugging

### Authentication Testing

```bash
# Test authentication flows
node scripts/test-auth-fixes.js

# Note: Some tests may fail with 404 errors - this is expected behavior
# The application correctly requires authentication for API routes
```

### Database Testing

```bash
# Test database connection
node tests/test-db-direct.mjs

# Test GraphQL operations
node tests/test-developer-api.js
```

### API Testing

**Important**: All API routes require authentication. You must sign in to the application first.

1. **Sign in to the application**: Visit `http://localhost:3000/sign-in`
2. **Test API endpoints**: Use browser developer tools or authenticated requests

```bash
# API endpoints require authentication - they will redirect to sign-in if not authenticated
# This is the correct security behavior for the application

# To test API endpoints:
# 1. Sign in to the application at http://localhost:3000/sign-in
# 2. Use browser developer tools to make authenticated requests
# 3. Or use the built-in developer tools at http://localhost:3000/developer
```

### Security Features Working Correctly

- ✅ **API Protection**: All API routes require authentication
- ✅ **Middleware Security**: Clerk middleware protects all routes by default
- ✅ **Audit Logging**: All authenticated requests are logged
- ✅ **Route Protection**: Only public routes are accessible without authentication

## 🚀 Available Features

### Core Functionality

- ✅ **User Management**: Create, update, delete users
- ✅ **Client Management**: Manage client relationships
- ✅ **Payroll Processing**: Complete payroll workflows
- ✅ **Staff Assignments**: Assign consultants to payrolls
- ✅ **Leave Management**: Track and approve leave requests
- ✅ **Audit Logging**: SOC2-compliant audit trails

### Development Tools

- ✅ **GraphQL Playground**: Interactive API explorer
- ✅ **Authentication Debug Panel**: Test auth flows
- ✅ **Database Admin**: Direct database access
- ✅ **API Documentation**: Comprehensive endpoint docs

## 📱 Accessing the Application

### Main Application

```bash
# Open in browser
open http://localhost:3000
```

### Key Pages

- **Dashboard**: `http://localhost:3000/dashboard`
- **Clients**: `http://localhost:3000/clients`
- **Payrolls**: `http://localhost:3000/payrolls`
- **Staff**: `http://localhost:3000/staff`
- **Security**: `http://localhost:3000/security`

### Development Pages

- **Developer Tools**: `http://localhost:3000/developer`
- **JWT Test**: `http://localhost:3000/jwt-test`
- **Loading Demo**: `http://localhost:3000/developer/loading-demo`

## 🔧 Configuration Details

### Environment Variables

Your `.env.local` file is already configured with:

- Database connections (pooled and direct)
- Clerk authentication
- Hasura GraphQL API
- Webhook secrets
- Cron job protection

### GraphQL Schema

- **Auto-generated types**: Located in `shared/types/generated/`
- **Operations**: Domain-specific GraphQL operations
- **Fragments**: Reusable GraphQL fragments

### Authentication Flow

1. User signs in via Clerk
2. JWT token issued with Hasura claims
3. Token validated by middleware
4. Database access controlled by Row Level Security

## 🛡️ Security Features

### Row Level Security

- Database-level access controls
- User-specific data filtering
- Role-based permissions

### Audit Logging

- All user actions logged
- SOC2 compliance features
- Security event tracking

### API Protection

- JWT token validation
- Role-based access control
- Rate limiting
- CORS protection

## 🎯 Getting Started with the Application

### Step 1: Sign In

1. **Visit the application**: `http://localhost:3000`
2. **Click "Sign In"** or go directly to `http://localhost:3000/sign-in`
3. **Create an account** or sign in with existing credentials
4. **Complete onboarding** if prompted

### Step 2: Explore the Features

1. **Dashboard**: View your personalized dashboard at `http://localhost:3000/dashboard`
2. **Client Management**: Create and manage clients at `http://localhost:3000/clients`
3. **Payroll Processing**: Set up payrolls at `http://localhost:3000/payrolls`
4. **Staff Management**: Manage staff at `http://localhost:3000/staff`
5. **Developer Tools**: Access debug tools at `http://localhost:3000/developer`

### Step 3: Test with Real Data

- **Create test clients**: Use the client creation flow
- **Set up payrolls**: Configure payroll schedules and assignments
- **Test role permissions**: Different user roles have different access levels
- **Review audit logs**: Check security logs at `http://localhost:3000/security/audit`

### Step 4: Development Tasks

1. **Review Code**: Explore the domain-driven architecture
2. **Check GraphQL**: Use the Hasura console for API exploration
3. **Test API Endpoints**: Use authenticated browser requests
4. **Modify Features**: Make changes and see them reflected immediately

## 🆘 Troubleshooting

### Common Issues

**Server won't start**:

```bash
# Kill existing processes
lsof -ti:3000 | xargs kill -9
pnpm dev
```

**GraphQL errors**:

```bash
# Regenerate types
pnpm codegen
```

**Authentication issues**:

```bash
# Test auth configuration
node scripts/test-auth-fixes.js
```

**Database connection errors**:

```bash
# Test database connection
node tests/test-db-direct.mjs
```

## 📚 Additional Resources

- **[Architecture Documentation](docs/README.md)**: Complete system architecture
- **[API Documentation](docs/pages/api/README.md)**: API endpoint reference
- **[Security Guide](docs/security/)**: Security implementation details
- **[GraphQL Development](docs/hasura/GRAPHQL_DEVELOPMENT_WORKFLOW.md)**: GraphQL workflow

---

**Your development environment is ready!** 🎉

Visit `http://localhost:3000` to start exploring the application with real data.
