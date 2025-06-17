"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@apollo/client";
import { CREATE_STAFF_DIRECT } from "@/graphql/mutations/staff/createStaffDirect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { ArrowLeft } from "lucide-react";

export default function CreateUserPage() {
  const router = useRouter();
  const { getToken } = useAuth();

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "viewer",
  });

  const [error, setError] = useState("");

  // Use GraphQL mutation directly (like payrolls do)
  const [createStaff, { loading }] = useMutation(CREATE_STAFF_DIRECT, {
    onCompleted: (data) => {
      toast.success(
        `Staff member ${form.firstName} ${form.lastName} created successfully!`
      );
      router.push("/staff");
    },
    onError: (error) => {
      console.error('Staff creation error:', error);
      const errorMessage = error.message || "Failed to create staff member";
      setError(errorMessage);
      toast.error(`Failed to create staff member: ${errorMessage}`);
    }
  });

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

    try {
      // Use GraphQL mutation directly (same pattern as payrolls)
      await createStaff({
        variables: {
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          role: form.role,
          isStaff: true
        }
      });
    } catch (err: unknown) {
      // Error handling is done in the onError callback
      console.error('Form submission error:', err);
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
                  onValueChange={(value) => setForm({ ...form, role: value })}
                  defaultValue={form.role}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="org_admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="consultant">Consultant</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
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
