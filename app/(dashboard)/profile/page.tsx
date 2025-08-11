"use client";

import { useQuery, useMutation } from "@apollo/client";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import {
  User,
  Calendar,
  Settings,
  AlertCircle,
  Building,
  Briefcase,
  Users,
  Clock,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/patterns/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ByteMySpinner } from "@/components/ui/bytemy-loading-icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  GetUserProfileCompleteDocument,
  type GetUserProfileCompleteQuery,
  UpdateUserProfileDocument,
  type UpdateUserProfileMutation,
} from "@/domains/users/graphql/generated/graphql";
import PayrollWorkloadVisualization from "@/domains/work-schedule/components/payroll-workload-visualization";
import { usePayrollWorkload } from "@/domains/work-schedule/hooks/use-payroll-workload";
import { useCurrentUser } from "@/hooks/use-current-user";
import { safeProfileAccess } from "@/lib/apollo/cache/profile-cache-fix";

interface ProfileFormData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
}

// Role mapping for display
const roleMapping = {
  developer: {
    label: "Developer",
    color: "bg-purple-100 text-purple-800",
    icon: <User className="w-4 h-4" />,
  },
  org_admin: {
    label: "Organization Admin",
    color: "bg-red-100 text-red-800",
    icon: <Users className="w-4 h-4" />,
  },
  manager: {
    label: "Manager",
    color: "bg-blue-100 text-blue-800",
    icon: <Building className="w-4 h-4" />,
  },
  consultant: {
    label: "Consultant",
    color: "bg-green-100 text-green-800",
    icon: <Briefcase className="w-4 h-4" />,
  },
  viewer: {
    label: "Viewer",
    color: "bg-gray-100 text-gray-800",
    icon: <User className="w-4 h-4" />,
  },
};

export default function ProfilePage() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { currentUser, currentUserId, loading: userLoading } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("payrolls");
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  });

  // Get workload data for the workload tab
  const {
    user: workloadUser,
    workSchedule,
    loading: workloadLoading,
    error: workloadError,
  } = usePayrollWorkload({
    userId: currentUserId || "",
    enabled: !!currentUserId && activeTab === "workload",
  });

  /**
   * Determines the best avatar image to display for the user
   * Priority: Custom uploaded image > External account image > fallback
   * Same logic as UserNav component for consistency
   * Uses Clerk's user object for avatar data
   */
  const getAvatarImage = () => {
    if (!clerkUser) {
      return "";
    }

    // If user has uploaded a custom image, use that
    if (clerkUser.hasImage && clerkUser.imageUrl) {
      return clerkUser.imageUrl;
    }

    // If user has external accounts (like Google) with avatar, use that
    if (clerkUser.externalAccounts && clerkUser.externalAccounts.length > 0) {
      const externalAccount = clerkUser.externalAccounts[0];
      if (externalAccount.imageUrl) {
        return externalAccount.imageUrl;
      }
    }

    // Fallback to empty string for default avatar
    return "";
  };

  // Get current user profile data
  const { data, loading, error, refetch } =
    useQuery<GetUserProfileCompleteQuery>(GetUserProfileCompleteDocument, {
      variables: { id: currentUserId! },
      skip: !currentUserId,
      fetchPolicy: "cache-first",
      errorPolicy: "all",
      notifyOnNetworkStatusChange: true,
      onCompleted: data => {
        const user = data.usersByPk;
        if (user) {
          setFormData({
            name: user.computedName || "",
            email: user.email || "",
            phone: user.phone || "",
            address: user.address || "",
            bio: user.bio || "",
          });
        }
      },
      onError: error => {
        console.error("Profile query error:", error);
        // Still allow partial data to be displayed
      },
    });

  const [updateProfile, { loading: updating }] =
    useMutation<UpdateUserProfileMutation>(UpdateUserProfileDocument, {
      onCompleted: () => {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        refetch();
      },
      onError: error => {
        toast.error("Failed to update profile", {
          description: error.message,
        });
      },
    });

  const user = data?.usersByPk;

  // If we have partial data but an error, still show what we can
  const hasPartialData = user && user.id && user.computedName;

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      await updateProfile({
        variables: {
          id: user.id,
          input: {
            name: formData.name,
            phone: formData.phone || null,
            address: formData.address || null,
            bio: formData.bio || null,
          },
        },
      });

      // Update Clerk user if name changed
      if (clerkUser && formData.name !== user.computedName) {
        await clerkUser.update({
          firstName: formData.name.split(" ")[0],
          lastName: formData.name.split(" ").slice(1).join(" "),
        });
      }
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.computedName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        bio: user.bio || "",
      });
    }
    setIsEditing(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "developer":
        return "bg-purple-100 text-purple-800";
      case "org_admin":
        return "bg-red-100 text-red-800";
      case "manager":
        return "bg-blue-100 text-blue-800";
      case "consultant":
        return "bg-green-100 text-green-800";
      case "viewer":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!clerkLoaded || userLoading || loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <ByteMySpinner size="lg" />
      </div>
    );
  }

  if (error && !hasPartialData) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-4 p-6">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">Failed to load profile</h3>
              <p className="text-sm text-gray-600 mt-1">{error.message}</p>
              <Button onClick={() => refetch()} className="mt-4">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-4 p-6">
            <User className="h-12 w-12 text-gray-400" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">Profile not found</h3>
              <p className="text-sm text-gray-600 mt-1">
                Your user profile could not be found in the system.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const roleInfo =
    roleMapping[user.role as keyof typeof roleMapping] || roleMapping.viewer;

  // Calculate statistics with safe access
  const stats = {
    totalPayrolls:
      safeProfileAccess(user, "primaryPayrollAssignments.length", 0) +
      safeProfileAccess(user, "backupPayrollAssignments.length", 0) +
      safeProfileAccess(user, "managedPayrolls.length", 0),
    primaryPayrolls: safeProfileAccess(
      user,
      "primaryPayrollAssignments.length",
      0
    ),
    managedStaff: safeProfileAccess(user, "managedUsers.length", 0),
    totalEmployees:
      user?.primaryPayrollAssignments?.reduce(
        (sum: number, p: any) => sum + safeProfileAccess(p, "employeeCount", 0),
        0
      ) || 0,
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="My Profile"
        description="Manage your account settings and personal information"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Profile" },
        ]}
        actions={[
          isEditing
            ? { label: "Cancel", onClick: handleCancel }
            : {
                label: "Edit Profile",
                icon: Settings,
                onClick: () => setIsEditing(true),
              },
        ]}
      />
      {/* Error banner for partial data */}
      {error && hasPartialData && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="flex items-center space-x-3 p-4">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm font-medium text-orange-800">
                Some profile data couldn't be loaded
              </p>
              <p className="text-xs text-orange-600">{error.message}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="ml-auto"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Actions are already provided via PageHeader; remove duplicate local header */}

      {/* Enhanced Profile Overview Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            {/* Avatar Section with Upload Capability */}
            <div className="flex-shrink-0">
              <AvatarUpload
                currentImageUrl={getAvatarImage()}
                userName={user?.computedName || "User"}
                isEditing={isEditing}
                onImageUpdate={newImageUrl => {
                  console.log("Avatar updated:", newImageUrl);
                }}
              />
            </div>

            <div className="flex-1 space-y-6">
              {/* Basic Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.computedName}
                </h2>
                <p className="text-gray-600">{user.email}</p>
                {user.username && (
                  <p className="text-sm text-gray-500">@{user.username}</p>
                )}
              </div>

              {/* Status Badges */}
              <div className="flex items-center space-x-4 flex-wrap">
                <Badge className={roleInfo.color}>
                  {roleInfo.icon}
                  <span className="ml-1">{roleInfo.label}</span>
                </Badge>

                <Badge variant={user.isStaff ? "default" : "secondary"}>
                  {user.isStaff ? "Staff Member" : "External User"}
                </Badge>

                <Badge variant={user.isActive ? "default" : "destructive"}>
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>

                <Badge variant="outline">
                  Member Since{" "}
                  {user.createdAt
                    ? format(new Date(user.createdAt), "MMM yyyy")
                    : "N/A"}
                </Badge>
              </div>

              {/* Personal Details in Edit Mode */}
              {isEditing && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="header-name">Full Name</Label>
                        <Input
                          id="header-name"
                          value={formData.name}
                          onChange={e =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="header-phone">Phone Number</Label>
                        <Input
                          id="header-phone"
                          type="tel"
                          placeholder="e.g., +61 400 000 000"
                          value={formData.phone}
                          onChange={e =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="header-address">Address</Label>
                        <Input
                          id="header-address"
                          placeholder="e.g., Sydney, NSW, Australia"
                          value={formData.address}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="header-email">Email Address</Label>
                        <Input
                          id="header-email"
                          type="email"
                          value={formData.email}
                          disabled={true}
                          className="bg-gray-100"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="header-bio">Bio</Label>
                      <Textarea
                        id="header-bio"
                        placeholder="Tell us a bit about yourself..."
                        rows={3}
                        value={formData.bio}
                        onChange={e =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Display Personal Details in View Mode */}
              {!isEditing && (user.phone || user.address || user.bio) && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:gap-6 gap-3">
                    {user.phone && (
                      <div>
                        <span className="text-sm text-gray-500">Phone:</span>
                        <p className="font-medium">{user.phone}</p>
                      </div>
                    )}
                    {user.address && (
                      <div>
                        <span className="text-sm text-gray-500">Address:</span>
                        <p className="font-medium">{user.address}</p>
                      </div>
                    )}
                  </div>
                  {user.bio && (
                    <div>
                      <span className="text-sm text-gray-500">Bio:</span>
                      <p className="font-medium">{user.bio}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Statistics Grid */}
              <div className="pt-4 border-t">
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg sm:text-2xl font-bold text-blue-600">
                      {stats.totalPayrolls}
                    </div>
                    <div className="text-xs sm:text-sm text-blue-600">
                      Total Payrolls
                    </div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
                    <div className="text-lg sm:text-2xl font-bold text-green-600">
                      {stats.totalEmployees}
                    </div>
                    <div className="text-xs sm:text-sm text-green-600">
                      Employees Managed
                    </div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg sm:text-2xl font-bold text-purple-600">
                      {stats.managedStaff}
                    </div>
                    <div className="text-xs sm:text-sm text-purple-600">
                      Direct Reports
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="payrolls">Payrolls</TabsTrigger>
          <TabsTrigger value="workload">Workload</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="payrolls" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Manager Information */}
            {user.manager && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Reporting Structure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={user.manager.image || undefined}
                        alt={
                          user.manager.computedName ||
                          `${user.manager.firstName} ${user.manager.lastName}`
                        }
                      />
                      <AvatarFallback>
                        {(
                          user.manager.computedName ||
                          `${user.manager.firstName} ${user.manager.lastName}`
                        )
                          .split(" ")
                          .map((n: string) => n?.[0] || "")
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.manager.computedName}</p>
                      <p className="text-sm text-gray-500">
                        {user.manager.email}
                      </p>
                      <p className="text-xs text-gray-400">Manager</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Work Schedule */}
            {data?.usersByPk?.workSchedules &&
              data.usersByPk.workSchedules.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Work Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {data.usersByPk.workSchedules.map((schedule: any) => (
                        <div
                          key={schedule.id}
                          className="flex justify-between items-center py-2 border-b last:border-b-0"
                        >
                          <span className="font-medium">
                            {schedule.workDay}
                          </span>
                          <span className="text-gray-500">
                            {schedule.workHours}h
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Recent Leave */}
            {data?.userLeaves?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Recent Leave
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.userLeaves
                      ?.slice(0, 3)
                      .map((leave: any, index: number) => (
                        <div key={index} className="flex justify-between">
                          <div>
                            <p className="font-medium">{leave.leaveType}</p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(leave.startDate), "MMM dd")} -{" "}
                              {format(new Date(leave.endDate), "MMM dd, yyyy")}
                            </p>
                          </div>
                          <Badge
                            variant={
                              leave.status === "approved"
                                ? "default"
                                : leave.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {leave.status || "Pending"}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="payrolls" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Consultant Payrolls */}
            {user.primaryPayrollAssignments?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Primary Consultant (
                    {user.primaryPayrollAssignments?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {user.primaryPayrollAssignments?.map((payroll: any) => (
                      <div
                        key={payroll.id}
                        className="flex justify-between items-start"
                      >
                        <div>
                          <p className="font-medium">{payroll.name}</p>
                          <p className="text-sm text-gray-500">
                            {payroll.client?.name || "Unknown Client"}
                          </p>
                          {payroll.employeeCount && (
                            <p className="text-xs text-gray-400">
                              {payroll.employeeCount} employees
                            </p>
                          )}
                        </div>
                        <Badge
                          variant={
                            payroll.status === "active"
                              ? "default"
                              : payroll.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {payroll.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Backup Consultant Payrolls */}
            {user.backupPayrollAssignments?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Backup Consultant (
                    {user.backupPayrollAssignments?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {user.backupPayrollAssignments?.map((payroll: any) => (
                      <div
                        key={payroll.id}
                        className="flex justify-between items-start"
                      >
                        <div>
                          <p className="font-medium">{payroll.name}</p>
                          <p className="text-sm text-gray-500">
                            {payroll.client?.name || "Unknown Client"}
                          </p>
                        </div>
                        <Badge
                          variant={
                            payroll.status === "active"
                              ? "default"
                              : payroll.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {payroll.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Managed Payrolls */}
            {user.managedPayrolls?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Managed Payrolls ({user.managedPayrolls?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {user.managedPayrolls?.map((payroll: any) => (
                      <div
                        key={payroll.id}
                        className="flex justify-between items-start"
                      >
                        <div>
                          <p className="font-medium">{payroll.name}</p>
                          <p className="text-sm text-gray-500">
                            {payroll.client?.name || "Unknown Client"}
                          </p>
                        </div>
                        <Badge
                          variant={
                            payroll.status === "active"
                              ? "default"
                              : payroll.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {payroll.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="workload" className="space-y-6">
          {/* Payroll Workload Visualization */}
          {workloadLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center p-8">
                <ByteMySpinner size="lg" />
                <span className="ml-4">Loading workload data...</span>
              </CardContent>
            </Card>
          ) : workloadError ? (
            <Card>
              <CardContent className="flex flex-col items-center space-y-4 p-8">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold">
                    Failed to load workload data
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {workloadError.message}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <PayrollWorkloadVisualization
              userId={user.id}
              userName={
                user.computedName || `${user.firstName} ${user.lastName}`
              }
              userRole={user.role}
              workSchedule={workSchedule}
              viewMode="consultant"
              showCapacityComparison={true}
              onAssignmentClick={assignment => {
                console.log("Assignment clicked:", assignment);
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          {/* Direct Reports */}
          {user.managedUsers?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Direct Reports ({user.managedUsers?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.managedUsers?.map((report: any) => (
                    <div
                      key={report.id}
                      className="flex items-center space-x-3 p-3 border rounded-lg"
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={report.image || undefined}
                          alt={report.name}
                        />
                        <AvatarFallback>
                          {report.name
                            .split(" ")
                            .map((n: string) => n?.[0] || "")
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <p className="text-sm text-gray-500">{report.email}</p>
                        <Badge
                          className={
                            roleMapping[report.role as keyof typeof roleMapping]
                              ?.color || roleMapping.viewer.color
                          }
                        >
                          {roleMapping[report.role as keyof typeof roleMapping]
                            ?.label || "Viewer"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          {/* Activity Placeholder */}
          <Card>
            <CardContent className="flex flex-col items-center space-y-4 p-8">
              <FileText className="h-12 w-12 text-gray-400" />
              <div className="text-center">
                <h3 className="text-lg font-semibold">Activity Coming Soon</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Activity tracking will be available in a future update.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
