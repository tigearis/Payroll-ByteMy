"use client";

import { useMutation } from "@apollo/client";
// Optimized icon imports - only what we actually use
import {
  AlertTriangle,
  RefreshCw, 
  Edit,
  Calendar,
  Users,
  FileText,
  Clock,
  CheckCircle,
  Building2,
  UserCheck,
  Upload,
  Settings,
  CalendarDays,
  Save,
  MessageCircle,
  StickyNote,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useMemo, Suspense } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { DocumentList } from "@/components/documents";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

// Domain imports
import { PayrollErrorBoundary } from "@/domains/payrolls/components/PayrollErrorBoundary";
import {
  UpdatePayrollDateNotesDocument,
} from "@/domains/payrolls/graphql/generated/graphql";
import { usePayrollData } from "@/domains/payrolls/hooks/usePayrollData";
import { getEnhancedScheduleSummary } from "@/domains/payrolls/utils/schedule-helpers";

// Utility imports
import { safeFormatDate } from "@/lib/utils/date-utils";

// Status configuration for payroll statuses
const getStatusConfig = (status: string) => {
  const configs = {
    Implementation: {
      color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      icon: Settings,
      progress: 0,
    },
    draft: {
      color: "bg-warning-500/10 text-warning-600 border-warning-500/20",
      icon: FileText,
      progress: 10,
    },
    "data-entry": {
      color: "bg-primary/10 text-primary border-primary/20",
      icon: Edit,
      progress: 30,
    },
    review: {
      color: "bg-accent text-accent-foreground border-border",
      icon: UserCheck,
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

// Main loading component
function PayrollDetailLoading() {
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
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className={i >= 4 ? "md:col-span-2" : ""}>
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

          {/* Tabs skeleton */}
          <div className="space-y-6">
            <div className="flex space-x-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-32" />
              ))}
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Overview cards component
function PayrollOverviewCards({ data }: { data: any }) {
  const payroll = data?.payroll;
  const payrollDates = data?.payroll?.detailPayrollDates || [];
  
  const scheduleInfo = useMemo(() => {
    if (!payroll?.payrollCycle?.name || !payroll?.payrollDateType?.name) {
      return null;
    }
    return getEnhancedScheduleSummary(payroll);
  }, [payroll]);

  const stats = useMemo(() => {
    const total = payrollDates.length;
    const completed = payrollDates.filter((d: any) => d.completed).length;
    const upcoming = payrollDates.filter((d: any) => 
      !d.completed && new Date(d.adjustedEftDate) > new Date()
    ).length;
    
    return { 
      total, 
      completed, 
      upcoming, 
      pendingReview: total - completed - upcoming 
    };
  }, [payrollDates]);

  if (!payroll) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Pay Periods</p>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
              <p className="text-2xl font-bold text-blue-600">{stats.upcoming}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Schedule Type</p>
              <p className="text-lg font-semibold text-foreground">
                {typeof scheduleInfo === 'string' ? scheduleInfo : (scheduleInfo as any)?.displayName || "Custom"}
              </p>
            </div>
            <CalendarDays className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Payroll dates table component
function PayrollDatesTable({ data, payrollId }: { data: any; payrollId: string }) {
  const [updateNotes] = useMutation(UpdatePayrollDateNotesDocument);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState("");

  const payrollDates = data?.payroll?.detailPayrollDates || [];

  const handleSaveNotes = async (payrollDateId: string) => {
    try {
      await updateNotes({
        variables: {
          id: payrollDateId,
          notes: notesValue,
        },
      });
      setEditingNotes(null);
      setNotesValue("");
    } catch (error) {
      console.error("Error updating notes:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Payroll Dates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">Original Date</th>
                <th className="text-left p-4 font-medium">Adjusted Date</th>
                <th className="text-left p-4 font-medium">Processing Date</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Notes</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payrollDates.map((date: any) => (
                <tr key={date.id} className="border-b hover:bg-muted/50">
                  <td className="p-4">
                    <div className="font-medium">
                      {safeFormatDate(date.originalEftDate, "MMM dd, yyyy")}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`font-medium ${
                      date.originalEftDate !== date.adjustedEftDate 
                        ? 'text-orange-600' 
                        : 'text-foreground'
                    }`}>
                      {safeFormatDate(date.adjustedEftDate, "MMM dd, yyyy")}
                      {date.originalEftDate !== date.adjustedEftDate && (
                        <Badge variant="outline" className="ml-2">Adjusted</Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-muted-foreground">
                      {safeFormatDate(date.processingDate, "MMM dd, yyyy")}
                    </div>
                  </td>
                  <td className="p-4">
                    {date.completed ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    ) : new Date(date.adjustedEftDate) < new Date() ? (
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Overdue
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </td>
                  <td className="p-4">
                    {editingNotes === date.id ? (
                      <div className="flex gap-2">
                        <Textarea
                          value={notesValue}
                          onChange={(e) => setNotesValue(e.target.value)}
                          className="min-h-[60px]"
                          placeholder="Add notes..."
                        />
                        <div className="flex flex-col gap-1">
                          <Button
                            size="sm"
                            onClick={() => handleSaveNotes(date.id)}
                          >
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingNotes(null);
                              setNotesValue("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="max-w-xs">
                        <p className="text-sm text-muted-foreground truncate">
                          {date.notes || "No notes"}
                        </p>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingNotes(date.id);
                        setNotesValue(date.notes || "");
                      }}
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Edit Notes
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {payrollDates.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No payroll dates found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Staff assignments component
function StaffAssignments({ data }: { data: any }) {
  const payroll = data?.payroll;
  
  if (!payroll) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Staff Assignments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Primary Consultant */}
          <div>
            <Label className="text-sm font-medium">Primary Consultant</Label>
            <div className="mt-2 flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  <UserCheck className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  {payroll.primaryConsultant?.computedName || "Unassigned"}
                </p>
                <p className="text-xs text-muted-foreground">Primary</p>
              </div>
            </div>
          </div>

          {/* Backup Consultant */}
          <div>
            <Label className="text-sm font-medium">Backup Consultant</Label>
            <div className="mt-2 flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  <Users className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  {payroll.backupConsultant?.computedName || "Unassigned"}
                </p>
                <p className="text-xs text-muted-foreground">Backup</p>
              </div>
            </div>
          </div>

          {/* Manager */}
          <div>
            <Label className="text-sm font-medium">Manager</Label>
            <div className="mt-2 flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  <Settings className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  {payroll.assignedManager?.computedName || "Unassigned"}
                </p>
                <p className="text-xs text-muted-foreground">Manager</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main component
export default function PayrollDetailPage() {
  const params = useParams();
  const payrollId = params?.id as string;
  
  const { data, loading, error, refetch } = usePayrollData(payrollId);
  
  if (loading) {
    return <PayrollDetailLoading />;
  }

  if (error || !data?.payroll) {
    return (
      <PayrollErrorBoundary>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Error Loading Payroll
              </h3>
              <p className="text-muted-foreground mb-4">
                {error?.message || "Payroll not found"}
              </p>
              <Button onClick={() => refetch?.()} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </PayrollErrorBoundary>
    );
  }

  const payroll = data.payroll;
  const statusConfig = getStatusConfig(payroll.status || "draft");
  const StatusIcon = statusConfig.icon;

  return (
    <PayrollErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Link href="/payrolls" className="hover:text-foreground">
                  Payrolls
                </Link>
                <span>/</span>
                <span className="text-foreground">{payroll.name}</span>
              </nav>
            </div>

            <div className="pb-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={`/api/avatar/${payroll.client?.name}`} />
                      <AvatarFallback>
                        <Building2 className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <h1 className="text-2xl font-bold text-foreground mb-2">
                        {payroll.name}
                      </h1>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <Link
                            href={`/clients/${payroll.client?.id}`}
                            className="text-blue-600 hover:underline font-medium"
                          >
                            {payroll.client?.name}
                          </Link>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <StatusIcon className="h-4 w-4 text-muted-foreground" />
                          <Badge className={statusConfig.color}>
                            {payroll.status?.replace("-", " ").replace(/\b\w/g, (l: string) => l.toUpperCase()) || "Draft"}
                          </Badge>
                        </div>

                        {payroll.employeeCount && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {payroll.employeeCount} employee{payroll.employeeCount !== 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <PermissionGuard resource="payrolls" action="update">
                    <Button variant="outline" asChild>
                      <Link href={`/payrolls/${payrollId}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                  </PermissionGuard>
                  
                  <Button onClick={() => refetch?.()} variant="outline" size="icon">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Overview Cards */}
            <PayrollOverviewCards data={data} />

            {/* Main Content Tabs */}
            <Tabs defaultValue="dates" className="space-y-6">
              <TabsList>
                <TabsTrigger value="dates">Payroll Dates</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="dates" className="space-y-6">
                <PayrollDatesTable data={data} payrollId={payrollId} />
              </TabsContent>

              <TabsContent value="assignments" className="space-y-6">
                <StaffAssignments data={data} />
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={<div>Loading documents...</div>}>
                      <DocumentList 
                        payrollId={payrollId}
                        showUploadButton={true}
                      />
                    </Suspense>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <StickyNote className="h-5 w-5" />
                      Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <StickyNote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Notes functionality coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PayrollErrorBoundary>
  );
}