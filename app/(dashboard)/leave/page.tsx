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

import { Plus, RefreshCw, AlertTriangle, X } from "lucide-react";
import { useState, useEffect } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { PageHeader } from "@/components/patterns/page-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
