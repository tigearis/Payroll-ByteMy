// app/(dashboard)/payrolls/[id]/page.tsx
"use client";

import { useMutation, useQuery, useLazyQuery } from "@apollo/client";

// Import role enums

import {
  ArrowLeft,
  Pencil,
  RefreshCw,
  MoreHorizontal,
  Save,
  Download,
  Upload,
  Copy,
  Eye,
  Clock,
  Users,
  Building2,
  CheckCircle,
  AlertTriangle,
  FileText,
  Calculator,
  UserCheck,
  Shield,
  Mail,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
// Lazy load export and modal components
const ExportCsv = dynamic(() => import("@/components/export-csv").then(mod => ({ default: mod.ExportCsv })), {
  loading: () => <Button disabled>Loading...</Button>,
  ssr: false
});

const ExportPdf = dynamic(() => import("@/components/export-pdf").then(mod => ({ default: mod.ExportPdf })), {
  loading: () => <Button disabled>Loading...</Button>,
  ssr: false
});

const SkillsEditModal = dynamic(() => import("@/components/skills-edit-modal").then(mod => ({ default: mod.SkillsEditModal })), {
  loading: () => <div>Loading...</div>,
  ssr: false
});
import { DocumentUploadModal, DocumentList } from "@/components/documents";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PayrollDetailsLoading } from "@/components/ui/loading-states";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { NotesListWithAdd } from "@/domains/notes/components/notes-list";
import { PayrollDatesView } from "@/domains/payrolls/components/payroll-dates-view";
import { PayrollForm, PayrollFormData } from "@/domains/payrolls/components/payroll-form";

// Lazy load heavy billing components
const PayrollBillingInterface = dynamic(
  () => import("@/domains/billing/components/payroll-billing/payroll-billing-interface").then(mod => ({ default: mod.PayrollBillingInterface })),
  {
    loading: () => <div>Loading billing interface...</div>,
    ssr: false
  }
);

const ProfitabilityDashboard = dynamic(
  () => import("@/domains/billing/components/profitability/profitability-dashboard").then(mod => ({ default: mod.ProfitabilityDashboard })),
  {
    loading: () => <div>Loading profitability dashboard...</div>,
    ssr: false
  }
);

const BillingGenerationModal = dynamic(
  () => import("@/domains/billing/components/time-tracking/billing-generation-modal").then(mod => ({ default: mod.BillingGenerationModal })),
  {
    loading: () => <Button disabled>Loading...</Button>,
    ssr: false
  }
);

const PayrollServiceOverrides = dynamic(
  () => import("@/domains/billing/components/payroll-billing/payroll-service-overrides").then(mod => ({ default: mod.default })),
  {
    loading: () => <div>Loading service overrides...</div>,
    ssr: false
  }
);
import {
  GetPayrollByIdDocument,
  GetPayrollDatesDocument,
  GetPayrollsDocument,
  UpdatePayrollDocument,
  GetLatestPayrollVersionDocument,
  GeneratePayrollDatesDocument,
  GetPayrollDetailCompleteDocument,
} from "@/domains/payrolls/graphql/generated/graphql";
// Billing documents imported on-demand
// Schedule helper utilities imported on-demand
import { getScheduleSummary } from "@/domains/payrolls/utils/schedule-helpers";
import {
  usePayrollVersioning,
  usePayrollStatusUpdate,
  getVersionReason,
} from "@/hooks/use-payroll-versioning";
import { useFreshQuery } from "@/hooks/use-strategic-query";
import { PermissionGuard, CanUpdate, CanDelete } from "@/components/auth/permission-guard";
import { PayrollCycleType, PayrollDateType } from "@/types/enums";
import { QuickEmailDialog } from "@/domains/email/components/quick-email-dialog";

// Enhanced error boundary for version checking
function VersionCheckErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.error?.message?.includes('version') || event.error?.message?.includes('redirect')) {
        console.error("Version Check Error:", event.error);
        setError(event.error);
        setHasError(true);
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="p-6 border border-amber-300 bg-amber-50 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <AlertTriangle className="w-6 h-6 text-amber-600" />
          <h2 className="text-amber-800 font-semibold">Version Check Error</h2>
        </div>
        <p className="text-amber-700 mb-4">
          There was an issue checking the payroll version. This may be due to network connectivity or data consistency issues.
        </p>
        <div className="bg-amber-100 p-3 rounded text-sm text-amber-800 mb-4">
          <strong>Error:</strong> {error?.message || 'Unknown error'}
        </div>
        <div className="flex gap-2">
          <Button onClick={() => window.location.reload()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
          <Button onClick={() => window.history.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  try {
    return <>{children}</>;
  } catch (error) {
    console.error("Version Check Component Error:", error);
    setError(error as Error);
    setHasError(true);
    return null;
  }
}

// General error boundary component for debugging
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error("PayrollPage Error:", error);
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-lg">
        <h2 className="text-red-800 font-semibold">Error in Payroll Page</h2>
        <pre className="text-sm text-red-600 mt-2">{String(error)}</pre>
      </div>
    );
  }
}

// Payroll status configuration
const getStatusConfig = (status: string) => {
  const configs = {
    Implementation: {
      color: "bg-blue-100 text-blue-800",
      icon: Clock,
      progress: 15,
    },
    Active: {
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
      progress: 100,
    },
    Inactive: {
      color: "bg-gray-100 text-gray-800",
      icon: AlertTriangle,
      progress: 0,
    },
    draft: {
      color: "bg-yellow-100 text-yellow-800",
      icon: FileText,
      progress: 10,
    },
    "data-entry": {
      color: "bg-blue-100 text-blue-800",
      icon: Calculator,
      progress: 30,
    },
    review: { color: "bg-purple-100 text-purple-800", icon: Eye, progress: 50 },
    processing: {
      color: "bg-indigo-100 text-indigo-800",
      icon: RefreshCw,
      progress: 70,
    },
    "manager-review": {
      color: "bg-orange-100 text-orange-800",
      icon: UserCheck,
      progress: 85,
    },
    approved: {
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
      progress: 95,
    },
    submitted: {
      color: "bg-teal-100 text-teal-800",
      icon: Upload,
      progress: 100,
    },
    paid: {
      color: "bg-emerald-100 text-emerald-800",
      icon: CheckCircle,
      progress: 100,
    },
    "on-hold": {
      color: "bg-amber-100 text-amber-800",
      icon: AlertTriangle,
      progress: 60,
    },
    cancelled: {
      color: "bg-red-100 text-red-800",
      icon: AlertTriangle,
      progress: 0,
    },
  };

  return configs[status as keyof typeof configs] || configs["Implementation"];
};

// Format currency function
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date function
const formatDate = (date: string | Date) => {
  if (!date) {
    return "Not set";
  }
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-AU", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Format date with time
const formatDateTime = (date: string | Date) => {
  if (!date) {
    return "Not set";
  }
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-AU", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Helper function to get user-friendly role display name
const getRoleDisplayName = (role: string) => {
  switch (role) {
    case "developer":
    case "org_admin":
      return "Admin";
    case "manager":
      return "Manager";
    case "consultant":
      return "Consultant";
    case "viewer":
      return "Viewer";
    default:
      return role;
  }
};

// Unified loading state manager
function useLoadingCoordinator() {
  const [loadingStates, setLoadingStates] = useState({
    versionCheck: false,
    latestVersion: false,
    batchData: false,
    redirecting: false
  });
  const [loadingToastShown, setLoadingToastShown] = useState(false);

  const setLoading = useCallback((key: keyof typeof loadingStates, value: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  }, []);

  const isAnyLoading = useMemo(() => {
    return Object.values(loadingStates).some(Boolean);
  }, [loadingStates]);

  const isVersionCheckingOrRedirecting = useMemo(() => {
    return loadingStates.latestVersion || loadingStates.redirecting;
  }, [loadingStates.latestVersion, loadingStates.redirecting]);

  // Show loading toast after 2 seconds if still loading
  useEffect(() => {
    if (isAnyLoading && !loadingToastShown) {
      const timer = setTimeout(() => {
        if (isAnyLoading) {
          toast.info("Loading payroll data...");
          setLoadingToastShown(true);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
    
    // Clear toast when loading finishes
    if (!isAnyLoading && loadingToastShown) {
      setLoadingToastShown(false);
    }
    
    return undefined;
  }, [isAnyLoading, loadingToastShown]);

  return {
    loadingStates,
    setLoading,
    isAnyLoading,
    isVersionCheckingOrRedirecting,
    loadingToastShown
  };
}

export default function PayrollPage() {
  console.log("🚀 PayrollPage component starting...");

  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const editMode = searchParams.get('edit') === 'true';

  console.log("📋 Payroll ID:", id);
  
  // Unified loading state management
  const { 
    loadingStates, 
    setLoading, 
    isAnyLoading, 
    isVersionCheckingOrRedirecting, 
    loadingToastShown 
  } = useLoadingCoordinator();
  
  // Permission checks now handled by PermissionGuard components
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showScheduleChangeDialog, setShowScheduleChangeDialog] =
    useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [scheduleChangeData, setScheduleChangeData] = useState<any>(null);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [regenerationStartDate, setRegenerationStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [regenerationNote, setRegenerationNote] = useState("");
  const [versioningGoLiveDate, setVersioningGoLiveDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [versioningNote, setVersioningNote] = useState("");

  // PayrollForm data state
  const [payrollFormData, setPayrollFormData] = useState<PayrollFormData>({
    name: "",
    clientId: "",
    cycleId: "",
    dateTypeId: "",
    dateValue: "",
    fortnightlyWeek: "",
    primaryConsultantUserId: "",
    backupConsultantUserId: "",
    managerUserId: "",
    processingDaysBeforeEft: "3",
    processingTime: "4",
    employeeCount: "",
    goLiveDate: "",
    status: "Implementation",
  });

  console.log("🔧 State initialized");

  // Versioning hook
  const {
    savePayrollEdit,
    currentUserId,
    loading: versioningLoading,
  } = usePayrollVersioning();
  console.log("✅ usePayrollVersioning hook loaded");

  // Status update hook
  const { updatePayrollStatus } = usePayrollStatusUpdate();
  console.log("✅ usePayrollStatusUpdate hook loaded");

  // STEP 1: Always check for the latest version first (regardless of current payroll state)
  // This will find the latest version of this payroll family
  const { data: latestVersionData, loading: latestVersionLoading } =
    useFreshQuery(GetLatestPayrollVersionDocument, {
      variables: { payrollId: id }, // Use the current ID to find the latest in this family
      skip: !id,
      fetchPolicy: "network-only",
      onCompleted: () => setLoading('latestVersion', false),
      onError: () => setLoading('latestVersion', false),
    });

  // Update loading state when version check starts
  useEffect(() => {
    if (latestVersionLoading) {
      setLoading('latestVersion', true);
    }
  }, [latestVersionLoading, setLoading]);
  console.log("✅ Latest version query loaded first");

  // STEP 2: Determine if we need to redirect to the latest version
  const latestVersionId = latestVersionData?.payrolls?.[0]?.id;
  const needsRedirect = latestVersionId && latestVersionId !== id;

  // STEP 3: Perform redirect immediately if needed
  useEffect(() => {
    if (needsRedirect && latestVersionId) {
      console.log(
        "🔄 Redirecting from",
        id,
        "to latest version:",
        latestVersionId
      );
      router.push(`/payrolls/${latestVersionId}`);
    }
  }, [needsRedirect, latestVersionId, id, router]);

  // STEP 4: Only load current payroll data if we're not redirecting
  const shouldLoadCurrentPayroll = !latestVersionLoading && !needsRedirect;

  // Get current payroll data for version info (lighter query)
  const { data: versionCheckData, loading: versionCheckLoading } = useQuery(
    GetPayrollByIdDocument,
    {
      variables: { id },
      skip: !id || !shouldLoadCurrentPayroll,
      fetchPolicy: "network-only",
      onCompleted: () => setLoading('versionCheck', false),
      onError: () => setLoading('versionCheck', false),
    }
  );
  
  // Update loading state for version check
  useEffect(() => {
    if (versionCheckLoading) {
      setLoading('versionCheck', true);
    }
  }, [versionCheckLoading, setLoading]);
  console.log("✅ Version check query loaded");

  const currentPayroll = versionCheckData?.payrollsByPk as any;

  // Update loading coordinator with version checking state
  useEffect(() => {
    if (latestVersionLoading || needsRedirect) {
      setLoading('redirecting', true);
    } else {
      setLoading('redirecting', false);
    }
  }, [latestVersionLoading, needsRedirect, setLoading]);

  // Add debugging for versioning logic
  useEffect(() => {
    console.log("🔍 VERSIONING DEBUG:", {
      id,
      latestVersionLoading,
      versionCheckLoading,
      needsRedirect,
      shouldLoadCurrentPayroll,
      hasVersionCheckData: !!versionCheckData,
      isVersionCheckingOrRedirecting,
      latestVersionId,
      currentPayroll: currentPayroll
        ? {
            id: currentPayroll.id,
            supersededDate: currentPayroll.supersededDate,
            parentPayrollId: currentPayroll.parentPayrollId,
            versionNumber: currentPayroll.versionNumber,
          }
        : null,
      latestVersionData: latestVersionData
        ? {
            hasPayrolls: !!latestVersionData.payrolls,
            payrollsLength: latestVersionData.payrolls?.length,
            firstPayrollId: latestVersionData.payrolls?.[0]?.id,
          }
        : null,
    });
  }, [
    id,
    latestVersionLoading,
    versionCheckLoading,
    needsRedirect,
    shouldLoadCurrentPayroll,
    versionCheckData,
    isVersionCheckingOrRedirecting,
    latestVersionId,
    currentPayroll,
    latestVersionData,
  ]);

  const [error, setError] = useState<any>(null);

  // Simplified data fetching with single optimized query - fix hydration mismatch
  const { 
    data: completeData, 
    loading: dataLoading, 
    error: dataError, 
    refetch 
  } = useQuery(GetPayrollDetailCompleteDocument, {
    variables: { id },
    skip: !id || isVersionCheckingOrRedirecting,
    fetchPolicy: "network-only", // Fix hydration: consistent behavior
    errorPolicy: "all",
    ssr: false, // Fix hydration: disable SSR for this query
    onCompleted: () => {
      console.log("✅ Payroll detail data loaded successfully");
      setLoading('batchData', false);
    },
    onError: (error) => {
      console.error("❌ Failed to load payroll data:", error);
      setError(error);
      setLoading('batchData', false);
      
      const errorMessage = error.message || 'Unknown error occurred';
      const isNetworkError = errorMessage.includes('network') || errorMessage.includes('fetch');
      
      if (isNetworkError) {
        toast.error("Network error occurred. Please check your connection.", {
          description: "Unable to fetch payroll data due to connectivity issues.",
          duration: 8000
        });
      } else {
        toast.error("Failed to load payroll data", {
          description: errorMessage,
          duration: 8000
        });
      }
    }
  });

  // Update loading state for data fetch
  useEffect(() => {
    if (dataLoading) {
      setLoading('batchData', true);
    }
  }, [dataLoading, setLoading]);

  // Extract individual data for compatibility with existing code
  const data = completeData ? { payrollsByPk: completeData.payrollsByPk } : null;
  const usersData = completeData ? { users: completeData.users } : null;
  const cyclesData = completeData ? { payrollCycles: completeData.payrollCycles } : null;
  const dateTypesData = completeData ? { payrollDateTypes: completeData.payrollDateTypes } : null;

  // Lazy query for regenerating payroll dates
  const [generatePayrollDates] = useLazyQuery(GeneratePayrollDatesDocument, {
    onCompleted: (data: any) => {
      const count = data?.generatePayrollDates?.length || 0;
      toast.success(`Successfully regenerated ${count} payroll dates`);
      refetch(); // Refresh the payroll data to show updated dates
    },
    onError: (error: any) => {
      toast.error(`Failed to regenerate dates: ${error.message}`);
    },
  });
  console.log("✅ Generate dates query loaded");

  const [updatePayroll] = useMutation(UpdatePayrollDocument, {
    refetchQueries: [
      { query: GetPayrollByIdDocument, variables: { id } },
      { query: GetPayrollDatesDocument, variables: { id } },
      { query: GetPayrollDatesDocument, variables: { payrollId: id } },
      GetPayrollsDocument,
    ],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      console.log("✅ Payroll update completed with data:", data);
      
      // Verify client relationship is preserved
      if (data?.updatePayrollsByPk?.client) {
        console.log("✅ Client relationship preserved:", data.updatePayrollsByPk.client);
      } else {
        console.warn("⚠️ Client relationship may be missing in response");
      }
      
      toast.success("Payroll updated successfully");
      setIsEditing(false);
      refetch();
      
      // Handle return navigation if specified
      if (returnTo) {
        setTimeout(() => {
          router.push(decodeURIComponent(returnTo));
        }, 1000);
      } else {
        // Force a page refresh to ensure all data is completely fresh
        setTimeout(() => {
          window.location.reload();
        }, 1000); // Small delay to let the toast show
      }
    },
    onError: error => {
      console.error("❌ Payroll update failed:", error);
      toast.error(`Failed to update payroll: ${error.message}`);
    },
  });
  console.log("✅ Update payroll mutation loaded");

  console.log("🎯 All hooks loaded successfully");

  // Loading toast now handled by useLoadingCoordinator hook

  // Auto-enter edit mode if edit parameter is present
  useEffect(() => {
    if (editMode && !isEditing && data?.payrollsByPk) {
      setIsEditing(true);
    }
  }, [editMode, isEditing, data]);

  // Helper function to calculate current fortnightly week type
  const getCurrentFortnightlyWeek = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const firstDayOfYear = new Date(currentYear, 0, 1);
    const firstSunday = new Date(firstDayOfYear);
    const dayOfWeek = firstDayOfYear.getDay();
    const daysToAdd = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    firstSunday.setDate(firstDayOfYear.getDate() + daysToAdd);

    const timeDiff = now.getTime() - firstSunday.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const weekNumber = Math.floor(daysDiff / 7);
    const isCurrentWeekA = weekNumber % 2 === 0;

    return isCurrentWeekA ? "A" : "B";
  };

  // Helper function to map database date type names to form enum values
  const mapDateTypeDbNameToFormValue = (dbName: string) => {
    switch (dbName) {
      case "som": return "SOM";
      case "eom": return "EOM"; 
      case "fixed_date": return "fixed";
      default: return dbName;
    }
  };

  // Helper function to map form enum values to database names
  const mapFormValueToDateTypeDbName = (formValue: string) => {
    switch (formValue) {
      case "SOM": return "som";
      case "EOM": return "eom"; 
      case "fixed": return "fixed_date";
      default: return formValue;
    }
  };

  // Populate form immediately when payroll data is available (improves UX) - hydration safe
  useEffect(() => {
    if (hasMounted && data?.payrollsByPk) {
      const payroll = data.payrollsByPk;
      console.log("🔧 Initializing form with complete data:", {
        payrollId: payroll.id,
        hasAllData: true
      });
      
      // Get cycle and date type names directly from the related objects
      const cycleName = (payroll as any).payrollCycle?.name || "";
      const dateTypeName = (payroll as any).payrollDateType?.name || "";
      
      // Map date type database name to form enum value
      const dateTypeFormValue = mapDateTypeDbNameToFormValue(dateTypeName);
      
      // For fortnightly payrolls, set the current week type if not stored in DB
      let fortnightlyWeek = (payroll as any).fortnightlyWeek || "";
      if (cycleName === "fortnightly" && !fortnightlyWeek) {
        fortnightlyWeek = getCurrentFortnightlyWeek();
      }
      
      const formData = {
        name: (payroll as any).name || "",
        clientId: (payroll as any).clientId || "",
        cycleId: cycleName || "",
        dateTypeId: dateTypeFormValue || "",
        dateValue: (payroll as any).dateValue?.toString() || "",
        fortnightlyWeek: fortnightlyWeek,
        primaryConsultantUserId: (payroll as any).primaryConsultantUserId || "",
        backupConsultantUserId: (payroll as any).backupConsultantUserId || "",
        managerUserId: (payroll as any).managerUserId || "",
        processingDaysBeforeEft: (payroll as any).processingDaysBeforeEft?.toString() || "3",
        processingTime: (payroll as any).processingTime?.toString() || "4",
        employeeCount: (payroll as any).employeeCount?.toString() || "",
        goLiveDate: (payroll as any).goLiveDate || "",
        status: (payroll as any).status || "Implementation",
      };
      
      console.log("✅ Form data populated successfully:", formData);
      setPayrollFormData(formData);
    }
  }, [data, hasMounted]);

  // Simplified PayrollForm input change handler - no dual state management
  const handlePayrollFormChange = (field: keyof PayrollFormData, value: string) => {
    setPayrollFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    console.log(`📝 Form field updated: ${field} = ${value}`);
  };

  // Get users filtered by role and staff status
  const users = usersData?.users || [];
  const staffUsers = users.filter((user: any) => user.isStaff === true);
  const availablePrimaryConsultants = staffUsers;
  const availableBackupConsultants = staffUsers.filter(
    (user: any) => user.id !== payrollFormData.primaryConsultantUserId
  );
  const availableManagers = staffUsers.filter((user: any) =>
    ["manager", "developer", "orgAdmin"].includes(user.role)
  );

  // Early returns - after all hooks are called
  if (!id) {
    toast.error("Error: Payroll ID is required.");
    return <div>Error: Payroll ID is required.</div>;
  }

  // Add hydration safety state
  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Show loading state during hydration to prevent mismatch
  if (!hasMounted) {
    return (
      <VersionCheckErrorBoundary>
        <PayrollDetailsLoading />
      </VersionCheckErrorBoundary>
    );
  }

  // Show loading state while checking versions or redirecting
  if (isVersionCheckingOrRedirecting) {
    return (
      <VersionCheckErrorBoundary>
        <PayrollDetailsLoading />
      </VersionCheckErrorBoundary>
    );
  }

  // If we're not redirecting, we should have version check data
  if (versionCheckLoading) {
    return (
      <VersionCheckErrorBoundary>
        <PayrollDetailsLoading />
      </VersionCheckErrorBoundary>
    );
  }

  if (!versionCheckData || !versionCheckData.payrollsByPk) {
    // Show detailed error information instead of calling notFound()
    return (
      <VersionCheckErrorBoundary>
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 space-y-6">
          <AlertTriangle className="w-16 h-16 text-red-500" />
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Payroll Data Issue</h2>
            <p className="text-gray-600">
              The payroll with ID "{id}" could not be loaded
            </p>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md text-left max-w-lg mx-auto mt-4">
              <p>No error was reported, but payrollsByPk returned null.</p>
              <p className="text-sm mt-2">
                This usually happens when the record exists but you don't have
                permission to view it, or the record doesn't exist.
              </p>
            </div>

            <div className="mt-6 flex gap-2">
              <Button onClick={() => window.location.reload()} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Loading
              </Button>
              <Button onClick={() => router.push("/payrolls")} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Payrolls List
              </Button>
            </div>
          </div>
        </div>
      </VersionCheckErrorBoundary>
    );
  }

  const payroll = data?.payrollsByPk || versionCheckData.payrollsByPk;
  const client = payroll.client;

  // Debug: Log payroll data to see what we're getting
  console.log("Payroll details data:", {
    payroll,
    payrollKeys: payroll ? Object.keys(payroll) : [],
    client,
    clientKeys: client ? Object.keys(client) : [],
  });

  const statusConfig = getStatusConfig(payroll.status || "Implementation");
  const StatusIcon = statusConfig.icon;

  // Calculate totals from payroll dates if available
  const payrollDates = (payroll as any).payrollDates || [];
  const totalEmployees = payroll.employeeCount || 0;

  const handleSave = async () => {
    try {
      console.log("🔍 DEBUG: Save started with form data:", payrollFormData);

      // Get the original values for comparison
      const originalCycleId = (payroll as any).cycleId;
      const originalDateTypeId = (payroll as any).dateTypeId;
      const originalDateValue = (payroll as any).dateValue;

      // Convert form values (enum names) to UUIDs for database
      const selectedCycle = cyclesData?.payrollCycles?.find((c: any) => c.name === payrollFormData.cycleId);
      const selectedDateType = dateTypesData?.payrollDateTypes?.find((dt: any) => 
        dt.name === mapFormValueToDateTypeDbName(payrollFormData.dateTypeId)
      );
      
      const cycleId = selectedCycle?.id;
      const dateTypeId = selectedDateType?.id;

      // Validate conversions
      if (payrollFormData.cycleId && !cycleId) {
        toast.error("Invalid payroll cycle selected");
        return;
      }
      if (payrollFormData.dateTypeId && !dateTypeId) {
        toast.error("Invalid date type selected");
        return;
      }

      // Validate required fields
      if (!payrollFormData.name?.trim()) {
        toast.error("Payroll name is required");
        return;
      }

      // Check if any schedule-related fields changed
      const cycleChanged = cycleId !== originalCycleId;
      const dateTypeChanged = dateTypeId !== originalDateTypeId;
      const dateValueChanged = payrollFormData.dateValue
        ? parseInt(payrollFormData.dateValue) !== originalDateValue
        : originalDateValue !== null && originalDateValue !== undefined;

      const scheduleChanged = cycleChanged || dateTypeChanged || dateValueChanged;

      // Prepare mutation variables with correct parameter names from the mutation
      const mutationVariables = {
        id: payroll.id,
        name: payrollFormData.name.trim(),
        clientId: (payroll as any).clientId, // CRITICAL: Preserve client relationship
        cycleId: cycleId || originalCycleId,
        dateTypeId: dateTypeId || originalDateTypeId,
        dateValue: payrollFormData.dateValue ? parseInt(payrollFormData.dateValue) : null,
        primaryConsultantUserId: payrollFormData.primaryConsultantUserId || null,
        backupConsultantUserId: payrollFormData.backupConsultantUserId || null,
        managerUserId: payrollFormData.managerUserId || null,
        processingDaysBeforeEft: payrollFormData.processingDaysBeforeEft
          ? parseInt(payrollFormData.processingDaysBeforeEft)
          : null,
        processingTime: payrollFormData.processingTime
          ? parseInt(payrollFormData.processingTime)
          : null,
        employeeCount: payrollFormData.employeeCount ? parseInt(payrollFormData.employeeCount) : null,
        goLiveDate: payrollFormData.goLiveDate || null,
        status: payrollFormData.status || (payroll as any).status || "Implementation",
      };

      console.log("✅ Mutation variables prepared:", mutationVariables);

      if (scheduleChanged) {
        // Store the mutation variables and show the schedule change modal
        setScheduleChangeData(mutationVariables);
        setRegenerationNote("");
        setShowScheduleChangeDialog(true);
      } else {
        // No schedule change, just update the payroll
        const { id, ...setFields } = mutationVariables;
        await updatePayroll({
          variables: {
            id,
            set: setFields,
          },
        });
      }
    } catch (error) {
      console.error("❌ Error updating payroll:", error);
      toast.error(`Failed to save payroll: ${error}`);
    }
  };

  const handleScheduleChangeConfirm = async () => {
    if (!scheduleChangeData || !versioningGoLiveDate) {
      toast.error("Please select a go-live date for the new version");
      return;
    }

    console.log("🔄 Starting payroll edit with versioning...");
    console.log("📋 Original payroll:", payroll);
    console.log("📋 Changes:", scheduleChangeData);
    console.log("📅 Go-live date:", versioningGoLiveDate);

    try {
      // Prepare edited fields that actually changed
      const editedFields: any = {};

      // ALWAYS preserve client relationship in new version
      editedFields.clientId = (payroll as any).clientId;

      // Check each field and only include if changed
      if (scheduleChangeData.cycleId !== (payroll as any).cycleId) {
        editedFields.cycleId = scheduleChangeData.cycleId;
      }
      if (scheduleChangeData.dateTypeId !== (payroll as any).dateTypeId) {
        editedFields.dateTypeId = scheduleChangeData.dateTypeId;
      }
      if (scheduleChangeData.dateValue !== (payroll as any).dateValue) {
        editedFields.dateValue = scheduleChangeData.dateValue;
      }
      if (scheduleChangeData.name !== (payroll as any).name) {
        editedFields.name = scheduleChangeData.name;
      }
      if (
        scheduleChangeData.primaryConsultantUserId !==
        (payroll as any).primaryConsultantUserId
      ) {
        editedFields.primaryConsultantUserId =
          scheduleChangeData.primaryConsultantUserId;
      }
      if (
        scheduleChangeData.backupConsultantUserId !==
        (payroll as any).backupConsultantUserId
      ) {
        editedFields.backupConsultantUserId =
          scheduleChangeData.backupConsultantUserId;
      }
      if (scheduleChangeData.managerUserId !== (payroll as any).managerUserId) {
        editedFields.managerUserId = scheduleChangeData.managerUserId;
      }
      if (
        scheduleChangeData.processingDaysBeforeEft !==
        (payroll as any).processingDaysBeforeEft
      ) {
        editedFields.processingDaysBeforeEft =
          scheduleChangeData.processingDaysBeforeEft;
      }

      const versionReason = getVersionReason(editedFields);

      // Use the new savePayrollEdit function
      const result = await savePayrollEdit({
        currentPayroll: payroll,
        editedFields,
        goLiveDate: versioningGoLiveDate,
        versionReason,
        createdByUserId: currentUserId || "", // Use currentUserId from hook
      });

      if (result.success) {
        console.log(`✅ Version ${result.versionNumber} created successfully`);

        // Close the dialog and refresh
        setShowScheduleChangeDialog(false);
        setScheduleChangeData(null);
        setVersioningGoLiveDate(new Date().toISOString().split("T")[0]);
        setVersioningNote("");
        setIsEditing(false);

        toast.success(
          `Payroll version ${result.versionNumber} will go live on ${versioningGoLiveDate}`
        );

        // Handle return navigation if specified
        if (returnTo) {
          setTimeout(() => {
            router.push(decodeURIComponent(returnTo));
          }, 2000);
        } else {
          // Force a page refresh to ensure all data is completely fresh
          setTimeout(() => {
            window.location.reload();
          }, 2000); // Longer delay to let the success message show
        }
      } else {
        throw new Error(result.error || "Failed to create payroll version");
      }
    } catch (error: any) {
      console.error("❌ Error creating payroll version:", error);
      toast.error(`Failed to create payroll version: ${error.message}`);
    }
  };

  const handleStatusChange = async () => {
    if (!newStatus || !payroll?.id) {
      return;
    }

    try {
      console.log(
        `🔄 Changing payroll ${payroll.id} status to ${newStatus}...`
      );

      const result = await updatePayrollStatus(payroll.id, newStatus);

      if (result.success) {
        // Show status change note in toast if provided
        if (statusNote.trim()) {
          toast.info(`Status changed to ${newStatus}: ${statusNote.trim()}`);
        } else {
          toast.success(`Status changed to ${newStatus}`);
        }

        setShowStatusDialog(false);
        setNewStatus("");
        setStatusNote("");

        // Refresh the page data instead of full page reload
        refetch();
      } else {
        throw new Error(result.error || "Failed to update status");
      }
    } catch (error: any) {
      console.error("❌ Error updating status:", error);
      toast.error(`Failed to update status: ${error.message}`);
    }
  };

  const possibleStatuses = ["Implementation", "Active", "Inactive"];

  return (
    <PermissionGuard action="read" fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-8 h-8 mx-auto text-amber-500" />
          <h3 className="text-lg font-medium text-amber-800">Access Restricted</h3>
          <p className="text-amber-600">You don't have permission to view this payroll.</p>
        </div>
      </div>
    }>
      <div className="container mx-auto py-6 space-y-6">
        <ErrorBoundary>
        <div className="space-y-6">
        {/* Version Warning Banner */}
        {(currentPayroll as any)?.supersededDate && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="text-amber-800 font-medium">
                    You are viewing an older version of this payroll (v
                    {(currentPayroll as any).versionNumber})
                  </p>
                  <p className="text-amber-700 text-sm">
                    This version was superseded on{" "}
                    {formatDate((currentPayroll as any).supersededDate)}
                  </p>
                </div>
              </div>
              {latestVersionData?.payrolls?.[0]?.id && (
                <Button
                  onClick={() =>
                    router.push(`/payrolls/${latestVersionData.payrolls[0].id}`)
                  }
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  View Latest Version (v
                  {latestVersionData.payrolls[0].versionNumber})
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Link href={returnTo ? decodeURIComponent(returnTo) : "/payrolls"}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {returnTo ? "Back to Client" : "Back to Payrolls"}
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{(payroll as any).name}</h1>
                <Badge
                  className={`${statusConfig.color} cursor-pointer hover:opacity-80 transition-opacity`}
                  onClick={() => setShowStatusDialog(true)}
                  title="Click to change status"
                >
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {(payroll as any).status || "Implementation"}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {(client as any).name}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {totalEmployees} employees
                </div>
                <div className="flex items-center gap-1" suppressHydrationWarning>
                  <Clock className="w-4 h-4" />
                  Last updated {formatDate((payroll as any).updatedAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreHorizontal className="w-4 h-4 mr-2" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {/* Edit Actions */}
                {isEditing ? (
                  <>
                    <DropdownMenuItem onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setIsEditing(false);
                      if (returnTo) {
                        router.push(decodeURIComponent(returnTo));
                      }
                    }}>
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Cancel Changes
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                ) : (
                  <>
                    <CanUpdate resource="payrolls">
                      <DropdownMenuItem onClick={() => setIsEditing(true)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit Payroll
                      </DropdownMenuItem>
                    </CanUpdate>
                    <DropdownMenuSeparator />
                  </>
                )}

                {/* View & Navigation */}
                <DropdownMenuItem onClick={() => refetch()}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
                </DropdownMenuItem>

                {/* Status Management */}
                <DropdownMenuItem onClick={() => setShowStatusDialog(true)}>
                  <Shield className="w-4 h-4 mr-2" />
                  Change Status
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Communication */}
                <DropdownMenuItem onClick={() => setShowEmailDialog(true)}>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Export Options */}
                <DropdownMenuItem
                  onClick={() => {
                    // Trigger CSV export
                    const csvButton = document.querySelector(
                      '[data-export="csv"]'
                    ) as HTMLButtonElement;
                    csvButton?.click();
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    // Trigger PDF export
                    const pdfButton = document.querySelector(
                      '[data-export="pdf"]'
                    ) as HTMLButtonElement;
                    pdfButton?.click();
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <FileText className="w-4 h-4 mr-2" />
                  Export Summary
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Data Management */}
                <DropdownMenuItem>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Data
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate Payroll
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Danger Zone */}
                <CanDelete resource="payrolls">
                  <DropdownMenuItem className="text-red-600">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Archive Payroll
                  </DropdownMenuItem>
                </CanDelete>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Progress Bar */}
        {statusConfig.progress > 0 && statusConfig.progress < 100 && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Payroll Progress</span>
                  <span>{statusConfig.progress}%</span>
                </div>
                <Progress value={statusConfig.progress} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>
                    Manager: {(payroll as any).assignedManager?.computedName || (payroll as any).assignedManager ? `${(payroll as any).assignedManager.firstName} ${(payroll as any).assignedManager.lastName}`.trim() : "Not assigned"}
                  </span>
                  <span>
                    Status: {(payroll as any).status || "Implementation"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-4 bg-indigo-50 shadow-sm rounded-lg">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 hover:bg-indigo-300 transition-all text-gray-900"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 hover:bg-indigo-300 transition-all text-gray-900"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Billing
              <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                Overrides
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="dates"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 hover:bg-indigo-300 transition-all text-gray-900"
            >
              Payroll Dates
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 hover:bg-indigo-300 transition-all text-gray-900"
            >
              <FileText className="w-4 h-4 mr-2" />
              Documents
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Key Metrics */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      Payroll Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-700">
                          {payroll.employeeCount || totalEmployees || 0}
                        </div>
                        <div className="text-sm text-blue-600">Employees</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-700">
                          {(payroll as any).payrollDates?.length || payrollDates.length || 0}
                        </div>
                        <div className="text-sm text-green-600">
                          Pay Periods
                        </div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-700">
                          {payroll.processingDaysBeforeEft || 3}
                        </div>
                        <div className="text-sm text-orange-600">
                          Processing Days
                        </div>
                      </div>
                      <div className="text-center p-4 bg-amber-50 rounded-lg">
                        <div className="text-2xl font-bold text-amber-700">
                          {payroll.processingTime || 4}h
                        </div>
                        <div className="text-sm text-amber-600">
                          Max Processing Time
                        </div>
                      </div>
                    </div>

                    {/* Schedule card displayed underneath */}
                    <div className="mt-4">
                      <div className="text-center p-4 bg-teal-50 rounded-lg">
                        <div className="text-2xl font-bold text-teal-700 break-words leading-tight">
                          {getScheduleSummary(payroll)}
                        </div>
                        <div className="text-sm text-teal-600">Schedule</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Consultant Assignments Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Consultant Assignments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-sm text-blue-600 font-medium">Primary Consultant</div>
                        <div className="text-lg font-semibold text-blue-900">
                          {(payroll as any).primaryConsultant?.computedName || (payroll as any).primaryConsultant ? `${(payroll as any).primaryConsultant.firstName} ${(payroll as any).primaryConsultant.lastName}`.trim() : "Not assigned"}
                        </div>
                        {(payroll as any).primaryConsultant?.email && (
                          <div className="text-sm text-blue-700">
                            {(payroll as any).primaryConsultant.email}
                          </div>
                        )}
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="text-sm text-green-600 font-medium">Backup Consultant</div>
                        <div className="text-lg font-semibold text-green-900">
                          {(payroll as any).backupConsultant?.computedName || (payroll as any).backupConsultant ? `${(payroll as any).backupConsultant.firstName} ${(payroll as any).backupConsultant.lastName}`.trim() : "Not assigned"}
                        </div>
                        {(payroll as any).backupConsultant?.email && (
                          <div className="text-sm text-green-700">
                            {(payroll as any).backupConsultant.email}
                          </div>
                        )}
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="text-sm text-purple-600 font-medium">Manager</div>
                        <div className="text-lg font-semibold text-purple-900">
                          {(payroll as any).assignedManager?.computedName || (payroll as any).assignedManager ? `${(payroll as any).assignedManager.firstName} ${(payroll as any).assignedManager.lastName}`.trim() : "Not assigned"}
                        </div>
                        {(payroll as any).assignedManager?.email && (
                          <div className="text-sm text-purple-700">
                            {(payroll as any).assignedManager.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Edit Form Card - Only shown when editing */}
                {isEditing && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Pencil className="w-5 h-5" />
                        Edit Payroll Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Loading state - show when reference data isn't loaded yet */}
                        {(!cyclesData || !dateTypesData) ? (
                          <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
                            <div className="text-center">
                              <p className="text-lg font-medium text-gray-900">Loading form data...</p>
                              <p className="text-sm text-gray-500 mt-1">
                                Fetching payroll cycles and date types for dropdown options
                              </p>
                            </div>
                            <div className="text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded">
                              Waiting for: {!cyclesData && "Cycles"}{!cyclesData && !dateTypesData && ", "}{!dateTypesData && "Date Types"}
                            </div>
                          </div>
                        ) : (
                          <PayrollForm
                            formData={payrollFormData}
                            onInputChange={handlePayrollFormChange}
                            isLoading={versioningLoading}
                            showClientField={false}
                            clientName={(client as any)?.name}
                            title="Edit Payroll Configuration"
                            description="Update payroll schedule, assignments, and processing details. Schedule changes will create a new version."
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Required Skills Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Required Skills
                      </CardTitle>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowSkillsModal(true)}
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit Skills
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {(payroll as any).payrollRequiredSkills && (payroll as any).payrollRequiredSkills.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {(payroll as any).payrollRequiredSkills.map((skill: any, index: number) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                            <div className="font-medium text-gray-900">{skill.skillName}</div>
                            <Badge 
                              variant="secondary" 
                              className={`mt-1 ${
                                skill.requiredLevel === 'Expert' ? 'bg-red-100 text-red-800' :
                                skill.requiredLevel === 'Advanced' ? 'bg-orange-100 text-orange-800' :
                                skill.requiredLevel === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}
                            >
                              {skill.requiredLevel}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No specific skills required for this payroll</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Notes Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <NotesListWithAdd
                      entityType="payroll"
                      entityId={id}
                      title={`Notes for ${(payroll as any).name}`}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            {/* Quick Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Billing Actions
                  </span>
                  <BillingGenerationModal
                    payrollId={id}
                    payrollName={payroll?.name || 'Payroll'}
                    onGenerated={(count) => {
                      toast.success(`Generated ${count} billing items`);
                      refetch();
                    }}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                    <Clock className="w-8 h-8 text-blue-600" />
                    <div>
                      <div className="font-medium text-blue-900">Time Entry Automation</div>
                      <div className="text-sm text-blue-700">Convert tracked hours to billing items</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                    <FileText className="w-8 h-8 text-green-600" />
                    <div>
                      <div className="font-medium text-green-900">Smart Consolidation</div>
                      <div className="text-sm text-green-700">Group entries by service type</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50">
                    <CheckCircle className="w-8 h-8 text-purple-600" />
                    <div>
                      <div className="font-medium text-purple-900">Client Rate Integration</div>
                      <div className="text-sm text-purple-700">Uses agreed service rates</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <PayrollBillingInterface 
              payrollId={id}
              onBillingCompleted={() => {
                // Refetch payroll data to update billing information
                refetch();
              }}
            />

            {/* Service Overrides Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Payroll Service Overrides
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Manage service-specific billing rates and configurations that override client defaults for this payroll.
                      These overrides will take precedence over the client's default service agreements.
                    </CardDescription>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div>Client: {(client as any)?.name}</div>
                    <Link 
                      href={`/clients/${(client as any)?.id}#service-agreements`}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      View Client Service Agreements →
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <PayrollServiceOverrides payrollId={id} />
              </CardContent>
            </Card>
            
            {/* Profitability Dashboard */}
            <ProfitabilityDashboard 
              clientId={(payroll as any).client?.id}
              dateRange={{
                start: '2024-01-01',
                end: '2024-12-31'
              }}
            />
          </TabsContent>

          {/* Payroll Dates Tab */}
          <TabsContent value="dates" className="space-y-6">
            <PayrollDatesView payrollId={id} showAllVersions={false} />
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <DocumentList
              payrollId={id}
              showFilters={true}
              showUploadButton={true}
              onUploadClick={() => setShowUploadModal(true)}
              onDocumentUpdate={() => {
                // Refresh when documents are updated or deleted
                window.location.reload();
              }}
            />
          </TabsContent>
        </Tabs>

        {/* Status Change Dialog */}
        <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Payroll Status</DialogTitle>
              <DialogDescription>
                Update the status of this payroll. This change will be logged for audit purposes.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-status">New Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status..." />
                  </SelectTrigger>
                  <SelectContent>
                    {possibleStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status-note">Note (Optional)</Label>
                <Textarea
                  id="status-note"
                  placeholder="Add a note about this status change..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleStatusChange} disabled={!newStatus}>
                Update Status
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Schedule Change Dialog */}
        <Dialog open={showScheduleChangeDialog} onOpenChange={setShowScheduleChangeDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule Change Detected</DialogTitle>
              <DialogDescription>
                You've made changes to the payroll schedule. This will create a new version of the payroll.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-700">
                  <strong>Important:</strong> Changing the schedule will create a new version of this payroll.
                  All future payroll dates will be regenerated based on the new schedule.
                </p>
              </div>
              <div>
                <Label htmlFor="version-go-live-date">Go Live Date for New Version</Label>
                <Input
                  id="version-go-live-date"
                  type="date"
                  value={versioningGoLiveDate}
                  onChange={(e) => setVersioningGoLiveDate(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  The date when the new version should become active
                </p>
              </div>
              <div>
                <Label htmlFor="version-note">Version Note (Optional)</Label>
                <Textarea
                  id="version-note"
                  placeholder="Add a note about this version change..."
                  value={versioningNote}
                  onChange={(e) => setVersioningNote(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowScheduleChangeDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleScheduleChangeConfirm} disabled={!versioningGoLiveDate}>
                Create New Version
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Export components (hidden) */}
        <div className="hidden">
          <ExportCsv
            data-export="csv"
            payrollId={id}
          />
          <ExportPdf
            data-export="pdf"
            payrollId={id}
          />
        </div>

        {/* Quick Email Dialog */}
        {payroll && client && (
          <QuickEmailDialog
            open={showEmailDialog}
            onOpenChange={setShowEmailDialog}
            businessContext={{
              category: 'payroll',
              payrollId: id,
              clientId: (client as any).id,
              recipientEmails: [
                (client as any).primaryContactEmail,
                ...(payroll as any).manager?.email ? [(payroll as any).manager.email] : [],
                ...(payroll as any).primaryConsultant?.email ? [(payroll as any).primaryConsultant.email] : []
              ].filter(Boolean)
            }}
            suggestedSubject={`Payroll Update: ${(payroll as any).name}`}
            title="Send Payroll Email"
            description="Send an email related to this payroll to relevant stakeholders"
          />
        )}

        {/* Skills Edit Modal */}
        <SkillsEditModal
          isOpen={showSkillsModal}
          onClose={() => setShowSkillsModal(false)}
          type="payroll"
          entityId={id}
          entityName={(payroll as any)?.name || ""}
        />

        {/* Document Upload Modal */}
        <DocumentUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          payrollId={id}
          onUploadComplete={(documents) => {
            // Refresh document list when upload completes
            window.location.reload();
          }}
        />
      </div>
      </ErrorBoundary>
      </div>
    </PermissionGuard>
  );
}
