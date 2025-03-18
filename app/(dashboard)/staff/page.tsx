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
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

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
}

export default function UsersPage() {
  // Call all hooks at the top level - never conditionally
  const { isAdmin, isManager, isConsultant, isDeveloper } = useUserRole();
  const { loading, error, data, refetch } = useQuery(GET_STAFF_LIST);
  const [staffList, setStaffList] = React.useState<Staff[]>([]);
  
  // State for user-specific edits
  const [editingUsers, setEditingUsers] = React.useState<Record<string, { isEditing: boolean, newRole: string }>>({});

  // Use Apollo's useMutation hook directly
  const [updateStaffMutation, { loading: isUpdating }] = useMutation(UPDATE_STAFF, {
    onCompleted: (data) => {
      if (data?.update_users_by_pk) {
        const updatedUser = data.update_users_by_pk;
        toast.success(`Role updated to ${updatedUser.role} successfully!`);
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
    
    console.log("Saving role change:", { userId, newRole });
    
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

  // Define columns 
  const columns = React.useMemo<ColumnDef<Staff>[]>(() => [
    { 
      accessorKey: "id", 
      header: "ID",
      cell: ({ row }) => <span className="text-xs text-gray-500">{row.original.id.substring(0, 8)}...</span>
    },
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
      cell: ({ row }: CellContext<Staff, unknown>) => {
        const userId = row.original.id;
        const currentRole = row.original.role;
        const userEdit = editingUsers[userId];
        const canEditRoles = isAdmin || isDeveloper;
        
        // If user can't edit roles, just display it
        if (!canEditRoles) {
          return currentRole;
        }
        
        // If currently editing this user
        if (userEdit?.isEditing) {
          return (
            <div className="flex items-center gap-2">
              <Select
                value={userEdit.newRole}
                onValueChange={newRole => updateRoleSelection(userId, newRole)}
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
              
              <div className="flex gap-1">
                <Button 
                  size="sm" 
                  disabled={isUpdating}
                  onClick={() => saveRoleChange(userId, userEdit.newRole)}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
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
            </div>
          );
        }
        
        // Display role with edit button
        return (
          <div className="flex items-center justify-between">
            <span>{currentRole}</span>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => startEditing(userId, currentRole)}
              className="ml-2"
            >
              Edit
            </Button>
          </div>
        );
      }
    },
    {
      accessorKey: "manager",
      header: "Manager",
      cell: ({ row }) => (row.original.manager ? row.original.manager.name : "None"),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const canViewUser = isAdmin || isManager || isDeveloper;
        
        if (!canViewUser) {
          return <span className="text-gray-400">Restricted</span>;
        }
        
        return (
          <Link href={`/staff/${row.original.id}`} passHref>
            <Button variant="outline">View</Button>
          </Link>
        );
      }
    },
  ], [isAdmin, isManager, isDeveloper, editingUsers, isUpdating]);

  // Filter staff based on role - managers see only their staff
  const filteredStaff = React.useMemo(() => {
    if (!staffList || !data) return [];
    
    return isManager
      ? staffList.filter((staff) => staff.manager_id === data.currentUserId)
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

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Staff List</h2>
      
      {isAdmin && (
        <div className="mb-4">
          <Link href="/staff/new" passHref>
            <Button>Create Staff Member</Button>
          </Link>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading staff data...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">
          Error loading staff data: {error.message}
        </div>
      ) : (
        <>
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
                    <TableRow key={row.id}>
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
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}