"use client";

import { useMutation, useQuery } from "@apollo/client";
import { useUser } from "@clerk/nextjs";
import {
  Plus,
  X,
  Settings,
  DollarSign,
  Package,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  GetClientServiceAgreementsForPayrollDocument,
  GetPayrollServiceAgreementsForCompletionDocument,
  AssignServiceToPayrollDocument,
  UpdatePayrollServiceAssignmentDocument,
  RemoveServiceFromPayrollDocument,
} from "@/domains/billing/graphql/generated/graphql";
import { useDatabaseUserId } from "@/hooks/use-database-user-id";

interface PayrollServiceAssignmentModalProps {
  payrollId: string;
  payrollName: string;
  clientId: string;
  clientName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssignmentComplete?: () => void;
}

interface ServiceAssignment {
  id: string;
  serviceId: string;
  clientServiceAssignmentId: string;
  quantity: number;
  customRate?: number;
  notes?: string;
  service: {
    id: string;
    name: string;
    description?: string;
    category: string;
    billingUnit: string;
    defaultRate: number;
    currency: string;
    serviceType: string;
  };
}

interface AvailableService {
  id: string;
  customRate?: number;
  notes?: string;
  service: {
    id: string;
    name: string;
    description?: string;
    category: string;
    billingUnit: string;
    defaultRate: number;
    currency: string;
    serviceType: string;
    chargeBasis: string;
    approvalLevel: string;
  };
  payrollAssignments?: Array<{
    id: string;
    quantity: number;
    customRate?: number;
    isActive: boolean;
  }>;
}

export function PayrollServiceAssignmentModal({
  payrollId,
  payrollName,
  clientId,
  clientName,
  open,
  onOpenChange,
  onAssignmentComplete,
}: PayrollServiceAssignmentModalProps) {
  const { user } = useUser();
  const { databaseUserId } = useDatabaseUserId();
  
  const [assignedServices, setAssignedServices] = useState<ServiceAssignment[]>([]);
  const [selectedService, setSelectedService] = useState<AvailableService | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customRate, setCustomRate] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [editingService, setEditingService] = useState<ServiceAssignment | null>(null);

  // Get existing service assignments for this payroll
  const { data: assignmentsData, loading: assignmentsLoading, refetch: refetchAssignments } = useQuery(
    GetPayrollServiceAgreementsForCompletionDocument,
    {
      variables: { payrollId },
      skip: !open,
    }
  );

  // Get available services for this client that aren't assigned to this payroll
  const { data: availableData, loading: availableLoading } = useQuery(
    GetClientServiceAgreementsForPayrollDocument,
    {
      variables: { 
        clientId,
        excludePayrollId: payrollId 
      },
      skip: !open,
    }
  );

  // Mutations
  const [assignService, { loading: assignLoading }] = useMutation(AssignServiceToPayrollDocument, {
    onCompleted: () => {
      toast.success("Service assigned to payroll successfully");
      refetchAssignments();
      resetForm();
    },
    onError: (error) => {
      toast.error(`Failed to assign service: ${error.message}`);
    },
  });

  const [updateAssignment, { loading: updateLoading }] = useMutation(UpdatePayrollServiceAssignmentDocument, {
    onCompleted: () => {
      toast.success("Service assignment updated successfully");
      refetchAssignments();
      setEditingService(null);
    },
    onError: (error) => {
      toast.error(`Failed to update assignment: ${error.message}`);
    },
  });

  const [removeAssignment, { loading: removeLoading }] = useMutation(RemoveServiceFromPayrollDocument, {
    onCompleted: () => {
      toast.success("Service removed from payroll");
      refetchAssignments();
    },
    onError: (error) => {
      toast.error(`Failed to remove service: ${error.message}`);
    },
  });

  // Update local state when data loads
  useEffect(() => {
    if (assignmentsData?.payrollServiceAgreements) {
      setAssignedServices(assignmentsData.payrollServiceAgreements as unknown as ServiceAssignment[]);
    }
  }, [assignmentsData]);

  const resetForm = () => {
    setSelectedService(null);
    setQuantity(1);
    setCustomRate("");
    setNotes("");
  };

  const handleAssignService = async () => {
    if (!selectedService || !databaseUserId) {
      toast.error("Please select a service and ensure you're authenticated");
      return;
    }

    try {
      await assignService({
        variables: {
          payrollId,
          serviceId: selectedService.service.id,
          clientServiceAgreementId: selectedService.id,
          customQuantity: quantity,
          customRate: customRate ? parseFloat(customRate) : undefined,
          billingNotes: notes || undefined,
          createdBy: databaseUserId,
        },
      });
    } catch (error) {
      console.error("Assignment error:", error);
    }
  };

  const handleUpdateAssignment = async () => {
    if (!editingService || !databaseUserId) return;

    try {
      await updateAssignment({
        variables: {
          id: editingService.id,
          customQuantity: editingService.quantity,
          customRate: editingService.customRate || undefined,
          billingNotes: editingService.notes || undefined,
          isActive: true,
        },
      });
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleRemoveService = async (assignmentId: string) => {
    if (!databaseUserId) return;

    try {
      await removeAssignment({
        variables: {
          id: assignmentId,
        },
      });
    } catch (error) {
      console.error("Remove error:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(amount);
  };

  const getEffectiveRate = (service: AvailableService) => {
    return service.customRate || service.service.defaultRate;
  };

  const availableServices = availableData?.clientServiceAgreements?.filter(
    (service: any) => 
      !service.payrollAssignments || service.payrollAssignments.length === 0
  ) || [];

  const isLoading = assignmentsLoading || availableLoading || assignLoading || updateLoading || removeLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Manage Service Assignments
          </DialogTitle>
          <DialogDescription>
            Assign services to <strong>{payrollName}</strong> for client <strong>{clientName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Currently Assigned Services */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Assigned Services ({assignedServices.length})
              </CardTitle>
              <CardDescription>
                Services currently assigned to this payroll
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assignedServices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No services assigned to this payroll yet</p>
                  <p className="text-sm">Assign services below to enable billing generation</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {assignedServices.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-200"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{assignment.service.name}</h4>
                          <Badge variant="outline">{assignment.service.category}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Quantity: {assignment.quantity} {assignment.service.billingUnit} • 
                          Rate: {formatCurrency(assignment.customRate || assignment.service.defaultRate)}
                        </div>
                        {assignment.notes && (
                          <div className="text-sm text-muted-foreground italic mt-1">
                            "{assignment.notes}"
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingService(assignment)}
                              >
                                <Settings className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit assignment</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveService(assignment.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Remove from payroll</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Services to Assign */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-4 w-4 text-blue-600" />
                Available Services ({availableServices.length})
              </CardTitle>
              <CardDescription>
                Client services that can be assigned to this payroll
              </CardDescription>
            </CardHeader>
            <CardContent>
              {availableServices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No additional services available</p>
                  <p className="text-sm">All client services are already assigned to this payroll</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {availableServices.map((service) => (
                    <div
                      key={service.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedService?.id === service.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedService(service as unknown as AvailableService)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{service.service.name}</h4>
                            <Badge variant="outline">{service.service.category}</Badge>
                            <Badge variant="secondary">{service.service.chargeBasis}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {service.service.description}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Default Rate: {formatCurrency(getEffectiveRate(service as unknown as AvailableService))} per {service.service.billingUnit}
                          </div>
                        </div>
                        {selectedService?.id === service.id && (
                          <div className="text-blue-600">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assignment Configuration */}
          {selectedService && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configure Assignment</CardTitle>
                <CardDescription>
                  Set quantity and rate for {selectedService.service.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      placeholder="1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Number of {selectedService.service.billingUnit}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="customRate">Custom Rate (Optional)</Label>
                    <Input
                      id="customRate"
                      type="number"
                      step="0.01"
                      value={customRate}
                      onChange={(e) => setCustomRate(e.target.value)}
                      placeholder={getEffectiveRate(selectedService).toString()}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Leave empty to use default rate: {formatCurrency(getEffectiveRate(selectedService))}
                    </p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about this service assignment..."
                    rows={3}
                  />
                </div>
                <Button 
                  onClick={handleAssignService}
                  disabled={isLoading}
                  className="w-full"
                >
                  {assignLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Assigning Service...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Assign Service to Payroll
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {assignedServices.length > 0 && (
            <Button 
              onClick={() => {
                onAssignmentComplete?.();
                onOpenChange(false);
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Complete Assignment
            </Button>
          )}
        </DialogFooter>

        {/* Edit Assignment Dialog */}
        {editingService && (
          <Dialog open={!!editingService} onOpenChange={() => setEditingService(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Service Assignment</DialogTitle>
                <DialogDescription>
                  Modify the assignment for {editingService.service.name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editQuantity">Quantity</Label>
                  <Input
                    id="editQuantity"
                    type="number"
                    min="1"
                    value={editingService.quantity}
                    onChange={(e) => 
                      setEditingService({
                        ...editingService,
                        quantity: parseInt(e.target.value) || 1
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="editCustomRate">Custom Rate</Label>
                  <Input
                    id="editCustomRate"
                    type="number"
                    step="0.01"
                    value={editingService.customRate || ""}
                    onChange={(e) => 
                      setEditingService({
                        ...editingService,
                        customRate: e.target.value ? parseFloat(e.target.value) : undefined
                      })
                    }
                    placeholder={editingService.service.defaultRate.toString()}
                  />
                </div>
                <div>
                  <Label htmlFor="editNotes">Notes</Label>
                  <Textarea
                    id="editNotes"
                    value={editingService.notes || ""}
                    onChange={(e) => 
                      setEditingService({
                        ...editingService,
                        notes: e.target.value
                      })
                    }
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingService(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateAssignment} disabled={updateLoading}>
                  {updateLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Assignment"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}