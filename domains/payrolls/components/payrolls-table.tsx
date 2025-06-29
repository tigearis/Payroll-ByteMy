"use client";

import { PermissionGuard } from "@/components/auth/permission-guard";
import { useEnhancedPermissions } from "@/lib/auth/enhanced-auth-context";
import {
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
  ChevronUp,
  ChevronDown,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Payroll cycle constants for formatting display names
const PAYROLL_CYCLES = [
  { id: "weekly", name: "Weekly" },
  { id: "fortnightly", name: "Fortnightly" },
  { id: "bi_monthly", name: "Bi-Monthly" },
  { id: "monthly", name: "Monthly" },
  { id: "quarterly", name: "Quarterly" },
  { id: "annually", name: "Annually" },
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

// Format payroll cycle for display
const formatPayrollCycle = (payroll: any) => {
  // Check if we have a formatted version already
  if (payroll.payrollCycleFormatted) {
    return payroll.payrollCycleFormatted;
  }

  // Get the cycle name from the relationship
  const cycleEnum = payroll?.payrollCycle?.name;
  if (cycleEnum) {
    const cycle = PAYROLL_CYCLES.find(c => c.id === cycleEnum);
    return cycle ? cycle.name : cycleEnum;
  }

  // Fallback to cycleId if available
  if (payroll?.cycleId) {
    const cycle = PAYROLL_CYCLES.find(c => c.id === payroll.cycleId);
    return cycle ? cycle.name : `${payroll.cycleId} (Unknown)`;
  }

  return "Not configured";
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

// Column definitions
const COLUMN_DEFINITIONS = [
  { key: "name", label: "Payroll", sortable: true, defaultVisible: true },
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

interface PayrollsTableProps {
  payrolls: any[];
  loading?: boolean;
  onRefresh?: () => void;
  selectedPayrolls?: string[];
  onSelectPayroll?: (payrollId: string, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  visibleColumns?: string[];
  sortField?: string;
  sortDirection?: "ASC" | "DESC";
  onSort?: (field: string) => void;
}

export function PayrollsTable({
  payrolls,
  loading = false,
  onRefresh,
  selectedPayrolls = [],
  onSelectPayroll,
  onSelectAll,
  visibleColumns = COLUMN_DEFINITIONS.filter(col => col.defaultVisible).map(
    col => col.key
  ),
  sortField = "name",
  sortDirection = "ASC",
  onSort,
}: PayrollsTableProps) {
  const { hasPermission } = useEnhancedPermissions();
  
  if (!hasPermission('payroll:read')) {
    return null;
  }
  const renderSortableHeader = (label: string, field: string) => {
    const column = COLUMN_DEFINITIONS.find(col => col.key === field);
    if (!column?.sortable || !onSort) {
      return label;
    }

    const isSorted = sortField === field;

    return (
      <Button
        variant="ghost"
        className="h-auto p-0 font-medium hover:bg-transparent"
        onClick={() => onSort(field)}
      >
        <span>{label}</span>
        {isSorted && (
          <div className="ml-1">
            {sortDirection === "ASC" ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        )}
      </Button>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Payrolls</span>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {onSelectAll && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedPayrolls.length === payrolls.length &&
                        payrolls.length > 0
                      }
                      onCheckedChange={onSelectAll}
                    />
                  </TableHead>
                )}
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
                {visibleColumns.includes("nextEftDate") && (
                  <TableHead>
                    {renderSortableHeader("Next EFT Date", "nextEftDate")}
                  </TableHead>
                )}
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={visibleColumns.length + 2}
                    className="h-24 text-center"
                  >
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2 text-muted-foreground">
                        Loading payrolls...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : payrolls.length > 0 ? (
                payrolls.map((payroll: any) => {
                  const statusConfig = getStatusConfig(
                    payroll.status || "Implementation"
                  );
                  const StatusIcon = statusConfig.icon;

                  return (
                    <TableRow key={payroll.id} className="hover:bg-muted/50">
                      {onSelectPayroll && (
                        <TableCell>
                          <Checkbox
                            checked={selectedPayrolls.includes(payroll.id)}
                            onCheckedChange={checked =>
                              onSelectPayroll(payroll.id, checked as boolean)
                            }
                          />
                        </TableCell>
                      )}
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
                            <Building2 className="w-4 h-4 text-gray-500" />
                            <span>{payroll.client?.name || "No client"}</span>
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.includes("payrollCycle") && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">
                              {formatPayrollCycle(payroll)}
                            </span>
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.includes("status") && (
                        <TableCell>
                          <Badge
                            className={getStatusColor(
                              payroll.status || "Implementation"
                            )}
                          >
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {payroll.status || "Implementation"}
                          </Badge>
                        </TableCell>
                      )}
                      {visibleColumns.includes("consultant") && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <UserCheck className="w-4 h-4 text-gray-500" />
                            <span>
                              {payroll.primaryConsultant?.name || "Unassigned"}
                            </span>
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.includes("employees") && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-500" />
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
                      {visibleColumns.includes("nextEftDate") && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">
                              {payroll.nextPayrollDate?.[0]?.adjustedEftDate || payroll.nextPayrollDate?.[0]?.originalEftDate
                                ? formatDate(payroll.nextPayrollDate[0]?.adjustedEftDate || payroll.nextPayrollDate[0]?.originalEftDate)
                                : "Not scheduled"}
                            </span>
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
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={visibleColumns.length + 2}
                    className="h-24 text-center"
                  >
                    <div className="text-muted-foreground">
                      No payrolls found with the current filters.
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
