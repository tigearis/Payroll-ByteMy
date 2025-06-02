"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, User, Mail, Shield, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";

import {
  useUserManagement,
  User as UserType,
  Manager,
  UserPermissions,
} from "@/hooks/useUserManagement";

const editUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["admin", "org_admin", "manager", "consultant", "viewer"], {
    required_error: "Please select a role",
  }),
  managerId: z.string().optional(),
  isStaff: z.boolean(),
});

type EditUserFormData = z.infer<typeof editUserSchema>;

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateUser, canAssignRole } = useUserManagement();

  const form = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "viewer",
      managerId: "",
      isStaff: true,
    },
  });

  // Update form values when user changes
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        role: user.role,
        managerId: user.manager_id || "",
        isStaff: user.is_staff,
      });
    }
  }, [user, form]);

  const selectedRole = form.watch("role");

  const handleSubmit = async (data: EditUserFormData) => {
    if (!user) return;

    if (!permissions?.canManageUsers) {
      toast.error("You don't have permission to edit users");
      return;
    }

    if (!canAssignRole(data.role)) {
      toast.error(`You cannot assign the ${data.role} role`);
      return;
    }

    setIsSubmitting(true);
    try {
      const userData = {
        name: data.name,
        email: data.email,
        role: data.role,
        managerId: data.managerId || undefined,
        isStaff: data.isStaff,
      };

      const success = await updateUser(user.id, userData);
      if (success) {
        toast.success(`User ${data.name} updated successfully`);
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
    if (isSubmitting) return;
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
      value: "admin",
      label: "Administrator",
      description: "Full system access",
    },
  ].filter((role) => canAssignRole(role.value));

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
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
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter full name"
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
                        {roleOptions.map((role) => (
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
                        value={field.value}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a manager (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">No manager assigned</SelectItem>
                          {managers.map((manager) => (
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
                name="isStaff"
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
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update User
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
