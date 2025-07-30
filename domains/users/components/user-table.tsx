"use client";

import { useAuth } from "@clerk/nextjs";
import {
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Shield,
  Mail,
  Calendar,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableLoading } from "@/components/ui/loading-states";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@/domains/users/types";
import { deleteUser, canEditUser, canDeleteUser } from "@/domains/users/services/user-management";

interface UserTableProps {
  users: User[];
  loading: boolean;
  onEditUser: (userId: string) => void;
  currentUserRole: string | null;
}

export function UserTable({
  users,
  loading,
  onEditUser,
  currentUserRole,
}: UserTableProps) {
  const { userId } = useAuth(); // Get current user's Clerk ID
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "developer":
        return "destructive";
      case "manager":
        return "default";
      case "consultant":
        return "secondary";
      case "viewer":
        return "outline";
      default:
        return "outline";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "developer":
        return "#ef4444";
      case "manager":
        return "#f59e0b";
      case "consultant":
        return "#10b981";
      case "viewer":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleDeleteUser = async (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.computedName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'this user'}?`)) {
      const success = await deleteUser(user.id);
      if (success) {
        toast.success(`${user.computedName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'} has been deleted`);
      }
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  // Helper function to check if user is trying to delete themselves
  const isCurrentUser = (user: User): boolean => {
    return user.clerkUserId === userId;
  };

  if (loading) {
    return <TableLoading />;
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No users found</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        user.imageUrl ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${user.computedName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User'}`
                      }
                    />
                    <AvatarFallback>
                      {(user.computedName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User')
                        .split(" ")
                        .map(n => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.computedName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User'}</div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {user.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  <div
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: getRoleColor(user.role) }}
                  />
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                {user.managerUser ? (
                  <div className="text-sm">
                    <div className="font-medium">{user.managerUser.computedName || `${user.managerUser.firstName || ''} ${user.managerUser.lastName || ''}`.trim() || 'Unknown User'}</div>
                    <div className="text-muted-foreground">
                      {user.managerUser.email}
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground">No manager</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      user.isStaff ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                  <Badge variant={user.isStaff ? "default" : "secondary"}>
                    {user.isStaff ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm flex items-center text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {user.lastSignIn ? formatDate(user.lastSignIn) : "Never"}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm flex items-center text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {user.createdAt ? formatDate(user.createdAt) : "-"}
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleViewUser(user)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    {canEditUser(user) && (
                      <DropdownMenuItem onClick={() => onEditUser(user.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit User
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {canDeleteUser(user) && (
                      <DropdownMenuItem
                        className={
                          isCurrentUser(user)
                            ? "text-muted-foreground cursor-not-allowed"
                            : "text-destructive"
                        }
                        onClick={() => {
                          if (!isCurrentUser(user)) {
                            handleDeleteUser(user);
                          } else {
                            toast.error("You cannot delete your own account");
                          }
                        }}
                        disabled={isCurrentUser(user)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {isCurrentUser(user)
                          ? "Cannot delete yourself"
                          : "Delete User"}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* User Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={
                      selectedUser.imageUrl ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${selectedUser.computedName || `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim() || 'Unknown User'}`
                    }
                  />
                  <AvatarFallback className="text-lg">
                    {(selectedUser.computedName || `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim() || 'Unknown User')
                      .split(" ")
                      .map(n => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.computedName || `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim() || 'Unknown User'}</h3>
                  <p className="text-muted-foreground">
                    {selectedUser.role.charAt(0).toUpperCase() +
                      selectedUser.role.slice(1)}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        selectedUser.isStaff ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                    <Badge
                      variant={selectedUser.isStaff ? "default" : "secondary"}
                    >
                      {selectedUser.isStaff ? "Active" : "Inactive"}
                    </Badge>
                    {selectedUser.emailVerified && (
                      <Badge variant="outline">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Contact Information</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      {selectedUser.email}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Account Information</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Joined{" "}
                      {selectedUser.createdAt
                        ? formatDate(selectedUser.createdAt)
                        : "Unknown"}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      Last active{" "}
                      {selectedUser.lastSignIn
                        ? formatDate(selectedUser.lastSignIn)
                        : "Never"}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Clerk Account</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      {selectedUser.clerkUserId ? (
                        <Badge variant="default">Connected</Badge>
                      ) : (
                        <Badge variant="destructive">Not Connected</Badge>
                      )}
                    </div>
                    {selectedUser.clerkUserId && (
                      <div className="text-xs text-muted-foreground">
                        ID: {selectedUser.clerkUserId}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedUser.managerUser && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Manager</h4>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {selectedUser.managerUser.name
                          .split(" ")
                          .map(n => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">
                        {selectedUser.managerUser.computedName || `${selectedUser.managerUser.firstName || ''} ${selectedUser.managerUser.lastName || ''}`.trim() || 'Unknown User'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {selectedUser.managerUser.email}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedUser.subordinates &&
                selectedUser.subordinates.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Direct Reports</h4>
                    <div className="space-y-2">
                      {selectedUser.subordinates.map(subordinate => (
                        <div
                          key={subordinate.id}
                          className="flex items-center space-x-2"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {subordinate.name
                                .split(" ")
                                .map(n => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">
                              {subordinate.computedName || `${subordinate.firstName || ''} ${subordinate.lastName || ''}`.trim() || 'Unknown User'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {subordinate.role.charAt(0).toUpperCase() +
                                subordinate.role.slice(1)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Modal Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex space-x-2">
                  {canEditUser(selectedUser) && (
                    <Button
                      onClick={() => {
                        setIsViewModalOpen(false);
                        onEditUser(selectedUser.id);
                      }}
                      size="sm"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit User
                    </Button>
                  )}

                  {canDeleteUser(selectedUser) && (
                    <Button
                      variant={
                        isCurrentUser(selectedUser)
                          ? "secondary"
                          : "destructive"
                      }
                      size="sm"
                      disabled={isCurrentUser(selectedUser)}
                      onClick={() => {
                        if (!isCurrentUser(selectedUser)) {
                          setIsViewModalOpen(false);
                          handleDeleteUser(selectedUser);
                        } else {
                          toast.error("You cannot delete your own account");
                        }
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {isCurrentUser(selectedUser)
                        ? "Cannot Delete Self"
                        : "Delete User"}
                    </Button>
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
