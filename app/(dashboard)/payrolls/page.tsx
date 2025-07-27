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
  Building2,
  CalendarDays,
  Edit,
  Download,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useMemo, useCallback } from "react";
import { PayrollUpdatesListener } from "@/components/real-time-updates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { PayrollsTableUnified } from "@/domains/payrolls/components/payrolls-table-unified";
import {
  GetPayrollsTableEnhancedDocument,
  GetPayrollDashboardStatsDocument,
} from "@/domains/payrolls/graphql/generated/graphql";
import { useDynamicLoading } from "@/lib/hooks/use-dynamic-loading";

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

// Helper function for consistent badge colors
const getStatusColor = (status: string) => {
  const config = getStatusConfig(status);
  switch (config.variant) {
    case "default":
      return "bg-green-100 text-green-800 border-green-200";
    case "secondary":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "destructive":
      return "bg-red-100 text-red-800 border-red-200";
    case "outline":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
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
                onCheckedChange={() => handleToggle(option.value)}
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
    const sortMap: Record<string, any> = {
      name: { name: sortDirection },
      client: { client: { name: sortDirection } },
      consultant: { primaryConsultant: { name: sortDirection } },
      employees: { employeeCount: sortDirection },
      lastUpdated: { updatedAt: sortDirection },
      status: { status: sortDirection },
      payrollCycle: { payrollCycle: { name: sortDirection } },
    };
    return sortMap[sortField]
      ? [sortMap[sortField]]
      : [{ updatedAt: sortDirection }];
  }, [sortField, sortDirection]);

  const offset = (currentPage - 1) * pageSize;

  const { data, loading, error, refetch } = useQuery(
    GetPayrollsTableEnhancedDocument,
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
    return payrolls.map((payroll: any) => {
      const employeeCount = payroll.employeeCount || 0;
      return {
        ...payroll,
        employeeCount,
        payrollCycleFormatted: formatPayrollCycle(payroll),
        priority:
          employeeCount > 50 ? "high" : employeeCount > 20 ? "medium" : "low",
        progress: getStatusConfig(payroll.status || "Implementation").progress,
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

  // Use dynamic loading system
  const { Loading } = useDynamicLoading({
    queryName: "GetPayrollsTableEnhanced",
  });

  if (loading && !payrolls.length) {
    return <Loading />;
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
      <div className="container mx-auto py-6 space-y-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">Payrolls</h1>
            <p className="text-gray-500">Manage payrolls for your clients</p>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/payrolls/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Payroll
              </Button>
            </Link>
          </div>
        </header>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    className="pl-10 w-full max-w-sm"
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
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-ASC">Name (A-Z)</SelectItem>
                    <SelectItem value="name-DESC">Name (Z-A)</SelectItem>
                    <SelectItem value="client-ASC">Client (A-Z)</SelectItem>
                    <SelectItem value="client-DESC">Client (Z-A)</SelectItem>
                    <SelectItem value="status-ASC">Status (A-Z)</SelectItem>
                    <SelectItem value="status-DESC">Status (Z-A)</SelectItem>
                    <SelectItem value="consultant-ASC">
                      Consultant (A-Z)
                    </SelectItem>
                    <SelectItem value="consultant-DESC">
                      Consultant (Z-A)
                    </SelectItem>
                    <SelectItem value="employees-ASC">
                      Employees (Low-High)
                    </SelectItem>
                    <SelectItem value="employees-DESC">
                      Employees (High-Low)
                    </SelectItem>
                    <SelectItem value="lastUpdated-ASC">
                      Updated (Oldest)
                    </SelectItem>
                    <SelectItem value="lastUpdated-DESC">
                      Updated (Newest)
                    </SelectItem>
                    <SelectItem value="payrollCycle-ASC">
                      Schedule (A-Z)
                    </SelectItem>
                    <SelectItem value="payrollCycle-DESC">
                      Schedule (Z-A)
                    </SelectItem>
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
                <Loading variant="minimal" />
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
              <PayrollsTableUnified
                payrolls={payrolls}
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

            {/* Card View */}
            {viewMode === "cards" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {payrolls.map((payroll: any) => {
                  const statusConfig = getStatusConfig(
                    payroll.status || "Implementation"
                  );
                  const StatusIcon = statusConfig.icon;

                  return (
                    <Card
                      key={payroll.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-semibold truncate">
                            <Link
                              href={`/payrolls/${payroll.id}`}
                              className="text-blue-600 hover:underline"
                            >
                              {payroll.name}
                            </Link>
                          </CardTitle>
                          <Badge
                            className={getStatusColor(
                              payroll.status || "Implementation"
                            )}
                          >
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {payroll.status || "Implementation"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">Client:</span>
                            <span className="font-medium">
                              {payroll.client?.name || "No client"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <UserCheck className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">Consultant:</span>
                            <span className="font-medium">
                              {payroll.primaryConsultant?.name || "Unassigned"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">Employees:</span>
                            <span className="font-medium">
                              {payroll.employeeCount || 0}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">Schedule:</span>
                            <span className="font-medium">
                              {formatPayrollCycle(payroll)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">Next EFT:</span>
                            <span className="font-medium">
                              {payroll.nextEftDate?.[0]?.adjustedEftDate ||
                              payroll.nextEftDate?.[0]?.originalEftDate
                                ? formatDate(
                                    payroll.nextEftDate[0]?.adjustedEftDate ||
                                      payroll.nextEftDate[0]?.originalEftDate
                                  )
                                : "Not scheduled"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <Link href={`/payrolls/${payroll.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                          </Link>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/payrolls/${payroll.id}`}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Payroll
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Download className="w-4 h-4 mr-2" />
                                Export
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="space-y-3">
                {payrolls.map((payroll: any) => {
                  const statusConfig = getStatusConfig(
                    payroll.status || "Implementation"
                  );
                  const StatusIcon = statusConfig.icon;

                  return (
                    <Card
                      key={payroll.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-600" />
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                <Link
                                  href={`/payrolls/${payroll.id}`}
                                  className="text-lg font-semibold text-blue-600 hover:underline truncate"
                                >
                                  {payroll.name}
                                </Link>
                                <Badge
                                  className={getStatusColor(
                                    payroll.status || "Implementation"
                                  )}
                                >
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {payroll.status || "Implementation"}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Building2 className="w-3 h-3" />
                                  <span>
                                    {payroll.client?.name || "No client"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <UserCheck className="w-3 h-3" />
                                  <span>
                                    {payroll.primaryConsultant?.name ||
                                      "Unassigned"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  <span>
                                    {payroll.employeeCount || 0} employees
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="text-right text-sm">
                              <div className="font-medium text-gray-900">
                                {formatPayrollCycle(payroll)}
                              </div>
                              <div className="text-gray-500">
                                Next:{" "}
                                {payroll.nextEftDate?.[0]?.adjustedEftDate ||
                                payroll.nextEftDate?.[0]?.originalEftDate
                                  ? formatDate(
                                      payroll.nextEftDate[0]?.adjustedEftDate ||
                                        payroll.nextEftDate[0]?.originalEftDate
                                    )
                                  : "Not scheduled"}
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Link href={`/payrolls/${payroll.id}`}>
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </Button>
                              </Link>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/payrolls/${payroll.id}`}>
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Payroll
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Download className="w-4 h-4 mr-2" />
                                    Export
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
