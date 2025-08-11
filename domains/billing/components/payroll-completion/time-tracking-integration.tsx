"use client";

import { useQuery, useMutation, gql } from "@apollo/client";
import { 
  Clock,
  Plus,
  Edit,
  Trash2,
  Save,
  Calculator,
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Package,
  Play,
  Pause,
  StopCircle
} from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

// GraphQL Queries
const GET_PAYROLL_TIME_ENTRIES = gql`
  query GetPayrollTimeEntries($payrollDateId: uuid!) {
    time_entries(
      where: { payroll_date_id: { _eq: $payrollDateId } }
      order_by: { work_date: desc, created_at: desc }
    ) {
      id
      staff_user_id
      payroll_date_id
      assigned_service_id
      work_date
      hours_spent
      description
      is_billable_to_service
      user_hourly_rate
      calculated_fee
      seniority_multiplier_applied
      created_at
      updated_at
      staff_user {
        id
        computed_name
        first_name
        last_name
        seniority_level
        current_hourly_rate
      }
      assigned_service {
        id
        name
        service_code
        category
        base_rate
        billing_unit
        charge_basis
        seniority_multipliers
      }
      payroll_date {
        id
        payroll {
          id
          name
          client {
            id
            name
          }
        }
      }
      created_by_user {
        computed_name
      }
    }
  }
`;

const GET_TIME_TRACKING_CONTEXT = gql`
  query GetTimeTrackingContext($payrollDateId: uuid!) {
    payrollDates(where: { id: { _eq: $payrollDateId } }) {
      id
      status
      payroll {
        id
        name
        client_id
        client {
          id
          name
          client_service_assignments(where: { is_active: { _eq: true } }) {
            id
            custom_rate
            service {
              id
              name
              service_code
              category
              base_rate
              billing_unit
              charge_basis
              seniority_multipliers
            }
          }
        }
      }
    }
    
    # Get all active users who can log time
    users(
      where: { 
        is_active: { _eq: true }
        current_hourly_rate: { _is_null: false }
      }
      order_by: { computed_name: asc }
    ) {
      id
      computed_name
      first_name
      last_name
      seniority_level
      current_hourly_rate
    }
  }
`;

const GET_TIME_ENTRY_STATISTICS = gql`
  query GetTimeEntryStatistics($payrollDateId: uuid!) {
    timeEntriesAggregate: time_entries_aggregate(
      where: { payroll_date_id: { _eq: $payrollDateId } }
    ) {
      aggregate {
        count
        sum {
          hours_spent
          calculated_fee
        }
        avg {
          hours_spent
          calculated_fee
        }
      }
    }
    
    billableEntriesAggregate: time_entries_aggregate(
      where: { 
        payroll_date_id: { _eq: $payrollDateId }
        is_billable_to_service: { _eq: true }
      }
    ) {
      aggregate {
        count
        sum {
          hours_spent
          calculated_fee
        }
      }
    }
    
    entriesByUser: time_entries_aggregate(
      where: { payroll_date_id: { _eq: $payrollDateId } }
      group_by: staff_user_id
    ) {
      nodes {
        staff_user_id
        staff_user {
          computed_name
        }
      }
      aggregate {
        sum {
          hours_spent
          calculated_fee
        }
      }
    }
  }
`;

const CREATE_TIME_ENTRY = gql`
  mutation CreateTimeEntry($input: time_entries_insert_input!) {
    insert_time_entries_one(object: $input) {
      id
      hours_spent
      calculated_fee
      staff_user {
        computed_name
      }
      assigned_service {
        name
      }
    }
  }
`;

const UPDATE_TIME_ENTRY = gql`
  mutation UpdateTimeEntry($id: uuid!, $input: time_entries_set_input!) {
    update_time_entries_by_pk(pk_columns: { id: $id }, _set: $input) {
      id
      hours_spent
      calculated_fee
    }
  }
`;

const DELETE_TIME_ENTRY = gql`
  mutation DeleteTimeEntry($id: uuid!) {
    delete_time_entries_by_pk(id: $id) {
      id
      staff_user {
        computed_name
      }
    }
  }
`;

const RECALCULATE_TIME_ENTRY_FEES = gql`
  mutation RecalculateTimeEntryFees($payrollDateId: uuid!) {
    recalculateTimeEntryFees(payrollDateId: $payrollDateId) {
      success
      entriesUpdated
      totalFees
    }
  }
`;

// Types
interface TimeEntry {
  id: string;
  staff_user_id: string;
  payroll_date_id: string;
  assigned_service_id?: string;
  work_date: string;
  hours_spent: number;
  description?: string;
  is_billable_to_service: boolean;
  user_hourly_rate?: number;
  calculated_fee?: number;
  seniority_multiplier_applied?: number;
  created_at: string;
  updated_at: string;
  staff_user: {
    id: string;
    computed_name: string;
    first_name: string;
    last_name: string;
    seniority_level?: string;
    current_hourly_rate?: number;
  };
  assigned_service?: {
    id: string;
    name: string;
    service_code: string;
    category: string;
    base_rate?: number;
    billing_unit?: string;
    charge_basis: string;
    seniority_multipliers?: any;
  };
  payroll_date: {
    id: string;
    payroll: {
      id: string;
      name: string;
      client: {
        id: string;
        name: string;
      };
    };
  };
  created_by_user?: {
    computed_name: string;
  };
}

interface User {
  id: string;
  computed_name: string;
  first_name: string;
  last_name: string;
  seniority_level?: string;
  current_hourly_rate?: number;
}

interface ServiceAssignment {
  id: string;
  custom_rate?: number;
  service: {
    id: string;
    name: string;
    service_code: string;
    category: string;
    base_rate?: number;
    billing_unit?: string;
    charge_basis: string;
    seniority_multipliers?: any;
  };
}

interface TimeEntryFormData {
  staff_user_id: string;
  assigned_service_id?: string;
  work_date: string;
  hours_spent: number;
  description?: string;
  is_billable_to_service: boolean;
}

interface TimeTrackingIntegrationProps {
  payrollDateId: string;
  onTimeEntriesUpdate?: (entries: TimeEntry[]) => void;
  currentUserId?: string;
}

export function TimeTrackingIntegration({ 
  payrollDateId,
  onTimeEntriesUpdate,
  currentUserId = "00000000-0000-0000-0000-000000000000"
}: TimeTrackingIntegrationProps) {
  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [filterUser, setFilterUser] = useState("all");
  const [filterBillable, setFilterBillable] = useState("all");
  const [activeTab, setActiveTab] = useState("entries");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerStartTime, setTimerStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [formData, setFormData] = useState<TimeEntryFormData>({
    staff_user_id: "",
    work_date: new Date().toISOString().split('T')[0],
    hours_spent: 0,
    is_billable_to_service: true
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerStartTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - timerStartTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerStartTime]);

  // GraphQL hooks
  const { data: timeEntriesData, loading: timeEntriesLoading, refetch } = useQuery(GET_PAYROLL_TIME_ENTRIES, {
    variables: { payrollDateId }
  });
  
  const { data: contextData } = useQuery(GET_TIME_TRACKING_CONTEXT, {
    variables: { payrollDateId }
  });
  
  const { data: statsData } = useQuery(GET_TIME_ENTRY_STATISTICS, {
    variables: { payrollDateId }
  });

  const [createTimeEntry] = useMutation(CREATE_TIME_ENTRY);
  const [updateTimeEntry] = useMutation(UPDATE_TIME_ENTRY);
  const [deleteTimeEntry] = useMutation(DELETE_TIME_ENTRY);
  const [recalculateTimeEntryFees] = useMutation(RECALCULATE_TIME_ENTRY_FEES);

  const timeEntries: TimeEntry[] = timeEntriesData?.time_entries || [];
  const payrollDate = contextData?.payrollDates?.[0];
  const availableUsers: User[] = contextData?.users || [];
  const availableServices: ServiceAssignment[] = payrollDate?.payroll?.client?.client_service_assignments || [];

  // Update parent component when time entries change
  useEffect(() => {
    if (onTimeEntriesUpdate) {
      onTimeEntriesUpdate(timeEntries);
    }
  }, [timeEntries, onTimeEntriesUpdate]);

  // Filter time entries
  const filteredEntries = useMemo(() => {
    return timeEntries.filter(entry => {
      const matchesUser = filterUser === "all" || entry.staff_user_id === filterUser;
      const matchesBillable = filterBillable === "all" || 
                            (filterBillable === "billable" && entry.is_billable_to_service) ||
                            (filterBillable === "non-billable" && !entry.is_billable_to_service);
      
      return matchesUser && matchesBillable;
    });
  }, [timeEntries, filterUser, filterBillable]);

  // Statistics
  const totalEntries = statsData?.timeEntriesAggregate?.aggregate?.count || 0;
  const totalHours = statsData?.timeEntriesAggregate?.aggregate?.sum?.hours_spent || 0;
  const totalFees = statsData?.timeEntriesAggregate?.aggregate?.sum?.calculated_fee || 0;
  const billableEntries = statsData?.billableEntriesAggregate?.aggregate?.count || 0;
  const billableHours = statsData?.billableEntriesAggregate?.aggregate?.sum?.hours_spent || 0;
  const billableFees = statsData?.billableEntriesAggregate?.aggregate?.sum?.calculated_fee || 0;
  const avgHours = statsData?.timeEntriesAggregate?.aggregate?.avg?.hours_spent || 0;

  const calculateFee = (userId: string, serviceId?: string, hours: number = 0) => {
    const user = availableUsers.find(u => u.id === userId);
    const service = serviceId ? availableServices.find(s => s.service.id === serviceId) : null;
    
    if (!user?.current_hourly_rate || hours <= 0) return 0;
    
    const baseRate = user.current_hourly_rate;
    let multiplier = 1;
    
    // Apply seniority multiplier if service has them
    if (service?.service.seniority_multipliers && user.seniority_level) {
      const multipliers = service.service.seniority_multipliers;
      multiplier = multipliers[user.seniority_level] || 1;
    }
    
    return baseRate * multiplier * hours;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = () => {
    setTimerStartTime(new Date());
    setIsTimerRunning(true);
    setElapsedTime(0);
  };

  const handleStopTimer = () => {
    if (timerStartTime) {
      const hours = elapsedTime / 3600;
      setFormData(prev => ({ ...prev, hours_spent: Math.round(hours * 100) / 100 }));
    }
    setIsTimerRunning(false);
    setTimerStartTime(null);
    setElapsedTime(0);
  };

  const handleCreateTimeEntry = async () => {
    try {
      const user = availableUsers.find(u => u.id === formData.staff_user_id);
      const calculatedFee = formData.is_billable_to_service ? 
        calculateFee(formData.staff_user_id, formData.assigned_service_id, formData.hours_spent) : 0;
      
      await createTimeEntry({
        variables: {
          input: {
            staff_user_id: formData.staff_user_id,
            payroll_date_id: payrollDateId,
            assigned_service_id: formData.assigned_service_id || null,
            work_date: formData.work_date,
            hours_spent: formData.hours_spent,
            description: formData.description || null,
            is_billable_to_service: formData.is_billable_to_service,
            user_hourly_rate: user?.current_hourly_rate || null,
            calculated_fee: calculatedFee,
            created_by: currentUserId
          }
        }
      });

      toast.success(`Time entry created for ${user?.computed_name}`);
      
      setIsCreateDialogOpen(false);
      setFormData({
        staff_user_id: "",
        work_date: new Date().toISOString().split('T')[0],
        hours_spent: 0,
        is_billable_to_service: true
      });
      refetch();
    } catch (error: any) {
      toast.error(`Failed to create time entry: ${error.message}`);
    }
  };

  const handleEditTimeEntry = (entry: TimeEntry) => {
    setSelectedEntry(entry);
    const newFormData: TimeEntryFormData = {
      staff_user_id: entry.staff_user_id,
      work_date: entry.work_date,
      hours_spent: entry.hours_spent,
      is_billable_to_service: entry.is_billable_to_service
    };
    
    if (entry.assigned_service_id) {
      newFormData.assigned_service_id = entry.assigned_service_id;
    }
    
    if (entry.description) {
      newFormData.description = entry.description;
    }
    
    setFormData(newFormData);
    setIsEditDialogOpen(true);
  };

  const handleUpdateTimeEntry = async () => {
    if (!selectedEntry) return;

    try {
      const calculatedFee = formData.is_billable_to_service ? 
        calculateFee(formData.staff_user_id, formData.assigned_service_id, formData.hours_spent) : 0;
      
      await updateTimeEntry({
        variables: {
          id: selectedEntry.id,
          input: {
            assigned_service_id: formData.assigned_service_id || null,
            work_date: formData.work_date,
            hours_spent: formData.hours_spent,
            description: formData.description || null,
            is_billable_to_service: formData.is_billable_to_service,
            calculated_fee: calculatedFee
          }
        }
      });

      toast.success("Time entry updated successfully");
      setIsEditDialogOpen(false);
      setSelectedEntry(null);
      refetch();
    } catch (error: any) {
      toast.error(`Failed to update time entry: ${error.message}`);
    }
  };

  const handleDeleteTimeEntry = async (entry: TimeEntry) => {
    if (!confirm(`Delete time entry for ${entry.staff_user.computed_name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteTimeEntry({
        variables: { id: entry.id }
      });

      toast.success(`Time entry for ${entry.staff_user.computed_name} deleted`);
      refetch();
    } catch (error: any) {
      toast.error(`Failed to delete time entry: ${error.message}`);
    }
  };

  const handleRecalculateFees = async () => {
    try {
      const result = await recalculateTimeEntryFees({
        variables: { payrollDateId }
      });

      if (result.data?.recalculateTimeEntryFees?.success) {
        toast.success(
          `Recalculated ${result.data.recalculateTimeEntryFees.entriesUpdated} entries. Total: $${result.data.recalculateTimeEntryFees.totalFees?.toFixed(2)}`
        );
        refetch();
      }
    } catch (error: any) {
      toast.error(`Failed to recalculate fees: ${error.message}`);
    }
  };

  const TimeEntryForm = ({ isEditing = false }: { isEditing?: boolean }) => (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="staff_user_id">Staff Member *</Label>
          <Select 
            value={formData.staff_user_id} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, staff_user_id: value }))}
            disabled={isEditing}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select staff member" />
            </SelectTrigger>
            <SelectContent>
              {availableUsers.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{user.computed_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.seniority_level && (
                        <Badge variant="outline" className="text-xs">
                          {user.seniority_level}
                        </Badge>
                      )}
                      {user.current_hourly_rate && (
                        <span className="text-xs text-muted-foreground">
                          ${user.current_hourly_rate}/hr
                        </span>
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="work_date">Work Date *</Label>
            <Input
              id="work_date"
              type="date"
              value={formData.work_date}
              onChange={(e) => setFormData(prev => ({ ...prev, work_date: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="hours_spent">Hours Spent *</Label>
            <div className="flex gap-2">
              <Input
                id="hours_spent"
                type="number"
                step="0.25"
                min="0"
                value={formData.hours_spent}
                onChange={(e) => setFormData(prev => ({ ...prev, hours_spent: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
              />
              {!isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={isTimerRunning ? handleStopTimer : handleStartTimer}
                  className="px-3"
                >
                  {isTimerRunning ? <StopCircle className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              )}
            </div>
            {isTimerRunning && (
              <div className="text-sm text-muted-foreground mt-1">
                Timer: {formatTime(elapsedTime)}
              </div>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="assigned_service_id">Assigned Service (Optional)</Label>
          <Select 
            value={formData.assigned_service_id || ""} 
            onValueChange={(value) => {
              const newFormData = { ...formData };
              if (value) {
                newFormData.assigned_service_id = value;
              } else {
                delete newFormData.assigned_service_id;
              }
              setFormData(newFormData);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select service (for billable time)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No specific service</SelectItem>
              {availableServices.map(assignment => (
                <SelectItem key={assignment.service.id} value={assignment.service.id}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <span>{assignment.service.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {assignment.service.category}
                      </Badge>
                      {assignment.service.base_rate && (
                        <span className="text-xs text-muted-foreground">
                          ${assignment.service.base_rate}
                        </span>
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the work performed"
            rows={3}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Billable to Service</Label>
            <p className="text-sm text-muted-foreground">
              Should this time be billed to the client?
            </p>
          </div>
          <Switch
            checked={formData.is_billable_to_service}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_billable_to_service: checked }))}
          />
        </div>

        {formData.staff_user_id && formData.hours_spent > 0 && formData.is_billable_to_service && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Fee Calculation Preview</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Hours</div>
                <div className="font-medium">{formData.hours_spent}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Calculated Fee</div>
                <div className="font-medium text-green-700">
                  ${calculateFee(formData.staff_user_id, formData.assigned_service_id, formData.hours_spent).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (timeEntriesLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading time tracking data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Time Tracking Integration</h2>
          <p className="text-muted-foreground">
            {payrollDate ? 
              `${payrollDate.payroll.name} - ${payrollDate.payroll.client.name}` : 
              "Manage time entries and automatic fee calculation"
            }
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRecalculateFees}>
            <Calculator className="h-4 w-4 mr-2" />
            Recalculate Fees
          </Button>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Log Time
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Log Time Entry</DialogTitle>
              </DialogHeader>
              <TimeEntryForm />
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateTimeEntry} 
                  disabled={!formData.staff_user_id || formData.hours_spent <= 0}
                >
                  Log Time
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEntries}</div>
            <p className="text-xs text-muted-foreground">
              {totalHours.toFixed(2)} hours logged
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Billable Time</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{billableEntries}</div>
            <p className="text-xs text-muted-foreground">
              {billableHours.toFixed(2)} billable hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalFees.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              ${billableFees.toFixed(2)} billable
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Entry</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgHours.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">
              Per time entry
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Time Entries
            </CardTitle>
            
            <div className="flex gap-4">
              <Select value={filterUser} onValueChange={setFilterUser}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {availableUsers.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.computed_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterBillable} onValueChange={setFilterBillable}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Billable" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="billable">Billable</SelectItem>
                  <SelectItem value="non-billable">Non-billable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Time Entries</h3>
              <p>No time entries have been logged for this payroll.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Work Date</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Fee Calculation</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{entry.staff_user.computed_name}</div>
                          {entry.staff_user.seniority_level && (
                            <Badge variant="outline" className="text-xs">
                              {entry.staff_user.seniority_level}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm">
                          {new Date(entry.work_date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {entry.assigned_service ? (
                          <div className="space-y-1">
                            <div className="font-medium">{entry.assigned_service.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {entry.assigned_service.service_code}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {entry.assigned_service.category}
                            </Badge>
                          </div>
                        ) : (
                          <div className="text-muted-foreground">No specific service</div>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <div className="font-medium">{entry.hours_spent}</div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          {entry.user_hourly_rate && (
                            <div className="text-sm text-muted-foreground">
                              ${entry.user_hourly_rate}/hr
                            </div>
                          )}
                          {entry.seniority_multiplier_applied && entry.seniority_multiplier_applied !== 1 && (
                            <div className="text-xs text-blue-600">
                              ×{entry.seniority_multiplier_applied} multiplier
                            </div>
                          )}
                          <div className="font-medium">
                            ${(entry.calculated_fee || 0).toFixed(2)}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {entry.is_billable_to_service ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-green-600">Billable</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4 text-gray-600" />
                              <span className="text-gray-600">Non-billable</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm max-w-xs truncate">
                          {entry.description || "No description"}
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTimeEntry(entry)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTimeEntry(entry)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Time Entry Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Edit Time Entry: {selectedEntry?.staff_user.computed_name}
            </DialogTitle>
          </DialogHeader>
          <TimeEntryForm isEditing={true} />
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTimeEntry}>
              Update Time Entry
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}