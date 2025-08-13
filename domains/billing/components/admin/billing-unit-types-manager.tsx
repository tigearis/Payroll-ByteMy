"use client";

import { useQuery, useMutation } from "@apollo/client";
import {
  Plus,
  Pencil,
  Trash2,
  Power,
  PowerOff,
  Settings,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  GetAllBillingUnitTypesDocument,
  CreateBillingUnitTypeDocument,
  UpdateBillingUnitTypeDocument,
  ToggleBillingUnitTypeActiveDocument,
  DeleteBillingUnitTypeDocument,
  GetBillingUnitTypeUsageDocument,
} from "@/domains/billing/graphql/generated/graphql";
import { useDatabaseUserId } from "@/hooks/use-database-user-id";

interface BillingUnitType {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  defaultSource?: string;
  isSystemDefined: boolean;
  isActive: boolean;
  requiresQuantityInput: boolean;
  quantityPrompt?: string;
  createdAt: string;
  updatedAt: string;
  createdByUser?: {
    id: string;
    computedName: string;
  };
  updatedByUser?: {
    id: string;
    computedName: string;
  };
}

interface UnitTypeFormData {
  name: string;
  displayName: string;
  description: string;
  defaultSource: string;
  requiresQuantityInput: boolean;
  quantityPrompt: string;
}

const DEFAULT_SOURCES = [
  { value: "manual", label: "Manual Input" },
  { value: "payroll_employees", label: "Payroll Employee Count" },
  { value: "payroll_payslips", label: "Payroll Payslip Count" },
  { value: "client_locations", label: "Client Location Count" },
  { value: "client_departments", label: "Client Department Count" },
];

export function BillingUnitTypesManager() {
  const { databaseUserId, isReady } = useDatabaseUserId();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingUnitType, setEditingUnitType] = useState<BillingUnitType | null>(null);
  const [showUsageDialog, setShowUsageDialog] = useState(false);
  const [selectedUnitTypeId, setSelectedUnitTypeId] = useState<string | null>(null);
  const [showSystemDefined, setShowSystemDefined] = useState(true);
  
  const [formData, setFormData] = useState<UnitTypeFormData>({
    name: "",
    displayName: "",
    description: "",
    defaultSource: "manual",
    requiresQuantityInput: true,
    quantityPrompt: "",
  });

  // Queries
  const {
    data: unitTypesData,
    loading: unitTypesLoading,
    error: unitTypesError,
    refetch: refetchUnitTypes,
  } = useQuery(GetAllBillingUnitTypesDocument);

  const {
    data: usageData,
    loading: usageLoading,
  } = useQuery(GetBillingUnitTypeUsageDocument, {
    variables: { unitTypeId: selectedUnitTypeId! },
    skip: !selectedUnitTypeId,
  });

  // Mutations
  const [createUnitType] = useMutation(CreateBillingUnitTypeDocument, {
    onCompleted: () => {
      toast.success("Billing unit type created successfully");
      setShowCreateDialog(false);
      resetForm();
      refetchUnitTypes();
    },
    onError: (error) => {
      toast.error(`Failed to create billing unit type: ${error.message}`);
    },
  });

  const [updateUnitType] = useMutation(UpdateBillingUnitTypeDocument, {
    onCompleted: () => {
      toast.success("Billing unit type updated successfully");
      setEditingUnitType(null);
      resetForm();
      refetchUnitTypes();
    },
    onError: (error) => {
      toast.error(`Failed to update billing unit type: ${error.message}`);
    },
  });

  const [toggleActive] = useMutation(ToggleBillingUnitTypeActiveDocument, {
    onCompleted: () => {
      toast.success("Billing unit type status updated");
      refetchUnitTypes();
    },
    onError: (error) => {
      toast.error(`Failed to update status: ${error.message}`);
    },
  });

  const [deleteUnitType] = useMutation(DeleteBillingUnitTypeDocument, {
    onCompleted: () => {
      toast.success("Billing unit type deleted successfully");
      refetchUnitTypes();
    },
    onError: (error) => {
      toast.error(`Failed to delete billing unit type: ${error.message}`);
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      displayName: "",
      description: "",
      defaultSource: "manual",
      requiresQuantityInput: true,
      quantityPrompt: "",
    });
  };

  const openCreateDialog = () => {
    resetForm();
    setShowCreateDialog(true);
  };

  const openEditDialog = (unitType: BillingUnitType) => {
    setFormData({
      name: unitType.name,
      displayName: unitType.displayName,
      description: unitType.description || "",
      defaultSource: unitType.defaultSource || "manual",
      requiresQuantityInput: unitType.requiresQuantityInput,
      quantityPrompt: unitType.quantityPrompt || "",
    });
    setEditingUnitType(unitType);
  };

  const openUsageDialog = (unitTypeId: string) => {
    setSelectedUnitTypeId(unitTypeId);
    setShowUsageDialog(true);
  };

  const handleSubmit = async () => {
    if (!databaseUserId || !isReady) {
      toast.error("User authentication error");
      return;
    }

    const variables = {
      ...formData,
      name: formData.name.toLowerCase().replace(/\s+/g, "_"),
      ...(editingUnitType ? { id: editingUnitType.id } : { createdBy: databaseUserId }),
      ...(editingUnitType ? { updatedBy: databaseUserId } : {}),
    };

    if (editingUnitType) {
      await updateUnitType({
        variables: {
          id: editingUnitType.id,
          set: variables,
        },
      });
    } else {
      await createUnitType({
        variables: {
          input: variables,
        },
      });
    }
  };

  const handleToggleActive = async (unitTypeId: string, currentStatus: boolean) => {
    await toggleActive({
      variables: {
        id: unitTypeId,
        isActive: !currentStatus,
      },
    });
  };

  const handleDelete = async (unitTypeId: string, unitTypeName: string) => {
    if (confirm(`Are you sure you want to delete the "${unitTypeName}" unit type? This action cannot be undone.`)) {
      await deleteUnitType({
        variables: { id: unitTypeId },
      });
    }
  };

  if (unitTypesLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Billing Unit Types</h2>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (unitTypesError) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Billing Unit Types</h2>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">Error loading billing unit types</span>
          </div>
          <p className="text-sm text-red-600 mt-1">
            {unitTypesError.message || "Failed to load billing unit types"}
          </p>
        </div>
      </div>
    );
  }

  const unitTypes = unitTypesData?.billingUnitTypes || [];
  const filteredUnitTypes = showSystemDefined 
    ? unitTypes 
    : unitTypes.filter(ut => !ut.isSystemDefined);

  return (
    <PermissionGuard action="manage">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Billing Unit Types</h2>
            <p className="text-foreground opacity-75">
              Manage configurable billing units for service pricing
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSystemDefined(!showSystemDefined)}
              className="flex items-center gap-2"
            >
              {showSystemDefined ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showSystemDefined ? "Hide" : "Show"} System Types
            </Button>
            
            <Button onClick={openCreateDialog} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Unit Type
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Unit Type Configuration
            </CardTitle>
            <CardDescription>
              Configure how services are billed by defining custom unit types. System-defined types cannot be deleted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Display Name</TableHead>
                  <TableHead>Default Source</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUnitTypes.map((unitType) => (
                  <TableRow key={unitType.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {unitType.name}
                        </code>
                        {unitType.isSystemDefined && (
                          <Badge variant="secondary" className="text-xs">
                            System
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{unitType.displayName}</TableCell>
                    <TableCell>
                      {unitType.defaultSource ? (
                        <span className="capitalize">
                          {unitType.defaultSource.replace(/_/g, " ")}
                        </span>
                      ) : (
                        <span className="text-foreground opacity-60">Manual</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {unitType.requiresQuantityInput ? (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Quantified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Fixed
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={unitType.isActive ? "default" : "secondary"}
                        className={unitType.isActive ? "bg-green-100 text-green-800" : ""}
                      >
                        {unitType.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openUsageDialog(unitType.id)}
                        className="text-sm"
                      >
                        View Usage
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!unitType.isSystemDefined && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog({
                              ...unitType,
                              description: unitType.description || undefined
                            } as BillingUnitType)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(unitType.id, unitType.isActive || false)}
                        >
                          {unitType.isActive ? (
                            <PowerOff className="h-4 w-4 text-orange-600" />
                          ) : (
                            <Power className="h-4 w-4 text-green-600" />
                          )}
                        </Button>

                        {!unitType.isSystemDefined && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(unitType.id, unitType.displayName)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create/Edit Dialog */}
        <Dialog 
          open={showCreateDialog || editingUnitType !== null} 
          onOpenChange={(open) => {
            if (!open) {
              setShowCreateDialog(false);
              setEditingUnitType(null);
              resetForm();
            }
          }}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingUnitType ? "Edit Billing Unit Type" : "Create Billing Unit Type"}
              </DialogTitle>
              <DialogDescription>
                {editingUnitType 
                  ? "Update the billing unit type configuration" 
                  : "Define a new billing unit type for service pricing"
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name *</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    placeholder="Per Employee"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">System Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="per_employee"
                    className="font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Billing based on the number of employees..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultSource">Default Quantity Source</Label>
                <Select
                  value={formData.defaultSource}
                  onValueChange={(value) => setFormData({ ...formData, defaultSource: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_SOURCES.map((source) => (
                      <SelectItem key={source.value} value={source.value}>
                        {source.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requiresQuantityInput"
                  checked={formData.requiresQuantityInput}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, requiresQuantityInput: checked as boolean })
                  }
                />
                <Label htmlFor="requiresQuantityInput" className="text-sm">
                  Requires quantity input
                </Label>
              </div>

              {formData.requiresQuantityInput && (
                <div className="space-y-2">
                  <Label htmlFor="quantityPrompt">Quantity Input Prompt</Label>
                  <Input
                    id="quantityPrompt"
                    value={formData.quantityPrompt}
                    onChange={(e) => setFormData({ ...formData, quantityPrompt: e.target.value })}
                    placeholder="Number of employees"
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false);
                  setEditingUnitType(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingUnitType ? "Update Unit Type" : "Create Unit Type"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Usage Dialog */}
        <Dialog open={showUsageDialog} onOpenChange={setShowUsageDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Unit Type Usage</DialogTitle>
              <DialogDescription>
                Services currently using this billing unit type
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              {usageLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">
                      {usageData?.servicesAggregate.aggregate?.count || 0} services using this unit type
                    </Badge>
                  </div>
                  
                  {usageData?.services && usageData.services.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service Name</TableHead>
                          <TableHead>Base Rate</TableHead>
                          <TableHead>Billing Tier</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {usageData.services.map((service: any) => (
                          <TableRow key={service.id}>
                            <TableCell className="font-medium">{service.name}</TableCell>
                            <TableCell>${service.baseRate}</TableCell>
                            <TableCell className="capitalize">
                              {service.billingTier?.replace(/_/g, " ")}
                            </TableCell>
                            <TableCell>
                              <Badge variant={service.isActive ? "default" : "secondary"}>
                                {service.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-foreground opacity-60">
                      No services are currently using this unit type
                    </div>
                  )}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUsageDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGuard>
  );
}