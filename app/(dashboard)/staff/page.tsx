"use client";

import { useQuery } from "@apollo/client";
import { Users, Shield, UserCheck, Mail, Plus, RefreshCw, TrendingUp, Activity, AlertCircle, CheckCircle2, UserCog } from "lucide-react";
import React, { Suspense } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { PageHeader } from "@/components/patterns/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StaffLoading } from "@/components/ui/smart-loading";
import { cn } from "@/lib/utils";
import { ModernStaffManager } from "@/domains/users/components/ModernStaffManager";
import { GET_ALL_USERS } from "@/domains/users/graphql/queries";

// Staff member interface (matching ModernStaffManager)
interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  computedName?: string | null;
  email: string;
  role: string;
  position?: string;
  isActive: boolean;
  isStaff: boolean;
  managerId?: string;
  clerkUserId?: string;
  createdAt: string;
  updatedAt: string;
  managerUser?: {
    id: string;
    firstName: string;
    lastName: string;
    computedName?: string | null;
    email: string;
    role: string;
  } | null;
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

// Enhanced staff summary with actionable business insights
function StaffSummaryCards({ staff }: { staff: StaffMember[] }) {
  const metrics = React.useMemo(() => {
    if (!staff.length) {
      return {
        totalStaff: 0,
        activeRate: 0,
        consultants: 0,
        managementCoverage: 0,
        teamHealth: 'neutral' as const,
        securityHealth: 'neutral' as const,
        consultantAvailability: 'neutral' as const,
        leadershipHealth: 'neutral' as const,
      };
    }

    const totalStaff = staff.length;
    const activeStaff = staff.filter(s => s.isActive).length;
    const activeRate = Math.round((activeStaff / totalStaff) * 100);
    
    // Consultant availability - those who can be assigned to payrolls
    const consultants = staff.filter(s => 
      s.isActive && ['consultant', 'manager'].includes(s.role)
    ).length;
    
    // Management structure analysis
    const managers = staff.filter(s => s.role === 'manager' && s.isActive).length;
    const nonManagerStaff = staff.filter(s => 
      s.isActive && !['manager', 'org_admin', 'developer'].includes(s.role)
    ).length;
    const managementRatio = nonManagerStaff > 0 ? Math.round(nonManagerStaff / Math.max(1, managers)) : 0;

    // Health assessments based on business context
    const teamHealth: 'good' | 'warning' | 'critical' = 
      totalStaff >= 8 ? 'good' : totalStaff >= 5 ? 'warning' : 'critical';
    
    const securityHealth: 'good' | 'warning' | 'critical' = 
      activeRate >= 90 ? 'good' : activeRate >= 75 ? 'warning' : 'critical';
    
    const consultantAvailability: 'good' | 'warning' | 'critical' = 
      consultants >= 6 ? 'good' : consultants >= 3 ? 'warning' : 'critical';
    
    const leadershipHealth: 'good' | 'warning' | 'critical' = 
      managementRatio <= 6 && managementRatio >= 3 ? 'good' : 
      managementRatio <= 8 ? 'warning' : 'critical';

    return {
      totalStaff,
      activeRate,
      consultants,
      managementCoverage: managementRatio,
      teamHealth,
      securityHealth,
      consultantAvailability,
      leadershipHealth,
    };
  }, [staff]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Team Capacity */}
      <EnhancedMetricCard
        title="Team Capacity"
        value={metrics.totalStaff.toString()}
        subtitle="Total team members"
        icon={Users}
        status={metrics.teamHealth}
        trend={metrics.totalStaff >= 8 ? 'up' : 'stable'}
        trendValue={metrics.teamHealth === 'good' ? "Well staffed" : "Growing"}
        onClick={() => console.log('Navigate to team capacity planning')}
      >
        <div className="flex items-center gap-1 text-xs text-gray-600 mt-2">
          {metrics.teamHealth === 'good' ? (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="h-3 w-3" />
              <span>Optimal team size</span>
            </div>
          ) : metrics.teamHealth === 'warning' ? (
            <div className="flex items-center gap-1 text-amber-600">
              <AlertCircle className="h-3 w-3" />
              <span>Consider expanding</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-600">
              <AlertCircle className="h-3 w-3" />
              <span>Needs more staff</span>
            </div>
          )}
        </div>
      </EnhancedMetricCard>

      {/* Access Security */}
      <EnhancedMetricCard
        title="Access Security"
        value={`${metrics.activeRate}%`}
        subtitle="Active user accounts"
        icon={UserCheck}
        status={metrics.securityHealth}
        trend={metrics.activeRate >= 90 ? 'stable' : 'down'}
        trendValue={metrics.securityHealth === 'good' ? "Secure" : "Review needed"}
        onClick={() => console.log('Navigate to user access audit')}
      >
        <div className="flex items-center gap-1 text-xs mt-2">
          {metrics.securityHealth === 'good' ? (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="h-3 w-3" />
              <span>Good security hygiene</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-amber-600">
              <AlertCircle className="h-3 w-3" />
              <span>Inactive accounts need review</span>
            </div>
          )}
        </div>
      </EnhancedMetricCard>

      {/* Consultant Availability */}
      <EnhancedMetricCard
        title="Consultant Pool"
        value={metrics.consultants.toString()}
        subtitle="Available for payroll assignments"
        icon={UserCog}
        status={metrics.consultantAvailability}
        trend={metrics.consultants >= 6 ? 'up' : 'stable'}
        trendValue={metrics.consultantAvailability === 'good' ? "Strong capacity" : "Limited"}
        onClick={() => console.log('Navigate to consultant assignments')}
      >
        <div className="flex items-center gap-1 text-xs text-gray-600 mt-2">
          <Activity className="h-3 w-3" />
          <span>
            {metrics.consultantAvailability === 'good' ? 'Excellent coverage' :
             metrics.consultantAvailability === 'warning' ? 'Adequate coverage' : 'Capacity risk'}
          </span>
        </div>
      </EnhancedMetricCard>

      {/* Leadership Structure */}
      <EnhancedMetricCard
        title="Management Ratio"
        value={`1:${metrics.managementCoverage}`}
        subtitle="Manager to staff ratio"
        icon={Shield}
        status={metrics.leadershipHealth}
        trend={metrics.leadershipHealth === 'good' ? 'stable' : 'down'}
        trendValue={metrics.leadershipHealth === 'good' ? "Balanced" : "Needs attention"}
        onClick={() => console.log('Navigate to org structure')}
      >
        <div className="flex items-center gap-1 text-xs mt-2">
          {metrics.leadershipHealth === 'good' ? (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="h-3 w-3" />
              <span>Optimal structure</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-amber-600">
              <AlertCircle className="h-3 w-3" />
              <span>Restructure needed</span>
            </div>
          )}
        </div>
      </EnhancedMetricCard>
    </div>
  );
}

// Main staff content component
function StaffPageContent() {
  const { data, loading, error, refetch } = useQuery(GET_ALL_USERS, {
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
  });

  // Handle role update
  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      // TODO: Implement role update mutation
      console.log("Update role:", userId, newRole);
      await refetch();
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (
    userId: string,
    status: string,
    reason: string
  ) => {
    try {
      // TODO: Implement status update mutation
      console.log("Update status:", userId, status, reason);
      await refetch();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-destructive mb-2">
          Failed to load staff data
        </h3>
        <p className="text-muted-foreground mb-4">{error.message}</p>
      </div>
    );
  }

  const staff: StaffMember[] = data?.users || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Staff Management"
        description="Manage team members, roles, and access permissions"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Staff Management" },
        ]}
        actions={[
          { label: "Refresh", icon: RefreshCw, onClick: () => refetch() },
          { label: "New Staff", icon: Plus, primary: true, href: "/staff/new" },
        ]}
        overflowActions={[
          {
            label: "Export",
            onClick: () =>
              window.dispatchEvent(new CustomEvent("staff:export")),
          },
        ]}
      />

      {/* Summary Cards */}
      <StaffSummaryCards staff={staff} />

      {/* Modern Staff Manager */}
      <ModernStaffManager
        staff={staff}
        loading={loading}
        onRefetch={refetch}
        onRoleUpdate={handleRoleUpdate}
        onStatusUpdate={handleStatusUpdate}
        showHeader={false}
        showLocalActions={false}
      />
    </div>
  );
}

// Main page component with error boundary
export default function StaffPage() {
  return (
    <PermissionGuard action="read">
      <Suspense fallback={<StaffLoading />}>
        <StaffPageContent />
      </Suspense>
    </PermissionGuard>
  );
}
