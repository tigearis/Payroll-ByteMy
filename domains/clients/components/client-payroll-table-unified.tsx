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
import {
  UnifiedDataTable,
  DataTableColumn,
  DataTableAction,
  StatusConfig,
  createCellRenderers,
} from "@/components/ui/unified-data-table";
import { PayrollWithCycle } from "@/types";
import { getScheduleSummary } from "@/domains/payrolls/utils/schedule-helpers";

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
  payrolls: PayrollWithCycle[];
  loading?: boolean;
  onRefresh?: () => void;
  clientId?: string;
}

// Status configuration for payrolls
const payrollStatusConfig: Record<string, StatusConfig> = {
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
  // Create cell renderers with status config
  const cellRenderers = createCellRenderers<ClientPayroll>(payrollStatusConfig);

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
  const columns: DataTableColumn<ClientPayroll>[] = [
    {
      key: "name",
      label: "Payroll Name",
      sortable: true,
      defaultVisible: true,
      cellRenderer: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">{formatName(value)}</div>
            <div className="text-sm text-gray-500">
              {row.employee_count ? `${row.employee_count} employees` : "No employees"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      defaultVisible: true,
      cellRenderer: cellRenderers.status,
    },
    {
      key: "payrollCycle",
      label: "Schedule",
      sortable: false,
      defaultVisible: true,
      cellRenderer: (value, row) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-sm">{getScheduleSummary(row)}</span>
        </div>
      ),
    },
    {
      key: "primary_consultant",
      label: "Consultant",
      sortable: false,
      defaultVisible: true,
      cellRenderer: (value, row) => (
        <div className="text-sm">
          {row.primary_consultant ? (
            <>
              <div className="font-medium">{row.primary_consultant.name}</div>
              <div className="text-gray-500">{row.primary_consultant.email}</div>
            </>
          ) : (
            <span className="text-gray-400">Unassigned</span>
          )}
        </div>
      ),
    },
    {
      key: "go_live_date",
      label: "Go Live Date",
      sortable: true,
      defaultVisible: true,
      cellRenderer: (value) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm">
            {value ? formatDate(value) : "Not set"}
          </span>
        </div>
      ),
    },
    {
      key: "updated_at",
      label: "Last Updated",
      sortable: true,
      defaultVisible: false,
      cellRenderer: (value) => (
        <span className="text-sm text-gray-500">
          {formatDate(value)}
        </span>
      ),
    },
  ];

  // Action definitions
  const actions: DataTableAction<ClientPayroll>[] = [
    {
      label: "View Details",
      icon: Eye,
      href: (row) => `/payrolls/${row.id}`,
      variant: "default",
    },
  ];

  return (
    <UnifiedDataTable<ClientPayroll>
      data={payrolls}
      columns={columns}
      actions={actions}
      loading={loading}
      onRefresh={onRefresh}
      searchable={true}
      filterable={true}
      exportable={true}
      selectable={false}
      pagination={{
        enabled: true,
        pageSize: 10,
        showSizeSelector: true,
      }}
      emptyState={{
        title: "No payrolls found",
        description: "This client doesn't have any payrolls yet.",
        action: clientId ? {
          label: "Create Payroll",
          href: `/payrolls/new?clientId=${clientId}`,
        } : undefined,
      }}
    />
  );
}