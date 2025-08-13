"use client";

import { useQuery, useMutation } from "@apollo/client";
import { 
  Save, 
  X, 
  Calculator, 
  Clock, 
  Users, 
  Building2,
  FileText,
  DollarSign,
  AlertCircle
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  GetClientAssignedServicesEnhancedDocument,
  GetUsersByRoleEnhancedDocument,
  CreateBillingItemFromServiceEnhancedDocument,
  UpdateBillingItemFromServiceEnhancedDocument,
} from "../../graphql/generated/graphql";

// Types
interface BillingItemFormData {
  serviceId?: string;
  clientId: string;
  payrollId?: string;
  staffUserId: string;
  serviceName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  notes?: string;
  approvalLevel: string;
}

interface BillingItemFormProps {
  itemId?: string;
  mode?: "create" | "edit";
  clientId?: string;
  payrollId?: string;
  initialData?: any;
  onSave?: (data: any) => void;
  onCancel?: () => void;
}

const defaultFormData: BillingItemFormData = {
  serviceId: "",
  clientId: "",
  payrollId: "",
  staffUserId: "",
  serviceName: "",
  description: "",
  quantity: 1,
  unitPrice: 0,
  totalAmount: 0,
  status: 'draft',
  notes: "",
  approvalLevel: 'review'
};

export function BillingItemForm({ 
  itemId,
  mode = "create", 
  clientId,
  payrollId,
  initialData, 
  onSave, 
  onCancel 
}: BillingItemFormProps) {
  const [formData, setFormData] = useState<BillingItemFormData>({
    ...defaultFormData,
    clientId: clientId || "",
    payrollId: payrollId || "",
  });

  // GraphQL hooks
  const { data: servicesData, loading: servicesLoading } = useQuery(GetClientAssignedServicesEnhancedDocument, {
    variables: { clientId: clientId || formData.clientId },
    skip: !clientId && !formData.clientId
  });
  
  const { data: usersData } = useQuery(GetUsersByRoleEnhancedDocument);
  
  const [createBillingItem, { loading: creating }] = useMutation(CreateBillingItemFromServiceEnhancedDocument);
  const [updateBillingItem, { loading: updating }] = useMutation(UpdateBillingItemFromServiceEnhancedDocument);

  const services = servicesData?.clientServiceAssignments || [];
  const users = usersData?.users || [];

  // Initialize form data from initialData
  useEffect(() => {
    if (initialData && mode === "edit") {
      setFormData({
        ...defaultFormData,
        ...initialData,
        clientId: clientId || initialData.clientId || "",
        payrollId: payrollId || initialData.payrollId || "",
      });
    }
  }, [initialData, mode, clientId, payrollId]);

  // Selected service details
  const selectedService = useMemo(() => {
    return services.find(s => s.service.id === formData.serviceId);
  }, [services, formData.serviceId]);

  // Calculate effective rate based on service, seniority, and custom rates
  const calculateEffectiveRate = useMemo(() => {
    if (!selectedService || !formData.staffUserId) return 0;

    const service = selectedService.service;
    const selectedUser = users.find(u => u.id === formData.staffUserId);
    
    // Base rate: custom client rate or service base rate
    const baseRate = selectedService.customRate || service.baseRate || 0;
    
    // Apply seniority multiplier if service is time-based
    if (service.isTimeBased && selectedUser) {
      const multipliers = selectedService.customSeniorityMultipliers 
        ? JSON.parse(selectedService.customSeniorityMultipliers)
        : JSON.parse(service.seniorityMultipliers || '{"junior": 1.0, "senior": 1.3, "manager": 1.6, "partner": 2.0}');
      
      const multiplier = multipliers[selectedUser.role] || 1.0;
      return baseRate * multiplier;
    }
    
    return baseRate;
  }, [selectedService, formData.staffUserId, users]);

  // Update unit price and total when service or staff changes
  useEffect(() => {
    const effectiveRate = calculateEffectiveRate;
    setFormData(prev => ({
      ...prev,
      unitPrice: effectiveRate,
      totalAmount: effectiveRate * prev.quantity
    }));
  }, [calculateEffectiveRate]);

  // Update total when quantity changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      totalAmount: prev.unitPrice * prev.quantity
    }));
  }, [formData.quantity]);

  const handleServiceChange = (serviceId: string) => {
    const service = services.find(s => s.service.id === serviceId)?.service;
    if (!service) return;

    setFormData(prev => ({
      ...prev,
      serviceId,
      serviceName: service.name,
      description: service.description || "",
      approvalLevel: service.approvalLevel || 'review'
    }));
  };

  const handleSubmit = async () => {
    if (!formData.serviceId || !formData.staffUserId || !formData.clientId) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const itemData = {
        serviceId: formData.serviceId,
        clientId: formData.clientId,
        payrollId: formData.payrollId || null,
        staffUserId: formData.staffUserId,
        serviceName: formData.serviceName,
        description: formData.description,
        quantity: formData.quantity,
        unitPrice: formData.unitPrice,
        totalAmount: formData.totalAmount,
        status: formData.status,
        notes: formData.notes || null,
        createdAt: "now()",
        updatedAt: "now()"
      };

      if (mode === "create") {
        const result = await createBillingItem({
          variables: { input: itemData }
        });
        toast.success("Billing item created successfully");
        onSave?.(result.data?.insertBillingItemsOne);
      } else {
        const result = await updateBillingItem({
          variables: { 
            id: itemId!, 
            set: itemData 
          }
        });
        toast.success("Billing item updated successfully");
        onSave?.(result.data?.updateBillingItemsByPk);
      }
    } catch (error: any) {
      toast.error(`Failed to ${mode} billing item: ${error.message}`);
    }
  };

  if (servicesLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground opacity-60">Loading client services...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!services.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create Billing Item</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No services are assigned to this client. Please assign services through the Service Management dashboard before creating billing items.
            </AlertDescription>
          </Alert>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-foreground opacity-75" />
          {mode === "create" ? "Create Billing Item" : "Edit Billing Item"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Service Selection */}
        <div>
          <Label htmlFor="serviceId">Service *</Label>
          <Select value={formData.serviceId} onValueChange={handleServiceChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              {services.map(({ service }) => (
                <SelectItem key={service.id} value={service.id}>
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <span className="font-medium">{service.name}</span>
                      {service.serviceCode && (
                        <span className="text-foreground opacity-60 ml-2">({service.serviceCode})</span>
                      )}
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {service.category}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Staff Member Selection */}
        <div>
          <Label htmlFor="staffUserId">Staff Member *</Label>
          <Select value={formData.staffUserId} onValueChange={(value) => setFormData(prev => ({ ...prev, staffUserId: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select staff member" />
            </SelectTrigger>
            <SelectContent>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{user.computedName || `${user.firstName} ${user.lastName}`}</span>
                    <div className="flex items-center gap-2 ml-2">
                      <Badge variant="outline">{user.role}</Badge>
                      {user.currentHourlyRate && (
                        <span className="text-xs text-foreground opacity-60">
                          ${user.currentHourlyRate}/hr
                        </span>
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the work performed"
            rows={3}
          />
        </div>

        {/* Quantity and Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="quantity">
              Quantity *
              {selectedService?.service.billingUnit && (
                <span className="text-foreground opacity-60 ml-1">
                  ({selectedService.service.billingUnit})
                </span>
              )}
            </Label>
            <Input
              id="quantity"
              type="number"
              step="0.25"
              min="0"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
              placeholder="0.00"
            />
          </div>

          <div>
            <Label htmlFor="unitPrice">Unit Price</Label>
            <div className="relative">
              <DollarSign className="h-4 w-4 text-foreground opacity-60 absolute left-3 top-3" />
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.unitPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                className="pl-10"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="totalAmount">Total Amount</Label>
            <div className="relative">
              <Calculator className="h-4 w-4 text-foreground opacity-60 absolute left-3 top-3" />
              <Input
                id="totalAmount"
                type="number"
                step="0.01"
                value={formData.totalAmount}
                readOnly
                className="pl-10 bg-muted"
              />
            </div>
          </div>
        </div>


        {/* Notes */}
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Additional notes or comments"
            rows={2}
          />
        </div>

        {/* Service Info Display */}
        {selectedService && (
          <Alert>
            <Building2 className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>
                  <strong>{selectedService.service.name}</strong> - {selectedService.service.chargeBasis}
                </span>
                {selectedService.service.approvalLevel !== 'auto' && (
                  <Badge variant="outline">
                    Requires {selectedService.service.approvalLevel} approval
                  </Badge>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={creating || updating || !formData.serviceId || !formData.staffUserId}
          >
            <Save className="h-4 w-4 mr-2" />
            {creating || updating ? 'Saving...' : (mode === "create" ? "Create Item" : "Update Item")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}