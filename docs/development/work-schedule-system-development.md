# Work Schedule System - Developer Documentation

## Overview

The Work Schedule System is a comprehensive capacity planning and workload visualization module built with Next.js 15, React 19, TypeScript, and GraphQL. It provides real-time capacity management, intelligent assignment recommendations, and interactive workload visualizations.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Directory Structure](#directory-structure)
4. [Data Models & Schema](#data-models--schema)
5. [API Endpoints & GraphQL](#api-endpoints--graphql)
6. [Component Architecture](#component-architecture)
7. [State Management](#state-management)
8. [Visualization System](#visualization-system)
9. [Permission System](#permission-system)
10. [Development Workflows](#development-workflows)
11. [Testing Strategy](#testing-strategy)
12. [Performance Optimization](#performance-optimization)
13. [Deployment & Configuration](#deployment--configuration)

---

## Architecture Overview

### 🏗️ **System Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 15)                    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────── │
│  │  Capacity       │  │  Assignment     │  │  Workload     │ │
│  │  Dashboard      │  │  Wizard         │  │  Visualization│ │
│  └─────────────────┘  └─────────────────┘  └─────────────── │
├─────────────────────────────────────────────────────────────┤
│               Apollo Client (State Management)               │
├─────────────────────────────────────────────────────────────┤
│                   GraphQL API (Hasura)                     │
├─────────────────────────────────────────────────────────────┤
│                  PostgreSQL Database                        │
└─────────────────────────────────────────────────────────────┘
```

### 🔄 **Data Flow Architecture**

```
User Action → Component → Apollo Client → GraphQL Query/Mutation 
     ↓                                            ↓
UI Update ← Component ← Apollo Cache ← Hasura ← PostgreSQL
```

### 📊 **Component Hierarchy**

```
WorkSchedulePage
├── ManagerOnly (Permission Guard)
│   ├── Capacity Dashboard
│   │   ├── Team Member Cards
│   │   ├── Member Details View
│   │   └── Work Schedule Editor
│   ├── Assignment Wizard
│   │   ├── Payroll Selector
│   │   ├── Recommendation Engine
│   │   └── Bulk Assignment Tools
│   └── Workload Visualization
│       ├── Chart Container
│       ├── Calendar View
│       └── Summary Statistics
└── Personal Schedule (Consultant View)
```

---

## Technology Stack

### 🛠️ **Core Technologies**

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Frontend** | Next.js | 15.3.4 | React framework with App Router |
| **UI Library** | React | 19.1.0 | Component library |
| **Language** | TypeScript | 5.8+ | Type safety and development experience |
| **Styling** | Tailwind CSS | 3.4+ | Utility-first CSS framework |
| **Components** | shadcn/ui | Latest | Pre-built UI component library |
| **Charts** | Recharts | 2.15.3 | Data visualization library |
| **State** | Apollo Client | 3.11+ | GraphQL client and state management |
| **API** | Hasura | 2.36+ | GraphQL API engine |
| **Database** | PostgreSQL | 15+ | Primary data store |
| **Auth** | Clerk | 6.5+ | Authentication and user management |

### 📦 **Key Dependencies**

```json
{
  "dependencies": {
    "@apollo/client": "^3.11.8",
    "@clerk/nextjs": "^6.5.0", 
    "date-fns": "^4.1.0",
    "lucide-react": "^0.468.0",
    "recharts": "^2.15.3",
    "sonner": "^1.7.1"
  },
  "devDependencies": {
    "@graphql-codegen/cli": "^5.0.3",
    "@types/react": "^19.1.8",
    "typescript": "^5.8.2"
  }
}
```

---

## Directory Structure

### 📁 **Project Organization**

```
/domains/work-schedule/
├── components/                 # React components
│   ├── assignment-wizard.tsx   # Smart assignment recommendations
│   ├── capacity-dashboard.tsx  # Team capacity management
│   ├── payroll-workload-visualization.tsx # Charts & analytics
│   ├── enhanced-calendar.tsx   # Calendar utilities
│   └── index.ts               # Component exports
├── graphql/                   # GraphQL operations
│   ├── fragments.graphql      # Reusable GraphQL fragments
│   ├── mutations.graphql      # Data modification operations
│   ├── queries.graphql        # Data fetching operations
│   ├── workload-queries.graphql # Visualization-specific queries
│   └── generated/             # Auto-generated TypeScript types
│       ├── gql.ts
│       └── graphql.ts
├── hooks/                     # Custom React hooks
│   ├── use-payroll-workload.ts # Workload data management
│   └── use-capacity-calculation.ts # Capacity algorithms
├── services/                  # Business logic
│   ├── enhanced-capacity-calculator.ts # Capacity algorithms
│   └── assignment-engine.ts   # Assignment recommendation logic
└── types/                     # TypeScript type definitions
    └── index.ts               # Domain-specific types
```

### 🗂️ **Related Files**

```
/app/(dashboard)/
├── work-schedule/
│   └── page.tsx              # Main work schedule page (managers)
└── profile/
    └── page.tsx              # Profile page with workload tab (consultants)

/components/auth/
└── permission-guard.tsx      # Role-based access control

/hasura/metadata/
└── databases/default/tables/
    └── public_work_schedule.yaml # Database permissions & metadata
```

---

## Data Models & Schema

### 🗄️ **Database Schema**

#### **Work Schedule Table**
```sql
CREATE TABLE work_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    work_day VARCHAR(20) NOT NULL, -- 'Monday', 'Tuesday', etc.
    work_hours NUMERIC(4,2) NOT NULL DEFAULT 8.00,
    admin_time_hours NUMERIC(4,2) NOT NULL DEFAULT 1.00,
    payroll_capacity_hours NUMERIC(4,2) NOT NULL DEFAULT 7.00,
    uses_default_admin_time BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_user_work_day UNIQUE(user_id, work_day)
);
```

#### **Users Table (Extended)**
```sql
-- Additional columns for work schedule system
ALTER TABLE users ADD COLUMN default_admin_time_percentage NUMERIC(5,2) DEFAULT 12.5;
ALTER TABLE users ADD COLUMN position user_position DEFAULT 'consultant';
```

#### **Payrolls Table (Related)**
```sql
-- Key fields used by work schedule system
CREATE TABLE payrolls (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    client_id UUID REFERENCES clients(id),
    primary_consultant_user_id UUID REFERENCES users(id),
    backup_consultant_user_id UUID REFERENCES users(id),
    processing_time INTEGER DEFAULT 4, -- hours
    processing_days_before_eft INTEGER DEFAULT 2,
    status payroll_status DEFAULT 'active'
);
```

### 📋 **TypeScript Interfaces**

#### **Core Types**
```typescript
// domains/work-schedule/types/index.ts

export interface WorkScheduleWithCapacity {
  id: string;
  workDay: string;
  workHours: number;
  adminTimeHours: number;
  payrollCapacityHours: number;
  usesDefaultAdminTime: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  position: UserPosition;
  defaultAdminTimePercentage: number;
  isStaff: boolean;
  workSchedules: WorkScheduleWithCapacity[];
  assignedPayrolls: AssignedPayroll[];
}

export interface ConsultantCapacity {
  consultantId: string;
  totalWorkHours: number;
  totalAdminHours: number;
  totalPayrollCapacity: number;
  currentlyAssignedHours: number;
  availableCapacityHours: number;
  utilizationPercentage: number;
  adminTimePercentage: number;
  processingWindowDays: number;
}

export interface AssignmentRecommendation {
  consultantId: string;
  consultant: AvailableConsultant;
  score: number;
  confidence: 'low' | 'medium' | 'high';
  reasoning: string[];
  warnings: string[];
  alternativeTimeline?: {
    suggestedStartDate: string;
    reason: string;
  };
}
```

#### **Visualization Types**
```typescript
// Workload visualization specific types
export interface PayrollAssignment {
  id: string;
  name: string;
  clientName: string;
  processingTime: number;
  processingDaysBeforeEft: number;
  eftDate: string;
  status: "active" | "pending" | "completed";
  priority: "high" | "medium" | "low";
}

export interface WorkScheduleDay {
  date: string;
  workHours: number;
  adminTimeHours: number;
  payrollCapacityHours: number;
  assignments: PayrollAssignment[];
}
```

---

## API Endpoints & GraphQL

### 🔌 **GraphQL Operations**

#### **Core Queries**
```graphql
# Fetch team capacity data for managers
query GetTeamCapacityDashboard($managerId: uuid!) {
  users(
    where: {
      managerId: { _eq: $managerId }
      isStaff: { _eq: true }
      isActive: { _eq: true }
    }
  ) {
    id
    name
    email
    role
    defaultAdminTimePercentage
    workSchedules {
      id
      workDay
      workHours
      adminTimeHours
      payrollCapacityHours
      usesDefaultAdminTime
    }
    primaryConsultantPayrolls(where: { status: { _in: ["active", "pending"] } }) {
      id
      name
      processingTime
      status
      client { name }
    }
  }
}

# Fetch consultant workload visualization data
query GetConsultantPayrollWorkload($userId: uuid!, $startDate: date!, $endDate: date!) {
  userById(id: $userId) {
    id
    name
    email
    role
    defaultAdminTimePercentage
  }
  
  workSchedule(where: { userId: { _eq: $userId } }) {
    id
    workDay
    workHours
    adminTimeHours
    payrollCapacityHours
    usesDefaultAdminTime
  }
  
  primaryPayrolls: payrolls(
    where: {
      primaryConsultantUserId: { _eq: $userId }
      status: { _in: ["active", "pending"] }
    }
  ) {
    id
    name
    processingTime
    client { name }
    payrollDates(
      where: { originalEftDate: { _gte: $startDate, _lte: $endDate } }
    ) {
      originalEftDate
      processingDate
    }
  }
}
```

#### **Key Mutations**
```graphql
# Update work schedule with conflict resolution
mutation UpsertWorkSchedule(
  $userId: uuid!
  $workDay: String!
  $workHours: numeric!
  $adminTimeHours: numeric!
  $payrollCapacityHours: numeric!
  $usesDefaultAdminTime: Boolean!
) {
  insertWorkSchedule(
    object: {
      userId: $userId
      workDay: $workDay
      workHours: $workHours
      adminTimeHours: $adminTimeHours
      payrollCapacityHours: $payrollCapacityHours
      usesDefaultAdminTime: $usesDefaultAdminTime
    }
    onConflict: {
      constraint: unique_user_work_day
      updateColumns: [workHours, adminTimeHours, payrollCapacityHours, usesDefaultAdminTime]
    }
  ) {
    id
    workDay
    workHours
    adminTimeHours
    payrollCapacityHours
    usesDefaultAdminTime
  }
}

# Update default admin time percentage
mutation UpdateUserDefaultAdminTime($userId: uuid!, $percentage: numeric!) {
  updateUserById(
    pkColumns: { id: $userId }
    _set: { defaultAdminTimePercentage: $percentage }
  ) {
    id
    defaultAdminTimePercentage
  }
}
```

### 🎯 **Generated Types Usage**

```typescript
// Using generated types for type safety
import {
  GetTeamCapacityDashboardDocument,
  type GetTeamCapacityDashboardQuery,
  UpsertWorkScheduleDocument,
  type UpsertWorkScheduleMutation,
} from "@/domains/work-schedule/graphql/generated/graphql";

// Apollo Client usage with type safety
const { data, loading, error } = useQuery<GetTeamCapacityDashboardQuery>(
  GetTeamCapacityDashboardDocument,
  {
    variables: { managerId: currentUserId },
    errorPolicy: "all",
  }
);

const [upsertWorkSchedule] = useMutation<UpsertWorkScheduleMutation>(
  UpsertWorkScheduleDocument
);
```

---

## Component Architecture

### 🧱 **Component Structure**

#### **1. CapacityDashboard Component**
```typescript
// domains/work-schedule/components/capacity-dashboard.tsx

interface CapacityDashboardProps {
  teamMembers?: TeamMember[];
  managerId: string;
  dateRange: { startDate: string; endDate: string };
  onRefresh?: () => void;
  onUpdateWorkSchedule?: (scheduleId: string, updates: Partial<WorkScheduleWithCapacity>) => Promise<void>;
  onUpdateAdminTime?: (userId: string, percentage: number) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export const CapacityDashboard: React.FC<CapacityDashboardProps> = ({
  teamMembers,
  managerId,
  dateRange,
  onRefresh,
  onUpdateWorkSchedule,
  onUpdateAdminTime,
  isLoading,
  error,
}) => {
  // Component implementation
};
```

#### **2. PayrollWorkloadVisualization Component**
```typescript
// domains/work-schedule/components/payroll-workload-visualization.tsx

interface PayrollWorkloadVisualizationProps {
  userId: string;
  userName: string;
  userRole: string;
  workSchedule: WorkScheduleDay[];
  viewMode?: "consultant" | "manager";
  showCapacityComparison?: boolean;
  onAssignmentClick?: (assignment: PayrollAssignment) => void;
}

export default function PayrollWorkloadVisualization({
  userId,
  userName,
  userRole,
  workSchedule,
  viewMode = "consultant",
  showCapacityComparison = true,
  onAssignmentClick
}: PayrollWorkloadVisualizationProps) {
  // Visualization implementation with Recharts
};
```

#### **3. AssignmentWizard Component**
```typescript
// domains/work-schedule/components/assignment-wizard.tsx

interface AssignmentWizardProps {
  payrolls: PayrollForAssignment[];
  consultants: AvailableConsultant[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onAssignPayroll: (payrollId: string, consultantId: string, startDate: string) => void;
  onBulkAssign: (assignments: BulkAssignment[]) => void;
}

export const AssignmentWizard: React.FC<AssignmentWizardProps> = ({
  payrolls,
  consultants,
  isLoading,
  error,
  onRefresh,
  onAssignPayroll,
  onBulkAssign,
}) => {
  // Assignment wizard implementation
};
```

### 🎨 **UI Component Patterns**

#### **Loading States**
```typescript
// Smart loading components with proper fallbacks
import { CapacityDashboardSkeleton, SmartLoadingSpinner } from "./loading-states";

// Usage in components
if (loading) {
  return <CapacityDashboardSkeleton />;
}

// Conditional loading with content
<SmartLoadingSpinner 
  isLoading={isLoading} 
  fallback={<CapacityDashboardSkeleton />}
>
  <CapacityDashboard {...props} />
</SmartLoadingSpinner>
```

#### **Error Handling**
```typescript
// Consistent error handling pattern
if (error) {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        {error.message || "An error occurred loading the capacity dashboard."}
      </AlertDescription>
    </Alert>
  );
}
```

---

## State Management

### 🔄 **Apollo Client Configuration**

#### **Client Setup**
```typescript
// lib/apollo/client.ts - Work schedule specific configuration

const workScheduleTypePolicy = {
  WorkSchedule: {
    keyFields: ["userId", "workDay"], // Compound key for caching
  },
  User: {
    fields: {
      workSchedules: {
        merge(existing = [], incoming: any[]) {
          // Custom merge logic for work schedules
          return incoming;
        },
      },
    },
  },
};

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: workScheduleTypePolicy,
  }),
});
```

#### **Cache Management**
```typescript
// Custom hook for cache invalidation
export function useCacheInvalidation() {
  const client = useApolloClient();
  
  const invalidateWorkSchedules = useCallback((userId?: string) => {
    if (userId) {
      // Invalidate specific user's work schedules
      client.cache.evict({
        fieldName: "workSchedules",
        args: { where: { userId: { _eq: userId } } },
      });
    } else {
      // Invalidate all work schedule data
      client.cache.evict({ fieldName: "workSchedules" });
    }
    client.cache.gc();
  }, [client]);
  
  return { invalidateWorkSchedules };
}
```

### 🪝 **Custom Hooks**

#### **usePayrollWorkload Hook**
```typescript
// domains/work-schedule/hooks/use-payroll-workload.ts

export function usePayrollWorkload({
  userId,
  dateRange,
  enabled = true,
}: UsePayrollWorkloadOptions) {
  const { data, loading, error, refetch } = useQuery<GetConsultantPayrollWorkloadQuery>(
    GetConsultantPayrollWorkloadDocument,
    {
      variables: {
        userId,
        startDate: format(dateRange?.startDate || subDays(new Date(), 7), "yyyy-MM-dd"),
        endDate: format(dateRange?.endDate || addDays(new Date(), 30), "yyyy-MM-dd"),
      },
      skip: !enabled || !userId,
      errorPolicy: "all",
    }
  );

  // Transform raw GraphQL data into visualization format
  const workSchedule: WorkScheduleDay[] = useMemo(() => {
    // Complex data transformation logic
    return transformWorkloadData(data);
  }, [data]);

  return { workSchedule, loading, error, refetch };
}
```

#### **useCapacityCalculation Hook**
```typescript
// Complex capacity calculation logic
export function useCapacityCalculation(teamMembers: TeamMember[]) {
  return useMemo(() => {
    return teamMembers.map(member => {
      const capacity = calculateConsultantCapacity(member);
      const conflicts = detectCapacityConflicts(member, capacity);
      return { member, capacity, conflicts };
    });
  }, [teamMembers]);
}
```

---

## Visualization System

### 📊 **Chart Architecture**

#### **Recharts Integration**
```typescript
// Chart configuration for work schedule visualization
const chartConfig = {
  payrollCapacityHours: {
    label: "Payroll Capacity",
    color: "hsl(var(--chart-1))"
  },
  assignedHours: {
    label: "Assigned Hours", 
    color: "hsl(var(--chart-2))"
  },
  adminTimeHours: {
    label: "Admin Time",
    color: "hsl(var(--chart-3))"
  }
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  
  const data = payload[0].payload;
  const assignments = data.assignments || [];

  return (
    <div className="bg-white p-4 border rounded-lg shadow-lg min-w-[250px]">
      <div className="font-medium text-gray-900 mb-2">{label}</div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Capacity:</span>
          <span className="font-medium">{data.payrollCapacityHours}h</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Assigned:</span>
          <span className="font-medium">{data.assignedHours}h</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Utilization:</span>
          <span className={`font-medium ${getUtilizationColor(data.utilization)}`}>
            {data.utilization}%
          </span>
        </div>
        
        {assignments.length > 0 && (
          <AssignmentDetails assignments={assignments} />
        )}
      </div>
    </div>
  );
};
```

#### **Data Aggregation**
```typescript
// Time period aggregation logic
const aggregateDataByPeriod = (
  workSchedule: WorkScheduleDay[], 
  period: ViewPeriod, 
  currentDate: Date
) => {
  const data: ChartDataPoint[] = [];
  
  if (period === "day") {
    // Generate 7-day view
    for (let i = 0; i < 7; i++) {
      const date = addDays(currentDate, i);
      const dayData = workSchedule.find(ws => 
        isSameDay(parseISO(ws.date), date)
      );
      
      data.push({
        period: format(date, "EEE dd"),
        fullDate: format(date, "yyyy-MM-dd"),
        workHours: dayData?.workHours || 0,
        assignedHours: calculateAssignedHours(dayData?.assignments || []),
        utilization: calculateUtilization(dayData),
        assignments: dayData?.assignments || [],
      });
    }
  } else if (period === "week") {
    // Generate 4-week view with weekly aggregation
    // ... week aggregation logic
  } else if (period === "month") {
    // Generate 3-month view with monthly aggregation
    // ... month aggregation logic
  }
  
  return data;
};
```

### 🎨 **Color System**

```typescript
// Consistent color coding for utilization levels
export const getUtilizationColor = (utilization: number): string => {
  if (utilization <= 80) return "text-green-600";
  if (utilization <= 100) return "text-yellow-600";
  return "text-red-600";
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "active": return "#22c55e";
    case "pending": return "#f59e0b";
    case "completed": return "#6b7280";
    default: return "#8b5cf6";
  }
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case "high": return "#ef4444";
    case "medium": return "#f59e0b";
    case "low": return "#22c55e";
    default: return "#6b7280";
  }
};
```

---

## Permission System

### 🔐 **Role-Based Access Control**

#### **Permission Guards**
```typescript
// components/auth/permission-guard.tsx

export const ManagerOnly: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => {
  const { hasRoleLevel } = useEnhancedPermissions();
  
  if (!hasRoleLevel("manager")) {
    return fallback || <UnauthorizedAccess />;
  }
  
  return <>{children}</>;
};

// Usage in work schedule components
<ManagerOnly 
  fallback={<PersonalScheduleView />}
>
  <TeamCapacityDashboard />
</ManagerOnly>
```

#### **Permission Matrix**
```typescript
// lib/auth/permissions.ts

export const WORK_SCHEDULE_PERMISSIONS = {
  VIEW_TEAM_CAPACITY: ["manager", "org_admin", "developer"],
  EDIT_WORK_SCHEDULES: ["manager", "org_admin", "developer"],
  ASSIGN_PAYROLLS: ["manager", "org_admin", "developer"],
  VIEW_PERSONAL_WORKLOAD: ["consultant", "manager", "org_admin", "developer"],
  VIEW_ANALYTICS: ["consultant", "manager", "org_admin", "developer"],
  MODIFY_ADMIN_TIME: ["manager", "org_admin", "developer"],
} as const;

// Permission checking utility
export function canAccessFeature(
  userRole: string, 
  feature: keyof typeof WORK_SCHEDULE_PERMISSIONS
): boolean {
  return WORK_SCHEDULE_PERMISSIONS[feature].includes(userRole as any);
}
```

#### **Database Row-Level Security**
```sql
-- Hasura permissions for work_schedule table

-- Managers can view/edit their team members' schedules
CREATE POLICY manager_team_access ON work_schedule 
FOR ALL TO hasura_user 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = work_schedule.user_id 
    AND users.manager_id = current_setting('hasura.user_id')::uuid
  )
);

-- Users can view their own work schedule
CREATE POLICY user_own_schedule ON work_schedule 
FOR SELECT TO hasura_user 
USING (user_id = current_setting('hasura.user_id')::uuid);
```

---

## Development Workflows

### 🛠️ **Development Setup**

#### **Environment Configuration**
```bash
# Required environment variables
NEXT_PUBLIC_HASURA_GRAPHQL_URL=https://your-hasura-endpoint/v1/graphql
HASURA_GRAPHQL_ADMIN_SECRET=your-admin-secret
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
```

#### **Development Commands**
```bash
# Start development server
pnpm dev

# Generate GraphQL types
pnpm codegen

# Type checking
pnpm type-check

# Build for production
pnpm build

# Database migrations
pnpm hasura:migrate
pnpm hasura:metadata
```

### 🔄 **Feature Development Process**

#### **1. GraphQL Schema Changes**
```bash
# 1. Update Hasura metadata
# Edit hasura/metadata/databases/default/tables/...

# 2. Apply migrations
pnpm hasura:migrate
pnpm hasura:metadata

# 3. Update GraphQL operations
# Edit domains/work-schedule/graphql/*.graphql

# 4. Generate types
pnpm codegen

# 5. Update components
# Use generated types in React components
```

#### **2. Component Development**
```typescript
// Follow established patterns
export const NewWorkScheduleComponent: React.FC<Props> = ({ 
  prop1, 
  prop2 
}) => {
  // 1. Apollo hooks for data fetching
  const { data, loading, error } = useQuery(QUERY_DOCUMENT);
  
  // 2. State management
  const [localState, setLocalState] = useState(initialState);
  
  // 3. Computed values
  const computedValue = useMemo(() => {
    return expensiveCalculation(data);
  }, [data]);
  
  // 4. Event handlers
  const handleAction = useCallback(() => {
    // Action implementation
  }, [dependencies]);
  
  // 5. Render with loading/error states
  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay error={error} />;
  
  return (
    <div className="component-container">
      {/* Component JSX */}
    </div>
  );
};
```

#### **3. Testing New Features**
```typescript
// Component testing with React Testing Library
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';

const mocks = [
  {
    request: {
      query: GET_WORK_SCHEDULE,
      variables: { userId: "test-user" },
    },
    result: {
      data: { workSchedule: mockWorkScheduleData },
    },
  },
];

test('renders work schedule correctly', async () => {
  render(
    <MockedProvider mocks={mocks}>
      <WorkScheduleComponent userId="test-user" />
    </MockedProvider>
  );
  
  await waitFor(() => {
    expect(screen.getByText('Work Schedule')).toBeInTheDocument();
  });
});
```

### 📋 **Code Review Checklist**

#### **Work Schedule Specific Checks**
- [ ] **Permission Guards**: All manager features protected with `ManagerOnly`
- [ ] **Error Handling**: Proper error states for GraphQL failures
- [ ] **Loading States**: Skeleton components during data loading
- [ ] **Type Safety**: Generated GraphQL types used throughout
- [ ] **Responsive Design**: Components work on mobile and desktop
- [ ] **Performance**: Memoization for expensive calculations
- [ ] **Accessibility**: Proper ARIA labels for charts and interactive elements
- [ ] **Data Validation**: Input validation for work schedule edits

---

## Testing Strategy

### 🧪 **Testing Approach**

#### **Unit Tests**
```typescript
// Test business logic functions
describe('capacity calculation', () => {
  test('calculates consultant capacity correctly', () => {
    const member = createMockTeamMember();
    const capacity = calculateConsultantCapacity(member);
    
    expect(capacity.totalWorkHours).toBe(40);
    expect(capacity.totalAdminHours).toBe(5);
    expect(capacity.totalPayrollCapacity).toBe(35);
  });
  
  test('handles overallocation scenarios', () => {
    const member = createOverallocatedMember();
    const capacity = calculateConsultantCapacity(member);
    
    expect(capacity.utilizationPercentage).toBeGreaterThan(100);
    expect(capacity.availableCapacityHours).toBeLessThan(0);
  });
});
```

#### **Integration Tests**
```typescript
// Test GraphQL integration
describe('work schedule mutations', () => {
  test('updates work schedule successfully', async () => {
    const { result } = renderHook(() => useUpdateWorkSchedule(), {
      wrapper: createApolloWrapper(mocks),
    });
    
    await act(async () => {
      await result.current.updateWorkSchedule({
        userId: 'test-user',
        workDay: 'Monday',
        workHours: 8,
        adminTimeHours: 1,
      });
    });
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
```

#### **E2E Tests (Playwright)**
```typescript
// Test complete workflows
test('manager can update team member work schedule', async ({ page }) => {
  await page.goto('/work-schedule');
  
  // Navigate to capacity dashboard
  await page.click('[data-testid="capacity-tab"]');
  
  // Find team member card
  await page.click('[data-testid="member-card-john-doe"]');
  
  // Edit work schedule
  await page.click('[data-testid="edit-schedule-monday"]');
  await page.fill('[data-testid="work-hours-input"]', '9');
  await page.click('[data-testid="save-schedule"]');
  
  // Verify update
  await expect(page.locator('[data-testid="monday-work-hours"]')).toHaveText('9h');
});
```

### 📊 **Test Data Management**

```typescript
// Mock data factories
export const createMockTeamMember = (overrides?: Partial<TeamMember>): TeamMember => ({
  id: 'mock-user-id',
  name: 'John Doe',
  email: 'john@example.com',
  position: 'consultant',
  defaultAdminTimePercentage: 12.5,
  isStaff: true,
  workSchedules: createMockWorkSchedules(),
  assignedPayrolls: [],
  ...overrides,
});

export const createMockWorkSchedules = (): WorkScheduleWithCapacity[] => [
  {
    id: 'monday-schedule',
    workDay: 'Monday',
    workHours: 8,
    adminTimeHours: 1,
    payrollCapacityHours: 7,
    usesDefaultAdminTime: true,
  },
  // ... other days
];
```

---

## Performance Optimization

### ⚡ **Optimization Strategies**

#### **Query Optimization**
```typescript
// Use fragments to minimize data transfer
fragment WorkScheduleMinimal on workSchedule {
  id
  workDay
  workHours
  payrollCapacityHours
}

fragment WorkScheduleComplete on workSchedule {
  ...WorkScheduleMinimal
  adminTimeHours
  usesDefaultAdminTime
  createdAt
  updatedAt
}

// Conditional fragment usage
query GetTeamCapacity($includeDetails: Boolean = false) {
  users {
    id
    name
    workSchedules {
      ...WorkScheduleMinimal
      ...WorkScheduleComplete @include(if: $includeDetails)
    }
  }
}
```

#### **Component Optimization**
```typescript
// Memoize expensive calculations
const teamCapacities = useMemo(() => {
  if (!teamMembers || teamMembers.length === 0) return [];
  
  return teamMembers.map(member => ({
    member,
    capacity: calculateConsultantCapacity(member),
    utilization: calculateUtilization(member),
  }));
}, [teamMembers]);

// Virtualization for large lists
import { FixedSizeList as List } from 'react-window';

const VirtualizedTeamList = ({ teamMembers }: { teamMembers: TeamMember[] }) => (
  <List
    height={600}
    itemCount={teamMembers.length}
    itemSize={200}
    itemData={teamMembers}
  >
    {({ index, style, data }) => (
      <div style={style}>
        <TeamMemberCard member={data[index]} />
      </div>
    )}
  </List>
);
```

#### **Caching Strategy**
```typescript
// Apollo Client cache configuration
const typePolicies = {
  Query: {
    fields: {
      workSchedule: {
        merge(existing = [], incoming: any[]) {
          // Merge strategy for work schedules
          const keyedExisting = keyBy(existing, 'id');
          const keyedIncoming = keyBy(incoming, 'id');
          return Object.values({ ...keyedExisting, ...keyedIncoming });
        },
      },
    },
  },
  WorkSchedule: {
    keyFields: ["userId", "workDay"],
  },
};
```

### 📈 **Performance Monitoring**

```typescript
// Performance tracking for capacity calculations
const usePerformanceTracking = () => {
  const trackCalculation = useCallback((operation: string, duration: number) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${operation}: ${duration}ms`);
    }
    
    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      // analytics.track('work_schedule_performance', { operation, duration });
    }
  }, []);
  
  return { trackCalculation };
};
```

---

## Deployment & Configuration

### 🚀 **Production Deployment**

#### **Environment Configuration**
```bash
# Production environment variables
NODE_ENV=production
NEXT_PUBLIC_HASURA_GRAPHQL_URL=https://prod-hasura.your-domain.com/v1/graphql
HASURA_GRAPHQL_ADMIN_SECRET=your-production-admin-secret
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...

# Database connection
DATABASE_URL=postgresql://user:password@host:port/database
```

#### **Build Configuration**
```json
// next.config.js
const nextConfig = {
  experimental: {
    optimizePackageImports: ['recharts', 'date-fns'],
  },
  webpack: (config) => {
    // Optimize chart library bundling
    config.resolve.alias = {
      ...config.resolve.alias,
      'recharts/es6': 'recharts/lib',
    };
    return config;
  },
};
```

#### **Hasura Metadata Deployment**
```bash
# Apply all metadata changes
hasura metadata apply --admin-secret $HASURA_GRAPHQL_ADMIN_SECRET

# Apply database migrations
hasura migrate apply --admin-secret $HASURA_GRAPHQL_ADMIN_SECRET

# Verify deployment
hasura metadata inconsistency list --admin-secret $HASURA_GRAPHQL_ADMIN_SECRET
```

### 🔧 **Configuration Management**

#### **Feature Flags**
```typescript
// lib/config/feature-flags.ts
export const WORK_SCHEDULE_FEATURES = {
  ADVANCED_ANALYTICS: process.env.ENABLE_ADVANCED_ANALYTICS === 'true',
  BULK_ASSIGNMENT: process.env.ENABLE_BULK_ASSIGNMENT === 'true',
  REAL_TIME_UPDATES: process.env.ENABLE_REAL_TIME_UPDATES === 'true',
} as const;

// Usage in components
if (WORK_SCHEDULE_FEATURES.ADVANCED_ANALYTICS) {
  return <AdvancedAnalyticsView />;
}
```

#### **Performance Configuration**
```typescript
// lib/config/performance.ts
export const PERFORMANCE_CONFIG = {
  CACHE_TTL: parseInt(process.env.CACHE_TTL || '300'), // 5 minutes
  MAX_TEAM_SIZE: parseInt(process.env.MAX_TEAM_SIZE || '50'),
  CHART_DATA_LIMIT: parseInt(process.env.CHART_DATA_LIMIT || '100'),
  ENABLE_VIRTUALIZATION: process.env.ENABLE_VIRTUALIZATION === 'true',
} as const;
```

---

## Troubleshooting Guide

### 🔍 **Common Issues**

#### **GraphQL Query Failures**
```typescript
// Debug GraphQL errors
const { data, error } = useQuery(GET_WORK_SCHEDULE, {
  errorPolicy: 'all', // Important: Don't fail silently
  onError: (error) => {
    console.error('GraphQL Error Details:', {
      message: error.message,
      graphQLErrors: error.graphQLErrors,
      networkError: error.networkError,
    });
  },
});

// Handle specific error types
if (error?.graphQLErrors?.some(e => e.extensions?.code === 'permission-error')) {
  return <PermissionDeniedMessage />;
}
```

#### **Permission Issues**
```sql
-- Debug Hasura permissions
SELECT table_name, role_name, permission_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'work_schedule';

-- Check row-level security
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM work_schedule 
WHERE user_id = 'test-user-id';
```

#### **Performance Issues**
```typescript
// Monitor component render performance
import { Profiler } from 'react';

<Profiler
  id="CapacityDashboard"
  onRender={(id, phase, actualDuration) => {
    if (actualDuration > 100) {
      console.warn(`Slow render: ${id} took ${actualDuration}ms`);
    }
  }}
>
  <CapacityDashboard />
</Profiler>
```

### 📞 **Support & Debugging**

#### **Development Tools**
```bash
# GraphQL debugging
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-hasura-admin-secret: your-secret" \
  -d '{"query": "query { workSchedule { id workDay workHours } }"}' \
  https://your-hasura-endpoint/v1/graphql

# Apollo Client DevTools
# Install browser extension for Apollo Client Developer Tools

# Next.js debugging
DEBUG=* npm run dev  # Enable all debug logs
```

#### **Production Monitoring**
```typescript
// Error tracking integration
import * as Sentry from '@sentry/nextjs';

export function trackWorkScheduleError(error: Error, context: any) {
  Sentry.withScope((scope) => {
    scope.setTag('component', 'work-schedule');
    scope.setContext('work-schedule-context', context);
    Sentry.captureException(error);
  });
}
```

---

## API Documentation

### 🔌 **Key Endpoints**

#### **REST API Routes** (if applicable)
```typescript
// app/api/work-schedule/route.ts
export async function GET(request: NextRequest) {
  // Implementation
}

export async function POST(request: NextRequest) {
  // Implementation  
}
```

#### **GraphQL Subscriptions** (future enhancement)
```graphql
# Real-time work schedule updates
subscription WorkScheduleUpdates($userId: uuid!) {
  workSchedule(
    where: { userId: { _eq: $userId } }
  ) {
    id
    workDay
    workHours
    adminTimeHours
    payrollCapacityHours
    updatedAt
  }
}
```

---

## Contributing Guidelines

### 📝 **Development Standards**

#### **Code Style**
- **TypeScript**: Strict mode enabled, no `any` types
- **React**: Functional components with hooks
- **Styling**: Tailwind CSS with semantic class names
- **Imports**: Absolute imports using `@/` prefix

#### **Commit Convention**
```
feat(work-schedule): add capacity dashboard visualization
fix(work-schedule): resolve permission guard edge case
docs(work-schedule): update API documentation
test(work-schedule): add unit tests for capacity calculation
```

#### **Pull Request Template**
```markdown
## Work Schedule System Changes

### Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Performance improvement
- [ ] Documentation update

### Description
Brief description of changes...

### Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Performance impact assessed

### Screenshots/Videos
If applicable, add screenshots or screen recordings...

### Checklist
- [ ] Code follows established patterns
- [ ] Permission guards implemented
- [ ] Error handling added
- [ ] TypeScript types updated
- [ ] Documentation updated
```

---

*This developer documentation covers the complete Work Schedule System implementation. For additional technical details or support, please refer to the main project documentation or contact the development team.*

**Last Updated**: January 2025 | **Version**: 2.0 | **System**: Payroll Matrix Work Schedule