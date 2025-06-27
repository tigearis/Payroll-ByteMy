"use client";

import {
  Shield,
  UserCheck,
  Eye,
  Edit,
  UserX,
  Mail,
  Calendar,
} from "lucide-react";

import {
  UnifiedDataTable,
  DataTableColumn,
  DataTableAction,
  StatusConfig,
  createCellRenderers,
} from "@/components/ui/unified-data-table";

// User data type (based on existing user structure)
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isStaff: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  manager?: {
    id: string;
    name: string;
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

// Status configuration for users
const userStatusConfig: Record<string, StatusConfig> = {
  Active: {
    variant: "default",
    icon: UserCheck,
    className: "bg-green-50 text-green-700 border-green-200",
  },
  Inactive: {
    variant: "destructive",
    icon: UserX,
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

// Role configuration
const roleStatusConfig: Record<string, StatusConfig> = {
  developer: {
    variant: "default",
    icon: Shield,
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },
  org_admin: {
    variant: "default",
    icon: Shield,
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  manager: {
    variant: "secondary",
    icon: UserCheck,
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },
  consultant: {
    variant: "outline",
    icon: UserCheck,
    className: "bg-gray-50 text-gray-700 border-gray-200",
  },
  viewer: {
    variant: "outline",
    icon: Eye,
    className: "bg-gray-50 text-gray-600 border-gray-200",
  },
};

export function UsersTableUnified({
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
  // Create cell renderers with combined status configs
  const cellRenderers = createCellRenderers<User>({
    ...userStatusConfig,
    ...roleStatusConfig,
  });

  // Column definitions
  const columns: DataTableColumn<User>[] = [
    {
      key: "name",
      label: "User",
      sortable: true,
      defaultVisible: true,
      cellRenderer: (value, row) =>
        cellRenderers.avatar({
          name: value,
          email: row.email,
          imageUrl: row.imageUrl || "",
        }),
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      defaultVisible: true,
      cellRenderer: role => {
        const displayRole =
          role.charAt(0).toUpperCase() + role.slice(1).replace("_", " ");
        return cellRenderers.badge(role);
      },
    },
    {
      key: "isActive",
      label: "Status",
      sortable: true,
      defaultVisible: true,
      cellRenderer: active =>
        cellRenderers.badge(active ? "Active" : "Inactive"),
    },
    {
      key: "isStaff",
      label: "Staff Member",
      sortable: true,
      defaultVisible: true,
      align: "center",
      cellRenderer: isStaff => (
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
      key: "manager",
      label: "Manager",
      sortable: false,
      defaultVisible: true,
      cellRenderer: manager =>
        manager ? (
          <div className="text-sm">
            <div className="font-medium">{manager.name}</div>
            <div className="text-muted-foreground">{manager.email}</div>
          </div>
        ) : (
          "—"
        ),
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      defaultVisible: false,
      cellRenderer: email => cellRenderers.iconText(email, Mail),
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      defaultVisible: false,
      cellRenderer: date => cellRenderers.simpleDate(date),
    },
    {
      key: "updatedAt",
      label: "Last Updated",
      sortable: true,
      defaultVisible: true,
      cellRenderer: date => cellRenderers.date(date),
    },
  ];

  // Action definitions
  const actions: DataTableAction<User>[] = [
    {
      label: "View Details",
      icon: Eye,
      onClick: user => {
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
      onClick: user => {
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
      onClick: user => {
        window.open(`mailto:${user.email}`, "_blank");
      },
    },
    {
      label: "View Profile",
      icon: UserCheck,
      onClick: user => {
        window.location.href = `/staff/${user.id}`;
      },
      separator: true,
    },
  ];

  return (
    <UnifiedDataTable
      data={users}
      columns={columns}
      loading={loading}
      emptyMessage="No users found. Add your first team member to get started."
      selectable={false}
      sortField={sortField || ""}
      sortDirection={sortDirection || "ASC"}
      onSort={onSort || (() => {})}
      visibleColumns={visibleColumns || []}
      actions={actions}
      statusConfig={{ ...userStatusConfig, ...roleStatusConfig }}
      title="Team Members"
      onRefresh={onRefresh || (() => {})}
      getRowId={user => user.id}
      getRowLink={user => `/staff/${user.id}`}
    />
  );
}

export default UsersTableUnified;
