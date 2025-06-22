# Hooks Documentation

## Overview

The `/hooks` directory contains custom React hooks that encapsulate business logic, state management, and external service integration. All hooks follow kebab-case naming conventions and integrate with the authentication system, providing type-safe, reusable functionality across the application.

## Architecture Patterns

- **Custom Hook Pattern**: Encapsulation of stateful logic and side effects
- **Authentication Integration**: All hooks integrate with Clerk authentication context
- **Type Safety**: Comprehensive TypeScript with auto-generated GraphQL types
- **Error Handling**: Graceful error handling with user-friendly fallbacks
- **Performance Optimization**: Memoization and efficient re-rendering patterns

## Naming Convention

All hooks follow the established kebab-case naming pattern:

- File names: `use-hook-name.ts`
- Hook functions: `useHookName()`
- Related types: `HookNameOptions`, `HookNameResult`

## Hook Categories

### Authentication & User Management

#### `/hooks/use-current-user.ts`

- **Purpose**: Current user state management with database synchronization
- **Authentication**: Requires valid Clerk session and database user record
- **Business Logic**:
  - Bridges Clerk session with database user data
  - Provides real-time user information updates
  - Handles user session changes and refresh
  - Manages user permission caching
- **Data Flow**:
  1. Clerk session state monitored
  2. Database user data fetched and cached
  3. Permission information loaded and cached
  4. Real-time updates via GraphQL subscriptions
  5. Graceful handling of session expiry
- **Return Type**:
  ```typescript
  interface CurrentUserResult {
    user: DatabaseUser | null;
    loading: boolean;
    error: Error | null;
    permissions: Permission[];
    role: UserRole;
    refreshUser: () => Promise<void>;
  }
  ```
- **Usage**:
  ```typescript
  const { user, loading, permissions } = useCurrentUser();
  ```

#### `/hooks/use-user-role.ts`

- **Purpose**: User role management and validation
- **Authentication**: Integrates with authentication context for role information
- **Business Logic**:
  - Current user role retrieval and caching
  - Role hierarchy validation
  - Permission checking utilities
  - Role change detection and updates
- **Data Flow**:
  1. User role extracted from authentication context
  2. Role hierarchy position calculated
  3. Permission inheritance resolved
  4. Real-time role updates handled
- **Return Type**:
  ```typescript
  interface UserRoleResult {
    role: UserRole;
    roleLevel: number;
    hasPermission: (permission: string) => boolean;
    hasMinimumRole: (minimumRole: UserRole) => boolean;
    isAdmin: boolean;
    isManager: boolean;
  }
  ```

#### `/hooks/use-user-role-management.ts`

- **Purpose**: Administrative user role management operations
- **Authentication**: Org Admin+ role required for role management operations
- **Business Logic**:
  - User role assignment and modification
  - Role transition validation
  - Bulk role operations
  - Audit logging for role changes
- **Data Flow**:
  1. Admin initiates role management operation
  2. Permission validation for role assignment
  3. Role transition rules validated
  4. Database and Clerk metadata updated
  5. Audit trail created for compliance
- **Return Type**:
  ```typescript
  interface UserRoleManagementResult {
    assignRole: (userId: string, role: UserRole) => Promise<void>;
    bulkAssignRoles: (assignments: RoleAssignment[]) => Promise<void>;
    getRoleTransitionRules: () => RoleTransitionRule[];
    validateRoleAssignment: (userId: string, role: UserRole) => boolean;
  }
  ```

#### `/hooks/use-enhanced-permissions.tsx`

- **Purpose**: Advanced permission checking with real-time updates
- **Authentication**: Requires authenticated user with permission context
- **Business Logic**:
  - Dynamic permission evaluation
  - Permission inheritance calculation
  - Real-time permission updates
  - Context-aware permission checking
- **Data Flow**:
  1. User permissions loaded from context
  2. Permission inheritance calculated
  3. Dynamic permission rules evaluated
  4. Real-time updates via subscription
  5. Context-specific permission filtering
- **Return Type**:
  ```typescript
  interface EnhancedPermissionsResult {
    hasPermission: (permission: string, context?: PermissionContext) => boolean;
    getPermissions: () => Permission[];
    canAccessEntity: (entityType: string, entityId: string) => boolean;
    getAccessLevel: (resource: string) => AccessLevel;
    subscribeToPermissionChanges: (callback: PermissionChangeCallback) => void;
  }
  ```

### Data Management & Operations

#### `/hooks/use-graceful-query.ts`

- **Purpose**: GraphQL query execution with error handling and permission awareness
- **Authentication**: Handles authentication errors gracefully
- **Business Logic**:
  - Permission-aware data loading
  - Graceful error handling with fallbacks
  - Loading state management
  - Retry logic for transient failures
- **Data Flow**:
  1. GraphQL query executed with authentication
  2. Permission errors detected and handled
  3. Fallback data provided where appropriate
  4. Loading states managed efficiently
  5. Error recovery actions provided
- **Return Type**:
  ```typescript
  interface GracefulQueryResult<TData> {
    data: TData | undefined;
    loading: boolean;
    error: Error | undefined;
    hasPermissionError: boolean;
    canRetry: boolean;
    retry: () => void;
  }
  ```

#### `/hooks/use-cache-invalidation.ts`

- **Purpose**: Apollo GraphQL cache management and invalidation
- **Authentication**: No authentication required (utility hook)
- **Business Logic**:
  - Strategic cache invalidation
  - Cache warming for performance
  - Real-time cache updates
  - Memory management optimization
- **Data Flow**:
  1. Cache invalidation strategies applied
  2. Selective cache updates for efficiency
  3. Cache warming for anticipated data needs
  4. Memory usage optimization
- **Return Type**:
  ```typescript
  interface CacheInvalidationResult {
    invalidateQuery: (queryName: string) => void;
    invalidateEntity: (entityType: string, entityId: string) => void;
    refreshCache: () => Promise<void>;
    getCacheStats: () => CacheStatistics;
  }
  ```

### Business Logic Hooks

#### `/hooks/use-payroll-creation.ts`

- **Purpose**: Payroll creation workflow with validation and processing
- **Authentication**: Manager+ role required for payroll operations
- **Business Logic**:
  - Payroll creation wizard logic
  - Employee assignment validation
  - Calculation engine integration
  - Approval workflow management
- **Data Flow**:
  1. Payroll creation workflow initiated
  2. Employee eligibility validated
  3. Calculation parameters configured
  4. Business rules validated
  5. Payroll created with audit trail
- **Return Type**:
  ```typescript
  interface PayrollCreationResult {
    createPayroll: (params: PayrollCreationParams) => Promise<Payroll>;
    validateEmployeeEligibility: (employeeIds: string[]) => ValidationResult;
    calculatePreview: (params: CalculationParams) => CalculationPreview;
    getCurrentStep: () => PayrollCreationStep;
    canProceedToNextStep: () => boolean;
  }
  ```

#### `/hooks/use-payroll-versioning.ts`

- **Purpose**: Payroll version control and audit trail management
- **Authentication**: Manager+ role required, with audit logging
- **Business Logic**:
  - Payroll version creation and management
  - Change tracking and comparison
  - Rollback capabilities
  - Audit trail maintenance
- **Data Flow**:
  1. Payroll modifications tracked
  2. Version snapshots created
  3. Change differences calculated
  4. Audit trail maintained
  5. Rollback options provided
- **Return Type**:
  ```typescript
  interface PayrollVersioningResult {
    createVersion: (
      payrollId: string,
      changes: PayrollChanges
    ) => Promise<PayrollVersion>;
    getVersionHistory: (payrollId: string) => PayrollVersion[];
    compareVersions: (version1: string, version2: string) => VersionComparison;
    rollbackToVersion: (payrollId: string, versionId: string) => Promise<void>;
  }
  ```

#### `/hooks/use-user-management.ts`

- **Purpose**: User lifecycle management operations
- **Authentication**: Manager+ role required for user management
- **Business Logic**:
  - User creation and invitation workflows
  - Profile management and updates
  - Deactivation and offboarding
  - Team assignment management
- **Data Flow**:
  1. User management operation initiated
  2. Permission validation performed
  3. Business rule validation applied
  4. External service integration (Clerk)
  5. Audit trail created
- **Return Type**:
  ```typescript
  interface UserManagementResult {
    createUser: (userData: CreateUserInput) => Promise<User>;
    updateUser: (userId: string, updates: UserUpdateInput) => Promise<User>;
    deactivateUser: (userId: string, reason: string) => Promise<void>;
    assignToTeam: (userId: string, teamId: string) => Promise<void>;
    sendInvitation: (email: string, role: UserRole) => Promise<void>;
  }
  ```

### Real-time & Synchronization

#### `/hooks/use-subscription.ts`

- **Purpose**: GraphQL subscription management with authentication
- **Authentication**: Requires authenticated user for subscription access
- **Business Logic**:
  - Real-time data subscription management
  - Authentication integration for WebSocket connections
  - Connection management and retry logic
  - Subscription lifecycle management
- **Data Flow**:
  1. WebSocket connection established with auth
  2. Subscription registered with server
  3. Real-time updates received and processed
  4. Connection health monitored
  5. Automatic reconnection on failures
- **Return Type**:
  ```typescript
  interface SubscriptionResult<TData> {
    data: TData | undefined;
    loading: boolean;
    error: Error | undefined;
    connected: boolean;
    reconnect: () => void;
  }
  ```

#### `/hooks/use-polling.ts`

- **Purpose**: Polling strategy for data freshness
- **Authentication**: Uses authenticated queries for data polling
- **Business Logic**:
  - Intelligent polling intervals
  - Background refresh strategies
  - Network-aware polling
  - Performance optimization
- **Data Flow**:
  1. Polling interval configured based on data importance
  2. Network connectivity monitored
  3. Background refresh performed
  4. Polling paused/resumed based on user activity
  5. Data freshness maintained efficiently
- **Return Type**:
  ```typescript
  interface PollingResult {
    startPolling: (interval: number) => void;
    stopPolling: () => void;
    isPolling: boolean;
    lastUpdate: Date | null;
    forceRefresh: () => Promise<void>;
  }
  ```

#### `/hooks/use-user-role-secure.ts`

- **Purpose**: Secure role management with enhanced validation
- **Authentication**: Enhanced security validation for role operations
- **Business Logic**:
  - Multi-factor authentication for role changes
  - Enhanced validation for sensitive role operations
  - Secure role transition workflows
  - Advanced audit logging
- **Data Flow**:
  1. Role operation initiated with enhanced security
  2. Multi-factor authentication verification
  3. Enhanced business rule validation
  4. Secure role transition executed
  5. Comprehensive audit trail created
- **Return Type**:
  ```typescript
  interface SecureUserRoleResult {
    requireMFA: boolean;
    initiateRoleChange: (
      params: SecureRoleChangeParams
    ) => Promise<RoleChangeToken>;
    confirmRoleChange: (token: string, mfaCode: string) => Promise<void>;
    validateSecureOperation: (operation: string) => SecurityValidationResult;
  }
  ```

## Hook Integration Patterns

### Authentication Context Integration

All hooks integrate with the authentication system:

```typescript
// Standard authentication integration pattern
export function useCustomHook() {
  const { user, isLoaded } = useUser(); // Clerk integration
  const { permissions } = useCurrentUser(); // Database integration

  // Hook logic only executes with valid authentication
  if (!isLoaded || !user) {
    return { loading: true, data: null };
  }

  // Business logic with authentication context
}
```

### Error Handling Pattern

Consistent error handling across all hooks:

```typescript
interface HookErrorHandling {
  try {
    // Hook operation
  } catch (error) {
    if (isPermissionError(error)) {
      // Handle permission errors gracefully
      return { error: 'insufficient_permissions', data: fallbackData };
    }

    if (isNetworkError(error)) {
      // Handle network errors with retry
      return { error: 'network_error', canRetry: true };
    }

    // Handle unexpected errors
    logError(error);
    return { error: 'unexpected_error' };
  }
}
```

### Performance Optimization

Hooks implement performance optimizations:

```typescript
// Memoization for expensive calculations
const expensiveCalculation = useMemo(() => {
  return performExpensiveOperation(data);
}, [data]);

// Callback memoization for stable references
const handleAction = useCallback(
  params => {
    return performAction(params);
  },
  [dependencies]
);

// Efficient re-rendering with dependency arrays
useEffect(() => {
  // Side effect logic
}, [specificDependencies]);
```

## Testing Strategy

### Hook Testing

Each hook includes comprehensive testing:

- **Unit Tests**: Hook logic validation and edge cases
- **Integration Tests**: Authentication and external service integration
- **Error Handling Tests**: Error scenarios and recovery
- **Performance Tests**: Hook performance and memory usage

### Testing Utilities

```typescript
// Custom hook testing utilities
const renderHookWithAuth = (hook, userRole = 'viewer') => {
  const wrapper = ({ children }) => (
    <AuthProvider mockUser={{ role: userRole }}>
      <ApolloProvider client={mockClient}>
        {children}
      </ApolloProvider>
    </AuthProvider>
  );

  return renderHook(hook, { wrapper });
};
```

## Security Considerations

### Data Protection

- **Permission Validation**: All hooks validate user permissions
- **Data Sanitization**: Sensitive data filtered based on user role
- **Audit Integration**: All business operations logged for compliance
- **Error Security**: No sensitive information exposed in error messages

### Authentication Security

- **Session Validation**: Continuous session health checking
- **Token Refresh**: Automatic token refresh for expired sessions
- **Permission Caching**: Secure permission caching with invalidation
- **Logout Handling**: Graceful logout and session cleanup

## Performance Monitoring

### Hook Performance

- **Render Tracking**: Hook re-render frequency monitoring
- **Memory Usage**: Hook memory consumption tracking
- **Network Efficiency**: API call optimization and batching
- **Cache Effectiveness**: Cache hit rates and optimization

### Optimization Strategies

- **Lazy Loading**: Hooks load data only when needed
- **Batching**: Related operations batched for efficiency
- **Caching**: Intelligent caching with appropriate invalidation
- **Debouncing**: User input debouncing for search and filters

## Related Documentation

- [Components Documentation](../components/README.md) - Hook usage in components
- [Authentication Guide](../lib/README.md) - Authentication integration details
- [API Documentation](../pages/api/README.md) - Backend integration patterns
