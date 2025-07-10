"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Shield, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
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
import { getRoleDisplayName } from "@/lib/utils/role-utils";

const createUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["developer", "org_admin", "manager", "consultant", "viewer"], {
    required_error: "Please select a role",
  }),
  managerId: z.string().optional(),
  isStaff: z.boolean(),
  sendInvitation: z.boolean(),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export function CreateUserModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateUserModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [managers, setManagers] = useState<
    Array<{ id: string; name: string; email: string }>
  >([]);
  const [managersLoading, setManagersLoading] = useState(false);

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "viewer",
      managerId: "",
      isStaff: true,
      sendInvitation: true,
    },
  });

  // Load managers when modal opens
  useEffect(() => {
    if (isOpen && managers.length === 0) {
      loadManagers();
    }
  }, [isOpen, managers.length]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setIsSubmitting(false);
    }
  }, [isOpen, form]);

  const loadManagers = async () => {
    try {
      setManagersLoading(true);
      const response = await fetch(
        "/api/staff?roles=manager,org_admin,developer&limit=100"
      );
      const data = await response.json();

      if (data.success && data.data?.users) {
        setManagers(
          data.data.users.map((user: any) => ({
            id: user.id,
            name: user.name,
            email: user.email,
          }))
        );
      }
    } catch (error) {
      console.warn("Failed to load managers:", error);
    } finally {
      setManagersLoading(false);
    }
  };

  const createUser = async (userData: CreateUserFormData) => {
    const response = await fetch("/api/staff/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        managerId:
          userData.managerId && userData.managerId !== "none"
            ? userData.managerId
            : undefined,
        isStaff: userData.isStaff,
        sendInvitation: userData.sendInvitation,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to create user");
    }

    return result;
  };

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      setIsSubmitting(true);

      const result = await createUser(data);

      if (result.success) {
        if (result.invitationSent) {
          toast.success("Invitation sent successfully", {
            description: `${data.firstName} ${data.lastName} will receive an invitation email to join.`,
          });
        } else {
          toast.success("User created successfully", {
            description: `${data.firstName} ${data.lastName} has been added to your team.`,
          });
        }
        onClose();
        onSuccess?.();
      } else {
        toast.error("Failed to create user", {
          description: result.error || "Please try again.",
        });
      }
    } catch (error: any) {
      console.error("User creation error:", error);
      toast.error("Failed to create user", {
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedRole = form.watch("role");
  const sendInvitation = form.watch("sendInvitation");
  const RoleIcon = ROLE_ICONS[selectedRole as keyof typeof ROLE_ICONS] || User;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Add New Team Member
          </DialogTitle>
          <DialogDescription>
            Add a new team member to your organization.{" "}
            {sendInvitation
              ? "They will receive an invitation email to join."
              : "The user will be created without an invitation."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
                        ([role]) => {
                          const Icon =
                            ROLE_ICONS[role as keyof typeof ROLE_ICONS];
                          return (
                            <SelectItem key={role} value={role}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4 text-muted-foreground" />
                                <div className="font-medium">
                                  {getRoleDisplayName(role)}
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
                    defaultValue={field.value || ""}
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
                      <SelectItem value="none">No manager</SelectItem>
                      {managers.map(manager => (
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

            <FormField
              control={form.control}
              name="isStaff"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2">
                  <div className="space-y-0.5">
                    <FormLabel>Staff Member</FormLabel>
                    <FormDescription>
                      Staff members have access to internal systems and
                      workflows.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sendInvitation"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2">
                  <div className="space-y-0.5">
                    <FormLabel>Send Email Invitation</FormLabel>
                    <FormDescription>
                      Send an invitation email to the user to join the platform.
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <ByteMySpinner size="sm" className="mr-2" />}
                {sendInvitation ? "Send Invitation" : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
