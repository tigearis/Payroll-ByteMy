"use client";

import { UserPlus, Search, RefreshCcw, Edit, Trash2 } from "lucide-react";
import { useState, useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStaffManagement } from "@/hooks/use-staff-management";
import { User } from "@/hooks/use-user-management";

// Define a type that's compatible with both the User type and the GraphQL fragment
interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  isStaff: boolean | null;
  isActive?: boolean | null;
  clerkUserId?: string | null;
  username?: string | null;
  image?: string | null;
  managerId?: string | null;
  __typename?: string;
  " $fragmentRefs"?: any;
}

interface StaffManagementContentProps {
  onAddStaff?: () => void;
  onEditStaff?: (staffId: string) => void;
  onDeleteStaff?: (staffId: string) => void;
}

export function StaffManagementContent({
  onAddStaff,
  onEditStaff,
  onDeleteStaff,
}: StaffManagementContentProps = {}) {
  return (
    <PermissionGuard permission="staff:read">
      <StaffManagementContentInner 
        onAddStaff={onAddStaff}
        onEditStaff={onEditStaff}
        onDeleteStaff={onDeleteStaff}
      />
    </PermissionGuard>
  );
}

function StaffManagementContentInner({
  onAddStaff,
  onEditStaff,
  onDeleteStaff,
}: StaffManagementContentProps = {}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // Debounced search
  const pageSize = 10;

  const {
    staff,
    loading,
    error,
    isReady,
    totalCount,
    currentUserRole,
    fetchStaff,
    canCreateStaff,
    canEditUser,
    canDeleteUser,
  } = useStaffManagement({
    autoFetch: true,
    pageSize,
  });

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchTerm);
      setCurrentPage(1); // Reset to first page on search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch staff when search query or page changes
  useEffect(() => {
    if (isReady) {
      fetchStaff({
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        search: searchQuery,
      }).catch(err => {
        console.error("Failed to fetch staff:", err);
        toast.error("Failed to load staff data");
      });
    }
  }, [searchQuery, currentPage, pageSize, isReady, fetchStaff]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    try {
      await fetchStaff({
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        search: searchQuery,
      });
      toast.success("Staff list refreshed");
    } catch (err) {
      console.error("Failed to refresh staff:", err);
      toast.error("Failed to refresh staff list");
    }
  }, [fetchStaff, pageSize, currentPage, searchQuery]);

  // Handle search button click
  const handleSearchClick = useCallback(() => {
    setSearchQuery(searchTerm);
    setCurrentPage(1);
  }, [searchTerm]);

  // Handle pagination
  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    if (currentPage * pageSize < totalCount) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, pageSize, totalCount]);

  // Handle staff actions
  const handleAddStaff = useCallback(() => {
    if (onAddStaff) {
      onAddStaff();
    } else {
      toast.info("Add staff functionality not implemented");
    }
  }, [onAddStaff]);

  const handleEditStaff = useCallback(
    (staffId: string) => {
      if (onEditStaff) {
        onEditStaff(staffId);
      } else {
        toast.info("Edit staff functionality not implemented");
      }
    },
    [onEditStaff]
  );

  const handleDeleteStaff = useCallback(
    (staffId: string) => {
      if (onDeleteStaff) {
        onDeleteStaff(staffId);
      } else {
        toast.info("Delete staff functionality not implemented");
      }
    },
    [onDeleteStaff]
  );

  // Memoized values
  const totalPages = useMemo(() => {
    return Math.ceil(totalCount / pageSize);
  }, [totalCount, pageSize]);

  const currentRange = useMemo(() => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalCount);
    return { start, end };
  }, [currentPage, pageSize, totalCount]);

  // Helper function to get user initials
  const getUserInitials = useCallback((name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, []);

  // Helper function to get status badge variant
  const getStatusVariant = useCallback((isStaff: boolean) => {
    return isStaff ? "default" : "secondary";
  }, []);

  // Helper function to get status text
  const getStatusText = useCallback((isStaff: boolean) => {
    return isStaff ? "Active" : "Inactive";
  }, []);

  // Loading state
  if (!isReady) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error Loading Staff</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="mt-2"
            disabled={loading}
          >
            <RefreshCcw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <p className="text-gray-600 text-sm">
            {totalCount} total staff {totalCount === 1 ? "member" : "members"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={loading}
            aria-label="Refresh staff list"
          >
            <RefreshCcw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          {canCreateStaff && (
            <Button size="sm" onClick={handleAddStaff}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Staff
            </Button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-2 max-w-md">
        <Input
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              handleSearchClick();
            }
          }}
          className="flex-1"
          aria-label="Search staff members"
        />
        <Button
          onClick={handleSearchClick}
          variant="outline"
          size="sm"
          disabled={loading}
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && staff.length === 0 ? (
              // Initial loading state
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-20 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : staff.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-gray-500"
                >
                  {searchQuery
                    ? "No staff members found matching your search"
                    : "No staff members found"}
                </TableCell>
              </TableRow>
            ) : (
              staff.map((member: any) => {
                // Cast the member to our compatible type
                const staffMember = member as unknown as StaffMember;
                return (
                  <TableRow key={staffMember.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs font-medium">
                            {getUserInitials(staffMember.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{staffMember.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {staffMember.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {staffMember.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {staffMember.managerId ? "—" : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(Boolean(staffMember.isStaff))}>
                        {getStatusText(Boolean(staffMember.isStaff))}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {canEditUser(staffMember as User) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditStaff(staffMember.id)}
                            aria-label={`Edit ${staffMember.name}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {canDeleteUser(staffMember as User) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteStaff(staffMember.id)}
                            className="text-red-600 hover:text-red-700"
                            aria-label={`Delete ${staffMember.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalCount > pageSize && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {currentRange.start} to {currentRange.end} of {totalCount}{" "}
            staff members
          </p>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1 || loading}
              onClick={handlePreviousPage}
              aria-label="Previous page"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages || loading}
              onClick={handleNextPage}
              aria-label="Next page"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
