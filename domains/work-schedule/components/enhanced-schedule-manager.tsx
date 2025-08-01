"use client";

import { format, startOfWeek, addDays, parseISO } from "date-fns";
import { 
  Calendar,
  Clock,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Edit,
  Save,
  X,
  Eye,
  EyeOff
} from "lucide-react";
import { useState, useMemo } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { type UserPosition, getPositionAdminPercentage } from "../services/enhanced-capacity-calculator";

// =============================================================================
// TYPES & INTERFACES  
// =============================================================================

interface WorkScheduleWithCapacity {
  id: string;
  userId: string;
  workDay: string;
  workHours: number;
  adminTimeHours: number;
  payrollCapacityHours: number;
  usesDefaultAdminTime: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserWithPosition {
  id: string;
  name: string;
  email: string;
  position: UserPosition;
  defaultAdminTimePercentage: number;
}

interface ScheduleManagerProps {
  user: UserWithPosition;
  schedules: WorkScheduleWithCapacity[];
  onUpdateSchedule?: (scheduleId: string, updates: Partial<WorkScheduleWithCapacity>) => void;
  onCreateSchedule?: (schedule: Omit<WorkScheduleWithCapacity, 'id' | 'createdAt' | 'updatedAt'>) => void;
  canEdit?: boolean;
}

interface DayScheduleCardProps {
  schedule?: WorkScheduleWithCapacity;
  user: UserWithPosition;
  dayName: string;
  date: string;
  isEditing: boolean;
  onEdit: (schedule: WorkScheduleWithCapacity | null) => void;
  onSave: (schedule: Partial<WorkScheduleWithCapacity>) => void;
  onCancel: () => void;
}

interface CapacityBreakdownProps {
  workHours: number;
  adminTimeHours: number;
  payrollCapacityHours: number;
  position: UserPosition;
  usesDefaultAdminTime: boolean;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const getDayOfWeekName = (index: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[index];
};

const getCapacityStatus = (utilization: number): 'low' | 'optimal' | 'high' | 'overloaded' => {
  if (utilization <= 60) return 'low';
  if (utilization <= 85) return 'optimal';
  if (utilization <= 100) return 'high';
  return 'overloaded';
};

const getCapacityColor = (status: string): string => {
  switch (status) {
    case 'low': return 'text-blue-600 bg-blue-50';
    case 'optimal': return 'text-green-600 bg-green-50';
    case 'high': return 'text-yellow-600 bg-yellow-50';
    case 'overloaded': return 'text-red-600 bg-red-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

// =============================================================================
// CAPACITY BREAKDOWN COMPONENT
// =============================================================================

export function CapacityBreakdown({ 
  workHours, 
  adminTimeHours, 
  payrollCapacityHours, 
  position,
  usesDefaultAdminTime 
}: CapacityBreakdownProps) {
  const adminPercentage = workHours > 0 ? (adminTimeHours / workHours) * 100 : 0;
  const payrollPercentage = workHours > 0 ? (payrollCapacityHours / workHours) * 100 : 0;
  const expectedAdminPercentage = getPositionAdminPercentage(position);
  const adminVariance = Math.abs(adminPercentage - expectedAdminPercentage);

  return (
    <div className="space-y-3">
      {/* Total Hours */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Total Work Hours</span>
        <span className="text-lg font-bold">{workHours.toFixed(1)}h</span>
      </div>

      {/* Time Breakdown */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <span>Admin Time</span>
            {!usesDefaultAdminTime && (
              <Badge variant="secondary" className="text-xs">Custom</Badge>
            )}
          </div>
          <span className="font-medium">{adminTimeHours.toFixed(1)}h ({adminPercentage.toFixed(1)}%)</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span>Payroll Capacity</span>
          <span className="font-medium text-green-600">
            {payrollCapacityHours.toFixed(1)}h ({payrollPercentage.toFixed(1)}%)
          </span>
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div className="space-y-1">
        <div className="flex h-2 bg-gray-200 rounded overflow-hidden">
          <div 
            className="bg-orange-400" 
            style={{ width: `${adminPercentage}%` }}
          />
          <div 
            className="bg-green-400" 
            style={{ width: `${payrollPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Admin ({adminPercentage.toFixed(0)}%)</span>
          <span>Payroll ({payrollPercentage.toFixed(0)}%)</span>
        </div>
      </div>

      {/* Admin Time Variance Alert */}
      {adminVariance > 10 && (
        <Alert className="py-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Admin time varies by {adminVariance.toFixed(1)}% from position default ({expectedAdminPercentage}%)
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// =============================================================================
// DAY SCHEDULE CARD COMPONENT
// =============================================================================

export function DayScheduleCard({ 
  schedule, 
  user, 
  dayName, 
  date,
  isEditing, 
  onEdit, 
  onSave, 
  onCancel 
}: DayScheduleCardProps) {
  const [workHours, setWorkHours] = useState(schedule?.workHours || 0);
  const [adminTimeHours, setAdminTimeHours] = useState(schedule?.adminTimeHours || 0);
  const [usesDefaultAdminTime, setUsesDefaultAdminTime] = useState(
    schedule?.usesDefaultAdminTime ?? true
  );

  const expectedAdminHours = usesDefaultAdminTime 
    ? (workHours * getPositionAdminPercentage(user.position)) / 100
    : adminTimeHours;
  
  const payrollCapacityHours = Math.max(0, workHours - expectedAdminHours);

  const handleSave = () => {
    onSave({
      userId: user.id,
      workDay: dayName,
      workHours,
      adminTimeHours: expectedAdminHours,
      payrollCapacityHours,
      usesDefaultAdminTime,
    });
  };

  const isWorkingDay = (schedule?.workHours || workHours) > 0;

  return (
    <Card className={`transition-all duration-200 ${isEditing ? 'ring-2 ring-blue-500' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{dayName}</CardTitle>
            <p className="text-xs text-muted-foreground">{date}</p>
          </div>
          <div className="flex items-center space-x-1">
            {!isWorkingDay && (
              <Badge variant="outline" className="text-xs">
                <EyeOff className="w-3 h-3 mr-1" />
                Non-working
              </Badge>
            )}
            {isEditing ? (
              <div className="flex items-center space-x-1">
                <Button size="sm" variant="outline" onClick={onCancel}>
                  <X className="w-3 h-3" />
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => onEdit(schedule || null)}
              >
                <Edit className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {isEditing ? (
          <div className="space-y-4">
            {/* Work Hours Input */}
            <div className="space-y-2">
              <Label htmlFor={`work-hours-${dayName}`} className="text-sm">
                Work Hours
              </Label>
              <Input
                id={`work-hours-${dayName}`}
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={workHours}
                onChange={(e) => setWorkHours(parseFloat(e.target.value) || 0)}
                className="w-full"
              />
            </div>

            {/* Admin Time Configuration */}
            {workHours > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Admin Time</Label>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`use-default-${dayName}`} className="text-xs">
                      Use default
                    </Label>
                    <Switch
                      id={`use-default-${dayName}`}
                      checked={usesDefaultAdminTime}
                      onCheckedChange={setUsesDefaultAdminTime}
                    />
                  </div>
                </div>

                {!usesDefaultAdminTime && (
                  <div className="space-y-1">
                    <Input
                      type="number"
                      min="0"
                      max={workHours}
                      step="0.1"
                      value={adminTimeHours}
                      onChange={(e) => setAdminTimeHours(parseFloat(e.target.value) || 0)}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Position default: {((workHours * getPositionAdminPercentage(user.position)) / 100).toFixed(1)}h
                    </p>
                  </div>
                )}

                <CapacityBreakdown
                  workHours={workHours}
                  adminTimeHours={expectedAdminHours}
                  payrollCapacityHours={payrollCapacityHours}
                  position={user.position}
                  usesDefaultAdminTime={usesDefaultAdminTime}
                />
              </div>
            )}
          </div>
        ) : (
          <>
            {isWorkingDay ? (
              <CapacityBreakdown
                workHours={schedule!.workHours}
                adminTimeHours={schedule!.adminTimeHours}
                payrollCapacityHours={schedule!.payrollCapacityHours}
                position={user.position}
                usesDefaultAdminTime={schedule!.usesDefaultAdminTime}
              />
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <EyeOff className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No work scheduled</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// WEEKLY SUMMARY COMPONENT
// =============================================================================

interface WeeklySummaryProps {
  schedules: WorkScheduleWithCapacity[];
  user: UserWithPosition;
}

export function WeeklySummary({ schedules, user }: WeeklySummaryProps) {
  const weeklyTotals = useMemo(() => {
    const totals = schedules.reduce(
      (acc, schedule) => ({
        workHours: acc.workHours + schedule.workHours,
        adminTimeHours: acc.adminTimeHours + schedule.adminTimeHours,
        payrollCapacityHours: acc.payrollCapacityHours + schedule.payrollCapacityHours,
      }),
      { workHours: 0, adminTimeHours: 0, payrollCapacityHours: 0 }
    );

    const workingDays = schedules.filter(s => s.workHours > 0).length;
    const avgHoursPerDay = workingDays > 0 ? totals.workHours / workingDays : 0;
    const adminPercentage = totals.workHours > 0 ? (totals.adminTimeHours / totals.workHours) * 100 : 0;
    const expectedAdminPercentage = getPositionAdminPercentage(user.position);

    return {
      ...totals,
      workingDays,
      avgHoursPerDay,
      adminPercentage,
      expectedAdminPercentage,
      adminVariance: Math.abs(adminPercentage - expectedAdminPercentage),
    };
  }, [schedules, user.position]);

  const utilizationStatus = getCapacityStatus(
    weeklyTotals.payrollCapacityHours > 0 ? 85 : 0 // Simplified utilization
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5" />
          <span>Weekly Summary</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {weeklyTotals.workHours.toFixed(1)}h
            </p>
            <p className="text-sm text-muted-foreground">Total Work</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {weeklyTotals.adminTimeHours.toFixed(1)}h
            </p>
            <p className="text-sm text-muted-foreground">Admin Time</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {weeklyTotals.payrollCapacityHours.toFixed(1)}h
            </p>
            <p className="text-sm text-muted-foreground">Payroll Capacity</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {weeklyTotals.workingDays}
            </p>
            <p className="text-sm text-muted-foreground">Working Days</p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Average Daily Hours</span>
            <span className="font-bold">{weeklyTotals.avgHoursPerDay.toFixed(1)}h</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Admin Time Efficiency</span>
            <div className="flex items-center space-x-2">
              <span className="font-bold">{weeklyTotals.adminPercentage.toFixed(1)}%</span>
              {weeklyTotals.adminVariance > 5 && (
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Capacity Status</span>
            <Badge className={getCapacityColor(utilizationStatus)}>
              {utilizationStatus.charAt(0).toUpperCase() + utilizationStatus.slice(1)}
            </Badge>
          </div>
        </div>

        {weeklyTotals.adminVariance > 10 && (
          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Admin time allocation varies significantly from position default. 
              Expected: {weeklyTotals.expectedAdminPercentage}%, Actual: {weeklyTotals.adminPercentage.toFixed(1)}%
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// MAIN ENHANCED SCHEDULE MANAGER COMPONENT
// =============================================================================

export function EnhancedScheduleManager({ 
  user, 
  schedules, 
  onUpdateSchedule, 
  onCreateSchedule,
  canEdit = false 
}: ScheduleManagerProps) {
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'week' | 'list'>('week');

  // Generate week structure
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfWeek(new Date()), i);
    const dayName = getDayOfWeekName(i);
    const dateStr = format(date, 'MMM d');
    const schedule = schedules.find(s => s.workDay.toLowerCase() === dayName.toLowerCase());
    
    return {
      dayName,
      dateStr,
      schedule,
      date
    };
  });

  const handleEdit = (dayName: string, schedule: WorkScheduleWithCapacity | null) => {
    setEditingDay(dayName);
  };

  const handleSave = async (dayName: string, updates: Partial<WorkScheduleWithCapacity>) => {
    const existingSchedule = schedules.find(s => s.workDay.toLowerCase() === dayName.toLowerCase());
    
    if (existingSchedule && onUpdateSchedule) {
      await onUpdateSchedule(existingSchedule.id, updates);
    } else if (onCreateSchedule) {
      await onCreateSchedule({
        userId: user.id,
        workDay: dayName,
        workHours: updates.workHours || 0,
        adminTimeHours: updates.adminTimeHours || 0,
        payrollCapacityHours: updates.payrollCapacityHours || 0,
        usesDefaultAdminTime: updates.usesDefaultAdminTime ?? true,
      });
    }
    
    setEditingDay(null);
  };

  const handleCancel = () => {
    setEditingDay(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Work Schedule Manager</h2>
          <p className="text-muted-foreground">
            Manage {user.name}'s work schedule and admin time allocation
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('week')}
          >
            <Calendar className="w-4 h-4 mr-1" />
            Week View
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <Users className="w-4 h-4 mr-1" />
            List View
          </Button>
        </div>
      </div>

      {/* Weekly Summary */}
      <WeeklySummary schedules={schedules} user={user} />

      {/* Schedule Grid/List */}
      {viewMode === 'week' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {weekDays.map(({ dayName, dateStr, schedule }) => (
            <DayScheduleCard
              key={dayName}
              {...(schedule && { schedule })}
              user={user}
              dayName={dayName}
              date={dateStr}
              isEditing={editingDay === dayName && canEdit}
              onEdit={(sched) => canEdit && handleEdit(dayName, sched)}
              onSave={(updates) => handleSave(dayName, updates)}
              onCancel={handleCancel}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Schedule List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weekDays.map(({ dayName, dateStr, schedule }) => (
                <div key={dayName} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-20">
                      <p className="font-medium">{dayName}</p>
                      <p className="text-sm text-muted-foreground">{dateStr}</p>
                    </div>
                    {schedule ? (
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-lg font-bold">{schedule.workHours}h</p>
                          <p className="text-xs text-muted-foreground">Work</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-orange-600">{schedule.adminTimeHours.toFixed(1)}h</p>
                          <p className="text-xs text-muted-foreground">Admin</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-600">{schedule.payrollCapacityHours.toFixed(1)}h</p>
                          <p className="text-xs text-muted-foreground">Capacity</p>
                        </div>
                      </div>
                    ) : (
                      <Badge variant="outline">No work scheduled</Badge>
                    )}
                  </div>
                  {canEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(dayName, schedule || null)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}