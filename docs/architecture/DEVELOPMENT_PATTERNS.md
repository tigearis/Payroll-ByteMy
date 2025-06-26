# Advanced Development Patterns

This guide documents the advanced development patterns, architectural decisions, and best practices implemented in the Payroll-ByteMy application.

## Table of Contents

1. [Domain-Driven Design Implementation](#domain-driven-design-implementation)
2. [Custom Hook Development Patterns](#custom-hook-development-patterns)
3. [Error Boundary Strategies](#error-boundary-strategies)
4. [Permission Guard Patterns](#permission-guard-patterns)
5. [Form Handling Best Practices](#form-handling-best-practices)
6. [Advanced TypeScript Patterns](#advanced-typescript-patterns)
7. [Component Composition Patterns](#component-composition-patterns)
8. [State Management Strategies](#state-management-strategies)
9. [API Integration Patterns](#api-integration-patterns)
10. [Testing Patterns](#testing-patterns)

## Domain-Driven Design Implementation

### Domain Organization Structure

The application follows a strict domain-driven design approach with security classifications:

```typescript
domains/
├── auth/          // Authentication domain (CRITICAL security level)
├── audit/         // Audit logging domain (CRITICAL) 
├── permissions/   // Role-based access control (CRITICAL)
├── users/         // User management (HIGH security)
├── clients/       // Client management (HIGH security)
├── billing/       // Financial operations (HIGH security)
├── payrolls/      // Core payroll domain (MEDIUM security)
├── notes/         // Documentation (MEDIUM security)
├── leave/         // Leave management (MEDIUM security)
├── work-schedule/ // Scheduling (MEDIUM security)
└── external-systems/ // Integrations (MEDIUM security)
```

### Domain Structure Pattern

Each domain follows a consistent structure:

```typescript
domains/{domain}/
├── components/        // Domain-specific React components
├── graphql/          // GraphQL operations and generated types
│   ├── queries.graphql
│   ├── mutations.graphql
│   ├── subscriptions.graphql
│   ├── fragments.graphql
│   └── generated/    // Auto-generated TypeScript types
├── services/         // Business logic and API calls
├── types/           // Domain-specific TypeScript types
├── utils/           // Domain-specific utility functions
└── index.ts         // Domain export barrel
```

### Domain Export Pattern

```typescript
// domains/payrolls/index.ts
/**
 * AUTO-GENERATED BARREL FILE with SOC2 compliance headers
 * 
 * Security Classification: MEDIUM
 * Contains: Payroll operations and management
 * Audit Requirements: All mutations logged
 * Last Generated: 2024-12-26T01:28:28.191Z
 */

// GraphQL Operations
export * from './graphql/generated/graphql';

// Components
export { PayrollSchedule } from './components/payroll-schedule';
export { PayrollForm } from './components/payroll-form';

// Services
export { PayrollService } from './services/payroll-service';

// Types
export type {
  PayrollStatus,
  PayrollInput,
  PayrollValidation,
} from './types';
```

### Domain Boundaries and Communication

```typescript
// Cross-domain communication pattern
interface DomainEvent {
  domain: string;
  eventType: string;
  payload: Record<string, any>;
  timestamp: string;
  userId?: string;
}

// Example: Payroll domain listening to user events
export function useUserEvents() {
  const handleUserStatusChange = useCallback((event: DomainEvent) => {
    if (event.eventType === 'user_deactivated') {
      // Update payroll assignments
      invalidatePayrollCache(event.payload.userId);
    }
  }, []);
  
  useDomainEventListener('users', handleUserStatusChange);
}
```

## Custom Hook Development Patterns

### Enhanced Permissions Hook

```typescript
// hooks/use-enhanced-permissions.ts
export interface PermissionResult {
  granted: boolean;
  reason?: string;
  requiredRole?: string;
  currentRole?: string;
  suggestions?: string[];
  context?: Record<string, any>;
}

export interface PermissionOptions {
  strict?: boolean;
  requireAll?: boolean;
  context?: Record<string, any>;
}

export function useEnhancedPermissions() {
  const { userRole, permissions } = useAuthContext();
  
  const checkPermission = useCallback((
    resource: string,
    action: string,
    options: PermissionOptions = {}
  ): PermissionResult => {
    const permissionKey = `${resource}:${action}`;
    const granted = permissions.includes(permissionKey);
    
    if (!granted) {
      return {
        granted: false,
        reason: `Insufficient permissions for ${resource}:${action}`,
        requiredRole: getMinimumRoleForPermission(permissionKey),
        currentRole: userRole,
        suggestions: generatePermissionSuggestions(userRole, permissionKey),
        context: { 
          resource, 
          action, 
          timestamp: new Date().toISOString(),
          ...options.context 
        }
      };
    }
    
    return { 
      granted: true, 
      context: { resource, action, userRole, ...options.context } 
    };
  }, [permissions, userRole]);
  
  const checkMultiplePermissions = useCallback((
    permissionPairs: Array<[string, string]>,
    options: PermissionOptions = {}
  ): PermissionResult => {
    const results = permissionPairs.map(([resource, action]) => 
      checkPermission(resource, action, options)
    );
    
    const granted = options.requireAll 
      ? results.every(r => r.granted)
      : results.some(r => r.granted);
    
    if (!granted) {
      const deniedPermissions = results
        .filter(r => !r.granted)
        .map(r => r.reason)
        .join(', ');
        
      return {
        granted: false,
        reason: `Missing permissions: ${deniedPermissions}`,
        suggestions: results.flatMap(r => r.suggestions || []),
        context: { permissionPairs, checkType: options.requireAll ? 'ALL' : 'ANY' }
      };
    }
    
    return { granted: true, context: { permissionPairs } };
  }, [checkPermission]);
  
  return {
    checkPermission,
    checkMultiplePermissions,
    generatePermissionReport: () => ({
      userRole,
      permissions,
      availableActions: getAvailableActionsForRole(userRole),
      restrictedActions: getRestrictedActionsForRole(userRole),
    })
  };
}
```

### Strategic Query Hook

```typescript
// hooks/use-strategic-query.ts
interface CacheStrategyConfig {
  fetchPolicy: FetchPolicy;
  nextFetchPolicy?: FetchPolicy;
  errorPolicy: ErrorPolicy;
  realTimeUpdates: boolean;
  invalidationStrategy: 'immediate' | 'debounced' | 'manual';
  pollInterval?: number;
  notifyOnNetworkStatusChange?: boolean;
}

export const cacheStrategies: Record<string, CacheStrategyConfig> = {
  // High-frequency business data with real-time requirements
  payrolls: {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    errorPolicy: "all",
    realTimeUpdates: true,
    invalidationStrategy: "debounced",
    pollInterval: 45000, // 45 seconds fallback
    notifyOnNetworkStatusChange: true,
  },
  
  // Security events - always fresh, real-time critical
  securityEvents: {
    fetchPolicy: "network-only",
    errorPolicy: "all",
    realTimeUpdates: true,
    invalidationStrategy: "manual",
    notifyOnNetworkStatusChange: true,
  },
  
  // User data - less frequent updates, cache-preferred
  users: {
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-first",
    errorPolicy: "all",
    realTimeUpdates: false,
    invalidationStrategy: "immediate",
    notifyOnNetworkStatusChange: false,
  },
};

export const useStrategicQuery = <TData, TVariables>(
  document: DocumentNode,
  entityType: keyof typeof cacheStrategies,
  options?: QueryHookOptions<TData, TVariables>
) => {
  const strategy = getCacheStrategy(entityType);
  
  const queryOptions: QueryHookOptions<TData, TVariables> = {
    fetchPolicy: strategy.fetchPolicy,
    errorPolicy: strategy.errorPolicy,
    notifyOnNetworkStatusChange: strategy.notifyOnNetworkStatusChange ?? true,
    ...(strategy.pollInterval && { pollInterval: strategy.pollInterval }),
    ...(strategy.nextFetchPolicy && {
      nextFetchPolicy: strategy.nextFetchPolicy,
    }),
    ...options,
  };
  
  const result = useQuery<TData, TVariables>(document, queryOptions);
  
  // Add debug information in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Strategic Query [${entityType}]:`, {
        strategy,
        loading: result.loading,
        error: result.error,
        fromCache: result.data && !result.loading,
      });
    }
  }, [entityType, strategy, result.loading, result.error, result.data]);
  
  return result;
};
```

### Complex Business Logic Hook

```typescript
// hooks/use-payroll-versioning.ts
export interface PayrollVersioningResult {
  savePayrollEdit: (input: SavePayrollEditInput) => Promise<SavePayrollEditResult>;
  isVersioning: boolean;
  versionHistory: PayrollVersion[];
  currentVersion: PayrollVersion | null;
}

export function usePayrollVersioning(payrollId: string): PayrollVersioningResult {
  const [isVersioning, setIsVersioning] = useState(false);
  const [supersedeCurrentPayroll] = useMutation(SupersedeCurrentPayrollDocument);
  const [insertPayrollVersion] = useMutation(InsertPayrollVersionDocument);
  
  const savePayrollEdit = async (input: SavePayrollEditInput): Promise<SavePayrollEditResult> => {
    setIsVersioning(true);
    
    try {
      // Validate required fields
      if (!currentPayroll.client_id) {
        throw new Error("Payroll must have a client assigned");
      }
      
      const goLiveDateObj = new Date(input.go_live_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Date regeneration logic based on go_live_date
      const isGoLiveDateInPast = goLiveDateObj < today;
      const goLiveDate = input.go_live_date;
      
      // Step 1: Supersede current version with proper date logic
      await supersedeCurrentPayroll({
        variables: {
          id: currentPayroll.id,
          set: { 
            supersededDate: isGoLiveDateInPast ? today.toISOString() : goLiveDate 
          }
        }
      });
      
      // Step 2: Create merged data for new version
      const newVersionData = {
        parent_payroll_id: currentPayroll.parent_payroll_id || currentPayroll.id,
        version_number: (currentPayroll.version_number || 1) + 1,
        go_live_date: goLiveDate,
        // Merge existing fields with updates
        ...omit(currentPayroll, [
          'id', 'createdAt', 'updatedAt', 'supersededDate', 
          '__typename', 'payrollDates', 'notes'
        ]),
        ...input,
      };
      
      // Step 3: Insert new version (triggers automatic date generation)
      const { data } = await insertPayrollVersion({
        variables: { object: newVersionData }
      });
      
      const newVersionId = data?.insert_payrolls_one?.id;
      const versionNumber = data?.insert_payrolls_one?.version_number;
      const employeeCount = data?.insert_payrolls_one?.employee_count;
      
      return {
        success: true,
        newVersionId,
        versionNumber,
        employeeCount,
        message: `Payroll version ${versionNumber} created successfully`
      };
      
    } catch (error) {
      console.error("Error saving payroll edit:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to save payroll edit"
      );
    } finally {
      setIsVersioning(false);
    }
  };
  
  // Additional version management methods
  const getVersionHistory = useCallback(async () => {
    // Implementation for fetching version history
  }, [payrollId]);
  
  const revertToVersion = useCallback(async (versionId: string) => {
    // Implementation for version reversion
  }, [payrollId]);
  
  return {
    savePayrollEdit,
    isVersioning,
    versionHistory: [], // Would be populated from query
    currentVersion: null, // Would be populated from query
    getVersionHistory,
    revertToVersion,
  };
}
```

## Error Boundary Strategies

### Comprehensive Error Boundary

```typescript
// components/error-boundary.tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo, errorId: string) => void;
  level?: 'page' | 'section' | 'component';
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: null,
      errorInfo: null,
    };
  }
  
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId,
    };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    
    // Report error to monitoring service
    this.reportError(error, errorInfo);
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo, this.state.errorId!);
    
    // Show user notification
    this.showErrorNotification(error);
  }
  
  private reportError = (error: Error, errorInfo: React.ErrorInfo) => {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      level: this.props.level || 'component',
    };
    
    if (process.env.NODE_ENV === "production") {
      // Send to error reporting service (e.g., Sentry, LogRocket)
      console.error("Error reported:", errorReport);
    } else {
      console.error("Development Error:", errorReport);
    }
  };
  
  private showErrorNotification = (error: Error) => {
    toast.error("An unexpected error occurred", {
      description: error.message,
      action: {
        label: "Reload",
        onClick: () => window.location.reload(),
      },
      duration: 10000, // Longer duration for errors
    });
  };
  
  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: null,
      errorInfo: null,
    });
  };
  
  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      
      return (
        <FallbackComponent
          error={this.state.error}
          errorId={this.state.errorId!}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
          level={this.props.level}
        />
      );
    }
    
    return this.props.children;
  }
}
```

### Specialized Error Fallback Components

```typescript
// components/error-fallbacks.tsx
export function ApiErrorFallback({ error, reset, errorId }: ErrorFallbackProps) {
  const isNetworkError = error.message.includes('fetch') || error.message.includes('network');
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-6">
      <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {isNetworkError ? 'Connection Error' : 'API Error'}
      </h3>
      <p className="text-gray-600 text-center mb-4 max-w-md">
        {isNetworkError 
          ? 'We cannot reach our servers. Please check your internet connection.'
          : 'We encountered an error while communicating with our servers.'
        }
      </p>
      <div className="flex space-x-2">
        <Button onClick={reset} variant="outline">
          Try Again
        </Button>
        <Button onClick={() => window.location.reload()}>
          Reload Page
        </Button>
      </div>
      {errorId && (
        <p className="text-xs text-gray-400 mt-4">Error ID: {errorId}</p>
      )}
    </div>
  );
}

export function GraphQLErrorFallback({ error, reset, errorId }: ErrorFallbackProps) {
  const isPermissionError = error.message.includes('permission') || 
                           error.message.includes('access denied');
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-6">
      <Shield className="h-10 w-10 text-amber-500 mb-3" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {isPermissionError ? 'Access Denied' : 'Data Error'}
      </h3>
      <p className="text-gray-600 text-center mb-4">
        {isPermissionError
          ? 'You do not have permission to view this information.'
          : 'There was an error loading this data.'
        }
      </p>
      {!isPermissionError && (
        <Button onClick={reset} size="sm">
          Retry
        </Button>
      )}
      {errorId && (
        <p className="text-xs text-gray-400 mt-2">Error ID: {errorId}</p>
      )}
    </div>
  );
}
```

### Error Boundary Wrapper Component

```typescript
// components/error-boundary-wrapper.tsx
export function ErrorBoundaryWrapper({ 
  children, 
  level = 'section',
  fallbackType = 'default' 
}: {
  children: React.ReactNode;
  level?: 'page' | 'section' | 'component';
  fallbackType?: 'api' | 'graphql' | 'default';
}) {
  const getFallbackComponent = (type: string) => {
    switch (type) {
      case 'api':
        return ApiErrorFallback;
      case 'graphql':
        return GraphQLErrorFallback;
      default:
        return DefaultErrorFallback;
    }
  };
  
  return (
    <ErrorBoundary
      level={level}
      fallback={getFallbackComponent(fallbackType)}
      onError={(error, errorInfo, errorId) => {
        // Custom error handling logic
        console.log(`${level} error caught:`, { error, errorInfo, errorId });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
```

## Permission Guard Patterns

### Unified Permission System Integration

The application uses a **unified database-driven permission system** with role hierarchy and individual user overrides:

```typescript
// Always import from the unified auth barrel export
import { useAuthContext } from "@/lib/auth";

// Basic permission check (automatically includes role + overrides)
function BasicPermissionExample() {
  const { hasPermission } = useAuthContext();
  
  if (!hasPermission("payroll:write")) {
    return <AccessDenied />;
  }
  
  return <PayrollForm />;
}

// Enhanced permission usage with override information
function AdvancedPermissionExample() {
  const { 
    hasPermission,
    userRole,
    effectivePermissions,    // Role + override permissions
    permissionOverrides,     // Individual overrides only
    refreshPermissions,      // Refresh after permission changes
    getRolePermissions,      // Role permissions only
    getOverridePermissions   // Override permissions only
  } = useAuthContext();
  
  const payrollPerms = effectivePermissions.filter(p => p.resource === "payroll");
  const hasOverrides = permissionOverrides.length > 0;
  
  return (
    <div>
      <p>Role: {userRole}</p>
      <p>Payroll Permissions: {payrollPerms.length}</p>
      <p>Has Permission Overrides: {hasOverrides ? "Yes" : "No"}</p>
      {hasPermission("payroll:write") && <EditButton />}
      {hasPermission("payroll:delete") && <DeleteButton />}
    </div>
  );
}
```

### Flexible Permission Guard Component

```typescript
// components/auth/permission-guard.tsx - Updated for unified system
interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  role?: string;
  roles?: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
  showReason?: boolean;
}

export function PermissionGuard({
  children,
  permission,
  permissions = [],
  role,
  roles = [],
  requireAll = false,
  fallback = null,
  loadingFallback = null,
  showReason = false,
}: PermissionGuardProps) {
  const { isLoading, hasPermission, hasAnyPermission, hasRole, userRole } = useAuthContext();
  
  if (isLoading) {
    return <>{loadingFallback}</>;
  }
  
  // Build permission and role arrays
  const allPermissions = [...permissions, ...(permission ? [permission] : [])];
  const allRoles = [...roles, ...(role ? [role] : [])];
  
  // Check permissions
  let hasRequiredPermissions = true;
  if (allPermissions.length > 0) {
    hasRequiredPermissions = requireAll
      ? allPermissions.every(p => hasPermission(p))
      : hasAnyPermission(allPermissions);
  }
  
  // Check roles
  let hasRequiredRoles = true;
  if (allRoles.length > 0) {
    hasRequiredRoles = allRoles.includes(userRole);
  }
  
  const hasAccess = hasRequiredPermissions && hasRequiredRoles;
  
  if (!hasAccess && showReason) {
    const missingPermissions = allPermissions.filter(p => !hasPermission(p));
    const invalidRole = allRoles.length > 0 && !allRoles.includes(userRole);
    
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
        <div className="flex">
          <Shield className="h-5 w-5 text-amber-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800">
              Access Restricted
            </h3>
            <div className="mt-2 text-sm text-amber-700">
              {missingPermissions.length > 0 && (
                <p>Missing permissions: {missingPermissions.join(', ')}</p>
              )}
              {invalidRole && (
                <p>Required role: {allRoles.join(' or ')}, current: {userRole}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
```

### Convenience Guards for Common Patterns

```typescript
// components/auth/convenience-guards.tsx
export function AdminGuard({ children, fallback = null }: GuardProps) {
  return (
    <PermissionGuard roles={["org_admin"]} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function ManagerGuard({ children, fallback = null }: GuardProps) {
  return (
    <PermissionGuard roles={["org_admin", "manager"]} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function StaffManagerGuard({ children, fallback = null }: GuardProps) {
  return (
    <PermissionGuard permission="staff:write" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function PayrollProcessorGuard({ children, fallback = null }: GuardProps) {
  return (
    <PermissionGuard permission="payroll:write" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function DeveloperGuard({ children, fallback = null }: GuardProps) {
  return (
    <PermissionGuard roles={["developer"]} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}
```

### Enhanced Permission Guard

```typescript
// components/auth/enhanced-permission-guard.tsx
export function EnhancedPermissionGuard({
  resource,
  action,
  children,
  fallback,
  showDetails = false
}: {
  resource: string;
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showDetails?: boolean;
}) {
  const { checkPermission } = useEnhancedPermissions();
  const result = checkPermission(resource, action);
  
  if (result.granted) {
    return <>{children}</>;
  }
  
  if (showDetails) {
    return (
      <PermissionDeniedDetails
        result={result}
        resource={resource}
        action={action}
      />
    );
  }
  
  return <>{fallback}</>;
}

function PermissionDeniedDetails({ result, resource, action }: {
  result: PermissionResult;
  resource: string;
  action: string;
}) {
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center mb-4">
        <Shield className="h-6 w-6 text-red-500" />
        <h3 className="ml-2 text-lg font-semibold text-gray-900">
          Access Denied
        </h3>
      </div>
      
      <div className="space-y-3 text-sm text-gray-600">
        <p><strong>Action:</strong> {action} on {resource}</p>
        <p><strong>Reason:</strong> {result.reason}</p>
        
        {result.currentRole && result.requiredRole && (
          <p>
            <strong>Role:</strong> You have {result.currentRole}, but {result.requiredRole} is required
          </p>
        )}
        
        {result.suggestions && result.suggestions.length > 0 && (
          <div>
            <strong>Suggestions:</strong>
            <ul className="mt-1 list-disc list-inside">
              {result.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
```

## Form Handling Best Practices

### Compound Form Components

```typescript
// components/ui/form.tsx
const FormFieldContext = React.createContext<{ name: string } | null>(null);

const FormField = <TFieldValues, TName extends FieldPath<TFieldValues>>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();
  
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }
  
  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext;
  
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId();
    
    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn("space-y-2", className)} {...props} />
      </FormItemContext.Provider>
    );
  }
);
```

### Advanced Form Validation

```typescript
// utils/form-validation.ts
export const createUserSchema = (mode: 'create' | 'edit') => {
  const baseSchema = z.object({
    firstName: z.string()
      .min(1, "First name is required")
      .max(50, "First name must be less than 50 characters"),
    lastName: z.string()
      .min(1, "Last name is required")
      .max(50, "Last name must be less than 50 characters"),
    email: z.string()
      .email("Please enter a valid email address")
      .max(255, "Email must be less than 255 characters"),
  });
  
  if (mode === 'create') {
    return baseSchema.extend({
      role: z.enum(["developer", "org_admin", "manager", "consultant", "viewer"], {
        required_error: "Please select a role",
      }),
      managerId: z.string().optional(),
      sendInvitation: z.boolean().default(true),
    });
  }
  
  return baseSchema.extend({
    role: z.enum(["developer", "org_admin", "manager", "consultant", "viewer"]).optional(),
    isActive: z.boolean().optional(),
    managerId: z.string().optional(),
  });
};

// Custom validation functions
export const validateEmailUnique = async (email: string, excludeId?: string) => {
  const { data } = await apolloClient.query({
    query: CheckEmailExistsDocument,
    variables: { email, excludeId },
  });
  
  return !data.users.length;
};

export const createAsyncValidator = <T>(
  validator: (value: T) => Promise<boolean>,
  errorMessage: string
) => {
  return async (value: T) => {
    const isValid = await validator(value);
    return isValid || errorMessage;
  };
};
```

### Form Hook Pattern

```typescript
// hooks/use-form-with-validation.ts
export function useFormWithValidation<T extends FieldValues>({
  schema,
  defaultValues,
  mode = 'onChange',
  onSubmit,
  onError,
}: {
  schema: z.ZodSchema<T>;
  defaultValues: T;
  mode?: 'onChange' | 'onBlur' | 'onSubmit';
  onSubmit: (data: T) => Promise<void>;
  onError?: (errors: FieldErrors<T>) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode,
  });
  
  const handleSubmit = form.handleSubmit(
    async (data: T) => {
      setIsSubmitting(true);
      setSubmitError(null);
      
      try {
        await onSubmit(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Submission failed';
        setSubmitError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    (errors) => {
      onError?.(errors);
      
      // Show first error in toast
      const firstError = Object.values(errors)[0]?.message;
      if (firstError) {
        toast.error(firstError);
      }
    }
  );
  
  const resetForm = useCallback(() => {
    form.reset(defaultValues);
    setSubmitError(null);
  }, [form, defaultValues]);
  
  return {
    form,
    handleSubmit,
    isSubmitting,
    submitError,
    resetForm,
    isDirty: form.formState.isDirty,
    isValid: form.formState.isValid,
  };
}
```

## Advanced TypeScript Patterns

### Discriminated Unions for API Responses

```typescript
// types/api.ts
export interface ApiError {
  success: false;
  error: string;
  details?: string | Record<string, any>;
  code?: string;
  timestamp?: string;
}

export interface ApiSuccess<T = any> {
  success: true;
  data?: T;
  message?: string;
  timestamp?: string;
}

export type ApiResponse<T = any> = ApiSuccess<T> | ApiError;

// Type guards
export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccess<T> {
  return response.success === true;
}

export function isApiError<T>(response: ApiResponse<T>): response is ApiError {
  return response.success === false;
}

// Usage example
async function handleApiCall<T>(apiCall: () => Promise<ApiResponse<T>>): Promise<T> {
  const response = await apiCall();
  
  if (isApiError(response)) {
    throw new Error(response.error);
  }
  
  return response.data!;
}
```

### Branded Types for Business Logic

```typescript
// types/branded.ts
export type Brand<K, T> = K & { __brand: T };

export type UserId = Brand<string, 'UserId'>;
export type PayrollId = Brand<string, 'PayrollId'>;
export type ClientId = Brand<string, 'ClientId'>;
export type EmailAddress = Brand<string, 'EmailAddress'>;
export type Permission = Brand<string, 'Permission'>; // Format: "resource:action"

// Type constructors
export function createUserId(id: string): UserId {
  return id as UserId;
}

export function createEmailAddress(email: string): EmailAddress {
  if (!email.includes('@')) {
    throw new Error('Invalid email address');
  }
  return email as EmailAddress;
}

export function createPermission(resource: string, action: string): Permission {
  return `${resource}:${action}` as Permission;
}

// Utility types
export type UserRole = "developer" | "org_admin" | "manager" | "consultant" | "viewer";
export type PayrollStatus = "Active" | "Implementation" | "Inactive";
export type BusinessWeekday = 0 | 1 | 2 | 3 | 4 | 5; // 0 = non-business day

// Complex conditional types
export type PermissionActions<T extends string> = T extends 'staff' 
  ? 'read' | 'write' | 'delete' | 'invite'
  : T extends 'payroll'
  ? 'read' | 'write' | 'delete' | 'assign'
  : T extends 'client'
  ? 'read' | 'write' | 'delete'
  : T extends 'admin'
  ? 'manage'
  : 'read';
```

### Advanced Generic Patterns

```typescript
// types/utilities.ts
export type NonEmptyArray<T> = [T, ...T[]];

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Entity management types
export interface Entity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateEntity<T extends Entity> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateEntity<T extends Entity> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;

// Form types
export type FormMode = 'create' | 'edit' | 'view';

export interface FormProps<T extends Entity> {
  mode: FormMode;
  data?: T;
  onSubmit: (data: FormMode extends 'create' ? CreateEntity<T> : UpdateEntity<T>) => Promise<void>;
  onCancel: () => void;
}

// Permission system types
export interface PermissionCheck {
  resource: string;
  action: string;
  granted: boolean;
  reason?: string;
}

export type PermissionMatrix<T extends Record<string, any>> = {
  [K in keyof T]: {
    [A in PermissionActions<string>]?: boolean;
  };
};
```

## Component Composition Patterns

### Context Provider with Memoization

```typescript
// lib/auth/auth-context.tsx
interface AuthContextType {
  // User state
  user: User | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  
  // Database state  
  databaseUser: DatabaseUser | null;
  userRole: UserRole;
  userPermissions: string[];
  
  // Permission functions
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasRole: (roles: string[]) => boolean;
  
  // Computed permissions
  computedPermissions: ComputedPermissions;
  
  // Actions
  refetchUser: () => Promise<void>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const { sessionClaims } = useSession();
  
  // Memoized user role calculation
  const userRole: UserRole = useMemo(() => {
    if (databaseUser?.role) {
      return databaseUser.role as UserRole;
    }
    
    const claims = sessionClaims?.["https://hasura.io/jwt/claims"] as any;
    return claims?.["x-hasura-role"] || "viewer";
  }, [databaseUser?.role, sessionClaims]);
  
  // Memoized permissions calculation
  const userPermissions = useMemo(() => {
    return getPermissionsForRole(userRole);
  }, [userRole]);
  
  // Memoized permission functions
  const hasPermission = useCallback((permission: string): boolean => {
    return userPermissions.includes(permission);
  }, [userPermissions]);
  
  const hasAnyPermission = useCallback((permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  }, [hasPermission]);
  
  const hasRole = useCallback((roles: string[]): boolean => {
    return roles.includes(userRole);
  }, [userRole]);
  
  // Memoized computed permissions
  const computedPermissions = useMemo(() => ({
    // Staff permissions
    canViewStaff: hasPermission("staff:read"),
    canManageStaff: hasPermission("staff:write"),
    canInviteStaff: hasPermission("staff:invite"),
    canDeleteStaff: hasPermission("staff:delete"),
    
    // Payroll permissions
    canViewPayrolls: hasPermission("payroll:read"),
    canManagePayrolls: hasPermission("payroll:write"),
    canDeletePayrolls: hasPermission("payroll:delete"),
    canAssignPayrolls: hasPermission("payroll:assign"),
    
    // Client permissions
    canViewClients: hasPermission("client:read"),
    canManageClients: hasPermission("client:write"),
    canDeleteClients: hasPermission("client:delete"),
    
    // Admin permissions
    canAccessSettings: hasPermission("settings:write"),
    canManageSystem: hasPermission("admin:manage"),
    canViewAuditLogs: hasPermission("audit:read"),
    canManageAuditLogs: hasPermission("audit:write"),
    
    // Reporting permissions
    canViewReports: hasPermission("reports:read"),
    canExportReports: hasPermission("reports:export"),
  }), [hasPermission]);
  
  // Memoized context value
  const contextValue = useMemo(() => ({
    user,
    isLoaded,
    isSignedIn,
    databaseUser,
    userRole,
    userPermissions,
    hasPermission,
    hasAnyPermission,
    hasRole,
    computedPermissions,
    refetchUser,
  }), [
    user,
    isLoaded,
    isSignedIn,
    databaseUser,
    userRole,
    userPermissions,
    hasPermission,
    hasAnyPermission,
    hasRole,
    computedPermissions,
    refetchUser,
  ]);
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Compound Component Pattern

```typescript
// components/ui/data-table.tsx
interface DataTableContextType {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
  // ... other table state
}

const DataTableContext = React.createContext<DataTableContextType | null>(null);

function DataTable<TData>({ 
  data, 
  columns, 
  children 
}: {
  data: TData[];
  columns: ColumnDef<TData>[];
  children: React.ReactNode;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  
  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  
  const contextValue = useMemo(() => ({
    table,
    sorting,
    columnFilters,
    pagination,
  }), [table, sorting, columnFilters, pagination]);
  
  return (
    <DataTableContext.Provider value={contextValue}>
      <div className="space-y-4">
        {children}
      </div>
    </DataTableContext.Provider>
  );
}

// Compound components
DataTable.Toolbar = function DataTableToolbar({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-between">{children}</div>;
};

DataTable.Search = function DataTableSearch({ column }: { column: string }) {
  const context = useContext(DataTableContext);
  if (!context) throw new Error('DataTableSearch must be used within DataTable');
  
  const { table } = context;
  
  return (
    <Input
      placeholder={`Search ${column}...`}
      value={(table.getColumn(column)?.getFilterValue() as string) ?? ""}
      onChange={(event) =>
        table.getColumn(column)?.setFilterValue(event.target.value)
      }
      className="max-w-sm"
    />
  );
};

DataTable.Content = function DataTableContent() {
  const context = useContext(DataTableContext);
  if (!context) throw new Error('DataTableContent must be used within DataTable');
  
  const { table } = context;
  
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())
                }
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={table.getVisibleFlatColumns().length}>
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

DataTable.Pagination = function DataTablePagination() {
  const context = useContext(DataTableContext);
  if (!context) throw new Error('DataTablePagination must be used within DataTable');
  
  const { table } = context;
  
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
        {Math.min(
          (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
          table.getFilteredRowModel().rows.length
        )}{" "}
        of {table.getFilteredRowModel().rows.length} results
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

// Usage example
function UserTable() {
  const { data, loading } = useQuery(GetUsersDocument);
  
  if (loading) return <TableSkeleton />;
  
  return (
    <DataTable data={data.users} columns={userColumns}>
      <DataTable.Toolbar>
        <DataTable.Search column="name" />
        <Button onClick={() => setCreateModalOpen(true)}>
          Add User
        </Button>
      </DataTable.Toolbar>
      <DataTable.Content />
      <DataTable.Pagination />
    </DataTable>
  );
}
```

## State Management Strategies

### Apollo Client Modular Architecture

```typescript
// lib/apollo/unified-client.ts
interface UnifiedClientOptions {
  useWebSocket?: boolean;
  enableRetries?: boolean;
  enableAuth?: boolean;
  debug?: boolean;
}

export function createUnifiedApolloClient(options: UnifiedClientOptions = {}): ApolloClient<NormalizedCacheObject> {
  const {
    useWebSocket = true,
    enableRetries = true,
    enableAuth = true,
    debug = process.env.NODE_ENV === 'development'
  } = options;

  // Create cache with optimized policies
  const cache = createOptimizedCache();
  
  // Build link chain with proper ordering
  const links: ApolloLink[] = [];
  
  // 1. Error link (first to catch all errors)
  links.push(createErrorLink());
  
  // 2. Retry link (second for retry logic)
  if (enableRetries) {
    links.push(createRetryLink());
  }
  
  // 3. Auth link (third for authentication)
  if (enableAuth) {
    links.push(createAuthLink());
  }
  
  // 4. Split link for HTTP/WebSocket (last)
  const httpLink = createHttpLink();
  const wsLink = useWebSocket ? createWebSocketLink(options) : null;
  
  const transportLink = wsLink
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
          );
        },
        wsLink,
        httpLink
      )
    : httpLink;
  
  links.push(transportLink);
  
  // Combine all links
  const link = ApolloLink.from(links);
  
  return new ApolloClient({
    link,
    cache,
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
        notifyOnNetworkStatusChange: true,
      },
      query: {
        errorPolicy: 'all',
      },
    },
  });
}
```

### Cache Invalidation Strategy

```typescript
// hooks/use-cache-invalidation.ts
export function useCacheInvalidation() {
  const client = useApolloClient();
  
  const invalidateEntity = useCallback(async ({ 
    typename, 
    id 
  }: {
    typename: string;
    id: string;
  }) => {
    try {
      const cacheId = client.cache.identify({ __typename: typename, id });
      const success = cacheId ? client.cache.evict({ id: cacheId }) : false;
      
      // Garbage collect to remove dangling references
      client.cache.gc();
      
      return success;
    } catch (error) {
      console.error(`Error invalidating ${typename}:${id}:`, error);
      return false;
    }
  }, [client]);
  
  const invalidateQueries = useCallback(async (queryNames: string[]) => {
    await client.refetchQueries({
      include: queryNames,
    });
  }, [client]);
  
  const refreshEntity = useCallback(async (
    typename: string,
    id: string,
    queries: DocumentNode[]
  ) => {
    // Step 1: Evict from cache
    await invalidateEntity({ typename, id });
    
    // Step 2: Refetch specific queries
    await Promise.allSettled(
      queries.map(query => 
        client.refetchQueries({ include: [query] })
      )
    );
  }, [client, invalidateEntity]);
  
  return {
    invalidateEntity,
    invalidateQueries,
    refreshEntity,
  };
}
```

## API Integration Patterns

### Secure API Route Pattern

```typescript
// app/api/secure-route/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { rateLimit } from '@/lib/rate-limit';

// Request validation schema
const RequestSchema = z.object({
  action: z.enum(['create', 'update', 'delete']),
  data: z.record(z.any()),
  metadata: z.record(z.any()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting
    const identifier = request.ip ?? 'anonymous';
    const { success } = await rateLimit.limit(identifier);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests' }, 
        { status: 429 }
      );
    }
    
    // 2. Authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }
    
    // 3. Request validation
    const body = await request.json();
    const validatedData = RequestSchema.parse(body);
    
    // 4. Permission checking
    const hasPermission = await checkUserPermission(
      userId, 
      validatedData.action
    );
    
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Insufficient permissions' }, 
        { status: 403 }
      );
    }
    
    // 5. Business logic
    const result = await processRequest(validatedData, userId);
    
    // 6. Audit logging
    await logAuditEvent({
      userId,
      action: validatedData.action,
      resource: 'api_endpoint',
      metadata: {
        ip: request.ip,
        userAgent: request.headers.get('user-agent'),
        ...validatedData.metadata,
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      data: result 
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid request data', 
          details: error.errors 
        }, 
        { status: 400 }
      );
    }
    
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
```

### GraphQL Integration Pattern

```typescript
// services/graphql-service.ts
export class GraphQLService {
  constructor(private client: ApolloClient<any>) {}
  
  async executeQuery<T, V = any>(
    query: DocumentNode,
    variables?: V,
    options: {
      fetchPolicy?: FetchPolicy;
      errorPolicy?: ErrorPolicy;
      cache?: boolean;
    } = {}
  ): Promise<T> {
    try {
      const { data } = await this.client.query<T, V>({
        query,
        variables,
        fetchPolicy: options.fetchPolicy || 'cache-first',
        errorPolicy: options.errorPolicy || 'all',
      });
      
      return data;
    } catch (error) {
      if (error instanceof ApolloError) {
        throw this.handleGraphQLError(error);
      }
      throw error;
    }
  }
  
  async executeMutation<T, V = any>(
    mutation: DocumentNode,
    variables?: V,
    options: {
      optimisticResponse?: T;
      update?: MutationUpdaterFunction<T>;
      refetchQueries?: string[];
    } = {}
  ): Promise<T> {
    try {
      const { data } = await this.client.mutate<T, V>({
        mutation,
        variables,
        optimisticResponse: options.optimisticResponse,
        update: options.update,
        refetchQueries: options.refetchQueries,
      });
      
      return data!;
    } catch (error) {
      if (error instanceof ApolloError) {
        throw this.handleGraphQLError(error);
      }
      throw error;
    }
  }
  
  private handleGraphQLError(error: ApolloError): Error {
    // Handle different types of GraphQL errors
    if (error.graphQLErrors.length > 0) {
      const graphQLError = error.graphQLErrors[0];
      
      // Permission errors
      if (graphQLError.extensions?.code === 'access-denied') {
        return new Error(`Access denied: ${graphQLError.message}`);
      }
      
      // Validation errors
      if (graphQLError.extensions?.code === 'validation-failed') {
        return new Error(`Validation failed: ${graphQLError.message}`);
      }
      
      return new Error(graphQLError.message);
    }
    
    // Network errors
    if (error.networkError) {
      return new Error('Network error: Please check your connection');
    }
    
    return new Error('An unexpected error occurred');
  }
}
```

## Testing Patterns

### Component Testing with Mocks

```typescript
// __tests__/components/dashboard.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { useUser } from '@clerk/nextjs';
import Dashboard from '@/app/(dashboard)/dashboard/page';

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(),
}));

// Mock components
jest.mock('@/components/ui/metrics-card', () => ({
  MetricsCard: ({ title, value, icon: Icon }: any) => (
    <div data-testid="metrics-card">
      <div data-testid="title">{title}</div>
      <div data-testid="value">{value}</div>
      {Icon && <Icon data-testid="icon" />}
    </div>
  ),
}));

const mockUser = {
  id: 'user_123',
  emailAddresses: [{ emailAddress: 'test@example.com' }],
  firstName: 'Test',
  lastName: 'User',
};

const graphqlMocks = [
  {
    request: {
      query: GetDashboardStatsDocument,
    },
    result: {
      data: {
        users_aggregate: { aggregate: { count: 10 } },
        clients_aggregate: { aggregate: { count: 5 } },
        payrolls_aggregate: { aggregate: { count: 15 } },
      },
    },
  },
];

describe('Dashboard', () => {
  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({
      user: mockUser,
      isLoaded: true,
      isSignedIn: true,
    });
  });
  
  it('renders dashboard with metrics', async () => {
    render(
      <MockedProvider mocks={graphqlMocks} addTypename={false}>
        <Dashboard />
      </MockedProvider>
    );
    
    // Check loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      const metricCards = screen.getAllByTestId('metrics-card');
      expect(metricCards).toHaveLength(3);
    });
    
    // Check specific metrics
    expect(screen.getByText('10')).toBeInTheDocument(); // Users
    expect(screen.getByText('5')).toBeInTheDocument();  // Clients
    expect(screen.getByText('15')).toBeInTheDocument(); // Payrolls
  });
  
  it('handles loading state correctly', () => {
    (useUser as jest.Mock).mockReturnValue({
      user: null,
      isLoaded: false,
      isSignedIn: false,
    });
    
    render(
      <MockedProvider mocks={graphqlMocks}>
        <Dashboard />
      </MockedProvider>
    );
    
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });
});
```

### Custom Testing Utilities

```typescript
// __tests__/utils/test-utils.tsx
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { ClerkProvider } from '@clerk/nextjs';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  mocks?: MockedResponse[];
  user?: any;
  initialCache?: any;
}

function customRender(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const { mocks = [], user = null, initialCache, ...renderOptions } = options;
  
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <ClerkProvider
        publishableKey="pk_test_123"
        signInFallbackRedirectUrl="/dashboard"
        signUpFallbackRedirectUrl="/dashboard"
      >
        <MockedProvider 
          mocks={mocks} 
          addTypename={false}
          cache={initialCache}
        >
          {children}
        </MockedProvider>
      </ClerkProvider>
    );
  }
  
  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Permission testing utility
export function createMockAuthContext(overrides: Partial<AuthContextType> = {}) {
  return {
    user: null,
    isLoaded: true,
    isSignedIn: false,
    databaseUser: null,
    userRole: 'viewer' as UserRole,
    userPermissions: [],
    hasPermission: jest.fn(() => false),
    hasAnyPermission: jest.fn(() => false),
    hasRole: jest.fn(() => false),
    computedPermissions: {},
    refetchUser: jest.fn(),
    ...overrides,
  };
}

// GraphQL mock helpers
export function createMockResponse<T>(
  query: DocumentNode,
  data: T,
  variables?: any
): MockedResponse {
  return {
    request: {
      query,
      variables,
    },
    result: {
      data,
    },
  };
}

export function createMockError(
  query: DocumentNode,
  error: string,
  variables?: any
): MockedResponse {
  return {
    request: {
      query,
      variables,
    },
    error: new Error(error),
  };
}

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
```

### Hook Testing Pattern

```typescript
// __tests__/hooks/use-enhanced-permissions.test.ts
import { renderHook } from '@testing-library/react';
import { useEnhancedPermissions } from '@/hooks/use-enhanced-permissions';
import { AuthContext } from '@/lib/auth/auth-context';
import { createMockAuthContext } from '@/test/utils/test-utils';

describe('useEnhancedPermissions', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => {
    const mockAuth = createMockAuthContext({
      userRole: 'manager',
      userPermissions: ['staff:read', 'staff:write', 'payroll:read'],
      hasPermission: jest.fn((permission) => 
        ['staff:read', 'staff:write', 'payroll:read'].includes(permission)
      ),
    });
    
    return (
      <AuthContext.Provider value={mockAuth}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  it('grants permission for allowed actions', () => {
    const { result } = renderHook(() => useEnhancedPermissions(), { wrapper });
    
    const check = result.current.checkPermission('staff', 'read');
    
    expect(check.granted).toBe(true);
    expect(check.context).toEqual({
      resource: 'staff',
      action: 'read',
      userRole: 'manager',
    });
  });
  
  it('denies permission with detailed feedback', () => {
    const { result } = renderHook(() => useEnhancedPermissions(), { wrapper });
    
    const check = result.current.checkPermission('admin', 'manage');
    
    expect(check.granted).toBe(false);
    expect(check.reason).toContain('Insufficient permissions');
    expect(check.requiredRole).toBeDefined();
    expect(check.suggestions).toHaveLength(0);
  });
  
  it('handles multiple permissions with requireAll', () => {
    const { result } = renderHook(() => useEnhancedPermissions(), { wrapper });
    
    const check = result.current.checkMultiplePermissions(
      [['staff', 'read'], ['payroll', 'read']],
      { requireAll: true }
    );
    
    expect(check.granted).toBe(true);
  });
});
```

## Best Practices Summary

### Development Principles

1. **Domain-Driven Design**: Organize code by business domains with clear boundaries
2. **Type Safety**: Use TypeScript extensively with branded types and strict validation
3. **Error Handling**: Implement comprehensive error boundaries with reporting
4. **Permission-First**: Check permissions at multiple layers (UI, API, database)
5. **Performance**: Use memoization, lazy loading, and strategic caching
6. **Testing**: Write comprehensive tests with proper mocking strategies

### Code Quality

1. **Consistency**: Follow established patterns across the codebase
2. **Reusability**: Create composable, reusable components and hooks
3. **Maintainability**: Write self-documenting code with clear interfaces
4. **Security**: Implement defense-in-depth with multiple security layers
5. **Performance**: Optimize for both initial load and runtime performance
6. **Accessibility**: Ensure all components work with assistive technologies

### Architecture Decisions

1. **Modular Apollo Client**: Separated concerns with clear link ordering
2. **Context-Based State**: Use React Context for cross-cutting concerns
3. **Compound Components**: Build flexible, composable component APIs
4. **Custom Hooks**: Encapsulate complex business logic in reusable hooks
5. **Error Boundaries**: Isolate errors with proper fallback strategies
6. **Permission Guards**: Flexible, declarative permission checking

## Related Documentation

- [Permission System Guide](/docs/PERMISSION_SYSTEM_GUIDE.md)
- [Apollo Client Architecture](/docs/architecture/APOLLO_CLIENT_ARCHITECTURE.md)
- [Performance Optimization](/docs/architecture/PERFORMANCE_OPTIMIZATION.md)
- [Modal Implementation Guide](/docs/components/MODAL_IMPLEMENTATION_GUIDE.md)

---

*Last Updated: December 2024*
*Next Review: January 2025*
