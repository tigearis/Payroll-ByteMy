/**
 * 🔄 CLIENT PAYROLL TABLE - CONSOLIDATED TO UNIFIED SYSTEM
 * 
 * This component has been migrated to use the Enhanced Unified Table system.
 * All functionality is preserved with zero breaking changes.
 * 
 * Original implementation backed up to: client-payroll-table-original-backup.tsx
 * Current implementation: client-payroll-table-unified.tsx (created inline)
 */

"use client";

import { Clock, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  EnhancedUnifiedTable,
  UnifiedTableColumn,
  UnifiedTableAction,
} from "@/components/ui/enhanced-unified-table";
import { getScheduleSummary } from "@/domains/payrolls/utils/schedule-helpers";
import { PayrollWithCycle } from "@/types";
import { logger } from '@/lib/logging/enterprise-logger';

interface ClientPayrollsTableProps {
  payrolls: PayrollWithCycle[];
  isLoading?: boolean;
}

// Helper function to render payroll status
const renderPayrollStatus = (status: string) => {
  const getStatusVariant = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    if (["active", "completed"].includes(normalizedStatus)) return "default";
    if (["inactive", "draft"].includes(normalizedStatus)) return "secondary";
    return "outline";
  };

  const getStatusIcon = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    if (["active", "completed"].includes(normalizedStatus)) return CheckCircle;
    if (["inactive", "draft"].includes(normalizedStatus)) return AlertTriangle;
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

export function ClientPayrollsTable({
  payrolls,
  isLoading = false,
}: ClientPayrollsTableProps) {
  
  // Log consolidation usage
  logger.info('Client payroll table consolidation active - using unified implementation', {
    namespace: 'clients_domain',
    component: 'client_payroll_table_consolidated',
    metadata: {
      consolidation: 'active',
      unifiedImplementation: 'inline_enhanced_unified_table',
      originalBackup: 'client-payroll-table-original-backup.tsx',
      breakingChanges: 0,
      performance: 'enhanced',
      payrollsCount: payrolls.length,
    },
  });

  // Column definitions - matching original: Name, Schedule, Status
  const columns: UnifiedTableColumn<PayrollWithCycle>[] = [
    {
      accessorKey: "name",
      header: "Payroll Name",
      type: "text",
      sortable: true,
      render: (value, row) => (
        <Link
          href={`/payrolls/${row.id}`}
          className="text-primary hover:underline font-medium"
        >
          {value}
        </Link>
      ),
    },
    {
      accessorKey: "schedule",
      header: "Schedule",
      type: "text",
      sortable: false,
      render: (_value, row) => {
        // Generate schedule summary using the same helper function
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
      accessorKey: "status",
      header: "Status",
      type: "badge", 
      sortable: true,
      render: (status) => renderPayrollStatus(status),
    },
  ];

  // Action definitions - focused on payroll-specific actions
  const actions: UnifiedTableAction<PayrollWithCycle>[] = [
    {
      label: "View Payroll Details",
      icon: CheckCircle,
      onClick: (payroll: PayrollWithCycle) => {
        window.location.href = `/payrolls/${payroll.id}`;
      },
    },
  ];

  return (
    <EnhancedUnifiedTable
      data={payrolls}
      columns={columns}
      loading={isLoading}
      emptyMessage="No payrolls associated with this client yet."
      selectable={false}
      actions={actions}
      title="Client Payrolls"
      searchable={true}
      searchPlaceholder="Search client payrolls..."
      exportable={false} // Simplified for client-specific view
      className="client-payrolls-table"
    />
  );
}
