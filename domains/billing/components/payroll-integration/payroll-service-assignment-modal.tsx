"use client";

import { useQuery, useMutation } from "@apollo/client";
import { 
  Plus, 
  Search, 
  Package, 
  DollarSign, 
  Users, 
  Calendar, 
  Settings, 
  X, 
  Save,
  AlertCircle,
  CheckCircle,
  Building2,
  Clock,
  Calculator
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  GetPayrollServiceAgreementsEnhancedDocument,
  GetClientAssignedServicesEnhancedDocument,
  CreatePayrollServiceAgreementEnhancedDocument,
  UpdatePayrollServiceAgreementEnhancedDocument,
  DeletePayrollServiceAgreementEnhancedDocument,
  type GetPayrollServiceAgreementsEnhancedQuery,
  type GetClientAssignedServicesEnhancedQuery,
} from "../../graphql/generated/graphql";
import { BillingPreviewCard } from "../shared/BillingPreviewCard";
import { formatAUD, calculateGST } from "@/lib/utils/australian-formatting";
import { useCurrentUser } from "@/hooks/use-current-user";

// Types
type PayrollServiceAgreement = NonNullable<GetPayrollServiceAgreementsEnhancedQuery['payrollServiceAgreements']>[0];
type ClientServiceAgreement = NonNullable<GetClientAssignedServicesEnhancedQuery['clientServiceAssignments']>[0];

interface PayrollServiceAssignmentModalProps {
  payrollId?: string;
  payrollName?: string;
  clientId?: string;
  clientName?: string;
  isOpen: boolean;
  onClose: () => void;
  onAssignmentComplete?: () => void;
}

interface ServiceAssignmentFormData {
  serviceId: string;
  customRate?: number;
  customQuantity?: number;
  customDescription?: string;
  isOneTime: boolean;
  billingFrequency: string;
  autoBillingEnabled: boolean;
  billingNotes?: string;
}

const defaultFormData: ServiceAssignmentFormData = {
  serviceId: "",
  isOneTime: false,
  billingFrequency: "payroll_date",
  autoBillingEnabled: true,
};

export function PayrollServiceAssignmentModal({
  payrollId,
  payrollName,
  clientId,
  clientName,
  isOpen,
  onClose,
  onAssignmentComplete,
}: PayrollServiceAssignmentModalProps) {
  const { currentUser } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<"assign" | "existing" | "preview">("assign");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [serviceConfigs, setServiceConfigs] = useState<Record<string, ServiceAssignmentFormData>>({});
  const [billingPreview, setBillingPreview] = useState<any[]>([]);

  // GraphQL queries
  const { data: existingAssignments, loading: existingLoading, refetch } = useQuery<GetPayrollServiceAgreementsEnhancedQuery>(
    GetPayrollServiceAgreementsEnhancedDocument,
    {
      variables: { payrollId: payrollId || "" },
      skip: !payrollId,
    }
  );

  const { data: availableServices, loading: servicesLoading } = useQuery<GetClientAssignedServicesEnhancedQuery>(
    GetClientAssignedServicesEnhancedDocument,
    {
      variables: { clientId: clientId || "" },
      skip: !clientId,
    }
  );

  // GraphQL mutations
  const [createAssignment] = useMutation(CreatePayrollServiceAgreementEnhancedDocument);
  const [updateAssignment] = useMutation(UpdatePayrollServiceAgreementEnhancedDocument);
  const [deleteAssignment] = useMutation(DeletePayrollServiceAgreementEnhancedDocument);

  const payrollServiceAgreements = existingAssignments?.payrollServiceAgreements || [];
  const clientServiceAgreements = availableServices?.clientServiceAssignments || [];

  // Filter available services (exclude those already assigned)
  const assignedServiceIds = new Set(payrollServiceAgreements.map(psa => psa.serviceId));
  const availableServiceOptions = clientServiceAgreements.filter(csa => 
    !assignedServiceIds.has(csa.serviceId) &&
    csa.isActive &&
    csa.service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Initialize service configurations
  useEffect(() => {
    const newConfigs: Record<string, ServiceAssignmentFormData> = {};
    selectedServices.forEach(serviceId => {
      if (!serviceConfigs[serviceId]) {
        const service = clientServiceAgreements.find(csa => csa.serviceId === serviceId);
        newConfigs[serviceId] = {
          ...defaultFormData,
          serviceId,
          customRate: service?.customRate || undefined,
          billingFrequency: service?.billingFrequency || "payroll_date",
        };
      } else {
        newConfigs[serviceId] = serviceConfigs[serviceId];
      }
    });
    setServiceConfigs(newConfigs);
  }, [selectedServices, clientServiceAgreements]);

  // Calculate billing preview
  useEffect(() => {
    const preview = selectedServices.map(serviceId => {
      const config = serviceConfigs[serviceId];
      const clientAgreement = clientServiceAgreements.find(csa => csa.serviceId === serviceId);
      if (!config || !clientAgreement) return null;

      const service = clientAgreement.service;
      const effectiveRate = config.customRate || clientAgreement.customRate || service.baseRate || 0;
      const quantity = config.customQuantity || 1;
      const totalAmount = effectiveRate * quantity;

      return {
        serviceId,
        serviceName: service.name,
        unitType: service.billingUnitType?.name || service.billingUnit,
        quantity,
        displayQuantity: `${quantity} ${service.billingUnitType?.displayName || service.billingUnit}`,
        unitPrice: effectiveRate,
        totalAmount,
        description: config.customDescription || service.description || `${service.name} for ${payrollName}`,
        notes: config.billingNotes,
      };
    }).filter(Boolean);

    setBillingPreview(preview);
  }, [selectedServices, serviceConfigs, clientServiceAgreements, payrollName]);

  const handleServiceToggle = (serviceId: string, checked: boolean) => {
    if (checked) {
      setSelectedServices(prev => [...prev, serviceId]);
    } else {
      setSelectedServices(prev => prev.filter(id => id !== serviceId));
    }
  };

  const updateServiceConfig = (serviceId: string, updates: Partial<ServiceAssignmentFormData>) => {
    setServiceConfigs(prev => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], ...updates },
    }));
  };

  const handleAssignServices = async () => {
    if (!payrollId || !currentUser?.id || selectedServices.length === 0) {
      toast.error("Missing required information for service assignment");
      return;
    }

    try {
      const assignments = await Promise.all(
        selectedServices.map(serviceId => {
          const config = serviceConfigs[serviceId];
          const clientAgreement = clientServiceAgreements.find(csa => csa.serviceId === serviceId);
          
          return createAssignment({
            variables: {
              input: {
                payrollId,
                serviceId,
                clientServiceAgreementId: clientAgreement?.id,
                customRate: config.customRate || null,
                customQuantity: config.customQuantity || null,
                customDescription: config.customDescription || null,
                isOneTime: config.isOneTime,
                billingFrequency: config.billingFrequency,
                autoBillingEnabled: config.autoBillingEnabled,
                billingNotes: config.billingNotes || null,
                createdBy: currentUser.id,
                isActive: true,
              },
            },
          });
        })
      );

      toast.success(`Successfully assigned ${assignments.length} service${assignments.length !== 1 ? 's' : ''} to ${payrollName}`);
      
      // Reset form
      setSelectedServices([]);
      setServiceConfigs({});
      setActiveTab("existing");
      
      // Refresh and notify parent
      refetch();
      onAssignmentComplete?.();
      
    } catch (error: any) {
      toast.error(`Failed to assign services: ${error.message}`);
    }
  };

  const handleDeleteAssignment = async (assignment: PayrollServiceAgreement) => {
    const serviceName = assignment.payrollServiceAgreementsByServiceId.name;
    
    if (!confirm(`Remove "${serviceName}" from this payroll? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteAssignment({
        variables: { id: assignment.id },
      });
      
      toast.success(`Removed "${serviceName}" from payroll`);
      refetch();
      
    } catch (error: any) {
      toast.error(`Failed to remove service: ${error.message}`);
    }
  };

  if (!payrollId || !clientId) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Service Assignment</DialogTitle>
            <DialogDescription>
              Missing payroll or client information
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Payroll Service Assignment
          </DialogTitle>
          <DialogDescription>
            Manage services for <strong>{payrollName}</strong> (Client: <strong>{clientName}</strong>)
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assign" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Assign Services ({availableServiceOptions.length})
            </TabsTrigger>
            <TabsTrigger value="existing" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Current Services ({payrollServiceAgreements.length})
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Billing Preview ({billingPreview.length})
            </TabsTrigger>
          </TabsList>

          {/* Assign Services Tab */}
          <TabsContent value="assign" className="flex-1 overflow-y-auto space-y-4">
            {servicesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading available services...</p>
              </div>
            ) : (
              <>
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground opacity-60" />
                  <Input
                    placeholder="Search available services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {availableServiceOptions.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {searchTerm 
                        ? "No services match your search criteria"
                        : "All available services are already assigned to this payroll"
                      }
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    {/* Service Selection */}
                    <div className="space-y-3">
                      {availableServiceOptions.map(({ service, customRate, billingFrequency }) => (
                        <Card key={service.id} className="p-4">
                          <div className="flex items-start gap-4">
                            <Checkbox
                              checked={selectedServices.includes(service.id)}
                              onCheckedChange={(checked) => handleServiceToggle(service.id, !!checked)}
                              className="mt-1"
                            />
                            
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium">{service.name}</h4>
                                  <p className="text-sm text-foreground opacity-60">{service.description}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{service.category}</Badge>
                                  <span className="text-sm font-medium">
                                    {formatAUD(customRate || service.baseRate || 0)}
                                  </span>
                                </div>
                              </div>

                              {/* Service Configuration */}
                              {selectedServices.includes(service.id) && (
                                <div className="pl-4 border-l-2 border-primary space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                      <Label>Custom Rate (optional)</Label>
                                      <Input
                                        type="number"
                                        step="0.01"
                                        placeholder={`Default: ${formatAUD(customRate || service.baseRate || 0)}`}
                                        value={serviceConfigs[service.id]?.customRate || ""}
                                        onChange={(e) => updateServiceConfig(service.id, {
                                          customRate: parseFloat(e.target.value) || undefined
                                        })}
                                      />
                                    </div>

                                    <div>
                                      <Label>Billing Frequency</Label>
                                      <Select
                                        value={serviceConfigs[service.id]?.billingFrequency || billingFrequency || "payroll_date"}
                                        onValueChange={(value) => updateServiceConfig(service.id, { billingFrequency: value })}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="payroll_date">Per Payroll Date</SelectItem>
                                          <SelectItem value="payroll">Per Payroll Period</SelectItem>
                                          <SelectItem value="monthly">Monthly</SelectItem>
                                          <SelectItem value="quarterly">Quarterly</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div>
                                      <Label>Quantity (if applicable)</Label>
                                      <Input
                                        type="number"
                                        step="0.25"
                                        placeholder="1"
                                        value={serviceConfigs[service.id]?.customQuantity || ""}
                                        onChange={(e) => updateServiceConfig(service.id, {
                                          customQuantity: parseFloat(e.target.value) || undefined
                                        })}
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label>Custom Description (optional)</Label>
                                      <Input
                                        placeholder={`${service.name} for ${payrollName}`}
                                        value={serviceConfigs[service.id]?.customDescription || ""}
                                        onChange={(e) => updateServiceConfig(service.id, {
                                          customDescription: e.target.value
                                        })}
                                      />
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <div>
                                        <Label>One-time Service</Label>
                                        <p className="text-xs text-foreground opacity-60">
                                          Only for this payroll
                                        </p>
                                      </div>
                                      <Switch
                                        checked={serviceConfigs[service.id]?.isOneTime || false}
                                        onCheckedChange={(checked) => updateServiceConfig(service.id, { isOneTime: checked })}
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <Label>Billing Notes (optional)</Label>
                                    <Textarea
                                      placeholder="Additional notes for billing..."
                                      value={serviceConfigs[service.id]?.billingNotes || ""}
                                      onChange={(e) => updateServiceConfig(service.id, {
                                        billingNotes: e.target.value
                                      })}
                                      rows={2}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </TabsContent>

          {/* Existing Services Tab */}
          <TabsContent value="existing" className="flex-1 overflow-y-auto space-y-4">
            {existingLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading current services...</p>
              </div>
            ) : payrollServiceAgreements.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No services are currently assigned to this payroll. Use the "Assign Services" tab to add services.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                {payrollServiceAgreements.map((assignment) => {
                  const service = assignment.payrollServiceAgreementsByServiceId;
                  const effectiveRate = assignment.customRate || 
                    assignment.clientServiceAgreement?.customRate || 
                    service.baseRate || 0;

                  return (
                    <Card key={assignment.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium">{service.name}</h4>
                            <Badge variant="outline">{service.category}</Badge>
                            {assignment.isOneTime && (
                              <Badge variant="outline" className="bg-orange-100 text-orange-800">
                                One-time
                              </Badge>
                            )}
                            {!assignment.isActive && (
                              <Badge variant="outline" className="bg-red-100 text-red-800">
                                Inactive
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-sm text-foreground opacity-60 space-y-1">
                            <p>{assignment.customDescription || service.description}</p>
                            
                            <div className="flex items-center gap-4">
                              <span>Rate: {formatAUD(effectiveRate)}</span>
                              {assignment.customQuantity && (
                                <span>Quantity: {assignment.customQuantity}</span>
                              )}
                              <span>Frequency: {assignment.billingFrequency}</span>
                              {assignment.billingItemsGenerated && (
                                <Badge variant="outline" className="bg-green-100 text-green-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Billed
                                </Badge>
                              )}
                            </div>
                          </div>

                          {assignment.billingNotes && (
                            <p className="text-xs text-foreground opacity-60 mt-2 italic">
                              Note: {assignment.billingNotes}
                            </p>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAssignment(assignment)}
                          className="text-red-600 hover:text-red-700"
                          disabled={assignment.billingItemsGenerated}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Billing Preview Tab */}
          <TabsContent value="preview" className="flex-1 overflow-y-auto">
            {billingPreview.length === 0 ? (
              <Alert>
                <Calculator className="h-4 w-4" />
                <AlertDescription>
                  No services selected for billing preview. Select services in the "Assign Services" tab to see potential billing impact.
                </AlertDescription>
              </Alert>
            ) : (
              <BillingPreviewCard
                items={billingPreview}
                showGST={true}
                showUnitBreakdown={true}
              />
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
          {selectedServices.length > 0 && (
            <Button onClick={handleAssignServices} className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              Assign {selectedServices.length} Service{selectedServices.length !== 1 ? 's' : ''}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PayrollServiceAssignmentModal;