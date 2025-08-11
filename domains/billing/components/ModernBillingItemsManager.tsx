"use client";

import { useMutation } from "@apollo/client";
import { useUser } from "@clerk/nextjs";
import {
  Building2,
  User,
  DollarSign,
  Check,
  Eye,
  Edit,
  Calendar,
  Calculator,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { PermissionGuard } from "@/components/auth/permission-guard";
import {
  ModernDataTable,
  type ColumnDef,
  type RowAction,
} from "@/components/data";
import {
  StatusIndicator,
  SuccessStatus,
  WarningStatus,
  ErrorStatus,
  PendingStatus,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logging/enterprise-logger";
import { safeFormatDate } from "@/lib/utils/date-utils";
import { ApproveBillingItemAdvancedDocument } from "../graphql/generated/graphql";
import type {
  BillingItemsManagerProps,
  BillingItem,
} from "../types/billing.types";

// Transform billing item to show essential information with progressive disclosure
function BillingItemDetails({ item }: { item: BillingItem }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {/* Service Details */}
      <div>
        <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Service Information
        </h4>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Category:</span>{" "}
            {item.service?.category || "N/A"}
          </div>
          <div>
            <span className="font-medium">Billing Unit:</span>{" "}
            {item.service?.billingUnit || "N/A"}
          </div>
          <div>
            <span className="font-medium">Description:</span>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              {item.description || "No description provided"}
            </p>
          </div>
        </div>
      </div>

      {/* Billing Details */}
      <div>
        <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          Billing Breakdown
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Quantity:</span>
            <span className="font-mono">
              {item.quantity} {item.service?.billingUnit || "units"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Unit Rate:</span>
            <span className="font-mono">
              {formatCurrency(item.unitPrice || 0)}
            </span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Subtotal:</span>
            <span className="font-mono">
              {formatCurrency(item.amount || 0)}
            </span>
          </div>
          {item.totalAmount && item.totalAmount !== item.amount && (
            <div className="flex justify-between font-medium">
              <span>Total (inc. fees):</span>
              <span className="font-mono">
                {formatCurrency(item.totalAmount)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Activity & Dates */}
      <div>
        <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Activity Timeline
        </h4>
        <div className="space-y-2 text-sm">
          {item.staffUser && (
            <div>
              <span className="font-medium">Assigned Staff:</span>
              <div className="flex items-center gap-2 mt-1">
                <User className="h-3 w-3 text-neutral-500" />
                {item.staffUser.firstName} {item.staffUser.lastName}
              </div>
            </div>
          )}
          {item.createdAt && (
            <div>
              <span className="font-medium">Created:</span>
              <div className="text-neutral-600 dark:text-neutral-400">
                {safeFormatDate(item.createdAt, "dd MMM yyyy 'at' HH:mm")}
              </div>
            </div>
          )}
          {item.approvalDate && (
            <div>
              <span className="font-medium">Approved:</span>
              <div className="text-success-600">
                {safeFormatDate(item.approvalDate, "dd MMM yyyy 'at' HH:mm")}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ModernBillingItemsManager({
  billingItems,
  loading,
  onRefetch,
  onStatusChange,
  onBulkAction,
  showHeader = true,
  showLocalActions = true,
}: BillingItemsManagerProps & {
  showHeader?: boolean;
  showLocalActions?: boolean;
}) {
  const { user } = useUser();

  // Mutations
  const [approveBillingItem] = useMutation(ApproveBillingItemAdvancedDocument, {
    onCompleted: () => {
      toast.success("Billing item approved");
      onRefetch?.();
    },
    onError: error => {
      toast.error(`Failed to approve item: ${error.message}`);
    },
  });

  const handleApprove = async (itemId: string) => {
    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    try {
      await approveBillingItem({
        variables: {
          id: itemId,
          approvedBy: user.id,
        },
      });
      onStatusChange?.(itemId, "approved");
    } catch (error) {
      logger.error("Billing item approval failed in modern manager", {
        namespace: "billing_domain",
        component: "modern_billing_items_manager",
        action: "approve_billing_item",
        error: error instanceof Error ? error.message : "Unknown error",
        metadata: { itemId, userId: user?.id },
      });
    }
  };

  const getStatusComponent = (
    status: string | null | undefined,
    isApproved?: boolean | null
  ) => {
    if (isApproved) {
      return <SuccessStatus size="sm">Approved</SuccessStatus>;
    }

    switch (status?.toLowerCase()) {
      case "pending":
        return <WarningStatus size="sm">Pending</WarningStatus>;
      case "rejected":
        return <ErrorStatus size="sm">Rejected</ErrorStatus>;
      case "draft":
        return <PendingStatus size="sm">Draft</PendingStatus>;
      default:
        return (
          <StatusIndicator variant="info" size="sm">
            {status || "Unknown"}
          </StatusIndicator>
        );
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Define essential columns only (4 columns instead of 12+)
  const columns: ColumnDef<BillingItem>[] = [
    {
      id: "service",
      key: "service",
      label: "Service",
      essential: true,
      sortable: true,
      render: (_, item) => (
        <div className="min-w-0">
          <div className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
            {item.service?.name || item.serviceName || "Unnamed Service"}
          </div>
          {item.service?.category && (
            <div className="text-xs text-neutral-600 dark:text-neutral-400 truncate mt-1">
              {item.service.category}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "client",
      key: "client",
      label: "Client",
      essential: true,
      sortable: true,
      render: (_, item) => (
        <div className="flex items-center gap-2 min-w-0">
          <Building2 className="h-4 w-4 text-neutral-500 flex-shrink-0" />
          <span className="truncate font-medium">
            {item.client?.name || "Unknown Client"}
          </span>
        </div>
      ),
    },
    {
      id: "amount",
      key: "totalAmount",
      label: "Amount",
      essential: true,
      sortable: true,
      render: (_, item) => (
        <div className="text-right font-mono font-semibold">
          {formatCurrency(item.totalAmount || item.amount || 0)}
        </div>
      ),
    },
    {
      id: "status",
      key: "status",
      label: "Status",
      essential: true,
      render: (_, item) => getStatusComponent(item.status, item.isApproved),
    },
  ];

  // Row actions (contextual, not bulk)
  const rowActions: RowAction<BillingItem>[] = [
    {
      id: "view",
      label: "View Details",
      icon: Eye,
      onClick: item => {
        // Details shown in expandable row, this could open a modal or navigate
        window.open(`/billing/items/${item.id}`, "_blank");
      },
    },
    {
      id: "edit",
      label: "Edit Item",
      icon: Edit,
      onClick: item => {
        window.open(`/billing/items/${item.id}/edit`, "_blank");
      },
      disabled: item => !!item.isApproved, // Can't edit approved items
    },
    {
      id: "approve",
      label: "Approve",
      icon: Check,
      onClick: item => handleApprove(item.id),
      disabled: item => !!item.isApproved, // Already approved
    },
  ];

  // Custom card renderer for grid view
  const renderBillingCard = (item: BillingItem) => {
    return (
      <div className="rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer">
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-semibold truncate">
                {item.service?.name || item.serviceName || "Unnamed Service"}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {item.client?.name || "Unknown Client"}
              </div>
            </div>
            <div className="shrink-0">
              {getStatusComponent(item.status, item.isApproved)}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Amount</span>
            <span className="font-mono font-semibold">
              {formatCurrency(item.totalAmount || item.amount || 0)}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/billing/items/${item.id}`}>
                <Eye className="h-3.5 w-3.5 mr-1" /> View
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              disabled={!!item.isApproved}
            >
              <Link href={`/billing/items/${item.id}/edit`}>
                <Edit className="h-3.5 w-3.5 mr-1" /> Edit
              </Link>
            </Button>
            <PermissionGuard action="approve">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleApprove(item.id)}
                disabled={!!item.isApproved}
              >
                <Check className="h-3.5 w-3.5 mr-1" /> Approve
              </Button>
            </PermissionGuard>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Billing Items
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Manage billing items with smart search and progressive disclosure
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
                  <Link href="/billing/items/new">New Item</Link>
                </Button>
              </PermissionGuard>
            </div>
          )}
        </div>
      )}

      <ModernDataTable
        data={billingItems}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search items, clients, services..."
        expandableRows
        renderExpandedRow={item => <BillingItemDetails item={item} />}
        rowActions={rowActions}
        viewToggle
        showRowActionsInCardView={false}
        renderCardItem={row => renderBillingCard(row as BillingItem)}
        emptyState={
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              No billing items found
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Create your first billing item to get started
            </p>
            <PermissionGuard action="create">
              <Button asChild>
                <Link href="/billing/items/new">Create Billing Item</Link>
              </Button>
            </PermissionGuard>
          </div>
        }
      />
    </div>
  );
}
