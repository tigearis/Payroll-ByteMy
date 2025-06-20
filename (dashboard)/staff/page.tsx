"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@apollo/client";
import { useEnhancedPermissions } from "@/hooks/useEnhancedPermissions";
import { EnhancedPermissionGuard } from "@/components/auth/EnhancedPermissionGuard";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { GET_ALL_USERS_LIST } from "@/graphql/queries/staff/getStaffList";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import { Eye, Edit, Trash2, UserPlus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StaffLoading } from "@/components/ui/loading-states";
// Assuming modals for create/edit/view/delete exist and are imported
// import { CreateStaffModal } from './CreateStaffModal';
// import { EditStaffModal } from './EditStaffModal';
// import { ViewStaffModal } from './ViewStaffModal';
// import { DeleteStaffDialog } from './DeleteStaffDialog';

interface Staff {
  id: string;
  email: string;
  name: string;
  role: string;
  clerk_user_id?: string;
  // other fields...
}

const roleMapping: Record<string, string> = {
  developer: "Developer",
  org_admin: "Admin",
  manager: "Manager",
  consultant: "Consultant",
  viewer: "Viewer",
};

export default function StaffManagementPage() {
  const {
    canReadStaff,
    canCreateStaff,
    canManageStaff,
    canDeleteStaff,
    isLoaded: permissionsAreLoaded,
  } = useEnhancedPermissions();
  const { currentUser } = useCurrentUser();

  const [modalState, setModalState] = React.useState<{
    view?: Staff;
    edit?: Staff;
    delete?: Staff;
    create?: boolean;
  }>({});

  const { loading, error, data, refetch } = useQuery(GET_ALL_USERS_LIST, {
    skip: !permissionsAreLoaded || !canReadStaff,
    variables: { where: { is_staff: { _eq: true } } },
  });

  const columns: ColumnDef<Staff>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => roleMapping[row.original.role] || row.original.role,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const staff = row.original;
        const isSelf = staff.clerk_user_id === currentUser?.id;

        return (
          <div className="flex items-center space-x-2">
            <EnhancedPermissionGuard.CanReadStaff>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setModalState({ view: staff })}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </EnhancedPermissionGuard.CanReadStaff>

            <EnhancedPermissionGuard
              permission="custom:staff:write"
              allowSelfAccess
              resourceUserId={staff.clerk_user_id}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setModalState({ edit: staff })}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </EnhancedPermissionGuard>

            <EnhancedPermissionGuard permission="custom:staff:delete">
              {!isSelf && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setModalState({ delete: staff })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </EnhancedPermissionGuard>
          </div>
        );
      },
    },
  ];

  if (!permissionsAreLoaded) {
    return <StaffLoading />;
  }

  if (!canReadStaff) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You do not have permission to view this page.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) return <StaffLoading />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Staff Management</CardTitle>
          <EnhancedPermissionGuard.CanCreateStaff>
            <Button onClick={() => setModalState({ create: true })}>
              <UserPlus className="mr-2 h-4 w-4" />
              Create Staff
            </Button>
          </EnhancedPermissionGuard.CanCreateStaff>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data?.users || []} />
        </CardContent>
      </Card>

      {/* 
        Modals would be rendered here based on modalState.
        For example:
        {modalState.create && <CreateStaffModal onClose={() => setModalState({})} onSave={refetch} />}
        {modalState.edit && <EditStaffModal staff={modalState.edit} onClose={() => setModalState({})} onSave={refetch} />}
        ... etc ...
      */}
    </div>
  );
}
