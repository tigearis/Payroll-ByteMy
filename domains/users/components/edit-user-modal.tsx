"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Shield, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { Button } from "@/components/ui/button";
import { ByteMySpinner } from "@/components/ui/bytemy-loading-icon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Manager, UserPermissions } from "@/domains/users/types";
import { useUserManagement } from "@/hooks/use-user-management";
import { UserSchemas } from "@/lib/validation/shared-schemas";
import { Users as UsersType } from "@/shared/types/generated/graphql";

// Use shared schema for consistency
const editUserSchema = UserSchemas.updateUser;

type EditUserFormData = z.infer<typeof editUserSchema>;

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UsersType | null;
  managers: Manager[];
  permissions: UserPermissions | null;
  currentUserRole: string | null;
}

export function EditUserModal({
  isOpen,
  onClose,
  user,
  managers,
  permissions,
  currentUserRole,
}: EditUserModalProps) {
  return (
    <PermissionGuard action="update">
      <EditUserModalInner
        isOpen={isOpen}
        onClose={onClose}
        user={user}
        managers={managers}
        permissions={permissions}
        currentUserRole={currentUserRole}
      />
    </PermissionGuard>
  );
}

function EditUserModalInner({
  isOpen,
  onClose,
  user,
  managers,
  permissions,
  currentUserRole,
}: EditUserModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateUser, canManageRoles } = useUserManagement();

  const form = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "viewer",
      managerId: "",
      isActive: true,
    },
  });

  // Update form values when user changes
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        role:
          (user.role as
            | "manager"
            | "developer"
            | "org_admin"
            | "consultant"
            | "viewer") || "viewer",
        managerId: (user as any).managerId || "",
        isActive: (user as any).isActive ?? true,
      });
    }
  }, [user, form]);

  const selectedRole = form.watch("role");

  const handleSubmit = async (data: EditUserFormData) => {
    if (!user) {
      return;
    }

    if (!permissions?.canManageUsers) {
      toast.error("You don't have permission to edit users");
      return;
    }

    if (!canManageRoles) {
      toast.error(`You cannot assign the ${data.role} role`);
      return;
    }

    setIsSubmitting(true);
    try {
      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        managerId:
          data.managerId && data.managerId !== "none" ? data.managerId : "",
        isActive: data.isActive,
      } as any;

      const success = await updateUser(user.id, userData);
      if (success) {
        toast.success(
          `User ${data.firstName} ${data.lastName} updated successfully`
        );
        onClose();
      }
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Failed to update user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }
    onClose();
  };

  const roleOptions = [
    { value: "viewer", label: "Viewer", description: "Read-only access" },
    {
      value: "consultant",
      label: "Consultant",
      description: "Can manage clients and payrolls",
    },
    {
      value: "manager",
      label: "Manager",
      description: "Can manage staff and oversee operations",
    },
    {
      value: "org_admin",
      label: "Organization Admin",
      description: "Full organizational access",
    },
    {
      value: "developer",
      label: "Developer",
      description: "Full system access and development",
    },
  ].filter(role => canManageRoles);

  if (!user) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit User
          </DialogTitle>
          <DialogDescription>
            Update user information and permissions.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter first name"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter last name"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Enter email address"
                          className="pl-10"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Role
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roleOptions.map(role => (
                          <SelectItem key={role.value} value={role.value}>
                            <div className="flex flex-col">
                              <span className="font-medium">{role.label}</span>
                              <span className="text-xs text-muted-foreground">
                                {role.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {(selectedRole === "consultant" || selectedRole === "viewer") && (
                <FormField
                  control={form.control}
                  name="managerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Manager
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a manager (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">
                            No manager assigned
                          </SelectItem>
                          {managers.map(manager => (
                            <SelectItem key={manager.id} value={manager.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {manager.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {manager.email}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Assign a manager to oversee this user
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active User</FormLabel>
                      <FormDescription>
                        User can access the system and perform their assigned
                        tasks
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <ByteMySpinner size="sm" className="mr-2" />}
                Update User
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
