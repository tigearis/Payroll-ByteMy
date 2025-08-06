"use client";

import { useQuery, useMutation, gql } from "@apollo/client";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Package,
  TrendingUp,
  Shield
} from "lucide-react";
import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { gql } from "@apollo/client";

// GraphQL Queries
const GET_PAYROLL_SERVICE_OVERRIDES = gql`
  query GetPayrollServiceOverrides($payrollDateId: uuid!) {
    payroll_service_overrides(
      where: { payroll_date_id: { _eq: $payrollDateId } }
      order_by: { created_at: desc }
    ) {
      id
      payroll_date_id
      service_id
      original_rate
      override_rate
      override_reason
      quantity_override
      original_quantity
      approved_by_user_id
      is_approved
      created_at
      updated_at
      service {
        id
        name
        service_code
        category
        base_rate
        billing_unit
        charge_basis
      }
      created_by_user {
        id
        computed_name
        seniority_level
      }
      approved_by_user {
        id
        computed_name
      }
      payroll_date {
        id
        status
        payroll {
          id
          name
          client {
            id
            name
          }
        }
      }
    }
  }
`;

const GET_PAYROLL_AVAILABLE_SERVICES = gql`
  query GetPayrollAvailableServices($payrollDateId: uuid!) {
    payrollDates(where: { id: { _eq: $payrollDateId } }) {
      id
      payroll {
        client_id
        client {
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
    
    # Get existing quantities for context
    payroll_service_quantities(where: { payroll_date_id: { _eq: $payrollDateId } }) {
      id
      service_id
      quantity
      service {
        id
        name
        service_code
      }
    }
  }
`;

const GET_OVERRIDE_STATISTICS = gql`
  query GetOverrideStatistics($payrollDateId: uuid!) {
    overridesAggregate: payroll_service_overrides_aggregate(
      where: { payroll_date_id: { _eq: $payrollDateId } }
    ) {
      aggregate {
        count
        avg {
          override_rate
        }
        sum {
          override_rate
        }
      }
    }
    
    approvedOverridesAggregate: payroll_service_overrides_aggregate(
      where: { 
        payroll_date_id: { _eq: $payrollDateId }
        is_approved: { _eq: true }
      }
    ) {
      aggregate {
        count
        sum {
          override_rate
        }
      }
    }
    
    pendingOverridesAggregate: payroll_service_overrides_aggregate(
      where: { 
        payroll_date_id: { _eq: $payrollDateId }
        is_approved: { _eq: false }
      }
    ) {
      aggregate {
        count
        sum {
          override_rate
        }
      }
    }
  }
`;

const CREATE_PAYROLL_SERVICE_OVERRIDE = gql`
  mutation CreatePayrollServiceOverride($input: payroll_service_overrides_insert_input!) {
    insert_payroll_service_overrides_one(object: $input) {
      id
      service {
        name
      }
      override_rate
      override_reason
    }
  }
`;

const UPDATE_PAYROLL_SERVICE_OVERRIDE = gql`
  mutation UpdatePayrollServiceOverride($id: uuid!, $input: payroll_service_overrides_set_input!) {
    update_payroll_service_overrides_by_pk(pk_columns: { id: $id }, _set: $input) {
      id
      override_rate
      is_approved
    }
  }
`;

const DELETE_PAYROLL_SERVICE_OVERRIDE = gql`
  mutation DeletePayrollServiceOverride($id: uuid!) {
    delete_payroll_service_overrides_by_pk(id: $id) {
      id
      service {
        name
      }
    }
  }
`;

const APPROVE_PAYROLL_SERVICE_OVERRIDE = gql`
  mutation ApprovePayrollServiceOverride($id: uuid!, $userId: uuid!) {
    update_payroll_service_overrides_by_pk(
      pk_columns: { id: $id }
      _set: { 
        is_approved: true
        approved_by_user_id: $userId
      }
    ) {
      id
      is_approved
      approved_by_user {
        computed_name
      }
    }
  }
`;

// Types
interface PayrollServiceOverride {
  id: string;
  payroll_date_id: string;
  service_id: string;
  original_rate?: number;
  override_rate: number;
  override_reason?: string;
  quantity_override?: number;
  original_quantity?: number;
  approved_by_user_id?: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  service: {
    id: string;
    name: string;
    service_code: string;
    category: string;
    base_rate?: number;
    billing_unit?: string;
    charge_basis: string;
  };
  created_by_user?: {
    id: string;
    computed_name: string;
    seniority_level?: string;
  };
  approved_by_user?: {
    id: string;
    computed_name: string;
  };
  payroll_date: {
    id: string;
    status: string;
    payroll: {
      id: string;
      name: string;
      client: {
        id: string;
        name: string;
      };
    };
  };
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

interface ServiceQuantity {
  id: string;
  service_id: string;
  quantity: number;
  service: {
    id: string;
    name: string;
    service_code: string;
  };
}

interface OverrideFormData {
  service_id: string;
  override_rate: number;
  override_reason: string;
  quantity_override?: number;
}

interface PayrollServiceOverrideManagerProps {
  payrollDateId: string;
  canApprove?: boolean;
  currentUserId?: string;
}

export function PayrollServiceOverrideManager({ 
  payrollDateId, 
  canApprove = false,
  currentUserId = "00000000-0000-0000-0000-000000000000" 
}: PayrollServiceOverrideManagerProps) {
  const [selectedOverride, setSelectedOverride] = useState<PayrollServiceOverride | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overrides");
  const [formData, setFormData] = useState<OverrideFormData>({
    service_id: "",
    override_rate: 0,
    override_reason: ""
  });

  // GraphQL hooks
  const { data: overridesData, loading: overridesLoading, refetch } = useQuery(GET_PAYROLL_SERVICE_OVERRIDES, {
    variables: { payrollDateId }
  });
  
  const { data: servicesData } = useQuery(GET_PAYROLL_AVAILABLE_SERVICES, {
    variables: { payrollDateId }
  });
  
  const { data: statsData } = useQuery(GET_OVERRIDE_STATISTICS, {
    variables: { payrollDateId }
  });

  const [createOverride] = useMutation(CREATE_PAYROLL_SERVICE_OVERRIDE);
  const [updateOverride] = useMutation(UPDATE_PAYROLL_SERVICE_OVERRIDE);
  const [deleteOverride] = useMutation(DELETE_PAYROLL_SERVICE_OVERRIDE);
  const [approveOverride] = useMutation(APPROVE_PAYROLL_SERVICE_OVERRIDE);

  const overrides: PayrollServiceOverride[] = overridesData?.payroll_service_overrides || [];
  const payrollDate = servicesData?.payrollDates?.[0];
  const availableServices: ServiceAssignment[] = payrollDate?.payroll?.client?.client_service_assignments || [];
  const existingQuantities: ServiceQuantity[] = servicesData?.payroll_service_quantities || [];

  // Statistics calculations
  const totalOverrides = statsData?.overridesAggregate?.aggregate?.count || 0;
  const approvedOverrides = statsData?.approvedOverridesAggregate?.aggregate?.count || 0;
  const pendingOverrides = statsData?.pendingOverridesAggregate?.aggregate?.count || 0;
  const totalOverrideValue = statsData?.overridesAggregate?.aggregate?.sum?.override_rate || 0;
  const approvedOverrideValue = statsData?.approvedOverridesAggregate?.aggregate?.sum?.override_rate || 0;
  const pendingOverrideValue = statsData?.pendingOverridesAggregate?.aggregate?.sum?.override_rate || 0;

  const getOriginalRate = (serviceId: string) => {
    const assignment = availableServices.find(a => a.service.id === serviceId);
    return assignment?.custom_rate || assignment?.service.base_rate || 0;
  };

  const getExistingQuantity = (serviceId: string) => {
    const quantity = existingQuantities.find(q => q.service_id === serviceId);
    return quantity?.quantity || 0;
  };

  const calculateImpact = (override: PayrollServiceOverride) => {
    const originalRate = override.original_rate || getOriginalRate(override.service_id);
    const quantity = override.quantity_override || getExistingQuantity(override.service_id) || 1;
    const originalTotal = originalRate * quantity;
    const overrideTotal = override.override_rate * quantity;
    return {
      originalTotal,
      overrideTotal,
      difference: overrideTotal - originalTotal,
      percentChange: originalTotal > 0 ? ((overrideTotal - originalTotal) / originalTotal) * 100 : 0
    };
  };

  const handleCreateOverride = async () => {
    try {
      const originalRate = getOriginalRate(formData.service_id);
      
      await createOverride({
        variables: {
          input: {
            payroll_date_id: payrollDateId,
            service_id: formData.service_id,
            original_rate: originalRate,
            override_rate: formData.override_rate,
            override_reason: formData.override_reason,
            quantity_override: formData.quantity_override || null,
            original_quantity: getExistingQuantity(formData.service_id) || null,
            is_approved: false,
            created_by: currentUserId
          }
        }
      });

      const service = availableServices.find(s => s.service.id === formData.service_id);
      toast.success(`Override created for "${service?.service.name}"`);
      
      setIsCreateDialogOpen(false);
      setFormData({
        service_id: "",
        override_rate: 0,
        override_reason: ""
      });
      refetch();
    } catch (error: any) {
      toast.error(`Failed to create override: ${error.message}`);
    }
  };

  const handleEditOverride = (override: PayrollServiceOverride) => {
    setSelectedOverride(override);
    const newFormData: OverrideFormData = {
      service_id: override.service_id,
      override_rate: override.override_rate,
      override_reason: override.override_reason || ""
    };
    
    if (override.quantity_override) {
      newFormData.quantity_override = override.quantity_override;
    }
    
    setFormData(newFormData);
    setIsEditDialogOpen(true);
  };

  const handleUpdateOverride = async () => {
    if (!selectedOverride) return;

    try {
      await updateOverride({
        variables: {
          id: selectedOverride.id,
          input: {
            override_rate: formData.override_rate,
            override_reason: formData.override_reason,
            quantity_override: formData.quantity_override || null
          }
        }
      });

      toast.success("Override updated successfully");
      setIsEditDialogOpen(false);
      setSelectedOverride(null);
      refetch();
    } catch (error: any) {
      toast.error(`Failed to update override: ${error.message}`);
    }
  };

  const handleApproveOverride = async (override: PayrollServiceOverride) => {
    if (!canApprove) {
      toast.error("You don't have permission to approve overrides");
      return;
    }

    try {
      await approveOverride({
        variables: {
          id: override.id,
          userId: currentUserId
        }
      });

      toast.success(`Override for "${override.service.name}" approved`);
      refetch();
    } catch (error: any) {
      toast.error(`Failed to approve override: ${error.message}`);
    }
  };

  const handleDeleteOverride = async (override: PayrollServiceOverride) => {
    if (!confirm(`Delete override for "${override.service.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteOverride({
        variables: { id: override.id }
      });

      toast.success(`Override for "${override.service.name}" deleted`);
      refetch();
    } catch (error: any) {
      toast.error(`Failed to delete override: ${error.message}`);
    }
  };

  const OverrideForm = ({ isEditing = false }: { isEditing?: boolean }) => (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="service_id">Service *</Label>
          <Select 
            value={formData.service_id} 
            onValueChange={(value) => {
              setFormData(prev => ({ 
                ...prev, 
                service_id: value,
                override_rate: getOriginalRate(value)
              }));
            }}
            disabled={isEditing}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select service to override" />
            </SelectTrigger>
            <SelectContent>
              {availableServices.map(assignment => (
                <SelectItem key={assignment.service.id} value={assignment.service.id}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <span>{assignment.service.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ${(assignment.custom_rate || assignment.service.base_rate || 0).toFixed(2)}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formData.service_id && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Original Rate</Label>
              <div className="p-2 bg-gray-50 rounded border text-sm">
                ${getOriginalRate(formData.service_id).toFixed(2)}
              </div>
            </div>
            <div>
              <Label htmlFor="override_rate">Override Rate * ($)</Label>
              <Input
                id="override_rate"
                type="number"
                step="0.01"
                min="0"
                value={formData.override_rate}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  override_rate: parseFloat(e.target.value) || 0 
                }))}
                placeholder="Enter override rate"
              />
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="quantity_override">Quantity Override (Optional)</Label>
          <Input
            id="quantity_override"
            type="number"
            min="0"
            value={formData.quantity_override || ""}
            onChange={(e) => {
              const newFormData = { ...formData };
              if (e.target.value) {
                newFormData.quantity_override = parseInt(e.target.value);
              } else {
                delete newFormData.quantity_override;
              }
              setFormData(newFormData);
            }}
            placeholder={`Leave empty to use existing quantity (${formData.service_id ? getExistingQuantity(formData.service_id) : 0})`}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Override the quantity used for billing calculation
          </p>
        </div>

        <div>
          <Label htmlFor="override_reason">Override Reason *</Label>
          <Textarea
            id="override_reason"
            value={formData.override_reason}
            onChange={(e) => setFormData(prev => ({ ...prev, override_reason: e.target.value }))}
            placeholder="Explain why this override is necessary"
            rows={3}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Provide a clear business justification for this rate override
          </p>
        </div>

        {formData.service_id && formData.override_rate > 0 && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Impact Preview</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Original Total</div>
                <div className="font-medium">
                  ${(getOriginalRate(formData.service_id) * (formData.quantity_override || getExistingQuantity(formData.service_id) || 1)).toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Override Total</div>
                <div className="font-medium text-blue-700">
                  ${(formData.override_rate * (formData.quantity_override || getExistingQuantity(formData.service_id) || 1)).toFixed(2)}
                </div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-blue-300">
              <div className="text-muted-foreground">Net Change</div>
              <div className="font-medium text-blue-900">
                ${((formData.override_rate * (formData.quantity_override || getExistingQuantity(formData.service_id) || 1)) - 
                  (getOriginalRate(formData.service_id) * (formData.quantity_override || getExistingQuantity(formData.service_id) || 1))).toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (overridesLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading payroll service overrides...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Service Rate Overrides</h2>
          <p className="text-muted-foreground">
            {payrollDate ? 
              `${payrollDate.payroll.name} - ${payrollDate.payroll.client.name}` : 
              "Manage service rate overrides for this payroll"
            }
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Override
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create Service Rate Override</DialogTitle>
            </DialogHeader>
            <OverrideForm />
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateOverride} 
                disabled={!formData.service_id || !formData.override_reason}
              >
                Create Override
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Overrides</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOverrides}</div>
            <p className="text-xs text-muted-foreground">
              ${totalOverrideValue.toFixed(2)} total value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedOverrides}</div>
            <p className="text-xs text-muted-foreground">
              ${approvedOverrideValue.toFixed(2)} approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingOverrides}</div>
            <p className="text-xs text-muted-foreground">
              ${pendingOverrideValue.toFixed(2)} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Override</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalOverrides > 0 ? (totalOverrideValue / totalOverrides).toFixed(2) : "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">
              Per override rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Override Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {overrides.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Service Overrides</h3>
              <p>No rate overrides have been created for this payroll.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Rate Change</TableHead>
                    <TableHead>Financial Impact</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overrides.map((override) => {
                    const impact = calculateImpact(override);
                    return (
                      <TableRow key={override.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{override.service.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {override.service.service_code}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {override.service.category}
                            </Badge>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">
                              ${(override.original_rate || 0).toFixed(2)} → ${override.override_rate.toFixed(2)}
                            </div>
                            <div className={`font-medium ${impact.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {impact.difference >= 0 ? '+' : ''}${impact.difference.toFixed(2)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {impact.percentChange >= 0 ? '+' : ''}{impact.percentChange.toFixed(1)}%
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">
                              Original: ${impact.originalTotal.toFixed(2)}
                            </div>
                            <div className="font-medium">
                              Override: ${impact.overrideTotal.toFixed(2)}
                            </div>
                            {override.quantity_override && (
                              <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">
                                Qty Override: {override.quantity_override}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="text-sm max-w-xs">
                            {override.override_reason || "No reason provided"}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {override.is_approved ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <div className="space-y-1">
                                  <div className="text-green-600 font-medium">Approved</div>
                                  {override.approved_by_user && (
                                    <div className="text-xs text-muted-foreground">
                                      by {override.approved_by_user.computed_name}
                                    </div>
                                  )}
                                </div>
                              </>
                            ) : (
                              <>
                                <Clock className="h-4 w-4 text-orange-600" />
                                <span className="text-orange-600 font-medium">Pending</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">
                              {override.created_by_user?.computed_name || "Unknown"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(override.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {!override.is_approved && canApprove && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleApproveOverride(override)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditOverride(override)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteOverride(override)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Override Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Edit Override: {selectedOverride?.service.name}
            </DialogTitle>
          </DialogHeader>
          <OverrideForm isEditing={true} />
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateOverride}>
              Update Override
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}