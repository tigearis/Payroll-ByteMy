"use client";

import { useQuery, useMutation } from "@apollo/client";
import {
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Edit,
  Eye,
  User,
  Plus,
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  ModernDataTable,
  type ColumnDef,
  type RowAction,
} from "@/components/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  GetPayrollBillingItemsDocument,
  GetPayrollBillingStatsDocument,
  ApproveBillingItemDocument,
  RejectBillingItemDocument,
} from "../../graphql/generated/graphql";
import {
  getBillingStatusConfig,
  formatCurrency,
  getServiceCategoryIcon,
} from "../../utils/status-config";
import { BillingItemForm } from "../items/billing-item-form";

interface PayrollBillingItemsTableProps {
  payrollId: string;
}

export function PayrollBillingItemsTable({
  payrollId,
}: PayrollBillingItemsTableProps) {
  const [filterStatus, setFilterStatus] = useState<
    "all" | "draft" | "pending" | "approved"
  >("pending");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Use same GraphQL query pattern as existing components
  const { data, loading, error, refetch } = useQuery(
    GetPayrollBillingItemsDocument,
    {
      variables: { payrollId },
      fetchPolicy: "cache-and-network",
      skip: !payrollId,
    }
  );

  // Get payroll details to extract client ID for billing item creation
  const { data: payrollStatsData } = useQuery(GetPayrollBillingStatsDocument, {
    variables: { payrollId },
    fetchPolicy: "cache-and-network",
    skip: !payrollId,
  });

  // GraphQL mutations for item actions
  const [approveBillingItem] = useMutation(ApproveBillingItemDocument, {
    onCompleted: () => {
      toast.success("Billing item approved successfully");
      refetch();
    },
    onError: error => {
      toast.error(`Failed to approve item: ${error.message}`);
    },
  });

  const [rejectBillingItem] = useMutation(RejectBillingItemDocument, {
    onCompleted: () => {
      toast.success("Billing item rejected");
      refetch();
    },
    onError: error => {
      toast.error(`Failed to reject item: ${error.message}`);
    },
  });

  const billingItems = data?.billingItems || [];
  const payroll = payrollStatsData?.payrolls?.[0];
  const clientId = payroll?.client?.id;

  // Same filtering pattern as payroll dates table
  const filteredItems = useMemo(() => {
    switch (filterStatus) {
      case "draft":
        return billingItems.filter(item => item.status === "draft");
      case "pending":
        return billingItems.filter(item => item.status === "pending");
      case "approved":
        return billingItems.filter(item => item.status === "approved");
      default:
        return billingItems;
    }
  }, [billingItems, filterStatus]);

  // Handle create billing item success
  const handleCreateSuccess = (newItem: any) => {
    setShowCreateDialog(false);
    refetch();
    toast.success(`Billing item created for ${newItem.serviceName}`);
  };

  // Action handlers
  const handleApproveItem = async (itemId: string) => {
    try {
      await approveBillingItem({
        variables: {
          id: itemId,
          approvedBy: "current-user-id", // TODO: Get from auth context
        },
      });
    } catch (error) {
      console.error("Error approving item:", error);
    }
  };

  const handleRejectItem = async (itemId: string, notes?: string) => {
    try {
      await rejectBillingItem({
        variables: {
          id: itemId,
          approvedBy: "current-user-id", // TODO: Get from auth context
          notes: notes || "Rejected by manager",
        },
      });
    } catch (error) {
      console.error("Error rejecting item:", error);
    }
  };

  const handleEditItem = (itemId: string) => {
    window.open(`/billing/items/${itemId}/edit`, "_blank");
  };

  const handleViewDetails = (itemId: string) => {
    window.open(`/billing/items/${itemId}`, "_blank");
  };

  // Column definitions - EXACT pattern from ModernPayrollDatesTable
  const columns: ColumnDef<any>[] = [
    {
      id: "serviceName",
      key: "serviceName",
      label: "Service",
      essential: true,
      sortable: true,
      render: (serviceName, row) => {
        const CategoryIcon = getServiceCategoryIcon(
          row.service?.category || "default"
        );

        return (
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <CategoryIcon className="h-4 w-4 text-neutral-500 flex-shrink-0" />
              <div className="font-medium text-neutral-900 dark:text-neutral-100">
                {serviceName || row.service?.name}
              </div>
            </div>
            {row.description && (
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {row.description}
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: "staffUser",
      key: "staffUserId",
      label: "Staff Member",
      essential: true,
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-neutral-500" />
          <div className="text-neutral-500 dark:text-neutral-400">
            {row.staffUser?.computedName ||
              `${row.staffUser?.firstName || ""} ${row.staffUser?.lastName || ""}`.trim() ||
              "Unknown"}
          </div>
        </div>
      ),
    },
    {
      id: "quantity",
      key: "quantity",
      label: "Quantity",
      essential: true,
      sortable: true,
      render: (quantity, row) => (
        <div className="min-w-0">
          <div className="font-mono text-sm font-medium">
            {quantity} {row.service?.billingUnit || "units"}
          </div>
          {row.hourlyRate && (
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              @ {formatCurrency(row.hourlyRate)}/hr
            </div>
          )}
        </div>
      ),
    },
    {
      id: "amount",
      key: "totalAmount",
      label: "Amount",
      essential: true,
      sortable: true,
      render: (amount, row) => (
        <div className="min-w-0">
          <div className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
            {formatCurrency(amount)}
          </div>
          {row.unitPrice && row.quantity && (
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {formatCurrency(row.unitPrice)} × {row.quantity}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "status",
      key: "status",
      label: "Status",
      essential: true,
      sortable: true,
      render: status => {
        const config = getBillingStatusConfig(status);
        return (
          <Badge className={config.color}>
            <config.icon className="h-3 w-3 mr-1" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
  ];

  // Row actions - same pattern as payroll dates table
  const rowActions: RowAction<any>[] = [
    {
      id: "approve",
      label: "Approve",
      icon: CheckCircle,
      onClick: row => handleApproveItem(row.id),
      // Conditional visibility handled in UI
    },
    {
      id: "reject",
      label: "Reject",
      icon: AlertTriangle,
      onClick: row => handleRejectItem(row.id),
      // Conditional visibility handled in UI
    },
    {
      id: "edit",
      label: "Edit",
      icon: Edit,
      onClick: row => handleEditItem(row.id),
      // Conditional visibility handled in UI
    },
    {
      id: "viewDetails",
      label: "View Details",
      icon: Eye,
      onClick: row => handleViewDetails(row.id),
    },
  ];

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-neutral-500" />
            Billing Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border rounded-lg animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error && !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-neutral-500" />
            Billing Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              Failed to Load Billing Items
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              {error.message}
            </p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
              <DollarSign className="h-5 w-5 text-neutral-500" />
              Billing Items
            </CardTitle>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Services and time billed for this payroll
            </p>
          </div>

          {/* Action buttons and filters */}
          <div className="flex items-center gap-3">
            {/* Create button */}
            <Button
              onClick={() => setShowCreateDialog(true)}
              disabled={!clientId}
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Billing Item
            </Button>

            {/* Filter buttons - EXACT pattern from payroll dates table */}
            <div className="flex items-center gap-2">
              <Button
                variant={filterStatus === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("pending")}
              >
                Pending
              </Button>
              <Button
                variant={filterStatus === "approved" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("approved")}
              >
                Approved
              </Button>
              <Button
                variant={filterStatus === "draft" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("draft")}
              >
                Draft
              </Button>
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("all")}
              >
                All Items
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ModernDataTable
          data={filteredItems}
          columns={columns}
          loading={loading}
          searchable
          searchPlaceholder="Search billing items..."
          rowActions={rowActions}
          emptyState={
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                No billing items found
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                {filterStatus !== "all"
                  ? `No ${filterStatus} billing items for this payroll`
                  : "Billing items will appear here when services are completed and billed"}
              </p>
            </div>
          }
        />
      </CardContent>

      {/* Create Billing Item Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create Billing Item</DialogTitle>
            <DialogDescription>
              Add a new billing item for {payroll?.name} (
              {payroll?.client?.name})
            </DialogDescription>
          </DialogHeader>
          {clientId && (
            <BillingItemForm
              mode="create"
              clientId={clientId}
              payrollId={payrollId}
              onSave={handleCreateSuccess}
              onCancel={() => setShowCreateDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
