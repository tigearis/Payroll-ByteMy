"use client";

import { useState } from "react";
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
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TableLoading } from "@/components/ui/loading-states";
import { toast } from "sonner";

import {
  User,
  UserPermissions,
  useUserManagement,
} from "@/hooks/useUserManagement";

interface UserTableProps {
  users: User[];
  loading: boolean;
  onEditUser: (userId: string) => void;
  currentUserRole: string | null;
  permissions: UserPermissions | null;
}

export function UserTable({
  users,
  loading,
  onEditUser,
  currentUserRole,
  permissions,
}: UserTableProps) {
  const { userId } = useAuth(); // Get current user's Clerk ID
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { deleteUser, canEditUser, canDeleteUser } = useUserManagement();

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
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
      case "admin":
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
    if (!canDeleteUser(user)) {
      toast.error("You don't have permission to delete this user");
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      const success = await deleteUser(user.id);
      if (success) {
        toast.success(`${user.name} has been deleted`);
      }
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  // Helper function to check if user is trying to delete themselves
  const isCurrentUser = (user: User): boolean => {
    return user.clerk_user_id === userId;
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
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        user.imageUrl ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
                      }
                    />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
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
                {user.manager ? (
                  <div className="text-sm">
                    <div className="font-medium">{user.manager.name}</div>
                    <div className="text-muted-foreground">
                      {user.manager.email}
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
                      user.is_staff ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                  <Badge variant={user.is_staff ? "default" : "secondary"}>
                    {user.is_staff ? "Active" : "Inactive"}
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
                  {formatDate(user.created_at)}
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
                      `https://api.dicebear.com/7.x/initials/svg?seed=${selectedUser.name}`
                    }
                  />
                  <AvatarFallback className="text-lg">
                    {selectedUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                  <p className="text-muted-foreground">
                    {selectedUser.role.charAt(0).toUpperCase() +
                      selectedUser.role.slice(1)}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        selectedUser.is_staff ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                    <Badge
                      variant={selectedUser.is_staff ? "default" : "secondary"}
                    >
                      {selectedUser.is_staff ? "Active" : "Inactive"}
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
                      Joined {formatDate(selectedUser.created_at)}
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
                      {selectedUser.clerk_user_id ? (
                        <Badge variant="default">Connected</Badge>
                      ) : (
                        <Badge variant="destructive">Not Connected</Badge>
                      )}
                    </div>
                    {selectedUser.clerk_user_id && (
                      <div className="text-xs text-muted-foreground">
                        ID: {selectedUser.clerk_user_id}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedUser.manager && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Manager</h4>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {selectedUser.manager.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">
                        {selectedUser.manager.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {selectedUser.manager.email}
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
                      {selectedUser.subordinates.map((subordinate) => (
                        <div
                          key={subordinate.id}
                          className="flex items-center space-x-2"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {subordinate.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">
                              {subordinate.name}
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
