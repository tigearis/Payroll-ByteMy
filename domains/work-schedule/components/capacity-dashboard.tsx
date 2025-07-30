"use client";

import { format, startOfWeek, addDays, parseISO } from "date-fns";
import { 
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BarChart3,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  User,
  Zap,
  WifiOff,
  Edit2,
  Save,
  X,
  Info
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  type UserPosition, 
  type ConsultantCapacity,
  type CapacityConflict,
  getPositionAdminPercentage,
  formatCapacityUtilization,
  getCapacityStatusColor
} from "../services/enhanced-capacity-calculator";
import { CapacityDashboardSkeleton, SmartLoadingSpinner } from "./loading-states";

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  computedName: string;
  email: string;
  position: UserPosition;
  defaultAdminTimePercentage: number;
  isStaff: boolean;
  workSchedules: WorkScheduleWithCapacity[];
  assignedPayrolls: AssignedPayroll[];
}

interface WorkScheduleWithCapacity {
  id: string;
  workDay: string;
  workHours: number;
  adminTimeHours: number;
  payrollCapacityHours: number;
  usesDefaultAdminTime: boolean;
}

interface AssignedPayroll {
  id: string;
  name: string;
  processingTime: number;
  processingDaysBeforeEft: number;
  payrollDates?: {
    adjustedEftDate: string;
  }[];
}

interface CapacityDashboardProps {
  teamMembers?: TeamMember[];
  managerId: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  onRefresh?: () => void;
  onRebalanceWorkload?: (sourceId: string, targetId: string, hours: number) => void;
  onUpdateWorkSchedule?: (scheduleId: string, updates: Partial<WorkScheduleWithCapacity> & { userId?: string }) => Promise<void>;
  onUpdateAdminTime?: (userId: string, percentage: number) => Promise<void>;
  onPayrollClick?: (payrollId: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

interface TeamCapacityMetrics {
  totalTeamCapacity: number;
  totalAssignedHours: number;
  teamUtilization: number;
  availableCapacity: number;
  overallocatedMembers: number;
  underutilizedMembers: number;
}

interface ConsultantCapacityCardProps {
  member: TeamMember;
  capacity: ConsultantCapacity;
  conflicts: CapacityConflict[];
  onViewDetails: (memberId: string) => void;
  onRebalance: (memberId: string) => void;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const getPositionColor = (position: UserPosition): string => {
  switch (position) {
    case 'consultant': return 'bg-blue-100 text-blue-800';
    case 'senior_consultant': return 'bg-indigo-100 text-indigo-800';
    case 'manager': return 'bg-green-100 text-green-800';
    case 'senior_manager': return 'bg-emerald-100 text-emerald-800';
    case 'partner': return 'bg-purple-100 text-purple-800';
    case 'senior_partner': return 'bg-violet-100 text-violet-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPositionDisplayName = (position: UserPosition): string => {
  return position.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const calculateTeamMetrics = (capacities: ConsultantCapacity[]): TeamCapacityMetrics => {
  const totalTeamCapacity = capacities.reduce((sum, c) => sum + c.totalPayrollCapacity, 0);
  const totalAssignedHours = capacities.reduce((sum, c) => sum + c.currentlyAssignedHours, 0);
  const teamUtilization = totalTeamCapacity > 0 ? (totalAssignedHours / totalTeamCapacity) * 100 : 0;
  const availableCapacity = totalTeamCapacity - totalAssignedHours;
  const overallocatedMembers = capacities.filter(c => c.utilizationPercentage > 100).length;
  const underutilizedMembers = capacities.filter(c => c.utilizationPercentage < 60).length;

  return {
    totalTeamCapacity,
    totalAssignedHours,
    teamUtilization,
    availableCapacity,
    overallocatedMembers,
    underutilizedMembers
  };
};

// =============================================================================
// CONSULTANT CAPACITY CARD COMPONENT
// =============================================================================

export function ConsultantCapacityCard({ 
  member, 
  capacity, 
  conflicts, 
  onViewDetails, 
  onRebalance 
}: ConsultantCapacityCardProps) {
  const utilizationColor = getCapacityStatusColor(capacity.utilizationPercentage);
  const hasConflicts = conflicts.length > 0;
  const criticalConflicts = conflicts.filter(c => c.severity === 'critical' || c.severity === 'high');

  return (
    <Card className={`transition-all duration-200 ${hasConflicts ? 'ring-2 ring-orange-200' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={`/avatars/${member.id}.jpg`} />
              <AvatarFallback>
                {(member.computedName || `${member.firstName} ${member.lastName}`.trim()).split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-sm">{member.computedName || `${member.firstName} ${member.lastName}`.trim()}</h4>
              <Badge className={`${getPositionColor(member.position)} text-xs`}>
                {getPositionDisplayName(member.position)}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold ${utilizationColor.includes('red') ? 'text-red-600' : 
              utilizationColor.includes('yellow') ? 'text-yellow-600' : 
              utilizationColor.includes('green') ? 'text-green-600' : 'text-blue-600'}`}>
              {capacity.utilizationPercentage.toFixed(0)}%
            </div>
            <div className="text-xs text-muted-foreground">Utilization</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Capacity Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Total Capacity</span>
            <span className="font-medium">{capacity.totalPayrollCapacity.toFixed(1)}h</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Assigned</span>
            <span className="font-medium">{capacity.currentlyAssignedHours.toFixed(1)}h</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Available</span>
            <span className={`font-medium ${capacity.availableCapacityHours > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {capacity.availableCapacityHours.toFixed(1)}h
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-1">
            <Progress 
              value={Math.min(capacity.utilizationPercentage, 100)} 
              className="h-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Admin Time Info */}
        <div className="bg-gray-50 p-2 rounded text-xs">
          <div className="flex justify-between">
            <span>Admin Time:</span>
            <span>{capacity.adminTimePercentage.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Work Days:</span>
            <span>{capacity.processingWindowDays} days</span>
          </div>
        </div>

        {/* Conflicts Alert */}
        {hasConflicts && (
          <Alert className="py-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {criticalConflicts.length > 0 ? (
                <span className="text-red-600 font-medium">
                  {criticalConflicts.length} critical conflict(s)
                </span>
              ) : (
                <span className="text-orange-600">
                  {conflicts.length} scheduling conflict(s)
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(member.id)}
            className="flex-1 text-xs"
          >
            <User className="w-3 h-3 mr-1" />
            Details
          </Button>
          {(capacity.utilizationPercentage > 90 || capacity.utilizationPercentage < 50) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRebalance(member.id)}
              className="flex-1 text-xs"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Rebalance
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// TEAM METRICS OVERVIEW COMPONENT
// =============================================================================

interface TeamMetricsOverviewProps {
  metrics: TeamCapacityMetrics;
  teamSize: number;
}

export function TeamMetricsOverview({ metrics, teamSize }: TeamMetricsOverviewProps) {
  const utilizationStatus = metrics.teamUtilization <= 70 ? 'Under-utilized' :
    metrics.teamUtilization <= 85 ? 'Well-balanced' :
    metrics.teamUtilization <= 100 ? 'High utilization' : 'Overloaded';

  const statusColor = metrics.teamUtilization <= 70 ? 'text-blue-600' :
    metrics.teamUtilization <= 85 ? 'text-green-600' :
    metrics.teamUtilization <= 100 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{teamSize}</p>
              <p className="text-sm text-muted-foreground">Team Members</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{metrics.totalTeamCapacity.toFixed(0)}h</p>
              <p className="text-sm text-muted-foreground">Total Capacity</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className={`w-5 h-5 ${statusColor.replace('text-', '')}`} />
            <div>
              <p className={`text-2xl font-bold ${statusColor}`}>
                {metrics.teamUtilization.toFixed(0)}%
              </p>
              <p className="text-sm text-muted-foreground">Utilization</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-2xl font-bold text-green-600">
                {metrics.availableCapacity.toFixed(0)}h
              </p>
              <p className="text-sm text-muted-foreground">Available</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Summary */}
      <Card className="md:col-span-2">
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Team Status</span>
              <Badge className={statusColor.includes('red') ? 'bg-red-100 text-red-800' :
                statusColor.includes('yellow') ? 'bg-yellow-100 text-yellow-800' :
                statusColor.includes('green') ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                {utilizationStatus}
              </Badge>
            </div>
            <Progress value={Math.min(metrics.teamUtilization, 100)} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Under-utilized</span>
              <span>Optimal</span>
              <span>Overloaded</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Summary */}
      <Card className="md:col-span-2">
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">Attention Required</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-red-600 font-medium">{metrics.overallocatedMembers}</span>
                <span className="text-muted-foreground ml-1">Overloaded</span>
              </div>
              <div>
                <span className="text-blue-600 font-medium">{metrics.underutilizedMembers}</span>
                <span className="text-muted-foreground ml-1">Under-utilized</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// =============================================================================
// MEMBER DETAILS VIEW COMPONENT
// =============================================================================

interface MemberDetailsViewProps {
  member?: TeamMember;
  capacity?: ConsultantCapacity;
  onUpdateWorkSchedule: (scheduleId: string, updates: Partial<WorkScheduleWithCapacity>) => void;
  onUpdateAdminTime: (percentage: number) => void;
  onPayrollClick?: (payrollId: string) => void;
  onClose: () => void;
}

function MemberDetailsView({ 
  member, 
  capacity, 
  onUpdateWorkSchedule, 
  onUpdateAdminTime,
  onPayrollClick,
  onClose 
}: MemberDetailsViewProps) {
  const [editingSchedule, setEditingSchedule] = useState<string | null>(null);
  const [editingAdminTime, setEditingAdminTime] = useState(false);
  const [tempAdminPercentage, setTempAdminPercentage] = useState(member?.defaultAdminTimePercentage || 12.5);
  const [scheduleUpdates, setScheduleUpdates] = useState<Record<string, Partial<WorkScheduleWithCapacity>>>({});

  if (!member || !capacity) {
    return null;
  }

  const handleSaveSchedule = (scheduleId: string) => {
    const updates = scheduleUpdates[scheduleId];
    if (updates) {
      onUpdateWorkSchedule(scheduleId, updates);
      setEditingSchedule(null);
      setScheduleUpdates(prev => {
        const { [scheduleId]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleScheduleChange = (scheduleId: string, field: keyof WorkScheduleWithCapacity, value: any) => {
    setScheduleUpdates(prev => ({
      ...prev,
      [scheduleId]: {
        ...prev[scheduleId],
        [field]: value
      }
    }));
  };

  const handleSaveAdminTime = () => {
    onUpdateAdminTime(tempAdminPercentage);
    setEditingAdminTime(false);
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={`/avatars/${member.id}.jpg`} />
                <AvatarFallback>
                  {(member.computedName || `${member.firstName} ${member.lastName}`.trim()).split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{member.computedName || `${member.firstName} ${member.lastName}`.trim()}</h3>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getPositionColor(member.position)}`}>
                    {getPositionDisplayName(member.position)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{member.email}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Capacity Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Current Capacity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Hours</p>
              <p className="text-2xl font-bold">{capacity.totalWorkHours.toFixed(0)}h</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Admin Time</p>
              <p className="text-2xl font-bold">{capacity.totalAdminHours.toFixed(0)}h</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Payroll Capacity</p>
              <p className="text-2xl font-bold">{capacity.totalPayrollCapacity.toFixed(0)}h</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Utilization</p>
              <p className={`text-2xl font-bold ${
                capacity.utilizationPercentage > 100 ? 'text-red-600' :
                capacity.utilizationPercentage > 85 ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {capacity.utilizationPercentage.toFixed(0)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Time Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Admin Time Settings</CardTitle>
            {!editingAdminTime ? (
              <Button variant="outline" size="sm" onClick={() => setEditingAdminTime(true)}>
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => {
                  setEditingAdminTime(false);
                  setTempAdminPercentage(member.defaultAdminTimePercentage);
                }}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveAdminTime}>
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Default Admin Time Percentage</Label>
              {!editingAdminTime ? (
                <p className="text-2xl font-semibold mt-1">{member.defaultAdminTimePercentage}%</p>
              ) : (
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-4">
                    <Input
                      type="number"
                      min="0"
                      max="50"
                      step="2.5"
                      value={tempAdminPercentage}
                      onChange={(e) => setTempAdminPercentage(parseFloat(e.target.value) || 0)}
                      className="flex-1"
                    />
                    <span className="w-12 text-right font-medium">%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Recommended: {getPositionAdminPercentage(member.position)}% for {getPositionDisplayName(member.position)}
                  </p>
                </div>
              )}
            </div>
            <Alert>
              <Info className="w-4 h-4" />
              <AlertDescription>
                Admin time is automatically calculated for each work day unless manually overridden in the schedule below.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Work Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Work Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {daysOfWeek.map((day, index) => {
              const schedule = member.workSchedules.find(s => s.workDay === day);
              const isEditing = editingSchedule === (schedule?.id || `new-${index}`);
              const updates = scheduleUpdates[schedule?.id || `new-${index}`] || {};
              
              return (
                <div key={day} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{day}</h4>
                    {!isEditing ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setEditingSchedule(schedule?.id || `new-${index}`)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setEditingSchedule(null);
                            setScheduleUpdates(prev => {
                              const { [schedule?.id || `new-${index}`]: _, ...rest } = prev;
                              return rest;
                            });
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleSaveSchedule(schedule?.id || `new-${index}`)}
                        >
                          Save
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {!isEditing ? (
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Work Hours</p>
                        <p className="font-medium">{schedule?.workHours || 0}h</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Admin Time</p>
                        <p className="font-medium">
                          {schedule?.adminTimeHours || 0}h
                          {schedule?.usesDefaultAdminTime && (
                            <span className="text-xs text-muted-foreground ml-1">(auto)</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Payroll Capacity</p>
                        <p className="font-medium">{schedule?.payrollCapacityHours || 0}h</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Work Hours</Label>
                          <Input
                            type="number"
                            min="0"
                            max="12"
                            step="0.5"
                            value={updates.workHours ?? schedule?.workHours ?? 0}
                            onChange={(e) => handleScheduleChange(
                              schedule?.id || `new-${index}`, 
                              'workHours', 
                              parseFloat(e.target.value) || 0
                            )}
                          />
                        </div>
                        <div>
                          <Label>Admin Time Hours</Label>
                          <Input
                            type="number"
                            min="0"
                            max="12"
                            step="0.5"
                            value={updates.adminTimeHours ?? schedule?.adminTimeHours ?? 0}
                            onChange={(e) => handleScheduleChange(
                              schedule?.id || `new-${index}`, 
                              'adminTimeHours', 
                              parseFloat(e.target.value) || 0
                            )}
                            disabled={updates.usesDefaultAdminTime ?? schedule?.usesDefaultAdminTime}
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={updates.usesDefaultAdminTime ?? schedule?.usesDefaultAdminTime ?? true}
                          onCheckedChange={(checked) => handleScheduleChange(
                            schedule?.id || `new-${index}`, 
                            'usesDefaultAdminTime', 
                            checked
                          )}
                        />
                        <Label className="text-sm">Use default admin time percentage</Label>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Assigned Payrolls */}
      <Card>
        <CardHeader>
          <CardTitle>Assigned Payrolls ({member.assignedPayrolls.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {member.assignedPayrolls.length === 0 ? (
            <p className="text-muted-foreground">No payrolls currently assigned</p>
          ) : (
            <div className="space-y-2">
              {member.assignedPayrolls.map(payroll => (
                <div 
                  key={payroll.id} 
                  className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => onPayrollClick?.(payroll.id)}
                >
                  <div>
                    <p className="font-medium text-blue-600 hover:text-blue-800">{payroll.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {payroll.processingTime}h processing time
                    </p>
                  </div>
                  <Badge variant="outline">
                    {payroll.processingDaysBeforeEft} days before EFT
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// =============================================================================
// MAIN CAPACITY DASHBOARD COMPONENT
// =============================================================================

export function CapacityDashboard({ 
  teamMembers = [], 
  managerId, 
  dateRange, 
  onRefresh,
  onRebalanceWorkload,
  onUpdateWorkSchedule,
  onUpdateAdminTime,
  onPayrollClick,
  isLoading = false,
  error = null
}: CapacityDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [filterPosition, setFilterPosition] = useState<UserPosition | 'all'>('all');
  const [showConflictsOnly, setShowConflictsOnly] = useState(false);

  // Calculate capacities for all team members - must be called before any returns
  const teamCapacities = useMemo(() => {
    if (!teamMembers || teamMembers.length === 0) return [];
    return teamMembers.map(member => {
      const totalWorkHours = member.workSchedules.reduce((sum, s) => sum + s.workHours, 0);
      const totalAdminHours = member.workSchedules.reduce((sum, s) => sum + s.adminTimeHours, 0);
      const totalPayrollCapacity = member.workSchedules.reduce((sum, s) => sum + s.payrollCapacityHours, 0);
      const currentlyAssignedHours = member.assignedPayrolls.reduce((sum, p) => sum + p.processingTime, 0);
      const availableCapacityHours = Math.max(0, totalPayrollCapacity - currentlyAssignedHours);
      const utilizationPercentage = totalPayrollCapacity > 0 ? (currentlyAssignedHours / totalPayrollCapacity) * 100 : 0;
      const adminTimePercentage = totalWorkHours > 0 ? (totalAdminHours / totalWorkHours) * 100 : 0;
      const processingWindowDays = member.workSchedules.filter(s => s.workHours > 0).length;

      return {
        consultantId: member.id,
        member,
        capacity: {
          consultantId: member.id,
          totalWorkHours,
          totalAdminHours,
          totalPayrollCapacity,
          currentlyAssignedHours,
          availableCapacityHours,
          utilizationPercentage,
          adminTimePercentage,
          processingWindowDays
        } as ConsultantCapacity,
        conflicts: [] as CapacityConflict[] // Would be calculated based on actual conflicts
      };
    });
  }, [teamMembers]);

  // Filter team members
  const filteredCapacities = useMemo(() => {
    return teamCapacities.filter(item => {
      if (filterPosition !== 'all' && item.member.position !== filterPosition) return false;
      if (showConflictsOnly && item.conflicts.length === 0) return false;
      return true;
    });
  }, [teamCapacities, filterPosition, showConflictsOnly]);

  // Calculate team metrics
  const teamMetrics = useMemo(() => {
    return calculateTeamMetrics(teamCapacities.map(item => item.capacity));
  }, [teamCapacities]);

  // Show loading state
  if (isLoading) {
    return <CapacityDashboardSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <WifiOff className="w-16 h-16 mx-auto text-red-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Unable to Load Capacity Data</h3>
              <p className="text-gray-600 mt-1">{error}</p>
            </div>
            {onRefresh && (
              <Button onClick={onRefresh} variant="outline" className="mt-4">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show empty state
  if (!teamMembers || teamMembers.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <Users className="w-16 h-16 mx-auto text-gray-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">No Team Members Found</h3>
              <p className="text-gray-600 mt-1">
                No consultants are available for the selected date range. Try adjusting your filters or date range.
              </p>
            </div>
            {onRefresh && (
              <Button onClick={onRefresh} variant="outline" className="mt-4">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleViewDetails = (memberId: string) => {
    setSelectedMember(memberId);
    setActiveTab('details');
  };

  const handleRebalance = (memberId: string) => {
    // Implementation would show rebalancing modal
    console.log('Rebalance for member:', memberId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Capacity Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor and manage team workload distribution
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Team Metrics Overview */}
      <TeamMetricsOverview 
        metrics={teamMetrics} 
        teamSize={teamMembers.length} 
      />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Team Overview</TabsTrigger>
          <TabsTrigger value="capacity">Capacity Grid</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          {selectedMember && (
            <TabsTrigger value="details">Member Details</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <select
                value={filterPosition}
                onChange={(e) => setFilterPosition(e.target.value as UserPosition | 'all')}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="all">All Positions</option>
                <option value="consultant">Consultant</option>
                <option value="senior_consultant">Senior Consultant</option>
                <option value="manager">Manager</option>
                <option value="senior_manager">Senior Manager</option>
                <option value="partner">Partner</option>
                <option value="senior_partner">Senior Partner</option>
              </select>
            </div>
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={showConflictsOnly}
                onChange={(e) => setShowConflictsOnly(e.target.checked)}
                className="rounded"
              />
              <span>Show conflicts only</span>
            </label>
          </div>

          {/* Team Member Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCapacities.map(({ member, capacity, conflicts }) => (
              <ConsultantCapacityCard
                key={member.id}
                member={member}
                capacity={capacity}
                conflicts={conflicts}
                onViewDetails={handleViewDetails}
                onRebalance={handleRebalance}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="capacity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Capacity Grid View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Consultant</th>
                      <th className="text-left p-2">Position</th>
                      <th className="text-right p-2">Capacity</th>
                      <th className="text-right p-2">Assigned</th>
                      <th className="text-right p-2">Available</th>
                      <th className="text-right p-2">Utilization</th>
                      <th className="text-center p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCapacities.map(({ member, capacity }) => (
                      <tr key={member.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">
                                {(member.computedName || `${member.firstName} ${member.lastName}`.trim()).split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{member.computedName || `${member.firstName} ${member.lastName}`.trim()}</span>
                          </div>
                        </td>
                        <td className="p-2">
                          <Badge className={`${getPositionColor(member.position)} text-xs`}>
                            {getPositionDisplayName(member.position)}
                          </Badge>
                        </td>
                        <td className="text-right p-2 font-medium">
                          {capacity.totalPayrollCapacity.toFixed(1)}h
                        </td>
                        <td className="text-right p-2">
                          {capacity.currentlyAssignedHours.toFixed(1)}h
                        </td>
                        <td className="text-right p-2">
                          <span className={capacity.availableCapacityHours > 0 ? 'text-green-600' : 'text-red-600'}>
                            {capacity.availableCapacityHours.toFixed(1)}h
                          </span>
                        </td>
                        <td className="text-right p-2 font-medium">
                          {capacity.utilizationPercentage.toFixed(0)}%
                        </td>
                        <td className="text-center p-2">
                          <Badge className={getCapacityStatusColor(capacity.utilizationPercentage)}>
                            {formatCapacityUtilization(capacity.utilizationPercentage).split(' - ')[1]}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Utilization Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['0-50%', '51-75%', '76-90%', '91-100%', '100%+'].map(range => {
                    const count = teamCapacities.filter(item => {
                      const util = item.capacity.utilizationPercentage;
                      switch (range) {
                        case '0-50%': return util <= 50;
                        case '51-75%': return util > 50 && util <= 75;
                        case '76-90%': return util > 75 && util <= 90;
                        case '91-100%': return util > 90 && util <= 100;
                        case '100%+': return util > 100;
                        default: return false;
                      }
                    }).length;
                    
                    const percentage = teamCapacities.length > 0 ? (count / teamCapacities.length) * 100 : 0;
                    
                    return (
                      <div key={range} className="flex items-center justify-between">
                        <span className="text-sm">{range}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Position Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['consultant', 'senior_consultant', 'manager', 'senior_manager', 'partner', 'senior_partner'].map(pos => {
                    const members = teamCapacities.filter(item => item.member.position === pos);
                    const avgUtilization = members.length > 0 
                      ? members.reduce((sum, item) => sum + item.capacity.utilizationPercentage, 0) / members.length 
                      : 0;
                    
                    return (
                      <div key={pos} className="flex items-center justify-between">
                        <Badge className={`${getPositionColor(pos as UserPosition)} text-xs`}>
                          {getPositionDisplayName(pos as UserPosition)}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{members.length} members</span>
                          <span className="text-sm font-medium">
                            {avgUtilization.toFixed(0)}% avg
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {selectedMember && (
          <TabsContent value="details" className="space-y-4">
            {(() => {
              const memberData = teamCapacities.find(tc => tc.member.id === selectedMember);
              return memberData?.member && memberData?.capacity ? (
                <MemberDetailsView 
                  member={memberData.member}
                  capacity={memberData.capacity}
                  onUpdateWorkSchedule={async (scheduleId, updates) => {
                    if (onUpdateWorkSchedule && selectedMember) {
                      await onUpdateWorkSchedule(scheduleId, { ...updates, userId: selectedMember });
                    }
                  }}
                  onUpdateAdminTime={async (percentage) => {
                    if (onUpdateAdminTime && selectedMember) {
                      await onUpdateAdminTime(selectedMember, percentage);
                    }
                  }}
                  onPayrollClick={onPayrollClick}
                  onClose={() => {
                    setSelectedMember(null);
                    setActiveTab('overview');
                  }}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Member details not found</p>
                </div>
              );
            })()}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}