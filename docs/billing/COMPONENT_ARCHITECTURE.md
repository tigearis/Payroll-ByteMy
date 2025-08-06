# Billing System Component Architecture

This document outlines the complete component architecture for the billing system redesign, including all interfaces, data flows, and integration points.

## Architecture Overview

The billing system follows a modular, hierarchical architecture with clear separation of concerns:

```
┌─ Modern Billing Dashboard (Root)
├─ Service Management
│  ├─ Master Service Catalogue
│  ├─ User Billing Rate Manager
│  ├─ Client Service Assignment Manager
│  └─ Service Management Dashboard
├─ Payroll Integration
│  ├─ Dynamic Payroll Completion Form
│  ├─ Payroll Service Override Manager
│  ├─ Time Tracking Integration
│  └─ Invoice Generation System
├─ Recurring Services
│  └─ Recurring Services Manager
└─ Payroll Integration
   └─ Payroll Completion Metrics Form
```

## Service Management Layer

### Master Service Catalogue
**File**: `/domains/billing/components/service-management/master-service-catalogue.tsx`
**Status**: ✅ Complete

#### Purpose
Central management interface for all billable services in the system.

#### Key Features
- ✅ CRUD operations for services
- ✅ Category-based organization (essential, premium, specialized, compliance)
- ✅ Pricing rule management
- ✅ Active/inactive status management
- ✅ Search and filtering capabilities

#### Props Interface
```typescript
interface MasterServiceCatalogueProps {
  onServiceSelect?: (service: Service) => void;
  readonly?: boolean;
}
```

#### State Management
```typescript
const [services, setServices] = useState<Service[]>([]);
const [selectedCategory, setSelectedCategory] = useState<string>("all");
const [searchTerm, setSearchTerm] = useState<string>("");
const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
```

#### GraphQL Integration
- **Query**: `GET_ALL_SERVICES` - Fetch all services with relationships
- **Mutations**: `CREATE_SERVICE`, `UPDATE_SERVICE`, `DELETE_SERVICE`

### User Billing Rate Manager  
**File**: `/domains/billing/components/service-management/user-billing-rate-manager.tsx`
**Status**: ✅ Complete

#### Purpose
Manage individual consultant billing rates with historical tracking and effective date management.

#### Key Features
- ✅ Historical rate tracking with effective dates
- ✅ Seniority level management (junior, senior, manager, partner)
- ✅ Rate overlap prevention with database constraints
- ✅ Bulk rate operations for team management
- ✅ Manager oversight for direct reports

#### Props Interface
```typescript
interface UserBillingRateManagerProps {
  userId?: string; // Optional: manage specific user
  managerMode?: boolean; // Enable manager oversight features
}
```

#### State Management
```typescript
const [users, setUsers] = useState<User[]>([]);
const [billingRates, setBillingRates] = useState<UserBillingRate[]>([]);
const [selectedUser, setSelectedUser] = useState<User | null>(null);
const [formData, setFormData] = useState<RateFormData>({...});
```

#### Validation Rules
- Effective date ranges cannot overlap for same user
- Hourly rates must be positive numbers
- End date must be after start date
- Manager approval required for rate changes

### Client Service Assignment Manager
**File**: `/domains/billing/components/service-management/client-service-assignment-manager.tsx`
**Status**: ✅ Complete

#### Purpose
Manage service-to-client assignments with custom rates and effective periods.

#### Key Features
- ✅ Service-to-client mapping interface
- ✅ Custom rate overrides per client
- ✅ Custom seniority multipliers
- ✅ Rate effective period management
- ✅ Assignment status tracking

#### Props Interface
```typescript
interface ClientServiceAssignmentManagerProps {
  clientId?: string; // Optional: manage specific client
  serviceId?: string; // Optional: manage specific service
}
```

#### State Management
```typescript
const [clients, setClients] = useState<Client[]>([]);
const [services, setServices] = useState<Service[]>([]);
const [assignments, setAssignments] = useState<ClientServiceAssignment[]>([]);
const [formData, setFormData] = useState<AssignmentFormData>({...});
```

### Service Management Dashboard
**File**: `/domains/billing/components/service-management/service-management-dashboard.tsx`
**Status**: ✅ Complete

#### Purpose
Unified dashboard providing overview and quick actions for service management.

#### Key Features
- ✅ Category-based service organization
- ✅ Quick statistics and metrics
- ✅ Bulk operations interface
- ✅ Recent activity tracking

#### Components Integration
```typescript
// Integrates all service management components
<Tabs>
  <TabsContent value="catalogue">
    <MasterServiceCatalogue />
  </TabsContent>
  <TabsContent value="rates">
    <UserBillingRateManager />
  </TabsContent>
  <TabsContent value="assignments">
    <ClientServiceAssignmentManager />
  </TabsContent>
</Tabs>
```

## Payroll Integration Layer

### Dynamic Payroll Completion Form
**File**: `/domains/billing/components/payroll-completion/dynamic-payroll-completion-form.tsx`
**Status**: ✅ Complete

#### Purpose
Capture service quantities and metrics for payroll billing generation.

#### Key Features
- ✅ Service quantity management per payroll
- ✅ Real-time billing calculations
- ✅ Integration with service catalogue
- ✅ Quantity validation and constraints
- ✅ Historical quantity comparison

#### Props Interface
```typescript
interface DynamicPayrollCompletionFormProps {
  payrollDateId: string;
  onSubmit?: (quantities: ServiceQuantity[]) => void;
  readonly?: boolean;
}
```

#### Form Data Structure
```typescript
interface ServiceQuantityFormData {
  serviceId: string;
  quantity: number;
  notes?: string;
  overrideRate?: number;
}
```

#### Calculation Engine
```typescript
const calculateBillingAmount = (
  service: Service,
  quantity: number,
  clientAssignment?: ClientServiceAssignment,
  payrollOverride?: PayrollServiceOverride
) => {
  // Hierarchical rate calculation:
  // 1. Payroll Override Rate (highest priority)
  // 2. Client Assignment Rate
  // 3. Default Service Rate (lowest priority)
};
```

### Payroll Service Override Manager
**File**: `/domains/billing/components/payroll-completion/payroll-service-override-manager.tsx`
**Status**: ✅ Complete

#### Purpose
Manage payroll-specific rate overrides with manager approval workflow.

#### Key Features
- ✅ Manager-approved rate override system
- ✅ Financial impact calculations
- ✅ Override approval workflow
- ✅ Comprehensive audit trail
- ✅ Statistics and reporting

#### Props Interface
```typescript
interface PayrollServiceOverrideManagerProps {
  payrollDateId: string;
  onOverrideChange?: (overrides: PayrollServiceOverride[]) => void;
}
```

#### Approval Workflow
```typescript
enum OverrideStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

const approvalWorkflow = {
  create: ['consultant'], // Consultant can create
  approve: ['manager', 'org_admin'], // Manager+ can approve
  apply: 'approved' // Only approved overrides apply
};
```

### Time Tracking Integration
**File**: `/domains/billing/components/payroll-completion/time-tracking-integration.tsx`
**Status**: ✅ Complete

#### Purpose
Integrated time tracking with automatic billing fee calculation.

#### Key Features
- ✅ Built-in timer functionality with start/stop/pause
- ✅ Automatic fee calculation with seniority multipliers
- ✅ Service assignment for billable time
- ✅ Real-time calculation preview
- ✅ Bulk recalculation capabilities

#### Props Interface
```typescript
interface TimeTrackingIntegrationProps {
  payrollDateId: string;
  staffUserId?: string; // Optional: pre-select user
  onTimeEntryComplete?: (entry: TimeEntry) => void;
}
```

#### Timer State Management
```typescript
const [timerState, setTimerState] = useState<{
  isRunning: boolean;
  startTime: Date | null;
  elapsedTime: number; // in seconds
  description: string;
}>({
  isRunning: false,
  startTime: null,
  elapsedTime: 0,
  description: ''
});
```

#### Fee Calculation
```typescript
const calculateFee = (
  hours: number,
  userRate: UserBillingRate,
  service?: Service,
  clientAssignment?: ClientServiceAssignment
) => {
  const baseRate = userRate.hourly_rate;
  const seniorityMultiplier = getSeniorityMultiplier(userRate.seniority_level);
  const serviceMultiplier = service?.pricing_rules?.multiplier || 1.0;
  
  return hours * baseRate * seniorityMultiplier * serviceMultiplier;
};
```

### Invoice Generation System
**File**: `/domains/billing/components/payroll-completion/invoice-generation-system.tsx`
**Status**: ✅ Complete

#### Purpose
Generate invoices from approved billing items with manager approval workflow.

#### Key Features
- ✅ Complete invoice generation from billing items
- ✅ Manager approval workflow
- ✅ Line-item adjustments and modifications
- ✅ PDF/CSV export preparation
- ✅ Payment tracking integration

#### Props Interface
```typescript
interface InvoiceGenerationSystemProps {
  payrollDateId: string;
  onInvoiceGenerated?: (invoice: Invoice) => void;
}
```

#### Invoice Data Structure
```typescript
interface InvoiceFormData {
  invoice_date: string;
  due_date: string;
  payment_terms?: string;
  notes?: string;
  selected_billing_items: string[];
  tax_rate?: number;
}
```

#### Generation Process
```typescript
const generateInvoice = async (formData: InvoiceFormData) => {
  // 1. Validate billing items are approved
  // 2. Calculate totals including tax
  // 3. Generate unique invoice number
  // 4. Create invoice record
  // 5. Create line items from billing items
  // 6. Prepare for PDF/CSV export
  // 7. Update billing items status
};
```

## Recurring Services Layer

### Recurring Services Manager
**File**: `/domains/billing/components/recurring-services/recurring-services-manager.tsx`
**Status**: ✅ Complete

#### Purpose
Manage recurring monthly services and automatic billing generation.

#### Key Features
- ✅ Standard recurring service management
- ✅ Client subscription tracking
- ✅ Automatic billing generation
- ✅ Category-based service organization
- ✅ Pro-rated billing for partial months

#### Props Interface
```typescript
interface RecurringServicesManagerProps {
  clientId?: string; // Optional: manage specific client
  onServiceSubscribe?: (clientId: string, serviceCode: string) => void;
}
```

#### Standard Services Configuration
```typescript
const STANDARD_RECURRING_SERVICES = [
  {
    serviceCode: 'MONTHLY_COMPLIANCE',
    serviceName: 'Monthly Compliance Review',
    category: 'compliance',
    baseRate: 350.00,
    billingUnit: 'monthly',
    description: 'Regular compliance monitoring'
  },
  // ... additional services
];
```

## Payroll Integration Layer

### Payroll Completion Metrics Form
**File**: `/domains/billing/components/payroll-integration/payroll-completion-metrics-form.tsx`
**Status**: ✅ Complete

#### Purpose
Capture detailed payroll completion metrics for accurate billing generation.

#### Key Features
- ✅ Comprehensive metrics collection
- ✅ Complexity factor assessment
- ✅ Processing time tracking
- ✅ Quality metrics capture
- ✅ Integration with Tier 1 billing generation

#### Props Interface
```typescript
interface PayrollCompletionMetricsFormProps {
  payrollDateId: string;
  onMetricsSubmit?: (metrics: CompletionMetrics) => void;
  existingMetrics?: CompletionMetrics;
}
```

#### Metrics Data Structure
```typescript
interface CompletionMetricsFormData {
  payslipsProcessed: number;
  employeesProcessed: number;
  newStarters?: number;
  terminations?: number;
  leaveCalculations?: number;
  bonusPayments?: number;
  taxAdjustments?: number;
  superContributions?: number;
  workersCompClaims?: number;
  processingTimeHours?: number;
  complexityScore?: number;
  generationNotes?: string;
}
```

## Integration Points

### Modern Billing Dashboard
**File**: `/domains/billing/components/dashboard/modern-billing-dashboard.tsx`
**Status**: ✅ Complete

Central hub integrating all billing components:

```typescript
<Tabs defaultValue="overview" className="w-full">
  <TabsContent value="services">
    <ServiceManagementDashboard />
  </TabsContent>
  <TabsContent value="recurring">
    <RecurringServicesManager />
  </TabsContent>
  <TabsContent value="completion">
    <PayrollCompletionMetricsForm />
  </TabsContent>
</Tabs>
```

## Data Flow Architecture

### Service Management Flow
```
User Input → Form Validation → GraphQL Mutation → Database → UI Update
```

### Payroll Integration Flow
```
Payroll Completion → Metrics Collection → Service Quantities → 
Override Processing → Billing Generation → Invoice Creation
```

### Time Tracking Flow
```
Timer Start → Time Recording → Service Assignment → 
Fee Calculation → Billing Item Creation → Approval Workflow
```

## Error Handling Patterns

### Consistent Error Handling
```typescript
const [error, setError] = useState<string | null>(null);
const [loading, setLoading] = useState(false);

const handleOperation = async () => {
  try {
    setLoading(true);
    setError(null);
    // Perform operation
  } catch (err) {
    setError(err.message);
    toast.error(`Operation failed: ${err.message}`);
  } finally {
    setLoading(false);
  }
};
```

### Form Validation
```typescript
const validateForm = (data: FormData): string[] => {
  const errors: string[] = [];
  
  if (!data.required_field) {
    errors.push('Required field is missing');
  }
  
  if (data.numeric_field && data.numeric_field < 0) {
    errors.push('Numeric field must be positive');
  }
  
  return errors;
};
```

## Performance Optimizations

### React Optimizations
- ✅ Component memoization with `React.memo()`
- ✅ Callback memoization with `useCallback()`
- ✅ Effect optimization with proper dependencies
- ✅ State batching for multiple updates

### GraphQL Optimizations
- ✅ Query optimization with specific field selection
- ✅ Relationship loading with proper joins
- ✅ Caching strategy for frequently accessed data
- ✅ Batch operations for bulk updates

### UI/UX Optimizations
- ✅ Loading states for all async operations
- ✅ Optimistic updates for immediate feedback
- ✅ Error boundaries for graceful error handling
- ✅ Accessibility compliance (ARIA labels, keyboard navigation)

This architecture provides a scalable, maintainable foundation for the billing system with clear separation of concerns and comprehensive feature coverage.