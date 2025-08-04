"use client";

import {
  Calendar,
  Users,
  Clock,
  FileText,
  Eye,
  CheckCircle,
  AlertTriangle,
  Settings,
} from "lucide-react";
import { useState } from "react";
import {
  EnhancedUnifiedTable,
  UnifiedTableColumn,
  UnifiedTableAction,
} from "@/components/ui/enhanced-unified-table";
import { getScheduleSummary } from "@/domains/payrolls/utils/schedule-helpers";
import { PayrollWithCycle } from "@/types";

// Payroll data type for client payrolls
interface ClientPayroll {
  id: string;
  name: string;
  status: string;
  payrollCycle?: {
    id: string;
    name: string;
    cycle_type: string;
    day_of_week?: number;
    day_of_month?: number;
  };
  employee_count?: number;
  go_live_date?: string;
  updated_at: string;
  primary_consultant?: {
    name: string;
    email: string;
  };
}

interface ClientPayrollsTableProps {
  payrolls: (PayrollWithCycle & { updated_at?: string })[];
  loading?: boolean;
  onRefresh?: () => void;
  clientId?: string;
}

// Status configuration for payrolls  
const payrollStatusConfig = {
  Implementation: {
    variant: "secondary",
    icon: Settings,
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  "Data Entry": {
    variant: "secondary", 
    icon: FileText,
    className: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  Review: {
    variant: "secondary",
    icon: Eye,
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },
  Processing: {
    variant: "secondary",
    icon: Clock,
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },
  Active: {
    variant: "default",
    icon: CheckCircle,
    className: "bg-green-50 text-green-700 border-green-200",
  },
  Inactive: {
    variant: "destructive",
    icon: AlertTriangle,
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

export function ClientPayrollsTableUnified({
  payrolls,
  loading = false,
  onRefresh,
  clientId,
}: ClientPayrollsTableProps) {
  // Pagination state
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  
  // Calculate pagination values
  const pageCount = Math.ceil(payrolls.length / pageSize);
  const paginatedData = payrolls.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  // Helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatName = (name?: string) => {
    if (!name) return "N/A";
    return name
      .replace(/_/g, " ")
      .split(" ")
      .map(word => {
        const specialCases = ["DOW", "EOM", "SOM"];
        return specialCases.includes(word.toUpperCase())
          ? word.toUpperCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  };

  const formatDayOfWeek = (dayValue?: number) => {
    if (dayValue === undefined || dayValue === null) return "N/A";
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayValue] || "N/A";
  };

  // Column definitions
  const columns: UnifiedTableColumn<PayrollWithCycle & { updated_at?: string }>[] = [
    {
      accessorKey: "name",
      header: "Payroll Name",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">{formatName(value)}</div>
            <div className="text-sm text-gray-500">
              {row.employeeCount ? `${row.employeeCount} employees` : "No employees"}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      type: "badge",
      sortable: true,
    },
    {
      accessorKey: "payrollCycle",
      header: "Schedule",
      sortable: false,
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-sm">{getScheduleSummary(row)}</span>
        </div>
      ),
    },
    {
      accessorKey: "primaryConsultant" as any,
      header: "Consultant",
      sortable: false,
      render: (value, row) => (
        <div className="text-sm">
          {(row as any).primaryConsultant || (row as any).primary_consultant ? (
            <>
              <div className="font-medium">{((row as any).primaryConsultant || (row as any).primary_consultant).name}</div>
              <div className="text-gray-500">{((row as any).primaryConsultant || (row as any).primary_consultant).email}</div>
            </>
          ) : (
            <span className="text-gray-400">Unassigned</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "goLiveDate" as any,
      header: "Go Live Date",
      type: "date",
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm">
            {value ? formatDate(value) : "Not set"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "updated_at",
      header: "Last Updated",
      type: "date",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-500">
          {formatDate(value)}
        </span>
      ),
    },
  ];

  // Action definitions
  const actions: UnifiedTableAction<PayrollWithCycle & { updated_at?: string }>[] = [
    {
      label: "View Details",
      icon: Eye,
      onClick: (row) => window.location.href = `/payrolls/${row.id}`,
    },
  ];

  return (
    <EnhancedUnifiedTable<PayrollWithCycle & { updated_at?: string }>
      data={paginatedData}
      columns={columns}
      actions={actions}
      loading={loading}
      searchable={true}
      searchPlaceholder="Search payrolls..."
      selectable={false}
      pagination={{
        pageIndex,
        pageSize,
        pageCount,
        canPreviousPage: pageIndex > 0,
        canNextPage: pageIndex < pageCount - 1,
        onPageChange: setPageIndex,
        onPageSizeChange: (size) => {
          setPageSize(size);
          setPageIndex(0); // Reset to first page when changing page size
        },
      }}
    />
  );
}