"use client";

import React, { useState, useCallback } from "react";
import { toast } from "sonner";
import { useStaffManagement } from "@/hooks/use-staff-management";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Search, RefreshCcw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export function StaffManagementContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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
    pageSize 
  });

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    try {
      await fetchStaff({
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        search: searchTerm,
      });
      toast.success("Staff list refreshed");
    } catch (err) {
      toast.error("Failed to refresh staff list");
    }
  }, [fetchStaff, pageSize, currentPage, searchTerm]);

  // Handle search
  const handleSearch = useCallback(async () => {
    setCurrentPage(1);
    await fetchStaff({
      limit: pageSize,
      offset: 0,
      search: searchTerm,
    });
  }, [fetchStaff, pageSize, searchTerm]);

  // Loading state
  if (!isReady) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-full" />
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
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
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
            {totalCount} total staff members
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {canCreateStaff && (
            <Button size="sm">
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
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch} variant="outline" size="sm">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex justify-center">
                    <RefreshCcw className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                </TableCell>
              </TableRow>
            ) : staff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No staff members found
                </TableCell>
              </TableRow>
            ) : (
              staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{member.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{member.role}</Badge>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    <Badge variant={member.isStaff ? "default" : "secondary"}>
                      {member.isStaff ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {canEditUser(member) && (
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      )}
                      {canDeleteUser(member) && (
                        <Button variant="outline" size="sm">
                          Delete
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalCount > pageSize && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage(currentPage - 1);
                fetchStaff({
                  limit: pageSize,
                  offset: ((currentPage - 2) * pageSize),
                  search: searchTerm,
                });
              }}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage * pageSize >= totalCount}
              onClick={() => {
                setCurrentPage(currentPage + 1);
                fetchStaff({
                  limit: pageSize,
                  offset: (currentPage * pageSize),
                  search: searchTerm,
                });
              }}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}