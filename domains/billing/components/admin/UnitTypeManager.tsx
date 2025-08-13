"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  Plus,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Shield,
  Info,
  Building2,
  Calendar,
  Hash,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  GetAllBillingUnitTypesDocument,
  GetCustomBillingUnitTypesDocument,
  GetBillingUnitTypeUsageDocument,
  CreateBillingUnitTypeDocument,
  UpdateBillingUnitTypeDocument,
  ToggleBillingUnitTypeActiveDocument,
  DeleteBillingUnitTypeDocument,
  type BillingUnitTypesInsertInput,
  type BillingUnitTypesSetInput,
} from "../../graphql/generated/graphql";
import { useCurrentUser } from "@/hooks/use-current-user";

// Simple date formatting function
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

interface UnitTypeFormData {
  name: string;
  displayName: string;
  description: string;
  defaultSource: string;
  requiresQuantityInput: boolean;
  quantityPrompt: string;
}

const defaultFormData: UnitTypeFormData = {
  name: "",
  displayName: "",
  description: "",
  defaultSource: "manual",
  requiresQuantityInput: true,
  quantityPrompt: "",
};

const defaultSourceOptions = [
  { value: "manual", label: "Manual Input" },
  { value: "payroll_employees", label: "Payroll Employee Count" },
  { value: "payroll_payslips", label: "Payroll Payslip Count" },
  { value: "client_locations", label: "Client Location Count" },
  { value: "client_departments", label: "Client Department Count" },
  { value: "compliance_items", label: "Compliance Item Count" },
];

export function UnitTypeManager() {
  const { currentUser } = useCurrentUser();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingUnitType, setEditingUnitType] = useState<any>(null);
  const [formData, setFormData] = useState<UnitTypeFormData>(defaultFormData);
  const [showUsageDialog, setShowUsageDialog] = useState<string | null>(null);

  // GraphQL queries
  const { data: allUnitTypes, loading: loadingAll, refetch } = useQuery(
    GetAllBillingUnitTypesDocument
  );
  
  const { data: usageData, loading: loadingUsage } = useQuery(
    GetBillingUnitTypeUsageDocument,
    {
      variables: { unitTypeId: showUsageDialog! },
      skip: !showUsageDialog,
    }
  );

  // GraphQL mutations
  const [createUnitType, { loading: creating }] = useMutation(
    CreateBillingUnitTypeDocument,
    {
      onCompleted: () => {
        toast.success("Unit type created successfully");
        setShowCreateDialog(false);
        setFormData(defaultFormData);
        refetch();
      },
      onError: (error) => {
        toast.error(`Failed to create unit type: ${error.message}`);
      },
    }
  );

  const [updateUnitType, { loading: updating }] = useMutation(
    UpdateBillingUnitTypeDocument,
    {
      onCompleted: () => {
        toast.success("Unit type updated successfully");
        setEditingUnitType(null);
        setFormData(defaultFormData);
        refetch();
      },
      onError: (error) => {
        toast.error(`Failed to update unit type: ${error.message}`);
      },
    }
  );

  const [toggleActive] = useMutation(ToggleBillingUnitTypeActiveDocument, {
    onCompleted: () => {
      toast.success("Unit type status updated");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to update status: ${error.message}`);
    },
  });

  const [deleteUnitType] = useMutation(DeleteBillingUnitTypeDocument, {
    onCompleted: () => {
      toast.success("Unit type deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete unit type: ${error.message}`);
    },
  });

  const systemUnitTypes = allUnitTypes?.billingUnitTypes?.filter(ut => ut.isSystemDefined) || [];
  const customUnitTypes = allUnitTypes?.billingUnitTypes?.filter(ut => !ut.isSystemDefined) || [];

  const handleCreate = async () => {
    if (!currentUser?.id) {
      toast.error("User authentication required");
      return;
    }

    const input: BillingUnitTypesInsertInput = {
      name: formData.name.toLowerCase().replace(/\s+/g, '_'),
      displayName: formData.displayName,
      description: formData.description,
      defaultSource: formData.defaultSource === "manual" ? null : formData.defaultSource,
      requiresQuantityInput: formData.requiresQuantityInput,
      quantityPrompt: formData.requiresQuantityInput ? formData.quantityPrompt : null,
      isActive: true,
      isSystemDefined: false,
      createdBy: currentUser.id,
    };

    await createUnitType({ variables: { input } });
  };

  const handleUpdate = async () => {
    if (!editingUnitType || !currentUser?.id) return;

    const updates: BillingUnitTypesSetInput = {
      displayName: formData.displayName,
      description: formData.description,
      defaultSource: formData.defaultSource === "manual" ? null : formData.defaultSource,
      requiresQuantityInput: formData.requiresQuantityInput,
      quantityPrompt: formData.requiresQuantityInput ? formData.quantityPrompt : null,
      updatedBy: currentUser.id,
      updatedAt: "now()",
    };

    await updateUnitType({
      variables: { id: editingUnitType.id, set: updates },
    });
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    await toggleActive({
      variables: { id, isActive: !currentStatus },
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this unit type?")) {
      await deleteUnitType({ variables: { id } });
    }
  };

  const startEdit = (unitType: any) => {
    setEditingUnitType(unitType);
    setFormData({
      name: unitType.name,
      displayName: unitType.displayName,
      description: unitType.description || "",
      defaultSource: unitType.defaultSource || "manual",
      requiresQuantityInput: unitType.requiresQuantityInput,
      quantityPrompt: unitType.quantityPrompt || "",
    });
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setEditingUnitType(null);
    setShowCreateDialog(false);
  };

  if (loadingAll) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading unit types...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing Unit Types</h1>
          <p className="text-foreground opacity-60">
            Configure custom billing unit types for flexible service pricing
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Unit Type
        </Button>
      </div>

      {/* System-defined unit types (read-only) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            System Unit Types
          </CardTitle>
          <p className="text-sm text-foreground opacity-60">
            Built-in unit types that cannot be modified or deleted
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Default Source</TableHead>
                <TableHead>Quantity Input</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {systemUnitTypes.map((unitType) => (
                <TableRow key={unitType.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{unitType.displayName}</div>
                      <div className="text-xs text-foreground opacity-60">
                        {unitType.name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate" title={unitType.description || ''}>
                      {unitType.description || ''}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {unitType.defaultSource || "Manual"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {unitType.requiresQuantityInput ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-400" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={unitType.isActive ? "default" : "secondary"}>
                      {unitType.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowUsageDialog(unitType.id)}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Custom unit types (admin configurable) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-purple-600" />
            Custom Unit Types
          </CardTitle>
          <p className="text-sm text-foreground opacity-60">
            Administrator-created unit types for specialized billing requirements
          </p>
        </CardHeader>
        <CardContent>
          {customUnitTypes.length === 0 ? (
            <div className="text-center py-8 text-foreground opacity-60">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No custom unit types created yet</p>
              <p className="text-sm">Click "Add Unit Type" to create your first custom unit type</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Default Source</TableHead>
                  <TableHead>Quantity Input</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customUnitTypes.map((unitType) => (
                  <TableRow key={unitType.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{unitType.displayName}</div>
                        <div className="text-xs text-foreground opacity-60">
                          {unitType.name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={unitType.description || ''}>
                        {unitType.description || ''}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {defaultSourceOptions.find(opt => opt.value === unitType.defaultSource)?.label || "Manual"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {unitType.requiresQuantityInput ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(unitType.id, unitType.isActive || false)}
                        className="p-1"
                      >
                        {unitType.isActive ? (
                          <ToggleRight className="h-5 w-5 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDate(unitType.createdAt)}</div>
                        {unitType.createdByUser && (
                          <div className="text-xs text-foreground opacity-60">
                            by {unitType.createdByUser.computedName}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowUsageDialog(unitType.id)}
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(unitType)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(unitType.id)}
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
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog || !!editingUnitType} onOpenChange={resetForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingUnitType ? "Edit Unit Type" : "Create New Unit Type"}
            </DialogTitle>
            <DialogDescription>
              {editingUnitType
                ? "Update the configuration for this billing unit type."
                : "Configure a new billing unit type for specialized service pricing."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Name field - only for create */}
            {!editingUnitType && (
              <div>
                <Label htmlFor="name">Internal Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., per_location"
                />
                <p className="text-xs text-foreground opacity-60 mt-1">
                  Used internally, will be converted to lowercase with underscores
                </p>
              </div>
            )}

            {/* Display Name */}
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                placeholder="e.g., Per Location"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this unit type is used for..."
                rows={3}
              />
            </div>

            {/* Default Source */}
            <div>
              <Label htmlFor="defaultSource">Default Quantity Source</Label>
              <Select
                value={formData.defaultSource}
                onValueChange={(value) => setFormData(prev => ({ ...prev, defaultSource: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {defaultSourceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-foreground opacity-60 mt-1">
                Where to automatically populate quantity values from
              </p>
            </div>

            {/* Requires Quantity Input */}
            <div className="flex items-center space-x-2">
              <Switch
                id="requiresQuantityInput"
                checked={formData.requiresQuantityInput}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requiresQuantityInput: checked }))}
              />
              <Label htmlFor="requiresQuantityInput">Requires quantity input</Label>
            </div>

            {/* Quantity Prompt */}
            {formData.requiresQuantityInput && (
              <div>
                <Label htmlFor="quantityPrompt">Quantity Input Prompt</Label>
                <Input
                  id="quantityPrompt"
                  value={formData.quantityPrompt}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantityPrompt: e.target.value }))}
                  placeholder="e.g., Number of locations"
                />
                <p className="text-xs text-foreground opacity-60 mt-1">
                  Help text shown to users when entering quantities
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button
              onClick={editingUnitType ? handleUpdate : handleCreate}
              disabled={creating || updating || !formData.displayName.trim()}
            >
              {creating || updating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : null}
              {editingUnitType ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Usage Dialog */}
      <Dialog open={!!showUsageDialog} onOpenChange={() => setShowUsageDialog(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Unit Type Usage</DialogTitle>
            <DialogDescription>
              See where this unit type is being used across the system
            </DialogDescription>
          </DialogHeader>

          {loadingUsage ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2">Loading usage data...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Services using this unit type */}
              <div>
                <h4 className="font-medium mb-2">Services ({usageData?.services?.length || 0})</h4>
                {usageData?.services?.length ? (
                  <div className="grid gap-2">
                    {usageData.services.map((service: any) => (
                      <div key={service.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-foreground opacity-60">
                            Base Rate: ${service.baseRate} • Tier: {service.billingTier}
                          </div>
                        </div>
                        <Badge variant={service.isActive ? "default" : "secondary"}>
                          {service.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-foreground opacity-60 text-sm">No services using this unit type</p>
                )}
              </div>

              {/* Usage statistics */}
              {usageData?.servicesAggregate && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Total of {usageData.servicesAggregate.aggregate?.count || 0} services reference this unit type.
                    {(usageData.servicesAggregate.aggregate?.count || 0) > 0 && (
                      <span className="block mt-1 text-sm">
                        Deleting this unit type may affect these services.
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowUsageDialog(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}