# Auth + GraphQL Alignment Audit Prompt

## Context

I need to audit my authentication system to ensure all auth-related pages, routes, and components are properly aligned with GraphQL operations. The goal is to minimise custom code and leverage GraphQL for all data operations while ensuring efficient data fetching.

## Project Structure to Analyse

```
app/auth/                    # Auth pages/routes
├── login/
├── register/
├── forgot-password/
├── reset-password/
├── profile/
└── permissions/

components/                  # Auth-related components
├── auth/
├── forms/
└── layout/

hooks/                      # Auth-related hooks
├── use-auth.ts
├── use-permissions.ts
└── use-profile.ts

lib/auth/                   # Auth utilities
├── auth-provider.tsx
├── permissions.ts
└── session.ts

graphql/                    # GraphQL operations
├── queries/
├── mutations/
└── generated/
```

## Task: Comprehensive Auth-GraphQL Audit

### 1. **Page/Route Analysis**

For each auth-related page/route, analyse:

#### **Data Requirements Check:**

- What user data does the page display?
- What authentication state is required?
- What permissions are checked?
- What form submissions occur?
- What API calls are made?

#### **GraphQL Operation Alignment:**

- Are all data requirements covered by existing GraphQL queries?
- Are form submissions using GraphQL mutations?
- Are permission checks using GraphQL data?
- Is there any direct API/database access bypassing GraphQL?

#### **Missing GraphQL Operations:**

- What queries are needed but don't exist?
- What mutations are missing for form handling?
- What subscription would improve real-time updates?

### 2. **Component Integration Analysis**

For each auth component, check:

#### **Data Fetching:**

- Does it use Apollo hooks (`useQuery`, `useMutation`)?
- Is it making direct API calls instead of GraphQL?
- Are loading and error states handled properly?
- Is data cached efficiently?

#### **Props vs GraphQL:**

- Is data passed down as props when it could be fetched directly?
- Are components overly coupled to parent data fetching?
- Could components be more independent with their own queries?

### 3. **Hook Efficiency Analysis**

For auth-related hooks, evaluate:

#### **GraphQL Integration:**

- Do custom hooks wrap Apollo hooks properly?
- Is there duplicate data fetching logic?
- Are hooks using generated Apollo hooks?
- Is caching strategy optimal?

#### **Code Minimisation:**

- Could custom logic be replaced with GraphQL resolvers?
- Are calculations done client-side when they could be server-side?
- Is there unnecessary data transformation?

### 4. **Authentication Flow Analysis**

Check the complete auth flow:

#### **Login/Registration:**

- Are credentials validated via GraphQL?
- Is session management handled through GraphQL?
- Are user profiles fetched efficiently post-login?

#### **Permission System:**

- Are permissions stored and fetched via GraphQL?
- Is role-based access control using GraphQL data?
- Are permission checks optimised?

#### **Profile Management:**

- Are profile updates using GraphQL mutations?
- Is user data synchronised properly?
- Are related entities (payrolls, clients) fetched efficiently?

## Analysis Format

### **Page: `[page-name]`**

#### Current Implementation:

- **Data Sources**: List all data sources (GraphQL/API/localStorage/etc.)
- **Operations Used**: Existing GraphQL queries/mutations
- **Custom Code**: Non-GraphQL data handling
- **Performance Issues**: Inefficient patterns found

#### Required Data:

- **Display Data**: What user info is shown
- **Form Data**: What inputs are collected
- **Permission Data**: What access checks are needed
- **Related Data**: Connected entities required

#### GraphQL Gaps:

- **Missing Queries**: Needed but don't exist
- **Missing Mutations**: Form submissions not covered
- **Missing Subscriptions**: Real-time updates needed
- **Schema Updates**: New fields/types required

#### Optimisation Opportunities:

- **Combine Queries**: Multiple small queries → single efficient query
- **Remove Custom Code**: Replace with GraphQL operations
- **Improve Caching**: Better Apollo cache usage
- **Reduce Prop Drilling**: Direct component queries

### **Component: `[component-name]`**

#### Current GraphQL Usage:

- **Queries**: List used queries
- **Mutations**: List used mutations
- **Loading States**: How handled
- **Error Handling**: How managed

#### Recommended Changes:

- **New Operations**: GraphQL operations to create
- **Hook Updates**: Changes to custom hooks
- **Code Removal**: Custom logic to eliminate
- **Performance Gains**: Expected improvements

## Expected Deliverables

### 1. **GraphQL Operation Plan**

```
NEW QUERIES:
- GetUserProfile: user profile with permissions and related data
- GetAuthSession: current session with role information

NEW MUTATIONS:
- UpdateUserProfile: profile updates with validation
- RefreshAuthToken: token refresh handling

NEW SUBSCRIPTIONS:
- UserPermissionUpdates: real-time permission changes
- SessionExpiry: session timeout notifications

SCHEMA ADDITIONS:
- User.lastLoginAt: timestamp field
- User.preferences: JSONB field for user settings
```

### 2. **Code Refactoring Plan**

```
REMOVE CUSTOM CODE:
- auth-utils.ts: replace with GraphQL queries
- session-manager.ts: use GraphQL subscriptions
- permission-checker.ts: use GraphQL data

UPDATE HOOKS:
- useAuth: use generated Apollo hooks
- usePermissions: simplify with direct queries
- useProfile: remove duplicate data fetching

OPTIMISE COMPONENTS:
- LoginForm: use mutation hook directly
- ProfilePage: combine multiple queries
- PermissionGuard: use subscription for updates
```

### 3. **Performance Improvements**

- **Reduced Bundle Size**: Code removal estimates
- **Faster Load Times**: Query optimisation benefits
- **Better UX**: Real-time updates and proper loading states
- **Maintenance Reduction**: Less custom code to maintain

## Quality Checks

Ensure recommendations follow:

- **GraphQL First**: Prefer GraphQL over custom API calls
- **Efficient Queries**: Fetch only required data
- **Proper Caching**: Leverage Apollo cache effectively
- **Error Handling**: Consistent error patterns
- **Type Safety**: Use generated types throughout
- **Australian English**: Maintain spelling consistency

## Authentication Patterns to Check

- **JWT Handling**: Token storage and refresh via GraphQL
- **Session Management**: User state synchronisation
- **Permission Caching**: Efficient access control
- **Profile Updates**: Optimistic updates with rollback
- **Multi-factor Auth**: If implemented, GraphQL integration
- **OAuth Integration**: External provider data mapping

## Security Considerations

- Ensure sensitive operations use proper GraphQL security
- Check that permissions are server-side validated
- Verify that client-side auth state isn't the only protection
- Confirm that GraphQL operations have proper role-based access

---

**Input Required**:

- All files in `app/auth/` directory
- Auth-related components and hooks
- Current GraphQL schema and operations
- Any custom auth utilities or providers
- Hasura metadata for permission rules
