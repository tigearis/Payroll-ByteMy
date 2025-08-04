'use client';

import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { Plus, Edit, Trash2, Copy, Star, Eye, Settings, Package } from 'lucide-react';
import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

// GraphQL Queries and Mutations
const GET_SERVICE_TEMPLATES = gql`
  query GetServiceTemplates(
    $limit: Int = 50
    $offset: Int = 0
    $categoryId: uuid
    $isActive: Boolean = true
  ) {
    serviceTemplates(
      where: {
        categoryId: { _eq: $categoryId }
        isActive: { _eq: $isActive }
      }
      limit: $limit
      offset: $offset
      orderBy: [{ displayOrder: ASC }, { templateName: ASC }]
    ) {
      id
      templateName
      description
      serviceType
      billingUnit
      billingTier
      defaultRate
      currency
      isRequired
      isOptional
      isPopular
      defaultBillingFrequency
      autoBillingEnabled
      complexityLevel
      estimatedHours
      displayOrder
      isActive
      createdAt
      updatedAt
      category {
        id
        name
        description
      }
      createdByUser: userByCreatedBy {
        id
        computedName
      }
    }
    
    serviceTemplateCategories(
      where: { isActive: { _eq: true } }
      orderBy: { displayOrder: ASC }
    ) {
      id
      name
      description
      displayOrder
    }
  }
`;

const CREATE_SERVICE_TEMPLATE = gql`
  mutation CreateServiceTemplate($input: ServiceTemplatesInsertInput!) {
    insertServiceTemplatesOne(object: $input) {
      id
      templateName
      description
      defaultRate
      complexityLevel
      isActive
    }
  }
`;

const UPDATE_SERVICE_TEMPLATE = gql`
  mutation UpdateServiceTemplate(
    $id: uuid!
    $updates: ServiceTemplatesSetInput!
  ) {
    updateServiceTemplatesByPk(
      pkColumns: { id: $id }
      _set: $updates
    ) {
      id
      templateName
      description
      defaultRate
      isActive
    }
  }
`;

const DELETE_SERVICE_TEMPLATE = gql`
  mutation DeleteServiceTemplate($id: uuid!) {
    updateServiceTemplatesByPk(
      pkColumns: { id: $id }
      _set: { isActive: false }
    ) {
      id
    }
  }
`;

const DUPLICATE_SERVICE_TEMPLATE = gql`
  mutation DuplicateServiceTemplate($input: ServiceTemplatesInsertInput!) {
    insertServiceTemplatesOne(object: $input) {
      id
      templateName
      description
    }
  }
`;

interface ServiceTemplate {
  id: string;
  templateName: string;
  description?: string;
  serviceType: string;
  billingUnit: string;
  billingTier: string;
  defaultRate?: number;
  currency: string;
  isRequired: boolean;
  isOptional: boolean;
  isPopular: boolean;
  defaultBillingFrequency: string;
  autoBillingEnabled: boolean;
  complexityLevel: string;
  estimatedHours?: number;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    description?: string;
  };
  createdByUser?: {
    id: string;
    computedName: string;
  };
}

interface TemplateFormData {
  templateName: string;
  description: string;
  categoryId: string;
  serviceType: string;
  billingUnit: string;
  billingTier: string;
  defaultRate: number;
  currency: string;
  isRequired: boolean;
  isOptional: boolean;
  isPopular: boolean;
  defaultBillingFrequency: string;
  autoBillingEnabled: boolean;
  complexityLevel: string;
  estimatedHours?: number;
  displayOrder: number;
}

const ServiceTemplateManager: React.FC = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ServiceTemplate | null>(null);
  const [formData, setFormData] = useState<TemplateFormData>({
    templateName: '',
    description: '',
    categoryId: '',
    serviceType: 'time_based',
    billingUnit: 'Hourly',
    billingTier: 'payroll_date',
    defaultRate: 0,
    currency: 'AUD',
    isRequired: false,
    isOptional: true,
    isPopular: false,
    defaultBillingFrequency: 'per_use',
    autoBillingEnabled: true,
    complexityLevel: 'standard',
    estimatedHours: 0,
    displayOrder: 100
  });

  const { data, loading, error, refetch } = useQuery(GET_SERVICE_TEMPLATES, {
    variables: {
      categoryId: selectedCategory || undefined,
      isActive: true
    },
    fetchPolicy: 'cache-and-network'
  });

  const [createTemplate] = useMutation(CREATE_SERVICE_TEMPLATE);
  const [updateTemplate] = useMutation(UPDATE_SERVICE_TEMPLATE);
  const [deleteTemplate] = useMutation(DELETE_SERVICE_TEMPLATE);
  const [duplicateTemplate] = useMutation(DUPLICATE_SERVICE_TEMPLATE);

  const templates = data?.serviceTemplates || [];
  const categories = data?.serviceTemplateCategories || [];

  const filteredTemplates = templates.filter((template: ServiceTemplate) =>
    template.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTemplate = async () => {
    try {
      await createTemplate({
        variables: {
          input: {
            ...formData,
            defaultRate: formData.defaultRate || null,
            estimatedHours: formData.estimatedHours || null
          }
        }
      });
      
      toast({
        title: "Success",
        description: "Service template created successfully"
      });
      
      setIsCreateModalOpen(false);
      resetFormData();
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create service template",
        variant: "destructive"
      });
    }
  };

  const handleUpdateTemplate = async () => {
    if (!editingTemplate) return;
    
    try {
      await updateTemplate({
        variables: {
          id: editingTemplate.id,
          updates: {
            ...formData,
            defaultRate: formData.defaultRate || null,
            estimatedHours: formData.estimatedHours || null,
            updatedAt: new Date().toISOString()
          }
        }
      });
      
      toast({
        title: "Success",
        description: "Service template updated successfully"
      });
      
      setIsEditModalOpen(false);
      setEditingTemplate(null);
      resetFormData();
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update service template",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    
    try {
      await deleteTemplate({
        variables: { id: templateId }
      });
      
      toast({
        title: "Success",
        description: "Service template deleted successfully"
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete service template",
        variant: "destructive"
      });
    }
  };

  const handleDuplicateTemplate = async (template: ServiceTemplate) => {
    try {
      await duplicateTemplate({
        variables: {
          input: {
            templateName: `${template.templateName} (Copy)`,
            description: template.description,
            categoryId: template.category.id,
            serviceType: template.serviceType,
            billingUnit: template.billingUnit,
            billingTier: template.billingTier,
            defaultRate: template.defaultRate,
            currency: template.currency,
            isRequired: false,
            isOptional: true,
            isPopular: false,
            defaultBillingFrequency: template.defaultBillingFrequency,
            autoBillingEnabled: template.autoBillingEnabled,
            complexityLevel: template.complexityLevel,
            estimatedHours: template.estimatedHours,
            displayOrder: template.displayOrder + 1
          }
        }
      });
      
      toast({
        title: "Success",
        description: "Service template duplicated successfully"
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate service template",
        variant: "destructive"
      });
    }
  };

  const openEditModal = (template: ServiceTemplate) => {
    setEditingTemplate(template);
    setFormData({
      templateName: template.templateName,
      description: template.description || '',
      categoryId: template.category.id,
      serviceType: template.serviceType,
      billingUnit: template.billingUnit,
      billingTier: template.billingTier,
      defaultRate: template.defaultRate || 0,
      currency: template.currency,
      isRequired: template.isRequired,
      isOptional: template.isOptional,
      isPopular: template.isPopular,
      defaultBillingFrequency: template.defaultBillingFrequency,
      autoBillingEnabled: template.autoBillingEnabled,
      complexityLevel: template.complexityLevel,
      estimatedHours: template.estimatedHours || 0,
      displayOrder: template.displayOrder
    });
    setIsEditModalOpen(true);
  };

  const resetFormData = () => {
    setFormData({
      templateName: '',
      description: '',
      categoryId: '',
      serviceType: 'time_based',
      billingUnit: 'Hourly',
      billingTier: 'payroll_date',
      defaultRate: 0,
      currency: 'AUD',
      isRequired: false,
      isOptional: true,
      isPopular: false,
      defaultBillingFrequency: 'per_use',
      autoBillingEnabled: true,
      complexityLevel: 'standard',
      estimatedHours: 0,
      displayOrder: 100
    });
  };

  const getComplexityColor = (level: string) => {
    switch (level) {
      case 'basic': return 'bg-green-100 text-green-800';
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">Loading service templates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load service templates: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Template Manager</h1>
          <p className="text-gray-600">Manage reusable service templates for client onboarding</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetFormData(); setIsCreateModalOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Templates</Label>
              <Input
                id="search"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-64">
              <Label htmlFor="category">Category Filter</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((category: any) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template: ServiceTemplate) => (
          <Card key={template.id} className="relative group hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {template.templateName}
                    {template.isPopular && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {template.category.name}
                  </CardDescription>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditModal(template)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDuplicateTemplate(template)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600 line-clamp-2">
                {template.description || 'No description provided'}
              </p>
              
              <div className="flex flex-wrap gap-2">
                <Badge className={getComplexityColor(template.complexityLevel)}>
                  {template.complexityLevel}
                </Badge>
                <Badge className={getBillingTierColor(template.billingTier)}>
                  {template.billingTier.replace('_', ' ')}
                </Badge>
                {template.isRequired && (
                  <Badge variant="destructive">Required</Badge>
                )}
              </div>
              
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Rate:</span>
                  <span className="font-medium">
                    {template.defaultRate ? `$${template.defaultRate}` : 'No rate set'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Billing:</span>
                  <span>{template.defaultBillingFrequency.replace('_', ' ')}</span>
                </div>
                {template.estimatedHours && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Est. Hours:</span>
                    <span>{template.estimatedHours}h</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory 
                ? 'Try adjusting your search or filters'
                : 'Create your first service template to get started'
              }
            </p>
            {!searchTerm && !selectedCategory && (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Template
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
          setEditingTemplate(null);
          resetFormData();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Service Template' : 'Create Service Template'}
            </DialogTitle>
            <DialogDescription>
              {editingTemplate 
                ? 'Update the service template details below'
                : 'Create a new reusable service template for client onboarding'
              }
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="templateName">Template Name *</Label>
                  <Input
                    id="templateName"
                    value={formData.templateName}
                    onChange={(e) => setFormData(prev => ({ ...prev, templateName: e.target.value }))}
                    placeholder="e.g., Basic Payroll Processing"
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this service template includes..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="categoryId">Category *</Label>
                  <Select value={formData.categoryId} onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category: any) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="serviceType">Service Type</Label>
                  <Select value={formData.serviceType} onValueChange={(value) => setFormData(prev => ({ ...prev, serviceType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="time_based">Time Based</SelectItem>
                      <SelectItem value="recurring">Recurring</SelectItem>
                      <SelectItem value="project_based">Project Based</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="reporting">Reporting</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="complexityLevel">Complexity Level</Label>
                  <Select value={formData.complexityLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, complexityLevel: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="estimatedHours">Estimated Hours</Label>
                  <Input
                    id="estimatedHours"
                    type="number"
                    step="0.25"
                    min="0"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: parseFloat(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="billing" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="billingUnit">Billing Unit</Label>
                  <Select value={formData.billingUnit} onValueChange={(value) => setFormData(prev => ({ ...prev, billingUnit: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hourly">Hourly</SelectItem>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Per Payroll">Per Payroll</SelectItem>
                      <SelectItem value="Per Employee">Per Employee</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Quarterly">Quarterly</SelectItem>
                      <SelectItem value="Fixed Price">Fixed Price</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="billingTier">Billing Tier</Label>
                  <Select value={formData.billingTier} onValueChange={(value) => setFormData(prev => ({ ...prev, billingTier: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="payroll_date">Payroll Date (Tier 1)</SelectItem>
                      <SelectItem value="payroll">Payroll (Tier 2)</SelectItem>
                      <SelectItem value="client_monthly">Client Monthly (Tier 3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="defaultRate">Default Rate ({formData.currency})</Label>
                  <Input
                    id="defaultRate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.defaultRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, defaultRate: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <Label htmlFor="defaultBillingFrequency">Billing Frequency</Label>
                  <Select value={formData.defaultBillingFrequency} onValueChange={(value) => setFormData(prev => ({ ...prev, defaultBillingFrequency: value }))}>
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
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    min="1"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 100 }))}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isRequired">Required Service</Label>
                    <p className="text-sm text-gray-500">Must be included in client setup</p>
                  </div>
                  <Switch
                    id="isRequired"
                    checked={formData.isRequired}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRequired: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isOptional">Optional Service</Label>
                    <p className="text-sm text-gray-500">Can be optionally added</p>
                  </div>
                  <Switch
                    id="isOptional"
                    checked={formData.isOptional}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isOptional: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isPopular">Popular Service</Label>
                    <p className="text-sm text-gray-500">Featured in popular templates</p>
                  </div>
                  <Switch
                    id="isPopular"
                    checked={formData.isPopular}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPopular: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoBillingEnabled">Auto Billing</Label>
                    <p className="text-sm text-gray-500">Enable automatic billing generation</p>
                  </div>
                  <Switch
                    id="autoBillingEnabled"
                    checked={formData.autoBillingEnabled}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, autoBillingEnabled: checked }))}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreateModalOpen(false);
              setIsEditModalOpen(false);
              setEditingTemplate(null);
              resetFormData();
            }}>
              Cancel
            </Button>
            <Button onClick={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}>
              {editingTemplate ? 'Update Template' : 'Create Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceTemplateManager;