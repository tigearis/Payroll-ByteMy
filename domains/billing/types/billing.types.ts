// Core Billing Types for the redesigned billing system
export interface BillingItem {
  id: string;
  description?: string | null;
  amount?: number | null;
  quantity: number;
  unitPrice: number;
  totalAmount?: number | null;
  status?: string | null;
  notes?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  approvalDate?: string | null;
  isApproved?: boolean | null;
  clientId?: string | null;
  staffUserId?: string | null;
  approvedBy?: string | null;
  confirmedAt?: string | null;
  confirmedBy?: string | null;
  payrollId?: string | null;
  serviceId?: string | null;
  serviceName?: string | null;
  hourlyRate?: number | null;
  invoiceId?: string | null;
  
  // Relationships
  client?: {
    id: string;
    name?: string | null;
    contactEmail?: string | null;
  } | null;
  
  staffUser?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  } | null;
  
  approvedByUser?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  } | null;
  
  payroll?: {
    id: string;
    name?: string | null;
    status?: string | null;
  } | null;
  
  service?: {
    id: string;
    name?: string | null;
    description?: string | null;
    category?: string | null;
    billingUnit?: string | null;
    defaultRate?: number | null;
    currency?: string | null;
    serviceType?: string | null;
  } | null;
  
  timeEntries?: TimeEntry[] | null;
}

export interface TimeEntry {
  id: string;
  hoursSpent?: number | null;
  workDate?: string | null;
  description?: string | null;
  
  // Relationships - matches GraphQL schema
  staffUser?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    computedName?: string | null;
    email?: string | null;
  } | null;
  
  client?: {
    id: string;
    name?: string | null;
  } | null;
  
  payroll?: {
    id: string;
    name?: string | null;
  } | null;
}

export interface Client {
  id: string;
  name?: string | null;
  contactEmail?: string | null;
  active?: boolean | null;
  
  // Additional billing context
  billingItems?: Pick<BillingItem, 'id' | 'amount' | 'status'>[] | null;
}

export interface Service {
  id: string;
  name?: string | null;
  serviceCode?: string | null;
  description?: string | null;
  baseRate?: number | null;
  category?: string | null;
  chargeBasis?: string | null;
  approvalLevel?: string | null;
  billingUnit?: string | null;
  defaultRate?: number | null;
  currency?: string | null;
  serviceType?: string | null;
}

export interface StaffUser {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  role?: string | null;
  
  // Computed properties
  computedName?: string;
  
  // Recent billing performance
  staffBillingItems?: Pick<BillingItem, 'id' | 'amount' | 'status' | 'createdAt'>[] | null;
}

export interface PayrollDate {
  id: string;
  payrollId?: string | null;
  adjustedEftDate?: string | null;
  completedAt?: string | null;
  completedBy?: string | null;
  
  payroll?: {
    id: string;
    name?: string | null;
    client?: {
      id: string;
      name?: string | null;
    } | null;
    primaryConsultant?: {
      id: string;
      firstName?: string | null;
      lastName?: string | null;
    } | null;
  } | null;
}

export interface BillingMetrics {
  totalRevenue: number;
  pendingRevenue: number;
  approvedRevenue: number;
  draftRevenue: number;
  totalItems: number;
  pendingCount: number;
  approvedCount: number;
  draftCount: number;
  activeClientsCount: number;
  completionRate: number;
  averageItemValue: number;
  payrollCompletionRate: number;
}

// Component-specific types
export interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  action: "create" | "update" | "admin" | "read";
  color: string;
  disabled?: boolean;
}

export interface MetricCard {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: "up" | "down" | "neutral";
  color: string;
  bgColor: string;
  href?: string;
}

// Filter and sorting types
export type BillingStatus = "draft" | "pending" | "approved" | "rejected" | "archived";
export type TimeRange = "7d" | "30d" | "90d" | "1y" | "all";
export type SortDirection = "asc" | "desc";

export interface BillingFilters {
  status?: BillingStatus[];
  clientIds?: string[];
  staffUserIds?: string[];
  serviceIds?: string[];
  timeRange?: TimeRange;
  dateFrom?: Date;
  dateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
  searchTerm?: string;
}

export interface BillingSorting {
  field: keyof BillingItem;
  direction: SortDirection;
}

// Component prop types
export interface BillingHeaderProps {
  metrics: BillingMetrics;
  loading?: boolean;
  onRefresh?: () => void;
}

export interface BillingOverviewProps {
  billingItems: BillingItem[];
  recentBillingItems: BillingItem[];
  metrics: BillingMetrics;
  loading?: boolean;
}

export interface BillingItemsManagerProps {
  billingItems: BillingItem[];
  loading?: boolean;
  onRefetch?: () => void;
  onStatusChange?: (itemId: string, status: BillingStatus) => void;
  onBulkAction?: (itemIds: string[], action: string) => void;
}

export interface RecurringServicesPanelProps {
  services: Service[];
  clients: Client[];
  loading?: boolean;
  onServiceAdd?: (clientId: string, serviceId: string, customRate?: number) => void;
  onServiceToggle?: (assignmentId: string, isActive: boolean) => void;
}

export interface PayrollIntegrationHubProps {
  payrollDatesReadyForBilling: PayrollDate[];
  completionRate: number;
  loading?: boolean;
  onGenerateBilling?: (payrollDateId: string) => void;
}

export interface BillingAnalyticsProps {
  timeEntries: TimeEntry[];
  billingItems: BillingItem[];
  staffUsers: StaffUser[];
  metrics: BillingMetrics;
  loading?: boolean;
}

// Error types
export interface BillingError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

// Form types
export interface BillingItemFormData {
  description: string;
  clientId: string;
  serviceId: string;
  quantity: number;
  unitPrice: number;
  staffUserId: string;
  notes?: string;
  payrollId?: string;
}

// Table configuration types
export interface BillingTableColumn {
  key: keyof BillingItem;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  render?: (item: BillingItem) => React.ReactNode;
}

// Analytics types
export interface RevenueData {
  date: string;
  revenue: number;
  approved: number;
  pending: number;
  count: number;
}

export interface ServicePerformanceData {
  serviceName: string;
  revenue: number;
  count: number;
  averageValue: number;
}

export interface StaffPerformanceData {
  staffName: string;
  revenue: number;
  count: number;
  hoursSpent: number;
  efficiency: number;
}

// Notification types
export interface BillingNotification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

// Export utility types
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;