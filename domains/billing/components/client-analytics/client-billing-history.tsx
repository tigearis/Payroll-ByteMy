"use client";

import { useQuery, useMutation } from "@apollo/client";
import {
  FileText,
  Download,
  Mail,
  Eye,
  AlertTriangle,
  Clock,
  CheckCircle,
  DollarSign,
  Calendar,
  RefreshCw,
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { safeFormatDate } from "@/lib/utils/date-utils";
import {
  GetClientInvoiceHistoryDocument,
  ResendInvoiceDocument,
} from "../../graphql/generated/graphql";
import { 
  getInvoiceStatusConfig, 
  formatCurrency,
} from "../../utils/status-config";

interface ClientBillingHistoryProps {
  clientId: string;
  clientName?: string;
}

export function ClientBillingHistory({ clientId, clientName }: ClientBillingHistoryProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'sent' | 'paid' | 'overdue'>('all');
  
  // Use same GraphQL query pattern as existing components
  const { data, loading, error, refetch } = useQuery(GetClientInvoiceHistoryDocument, {
    variables: { clientId },
    fetchPolicy: "cache-and-network",
    skip: !clientId,
  });

  // GraphQL mutations for invoice actions
  const [resendInvoice] = useMutation(ResendInvoiceDocument, {
    onCompleted: () => {
      toast.success('Invoice resent successfully');
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to resend invoice: ${error.message}`);
    }
  });

  // Note: Download functionality will be implemented via API endpoints
  // const [downloadInvoice] = useMutation(DownloadInvoiceDocument, ...);

  const invoices = data?.clientInvoices || [];
  
  // Same filtering pattern as other tables
  const filteredInvoices = useMemo(() => {
    switch (filterStatus) {
      case 'pending':
        return invoices.filter(invoice => invoice.status === 'pending');
      case 'sent':
        return invoices.filter(invoice => invoice.status === 'sent');
      case 'paid':
        return invoices.filter(invoice => invoice.status === 'paid');
      case 'overdue':
        return invoices.filter(invoice => invoice.status === 'overdue');
      default:
        return invoices;
    }
  }, [invoices, filterStatus]);

  // Action handlers
  const handleResendInvoice = async (invoiceId: string) => {
    try {
      await resendInvoice({
        variables: { invoiceId }
      });
    } catch (error) {
      console.error('Error resending invoice:', error);
    }
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      // This will be implemented via API endpoint
      console.log('Download invoice via API:', invoiceId);
      toast.success('Download functionality will be implemented via API endpoint');
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  const handleViewInvoice = (invoiceId: string) => {
    console.log('View invoice details:', invoiceId);
    // TODO: Implement invoice preview modal or navigation
  };

  // Column definitions - following ModernDataTable pattern
  const columns: ColumnDef<any>[] = [
    {
      id: "invoiceNumber",
      key: "invoiceNumber",
      label: "Invoice #",
      essential: true,
      sortable: true,
      render: (invoiceNumber, row) => (
        <div className="min-w-0">
          <div className="font-mono font-medium text-neutral-900 dark:text-neutral-100">
            {invoiceNumber}
          </div>
          {/* Reference field not available in current schema */}
        </div>
      ),
    },
    {
      id: "invoiceDate",
      key: "invoiceDate",
      label: "Date",
      essential: true,
      sortable: true,
      render: (date, row) => (
        <div className="min-w-0">
          <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
            <Calendar className="h-3 w-3" />
            <span>{safeFormatDate(date, "dd MMM yyyy")}</span>
          </div>
          {row.dueDate && (
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Due: {safeFormatDate(row.dueDate, "dd MMM yyyy")}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "totalAmount",
      key: "totalAmount",
      label: "Amount",
      essential: true,
      sortable: true,
      render: (amount, row) => (
        <div className="min-w-0">
          <div className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
            {formatCurrency(amount)}
          </div>
          {/* Paid amount calculated differently - using paidAt field instead */}
          {row.paidAt && (
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">
              Paid: {safeFormatDate(row.paidAt, "dd MMM yyyy")}
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
      render: (status, row) => {
        const config = getInvoiceStatusConfig(status);
        return (
          <div className="min-w-0">
            <Badge className={config.color}>
              <config.icon className="h-3 w-3 mr-1" />
              {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
            </Badge>
            {row.paidAt && status === 'paid' && (
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Paid: {safeFormatDate(row.paidAt, "dd MMM")}
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: "billingPeriod",
      key: "billingPeriod",
      label: "Period",
      essential: false,
      render: (period, row) => (
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          {row.billingPeriodStart && row.billingPeriodEnd ? 
            `${safeFormatDate(row.billingPeriodStart, "MMM yyyy")} - ${safeFormatDate(row.billingPeriodEnd, "MMM yyyy")}` : 
            '—'
          }
        </div>
      ),
    },
  ];

  // Row actions - same pattern as other tables
  const rowActions: RowAction<any>[] = [
    {
      id: "view",
      label: "View Details",
      icon: Eye,
      onClick: (row) => handleViewInvoice(row.id),
    },
    {
      id: "download",
      label: "Download PDF",
      icon: Download,
      onClick: (row) => handleDownloadInvoice(row.id),
    },
    {
      id: "resend",
      label: "Resend Email",
      icon: Mail,
      onClick: (row) => handleResendInvoice(row.id),
    },
  ];

  // Loading state
  if (loading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-neutral-500" />
            Invoice History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                <div className="flex items-center gap-3">
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
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-neutral-500" />
            Invoice History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              Failed to Load Invoice History
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
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
              <FileText className="h-5 w-5 text-neutral-500" />
              Invoice History
            </CardTitle>
            <CardDescription>
              Past invoices and payment status for {clientName || 'this client'}
            </CardDescription>
          </div>
          
          {/* Filter buttons - same pattern as other tables */}
          <div className="flex items-center gap-2">
            <Button
              variant={filterStatus === 'sent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('sent')}
            >
              Sent
            </Button>
            <Button
              variant={filterStatus === 'overdue' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('overdue')}
            >
              Overdue
            </Button>
            <Button
              variant={filterStatus === 'paid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('paid')}
            >
              Paid
            </Button>
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
            >
              All Invoices
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <ModernDataTable
          data={filteredInvoices}
          columns={columns}
          loading={loading}
          searchable
          searchPlaceholder="Search invoices..."
          rowActions={rowActions}
          emptyState={
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                No invoices found
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                {filterStatus !== 'all' 
                  ? `No ${filterStatus} invoices for this client` 
                  : 'Invoice history will appear here once billing begins'
                }
              </p>
            </div>
          }
        />
      </CardContent>
    </Card>
  );
}