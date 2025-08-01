'use client';

import { useQuery, useMutation } from '@apollo/client';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Search,
  Filter,
  Package,
  DollarSign,
  Settings,
  TrendingUp,
  Users,
  Star,
  Copy
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PermissionGuard } from '@/components/auth/permission-guard';
import { formatCurrency } from '@/lib/utils';

// Import the GraphQL operations
import { 
  GetServiceCatalogDocument,
  GetNewServiceCatalogDocument,
  CreateNewServiceDocument,
  UpdateNewServiceDocument,
  DeactivateServiceDocument,
  GetserviceTemplatesDocument,
  type ServiceFragmentFragment,
  type GetServiceCatalogQuery,
  type GetNewServiceCatalogQuery
} from '../../graphql/generated/graphql';

const SERVICE_CATEGORIES = [
  { value: 'setup_configuration', label: 'Setup & Configuration' },
  { value: 'processing', label: 'Processing' },
  { value: 'employee_management', label: 'Employee Management' },
  { value: 'compliance_reporting', label: 'Compliance & Reporting' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'training', label: 'Training & Support' },
  { value: 'integration', label: 'System Integration' },
  { value: 'other', label: 'Other' }
];

const BILLING_UNITS = [
  'Per Payroll',
  'Per Payslip', 
  'Per Employee',
  'Per Hour',
  'Per State',
  'Per Month',
  'Per Quarter',
  'Per Year',
  'Once Off',
  'Per Lodgement',
  'Per Report',
  'Per Integration'
];

const SERVICE_TYPES = [
  { value: 'standard', label: 'Standard Service' },
  { value: 'template', label: 'Service Template' },
  { value: 'custom', label: 'Custom Service' }
];

interface ServiceEditorProps {
  service?: ServiceFragmentFragment;
  onSave: () => void;
  onCancel: () => void;
}

const EnhancedServiceEditor: React.FC<ServiceEditorProps> = ({ service, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    category: service?.category || 'other',
    billingUnit: service?.billingUnit || 'Per Service',
    defaultRate: service?.defaultRate?.toString() || '0',
    currency: service?.currency || 'AUD',
    serviceType: service?.serviceType || 'standard',
    isActive: service?.isActive ?? true,
    isTemplate: service?.isTemplate ?? false,
    metadata: service?.metadata || {},
    pricingRules: service?.pricingRules || {},
    dependencies: service?.dependencies || []
  });

  const [createService] = useMutation(CreateNewServiceDocument);
  const [updateService] = useMutation(UpdateNewServiceDocument);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const input = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        billingUnit: formData.billingUnit,
        defaultRate: parseFloat(formData.defaultRate),
        currency: formData.currency,
        serviceType: formData.serviceType,
        isActive: formData.isActive,
        isTemplate: formData.isTemplate,
        metadata: formData.metadata,
        pricingRules: formData.pricingRules,
        dependencies: formData.dependencies
      };

      if (service) {
        await updateService({
          variables: {
            id: service.id,
            input: input
          }
        });
        toast.success('Service updated successfully');
      } else {
        await createService({
          variables: { input }
        });
        toast.success('Service created successfully');
      }
      
      onSave();
    } catch (error) {
      toast.error('Failed to save service');
      console.error('Service save error:', error);
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          {service ? 'Edit Service' : 'Create New Service'}
        </CardTitle>
        <CardDescription>
          Configure service details for the enhanced billing catalog
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Payroll Processing"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_CATEGORIES.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed description of the service..."
              rows={3}
            />
          </div>

          {/* Billing Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="defaultRate">Default Rate *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="defaultRate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.defaultRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, defaultRate: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="billingUnit">Billing Unit</Label>
              <Select
                value={formData.billingUnit}
                onValueChange={(value) => setFormData(prev => ({ ...prev, billingUnit: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BILLING_UNITS.map(unit => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AUD">AUD</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="NZD">NZD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Service Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serviceType">Service Type</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, serviceType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Service is active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isTemplate"
                  checked={formData.isTemplate}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isTemplate: checked }))}
                />
                <Label htmlFor="isTemplate">Use as template</Label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {service ? 'Update' : 'Create'} Service
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

interface EnhancedServiceCatalogProps {
  showCreateForm?: boolean;
  onServiceSelect?: (service: ServiceFragmentFragment) => void;
  selectionMode?: boolean;
}

export const EnhancedServiceCatalog: React.FC<EnhancedServiceCatalogProps> = ({ 
  showCreateForm = false,
  onServiceSelect,
  selectionMode = false
}) => {
  const [editingService, setEditingService] = useState<ServiceFragmentFragment | null>(null);
  const [showEditor, setShowEditor] = useState(showCreateForm);
  const [activeTab, setActiveTab] = useState('services');
  
  // Filters
  const [filters, setFilters] = useState({
    category: '',
    serviceType: '',
    isActive: true,
    isTemplate: null as boolean | null,
    searchTerm: ''
  });

  // Services query
  const { data: servicesData, loading: servicesLoading, refetch: refetchServices } = useQuery(GetNewServiceCatalogDocument, {
    variables: {
      ...(filters.category && { category: filters.category }),
      limit: 100,
      offset: 0
    }
  });

  // Service templates query
  const { data: templatesData, loading: templatesLoading, refetch: refetchTemplates } = useQuery(GetserviceTemplatesDocument, {
    variables: {
      isPublic: true
    }
  });

  const [deactivateService] = useMutation(DeactivateServiceDocument);

  const services = servicesData?.services || [];
  const templates = templatesData?.serviceTemplates || [];

  // Group services by category
  const servicesByCategory = useMemo(() => {
    const grouped = services.reduce((acc: Record<string, any[]>, service: any) => {
      const category = service.category || 'other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(service);
      return acc;
    }, {} as Record<string, any[]>);
    return grouped;
  }, [services]);

  const handleEdit = (service: any) => {
    setEditingService(service);
    setShowEditor(true);
  };

  const handleDeactivate = async (service: any) => {
    if (!confirm(`Are you sure you want to deactivate "${service.name}"?`)) {
      return;
    }

    try {
      await deactivateService({
        variables: { id: service.id }
      });
      toast.success('Service deactivated successfully');
      refetchServices();
    } catch (error) {
      toast.error('Failed to deactivate service');
      console.error('Service deactivate error:', error);
    }
  };

  const handleSave = () => {
    setShowEditor(false);
    setEditingService(null);
    refetchServices();
    refetchTemplates();
  };

  const handleCancel = () => {
    setShowEditor(false);
    setEditingService(null);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'setup_configuration': 'bg-blue-100 text-blue-800 border-blue-200',
      'processing': 'bg-green-100 text-green-800 border-green-200',
      'employee_management': 'bg-purple-100 text-purple-800 border-purple-200',
      'compliance_reporting': 'bg-orange-100 text-orange-800 border-orange-200',
      'consulting': 'bg-gray-100 text-gray-800 border-gray-200',
      'training': 'bg-pink-100 text-pink-800 border-pink-200',
      'integration': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'other': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  if (showEditor) {
    return (
      <div className="flex justify-center p-6">
        <EnhancedServiceEditor
          {...(editingService && { service: editingService })}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Package className="w-8 h-8" />
            Enhanced Service Catalog
          </h2>
          <p className="text-gray-600 mt-1">
            Manage services, templates, and pricing with advanced features
          </p>
        </div>
        <div className="flex gap-2">
          <PermissionGuard permission="billing.create">
            <Button onClick={() => setShowEditor(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          </PermissionGuard>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search services..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {SERVICE_CATEGORIES.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Service Type</Label>
              <Select
                value={filters.serviceType}
                onValueChange={(value) => setFilters(prev => ({ ...prev, serviceType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  {SERVICE_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={filters.isActive ? 'active' : 'inactive'}
                onValueChange={(value) => setFilters(prev => ({ ...prev, isActive: value === 'active' }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active only</SelectItem>
                  <SelectItem value="inactive">Inactive only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Template</Label>
              <Select
                value={filters.isTemplate === null ? 'all' : filters.isTemplate ? 'templates' : 'services'}
                onValueChange={(value) => setFilters(prev => ({ 
                  ...prev, 
                  isTemplate: value === 'all' ? null : value === 'templates'
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="services">Services only</SelectItem>
                  <SelectItem value="templates">Templates only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Services and Templates */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Services ({services.length})
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Templates ({templates.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          {servicesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading services...</p>
            </div>
          ) : Object.keys(servicesByCategory).length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No services found matching your criteria.</p>
                <Button
                  variant="outline"
                  onClick={() => setFilters({ category: '', serviceType: '', isActive: true, isTemplate: null, searchTerm: '' })}
                  className="mt-2"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Badge className={getCategoryColor(category)}>
                        {SERVICE_CATEGORIES.find(c => c.value === category)?.label || category}
                      </Badge>
                      <span className="text-sm text-gray-500">({categoryServices.length} services)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {categoryServices.map((service: ServiceFragmentFragment) => (
                        <Card 
                          key={service.id} 
                          className={`transition-all duration-200 ${
                            selectionMode 
                              ? 'hover:shadow-md cursor-pointer hover:border-blue-300' 
                              : 'hover:shadow-sm'
                          }`}
                          onClick={() => selectionMode && onServiceSelect?.(service)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="text-lg font-semibold">{service.name}</h4>
                                  <Badge 
                                    variant="outline" 
                                    className={service.serviceType === 'template' ? 'border-purple-200 text-purple-800' : ''}
                                  >
                                    {service.serviceType}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {service.billingUnit}
                                  </Badge>
                                  {!service.isActive && (
                                    <Badge variant="destructive">Inactive</Badge>
                                  )}
                                  {service.isTemplate && (
                                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                      <Star className="w-3 h-3 mr-1" />
                                      Template
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-gray-600 mb-3 line-clamp-2">{service.description}</p>
                                <div className="flex items-center gap-4">
                                  <span className="text-xl font-bold text-green-600">
                                    {formatCurrency(service.defaultRate)} {service.currency}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {service.billingUnit}
                                  </span>
                                </div>
                              </div>
                              
                              {!selectionMode && (
                                <div className="flex gap-2 ml-4">
                                  <PermissionGuard permission="billing.update" fallback={null}>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleEdit(service)}
                                      className="flex items-center gap-1"
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                  </PermissionGuard>
                                  <PermissionGuard permission="billing.delete" fallback={null}>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDeactivate(service)}
                                      className="flex items-center gap-1 text-red-600 hover:text-red-800"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </PermissionGuard>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates">
          {templatesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading templates...</p>
            </div>
          ) : templates.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Star className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No service templates available.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {templates.map((template: any) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold flex items-center gap-2">
                            <Star className="w-5 h-5 text-purple-500" />
                            {template.name}
                          </h4>
                          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                            {template.category}
                          </Badge>
                          {template.bundleDiscountPercentage > 0 && (
                            <Badge variant="outline" className="text-green-600 border-green-200">
                              {template.bundleDiscountPercentage}% off
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{template.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            {template.services?.length || 0} services
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            {template.pricingStrategy}
                          </span>
                          {template.targetClientTypes && template.targetClientTypes.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {template.targetClientTypes.join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Copy className="h-4 w-4" />
                          Use Template
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};