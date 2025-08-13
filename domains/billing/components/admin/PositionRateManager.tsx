"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  DollarSign,
  User,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Info,
  Users,
  TrendingUp,
  Clock,
  Save,
  X,
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
import {
  GetServicePositionRatesDocument,
  GetEffectivePositionRateDocument,
  CreateServicePositionRateDocument,
  UpdateServicePositionRateDocument,
  DeleteServicePositionRateDocument,
  GetAllServicesWithRatesDocument,
  type ServicePositionRatesInsertInput,
  type ServicePositionRatesSetInput,
} from "../../graphql/generated/graphql";
import { useCurrentUser } from "@/hooks/use-current-user";
import { formatCurrency } from "@/lib/utils";

// Define UserPosition type locally since it may not be exported
type UserPosition = 
  | "consultant" 
  | "senior_consultant" 
  | "manager" 
  | "senior_manager" 
  | "director" 
  | "support_staff";

// Simple date formatting function
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

interface PositionRateFormData {
  serviceId: string;
  position: UserPosition;
  ratePerUnit: number;
  effectiveFrom: string;
  effectiveTo: string;
}

const defaultFormData: PositionRateFormData = {
  serviceId: "",
  position: "consultant" as UserPosition,
  ratePerUnit: 0,
  effectiveFrom: new Date().toISOString().split('T')[0],
  effectiveTo: "",
};

const positionOptions = [
  { value: "consultant", label: "Consultant", description: "Front-line service delivery" },
  { value: "senior_consultant", label: "Senior Consultant", description: "Experienced service delivery" },
  { value: "manager", label: "Manager", description: "Team leadership and oversight" },
  { value: "senior_manager", label: "Senior Manager", description: "Department leadership" },
  { value: "director", label: "Director", description: "Executive oversight" },
  { value: "support_staff", label: "Support Staff", description: "Administrative support" },
];

interface PositionRateManagerProps {
  serviceId?: string;
  onServiceSelect?: (serviceId: string) => void;
}

export function PositionRateManager({ 
  serviceId: initialServiceId, 
  onServiceSelect 
}: PositionRateManagerProps) {
  const { currentUser } = useCurrentUser();
  const [selectedServiceId, setSelectedServiceId] = useState(initialServiceId || "");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingRate, setEditingRate] = useState<any>(null);
  const [formData, setFormData] = useState<PositionRateFormData>(defaultFormData);
  const [previewPosition, setPreviewPosition] = useState<UserPosition>("consultant");
  const [previewDate, setPreviewDate] = useState(new Date().toISOString().split('T')[0]);

  // GraphQL queries
  const { data: servicesData, loading: loadingServices } = useQuery(
    GetAllServicesWithRatesDocument
  );

  const { data: positionRatesData, loading: loadingRates, refetch: refetchRates } = useQuery(
    GetServicePositionRatesDocument,
    {
      variables: { serviceId: selectedServiceId },
      skip: !selectedServiceId,
    }
  );

  const { data: effectiveRateData, loading: loadingEffective } = useQuery(
    GetEffectivePositionRateDocument,
    {
      variables: {
        serviceId: selectedServiceId,
        position: previewPosition,
        effectiveDate: previewDate,
      },
      skip: !selectedServiceId || !previewPosition,
    }
  );

  // GraphQL mutations
  const [createPositionRate, { loading: creating }] = useMutation(
    CreateServicePositionRateDocument,
    {
      onCompleted: () => {
        toast.success("Position rate created successfully");
        setShowCreateDialog(false);
        setFormData(defaultFormData);
        refetchRates();
      },
      onError: (error) => {
        toast.error(`Failed to create position rate: ${error.message}`);
      },
    }
  );

  const [updatePositionRate, { loading: updating }] = useMutation(
    UpdateServicePositionRateDocument,
    {
      onCompleted: () => {
        toast.success("Position rate updated successfully");
        setEditingRate(null);
        setFormData(defaultFormData);
        refetchRates();
      },
      onError: (error) => {
        toast.error(`Failed to update position rate: ${error.message}`);
      },
    }
  );

  const [deletePositionRate] = useMutation(DeleteServicePositionRateDocument, {
    onCompleted: () => {
      toast.success("Position rate deleted successfully");
      refetchRates();
    },
    onError: (error) => {
      toast.error(`Failed to delete position rate: ${error.message}`);
    },
  });

  const services = servicesData?.services || [];
  const positionRates = positionRatesData?.servicePositionRates || [];
  const effectiveRate = effectiveRateData?.servicePositionRates?.[0];
  const selectedService = services.find(s => s.id === selectedServiceId);

  // Update form data when service changes
  useEffect(() => {
    if (selectedServiceId && selectedServiceId !== formData.serviceId) {
      setFormData(prev => ({ ...prev, serviceId: selectedServiceId }));
    }
  }, [selectedServiceId]);

  // Update selected service when prop changes
  useEffect(() => {
    if (initialServiceId && initialServiceId !== selectedServiceId) {
      setSelectedServiceId(initialServiceId);
    }
  }, [initialServiceId]);

  const handleServiceChange = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    onServiceSelect?.(serviceId);
  };

  const handleCreate = async () => {
    if (!currentUser?.id) {
      toast.error("User authentication required");
      return;
    }

    if (!formData.serviceId || !formData.position || formData.ratePerUnit <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    const input: ServicePositionRatesInsertInput = {
      serviceId: formData.serviceId,
      position: formData.position,
      ratePerUnit: formData.ratePerUnit,
      effectiveFrom: formData.effectiveFrom,
      effectiveTo: formData.effectiveTo || null,
      createdBy: currentUser.id,
    };

    await createPositionRate({ variables: { input } });
  };

  const handleUpdate = async () => {
    if (!editingRate || !currentUser?.id) return;

    const updates: ServicePositionRatesSetInput = {
      ratePerUnit: formData.ratePerUnit,
      effectiveFrom: formData.effectiveFrom,
      effectiveTo: formData.effectiveTo || null,
      updatedBy: currentUser.id,
      updatedAt: "now()",
    };

    await updatePositionRate({
      variables: { id: editingRate.id, set: updates },
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this position rate?")) {
      await deletePositionRate({ variables: { id } });
    }
  };

  const startEdit = (rate: any) => {
    setEditingRate(rate);
    setFormData({
      serviceId: rate.serviceId,
      position: rate.position,
      ratePerUnit: rate.ratePerUnit,
      effectiveFrom: rate.effectiveFrom,
      effectiveTo: rate.effectiveTo || "",
    });
  };

  const resetForm = () => {
    setFormData({ ...defaultFormData, serviceId: selectedServiceId });
    setEditingRate(null);
    setShowCreateDialog(false);
  };

  const isRateActive = (rate: any) => {
    const today = new Date().toISOString().split('T')[0];
    const isAfterStart = rate.effectiveFrom <= today;
    const isBeforeEnd = !rate.effectiveTo || rate.effectiveTo >= today;
    return isAfterStart && isBeforeEnd;
  };

  const getCurrentEffectiveRate = (position: UserPosition) => {
    const activeRates = positionRates.filter(
      rate => rate.position === position && isRateActive(rate)
    );
    return activeRates.sort((a, b) => 
      new Date(b.effectiveFrom).getTime() - new Date(a.effectiveFrom).getTime()
    )[0];
  };

  if (loadingServices) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading services...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Position-Based Rate Management</h1>
          <p className="text-foreground opacity-60">
            Configure custom rates per position for each service
          </p>
        </div>
        {selectedServiceId && (
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Position Rate
          </Button>
        )}
      </div>

      {/* Service Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Service Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="serviceSelect">Select Service</Label>
              <Select
                value={selectedServiceId}
                onValueChange={handleServiceChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a service to manage rates" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{service.name}</span>
                        <div className="text-xs text-foreground opacity-60 flex items-center gap-2">
                          <span>{service.billingUnitType?.displayName}</span>
                          <span>•</span>
                          <span>{formatCurrency(service.baseRate || 0)} base rate</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedService && (
              <div>
                <Label>Service Details</Label>
                <div className="mt-2 p-3 border rounded">
                  <div className="font-medium">{selectedService.name}</div>
                  <div className="text-sm text-foreground opacity-60">
                    {selectedService.description}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <Badge variant="outline">
                      {selectedService.billingUnitType?.displayName}
                    </Badge>
                    <span>Base: {formatCurrency(selectedService.baseRate || 0)}</span>
                    <span>Tier: {selectedService.billingTier}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedServiceId && (
        <>
          {/* Rate Preview Tool */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Rate Preview
              </CardTitle>
              <p className="text-sm text-foreground opacity-60">
                Preview effective rates for different positions and dates
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="previewPosition">Position</Label>
                  <Select
                    value={previewPosition}
                    onValueChange={(value) => setPreviewPosition(value as UserPosition)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {positionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="previewDate">Effective Date</Label>
                  <Input
                    id="previewDate"
                    type="date"
                    value={previewDate}
                    onChange={(e) => setPreviewDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Effective Rate</Label>
                  <div className="mt-2">
                    {loadingEffective ? (
                      <div className="animate-pulse bg-muted h-8 rounded"></div>
                    ) : effectiveRate ? (
                      <div className="text-lg font-medium text-green-600">
                        {formatCurrency(effectiveRate.ratePerUnit)}
                        <div className="text-xs text-foreground opacity-60">
                          per {selectedService?.billingUnitType?.displayName?.toLowerCase()}
                        </div>
                      </div>
                    ) : (
                      <div className="text-lg font-medium">
                        {formatCurrency(selectedService?.baseRate || 0)}
                        <div className="text-xs text-foreground opacity-60">
                          base rate (no position override)
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {effectiveRate && (
                <Alert className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Position-specific rate active from {formatDate(effectiveRate.effectiveFrom)}
                    {effectiveRate.effectiveTo && ` until ${formatDate(effectiveRate.effectiveTo)}`}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Position Rates Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Position Rates
              </CardTitle>
              <p className="text-sm text-foreground opacity-60">
                Custom rates per position for {selectedService?.name}
              </p>
            </CardHeader>
            <CardContent>
              {loadingRates ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="ml-2">Loading position rates...</span>
                </div>
              ) : positionRates.length === 0 ? (
                <div className="text-center py-8 text-foreground opacity-60">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No position-specific rates configured</p>
                  <p className="text-sm">All positions will use the base service rate</p>
                  <Button
                    className="mt-4"
                    onClick={() => setShowCreateDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Position Rate
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Position</TableHead>
                      <TableHead>Rate per {selectedService?.billingUnitType?.displayName}</TableHead>
                      <TableHead>Effective Period</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {positionRates.map((rate) => {
                      const position = positionOptions.find(p => p.value === rate.position);
                      const isActive = isRateActive(rate);
                      
                      return (
                        <TableRow key={rate.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{position?.label}</div>
                              <div className="text-xs text-foreground opacity-60">
                                {position?.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-lg font-medium">
                              {formatCurrency(rate.ratePerUnit)}
                            </div>
                            <div className="text-xs text-foreground opacity-60">
                              vs {formatCurrency(selectedService?.baseRate || 0)} base
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>From: {formatDate(rate.effectiveFrom)}</div>
                              {rate.effectiveTo && (
                                <div>Until: {formatDate(rate.effectiveTo)}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={isActive ? "default" : "secondary"}>
                              {isActive ? (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <Clock className="h-3 w-3 mr-1" />
                                  {new Date(rate.effectiveFrom) > new Date() ? "Future" : "Expired"}
                                </>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{formatDate(rate.createdAt)}</div>
                              {rate.createdByUser && (
                                <div className="text-xs text-foreground opacity-60">
                                  by {rate.createdByUser.computedName}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEdit(rate)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(rate.id)}
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
              )}
            </CardContent>
          </Card>

          {/* Position Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Current Position Rate Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {positionOptions.map((position) => {
                  const currentRate = getCurrentEffectiveRate(position.value as UserPosition);
                  const effectiveAmount = currentRate?.ratePerUnit || selectedService?.baseRate || 0;
                  const isCustomRate = !!currentRate;
                  
                  return (
                    <div key={position.value} className="p-3 border rounded">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{position.label}</div>
                          <div className="text-xs text-foreground opacity-60">
                            {position.description}
                          </div>
                        </div>
                        {isCustomRate && (
                          <Badge variant="outline" className="text-xs">
                            Custom
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2">
                        <div className="text-lg font-medium">
                          {formatCurrency(effectiveAmount)}
                        </div>
                        <div className="text-xs text-foreground opacity-60">
                          per {selectedService?.billingUnitType?.displayName?.toLowerCase()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog || !!editingRate} onOpenChange={resetForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingRate ? "Edit Position Rate" : "Create Position Rate"}
            </DialogTitle>
            <DialogDescription>
              {editingRate
                ? "Update the position-specific rate configuration."
                : "Set a custom rate for a specific position on this service."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Position Selection */}
            <div>
              <Label htmlFor="position">Position</Label>
              <Select
                value={formData.position}
                onValueChange={(value) => setFormData(prev => ({ ...prev, position: value as UserPosition }))}
                disabled={!!editingRate}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {positionOptions.map((option) => (
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

            {/* Rate per Unit */}
            <div>
              <Label htmlFor="ratePerUnit">
                Rate per {selectedService?.billingUnitType?.displayName || "Unit"}
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-foreground opacity-60" />
                <Input
                  id="ratePerUnit"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.ratePerUnit}
                  onChange={(e) => setFormData(prev => ({ ...prev, ratePerUnit: parseFloat(e.target.value) || 0 }))}
                  className="pl-10"
                  placeholder="0.00"
                />
              </div>
              {selectedService && (
                <p className="text-xs text-foreground opacity-60 mt-1">
                  Base service rate: {formatCurrency(selectedService.baseRate || 0)}
                </p>
              )}
            </div>

            {/* Effective Period */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="effectiveFrom">Effective From</Label>
                <Input
                  id="effectiveFrom"
                  type="date"
                  value={formData.effectiveFrom}
                  onChange={(e) => setFormData(prev => ({ ...prev, effectiveFrom: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="effectiveTo">Effective Until (Optional)</Label>
                <Input
                  id="effectiveTo"
                  type="date"
                  value={formData.effectiveTo}
                  onChange={(e) => setFormData(prev => ({ ...prev, effectiveTo: e.target.value }))}
                  min={formData.effectiveFrom}
                />
                <p className="text-xs text-foreground opacity-60 mt-1">
                  Leave empty for no end date
                </p>
              </div>
            </div>

            {/* Rate Comparison */}
            {formData.ratePerUnit > 0 && selectedService && (
              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <div>
                      Position rate: {formatCurrency(formData.ratePerUnit)} per {selectedService.billingUnitType?.displayName?.toLowerCase()}
                    </div>
                    <div className="text-sm">
                      Base rate: {formatCurrency(selectedService.baseRate || 0)} 
                      ({formData.ratePerUnit > (selectedService.baseRate || 0) ? '+' : ''}
                      {formatCurrency(formData.ratePerUnit - (selectedService.baseRate || 0))} difference)
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={editingRate ? handleUpdate : handleCreate}
              disabled={creating || updating || !formData.position || formData.ratePerUnit <= 0}
            >
              {creating || updating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {editingRate ? "Update Rate" : "Create Rate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}