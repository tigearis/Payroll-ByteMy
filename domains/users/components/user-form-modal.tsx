// @ts-nocheck
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User, Mail, Shield, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

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
import {
  useUserManagement,
  User as UserType,
  Manager,
} from "@/hooks/use-user-management";

// Schema for both create and edit modes
const createUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["developer", "org_admin", "manager", "consultant", "viewer"], {
    required_error: "Please select a role",
  }),
  managerId: z.string().optional(),
});

const editUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["developer", "org_admin", "manager", "consultant", "viewer"], {
    required_error: "Please select a role",
  }),
  managerId: z.string().optional(),
  isStaff: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;
type EditUserFormData = z.infer<typeof editUserSchema>;

interface UserFormModalProps {
  mode: "create" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: UserType; // Only provided in edit mode
  onSuccess?: () => void;
}

// Role descriptions
const ROLE_DESCRIPTIONS = {
  developer:
    "Full system access including developer tools and system administration",
  org_admin:
    "Organization-wide administration with user and system management capabilities",
  manager:
    "Team management with staff oversight and payroll processing authority",
  consultant:
    "Payroll processing and client management with limited administrative access",
  viewer: "Read-only access to view data and reports",
};

// Role icons
const ROLE_ICONS = {
  developer: Shield,
  org_admin: Shield,
  manager: Users,
  consultant: User,
  viewer: User,
};

// @ts-nocheck
export function UserFormModal({
  mode,
  open,
  onOpenChange,
  user,
  onSuccess,
}: UserFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    managers,
    permissions,
    createUser,
    updateUser,
    loading: managersLoading,
  } = useUserManagement();

  // Use appropriate schema based on mode
  const schema = mode === "create" ? createUserSchema : editUserSchema;

  const form = useForm({
    // @ts-ignore - Complex union type issue with zodResolver
    resolver: zodResolver(schema),
    // @ts-ignore
    defaultValues:
      mode === "create"
        ? {
            firstName: "",
            lastName: "",
            email: "",
            role: "viewer",
            managerId: "",
          }
        : {
            name: user?.name || "",
            email: user?.email || "",
            role: user?.role || "viewer",
            managerId: user?.manager?.id || "",
            isStaff: user?.is_staff || false,
            isActive: user?.lastSignIn ? true : false,
          },
  });

  // Reset form when user changes (for edit mode)
  useEffect(() => {
    if (mode === "edit" && user) {
      form.reset({
        name: user.name,
        email: user.email,
        role: user.role,
        managerId: user.manager?.id || "",
        isStaff: user.is_staff,
        isActive: user.lastSignIn ? true : false,
      });
    }
  }, [mode, user, form]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      form.reset();
      setIsSubmitting(false);
    }
  }, [open, form]);

  const onSubmit = async (data: CreateUserFormData | EditUserFormData) => {
    try {
      setIsSubmitting(true);

      if (mode === "create") {
        const createData = data as CreateUserFormData;
        const result = await createUser({
          email: createData.email,
          firstName: createData.firstName,
          lastName: createData.lastName,
          role: createData.role,
          managerId: createData.managerId || undefined,
        });

        if (result.success) {
          toast.success("User created successfully", {
            description: `${createData.firstName} ${createData.lastName} has been added to your team.`,
          });
          onOpenChange(false);
          onSuccess?.();
        } else {
          toast.error("Failed to create user", {
            description: result.error || "Please try again.",
          });
        }
      } else {
        // Edit mode
        const editData = data as EditUserFormData;
        if (!user) return;

        const result = await updateUser(user.id, {
          name: editData.name,
          email: editData.email,
          role: editData.role,
          managerId: editData.managerId || undefined,
          isStaff: editData.isStaff,
        });

        if (result.success) {
          toast.success("User updated successfully", {
            description: `${editData.name}'s information has been updated.`,
          });
          onOpenChange(false);
          onSuccess?.();
        } else {
          toast.error("Failed to update user", {
            description: result.error || "Please try again.",
          });
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An unexpected error occurred", {
        description: "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedRole = form.watch("role");
  const RoleIcon = ROLE_ICONS[selectedRole as keyof typeof ROLE_ICONS] || User;

  // Check permissions for form interactions
  const canManageUsers = permissions?.canManageUsers || false;
  const canInviteUsers = permissions?.canCreate || false;

  if (!canManageUsers && !canInviteUsers) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {mode === "create" ? "Add New Team Member" : `Edit ${user?.name}`}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new team member to your organization. They will receive an invitation email to join."
              : "Update the team member's information and permissions."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {mode === "create" ? (
              // Create mode: First name and last name
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
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
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              // Edit mode: Full name
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
                        type="email"
                        placeholder="john.doe@company.com"
                        className="pl-10"
                        {...field}
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
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <div className="flex items-center gap-2">
                          <RoleIcon className="h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Select a role" />
                        </div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(ROLE_DESCRIPTIONS).map(
                        ([role, description]) => {
                          const Icon =
                            ROLE_ICONS[role as keyof typeof ROLE_ICONS];
                          return (
                            <SelectItem key={role} value={role}>
                              <div className="flex items-start gap-3">
                                <Icon className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                <div>
                                  <div className="font-medium capitalize">
                                    {role.replace("_", " ")}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {description}
                                  </div>
                                </div>
                              </div>
                            </SelectItem>
                          );
                        }
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {
                      ROLE_DESCRIPTIONS[
                        selectedRole as keyof typeof ROLE_DESCRIPTIONS
                      ]
                    }
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="managerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manager (Optional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={managersLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Select a manager" />
                        </div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">No manager</SelectItem>
                      {managers.map((manager: Manager) => (
                        <SelectItem key={manager.id} value={manager.id}>
                          <div>
                            <div className="font-medium">{manager.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {manager.email}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select a manager for this team member (optional).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mode === "edit" && (
              <div className="space-y-4 border-t pt-4">
                <FormField
                  control={form.control}
                  name="isStaff"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Staff Member</FormLabel>
                        <FormDescription>
                          Staff members have access to internal systems and
                          workflows.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Active User</FormLabel>
                        <FormDescription>
                          Active users can sign in and access the system.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {mode === "create" ? "Add Team Member" : "Update User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default UserFormModal;
