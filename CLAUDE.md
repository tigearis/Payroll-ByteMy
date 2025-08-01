# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ALWAYS THINK DEEPLY

## 🏗️ Project Architecture Overview

**Payroll Matrix** is an enterprise-grade SOC2-compliant payroll management system for Australian businesses. Built with modern technology stack and sophisticated enterprise architecture patterns.

### Memory

- **Database URL Handling**: Never use `$DATABASE_URL` always use the literal connection string `'postgresql://admin:PostH4rr!51604@192.168.1.229:5432/payroll_local?sslmode=disable'` always in single quotes
- **Package Management**: Only run pnpm commands, never npm

## 🔐 Hasura GraphQL Permissions System

The system uses a comprehensive role-based access control (RBAC) system implemented through Hasura GraphQL permissions:

### Role Hierarchy
- **viewer** → **consultant** → **manager** → **org_admin** → **developer**
- Uses Hasura inherited roles for permission inheritance
- Each role has specific access patterns aligned with business workflows

### Critical Guidelines for Hasura Work

#### Column Name Consistency
- **ALWAYS** use database column names (snake_case) in permissions, NOT GraphQL field names (camelCase)
- ❌ Wrong: `userId`, `createdAt`, `isImportant`  
- ✅ Correct: `user_id`, `created_at`, `is_important`

#### Permission Patterns
- **Manager Oversight**: Managers can access data from consultants they supervise
- **Consultant Assignment**: Consultants access payrolls where they are primary or backup
- **User Ownership**: Personal data accessible only to the owner

#### Schema Verification
```bash
# Before adding permissions, always verify column names:
grep -A 20 "type TableName" /shared/schema/schema.graphql
grep -A 15 "CREATE TABLE table_name" /database/schema.sql

# Apply and check consistency:
hasura metadata apply
hasura metadata ic list
```

### Documentation
- **Primary Reference**: `/docs/security/HASURA_PERMISSIONS_SYSTEM.md`
- **Status**: All core tables have comprehensive permissions (25+ tables)
- **Consistency**: 100% consistent metadata (40+ inconsistencies resolved)

### Key Tables with Enhanced Permissions
- `billing_items`: 10+ missing columns added, full CRUD for consultants/managers
- `time_entries`: Complete permissions with proper filtering
- `email_templates`: Corrected column references and approval logic
- `notes`, `files`, `leave`: Fixed all snake_case column names
- `payrolls`, `clients`: Proper relationship-based filtering

## 📚 Documentation Structure

- `/docs/security/` - Security and permissions documentation
- `/docs/api/` - API documentation and guides  
- `/docs/business-logic/` - Business logic and workflow documentation
- `/docs/user-guides/` - Role-specific user guides
- `/docs/deployment/` - Deployment and infrastructure guides