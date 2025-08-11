"use client";

import { useQuery } from "@apollo/client";
import {
  ArrowLeft,
  Calendar,
  FileText,
  User,
  Clock,
  AlertTriangle,
  Users,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  GetManagerTeamForLeaveDocument,
  GetAllUsersForLeaveDocument,
  type GetManagerTeamForLeaveQuery,
  type GetAllUsersForLeaveQuery,
} from "@/domains/leave/graphql/generated/graphql";
import { useCurrentUser } from "@/hooks/use-current-user";
import { usePermissions } from "@/hooks/use-permissions";
import { useToast } from "@/hooks/use-toast";

interface LeaveFormData {
  startDate: string;
  endDate: string;
  leaveType: "Annual" | "Sick" | "Unpaid" | "Other" | "";
  reason: string;
  selectedEmployeeId: string;
  isForSomeoneElse: boolean;
  autoApprove: boolean;
}

interface LeaveFormErrors {
  startDate?: string;
  endDate?: string;
  leaveType?: string;
  reason?: string;
  selectedEmployeeId?: string;
  isForSomeoneElse?: string;
}

function NewLeaveRequestPage() {
  const router = useRouter();
  const { currentUser, loading: userLoading } = useCurrentUser();
  const { can, canAny } = usePermissions();
  const { toast } = useToast();

  const [formData, setFormData] = useState<LeaveFormData>({
    startDate: "",
    endDate: "",
    leaveType: "",
    reason: "",
    selectedEmployeeId: "",
    isForSomeoneElse: false,
    autoApprove: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<LeaveFormErrors>({});

  // Check if user can manage team leave (manager and above)
  // Simplified check - just use role hierarchy for now
  const canManageTeamLeave =
    currentUser?.role &&
    ["manager", "org_admin", "developer"].includes(currentUser.role);
  const isDeveloperOrAdmin =
    currentUser?.role && ["developer", "org_admin"].includes(currentUser.role);

  // Query for subordinate users - use different query based on role
  const {
    data: managerTeamData,
    loading: managerTeamLoading,
    error: managerTeamError,
  } = useQuery<GetManagerTeamForLeaveQuery>(GetManagerTeamForLeaveDocument, {
    variables: { managerId: currentUser?.id! },
    skip: !currentUser?.id || !canManageTeamLeave || isDeveloperOrAdmin,
  });

  // Query for all users (developers and org admins only)
  const {
    data: allUsersData,
    loading: allUsersLoading,
    error: allUsersError,
  } = useQuery<GetAllUsersForLeaveQuery>(GetAllUsersForLeaveDocument, {
    skip: !currentUser?.id || !isDeveloperOrAdmin,
  });

  // Use appropriate data based on role
  const teamData = isDeveloperOrAdmin ? allUsersData : managerTeamData;
  const teamLoading = isDeveloperOrAdmin ? allUsersLoading : managerTeamLoading;
  const teamError = isDeveloperOrAdmin ? allUsersError : managerTeamError;
  // Filter out current user from the list
  const subordinateUsers = (teamData?.users || []).filter(
    user => user.id !== currentUser?.id
  );

  // Debug logging
  console.log("Leave Page Debug:", {
    currentUser: currentUser,
    userRole: currentUser?.role,
    canManageTeamLeave,
    isDeveloperOrAdmin,
    subordinateUsersCount: subordinateUsers.length,
    subordinateUsers,
    teamDataRaw: teamData,
    allUsersData,
    managerTeamData,
    teamLoading,
    teamError,
    skipManagerQuery:
      !currentUser?.id || !canManageTeamLeave || isDeveloperOrAdmin,
    skipAllUsersQuery: !currentUser?.id || !isDeveloperOrAdmin,
  });

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

      // Check if dates are in the past (allow today)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate < today) {
        newErrors.startDate = "Start date cannot be in the past";
      }
    }

    if (!formData.leaveType) {
      newErrors.leaveType = "Leave type is required";
    }

    // Validate employee selection for managers
    if (formData.isForSomeoneElse && !formData.selectedEmployeeId) {
      newErrors.selectedEmployeeId = "Employee selection is required";
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

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const targetUserId = formData.isForSomeoneElse
        ? formData.selectedEmployeeId
        : currentUser?.id;
      const selectedEmployee = subordinateUsers.find(
        u => u.id === formData.selectedEmployeeId
      );

      const response = await fetch("/api/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: targetUserId,
          isForSomeoneElse: formData.isForSomeoneElse,
          managerCreateRequest: formData.isForSomeoneElse,
          managerId: currentUser?.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const requestType = formData.isForSomeoneElse ? "for" : "submitted";
        const employeeName = formData.isForSomeoneElse
          ? selectedEmployee?.computedName ||
            `${selectedEmployee?.firstName} ${selectedEmployee?.lastName}`.trim()
          : "your";
        const statusText = formData.autoApprove
          ? "has been approved"
          : "is pending approval";

        toast({
          title: "Leave Request Created",
          description: `Leave request ${requestType} ${employeeName} ${statusText}.`,
        });
        router.push("/leave");
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to submit leave request",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting leave request:", error);
      toast({
        title: "Error",
        description: "Failed to submit leave request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof LeaveFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field as keyof LeaveFormErrors]) {
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

  const days = calculateDays();

  if (userLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="p-12 text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Authentication Required
            </h3>
            <p className="text-gray-500">
              You must be signed in to request leave.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Request Leave"
        description="Submit a new leave request for approval"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Leave", href: "/leave" },
          { label: "New" },
        ]}
        actions={[{ label: "Back to Leave", icon: ArrowLeft, href: "/leave" }]}
      />

      <PermissionGuard
        resource="leave"
        action="create"
        fallback={
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive">
            You do not have permission to create leave requests.
          </div>
        }
      >
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
                  {/* Manager Controls */}
                  {canManageTeamLeave &&
                    (teamLoading ? (
                      <div className="p-4 bg-gray-50 rounded-lg animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ) : subordinateUsers.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                          <Users className="h-5 w-5 text-blue-600" />
                          <div className="flex-1">
                            <h4 className="font-medium text-blue-900">
                              Manager Options
                            </h4>
                            <p className="text-sm text-blue-700">
                              You can create leave requests for your team
                              members
                            </p>
                          </div>
                          <Switch
                            checked={formData.isForSomeoneElse}
                            onCheckedChange={checked =>
                              setFormData(prev => ({
                                ...prev,
                                isForSomeoneElse: checked,
                                selectedEmployeeId: checked
                                  ? ""
                                  : prev.selectedEmployeeId,
                              }))
                            }
                          />
                        </div>

                        {formData.isForSomeoneElse && (
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="employeeSelect">
                                Select Employee *
                              </Label>
                              <Select
                                value={formData.selectedEmployeeId}
                                onValueChange={value =>
                                  handleInputChange("selectedEmployeeId", value)
                                }
                              >
                                <SelectTrigger
                                  className={
                                    errors.selectedEmployeeId
                                      ? "border-red-500"
                                      : ""
                                  }
                                >
                                  <SelectValue placeholder="Choose an employee" />
                                </SelectTrigger>
                                <SelectContent>
                                  {subordinateUsers.map(user => (
                                    <SelectItem key={user.id} value={user.id}>
                                      <div className="flex items-center space-x-2">
                                        <span>
                                          {user.computedName ||
                                            `${user.firstName} ${user.lastName}`.trim()}
                                        </span>
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {user.role}
                                        </Badge>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {errors.selectedEmployeeId && (
                                <p className="text-sm text-red-600 mt-1">
                                  {errors.selectedEmployeeId}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-md">
                              <Check className="h-4 w-4 text-green-600" />
                              <div className="flex-1">
                                <Label
                                  htmlFor="autoApprove"
                                  className="font-medium text-green-900"
                                >
                                  Auto-approve this request
                                </Label>
                                <p className="text-sm text-green-700">
                                  Approve immediately instead of requiring
                                  approval
                                </p>
                              </div>
                              <Switch
                                id="autoApprove"
                                checked={formData.autoApprove}
                                onCheckedChange={checked =>
                                  setFormData(prev => ({
                                    ...prev,
                                    autoApprove: checked,
                                  }))
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          {isDeveloperOrAdmin
                            ? `As a ${currentUser?.role}, you can create leave requests for any user, but no active users were found.`
                            : `As a ${currentUser?.role}, you can create leave requests for team members, but no subordinates were found in your team.`}
                        </p>
                      </div>
                    ))}

                  {/* Employee Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="employee">
                        {formData.isForSomeoneElse ? "Request For" : "Employee"}
                      </Label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-500" />
                          <div>
                            {formData.isForSomeoneElse &&
                            formData.selectedEmployeeId ? (
                              (() => {
                                const selectedEmployee = subordinateUsers.find(
                                  u => u.id === formData.selectedEmployeeId
                                );
                                return selectedEmployee ? (
                                  <>
                                    <p className="font-medium">
                                      {selectedEmployee.computedName ||
                                        `${selectedEmployee.firstName} ${selectedEmployee.lastName}`.trim()}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {selectedEmployee.email}
                                    </p>
                                  </>
                                ) : (
                                  <p className="text-sm text-gray-500">
                                    Select an employee above
                                  </p>
                                );
                              })()
                            ) : (
                              <>
                                <p className="font-medium">
                                  {currentUser.computedName ||
                                    `${currentUser.firstName} ${currentUser.lastName}`}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {currentUser.email}
                                </p>
                              </>
                            )}
                          </div>
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
                          min={new Date().toISOString().split("T")[0]}
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
                            new Date().toISOString().split("T")[0]
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
                    <Button type="submit" disabled={loading}>
                      {loading ? "Submitting..." : "Submit Request"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Leave Request Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>
                      Submit requests at least 2 weeks in advance when possible
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Annual leave requires manager approval</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>
                      Sick leave over 3 days may require medical certificate
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Emergency leave should be reported immediately</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leave Types Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Leave Types
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-3">
                    <h4 className="font-medium text-sm">Annual Leave</h4>
                    <p className="text-xs text-gray-600">
                      Paid vacation time and holiday leave
                    </p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-3">
                    <h4 className="font-medium text-sm">Sick Leave</h4>
                    <p className="text-xs text-gray-600">
                      Medical leave for illness or injury
                    </p>
                  </div>
                  <div className="border-l-4 border-gray-500 pl-3">
                    <h4 className="font-medium text-sm">Unpaid Leave</h4>
                    <p className="text-xs text-gray-600">
                      Extended leave without pay
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-3">
                    <h4 className="font-medium text-sm">Other</h4>
                    <p className="text-xs text-gray-600">
                      Emergency, bereavement, or special circumstances
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Manager Information */}
            {currentUser?.manager && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Approval Manager
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {currentUser.manager.computedName ||
                          `${currentUser.manager.firstName} ${currentUser.manager.lastName}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {currentUser.manager.email}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Your leave request will be sent to your manager for
                    approval.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </PermissionGuard>
    </div>
  );
}

export default NewLeaveRequestPage;
