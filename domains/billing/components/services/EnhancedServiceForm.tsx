"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  Info,
  DollarSign,
  Settings,
  AlertCircle,
  CheckCircle,
  Save,
  X,
  Building2,
  Hash,
  Clock,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import {
  GetBillingUnitTypesForSelectionDocument,
  GetServiceByIdDocument,
  CreateServiceWithUnitTypeDocument,
  UpdateServiceWithUnitTypeDocument,
  type ServicesInsertInput,
  type ServicesSetInput,
} from "../../graphql/generated/graphql";
import { useCurrentUser } from "@/hooks/use-current-user";

interface ServiceFormData {
  name: string;
  description: string;
  category: string;
  billingUnitTypeId: string;
  baseRate: number;
  currency: string;
  serviceType: string;
  billingTier: string;
  isActive: boolean;
  isTemplate: boolean;
  metadata: Record<string, any>;
  dependencies: string[];
}

const defaultFormData: ServiceFormData = {
  name: "",
  description: "",
  category: "professional_services",
  billingUnitTypeId: "",
  baseRate: 0,
  currency: "AUD",
  serviceType: "billable",
  billingTier: "payroll_date",
  isActive: true,
  isTemplate: false,
  metadata: {},
  dependencies: [],
};

const categoryOptions = [
  { value: "professional_services", label: "Professional Services" },
  { value: "compliance", label: "Compliance & Regulatory" },
  { value: "technology", label: "Technology Services" },
  { value: "support", label: "Support & Maintenance" },
  { value: "consulting", label: "Consulting" },
  { value: "training", label: "Training & Education" },
  { value: "other", label: "Other" },
];

const billingTierOptions = [
  {
    value: "payroll_date",
    label: "Per Payroll Date",
    description: "Bill immediately when payroll date is completed",
  },
  {
    value: "payroll",
    label: "Per Payroll Cycle",
    description: "Bill when entire payroll cycle is completed",
  },
  {
    value: "client_monthly",
    label: "Monthly",
    description: "Bill at the end of each month",
  },
];

interface EnhancedServiceFormProps {
  serviceId?: string;
  mode?: "create" | "edit";
  onSave?: (service: any) => void;
  onCancel?: () => void;
}

export function EnhancedServiceForm({
  serviceId,
  mode = "create",
  onSave,
  onCancel,
}: EnhancedServiceFormProps) {
  const { currentUser } = useCurrentUser();
  const [formData, setFormData] = useState<ServiceFormData>(defaultFormData);
  const [selectedUnitType, setSelectedUnitType] = useState<any>(null);

  // GraphQL queries
  const { data: unitTypesData, loading: loadingUnitTypes } = useQuery(
    GetBillingUnitTypesForSelectionDocument
  );

  const { data: serviceData, loading: loadingService } = useQuery(
    GetServiceByIdDocument,
    {
      variables: { id: serviceId! },
      skip: !serviceId || mode === "create",
    }
  );

  // GraphQL mutations
  const [createService, { loading: creating }] = useMutation(
    CreateServiceWithUnitTypeDocument,
    {
      onCompleted: (data) => {
        toast.success("Service created successfully");
        onSave?.(data.insertServicesOne);
      },
      onError: (error) => {
        toast.error(`Failed to create service: ${error.message}`);
      },
    }
  );

  const [updateService, { loading: updating }] = useMutation(
    UpdateServiceWithUnitTypeDocument,
    {
      onCompleted: (data) => {
        toast.success("Service updated successfully");
        onSave?.(data.updateServicesByPk);
      },
      onError: (error) => {
        toast.error(`Failed to update service: ${error.message}`);
      },
    }
  );

  const unitTypes = unitTypesData?.billingUnitTypes || [];

  // Load existing service data for edit mode
  useEffect(() => {
    if (mode === "edit" && serviceData?.servicesByPk) {
      const service = serviceData.servicesByPk;
      setFormData({
        name: service.name,
        description: service.description || "",
        category: service.category,
        billingUnitTypeId: service.billingUnitTypeId || "",
        baseRate: service.baseRate || 0,
        currency: service.currency || "AUD",
        serviceType: service.serviceType,
        billingTier: service.billingTier || "payroll_date",
        isActive: service.isActive,
        isTemplate: service.isTemplate,
        metadata: service.metadata || {},
        dependencies: service.dependencies || [],
      });
    }
  }, [mode, serviceData]);

  // Update selected unit type when form data changes
  useEffect(() => {
    const unitType = unitTypes.find(ut => ut.id === formData.billingUnitTypeId);
    setSelectedUnitType(unitType);
  }, [formData.billingUnitTypeId, unitTypes]);

  const handleSubmit = async () => {
    if (!currentUser?.id) {
      toast.error("User authentication required");
      return;
    }

    if (!formData.name.trim() || !formData.billingUnitTypeId) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (mode === "create") {
        const input: ServicesInsertInput = {
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          category: formData.category,
          billingUnitTypeId: formData.billingUnitTypeId,
          baseRate: formData.baseRate,
          currency: formData.currency,
          serviceType: formData.serviceType,
          billingTier: formData.billingTier,
          isActive: formData.isActive,
          isTemplate: formData.isTemplate,
          metadata: Object.keys(formData.metadata).length > 0 ? formData.metadata : null,
          dependencies: formData.dependencies.length > 0 ? formData.dependencies : null,
          createdBy: currentUser.id,
        };

        await createService({ variables: { input } });
      } else {
        const updates: ServicesSetInput = {
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          category: formData.category,
          billingUnitTypeId: formData.billingUnitTypeId,
          baseRate: formData.baseRate,
          currency: formData.currency,
          serviceType: formData.serviceType,
          billingTier: formData.billingTier,
          isActive: formData.isActive,
          isTemplate: formData.isTemplate,
          metadata: Object.keys(formData.metadata).length > 0 ? formData.metadata : null,
          dependencies: formData.dependencies.length > 0 ? formData.dependencies : null,
          updatedBy: currentUser.id,
          updatedAt: "now()",
        };

        await updateService({ variables: { id: serviceId!, set: updates } });
      }
    } catch (error) {
      console.error("Service form submission error:", error);
    }
  };

  const updateFormData = (field: keyof ServiceFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loadingService || loadingUnitTypes) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {mode === "create" ? "Create New Service" : "Edit Service"}
          </h1>
          <p className="text-foreground opacity-60">
            Configure billing service with advanced unit type system
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={creating || updating || !formData.name.trim() || !formData.billingUnitTypeId}
          >
            {creating || updating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {mode === "create" ? "Create Service" : "Update Service"}
          </Button>
        </div>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Service Name */}
          <div>
            <Label htmlFor="name">Service Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateFormData("name", e.target.value)}
              placeholder="e.g., Monthly Payroll Processing"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData("description", e.target.value)}
              placeholder="Describe what this service includes..."
              rows={3}
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => updateFormData("category", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Billing Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Billing Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Billing Tier Selection (WHEN to bill) */}
          <div>
            <Label htmlFor="billingTier">Billing Tier (When to bill) *</Label>
            <Select
              value={formData.billingTier}
              onValueChange={(value) => updateFormData("billingTier", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {billingTierOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-foreground opacity-60">
                        {option.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Billing Unit Type Selection (HOW to calculate) */}
          <div>
            <Label htmlFor="billingUnitType">Billing Unit Type (How to calculate) *</Label>
            <Select
              value={formData.billingUnitTypeId}
              onValueChange={(value) => updateFormData("billingUnitTypeId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select billing unit type" />
              </SelectTrigger>
              <SelectContent>
                {unitTypes.map((unitType) => (
                  <SelectItem key={unitType.id} value={unitType.id}>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{unitType.displayName}</span>
                        {unitType.isSystemDefined && (
                          <Badge variant="outline" className="text-xs">
                            System
                          </Badge>
                        )}
                      </div>
                      {unitType.description && (
                        <span className="text-xs text-foreground opacity-60">
                          {unitType.description}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Unit Type Preview */}
            {selectedUnitType && (
              <Alert className="mt-2">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <div className="font-medium">{selectedUnitType.displayName}</div>
                    <div className="text-sm">{selectedUnitType.description}</div>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        Quantity Input: {selectedUnitType.requiresQuantityInput ? "Required" : "Not required"}
                      </div>
                      {selectedUnitType.defaultSource && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Default Source: {selectedUnitType.defaultSource.replace('_', ' ')}
                        </div>
                      )}
                    </div>
                    {selectedUnitType.quantityPrompt && (
                      <div className="text-sm text-foreground opacity-75">
                        Prompt: "{selectedUnitType.quantityPrompt}"
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Base Rate */}
          <div>
            <Label htmlFor="baseRate">Base Rate per {selectedUnitType?.displayName || "Unit"}</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-foreground opacity-60" />
              <Input
                id="baseRate"
                type="number"
                step="0.01"
                min="0"
                value={formData.baseRate}
                onChange={(e) => updateFormData("baseRate", parseFloat(e.target.value) || 0)}
                className="pl-10"
                placeholder="0.00"
              />
            </div>
            <p className="text-xs text-foreground opacity-60 mt-1">
              {selectedUnitType?.requiresQuantityInput
                ? `Rate per ${selectedUnitType.displayName.toLowerCase()}`
                : "Fixed rate for this service"}
            </p>
          </div>

          {/* Currency */}
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={formData.currency}
              onValueChange={(value) => updateFormData("currency", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="GBP">GBP - British Pound</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Advanced Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Service Type */}
          <div>
            <Label htmlFor="serviceType">Service Type</Label>
            <Select
              value={formData.serviceType}
              onValueChange={(value) => updateFormData("serviceType", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="billable">Billable</SelectItem>
                <SelectItem value="non_billable">Non-billable</SelectItem>
                <SelectItem value="internal">Internal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isActive">Active Service</Label>
                <p className="text-xs text-foreground opacity-60">
                  Active services can be assigned to clients
                </p>
              </div>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => updateFormData("isActive", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isTemplate">Service Template</Label>
                <p className="text-xs text-foreground opacity-60">
                  Templates can be used to create new services
                </p>
              </div>
              <Switch
                id="isTemplate"
                checked={formData.isTemplate}
                onCheckedChange={(checked) => updateFormData("isTemplate", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Preview */}
      {selectedUnitType && formData.baseRate > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Billing Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Service:</span>
                <span className="font-medium">{formData.name || "New Service"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Billing Tier:</span>
                <Badge variant="outline">
                  {billingTierOptions.find(opt => opt.value === formData.billingTier)?.label}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Unit Type:</span>
                <Badge variant="outline">
                  {selectedUnitType.displayName}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Rate:</span>
                <span className="font-medium">
                  ${formData.baseRate.toFixed(2)} {formData.currency} per {selectedUnitType.displayName.toLowerCase()}
                </span>
              </div>
              {selectedUnitType.requiresQuantityInput && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Users will be prompted: "{selectedUnitType.quantityPrompt || `Enter ${selectedUnitType.displayName.toLowerCase()}`}"
                    <br />
                    {selectedUnitType.defaultSource && (
                      <span className="text-sm">
                        Default quantity will be auto-populated from {selectedUnitType.defaultSource.replace('_', ' ')}
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}