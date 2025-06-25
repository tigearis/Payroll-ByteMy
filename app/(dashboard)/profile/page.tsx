"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useUserRole } from "@/hooks/use-user-role";
import { GetUserProfileCompleteDocument } from "@/domains/users/graphql/generated";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Users,
  Calendar,
  FileText,
  Edit,
  Briefcase,
  Clock,
  Building,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

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

// Status mapping
const statusMapping = {
  active: {
    label: "Active",
    color: "bg-green-100 text-green-800",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  inactive: {
    label: "Inactive",
    color: "bg-red-100 text-red-800",
    icon: <XCircle className="w-4 h-4" />,
  },
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    icon: <AlertCircle className="w-4 h-4" />,
  },
};

export default function ProfilePage() {
  const { currentUser, currentUserId, loading: userLoading } = useCurrentUser();
  const { userRole } = useUserRole();
  const [activeTab, setActiveTab] = useState("overview");

  const { data, loading, error } = useQuery(GetUserProfileCompleteDocument, {
    variables: { id: currentUserId! },
    skip: !currentUserId,
    fetchPolicy: "cache-and-network",
  });

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.userById) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <p className="text-red-500">Error loading profile</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const user = data.userById as any; // Fragment masking requires type assertion
  const roleInfo =
    roleMapping[user.role as keyof typeof roleMapping] || roleMapping.viewer;

  // Calculate statistics
  const stats = {
    totalPayrolls:
      (user.primaryConsultantPayrolls?.length || 0) +
      (user.backupConsultantPayrolls?.length || 0) +
      (user.managedPayrolls?.length || 0),
    primaryPayrolls: user.primaryConsultantPayrolls?.length || 0,
    managedStaff: user.directReports?.length || 0,
    notesWritten: user.notesWritten?.length || 0,
    totalEmployees: user.primaryConsultantPayrolls?.reduce(
      (sum: number, p: any) => sum + (p.employeeCount || 0),
      0
    ) || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500">
            View and manage your profile information
          </p>
        </div>
        <Link href="/settings/account">
          <Button>
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </Link>
      </div>

      {/* Profile Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <Avatar className="w-24 h-24">
              {user.image && <AvatarImage src={user.image} alt={user.name} />}
              <AvatarFallback className="text-2xl">
                {user.name
                  .split(" ")
                  .map((n: string) => n?.[0] || "")
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.name}
                </h2>
                <p className="text-gray-600">{user.email}</p>
                {user.username && (
                  <p className="text-sm text-gray-500">@{user.username}</p>
                )}
              </div>

              <div className="flex items-center space-x-4">
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
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.totalPayrolls}
                  </div>
                  <div className="text-sm text-gray-500">Total Payrolls</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.totalEmployees}
                  </div>
                  <div className="text-sm text-gray-500">Employees Managed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.managedStaff}
                  </div>
                  <div className="text-sm text-gray-500">Direct Reports</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {stats.notesWritten}
                  </div>
                  <div className="text-sm text-gray-500">Notes Written</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payrolls">Payrolls</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Full Name:</span>
                  <span className="font-medium">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                {user.username && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Username:</span>
                    <span className="font-medium">@{user.username}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Role:</span>
                  <Badge className={roleInfo.color}>
                    {roleInfo.icon}
                    <span className="ml-1">{roleInfo.label}</span>
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Member Since:</span>
                  <span className="font-medium">
                    {user.createdAt
                      ? format(new Date(user.createdAt), "MMM dd, yyyy")
                      : "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>

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
                        alt={user.manager.name}
                      />
                      <AvatarFallback>
                        {user.manager.name
                          .split(" ")
                          .map((n: string) => n?.[0] || "")
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.manager.name}</p>
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
            {user.workSchedules?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Work Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {user.workSchedules.map((schedule: any) => (
                      <div
                        key={schedule.id}
                        className="flex justify-between items-center py-2 border-b last:border-b-0"
                      >
                        <span className="font-medium">{schedule.workDay}</span>
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
            {user.leaves?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Recent Leave
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {user.leaves?.slice(0, 3).map((leave: any) => (
                      <div key={leave.id} className="flex justify-between">
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
            {user.primaryConsultantPayrolls?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Primary Consultant ({user.primaryConsultantPayrolls?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {user.primaryConsultantPayrolls?.map((payroll: any) => (
                      <div
                        key={payroll.id}
                        className="flex justify-between items-start"
                      >
                        <div>
                          <p className="font-medium">{payroll.name}</p>
                          <p className="text-sm text-gray-500">
                            {payroll.client.name}
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
            {user.backupConsultantPayrolls?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Backup Consultant ({user.backupConsultantPayrolls?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {user.backupConsultantPayrolls?.map((payroll: any) => (
                      <div
                        key={payroll.id}
                        className="flex justify-between items-start"
                      >
                        <div>
                          <p className="font-medium">{payroll.name}</p>
                          <p className="text-sm text-gray-500">
                            {payroll.client.name}
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
                            {payroll.client.name}
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

        <TabsContent value="team" className="space-y-6">
          {/* Direct Reports */}
          {user.directReports?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Direct Reports ({user.directReports?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.directReports?.map((report: any) => (
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
          {/* Recent Notes */}
          {user.notesWritten?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Recent Notes ({user.notesWritten?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.notesWritten?.map((note: any) => (
                    <div
                      key={note.id}
                      className="border-l-4 border-blue-200 pl-4 py-2"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{note.entity_type}</Badge>
                          {note.is_important && (
                            <Badge variant="destructive">Important</Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {note.created_at
                            ? format(new Date(note.created_at), "MMM dd, yyyy")
                            : ""}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {note.content}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
