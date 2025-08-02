"use client";

import { Shield, UserCheck, Eye, Edit, UserX, Mail } from "lucide-react";
import { memo } from "react";
import {
  EnhancedUnifiedTable,
  UnifiedTableColumn,
  UnifiedTableAction,
} from "@/components/ui/enhanced-unified-table";
import { getRoleDisplayName } from "@/lib/utils/role-utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// User data type (based on existing user structure)
interface User {
  id: string;
  firstName: string;
  lastName: string;
  computedName?: string | null;
  email: string;
  role: string;
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
  const variant = isActive ? 'default' : 'destructive';
  const status = isActive ? 'Active' : 'Inactive';
  
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
    if (['developer', 'org_admin'].includes(normalizedRole)) return 'default';
    if (['manager'].includes(normalizedRole)) return 'secondary';
    return 'outline';
  };

  const getRoleIcon = (role: string) => {
    const normalizedRole = role?.toLowerCase();
    if (['developer', 'org_admin'].includes(normalizedRole)) return Shield;
    if (['manager', 'consultant'].includes(normalizedRole)) return UserCheck;
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
          {displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="font-medium truncate">{displayName}</div>
        <div className="text-sm text-muted-foreground truncate">
          {user.email}
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
  const columns: UnifiedTableColumn<User>[] = [
    {
      accessorKey: "computedName",
      header: "User",
      type: "text",
      sortable: true,
      render: (value, row) => renderUserAvatar(row),
    },
    {
      accessorKey: "role",
      header: "Role",
      type: "badge",
      sortable: true,
      render: (role) => renderUserRole(role),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      type: "badge",
      sortable: true,
      render: (active) => renderUserStatus(active),
    },
    {
      accessorKey: "isStaff",
      header: "Staff Member",
      type: "text",
      sortable: true,
      align: "center",
      render: (isStaff) => (
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
      accessorKey: "manager",
      header: "Manager",
      type: "text",
      sortable: false,
      render: (manager) =>
        manager ? (
          <div className="text-sm">
            <div className="font-medium">{manager.computedName || `${manager.firstName} ${manager.lastName}`}</div>
            <div className="text-muted-foreground">{manager.email}</div>
          </div>
        ) : (
          "—"
        ),
    },
    {
      accessorKey: "email",
      header: "Email",
      type: "text",
      sortable: true,
      render: (email) => (
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-500" />
          <span>{email}</span>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      type: "date",
      sortable: true,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      accessorKey: "updatedAt",
      header: "Last Updated",
      type: "date",
      sortable: true,
      render: (date) => {
        const dateObj = new Date(date);
        return (
          <div className="text-sm">
            <div>{dateObj.toLocaleDateString()}</div>
            <div className="text-muted-foreground">{dateObj.toLocaleTimeString()}</div>
          </div>
        );
      },
    },
  ];

  // Action definitions
  const actions: UnifiedTableAction<User>[] = [
    {
      label: "View Details",
      icon: Eye,
      onClick: (user: User) => {
        if (onViewUser) {
          onViewUser(user);
        } else {
          window.location.href = `/staff/${user.id}`;
        }
      },
    },
    {
      label: "Edit User",
      icon: Edit,
      onClick: (user: User) => {
        if (onEditUser) {
          onEditUser(user);
        } else {
          console.log("Edit user:", user.id);
        }
      },
    },
    {
      label: "Send Email",
      icon: Mail,
      onClick: (user: User) => {
        window.open(`mailto:${user.email}`, "_blank");
      },
    },
    {
      label: "View Profile",
      icon: UserCheck,
      onClick: (user: User) => {
        window.location.href = `/staff/${user.id}`;
      },
    },
  ];

  return (
    <EnhancedUnifiedTable
      data={users}
      columns={columns}
      loading={loading}
      emptyMessage="No users found. Add your first team member to get started."
      selectable={false}
      actions={actions}
      title="Team Members"
      searchable={true}
      searchPlaceholder="Search team members..."
      {...(onRefresh && { onRefresh })}
      refreshing={loading}
      exportable={true}
      onExport={(format) => {
        console.log("Export users as:", format);
      }}
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
    return JSON.stringify(prevProps.visibleColumns) === JSON.stringify(nextProps.visibleColumns);
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
