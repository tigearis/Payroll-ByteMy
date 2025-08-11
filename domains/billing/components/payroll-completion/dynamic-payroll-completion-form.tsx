"use client";

import { useQuery, useMutation, gql } from "@apollo/client";
import { 
  Save, 
  Plus, 
  Minus,
  Calculator,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Package,
  DollarSign,
  FileText,
  Send
} from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

// GraphQL Queries
const GET_PAYROLL_COMPLETION_DATA = gql`
  query GetPayrollCompletionData($payrollDateId: uuid!) {
    payrollDates(where: { id: { _eq: $payrollDateId } }) {
      id
      original_eft_date
      adjusted_eft_date
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
              requires_quantity_input
              quantity_prompt
              seniority_multipliers
            }
          }
        }
      }
    }
    
    # Get existing service quantities for this payroll date
    payroll_service_quantities(where: { payroll_date_id: { _eq: $payrollDateId } }) {
      id
      service_id
      quantity
      notes
      service {
        name
        service_code
      }
    }
    
    # Get any existing billing items for this payroll date
    billing_items(where: { 
      payroll_date_id: { _eq: $payrollDateId }
      billing_tier: { _in: ["tier1", "immediate"] }
    }) {
      id
      service_code
      description
      quantity
      rate
      total_amount
      approval_status
    }
  }
`;

const GET_USER_TIME_ENTRIES = gql`
  query GetUserTimeEntries($payrollDateId: uuid!) {
    time_entries(where: {
      payroll_date_id: { _eq: $payrollDateId }
      is_billable_to_service: { _eq: true }
    }) {
      id
      staff_user_id
      hours_spent
      user_hourly_rate
      calculated_fee
      assigned_service_id
      description
      work_date
      staff_user {
        computed_name
        seniority_level
      }
      assigned_service {
        name
        service_code
        seniority_multipliers
      }
    }
  }
`;

const SAVE_PAYROLL_SERVICE_QUANTITIES = gql`
  mutation SavePayrollServiceQuantities($quantities: [payroll_service_quantities_insert_input!]!) {
    delete_payroll_service_quantities(where: { payroll_date_id: { _eq: $payrollDateId } }) {
      affected_rows
    }
    insert_payroll_service_quantities(objects: $quantities) {
      returning {
        id
        service_id
        quantity
      }
    }
  }
`;

const GENERATE_BILLING_ITEMS = gql`
  mutation GenerateBillingItems($input: GenerateBillingItemsInput!) {
    generateBillingItems(input: $input) {
      success
      itemsCreated
      totalAmount
      errors
    }
  }
`;

const UPDATE_PAYROLL_DATE_STATUS = gql`
  mutation UpdatePayrollDateStatus($payrollDateId: uuid!, $status: String!) {
    update_payroll_dates_by_pk(
      pk_columns: { id: $payrollDateId }
      _set: { status: $status }
    ) {
      id
      status
    }
  }
`;

// Types
interface PayrollDate {
  id: string;
  original_eft_date: string;
  adjusted_eft_date?: string;
  status: string;
  payroll: {
    id: string;
    name: string;
    client_id: string;
    client: {
      id: string;
      name: string;
      client_service_assignments: ClientServiceAssignment[];
    };
  };
}

interface ClientServiceAssignment {
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
    requires_quantity_input?: boolean;
    quantity_prompt?: string;
    seniority_multipliers?: any;
  };
}

interface ServiceQuantity {
  service_id: string;
  quantity: number;
  notes?: string;
  service?: {
    name: string;
    service_code: string;
  };
}

interface TimeEntry {
  id: string;
  staff_user_id: string;
  hours_spent: number;
  user_hourly_rate?: number;
  calculated_fee?: number;
  assigned_service_id?: string;
  description?: string;
  work_date: string;
  staff_user: {
    computed_name: string;
    seniority_level?: string;
  };
  assigned_service?: {
    name: string;
    service_code: string;
    seniority_multipliers?: any;
  };
}

interface CompletionFormData {
  serviceQuantities: Record<string, number>;
  serviceNotes: Record<string, string>;
  completionNotes: string;
  isCompleted: boolean;
}

interface DynamicPayrollCompletionFormProps {
  payrollDateId: string;
  onComplete?: (data: any) => void;
  onCancel?: () => void;
}

export function DynamicPayrollCompletionForm({ 
  payrollDateId, 
  onComplete, 
  onCancel 
}: DynamicPayrollCompletionFormProps) {
  const [formData, setFormData] = useState<CompletionFormData>({
    serviceQuantities: {},
    serviceNotes: {},
    completionNotes: "",
    isCompleted: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("services");

  // GraphQL hooks
  const { data: completionData, loading: completionLoading, refetch } = useQuery(GET_PAYROLL_COMPLETION_DATA, {
    variables: { payrollDateId }
  });
  
  const { data: timeEntriesData } = useQuery(GET_USER_TIME_ENTRIES, {
    variables: { payrollDateId }
  });

  const [saveQuantities] = useMutation(SAVE_PAYROLL_SERVICE_QUANTITIES);
  const [generateBillingItems] = useMutation(GENERATE_BILLING_ITEMS);
  const [updatePayrollStatus] = useMutation(UPDATE_PAYROLL_DATE_STATUS);

  const payrollDate: PayrollDate = completionData?.payrollDates[0];
  const existingQuantities: ServiceQuantity[] = completionData?.payroll_service_quantities || [];
  const existingBillingItems = completionData?.billing_items || [];
  const timeEntries: TimeEntry[] = timeEntriesData?.time_entries || [];

  // Initialize form data with existing quantities
  useEffect(() => {
    if (existingQuantities.length > 0) {
      const quantities: Record<string, number> = {};
      const notes: Record<string, string> = {};
      
      existingQuantities.forEach(eq => {
        quantities[eq.service_id] = eq.quantity;
        if (eq.notes) notes[eq.service_id] = eq.notes;
      });
      
      setFormData(prev => ({
        ...prev,
        serviceQuantities: quantities,
        serviceNotes: notes
      }));
    }
  }, [existingQuantities]);

  // Group services by category for better UX
  const servicesByCategory = useMemo(() => {
    if (!payrollDate?.payroll?.client?.client_service_assignments) return {};
    
    const grouped: Record<string, ClientServiceAssignment[]> = {};
    
    payrollDate.payroll.client.client_service_assignments.forEach(assignment => {
      const category = assignment.service.category;
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(assignment);
    });
    
    return grouped;
  }, [payrollDate]);

  // Calculate totals and fees
  const calculatedTotals = useMemo(() => {
    const totals = {
      totalServices: 0,
      totalQuantity: 0,
      estimatedAmount: 0,
      timeBasedAmount: 0,
      quantityBasedAmount: 0
    };

    if (!payrollDate) return totals;

    // Calculate quantity-based services
    payrollDate.payroll.client.client_service_assignments.forEach(assignment => {
      const quantity = formData.serviceQuantities[assignment.service.id] || 0;
      if (quantity > 0) {
        totals.totalServices++;
        totals.totalQuantity += quantity;
        
        const rate = assignment.custom_rate || assignment.service.base_rate || 0;
        totals.quantityBasedAmount += quantity * rate;
      }
    });

    // Calculate time-based services
    timeEntries.forEach(entry => {
      if (entry.calculated_fee) {
        totals.timeBasedAmount += entry.calculated_fee;
      }
    });

    totals.estimatedAmount = totals.quantityBasedAmount + totals.timeBasedAmount;
    
    return totals;
  }, [formData.serviceQuantities, payrollDate, timeEntries]);

  const handleQuantityChange = (serviceId: string, quantity: number) => {
    setFormData(prev => ({
      ...prev,
      serviceQuantities: {
        ...prev.serviceQuantities,
        [serviceId]: Math.max(0, quantity)
      }
    }));
  };

  const handleNotesChange = (serviceId: string, notes: string) => {
    setFormData(prev => ({
      ...prev,
      serviceNotes: {
        ...prev.serviceNotes,
        [serviceId]: notes
      }
    }));
  };

  const handleSaveQuantities = async () => {
    try {
      setIsSubmitting(true);

      // Prepare quantities for database
      const quantitiesToSave = Object.entries(formData.serviceQuantities)
        .filter(([_, quantity]) => quantity > 0)
        .map(([serviceId, quantity]) => ({
          payroll_date_id: payrollDateId,
          service_id: serviceId,
          quantity: quantity,
          notes: formData.serviceNotes[serviceId] || null,
          entered_by: "00000000-0000-0000-0000-000000000000" // TODO: Use actual user ID
        }));

      await saveQuantities({
        variables: {
          payrollDateId,
          quantities: quantitiesToSave
        }
      });

      toast.success("Service quantities saved successfully");
      refetch();
    } catch (error: any) {
      toast.error(`Failed to save quantities: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateBilling = async () => {
    try {
      setIsSubmitting(true);

      // First save quantities
      await handleSaveQuantities();

      // Then generate billing items
      const result = await generateBillingItems({
        variables: {
          input: {
            payrollDateId,
            generateFromQuantities: true,
            generateFromTimeEntries: true,
            approvalLevel: "auto",
            notes: formData.completionNotes
          }
        }
      });

      if (result.data?.generateBillingItems?.success) {
        toast.success(
          `Generated ${result.data.generateBillingItems.itemsCreated} billing items totaling $${result.data.generateBillingItems.totalAmount?.toFixed(2) || 0}`
        );
        refetch();
      } else {
        toast.error("Failed to generate billing items");
      }
    } catch (error: any) {
      toast.error(`Failed to generate billing: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompletePayroll = async () => {
    try {
      setIsSubmitting(true);

      // Save quantities and generate billing
      await handleGenerateBilling();

      // Update payroll status to completed
      await updatePayrollStatus({
        variables: {
          payrollDateId,
          status: "completed"
        }
      });

      toast.success("Payroll completion process finished");
      
      if (onComplete) {
        onComplete({
          payrollDateId,
          totals: calculatedTotals,
          notes: formData.completionNotes
        });
      }
    } catch (error: any) {
      toast.error(`Failed to complete payroll: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (completionLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading payroll completion form...</p>
        </div>
      </div>
    );
  }

  if (!payrollDate) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Payroll date not found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payroll Completion</h1>
          <p className="text-muted-foreground">
            {payrollDate.payroll.name} - {payrollDate.payroll.client.name}
          </p>
          <p className="text-sm text-muted-foreground">
            EFT Date: {new Date(payrollDate.adjusted_eft_date || payrollDate.original_eft_date).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={payrollDate.status === "completed" ? "default" : "secondary"}>
            {payrollDate.status}
          </Badge>
          {existingBillingItems.length > 0 && (
            <Badge variant="outline" className="bg-green-100 text-green-800">
              {existingBillingItems.length} items billed
            </Badge>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services Used</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculatedTotals.totalServices}</div>
            <p className="text-xs text-muted-foreground">
              Total quantity: {calculatedTotals.totalQuantity}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Entries</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timeEntries.length}</div>
            <p className="text-xs text-muted-foreground">
              ${calculatedTotals.timeBasedAmount.toFixed(2)} in fees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${calculatedTotals.estimatedAmount.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Quantity + Time based
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Billing Status</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {existingBillingItems.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Items generated
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="services">Service Quantities</TabsTrigger>
          <TabsTrigger value="time">Time Entries</TabsTrigger>
          <TabsTrigger value="review">Review & Complete</TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Service Quantities
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Enter quantities for services used in this payroll
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(servicesByCategory).map(([category, services]) => (
                  <div key={category} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold capitalize">{category}</h3>
                      <Badge variant="outline" className="text-xs">
                        {services.length} service{services.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    
                    <div className="grid gap-4">
                      {services.map(assignment => {
                        const service = assignment.service;
                        const currentQuantity = formData.serviceQuantities[service.id] || 0;
                        const currentNotes = formData.serviceNotes[service.id] || "";
                        const effectiveRate = assignment.custom_rate || service.base_rate || 0;
                        
                        return (
                          <div key={service.id} className="p-4 border rounded-lg space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="font-medium">{service.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {service.service_code}
                                </div>
                                {service.requires_quantity_input && service.quantity_prompt && (
                                  <div className="text-sm text-blue-600">
                                    {service.quantity_prompt}
                                  </div>
                                )}
                              </div>
                              
                              <div className="text-right">
                                <div className="font-medium">
                                  ${effectiveRate.toFixed(2)}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {service.billing_unit || 'per unit'}
                                </div>
                                {assignment.custom_rate && (
                                  <Badge variant="outline" className="bg-orange-100 text-orange-800 text-xs">
                                    Custom Rate
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleQuantityChange(service.id, currentQuantity - 1)}
                                  disabled={currentQuantity <= 0}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                
                                <Input
                                  type="number"
                                  min="0"
                                  value={currentQuantity}
                                  onChange={(e) => handleQuantityChange(service.id, parseInt(e.target.value) || 0)}
                                  className="w-20 text-center"
                                />
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleQuantityChange(service.id, currentQuantity + 1)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <div className="flex-1">
                                <Input
                                  placeholder="Optional notes for this service"
                                  value={currentNotes}
                                  onChange={(e) => handleNotesChange(service.id, e.target.value)}
                                />
                              </div>
                              
                              <div className="text-right min-w-24">
                                <div className="font-medium">
                                  ${(currentQuantity * effectiveRate).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Time Entries
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Review time-based billing for this payroll
              </p>
            </CardHeader>
            <CardContent>
              {timeEntries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No time entries found for this payroll</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {timeEntries.map(entry => (
                    <div key={entry.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="font-medium">{entry.staff_user.computed_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(entry.work_date).toLocaleDateString()}
                          </div>
                          {entry.assigned_service && (
                            <Badge variant="outline" className="text-xs">
                              {entry.assigned_service.name}
                            </Badge>
                          )}
                          {entry.description && (
                            <div className="text-sm text-gray-600">
                              {entry.description}
                            </div>
                          )}
                        </div>
                        
                        <div className="text-right space-y-1">
                          <div className="font-medium">
                            {entry.hours_spent} hours
                          </div>
                          {entry.user_hourly_rate && (
                            <div className="text-sm text-muted-foreground">
                              ${entry.user_hourly_rate.toFixed(2)}/hr
                            </div>
                          )}
                          {entry.calculated_fee && (
                            <div className="font-medium text-green-600">
                              ${entry.calculated_fee.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center font-medium">
                    <span>Time-based Total:</span>
                    <span className="text-green-600">
                      ${calculatedTotals.timeBasedAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Review & Complete
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Final review before completing payroll and generating billing
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Summary */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">Quantity-based Services</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Services:</span>
                        <span>{calculatedTotals.totalServices}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Quantity:</span>
                        <span>{calculatedTotals.totalQuantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${calculatedTotals.quantityBasedAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Time-based Services</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Time Entries:</span>
                        <span>{timeEntries.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Hours:</span>
                        <span>{timeEntries.reduce((sum, entry) => sum + entry.hours_spent, 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${calculatedTotals.timeBasedAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Estimated Total:</span>
                  <span className="text-green-600">
                    ${calculatedTotals.estimatedAmount.toFixed(2)}
                  </span>
                </div>
                
                <div>
                  <Label htmlFor="completionNotes">Completion Notes</Label>
                  <Textarea
                    id="completionNotes"
                    value={formData.completionNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, completionNotes: e.target.value }))}
                    placeholder="Optional notes about this payroll completion"
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <div>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSaveQuantities}
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Quantities
          </Button>
          
          <Button
            variant="outline"
            onClick={handleGenerateBilling}
            disabled={isSubmitting || calculatedTotals.estimatedAmount === 0}
          >
            <Calculator className="h-4 w-4 mr-2" />
            Generate Billing
          </Button>
          
          <Button
            onClick={handleCompletePayroll}
            disabled={isSubmitting || calculatedTotals.estimatedAmount === 0}
          >
            <Send className="h-4 w-4 mr-2" />
            {payrollDate.status === "completed" ? "Update Completion" : "Complete Payroll"}
          </Button>
        </div>
      </div>
    </div>
  );
}