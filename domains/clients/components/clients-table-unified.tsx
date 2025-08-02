"use client";

import {
  Building2,
  Mail,
  Phone,
  Eye,
  Edit,
  Users,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import {
  EnhancedUnifiedTable,
  UnifiedTableColumn,
  UnifiedTableAction,
} from "@/components/ui/enhanced-unified-table";
import { Badge } from "@/components/ui/badge";

// Client data type (based on existing client structure)
interface Client {
  id: string;
  name: string;
  contactPerson: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  active: boolean;
  payrolls?: Array<{
    id: string;
    name: string;
    status: string;
    active?: boolean;
  }>;
}

interface ClientsTableProps {
  clients: Client[];
  loading?: boolean;
  onRefresh?: () => void;
  visibleColumns?: string[];
  sortField?: string;
  sortDirection?: "ASC" | "DESC";
  onSort?: (field: string) => void;
}

// Helper functions for rendering cells
const renderClientStatus = (isActive: boolean) => {
  const StatusIcon = isActive ? CheckCircle : XCircle;
  const variant = isActive ? 'default' : 'destructive';
  const status = isActive ? 'Active' : 'Inactive';
  
  return (
    <Badge variant={variant} className="flex items-center gap-1">
      <StatusIcon className="w-3 h-3" />
      {status}
    </Badge>
  );
};

const renderClientName = (client: Client) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <Building2 className="w-4 h-4 text-blue-600" />
        </div>
      </div>
      <div>
        <div className="font-medium text-gray-900">{client.name}</div>
        <div className="text-sm text-gray-500">
          {client.payrolls?.length
            ? `${client.payrolls.length} payroll${client.payrolls.length > 1 ? "s" : ""}`
            : "No payrolls"}
        </div>
      </div>
    </div>
  );
};

export function ClientsTableUnified({
  clients,
  loading = false,
  onRefresh,
  visibleColumns,
  sortField,
  sortDirection,
  onSort,
}: ClientsTableProps) {
  // Column definitions
  const columns: UnifiedTableColumn<Client>[] = [
    {
      accessorKey: "name",
      header: "Client Name",
      type: "text",
      sortable: true,
      render: (value, row) => renderClientName(row),
    },
    {
      accessorKey: "active",
      header: "Status",
      type: "badge",
      sortable: true,
      render: (active) => renderClientStatus(active),
    },
    {
      accessorKey: "contactPerson",
      header: "Contact Person",
      type: "text",
      sortable: true,
      render: (value) => value || "—",
    },
    {
      accessorKey: "contactEmail",
      header: "Email",
      type: "text",
      sortable: true,
      render: (email) =>
        email ? (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-500" />
            <span>{email}</span>
          </div>
        ) : "—",
    },
    {
      accessorKey: "contactPhone",
      header: "Phone",
      type: "text",
      sortable: true,
      render: (phone) =>
        phone ? (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-500" />
            <span>{phone}</span>
          </div>
        ) : "—",
    },
  ];

  // Action definitions
  const actions: UnifiedTableAction<Client>[] = [
    {
      label: "View Details",
      icon: Eye,
      onClick: (client: Client) => {
        window.location.href = `/clients/${client.id}`;
      },
    },
    {
      label: "Edit Client",
      icon: Edit,
      onClick: (client: Client) => {
        // Handle edit action
        console.log("Edit client:", client.id);
      },
    },
    {
      label: "View Payrolls",
      icon: Users,
      onClick: (client: Client) => {
        window.location.href = `/payrolls?client=${client.id}`;
      },
      disabled: (client: Client) => !client.payrolls?.length,
    },
  ];

  return (
    <PermissionGuard action="read">
      <EnhancedUnifiedTable
        data={clients}
        columns={columns}
        loading={loading}
        emptyMessage="No clients found. Add your first client to get started."
        selectable={false}
        actions={actions}
        title="Clients"
        searchable={true}
        searchPlaceholder="Search clients..."
        {...(onRefresh && { onRefresh })}
        refreshing={loading}
        exportable={true}
        onExport={(format) => {
          console.log("Export clients as:", format);
        }}
      />
    </PermissionGuard>
  );
}

export default ClientsTableUnified;
