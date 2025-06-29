// Fixed version of payrolls page with proper hook order
// ALL HOOKS MUST BE CALLED BEFORE ANY EARLY RETURNS

"use client";

import { useQuery } from "@apollo/client";
import {
  PlusCircle,
  Search,
  Filter,
  Upload,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  UserCheck,
  RefreshCw,
  FileText,
  Calculator,
  X,
  ChevronDown,
  Users,
  Grid3X3,
  TableIcon,
  List,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useMemo, useCallback } from "react";
import { PayrollUpdatesListener } from "@/components/real-time-updates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PayrollsTable } from "@/domains/payrolls/components/payrolls-table";
import {
  GetPayrollsPaginatedDocument,
  GetPayrollDashboardStatsDocument,
} from "@/domains/payrolls/graphql/generated/graphql";
import { useAuthContext } from "@/lib/auth/enhanced-auth-context";

type ViewMode = "cards" | "table" | "list";

// Column definitions
const COLUMN_DEFINITIONS = [
  { key: "name", label: "Payroll Name", sortable: true, defaultVisible: true },
  { key: "client", label: "Client", sortable: true, defaultVisible: true },
  {
    key: "payrollCycle",
    label: "Payroll Schedule",
    sortable: true,
    defaultVisible: true,
  },
  { key: "status", label: "Status", sortable: true, defaultVisible: true },
  {
    key: "consultant",
    label: "Consultant",
    sortable: true,
    defaultVisible: true,
  },
  {
    key: "employees",
    label: "Employees",
    sortable: true,
    defaultVisible: true,
  },
  {
    key: "lastUpdated",
    label: "Last Updated",
    sortable: true,
    defaultVisible: false,
  },
  {
    key: "nextEftDate",
    label: "Next EFT Date",
    sortable: true,
    defaultVisible: true,
  },
];

// All helper functions moved to top level to avoid recreation
const getStatusConfig = (status: string) => {
  const configs = {
    Implementation: {
      variant: "secondary" as const,
      icon: Clock,
      progress: 15,
    },
    Active: {
      variant: "default" as const,
      icon: CheckCircle,
      progress: 100,
    },
    Inactive: {
      variant: "secondary" as const,
      icon: AlertTriangle,
      progress: 0,
    },
    draft: {
      variant: "outline" as const,
      icon: FileText,
      progress: 10,
    },
    "data-entry": {
      variant: "secondary" as const,
      icon: Calculator,
      progress: 30,
    },
    review: {
      variant: "secondary" as const,
      icon: Eye,
      progress: 50,
    },
    processing: {
      variant: "secondary" as const,
      icon: RefreshCw,
      progress: 70,
    },
    "manager-review": {
      variant: "outline" as const,
      icon: UserCheck,
      progress: 85,
    },
    approved: {
      variant: "default" as const,
      icon: CheckCircle,
      progress: 95,
    },
    submitted: {
      variant: "default" as const,
      icon: Upload,
      progress: 100,
    },
    paid: {
      variant: "default" as const,
      icon: CheckCircle,
      progress: 100,
    },
    "on-hold": {
      variant: "destructive" as const,
      icon: AlertTriangle,
      progress: 60,
    },
    cancelled: {
      variant: "destructive" as const,
      icon: AlertTriangle,
      progress: 0,
    },
  };

  return configs[status as keyof typeof configs] || configs["Implementation"];
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: string | Date) => {
  if (!date) {
    return "Not set";
  }
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date: string | Date) => {
  if (!date) {
    return "Not set";
  }
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatPayrollCycle = (payroll: any) => {
  const cycleName = payroll.payrollCycle?.name;
  const dateTypeName = payroll.payrollDateType?.name;
  const dateValue = payroll.dateValue;

  if (!cycleName) {
    return "Not configured";
  }

  let readableCycle = "";
  switch (cycleName) {
    case "weekly":
      readableCycle = "Weekly";
      break;
    case "fortnightly":
      readableCycle = "Fortnightly";
      break;
    case "bi_monthly":
      readableCycle = "Bi-Monthly";
      break;
    case "monthly":
      readableCycle = "Monthly";
      break;
    case "quarterly":
      readableCycle = "Quarterly";
      break;
    default:
      readableCycle = cycleName.charAt(0).toUpperCase() + cycleName.slice(1);
  }

  return readableCycle;
};

// Custom MultiSelect Component
interface MultiSelectProps {
  options: Array<{ value: string; label: string }>;
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
  placeholder: string;
  label?: string;
}

function MultiSelect({
  options,
  selected,
  onSelectionChange,
  placeholder,
  label,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const handleToggle = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter(item => item !== value)
      : [...selected, value];
    onSelectionChange(newSelected);
  };

  const selectedLabels = options
    .filter(option => selected.includes(option.value))
    .map(option => option.label);

  const displayText =
    selectedLabels.length > 0
      ? selectedLabels.length === 1
        ? selectedLabels[0]
        : `${selectedLabels.length} selected`
      : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {displayText}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <div className="max-h-60 overflow-auto">
          {options.map(option => (
            <div
              key={option.value}
              className="flex items-center space-x-2 p-2 hover:bg-accent cursor-pointer"
              onClick={() => handleToggle(option.value)}
            >
              <Checkbox
                checked={selected.includes(option.value)}
                onChange={() => handleToggle(option.value)}
              />
              <span className="text-sm">{option.label}</span>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function PayrollsPage() {
  // ==========================================
  // ALL HOOKS MUST BE CALLED FIRST - NO EARLY RETURNS BEFORE THIS SECTION
  // ==========================================

  // State hooks
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [clientFilter, setClientFilter] = useState<string[]>([]);
  const [consultantFilter, setConsultantFilter] = useState<string[]>([]);
  const [payCycleFilter, setPayCycleFilter] = useState<string[]>([]);
  const [dateTypeFilter, setDateTypeFilter] = useState<string[]>([]);
  const [selectedPayrolls, setSelectedPayrolls] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortField, setSortField] = useState<string>("updatedAt");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    COLUMN_DEFINITIONS.filter(col => col.defaultVisible).map(col => col.key)
  );

  // Custom hooks
  const { hasPermission, userRole, isLoading: roleLoading } = useAuthContext();

  // All remaining hooks BEFORE any conditional logic
  const whereConditions = useMemo(() => {
    const conditions: any[] = [];
    if (searchTerm) {
      conditions.push({
        _or: [
          { name: { _ilike: `%${searchTerm}%` } },
          { client: { name: { _ilike: `%${searchTerm}%` } } },
          { primaryConsultant: { name: { _ilike: `%${searchTerm}%` } } },
          { backupConsultant: { name: { _ilike: `%${searchTerm}%` } } },
        ],
      });
    }
    if (statusFilter.length > 0) {
      conditions.push({ status: { _in: statusFilter } });
    }
    if (clientFilter.length > 0) {
      conditions.push({ clientId: { _in: clientFilter } });
    }
    if (consultantFilter.length > 0) {
      conditions.push({
        _or: [
          { primaryConsultantUserId: { _in: consultantFilter } },
          { backupConsultantUserId: { _in: consultantFilter } },
        ],
      });
    }
    if (payCycleFilter.length > 0) {
      conditions.push({ payrollCycle: { name: { _in: payCycleFilter } } });
    }
    if (dateTypeFilter.length > 0) {
      conditions.push({ payrollDateType: { name: { _in: dateTypeFilter } } });
    }
    return conditions.length > 0 ? { _and: conditions } : {};
  }, [
    searchTerm,
    statusFilter,
    clientFilter,
    consultantFilter,
    payCycleFilter,
    dateTypeFilter,
  ]);

  const orderByConditions = useMemo(() => {
    const sortMap: Record<string, string> = {
      name: "name",
      client: "client.name",
      consultant: "primaryConsultant.name",
      employees: "employeeCount",
      lastUpdated: "updatedAt",
      status: "status",
    };
    const field = sortMap[sortField] || "updatedAt";
    return [{ [field]: sortDirection }];
  }, [sortField, sortDirection]);

  const offset = (currentPage - 1) * pageSize;

  const { data, loading, error, refetch } = useQuery(
    GetPayrollsPaginatedDocument,
    {
      variables: {
        limit: pageSize,
        offset: offset,
        where: whereConditions,
        orderBy: orderByConditions,
      },
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
    }
  );

  // Get dashboard stats for accurate totals
  const {
    data: statsData,
    loading: statsLoading,
    error: statsError,
  } = useQuery(GetPayrollDashboardStatsDocument, {
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });

  const payrolls = data?.payrolls || [];
  const totalCount = data?.payrollsAggregate?.aggregate?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const displayPayrolls = useMemo(() => {
    const getNextEftDate = (payrollDates: any[]) => {
      if (!payrollDates || payrollDates.length === 0) return null;
      const today = new Date();
      const futureDates = payrollDates
        .filter(date => {
          // Use adjustedEftDate if available, otherwise fall back to originalEftDate
          const eftDate = date.adjustedEftDate || date.originalEftDate;
          return eftDate && new Date(eftDate) >= today;
        })
        .sort((a, b) => {
          const dateA = a.adjustedEftDate || a.originalEftDate;
          const dateB = b.adjustedEftDate || b.originalEftDate;
          return new Date(dateA).getTime() - new Date(dateB).getTime();
        });
      return futureDates.length > 0
        ? futureDates[0].adjustedEftDate || futureDates[0].originalEftDate
        : null;
    };

    return payrolls.map((payroll: any) => {
      const employeeCount = payroll.employeeCount || 0;
      return {
        ...payroll,
        employeeCount,
        payrollCycleFormatted: formatPayrollCycle(payroll),
        priority:
          employeeCount > 50 ? "high" : employeeCount > 20 ? "medium" : "low",
        progress: getStatusConfig(payroll.status || "Implementation").progress,
        nextEftDate: getNextEftDate(payroll.payrollDates),
        lastUpdated: new Date(payroll.updatedAt || payroll.createdAt),
        lastUpdatedBy: payroll.backupConsultant?.name || "System",
      };
    });
  }, [payrolls]);

  const {
    uniqueStatuses,
    uniqueClients,
    uniqueConsultants,
    uniquePayCycles,
    uniqueDateTypes,
  } = useMemo(() => {
    return {
      uniqueStatuses: Array.from(
        new Set(payrolls.map((p: any) => p.status || "Implementation"))
      ) as string[],
      uniqueClients: Array.from(
        new Map(
          payrolls
            .filter((p: any) => p.client?.id)
            .map((p: any) => [p.client.id, p.client])
        ).values()
      ) as any[],
      uniqueConsultants: Array.from(
        new Map(
          payrolls
            .filter((p: any) => p.primaryConsultant?.id)
            .map((p: any) => [p.primaryConsultant.id, p.primaryConsultant])
        ).values()
      ) as any[],
      uniquePayCycles: Array.from(
        new Set(payrolls.map((p: any) => p.payrollCycle?.name).filter(Boolean))
      ) as string[],
      uniqueDateTypes: Array.from(
        new Set(
          payrolls.map((p: any) => p.payrollDateType?.name).filter(Boolean)
        )
      ) as string[],
    };
  }, [payrolls]);

  const payrollsList = data?.payrolls || [];

  // Use dashboard stats for accurate totals instead of paginated data
  const totalPayrollsCount = statsData?.totalPayrolls?.aggregate?.count || 0;
  const activePayrolls = statsData?.activePayrolls?.aggregate?.count || 0;
  const totalEmployees =
    statsData?.totalEmployees?.aggregate?.sum?.employeeCount || 0;
  const pendingPayrolls = statsData?.pendingPayrolls?.aggregate?.count || 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    statusFilter.length,
    clientFilter.length,
    consultantFilter.length,
    payCycleFilter.length,
    dateTypeFilter.length,
  ]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedPayrolls(displayPayrolls.map((p: any) => p.id));
      } else {
        setSelectedPayrolls([]);
      }
    },
    [displayPayrolls]
  );

  const handleSelectPayroll = useCallback(
    (payrollId: string, checked: boolean) => {
      if (checked) {
        setSelectedPayrolls(prev => [...prev, payrollId]);
      } else {
        setSelectedPayrolls(prev => prev.filter(id => id !== payrollId));
      }
    },
    []
  );

  const handleSort = useCallback(
    (field: string) => {
      if (sortField === field) {
        setSortDirection(prev => (prev === "ASC" ? "DESC" : "ASC"));
      } else {
        setSortField(field);
        setSortDirection("ASC");
      }
      setCurrentPage(1);
    },
    [sortField]
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter([]);
    setClientFilter([]);
    setConsultantFilter([]);
    setPayCycleFilter([]);
    setDateTypeFilter([]);
  }, []);

  // Computed values
  const hasAdminAccess = hasPermission("admin:manage");
  const canManagePayrolls = hasPermission("payroll:write");
  const canCreatePayrolls = hasPermission("payroll:assign"); // Allow consultants to create/assign payrolls
  const canViewAdvanced = hasPermission("admin:manage");

  // Debug logging for developer role issue
  console.log("🔍 Payrolls Page Debug:", {
    userRole,
    roleLoading,
    hasAdminAccess,
    canManagePayrolls,
    canCreatePayrolls,
    canViewAdvanced,
    buttonShouldShow: hasAdminAccess || canManagePayrolls || canCreatePayrolls || canViewAdvanced,
    permissionChecks: {
      adminManage: hasPermission("admin:manage"),
      payrollWrite: hasPermission("payroll:write"),
      payrollAssign: hasPermission("payroll:assign"),
      adminManageEnhanced: hasPermission("admin:manage"),
    }
  });
  const hasActiveFilters =
    searchTerm ||
    statusFilter.length > 0 ||
    clientFilter.length > 0 ||
    consultantFilter.length > 0 ||
    payCycleFilter.length > 0 ||
    dateTypeFilter.length > 0;

  // ==========================================
  // EARLY RETURNS AFTER ALL HOOKS
  // ==========================================

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-500">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (loading && !payrolls.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-500">Loading payrolls...</p>
        </div>
      </div>
    );
  }

  if ((error && !payrolls.length) || statsError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-8 h-8 mx-auto text-destructive" />
          <p className="text-destructive">
            Error loading payrolls: {error?.message || statsError?.message}
          </p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <>
      <PayrollUpdatesListener showToasts={true} />
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">Payrolls</h1>
            <p className="text-gray-500">Manage payrolls for your clients</p>
          </div>
          <div className="flex items-center space-x-2">
            {/* Temporarily force show button for developer role debugging */}
            {(userRole === "developer" || hasAdminAccess || canManagePayrolls || canCreatePayrolls || canViewAdvanced) && (
              <Link href="/payrolls/new">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Payroll
                </Button>
              </Link>
            )}
          </div>
        </header>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Payrolls
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalPayrollsCount}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Payrolls
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activePayrolls}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Employees
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalEmployees}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search payrolls, clients, consultants..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 w-[300px]"
                  />
                </div>

                {/* Advanced Filters Button */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={showFilters ? "bg-primary/10" : ""}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {
                        [
                          searchTerm,
                          statusFilter.length > 0,
                          clientFilter.length > 0,
                          consultantFilter.length > 0,
                          payCycleFilter.length > 0,
                          dateTypeFilter.length > 0,
                        ].filter(Boolean).length
                      }
                    </Badge>
                  )}
                </Button>

                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                )}

                {/* Sort Dropdown */}
                <Select
                  value={`${sortField}-${sortDirection}`}
                  onValueChange={value => {
                    const [field, direction] = value.split("-");
                    setSortField(field);
                    setSortDirection(direction as "ASC" | "DESC");
                  }}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-ASC">Name A-Z</SelectItem>
                    <SelectItem value="name-DESC">Name Z-A</SelectItem>
                    <SelectItem value="client-ASC">Client A-Z</SelectItem>
                    <SelectItem value="client-DESC">Client Z-A</SelectItem>
                    <SelectItem value="status-ASC">Status A-Z</SelectItem>
                    <SelectItem value="status-DESC">Status Z-A</SelectItem>
                    <SelectItem value="employees-ASC">Employees ↑</SelectItem>
                    <SelectItem value="employees-DESC">Employees ↓</SelectItem>
                    <SelectItem value="lastUpdated-ASC">Updated ↑</SelectItem>
                    <SelectItem value="lastUpdated-DESC">Updated ↓</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "cards" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                >
                  <TableIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Advanced Filter Dropdowns */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Status
                  </label>
                  <MultiSelect
                    options={uniqueStatuses.map(status => ({
                      value: status,
                      label: status,
                    }))}
                    selected={statusFilter}
                    onSelectionChange={setStatusFilter}
                    placeholder="All statuses"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Client
                  </label>
                  <MultiSelect
                    options={uniqueClients.map(client => ({
                      value: client.id,
                      label: client.name,
                    }))}
                    selected={clientFilter}
                    onSelectionChange={setClientFilter}
                    placeholder="All clients"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Consultant
                  </label>
                  <MultiSelect
                    options={uniqueConsultants.map(consultant => ({
                      value: consultant.id,
                      label: consultant.name,
                    }))}
                    selected={consultantFilter}
                    onSelectionChange={setConsultantFilter}
                    placeholder="All consultants"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content based on view mode */}
        {loading || statsLoading ? (
          <Card>
            <CardContent className="p-12">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            </CardContent>
          </Card>
        ) : payrolls.length === 0 ? (
          <Card>
            <CardContent className="p-12">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {hasActiveFilters ? "No payrolls found" : "No payrolls yet"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {hasActiveFilters
                    ? "Try adjusting your search criteria or filters"
                    : "Get started by adding your first payroll"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div>
            {viewMode === "table" && (
              <PayrollsTable
                payrolls={payrollsList}
                loading={!!loading || !!statsLoading}
                onRefresh={refetch}
                selectedPayrolls={selectedPayrolls}
                onSelectPayroll={handleSelectPayroll}
                onSelectAll={handleSelectAll}
                visibleColumns={visibleColumns}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            )}

            {/* TODO: Add card and list views similar to clients page */}
            {viewMode === "cards" && (
              <div className="text-center py-8">
                <p className="text-gray-500">Card view coming soon!</p>
              </div>
            )}

            {viewMode === "list" && (
              <div className="text-center py-8">
                <p className="text-gray-500">List view coming soon!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
