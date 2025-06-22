# Complete Page & Component Documentation - Payroll Matrix

## Table of Contents

1. [Authentication Pages](#authentication-pages)
2. [Dashboard & Overview](#dashboard--overview)
3. [Client Management](#client-management)
4. [Staff Management](#staff-management)
5. [Payroll Management](#payroll-management)
6. [Calendar & Scheduling](#calendar--scheduling)
7. [Security & Audit](#security--audit)
8. [Settings & Profile](#settings--profile)
9. [Developer Tools](#developer-tools)
10. [Utility Pages](#utility-pages)
11. [Component Architecture](#component-architecture)

---

## Authentication Pages

### Sign In Page
**Route:** `/sign-in/[[...sign-in]]`  
**File:** `app/(auth)/sign-in/[[...sign-in]]/page.tsx`

#### Purpose
Provides secure user authentication using Clerk's authentication system with support for email/password and OAuth providers.

#### User Interface Elements
- **Email/Password Form**: Primary authentication method
- **Google OAuth Button**: Social login integration
- **Remember Me Checkbox**: Persistent session option
- **Forgot Password Link**: Password recovery workflow
- **Sign Up Redirect**: Link to registration page

#### User Interactions
1. **Email Login**: User enters email and password
2. **OAuth Login**: Single-click Google authentication
3. **Password Recovery**: Forgot password flow with email verification
4. **Registration Redirect**: Navigate to sign-up page

#### Data Sources
- **Clerk Authentication Service**: User credentials and session management
- **Public Metadata**: Role and organization information

#### State Management
- **Clerk Session State**: Managed by Clerk provider
- **Form Validation**: Real-time input validation
- **Error Handling**: Authentication error display

#### API Calls
- `clerk.signIn()` - Authentication request
- `clerk.signUp()` - Registration redirect
- Webhook: User creation/update to database

#### Error Handling
- **Invalid Credentials**: Clear error messaging
- **Account Locked**: Security lockout notification
- **Network Issues**: Retry mechanism with user feedback
- **OAuth Failures**: Fallback to email authentication

#### Loading States
- **Spinner Animation**: During authentication process
- **Button Disabled State**: Prevent multiple submissions
- **OAuth Loading**: Provider-specific loading indicators

---

### Sign Up Page
**Route:** `/sign-up/[[...sign-up]]`  
**File:** `app/(auth)/sign-up/[[...sign-up]]/page.tsx`

#### Purpose
New user registration with role assignment and organization setup.

#### User Interface Elements
- **Registration Form**: Name, email, password fields
- **Role Selection**: Pre-populated from invitation
- **Terms & Conditions**: Legal agreement checkbox
- **Organization Code**: Company identification

#### User Interactions
1. **Form Completion**: Multi-step registration process
2. **Role Confirmation**: Verify assigned role and permissions
3. **Email Verification**: Mandatory email confirmation
4. **Initial Setup**: Basic profile configuration

#### Data Flow
```
User Input → Clerk Registration → Email Verification → Database User Creation → Role Assignment → Welcome Dashboard
```

---

### Accept Invitation Page
**Route:** `/accept-invitation`  
**File:** `app/(auth)/accept-invitation/page.tsx`

#### Purpose
Staff invitation acceptance workflow with role pre-assignment.

#### User Interface Elements
- **Invitation Details**: Organization, role, and permissions overview
- **Accept/Decline Buttons**: Clear action choices
- **Manager Information**: Reporting structure display
- **Getting Started Guide**: Next steps after acceptance

#### Business Logic
- **Invitation Validation**: Token expiry and authenticity checks
- **Role Assignment**: Automatic role provisioning
- **Manager Linking**: Hierarchical relationship establishment
- **Onboarding Trigger**: Welcome email and setup tasks

---

## Dashboard & Overview

### Main Dashboard
**Route:** `/dashboard`  
**File:** `app/(dashboard)/dashboard/page.tsx`

#### Purpose
Central hub providing personalized overview of user's work, responsibilities, and system status.

#### User Interface Elements
- **Welcome Header**: Personalized greeting with current date/time
- **Quick Stats Cards**: Key metrics based on user role
- **Recent Activity Feed**: Latest actions and updates
- **Upcoming Tasks Widget**: Payroll deadlines and assignments
- **Performance Metrics**: Individual and team KPIs
- **Notification Center**: System alerts and messages

#### Role-Based Content
```typescript
// Different dashboard widgets based on user role
const dashboardConfig = {
  developer: {
    widgets: ['system_health', 'error_logs', 'performance_metrics', 'database_stats'],
    permissions: ['full_system_access']
  },
  org_admin: {
    widgets: ['user_management', 'compliance_overview', 'billing_summary', 'audit_alerts'],
    permissions: ['user_management', 'system_settings']
  },
  manager: {
    widgets: ['team_overview', 'payroll_schedule', 'client_status', 'staff_assignments'],
    permissions: ['team_management', 'payroll_oversight']
  },
  consultant: {
    widgets: ['my_assignments', 'upcoming_deadlines', 'client_tasks', 'time_tracking'],
    permissions: ['payroll_processing', 'client_interaction']
  },
  viewer: {
    widgets: ['dashboard_overview', 'reports_summary', 'notifications'],
    permissions: ['read_only_access']
  }
};
```

#### Data Sources
- **GraphQL Subscriptions**: Real-time updates for assigned payrolls
- **Dashboard Stats Query**: Personalized metrics based on role
- **Recent Activity Query**: User and team activity feed
- **Notification Query**: System alerts and messages

#### State Management
- **Dashboard Context**: Widget visibility and preferences
- **Real-time Updates**: WebSocket connections for live data
- **User Preferences**: Customizable widget layout and settings

#### User Interactions
1. **Widget Customization**: Drag-and-drop widget arrangement
2. **Quick Actions**: One-click access to common tasks
3. **Filter Controls**: Date ranges and data filtering
4. **Drill-down Navigation**: Click-through to detailed views

---

## Client Management

### Client List Page
**Route:** `/clients`  
**File:** `app/(dashboard)/clients/page.tsx`

#### Purpose
Comprehensive client portfolio management with search, filtering, and bulk operations.

#### User Interface Elements
- **Search & Filter Bar**: Multi-criteria client search
- **Client Cards/Table**: Switchable view modes
- **Bulk Action Toolbar**: Multi-select operations
- **New Client Button**: Quick client creation
- **Export Controls**: Data export options
- **Pagination Controls**: Large dataset navigation

#### Advanced Features
- **Smart Search**: Full-text search across all client data
- **Filter Combinations**: Status, consultant, billing plan filters
- **Bulk Operations**: Mass updates and assignments
- **Quick Actions**: Inline edit and status changes

#### Data Flow
```
User Input → Search/Filter → GraphQL Query → Results Display → User Selection → Action Execution
```

#### User Interactions
1. **Search**: Real-time client search with auto-suggestions
2. **Filter**: Multi-dimensional filtering with saved filters
3. **Sort**: Column-based sorting with custom criteria
4. **Select**: Single and multi-client selection
5. **Actions**: Bulk operations and individual client actions

#### State Management
- **Search State**: Query persistence and history
- **Filter State**: Active filters and presets
- **Selection State**: Multi-select client management
- **View State**: Table/card view preferences

---

### Client Details Page
**Route:** `/clients/[id]`  
**File:** `app/(dashboard)/clients/[id]/page.tsx`

#### Purpose
Complete client profile with payroll management, staff assignments, and billing information.

#### User Interface Elements
- **Client Header**: Company information and status
- **Tabbed Navigation**: Organized information sections
  - **Overview**: Basic client information and quick stats
  - **Payrolls**: Associated payroll configurations
  - **Contacts**: Client contact management
  - **Billing**: Billing plans and invoice history
  - **Documents**: Client-related documentation
  - **Activity**: Audit trail and history

#### Tab: Overview
- **Company Information**: Address, ABN, industry details
- **Primary Contacts**: Key client personnel
- **Account Manager**: Assigned consultant and manager
- **Quick Stats**: Payroll count, employee count, processing volume
- **Status Indicators**: Active payrolls, next processing dates

#### Tab: Payrolls
- **Payroll List**: All client payrolls with status
- **Quick Actions**: Add new payroll, edit existing
- **Assignment Management**: Consultant and manager assignments
- **Processing Schedule**: Upcoming EFT dates and deadlines

#### Tab: Billing
- **Current Plan**: Active billing plan details
- **Invoice History**: Past invoices and payment status
- **Usage Metrics**: Processing volume and fees
- **Billing Contacts**: Accounts payable information

#### Data Sources
- **Client Detail Query**: Complete client profile
- **Payroll List Query**: Client's payroll configurations
- **Billing Query**: Billing plan and invoice data
- **Activity Log Query**: Client activity history

#### Real-time Features
- **Live Status Updates**: Payroll processing status changes
- **Activity Stream**: Real-time client activity feed
- **Notification Integration**: Client-specific alerts

---

### Create Client Page
**Route:** `/clients/new`  
**File:** `app/(dashboard)/clients/new/page.tsx`

#### Purpose
Guided client onboarding with validation, duplicate detection, and automated setup.

#### User Interface Elements
- **Multi-step Wizard**: Progressive disclosure of form sections
- **Progress Indicator**: Visual completion status
- **Validation Feedback**: Real-time form validation
- **Duplicate Detection**: Automatic duplicate client detection
- **Save Draft**: Work-in-progress persistence
- **Template Selection**: Pre-configured client types

#### Form Sections
1. **Basic Information**: Company name, ABN, industry
2. **Contact Details**: Primary and billing contacts
3. **Billing Setup**: Plan selection and payment terms
4. **Initial Payroll**: First payroll configuration (optional)
5. **Staff Assignment**: Consultant and manager assignment
6. **Review & Confirm**: Final validation and submission

#### Validation Rules
- **Required Fields**: Essential client information
- **Business Rules**: ABN validation, unique company names
- **Format Validation**: Email, phone, postal codes
- **Duplicate Detection**: Fuzzy matching on company names

#### Business Logic
```typescript
// Client creation workflow
const createClientWorkflow = {
  1: { validation: 'basic_info', next: 2 },
  2: { validation: 'contacts', next: 3 },
  3: { validation: 'billing', next: 4, optional: true },
  4: { validation: 'payroll_setup', next: 5, optional: true },
  5: { validation: 'staff_assignment', next: 'submit' }
};
```

---

## Staff Management

### Staff List Page
**Route:** `/staff`  
**File:** `app/(dashboard)/staff/page.tsx`

#### Purpose
Complete staff directory with role management, work assignments, and performance tracking.

#### Access Control
- **Admin Only**: Full staff management capabilities
- **Manager**: Limited to direct reports and consultants
- **Others**: Read-only access to basic staff directory

#### User Interface Elements
- **Staff Directory**: Comprehensive staff listing
- **Role Filter**: Filter by organizational role
- **Status Filter**: Active, inactive, on-leave filters
- **Quick Actions**: Role changes, deactivation, messaging
- **Bulk Operations**: Mass role updates and notifications
- **Work Schedule View**: Staff availability and assignments

#### Advanced Features
- **Hierarchical View**: Organizational chart display
- **Workload Analysis**: Assignment distribution and capacity
- **Performance Metrics**: Individual and team performance
- **Leave Calendar**: Staff leave schedule integration

#### Data Sources
- **Staff Directory Query**: Complete staff listing with roles
- **Assignment Query**: Current payroll assignments
- **Performance Query**: Staff performance metrics
- **Leave Query**: Staff leave schedules

---

### Staff Details Page
**Route:** `/staff/[id]`  
**File:** `app/(dashboard)/staff/[id]/page.tsx`

#### Purpose
Individual staff member profile with complete work history, assignments, and performance data.

#### User Interface Elements
- **Staff Profile Header**: Photo, name, role, status
- **Tabbed Interface**: Organized information sections
  - **Profile**: Personal and professional information
  - **Assignments**: Current and historical payroll assignments
  - **Performance**: KPIs and performance reviews
  - **Schedule**: Work schedule and availability
  - **Leave**: Leave history and upcoming time off
  - **Activity**: System activity and audit trail

#### Role-Based Access
```typescript
// Access control for staff details
const staffAccessControl = {
  canViewProfile: (viewer: User, target: User) => {
    return viewer.role === 'admin' || 
           viewer.role === 'org_admin' ||
           viewer.id === target.managerId ||
           viewer.id === target.id;
  },
  canEditProfile: (viewer: User, target: User) => {
    return viewer.role === 'admin' || 
           (viewer.role === 'org_admin' && target.role !== 'admin') ||
           viewer.id === target.id;
  }
};
```

---

### Create Staff Page
**Route:** `/staff/new`  
**File:** `app/(dashboard)/staff/new/page.tsx`

#### Purpose
New staff member onboarding with role assignment, manager linking, and invitation management.

#### User Interface Elements
- **Staff Creation Form**: Personal and professional details
- **Role Assignment**: Hierarchical role selection
- **Manager Assignment**: Reporting structure setup
- **Work Schedule**: Initial schedule configuration
- **Invitation Settings**: Invitation email customization
- **Permission Preview**: Role-based permission display

#### Validation & Business Logic
- **Email Uniqueness**: Prevent duplicate staff accounts
- **Role Hierarchy**: Ensure proper reporting structure
- **Manager Validation**: Verify manager eligibility
- **Permission Consistency**: Role-permission alignment

---

## Payroll Management

### Payroll List Page
**Route:** `/payrolls`  
**File:** `app/(dashboard)/payrolls/page.tsx`

#### Purpose
Central payroll management hub with comprehensive filtering, scheduling overview, and bulk operations.

#### User Interface Elements
- **Payroll Grid**: Detailed payroll listing with key metrics
- **Advanced Filters**: Multi-criteria payroll filtering
- **View Modes**: List, calendar, timeline views
- **Bulk Actions**: Mass operations on selected payrolls
- **Quick Stats**: Overall payroll portfolio metrics
- **Export Tools**: Data export and reporting

#### Filter Options
- **Status**: Active, Implementation, Inactive
- **Frequency**: Weekly, fortnightly, monthly, etc.
- **Client**: Multi-client selection
- **Consultant**: Assignment-based filtering
- **EFT Date Range**: Processing date filtering
- **System**: Payroll system filtering (MYOB, Xero, etc.)

#### View Modes
1. **List View**: Tabular data with sorting and filtering
2. **Calendar View**: EFT dates and processing schedule
3. **Timeline View**: Payroll lifecycle and version history
4. **Card View**: Visual payroll cards with key metrics

#### Data Sources
- **Payroll List Query**: Comprehensive payroll data
- **Assignment Query**: Consultant assignments
- **Schedule Query**: Upcoming processing dates
- **Statistics Query**: Portfolio metrics and KPIs

---

### Payroll Details Page
**Route:** `/payrolls/[id]`  
**File:** `app/(dashboard)/payrolls/[id]/page.tsx`

#### Purpose
Complete payroll profile with configuration management, processing history, and staff assignments.

#### User Interface Elements
- **Payroll Header**: Key information and status indicators
- **Action Buttons**: Context-sensitive actions based on role
- **Tabbed Interface**: Organized payroll information
  - **Configuration**: Payroll setup and processing rules
  - **Dates**: Generated EFT dates and processing schedule
  - **Assignments**: Consultant and manager assignments
  - **History**: Version history and changes
  - **Documents**: Payroll-related documentation
  - **Notes**: Important payroll notes and communications

#### Tab: Configuration
- **Basic Setup**: Name, client, frequency, dates
- **Processing Rules**: EFT lead times, business day adjustments
- **System Integration**: Payroll system and processing details
- **Staff Assignments**: Primary and backup consultants

#### Tab: Dates
- **Generated Dates**: Complete EFT date schedule
- **Processing Calendar**: Interactive calendar view
- **Assignment Overview**: Consultant assignments per date
- **Holiday Adjustments**: Business day adjustment log

#### Tab: History
- **Version Timeline**: Complete payroll version history
- **Change Log**: Detailed change tracking
- **User Activity**: Staff actions and modifications
- **System Events**: Automated system changes

#### Business Logic
```typescript
// Payroll date generation logic
const generatePayrollDates = (config: PayrollConfig) => {
  const dates = [];
  let currentDate = config.startDate;
  
  while (currentDate <= config.endDate) {
    const eftDate = calculateEftDate(currentDate, config);
    const processingDate = calculateProcessingDate(eftDate, config.processingDays);
    
    dates.push({
      originalEftDate: eftDate,
      adjustedEftDate: adjustForBusinessDays(eftDate),
      processingDate: adjustForBusinessDays(processingDate),
      consultant: assignConsultant(eftDate, config.assignments)
    });
    
    currentDate = getNextPayrollDate(currentDate, config.frequency);
  }
  
  return dates;
};
```

---

### Create Payroll Page
**Route:** `/payrolls/new`  
**File:** `app/(dashboard)/payrolls/new/page.tsx`

#### Purpose
Guided payroll setup with configuration validation, date generation preview, and assignment management.

#### User Interface Elements
- **Multi-step Wizard**: Progressive payroll configuration
- **Configuration Preview**: Real-time preview of settings
- **Date Generation**: Preview of generated EFT dates
- **Validation Feedback**: Business rule validation
- **Template Selection**: Pre-configured payroll templates

#### Configuration Steps
1. **Basic Information**: Name, client, description
2. **Frequency Setup**: Cycle type and date configuration
3. **Processing Rules**: Lead times and adjustments
4. **Staff Assignment**: Consultant and manager selection
5. **Date Preview**: Generated date review and adjustment
6. **Final Review**: Complete configuration validation

#### Validation Rules
- **Unique Names**: Per-client payroll name uniqueness
- **Date Logic**: Valid date configuration for frequency
- **Staff Assignments**: Role-appropriate assignments
- **Business Rules**: Processing day minimums

---

## Calendar & Scheduling

### Calendar Page
**Route:** `/calendar`  
**File:** `app/(dashboard)/calendar/page.tsx`

#### Purpose
Unified calendar view of all payroll processing dates, staff schedules, and important deadlines.

#### User Interface Elements
- **Calendar Grid**: Monthly/weekly/daily views
- **Event Types**: Different colors for payroll types
- **Quick Filters**: Filter by consultant, client, status
- **Event Details**: Popup with complete event information
- **Navigation Controls**: Date navigation and view switching
- **Legend**: Event type and status legend

#### Calendar Features
- **Multi-view Support**: Month, week, day, agenda views
- **Event Layering**: Multiple events per date handling
- **Drag & Drop**: Assignment changes via drag-and-drop
- **Quick Edit**: Inline editing of assignments
- **Export Options**: Calendar export to external systems

#### Event Types
- **EFT Dates**: Payroll processing deadlines
- **Staff Leave**: Employee time off
- **Holidays**: Public and company holidays
- **Meetings**: Client and internal meetings
- **Deadlines**: Compliance and reporting deadlines

---

### Payroll Schedule Page
**Route:** `/payroll-schedule`  
**File:** `app/(dashboard)/payroll-schedule/page.tsx`

#### Purpose
Comprehensive payroll processing schedule with workload analysis and assignment optimization.

#### User Interface Elements
- **Schedule Grid**: Detailed processing schedule
- **Workload Analysis**: Consultant capacity planning
- **Assignment Tools**: Bulk assignment and optimization
- **Conflict Detection**: Overlapping assignment alerts
- **Performance Metrics**: Processing time and efficiency

#### Advanced Features
- **Capacity Planning**: Optimal consultant assignment
- **Conflict Resolution**: Automatic conflict detection
- **Load Balancing**: Even workload distribution
- **Performance Analytics**: Historical processing metrics

---

## Security & Audit

### Security Dashboard
**Route:** `/security`  
**File:** `app/(dashboard)/security/page.tsx`

#### Purpose
Comprehensive security monitoring and compliance dashboard for administrators.

#### Access Control
- **Admin Only**: Full security dashboard access
- **Manager**: Limited security metrics view
- **Others**: No access

#### User Interface Elements
- **Security Metrics**: Key security indicators
- **Risk Assessment**: Current security risk levels
- **Recent Alerts**: Security event notifications
- **Compliance Status**: SOC2 compliance indicators
- **User Activity**: Recent user activity monitoring
- **System Health**: Security system status

#### Security Metrics
- **Authentication Events**: Login successes/failures
- **Permission Changes**: Role and access modifications
- **Data Access**: Sensitive data access patterns
- **System Errors**: Security-related system errors
- **Compliance Score**: Overall compliance rating

---

### Audit Logs Page
**Route:** `/security/audit`  
**File:** `app/(dashboard)/security/audit/page.tsx`

#### Purpose
Detailed audit log viewer with advanced filtering and compliance reporting.

#### User Interface Elements
- **Audit Log Table**: Comprehensive activity listing
- **Advanced Filters**: Multi-criteria log filtering
- **Export Tools**: Compliance report generation
- **Search Functionality**: Full-text log search
- **Timeline View**: Chronological activity visualization

#### Filter Options
- **Date Range**: Flexible date filtering
- **User**: Specific user activity
- **Action Type**: Event type filtering
- **Resource**: Affected system resources
- **Success/Failure**: Operation outcome filtering

---

### Security Reports Page
**Route:** `/security/reports`  
**File:** `app/(dashboard)/security/reports/page.tsx`

#### Purpose
Automated security and compliance report generation for SOC2 requirements.

#### Report Types
- **Access Review**: User access and permissions audit
- **Data Access Report**: Sensitive data access patterns
- **Permission Changes**: Role and access modifications
- **Security Events**: Security incidents and responses
- **Compliance Summary**: SOC2 compliance status

---

## Settings & Profile

### Profile Page
**Route:** `/profile`  
**File:** `app/(dashboard)/profile/page.tsx`

#### Purpose
Personal profile management with preferences, security settings, and work configuration.

#### User Interface Elements
- **Profile Header**: User photo and basic information
- **Tabbed Interface**: Organized profile sections
  - **Personal**: Name, contact information, photo
  - **Work**: Role, manager, work schedule
  - **Preferences**: System preferences and notifications
  - **Security**: Password, MFA, session management
  - **Activity**: Personal activity history

#### Profile Sections
1. **Personal Information**: Editable personal details
2. **Work Information**: Role-based work configuration
3. **Notification Preferences**: Email and system notifications
4. **Security Settings**: Password and MFA management
5. **System Preferences**: Language, timezone, date format

---

### Settings Page
**Route:** `/settings`  
**File:** `app/(dashboard)/settings/page.tsx`

#### Purpose
System-wide settings and configuration management.

#### Settings Categories
- **General**: System-wide preferences
- **Notifications**: Global notification settings
- **Integrations**: Third-party system connections
- **Security**: System security policies
- **Billing**: Billing and subscription management

---

### Account Settings Page
**Route:** `/settings/account`  
**File:** `app/(dashboard)/settings/account/page.tsx`

#### Purpose
Account-specific settings and subscription management.

---

## Developer Tools

### Developer Dashboard
**Route:** `/developer`  
**File:** `app/(dashboard)/developer/page.tsx`

#### Purpose
Developer tools and system administration interface.

#### Access Control
- **Developer Role Only**: Exclusive access to developer tools

#### User Interface Elements
- **System Status**: Health monitoring dashboard
- **Database Tools**: Database management utilities
- **API Testing**: GraphQL and REST API testing
- **Log Viewer**: System log monitoring
- **Performance Metrics**: System performance analytics
- **Development Tools**: Code generation and testing utilities

---

### Loading Demo Page
**Route:** `/developer/loading-demo`  
**File:** `app/(dashboard)/developer/loading-demo/page.tsx`

#### Purpose
UI component testing and loading state demonstration.

---

### JWT Test Page
**Route:** `/jwt-test`  
**File:** `app/(dashboard)/jwt-test/page.tsx`

#### Purpose
JWT token debugging and authentication testing.

---

## Utility Pages

### Onboarding Page
**Route:** `/onboarding`  
**File:** `app/(dashboard)/onboarding/page.tsx`

#### Purpose
New user onboarding workflow with system introduction and initial setup.

#### Onboarding Steps
1. **Welcome**: System introduction and overview
2. **Role Explanation**: Role-specific capabilities
3. **Initial Setup**: Basic configuration
4. **Feature Tour**: Key feature introduction
5. **First Tasks**: Guided initial activities

---

### Unauthorized Page
**Route:** `/unauthorized`  
**File:** `app/(dashboard)/unauthorized/page.tsx`

#### Purpose
Access denied page with clear messaging and navigation options.

#### User Interface Elements
- **Error Message**: Clear explanation of access restriction
- **Reason Code**: Specific reason for access denial
- **Navigation Options**: Links to accessible areas
- **Support Contact**: Help and support information

---

### AI Assistant Page
**Route:** `/ai-assistant`  
**File:** `app/(dashboard)/ai-assistant/page.tsx`

#### Purpose
AI-powered assistant for payroll and system guidance.

#### Features
- **Chat Interface**: Natural language interaction
- **Context Awareness**: Role and task-specific assistance
- **Knowledge Base**: Comprehensive system knowledge
- **Action Suggestions**: Proactive assistance

---

### Tax Calculator Page
**Route:** `/tax-calculator`  
**File:** `app/(dashboard)/tax-calculator/page.tsx`

#### Purpose
Australian tax calculation tool with real-time calculations and compliance validation.

#### Features
- **Income Tax Calculator**: Progressive tax calculation
- **Superannuation Calculator**: SG and additional contributions
- **Payroll Tax Calculator**: State-specific calculations
- **PAYG Calculator**: Pay-as-you-go tax calculations

---

## Component Architecture

### Layout Components

#### Dashboard Layout
**File:** `app/(dashboard)/layout.tsx`

The dashboard layout provides the core structure for all authenticated pages:

```typescript
// Layout structure
<ClerkProvider>
  <ApolloProvider>
    <AuthProvider>
      <ThemeProvider>
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <Header />
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </ThemeProvider>
    </AuthProvider>
  </ApolloProvider>
</ClerkProvider>
```

#### Authentication Layout
**File:** `app/(auth)/layout.tsx`

Simple centered layout for authentication flows:

```typescript
<div className="min-h-screen flex items-center justify-center">
  <div className="max-w-md w-full">
    {children}
  </div>
</div>
```

### Shared Components

#### Navigation Components
- **Sidebar**: Main navigation with role-based menu items
- **Header**: User navigation and quick actions
- **Breadcrumbs**: Page hierarchy navigation
- **UserNav**: User profile dropdown and actions

#### Data Display Components
- **DataTable**: Advanced table with sorting, filtering, pagination
- **StatCard**: Metric display with trend indicators
- **ActivityFeed**: Real-time activity stream
- **Calendar**: Interactive calendar with event management

#### Form Components
- **FormWizard**: Multi-step form management
- **DatePicker**: Business day-aware date selection
- **UserSelect**: Staff member selection with role filtering
- **ClientSelect**: Client selection with search

#### Utility Components
- **LoadingSpinner**: Consistent loading indicators
- **ErrorBoundary**: Error handling and recovery
- **PermissionGate**: Role-based component rendering
- **AuditLogger**: Automatic activity logging

### State Management Patterns

#### Apollo Client Integration
```typescript
// GraphQL state management
const usePayrollData = (payrollId: string) => {
  const { data, loading, error, refetch } = useQuery(GET_PAYROLL_DETAILS, {
    variables: { payrollId },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true
  });

  const [updatePayroll] = useMutation(UPDATE_PAYROLL, {
    optimisticResponse: (variables) => ({
      updatePayroll: {
        __typename: 'Payroll',
        id: payrollId,
        ...variables.input
      }
    }),
    update: (cache, { data }) => {
      // Update cache with new data
    }
  });

  return { data, loading, error, refetch, updatePayroll };
};
```

#### Authentication Context
```typescript
// Authentication state management
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userId, isSignedIn, sessionClaims } = useAuth();
  const { currentUser, loading } = useCurrentUser();

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    return currentUser.permissions.includes(permission);
  };

  const hasRole = (role: string): boolean => {
    if (!currentUser) return false;
    return ROLE_HIERARCHY[currentUser.role] >= ROLE_HIERARCHY[role];
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      loading,
      hasPermission,
      hasRole,
      isAuthenticated: isSignedIn && !!currentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Performance Optimizations

#### Component Memoization
```typescript
// Memoized components for performance
const PayrollCard = React.memo(({ payroll }: { payroll: Payroll }) => {
  return (
    <div className="border rounded-lg p-4">
      <h3>{payroll.name}</h3>
      <p>{payroll.client.name}</p>
      <p>Next EFT: {payroll.nextEftDate}</p>
    </div>
  );
});

const PayrollList = ({ payrolls }: { payrolls: Payroll[] }) => {
  return (
    <div className="grid gap-4">
      {payrolls.map(payroll => (
        <PayrollCard key={payroll.id} payroll={payroll} />
      ))}
    </div>
  );
};
```

#### Lazy Loading
```typescript
// Route-based code splitting
const PayrollDetails = lazy(() => import('./PayrollDetails'));
const ClientManagement = lazy(() => import('./ClientManagement'));
const StaffDirectory = lazy(() => import('./StaffDirectory'));

// Component lazy loading with suspense
<Suspense fallback={<LoadingSpinner />}>
  <PayrollDetails payrollId={id} />
</Suspense>
```

This comprehensive page and component documentation provides detailed insights into every aspect of the Payroll Matrix user interface, including business logic, data flows, user interactions, and technical implementation details.