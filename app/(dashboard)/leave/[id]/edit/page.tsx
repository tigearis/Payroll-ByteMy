"use client";

import {
  ArrowLeft,
  Calendar,
  FileText,
  User,
  Clock,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { PageHeader } from "@/components/patterns/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useToast } from "@/hooks/use-toast";
import {
  getRoleAndPositionDisplay,
  getRoleColor,
} from "@/lib/utils/role-utils";

interface LeaveRequest {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  leaveType: "Annual" | "Sick" | "Unpaid" | "Other";
  reason?: string;
  status: "Pending" | "Approved" | "Rejected";
  leaveUser: {
    id: string;
    firstName: string;
    lastName: string;
    computedName: string;
    email: string;
    role: string;
    position?: string;
    managerUser?: {
      id: string;
      firstName: string;
      lastName: string;
      computedName: string;
      email: string;
    } | null;
  };
  createdAt: string;
  updatedAt: string;
}

interface LeaveFormData {
  startDate: string;
  endDate: string;
  leaveType: "Annual" | "Sick" | "Unpaid" | "Other";
  reason: string;
}

interface LeaveFormErrors {
  startDate?: string;
  endDate?: string;
  leaveType?: string;
  reason?: string;
}

function EditLeaveRequestPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { currentUser, loading: userLoading } = useCurrentUser();
  const { toast } = useToast();

  const [leaveRequest, setLeaveRequest] = useState<LeaveRequest | null>(null);
  const [formData, setFormData] = useState<LeaveFormData>({
    startDate: "",
    endDate: "",
    leaveType: "Annual",
    reason: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<LeaveFormErrors>({});

  // Fetch leave request on mount
  useEffect(() => {
    const fetchLeaveRequest = async () => {
      try {
        const response = await fetch(`/api/leave/${params.id}`);
        const data = await response.json();

        if (data.success) {
          const leave = data.data.leave;
          setLeaveRequest(leave);
          setFormData({
            startDate: leave.startDate,
            endDate: leave.endDate,
            leaveType: leave.leaveType,
            reason: leave.reason || "",
          });
        } else {
          toast({
            title: "Error",
            description: data.error || "Failed to fetch leave request",
            variant: "destructive",
          });
          router.push("/leave");
        }
      } catch (error) {
        console.error("Error fetching leave request:", error);
        toast({
          title: "Error",
          description: "Failed to fetch leave request",
          variant: "destructive",
        });
        router.push("/leave");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequest();
  }, [params.id, router, toast]);

  // Check permissions
  const canEdit =
    leaveRequest &&
    ((leaveRequest.userId === currentUser?.id &&
      leaveRequest.status === "Pending") ||
      currentUser?.role === "manager" ||
      currentUser?.role === "org_admin" ||
      currentUser?.role === "developer");

  const canDelete =
    leaveRequest &&
    ((leaveRequest.userId === currentUser?.id &&
      leaveRequest.status === "Pending") ||
      currentUser?.role === "org_admin" ||
      currentUser?.role === "developer");

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: LeaveFormErrors = {};

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (startDate > endDate) {
        newErrors.endDate = "End date must be after start date";
      }

      // Only check past dates for pending requests
      if (leaveRequest?.status === "Pending") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (startDate < today) {
          newErrors.startDate = "Start date cannot be in the past";
        }
      }
    }

    if (!formData.leaveType) {
      newErrors.leaveType = "Leave type is required";
    }

    // Reason is required for certain leave types
    if (
      (formData.leaveType === "Other" || formData.leaveType === "Sick") &&
      !formData.reason.trim()
    ) {
      newErrors.reason = `Reason is required for ${formData.leaveType} leave`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !leaveRequest) {
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/leave/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Leave Request Updated",
          description: "Your leave request has been updated successfully.",
        });
        router.push("/leave");
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update leave request",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating leave request:", error);
      toast({
        title: "Error",
        description: "Failed to update leave request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!leaveRequest) return;

    setDeleting(true);

    try {
      const response = await fetch(`/api/leave/${params.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Leave Request Deleted",
          description: "Your leave request has been deleted successfully.",
        });
        router.push("/leave");
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete leave request",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting leave request:", error);
      toast({
        title: "Error",
        description: "Failed to delete leave request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof LeaveFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Calculate number of days
  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);

      if (start <= end) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
      }
    }
    return 0;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const days = calculateDays();

  if (loading || userLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!leaveRequest) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="p-12 text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Leave Request Not Found
            </h3>
            <p className="text-gray-500 mb-4">
              The leave request you're looking for doesn't exist.
            </p>
            <Link href="/leave">
              <Button>Back to Leave</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="p-12 text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Permission Denied</h3>
            <p className="text-gray-500 mb-4">
              You don't have permission to edit this leave request.
              {leaveRequest.status !== "Pending" &&
                " Only pending requests can be edited."}
            </p>
            <Link href="/leave">
              <Button>Back to Leave</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <PermissionGuard action="read">
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <PageHeader
          title="Edit Leave Request"
          description="Modify your leave request details"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Leave", href: "/leave" },
            { label: "Edit" },
          ]}
          metadata={[
            {
              label: "Status",
              value: (
                <Badge className={getStatusColor(leaveRequest.status)}>
                  {leaveRequest.status}
                </Badge>
              ) as any,
            },
            {
              label: "Duration",
              value: `${days} ${days === 1 ? "day" : "days"}`,
            },
          ]}
          actions={[
            { label: "Back to Leave", icon: ArrowLeft, href: "/leave" },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Leave Request Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Employee Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="employee">Employee</Label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-500" />
                            <div>
                              <p className="font-medium">
                                {leaveRequest.leaveUser.computedName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {leaveRequest.leaveUser.email}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className={`${getRoleColor(leaveRequest.leaveUser.role || "")} px-2 py-1`}
                          >
                            {getRoleAndPositionDisplay(
                              leaveRequest.leaveUser.role || "",
                              leaveRequest.leaveUser.position
                            )}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="leaveType">Leave Type *</Label>
                      <Select
                        value={formData.leaveType}
                        onValueChange={value =>
                          handleInputChange("leaveType", value)
                        }
                      >
                        <SelectTrigger
                          className={errors.leaveType ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Annual">Annual Leave</SelectItem>
                          <SelectItem value="Sick">Sick Leave</SelectItem>
                          <SelectItem value="Unpaid">Unpaid Leave</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.leaveType && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.leaveType}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={e =>
                            handleInputChange("startDate", e.target.value)
                          }
                          min={
                            leaveRequest.status === "Pending"
                              ? new Date().toISOString().split("T")[0]
                              : undefined
                          }
                          className={`pl-10 ${errors.startDate ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.startDate && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.startDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={e =>
                            handleInputChange("endDate", e.target.value)
                          }
                          min={
                            formData.startDate ||
                            (leaveRequest.status === "Pending"
                              ? new Date().toISOString().split("T")[0]
                              : undefined)
                          }
                          className={`pl-10 ${errors.endDate ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.endDate && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.endDate}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Duration Display */}
                  {days > 0 && (
                    <div className="p-3 bg-blue-50 rounded-md">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          Duration: {days} {days === 1 ? "day" : "days"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Reason */}
                  <div>
                    <Label htmlFor="reason">
                      Reason{" "}
                      {(formData.leaveType === "Other" ||
                        formData.leaveType === "Sick") &&
                        "*"}
                    </Label>
                    <Textarea
                      id="reason"
                      placeholder="Please provide a reason for your leave request..."
                      value={formData.reason}
                      onChange={e =>
                        handleInputChange("reason", e.target.value)
                      }
                      rows={4}
                      className={errors.reason ? "border-red-500" : ""}
                    />
                    {errors.reason && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.reason}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.leaveType === "Sick" &&
                        "Medical details may be required for sick leave over 3 days."}
                      {formData.leaveType === "Other" &&
                        "Please provide detailed explanation for other leave types."}
                      {formData.leaveType === "Annual" &&
                        "Optional: Specify vacation plans or coverage arrangements."}
                      {formData.leaveType === "Unpaid" &&
                        "Optional: Provide context for unpaid leave request."}
                    </p>
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                    <Link href="/leave">
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </Link>
                    <Button type="submit" disabled={saving}>
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* Request Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Request Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Status</span>
                    <Badge className={getStatusColor(leaveRequest.status)}>
                      {leaveRequest.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Created</span>
                    <span className="text-sm">
                      {new Date(leaveRequest.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Last Updated</span>
                    <span className="text-sm">
                      {new Date(leaveRequest.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Edit Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Only pending requests can be edited</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>
                      Past dates cannot be selected for pending requests
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Changes will reset approval status</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Your manager will be notified of changes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
}

export default EditLeaveRequestPage;
