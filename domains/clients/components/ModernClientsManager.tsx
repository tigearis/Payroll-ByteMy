"use client";

import { useUser } from "@clerk/nextjs";
import {
  Building2,
  User,
  Calculator,
  Eye,
  Edit,
  Plus,
  Calendar,
  MapPin,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import {
  ModernDataTable,
  type ColumnDef,
  type RowAction,
} from "@/components/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SuccessStatus, ErrorStatus } from "@/components/ui/status-indicator";
import { safeFormatDate } from "@/lib/utils/date-utils";

// Client types (compatible with existing client data structure)
interface Client {
  id: string;
  name: string;
  contactPerson: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  active: boolean;
  address?: string | null;
  payrollsAggregate?: {
    aggregate?: {
      count?: number;
    };
  };
  createdAt?: string;
  updatedAt?: string;
}

interface ClientsManagerProps {
  clients: Client[];
  loading?: boolean;
  onRefetch?: () => void;
  showHeader?: boolean;
  showLocalActions?: boolean;
}

// Transform client to show detailed information with progressive disclosure
function ClientDetails({ client }: { client: Client }) {
  const payrollCount = client.payrollsAggregate?.aggregate?.count || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {/* Contact Information */}
      <div>
        <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
          <User className="h-4 w-4" />
          Contact Details
        </h4>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Contact Person:</span>
            <p className="text-muted-foreground mt-1">
              {client.contactPerson || "Not specified"}
            </p>
          </div>
          <div>
            <span className="font-medium">Email:</span>
            <p className="text-muted-foreground mt-1">
              {client.contactEmail || "Not specified"}
            </p>
          </div>
          <div>
            <span className="font-medium">Phone:</span>
            <p className="text-muted-foreground mt-1">
              {client.contactPhone || "Not specified"}
            </p>
          </div>
          {client.address && (
            <div>
              <span className="font-medium">Address:</span>
              <p className="text-muted-foreground mt-1">{client.address}</p>
            </div>
          )}
        </div>
      </div>

      {/* Payroll Summary */}
      <div>
        <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          Payroll Information
        </h4>
        <div className="space-y-3 text-sm">
          <div>
            <div className="text-xs text-muted-foreground">Active Payrolls</div>
            <div className="font-mono font-semibold">{payrollCount}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Status</div>
            <div
              className={`font-medium ${client.active ? "text-success-600" : "text-error-600"}`}
            >
              {client.active ? "Active Client" : "Inactive Client"}
            </div>
          </div>
          {payrollCount > 0 && (
            <div className="mt-3">
              <Link
                href={`/clients/${client.id}/payrolls`}
                className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/90"
              >
                <Users className="h-3 w-3" />
                View Payrolls
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Activity & Dates */}
      <div>
        <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Account Activity
        </h4>
        <div className="space-y-2 text-sm">
          {client.createdAt && (
            <div>
              <span className="font-medium">Client Since:</span>
              <div className="text-muted-foreground">
                {client.createdAt
                  ? safeFormatDate(client.createdAt, "dd MMM yyyy")
                  : "—"}
              </div>
            </div>
          )}
          {client.updatedAt && (
            <div>
              <span className="font-medium">Last Updated:</span>
              <div className="text-muted-foreground">
                {client.updatedAt
                  ? safeFormatDate(client.updatedAt, "dd MMM yyyy 'at' HH:mm")
                  : "—"}
              </div>
            </div>
          )}
          <div>
            <span className="font-medium">Account Status:</span>
            <div
              className={`text-sm ${client.active ? "text-success-600" : "text-warning-600"}`}
            >
              {client.active
                ? "Active account with full access"
                : "Inactive - limited functionality"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ModernClientsManager({
  clients,
  loading,
  onRefetch,
  showHeader = true,
  showLocalActions = true,
}: ClientsManagerProps) {
  const { user } = useUser();

  const getStatusComponent = (active: boolean) => {
    return active ? (
      <SuccessStatus size="sm">Active</SuccessStatus>
    ) : (
      <ErrorStatus size="sm">Inactive</ErrorStatus>
    );
  };

  // Define essential columns only (4 columns instead of 6+)
  const columns: ColumnDef<Client>[] = [
    {
      id: "name",
      key: "name",
      label: "Client",
      essential: true,
      sortable: true,
      render: (_, client) => (
        <div className="min-w-0">
          <Link
            href={`/clients/${client.id}`}
            className="font-medium text-primary hover:text-primary/90 truncate block"
          >
            {client.name}
          </Link>
          {client.address && (
            <div className="text-xs text-muted-foreground truncate mt-1 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {client.address}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "contact",
      key: "contactPerson",
      label: "Contact",
      essential: true,
      sortable: true,
      render: (_, client) => (
        <div className="flex items-center gap-2 min-w-0">
          <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="truncate">
            {client.contactPerson || "No contact person"}
          </span>
        </div>
      ),
    },
    {
      id: "payrolls",
      key: "name",
      label: "Payrolls",
      essential: true,
      sortable: false,
      render: (_, client) => {
        const payrollCount = client.payrollsAggregate?.aggregate?.count || 0;
        return (
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4 text-neutral-500" />
            <span className="font-mono font-semibold">{payrollCount}</span>
          </div>
        );
      },
    },
    {
      id: "status",
      key: "active",
      label: "Status",
      essential: true,
      render: (_, client) => getStatusComponent(client.active),
    },
  ];

  // Row actions (contextual, not bulk)
  const rowActions: RowAction<Client>[] = [
    {
      id: "view",
      label: "View Details",
      icon: Eye,
      onClick: client => {
        window.open(`/clients/${client.id}`, "_blank");
      },
    },
    {
      id: "edit",
      label: "Edit Client",
      icon: Edit,
      onClick: client => {
        window.open(`/clients/${client.id}/edit`, "_blank");
      },
    },
    {
      id: "payrolls",
      label: "View Payrolls",
      icon: Calculator,
      onClick: client => {
        window.open(`/clients/${client.id}/payrolls`, "_blank");
      },
      disabled: client =>
        (client.payrollsAggregate?.aggregate?.count || 0) === 0,
    },
  ];

  const renderClientCard = (client: Client) => {
    const payrollCount = client.payrollsAggregate?.aggregate?.count || 0;
    const StatusChip = getStatusComponent(client.active);
    return (
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                href={`/clients/${client.id}`}
                className="font-semibold text-primary hover:text-primary/90 block truncate"
              >
                {client.name}
              </Link>
              {client.address && (
                <div className="text-xs text-muted-foreground truncate mt-0.5 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {client.address}
                </div>
              )}
            </div>
            <div className="shrink-0">{StatusChip}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-xs text-muted-foreground">Contact</span>
              <div className="text-sm font-medium truncate">
                {client.contactPerson || "Not specified"}
              </div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Payrolls</span>
              <div className="text-sm font-medium flex items-center gap-1">
                <Calculator className="h-3.5 w-3.5 text-muted-foreground" />
                {payrollCount}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/clients/${client.id}`}>
                <Eye className="h-3.5 w-3.5 mr-1" /> View Details
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/clients/${client.id}/edit`}>
                <Edit className="h-3.5 w-3.5 mr-1" /> Edit Client
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              disabled={payrollCount === 0}
            >
              <Link href={`/clients/${client.id}/payrolls`}>
                <Calculator className="h-3.5 w-3.5 mr-1" /> View Payrolls
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Export listener: clients CSV */}
      <ExportClientsListener clients={clients} />
      {showHeader && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Clients</h2>
            <p className="text-muted-foreground mt-1">
              Manage your clients with smart search and progressive disclosure
            </p>
          </div>
          {showLocalActions && (
            <div className="flex items-center gap-2">
              {onRefetch && (
                <Button variant="outline" size="sm" onClick={onRefetch}>
                  Refresh
                </Button>
              )}
              <PermissionGuard action="create">
                <Button asChild>
                  <Link href="/clients/new">
                    <Plus className="h-4 w-4 mr-2" />
                    New Client
                  </Link>
                </Button>
              </PermissionGuard>
            </div>
          )}
        </div>
      )}

      <ModernDataTable
        data={clients}
        columns={columns}
        loading={!!loading}
        searchPlaceholder="Search clients, contacts, locations..."
        expandableRows
        renderExpandedRow={client => <ClientDetails client={client} />}
        rowActions={rowActions}
        viewToggle
        showRowActionsInCardView={false}
        renderCardItem={row => renderClientCard(row as Client)}
        emptyState={
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No clients found
            </h3>
            <p className="text-muted-foreground mb-4">
              Create your first client to get started with payroll management
            </p>
            <PermissionGuard action="create">
              <Button asChild>
                <Link href="/clients/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Client
                </Link>
              </Button>
            </PermissionGuard>
          </div>
        }
      />
    </div>
  );
}

// Listener to export clients as CSV when PageHeader dispatches clients:export
const ExportClientsListener: React.FC<{ clients: Client[] }> = ({
  clients,
}) => {
  const rows = useMemo(() => clients || [], [clients]);
  useEffect(() => {
    const handleExport = () => {
      const headers = [
        "Client",
        "Contact",
        "Email",
        "Phone",
        "Status",
        "Payrolls",
        "Created",
        "Updated",
      ];
      const escape = (val: unknown) => {
        const s = String(val ?? "");
        const escaped = s.replace(/"/g, '""');
        return `"${escaped}"`;
      };
      const csvRows = rows.map(c => [
        escape(c.name),
        escape(c.contactPerson ?? ""),
        escape(c.contactEmail ?? ""),
        escape(c.contactPhone ?? ""),
        escape(c.active ? "Active" : "Inactive"),
        escape(c.payrollsAggregate?.aggregate?.count ?? 0),
        escape(c.createdAt ?? ""),
        escape(c.updatedAt ?? ""),
      ]);
      const csv = [
        headers.map(escape).join(","),
        ...csvRows.map(r => r.join(",")),
      ].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `clients-export-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
    window.addEventListener("clients:export", handleExport);
    return () => window.removeEventListener("clients:export", handleExport);
  }, [rows]);
  return null;
};