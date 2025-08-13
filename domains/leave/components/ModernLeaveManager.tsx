"use client";

import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle, 
  Eye,
  Edit,
  Users,
  AlertTriangle,
  FileText
} from "lucide-react";
import { useState } from "react";
import {
  ModernDataTable,
  type ColumnDef,
  type RowAction,
} from "@/components/data/modern-data-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { cn } from "@/lib/utils";
import { getRoleDisplayName, getPositionDisplayName } from "@/lib/utils/role-utils";

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
  stats: LeaveStats | null;
  loading: boolean;
  currentUser: any;
  isManager: boolean;
  onApproveLeave: (leaveId: string) => void;
  onRejectLeave: (leaveId: string) => void;
  onViewDetails: (leave: LeaveRequest) => void;
  onEditLeave: (leave: LeaveRequest) => void;
}

// Status configurations for leave status
const statusConfigs = {
  approved: {
    component: ({ label }: { label: string }) => (
      <StatusIndicator variant="success">{label}</StatusIndicator>
    ),
  },
  pending: {
    component: ({ label }: { label: string }) => (
      <StatusIndicator variant="warning">{label}</StatusIndicator>
    ),
  },
  rejected: {
    component: ({ label }: { label: string }) => (
      <StatusIndicator variant="error">{label}</StatusIndicator>
    ),
  },
};

function getStatusConfig(status: string) {
  const normalizedStatus = status.toLowerCase();
  return statusConfigs[normalizedStatus as keyof typeof statusConfigs] || statusConfigs.pending;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-AU', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
}

function calculateDuration(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

function getLeaveTypeBadgeVariant(type: string): "default" | "secondary" | "destructive" | "outline" {
  switch (type) {
    case 'Annual':
      return 'default';
    case 'Sick':
      return 'destructive';
    case 'Unpaid':
      return 'secondary';
    default:
      return 'outline';
  }
}

export function ModernLeaveManager({
  leaveRequests,
  stats,
  loading,
  currentUser,
  isManager,
  onApproveLeave,
  onRejectLeave,
  onViewDetails,
  onEditLeave
}: ModernLeaveManagerProps) {
  // Filter requests based on user role
  const displayRequests = isManager 
    ? leaveRequests 
    : leaveRequests.filter(req => req.userId === currentUser?.id);

  // Define essential columns for progressive disclosure
  const columns: ColumnDef<LeaveRequest>[] = [
    {
      id: "employee",
      key: "employee",
      label: "Employee",
      essential: true,
      render: (_, leave) => (
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {leave.employee.firstName?.[0]}
              {leave.employee.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="font-medium truncate">
              {leave.employee.computedName || 
               `${leave.employee.firstName} ${leave.employee.lastName}` ||
               leave.employee.email}
            </div>
            <div className="text-sm text-foreground opacity-75 truncate">
              {getPositionDisplayName(leave.employee.position || '') !== 'Not specified' 
                ? getPositionDisplayName(leave.employee.position || '')
                : getRoleDisplayName(leave.employee.role || '')}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "leaveType",
      key: "leaveType",
      label: "Leave Type",
      essential: true,
      render: (_, leave) => (
        <Badge variant={getLeaveTypeBadgeVariant(leave.leaveType)}>
          {leave.leaveType}
        </Badge>
      ),
    },
    {
      id: "status",
      key: "status", 
      label: "Status",
      essential: true,
      sortable: true,
      render: (_, leave) => {
        const config = getStatusConfig(leave.status);
        return <config.component label={leave.status} />;
      },
    },
    {
      id: "duration",
      key: "startDate",
      label: "Duration",
      essential: true,
      render: (_, leave) => (
        <div className="text-right tabular-nums">
          <div className="font-medium">
            {calculateDuration(leave.startDate, leave.endDate)} days
          </div>
          <div className="text-sm text-foreground opacity-75">
            {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
          </div>
        </div>
      ),
    },
  ];

  // Row actions for contextual operations
  const rowActions: RowAction<LeaveRequest>[] = [
    {
      id: "view",
      label: "View Details",
      icon: Eye,
      onClick: (leave: LeaveRequest) => onViewDetails(leave),
    },
    ...(isManager ? [
      {
        id: "approve",
        label: "Approve",
        icon: CheckCircle,
        onClick: (leave: LeaveRequest) => onApproveLeave(leave.id),
        disabled: (leave: LeaveRequest) => leave.status !== 'Pending',
        variant: "default" as const,
      },
      {
        id: "reject", 
        label: "Reject",
        icon: XCircle,
        onClick: (leave: LeaveRequest) => onRejectLeave(leave.id),
        disabled: (leave: LeaveRequest) => leave.status !== 'Pending',
        variant: "destructive" as const,
      }
    ] : []),
    {
      id: "edit",
      label: "Edit Request",
      icon: Edit,
      onClick: (leave: LeaveRequest) => onEditLeave(leave),
      disabled: (leave: LeaveRequest) => leave.status !== 'Pending' || (currentUser?.id !== leave.userId && !isManager),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Modern Data Table */}
      <ModernDataTable
        data={displayRequests}
        columns={columns}
        rowActions={rowActions}
        loading={loading}
        searchable={true}
        searchPlaceholder="Search leave requests..."
        expandableRows={true}
        renderExpandedRow={leave => (
          <div className="p-4 space-y-4 bg-muted/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Leave Details */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Leave Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Type:</span> {leave.leaveType}
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span> {calculateDuration(leave.startDate, leave.endDate)} days
                  </div>
                  <div>
                    <span className="font-medium">Start:</span> {formatDate(leave.startDate)}
                  </div>
                  <div>
                    <span className="font-medium">End:</span> {formatDate(leave.endDate)}
                  </div>
                </div>
              </div>

              {/* Reason & Notes */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Reason & Notes
                </h4>
                <div className="text-sm">
                  {leave.reason ? (
                    <p className="text-foreground">{leave.reason}</p>
                  ) : (
                    <p className="text-foreground opacity-60 italic">No reason provided</p>
                  )}
                </div>
              </div>

              {/* Manager Info */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Management
                </h4>
                <div className="text-sm space-y-2">
                  {leave.employee.manager ? (
                    <div>
                      <span className="font-medium">Manager:</span>{" "}
                      {leave.employee.manager.computedName || 
                       `${leave.employee.manager.firstName} ${leave.employee.manager.lastName}` ||
                       leave.employee.manager.email}
                    </div>
                  ) : (
                    <div className="text-foreground opacity-60">No manager assigned</div>
                  )}
                  <div>
                    <span className="font-medium">Status:</span>{" "}
                    <span className={cn(
                      leave.status === 'Approved' ? 'text-green-600' :
                      leave.status === 'Rejected' ? 'text-red-600' :
                      'text-amber-600'
                    )}>
                      {leave.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            {isManager && leave.status === 'Pending' && (
              <div className="flex gap-2 pt-2 border-t border-border">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onApproveLeave(leave.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Leave
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRejectLeave(leave.id)}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Leave
                </Button>
              </div>
            )}
          </div>
        )}
        emptyState={
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-foreground opacity-40 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No Leave Requests
            </h3>
            <p className="text-foreground opacity-75 mb-4">
              {isManager ? 'No team leave requests to review' : 'You haven\'t submitted any leave requests yet'}
            </p>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              {isManager ? 'View Calendar' : 'Request Leave'}
            </Button>
          </div>
        }
      />
    </div>
  );
}

export default ModernLeaveManager;