'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Settings, 
  Building, 
  Package, 
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Filter
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// GraphQL Queries and Mutations
const GET_CLIENT_SERVICE_AGREEMENTS = gql`
  query GetClientServiceAgreements(
    $clientId: uuid!
    $limit: Int = 50
    $offset: Int = 0
    $isActive: Boolean
    $serviceCategory: String
  ) {
    clientServiceAgreements(
      where: {
        clientId: { _eq: $clientId }
        isActive: { _eq: $isActive }
        service: {
          category: {
            name: { _ilike: $serviceCategory }
          }
        }
      }
      limit: $limit
      offset: $offset
      orderBy: [{ service: { category: { displayOrder: ASC } } }, { service: { displayOrder: ASC } }]
    ) {
      id
      serviceId
      customRate
      billingFrequency
      isActive
      isEnabled
      startDate
      endDate
      serviceConfiguration
      billingNotes
      lastBilledAt
      totalBilled
      createdAt
      updatedAt
      
      service {
        id
        name
        description
        category
        billingUnit
        defaultRate
        currency
        serviceType
        billingTier
        tierPriority
        isActive
        category {
          id
          name
          description
        }
      }
      
      client {
        id
        name
        contactEmail
        active
      }
      
      createdByUser: userByCreatedBy {
        id
        computedName
      }
      
      recentBillingItems: billingItems(
        limit: 5
        orderBy: { createdAt: DESC }
      ) {
        id
        description
        totalAmount
        status
        createdAt
      }
    }
    
    clients(
      where: { id: { _eq: $clientId } }
    ) {
      id
      name
      contactEmail
      active
      
      serviceAgreementsAggregate {
        aggregate {
          count
        }
      }
      
      recentBillingItems: billingItems(
        limit: 10
        orderBy: { createdAt: DESC }
      ) {
        id
        serviceName
        totalAmount
        status
        createdAt
      }
    }
    
    services(
      where: { isActive: { _eq: true } }
      orderBy: [{ category: { displayOrder: ASC } }, { displayOrder: ASC }]
    ) {
      id
      name
      description
      category
      billingUnit
      defaultRate
      currency
      serviceType
      billingTier
      isActive
      category {
        id
        name
        description
      }
    }
    
    serviceCategories(
      where: { isActive: { _eq: true } }
      orderBy: { displayOrder: ASC }
    ) {
      id
      name
      description
    }
  }
`;

const CREATE_CLIENT_SERVICE_AGREEMENT = gql`
  mutation CreateClientServiceAgreement($input: ClientServiceAgreementsInsertInput!) {
    insertClientServiceAgreementsOne(object: $input) {
      id
      serviceId
      customRate
      billingFrequency
      isActive
      isEnabled
    }
  }
`;

const UPDATE_CLIENT_SERVICE_AGREEMENT = gql`
  mutation UpdateClientServiceAgreement(
    $id: uuid!
    $updates: ClientServiceAgreementsSetInput!
  ) {
    updateClientServiceAgreementsByPk(
      pkColumns: { id: $id }
      _set: $updates
    ) {
      id
      customRate
      billingFrequency
      isActive
      isEnabled
    }
  }
`;

const DELETE_CLIENT_SERVICE_AGREEMENT = gql`
  mutation DeleteClientServiceAgreement($id: uuid!) {
    updateClientServiceAgreementsByPk(
      pkColumns: { id: $id }
      _set: { isActive: false }
    ) {
      id
    }
  }
`;

const BULK_UPDATE_AGREEMENTS = gql`
  mutation BulkUpdateAgreements(
    $clientId: uuid!
    $updates: ClientServiceAgreementsSetInput!
    $where: ClientServiceAgreementsBoolExp!
  ) {
    updateClientServiceAgreements(
      where: {
        clientId: { _eq: $clientId }
        _and: [$where]
      }
      _set: $updates
    ) {
      affectedRows
      returning {
        id
        isActive
        isEnabled
      }
    }
  }
`;

interface ClientServiceAgreement {
  id: string;
  serviceId: string;
  customRate?: number;
  billingFrequency: string;
  isActive: boolean;
  isEnabled: boolean;
  startDate?: string;
  endDate?: string;
  serviceConfiguration?: any;
  billingNotes?: string;
  lastBilledAt?: string;
  totalBilled?: number;
  createdAt: string;
  updatedAt: string;
  service: Service;
  client: Client;
  createdByUser?: {
    id: string;
    computedName: string;
  };
  recentBillingItems: BillingItem[];
}

interface Service {
  id: string;
  name: string;
  description?: string;
  category: string;
  billingUnit: string;
  defaultRate?: number;
  currency: string;
  serviceType: string;
  billingTier: string;
  tierPriority?: number;
  isActive: boolean;
  category: ServiceCategory;
}

interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
}

interface Client {
  id: string;
  name: string;
  contactEmail: string;
  active: boolean;
}

interface BillingItem {
  id: string;
  description: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface AgreementFormData {
  serviceId: string;
  customRate?: number;
  billingFrequency: string;
  isEnabled: boolean;
  startDate?: string;
  endDate?: string;
  serviceConfiguration?: string;
  billingNotes?: string;
}

interface EnhancedClientServiceManagerProps {
  clientId: string;
}

const EnhancedClientServiceManager: React.FC<EnhancedClientServiceManagerProps> = ({
  clientId
}) => {
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAgreement, setEditingAgreement] = useState<ClientServiceAgreement | null>(null);
  const [selectedAgreements, setSelectedAgreements] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  const [formData, setFormData] = useState<AgreementFormData>({
    serviceId: '',
    customRate: undefined,
    billingFrequency: 'per_use',
    isEnabled: true,
    startDate: '',
    endDate: '',
    serviceConfiguration: '',
    billingNotes: ''
  });

  const { data, loading, error, refetch } = useQuery(GET_CLIENT_SERVICE_AGREEMENTS, {
    variables: {
      clientId,
      isActive: activeFilter,
      serviceCategory: categoryFilter ? `%${categoryFilter}%` : undefined
    },
    fetchPolicy: 'cache-and-network'
  });

  const [createAgreement] = useMutation(CREATE_CLIENT_SERVICE_AGREEMENT);
  const [updateAgreement] = useMutation(UPDATE_CLIENT_SERVICE_AGREEMENT);
  const [deleteAgreement] = useMutation(DELETE_CLIENT_SERVICE_AGREEMENT);
  const [bulkUpdate] = useMutation(BULK_UPDATE_AGREEMENTS);

  const agreements = data?.clientServiceAgreements || [];
  const client = data?.clients?.[0];
  const availableServices = data?.services || [];
  const categories = data?.serviceCategories || [];

  // Filter agreements by search term
  const filteredAgreements = agreements.filter((agreement: ClientServiceAgreement) =>
    agreement.service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agreement.service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agreement.service.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get services not already assigned to client
  const unassignedServices = availableServices.filter((service: Service) =>
    !agreements.find(agreement => agreement.serviceId === service.id && agreement.isActive)
  );

  const handleCreateAgreement = async () => {
    try {
      await createAgreement({
        variables: {
          input: {
            clientId,
            serviceId: formData.serviceId,
            customRate: formData.customRate || null,
            billingFrequency: formData.billingFrequency,
            isActive: true,
            isEnabled: formData.isEnabled,
            startDate: formData.startDate || null,
            endDate: formData.endDate || null,
            serviceConfiguration: formData.serviceConfiguration ? JSON.parse(formData.serviceConfiguration) : null,
            billingNotes: formData.billingNotes || null
          }
        }
      });
      
      toast({
        title: "Success",
        description: "Service agreement created successfully"
      });
      
      setIsCreateModalOpen(false);
      resetFormData();
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create service agreement",
        variant: "destructive"
      });
    }
  };

  const handleUpdateAgreement = async () => {
    if (!editingAgreement) return;
    
    try {
      await updateAgreement({
        variables: {
          id: editingAgreement.id,
          updates: {
            customRate: formData.customRate || null,
            billingFrequency: formData.billingFrequency,
            isEnabled: formData.isEnabled,
            startDate: formData.startDate || null,
            endDate: formData.endDate || null,
            serviceConfiguration: formData.serviceConfiguration ? JSON.parse(formData.serviceConfiguration) : null,
            billingNotes: formData.billingNotes || null,
            updatedAt: new Date().toISOString()
          }
        }
      });
      
      toast({
        title: "Success",
        description: "Service agreement updated successfully"
      });
      
      setIsEditModalOpen(false);
      setEditingAgreement(null);
      resetFormData();
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update service agreement",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAgreement = async (agreementId: string) => {
    if (!confirm('Are you sure you want to delete this service agreement?')) return;
    
    try {
      await deleteAgreement({
        variables: { id: agreementId }
      });
      
      toast({
        title: "Success",
        description: "Service agreement deleted successfully"
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete service agreement",
        variant: "destructive"
      });
    }
  };

  const handleBulkAction = async (action: 'enable' | 'disable' | 'delete') => {
    if (selectedAgreements.size === 0) return;
    
    let updates: any = {};
    let confirmMessage = '';
    
    switch (action) {
      case 'enable':
        updates = { isEnabled: true };
        confirmMessage = `Enable ${selectedAgreements.size} service agreements?`;
        break;
      case 'disable':
        updates = { isEnabled: false };
        confirmMessage = `Disable ${selectedAgreements.size} service agreements?`;
        break;
      case 'delete':
        updates = { isActive: false };
        confirmMessage = `Delete ${selectedAgreements.size} service agreements?`;
        break;
    }
    
    if (!confirm(confirmMessage)) return;
    
    try {
      await bulkUpdate({
        variables: {
          clientId,
          updates,
          where: { id: { _in: Array.from(selectedAgreements) } }
        }
      });
      
      toast({
        title: "Success",
        description: `Bulk ${action} completed successfully`
      });
      
      setSelectedAgreements(new Set());
      setShowBulkActions(false);
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to perform bulk ${action}`,
        variant: "destructive"
      });
    }
  };

  const openEditModal = (agreement: ClientServiceAgreement) => {
    setEditingAgreement(agreement);
    setFormData({
      serviceId: agreement.serviceId,
      customRate: agreement.customRate || undefined,
      billingFrequency: agreement.billingFrequency,
      isEnabled: agreement.isEnabled,
      startDate: agreement.startDate || '',
      endDate: agreement.endDate || '',
      serviceConfiguration: agreement.serviceConfiguration ? JSON.stringify(agreement.serviceConfiguration, null, 2) : '',
      billingNotes: agreement.billingNotes || ''
    });
    setIsEditModalOpen(true);
  };

  const resetFormData = () => {
    setFormData({
      serviceId: '',
      customRate: undefined,
      billingFrequency: 'per_use',
      isEnabled: true,
      startDate: '',
      endDate: '',
      serviceConfiguration: '',
      billingNotes: ''
    });
  };

  const handleSelectAgreement = (agreementId: string, checked: boolean) => {
    const newSelected = new Set(selectedAgreements);
    if (checked) {
      newSelected.add(agreementId);
    } else {
      newSelected.delete(agreementId);
    }
    setSelectedAgreements(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const getStatusColor = (agreement: ClientServiceAgreement) => {
    if (!agreement.isActive) return 'bg-gray-100 text-gray-800';
    if (!agreement.isEnabled) return 'bg-red-100 text-red-800';
    if (agreement.endDate && new Date(agreement.endDate) < new Date()) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (agreement: ClientServiceAgreement) => {
    if (!agreement.isActive) return 'Deleted';
    if (!agreement.isEnabled) return 'Disabled';
    if (agreement.endDate && new Date(agreement.endDate) < new Date()) return 'Expired';
    return 'Active';
  };

  const getBillingTierColor = (tier: string) => {
    switch (tier) {
      case 'payroll_date': return 'bg-orange-100 text-orange-800';
      case 'payroll': return 'bg-blue-100 text-blue-800';
      case 'client_monthly': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4 animate-spin" />
          <p className="text-gray-500">Loading service agreements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load service agreements: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building className="h-6 w-6" />
            {client?.name} - Service Agreements
          </h1>
          <p className="text-gray-600">Manage service agreements and billing configuration</p>
        </div>
        <div className="flex items-center gap-2">
          {showBulkActions && (
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium">{selectedAgreements.size} selected</span>
              <Button size="sm" onClick={() => handleBulkAction('enable')}>
                Enable
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('disable')}>
                Disable
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
                Delete
              </Button>
            </div>
          )}
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetFormData(); setIsCreateModalOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Client Overview */}
      {client && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Services</p>
                  <p className="text-2xl font-bold">{client.serviceAgreementsAggregate?.aggregate?.count || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Active Services</p>
                  <p className="text-2xl font-bold">
                    {agreements.filter(a => a.isActive && a.isEnabled).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Billed</p>
                  <p className="text-2xl font-bold">
                    ${agreements.reduce((sum, a) => sum + (a.totalBilled || 0), 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Recent Items</p>
                  <p className="text-2xl font-bold">{client.recentBillingItems?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Services</Label>
              <Input
                id="search"
                placeholder="Search by service name, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Label htmlFor="status">Status Filter</Label>
              <Select 
                value={activeFilter === undefined ? 'all' : activeFilter ? 'active' : 'inactive'} 
                onValueChange={(value) => setActiveFilter(value === 'all' ? undefined : value === 'active')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-48">
              <Label htmlFor="category">Category Filter</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((category: ServiceCategory) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Agreements */}
      <div className="space-y-4">
        {filteredAgreements.map((agreement: ClientServiceAgreement) => (
          <Card key={agreement.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={selectedAgreements.has(agreement.id)}
                  onChange={(e) => handleSelectAgreement(agreement.id, e.target.checked)}
                  className="mt-1"
                />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-medium">{agreement.service.name}</h3>
                        <Badge className={getStatusColor(agreement)}>
                          {getStatusText(agreement)}
                        </Badge>
                        <Badge className={getBillingTierColor(agreement.service.billingTier)}>
                          {agreement.service.billingTier.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{agreement.service.category.name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {agreement.service.description || 'No description available'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditModal(agreement)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteAgreement(agreement.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label className="text-sm text-gray-500">Rate & Billing</Label>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          ${agreement.customRate || agreement.service.defaultRate || 0}
                        </span>
                        <span className="text-gray-500">per {agreement.service.billingUnit}</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {agreement.billingFrequency.replace('_', ' ')}
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-gray-500">Billing History</Label>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          ${agreement.totalBilled || 0}
                        </span>
                        <span className="text-gray-500">total</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {agreement.lastBilledAt 
                          ? `Last: ${new Date(agreement.lastBilledAt).toLocaleDateString()}`
                          : 'Never billed'
                        }
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-gray-500">Active Period</Label>
                      <p className="text-sm">
                        {agreement.startDate 
                          ? new Date(agreement.startDate).toLocaleDateString()
                          : 'No start date'
                        } - {agreement.endDate 
                          ? new Date(agreement.endDate).toLocaleDateString()
                          : 'Ongoing'
                        }
                      </p>
                      <p className="text-xs text-gray-500">
                        Created: {new Date(agreement.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {agreement.billingNotes && (
                    <div className="p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                      <p className="text-sm">
                        <strong>Notes:</strong> {agreement.billingNotes}
                      </p>
                    </div>
                  )}
                  
                  {agreement.recentBillingItems && agreement.recentBillingItems.length > 0 && (
                    <div className="mt-4">
                      <Label className="text-sm text-gray-500 mb-2 block">Recent Billing Items</Label>
                      <div className="space-y-1">
                        {agreement.recentBillingItems.slice(0, 3).map((item: BillingItem) => (
                          <div key={item.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                            <span className="truncate">{item.description}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {item.status}
                              </Badge>
                              <span className="font-medium">${item.totalAmount}</span>
                            </div>
                          </div>
                        ))}
                        {agreement.recentBillingItems.length > 3 && (
                          <p className="text-xs text-gray-400 text-center">
                            +{agreement.recentBillingItems.length - 3} more items...
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAgreements.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No service agreements found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || categoryFilter || activeFilter !== undefined
                ? 'Try adjusting your search or filters'
                : 'Add your first service agreement to get started'
              }
            </p>
            {!searchTerm && !categoryFilter && activeFilter !== false && (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Service
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={isCreateModalOpen || isEditModalOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
          setEditingAgreement(null);
          resetFormData();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAgreement ? 'Edit Service Agreement' : 'Add Service Agreement'}
            </DialogTitle>
            <DialogDescription>
              {editingAgreement 
                ? 'Update the service agreement configuration'
                : 'Add a new service agreement for this client'
              }
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="space-y-4">
                {!editingAgreement && (
                  <div>
                    <Label htmlFor="serviceId">Service *</Label>
                    <Select value={formData.serviceId} onValueChange={(value) => setFormData(prev => ({ ...prev, serviceId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {unassignedServices.map((service: Service) => (
                          <SelectItem key={service.id} value={service.id}>
                            <div>
                              <div className="font-medium">{service.name}</div>
                              <div className="text-sm text-gray-500">{service.category.name}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isEnabled"
                    checked={formData.isEnabled}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isEnabled: checked }))}
                  />
                  <Label htmlFor="isEnabled">Service Enabled</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="billing" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customRate">Custom Rate (AUD)</Label>
                  <Input
                    id="customRate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.customRate || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, customRate: parseFloat(e.target.value) || undefined }))}
                    placeholder="Leave empty to use default rate"
                  />
                </div>
                
                <div>
                  <Label htmlFor="billingFrequency">Billing Frequency</Label>
                  <Select value={formData.billingFrequency} onValueChange={(value) => setFormData(prev => ({ ...prev, billingFrequency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="per_use">Per Use</SelectItem>
                      <SelectItem value="per_payroll_date">Per Payroll Date</SelectItem>
                      <SelectItem value="per_payroll">Per Payroll</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="billingNotes">Billing Notes</Label>
                  <Textarea
                    id="billingNotes"
                    value={formData.billingNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, billingNotes: e.target.value }))}
                    placeholder="Optional notes about billing for this service..."
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="serviceConfiguration">Service Configuration (JSON)</Label>
                  <Textarea
                    id="serviceConfiguration"
                    value={formData.serviceConfiguration}
                    onChange={(e) => setFormData(prev => ({ ...prev, serviceConfiguration: e.target.value }))}
                    placeholder='{"key": "value"}'
                    rows={6}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Optional JSON configuration for service-specific settings
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreateModalOpen(false);
              setIsEditModalOpen(false);
              setEditingAgreement(null);
              resetFormData();
            }}>
              Cancel
            </Button>
            <Button onClick={editingAgreement ? handleUpdateAgreement : handleCreateAgreement}>
              {editingAgreement ? 'Update Agreement' : 'Create Agreement'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedClientServiceManager;