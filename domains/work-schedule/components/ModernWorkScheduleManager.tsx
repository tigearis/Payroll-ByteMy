"use client";

import {
  Calendar,
  Clock,
  Users,
  TrendingUp,
  BarChart3,
  User,
  Briefcase,
  Activity,
  Edit,
  Eye,
} from "lucide-react";
import { useState, useMemo } from "react";
import {
  ModernDataTable,
  type ColumnDef,
  type RowAction,
} from "@/components/data/modern-data-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { StatusIndicator } from "@/components/ui/status-indicator";

// Team member interface for work schedule management
interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  computedName: string;
  email: string;
  position: string;
  capacity: {
    utilizationPercentage: number;
    totalWorkHours: number;
    totalPayrollCapacity: number;
    availableCapacityHours: number;
    processingWindowDays: number;
  };
  assignedPayrolls: Array<{
    id: string;
    name: string;
    role: "primary" | "backup";
    processingTime: number;
  }>;
  workSchedules: Array<{
    id: string;
    workDay: string;
    workHours: number;
    adminTimeHours: number;
    payrollCapacityHours: number;
  }>;
}

interface ModernWorkScheduleManagerProps {
  teamMembers: TeamMember[];
  loading?: boolean;
  onUpdateSchedule?: (memberId: string, updates: any) => void;
  onViewMember?: (member: TeamMember) => void;
  onEditSchedule?: (member: TeamMember) => void;
}

// Status configurations for utilization levels
const utilizationConfigs = {
  optimal: {
    component: ({ label }: { label: string }) => (
      <StatusIndicator variant="success">{label}</StatusIndicator>
    ),
    threshold: [0, 85],
  },
  high: {
    component: ({ label }: { label: string }) => (
      <StatusIndicator variant="warning">{label}</StatusIndicator>
    ),
    threshold: [85, 100],
  },
  capacity: {
    component: ({ label }: { label: string }) => (
      <StatusIndicator variant="error">{label}</StatusIndicator>
    ),
    threshold: [100, 110],
  },
  overallocated: {
    component: ({ label }: { label: string }) => (
      <StatusIndicator variant="error">{`${label} - CRITICAL`}</StatusIndicator>
    ),
    threshold: [110, Infinity],
  },
};

function getUtilizationStatus(utilization: number) {
  if (utilization < 85) return "optimal";
  if (utilization < 100) return "high";
  if (utilization < 110) return "capacity";
  return "overallocated";
}

// Member Details component for sheet view
const MemberDetails = ({ member }: { member: TeamMember }) => (
  <div className="space-y-6">
    {/* Member Header */}
    <div className="flex items-start gap-4">
      <Avatar className="h-16 w-16">
        <AvatarFallback className="text-lg font-medium bg-primary/10 text-primary">
          {member.firstName?.[0]}
          {member.lastName?.[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <h3 className="text-xl font-semibold">{member.computedName}</h3>
        <p className="text-foreground opacity-75">
          {member.position}
        </p>
        <p className="text-sm text-foreground opacity-60">{member.email}</p>
      </div>
    </div>

    {/* Capacity Overview */}
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-primary">
              {(
                Math.round(member.capacity.utilizationPercentage * 100) / 100
              ).toFixed(2)}
              %
            </div>
            <div className="text-sm text-foreground opacity-75">
              Utilization
            </div>
            <Progress
              value={member.capacity.utilizationPercentage}
              className="h-2"
              max={120}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-primary">
              {(
                Math.round(member.capacity.availableCapacityHours * 100) / 100
              ).toFixed(2)}
              h
            </div>
            <div className="text-sm text-foreground opacity-75">
              Available
            </div>
            <div className="text-xs text-foreground opacity-60">
              of{" "}
              {(
                Math.round(member.capacity.totalPayrollCapacity * 100) / 100
              ).toFixed(2)}
              h capacity
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Work Schedule Details */}
    <div className="space-y-3">
      <h4 className="font-medium flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        Work Schedule
      </h4>
      <div className="space-y-2">
        {member.workSchedules.map(schedule => (
          <div
            key={schedule.id}
            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
          >
            <div className="space-y-1">
              <div className="font-medium">{schedule.workDay}</div>
              <div className="text-sm text-foreground opacity-75">
                {(Math.round(schedule.workHours * 100) / 100).toFixed(2)}h work
                • {(Math.round(schedule.adminTimeHours * 100) / 100).toFixed(2)}
                h admin •{" "}
                {(
                  Math.round(schedule.payrollCapacityHours * 100) / 100
                ).toFixed(2)}
                h payroll
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Assigned Payrolls */}
    <div className="space-y-3">
      <h4 className="font-medium flex items-center gap-2">
        <Briefcase className="h-4 w-4" />
        Assigned Payrolls ({member.assignedPayrolls.length})
      </h4>
      {member.assignedPayrolls.length > 0 ? (
        <div className="space-y-2">
          {member.assignedPayrolls.map((payroll, index) => (
            <div
              key={`${payroll.id}-${index}`}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
            >
              <div className="space-y-1">
                <div className="font-medium">{payroll.name}</div>
                <div className="text-sm text-foreground opacity-75">
                  {payroll.processingTime}h • {payroll.role} consultant
                </div>
              </div>
              <Badge
                variant={payroll.role === "primary" ? "default" : "secondary"}
              >
                {payroll.role}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-foreground opacity-60">
          No payrolls assigned
        </div>
      )}
    </div>
  </div>
);

export function ModernWorkScheduleManager({
  teamMembers,
  loading = false,
  onViewMember,
  onEditSchedule,
}: ModernWorkScheduleManagerProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Define essential columns for progressive disclosure
  const columns: ColumnDef<TeamMember>[] = [
    {
      id: "member",
      key: "computedName",
      label: "Team Member",
      essential: true,
      render: (_, member) => (
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {member.firstName?.[0]}
              {member.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="font-medium truncate">{member.computedName}</div>
            <div className="text-sm text-foreground opacity-75 truncate">
              {member.position}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "utilization",
      key: "capacity",
      label: "Utilization",
      essential: true,
      sortable: true,
      render: (_, member) => {
        const utilization = member.capacity.utilizationPercentage;
        const status = getUtilizationStatus(utilization);
        const config = utilizationConfigs[status];

        return (
          <div className="flex items-center gap-2">
            <config.component label={`${utilization}%`} />
            <Progress value={utilization} className="w-16 h-2" max={120} />
          </div>
        );
      },
    },
    {
      id: "capacity",
      key: "capacity",
      label: "Capacity",
      essential: true,
      render: (_, member) => (
        <div className="text-right tabular-nums">
          <div className="font-medium">
            {member.capacity.availableCapacityHours.toFixed(2)}h
          </div>
          <div className="text-sm text-foreground opacity-75">
            of {member.capacity.totalPayrollCapacity.toFixed(2)}h
          </div>
        </div>
      ),
    },
    {
      id: "workload",
      key: "assignedPayrolls",
      label: "Workload",
      essential: true,
      render: (_, member) => (
        <div className="text-right">
          <div className="font-medium">
            {member.assignedPayrolls.length} payrolls
          </div>
          <div className="text-sm text-foreground opacity-75">
            {member.capacity.processingWindowDays} work days
          </div>
        </div>
      ),
    },
  ];

  // Row actions for contextual operations
  const rowActions: RowAction<TeamMember>[] = [
    {
      id: "view",
      label: "View Details",
      icon: Eye,
      onClick: member => {
        setSelectedMember(member);
        onViewMember?.(member);
      },
    },
    {
      id: "edit",
      label: "Edit Schedule",
      icon: Edit,
      onClick: member => onEditSchedule?.(member),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Modern Data Table */}
      <ModernDataTable
        data={teamMembers}
        columns={columns}
        rowActions={rowActions}
        loading={loading}
        searchable={true}
        searchPlaceholder="Search team members..."
        expandableRows={true}
        renderExpandedRow={member => (
          <div className="p-4 space-y-4 bg-muted/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Work Schedule Summary */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Work Schedule
                </h4>
                <div className="space-y-2">
                  {member.workSchedules.slice(0, 3).map(schedule => (
                    <div key={schedule.id} className="text-sm">
                      <span className="font-medium">{schedule.workDay}:</span>{" "}
                      {(Math.round(schedule.workHours * 100) / 100).toFixed(2)}h
                      <span className="text-foreground opacity-60 ml-2">
                        (
                        {(
                          Math.round(schedule.payrollCapacityHours * 100) / 100
                        ).toFixed(2)}
                        h payroll capacity)
                      </span>
                    </div>
                  ))}
                  {member.workSchedules.length > 3 && (
                    <div className="text-sm text-foreground opacity-60">
                      +{member.workSchedules.length - 3} more days
                    </div>
                  )}
                </div>
              </div>

              {/* Payroll Assignments */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Assigned Payrolls
                </h4>
                <div className="space-y-2">
                  {member.assignedPayrolls.slice(0, 3).map(payroll => (
                    <div
                      key={payroll.id}
                      className="text-sm flex items-center justify-between"
                    >
                      <span className="truncate">{payroll.name}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-foreground opacity-60">
                          {(
                            Math.round(payroll.processingTime * 100) / 100
                          ).toFixed(2)}
                          h
                        </span>
                        <Badge
                          variant={
                            payroll.role === "primary" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {payroll.role}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {member.assignedPayrolls.length > 3 && (
                    <div className="text-sm text-foreground opacity-60">
                      +{member.assignedPayrolls.length - 3} more payrolls
                    </div>
                  )}
                </div>
              </div>

              {/* Capacity Metrics */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-foreground flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Capacity Metrics
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Work Hours:</span>
                    <span className="font-medium">
                      {(
                        Math.round(member.capacity.totalWorkHours * 100) / 100
                      ).toFixed(2)}
                      h
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payroll Capacity:</span>
                    <span className="font-medium">
                      {(
                        Math.round(member.capacity.totalPayrollCapacity * 100) /
                        100
                      ).toFixed(2)}
                      h
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available:</span>
                    <span className="font-medium text-green-600">
                      {(
                        Math.round(
                          member.capacity.availableCapacityHours * 100
                        ) / 100
                      ).toFixed(2)}
                      h
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Days:</span>
                    <span className="font-medium">
                      {member.capacity.processingWindowDays} days
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedMember(member)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditSchedule?.(member)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Schedule
              </Button>
            </div>
          </div>
        )}
        emptyState={
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-foreground opacity-40 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No Team Members
            </h3>
            <p className="text-foreground opacity-75 mb-4">
              Add team members to manage work schedules and capacity
            </p>
            <Button variant="outline">
              <User className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </div>
        }
      />

      {/* Member Details Sheet */}
      <Sheet
        open={!!selectedMember}
        onOpenChange={() => setSelectedMember(null)}
      >
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <div className="h-full flex flex-col">
            <SheetHeader className="flex-shrink-0">
              <SheetTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Team Member Details
              </SheetTitle>
              <SheetDescription>
                Detailed work schedule and capacity information
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto">
              {selectedMember && <MemberDetails member={selectedMember} />}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default ModernWorkScheduleManager;