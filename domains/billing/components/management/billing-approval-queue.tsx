"use client";

import { useQuery, useMutation } from "@apollo/client";
import {
  UserCheck,
  CheckCircle,
  AlertTriangle,
  Eye,
  User,
  Building2,
  Calendar,
  RefreshCw,
  Filter,
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  ModernDataTable,
  type ColumnDef,
  type RowAction,
} from "@/components/data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { safeFormatDate } from "@/lib/utils/date-utils";
import {
  GetPendingBillingItemsDocument,
  BulkApproveBillingItemsDocument,
  BulkRejectBillingItemsDocument,
  ApproveBillingItemDocument,
  RejectBillingItemDocument,
} from "../../graphql/generated/graphql";
import {
  formatCurrency,
  getServiceCategoryIcon,
} from "../../utils/status-config";

export function BillingApprovalQueue() {
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "high-priority" | "overdue"
  >("pending");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingItems, setRejectingItems] = useState<string[]>([]);

  // Use same GraphQL query pattern as existing components
  const { data, loading, error, refetch } = useQuery(
    GetPendingBillingItemsDocument,
    {
      fetchPolicy: "cache-and-network",
      pollInterval: 30000, // Poll every 30 seconds for real-time updates
    }
  );

  // GraphQL mutations for bulk operations
  const [bulkApproveBillingItems] = useMutation(
    BulkApproveBillingItemsDocument,
    {
      onCompleted: data => {
        toast.success(
          `${data.updateBillingItemsMany?.[0]?.affectedRows || 0} items approved successfully`
        );
        setSelectedItems([]);
        refetch();
      },
      onError: error => {
        toast.error(`Failed to approve items: ${error.message}`);
      },
    }
  );

  const [bulkRejectBillingItems] = useMutation(BulkRejectBillingItemsDocument, {
    onCompleted: data => {
      toast.success(
        `${data.updateBillingItemsMany?.[0]?.affectedRows || 0} items rejected`
      );
      setSelectedItems([]);
      setShowRejectDialog(false);
      setRejectReason("");
      refetch();
    },
    onError: error => {
      toast.error(`Failed to reject items: ${error.message}`);
    },
  });

  const [approveBillingItem] = useMutation(ApproveBillingItemDocument, {
    onCompleted: () => {
      toast.success("Item approved successfully");
      refetch();
    },
    onError: error => {
      toast.error(`Failed to approve item: ${error.message}`);
    },
  });

  const [rejectBillingItem] = useMutation(RejectBillingItemDocument, {
    onCompleted: () => {
      toast.success("Item rejected");
      refetch();
    },
    onError: error => {
      toast.error(`Failed to reject item: ${error.message}`);
    },
  });

  const billingItems = data?.pendingBillingItems || [];

  // Enhanced filtering with priority and date logic
  const filteredItems = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    switch (filterStatus) {
      case "pending":
        return billingItems.filter(item => item.status === "pending");
      case "high-priority":
        return billingItems.filter(
          item => item.status === "pending" && (item.totalAmount || 0) > 5000
        );
      case "overdue":
        return billingItems.filter(
          item =>
            item.status === "pending" && new Date(item.createdAt) < sevenDaysAgo
        );
      default:
        return billingItems.filter(item => item.status === "pending");
    }
  }, [billingItems, filterStatus]);

  // Action handlers
  const handleBulkApproval = async () => {
    if (selectedItems.length === 0) return;

    try {
      await bulkApproveBillingItems({
        variables: {
          ids: selectedItems,
          approvedBy: "current-user-id", // TODO: Get from auth context
        },
      });
    } catch (error) {
      console.error("Error in bulk approval:", error);
    }
  };

  const handleBulkReject = () => {
    if (selectedItems.length === 0) return;
    setRejectingItems(selectedItems);
    setShowRejectDialog(true);
  };

  const confirmBulkReject = async () => {
    if (rejectingItems.length === 0 || !rejectReason.trim()) return;

    try {
      await bulkRejectBillingItems({
        variables: {
          ids: rejectingItems,
          approvedBy: "current-user-id", // TODO: Get from auth context
          notes: rejectReason.trim(),
        },
      });
      setRejectingItems([]);
    } catch (error) {
      console.error("Error in bulk rejection:", error);
    }
  };

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

  const handleRejectItem = async (itemId: string) => {
    setRejectingItems([itemId]);
    setShowRejectDialog(true);
  };

  const handleViewDetails = (itemId: string) => {
    window.open(`/billing/items/${itemId}`, "_blank");
  };

  // Column definitions - comprehensive approval interface
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
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 truncate">
                {row.description}
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: "client",
      key: "clientId",
      label: "Client",
      essential: true,
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-neutral-500" />
          <div className="min-w-0">
            <div className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
              {row.client?.name || "Unknown Client"}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "staffUser",
      key: "staffUserId",
      label: "Staff",
      essential: true,
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-neutral-500" />
          <div className="text-neutral-500 dark:text-neutral-400 truncate">
            {row.staffUser?.computedName ||
              `${row.staffUser?.firstName || ""} ${row.staffUser?.lastName || ""}`.trim() ||
              "Unknown"}
          </div>
        </div>
      ),
    },
    {
      id: "amount",
      key: "totalAmount",
      label: "Amount",
      essential: true,
      sortable: true,
      render: (amount, row) => {
        const isHighValue = amount > 5000;
        const colorClass = isHighValue
          ? "text-red-600 dark:text-red-400"
          : "text-neutral-900 dark:text-neutral-100";

        return (
          <div className="min-w-0">
            <div className={`font-mono font-semibold ${colorClass}`}>
              {formatCurrency(amount)}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {row.quantity} × {formatCurrency(row.unitPrice || 0)}
            </div>
          </div>
        );
      },
    },
    {
      id: "payroll",
      key: "payrollId",
      label: "Payroll",
      essential: true,
      render: (_, row) => (
        <div className="min-w-0">
          <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
            {row.payroll?.name || "Direct Service"}
          </div>
          {row.payroll?.client?.name && (
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 truncate">
              {row.payroll.client.name}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "createdAt",
      key: "createdAt",
      label: "Submitted",
      essential: true,
      sortable: true,
      render: (date, row) => {
        const itemDate = new Date(date);
        const now = new Date();
        const daysDiff = Math.floor(
          (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        return (
          <div className="min-w-0">
            <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
              <Calendar className="h-3 w-3" />
              <span>{safeFormatDate(date, "dd MMM")}</span>
            </div>
            {daysDiff > 3 && (
              <div className="text-xs text-amber-600 mt-1">
                {daysDiff} days ago
              </div>
            )}
          </div>
        );
      },
    },
  ];

  // Row actions for approval queue
  const rowActions: RowAction<any>[] = [
    {
      id: "approve",
      label: "Approve",
      icon: CheckCircle,
      onClick: row => handleApproveItem(row.id),
    },
    {
      id: "reject",
      label: "Reject",
      icon: AlertTriangle,
      onClick: row => handleRejectItem(row.id),
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
            <UserCheck className="h-5 w-5 text-neutral-500" />
            Billing Approval Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border rounded-lg animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
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
            <UserCheck className="h-5 w-5 text-neutral-500" />
            Billing Approval Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              Failed to Load Approval Queue
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              {error.message}
            </p>
            <Button onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                <UserCheck className="h-5 w-5 text-neutral-500" />
                Billing Approval Queue
              </CardTitle>
              <CardDescription>
                Review and approve billing items from your team members
              </CardDescription>
            </div>

            {/* Bulk action buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkReject}
                disabled={selectedItems.length === 0}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Reject Selected ({selectedItems.length})
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleBulkApproval}
                disabled={selectedItems.length === 0}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Selected ({selectedItems.length})
              </Button>
            </div>
          </div>

          {/* Filter buttons */}
          <div className="flex items-center gap-2 pt-4">
            <Filter className="h-4 w-4 text-neutral-500" />
            <Button
              variant={filterStatus === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("pending")}
            >
              All Pending
            </Button>
            <Button
              variant={filterStatus === "high-priority" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("high-priority")}
            >
              High Priority
            </Button>
            <Button
              variant={filterStatus === "overdue" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("overdue")}
            >
              Overdue
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <ModernDataTable
            data={filteredItems}
            columns={columns}
            loading={loading}
            searchable
            // Selection handled via custom state
            searchPlaceholder="Search billing items..."
            // Selection change handled via row actions
            rowActions={rowActions}
            emptyState={
              <div className="text-center py-12">
                <UserCheck className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                  No items awaiting approval
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {filterStatus !== "pending"
                    ? `No ${filterStatus.replace("-", " ")} items found`
                    : "All billing items have been processed"}
                </p>
              </div>
            }
          />
        </CardContent>
      </Card>

      {/* Rejection Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Billing Items</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting{" "}
              {rejectingItems.length > 1 ? "these items" : "this item"}. This
              will be visible to the staff member who submitted them.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="reject-reason">Rejection Reason</Label>
              <Textarea
                id="reject-reason"
                placeholder="Enter reason for rejection..."
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectReason("");
                setRejectingItems([]);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmBulkReject}
              disabled={!rejectReason.trim()}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Reject Items
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
