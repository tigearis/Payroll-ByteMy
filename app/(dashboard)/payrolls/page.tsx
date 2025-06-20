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
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { PayrollsTable } from "@/components/payrolls-table";
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
import { GET_PAYROLLS } from "@/domains/payrolls/graphql/queries.graphql";
import { useUserRole } from "@/hooks/use-user-role";

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
  if (!date) {return "Not set";}
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date: string | Date) => {
  if (!date) {return "Not set";}
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
  const cycleName = payroll.payroll_cycle?.name;
  const dateTypeName = payroll.payroll_date_type?.name;
  const dateValue = payroll.date_value;

  if (!cycleName) {return "Not configured";}

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
  if (j === 1 && k !== 11) {return "st";}
  if (j === 2 && k !== 12) {return "nd";}
  if (j === 3 && k !== 13) {return "rd";}
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
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onSelectionChange(newSelected);
  };

  const selectedLabels = options
    .filter((option) => selected.includes(option.value))
    .map((option) => option.label);

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
          {options.map((option) => (
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

  // Sorting state
  const [sortField, setSortField] = useState<string>("nextEftDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    COLUMN_DEFINITIONS.filter((col) => col.defaultVisible).map((col) => col.key)
  );

  const {
    isAdmin,
    isManager,
    isDeveloper,
    isLoading: roleLoading,
  } = useUserRole();

  const { data, loading, error, refetch } = useQuery(GET_PAYROLLS, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

  // Fallback query if the main query fails
  const {
    data: fallbackData,
    loading: fallbackLoading,
    error: fallbackError,
    refetch: fallbackRefetch,
  } = useQuery(GET_PAYROLLS_FALLBACK, {
    skip: !error, // Only run fallback if main query fails
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

  // Choose which data to use
  const finalData = data || fallbackData;
  const finalLoading = loading || (error && fallbackLoading);
  const finalError = error && fallbackError ? fallbackError : null;
  const finalRefetch = data ? refetch : fallbackRefetch;

  const payrolls = finalData?.payrolls || [];

  useEffect(() => {
    if (roleLoading) {
      const timeout = setTimeout(() => {
        toast.info("Loading payrolls...", {
          duration: 3000,
          closeButton: true,
        });
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [roleLoading]);

  if (roleLoading) {return null;}

  if (finalLoading && !payrolls.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-500">Loading payrolls...</p>
        </div>
      </div>
    );
  }

  if (finalError && !payrolls.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-8 h-8 mx-auto text-destructive" />
          <p className="text-destructive">
            Error loading payrolls: {finalError.message}
          </p>
          <Button onClick={() => finalRefetch()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Transform payroll data
  const transformedPayrolls = payrolls.map((payroll: any) => {
    // Fix employee count - use the employee_count from the payroll directly
    const employeeCount = payroll.employee_count || 0;

    // Get next EFT date from payroll_dates
    const getNextEftDate = (payrollDates: any[]) => {
      if (!payrollDates || payrollDates.length === 0) {return null;}

      const today = new Date();
      const futureDates = payrollDates
        .filter(
          (date) =>
            date.adjusted_eft_date && new Date(date.adjusted_eft_date) >= today
        )
        .sort(
          (a, b) =>
            new Date(a.adjusted_eft_date).getTime() -
            new Date(b.adjusted_eft_date).getTime()
        );

      return futureDates.length > 0 ? futureDates[0].adjusted_eft_date : null;
    };

    return {
      ...payroll,
      employeeCount,
      payrollCycle: formatPayrollCycle(payroll),
      priority:
        employeeCount > 50 ? "high" : employeeCount > 20 ? "medium" : "low",
      progress: getStatusConfig(payroll.status || "Implementation").progress,
      nextEftDate: getNextEftDate(payroll.payroll_dates),
      lastUpdated: new Date(payroll.updated_at || payroll.created_at),
      lastUpdatedBy: payroll.userByPrimaryConsultantUserId?.name || "System",
    };
  });

  // Filter payrolls
  const filteredPayrolls = transformedPayrolls.filter((payroll: any) => {
    const matchesSearch =
      !searchTerm ||
      payroll.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payroll.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payroll.userByPrimaryConsultantUserId?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payroll.payrollCycle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(payroll.status);

    const matchesClient =
      clientFilter.length === 0 || clientFilter.includes(payroll.client?.id);

    const matchesConsultant =
      consultantFilter.length === 0 ||
      consultantFilter.includes(payroll.userByPrimaryConsultantUserId?.id);

    const matchesPayCycle =
      payCycleFilter.length === 0 ||
      payCycleFilter.includes(payroll.payroll_cycle?.name);

    const matchesDateType =
      dateTypeFilter.length === 0 ||
      dateTypeFilter.includes(payroll.payroll_date_type?.name);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesClient &&
      matchesConsultant &&
      matchesPayCycle &&
      matchesDateType
    );
  });

  // Sort payrolls
  const sortedPayrolls = [...filteredPayrolls].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle nested values
    if (sortField === "client") {
      aValue = a.client?.name || "";
      bValue = b.client?.name || "";
    } else if (sortField === "consultant") {
      aValue = a.userByPrimaryConsultantUserId?.name || "";
      bValue = b.userByPrimaryConsultantUserId?.name || "";
    } else if (sortField === "employees") {
      aValue = a.employeeCount;
      bValue = b.employeeCount;
    } else if (sortField === "lastUpdated") {
      aValue = a.lastUpdated;
      bValue = b.lastUpdated;
    } else if (sortField === "nextEftDate") {
      aValue = a.nextEftDate ? new Date(a.nextEftDate) : null;
      bValue = b.nextEftDate ? new Date(b.nextEftDate) : null;
    } else if (sortField === "payrollCycle") {
      aValue = a.payrollCycle;
      bValue = b.payrollCycle;
    }

    // Handle different data types
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return sortDirection === "asc"
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }

    // Handle null dates (put nulls at the end)
    if (sortField === "nextEftDate") {
      if (aValue === null && bValue === null) {return 0;}
      if (aValue === null) {return 1;}
      if (bValue === null) {return -1;}
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === "asc"
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }
    }

    // String comparison
    const aStr = String(aValue || "").toLowerCase();
    const bStr = String(bValue || "").toLowerCase();

    if (sortDirection === "asc") {
      return aStr.localeCompare(bStr);
    } else {
      return bStr.localeCompare(aStr);
    }
  });

  // Get unique values for filters
  const uniqueStatuses = Array.from(
    new Set(payrolls.map((p: any) => p.status || "Implementation"))
  ) as string[];
  const uniqueClients = Array.from(
    new Map(
      payrolls
        .filter((p: any) => p.client?.id)
        .map((p: any) => [p.client.id, p.client])
    ).values()
  ) as any[];
  const uniqueConsultants = Array.from(
    new Map(
      payrolls
        .filter((p: any) => p.userByPrimaryConsultantUserId?.id)
        .map((p: any) => [
          p.userByPrimaryConsultantUserId.id,
          p.userByPrimaryConsultantUserId,
        ])
    ).values()
  ) as any[];
  const uniquePayCycles = Array.from(
    new Set(payrolls.map((p: any) => p.payroll_cycle?.name).filter(Boolean))
  ) as string[];
  const uniqueDateTypes = Array.from(
    new Set(payrolls.map((p: any) => p.payroll_date_type?.name).filter(Boolean))
  ) as string[];

  // Handle selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPayrolls(sortedPayrolls.map((p: any) => p.id));
    } else {
      setSelectedPayrolls([]);
    }
  };

  const handleSelectPayroll = (payrollId: string, checked: boolean) => {
    if (checked) {
      setSelectedPayrolls([...selectedPayrolls, payrollId]);
    } else {
      setSelectedPayrolls(selectedPayrolls.filter((id) => id !== payrollId));
    }
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle column visibility
  const toggleColumnVisibility = (columnKey: string) => {
    setVisibleColumns((prev) =>
      prev.includes(columnKey)
        ? prev.filter((key) => key !== columnKey)
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

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter([]);
    setClientFilter([]);
    setConsultantFilter([]);
    setPayCycleFilter([]);
    setDateTypeFilter([]);
  };

  const hasActiveFilters =
    searchTerm ||
    statusFilter.length > 0 ||
    clientFilter.length > 0 ||
    consultantFilter.length > 0 ||
    payCycleFilter.length > 0 ||
    dateTypeFilter.length > 0;

  // Calculate summary statistics
  const activePayrolls = sortedPayrolls.filter(
    (p: any) => p.status === "Active"
  ).length;
  const totalEmployees = sortedPayrolls.reduce(
    (sum: number, p: any) => sum + (p.employeeCount || 0),
    0
  );
  const totalClients = new Set(
    sortedPayrolls.map((p: any) => p.client?.id).filter(Boolean)
  ).size;
  const pendingPayrolls = sortedPayrolls.filter((p: any) =>
    ["Implementation", "draft", "data-entry", "review", "processing"].includes(
      p.status || "Implementation"
    )
  ).length;

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
      {sortedPayrolls.map((payroll: any) => {
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
      {sortedPayrolls.map((payroll: any) => {
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
    const column = COLUMN_DEFINITIONS.find((col) => col.key === field);
    if (!column?.sortable) {return label;}

    return (
      <Button
        variant="ghost"
        onClick={() => handleSort(field)}
        className="h-auto p-0 font-medium hover:bg-transparent"
      >
        <span>{label}</span>
        {sortField === field &&
          (sortDirection === "asc" ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-1 h-4 w-4" />
          ))}
      </Button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payrolls</h1>
          <p className="text-gray-500">Manage payrolls for your clients</p>
        </div>

        <div className="flex items-center space-x-2">
          {(isAdmin || isManager || isDeveloper) && (
            <Link href="/payrolls/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Payroll
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Payrolls
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {sortedPayrolls.length}
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
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                onValueChange={(value) => {
                  const [field, direction] = value.split("-");
                  setSortField(field);
                  setSortDirection(direction as "asc" | "desc");
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nextEftDate-asc">
                    Next EFT Date ↑
                  </SelectItem>
                  <SelectItem value="nextEftDate-desc">
                    Next EFT Date ↓
                  </SelectItem>
                  <SelectItem value="name-asc">Name A-Z</SelectItem>
                  <SelectItem value="name-desc">Name Z-A</SelectItem>
                  <SelectItem value="client-asc">Client A-Z</SelectItem>
                  <SelectItem value="client-desc">Client Z-A</SelectItem>
                  <SelectItem value="status-asc">Status A-Z</SelectItem>
                  <SelectItem value="status-desc">Status Z-A</SelectItem>
                  <SelectItem value="employees-asc">Employees ↑</SelectItem>
                  <SelectItem value="employees-desc">Employees ↓</SelectItem>
                  <SelectItem value="lastUpdated-asc">
                    Last Updated ↑
                  </SelectItem>
                  <SelectItem value="lastUpdated-desc">
                    Last Updated ↓
                  </SelectItem>
                  <SelectItem value="payrollCycle-asc">
                    Pay Cycle A-Z
                  </SelectItem>
                  <SelectItem value="payrollCycle-desc">
                    Pay Cycle Z-A
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

              {viewMode === "table" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Columns className="w-4 h-4 mr-2" />
                      Columns
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {COLUMN_DEFINITIONS.map((column) => (
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

          {/* Advanced Filter Dropdowns */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 pt-4 border-t mt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
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
                <label className="text-sm font-medium mb-2 block">Client</label>
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

      {/* Bulk Actions */}
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

      {/* Content based on view mode */}
      {finalLoading && !payrolls.length ? (
        <Card>
          <CardContent className="p-12">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
      ) : sortedPayrolls.length === 0 ? (
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
              {(isAdmin || isManager || isDeveloper) &&
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
              payrolls={sortedPayrolls}
              loading={finalLoading}
              onRefresh={finalRefetch}
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
  );
}
