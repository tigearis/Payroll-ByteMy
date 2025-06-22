# Complete Setup & Configuration Guide - Payroll Matrix

## Table of Contents

1. [Development Environment Setup](#development-environment-setup)
2. [Environment Variables Configuration](#environment-variables-configuration)
3. [Database Setup & Migrations](#database-setup--migrations)
4. [Authentication Configuration](#authentication-configuration)
5. [GraphQL & Hasura Setup](#graphql--hasura-setup)
6. [Code Generation Setup](#code-generation-setup)
7. [Deployment Configuration](#deployment-configuration)
8. [Development Workflow](#development-workflow)
9. [Troubleshooting Guide](#troubleshooting-guide)
10. [Production Deployment](#production-deployment)

---

## Development Environment Setup

### Prerequisites

#### Required Software
```bash
# Node.js (LTS version recommended)
node --version  # Should be >= 18.17.0
npm --version   # Should be >= 9.0.0

# pnpm (preferred package manager)
npm install -g pnpm@10.12.1
pnpm --version

# Git
git --version

# Docker (optional for local Hasura)
docker --version
docker-compose --version
```

#### Development Tools (Recommended)
- **VS Code** with extensions:
  - GraphQL: Language Feature Support
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - Clerk
  - Apollo GraphQL
- **GitHub CLI** (optional): `gh --version`
- **Hasura CLI**: `hasura version`

### Project Setup

#### 1. Clone Repository
```bash
# Clone the repository
git clone https://github.com/yourorg/payroll-matrix.git
cd payroll-matrix

# Verify project structure
ls -la
```

#### 2. Install Dependencies
```bash
# Install all dependencies
pnpm install

# Verify installation
pnpm list --depth=0
```

#### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env.local

# Open for editing
code .env.local
```

---

## Environment Variables Configuration

### Development Environment (.env.local)

```bash
# ====================================
# DATABASE CONFIGURATION
# ====================================
# Neon PostgreSQL Database URL
DATABASE_URL="postgresql://username:password@host:5432/database"

# ====================================
# AUTHENTICATION (CLERK)
# ====================================
# Clerk Keys (from Clerk Dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Authentication URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/onboarding"

# Webhook endpoint (for local development)
CLERK_WEBHOOK_URL="http://localhost:3000/api/webhooks/clerk"

# ====================================
# GRAPHQL & HASURA
# ====================================
# Hasura GraphQL endpoint
HASURA_GRAPHQL_URL="https://your-project.hasura.app/v1/graphql"

# Hasura Admin Secret
HASURA_ADMIN_SECRET="your-admin-secret"

# Hasura Webhook URL (for authentication)
HASURA_WEBHOOK_URL="http://localhost:3000/api/auth/hasura-webhook"

# ====================================
# AI INTEGRATION
# ====================================
# OpenAI API Key for AI Assistant
OPENAI_API_KEY="sk-..."

# ====================================
# APPLICATION SETTINGS
# ====================================
# Site URL (for absolute URLs)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Environment
NODE_ENV="development"

# ====================================
# EXTERNAL SERVICES
# ====================================
# Holiday API (optional)
HOLIDAY_API_KEY="your-holiday-api-key"

# Email service (for notifications)
EMAIL_API_KEY="your-email-api-key"

# ====================================
# SECURITY
# ====================================
# JWT Secret for custom tokens
JWT_SECRET="your-jwt-secret-min-32-chars"

# Encryption key for sensitive data
ENCRYPTION_KEY="your-encryption-key-32-chars"

# ====================================
# DEVELOPMENT TOOLS
# ====================================
# Enable development features
NEXT_PUBLIC_DEV_MODE="true"

# Disable telemetry in development
NEXT_TELEMETRY_DISABLED="1"
```

### Production Environment Variables

```bash
# ====================================
# PRODUCTION DATABASE
# ====================================
DATABASE_URL="postgresql://prod-user:prod-pass@prod-host:5432/prod-db"

# ====================================
# PRODUCTION CLERK
# ====================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_..."
CLERK_SECRET_KEY="sk_live_..."

# ====================================
# PRODUCTION HASURA
# ====================================
HASURA_GRAPHQL_URL="https://prod-project.hasura.app/v1/graphql"
HASURA_ADMIN_SECRET="production-admin-secret"

# ====================================
# PRODUCTION SECURITY
# ====================================
JWT_SECRET="production-jwt-secret-minimum-32-characters"
ENCRYPTION_KEY="production-encryption-key-32-characters"

# ====================================
# PRODUCTION SETTINGS
# ====================================
NEXT_PUBLIC_SITE_URL="https://payroll-matrix.com"
NODE_ENV="production"
NEXT_PUBLIC_DEV_MODE="false"
```

---

## Database Setup & Migrations

### Option 1: Neon PostgreSQL (Recommended)

#### 1. Create Neon Project
```bash
# Go to https://neon.tech
# Create new project
# Copy connection string to DATABASE_URL
```

#### 2. Database Schema Setup
```bash
# Connect to database and run initial schema
psql $DATABASE_URL

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('developer', 'org_admin', 'manager', 'consultant', 'viewer');
CREATE TYPE payroll_status AS ENUM ('Active', 'Implementation', 'Inactive');
CREATE TYPE payroll_cycle_type AS ENUM ('weekly', 'fortnightly', 'bi_monthly', 'monthly', 'quarterly');
CREATE TYPE payroll_date_type AS ENUM ('fixed_date', 'eom', 'som', 'week_a', 'week_b', 'dow');
CREATE TYPE permission_action AS ENUM ('create', 'read', 'update', 'delete', 'list', 'manage', 'approve', 'reject');
CREATE TYPE leave_status_enum AS ENUM ('Pending', 'Approved', 'Rejected', 'Cancelled');
```

#### 3. Apply Database Migrations
```bash
# If using Hasura migrations
hasura migrate apply --project hasura --endpoint $HASURA_GRAPHQL_URL --admin-secret $HASURA_ADMIN_SECRET

# If using custom SQL scripts
psql $DATABASE_URL < database/schema.sql
psql $DATABASE_URL < database/seed-data.sql
```

### Option 2: Local PostgreSQL

#### 1. Install PostgreSQL
```bash
# macOS with Homebrew
brew install postgresql@15
brew services start postgresql@15

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql-15 postgresql-client-15

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### 2. Create Database
```bash
# Create user and database
sudo -u postgres psql

CREATE USER payroll_user WITH PASSWORD 'your_password';
CREATE DATABASE payroll_matrix OWNER payroll_user;
GRANT ALL PRIVILEGES ON DATABASE payroll_matrix TO payroll_user;

# Update DATABASE_URL
DATABASE_URL="postgresql://payroll_user:your_password@localhost:5432/payroll_matrix"
```

---

## Authentication Configuration

### Clerk Setup

#### 1. Create Clerk Application
```bash
# Go to https://clerk.com
# Sign up/Login
# Create new application
# Choose authentication methods:
#   - Email & Password (required)
#   - Google OAuth (recommended)
#   - Microsoft OAuth (optional)
```

#### 2. Configure JWT Template
```bash
# In Clerk Dashboard:
# Go to: Configure → JWT Templates
# Create new template named "hasura"
```

**JWT Template Configuration:**
```json
{
  "aud": "hasura",
  "iat": "{{date.now}}",
  "exp": "{{date.now_plus_24_hours}}",
  "iss": "{{app.id}}",
  "sub": "{{user.id}}",
  "https://hasura.io/jwt/claims": {
    "x-hasura-user-id": "{{user.public_metadata.databaseId}}",
    "x-hasura-default-role": "{{user.public_metadata.role || 'viewer'}}",
    "x-hasura-allowed-roles": [
      "{{user.public_metadata.role || 'viewer'}}",
      "viewer"
    ]
  },
  "metadata": {
    "role": "{{user.public_metadata.role}}",
    "databaseId": "{{user.public_metadata.databaseId}}"
  }
}
```

#### 3. Configure Webhooks
```bash
# In Clerk Dashboard:
# Go to: Configure → Webhooks
# Add endpoint: https://your-domain.com/api/webhooks/clerk
# Select events:
#   - user.created
#   - user.updated
#   - user.deleted
#   - session.created
#   - session.ended
```

#### 4. Set Public Metadata Schema
```bash
# In Clerk Dashboard:
# Go to: Configure → User & Authentication → Metadata
# Add public metadata schema:
```

```json
{
  "type": "object",
  "properties": {
    "role": {
      "type": "string",
      "enum": ["developer", "org_admin", "manager", "consultant", "viewer"]
    },
    "databaseId": {
      "type": "string",
      "format": "uuid"
    },
    "organizationId": {
      "type": "string",
      "format": "uuid"
    }
  }
}
```

---

## GraphQL & Hasura Setup

### Hasura Cloud Setup

#### 1. Create Hasura Project
```bash
# Go to https://cloud.hasura.io
# Create new project
# Connect your database (Neon PostgreSQL)
# Set admin secret
```

#### 2. Configure Environment Variables
```bash
# In Hasura Console:
# Go to: Settings → Env vars
# Add environment variables:

CLERK_JWT_SECRET="your-clerk-jwt-secret"
CLERK_WEBHOOK_SECRET="your-clerk-webhook-secret"
DATABASE_URL="your-database-url"
```

#### 3. Apply Hasura Metadata
```bash
# Install Hasura CLI
npm install -g hasura-cli

# Initialize Hasura project (if not already done)
hasura init hasura --project-name payroll-matrix

# Apply metadata
cd hasura
hasura metadata apply --endpoint $HASURA_GRAPHQL_URL --admin-secret $HASURA_ADMIN_SECRET
```

#### 4. Configure JWT Authentication
```bash
# In Hasura Console:
# Go to: Settings → JWT
# Add JWT configuration:
```

```json
{
  "type": "RS256",
  "key": "-----BEGIN PUBLIC KEY-----\nYOUR_CLERK_PUBLIC_KEY\n-----END PUBLIC KEY-----",
  "claims_namespace": "https://hasura.io/jwt/claims",
  "claims_format": "json"
}
```

### Local Hasura Setup (Optional)

#### 1. Docker Compose Setup
```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_PASSWORD: postgrespassword
      POSTGRES_DB: payroll_matrix
    volumes:
      - db_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  hasura:
    image: hasura/graphql-engine:v2.35.0
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    restart: always
    environment:
      HASURA_GRAPHQL_DATABASE_URL: postgres://postgres:postgrespassword@postgres:5432/payroll_matrix
      HASURA_GRAPHQL_ENABLE_CONSOLE: "true"
      HASURA_GRAPHQL_DEV_MODE: "true"
      HASURA_GRAPHQL_ENABLED_LOG_TYPES: startup, http-log, webhook-log, websocket-log, query-log
      HASURA_GRAPHQL_ADMIN_SECRET: myadminsecretkey
      HASURA_GRAPHQL_JWT_SECRET: '{"type":"RS256","key":"YOUR_CLERK_PUBLIC_KEY"}'

volumes:
  db_data:
```

#### 2. Start Local Services
```bash
# Start services
docker-compose up -d

# Access Hasura Console
open http://localhost:8080

# Update environment variables
HASURA_GRAPHQL_URL="http://localhost:8080/v1/graphql"
HASURA_ADMIN_SECRET="myadminsecretkey"
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/payroll_matrix"
```

---

## Code Generation Setup

### GraphQL Code Generator Configuration

#### 1. Verify Configuration
```typescript
// codegen.ts
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: [
    {
      [process.env.HASURA_GRAPHQL_URL!]: {
        headers: {
          'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET!,
        },
      },
    },
  ],
  documents: [
    'domains/**/*.graphql',
    'domains/**/*.ts',
    'domains/**/*.tsx',
    '!domains/**/generated/**',
  ],
  generates: {
    // Global types
    'shared/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        withHooks: true,
        withComponent: false,
        withHOC: false,
        apolloReactHooksImportFrom: '@apollo/client',
      },
    },
    // Domain-specific generation
    'domains/': {
      preset: 'near-operation-file',
      presetConfig: {
        baseTypesPath: '../shared/generated/graphql.ts',
        folder: 'generated',
        extension: '.generated.ts',
      },
      plugins: [
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        withHooks: true,
        withComponent: false,
        withHOC: false,
      },
    },
  },
};

export default config;
```

#### 2. Run Code Generation
```bash
# Generate types for all domains
pnpm codegen

# Watch for changes during development
pnpm codegen:watch

# Generate specific domain
pnpm codegen:domain auth
```

#### 3. Verify Generated Files
```bash
# Check generated files
ls -la shared/generated/
ls -la domains/auth/generated/
ls -la domains/payrolls/generated/
```

---

## Deployment Configuration

### Vercel Deployment

#### 1. Vercel Configuration
```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "X-Requested-With, Content-Type, Authorization"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/graphql",
      "destination": "/api/graphql"
    }
  ]
}
```

#### 2. Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Add environment variables in Vercel Dashboard
# Go to: Project Settings → Environment Variables
```

### Environment Variables for Vercel
```bash
# Production environment variables
DATABASE_URL="production-database-url"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_..."
CLERK_SECRET_KEY="sk_live_..."
HASURA_GRAPHQL_URL="https://prod-hasura.hasura.app/v1/graphql"
HASURA_ADMIN_SECRET="production-admin-secret"
OPENAI_API_KEY="sk-..."
NEXT_PUBLIC_SITE_URL="https://payroll-matrix.vercel.app"
```

---

## Development Workflow

### Daily Development Routine

#### 1. Start Development Environment
```bash
# Pull latest changes
git pull origin main

# Install new dependencies (if any)
pnpm install

# Generate latest GraphQL types
pnpm codegen

# Start development server
pnpm dev
```

#### 2. GraphQL Development
```bash
# Watch GraphQL changes
pnpm codegen:watch

# Open Hasura Console
open $HASURA_GRAPHQL_URL

# Test GraphQL queries
# Use GraphQL Playground or Hasura Console
```

#### 3. Database Changes
```bash
# Create new migration
hasura migrate create "migration_name" --sql-file

# Apply migrations
hasura migrate apply

# Update metadata
hasura metadata export
```

#### 4. Code Quality
```bash
# Type checking
pnpm type-check

# Linting
pnpm lint

# Format code
pnpm format

# Run tests
pnpm test
```

### Git Workflow

#### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

#### 2. Pre-commit Hooks
```bash
# Install husky (if not already installed)
pnpm prepare

# Pre-commit will run:
# - ESLint
# - Prettier
# - Type checking
# - Test suite
```

---

## Troubleshooting Guide

### Common Issues

#### 1. Authentication Issues
```bash
# Problem: Clerk authentication not working
# Solution: Check environment variables
echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
echo $CLERK_SECRET_KEY

# Verify JWT template configuration
# Check Hasura JWT secret matches Clerk
```

#### 2. GraphQL Connection Issues
```bash
# Problem: Cannot connect to Hasura
# Solution: Check network and credentials
curl -H "x-hasura-admin-secret: $HASURA_ADMIN_SECRET" $HASURA_GRAPHQL_URL

# Check if Hasura is accessible
ping your-hasura-url.hasura.app
```

#### 3. Database Connection Issues
```bash
# Problem: Database connection failed
# Solution: Test database connectivity
psql $DATABASE_URL -c "SELECT NOW();"

# Check database permissions
psql $DATABASE_URL -c "SELECT current_user, current_database();"
```

#### 4. Code Generation Issues
```bash
# Problem: CodeGen fails
# Solution: Check GraphQL schema accessibility
pnpm codegen --verbose

# Clear generated files and regenerate
rm -rf shared/generated/ domains/*/generated/
pnpm codegen
```

#### 5. Development Server Issues
```bash
# Problem: Next.js won't start
# Solution: Clear cache and restart
rm -rf .next/
pnpm dev

# Check port availability
lsof -i :3000

# Use different port
pnpm dev -p 3001
```

### Debugging Tools

#### 1. Environment Verification
```bash
# Check all environment variables
node -e "console.log(process.env)" | grep -E "(CLERK|HASURA|DATABASE)"

# Test API endpoints
curl http://localhost:3000/api/auth/token
```

#### 2. GraphQL Debugging
```bash
# Enable GraphQL debug mode
NEXT_PUBLIC_APOLLO_DEBUG=true pnpm dev

# Use GraphQL Playground
open http://localhost:3000/api/graphql
```

#### 3. Log Analysis
```bash
# Check application logs
pnpm dev 2>&1 | grep -i error

# Check Hasura logs
# In Hasura Console: Settings → Logs
```

---

## Production Deployment

### Pre-deployment Checklist

#### 1. Security Verification
- [ ] All environment variables use production values
- [ ] JWT secrets are secure and unique
- [ ] Database credentials are production-ready
- [ ] HTTPS is enforced
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled

#### 2. Performance Optimization
- [ ] Code is minified and optimized
- [ ] Images are optimized
- [ ] GraphQL queries are optimized
- [ ] Database indexes are in place
- [ ] CDN is configured (if applicable)

#### 3. Monitoring Setup
- [ ] Error tracking is configured (Sentry, etc.)
- [ ] Performance monitoring is enabled
- [ ] Database monitoring is active
- [ ] Uptime monitoring is configured

#### 4. Backup & Recovery
- [ ] Database backups are scheduled
- [ ] Environment variables are backed up
- [ ] Deployment rollback plan is ready
- [ ] Disaster recovery plan is documented

### Production Environment Variables

```bash
# Critical production settings
NODE_ENV=production
NEXT_PUBLIC_DEV_MODE=false
NEXT_TELEMETRY_DISABLED=1

# Security settings
JWT_SECRET="production-jwt-secret-minimum-32-characters"
ENCRYPTION_KEY="production-encryption-key-32-characters"

# Database (production)
DATABASE_URL="postgresql://prod-user:secure-password@prod-host:5432/prod-db"

# Authentication (production)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_..."
CLERK_SECRET_KEY="sk_live_..."

# GraphQL (production)
HASURA_GRAPHQL_URL="https://prod-project.hasura.app/v1/graphql"
HASURA_ADMIN_SECRET="production-admin-secret"

# Site configuration
NEXT_PUBLIC_SITE_URL="https://payroll-matrix.com"
```

### Post-deployment Verification

#### 1. Functionality Testing
```bash
# Test critical user flows
curl https://payroll-matrix.com/api/auth/token
curl https://payroll-matrix.com/api/users
curl https://payroll-matrix.com/api/payrolls
```

#### 2. Performance Testing
```bash
# Use tools like:
# - Lighthouse (web performance)
# - WebPageTest (load times)
# - k6 or Artillery (load testing)
```

#### 3. Security Testing
```bash
# Verify HTTPS
curl -I https://payroll-matrix.com

# Check security headers
curl -I https://payroll-matrix.com | grep -i security

# Verify authentication
curl https://payroll-matrix.com/api/auth/token
```

This comprehensive setup guide provides all necessary information to configure and deploy the Payroll Matrix application from development to production environments.