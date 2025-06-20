# Components Documentation

## Overview

The `/components` directory implements a layered component architecture following atomic design principles with enterprise security patterns. Components are organized by functionality and security requirements, with strict authentication and authorization controls integrated throughout.

## Architecture Patterns

- **Atomic Design**: Base UI components, composed business components, complex page layouts
- **Security-First**: Authentication guards, permission checks, and data protection built-in
- **Domain-Driven**: Business logic encapsulated in domain-specific components
- **Type Safety**: Comprehensive TypeScript with auto-generated GraphQL types
- **Accessibility**: WCAG 2.1 compliance with semantic HTML and ARIA attributes

## Component Organization

```
/components
├── /auth                 # Authentication and security components
├── /ui                   # Base design system components (shadcn/ui)
├── /examples            # Reference implementations and patterns
├── /error-boundary      # Error handling and recovery components
├── /users               # User management interface components
└── [business-domain]    # Domain-specific components (inline)
```

## Security Components (`/components/auth/`)

### `/components/auth/strict-database-guard.tsx`
- **Purpose**: Ensures authenticated user exists in database before allowing access
- **Authentication**: Requires valid Clerk session + database user record
- **Business Logic**:
  - Validates user exists in database with active status
  - Handles user creation if missing (with appropriate permissions)
  - Provides fallback UI during verification
  - Manages error states (account disabled, missing permissions)
- **Data Flow**:
  1. Component mounts with Clerk authentication context
  2. `GetCurrentUser` query verifies database user exists
  3. If missing, triggers user sync process
  4. Renders children only after successful verification
  5. Error states redirect to appropriate resolution flows
- **External Services**: Clerk for session, Hasura for user verification
- **Related Components**: `database-user-guard.tsx`, `route-guard.tsx`

### `/components/auth/permission-guard.tsx`
- **Purpose**: Role and permission-based component access control
- **Authentication**: Validates specific permissions for component access
- **Business Logic**:
  - Evaluates user permissions against required access levels
  - Supports role hierarchy and permission inheritance
  - Handles permission changes in real-time
  - Provides graceful fallbacks for insufficient permissions
- **Data Flow**:
  1. Component evaluates required permissions
  2. User's current permissions fetched from context
  3. Permission hierarchy calculation performed
  4. Access granted/denied based on evaluation result
  5. Real-time updates via permission change subscriptions
- **External Services**: Permission service, role management
- **Related Components**: `role-guard.tsx`, `enhanced-permission-guard.tsx`

### `/components/auth/role-guard.tsx`
- **Purpose**: Role-based access control for components
- **Authentication**: Validates user role meets minimum requirements
- **Business Logic**:
  - Role hierarchy enforcement (developer > org_admin > manager > consultant > viewer)
  - Dynamic role evaluation with real-time updates
  - Graceful degradation for role changes
  - Audit logging for access attempts
- **Data Flow**:
  1. Required role specified in component props
  2. Current user role retrieved from authentication context
  3. Role hierarchy comparison performed
  4. Component rendered or fallback displayed
  5. Role changes trigger immediate re-evaluation
- **External Services**: Role management service
- **Related Components**: All permission-based guards

### `/components/auth/route-guard.tsx`
- **Purpose**: Page-level authentication and authorization guard
- **Authentication**: Comprehensive route protection with multiple validation layers
- **Business Logic**:
  - Multi-step authentication validation
  - Database user verification
  - Route-specific permission checking
  - Session expiry handling
- **Data Flow**:
  1. Route access attempted
  2. Clerk session validation performed
  3. Database user existence verified
  4. Route permissions evaluated
  5. Access granted or redirect to appropriate page
- **External Services**: Clerk, database user service
- **Related Components**: Layout components, protected pages

## UI Components (`/components/ui/`)

Built on shadcn/ui with enterprise extensions:

### Base Components
- **Button**: Multiple variants (primary, secondary, destructive) with loading states
- **Input**: Form controls with validation, accessibility, and security features
- **Card**: Layout containers with consistent spacing and elevation
- **Table**: Data display with sorting, filtering, and pagination
- **Modal/Dialog**: Overlay components with focus management and escape handling

### Form Components
- **Form**: Comprehensive form handling with validation and error management
- **Select**: Dropdown components with search, multi-select, and accessibility
- **Calendar**: Date/time selection with business rule integration
- **Checkbox/Switch**: Boolean controls with indeterminate states

### Feedback Components
- **Alert**: Status messaging with severity levels and actions
- **Toast**: Non-intrusive notifications with queue management
- **Progress**: Loading and completion indicators
- **Skeleton**: Loading placeholders for improved perceived performance

## Business Domain Components

### User Management (`/components/users/`)

#### `/components/users/user-table.tsx`
- **Purpose**: Comprehensive user directory with management capabilities
- **Authentication**: Manager+ role required for user management actions
- **Business Logic**:
  - User directory display with role-based filtering
  - Bulk operations (invite, role changes, deactivation)
  - Search and filtering with advanced criteria
  - Export functionality with data protection
- **Data Flow**:
  1. `GetUsersWithDetails` query loads user directory
  2. Role-based filtering applied client-side
  3. Real-time updates via user change subscriptions
  4. Bulk operations trigger optimistic updates
  5. Error handling with rollback capabilities
- **External Services**: Clerk for user management, export services
- **Related Components**: `create-user-modal.tsx`, `edit-user-modal.tsx`

#### `/components/users/create-user-modal.tsx`
- **Purpose**: New user creation with Clerk invitation integration
- **Authentication**: Manager+ role required
- **Business Logic**:
  - User creation form with comprehensive validation
  - Role assignment with permission preview
  - Clerk invitation email automation
  - Database user record creation
- **Data Flow**:
  1. Manager initiates user creation
  2. Form validation ensures data completeness
  3. `CreateUser` mutation creates database record
  4. Clerk invitation triggered automatically
  5. Real-time status updates during creation process
- **External Services**: Clerk invitation API, email service
- **Related Components**: User management interface

#### `/components/users/edit-user-modal.tsx`
- **Purpose**: User profile and permission management interface
- **Authentication**: Manager+ role, or self-editing with restrictions
- **Business Logic**:
  - Profile information management
  - Role and permission modification
  - Account status management (active/disabled)
  - Audit trail for all changes
- **Data Flow**:
  1. User profile loaded for editing
  2. Changes validated against business rules
  3. `UpdateUser` mutation applied with optimistic updates
  4. Clerk metadata synchronized
  5. Permission changes effective immediately
- **External Services**: Clerk metadata API
- **Related Components**: User directory, profile pages

### Error Handling (`/components/error-boundary/`)

#### `/components/error-boundary/graphql-error-boundary.tsx`
- **Purpose**: GraphQL-specific error handling with user-friendly recovery
- **Authentication**: Handles auth errors gracefully without exposing sensitive data
- **Business Logic**:
  - GraphQL error classification and handling
  - Permission error detection and user guidance
  - Network error recovery with retry mechanisms
  - Security-aware error message filtering
- **Data Flow**:
  1. GraphQL error intercepted by boundary
  2. Error type classification performed
  3. User-appropriate error message generated
  4. Recovery actions provided based on error type
  5. Sensitive error details logged securely
- **External Services**: Error logging service
- **Related Components**: All GraphQL-consuming components

## Examples and Patterns (`/components/examples/`)

### `/components/examples/graceful-clients-list.tsx`
- **Purpose**: Reference implementation for permission-aware data loading
- **Authentication**: Demonstrates graceful degradation for insufficient permissions
- **Business Logic**:
  - Permission-based data filtering
  - Graceful error handling with fallbacks
  - Loading states and skeleton UI
  - Progressive enhancement based on user role
- **Data Flow**:
  1. Component attempts to load full client data
  2. Permission errors handled gracefully
  3. Fallback data provided where appropriate
  4. UI adapts to available data level
  5. User guided to request additional permissions
- **External Services**: Client data service
- **Related Components**: Error boundaries, permission guards

### `/components/examples/enhanced-users-list.tsx`
- **Purpose**: Advanced user list with real-time features and security
- **Authentication**: Role-based data access with real-time permission updates
- **Business Logic**:
  - Real-time user status updates
  - Advanced filtering and search
  - Bulk operations with confirmation
  - Export with data classification
- **Data Flow**:
  1. Initial user list loaded with role filtering
  2. Real-time subscriptions maintain current state
  3. User interactions trigger optimistic updates
  4. Background sync ensures data consistency
  5. Export operations apply additional security filtering
- **External Services**: Real-time sync, export services
- **Related Components**: User management components

## Business Logic Components (Inline)

### Payroll Management
- **`payroll-list-card.tsx`**: Payroll summary with quick actions
- **`payroll-version-history.tsx`**: Audit trail and version management
- **`payroll-dates-view.tsx`**: Schedule and deadline management
- **`export-pdf.tsx`**: PDF report generation with compliance formatting
- **`export-csv.tsx`**: CSV export with data classification handling

### Navigation and Layout
- **`sidebar.tsx`**: Main navigation with role-based menu items
- **`upcoming-payrolls.tsx`**: Dashboard widget for payroll deadlines
- **`urgent-alerts.tsx`**: Critical notifications and alerts

### Notes and Communication
- **`notes-list-with-add.tsx`**: Communication interface with audit trail
- **`real-time-updates.tsx`**: Live data synchronization component

## Component Security Patterns

### Authentication Integration
All components integrate with the authentication system:
- Clerk session validation
- Database user verification
- Permission-based rendering
- Graceful fallbacks for auth failures

### Data Protection
Components implement data protection measures:
- Role-based data masking
- PII handling compliance
- Secure data transmission
- Audit logging for sensitive operations

### Error Handling
Comprehensive error handling strategies:
- Security-aware error messages
- Graceful degradation patterns
- Recovery action guidance
- Error boundary implementation

## Performance Considerations

### Optimization Strategies
- Lazy loading for non-critical components
- Memoization for expensive calculations
- Virtual scrolling for large datasets
- Optimistic updates for better UX

### Real-time Features
- WebSocket subscriptions for live data
- Efficient update strategies
- Conflict resolution for concurrent edits
- Bandwidth optimization

## Testing Strategy

### Component Testing
- Unit tests for all business logic
- Integration tests for data flows
- Accessibility testing compliance
- Security testing for auth flows

### Visual Testing
- Storybook for component documentation
- Visual regression testing
- Cross-browser compatibility
- Mobile responsiveness validation

## Related Documentation
- [Authentication Guide](../lib/README.md) - Auth implementation details
- [API Documentation](../pages/api/README.md) - Backend integration
- [Security Report](../SECURITY_IMPROVEMENT_REPORT.md) - Security analysis