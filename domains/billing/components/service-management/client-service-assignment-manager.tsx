"use client";

import { useQuery, useMutation } from "@apollo/client";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Settings, 
  Search,
  Filter,
  DollarSign, 
  Calendar, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Building,
  Package
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { gql } from "@apollo/client";

// GraphQL Queries
const GET_CLIENT_SERVICE_ASSIGNMENTS = gql`
  query GetClientServiceAssignments {
    client_service_assignments(order_by: { client: { name: asc } }) {
      id
      client_id
      service_id
      custom_rate
      custom_seniority_multipliers
      rate_effective_from
      rate_effective_to
      is_active
      notes
      created_at
      updated_at
      client {
        id
        name
        active
      }
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
      created_by_user {
        computed_name
      }
    }
  }
`;

const GET_CLIENTS_AND_SERVICES = gql`
  query GetClientsAndServices {
    clients(where: { active: { _eq: true } }, order_by: { name: asc }) {
      id
      name
      active
    }
    services(where: { is_active: { _eq: true } }, order_by: { name: asc }) {
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
`;

const GET_CLIENT_ASSIGNMENT_STATISTICS = gql`
  query GetClientAssignmentStatistics {
    assignmentsAggregate: client_service_assignments_aggregate {
      aggregate {
        count
      }
    }
    activeAssignmentsAggregate: client_service_assignments_aggregate(where: { is_active: { _eq: true } }) {
      aggregate {
        count
      }
    }
    clientsWithAssignments: client_service_assignments_aggregate(
      group_by: client_id
      where: { is_active: { _eq: true } }
    ) {
      aggregate {
        count
      }
    }
    assignmentsByCategory: client_service_assignments_aggregate(
      where: { is_active: { _eq: true } }
      group_by: [service: { category: {} }]
    ) {
      nodes {
        service {
          category
        }
      }
      aggregate {
        count
      }
    }
  }
`;

const CREATE_CLIENT_SERVICE_ASSIGNMENT = gql`
  mutation CreateClientServiceAssignment($input: client_service_assignments_insert_input!) {
    insert_client_service_assignments_one(object: $input) {
      id
      client {
        name
      }
      service {
        name
      }
    }
  }
`;

const UPDATE_CLIENT_SERVICE_ASSIGNMENT = gql`
  mutation UpdateClientServiceAssignment($id: uuid!, $input: client_service_assignments_set_input!) {
    update_client_service_assignments_by_pk(pk_columns: { id: $id }, _set: $input) {
      id
      custom_rate
      is_active
    }
  }
`;

const DELETE_CLIENT_SERVICE_ASSIGNMENT = gql`
  mutation DeleteClientServiceAssignment($id: uuid!) {
    delete_client_service_assignments_by_pk(id: $id) {
      id
      client {
        name
      }
      service {
        name
      }
    }
  }
`;

// Types
interface ClientServiceAssignment {
  id: string;
  client_id: string;
  service_id: string;
  custom_rate?: number;
  custom_seniority_multipliers?: any;
  rate_effective_from: string;
  rate_effective_to?: string;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
  client: {
    id: string;
    name: string;
    active: boolean;
  };
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
  created_by_user?: {
    computed_name: string;
  };
}

interface Client {
  id: string;
  name: string;
  active: boolean;
}

interface Service {
  id: string;
  name: string;
  service_code: string;
  category: string;
  base_rate?: number;
  billing_unit?: string;
  charge_basis: string;
  seniority_multipliers?: any;
}

interface AssignmentFormData {
  client_id: string;
  service_id: string;
  custom_rate?: number;
  custom_seniority_multipliers?: {
    junior: number;
    senior: number;
    manager: number;
    partner: number;
  };
  rate_effective_from: string;
  rate_effective_to?: string;
  is_active: boolean;
  notes?: string;
}

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

export function ClientServiceAssignmentManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [clientFilter, setClientFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAssignment, setSelectedAssignment] = useState<ClientServiceAssignment | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<AssignmentFormData>({
    client_id: "",
    service_id: "",
    rate_effective_from: new Date().toISOString().split('T')[0],
    is_active: true
  });

  // GraphQL hooks
  const { data: assignmentsData, loading: assignmentsLoading, refetch } = useQuery(GET_CLIENT_SERVICE_ASSIGNMENTS);
  const { data: clientsServicesData } = useQuery(GET_CLIENTS_AND_SERVICES);
  const { data: statsData } = useQuery(GET_CLIENT_ASSIGNMENT_STATISTICS);
  
  const [createAssignment] = useMutation(CREATE_CLIENT_SERVICE_ASSIGNMENT);
  const [updateAssignment] = useMutation(UPDATE_CLIENT_SERVICE_ASSIGNMENT);
  const [deleteAssignment] = useMutation(DELETE_CLIENT_SERVICE_ASSIGNMENT);

  const assignments: ClientServiceAssignment[] = assignmentsData?.client_service_assignments || [];
  const clients: Client[] = clientsServicesData?.clients || [];
  const services: Service[] = clientsServicesData?.services || [];

  // Filter assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter(assignment => {
      const matchesSearch = 
        assignment.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.service.service_code?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesClient = clientFilter === "all" || assignment.client_id === clientFilter;
      const matchesCategory = categoryFilter === "all" || assignment.service.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || 
                          (statusFilter === "active" && assignment.is_active) ||
                          (statusFilter === "inactive" && !assignment.is_active);

      return matchesSearch && matchesClient && matchesCategory && matchesStatus;
    });
  }, [assignments, searchTerm, clientFilter, categoryFilter, statusFilter]);

  // Statistics
  const totalAssignments = statsData?.assignmentsAggregate?.aggregate?.count || 0;
  const activeAssignments = statsData?.activeAssignmentsAggregate?.aggregate?.count || 0;
  const uniqueClients = statsData?.clientsWithAssignments?.aggregate?.count || 0;

  const getCategoryColor = (category: string) => {
    const option = CATEGORY_OPTIONS.find(opt => opt.value === category);
    return option?.color || "bg-gray-100 text-gray-800";
  };

  const getEffectiveRate = (assignment: ClientServiceAssignment) => {
    return assignment.custom_rate || assignment.service.base_rate || 0;
  };

  const handleCreateAssignment = async () => {
    try {
      await createAssignment({
        variables: {
          input: {
            client_id: formData.client_id,
            service_id: formData.service_id,
            custom_rate: formData.custom_rate || null,
            custom_seniority_multipliers: formData.custom_seniority_multipliers ? 
              JSON.stringify(formData.custom_seniority_multipliers) : null,
            rate_effective_from: formData.rate_effective_from,
            rate_effective_to: formData.rate_effective_to || null,
            is_active: formData.is_active,
            notes: formData.notes || null,
            created_by: "00000000-0000-0000-0000-000000000000" // TODO: Use actual user ID
          }
        }
      });

      const client = clients.find(c => c.id === formData.client_id);
      const service = services.find(s => s.id === formData.service_id);
      toast.success(`Assigned "${service?.name}" to "${client?.name}"`);
      
      setIsCreateDialogOpen(false);
      setFormData({
        client_id: "",
        service_id: "",
        rate_effective_from: new Date().toISOString().split('T')[0],
        is_active: true
      });
      refetch();
    } catch (error: any) {
      toast.error(`Failed to create assignment: ${error.message}`);
    }
  };

  const handleEditAssignment = (assignment: ClientServiceAssignment) => {
    setSelectedAssignment(assignment);
    setFormData({
      client_id: assignment.client_id,
      service_id: assignment.service_id,
      custom_rate: assignment.custom_rate || undefined,
      custom_seniority_multipliers: assignment.custom_seniority_multipliers ? 
        JSON.parse(assignment.custom_seniority_multipliers) : undefined,
      rate_effective_from: assignment.rate_effective_from,
      rate_effective_to: assignment.rate_effective_to || undefined,
      is_active: assignment.is_active,
      notes: assignment.notes || undefined
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateAssignment = async () => {
    if (!selectedAssignment) return;

    try {
      await updateAssignment({
        variables: {
          id: selectedAssignment.id,
          input: {
            custom_rate: formData.custom_rate || null,
            custom_seniority_multipliers: formData.custom_seniority_multipliers ? 
              JSON.stringify(formData.custom_seniority_multipliers) : null,
            rate_effective_from: formData.rate_effective_from,
            rate_effective_to: formData.rate_effective_to || null,
            is_active: formData.is_active,
            notes: formData.notes || null
          }
        }
      });

      toast.success("Assignment updated successfully");
      setIsEditDialogOpen(false);
      setSelectedAssignment(null);
      refetch();
    } catch (error: any) {
      toast.error(`Failed to update assignment: ${error.message}`);
    }
  };

  const handleDeleteAssignment = async (assignment: ClientServiceAssignment) => {
    if (!confirm(`Remove "${assignment.service.name}" from "${assignment.client.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteAssignment({
        variables: { id: assignment.id }
      });

      toast.success(`Removed "${assignment.service.name}" from "${assignment.client.name}"`);
      refetch();
    } catch (error: any) {
      toast.error(`Failed to delete assignment: ${error.message}`);
    }
  };

  const AssignmentForm = ({ isEditing = false }: { isEditing?: boolean }) => (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic Assignment</TabsTrigger>
          <TabsTrigger value="advanced">Custom Rates</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="client_id">Client *</Label>
              <Select 
                value={formData.client_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, client_id: value }))}
                disabled={isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        <span>{client.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="service_id">Service *</Label>
              <Select 
                value={formData.service_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, service_id: value }))}
                disabled={isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map(service => (
                    <SelectItem key={service.id} value={service.id}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          <span>{service.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getCategoryColor(service.category)}>
                            {service.category}
                          </Badge>
                          {service.base_rate && (
                            <span className="text-xs text-muted-foreground">
                              ${service.base_rate}
                            </span>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rate_effective_from">Effective From *</Label>
                <Input
                  id="rate_effective_from"
                  type="date"
                  value={formData.rate_effective_from}
                  onChange={(e) => setFormData(prev => ({ ...prev, rate_effective_from: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="rate_effective_to">Effective To (Optional)</Label>
                <Input
                  id="rate_effective_to"
                  type="date"
                  value={formData.rate_effective_to || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, rate_effective_to: e.target.value || undefined }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Optional notes about this assignment"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Active Assignment</Label>
                <p className="text-sm text-muted-foreground">
                  Inactive assignments won't appear in billing
                </p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div>
            <Label htmlFor="custom_rate">Custom Rate ($)</Label>
            <Input
              id="custom_rate"
              type="number"
              step="0.01"
              value={formData.custom_rate || ""}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                custom_rate: e.target.value ? parseFloat(e.target.value) : undefined 
              }))}
              placeholder={
                formData.service_id 
                  ? `Default: $${services.find(s => s.id === formData.service_id)?.base_rate || 0}`
                  : "Leave empty to use service default"
              }
            />
            <p className="text-sm text-muted-foreground mt-1">
              Override the service's default rate for this client
            </p>
          </div>

          {formData.service_id && (
            <div className="space-y-4">
              <Label>Custom Seniority Multipliers</Label>
              <p className="text-sm text-muted-foreground">
                Override default multipliers for this client assignment
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="junior_mult">Junior (×)</Label>
                  <Input
                    id="junior_mult"
                    type="number"
                    step="0.1"
                    value={formData.custom_seniority_multipliers?.junior || ""}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      custom_seniority_multipliers: {
                        ...prev.custom_seniority_multipliers,
                        junior: parseFloat(e.target.value) || 1.0,
                        senior: prev.custom_seniority_multipliers?.senior || 1.3,
                        manager: prev.custom_seniority_multipliers?.manager || 1.6,
                        partner: prev.custom_seniority_multipliers?.partner || 2.0
                      }
                    }))}
                    placeholder="1.0"
                  />
                </div>
                <div>
                  <Label htmlFor="senior_mult">Senior (×)</Label>
                  <Input
                    id="senior_mult"
                    type="number"
                    step="0.1"
                    value={formData.custom_seniority_multipliers?.senior || ""}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      custom_seniority_multipliers: {
                        junior: prev.custom_seniority_multipliers?.junior || 1.0,
                        ...prev.custom_seniority_multipliers,
                        senior: parseFloat(e.target.value) || 1.3,
                        manager: prev.custom_seniority_multipliers?.manager || 1.6,
                        partner: prev.custom_seniority_multipliers?.partner || 2.0
                      }
                    }))}
                    placeholder="1.3"
                  />
                </div>
                <div>
                  <Label htmlFor="manager_mult">Manager (×)</Label>
                  <Input
                    id="manager_mult"
                    type="number"
                    step="0.1"
                    value={formData.custom_seniority_multipliers?.manager || ""}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      custom_seniority_multipliers: {
                        junior: prev.custom_seniority_multipliers?.junior || 1.0,
                        senior: prev.custom_seniority_multipliers?.senior || 1.3,
                        ...prev.custom_seniority_multipliers,
                        manager: parseFloat(e.target.value) || 1.6,
                        partner: prev.custom_seniority_multipliers?.partner || 2.0
                      }
                    }))}
                    placeholder="1.6"
                  />
                </div>
                <div>
                  <Label htmlFor="partner_mult">Partner (×)</Label>
                  <Input
                    id="partner_mult"
                    type="number"
                    step="0.1"
                    value={formData.custom_seniority_multipliers?.partner || ""}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      custom_seniority_multipliers: {
                        junior: prev.custom_seniority_multipliers?.junior || 1.0,
                        senior: prev.custom_seniority_multipliers?.senior || 1.3,
                        manager: prev.custom_seniority_multipliers?.manager || 1.6,
                        ...prev.custom_seniority_multipliers,
                        partner: parseFloat(e.target.value) || 2.0
                      }
                    }))}
                    placeholder="2.0"
                  />
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  if (assignmentsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading client service assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Client Service Assignments</h1>
          <p className="text-muted-foreground mt-1">
            Manage which services are available to each client
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Assign Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Assign Service to Client</DialogTitle>
            </DialogHeader>
            <AssignmentForm />
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateAssignment} 
                disabled={!formData.client_id || !formData.service_id}
              >
                Create Assignment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssignments}</div>
            <p className="text-xs text-muted-foreground">
              All client-service pairs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeAssignments}</div>
            <p className="text-xs text-muted-foreground">
              Available for billing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients Covered</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueClients}</div>
            <p className="text-xs text-muted-foreground">
              With active services
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg per Client</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {uniqueClients > 0 ? Math.round(activeAssignments / uniqueClients) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Services per client
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Assignment Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients or services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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

          {/* Assignments Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Effective Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">
                        <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        {searchTerm || clientFilter !== "all" || categoryFilter !== "all" || statusFilter !== "all"
                          ? "No assignments match your filters"
                          : "No service assignments found"
                        }
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{assignment.client.name}</div>
                            {!assignment.client.active && (
                              <Badge variant="outline" className="bg-red-100 text-red-800 text-xs">
                                Inactive Client
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{assignment.service.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {assignment.service.service_code}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant="outline" className={getCategoryColor(assignment.service.category)}>
                          {assignment.service.category}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            ${getEffectiveRate(assignment).toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {assignment.custom_rate ? (
                              <Badge variant="outline" className="bg-orange-100 text-orange-800 text-xs">
                                Custom
                              </Badge>
                            ) : (
                              assignment.service.billing_unit || 'per unit'
                            )}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm">
                          <div>From: {new Date(assignment.rate_effective_from).toLocaleDateString()}</div>
                          {assignment.rate_effective_to && (
                            <div>To: {new Date(assignment.rate_effective_to).toLocaleDateString()}</div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {assignment.is_active ? (
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
                            onClick={() => handleEditAssignment(assignment)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAssignment(assignment)}
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

      {/* Edit Assignment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Edit Assignment: {selectedAssignment?.service.name} → {selectedAssignment?.client.name}
            </DialogTitle>
          </DialogHeader>
          <AssignmentForm isEditing={true} />
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateAssignment}>
              Update Assignment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}