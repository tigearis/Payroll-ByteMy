"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User, Mail, Shield, Users } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  useUserManagement,
  Manager,
  UserPermissions,
} from "@/hooks/use-user-management";

const createUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["developer", "org_admin", "manager", "consultant", "viewer"], {
    required_error: "Please select a role",
  }),
  managerId: z.string().optional(),
  isStaff: z.boolean(),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  managers: Manager[];
  permissions: UserPermissions | null;
  currentUserRole: string | null;
}

export function CreateUserModal({
  isOpen,
  onClose,
  managers,
  permissions,
  currentUserRole,
}: CreateUserModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { canAssignRole, refetchUsers } = useUserManagement();
  const { getToken } = useAuth();

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "viewer",
      managerId: "none",
      isStaff: true,
    },
  });

  const selectedRole = form.watch("role");

  const handleSubmit = async (data: CreateUserFormData) => {
    if (!permissions?.canCreate) {
      toast.error("You don't have permission to create users");
      return;
    }

    if (!canAssignRole(data.role)) {
      toast.error(`You cannot assign the ${data.role} role`);
      return;
    }

    setIsSubmitting(true);

    console.log("🚀 Starting user creation process...");
    console.log("📋 Form data:", {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: data.role,
      isStaff: data.isStaff,
      managerId: data.managerId,
    });

    try {
      // Get Clerk token for API authentication with refresh leeway
      console.log("🔑 Getting Clerk token...");
      const token = await getToken({
        template: "hasura",
        leewayInSeconds: 60, // Request fresh token 60 seconds before expiry
      });

      console.log("🔑 Token status:", {
        hasToken: !!token,
        tokenLength: token?.length,
        tokenPrefix: token?.substring(0, 20) + "...",
      });

      if (!token) {
        console.error("❌ No authentication token available");
        toast.error(
          "Authentication token not available. Please refresh and try again."
        );
        return;
      }

      const requestBody = {
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        role: data.role,
        isStaff: data.isStaff,
        managerId:
          data.managerId && data.managerId !== "none" ? data.managerId : null,
        inviteToClerk: true, // Send Clerk invitation
      };

      console.log("📤 Request details:", {
        url: "/api/staff/create",
        method: "POST",
        hasAuthHeader: !!token,
        bodyKeys: Object.keys(requestBody),
        body: requestBody,
      });

      // Call the API route which handles both Clerk invitation and database creation
      const response = await fetch("/api/staff/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📥 Response status:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
      });

      // Check if response is OK first
      if (!response.ok) {
        console.error(
          "❌ Response not OK:",
          response.status,
          response.statusText
        );

        // Try to get error text, fallback to status text
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        let errorDetails = null;

        try {
          const errorText = await response.text();
          console.log("📥 Error response body:", errorText);

          if (errorText) {
            // Try to parse as JSON for structured error
            try {
              const errorData = JSON.parse(errorText);
              console.log("📥 Parsed error data:", errorData);
              errorMessage =
                errorData.error || errorData.details || errorMessage;
              errorDetails = errorData;
            } catch (parseError) {
              console.log("📥 Error text (not JSON):", errorText);
              // If not JSON, use the text as is
              errorMessage = errorText;
            }
          }
        } catch (readError) {
          console.error("❌ Failed to read error response:", readError);
          // If we can't read the response, use the status
        }

        // Special handling for 405 Method Not Allowed
        if (response.status === 405) {
          console.error(
            "🚫 405 Method Not Allowed - Route may not support POST or middleware issue"
          );
          errorMessage =
            "Method not allowed. Check if the API route supports POST requests.";
        }

        throw new Error(errorMessage);
      }

      // Parse JSON response
      let responseData;
      try {
        const responseText = await response.text();
        console.log("📥 Success response body:", responseText);

        if (!responseText) {
          throw new Error("Empty response from server");
        }
        responseData = JSON.parse(responseText);
        console.log("📥 Parsed success data:", responseData);
      } catch (parseError) {
        console.error("❌ JSON parsing error:", parseError);
        throw new Error("Invalid response format from server");
      }

      toast.success(
        responseData.staffData?.invitationSent
          ? `Staff member created and invitation sent to ${data.email}!`
          : `Staff member ${data.firstName} ${data.lastName} created successfully!`
      );

      // Refresh the staff list
      await refetchUsers();

      form.reset();
      onClose();
    } catch (error) {
      console.error("❌ Failed to create user:", error);
      console.error("❌ Error details:", {
        name: error instanceof Error ? error.name : "Unknown",
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : "No stack trace",
      });

      const errorMessage =
        error instanceof Error ? error.message : "Failed to create user";
      toast.error(`User creation failed: ${errorMessage}`);
    } finally {
      console.log("🏁 User creation process finished");
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }
    form.reset();
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
      label: "Admin",
      description: "Full organizational access",
    },
    {
      value: "developer",
      label: "Developer",
      description: "Full system access and development",
    },
  ].filter(role => canAssignRole(role.value));

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Create New User
          </DialogTitle>
          <DialogDescription>
            Add a new user to the system. They will receive an invitation email
            to set up their account.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
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
                      defaultValue={field.value}
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

              <FormField
                control={form.control}
                name="isStaff"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-medium">
                        Staff Member
                      </FormLabel>
                      <FormDescription className="text-sm text-muted-foreground">
                        Mark this user as a staff member. Staff members have
                        additional privileges and can be assigned to manage
                        clients and payrolls.
                      </FormDescription>
                    </div>
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
                        defaultValue={field.value || "none"}
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
                Create User
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
