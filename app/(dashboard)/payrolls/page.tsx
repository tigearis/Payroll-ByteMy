// app/(dashboard)/payrolls/page.tsx - UPDATED VERSION
"use client";

import { useQuery } from "@apollo/client";
import {
  PlusCircle,
  Search,
  Filter,
  Download,
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
  ChevronUp,
  ChevronDown,
  Columns,
  Building2,
  Users,
  MoreHorizontal,
  Edit,
  Copy,
  Grid3X3,
  TableIcon,
  List,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";

import { PayrollUpdatesListener } from "@/components/real-time-updates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { PayrollsTable } from "@/domains/payrolls/components/payrolls-table";
import { GetPayrollsPaginatedDocument } from "@/domains/payrolls/graphql/generated/graphql";
import { useUserRole } from "@/hooks/use-user-role";
import { useCachedQuery } from "@/hooks/use-strategic-query";
import { useEnhancedPermissions } from "@/hooks/use-enhanced-permissions";

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

// Payroll status configuration
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

// Helper functions
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

// Helper function to format payroll cycle information
const formatPayrollCycle = (payroll: any) => {
  const cycleName = payroll.payrollCycle?.name;
  const dateTypeName = payroll.payrollDateType?.name;
  const dateValue = payroll.dateValue;

  if (!cycleName) {
    return "Not configured";
  }

  // Create readable cycle name
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

  // Add date type specific information
  if (dateTypeName) {
    switch (dateTypeName) {
      case "fixed_date":
        if (
          (cycleName === "monthly" ||
            cycleName === "quarterly" ||
            cycleName === "bi_monthly") &&
          dateValue
        ) {
          return `${readableCycle} - ${dateValue}${getOrdinalSuffix(
            dateValue
          )}`;
        }
        break;
      case "eom":
        return `${readableCycle} - EOM`;
      case "som":
        return `${readableCycle} - SOM`;
      case "week_a":
        if (cycleName === "fortnightly" && dateValue) {
          return `${readableCycle} - Week A - ${getDayName(dateValue)}`;
        }
        break;
      case "week_b":
        if (cycleName === "fortnightly" && dateValue) {
          return `${readableCycle} - Week B - ${getDayName(dateValue)}`;
        }
        break;
      case "dow":
        if (
          (cycleName === "weekly" || cycleName === "fortnightly") &&
          dateValue
        ) {
          return `${readableCycle} - ${getDayName(dateValue)}`;
        }
        break;
    }
  }

  return readableCycle;
};

// Helper function to get ordinal suffix
const getOrdinalSuffix = (num: number) => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) {
    return "st";
  }
  if (j === 2 && k !== 12) {
    return "nd";
  }
  if (j === 3 && k !== 13) {
    return "rd";
  }
  return "th";
};

// Helper function to get day name from number
const getDayName = (dayNumber: number) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  // Handle 1-7 range (Monday = 1) and 0-6 range (Sunday = 0)
  if (dayNumber >= 1 && dayNumber <= 7) {
    return days[dayNumber === 7 ? 0 : dayNumber]; // Convert 7 to 0 for Sunday
  }
  if (dayNumber >= 0 && dayNumber <= 6) {
    return days[dayNumber];
  }
  return "Unknown";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [clientFilter, setClientFilter] = useState<string[]>([]);
  const [consultantFilter, setConsultantFilter] = useState<string[]>([]);
  const [payCycleFilter, setPayCycleFilter] = useState<string[]>([]);
  const [dateTypeFilter, setDateTypeFilter] = useState<string[]>([]);
  const [selectedPayrolls, setSelectedPayrolls] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Sorting state
  const [sortField, setSortField] = useState<string>("updatedAt");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    COLUMN_DEFINITIONS.filter(col => col.defaultVisible).map(col => col.key)
  );

  const { hasPermission, userRole, isLoading: roleLoading } = useUserRole();
  const { checkPermission } = useEnhancedPermissions();

  const hasAdminAccess = hasPermission("admin:manage");
  const canManagePayrolls = checkPermission("payroll", "write").granted;
  const canViewAdvanced = checkPermission("admin", "manage").granted;

  // Build GraphQL where conditions for server-side filtering (memoized)
  const whereConditions = useMemo(() => {
    const conditions: any[] = [];

    // Search term filter
    if (searchTerm) {
      conditions.push({
        _or: [
          { name: { _ilike: `%${searchTerm}%` } },
          { client: { name: { _ilike: `%${searchTerm}%` } } },
          { primaryConsultant: { name: { _ilike: `%${searchTerm}%` } } },
          { backupConsultant: { name: { _ilike: `%${searchTerm}%` } } }
        ]
      });
    }

    // Status filter
    if (statusFilter.length > 0) {
      conditions.push({ status: { _in: statusFilter } });
    }

    // Client filter
    if (clientFilter.length > 0) {
      conditions.push({ clientId: { _in: clientFilter } });
    }

    // Consultant filter
    if (consultantFilter.length > 0) {
      conditions.push({
        _or: [
          { primaryConsultantUserId: { _in: consultantFilter } },
          { backupConsultantUserId: { _in: consultantFilter } }
        ]
      });
    }

    // Pay cycle filter
    if (payCycleFilter.length > 0) {
      conditions.push({ payrollCycle: { name: { _in: payCycleFilter } } });
    }

    // Date type filter
    if (dateTypeFilter.length > 0) {
      conditions.push({ payrollDateType: { name: { _in: dateTypeFilter } } });
    }

    return conditions.length > 0 ? { _and: conditions } : {};
  }, [searchTerm, statusFilter, clientFilter, consultantFilter, payCycleFilter, dateTypeFilter]);

  // Build GraphQL orderBy for server-side sorting (memoized)
  const orderByConditions = useMemo(() => {
    const sortMap: Record<string, string> = {
      name: "name",
      client: "client.name",
      consultant: "primaryConsultant.name",
      employees: "employeeCount",
      lastUpdated: "updatedAt",
      status: "status"
    };

    const field = sortMap[sortField] || "updatedAt";
    return [{ [field]: sortDirection }];
  }, [sortField, sortDirection]);

  // Calculate pagination offset
  const offset = (currentPage - 1) * pageSize;

  const { data, loading, error, refetch } = useQuery(GetPayrollsPaginatedDocument, {
    variables: {
      limit: pageSize,
      offset: offset,
      where: whereConditions,
      orderBy: orderByConditions
    },
    errorPolicy: "all",
    fetchPolicy: "cache-and-network"
  });

  const payrolls = data?.payrolls || [];
  const totalCount = data?.payrollsAggregate?.aggregate?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Debug: Log payroll data to see what we're getting
  console.log("Payrolls data (server-side filtered):", {
    loading,
    error,
    payrollsCount: payrolls.length,
    totalCount,
    currentPage,
    totalPages,
    filterConditions: whereConditions,
    orderBy: orderByConditions
  });

  // Remove problematic useEffect that could cause infinite re-renders

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

  if (error && !payrolls.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-8 h-8 mx-auto text-destructive" />
          <p className="text-destructive">
            Error loading payrolls: {error.message}
          </p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Transform payroll data using useMemo to prevent infinite re-renders
  const displayPayrolls = useMemo(() => {
    const getNextEftDate = (payrollDates: any[]) => {
      if (!payrollDates || payrollDates.length === 0) return null;
      
      const today = new Date();
      const futureDates = payrollDates
        .filter(date => date.adjustedEftDate && new Date(date.adjustedEftDate) >= today)
        .sort((a, b) => new Date(a.adjustedEftDate).getTime() - new Date(b.adjustedEftDate).getTime());

      return futureDates.length > 0 ? futureDates[0].adjustedEftDate : null;
    };

    return payrolls.map((payroll: any) => {
      const employeeCount = payroll.employeeCount || 0;
      return {
        ...payroll,
        employeeCount,
        payrollCycleFormatted: formatPayrollCycle(payroll),
        priority: employeeCount > 50 ? "high" : employeeCount > 20 ? "medium" : "low",
        progress: getStatusConfig(payroll.status || "Implementation").progress,
        nextEftDate: getNextEftDate(payroll.payrollDates),
        lastUpdated: new Date(payroll.updatedAt || payroll.createdAt),
        lastUpdatedBy: payroll.backupConsultant?.name || "System",
      };
    });
  }, [payrolls]);

  // Get unique values for filters using useMemo
  const { uniqueStatuses, uniqueClients, uniqueConsultants, uniquePayCycles, uniqueDateTypes } = useMemo(() => {
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
        new Set(payrolls.map((p: any) => p.payrollDateType?.name).filter(Boolean))
      ) as string[]
    };
  }, [payrolls]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter.length, clientFilter.length, consultantFilter.length, payCycleFilter.length, dateTypeFilter.length]);

  // Handle selection (memoized callbacks)
  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedPayrolls(displayPayrolls.map((p: any) => p.id));
    } else {
      setSelectedPayrolls([]);
    }
  }, [displayPayrolls]);

  const handleSelectPayroll = useCallback((payrollId: string, checked: boolean) => {
    if (checked) {
      setSelectedPayrolls(prev => [...prev, payrollId]);
    } else {
      setSelectedPayrolls(prev => prev.filter(id => id !== payrollId));
    }
  }, []);

  // Handle sorting (server-side) - memoized callback
  const handleSort = useCallback((field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "ASC" ? "DESC" : "ASC");
    } else {
      setSortField(field);
      setSortDirection("ASC");
    }
    // Reset to first page when sorting changes
    setCurrentPage(1);
  }, [sortField]);

  // Handle pagination - memoized callbacks
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when page size changes
  }, []);

  // Handle column visibility
  const toggleColumnVisibility = (columnKey: string) => {
    setVisibleColumns(prev =>
      prev.includes(columnKey)
        ? prev.filter(key => key !== columnKey)
        : [...prev, columnKey]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-destructive";
      case "medium":
        return "text-amber-600";
      case "low":
        return "text-emerald-600";
      default:
        return "text-gray-500";
    }
  };

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

  // Calculate summary statistics using useMemo
  const payrollsList = data?.payrolls || [];
  const { activePayrolls, totalEmployees, totalClients, pendingPayrolls } = useMemo(() => {
    return {
      activePayrolls: payrollsList.filter((p: any) => p.status === "Active").length,
      totalEmployees: payrollsList.reduce((sum: number, p: any) => sum + (p.employeeCount || 0), 0),
      totalClients: new Set(payrollsList.map((p: any) => p.client?.id).filter(Boolean)).size,
      pendingPayrolls: payrollsList.filter((p: any) => ["Implementation"].includes(p.status || "Implementation")).length
    };
  }, [payrollsList]);

  // Helper functions for views
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

  // Render card view
  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {payrollsList.map((payroll: any) => {
        const statusConfig = getStatusConfig(
          payroll.status || "Implementation"
        );
        const StatusIcon = statusConfig.icon;

        return (
          <Card
            key={payroll.id}
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{payroll.name}</CardTitle>
                <Badge
                  className={getStatusColor(payroll.status || "Implementation")}
                >
                  {payroll.status || "Implementation"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    {payroll.client?.name || "No client"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    {payroll.employeeCount || 0} employees
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <Link href={`/payrolls/${payroll.id}`}>
                  <Button variant="outline" size="sm">
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
                    <DropdownMenuItem>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
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
  );

  // Render list view
  const renderListView = () => (
    <div className="space-y-3">
      {payrollsList.map((payroll: any) => {
        const statusConfig = getStatusConfig(
          payroll.status || "Implementation"
        );
        const StatusIcon = statusConfig.icon;

        return (
          <Card
            key={payroll.id}
            className="hover:shadow-md transition-shadow duration-200"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {payroll.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {payroll.client?.name || "No client assigned"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right text-sm">
                    <p className="font-medium text-gray-900">
                      {payroll.employeeCount || 0} employees
                    </p>
                    <p className="text-gray-500">{payroll.payrollCycle}</p>
                  </div>

                  <Badge
                    className={getStatusColor(
                      payroll.status || "Implementation"
                    )}
                  >
                    {payroll.status || "Implementation"}
                  </Badge>

                  <Link href={`/payrolls/${payroll.id}`}>
                    <Button variant="outline" size="sm">
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
                      <DropdownMenuItem>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
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
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const renderSortableHeader = (label: string, field: string) => {
    const column = COLUMN_DEFINITIONS.find(col => col.key === field);
    if (!column?.sortable) {
      return label;
    }

    return (
      <Button
        variant="ghost"
        onClick={() => handleSort(field)}
        className="h-auto p-0 font-medium hover:bg-transparent"
      >
        <span>{label}</span>
        {sortField === field &&
          (sortDirection === "ASC" ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-1 h-4 w-4" />
          ))}
      </Button>
    );
  };

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
            {(hasAdminAccess || canManagePayrolls || canViewAdvanced) && (
              <Link href="/payrolls/new">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Payroll
                </Button>
              </Link>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Payrolls
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {payrollsList.length}
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

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pending Payrolls
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pendingPayrolls}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search payrolls, clients, consultants..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 w-[300px]"
                  />
                </div>

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
                    <SelectItem value="nextEftDate-ASC">
                      Next EFT Date ↑
                    </SelectItem>
                    <SelectItem value="nextEftDate-DESC">
                      Next EFT Date ↓
                    </SelectItem>
                    <SelectItem value="name-ASC">Name A-Z</SelectItem>
                    <SelectItem value="name-DESC">Name Z-A</SelectItem>
                    <SelectItem value="client-ASC">Client A-Z</SelectItem>
                    <SelectItem value="client-DESC">Client Z-A</SelectItem>
                    <SelectItem value="status-ASC">Status A-Z</SelectItem>
                    <SelectItem value="status-DESC">Status Z-A</SelectItem>
                    <SelectItem value="employees-ASC">Employees ↑</SelectItem>
                    <SelectItem value="employees-DESC">Employees ↓</SelectItem>
                    <SelectItem value="lastUpdated-ASC">
                      Last Updated ↑
                    </SelectItem>
                    <SelectItem value="lastUpdated-DESC">
                      Last Updated ↓
                    </SelectItem>
                    <SelectItem value="payrollCycle-ASC">
                      Pay Cycle A-Z
                    </SelectItem>
                    <SelectItem value="payrollCycle-DESC">
                      Pay Cycle Z-A
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

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

                {viewMode === "table" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Columns className="w-4 h-4 mr-2" />
                        Columns
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {COLUMN_DEFINITIONS.map(column => (
                        <DropdownMenuCheckboxItem
                          key={column.key}
                          checked={visibleColumns.includes(column.key)}
                          onCheckedChange={() =>
                            toggleColumnVisibility(column.key)
                          }
                        >
                          {column.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 pt-4 border-t mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Status
                  </label>
                  <MultiSelect
                    options={uniqueStatuses.map((status: string) => ({
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
                    options={uniqueClients.map((client: any) => ({
                      value: client.id as string,
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
                    options={uniqueConsultants.map((consultant: any) => ({
                      value: consultant.id as string,
                      label: consultant.name,
                    }))}
                    selected={consultantFilter}
                    onSelectionChange={setConsultantFilter}
                    placeholder="All consultants"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Pay Cycle
                  </label>
                  <MultiSelect
                    options={uniquePayCycles.map((cycle: string) => ({
                      value: cycle,
                      label:
                        cycle.charAt(0).toUpperCase() +
                        cycle.slice(1).replace("_", " "),
                    }))}
                    selected={payCycleFilter}
                    onSelectionChange={setPayCycleFilter}
                    placeholder="All cycles"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Date Type
                  </label>
                  <MultiSelect
                    options={uniqueDateTypes.map((type: string) => ({
                      value: type,
                      label: type.toUpperCase().replace("_", " "),
                    }))}
                    selected={dateTypeFilter}
                    onSelectionChange={setDateTypeFilter}
                    placeholder="All types"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedPayrolls.length > 0 && viewMode === "table" && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {selectedPayrolls.length} payroll
                    {selectedPayrolls.length > 1 ? "s" : ""} selected
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export Selected
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Bulk Update
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPayrolls([])}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear Selection
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {loading && !payrolls.length ? (
          <Card>
            <CardContent className="p-12">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            </CardContent>
          </Card>
        ) : payrollsList.length === 0 ? (
          <Card>
            <CardContent className="p-12">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || hasActiveFilters
                    ? "No payrolls found"
                    : "No payrolls yet"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || hasActiveFilters
                    ? "Try adjusting your search criteria or filters"
                    : "Get started by adding your first payroll"}
                </p>
                {(hasAdminAccess || canManagePayrolls || canViewAdvanced) &&
                  !searchTerm &&
                  !hasActiveFilters && (
                    <Link href="/payrolls/new">
                      <Button>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add First Payroll
                      </Button>
                    </Link>
                  )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div>
            {viewMode === "table" && (
              <PayrollsTable
                payrolls={payrollsList}
                loading={!!loading}
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

            {viewMode === "cards" && renderCardView()}

            {viewMode === "list" && renderListView()}
          </div>
        )}
      </div>
    </>
  );
}
