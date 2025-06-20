"use client";

import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { formatDistanceToNow, format } from "date-fns";
import {
  User,
  Calendar,
  Users,
  Briefcase,
  Clock,
  FileText,
  Shield,
  Activity,
  Edit,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useUserRole } from "@/hooks/use-user-role";


// GraphQL query for user profile data
const GET_USER_PROFILE = gql`
  query GetUserProfile($id: uuid!) {
    users_by_pk(id: $id) {
      id
      name
      email
      username
      image
      role
      is_staff
      is_active
      created_at
      updated_at
      clerk_user_id
      manager {
        id
        name
        email
        image
      }
      staffByManager {
        id
        name
        email
        role
        image
      }
      payrollsByPrimaryConsultantUserId {
        id
        name
        status
        client {
          name
        }
        employee_count
      }
      payrollsByBackupConsultantUserId {
        id
        name
        status
        client {
          name
        }
      }
      payrollsByManagerUserId {
        id
        name
        status
        client {
          name
        }
      }
      leaves(order_by: { start_date: desc }, limit: 5) {
        id
        start_date
        end_date
        leave_type
        status
        reason
      }
      notes_written(order_by: { created_at: desc }, limit: 5) {
        id
        content
        created_at
        entity_type
        entity_id
        is_important
      }
      work_schedules(order_by: { created_at: desc }, limit: 7) {
        id
        work_day
        work_hours
        created_at
      }
    }
  }
`;

// Role mapping for display
const roleMapping: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  admin: {
    label: "Developer",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: <Shield className="w-4 h-4" />,
  },
  org_admin: {
    label: "Admin",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: <Shield className="w-4 h-4" />,
  },
  manager: {
    label: "Manager",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: <Users className="w-4 h-4" />,
  },
  consultant: {
    label: "Consultant",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: <Briefcase className="w-4 h-4" />,
  },
  viewer: {
    label: "Viewer",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: <User className="w-4 h-4" />,
  },
};

export default function ProfilePage() {
  const { currentUser, currentUserId, loading: userLoading } = useCurrentUser();
  const { userRole } = useUserRole();
  const [activeTab, setActiveTab] = useState("overview");

  const { data, loading, error } = useQuery(GET_USER_PROFILE, {
    variables: { id: currentUserId },
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

  if (error || !data?.users_by_pk) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <p className="text-red-500">Error loading profile</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const user = data.users_by_pk;
  const roleInfo = roleMapping[user.role] || roleMapping.viewer;

  // Calculate statistics
  const stats = {
    totalPayrolls:
      user.payrollsByPrimaryConsultantUserId.length +
      user.payrollsByBackupConsultantUserId.length +
      user.payrollsByManagerUserId.length,
    primaryPayrolls: user.payrollsByPrimaryConsultantUserId.length,
    managedStaff: user.staffByManager.length,
    notesWritten: user.notes_written.length,
    totalEmployees: user.payrollsByPrimaryConsultantUserId.reduce(
      (sum: number, p: any) => sum + (p.employee_count || 0),
      0
    ),
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
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="text-2xl">
                {user.name
                  .split(" ")
                  .map((n: string) => n[0])
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

                <Badge variant={user.is_staff ? "default" : "secondary"}>
                  {user.is_staff ? "Staff Member" : "External User"}
                </Badge>

                <Badge variant={user.is_active ? "default" : "destructive"}>
                  {user.is_active ? "Active" : "Inactive"}
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
                    {format(new Date(user.created_at), "MMM dd, yyyy")}
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
                        src={user.manager.image}
                        alt={user.manager.name}
                      />
                      <AvatarFallback>
                        {user.manager.name
                          .split(" ")
                          .map((n: string) => n[0])
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
            {user.work_schedules.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Work Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Weekly Hours:</span>
                      <span className="font-medium">
                        {user.work_schedules
                          .reduce(
                            (total: number, schedule: any) =>
                              total + parseFloat(schedule.work_hours || 0),
                            0
                          )
                          .toFixed(1)}
                        h
                      </span>
                    </div>
                    <div className="space-y-2">
                      <span className="text-gray-500 text-sm">
                        Daily Schedule:
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {user.work_schedules.map((schedule: any) => (
                          <div
                            key={schedule.id}
                            className="flex justify-between"
                          >
                            <span className="text-gray-600">
                              {schedule.work_day}:
                            </span>
                            <span className="font-medium">
                              {schedule.work_hours}h
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Primary Payrolls:</span>
                  <span className="font-medium">{stats.primaryPayrolls}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Backup Payrolls:</span>
                  <span className="font-medium">
                    {user.payrollsByBackupConsultantUserId.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Managed Payrolls:</span>
                  <span className="font-medium">
                    {user.payrollsByManagerUserId.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Recent Leaves:</span>
                  <span className="font-medium">{user.leaves.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payrolls" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Primary Consultant Payrolls */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Primary Consultant (
                  {user.payrollsByPrimaryConsultantUserId.length})
                </CardTitle>
                <CardDescription>
                  Payrolls where you are the primary consultant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {user.payrollsByPrimaryConsultantUserId
                    .slice(0, 5)
                    .map((payroll: any) => (
                      <div
                        key={payroll.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{payroll.name}</p>
                          <p className="text-sm text-gray-500">
                            {payroll.client.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {payroll.employee_count} employees
                          </p>
                        </div>
                        <Badge
                          variant={
                            payroll.status === "Active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {payroll.status}
                        </Badge>
                      </div>
                    ))}
                  {user.payrollsByPrimaryConsultantUserId.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      No primary payrolls assigned
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Backup Consultant Payrolls */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Backup Consultant (
                  {user.payrollsByBackupConsultantUserId.length})
                </CardTitle>
                <CardDescription>
                  Payrolls where you are the backup consultant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {user.payrollsByBackupConsultantUserId
                    .slice(0, 5)
                    .map((payroll: any) => (
                      <div
                        key={payroll.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{payroll.name}</p>
                          <p className="text-sm text-gray-500">
                            {payroll.client.name}
                          </p>
                        </div>
                        <Badge
                          variant={
                            payroll.status === "Active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {payroll.status}
                        </Badge>
                      </div>
                    ))}
                  {user.payrollsByBackupConsultantUserId.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      No backup payrolls assigned
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                Direct Reports ({user.staffByManager.length})
              </CardTitle>
              <CardDescription>Team members reporting to you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.staffByManager.map((staff: any) => (
                  <div
                    key={staff.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={staff.image} alt={staff.name} />
                      <AvatarFallback>
                        {staff.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{staff.name}</p>
                      <p className="text-sm text-gray-500">{staff.email}</p>
                      <Badge
                        className={
                          roleMapping[staff.role]?.color || "bg-gray-100"
                        }
                      >
                        {roleMapping[staff.role]?.label || staff.role}
                      </Badge>
                    </div>
                  </div>
                ))}
                {user.staffByManager.length === 0 && (
                  <p className="text-gray-500 text-center py-8 col-span-2">
                    No direct reports
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Recent Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {user.notes_written.slice(0, 5).map((note: any) => (
                    <div key={note.id} className="p-3 border rounded-lg">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {note.content}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="capitalize">
                          {note.entity_type}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(note.created_at), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                  {user.notes_written.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      No notes written
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Leave */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Recent Leave
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {user.leaves.slice(0, 5).map((leave: any) => (
                    <div key={leave.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <p className="font-medium capitalize">
                          {leave.leave_type.replace("_", " ")}
                        </p>
                        <Badge
                          variant={
                            leave.status === "approved"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {leave.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {leave.reason}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {format(new Date(leave.start_date), "MMM dd")} -{" "}
                        {format(new Date(leave.end_date), "MMM dd, yyyy")}
                      </p>
                    </div>
                  ))}
                  {user.leaves.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      No recent leave
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
