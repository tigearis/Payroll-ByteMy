"use client";

/*
 * Modern Leave Management Page
 *
 * Features progressive disclosure pattern with:
 * - 4 essential columns: Employee, Leave Type, Status, Duration
 * - Expandable rows for detailed leave information and approval workflows
 * - Smart search and contextual actions
 * - Mobile-first responsive design
 */

import { Plus, RefreshCw, AlertTriangle, X, Calendar, Clock, CheckCircle2, Activity, TrendingUp, Users } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { PageHeader } from "@/components/patterns/page-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ModernLeaveManager } from "@/domains/leave/components/ModernLeaveManager";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useDynamicLoading } from "@/lib/hooks/use-dynamic-loading";

// Create loading component for leave
function LeaveLoading() {
  const { Loading } = useDynamicLoading({
    title: "Loading Leave Requests...",
    description: "Fetching leave data and status information",
  });
  return <Loading variant="minimal" />;
}

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

// Enhanced metric card component with hover effects and animations
function EnhancedMetricCard({
  title,
  value,
  subtitle,
  icon: IconComponent,
  trend,
  trendValue,
  status = 'neutral',
  onClick,
  children,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  status?: 'good' | 'warning' | 'critical' | 'neutral';
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  const statusStyles = {
    good: 'bg-green-50 border-green-200 hover:bg-green-100',
    warning: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
    critical: 'bg-red-50 border-red-200 hover:bg-red-100',
    neutral: 'bg-white border-gray-200 hover:bg-gray-50',
  };

  const trendStyles = {
    up: 'text-green-600 bg-green-100',
    down: 'text-red-600 bg-red-100',
    stable: 'text-gray-600 bg-gray-100',
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
            {status === 'critical' && (
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
                    'px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1',
                    trendStyles[trend]
                  )}
                  title="Trend from previous period"
                >
                  {trend === 'up' && <TrendingUp className="w-3 h-3" />}
                  {trend === 'down' && <Activity className="w-3 h-3 rotate-180" />}
                  {trend === 'stable' && <Activity className="w-3 h-3" />}
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

// Leave summary cards with actionable business insights
function LeaveSummaryCards({ 
  leaveRequests, 
  stats, 
  isManager 
}: { 
  leaveRequests: LeaveRequest[]; 
  stats: LeaveStats | null; 
  isManager: boolean;
}) {
  const metrics = useMemo(() => {
    if (!leaveRequests.length || !stats) {
      return {
        pendingRequests: 0,
        activeLeave: 0,
        approvalBacklog: 0,
        teamImpact: 0,
        workflowHealth: 'neutral' as const,
        coverageHealth: 'neutral' as const,
        approvalHealth: 'neutral' as const,
        capacityHealth: 'neutral' as const,
      };
    }

    const today = new Date();
    const pendingRequests = stats.overview.pending;
    const activeLeave = stats.overview.currentLeave;
    
    // Calculate approval backlog (pending requests older than 3 days)
    const approvalBacklog = leaveRequests.filter(request => {
      if (request.status !== 'Pending') return false;
      const requestDate = new Date(request.startDate);
      const daysDiff = Math.floor((today.getTime() - requestDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff > 3;
    }).length;

    // Calculate team impact (percentage of team on leave)
    const totalActiveRequests = leaveRequests.filter(request => {
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);
      return today >= start && today <= end && request.status === 'Approved';
    }).length;

    // Estimate total team size (rough calculation)
    const uniqueEmployees = new Set(leaveRequests.map(r => r.userId)).size;
    const teamImpact = uniqueEmployees > 0 ? Math.round((totalActiveRequests / uniqueEmployees) * 100) : 0;

    // Health assessments based on business impact
    const workflowHealth: 'good' | 'warning' | 'critical' = 
      pendingRequests === 0 ? 'good' : 
      pendingRequests <= 3 ? 'warning' : 'critical';

    const approvalHealth: 'good' | 'warning' | 'critical' = 
      approvalBacklog === 0 ? 'good' : 
      approvalBacklog <= 2 ? 'warning' : 'critical';

    const capacityHealth: 'good' | 'warning' | 'critical' = 
      teamImpact <= 15 ? 'good' : 
      teamImpact <= 25 ? 'warning' : 'critical';

    const coverageHealth: 'good' | 'warning' | 'critical' = 
      activeLeave <= 2 ? 'good' : 
      activeLeave <= 5 ? 'warning' : 'critical';

    return {
      pendingRequests,
      activeLeave,
      approvalBacklog,
      teamImpact,
      workflowHealth,
      coverageHealth,
      approvalHealth,
      capacityHealth,
    };
  }, [leaveRequests, stats]);

  if (!isManager) {
    // Simplified view for non-managers
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <EnhancedMetricCard
          title="My Requests"
          value={leaveRequests.length.toString()}
          subtitle="Total leave requests"
          icon={Calendar}
          status="neutral"
          onClick={() => console.log('View my requests')}
        >
          <div className="flex items-center gap-1 text-xs text-gray-600 mt-2">
            <CheckCircle2 className="h-3 w-3" />
            <span>Personal leave history</span>
          </div>
        </EnhancedMetricCard>

        <EnhancedMetricCard
          title="Pending Approval"
          value={stats?.overview.pending.toString() || '0'}
          subtitle="Awaiting manager approval"
          icon={Clock}
          status={stats?.overview.pending ? 'warning' : 'good'}
          onClick={() => console.log('View pending requests')}
        />

        <EnhancedMetricCard
          title="Current Leave"
          value={stats?.overview.currentLeave.toString() || '0'}
          subtitle="Active leave periods"
          icon={Users}
          status="neutral"
        />

        <EnhancedMetricCard
          title="This Year"
          value={stats?.overview.approved.toString() || '0'}
          subtitle="Approved leave days"
          icon={CheckCircle2}
          status="good"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Workflow Efficiency */}
      <EnhancedMetricCard
        title="Approval Queue"
        value={metrics.pendingRequests.toString()}
        subtitle="Requests awaiting approval"
        icon={Clock}
        status={metrics.workflowHealth}
        trend={metrics.pendingRequests === 0 ? 'stable' : 'up'}
        trendValue={metrics.workflowHealth === 'good' ? "All clear" : "Needs attention"}
        onClick={() => console.log('Navigate to approval workflow')}
      >
        <div className="flex items-center gap-1 text-xs mt-2">
          {metrics.workflowHealth === 'good' ? (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="h-3 w-3" />
              <span>Workflow efficient</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-amber-600">
              <AlertTriangle className="h-3 w-3" />
              <span>Approval bottleneck</span>
            </div>
          )}
        </div>
      </EnhancedMetricCard>

      {/* Service Coverage */}
      <EnhancedMetricCard
        title="Team Coverage"
        value={`${100 - metrics.teamImpact}%`}
        subtitle="Available team capacity"
        icon={Users}
        status={metrics.capacityHealth}
        trend={metrics.teamImpact <= 15 ? 'stable' : 'down'}
        trendValue={metrics.capacityHealth === 'good' ? "Good coverage" : "Limited capacity"}
        onClick={() => console.log('Navigate to coverage planning')}
      >
        <div className="flex items-center gap-1 text-xs text-gray-600 mt-2">
          <Activity className="h-3 w-3" />
          <span>
            {metrics.capacityHealth === 'good' ? 'Full service capacity' :
             metrics.capacityHealth === 'warning' ? 'Reduced capacity' : 'Service at risk'}
          </span>
        </div>
      </EnhancedMetricCard>

      {/* Approval Backlog */}
      <EnhancedMetricCard
        title="Overdue Approvals"
        value={metrics.approvalBacklog.toString()}
        subtitle="Requests pending >3 days"
        icon={AlertTriangle}
        status={metrics.approvalHealth}
        trend={metrics.approvalBacklog === 0 ? 'stable' : 'up'}
        trendValue={metrics.approvalHealth === 'good' ? "On time" : "Delayed"}
        onClick={() => console.log('Navigate to overdue approvals')}
      >
        <div className="flex items-center gap-1 text-xs mt-2">
          {metrics.approvalBacklog === 0 ? (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="h-3 w-3" />
              <span>Timely approvals</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-600">
              <AlertTriangle className="h-3 w-3" />
              <span>SLA breach risk</span>
            </div>
          )}
        </div>
      </EnhancedMetricCard>

      {/* Active Leave Impact */}
      <EnhancedMetricCard
        title="Active Leave"
        value={metrics.activeLeave.toString()}
        subtitle="Staff currently on leave"
        icon={Calendar}
        status={metrics.coverageHealth}
        trend={metrics.activeLeave <= 2 ? 'stable' : 'up'}
        trendValue={metrics.coverageHealth === 'good' ? "Normal levels" : "High volume"}
        onClick={() => console.log('Navigate to active leave calendar')}
      >
        <div className="flex items-center gap-1 text-xs text-gray-600 mt-2">
          <TrendingUp className="h-3 w-3" />
          <span>
            {metrics.coverageHealth === 'good' ? 'Minimal disruption' :
             metrics.coverageHealth === 'warning' ? 'Some impact' : 'Major impact'}
          </span>
        </div>
      </EnhancedMetricCard>
    </div>
  );
}

function LeavePage() {
  const { currentUser, loading: userLoading } = useCurrentUser();

  // Data state
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [stats, setStats] = useState<LeaveStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is manager - can view team leave
  const isManager =
    currentUser?.role &&
    ["manager", "org_admin", "developer"].includes(currentUser.role);

  // Fetch leave requests data
  const fetchLeaveRequests = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/leave?includeStats=true");
      const data = await response.json();

      if (data.success) {
        setLeaveRequests(data.data.leave || []);
        if (data.data.stats) {
          setStats(data.data.stats);
        }
      } else {
        setError(data.error || "Failed to fetch leave requests");
      }
    } catch (err) {
      setError("Failed to fetch leave requests");
      console.error("Error fetching leave requests:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  // Handler functions for leave management
  const handleApproveLeave = async (leaveId: string) => {
    try {
      const response = await fetch(`/api/leave/${leaveId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "approve" }),
      });

      if (response.ok) {
        fetchLeaveRequests();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to approve leave request");
      }
    } catch (err) {
      setError("Failed to approve leave request");
      console.error("Error approving leave:", err);
    }
  };

  const handleRejectLeave = async (leaveId: string) => {
    try {
      const response = await fetch(`/api/leave/${leaveId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "reject" }),
      });

      if (response.ok) {
        fetchLeaveRequests();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to reject leave request");
      }
    } catch (err) {
      setError("Failed to reject leave request");
      console.error("Error rejecting leave:", err);
    }
  };

  const handleViewDetails = (leave: LeaveRequest) => {
    console.log("Viewing leave details:", leave.id);
  };

  const handleEditLeave = (leave: LeaveRequest) => {
    window.location.href = `/leave/${leave.id}/edit`;
  };

  if (userLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
                className="text-red-700 hover:bg-red-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Page Header */}
      <PageHeader
        title="Leave Management"
        description={
          isManager
            ? "Modern leave management with progressive disclosure"
            : "View and manage your leave requests"
        }
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Leave" },
        ]}
        actions={[
          { label: "Refresh", icon: RefreshCw, onClick: fetchLeaveRequests },
          { label: "Request Leave", icon: Plus, href: "/leave/new" },
        ]}
      />

      {/* Leave Summary Cards */}
      <LeaveSummaryCards 
        leaveRequests={leaveRequests}
        stats={stats}
        isManager={isManager}
      />

      {/* Modern Leave Manager */}
      <PermissionGuard action="read">
        <ModernLeaveManager
          leaveRequests={leaveRequests}
          stats={stats}
          loading={loading}
          currentUser={currentUser}
          isManager={isManager}
          onApproveLeave={handleApproveLeave}
          onRejectLeave={handleRejectLeave}
          onViewDetails={handleViewDetails}
          onEditLeave={handleEditLeave}
        />
      </PermissionGuard>
    </div>
  );
}

export default LeavePage;
