"use client";

import {
  ArrowLeft,
  Edit,
  MoreHorizontal,
  Copy,
  Archive,
  Trash2,
  Download,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { PermissionGuard, CanUpdate, CanDelete } from "@/components/auth/permission-guard";
import { toast } from "sonner";
import type { PayrollData } from "@/domains/payrolls/hooks/usePayrollData";

export interface PayrollHeaderProps {
  data: PayrollData;
  loading?: boolean;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onExport?: () => void;
}

// Helper function to get status configuration
function getStatusConfig(status: string) {
  const configs = {
    Implementation: { variant: "secondary" as const, icon: Clock, color: "text-blue-600" },
    Active: { variant: "default" as const, icon: CheckCircle, color: "text-green-600" },
    Inactive: { variant: "secondary" as const, icon: AlertTriangle, color: "text-gray-600" },
    Draft: { variant: "outline" as const, icon: FileText, color: "text-gray-600" },
    "On Hold": { variant: "destructive" as const, icon: AlertTriangle, color: "text-red-600" },
  };
  
  return configs[status as keyof typeof configs] || configs.Implementation;
}

// Helper function to generate user initials
function getUserInitials(user: any): string {
  if (!user) return "?";
  
  const name = user.computedName || `${user.firstName || ""} ${user.lastName || ""}`.trim();
  if (!name || name === "Unknown User") return "U";
  
  const nameParts = name.split(" ");
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }
  
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
}

// Helper function to format date
function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "Not set";
  
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function PayrollHeaderComponent({
  data,
  loading = false,
  onEdit,
  onDuplicate,
  onArchive,
  onDelete,
  onExport,
}: PayrollHeaderProps) {
  const router = useRouter();
  const { payroll } = data;

  if (loading || !payroll) {
    return <PayrollHeaderSkeleton />;
  }

  const statusConfig = getStatusConfig(payroll.status || "Implementation");
  const StatusIcon = statusConfig.icon;

  const nextPayDate = payroll.detailPayrollDates?.[0];
  const upcomingDate = nextPayDate?.adjustedEftDate || nextPayDate?.originalEftDate;

  // Handle action callbacks with error handling
  const handleAction = (action: (() => void) | undefined, actionName: string) => {
    try {
      if (action) {
        action();
      } else {
        toast.info(`${actionName} feature coming soon`);
      }
    } catch (error) {
      console.error(`Error in ${actionName}:`, error);
      toast.error(`Failed to ${actionName.toLowerCase()}`);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="py-4">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link
              href="/payrolls"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Payrolls
            </Link>
            <span>/</span>
            <span className="font-medium text-foreground">{payroll.name}</span>
          </nav>
        </div>

        {/* Main header content */}
        <div className="pb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Left side - Payroll info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-4">
                {/* Payroll avatar/icon */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Payroll details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900 truncate">
                      {payroll.name}
                    </h1>
                    <Badge variant={statusConfig.variant} className="shrink-0">
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {payroll.status || "Implementation"}
                    </Badge>
                  </div>

                  {/* Key details in a compact layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    {/* Client */}
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Client:</span>
                      <span className="font-medium">
                        {payroll.client?.name || "No client assigned"}
                      </span>
                    </div>

                    {/* Employee count */}
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Employees:</span>
                      <span className="font-medium">
                        {payroll.employeeCount || 0}
                      </span>
                    </div>

                    {/* Next pay date */}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Next Pay:</span>
                      <span className="font-medium">
                        {upcomingDate ? formatDate(upcomingDate) : "Not scheduled"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consultant assignments */}
              <div className="mt-6 flex flex-wrap items-center gap-4">
                {payroll.primaryConsultant && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Primary:</span>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage 
                          src={payroll.primaryConsultant.image || undefined} 
                          alt={payroll.primaryConsultant.computedName || "User"} 
                        />
                        <AvatarFallback className="text-xs">
                          {getUserInitials(payroll.primaryConsultant)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {payroll.primaryConsultant.computedName || 
                         `${payroll.primaryConsultant.firstName || ""} ${payroll.primaryConsultant.lastName || ""}`.trim() ||
                         "Unknown User"}
                      </span>
                    </div>
                  </div>
                )}

                {payroll.backupConsultant && (
                  <>
                    <Separator orientation="vertical" className="h-6" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Backup:</span>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage 
                            src={payroll.backupConsultant.image || undefined} 
                            alt={payroll.backupConsultant.computedName || "User"} 
                          />
                          <AvatarFallback className="text-xs">
                            {getUserInitials(payroll.backupConsultant)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {payroll.backupConsultant.computedName || 
                           `${payroll.backupConsultant.firstName || ""} ${payroll.backupConsultant.lastName || ""}`.trim() ||
                           "Unknown User"}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {payroll.assignedManager && (
                  <>
                    <Separator orientation="vertical" className="h-6" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Manager:</span>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage 
                            src={payroll.assignedManager.image || undefined} 
                            alt={payroll.assignedManager.computedName || "User"} 
                          />
                          <AvatarFallback className="text-xs">
                            {getUserInitials(payroll.assignedManager)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {payroll.assignedManager.computedName || 
                           `${payroll.assignedManager.firstName || ""} ${payroll.assignedManager.lastName || ""}`.trim() ||
                           "Unknown User"}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-3">
              <PermissionGuard resource="payrolls" action="update">
                <CanUpdate resource="payrolls">
                  <Button 
                    onClick={() => handleAction(onEdit, "Edit")}
                    disabled={loading}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </CanUpdate>
              </PermissionGuard>

              {/* More actions dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" disabled={loading}>
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleAction(onDuplicate, "Duplicate")}>
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate Payroll
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction(onExport, "Export")}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleAction(onArchive, "Archive")}>
                    <Archive className="w-4 h-4 mr-2" />
                    Archive Payroll
                  </DropdownMenuItem>
                  <CanDelete resource="payrolls">
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleAction(onDelete, "Delete")}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Payroll
                    </DropdownMenuItem>
                  </CanDelete>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Version warning if not latest */}
          {!data.isLatestVersion && data.latestVersion[0] && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-amber-800">
                    <strong>You're viewing an older version</strong> of this payroll. 
                    A newer version (v{data.latestVersion[0].versionNumber}) is available.
                  </p>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-amber-700 hover:text-amber-900"
                    onClick={() => router.push(`/payrolls/${data.latestVersion[0]?.id}`)}
                  >
                    View latest version →
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Loading skeleton component
function PayrollHeaderSkeleton() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
        </div>
        
        <div className="pb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-xl animate-pulse" />
                <div className="flex-1 min-w-0">
                  <div className="h-8 bg-gray-200 rounded w-64 mb-4 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-36 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="h-10 bg-gray-200 rounded w-20 animate-pulse" />
              <div className="h-10 bg-gray-200 rounded w-10 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const PayrollHeader = memo(PayrollHeaderComponent);
export default PayrollHeader;