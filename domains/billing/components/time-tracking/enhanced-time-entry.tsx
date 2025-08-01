"use client";

import { useQuery, useMutation } from "@apollo/client";
import {
  Clock,
  Plus,
  Save,
  Calculator,
  DollarSign,
  User,
  Calendar,
  FileText,
  Timer,
  TrendingUp,
} from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// 6-minute increment options (professional time tracking standard)
const TIME_UNITS = [
  { units: 1, minutes: 6, display: "0.1 hrs (6 min)" },
  { units: 2, minutes: 12, display: "0.2 hrs (12 min)" },
  { units: 3, minutes: 18, display: "0.3 hrs (18 min)" },
  { units: 4, minutes: 24, display: "0.4 hrs (24 min)" },
  { units: 5, minutes: 30, display: "0.5 hrs (30 min)" },
  { units: 6, minutes: 36, display: "0.6 hrs (36 min)" },
  { units: 7, minutes: 42, display: "0.7 hrs (42 min)" },
  { units: 8, minutes: 48, display: "0.8 hrs (48 min)" },
  { units: 9, minutes: 54, display: "0.9 hrs (54 min)" },
  { units: 10, minutes: 60, display: "1.0 hrs (60 min)" },
  { units: 15, minutes: 90, display: "1.5 hrs (90 min)" },
  { units: 20, minutes: 120, display: "2.0 hrs (120 min)" },
  { units: 25, minutes: 150, display: "2.5 hrs (150 min)" },
  { units: 30, minutes: 180, display: "3.0 hrs (180 min)" },
  { units: 40, minutes: 240, display: "4.0 hrs (240 min)" },
  { units: 50, minutes: 300, display: "5.0 hrs (300 min)" },
  { units: 60, minutes: 360, display: "6.0 hrs (360 min)" },
  { units: 70, minutes: 420, display: "7.0 hrs (420 min)" },
  { units: 80, minutes: 480, display: "8.0 hrs (480 min)" },
];

// Validation schema
const timeEntrySchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  payrollId: z.string().optional(),
  workDate: z.string().min(1, "Work date is required"),
  timeUnits: z.number().min(1, "Time must be at least 6 minutes").max(240, "Maximum 24 hours per entry"),
  description: z.string().min(1, "Description is required"),
  isBillable: z.boolean().default(true),
  billingNotes: z.string().optional(),
});

type TimeEntryFormData = z.infer<typeof timeEntrySchema>;

interface Client {
  id: string;
  name: string;
}

interface Payroll {
  id: string;
  name: string;
  clientId: string;
}

interface TimeEntry {
  id: string;
  workDate: string;
  timeUnits: number;
  hoursSpent: number;
  billingRate: number;
  isBillable: boolean;
  description: string;
  billingNotes?: string;
  billableAmount: number;
  staffName: string;
  clientName: string;
  payrollName?: string;
}

const GET_CLIENTS_FOR_TIME = `
  query GetClientsForTime {
    clients(where: {active: {_eq: true}}, orderBy: {name: ASC}) {
      id
      name
    }
  }
`;

const GET_PAYROLLS_FOR_CLIENT = `
  query GetPayrollsForClient($clientId: uuid!) {
    payrolls(
      where: {clientId: {_eq: $clientId}, status: {_in: ["Active", "Processing"]}}
      orderBy: {createdAt: DESC}
    ) {
      id
      name
      clientId
    }
  }
`;

const GET_TIME_TRACKING_SUMMARY = `
  query GetTimeTrackingSummary(
    $startDate: date!
    $endDate: date!
    $staffUserId: uuid
    $clientId: uuid
  ) {
    timeTrackingSummary(
      where: {
        workDate: {_gte: $startDate, _lte: $endDate}
        staffUserId: {_eq: $staffUserId}
        clientId: {_eq: $clientId}
      }
      orderBy: {workDate: DESC}
    ) {
      id
      workDate
      timeUnits
      hoursSpent
      billingRate
      isBillable
      billableAmount
      description
      billingNotes
      staffName
      clientName
      payrollName
    }
  }
`;

const CREATE_TIME_ENTRY = `
  mutation CreateTimeEntryWithUnits($input: TimeEntriesInsertInput!) {
    insertTimeEntriesOne(object: $input) {
      id
      timeUnits
      hoursSpent
      billingRate
      billableAmount: hoursSpent
      createdAt
    }
  }
`;

export function EnhancedTimeEntry({ 
  staffUserId, 
  onTimeEntryCreated 
}: { 
  staffUserId: string; 
  onTimeEntryCreated?: () => void;
}) {
  const [selectedClient, setSelectedClient] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const form = useForm<TimeEntryFormData>({
    resolver: zodResolver(timeEntrySchema),
    defaultValues: {
      workDate: new Date().toISOString().split('T')[0],
      timeUnits: 10, // Default to 1 hour
      isBillable: true,
    },
  });

  // GraphQL queries
  const { data: clientsData, loading: clientsLoading } = useQuery(GET_CLIENTS_FOR_TIME);
  
  const { data: payrollsData, loading: payrollsLoading } = useQuery(GET_PAYROLLS_FOR_CLIENT, {
    variables: { clientId: form.watch("clientId") },
    skip: !form.watch("clientId"),
  });

  const { data: summaryData, loading: summaryLoading, refetch: refetchSummary } = useQuery(GET_TIME_TRACKING_SUMMARY, {
    variables: {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      staffUserId: staffUserId,
      clientId: selectedClient || null,
    },
    fetchPolicy: 'cache-and-network',
  });

  const [createTimeEntry, { loading: createLoading }] = useMutation(CREATE_TIME_ENTRY, {
    onCompleted: () => {
      toast.success("Time entry created successfully");
      form.reset({
        workDate: new Date().toISOString().split('T')[0],
        timeUnits: 10,
        isBillable: true,
      });
      refetchSummary();
      onTimeEntryCreated?.();
    },
    onError: (error) => {
      toast.error(`Error creating time entry: ${error.message}`);
    },
  });

  const clients: Client[] = clientsData?.clients || [];
  const payrolls: Payroll[] = payrollsData?.payrolls || [];
  const timeEntries: TimeEntry[] = summaryData?.timeTrackingSummary || [];

  // Calculate time and billing values
  const selectedTimeUnits = form.watch("timeUnits");
  const isBillable = form.watch("isBillable");
  
  const calculatedHours = useMemo(() => {
    return selectedTimeUnits ? (selectedTimeUnits / 10) : 0;
  }, [selectedTimeUnits]);

  const estimatedBillingRate = 240.00; // This would come from client service agreements
  
  const estimatedBillableAmount = useMemo(() => {
    return isBillable ? (calculatedHours * estimatedBillingRate) : 0;
  }, [calculatedHours, isBillable]);

  // Summary calculations
  const summaryStats = useMemo(() => {
    const totalUnits = timeEntries.reduce((sum, entry) => sum + entry.timeUnits, 0);
    const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hoursSpent, 0);
    const billableHours = timeEntries.filter(e => e.isBillable).reduce((sum, entry) => sum + entry.hoursSpent, 0);
    const totalBillableAmount = timeEntries.filter(e => e.isBillable).reduce((sum, entry) => sum + entry.billableAmount, 0);
    const utilizationRate = totalHours > 0 ? (billableHours / totalHours) * 100 : 0;

    return {
      totalUnits,
      totalHours,
      billableHours,
      totalBillableAmount,
      utilizationRate,
      entryCount: timeEntries.length,
    };
  }, [timeEntries]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const onSubmit = async (data: TimeEntryFormData) => {
    try {
      const timeEntryInput = {
        staffUserId: staffUserId,
        clientId: data.clientId,
        payrollId: data.payrollId || null,
        workDate: data.workDate,
        timeUnits: data.timeUnits,
        hoursSpent: data.timeUnits / 10, // Convert units to decimal hours
        description: data.description,
        isBillable: data.isBillable,
        billingNotes: data.billingNotes || null,
        billingRate: isBillable ? estimatedBillingRate : null,
      };

      await createTimeEntry({
        variables: { input: timeEntryInput }
      });
    } catch (error) {
      console.error("Error creating time entry:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Time Tracking</h2>
          <p className="text-muted-foreground">
            Professional time tracking with 6-minute precision
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Time Entry Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="w-5 h-5" />
                Log Time Entry
              </CardTitle>
              <CardDescription>
                Track time in professional 6-minute increments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="clientId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select client..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {clients.map((client) => (
                                <SelectItem key={client.id} value={client.id}>
                                  {client.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="payrollId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payroll (Optional)</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select payroll..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">No specific payroll</SelectItem>
                              {payrolls.map((payroll) => (
                                <SelectItem key={payroll.id} value={payroll.id}>
                                  {payroll.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="workDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Work Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="timeUnits"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time Spent</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(parseInt(value))} 
                            value={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select time..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-60">
                              {TIME_UNITS.map((option) => (
                                <SelectItem key={option.units} value={option.units.toString()}>
                                  {option.display}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the work performed..."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="isBillable"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Billable Time</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Mark this time as billable to client
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {isBillable && (
                      <FormField
                        control={form.control}
                        name="billingNotes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Billing Notes (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Additional notes for billing..."
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  {/* Time & Billing Summary */}
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Time Units</div>
                          <div className="font-medium">{selectedTimeUnits} units</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Decimal Hours</div>
                          <div className="font-medium">{calculatedHours.toFixed(1)} hrs</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Estimated Rate</div>
                          <div className="font-medium">
                            {isBillable ? formatCurrency(estimatedBillingRate) + "/hr" : "Non-billable"}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Billable Amount</div>
                          <div className="font-medium text-primary">
                            {formatCurrency(estimatedBillableAmount)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button type="submit" disabled={createLoading} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    {createLoading ? "Saving..." : "Log Time Entry"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Summary Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Time Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="clientFilter">Filter by Client</Label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger>
                    <SelectValue placeholder="All clients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All clients</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Entries</span>
                  <span className="font-medium">{summaryStats.entryCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Hours</span>
                  <span className="font-medium">{summaryStats.totalHours.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Billable Hours</span>
                  <span className="font-medium">{summaryStats.billableHours.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Utilization Rate</span>
                  <Badge variant={summaryStats.utilizationRate >= 80 ? "default" : "secondary"}>
                    {summaryStats.utilizationRate.toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Billable Value</span>
                  <span className="font-bold text-primary">
                    {formatCurrency(summaryStats.totalBillableAmount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Time Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Time Entries</CardTitle>
          <CardDescription>
            Your recent time entries with 6-minute precision tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          {summaryLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading entries...</p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Payroll</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Billable</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeEntries.slice(0, 10).map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {new Date(entry.workDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      {entry.clientName}
                    </TableCell>
                    <TableCell>
                      {entry.payrollName || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {entry.timeUnits} units
                        <div className="text-muted-foreground">
                          ({entry.hoursSpent.toFixed(1)} hrs)
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={entry.isBillable ? "default" : "secondary"}>
                        {entry.isBillable ? "Billable" : "Non-billable"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {entry.isBillable ? formatCurrency(entry.billableAmount) : "-"}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {entry.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}