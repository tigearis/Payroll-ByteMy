"use client";

import {
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Copy,
  UserCheck,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ModernDataTable,
  type ColumnDef,
  type RowAction,
} from "@/components/data/modern-data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getScheduleSummary } from "@/domains/payrolls/utils/schedule-helpers";

// Note: Using any[] for payrolls to handle GraphQL data flexibility

interface PayrollsTableProps {
  payrolls: any[]; // More flexible to handle GraphQL data
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

// Helper functions for rendering cells
const renderPayrollStatus = (status: string) => {
  const getStatusVariant = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    if (["active", "completed", "approved"].includes(normalizedStatus))
      return "default";
    if (
      ["draft", "pending_approval", "implementation"].includes(normalizedStatus)
    )
      return "secondary";
    if (["failed", "inactive"].includes(normalizedStatus)) return "destructive";
    return "outline";
  };

  const getStatusIcon = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    if (["active", "completed", "approved"].includes(normalizedStatus))
      return CheckCircle;
    if (["failed"].includes(normalizedStatus)) return AlertTriangle;
    return Clock;
  };

  const StatusIcon = getStatusIcon(status);

  return (
    <Badge
      variant={getStatusVariant(status)}
      className="flex items-center gap-1"
    >
      <StatusIcon className="w-3 h-3" />
      {status}
    </Badge>
  );
};

const renderUserAvatar = (user: {
  imageUrl?: string;
  email?: string;
  computedName?: string;
  firstName?: string;
  lastName?: string;
}) => {
  const displayName =
    user.computedName ||
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    "Unknown User";

  // Generate initials similar to UserNav component
  const getUserInitials = () => {
    if (!displayName || displayName === "Unknown User") {
      return "U";
    }

    const nameParts = displayName.split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    return (
      nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
    ).toUpperCase();
  };

  return (
    <div className="flex items-center space-x-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.imageUrl} alt={displayName} />
        <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
          {getUserInitials()}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="font-medium truncate">{displayName}</div>
        {user.email && (
          <div className="text-sm text-muted-foreground truncate">
            {user.email}
          </div>
        )}
      </div>
    </div>
  );
};

export function PayrollsTableUnified({
  payrolls,
  loading = false,
  onRefresh: _onRefresh,
  selectedPayrolls: _selectedPayrolls = [],
  onSelectPayroll: _onSelectPayroll,
  onSelectAll: _onSelectAll,
  visibleColumns: _visibleColumns,
  sortField: _sortField,
  sortDirection: _sortDirection,
  onSort: _onSort,
}: PayrollsTableProps) {
  const router = useRouter();

  // Column definitions - matching user requirements: Payroll name, status, client name, schedule (formatted), employees, primary consultant
  const columns: ColumnDef<any>[] = [
    {
      id: "name",
      key: "name",
      label: "Payroll Name",
      essential: true,
      sortable: true,
      render: (value, row) => (
        <Link
          href={`/payrolls/${row.id}`}
          className="font-medium text-blue-600 hover:underline"
        >
          {value}
        </Link>
      ),
    },
    {
      id: "status",
      key: "status",
      label: "Status",
      essential: true,
      sortable: true,
      render: value => renderPayrollStatus(value),
    },
    {
      id: "client",
      key: "client" as any,
      label: "Client Name",
      essential: true,
      sortable: true,
      render: client => client?.name || "—",
    },
    {
      id: "payrollSchedule",
      key: "payrollSchedule" as any,
      label: "Schedule",
      essential: false,
      sortable: false,
      render: (_value, row) => {
        // Generate schedule summary from payroll data
        const schedule = getScheduleSummary(row);
        return (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="font-medium">{schedule}</span>
          </div>
        );
      },
    },
    {
      id: "employeeCount",
      key: "employeeCount" as any,
      label: "Employees",
      essential: false,
      sortable: true,
      render: count =>
        count ? (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{count}</span>
            {count === 1 ? "employee" : "employees"}
          </div>
        ) : (
          "—"
        ),
    },
    {
      id: "primaryConsultant",
      key: "primaryConsultant" as any,
      label: "Primary Consultant",
      essential: false,
      sortable: true,
      render: primaryConsultant =>
        primaryConsultant ? renderUserAvatar(primaryConsultant) : "—",
    },
    // Manager column - shows the client's assigned manager or consultant's manager
    {
      id: "manager",
      key: "assignedManager" as any,
      label: "Manager",
      essential: false,
      sortable: true,
      render: (_value, row) => {
        const manager = row.assignedManager;
        return manager ? (
          renderUserAvatar(manager)
        ) : (
          <span className="text-muted-foreground text-sm">
            No manager assigned
          </span>
        );
      },
    },
    {
      id: "processingDaysBeforeEft",
      key: "processingDaysBeforeEft" as any,
      label: "Processing Days",
      essential: false,
      sortable: true,
      render: (days: number) =>
        typeof days === "number" ? (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{days}</span>
            {days === 1 ? "day" : "days"}
          </div>
        ) : (
          "—"
        ),
    },
  ];

  // Action definitions
  const actions: RowAction<any>[] = [
    {
      id: "view",
      label: "View Details",
      icon: Eye,
      onClick: (payroll: any) => {
        router.push(`/payrolls/${payroll.id}`);
      },
    },
    {
      id: "edit",
      label: "Edit Payroll",
      icon: Edit,
      onClick: (payroll: any) => {
        // Handle edit action
        console.log("Edit payroll:", payroll.id);
      },
    },
    {
      id: "dates",
      label: "View Dates",
      icon: CalendarDays,
      onClick: (payroll: any) => {
        router.push(`/payroll-dates/${payroll.id}`);
      },
    },
    {
      id: "assign",
      label: "Assign Consultant",
      icon: UserCheck,
      onClick: (payroll: any) => {
        // Handle assign consultant
        console.log("Assign consultant to:", payroll.id);
      },
    },
    {
      id: "duplicate",
      label: "Duplicate Payroll",
      icon: Copy,
      onClick: (payroll: any) => {
        // Handle duplicate
        console.log("Duplicate payroll:", payroll.id);
      },
    },
  ];

  return (
    <ModernDataTable<any>
      data={payrolls}
      columns={columns}
      loading={loading}
      searchable
      searchPlaceholder="Search payrolls..."
      rowActions={actions}
      emptyState={
        <div className="text-sm text-muted-foreground">No payrolls found</div>
      }
    />
  );
}

export default PayrollsTableUnified;
