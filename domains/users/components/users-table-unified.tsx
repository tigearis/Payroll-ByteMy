"use client";

import { Shield, UserCheck, Eye, Edit, UserX, Mail } from "lucide-react";
import { memo } from "react";
import {
  ModernDataTable,
  type ColumnDef,
  type RowAction,
} from "@/components/data/modern-data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getRoleDisplayName, getPositionDisplayName } from "@/lib/utils/role-utils";

// User data type (based on existing user structure)
interface User {
  id: string;
  firstName: string;
  lastName: string;
  computedName?: string | null;
  email: string;
  role: string;
  position?: string;
  isStaff: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  manager?: {
    id: string;
    firstName: string;
    lastName: string;
    computedName?: string | null;
    email: string;
  };
  imageUrl?: string;
}

interface UsersTableProps {
  users: User[];
  loading?: boolean;
  onRefresh?: () => void;
  visibleColumns?: string[];
  sortField?: string;
  sortDirection?: "ASC" | "DESC";
  onSort?: (field: string) => void;
  onEditUser?: (user: User) => void;
  onViewUser?: (user: User) => void;
}

// Helper functions for rendering cells
const renderUserStatus = (isActive: boolean) => {
  const StatusIcon = isActive ? UserCheck : UserX;
  const variant = isActive ? "default" : "destructive";
  const status = isActive ? "Active" : "Inactive";

  return (
    <Badge variant={variant} className="flex items-center gap-1">
      <StatusIcon className="w-3 h-3" />
      {status}
    </Badge>
  );
};

const renderUserRole = (role: string) => {
  const displayRole = getRoleDisplayName(role);

  const getRoleVariant = (role: string) => {
    const normalizedRole = role?.toLowerCase();
    if (["developer", "org_admin"].includes(normalizedRole)) return "default";
    if (["manager"].includes(normalizedRole)) return "secondary";
    return "outline";
  };

  const getRoleIcon = (role: string) => {
    const normalizedRole = role?.toLowerCase();
    if (["developer", "org_admin"].includes(normalizedRole)) return Shield;
    if (["manager", "consultant"].includes(normalizedRole)) return UserCheck;
    return Eye;
  };

  const RoleIcon = getRoleIcon(role);

  return (
    <Badge variant={getRoleVariant(role)} className="flex items-center gap-1">
      <RoleIcon className="w-3 h-3" />
      {displayRole}
    </Badge>
  );
};

const renderUserAvatar = (user: User) => {
  const displayName = user.computedName || `${user.firstName} ${user.lastName}`;

  return (
    <div className="flex items-center space-x-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.imageUrl} alt={displayName} />
        <AvatarFallback>
          {displayName
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="font-medium truncate">{displayName}</div>
        <div className="text-sm text-foreground opacity-75 truncate">
          {getPositionDisplayName(user.position) !== 'Not specified' 
            ? getPositionDisplayName(user.position)
            : getRoleDisplayName(user.role)}
        </div>
      </div>
    </div>
  );
};

function UsersTableUnifiedComponent({
  users,
  loading = false,
  onRefresh,
  visibleColumns,
  sortField,
  sortDirection,
  onSort,
  onEditUser,
  onViewUser,
}: UsersTableProps) {
  // Column definitions
  const columns: ColumnDef<User>[] = [
    {
      id: "computedName",
      key: "computedName",
      label: "User",
      essential: true,
      sortable: true,
      render: (_value, row) => renderUserAvatar(row),
    },
    {
      id: "role",
      key: "role",
      label: "Role",
      essential: true,
      sortable: true,
      render: role => renderUserRole(role),
    },
    {
      id: "isActive",
      key: "isActive",
      label: "Status",
      essential: true,
      sortable: true,
      render: active => renderUserStatus(active),
    },
    {
      id: "isStaff",
      key: "isStaff",
      label: "Staff Member",
      essential: false,
      sortable: true,
      render: isStaff => (
        <div className="flex justify-center">
          {isStaff ? (
            <UserCheck className="w-4 h-4 text-green-600" />
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </div>
      ),
    },
    {
      id: "manager",
      key: "manager" as any,
      label: "Manager",
      essential: false,
      sortable: false,
      render: manager =>
        manager ? (
          <div className="text-sm">
            <div className="font-medium">
              {manager.computedName ||
                `${manager.firstName} ${manager.lastName}`}
            </div>
            <div className="text-muted-foreground">{manager.email}</div>
          </div>
        ) : (
          "—"
        ),
    },
    {
      id: "email",
      key: "email",
      label: "Email",
      essential: false,
      sortable: true,
      render: email => (
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-500" />
          <span>{email}</span>
        </div>
      ),
    },
    {
      id: "createdAt",
      key: "createdAt",
      label: "Created",
      essential: false,
      sortable: true,
      render: date => new Date(date).toLocaleDateString(),
    },
    {
      id: "updatedAt",
      key: "updatedAt",
      label: "Last Updated",
      essential: false,
      sortable: true,
      render: date => {
        const dateObj = new Date(date);
        return (
          <div className="text-sm">
            <div>{dateObj.toLocaleDateString()}</div>
            <div className="text-muted-foreground">
              {dateObj.toLocaleTimeString()}
            </div>
          </div>
        );
      },
    },
  ];

  // Action definitions
  const actions: RowAction<User>[] = [
    {
      id: "view",
      label: "View Details",
      icon: Eye,
      onClick: (user: User) => {
        if (onViewUser) onViewUser(user);
        else window.location.href = `/staff/${user.id}`;
      },
    },
    {
      id: "edit",
      label: "Edit User",
      icon: Edit,
      onClick: (user: User) => {
        if (onEditUser) onEditUser(user);
        else console.log("Edit user:", user.id);
      },
    },
    {
      id: "email",
      label: "Send Email",
      icon: Mail,
      onClick: (user: User) => window.open(`mailto:${user.email}`, "_blank"),
    },
    {
      id: "profile",
      label: "View Profile",
      icon: UserCheck,
      onClick: (user: User) => {
        window.location.href = `/staff/${user.id}`;
      },
    },
  ];

  return (
    <ModernDataTable<User>
      data={users}
      columns={columns}
      loading={loading}
      searchable
      searchPlaceholder="Search team members..."
      rowActions={actions}
      emptyState={
        <div className="text-sm text-muted-foreground">No users found</div>
      }
    />
  );
}

// ============================================================================
// PERFORMANCE OPTIMIZED EXPORT WITH REACT.MEMO
// ============================================================================

/**
 * Custom comparison function for UsersTableUnified React.memo
 * Optimizes re-renders for user table with complex data arrays
 */
function areUsersTablePropsEqual(
  prevProps: UsersTableProps,
  nextProps: UsersTableProps
): boolean {
  // Quick primitive checks first
  if (
    prevProps.loading !== nextProps.loading ||
    prevProps.sortField !== nextProps.sortField ||
    prevProps.sortDirection !== nextProps.sortDirection
  ) {
    return false;
  }

  // Users array comparison (most expensive check)
  if (prevProps.users !== nextProps.users) {
    // If arrays are different lengths, definitely different
    if (prevProps.users.length !== nextProps.users.length) {
      return false;
    }

    // For performance, do shallow comparison of users array
    // In most cases, users will be a new array reference when it changes
    return false;
  }

  // Visible columns comparison
  if (prevProps.visibleColumns !== nextProps.visibleColumns) {
    if (!prevProps.visibleColumns || !nextProps.visibleColumns) {
      return prevProps.visibleColumns === nextProps.visibleColumns;
    }
    if (prevProps.visibleColumns.length !== nextProps.visibleColumns.length) {
      return false;
    }
    return (
      JSON.stringify(prevProps.visibleColumns) ===
      JSON.stringify(nextProps.visibleColumns)
    );
  }

  // Function callbacks typically change, but table behavior stays consistent

  return true;
}

/**
 * Memoized UsersTableUnified Component
 *
 * Prevents unnecessary re-renders when user data hasn't changed.
 * Optimized for large user lists and complex table interactions.
 */
export const UsersTableUnified = memo(
  UsersTableUnifiedComponent,
  areUsersTablePropsEqual
);

export default UsersTableUnified;
