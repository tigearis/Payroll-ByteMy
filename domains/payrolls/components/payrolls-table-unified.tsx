"use client";

import {
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Copy,
  UserCheck,
  Calculator,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";

import {
  UnifiedDataTable,
  DataTableColumn,
  DataTableAction,
  StatusConfig,
  createCellRenderers,
} from "@/components/ui/unified-data-table";

// Payroll data type (based on existing payroll structure)
interface Payroll {
  id: string;
  name: string;
  status: string;
  client?: {
    id: string;
    name: string;
  };
  primary_consultant_user?: {
    id: string;
    name: string;
    email?: string;
  };
  manager_user?: {
    id: string;
    name: string;
    email?: string;
  };
  employee_count?: number;
  processing_days_before_eft?: number;
  payroll_system?: string;
  updated_at: string;
  go_live_date?: string;
}

interface PayrollsTableProps {
  payrolls: Payroll[];
  loading?: boolean;
  onRefresh?: () => void;
  selectedPayrolls?: string[];
  onSelectPayroll?: (payrollId: string, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  visibleColumns?: string[];
  sortField?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (field: string) => void;
}

// Status configuration for payrolls (updated to match database enum values)
const payrollStatusConfig: Record<string, StatusConfig> = {
  // Original database values
  Active: {
    variant: "default",
    icon: CheckCircle,
    className: "bg-green-50 text-green-700 border-green-200",
  },
  Implementation: {
    variant: "secondary",
    icon: Clock,
    className: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  Inactive: {
    variant: "outline",
    icon: Clock,
    className: "bg-gray-50 text-gray-700 border-gray-200",
  },

  // New workflow values
  draft: {
    variant: "secondary",
    icon: Clock,
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  pending_approval: {
    variant: "secondary",
    icon: AlertTriangle,
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },
  approved: {
    variant: "default",
    icon: CheckCircle,
    className: "bg-green-50 text-green-700 border-green-200",
  },
  processing: {
    variant: "default",
    icon: Clock,
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },
  completed: {
    variant: "default",
    icon: CheckCircle,
    className: "bg-green-50 text-green-700 border-green-200",
  },
  failed: {
    variant: "destructive",
    icon: AlertTriangle,
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

export function PayrollsTableUnified({
  payrolls,
  loading = false,
  onRefresh,
  selectedPayrolls = [],
  onSelectPayroll,
  onSelectAll,
  visibleColumns,
  sortField,
  sortDirection,
  onSort,
}: PayrollsTableProps) {
  // Create cell renderers with status config
  const cellRenderers = createCellRenderers<Payroll>(payrollStatusConfig);

  // Column definitions
  const columns: DataTableColumn<Payroll>[] = [
    {
      key: "name",
      label: "Payroll Name",
      sortable: true,
      defaultVisible: true,
      cellRenderer: (value, row) => (
        <Link
          href={`/payrolls/${row.id}`}
          className="font-medium text-blue-600 hover:underline"
        >
          {value}
        </Link>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      defaultVisible: true,
      cellRenderer: value => cellRenderers.badge(value),
    },
    {
      key: "client",
      label: "Client",
      sortable: true,
      defaultVisible: true,
      cellRenderer: client => client?.name || "—",
    },
    {
      key: "primary_consultant_user",
      label: "Primary Consultant",
      sortable: false,
      defaultVisible: true,
      cellRenderer: consultant =>
        consultant
          ? cellRenderers.avatar({
              name: consultant.name,
              email: consultant.email,
            })
          : "—",
    },
    {
      key: "manager_user",
      label: "Manager",
      sortable: false,
      defaultVisible: true,
      cellRenderer: manager =>
        manager
          ? cellRenderers.avatar({
              name: manager.name,
              email: manager.email,
            })
          : "—",
    },
    {
      key: "employee_count",
      label: "Employees",
      sortable: true,
      defaultVisible: true,
      align: "center",
      cellRenderer: count =>
        count ? cellRenderers.count(count, "employee") : "—",
    },
    {
      key: "processing_days_before_eft",
      label: "Processing Days",
      sortable: true,
      defaultVisible: false,
      align: "center",
      cellRenderer: days => (days ? cellRenderers.count(days, "day") : "—"),
    },
    {
      key: "payroll_system",
      label: "System",
      sortable: true,
      defaultVisible: false,
      cellRenderer: system =>
        cellRenderers.iconText(system || "Not Set", Calculator),
    },
    {
      key: "go_live_date",
      label: "Go Live Date",
      sortable: true,
      defaultVisible: false,
      cellRenderer: date => (date ? cellRenderers.simpleDate(date) : "—"),
    },
    {
      key: "updated_at",
      label: "Last Updated",
      sortable: true,
      defaultVisible: true,
      cellRenderer: date => cellRenderers.date(date),
    },
  ];

  // Action definitions
  const actions: DataTableAction<Payroll>[] = [
    {
      label: "View Details",
      icon: Eye,
      onClick: payroll => {
        window.location.href = `/payrolls/${payroll.id}`;
      },
    },
    {
      label: "Edit Payroll",
      icon: Edit,
      onClick: payroll => {
        // Handle edit action
        console.log("Edit payroll:", payroll.id);
      },
    },
    {
      label: "View Dates",
      icon: CalendarDays,
      onClick: payroll => {
        window.location.href = `/payroll-dates/${payroll.id}`;
      },
    },
    {
      label: "Assign Consultant",
      icon: UserCheck,
      onClick: payroll => {
        // Handle assign consultant
        console.log("Assign consultant to:", payroll.id);
      },
      separator: true,
    },
    {
      label: "Duplicate Payroll",
      icon: Copy,
      onClick: payroll => {
        // Handle duplicate
        console.log("Duplicate payroll:", payroll.id);
      },
    },
  ];

  return (
    <UnifiedDataTable
      data={payrolls}
      columns={columns}
      loading={loading}
      emptyMessage="No payrolls found. Create your first payroll to get started."
      selectable={true}
      selectedItems={selectedPayrolls}
      onSelectItem={onSelectPayroll || (() => {})}
      onSelectAll={onSelectAll || (() => {})}
      sortField={sortField || ""}
      sortDirection={sortDirection || "asc"}
      onSort={onSort || (() => {})}
      visibleColumns={visibleColumns || []}
      actions={actions}
      statusConfig={payrollStatusConfig}
      title="Payrolls"
      onRefresh={onRefresh || (() => {})}
      getRowId={payroll => payroll.id}
      getRowLink={payroll => `/payrolls/${payroll.id}`}
    />
  );
}

export default PayrollsTableUnified;
