"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  CellContext
} from "@tanstack/react-table";
import { useQuery, useMutation } from "@apollo/client";
import { GET_STAFF_LIST } from "@/graphql/queries/staff/getStaffList";
import { UPDATE_STAFF } from "@/graphql/mutations/staff/updateStaff";
import { DELETE_STAFF } from "@/graphql/mutations/staff/deleteStaff";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ChevronDown, PlusCircle, Trash2, UserPlus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Define Staff Type
interface Staff {
  id: string;
  email: string;
  name: string;
  role: string;
  manager_id?: string;
  manager?: {
    name: string;
    id: string;
    email: string;
  };
  leaves?: Array<{
    id: string;
    start_date: string;
    end_date: string;
    leave_type: string;
    reason: string;
    status: string;
  }>;
}

// Role name mapping
const roleMapping: Record<string, string> = {
  "admin": "Developer",
  "org_admin": "Admin",
  "manager": "Manager",
  "consultant": "Consultant",
  "viewer": "Viewer"
};

export default function UsersPage() {
  // Call all hooks at the top level - never conditionally
  const { isAdmin, isManager, isConsultant, isDeveloper } = useUserRole();
  const { loading, error, data, refetch } = useQuery(GET_STAFF_LIST);
  const [staffList, setStaffList] = React.useState<Staff[]>([]);

  // State for user-specific edits and deletion
  const [editingUsers, setEditingUsers] = React.useState<Record<string, { isEditing: boolean, newRole: string }>>({});
  const [staffToDelete, setStaffToDelete] = React.useState<Staff | null>(null);

  // Mutation hooks for updating and deleting staff
  const [updateStaffMutation, { loading: isUpdating }] = useMutation(UPDATE_STAFF, {
    onCompleted: (data) => {
      if (data?.update_users_by_pk) {
        const updatedUser = data.update_users_by_pk;
        toast.success(`Role updated to ${roleMapping[updatedUser.role] || updatedUser.role} successfully!`);
        refetch(); // Refresh the staff list
      } else {
        console.error("Unexpected mutation response:", data);
        toast.error("Update completed but returned unexpected data");
      }
    },
    onError: (error) => {
      console.error("GraphQL mutation error:", error);
      toast.error(`Failed to update role: ${error.message}`);
    }
  });

  // Delete staff mutation
  const [deleteStaffMutation, { loading: isDeleting }] = useMutation(DELETE_STAFF, {
    onCompleted: (data) => {
      if (data?.update_users_by_pk) {
        toast.success(`Staff member removed successfully`);
        refetch(); // Refresh the staff list
      } else {
        console.error("Unexpected deletion response:", data);
        toast.error("Deletion completed but returned unexpected data");
      }
    },
    onError: (error) => {
      console.error("GraphQL deletion error:", error);
      toast.error(`Failed to delete staff member: ${error.message}`);
    }
  });

  // Handle setting staffList with useEffect - only dependency is data
  React.useEffect(() => {
    if (data?.users) {
      setStaffList(data.users);
    }
  }, [data]);

  // Start editing for a specific user
  const startEditing = (userId: string, currentRole: string) => {
    setEditingUsers(prev => ({
      ...prev,
      [userId]: { isEditing: true, newRole: currentRole }
    }));
  };

  // Cancel editing
  const cancelEditing = (userId: string) => {
    setEditingUsers(prev => {
      const updated = { ...prev };
      delete updated[userId];
      return updated;
    });
  };

  // Update the temporary role selection
  const updateRoleSelection = (userId: string, newRole: string) => {
    setEditingUsers(prev => ({
      ...prev,
      [userId]: { ...prev[userId], newRole }
    }));
  };

  // Save the role change
  const saveRoleChange = async (userId: string, newRole: string) => {
    if (!isAdmin && !isDeveloper) return;

    // Check for null or empty values
    if (!userId || !newRole) {
      toast.error("User ID and role are required");
      return;
    }

    try {
      await updateStaffMutation({
        variables: {
          id: userId,
          role: newRole
        }
      });
      // Clear editing state for this user
      cancelEditing(userId);
    } catch (error) {
      // Error handling is done in the onError callback of useMutation
      console.error("Error in saveRoleChange:", error);
    }
  };

  // Handle staff deletion
  const handleDeleteStaff = (staff: Staff) => {
    setStaffToDelete(staff);
  };

  // Confirm staff deletion
  const confirmDeleteStaff = async () => {
    if (!staffToDelete || (!isAdmin && !isDeveloper)) {
      return;
    }

    try {
      await deleteStaffMutation({
        variables: {
          id: staffToDelete.id
        }
      });
      // Reset state
      setStaffToDelete(null);
    } catch (error) {
      // Error handling is done in the onError callback of useMutation
      console.error("Error in deleteStaff:", error);
    }
  };

  // Define columns
  const columns = React.useMemo<ColumnDef<Staff>[]>(() => [
    {
      accessorKey: "email",
      header: "Email"
    },
    {
      accessorKey: "name",
      header: "Name"
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const userId = row.original.id;
        const currentRole = row.original.role;
        const displayRole = roleMapping[currentRole] || currentRole;
        const userEdit = editingUsers[userId];
        const canEditRoles = isAdmin || isDeveloper;

        // If user can't edit roles, just display it
        if (!canEditRoles) {
          return displayRole;
        }

        // If currently editing this user
        if (userEdit?.isEditing) {
          return (
            <div className="flex items-center gap-2">
              <Select
                value={userEdit.newRole}
                onValueChange={(newRole) => updateRoleSelection(userId, newRole)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Developer</SelectItem>
                  <SelectItem value="org_admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="consultant">Consultant</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="sm"
                onClick={() => saveRoleChange(userId, userEdit.newRole)}
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => cancelEditing(userId)}
              >
                Cancel
              </Button>
            </div>
          );
        }

        // Display role with edit button
        return displayRole;
      }
    },
    {
      accessorKey: "manager",
      header: "Manager",
      cell: ({ row }) => (row.original.manager ? row.original.manager.name : "None"),
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const userId = row.original.id;
        const currentRole = row.original.role;
        const canViewUser = isAdmin || isManager || isDeveloper;
        const canEditRoles = isAdmin || isDeveloper;
        const userEdit = editingUsers[userId];

        if (!canViewUser) {
          return <div className="text-muted">Restricted</div>;
        }

        return (
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => { }}
            >
              View
            </Button>

            {canEditRoles && !userEdit?.isEditing && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => startEditing(userId, currentRole)}
              >
                Edit
              </Button>
            )}

            {canEditRoles && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDeleteStaff(row.original)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      }
    }
  ], [isAdmin, isManager, isDeveloper, editingUsers, isUpdating, isDeleting]);

  // Filter staff based on role - managers see only their staff
  const filteredStaff = React.useMemo<Staff[]>(() => {
    if (!staffList || !data) return [];
    return isManager && data.currentUserId
      ? staffList.filter((staff: Staff) => staff.manager_id === data.currentUserId)
      : staffList;
  }, [staffList, data, isManager]);

  // Set up TanStack Table
  const table = useReactTable({
    data: filteredStaff,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });
  const canViewUser = isAdmin || isManager || isDeveloper;
  const canEditRoles = isAdmin || isDeveloper;
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Staff List</h1>

        {canEditRoles && (
          <Link href="/staff/new">
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Create Staff Member
            </Button>
          </Link>
        )}
      </div>


      {loading ? (
        <p className="text-center py-4">Loading staff data...</p>
      ) : error ? (
        <p className="text-center py-4 text-red-500">Error loading staff data: {error.message}</p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Staff Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No staff found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!staffToDelete} onOpenChange={(open) => !open && setStaffToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {staffToDelete?.name}? This action will remove them as staff but not delete their user account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteStaff}>
              {isDeleting ? "Removing..." : "Remove Staff"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
