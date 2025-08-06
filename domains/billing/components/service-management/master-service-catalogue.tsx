"use client";

import { useQuery, useMutation, gql } from "@apollo/client";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// GraphQL Queries
const GET_ALL_SERVICES = gql`
  query GetAllServices {
    services(order_by: { name: asc }) {
      id
      name
      service_code
      description
      base_rate
      category
      service_type
      charge_basis
      billing_unit
      seniority_multipliers
      requires_quantity_input
      quantity_prompt
      is_time_based
      approval_level
      is_active
      created_at
      updated_at
    }
  }
`;

const GET_SERVICE_STATISTICS = gql`
  query GetServiceStatistics {
    servicesAggregate: services_aggregate {
      aggregate {
        count
      }
    }
    activeServicesAggregate: services_aggregate(where: { is_active: { _eq: true } }) {
      aggregate {
        count
      }
    }
    servicesByCategory: services_aggregate(group_by: category) {
      nodes {
        category
      }
      aggregate {
        count
      }
    }
  }
`;

const CREATE_SERVICE = gql`
  mutation CreateService($input: services_insert_input!) {
    insert_services_one(object: $input) {
      id
      name
      service_code
      category
      base_rate
    }
  }
`;

const UPDATE_SERVICE = gql`
  mutation UpdateService($id: uuid!, $input: services_set_input!) {
    update_services_by_pk(pk_columns: { id: $id }, _set: $input) {
      id
      name
      service_code
      updated_at
    }
  }
`;

const DELETE_SERVICE = gql`
  mutation DeleteService($id: uuid!) {
    delete_services_by_pk(id: $id) {
      id
      name
    }
  }
`;

// Types
interface Service {
  id: string;
  name: string;
  service_code: string;
  description?: string;
  base_rate?: number;
  category: string;
  service_type?: string;
  charge_basis: string;
  billing_unit?: string;
  seniority_multipliers?: any;
  requires_quantity_input?: boolean;
  quantity_prompt?: string;
  is_time_based?: boolean;
  approval_level?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ServiceFormData {
  name: string;
  description: string;
  category: string;
  service_type: string;
  charge_basis: string;
  base_rate: number;
  billing_unit: string;
  approval_level: string;
  requires_quantity_input: boolean;
  quantity_prompt: string;
  is_time_based: boolean;
  is_active: boolean;
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
  charge_basis: "per_payroll_processed",
  base_rate: 0,
  billing_unit: "Per Unit",
  approval_level: "review",
  requires_quantity_input: false,
  quantity_prompt: "",
  is_time_based: false,
  is_active: true,
  seniority_multipliers: {
    junior: 1.0,
    senior: 1.3,
    manager: 1.6,
    partner: 2.0
  }
};

const CHARGE_BASIS_OPTIONS = [
  { value: "per_client_monthly", label: "Per Client Monthly" },
  { value: "per_payroll_monthly", label: "Per Payroll Monthly" },
  { value: "per_payroll_processed", label: "Per Payroll Processed" },
  { value: "ad_hoc", label: "Ad Hoc" },
  { value: "per_payroll_per_employee", label: "Per Payroll Per Employee" },
  { value: "per_payroll_processed_per_employee", label: "Per Payroll Processed Per Employee" },
  { value: "per_payroll_by_time_and_seniority", label: "Per Payroll By Time and Seniority" },
  { value: "per_client_by_time_and_seniority", label: "Per Client By Time and Seniority" }
];

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
  const { data: servicesData, loading: servicesLoading, refetch } = useQuery(GET_ALL_SERVICES);
  const { data: statsData } = useQuery(GET_SERVICE_STATISTICS);
  
  const [createService] = useMutation(CREATE_SERVICE);
  const [updateService] = useMutation(UPDATE_SERVICE);
  const [deleteService] = useMutation(DELETE_SERVICE);

  const services: Service[] = servicesData?.services || [];

  // Filter services
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.service_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === "all" || service.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || 
                          (statusFilter === "active" && service.is_active) ||
                          (statusFilter === "inactive" && !service.is_active);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [services, searchTerm, categoryFilter, statusFilter]);

  // Statistics
  const totalServices = statsData?.servicesAggregate?.aggregate?.count || 0;
  const activeServices = statsData?.activeServicesAggregate?.aggregate?.count || 0;
  const categoryStats = statsData?.servicesByCategory?.map((item: any) => ({
    category: item.nodes[0]?.category || 'Unknown',
    count: item.aggregate.count
  })) || [];

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
            service_type: formData.service_type,
            charge_basis: formData.charge_basis,
            base_rate: formData.base_rate,
            billing_unit: formData.billing_unit,
            approval_level: formData.approval_level,
            requires_quantity_input: formData.requires_quantity_input,
            quantity_prompt: formData.requires_quantity_input ? formData.quantity_prompt : null,
            is_time_based: formData.is_time_based,
            is_active: formData.is_active,
            seniority_multipliers: JSON.stringify(formData.seniority_multipliers)
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
      service_type: service.service_type || "standard",
      charge_basis: service.charge_basis,
      base_rate: service.base_rate || 0,
      billing_unit: service.billing_unit || "Per Unit",
      approval_level: service.approval_level || "review",
      requires_quantity_input: service.requires_quantity_input || false,
      quantity_prompt: service.quantity_prompt || "",
      is_time_based: service.is_time_based || false,
      is_active: service.is_active,
      seniority_multipliers: service.seniority_multipliers ? 
        JSON.parse(service.seniority_multipliers) : 
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
            service_type: formData.service_type,
            charge_basis: formData.charge_basis,
            base_rate: formData.base_rate,
            billing_unit: formData.billing_unit,
            approval_level: formData.approval_level,
            requires_quantity_input: formData.requires_quantity_input,
            quantity_prompt: formData.requires_quantity_input ? formData.quantity_prompt : null,
            is_time_based: formData.is_time_based,
            is_active: formData.is_active,
            seniority_multipliers: JSON.stringify(formData.seniority_multipliers)
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
            <Label htmlFor="charge_basis">Charge Basis</Label>
            <Select value={formData.charge_basis} onValueChange={(value) => setFormData(prev => ({ ...prev, charge_basis: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select charge basis" />
              </SelectTrigger>
              <SelectContent>
                {CHARGE_BASIS_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              ${(services.reduce((sum, s) => sum + (s.base_rate || 0), 0) / (services.length || 1)).toFixed(0)}
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
                            {service.service_code}
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
                          {CHARGE_BASIS_OPTIONS.find(opt => opt.value === service.charge_basis)?.label || service.charge_basis}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="font-medium">
                          {service.base_rate ? `$${service.base_rate.toFixed(2)}` : 'Variable'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {service.billing_unit || 'per unit'}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {service.is_active ? (
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