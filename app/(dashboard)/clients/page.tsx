"use client";

/*
 * Modern Clients Management Page
 *
 * Features progressive disclosure pattern with:
 * - 4 essential columns: Client Name, Contact, Status, Payrolls
 * - Expandable rows for detailed client information and relationships
 * - Smart search and contextual client management actions
 * - Mobile-first responsive design for relationship management
 */

import {
  Plus,
  RefreshCw,
  Building2,
  BarChart3,
  Settings,
  Mail,
  AlertTriangle,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  PermissionGuard,
  ResourceProvider,
  RESOURCES,
} from "@/components/auth/permission-guard";
import { GraphQLErrorBoundary } from "@/components/graphql-error-boundary";
import { PageHeader } from "@/components/patterns/page-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ModernClientsManager } from "@/domains/clients/components/ModernClientsManager";
import {
  GetClientsListOptimizedDocument,
  GetClientsDashboardStatsDocument,
} from "@/domains/clients/graphql/generated/graphql";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useStrategicQuery } from "@/hooks/use-strategic-query";
import { useDynamicLoading } from "@/lib/hooks/use-dynamic-loading";

// Create loading component for clients
function ClientsLoading() {
  const { Loading: _ClientsLoading } = useDynamicLoading({
    title: "Loading Client Data...",
    description: "Fetching client information and relationships",
  });
  return <_ClientsLoading variant="minimal" />;
}

interface Client {
  id: string;
  name: string;
  contactPerson?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  active: boolean;
  payrollCount?: number | null;
  createdAt: string;
  updatedAt: string;
}

interface ClientStats {
  overview: {
    totalClients: number;
    activeClients: number;
    inactiveClients: number;
    recentlyAdded: number;
    totalPayrolls: number;
    averagePayrollsPerClient: number;
  };
}

function ClientsPage() {
  const { currentUser: _currentUser, loading: userLoading } = useCurrentUser();

  // Data state
  const [clients, setClients] = useState<Client[]>([]);
  const [_stats, setStats] = useState<ClientStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // GraphQL queries (preserved from original)
  const {
    data: clientsData,
    loading: clientsLoading,
    error: clientsError,
    refetch,
  } = useStrategicQuery(GetClientsListOptimizedDocument, "clients", {
    variables: { limit: 100 },
  });

  const { data: statsData } = useStrategicQuery(
    GetClientsDashboardStatsDocument,
    "dashboard",
    {}
  );

  // Process GraphQL data
  useEffect(() => {
    if (clientsData?.clients) {
      setClients(clientsData.clients as Client[]);
    }
    if (statsData) {
      // Transform stats data to expected format
      setStats({
        overview: {
          totalClients: statsData.clientStats?.totalClients || 0,
          activeClients: statsData.clientStats?.activeClients || 0,
          inactiveClients: statsData.clientStats?.inactiveClients || 0,
          recentlyAdded: statsData.clientStats?.recentlyAdded || 0,
          totalPayrolls: statsData.clientStats?.totalPayrolls || 0,
          averagePayrollsPerClient:
            statsData.clientStats?.averagePayrollsPerClient || 0,
        },
      });
    }
    setLoading(clientsLoading);
    if (clientsError) {
      setError(clientsError.message);
    }
  }, [clientsData, statsData, clientsLoading, clientsError]);

  // Business logic handlers
  const handleCreateClient = () => {
    window.location.href = "/clients/new";
  };

  const _handleEditClient = (clientId: string) => {
    window.location.href = `/clients/${clientId}`;
  };

  const _handleViewClient = (clientId: string) => {
    window.location.href = `/clients/${clientId}`;
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      const res = await fetch(`/api/clients/${clientId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete client");
      refetch();
    } catch (err) {
      setError("Failed to delete client");
      console.error("Error deleting client:", err);
    }
  };

  const handleToggleClientStatus = async (
    clientId: string,
    active: boolean
  ) => {
    try {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      });
      if (!res.ok) throw new Error("Failed to update client status");
      refetch();
    } catch (err) {
      setError("Failed to update client status");
      console.error("Error updating client status:", err);
    }
  };

  const handleEmailClient = (clientId: string) => {
    window.location.href = `/email?client=${clientId}`;
  };

  if (userLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ResourceProvider resource={RESOURCES.CLIENTS}>
      <PermissionGuard action="read">
        <div className="container mx-auto py-6 space-y-6">
          {/* Error Display */}
          {error && (
            <Alert className="border-destructive bg-destructive/10">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive">
                <div className="flex items-center justify-between">
                  <span>{error}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setError(null)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Page Header */}
          <PageHeader
            title="Client Management"
            description="Modern client relationship management with progressive disclosure"
            breadcrumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Clients" },
            ]}
            actions={[
              { label: "Refresh", icon: RefreshCw, onClick: () => refetch() },
              { label: "Email Clients", icon: Mail, href: "/email" },
              {
                label: "New Client",
                icon: Plus,
                primary: true,
                onClick: handleCreateClient,
              },
            ]}
            overflowActions={[
              {
                label: "Export",
                onClick: () =>
                  window.dispatchEvent(new CustomEvent("clients:export")),
              },
            ]}
          />

          {/* Local action removed to avoid duplication with header */}

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex gap-2">
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Client Analytics
              </Button>
              <Button variant="outline">
                <Building2 className="h-4 w-4 mr-2" />
                Service Agreements
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Modern Clients Manager */}
          <ModernClientsManager
            clients={clients as any}
            loading={loading}
            onRefetch={() => refetch()}
            showHeader={false}
            showLocalActions={false}
          />
        </div>
      </PermissionGuard>
    </ResourceProvider>
  );
}

// Export component wrapped with GraphQL error boundary and permission guard
export default function ClientsPageWithErrorBoundary() {
  return (
    <GraphQLErrorBoundary>
      <ClientsPage />
    </GraphQLErrorBoundary>
  );
}
