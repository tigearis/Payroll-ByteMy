"use client";

import {
  Users,
  User,
  Shield,
  Eye,
  Edit,
  UserPlus,
  UserX,
  Mail,
  Calendar,
  Plus,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import {
  ModernDataTable,
  type ColumnDef,
  type RowAction,
} from "@/components/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  SuccessStatus,
  WarningStatus,
  ErrorStatus,
  InfoStatus,
} from "@/components/ui/status-indicator";
import { safeFormatDate } from "@/lib/utils/date-utils";

// Staff member interface (compatible with existing data structure)
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

interface StaffManagerProps {
  staff: StaffMember[];
  loading?: boolean;
  onRefetch?: () => void;
  onRoleUpdate?: (userId: string, role: string) => void;
  onStatusUpdate?: (userId: string, status: string, reason: string) => void;
  showHeader?: boolean;
  showLocalActions?: boolean;
}

// Role configuration for consistent visual language
const getRoleConfig = (role: string) => {
  const configs = {
    developer: {
      component: ErrorStatus, // High security level
      label: "Developer",
      color: "bg-purple-100 text-purple-800",
      description: "Full system access",
    },
    org_admin: {
      component: ErrorStatus,
      label: "Admin",
      color: "bg-red-100 text-red-800",
      description: "Organization administrator",
    },
    manager: {
      component: WarningStatus,
      label: "Manager",
      color: "bg-blue-100 text-blue-800",
      description: "Team management",
    },
    consultant: {
      component: SuccessStatus,
      label: "Consultant",
      color: "bg-green-100 text-green-800",
      description: "Payroll consultant",
    },
    viewer: {
      component: InfoStatus,
      label: "Viewer",
      color: "bg-gray-100 text-gray-800",
      description: "Read-only access",
    },
  };

  return configs[role as keyof typeof configs] || configs.viewer;
};

// Get staff status component
const getStatusComponent = (isActive: boolean) => {
  return isActive ? (
    <SuccessStatus size="sm">Active</SuccessStatus>
  ) : (
    <ErrorStatus size="sm">Inactive</ErrorStatus>
  );
};

// Role indicator renderer (module-level so it can be reused)
function renderRoleIndicator(role: string) {
  const normalized = role?.toLowerCase();
  switch (normalized) {
    case "developer":
      return <ErrorStatus size="sm">Developer</ErrorStatus>;
    case "org_admin":
      return <ErrorStatus size="sm">Admin</ErrorStatus>;
    case "manager":
      return <WarningStatus size="sm">Manager</WarningStatus>;
    case "consultant":
      return <SuccessStatus size="sm">Consultant</SuccessStatus>;
    case "viewer":
    default:
      return <InfoStatus size="sm">Viewer</InfoStatus>;
  }
}

// Get display name
const getDisplayName = (member: StaffMember): string => {
  return member.computedName || `${member.firstName} ${member.lastName}`;
};

// Get user initials for avatar
const getUserInitials = (member: StaffMember): string => {
  const displayName = getDisplayName(member);
  const nameParts = displayName.split(" ");
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }
  return (
    nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
  ).toUpperCase();
};

// Progressive disclosure details component
function StaffMemberDetails({ member }: { member: StaffMember }) {
  const roleConfig = getRoleConfig(member.role);

  const renderRoleIndicator = (role: string) => {
    const normalized = role?.toLowerCase();
    switch (normalized) {
      case "developer":
        return <ErrorStatus size="sm">Developer</ErrorStatus>;
      case "org_admin":
        return <ErrorStatus size="sm">Admin</ErrorStatus>;
      case "manager":
        return <WarningStatus size="sm">Manager</WarningStatus>;
      case "consultant":
        return <SuccessStatus size="sm">Consultant</SuccessStatus>;
      case "viewer":
      default:
        return <InfoStatus size="sm">Viewer</InfoStatus>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {/* Contact & Identity */}
      <div>
        <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
          <User className="h-4 w-4" />
          Contact & Identity
        </h4>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Full Name:</span>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              {getDisplayName(member)}
            </p>
          </div>
          <div>
            <span className="font-medium">Email:</span>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              {member.email}
            </p>
          </div>
          <div>
            <span className="font-medium">User ID:</span>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1 font-mono text-xs">
              {member.id}
            </p>
          </div>
          {member.clerkUserId && (
            <div>
              <span className="font-medium">Clerk ID:</span>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1 font-mono text-xs">
                {member.clerkUserId}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Role & Permissions */}
      <div>
        <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Role & Permissions
        </h4>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Current Role:</span>
            <div className="mt-1">{renderRoleIndicator(member.role)}</div>
          </div>
          <div>
            <span className="font-medium">Description:</span>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              {roleConfig.description}
            </p>
          </div>
          <div>
            <span className="font-medium">Staff Status:</span>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              {member.isStaff ? "Staff Member" : "Non-Staff User"}
            </p>
          </div>
          {member.managerUser && (
            <div>
              <span className="font-medium">Reports To:</span>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                {member.managerUser.computedName ||
                  `${member.managerUser.firstName} ${member.managerUser.lastName}`}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {member.managerUser.email}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Account Activity */}
      <div>
        <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Account Activity
        </h4>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Account Status:</span>
            <div className="mt-1">{getStatusComponent(member.isActive)}</div>
          </div>
          <div>
            <span className="font-medium">Joined:</span>
            <div className="text-neutral-600 dark:text-neutral-400">
              {safeFormatDate(member.createdAt, "dd MMM yyyy")}
            </div>
          </div>
          <div>
            <span className="font-medium">Last Updated:</span>
            <div className="text-neutral-600 dark:text-neutral-400">
              {safeFormatDate(member.updatedAt, "dd MMM yyyy 'at' HH:mm")}
            </div>
          </div>
          <div>
            <span className="font-medium">Account Age:</span>
            <div className="text-neutral-600 dark:text-neutral-400">
              {Math.floor(
                (Date.now() - new Date(member.createdAt).getTime()) /
                  (1000 * 60 * 60 * 24)
              )}{" "}
              days
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ModernStaffManager({
  staff,
  loading,
  onRefetch,
  onRoleUpdate,
  onStatusUpdate,
  showHeader = true,
  showLocalActions = true,
}: StaffManagerProps) {
  // Export listener for staff CSV
  const rows = useMemo(() => staff || [], [staff]);
  useEffect(() => {
    const handleExport = () => {
      const headers = [
        "Name",
        "Email",
        "Role",
        "Active",
        "Staff",
        "Manager",
        "Created",
        "Updated",
      ];
      const escape = (val: unknown) => {
        const s = String(val ?? "");
        const escaped = s.replace(/"/g, '""');
        return `"${escaped}"`;
      };
      const csvRows = rows.map(m => [
        escape(m.computedName || `${m.firstName} ${m.lastName}`),
        escape(m.email),
        escape(m.role),
        escape(m.isActive ? "Yes" : "No"),
        escape(m.isStaff ? "Yes" : "No"),
        escape(
          m.managerUser
            ? m.managerUser.computedName ||
                `${m.managerUser.firstName} ${m.managerUser.lastName}`
            : ""
        ),
        escape(safeFormatDate(m.createdAt, "dd MMM yyyy")),
        escape(safeFormatDate(m.updatedAt, "dd MMM yyyy")),
      ]);
      const csv = [
        headers.map(escape).join(","),
        ...csvRows.map(r => r.join(",")),
      ].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `staff-export-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.remove();
      }, 0);
    };
    window.addEventListener("staff:export", handleExport as EventListener);
    return () => {
      window.removeEventListener("staff:export", handleExport as EventListener);
    };
  }, [rows]);
  // Define essential columns only (4 columns instead of 6+)
  const columns: ColumnDef<StaffMember>[] = [
    {
      id: "member",
      key: "firstName",
      label: "Staff Member",
      essential: true,
      sortable: true,
      render: (_, member) => (
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src="" alt={getDisplayName(member)} />
            <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
              {getUserInitials(member)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <Link
              href={`/staff/${member.id}`}
              className="font-medium text-primary hover:text-primary/90 truncate block"
            >
              {getDisplayName(member)}
            </Link>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {member.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "role",
      key: "role",
      label: "Role",
      essential: true,
      sortable: true,
      render: (_, member) => (
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-neutral-500" />
          {renderRoleIndicator(member.role)}
        </div>
      ),
    },
    {
      id: "status",
      key: "isActive",
      label: "Status",
      essential: true,
      sortable: true,
      render: (_, member) => (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {getStatusComponent(member.isActive)}
          </div>
          <div className="text-xs text-neutral-500">
            {member.isStaff ? "Staff" : "Non-Staff"}
          </div>
        </div>
      ),
    },
    {
      id: "management",
      key: "managerId",
      label: "Management",
      essential: true,
      sortable: false,
      render: (_, member) => (
        <div className="min-w-0">
          {member.managerUser ? (
            <div>
              <div className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                {member.managerUser.computedName ||
                  `${member.managerUser.firstName} ${member.managerUser.lastName}`}
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate flex items-center gap-1">
                <User className="h-3 w-3" />
                {getRoleConfig(member.managerUser.role).label}
              </div>
            </div>
          ) : (
            <div className="text-sm text-neutral-500">No manager assigned</div>
          )}
        </div>
      ),
    },
  ];

  // Row actions (contextual, not bulk)
  const rowActions: RowAction<StaffMember>[] = [
    {
      id: "view",
      label: "View Profile",
      icon: Eye,
      onClick: member => {
        window.open(`/staff/${member.id}`, "_blank");
      },
    },
    {
      id: "edit",
      label: "Edit User",
      icon: Edit,
      onClick: member => {
        window.open(`/staff/${member.id}/edit`, "_blank");
      },
    },
    {
      id: "activate",
      label: "Activate",
      icon: UserPlus,
      onClick: member => {
        const newStatus = "active";
        const reason = "Activated via staff management";
        onStatusUpdate?.(member.id, newStatus, reason);
      },
      disabled: member => member.isActive === true,
    },
    {
      id: "deactivate",
      label: "Deactivate",
      icon: UserX,
      onClick: member => {
        const newStatus = "inactive";
        const reason = "Deactivated via staff management";
        onStatusUpdate?.(member.id, newStatus, reason);
      },
      disabled: member => member.isActive === false,
      variant: "destructive",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Listener mounted for CSV export */}
      {showHeader && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Staff Management
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Manage team members, roles, and access permissions
            </p>
          </div>
          {showLocalActions && (
            <div className="flex items-center gap-2">
              {onRefetch && (
                <Button variant="outline" size="sm" onClick={onRefetch}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              )}
              <PermissionGuard action="create">
                <Button asChild>
                  <Link href="/staff/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Staff Member
                  </Link>
                </Button>
              </PermissionGuard>
            </div>
          )}
        </div>
      )}

      <ModernDataTable
        data={staff}
        columns={columns}
        loading={!!loading}
        searchPlaceholder="Search staff, roles, emails..."
        expandableRows
        renderExpandedRow={member => <StaffMemberDetails member={member} />}
        rowActions={rowActions}
        viewToggle
        emptyState={
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              No staff members found
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Create your first staff member to start managing team access and
              permissions
            </p>
            <PermissionGuard action="create">
              <Button asChild>
                <Link href="/staff/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Staff Member
                </Link>
              </Button>
            </PermissionGuard>
          </div>
        }
      />
    </div>
  );
}
