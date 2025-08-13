// app/(dashboard)/clients/[id]/page.tsx
"use client";

import { useQuery, useMutation } from "@apollo/client";
import {
  Edit,
  Plus,
  RefreshCw,
  Users,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  CheckCircle,
  AlertTriangle,
  X,
  Save,
  Upload,
  Eye,
  Clock,
  FileText,
  Calculator,
  UserCheck,
  User,
  ArrowUp,
  ArrowDown,
  Minus,
  Target,
  Receipt,
  FileBarChart,
  History,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import {
  ModernDataTable,
  type ColumnDef,
  type RowAction,
} from "@/components/data";
import { DocumentList, DocumentUploadModal } from "@/components/documents";
import { PageHeader } from "@/components/patterns/page-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientBillingHistory } from "@/domains/billing/components/client-analytics/client-billing-history";
import { ClientBillingMetrics } from "@/domains/billing/components/client-analytics/client-billing-metrics";
import { ClientServiceAgreements } from "@/domains/billing/components/service-catalog/client-service-agreements";
import {
  GetClientByIdDocument,
  UpdateClientDocument,
  UpdateClientStatusDocument,
  ArchiveClientDocument,
  type GetClientByIdQuery,
} from "@/domains/clients/graphql/generated/graphql";
import { QuickEmailDialog } from "@/domains/email/components/quick-email-dialog";
import { NotesListWithAdd } from "@/domains/notes/components/notes-list";
import { type PayrollListItemFragment } from "@/domains/payrolls/graphql/generated/graphql";
import { getEnhancedScheduleSummary } from "@/domains/payrolls/utils/schedule-helpers";
import { useSmartPolling } from "@/hooks/use-polling";
import { cn } from "@/lib/utils";
import { safeFormatDate } from "@/lib/utils/date-utils";

// EnhancedMetricCard component - EXACT copy from PayrollOverview
function EnhancedMetricCard({
  title,
  value,
  subtitle,
  icon: IconComponent,
  trend,
  trendValue,
  status = "neutral",
  onClick,
  children,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  status?: "good" | "warning" | "critical" | "neutral";
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  const statusStyles = {
    good: "bg-green-50 border-green-200 hover:bg-green-100",
    warning: "bg-amber-50 border-amber-200 hover:bg-amber-100",
    critical: "bg-red-50 border-red-200 hover:bg-red-100",
    neutral: "bg-white border-gray-200 hover:bg-gray-50",
  };

  const trendStyles = {
    up: "text-green-600 bg-green-100",
    down: "text-red-600 bg-red-100",
    stable: "text-gray-600 bg-gray-100",
  };

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
        statusStyles[status],
        onClick && "hover:border-blue-300"
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
          {title}
        </CardTitle>
        <div className="relative">
          <IconComponent className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
          {status === "critical" && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors">
              {value}
            </div>
            {trend && trendValue && (
              <div
                className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                  trendStyles[trend]
                )}
                title="Trend from previous period"
              >
                {trend === "up" && <ArrowUp className="w-3 h-3" />}
                {trend === "down" && <ArrowDown className="w-3 h-3" />}
                {trend === "stable" && <Minus className="w-3 h-3" />}
                <span>{trendValue}</span>
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground group-hover:text-gray-600 transition-colors">
            {subtitle}
          </p>

          {children}
        </div>
      </CardContent>
    </Card>
  );
}

// Payroll status configuration (same as payrolls page)
const getStatusConfig = (status: string) => {
  const configs = {
    Implementation: {
      color: "bg-muted text-foreground border-border",
      icon: Clock,
      progress: 15,
    },
    Active: {
      color: "bg-success-500/10 text-success-600 border-success-500/20",
      icon: CheckCircle,
      progress: 100,
    },
    Inactive: {
      color: "bg-muted text-muted-foreground border-border",
      icon: AlertTriangle,
      progress: 0,
    },
    draft: {
      color: "bg-warning-500/10 text-warning-600 border-warning-500/20",
      icon: FileText,
      progress: 10,
    },
    "data-entry": {
      color: "bg-primary/10 text-primary border-primary/20",
      icon: Calculator,
      progress: 30,
    },
    review: {
      color: "bg-accent text-accent-foreground border-border",
      icon: Eye,
      progress: 50,
    },
    processing: {
      color: "bg-primary/10 text-primary border-primary/20",
      icon: RefreshCw,
      progress: 70,
    },
    "manager-review": {
      color: "bg-warning-500/10 text-warning-600 border-warning-500/20",
      icon: UserCheck,
      progress: 85,
    },
    approved: {
      color: "bg-success-500/10 text-success-600 border-success-500/20",
      icon: CheckCircle,
      progress: 95,
    },
    submitted: {
      color: "bg-primary/10 text-primary border-primary/20",
      icon: Upload,
      progress: 100,
    },
    paid: {
      color: "bg-success-500/10 text-success-600 border-success-500/20",
      icon: CheckCircle,
      progress: 100,
    },
    "on-hold": {
      color: "bg-warning-500/10 text-warning-600 border-warning-500/20",
      icon: AlertTriangle,
      progress: 60,
    },
    cancelled: {
      color: "bg-destructive/10 text-destructive border-destructive/20",
      icon: AlertTriangle,
      progress: 0,
    },
  } as const;

  return configs[status as keyof typeof configs] || configs["Implementation"];
};

export default function ClientDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  // State management
  const [activeTab, setActiveTab] = useState(() => {
    // Initialize from URL hash if available, default to "payrolls"
    if (typeof window !== "undefined") {
      const hash = window.location.hash.slice(1);
      return ["payrolls", "billing", "documents"].includes(hash)
        ? hash
        : "payrolls";
    }
    return "payrolls";
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPayrolls, setSelectedPayrolls] = useState<string[]>([]);
  const [showEmailDialog, setShowEmailDialog] = useState(false);

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    name: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    active: true,
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // GraphQL operations
  const { loading, error, data, refetch, startPolling, stopPolling } = useQuery(
    GetClientByIdDocument,
    {
      variables: { id },
      skip: !id,
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      pollInterval: 60000,
    }
  );

  const [updateClient] = useMutation(UpdateClientDocument, {
    refetchQueries: [{ query: GetClientByIdDocument, variables: { id } }],
  });

  const [updateClientStatus] = useMutation(UpdateClientStatusDocument, {
    refetchQueries: [{ query: GetClientByIdDocument, variables: { id } }],
  });

  // Archive client functionality (soft delete)
  const [archiveClient] = useMutation(ArchiveClientDocument, {
    onCompleted: () => {
      // Redirect to clients list after successful archival
      window.location.href = "/clients";
    },
  });

  // Use smart polling hook
  useSmartPolling(
    { startPolling, stopPolling, refetch },
    {
      defaultInterval: 60000,
      pauseOnHidden: true,
      refetchOnVisible: true,
    }
  );

  // Export listener for client's payrolls - moved to top level to ensure consistent hook order
  useEffect(() => {
    // Only set up listener if we're on payrolls tab and have data
    if (activeTab !== "payrolls" || !data?.client?.payrollHistory) {
      return;
    }

    const client = data.client;
    const exportListenerId = "client:export-payrolls";
    const handler = () => {
      const transformPayrollData = (payrolls: any[]) => {
        return payrolls.map(payroll => {
          const payrollDatesTotal = 0;
          const totalEmployees =
            payrollDatesTotal > 0
              ? payrollDatesTotal
              : payroll.employeeCount || 0;

          return {
            ...payroll,
            employeeCount: totalEmployees,
            payrollSchedule: getEnhancedScheduleSummary(payroll),
            priority:
              totalEmployees > 50
                ? "high"
                : totalEmployees > 20
                  ? "medium"
                  : "low",
            lastUpdated: new Date(
              payroll.updatedAt || payroll.createdAt || new Date()
            ),
            backupConsultantName:
              payroll.backupConsultant?.computedName ||
              (payroll.backupConsultant
                ? `${payroll.backupConsultant.firstName} ${payroll.backupConsultant.lastName}`
                : "Unassigned"),
          };
        });
      };

      const rows = transformPayrollData(client.payrollHistory || []);

      const getNextEftDisplay = (r: any) => {
        const next = r.nextPayrollDate?.[0];
        if (!next) return "—";
        const raw = next.adjustedEftDate || next.originalEftDate;
        return raw ? safeFormatDate(raw, "dd MMM yyyy") : "—";
      };

      const headers = [
        "Payroll",
        "Status",
        "Consultant",
        "Schedule",
        "Next EFT",
        "Employees",
      ];
      const escape = (val: unknown) => {
        const s = String(val ?? "");
        const escaped = s.replace(/"/g, '""');
        return `"${escaped}"`;
      };
      const rowsCsv = rows.map(r => [
        escape((r as any).name),
        escape((r as any).status ?? ""),
        escape(
          (r as any).primaryConsultant?.computedName ||
            ((r as any).primaryConsultant
              ? `${(r as any).primaryConsultant.firstName ?? ""} ${(r as any).primaryConsultant.lastName ?? ""}`.trim()
              : "")
        ),
        escape((r as any).payrollSchedule ?? ""),
        escape(getNextEftDisplay(r as any)),
        escape((r as any).employeeCount ?? 0),
      ]);
      const csv = [
        headers.map(escape).join(","),
        ...rowsCsv.map(r => r.join(",")),
      ].join("\n");
      const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `client-${client?.name || id}-payrolls-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    window.addEventListener(exportListenerId, handler as EventListener);

    return () =>
      window.removeEventListener(exportListenerId, handler as EventListener);
  }, [activeTab, data?.client?.payrollHistory, data?.client?.name, id]);

  // Loading component
  function ClientDetailLoading() {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header skeleton */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <Skeleton className="h-4 w-32" />
            </div>

            <div className="pb-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-16 h-16 rounded-xl" />
                    <div className="flex-1 min-w-0">
                      <Skeleton className="h-8 w-64 mb-4" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-36" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Overview cards skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-4" />
                      </div>
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Other sections skeleton */}
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (loading && !data) {
    return <ClientDetailLoading />;
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <AlertTriangle className="w-12 h-12 mx-auto text-destructive" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Failed to Load Client
            </h1>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <Button onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const client = data?.client;

  // Type for client data - extract from query result
  type ClientData = NonNullable<GetClientByIdQuery["client"]>;

  // Debug: Log client data to see what we're getting
  console.log("Client details data:", {
    loading,
    error,
    client,
    clientKeys: client ? Object.keys(client) : [],
    payrollHistory: client?.payrollHistory,
    payrollHistoryLength: client?.payrollHistory?.length,
  });

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-gray-400" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Client Not Found
            </h1>
            <p className="text-gray-600">
              The client you're looking for doesn't exist or you don't have
              permission to view it.
            </p>
          </div>

          <Button asChild>
            <Link href="/clients">← Back to Clients</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(amount || 0);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-success-500/10 text-success-600 border-success-500/20";
      case "inactive":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "pending":
        return "bg-warning-500/10 text-warning-600 border-warning-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-destructive";
      case "medium":
        return "text-warning-600";
      case "low":
        return "text-success-600";
      default:
        return "text-muted-foreground";
    }
  };

  // Transform payroll data (same as payrolls page)
  const transformPayrollData = (payrolls: PayrollListItemFragment[]) => {
    return payrolls.map(payroll => {
      // PayrollDates don't have employeeCount - use payroll's employeeCount directly
      const payrollDatesTotal = 0;

      const totalEmployees =
        payrollDatesTotal > 0 ? payrollDatesTotal : payroll.employeeCount || 0;

      return {
        ...payroll,
        employeeCount: totalEmployees,
        payrollSchedule: getEnhancedScheduleSummary(payroll),
        priority:
          totalEmployees > 50 ? "high" : totalEmployees > 20 ? "medium" : "low",
        progress: getStatusConfig(payroll.status || "Implementation").progress,
        lastUpdated: new Date(
          payroll.updatedAt || payroll.createdAt || new Date()
        ),
        // Store backup consultant name for easy access in UI
        backupConsultantName:
          payroll.backupConsultant?.computedName ||
          (payroll.backupConsultant
            ? `${payroll.backupConsultant.firstName} ${payroll.backupConsultant.lastName}`
            : "Unassigned"),
      };
    });
  };

  // Handle payroll selection
  const handleSelectAll = (
    checked: boolean,
    payrolls: PayrollListItemFragment[]
  ) => {
    if (checked) {
      setSelectedPayrolls(payrolls.map(p => p.id));
    } else {
      setSelectedPayrolls([]);
    }
  };

  const handleSelectPayroll = (payrollId: string, checked: boolean) => {
    if (checked) {
      setSelectedPayrolls([...selectedPayrolls, payrollId]);
    } else {
      setSelectedPayrolls(selectedPayrolls.filter(id => id !== payrollId));
    }
  };

  const handleDeleteClient = async () => {
    try {
      archiveClient({ variables: { id } });
    } catch (error) {
      console.error("Error archiving client:", error);
    }
  };

  // Handle opening edit dialog
  const handleEditClient = () => {
    if (!client) return;

    setEditFormData({
      name: client.name || "",
      contactPerson: client.contactPerson || "",
      contactEmail: client.contactEmail || "",
      contactPhone: client.contactPhone || "",
      active: client.active ?? true,
    });
    setShowEditDialog(true);
  };

  // Handle closing edit dialog
  const handleCloseEditDialog = () => {
    setShowEditDialog(false);
    setEditFormData({
      name: "",
      contactPerson: "",
      contactEmail: "",
      contactPhone: "",
      active: true,
    });
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string | boolean) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle updating client
  const handleUpdateClient = async () => {
    if (!editFormData.name.trim()) {
      return;
    }

    setIsUpdating(true);
    try {
      // Update client basic info (name, email, phone)
      await updateClient({
        variables: {
          id,
          set: {
            name: editFormData.name.trim(),
            contactEmail: editFormData.contactEmail.trim() || null,
            contactPhone: editFormData.contactPhone.trim() || null,
            contactPerson: editFormData.contactPerson.trim() || null,
          },
        },
      });

      // Update client status if it changed
      if (client?.active !== editFormData.active) {
        await updateClientStatus({
          variables: {
            id,
            active: editFormData.active,
          },
        });
      }

      setShowEditDialog(false);
      // Optionally show success message
    } catch (error) {
      console.error("Error updating client:", error);
      // Optionally show error message
    } finally {
      setIsUpdating(false);
    }
  };

  // Calculate client statistics
  const activePayrolls =
    client?.payrollHistory?.filter(p => !p.supersededDate)?.length || 0;
  const totalPayrolls = client?.payrollHistory?.length || 0;
  const totalEmployees =
    client?.payrollHistory?.reduce((sum: number, p) => {
      // PayrollDates don't have employeeCount - use payroll's employeeCount directly
      const employeeCount = p.employeeCount || 0;
      return sum + employeeCount;
    }, 0) || 0;
  // Note: estimated_monthly_value field doesn't exist in database, setting to 0
  const estimatedMonthlyValue = 0;

  return (
    <PermissionGuard action="read">
      <div className="container mx-auto py-6 space-y-6">
        <PageHeader
          title={client?.name || "Client Details"}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Clients", href: "/clients" },
            { label: client?.name || "Client" },
          ]}
          status={{
            type: client?.active ? "success" : "warning",
            message: client?.active ? "Active" : "Inactive",
          }}
          actions={[
            {
              label: "Edit Client",
              icon: Edit,
              onClick: handleEditClient,
              primary: true,
            },
            {
              label: "New Payroll",
              icon: Plus,
              onClick: () =>
                (window.location.href = `/payrolls/new?client=${id}`),
            },
          ]}
          overflowActions={[
            {
              label: "Email Client",
              icon: Mail,
              onClick: () => setShowEmailDialog(true),
            },
            {
              label: "Upload Document",
              icon: Upload,
              onClick: () => setShowUploadModal(true),
            },
            {
              label: "Export Payrolls",
              onClick: () =>
                window.dispatchEvent(new CustomEvent("client:export-payrolls")),
            },
            {
              label: "View Invoice History",
              icon: History,
              onClick: () => {
                // Navigate to billing tab
                setActiveTab("billing");
                console.log("View invoice history for client:", id);
              },
            },
            {
              label: "Generate Statement",
              icon: Receipt,
              onClick: () => {
                // Navigate to billing tab and trigger statement generation
                setActiveTab("billing");
                console.log("Generate statement for client:", id);
              },
            },
            {
              label: "Export Billing Report",
              icon: FileBarChart,
              onClick: () => {
                // Navigate to billing tab
                setActiveTab("billing");
                console.log("Export billing report for client:", id);
              },
            },
          ]}
        />

        {/* Additional Header Info */}
        <div className="bg-white border-b border-gray-200 -mt-6 pt-4 pb-4">
          <div className="container mx-auto">
            <div className="flex flex-col space-y-4">
              {/* Contact Details Row */}
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  {client.contactPerson && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Contact:</span>
                      <span className="text-foreground font-medium">
                        {client.contactPerson}
                      </span>
                    </div>
                  )}

                  {client.contactEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Email:</span>
                      <span className="text-foreground font-medium">
                        {client.contactEmail}
                      </span>
                    </div>
                  )}

                  {client.contactPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="text-foreground font-medium">
                        {client.contactPhone}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Dates Row */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                {client.createdAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Created:</span>
                    <span className="text-foreground font-medium">
                      {safeFormatDate(client.createdAt)}
                    </span>
                  </div>
                )}

                {client.updatedAt && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Updated:</span>
                    <span className="text-foreground font-medium">
                      {safeFormatDate(client.updatedAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Metric Cards - Expanded to 6 cards in 2 rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Row 1: Existing Core Metrics */}
          {/* Active Payrolls Card */}
          <EnhancedMetricCard
            title="Active Payrolls"
            value={activePayrolls.toString()}
            subtitle={`${totalPayrolls} total payrolls`}
            icon={Calendar}
            status={activePayrolls > 0 ? "good" : "critical"}
            trend={activePayrolls > totalPayrolls * 0.7 ? "up" : "stable"}
            trendValue={
              activePayrolls > totalPayrolls * 0.7 ? "Growing" : "Stable"
            }
            onClick={() => (window.location.href = `/payrolls?clientId=${id}`)}
          >
            <div className="flex items-center gap-1 text-xs text-gray-600 mt-2">
              <Target className="h-3 w-3" />
              <span>
                {activePayrolls === 0
                  ? "No active payrolls"
                  : activePayrolls === 1
                    ? "Single payroll client"
                    : activePayrolls > 3
                      ? "Multi-payroll client"
                      : "Standard client"}
              </span>
            </div>
          </EnhancedMetricCard>

          {/* Total Employees Card */}
          <EnhancedMetricCard
            title="Total Employees"
            value={totalEmployees.toString()}
            subtitle="Across all payrolls"
            icon={Users}
            status={totalEmployees > 0 ? "good" : "warning"}
            trend={
              totalEmployees > 50
                ? "up"
                : totalEmployees > 10
                  ? "stable"
                  : "down"
            }
            trendValue={
              totalEmployees > 50
                ? "Large client"
                : totalEmployees > 10
                  ? "Medium client"
                  : "Small client"
            }
            onClick={() => (window.location.href = `/staff?clientId=${id}`)}
          >
            <div className="flex items-center gap-1 text-xs text-gray-600 mt-2">
              <Users className="h-3 w-3" />
              <span>
                {totalEmployees === 0
                  ? "No employees yet"
                  : totalEmployees > 100
                    ? "Enterprise client"
                    : totalEmployees > 20
                      ? "Growing business"
                      : "Small business"}
              </span>
            </div>
          </EnhancedMetricCard>

          {/* Monthly Value Card */}
          <EnhancedMetricCard
            title="Monthly Value"
            value={formatCurrency(estimatedMonthlyValue)}
            subtitle="Estimated revenue"
            icon={DollarSign}
            status={
              estimatedMonthlyValue > 1000
                ? "good"
                : estimatedMonthlyValue > 500
                  ? "neutral"
                  : "warning"
            }
            trend={estimatedMonthlyValue > 2000 ? "up" : "stable"}
            trendValue={
              estimatedMonthlyValue > 2000 ? "High value" : "Standard"
            }
            onClick={() => (window.location.href = `/billing?clientId=${id}`)}
          >
            <div className="flex items-center gap-1 text-xs text-gray-600 mt-2">
              <DollarSign className="h-3 w-3" />
              <span>
                {estimatedMonthlyValue === 0
                  ? "Setup pending"
                  : estimatedMonthlyValue > 5000
                    ? "Premium client"
                    : estimatedMonthlyValue > 1000
                      ? "Standard client"
                      : "Basic client"}
              </span>
            </div>
          </EnhancedMetricCard>

          {/* Row 2: Billing-Specific Metrics */}
          <ClientBillingMetrics
            clientId={id}
            parentLoading={loading && !data}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={value => {
            setActiveTab(value);
            // Update URL hash
            if (typeof window !== "undefined") {
              window.location.hash = value;
            }
          }}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-3 bg-muted shadow-md rounded-lg">
            <TabsTrigger
              value="payrolls"
              className="data-[state=active]:bg-card data-[state=active]:text-foreground hover:bg-accent transition-all text-foreground"
            >
              Payrolls ({totalPayrolls})
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="data-[state=active]:bg-card data-[state=active]:text-foreground hover:bg-accent transition-all text-foreground"
            >
              Billing & Services
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="data-[state=active]:bg-card data-[state=active]:text-foreground hover:bg-accent transition-all text-foreground"
            >
              Notes & Documents
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="documents" className="space-y-6">
            <NotesListWithAdd
              entityType="client"
              entityId={id}
              title="Client Notes"
              description={`Notes and comments about ${client?.name}`}
            />
            <DocumentList
              clientId={id}
              showFilters={true}
              showUploadButton={true}
              onUploadClick={() => setShowUploadModal(true)}
              onDocumentUpdate={() => {
                // Refresh when documents are updated or deleted
                window.location.reload();
              }}
            />
          </TabsContent>

          {/* Payrolls Tab */}
          <TabsContent value="payrolls">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Client Payrolls</CardTitle>
                    <CardDescription>
                      Manage payrolls associated with {client?.name}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {(() => {
                  const rows = transformPayrollData(
                    client?.payrollHistory || []
                  );

                  type Row = (typeof rows)[number];
                  const getNextEftDisplay = (r: any) => {
                    const next = r.nextPayrollDate?.[0];
                    if (!next) return "—";
                    const raw = next.adjustedEftDate || next.originalEftDate;
                    return raw ? safeFormatDate(raw, "dd MMM yyyy") : "—";
                  };

                  const columns: ColumnDef<Row>[] = [
                    {
                      id: "name",
                      key: "name",
                      label: "Payroll",
                      essential: true,
                      sortable: true,
                    },
                    {
                      id: "status",
                      key: "status",
                      label: "Status",
                      essential: true,
                    },
                    {
                      id: "primaryConsultant",
                      key: "primaryConsultant",
                      label: "Consultant",
                      essential: true,
                      render: (_v, r) =>
                        r.primaryConsultant?.computedName ||
                        (r.primaryConsultant
                          ? `${r.primaryConsultant.firstName ?? ""} ${
                              r.primaryConsultant.lastName ?? ""
                            }`.trim()
                          : "Unassigned"),
                    },
                    {
                      id: "payrollSchedule",
                      key: "payrollSchedule",
                      label: "Schedule",
                      essential: true,
                    },
                    {
                      id: "nextEftDate",
                      key: "name",
                      label: "Next EFT",
                      essential: true,
                      render: (_v, r) => getNextEftDisplay(r),
                    },
                    {
                      id: "employeeCount",
                      key: "employeeCount",
                      label: "Employees",
                      essential: true,
                    },
                  ];

                  const onRowClick = (row: Row) => {
                    window.location.href = `/payrolls/${row.id}`;
                  };

                  const rowActions: RowAction<Row>[] = [
                    {
                      id: "view",
                      label: "View",
                      onClick: r =>
                        (window.location.href = `/payrolls/${r.id}`),
                    },
                    {
                      id: "edit",
                      label: "Edit",
                      onClick: r =>
                        (window.location.href = `/payrolls/${r.id}/edit?returnTo=/clients/${id}%23payrolls`),
                    },
                  ];

                  if (!rows || rows.length === 0) {
                    return (
                      <div className="py-12 text-center space-y-3">
                        <Calendar className="w-10 h-10 mx-auto text-muted-foreground/70" />
                        <div className="text-foreground font-medium">
                          No payrolls yet
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Create your first payroll for this client to get
                          started
                        </div>
                        <div className="pt-2">
                          <PermissionGuard action="create">
                            <Button
                              onClick={() =>
                                (window.location.href = `/payrolls/new?client=${id}`)
                              }
                            >
                              <Plus className="w-4 h-4 mr-2" /> New Payroll
                            </Button>
                          </PermissionGuard>
                        </div>
                      </div>
                    );
                  }

                  const renderCardItem = (row: Row) => {
                    const statusConfig = getStatusConfig(
                      row.status || "Implementation"
                    );
                    const employeeCount = row.employeeCount || 0;

                    return (
                      <Card className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <Link
                                href={`/payrolls/${row.id}`}
                                className="font-semibold text-primary hover:text-primary/90 block truncate"
                              >
                                {row.name}
                              </Link>
                            </div>
                            <div className="shrink-0">
                              <Badge className={statusConfig.color}>
                                {row.status || "Implementation"}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <span className="text-xs text-muted-foreground">
                                Schedule
                              </span>
                              <div className="text-sm font-medium truncate">
                                {row.payrollSchedule}
                              </div>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground">
                                Next EFT
                              </span>
                              <div className="text-sm font-medium flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                {getNextEftDisplay(row)}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <span className="text-xs text-muted-foreground">
                                Consultant
                              </span>
                              <div className="text-sm font-medium flex items-center gap-1 truncate">
                                <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                <span className="truncate">
                                  {row.primaryConsultant?.computedName ||
                                    (row.primaryConsultant
                                      ? `${row.primaryConsultant.firstName ?? ""} ${
                                          row.primaryConsultant.lastName ?? ""
                                        }`.trim()
                                      : "Unassigned")}
                                </span>
                              </div>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground">
                                Employees
                              </span>
                              <div className="text-sm font-medium flex items-center gap-1">
                                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="font-mono font-semibold">
                                  {employeeCount}
                                </span>
                              </div>
                            </div>
                          </div>

                          {row.backupConsultant && (
                            <div className="pt-2 border-t">
                              <span className="text-xs text-muted-foreground">
                                Backup Consultant
                              </span>
                              <div className="text-sm font-medium flex items-center gap-1 mt-0.5 truncate">
                                <UserCheck className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                <span className="truncate">
                                  {row.backupConsultant?.computedName ||
                                    (row.backupConsultant
                                      ? `${row.backupConsultant.firstName ?? ""} ${
                                          row.backupConsultant.lastName ?? ""
                                        }`.trim()
                                      : "Unassigned")}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2 pt-2 border-t">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/payrolls/${row.id}`}>
                                <Eye className="h-3.5 w-3.5 mr-1" /> View
                                Details
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link
                                href={`/payrolls/${row.id}/edit?returnTo=/clients/${id}%23payrolls`}
                              >
                                <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                                Payroll
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  };

                  return (
                    <ModernDataTable
                      data={rows as any}
                      columns={columns as any}
                      rowActions={rowActions as any}
                      onRowClick={onRowClick as any}
                      searchable
                      viewToggle
                      searchPlaceholder="Search payrolls..."
                      renderCardItem={renderCardItem}
                    />
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            {/* Client Service Agreements */}
            <ClientServiceAgreements
              clientId={id}
              clientName={client?.name || ""}
            />

            {/* Client Billing History */}
            <ClientBillingHistory
              clientId={id}
              clientName={client?.name || ""}
            />
          </TabsContent>
        </Tabs>

        {/* Edit Client Dialog */}
        <Dialog open={showEditDialog} onOpenChange={handleCloseEditDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Client</DialogTitle>
              <DialogDescription>
                Make changes to the client information. Click save when
                you&apos;re done.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="client-name">Client Name *</Label>
                <Input
                  id="client-name"
                  placeholder="Enter client name..."
                  value={editFormData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("name", e.target.value)
                  }
                  className="mt-1"
                  disabled={isUpdating}
                />
              </div>

              <div>
                <Label htmlFor="contact-person">Contact Person</Label>
                <Input
                  id="contact-person"
                  placeholder="Enter contact person name..."
                  value={editFormData.contactPerson}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("contactPerson", e.target.value)
                  }
                  className="mt-1"
                  disabled={isUpdating}
                />
              </div>

              <div>
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="Enter contact email..."
                  value={editFormData.contactEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("contactEmail", e.target.value)
                  }
                  className="mt-1"
                  disabled={isUpdating}
                />
              </div>

              <div>
                <Label htmlFor="contact-phone">Contact Phone</Label>
                <Input
                  id="contact-phone"
                  placeholder="Enter contact phone..."
                  value={editFormData.contactPhone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("contactPhone", e.target.value)
                  }
                  className="mt-1"
                  disabled={isUpdating}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={editFormData.active}
                  onCheckedChange={(checked: boolean) =>
                    handleInputChange("active", checked)
                  }
                  disabled={isUpdating}
                />
                <Label
                  htmlFor="active"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Active client
                </Label>
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCloseEditDialog}
                disabled={isUpdating}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleUpdateClient}
                disabled={isUpdating || !editFormData.name.trim()}
              >
                {isUpdating ? (
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Quick Email Dialog */}
        {client && (
          <QuickEmailDialog
            open={showEmailDialog}
            onOpenChange={setShowEmailDialog}
            businessContext={{
              category: "client",
              clientId: id,
              recipientEmails: [client.contactEmail].filter(
                (email): email is string => Boolean(email)
              ),
            }}
            suggestedSubject={`Regarding: ${client.name}`}
            title="Send Client Email"
            description="Send an email to this client regarding their account or payroll services"
          />
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Client</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &quot;{client?.name}
                &quot;? This action cannot be undone and will also remove all
                associated payrolls and data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteClient}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Client
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Document Upload Modal */}
        <DocumentUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          clientId={id}
          onUploadComplete={_documents => {
            // Refresh document list when upload completes
            window.location.reload();
          }}
        />
      </div>
    </PermissionGuard>
  );
}
