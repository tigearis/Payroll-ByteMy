"use client";

import { useQuery } from "@apollo/client";
import { Plus, DollarSign, Clock, CheckCircle, RefreshCw } from "lucide-react";
import { useState, useMemo, useCallback, useEffect } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import {
  ModernDataTable,
  type ColumnDef,
} from "@/components/data/modern-data-table";
import { PageHeader } from "@/components/patterns/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GetBillingItemsAdvancedDocument,
  GetBillingItemsStatsAdvancedDocument,
} from "@/domains/billing/graphql/generated/graphql";
import { ColumnFactories, CommonColumnSets } from "@/lib/table/column-factories";
import { safeFormatDate } from "@/lib/utils/date-utils";

export default function BillingItemsPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "draft" | "approved"
  >("all");
  const [periodFilter, setPeriodFilter] = useState<"7" | "30" | "90" | "all">(
    "30"
  );

  // Fetch billing data with optimized pagination
  const {
    data: billingItemsData,
    loading: itemsLoading,
    refetch,
  } = useQuery(GetBillingItemsAdvancedDocument, {
    variables: {
      limit: 25, // Reduced from 100 to prevent loops
      offset: 0,
      orderBy: [{ createdAt: "DESC" }],
    },
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: false, // Prevent re-renders on network status change
  });

  const { data: statsData, loading: statsLoading } = useQuery(
    GetBillingItemsStatsAdvancedDocument,
    {
      variables: { where: {} },
      fetchPolicy: "cache-first",
      nextFetchPolicy: "cache-first",
    }
  );

  // Memoize data processing to prevent unnecessary re-calculations
  const billingItems = useMemo(
    () => billingItemsData?.billingItems || [],
    [billingItemsData?.billingItems]
  );
  const stats = useMemo(
    () => statsData?.billingItemsAggregate?.aggregate,
    [statsData?.billingItemsAggregate?.aggregate]
  );
  const pendingStats = useMemo(
    () => statsData?.pending?.aggregate,
    [statsData?.pending?.aggregate]
  );
  const approvedStats = useMemo(
    () => statsData?.approved?.aggregate,
    [statsData?.approved?.aggregate]
  );

  // Memoize currency formatter and filtering functions
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(amount);
  }, []);

  const draftItems = useMemo(
    () => billingItems.filter(item => !item.isApproved),
    [billingItems]
  );
  const confirmedItems = useMemo(
    () => billingItems.filter(item => item.isApproved),
    [billingItems]
  );

  // Quick filters (status + period)
  const filteredItems = useMemo(() => {
    const now = new Date();
    const periodDays = periodFilter === "all" ? Infinity : Number(periodFilter);
    const withinPeriod = (createdAt?: string | null) => {
      if (!createdAt || periodDays === Infinity) return true;
      const created = new Date(createdAt);
      const diffDays =
        (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays <= periodDays;
    };

    return billingItems.filter(item => {
      const statusOk =
        statusFilter === "all" ||
        (statusFilter === "draft" && !item.isApproved) ||
        (statusFilter === "approved" && !!item.isApproved);
      const periodOk = withinPeriod(
        (item as any)?.createdAt as string | undefined
      );
      return statusOk && periodOk;
    });
  }, [billingItems, statusFilter, periodFilter]);

  // Export handler (CSV)
  const exportBillingItems = useCallback(() => {
    const headers = [
      "Client",
      "Service",
      "Amount",
      "Quantity",
      "Unit Price",
      "Approved",
      "Created",
    ];

    const escape = (val: unknown) => {
      const s = String(val ?? "");
      const escaped = s.replace(/"/g, '""');
      return `"${escaped}"`;
    };

    const rows = filteredItems.map((item: any) => [
      escape(item.client?.name ?? ""),
      escape(item.serviceName ?? item.service?.name ?? ""),
      escape(item.amount ?? ""),
      escape(item.quantity ?? ""),
      escape(item.unitPrice ?? ""),
      escape(item.isApproved ? "Yes" : "No"),
      escape(safeFormatDate((item as any)?.createdAt, "dd MMM yyyy")),
    ]);

    const csv = [
      headers.map(escape).join(","),
      ...rows.map(r => r.join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `billing-items-export-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [filteredItems]);

  useEffect(() => {
    const handler = () => exportBillingItems();
    window.addEventListener("billing-items:export", handler as EventListener);
    return () =>
      window.removeEventListener(
        "billing-items:export",
        handler as EventListener
      );
  }, [exportBillingItems]);

  // Use DRY column definitions
  const columns: ColumnDef<any>[] = [
    ...CommonColumnSets.billingItemColumns<any>(),
    ColumnFactories.date("createdAt", "Created"),
  ];

  return (
    <PermissionGuard
      action="read"
      fallback={
        <div className="container mx-auto py-6">
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2 text-red-800">
              Access Denied
            </h3>
            <p className="text-red-600">
              You don't have permission to access billing items. Contact your
              administrator for access.
            </p>
          </div>
        </div>
      }
    >
      <div className="container mx-auto p-6 space-y-6">
        <PageHeader
          title="Billing Items"
          description="Manage individual billing items and track approval status"
          actions={[
            { label: "Refresh", icon: RefreshCw, onClick: () => refetch() },
            {
              label: "Create Item",
              icon: Plus,
              primary: true,
              href: "/billing/items/new",
            },
          ]}
          overflowActions={[
            {
              label: "Export",
              onClick: () =>
                window.dispatchEvent(new CustomEvent("billing-items:export")),
            },
          ]}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Billing", href: "/billing" },
            { label: "Items" },
          ]}
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {itemsLoading ? "..." : stats?.count || 0}
              </div>
              <p className="text-xs text-gray-600">
                {formatCurrency(stats?.sum?.amount || 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Approval
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : pendingStats?.count || 0}
              </div>
              <p className="text-xs text-gray-600">
                {formatCurrency(pendingStats?.sum?.amount || 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : approvedStats?.count || 0}
              </div>
              <p className="text-xs text-gray-600">
                {formatCurrency(approvedStats?.sum?.amount || 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats?.sum?.amount || 0)}
              </div>
              <p className="text-xs text-gray-600">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Filters Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Status:</span>
            <div className="flex items-center border rounded-md overflow-hidden">
              <button
                className={`px-3 py-1.5 text-sm ${statusFilter === "all" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                onClick={() => setStatusFilter("all")}
              >
                All
              </button>
              <button
                className={`px-3 py-1.5 text-sm ${statusFilter === "draft" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                onClick={() => setStatusFilter("draft")}
              >
                Draft
              </button>
              <button
                className={`px-3 py-1.5 text-sm ${statusFilter === "approved" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                onClick={() => setStatusFilter("approved")}
              >
                Approved
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Period:</span>
            <select
              className="h-9 rounded-md border bg-background px-2 text-sm"
              value={periodFilter}
              onChange={e => setPeriodFilter(e.target.value as any)}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="all">All time</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <ModernDataTable
          data={filteredItems}
          columns={columns}
          loading={itemsLoading}
          searchable
          viewToggle
          className="modern-billing-table"
        />
      </div>
    </PermissionGuard>
  );
}
