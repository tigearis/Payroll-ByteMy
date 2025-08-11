"use client";

import { useQuery } from "@apollo/client";
import { Users, Shield, UserCheck, Mail, Plus, RefreshCw } from "lucide-react";
import { Suspense } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { PageHeader } from "@/components/patterns/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StaffLoading } from "@/components/ui/smart-loading";
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

// Summary metrics component
function StaffSummaryCards({ staff }: { staff: StaffMember[] }) {
  const metrics = {
    total: staff.length,
    active: staff.filter(s => s.isActive).length,
    staff: staff.filter(s => s.isStaff).length,
    admins: staff.filter(s => ["developer", "org_admin"].includes(s.role))
      .length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.total}</div>
          <p className="text-xs text-muted-foreground">All team members</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.active}</div>
          <p className="text-xs text-muted-foreground">
            Currently active accounts
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
          <Mail className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.staff}</div>
          <p className="text-xs text-muted-foreground">Internal team members</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Administrators</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.admins}</div>
          <p className="text-xs text-muted-foreground">Admin-level access</p>
        </CardContent>
      </Card>
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
