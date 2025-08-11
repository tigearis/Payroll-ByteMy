# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ALWAYS THINK DEEPLY

## 🏗️ Project Architecture Overview

**Payroll Matrix** is an enterprise-grade SOC2-compliant payroll management system for Australian businesses. Built with modern technology stack and sophisticated enterprise architecture patterns.

### Memory

- **Database URL Handling**: Never use `$DATABASE_URL` always use the literal connection string `'postgresql://admin:[REDACTED_DB_PASSWORD]@192.168.1.229:5432/payroll_local?sslmode=disable'` always in single quotes
- **Package Management**: Only run pnpm commands, never npm
- **Tailwind v4 Migration**: Use `@theme` directive with `--color-` prefixed variables, but avoid `theme()` functions in base styles - use direct HSL values instead

## 🎨 Semantic Text Color Standards

**CRITICAL**: All components MUST use semantic text colors for proper light/dark mode support.

### Text Color Hierarchy

**Primary Text (High Contrast)**
```tsx
// ✅ Correct - Main content, headings, primary labels
className="text-foreground"
```

**Secondary Text (Medium Contrast)**  
```tsx
// ✅ Correct - Descriptions, secondary information
className="text-foreground opacity-75"
```

**Tertiary Text (Low Contrast)**
```tsx
// ✅ Correct - Helper text, placeholders, timestamps
className="text-foreground opacity-60"
```

**Muted Text (Minimal Contrast)**
```tsx
// ✅ Correct - Only for truly secondary UI elements like section dividers
className="text-muted-foreground"
```

### **NEVER Use Hardcoded Colors**

❌ **Wrong - Hardcoded dark mode colors:**
```tsx
className="text-gray-900 dark:text-gray-100"
className="text-slate-600 dark:text-slate-300" 
className="text-neutral-700 dark:text-neutral-200"
```

✅ **Correct - Semantic colors:**
```tsx
className="text-foreground"
className="text-foreground opacity-75"
```

### Special Cases

**Status Colors (Intentional Semantic Colors)**
```tsx
// ✅ Acceptable - When color conveys meaning
className="text-red-500 dark:text-red-400"    // Errors/warnings
className="text-green-600 dark:text-green-400" // Success states
className="text-orange-500 dark:text-orange-300" // Warnings
```

**Interactive Elements**
```tsx
// ✅ Correct - Links and interactive text
className="text-blue-600 hover:underline"
className="hover:text-foreground" // For muted text that becomes primary on hover
```

### UI Component Standards

**Background Colors**
```tsx
// ✅ Correct - Semantic background colors
className="bg-background"        // Main page background
className="bg-muted"            // Subtle background areas
className="bg-card"             // Card/panel backgrounds
className="bg-popover"          // Dropdown/modal backgrounds
```

**Border Colors**
```tsx
// ✅ Correct - Semantic borders
className="border-border"       // Standard borders
className="border-muted"        // Subtle borders
className="divide-border"       // Divider lines
```

**Navigation Icons**
- **MUST be unique** - Each navigation item requires a distinct icon
- **Use semantic icons** - Icons should clearly represent their functionality
- **Maintain consistency** - Similar functions should use related icon families

### Component Architecture

**Collapsible Sections**
```tsx
// ✅ Correct - State-managed collapsible sections
const [expanded, setExpanded] = useState<Record<string, boolean>>();
const toggleSection = (id: string) => setExpanded(prev => ({...prev, [id]: !prev[id]}));

// With proper visual indicators
{expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
```

**Responsive Layout**
```tsx
// ✅ Correct - Adaptive layouts for collapsed/expanded states
{sidebarCollapsed ? (
  <div className="flex flex-col items-center space-y-1">
    {/* Vertical stack for narrow spaces */}
  </div>
) : (
  <div className="flex items-center justify-between">
    {/* Horizontal layout for wider spaces */}
  </div>
)}
```

### Enforcement & Validation

**Pre-Implementation Checklist**
- [ ] All text uses semantic colors (`text-foreground`, `text-foreground opacity-*`, or `text-muted-foreground`)
- [ ] No hardcoded `dark:text-*` classes except for semantic status colors
- [ ] All icons in navigation are unique and semantically appropriate
- [ ] Collapsible sections have proper state management and visual indicators
- [ ] Responsive layouts adapt properly to collapsed/expanded states

**Code Review Requirements**
- Any hardcoded color combinations will be rejected
- All new navigation items must have unique icons
- Component architecture must follow established patterns
- Text hierarchy must be semantically correct

**Migration Notes**
- Legacy components using hardcoded colors have been updated to semantic standards
- All sidebar section headers are now collapsible with proper state management
- Navigation structure follows logical grouping (Client Management, Scheduling, People, etc.)

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

## 🔧 TypeScript Standards & Error Resolution

### Critical Type Safety Requirements

**MANDATORY**: The codebase MUST maintain zero TypeScript errors with strict type checking enabled.

### Common TypeScript Patterns & Solutions

#### 1. Optional Property Handling with exactOptionalPropertyTypes
When passing optional properties to components, use conditional spread syntax:
```typescript
// ✅ Correct - Only pass defined properties
<Component
  {...(userId && { userId })}
  {...(teamMembers && { teamMembers })}
  {...(onCallback && { onCallback })}
/>

// ❌ Wrong - Passing undefined values
<Component
  userId={userId}  // Error if userId can be undefined
  onCallback={onCallback}  // Error if onCallback can be undefined
/>
```

#### 2. GraphQL & Apollo Client Types
- **Always import proper Apollo Client types**: `DocumentNode`, `TypedDocumentNode`, `OperationVariables`
- **Handle GraphQL errors correctly**: Convert `GraphQLFormattedError[]` to `Error[]`
- **Variables handling**: Use conditional spread `{...(variables && { variables })}` to avoid undefined assignment

```typescript
// ✅ Correct Apollo Client implementation
import { gql, DocumentNode, TypedDocumentNode, OperationVariables } from "@apollo/client";

async executeQuery<T = unknown>(
  query: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  variables?: Record<string, unknown>
): Promise<{ data?: T; errors?: readonly Error[] }> {
  const result = await client.query({
    query,
    ...(variables && { variables }), // Conditional spread
    fetchPolicy: "network-only",
  });

  return { 
    data: result.data, 
    errors: result.errors ? result.errors.map(err => new Error(err.message)) : [] 
  };
}
```

#### 3. Interface Consistency
- **Local vs Imported Interfaces**: Ensure local interfaces match imported types exactly
- **Required Properties**: Add missing required properties like `isActive: boolean` to maintain compatibility

#### 4. Array Type Initialization
```typescript
// ✅ Correct - Typed array initialization
const [state, setState] = useState({
  errors: [] as any[], // Explicit typing prevents never[] inference
});

// ❌ Wrong - TypeScript infers never[]
const [state, setState] = useState({
  errors: [], // This becomes never[] and can't accept values
});
```

#### 5. JSX Children Prop Issues
```typescript
// ✅ Correct - No comments inside JSX that expects single child
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    {/* Comments outside single-child components only */}
  </BarChart>
</ResponsiveContainer>

// ❌ Wrong - Comment treated as second child
<ResponsiveContainer width="100%" height={300}> {/* This comment causes error */}
  <BarChart data={data} />
</ResponsiveContainer>
```

#### 6. Type Guards for Complex Objects
```typescript
// ✅ Correct - Type guard for property access
const definition = query.definitions[0];
const operationName = definition && 'name' in definition ? definition.name?.value : 'unknown';

// ❌ Wrong - Direct property access on union types
const operationName = query.definitions[0]?.name?.value; // Error: not all DefinitionNode types have 'name'
```

#### 7. IntrospectionResult Property Access
```typescript
// ✅ Correct - Use __schema for IntrospectionResult
const queryType = introspection.__schema.types.find((type: any) => type.name === 'query_root');

// ❌ Wrong - 'schema' property doesn't exist
const queryType = introspection.schema.types.find(type => type.name === 'query_root');
```

### Enforcement Rules

#### Pre-Commit Requirements
```bash
# MUST pass before any commit
pnpm run type-check  # Zero errors required
pnpm run lint        # Clean linting required
```

#### Development Workflow
1. **Before making changes**: Run `pnpm run type-check` to establish baseline
2. **During development**: Fix TypeScript errors immediately - never accumulate them
3. **Before PR**: Ensure `pnpm run type-check` passes with zero errors
4. **Code review**: TypeScript errors are blocking issues

#### Error Categories & Response
- **High Priority** (blocking): Apollo Client types, interface mismatches, property access errors
- **Medium Priority** (fix same day): Array type issues, conditional property handling
- **Low Priority** (fix before PR): Type annotations, unused imports

### Type Safety Best Practices
- **Explicit typing** over `any` where possible, but use `any` strategically for complex GraphQL responses
- **Conditional spreading** for all optional properties in components
- **Type guards** for union types and complex object property access
- **Proper error handling** with typed error arrays and conversion functions

## 📚 Documentation Structure

- `/docs/security/` - Security and permissions documentation
- `/docs/api/` - API documentation and guides  
- `/docs/business-logic/` - Business logic and workflow documentation
- `/docs/user-guides/` - Role-specific user guides
- `/docs/deployment/` - Deployment and infrastructure guides
- `/docs/storage/` - File storage and management documentation

## 🗄️ File Storage & Deletion System

**CRITICAL**: Always use proper deletion methods to maintain storage consistency.

- **Primary Reference**: `/docs/storage/FILE_DELETION_GUIDE.md`
- **Recommended Approach**: Use API endpoints (`DELETE /api/documents/[id]`) or service layer (`deleteDocument()`)
- **Safety Features**: Hasura event triggers + scheduled cleanup ensure MinIO cleanup
- **Admin Tools**: Manual cleanup via `/api/admin/file-cleanup`
- **Monitoring**: Daily scheduled cleanup at 4 AM UTC

## 📅 Payroll Date Generation System

**CRITICAL FIXES APPLIED** (August 2025): The payroll date generation system underwent a complete overhaul to fix multiple critical bugs.

### Key Database Functions

#### `generate_payroll_dates()` - Core Date Generation
**Location**: `/database/migrations/fix_generate_payroll_dates_function.sql`

**Major Fixes Applied**:
- ✅ **Fortnightly Logic Rewritten**: Fixed broken 21-day intervals, now generates proper 14-day fortnightly cycles
- ✅ **Regional Holiday Filtering**: Only NSW and National holidays affect business day calculations
- ✅ **Bi-Monthly Logic**: Proper 24 dates/year with February 14th exception (instead of 15th)
- ✅ **DOW Mapping Fixed**: Correct day-of-week calculations for weekly/fortnightly payrolls
- ✅ **Complete Holiday Database**: 2024-2027 Australian holidays with regional coverage

#### Critical Business Logic Rules

**Fortnightly Patterns**:
- **Week A vs Week B**: Week A starts on first occurrence of target day in year, Week B follows 7 days later
- **14-Day Intervals**: Both Week A and B maintain consistent 14-day intervals throughout the year
- **Year Boundaries**: Pattern continues seamlessly across December→January boundaries

**Bi-Monthly Logic**:
- **SOM**: Generates 1st and 15th of month (14th in February)
- **EOM**: Generates 15th (14th in February) and last day of month
- **Total**: Exactly 24 dates per year for bi-monthly payrolls

**Business Day Adjustments**:
- **SOM Types**: Move to **next** business day if weekend/holiday
- **All Others**: Move to **previous** business day if weekend/holiday
- **Regional Filtering**: Only NSW and National holidays considered (not ACT, WA, etc.)

### Holiday Management System

**Holiday Sync Service**: `/domains/external-systems/services/holiday-sync-service.ts`
- **API Source**: date.nager.at for Australian public holidays
- **Coverage**: 2024-2027 with proper regional tagging
- **CRON Integration**: `/api/holidays/sync` endpoint with secret protection
- **Manual Sync**: Direct service calls for development/testing

**Critical Holiday Logic**:
```sql
-- Only NSW and National holidays affect business day calculations
region @> ARRAY['National'] OR 'NSW' = ANY(region)
```

### Migration Files Applied

1. **`fix_generate_payroll_dates_function.sql`** - Complete function rewrite
2. **`fix_is_business_day_regional_holidays.sql`** - Regional holiday filtering
3. **`fix_fortnightly_logic.sql`** - Fortnightly 14-day interval correction

### Validation & Testing

**Testing Commands**:
```bash
# Test payroll date generation for specific payroll
PGSSLMODE=disable psql -h 192.168.1.229 -p 5432 -U admin -d payroll_local -c "
SELECT TO_CHAR(original_eft_date, 'YYYY-MM-DD Day') as intended_date,
       TO_CHAR(adjusted_eft_date, 'YYYY-MM-DD Day') as actual_date,
       notes as adjustment_reason
FROM generate_payroll_dates('payroll-uuid', '2024-01-01', '2024-12-31', 52)
WHERE notes IS NOT NULL
ORDER BY original_eft_date;"
```

**Critical Validation Points**:
- ✅ Bi-monthly payrolls: 24 dates per year (was generating incorrect counts)
- ✅ Fortnightly payrolls: 26-27 dates per year with proper 14-day intervals
- ✅ Holiday adjustments: Only NSW/National holidays cause adjustments
- ✅ February exceptions: Uses 14th instead of 15th for bi-monthly cycles

### Documentation References
- **Primary**: `/docs/business-logic/payroll-restrictions-and-validation.md`
- **Business Logic**: Comprehensive documentation of all cycle types and date generation rules
- **Migration History**: All fixes documented with before/after examples