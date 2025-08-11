"use client";

import {
  Calendar,
  Clock,
  Eye,
  Settings,
  FileText,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import {
  ModernDataTable,
  type ColumnDef,
  type RowAction,
} from "@/components/data/modern-data-table";
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
}: ClientPayrollsTableProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const columns: ColumnDef<PayrollWithCycle & { updated_at?: string }>[] = [
    {
      id: "name",
      key: "name",
      label: "Payroll Name",
      essential: true,
      sortable: true,
    },
    {
      id: "status",
      key: "status",
      label: "Status",
      essential: true,
      sortable: true,
    },
    {
      id: "payrollCycle",
      key: "payrollCycle" as any,
      label: "Schedule",
      render: (_v, r) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-sm">{getScheduleSummary(r)}</span>
        </div>
      ),
    },
    {
      id: "primaryConsultant",
      key: "primaryConsultant" as any,
      label: "Consultant",
      render: (_v, row) => (
        <div className="text-sm">
          {(row as any).primaryConsultant || (row as any).primary_consultant ? (
            <>
              <div className="font-medium">
                {
                  (
                    (row as any).primaryConsultant ||
                    (row as any).primary_consultant
                  ).name
                }
              </div>
              <div className="text-gray-500">
                {
                  (
                    (row as any).primaryConsultant ||
                    (row as any).primary_consultant
                  ).email
                }
              </div>
            </>
          ) : (
            <span className="text-gray-400">Unassigned</span>
          )}
        </div>
      ),
    },
    {
      id: "goLiveDate",
      key: "goLiveDate" as any,
      label: "Go Live Date",
      sortable: true,
      render: value => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm">
            {value ? new Date(value).toLocaleDateString() : "Not set"}
          </span>
        </div>
      ),
    },
    {
      id: "updated_at",
      key: "updated_at" as any,
      label: "Last Updated",
      sortable: true,
      render: value => (
        <span className="text-sm text-gray-500">
          {value ? new Date(value).toLocaleDateString() : "—"}
        </span>
      ),
    },
  ];

  const actions: RowAction<PayrollWithCycle & { updated_at?: string }>[] = [
    {
      id: "view",
      label: "View Details",
      icon: Eye,
      onClick: row => (window.location.href = `/payrolls/${row.id}`),
    },
  ];

  const pageCount = Math.ceil(payrolls.length / pageSize);
  const paginatedData = payrolls.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  return (
    <ModernDataTable<PayrollWithCycle & { updated_at?: string }>
      data={paginatedData}
      columns={columns}
      loading={!!loading}
      searchable
      searchPlaceholder="Search payrolls..."
      rowActions={actions}
      pageSize={pageSize}
      className="client-payrolls-table-unified"
    />
  );
}
