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

import {
  UnifiedDataTable,
  DataTableColumn,
  DataTableAction,
  StatusConfig,
  createCellRenderers,
} from "@/components/ui/unified-data-table";

// Client data type (based on existing client structure)
interface Client {
  id: string;
  name: string;
  contact_person: string | null;
  contact_email: string | null;
  contact_phone: string | null;
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
  sortDirection?: "asc" | "desc";
  onSort?: (field: string) => void;
}

// Status configuration for clients
const clientStatusConfig: Record<string, StatusConfig> = {
  Active: {
    variant: "default",
    icon: CheckCircle,
    className: "bg-green-50 text-green-700 border-green-200",
  },
  Inactive: {
    variant: "destructive",
    icon: XCircle,
    className: "bg-red-50 text-red-700 border-red-200",
  },
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
  // Create cell renderers with status config
  const cellRenderers = createCellRenderers<Client>(clientStatusConfig);

  // Column definitions
  const columns: DataTableColumn<Client>[] = [
    {
      key: "name",
      label: "Client Name",
      sortable: true,
      defaultVisible: true,
      cellRenderer: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">
              {row.payrolls?.length
                ? `${row.payrolls.length} payroll${row.payrolls.length > 1 ? "s" : ""}`
                : "No payrolls"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "active",
      label: "Status",
      sortable: true,
      defaultVisible: true,
      cellRenderer: active =>
        cellRenderers.badge(active ? "Active" : "Inactive"),
    },
    {
      key: "contact_person",
      label: "Contact Person",
      sortable: true,
      defaultVisible: true,
      cellRenderer: value => value || "—",
    },
    {
      key: "contact_email",
      label: "Email",
      sortable: true,
      defaultVisible: true,
      cellRenderer: email =>
        email ? cellRenderers.iconText(email, Mail) : "—",
    },
    {
      key: "contact_phone",
      label: "Phone",
      sortable: true,
      defaultVisible: true,
      cellRenderer: phone =>
        phone ? cellRenderers.iconText(phone, Phone) : "—",
    },
    {
      key: "payrolls",
      label: "Active Payrolls",
      sortable: false,
      defaultVisible: true,
      align: "center",
      cellRenderer: payrolls => {
        const activePayrolls =
          payrolls?.filter((p: any) => p.active !== false) || [];
        return cellRenderers.count(activePayrolls.length, "payroll");
      },
    },
  ];

  // Action definitions
  const actions: DataTableAction<Client>[] = [
    {
      label: "View Details",
      icon: Eye,
      onClick: client => {
        window.location.href = `/clients/${client.id}`;
      },
    },
    {
      label: "Edit Client",
      icon: Edit,
      onClick: client => {
        // Handle edit action
        console.log("Edit client:", client.id);
      },
    },
    {
      label: "View Payrolls",
      icon: Users,
      onClick: client => {
        window.location.href = `/payrolls?client=${client.id}`;
      },
      disabled: client => !client.payrolls?.length,
    },
  ];

  const tableProps = {
    data: clients,
    columns,
    loading,
    emptyMessage: "No clients found. Add your first client to get started.",
    selectable: false as const,
    actions,
    statusConfig: clientStatusConfig,
    title: "Clients",
    getRowId: (client: Client) => client.id,
    getRowLink: (client: Client) => `/clients/${client.id}`,
    ...(onSort && { onSort }),
    ...(onRefresh && { onRefresh }),
    ...(sortField && { sortField }),
    ...(sortDirection && { sortDirection }),
    ...(visibleColumns && { visibleColumns }),
  };

  return <UnifiedDataTable {...tableProps} />;
}

export default ClientsTableUnified;
