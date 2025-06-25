"use client";

import { useAuth } from "@clerk/nextjs";
import { UserPlus } from "lucide-react";
import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useAuthContext } from "@/lib/auth/auth-context";
import { useUserManagement } from "@/hooks/use-user-management";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";

export default function CreateUserPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { hasPermission, userRole } = useAuthContext();
  const { canAssignRole } = useUserManagement();

  // Check if user has permission to create staff
  const canCreateStaff = hasPermission("staff:invite") || hasPermission("staff:write");

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "viewer",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check permission to access this page
  if (!canCreateStaff) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 space-y-6">
        <Shield className="w-16 h-16 text-red-500" />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-gray-600">
            You don't have permission to create staff members
          </p>
          <p className="text-sm text-gray-500 mt-2">Current role: {userRole}</p>
          <div className="mt-6">
            <Button onClick={() => router.push("/staff")} variant="outline">
              Back to Staff List
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.target.name === "role") {
      setForm({ ...form, [e.target.name]: e.target.value });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Get Clerk token for API authentication
      const token = await getToken({ template: "hasura" });
      
      // Call the API route which handles both Clerk invitation and database creation
      const response = await fetch("/api/staff/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          role: form.role,
          is_staff: true,
          inviteToClerk: true, // Send Clerk invitation
        }),
      });

      // Check if response is OK first
      if (!response.ok) {
        // Try to get error text, fallback to status text
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorText = await response.text();
          if (errorText) {
            // Try to parse as JSON for structured error
            try {
              const errorData = JSON.parse(errorText);
              errorMessage = errorData.error || errorData.details || errorMessage;
            } catch {
              // If not JSON, use the text as is
              errorMessage = errorText;
            }
          }
        } catch {
          // If we can't read the response, use the status
        }
        throw new Error(errorMessage);
      }

      // Parse JSON response
      let data;
      try {
        const responseText = await response.text();
        if (!responseText) {
          throw new Error("Empty response from server");
        }
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        throw new Error("Invalid response format from server");
      }

      toast.success(
        data.staffData?.invitationSent
          ? `Staff member created and invitation sent to ${form.email}!`
          : `Staff member ${form.firstName} ${form.lastName} created successfully!`
      );
      
      router.push("/staff");
    } catch (err: unknown) {
      console.error("Form submission error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to create staff member";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/staff">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Staff
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create New Staff Member</h1>
          <p className="text-muted-foreground">
            Add a new staff member to the system
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Staff Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  onValueChange={value => setForm({ ...form, role: value })}
                  defaultValue={form.role}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {canAssignRole("developer") && (
                      <SelectItem value="developer">Developer</SelectItem>
                    )}
                    {canAssignRole("org_admin") && (
                      <SelectItem value="org_admin">Admin</SelectItem>
                    )}
                    {canAssignRole("manager") && (
                      <SelectItem value="manager">Manager</SelectItem>
                    )}
                    {canAssignRole("consultant") && (
                      <SelectItem value="consultant">Consultant</SelectItem>
                    )}
                    {canAssignRole("viewer") && (
                      <SelectItem value="viewer">Viewer</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Creating..." : "Create Staff Member"}
                </Button>
                <Link href="/staff">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
