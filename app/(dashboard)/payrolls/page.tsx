// app/(dashboard)/payrolls/page.tsx - UPDATED VERSION
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import {
  PlusCircle,
  Search,
  Filter,
  MoreHorizontal,
  Download,
  Upload,
  Clock,
  Users,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Copy,
  UserCheck,
  Building2,
  RefreshCw,
  FileText,
  Calculator,
  X,
  ChevronUp,
  ChevronDown,
  Columns,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  GET_PAYROLLS,
  GET_PAYROLLS_FALLBACK,
} from "@/graphql/queries/payrolls/getPayrolls";
import { toast } from "sonner";
import { useUserRole } from "@/hooks/useUserRole";
import { PayrollsMissingDates } from "@/components/payrolls-missing-dates";

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
  { key: "progress", label: "Progress", sortable: true, defaultVisible: true },
];

// Payroll status configuration
const getStatusConfig = (status: string) => {
  const configs = {
    Implementation: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Clock,
      progress: 15,
    },
    Active: {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
      progress: 100,
    },
    Inactive: {
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: AlertTriangle,
      progress: 0,
    },
    draft: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: FileText,
      progress: 10,
    },
    "data-entry": {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Calculator,
      progress: 30,
    },
    review: {
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: Eye,
      progress: 50,
    },
    processing: {
      color: "bg-indigo-100 text-indigo-800 border-indigo-200",
      icon: RefreshCw,
      progress: 70,
    },
    "manager-review": {
      color: "bg-orange-100 text-orange-800 border-orange-200",
      icon: UserCheck,
      progress: 85,
    },
    approved: {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
      progress: 95,
    },
    submitted: {
      color: "bg-teal-100 text-teal-800 border-teal-200",
      icon: Upload,
      progress: 100,
    },
    paid: {
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: CheckCircle,
      progress: 100,
    },
    "on-hold": {
      color: "bg-amber-100 text-amber-800 border-amber-200",
      icon: AlertTriangle,
      progress: 60,
    },
    cancelled: {
      color: "bg-red-100 text-red-800 border-red-200",
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
  if (!date) return "Not set";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date: string | Date) => {
  if (!date) return "Not set";
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

  if (!cycleName) return "Not configured";

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
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
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

export default function PayrollsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [consultantFilter, setConsultantFilter] = useState("all");
  const [selectedPayrolls, setSelectedPayrolls] = useState<string[]>([]);
  const [activeView, setActiveView] = useState("list");
  const [showFilters, setShowFilters] = useState(false);

  // Sorting state
  const [sortField, setSortField] = useState<string>("name");
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

  if (roleLoading) return null;

  if (finalLoading && !payrolls.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600">Loading payrolls...</p>
        </div>
      </div>
    );
  }

  if (finalError && !payrolls.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-8 h-8 mx-auto text-red-600" />
          <p className="text-red-600">
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

    return {
      ...payroll,
      employeeCount,
      payrollCycle: formatPayrollCycle(payroll),
      priority:
        employeeCount > 50 ? "high" : employeeCount > 20 ? "medium" : "low",
      progress: getStatusConfig(payroll.status || "Implementation").progress,
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
      statusFilter === "all" || payroll.status === statusFilter;

    const matchesClient =
      clientFilter === "all" || payroll.client?.id === clientFilter;

    const matchesConsultant =
      consultantFilter === "all" ||
      payroll.userByPrimaryConsultantUserId?.id === consultantFilter;

    return matchesSearch && matchesStatus && matchesClient && matchesConsultant;
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
        return "text-red-600";
      case "medium":
        return "text-orange-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setClientFilter("all");
    setConsultantFilter("all");
  };

  const hasActiveFilters =
    searchTerm ||
    statusFilter !== "all" ||
    clientFilter !== "all" ||
    consultantFilter !== "all";

  const renderSortableHeader = (label: string, field: string) => {
    const column = COLUMN_DEFINITIONS.find((col) => col.key === field);
    if (!column?.sortable) return label;

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
      {/* Enhanced Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payrolls</h2>
          <p className="text-muted-foreground">
            Manage payrolls for your clients ({sortedPayrolls.length} of{" "}
            {payrolls.length})
          </p>
        </div>
        <div className="flex gap-2">
          {(isAdmin || isDeveloper) && <PayrollsMissingDates />}
          {(isAdmin || isManager || isDeveloper) && (
            <Button asChild>
              <Link href="/payrolls/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Payroll
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search payrolls, clients, consultants, or cycles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-blue-50" : ""}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {
                      [
                        searchTerm,
                        statusFilter !== "all",
                        clientFilter !== "all",
                        consultantFilter !== "all",
                      ].filter(Boolean).length
                    }
                  </Badge>
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Columns className="w-4 h-4 mr-2" />
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {COLUMN_DEFINITIONS.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.key}
                      checked={visibleColumns.includes(column.key)}
                      onCheckedChange={() => toggleColumnVisibility(column.key)}
                    >
                      {column.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            {/* Filter Dropdowns */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Status
                  </label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {uniqueStatuses.map((status: string) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Client
                  </label>
                  <Select value={clientFilter} onValueChange={setClientFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All clients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Clients</SelectItem>
                      {uniqueClients.map((client: any) => (
                        <SelectItem key={client.id} value={client.id as string}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Consultant
                  </label>
                  <Select
                    value={consultantFilter}
                    onValueChange={setConsultantFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All consultants" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Consultants</SelectItem>
                      {uniqueConsultants.map((consultant: any) => (
                        <SelectItem
                          key={consultant.id}
                          value={consultant.id as string}
                        >
                          {consultant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedPayrolls.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
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
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payrolls Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Payrolls</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => finalRefetch()}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedPayrolls.length === sortedPayrolls.length &&
                        sortedPayrolls.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  {visibleColumns.includes("name") && (
                    <TableHead>
                      {renderSortableHeader("Payroll", "name")}
                    </TableHead>
                  )}
                  {visibleColumns.includes("client") && (
                    <TableHead>
                      {renderSortableHeader("Client", "client")}
                    </TableHead>
                  )}
                  {visibleColumns.includes("payrollCycle") && (
                    <TableHead>
                      {renderSortableHeader("Payroll Schedule", "payrollCycle")}
                    </TableHead>
                  )}
                  {visibleColumns.includes("status") && (
                    <TableHead>
                      {renderSortableHeader("Status", "status")}
                    </TableHead>
                  )}
                  {visibleColumns.includes("consultant") && (
                    <TableHead>
                      {renderSortableHeader("Consultant", "consultant")}
                    </TableHead>
                  )}
                  {visibleColumns.includes("employees") && (
                    <TableHead>
                      {renderSortableHeader("Employees", "employees")}
                    </TableHead>
                  )}
                  {visibleColumns.includes("lastUpdated") && (
                    <TableHead>
                      {renderSortableHeader("Last Updated", "lastUpdated")}
                    </TableHead>
                  )}
                  {visibleColumns.includes("progress") && (
                    <TableHead>
                      {renderSortableHeader("Progress", "progress")}
                    </TableHead>
                  )}
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPayrolls.map((payroll: any) => {
                  const statusConfig = getStatusConfig(
                    payroll.status || "Implementation"
                  );
                  const StatusIcon = statusConfig.icon;

                  return (
                    <TableRow key={payroll.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Checkbox
                          checked={selectedPayrolls.includes(payroll.id)}
                          onCheckedChange={(checked) =>
                            handleSelectPayroll(payroll.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      {visibleColumns.includes("name") && (
                        <TableCell>
                          <div>
                            <Link
                              href={`/payrolls/${payroll.id}`}
                              className="font-medium text-blue-600 hover:underline"
                            >
                              {payroll.name}
                            </Link>
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.includes("client") && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span>{payroll.client?.name || "No client"}</span>
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.includes("payrollCycle") && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">
                              {payroll.payrollCycle}
                            </span>
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.includes("status") && (
                        <TableCell>
                          <Badge className={statusConfig.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {payroll.status || "Implementation"}
                          </Badge>
                        </TableCell>
                      )}
                      {visibleColumns.includes("consultant") && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <UserCheck className="w-4 h-4 text-gray-400" />
                            <span>
                              {payroll.userByPrimaryConsultantUserId?.name ||
                                "Unassigned"}
                            </span>
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.includes("employees") && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span
                              className={getPriorityColor(payroll.priority)}
                            >
                              {payroll.employeeCount}
                            </span>
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.includes("lastUpdated") && (
                        <TableCell>
                          <div className="text-sm">
                            <div>{formatDate(payroll.lastUpdated)}</div>
                            <div className="text-gray-500 text-xs">
                              by {payroll.lastUpdatedBy}
                            </div>
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.includes("progress") && (
                        <TableCell>
                          <div className="w-full max-w-[100px]">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span>{payroll.progress}%</span>
                            </div>
                            <Progress
                              value={payroll.progress}
                              className="h-2"
                            />
                          </div>
                        </TableCell>
                      )}
                      <TableCell>
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
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {sortedPayrolls.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No payrolls found
                </h3>
                <p className="text-gray-500 mb-4">
                  {hasActiveFilters
                    ? "Try adjusting your search or filters"
                    : "Get started by creating your first payroll"}
                </p>
                {!hasActiveFilters && (isAdmin || isManager || isDeveloper) && (
                  <Button asChild>
                    <Link href="/payrolls/new">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Create Payroll
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
