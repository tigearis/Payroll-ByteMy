"use client";

import { format, differenceInDays } from "date-fns";
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  User,
  CalendarDays,
  FileText,
  Eye,
  Edit,
  Check,
  X
} from "lucide-react";
import { useState, useMemo } from "react";
import { ModernDataTable, type ColumnDef, type RowAction } from "@/components/data/modern-data-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { StatusIndicator } from "@/components/ui/status-indicator";

// Leave request interface
interface LeaveRequest {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  leaveType: "Annual" | "Sick" | "Unpaid" | "Other";
  reason?: string;
  status: "Pending" | "Approved" | "Rejected";
  employee: {
    id: string;
    firstName?: string;
    lastName?: string;
    computedName?: string;
    email?: string;
    role?: string;
    position?: string;
    manager?: {
      id: string;
      firstName?: string;
      lastName?: string;
      computedName?: string;
      email: string;
    } | null;
  };
}

interface LeaveStats {
  overview: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    currentLeave: number;
    upcomingLeave: number;
  };
  byType: {
    annual: number;
    sick: number;
    unpaid: number;
    other: number;
  };
}

interface ModernLeaveManagerProps {
  leaveRequests: LeaveRequest[];
  stats?: LeaveStats | null;
  loading?: boolean;
  currentUser?: any;
  isManager?: boolean;
  onApproveLeave?: (leaveId: string) => void;
  onRejectLeave?: (leaveId: string) => void;
  onViewDetails?: (leave: LeaveRequest) => void;
  onEditLeave?: (leave: LeaveRequest) => void;
}

// Status configurations
const statusConfigs = {
  Pending: { 
    component: ({ label }: { label: string }) => (
      <StatusIndicator variant="warning">{label}</StatusIndicator>
    ),
    color: "bg-yellow-100 text-yellow-800"
  },
  Approved: { 
    component: ({ label }: { label: string }) => (
      <StatusIndicator variant="success">{label}</StatusIndicator>
    ),
    color: "bg-green-100 text-green-800"
  },
  Rejected: { 
    component: ({ label }: { label: string }) => (
      <StatusIndicator variant="error">{label}</StatusIndicator>
    ),
    color: "bg-red-100 text-red-800"
  }
};

// Leave type configurations
const leaveTypeConfigs = {
  Annual: { 
    color: "bg-blue-100 text-blue-800", 
    icon: Calendar,
    label: "Annual Leave"
  },
  Sick: { 
    color: "bg-orange-100 text-orange-800", 
    icon: AlertTriangle,
    label: "Sick Leave"
  },
  Unpaid: { 
    color: "bg-gray-100 text-gray-800", 
    icon: Clock,
    label: "Unpaid Leave"
  },
  Other: { 
    color: "bg-purple-100 text-purple-800", 
    icon: FileText,
    label: "Other Leave"
  }
};

// Leave Details component for sheet view
const LeaveDetails = ({ 
  leave, 
  currentUser, 
  isManager, 
  onApprove, 
  onReject, 
  onEdit 
}: { 
  leave: LeaveRequest;
  currentUser: any;
  isManager: boolean;
  onApprove?: (leaveId: string) => void;
  onReject?: (leaveId: string) => void;
  onEdit?: (leave: LeaveRequest) => void;
}) => {
  const canManageLeave = isManager && 
    leave.status === "Pending" && 
    (currentUser?.id === leave.employee?.manager?.id ||
     currentUser?.role === "org_admin" ||
     currentUser?.role === "developer");

  const canEditLeave = leave.userId === currentUser?.id && leave.status === "Pending";

  const getDaysCount = () => {
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);
    return differenceInDays(end, start) + 1;
  };

  const typeConfig = leaveTypeConfigs[leave.leaveType];
  const statusConfig = statusConfigs[leave.status];

  return (
    <div className="space-y-6">
      {/* Employee Header */}
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-lg font-medium bg-primary/10 text-primary">
            {leave.employee.firstName?.[0]}{leave.employee.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <h3 className="text-xl font-semibold">
            {leave.employee.computedName || 
             `${leave.employee.firstName || ""} ${leave.employee.lastName || ""}`.trim() ||
             "Unknown User"}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">{leave.employee.position}</p>
          <p className="text-sm text-neutral-500">{leave.employee.email}</p>
        </div>
      </div>

      {/* Leave Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center">
                <Badge className={statusConfig.color}>
                  {leave.status}
                </Badge>
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Request Status
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">
                {getDaysCount()}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Days Requested
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave Details */}
      <div className="space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          Leave Information
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-neutral-500">Leave Type</label>
              <div className="mt-1 flex items-center gap-2">
                <typeConfig.icon className="h-4 w-4" />
                <Badge className={typeConfig.color}>
                  {typeConfig.label}
                </Badge>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-neutral-500">Start Date</label>
              <p className="text-base font-medium">
                {format(new Date(leave.startDate), "EEEE, dd MMMM yyyy")}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-neutral-500">End Date</label>
              <p className="text-base font-medium">
                {format(new Date(leave.endDate), "EEEE, dd MMMM yyyy")}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-neutral-500">Duration</label>
              <p className="text-base font-medium">{getDaysCount()} working days</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-neutral-500">Leave ID</label>
              <p className="text-sm font-mono bg-neutral-100 dark:bg-neutral-800 p-2 rounded">
                {leave.id}
              </p>
            </div>
          </div>
        </div>

        {/* Reason */}
        {leave.reason && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-500">Reason for Leave</label>
            <p className="text-sm bg-neutral-50 dark:bg-neutral-900 p-3 rounded-lg">
              {leave.reason}
            </p>
          </div>
        )}
      </div>

      {/* Management Information */}
      {isManager && (
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Management Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-neutral-500">Direct Manager</label>
              <p className="text-base">
                {leave.employee?.manager?.computedName ||
                 `${leave.employee?.manager?.firstName || ""} ${leave.employee?.manager?.lastName || ""}`.trim() ||
                 "Not assigned"}
              </p>
              {leave.employee?.manager?.email && (
                <p className="text-sm text-neutral-500">{leave.employee.manager.email}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-neutral-500">Employee Role</label>
              <p className="text-base">{leave.employee?.role || "Not specified"}</p>
              {leave.employee?.position && (
                <p className="text-sm text-neutral-500">{leave.employee.position}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {(canManageLeave || canEditLeave) && (
        <div className="space-y-3">
          <h4 className="font-medium">Available Actions</h4>
          <div className="flex flex-wrap gap-2">
            {canEditLeave && (
              <Button variant="outline" onClick={() => onEdit?.(leave)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Request
              </Button>
            )}
            
            {canManageLeave && (
              <>
                <Button 
                  onClick={() => onApprove?.(leave.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve Request
                </Button>
                
                <Button 
                  variant="destructive"
                  onClick={() => onReject?.(leave.id)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject Request
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export function ModernLeaveManager({ 
  leaveRequests, 
  stats,
  loading = false, 
  currentUser,
  isManager = false,
  onApproveLeave,
  onRejectLeave,
  onViewDetails,
  onEditLeave
}: ModernLeaveManagerProps) {
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);

  // Calculate summary metrics
  const metrics = useMemo(() => {
    if (stats) {
      return {
        totalRequests: stats.overview.total,
        pendingRequests: stats.overview.pending,
        approvedRequests: stats.overview.approved,
        currentLeave: stats.overview.currentLeave
      };
    }

    // Fallback calculation from requests
    return {
      totalRequests: leaveRequests.length,
      pendingRequests: leaveRequests.filter(req => req.status === "Pending").length,
      approvedRequests: leaveRequests.filter(req => req.status === "Approved").length,
      currentLeave: leaveRequests.filter(req => {
        const now = new Date();
        const start = new Date(req.startDate);
        const end = new Date(req.endDate);
        return req.status === "Approved" && start <= now && end >= now;
      }).length
    };
  }, [leaveRequests, stats]);

  // Define essential columns for progressive disclosure
  const columns: ColumnDef<LeaveRequest>[] = [
    {
      id: 'employee',
      key: 'employee',
      label: 'Employee',
      essential: true,
      render: (_, leave) => (
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {leave.employee.firstName?.[0]}{leave.employee.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="font-medium truncate">
              {leave.employee.computedName || 
               `${leave.employee.firstName || ""} ${leave.employee.lastName || ""}`.trim() ||
               "Unknown User"}
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
              {leave.employee.email}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'leaveType',
      key: 'leaveType',
      label: 'Leave Type',
      essential: true,
      render: (_, leave) => {
        const config = leaveTypeConfigs[leave.leaveType];
        return (
          <div className="flex items-center gap-2">
            <config.icon className="h-4 w-4 text-neutral-500" />
            <Badge className={config.color}>
              {config.label}
            </Badge>
          </div>
        );
      }
    },
    {
      id: 'status',
      key: 'status',
      label: 'Status',
      essential: true,
      sortable: true,
      render: (_, leave) => {
        const config = statusConfigs[leave.status];
        return <config.component label={leave.status} />;
      }
    },
    {
      id: 'duration',
      key: 'startDate',
      label: 'Duration',
      essential: true,
      render: (_, leave) => {
        const start = new Date(leave.startDate);
        const end = new Date(leave.endDate);
        const days = differenceInDays(end, start) + 1;
        
        return (
          <div className="text-right">
            <div className="font-medium">{days} days</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              {format(start, "dd MMM")} - {format(end, "dd MMM")}
            </div>
          </div>
        );
      }
    }
  ];

  // Row actions for contextual operations
  const rowActions: RowAction<LeaveRequest>[] = [
    {
      id: 'view',
      label: 'View Details',
      icon: Eye,
      onClick: (leave) => {
        setSelectedLeave(leave);
        onViewDetails?.(leave);
      }
    },
    ...(isManager ? [
      {
        id: 'approve',
        label: 'Approve',
        icon: CheckCircle,
        onClick: (leave: LeaveRequest) => onApproveLeave?.(leave.id),
        disabled: (leave: LeaveRequest) => leave.status !== "Pending" ||
          !(currentUser?.id === leave.employee?.manager?.id ||
            currentUser?.role === "org_admin" ||
            currentUser?.role === "developer")
      },
      {
        id: 'reject',
        label: 'Reject',
        icon: XCircle,
        onClick: (leave: LeaveRequest) => onRejectLeave?.(leave.id),
        disabled: (leave: LeaveRequest) => leave.status !== "Pending" ||
          !(currentUser?.id === leave.employee?.manager?.id ||
            currentUser?.role === "org_admin" ||
            currentUser?.role === "developer"),
        variant: 'destructive' as const
      }
    ] : []),
    {
      id: 'edit',
      label: 'Edit Request',
      icon: Edit,
      onClick: (leave) => onEditLeave?.(leave),
      disabled: (leave) => leave.userId !== currentUser?.id || leave.status !== "Pending"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Total Requests
                </p>
                <p className="text-2xl font-bold">{metrics.totalRequests}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Pending
                </p>
                <p className="text-2xl font-bold text-yellow-600">{metrics.pendingRequests}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Approved
                </p>
                <p className="text-2xl font-bold text-green-600">{metrics.approvedRequests}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Currently on Leave
                </p>
                <p className="text-2xl font-bold text-purple-600">{metrics.currentLeave}</p>
              </div>
              <CalendarDays className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modern Data Table */}
      <ModernDataTable
        data={leaveRequests}
        columns={columns}
        rowActions={rowActions}
        loading={loading}
        searchable={true}
        searchPlaceholder="Search leave requests..."
        expandableRows={true}
        renderExpandedRow={(leave) => (
          <div className="p-4 space-y-4 bg-neutral-50 dark:bg-neutral-900">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Leave Details */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Leave Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">
                      {differenceInDays(new Date(leave.endDate), new Date(leave.startDate)) + 1} days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Start:</span>
                    <span className="font-medium">{format(new Date(leave.startDate), "dd MMM yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>End:</span>
                    <span className="font-medium">{format(new Date(leave.endDate), "dd MMM yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge className={statusConfigs[leave.status].color}>
                      {leave.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Management Info */}
              {isManager && (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Management
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-neutral-500">Manager:</span>
                      <div className="font-medium">
                        {leave.employee?.manager?.computedName || "Not assigned"}
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-500">Role:</span>
                      <div className="font-medium">{leave.employee?.role || "Not specified"}</div>
                    </div>
                    {leave.employee?.position && (
                      <div>
                        <span className="text-neutral-500">Position:</span>
                        <div className="font-medium">{leave.employee.position}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Reason & Actions */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Additional Information
                </h4>
                {leave.reason && (
                  <div className="text-sm">
                    <span className="text-neutral-500">Reason:</span>
                    <p className="mt-1 text-neutral-700 dark:text-neutral-300 line-clamp-3">
                      {leave.reason}
                    </p>
                  </div>
                )}
                <div className="text-sm">
                  <span className="text-neutral-500">Request ID:</span>
                  <code className="ml-2 font-mono text-xs bg-neutral-200 dark:bg-neutral-700 px-1 rounded">
                    {leave.id.slice(-8)}
                  </code>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
              <Button variant="outline" size="sm" onClick={() => setSelectedLeave(leave)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
              
              {leave.userId === currentUser?.id && leave.status === "Pending" && (
                <Button variant="outline" size="sm" onClick={() => onEditLeave?.(leave)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Request
                </Button>
              )}
              
              {isManager && leave.status === "Pending" && (
                currentUser?.id === leave.employee?.manager?.id ||
                currentUser?.role === "org_admin" ||
                currentUser?.role === "developer"
              ) && (
                <>
                  <Button size="sm" onClick={() => onApproveLeave?.(leave.id)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onRejectLeave?.(leave.id)}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
        emptyState={
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              No Leave Requests
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              {isManager 
                ? "No team leave requests to review at this time"
                : "Get started by creating your first leave request"
              }
            </p>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              {isManager ? "View Team Calendar" : "Request Leave"}
            </Button>
          </div>
        }
      />

      {/* Leave Details Sheet */}
      <Sheet open={!!selectedLeave} onOpenChange={() => setSelectedLeave(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Leave Request Details
            </SheetTitle>
            <SheetDescription>
              Comprehensive leave request information and actions
            </SheetDescription>
          </SheetHeader>
          {selectedLeave && (
            <LeaveDetails 
              leave={selectedLeave} 
              currentUser={currentUser}
              isManager={isManager}
              {...(onApproveLeave ? { onApprove: onApproveLeave } : {})}
              {...(onRejectLeave ? { onReject: onRejectLeave } : {})}
              {...(onEditLeave ? { onEdit: onEditLeave } : {})}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}