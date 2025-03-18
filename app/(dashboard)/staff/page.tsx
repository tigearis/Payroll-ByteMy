"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQuery } from "@apollo/client";
import { GET_STAFF_LIST } from "@/graphql/queries/staff/getStaffList";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner"; // ✅ Import toast notifications

// 🛠 Define Staff Type
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

// 🛠 Users Page Component
export default function UsersPage() {
  const { isAdmin, isManager, isConsultant, isDeveloper } = useUserRole();
  const { loading, error, data } = useQuery(GET_STAFF_LIST);
  const [staffList, setStaffList] = React.useState<Staff[]>([]);

  React.useEffect(() => {
    if (data?.users) {
      setStaffList(data.users);
    }
  }, [data]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">Error loading staff data.</p>;

  // ✅ Managers see only their staff
  const filteredStaff = isManager
    ? staffList.filter((staff) => staff.manager_id === data?.currentUserId)
    : staffList;

  // ✅ Developers & Admins can edit roles
  const canEditRoles = isAdmin || isDeveloper;
  const canSelectUser = isAdmin || isManager || isDeveloper;

  // ✅ Update Role Function
  const updateRole = async (userId: string, newRole: string) => {
    if (!canEditRoles) return;

    try {
      const response = await fetch("/api/update-user-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newRole }),
      });

      if (!response.ok) throw new Error("Failed to update role");

      setStaffList((prevStaff) =>
        prevStaff.map((staff) => (staff.id === userId ? { ...staff, role: newRole } : staff))
      );

      toast.success(`Role updated to ${newRole} successfully!`); // ✅ Success toast
    } catch (err) {
      console.error("Error updating role:", err);
      toast.error("Failed to update role. Please try again."); // ✅ Error toast
    }
  };

  // ✅ Define Columns for TanStack Table
  const columns: ColumnDef<Staff>[] = React.useMemo(() => [
    { accessorKey: "id", header: "ID", cell: ({ row }) => row.original.id },
    { accessorKey: "email", header: "Email", cell: ({ row }) => row.original.email },
    { accessorKey: "name", header: "Name", cell: ({ row }) => row.original.name },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) =>
        canEditRoles ? (
          <Select
            value={row.original.role}
            onValueChange={(newRole) => updateRole(row.original.id, newRole)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
              <ChevronDown className="ml-2 h-4 w-4" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="developer">Developer</SelectItem>
              <SelectItem value="org_admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="consultant">Consultant</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          row.original.role
        ),
    },
    {
      accessorKey: "manager",
      header: "Manager",
      cell: ({ row }) => (row.original.manager ? row.original.manager.name : "None"),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) =>
        canSelectUser ? (
          <Button variant="outline" onClick={() => console.log(`Viewing ${row.original.id}`)}>
            View
          </Button>
        ) : (
          <span className="text-gray-400">Restricted</span>
        ),
    },
  ], []);

  // ✅ Setup TanStack Table
  const table = useReactTable({
    data: filteredStaff,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Staff List</h2>

      {isAdmin && (
        <div className="mb-4">
          <Button onClick={() => console.log("Create Staff Member")}>Create Staff Member</Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={{ width: "auto" }}>
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
    </div>
  );
}
