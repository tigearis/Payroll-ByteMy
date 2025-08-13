"use client";

import { useQuery, useMutation } from "@apollo/client";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Settings, 
  DollarSign, 
  Users, 
  Clock, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Archive
} from "lucide-react";
import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  GetAllServicesDocument,
  GetActiveBillingUnitTypesDocument,
  GetServiceStatisticsDocument,
  CreateServiceDocument,
  UpdateServiceDocument,
  DeleteServiceDocument,
  type GetAllServicesQuery,
  type GetActiveBillingUnitTypesQuery,
  type GetServiceStatisticsQuery,
  type CreateServiceMutation,
  type CreateServiceMutationVariables,
  type UpdateServiceMutation,
  type UpdateServiceMutationVariables,
  type DeleteServiceMutation,
  type DeleteServiceMutationVariables
} from "../../graphql/generated/graphql";

// Types - Use the generated GraphQL types instead of local interface
type Service = NonNullable<GetAllServicesQuery['services'][0]>;

interface ServiceFormData {
  name: string;
  description: string;
  category: string;
  service_type: string;
  billing_unit_type_id: string;
  base_rate: number;
  approval_level: string;
  is_active: boolean;
  chargeBasis: string;
  billing_unit: string;
  requires_quantity_input: boolean;
  quantity_prompt: string;
  is_time_based: boolean;
  seniority_multipliers: {
    junior: number;
    senior: number;
    manager: number;
    partner: number;
  };
}

const defaultFormData: ServiceFormData = {
  name: "",
  description: "",
  category: "standard",
  service_type: "standard",
  billing_unit_type_id: "",
  base_rate: 0,
  approval_level: "review",
  is_active: true,
  chargeBasis: "fixed",
  billing_unit: "each",
  requires_quantity_input: false,
  quantity_prompt: "",
  is_time_based: false,
  seniority_multipliers: {
    junior: 1.0,
    senior: 1.3,
    manager: 1.6,
    partner: 2.0
  }
};

// Legacy charge basis options - now replaced by configurable billing unit types

const CATEGORY_OPTIONS = [
  { value: "standard", label: "Standard", color: "bg-blue-100 text-blue-800" },
  { value: "complex", label: "Complex", color: "bg-orange-100 text-orange-800" },
  { value: "statutory", label: "Statutory", color: "bg-green-100 text-green-800" },
  { value: "recurring", label: "Recurring", color: "bg-purple-100 text-purple-800" },
  { value: "premium", label: "Premium", color: "bg-yellow-100 text-yellow-800" },
  { value: "consultation", label: "Consultation", color: "bg-indigo-100 text-indigo-800" },
  { value: "implementation", label: "Implementation", color: "bg-pink-100 text-pink-800" },
  { value: "emergency", label: "Emergency", color: "bg-red-100 text-red-800" },
  { value: "audit", label: "Audit", color: "bg-gray-100 text-gray-800" }
];

const APPROVAL_LEVEL_OPTIONS = [
  { value: "auto", label: "Automatic", icon: CheckCircle },
  { value: "review", label: "Review Required", icon: Eye },
  { value: "manager", label: "Manager Approval", icon: Users },
  { value: "admin", label: "Admin Approval", icon: Settings }
];

export function MasterServiceCatalogue() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>(defaultFormData);

  // GraphQL hooks
  const { data: servicesData, loading: servicesLoading, refetch } = useQuery<GetAllServicesQuery>(GetAllServicesDocument);
  const { data: statsData } = useQuery<GetServiceStatisticsQuery>(GetServiceStatisticsDocument);
  const { data: billingUnitTypesData, loading: billingUnitTypesLoading } = useQuery<GetActiveBillingUnitTypesQuery>(GetActiveBillingUnitTypesDocument);
  
  const [createService] = useMutation<CreateServiceMutation, CreateServiceMutationVariables>(CreateServiceDocument);
  const [updateService] = useMutation<UpdateServiceMutation, UpdateServiceMutationVariables>(UpdateServiceDocument);
  const [deleteService] = useMutation<DeleteServiceMutation, DeleteServiceMutationVariables>(DeleteServiceDocument);

  const services: Service[] = servicesData?.services || [];

  // Filter services
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.serviceCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === "all" || service.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || 
                          (statusFilter === "active" && service.isActive) ||
                          (statusFilter === "inactive" && !service.isActive);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [services, searchTerm, categoryFilter, statusFilter]);

  // Statistics
  const totalServices = statsData?.servicesAggregate?.aggregate?.count || 0;
  const activeServices = statsData?.activeServicesAggregate?.aggregate?.count || 0;
  
  // Calculate category stats from the actual services data
  const categoryStats = useMemo(() => {
    const categoryCounts: Record<string, number> = {};
    services.forEach(service => {
      const category = service.category || 'Unknown';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    return Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count
    }));
  }, [services]);

  const getCategoryColor = (category: string) => {
    const option = CATEGORY_OPTIONS.find(opt => opt.value === category);
    return option?.color || "bg-gray-100 text-gray-800";
  };

  const handleCreateService = async () => {
    try {
      await createService({
        variables: {
          input: {
            name: formData.name,
            description: formData.description,
            category: formData.category,
            serviceType: formData.service_type,
            chargeBasis: formData.chargeBasis,
            baseRate: formData.base_rate,
            billingUnitTypeId: formData.billing_unit_type_id,
            approvalLevel: formData.approval_level,
            requiresQuantityInput: formData.requires_quantity_input,
            quantityPrompt: formData.requires_quantity_input ? formData.quantity_prompt : null,
            isTimeBased: formData.is_time_based,
            isActive: formData.is_active,
            seniorityMultipliers: JSON.stringify(formData.seniority_multipliers)
          }
        }
      });

      toast.success(`Service "${formData.name}" created successfully`);
      setIsCreateDialogOpen(false);
      setFormData(defaultFormData);
      refetch();
    } catch (error: any) {
      toast.error(`Failed to create service: ${error.message}`);
    }
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      description: service.description || "",
      category: service.category,
      service_type: service.serviceType || "standard",
      billing_unit_type_id: service.billingUnitTypeId || "",
      base_rate: service.defaultRate || 0,
      approval_level: service.approvalLevel || "review",
      is_active: service.isActive || false,
      chargeBasis: (service as any).chargeBasis || "fixed",
      billing_unit: (service as any).billing_unit || "each",
      requires_quantity_input: (service as any).requires_quantity_input || false,
      quantity_prompt: (service as any).quantity_prompt || "",
      is_time_based: (service as any).is_time_based || false,
      seniority_multipliers: service.seniorityMultipliers ? 
        JSON.parse(service.seniorityMultipliers) : 
        { junior: 1.0, senior: 1.3, manager: 1.6, partner: 2.0 }
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateService = async () => {
    if (!selectedService) return;

    try {
      await updateService({
        variables: {
          id: selectedService.id,
          input: {
            name: formData.name,
            description: formData.description,
            category: formData.category,
            serviceType: formData.service_type,
            chargeBasis: formData.chargeBasis,
            baseRate: formData.base_rate,
            billingUnitTypeId: formData.billing_unit_type_id,
            approvalLevel: formData.approval_level,
            requiresQuantityInput: formData.requires_quantity_input,
            quantityPrompt: formData.requires_quantity_input ? formData.quantity_prompt : null,
            isTimeBased: formData.is_time_based,
            isActive: formData.is_active,
            seniorityMultipliers: JSON.stringify(formData.seniority_multipliers)
          }
        }
      });

      toast.success(`Service "${formData.name}" updated successfully`);
      setIsEditDialogOpen(false);
      setSelectedService(null);
      setFormData(defaultFormData);
      refetch();
    } catch (error: any) {
      toast.error(`Failed to update service: ${error.message}`);
    }
  };

  const handleDeleteService = async (service: Service) => {
    if (!confirm(`Are you sure you want to delete "${service.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteService({
        variables: { id: service.id }
      });

      toast.success(`Service "${service.name}" deleted successfully`);
      refetch();
    } catch (error: any) {
      toast.error(`Failed to delete service: ${error.message}`);
    }
  };

  const ServiceForm = () => (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="billing">Billing Setup</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="name">Service Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter service name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this service includes"
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="approval_level">Approval Level</Label>
                <Select value={formData.approval_level} onValueChange={(value) => setFormData(prev => ({ ...prev, approval_level: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select approval level" />
                  </SelectTrigger>
                  <SelectContent>
                    {APPROVAL_LEVEL_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <option.icon className="h-4 w-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="base_rate">Base Rate ($)</Label>
              <Input
                id="base_rate"
                type="number"
                step="0.01"
                value={formData.base_rate}
                onChange={(e) => setFormData(prev => ({ ...prev, base_rate: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="billing_unit">Billing Unit</Label>
              <Input
                id="billing_unit"
                value={formData.billing_unit}
                onChange={(e) => setFormData(prev => ({ ...prev, billing_unit: e.target.value }))}
                placeholder="e.g., Per Hour, Per Employee"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="billing_unit_type_id">Billing Unit Type</Label>
            <Select 
              value={formData.billing_unit_type_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, billing_unit_type_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select billing unit type" />
              </SelectTrigger>
              <SelectContent>
                {billingUnitTypesData?.billingUnitTypes.map((unitType: any) => (
                  <SelectItem key={unitType.id} value={unitType.id}>
                    <div className="flex items-center gap-2">
                      <span>{unitType.display_name}</span>
                      {unitType.is_system_defined && (
                        <Badge variant="secondary" className="text-xs">System</Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.billing_unit_type_id && (
              <div className="mt-2 text-sm text-foreground opacity-75">
                {billingUnitTypesData?.billingUnitTypes.find((ut: any) => ut.id === formData.billing_unit_type_id)?.description}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Label>Seniority Level Multipliers</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="junior_mult">Junior (×)</Label>
                <Input
                  id="junior_mult"
                  type="number"
                  step="0.1"
                  value={formData.seniority_multipliers.junior}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    seniority_multipliers: {
                      ...prev.seniority_multipliers,
                      junior: parseFloat(e.target.value) || 1.0
                    }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="senior_mult">Senior (×)</Label>
                <Input
                  id="senior_mult"
                  type="number"
                  step="0.1"
                  value={formData.seniority_multipliers.senior}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    seniority_multipliers: {
                      ...prev.seniority_multipliers,
                      senior: parseFloat(e.target.value) || 1.3
                    }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="manager_mult">Manager (×)</Label>
                <Input
                  id="manager_mult"
                  type="number"
                  step="0.1"
                  value={formData.seniority_multipliers.manager}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    seniority_multipliers: {
                      ...prev.seniority_multipliers,
                      manager: parseFloat(e.target.value) || 1.6
                    }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="partner_mult">Partner (×)</Label>
                <Input
                  id="partner_mult"
                  type="number"
                  step="0.1"
                  value={formData.seniority_multipliers.partner}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    seniority_multipliers: {
                      ...prev.seniority_multipliers,
                      partner: parseFloat(e.target.value) || 2.0
                    }
                  }))}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Time-based Service</Label>
                <p className="text-sm text-muted-foreground">
                  Enable if this service uses time tracking for billing
                </p>
              </div>
              <Switch
                checked={formData.is_time_based}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_time_based: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Requires Quantity Input</Label>
                <p className="text-sm text-muted-foreground">
                  Ask users to specify quantity when completing payrolls
                </p>
              </div>
              <Switch
                checked={formData.requires_quantity_input}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requires_quantity_input: checked }))}
              />
            </div>

            {formData.requires_quantity_input && (
              <div>
                <Label htmlFor="quantity_prompt">Quantity Prompt</Label>
                <Input
                  id="quantity_prompt"
                  value={formData.quantity_prompt}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity_prompt: e.target.value }))}
                  placeholder="e.g., Number of employees processed"
                  className="mt-1"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Active Service</Label>
                <p className="text-sm text-muted-foreground">
                  Inactive services are hidden from client assignments
                </p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  if (servicesLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading service catalogue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Statistics */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Service Catalogue</h1>
          <p className="text-muted-foreground mt-1">
            Manage your service offerings and pricing structure
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create New Service</DialogTitle>
            </DialogHeader>
            <ServiceForm />
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateService} disabled={!formData.name}>
                Create Service
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalServices}</div>
            <p className="text-xs text-muted-foreground">
              Services in catalogue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeServices}</div>
            <p className="text-xs text-muted-foreground">
              Available for assignment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoryStats.length}</div>
            <p className="text-xs text-muted-foreground">
              Service categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(services.reduce((sum, s) => sum + (s.defaultRate || 0), 0) / (services.length || 1)).toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all services
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Service Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORY_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Services Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Charge Basis</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-muted-foreground">
                        <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        {searchTerm || categoryFilter !== "all" || statusFilter !== "all" 
                          ? "No services match your filters" 
                          : "No services found"
                        }
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {service.serviceCode}
                          </div>
                          {service.description && (
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {service.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant="outline" className={getCategoryColor(service.category)}>
                          {service.category}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-2">
                            <span>{service.billingUnitType?.displayName || 'Not Set'}</span>
                            {service.billingUnitType?.isSystemDefined && (
                              <Badge variant="secondary" className="text-xs">System</Badge>
                            )}
                          </div>
                          {service.billingUnitType?.description && (
                            <div className="text-xs text-foreground opacity-60 mt-1">
                              {service.billingUnitType.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="font-medium">
                          {service.defaultRate ? `$${service.defaultRate.toFixed(2)}` : 'Variable'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {(service as any).billing_unit || service.billingUnitType?.displayName || 'per unit'}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {service.isActive ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-green-600">Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-600" />
                              <span className="text-red-600">Inactive</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditService(service)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteService(service)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Service Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Service: {selectedService?.name}</DialogTitle>
          </DialogHeader>
          <ServiceForm />
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateService}>
              Update Service
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}