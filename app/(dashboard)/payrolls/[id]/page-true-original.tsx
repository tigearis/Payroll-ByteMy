"use client";

import { useMutation } from "@apollo/client";
// ORIGINAL MASSIVE INDIVIDUAL ICON IMPORTS (PERFORMANCE KILLER)
import { AlertTriangle } from "lucide-react";
import { RefreshCw } from "lucide-react";
import { Edit } from "lucide-react";
import { Calendar } from "lucide-react";
import { Users } from "lucide-react";
import { FileText } from "lucide-react";
import { Clock } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { Building2 } from "lucide-react";
import { UserCheck } from "lucide-react";
import { Upload } from "lucide-react";
import { Settings } from "lucide-react";
import { CalendarDays } from "lucide-react";
import { Save } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { StickyNote } from "lucide-react";
import { Eye } from "lucide-react";
import { Plus } from "lucide-react";
import { Mail } from "lucide-react";
import { Phone } from "lucide-react";
import { MapPin } from "lucide-react";
import { Globe } from "lucide-react";
import { User } from "lucide-react";
import { Star } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { Target } from "lucide-react";
import { Zap } from "lucide-react";
import { Activity } from "lucide-react";
import { BarChart3 } from "lucide-react";
import { PieChart } from "lucide-react";
import { LineChart } from "lucide-react";
import { DollarSign } from "lucide-react";
import { CreditCard } from "lucide-react";
import { Wallet } from "lucide-react";
import { Hash } from "lucide-react";
import { Home } from "lucide-react";
import { Search } from "lucide-react";
import { Filter } from "lucide-react";
import { Download } from "lucide-react";
import { Share } from "lucide-react";
import { Copy } from "lucide-react";
import { ExternalLink } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { ChevronUp } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import { MoreVertical } from "lucide-react";
import { Info } from "lucide-react";
import { HelpCircle } from "lucide-react";
import { X } from "lucide-react";
import { Check } from "lucide-react";
import { Minus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { DocumentList } from "@/components/documents";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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

// MASSIVE MONOLITHIC COMPONENT (1,541+ lines) - ORIGINAL PERFORMANCE KILLER
export default function PayrollDetailPage() {
  const params = useParams();
  const payrollId = params?.id as string;
  
  const { data, loading, error, refetch } = usePayrollData(payrollId);
  
  // All state management inline - no extraction
  const [updateNotes] = useMutation(UpdatePayrollDateNotesDocument);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState("");
  const [activeTab, setActiveTab] = useState("dates");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("table");

  // Inline status configuration (not extracted) - MASSIVE INLINE OBJECT
  const getStatusConfig = (status: string) => {
    const configs = {
      Implementation: {
        color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
        icon: Settings,
        progress: 0,
        description: "Initial setup and configuration phase",
        nextSteps: ["Complete client onboarding", "Set up payroll cycles"],
        priority: "high",
        estimatedCompletion: "2-3 days",
      },
      draft: {
        color: "bg-warning-500/10 text-warning-600 border-warning-500/20",
        icon: FileText,
        progress: 10,
        description: "Payroll is in draft state and needs completion",
        nextSteps: ["Review employee data", "Verify pay rates", "Add time entries"],
        priority: "medium",
        estimatedCompletion: "1-2 days",
      },
      "data-entry": {
        color: "bg-primary/10 text-primary border-primary/20",
        icon: Edit,
        progress: 30,
        description: "Data entry phase - adding employee information",
        nextSteps: ["Complete employee data", "Verify hours", "Check deductions"],
        priority: "high",
        estimatedCompletion: "3-5 days",
      },
      review: {
        color: "bg-accent text-accent-foreground border-border",
        icon: UserCheck,
        progress: 50,
        description: "Under review by consultant",
        nextSteps: ["Consultant review", "Client approval", "Final verification"],
        priority: "medium",
        estimatedCompletion: "1-2 days",
      },
      processing: {
        color: "bg-primary/10 text-primary border-primary/20",
        icon: RefreshCw,
        progress: 70,
        description: "Payroll is being processed",
        nextSteps: ["System processing", "Generate reports", "Prepare files"],
        priority: "high",
        estimatedCompletion: "4-6 hours",
      },
      "manager-review": {
        color: "bg-warning-500/10 text-warning-600 border-warning-500/20",
        icon: UserCheck,
        progress: 85,
        description: "Under manager review for final approval",
        nextSteps: ["Manager approval", "Final checks", "Submit for processing"],
        priority: "high",
        estimatedCompletion: "1 day",
      },
      approved: {
        color: "bg-success-500/10 text-success-600 border-success-500/20",
        icon: CheckCircle,
        progress: 95,
        description: "Approved and ready for submission",
        nextSteps: ["Submit to payroll provider", "Generate confirmations"],
        priority: "medium",
        estimatedCompletion: "2-4 hours",
      },
      submitted: {
        color: "bg-primary/10 text-primary border-primary/20",
        icon: Upload,
        progress: 100,
        description: "Submitted to payroll provider",
        nextSteps: ["Await confirmation", "Monitor processing"],
        priority: "low",
        estimatedCompletion: "Completed",
      },
      paid: {
        color: "bg-success-500/10 text-success-600 border-success-500/20",
        icon: CheckCircle,
        progress: 100,
        description: "Payroll has been successfully paid",
        nextSteps: ["Archive records", "Generate reports"],
        priority: "low",
        estimatedCompletion: "Completed",
      },
      "on-hold": {
        color: "bg-warning-500/10 text-warning-600 border-warning-500/20",
        icon: AlertTriangle,
        progress: 60,
        description: "Payroll is on hold pending resolution",
        nextSteps: ["Resolve issues", "Client communication", "Resume processing"],
        priority: "high",
        estimatedCompletion: "Depends on issue",
      },
      cancelled: {
        color: "bg-destructive/10 text-destructive border-destructive/20",
        icon: AlertTriangle,
        progress: 0,
        description: "Payroll has been cancelled",
        nextSteps: ["Archive records", "Client notification"],
        priority: "low",
        estimatedCompletion: "Completed",
      },
    } as const;

    return configs[status as keyof typeof configs] || configs["Implementation"];
  };

  // Inline handle save notes (not extracted) - MASSIVE INLINE FUNCTION
  const handleSaveNotes = async (payrollDateId: string) => {
    try {
      console.log("Saving notes for payroll date:", payrollDateId);
      console.log("Notes content:", notesValue);
      
      const result = await updateNotes({
        variables: {
          id: payrollDateId,
          notes: notesValue,
        },
      });
      
      console.log("Notes save result:", result);
      
      // Success handling
      setEditingNotes(null);
      setNotesValue("");
      
      // Show success message (inline implementation)
      const successMessage = document.createElement("div");
      successMessage.className = "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50";
      successMessage.textContent = "Notes saved successfully!";
      document.body.appendChild(successMessage);
      setTimeout(() => {
        if (document.body.contains(successMessage)) {
          document.body.removeChild(successMessage);
        }
      }, 3000);
      
      // Refetch data to update UI
      if (refetch) {
        await refetch();
      }
      
    } catch (error: any) {
      console.error("Error updating notes:", error);
      
      // Error handling (inline implementation)
      const errorMessage = document.createElement("div");
      errorMessage.className = "fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50";
      errorMessage.textContent = `Error saving notes: ${error.message || "Unknown error"}`;
      document.body.appendChild(errorMessage);
      setTimeout(() => {
        if (document.body.contains(errorMessage)) {
          document.body.removeChild(errorMessage);
        }
      }, 5000);
    }
  };

  // Inline utility functions (not extracted) - ALL INLINE
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${Math.round(value * 100)}%`;
  };

  const getDateStatus = (date: any) => {
    const now = new Date();
    const dateObj = new Date(date.adjustedEftDate);
    
    if (date.completed) {
      return { status: 'completed', color: 'text-green-600', bg: 'bg-green-100' };
    } else if (dateObj < now) {
      return { status: 'overdue', color: 'text-red-600', bg: 'bg-red-100' };
    } else if (dateObj.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return { status: 'upcoming', color: 'text-orange-600', bg: 'bg-orange-100' };
    } else {
      return { status: 'pending', color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const filterDatesByRange = (dates: any[]) => {
    const now = new Date();
    switch (selectedDateRange) {
      case 'past':
        return dates.filter(d => new Date(d.adjustedEftDate) < now);
      case 'upcoming':
        return dates.filter(d => new Date(d.adjustedEftDate) >= now);
      case 'this-month':
        return dates.filter(d => {
          const dateObj = new Date(d.adjustedEftDate);
          return dateObj.getMonth() === now.getMonth() && dateObj.getFullYear() === now.getFullYear();
        });
      default:
        return dates;
    }
  };

  const sortDates = (dates: any[]) => {
    return [...dates].sort((a, b) => {
      const dateA = new Date(a.adjustedEftDate);
      const dateB = new Date(b.adjustedEftDate);
      return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });
  };

  // MASSIVE INLINE LOADING STATE (not extracted) - HUGE SKELETON BLOCKS
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header skeleton - MASSIVE inline implementation */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-16" />
                <span className="text-muted-foreground">/</span>
                <Skeleton className="h-4 w-20" />
                <span className="text-muted-foreground">/</span>
                <Skeleton className="h-4 w-32" />
              </div>
            </div>

            <div className="pb-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Skeleton className="w-16 h-16 rounded-xl" />
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Skeleton className="h-8 w-64 mb-4" />
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <Skeleton className="h-4 w-48" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <Skeleton className="h-4 w-40" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <Skeleton className="h-4 w-36" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-20" />
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-10" />
                  <div className="relative">
                    <Skeleton className="h-10 w-10" />
                    <MoreVertical className="h-4 w-4 text-muted-foreground absolute top-3 left-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content skeleton - MASSIVE inline blocks, all expanded */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Advanced filters skeleton */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-4 w-4" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-4 w-18 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>

            {/* Overview cards skeleton - EXPANDED GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className={i >= 4 ? "md:col-span-2" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-3 w-32" />
                      <div className="flex items-center gap-2 mt-2">
                        <Skeleton className="h-2 w-full rounded-full" />
                        <Skeleton className="h-3 w-8" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Status timeline skeleton */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="relative">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        {i !== 5 && <div className="absolute top-8 left-4 w-0.5 h-8 bg-gray-200" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                        <Skeleton className="h-3 w-48 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Main tabs skeleton - EXPANDED */}
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-32" />
                ))}
              </div>
              
              {/* Tab content skeleton */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Table header */}
                    <div className="grid grid-cols-6 gap-4 p-4 border-b">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    
                    {/* Table rows */}
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="grid grid-cols-6 gap-4 p-4 border-b hover:bg-gray-50">
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-3 w-12" />
                        </div>
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-3/4" />
                        </div>
                        <div className="flex gap-1">
                          <Skeleton className="h-6 w-6 rounded" />
                          <Skeleton className="h-6 w-6 rounded" />
                          <Skeleton className="h-6 w-6 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination skeleton */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <Skeleton className="h-4 w-32" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <span className="text-muted-foreground">...</span>
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
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

  // Inline error handling (not extracted) - MASSIVE ERROR PAGE
  if (error || !data?.payroll) {
    return (
      <PayrollErrorBoundary>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="mx-auto max-w-md">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-10 w-10 text-red-600" />
                </div>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
                  Error Loading Payroll
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                  {error?.message || "The payroll you're looking for could not be found."}
                </p>
                <div className="mt-6">
                  <div className="space-y-3">
                    <Button 
                      onClick={() => refetch?.()} 
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                    <div className="text-center">
                      <Link
                        href="/payrolls"
                        className="text-base font-medium text-blue-600 hover:text-blue-500"
                      >
                        Back to Payrolls <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Detailed error information */}
                <div className="mt-8 bg-gray-50 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Troubleshooting Steps
                  </h3>
                  <ul className="text-left text-sm text-gray-600 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Check your internet connection
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Verify you have permission to view this payroll
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Try refreshing the page
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Contact support if the issue persists
                    </li>
                  </ul>
                </div>

                {/* Contact support section */}
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Still need help?
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Support
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Support
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Live Chat
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PayrollErrorBoundary>
    );
  }

  // Get payroll data and calculate everything inline
  const payroll = data.payroll;
  const payrollDates = data?.payroll?.detailPayrollDates || [];
  const statusConfig = getStatusConfig(payroll.status || "draft");
  const StatusIcon = statusConfig.icon;

  // Inline schedule info calculation (not extracted) - MASSIVE CALCULATION
  const scheduleInfo = useMemo(() => {
    if (!payroll?.payrollCycle?.name || !payroll?.payrollDateType?.name) {
      return {
        displayName: "Custom Schedule",
        description: "Custom payroll schedule",
        frequency: "Custom",
        nextDate: null,
        estimatedDates: 0
      };
    }
    
    const summary = getEnhancedScheduleSummary(payroll);
    
    // Enhanced schedule calculation
    const cycle = payroll.payrollCycle.name;
    const dateType = payroll.payrollDateType.name;
    const dateValue = payroll.dateValue;
    
    const enhancedSummary = {
      ...summary,
      cycle,
      dateType, 
      dateValue,
      description: `${cycle} payroll running on ${dateType}`,
      estimatedAnnualDates: 0,
      averageProcessingTime: "2-3 business days",
      complexity: "Standard",
      riskLevel: "Low"
    };
    
    // Calculate estimated annual dates
    switch (cycle) {
      case 'weekly':
        enhancedSummary.estimatedAnnualDates = 52;
        enhancedSummary.complexity = "Standard";
        break;
      case 'fortnightly':
        enhancedSummary.estimatedAnnualDates = 26;
        enhancedSummary.complexity = "Standard";
        break;
      case 'monthly':
        enhancedSummary.estimatedAnnualDates = 12;
        enhancedSummary.complexity = "Simple";
        break;
      case 'bi_monthly':
        enhancedSummary.estimatedAnnualDates = 24;
        enhancedSummary.complexity = "Standard";
        break;
      default:
        enhancedSummary.estimatedAnnualDates = 12;
        enhancedSummary.complexity = "Custom";
    }
    
    return enhancedSummary;
  }, [payroll]);

  // Inline stats calculation (not extracted) - MASSIVE CALCULATIONS
  const stats = useMemo(() => {
    const total = payrollDates.length;
    const completed = payrollDates.filter((d: any) => d.completed).length;
    const upcoming = payrollDates.filter((d: any) => 
      !d.completed && new Date(d.adjustedEftDate) > new Date()
    ).length;
    const overdue = payrollDates.filter((d: any) => 
      !d.completed && new Date(d.adjustedEftDate) < new Date()
    ).length;
    
    // Advanced statistics
    const thisMonth = payrollDates.filter((d: any) => {
      const date = new Date(d.adjustedEftDate);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;
    
    const nextMonth = payrollDates.filter((d: any) => {
      const date = new Date(d.adjustedEftDate);
      const now = new Date();
      const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      return date.getMonth() === nextMonthDate.getMonth() && date.getFullYear() === nextMonthDate.getFullYear();
    }).length;
    
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    const onTimeRate = total > 0 ? ((completed + upcoming) / total) * 100 : 0;
    
    // Financial calculations (mock data for display)
    const estimatedTotalAmount = total * 5000; // Mock calculation
    const processedAmount = completed * 5000;
    const remainingAmount = estimatedTotalAmount - processedAmount;
    
    return { 
      total, 
      completed, 
      upcoming, 
      overdue,
      pendingReview: total - completed - upcoming - overdue,
      thisMonth,
      nextMonth,
      completionRate,
      onTimeRate,
      estimatedTotalAmount,
      processedAmount,
      remainingAmount
    };
  }, [payrollDates]);

  // Filter and sort dates inline
  const filteredDates = useMemo(() => {
    const dates = filterDatesByRange(payrollDates);
    return sortDates(dates);
  }, [payrollDates, selectedDateRange, sortOrder]);

  // MASSIVE INLINE RETURN - ALL JSX IN ONE GIANT BLOCK (PERFORMANCE KILLER)
  return (
    <PayrollErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Header - MASSIVE inline header with everything expanded */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb navigation */}
            <div className="py-4 border-b border-gray-100">
              <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Link href="/dashboard" className="hover:text-foreground flex items-center gap-1">
                  <Home className="h-3 w-3" />
                  Dashboard
                </Link>
                <ChevronRight className="h-3 w-3" />
                <Link href="/payrolls" className="hover:text-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Payrolls
                </Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground font-medium">{payroll.name}</span>
              </nav>
            </div>

            {/* Main header section */}
            <div className="py-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-6">
                    <div className="relative">
                      <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                        <AvatarImage src={`/api/avatar/${payroll.client?.name}`} />
                        <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                          <Building2 className="h-10 w-10" />
                        </AvatarFallback>
                      </Avatar>
                      {/* Status indicator overlay */}
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                        <StatusIcon className="h-3 w-3 text-blue-600" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-4">
                        <h1 className="text-3xl font-bold text-foreground truncate">
                          {payroll.name}
                        </h1>
                        
                        {/* Quick actions dropdown */}
                        <div className="flex items-center gap-2 ml-4">
                          <Badge 
                            className={`${statusConfig.color} text-xs font-medium px-3 py-1`}
                          >
                            {payroll.status?.replace("-", " ").replace(/\b\w/g, (l: string) => l.toUpperCase()) || "Draft"}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Detailed information grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Client:</span>
                            <Link
                              href={`/clients/${payroll.client?.id}`}
                              className="text-blue-600 hover:underline font-medium truncate"
                            >
                              {payroll.client?.name}
                            </Link>
                          </div>
                          
                          {payroll.employeeCount && (
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Employees:</span>
                              <span className="text-foreground font-medium">
                                {payroll.employeeCount} employee{payroll.employeeCount !== 1 ? 's' : ''}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Schedule:</span>
                            <span className="text-foreground font-medium">
                              {typeof scheduleInfo === 'string' ? scheduleInfo : (scheduleInfo as any)?.displayName || "Custom"}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Progress:</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-500 transition-all duration-300"
                                  style={{ width: `${statusConfig.progress}%` }}
                                />
                              </div>
                              <span className="text-foreground font-medium text-xs">
                                {statusConfig.progress}%
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Completion:</span>
                            <span className="text-foreground font-medium">
                              {stats.completed} of {stats.total} dates
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Success Rate:</span>
                            <span className="text-foreground font-medium">
                              {stats.onTimeRate.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Created:</span>
                            <span className="text-foreground font-medium">
                              {safeFormatDate(payroll.createdAt, "MMM dd, yyyy")}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <RefreshCw className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Updated:</span>
                            <span className="text-foreground font-medium">
                              {safeFormatDate(payroll.updatedAt, "MMM dd, yyyy")}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Processing:</span>
                            <span className="text-foreground font-medium">
                              {(scheduleInfo as any)?.averageProcessingTime || "2-3 days"}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Estimated:</span>
                            <span className="text-foreground font-medium">
                              {formatCurrency(stats.estimatedTotalAmount)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Processed:</span>
                            <span className="text-foreground font-medium">
                              {formatCurrency(stats.processedAmount)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Remaining:</span>
                            <span className="text-foreground font-medium">
                              {formatCurrency(stats.remainingAmount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons - EXPANDED */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium text-muted-foreground">Priority</span>
                    <Badge variant="secondary" className="text-xs">
                      {(statusConfig as any).priority || "Medium"}
                    </Badge>
                  </div>
                  
                  <Button variant="outline" size="sm" className="hidden sm:flex">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  
                  <Button variant="outline" size="sm" className="hidden sm:flex">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  
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
                  
                  <Button variant="outline" size="icon">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content - ALL INLINE, MASSIVE CONTENT BLOCKS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            
            {/* Advanced filters section - INLINE MASSIVE FILTERS */}
            <Card className="border-2 border-blue-100 bg-blue-50/30">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg text-blue-900">Advanced Filters & Controls</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  >
                    {showAdvancedFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              {showAdvancedFilters && (
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    <div>
                      <Label htmlFor="date-range" className="text-sm font-medium text-gray-700">
                        Date Range
                      </Label>
                      <select
                        id="date-range"
                        value={selectedDateRange}
                        onChange={(e) => setSelectedDateRange(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="all">All Dates</option>
                        <option value="past">Past Dates</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="this-month">This Month</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="sort-order" className="text-sm font-medium text-gray-700">
                        Sort Order
                      </Label>
                      <select
                        id="sort-order"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="asc">Oldest First</option>
                        <option value="desc">Newest First</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="view-mode" className="text-sm font-medium text-gray-700">
                        View Mode
                      </Label>
                      <select
                        id="view-mode"
                        value={viewMode}
                        onChange={(e) => setViewMode(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="table">Table View</option>
                        <option value="card">Card View</option>
                        <option value="timeline">Timeline View</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2 lg:col-span-1">
                      <Label className="text-sm font-medium text-gray-700">
                        Quick Actions
                      </Label>
                      <div className="mt-1 flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          CSV
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share className="h-3 w-3 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Search & Filter
                      </Label>
                      <div className="mt-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search notes, dates..."
                          className="block w-full rounded-md border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Overview Cards - MASSIVE EXPANDED GRID, all inline */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6 mb-8">
              
              {/* Total Pay Periods Card */}
              <Card className="relative overflow-hidden border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Pay Periods
                    </CardTitle>
                    <Calendar className="h-8 w-8 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>Scheduled dates</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div className="bg-blue-500 h-1 rounded-full" style={{width: '100%'}} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Completed Card */}
              <Card className="relative overflow-hidden border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Completed
                    </CardTitle>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      <span>{stats.completionRate.toFixed(1)}% completion rate</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-green-500 h-1 rounded-full transition-all duration-300" 
                        style={{width: `${stats.completionRate}%`}} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Card */}
              <Card className="relative overflow-hidden border-l-4 border-l-blue-400 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Upcoming
                    </CardTitle>
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-600">{stats.upcoming}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Future dates scheduled</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-blue-500 h-1 rounded-full transition-all duration-300" 
                        style={{width: `${stats.total > 0 ? (stats.upcoming / stats.total) * 100 : 0}%`}} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Overdue Card */}
              <Card className="relative overflow-hidden border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Overdue
                    </CardTitle>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      <span>Require immediate attention</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-red-500 h-1 rounded-full transition-all duration-300" 
                        style={{width: `${stats.total > 0 ? (stats.overdue / stats.total) * 100 : 0}%`}} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* This Month Card */}
              <Card className="relative overflow-hidden border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      This Month
                    </CardTitle>
                    <CalendarDays className="h-8 w-8 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-purple-600">{stats.thisMonth}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <CalendarDays className="h-3 w-3 mr-1" />
                      <span>Dates this month</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div className="bg-purple-500 h-1 rounded-full" style={{width: '85%'}} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Overview Card */}
              <Card className="relative overflow-hidden border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Value
                    </CardTitle>
                    <DollarSign className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-yellow-600">
                      {formatCurrency(stats.estimatedTotalAmount)}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <DollarSign className="h-3 w-3 mr-1" />
                      <span>Estimated total</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-yellow-500 h-1 rounded-full transition-all duration-300" 
                        style={{width: `${(stats.processedAmount / stats.estimatedTotalAmount) * 100}%`}} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status Progress Timeline - MASSIVE INLINE TIMELINE */}
            <Card className="mb-8 border-2 border-gray-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <CardTitle>Payroll Status Timeline</CardTitle>
                </div>
                <CardDescription>
                  Track the progress of your payroll through each stage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
                  <div className="space-y-6">
                    {[
                      { 
                        status: 'Implementation', 
                        completed: true, 
                        date: payroll.createdAt,
                        description: 'Payroll setup and initial configuration'
                      },
                      { 
                        status: 'draft', 
                        completed: payroll.status !== 'Implementation', 
                        date: payroll.createdAt,
                        description: 'Draft payroll created and ready for data entry'
                      },
                      { 
                        status: 'data-entry', 
                        completed: !['Implementation', 'draft'].includes(payroll.status || ''), 
                        date: null,
                        description: 'Employee data and timesheet information entry'
                      },
                      { 
                        status: 'review', 
                        completed: !['Implementation', 'draft', 'data-entry'].includes(payroll.status || ''), 
                        date: null,
                        description: 'Consultant review and quality checking'
                      },
                      { 
                        status: 'approved', 
                        completed: ['submitted', 'paid'].includes(payroll.status || ''), 
                        date: null,
                        description: 'Final approval and ready for submission'
                      },
                      { 
                        status: 'paid', 
                        completed: payroll.status === 'paid', 
                        date: null,
                        description: 'Payroll processed and payments completed'
                      }
                    ].map((stage, index) => {
                      const config = getStatusConfig(stage.status);
                      const StageIcon = config.icon;
                      
                      return (
                        <div key={stage.status} className="relative flex items-center gap-4">
                          <div className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 ${
                            stage.completed 
                              ? 'bg-green-100 border-green-500 text-green-600' 
                              : payroll.status === stage.status
                                ? 'bg-blue-100 border-blue-500 text-blue-600'
                                : 'bg-gray-100 border-gray-300 text-gray-400'
                          }`}>
                            <StageIcon className="h-6 w-6" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className={`text-base font-medium ${
                                stage.completed ? 'text-green-600' : 
                                payroll.status === stage.status ? 'text-blue-600' : 'text-gray-400'
                              }`}>
                                {stage.status.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                              </h3>
                              {stage.date && (
                                <span className="text-sm text-muted-foreground">
                                  {safeFormatDate(stage.date, "MMM dd, yyyy")}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {stage.description}
                            </p>
                            {payroll.status === stage.status && (
                              <div className="mt-2">
                                <Badge className={config.color}>
                                  Current Stage
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Content Tabs - ALL INLINE, MASSIVE TABS */}
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="space-y-6"
            >
              <div className="border-b border-gray-200">
                <TabsList className="grid w-full grid-cols-6 bg-gray-50 rounded-lg p-1">
                  <TabsTrigger 
                    value="dates"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Payroll Dates
                  </TabsTrigger>
                  <TabsTrigger 
                    value="assignments"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Assignments
                  </TabsTrigger>
                  <TabsTrigger 
                    value="documents"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Documents
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notes"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <StickyNote className="h-4 w-4 mr-2" />
                    Notes
                  </TabsTrigger>
                  <TabsTrigger 
                    value="analytics"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger 
                    value="history"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    History
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="dates" className="space-y-6">
                {/* Payroll Dates Table - MASSIVE INLINE TABLE, all functionality inline */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        <CardTitle>Payroll Dates</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Date
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                        <Button size="sm" variant="outline">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>
                      Manage all payroll processing dates and their status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Table controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Show:</span>
                            <select className="text-sm border rounded px-2 py-1">
                              <option value="10">10</option>
                              <option value="25">25</option>
                              <option value="50">50</option>
                              <option value="all">All</option>
                            </select>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Filter:</span>
                            <select className="text-sm border rounded px-2 py-1">
                              <option value="all">All Status</option>
                              <option value="completed">Completed</option>
                              <option value="pending">Pending</option>
                              <option value="overdue">Overdue</option>
                            </select>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Showing {filteredDates.length} of {payrollDates.length} dates
                        </div>
                      </div>
                      
                      <div className="overflow-x-auto border rounded-lg">
                        <table className="w-full border-collapse bg-white">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="text-left p-4 font-medium text-gray-900 border-b">
                                <div className="flex items-center gap-2">
                                  Original Date
                                  <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                                    <ChevronUp className="h-3 w-3" />
                                  </Button>
                                </div>
                              </th>
                              <th className="text-left p-4 font-medium text-gray-900 border-b">
                                <div className="flex items-center gap-2">
                                  Adjusted Date
                                  <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                                    <ChevronUp className="h-3 w-3" />
                                  </Button>
                                </div>
                              </th>
                              <th className="text-left p-4 font-medium text-gray-900 border-b">Processing Date</th>
                              <th className="text-left p-4 font-medium text-gray-900 border-b">Status</th>
                              <th className="text-left p-4 font-medium text-gray-900 border-b">Notes</th>
                              <th className="text-left p-4 font-medium text-gray-900 border-b">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredDates.map((date: any, index: number) => {
                              const dateStatus = getDateStatus(date);
                              return (
                                <tr 
                                  key={date.id} 
                                  className={`border-b hover:bg-gray-50 transition-colors ${
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                                  }`}
                                >
                                  <td className="p-4">
                                    <div className="space-y-1">
                                      <div className="font-medium text-gray-900">
                                        {safeFormatDate(date.originalEftDate, "MMM dd, yyyy")}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {safeFormatDate(date.originalEftDate, "EEEE")}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <div className="space-y-1">
                                      <div className={`font-medium ${
                                        date.originalEftDate !== date.adjustedEftDate 
                                          ? 'text-orange-600' 
                                          : 'text-gray-900'
                                      }`}>
                                        {safeFormatDate(date.adjustedEftDate, "MMM dd, yyyy")}
                                      </div>
                                      {date.originalEftDate !== date.adjustedEftDate && (
                                        <Badge variant="outline" className="text-xs">
                                          <AlertTriangle className="h-3 w-3 mr-1" />
                                          Adjusted
                                        </Badge>
                                      )}
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <div className="text-gray-600">
                                      {safeFormatDate(date.processingDate, "MMM dd, yyyy")}
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <div className="space-y-2">
                                      {date.completed ? (
                                        <Badge className="bg-green-100 text-green-800 border-green-200">
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
                                      <div className="text-xs text-muted-foreground">
                                        Priority: {Math.floor(Math.random() * 3) === 0 ? 'High' : 
                                                 Math.floor(Math.random() * 2) === 0 ? 'Medium' : 'Low'}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    {editingNotes === date.id ? (
                                      <div className="space-y-2 min-w-[200px]">
                                        <Textarea
                                          value={notesValue}
                                          onChange={(e) => setNotesValue(e.target.value)}
                                          className="min-h-[80px] text-sm"
                                          placeholder="Add notes about this payroll date..."
                                        />
                                        <div className="flex gap-2">
                                          <Button
                                            size="sm"
                                            onClick={() => handleSaveNotes(date.id)}
                                            className="text-xs"
                                          >
                                            <Save className="h-3 w-3 mr-1" />
                                            Save
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                              setEditingNotes(null);
                                              setNotesValue("");
                                            }}
                                            className="text-xs"
                                          >
                                            <X className="h-3 w-3 mr-1" />
                                            Cancel
                                          </Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="max-w-xs space-y-1">
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                          {date.notes || "No notes added"}
                                        </p>
                                        {date.notes && (
                                          <div className="text-xs text-muted-foreground">
                                            Last updated: {safeFormatDate(new Date(), "MMM dd")}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </td>
                                  <td className="p-4">
                                    <div className="flex items-center gap-1">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                          setEditingNotes(date.id);
                                          setNotesValue(date.notes || "");
                                        }}
                                        className="h-8 w-8 p-0"
                                      >
                                        <MessageCircle className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0"
                                      >
                                        <Eye className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0"
                                      >
                                        <MoreVertical className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        
                        {filteredDates.length === 0 && (
                          <div className="text-center py-12 bg-white">
                            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No payroll dates found</h3>
                            <p className="text-muted-foreground mb-4">
                              Get started by adding your first payroll date.
                            </p>
                            <Button>
                              <Plus className="h-4 w-4 mr-2" />
                              Add Payroll Date
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      {/* Pagination */}
                      {filteredDates.length > 10 && (
                        <div className="flex items-center justify-between pt-4">
                          <div className="text-sm text-muted-foreground">
                            Showing 1-10 of {filteredDates.length} dates
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" disabled>
                              <ChevronLeft className="h-4 w-4" />
                              Previous
                            </Button>
                            <div className="flex items-center gap-1">
                              <Button variant="outline" size="sm" className="bg-blue-50 border-blue-200">
                                1
                              </Button>
                              <Button variant="ghost" size="sm">2</Button>
                              <Button variant="ghost" size="sm">3</Button>
                              <span className="text-muted-foreground">...</span>
                              <Button variant="ghost" size="sm">10</Button>
                            </div>
                            <Button variant="outline" size="sm">
                              Next
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="assignments" className="space-y-6">
                {/* Staff Assignments - ALL INLINE, MASSIVE ASSIGNMENTS SECTION */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-5 w-5" />
                        <CardTitle>Staff Assignments</CardTitle>
                      </div>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Assignments
                      </Button>
                    </div>
                    <CardDescription>
                      Manage consultant and manager assignments for this payroll
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Primary Consultant - EXPANDED CARD */}
                      <Card className="border-2 border-blue-100 bg-blue-50/30">
                        <CardHeader className="pb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <UserCheck className="h-4 w-4 text-blue-600" />
                            </div>
                            <CardTitle className="text-base text-blue-900">Primary Consultant</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <Avatar className="w-12 h-12 border-2 border-blue-200">
                                <AvatarImage src={`/api/avatar/${payroll.primaryConsultant?.firstName}`} />
                                <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                                  {payroll.primaryConsultant?.firstName?.[0]}{payroll.primaryConsultant?.lastName?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">
                                  {payroll.primaryConsultant?.computedName || "Unassigned"}
                                </p>
                                <p className="text-sm text-blue-600 font-medium">Primary Consultant</p>
                                {payroll.primaryConsultant?.email && (
                                  <p className="text-xs text-muted-foreground">
                                    {payroll.primaryConsultant.email}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-2 text-xs">
                              <div className="flex items-center gap-2">
                                <Star className="h-3 w-3 text-yellow-500" />
                                <span className="text-muted-foreground">Rating:</span>
                                <span className="font-medium">4.8/5.0</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Target className="h-3 w-3 text-green-500" />
                                <span className="text-muted-foreground">Completion Rate:</span>
                                <span className="font-medium">98.2%</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3 text-blue-500" />
                                <span className="text-muted-foreground">Avg Response:</span>
                                <span className="font-medium">2.1 hours</span>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="text-xs">
                                <Mail className="h-3 w-3 mr-1" />
                                Contact
                              </Button>
                              <Button size="sm" variant="outline" className="text-xs">
                                <Eye className="h-3 w-3 mr-1" />
                                Profile
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Backup Consultant - EXPANDED CARD */}
                      <Card className="border-2 border-orange-100 bg-orange-50/30">
                        <CardHeader className="pb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                              <Users className="h-4 w-4 text-orange-600" />
                            </div>
                            <CardTitle className="text-base text-orange-900">Backup Consultant</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <Avatar className="w-12 h-12 border-2 border-orange-200">
                                <AvatarImage src={`/api/avatar/${payroll.backupConsultant?.firstName}`} />
                                <AvatarFallback className="bg-orange-100 text-orange-700 font-semibold">
                                  {payroll.backupConsultant?.firstName?.[0]}{payroll.backupConsultant?.lastName?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">
                                  {payroll.backupConsultant?.computedName || "Unassigned"}
                                </p>
                                <p className="text-sm text-orange-600 font-medium">Backup Consultant</p>
                                {payroll.backupConsultant?.email && (
                                  <p className="text-xs text-muted-foreground">
                                    {payroll.backupConsultant.email}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-2 text-xs">
                              <div className="flex items-center gap-2">
                                <Star className="h-3 w-3 text-yellow-500" />
                                <span className="text-muted-foreground">Rating:</span>
                                <span className="font-medium">4.6/5.0</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Target className="h-3 w-3 text-green-500" />
                                <span className="text-muted-foreground">Completion Rate:</span>
                                <span className="font-medium">96.8%</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3 text-blue-500" />
                                <span className="text-muted-foreground">Avg Response:</span>
                                <span className="font-medium">3.2 hours</span>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="text-xs">
                                <Mail className="h-3 w-3 mr-1" />
                                Contact
                              </Button>
                              <Button size="sm" variant="outline" className="text-xs">
                                <Eye className="h-3 w-3 mr-1" />
                                Profile
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Manager - EXPANDED CARD */}
                      <Card className="border-2 border-green-100 bg-green-50/30">
                        <CardHeader className="pb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                              <Settings className="h-4 w-4 text-green-600" />
                            </div>
                            <CardTitle className="text-base text-green-900">Manager</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <Avatar className="w-12 h-12 border-2 border-green-200">
                                <AvatarImage src={`/api/avatar/${payroll.assignedManager?.firstName}`} />
                                <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
                                  {payroll.assignedManager?.firstName?.[0]}{payroll.assignedManager?.lastName?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">
                                  {payroll.assignedManager?.computedName || "Unassigned"}
                                </p>
                                <p className="text-sm text-green-600 font-medium">Manager</p>
                                {payroll.assignedManager?.email && (
                                  <p className="text-xs text-muted-foreground">
                                    {payroll.assignedManager.email}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-2 text-xs">
                              <div className="flex items-center gap-2">
                                <Star className="h-3 w-3 text-yellow-500" />
                                <span className="text-muted-foreground">Rating:</span>
                                <span className="font-medium">4.9/5.0</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Target className="h-3 w-3 text-green-500" />
                                <span className="text-muted-foreground">Team Performance:</span>
                                <span className="font-medium">99.1%</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3 text-blue-500" />
                                <span className="text-muted-foreground">Avg Review Time:</span>
                                <span className="font-medium">1.3 hours</span>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="text-xs">
                                <Mail className="h-3 w-3 mr-1" />
                                Contact
                              </Button>
                              <Button size="sm" variant="outline" className="text-xs">
                                <Eye className="h-3 w-3 mr-1" />
                                Profile
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Assignment History */}
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Assignment History
                      </h3>
                      <div className="space-y-3">
                        {[
                          {
                            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                            action: "Assigned primary consultant",
                            user: payroll.primaryConsultant?.computedName,
                            type: "assignment"
                          },
                          {
                            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                            action: "Changed manager assignment",
                            user: payroll.assignedManager?.computedName,
                            type: "reassignment"
                          },
                          {
                            date: new Date(payroll.createdAt || Date.now() - 30 * 24 * 60 * 60 * 1000),
                            action: "Initial assignments created",
                            user: "System",
                            type: "creation"
                          }
                        ].map((event, index) => (
                          <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              event.type === 'assignment' ? 'bg-blue-100 text-blue-600' :
                              event.type === 'reassignment' ? 'bg-orange-100 text-orange-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {event.type === 'assignment' ? <UserCheck className="h-4 w-4" /> :
                               event.type === 'reassignment' ? <RefreshCw className="h-4 w-4" /> :
                               <Plus className="h-4 w-4" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{event.action}</p>
                              <p className="text-xs text-muted-foreground">
                                {event.user} • {safeFormatDate(event.date, "MMM dd, yyyy 'at' h:mm a")}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
                {/* Documents - MASSIVE DOCUMENTS SECTION, no Suspense */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        <CardTitle>Documents</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Document
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download All
                        </Button>
                      </div>
                    </div>
                    <CardDescription>
                      Manage all documents related to this payroll
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Document categories */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <Card className="border-2 border-blue-100">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <CardTitle className="text-sm">Payroll Files</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-2xl font-bold text-blue-600 mb-1">12</div>
                          <div className="text-xs text-muted-foreground">Excel sheets, PDFs</div>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-2 border-green-100">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <CardTitle className="text-sm">Approvals</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-2xl font-bold text-green-600 mb-1">5</div>
                          <div className="text-xs text-muted-foreground">Signed documents</div>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-2 border-orange-100">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            <CardTitle className="text-sm">Issues</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-2xl font-bold text-orange-600 mb-1">2</div>
                          <div className="text-xs text-muted-foreground">Require attention</div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Document list - INLINE IMPLEMENTATION */}
                    <DocumentList 
                      payrollId={payrollId}
                      showUploadButton={true}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="space-y-6">
                {/* Notes - MASSIVE NOTES SECTION, all inline */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StickyNote className="h-5 w-5" />
                        <CardTitle>Notes</CardTitle>
                      </div>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Note
                      </Button>
                    </div>
                    <CardDescription>
                      Team notes and comments about this payroll
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Note categories */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="border-2 border-blue-100">
                          <CardContent className="p-4 text-center">
                            <MessageCircle className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                            <div className="text-lg font-bold text-blue-600">23</div>
                            <div className="text-xs text-muted-foreground">General Notes</div>
                          </CardContent>
                        </Card>
                        
                        <Card className="border-2 border-yellow-100">
                          <CardContent className="p-4 text-center">
                            <AlertTriangle className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                            <div className="text-lg font-bold text-yellow-600">3</div>
                            <div className="text-xs text-muted-foreground">Issues</div>
                          </CardContent>
                        </Card>
                        
                        <Card className="border-2 border-green-100">
                          <CardContent className="p-4 text-center">
                            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                            <div className="text-lg font-bold text-green-600">8</div>
                            <div className="text-xs text-muted-foreground">Completed</div>
                          </CardContent>
                        </Card>
                        
                        <Card className="border-2 border-purple-100">
                          <CardContent className="p-4 text-center">
                            <Star className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                            <div className="text-lg font-bold text-purple-600">5</div>
                            <div className="text-xs text-muted-foreground">Important</div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      {/* Sample notes */}
                      <div className="space-y-4">
                        {[
                          {
                            id: 1,
                            author: "Sarah Johnson",
                            role: "Primary Consultant",
                            content: "Client has requested additional reporting for this payroll cycle. Need to include overtime breakdown and department-wise summaries.",
                            type: "general",
                            priority: "high",
                            created: new Date(Date.now() - 2 * 60 * 60 * 1000),
                            tags: ["reporting", "client-request"]
                          },
                          {
                            id: 2,
                            author: "Mike Chen",
                            role: "Manager",
                            content: "Reviewed timesheet data - found discrepancies in Department A. Following up with client for clarification.",
                            type: "issue",
                            priority: "high",
                            created: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                            tags: ["timesheet", "discrepancy"]
                          },
                          {
                            id: 3,
                            author: "Lisa Wang",
                            role: "Backup Consultant",
                            content: "All leave calculations have been verified and approved. Ready for final processing.",
                            type: "completed",
                            priority: "low",
                            created: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                            tags: ["leave", "verified"]
                          }
                        ].map((note) => (
                          <Card key={note.id} className={`border-l-4 ${
                            note.type === 'issue' ? 'border-l-red-500 bg-red-50/30' :
                            note.type === 'completed' ? 'border-l-green-500 bg-green-50/30' :
                            'border-l-blue-500 bg-blue-50/30'
                          }`}>
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarFallback className="text-xs">
                                      {note.author.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium text-sm">{note.author}</div>
                                    <div className="text-xs text-muted-foreground">{note.role}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge 
                                    variant={note.priority === 'high' ? 'destructive' : 'secondary'}
                                    className="text-xs"
                                  >
                                    {note.priority}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {safeFormatDate(note.created, "MMM dd 'at' h:mm a")}
                                  </span>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <p className="text-sm text-gray-700 mb-3">{note.content}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex gap-1">
                                  {note.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      <Hash className="h-2 w-2 mr-1" />
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <MessageCircle className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <Star className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <MoreVertical className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      {/* Add new note form */}
                      <Card className="border-2 border-dashed border-gray-300">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <Plus className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium text-muted-foreground">Add a new note</span>
                            </div>
                            <Textarea 
                              placeholder="Share updates, questions, or important information about this payroll..."
                              className="min-h-[100px]"
                            />
                            <div className="flex items-center justify-between">
                              <div className="flex gap-2">
                                <select className="text-sm border rounded px-3 py-1">
                                  <option>General</option>
                                  <option>Issue</option>
                                  <option>Important</option>
                                  <option>Completed</option>
                                </select>
                                <select className="text-sm border rounded px-3 py-1">
                                  <option>Normal Priority</option>
                                  <option>High Priority</option>
                                  <option>Low Priority</option>
                                </select>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">Cancel</Button>
                                <Button size="sm">
                                  <MessageCircle className="h-3 w-3 mr-1" />
                                  Add Note
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                {/* Analytics - MASSIVE ANALYTICS SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Completion Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Chart visualization would go here</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        Status Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Pie chart would go here</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                {/* History - MASSIVE HISTORY SECTION */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Payroll History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Payroll history timeline would be displayed here</p>
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