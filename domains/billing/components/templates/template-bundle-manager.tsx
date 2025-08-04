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
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, Star, Package, Users, Building, Settings2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// GraphQL Queries and Mutations
const GET_TEMPLATE_BUNDLES = gql`
  query GetTemplateBundles(
    $limit: Int = 50
    $offset: Int = 0
    $targetClientSize: String
    $isActive: Boolean = true
  ) {
    clientTemplateBundles(
      where: {
        targetClientSize: { _eq: $targetClientSize }
        isActive: { _eq: $isActive }
      }
      limit: $limit
      offset: $offset
      orderBy: [{ displayOrder: ASC }, { bundleName: ASC }]
    ) {
      id
      bundleName
      description
      targetClientSize
      targetIndustry
      complexityLevel
      isActive
      isFeatured
      bundleDiscountPercentage
      estimatedMonthlyCost
      displayOrder
      createdAt
      updatedAt
      
      bundleAssignments: bundleTemplateAssignments(
        orderBy: { displayOrder: ASC }
      ) {
        id
        isRequired
        isDefaultEnabled
        customRate
        customBillingFrequency
        customDescription
        displayOrder
        template: serviceTemplate {
          id
          templateName
          description
          defaultRate
          complexityLevel
          billingTier
          category {
            id
            name
          }
        }
      }
    }
    
    serviceTemplates(
      where: { isActive: { _eq: true } }
      orderBy: [{ templateName: ASC }]
    ) {
      id
      templateName
      description
      defaultRate
      complexityLevel
      billingTier
      category {
        id
        name
      }
    }
  }
`;

const CREATE_TEMPLATE_BUNDLE = gql`
  mutation CreateTemplateBundle($input: ClientTemplateBundlesInsertInput!) {
    insertClientTemplateBundlesOne(object: $input) {
      id
      bundleName
      description
      targetClientSize
      estimatedMonthlyCost
    }
  }
`;

const UPDATE_TEMPLATE_BUNDLE = gql`
  mutation UpdateTemplateBundle(
    $id: uuid!
    $updates: ClientTemplateBundlesSetInput!
  ) {
    updateClientTemplateBundlesByPk(
      pkColumns: { id: $id }
      _set: $updates
    ) {
      id
      bundleName
      description
    }
  }
`;

const DELETE_TEMPLATE_BUNDLE = gql`
  mutation DeleteTemplateBundle($id: uuid!) {
    updateClientTemplateBundlesByPk(
      pkColumns: { id: $id }
      _set: { isActive: false }
    ) {
      id
    }
  }
`;

const CREATE_BUNDLE_ASSIGNMENT = gql`
  mutation CreateBundleAssignment($input: BundleTemplateAssignmentsInsertInput!) {
    insertBundleTemplateAssignmentsOne(object: $input) {
      id
      isRequired
      isDefaultEnabled
    }
  }
`;

const UPDATE_BUNDLE_ASSIGNMENT = gql`
  mutation UpdateBundleAssignment(
    $id: uuid!
    $updates: BundleTemplateAssignmentsSetInput!
  ) {
    updateBundleTemplateAssignmentsByPk(
      pkColumns: { id: $id }
      _set: $updates
    ) {
      id
    }
  }
`;

const DELETE_BUNDLE_ASSIGNMENT = gql`
  mutation DeleteBundleAssignment($id: uuid!) {
    deleteBundleTemplateAssignmentsByPk(id: $id) {
      id
    }
  }
`;

interface TemplateBundle {
  id: string;
  bundleName: string;
  description?: string;
  targetClientSize: string;
  targetIndustry?: string;
  complexityLevel: string;
  isActive: boolean;
  isFeatured: boolean;
  bundleDiscountPercentage?: number;
  estimatedMonthlyCost?: number;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  bundleAssignments: BundleAssignment[];
}

interface BundleAssignment {
  id: string;
  isRequired: boolean;
  isDefaultEnabled: boolean;
  customRate?: number;
  customBillingFrequency?: string;
  customDescription?: string;
  displayOrder: number;
  template: {
    id: string;
    templateName: string;
    description?: string;
    defaultRate?: number;
    complexityLevel: string;
    billingTier: string;
    category: {
      id: string;
      name: string;
    };
  };
}

interface ServiceTemplate {
  id: string;
  templateName: string;
  description?: string;
  defaultRate?: number;
  complexityLevel: string;
  billingTier: string;
  category: {
    id: string;
    name: string;
  };
}

interface BundleFormData {
  bundleName: string;
  description: string;
  targetClientSize: string;
  targetIndustry: string;
  complexityLevel: string;
  isFeatured: boolean;
  bundleDiscountPercentage: number;
  estimatedMonthlyCost: number;
  displayOrder: number;
}

const TemplateBundleManager: React.FC = () => {
  const [selectedClientSize, setSelectedClientSize] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<TemplateBundle | null>(null);
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(new Set());
  const [assignmentSettings, setAssignmentSettings] = useState<Record<string, { isRequired: boolean; isDefaultEnabled: boolean; customRate?: number }>({});
  
  const [formData, setFormData] = useState<BundleFormData>({
    bundleName: '',
    description: '',
    targetClientSize: 'medium',
    targetIndustry: 'General',
    complexityLevel: 'standard',
    isFeatured: false,
    bundleDiscountPercentage: 0,
    estimatedMonthlyCost: 0,
    displayOrder: 100
  });

  const { data, loading, error, refetch } = useQuery(GET_TEMPLATE_BUNDLES, {
    variables: {
      targetClientSize: selectedClientSize || undefined,
      isActive: true
    },
    fetchPolicy: 'cache-and-network'
  });

  const [createBundle] = useMutation(CREATE_TEMPLATE_BUNDLE);
  const [updateBundle] = useMutation(UPDATE_TEMPLATE_BUNDLE);
  const [deleteBundle] = useMutation(DELETE_TEMPLATE_BUNDLE);
  const [createAssignment] = useMutation(CREATE_BUNDLE_ASSIGNMENT);
  const [updateAssignment] = useMutation(UPDATE_BUNDLE_ASSIGNMENT);
  const [deleteAssignment] = useMutation(DELETE_BUNDLE_ASSIGNMENT);

  const bundles = data?.clientTemplateBundles || [];
  const availableTemplates = data?.serviceTemplates || [];

  const filteredBundles = bundles.filter((bundle: TemplateBundle) =>
    bundle.bundleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bundle.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateBundle = async () => {
    try {
      const result = await createBundle({
        variables: {
          input: {
            ...formData,
            bundleDiscountPercentage: formData.bundleDiscountPercentage || null,
            estimatedMonthlyCost: formData.estimatedMonthlyCost || null
          }
        }
      });
      
      const bundleId = result.data.insertClientTemplateBundlesOne.id;
      
      // Create bundle assignments for selected templates
      for (const templateId of selectedTemplates) {
        const settings = assignmentSettings[templateId] || { isRequired: false, isDefaultEnabled: true };
        await createAssignment({
          variables: {
            input: {
              bundleId,
              templateId,
              isRequired: settings.isRequired,
              isDefaultEnabled: settings.isDefaultEnabled,
              customRate: settings.customRate || null,
              displayOrder: 100
            }
          }
        });
      }
      
      toast({
        title: "Success",
        description: "Template bundle created successfully"
      });
      
      setIsCreateModalOpen(false);
      resetFormData();
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create template bundle",
        variant: "destructive"
      });
    }
  };

  const handleUpdateBundle = async () => {
    if (!editingBundle) return;
    
    try {
      await updateBundle({
        variables: {
          id: editingBundle.id,
          updates: {
            ...formData,
            bundleDiscountPercentage: formData.bundleDiscountPercentage || null,
            estimatedMonthlyCost: formData.estimatedMonthlyCost || null,
            updatedAt: new Date().toISOString()
          }
        }
      });
      
      // Update bundle assignments
      const existingAssignments = editingBundle.bundleAssignments;
      const existingTemplateIds = new Set(existingAssignments.map(a => a.template.id));
      
      // Remove assignments that are no longer selected
      for (const assignment of existingAssignments) {
        if (!selectedTemplates.has(assignment.template.id)) {
          await deleteAssignment({ variables: { id: assignment.id } });
        }
      }
      
      // Update existing assignments
      for (const assignment of existingAssignments) {
        if (selectedTemplates.has(assignment.template.id)) {
          const settings = assignmentSettings[assignment.template.id] || { isRequired: false, isDefaultEnabled: true };
          await updateAssignment({
            variables: {
              id: assignment.id,
              updates: {
                isRequired: settings.isRequired,
                isDefaultEnabled: settings.isDefaultEnabled,
                customRate: settings.customRate || null
              }
            }
          });
        }
      }
      
      // Create new assignments
      for (const templateId of selectedTemplates) {
        if (!existingTemplateIds.has(templateId)) {
          const settings = assignmentSettings[templateId] || { isRequired: false, isDefaultEnabled: true };
          await createAssignment({
            variables: {
              input: {
                bundleId: editingBundle.id,
                templateId,
                isRequired: settings.isRequired,
                isDefaultEnabled: settings.isDefaultEnabled,
                customRate: settings.customRate || null,
                displayOrder: 100
              }
            }
          });
        }
      }
      
      toast({
        title: "Success",
        description: "Template bundle updated successfully"
      });
      
      setIsEditModalOpen(false);
      setEditingBundle(null);
      resetFormData();
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update template bundle",
        variant: "destructive"
      });
    }
  };

  const handleDeleteBundle = async (bundleId: string) => {
    if (!confirm('Are you sure you want to delete this template bundle?')) return;
    
    try {
      await deleteBundle({
        variables: { id: bundleId }
      });
      
      toast({
        title: "Success",
        description: "Template bundle deleted successfully"
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete template bundle",
        variant: "destructive"
      });
    }
  };

  const openEditModal = (bundle: TemplateBundle) => {
    setEditingBundle(bundle);
    setFormData({
      bundleName: bundle.bundleName,
      description: bundle.description || '',
      targetClientSize: bundle.targetClientSize,
      targetIndustry: bundle.targetIndustry || 'General',
      complexityLevel: bundle.complexityLevel,
      isFeatured: bundle.isFeatured,
      bundleDiscountPercentage: bundle.bundleDiscountPercentage || 0,
      estimatedMonthlyCost: bundle.estimatedMonthlyCost || 0,
      displayOrder: bundle.displayOrder
    });
    
    // Set selected templates and their settings
    const templateIds = new Set(bundle.bundleAssignments.map(a => a.template.id));
    setSelectedTemplates(templateIds);
    
    const settings: Record<string, { isRequired: boolean; isDefaultEnabled: boolean; customRate?: number }> = {};
    bundle.bundleAssignments.forEach(assignment => {
      settings[assignment.template.id] = {
        isRequired: assignment.isRequired,
        isDefaultEnabled: assignment.isDefaultEnabled,
        customRate: assignment.customRate || undefined
      };
    });
    setAssignmentSettings(settings);
    
    setIsEditModalOpen(true);
  };

  const resetFormData = () => {
    setFormData({
      bundleName: '',
      description: '',
      targetClientSize: 'medium',
      targetIndustry: 'General',
      complexityLevel: 'standard',
      isFeatured: false,
      bundleDiscountPercentage: 0,
      estimatedMonthlyCost: 0,
      displayOrder: 100
    });
    setSelectedTemplates(new Set());
    setAssignmentSettings({});
  };

  const handleTemplateSelection = (templateId: string, checked: boolean) => {
    const newSelected = new Set(selectedTemplates);
    if (checked) {
      newSelected.add(templateId);
      if (!assignmentSettings[templateId]) {
        setAssignmentSettings(prev => ({
          ...prev,
          [templateId]: { isRequired: false, isDefaultEnabled: true }
        }));
      }
    } else {
      newSelected.delete(templateId);
      const newSettings = { ...assignmentSettings };
      delete newSettings[templateId];
      setAssignmentSettings(newSettings);
    }
    setSelectedTemplates(newSelected);
  };

  const updateAssignmentSetting = (templateId: string, key: string, value: any) => {
    setAssignmentSettings(prev => ({
      ...prev,
      [templateId]: {
        ...prev[templateId],
        [key]: value
      }
    }));
  };

  const getClientSizeColor = (size: string) => {
    switch (size) {
      case 'micro': return 'bg-purple-100 text-purple-800';
      case 'small': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-green-100 text-green-800';
      case 'large': return 'bg-orange-100 text-orange-800';
      case 'enterprise': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityColor = (level: string) => {
    switch (level) {
      case 'basic': return 'bg-green-100 text-green-800';
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">Loading template bundles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load template bundles: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Template Bundle Manager</h1>
          <p className="text-gray-600">Manage service template bundles for different client types</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetFormData(); setIsCreateModalOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Create Bundle
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Bundles</Label>
              <Input
                id="search"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-64">
              <Label htmlFor="clientSize">Client Size Filter</Label>
              <Select value={selectedClientSize} onValueChange={setSelectedClientSize}>
                <SelectTrigger>
                  <SelectValue placeholder="All Sizes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Sizes</SelectItem>
                  <SelectItem value="micro">Micro (1-5 employees)</SelectItem>
                  <SelectItem value="small">Small (6-20 employees)</SelectItem>
                  <SelectItem value="medium">Medium (21-100 employees)</SelectItem>
                  <SelectItem value="large">Large (101-500 employees)</SelectItem>
                  <SelectItem value="enterprise">Enterprise (500+ employees)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bundles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBundles.map((bundle: TemplateBundle) => (
          <Card key={bundle.id} className="relative group hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {bundle.bundleName}
                    {bundle.isFeatured && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {bundle.targetIndustry} · {bundle.bundleAssignments.length} services
                  </CardDescription>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditModal(bundle)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteBundle(bundle.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600 line-clamp-2">
                {bundle.description || 'No description provided'}
              </p>
              
              <div className="flex flex-wrap gap-2">
                <Badge className={getClientSizeColor(bundle.targetClientSize)}>
                  {bundle.targetClientSize}
                </Badge>
                <Badge className={getComplexityColor(bundle.complexityLevel)}>
                  {bundle.complexityLevel}
                </Badge>
              </div>
              
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Est. Monthly:</span>
                  <span className="font-medium">
                    {bundle.estimatedMonthlyCost ? `$${bundle.estimatedMonthlyCost}` : 'Not set'}
                  </span>
                </div>
                {bundle.bundleDiscountPercentage && bundle.bundleDiscountPercentage > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Discount:</span>
                    <span className="text-green-600 font-medium">{bundle.bundleDiscountPercentage}%</span>
                  </div>
                )}
              </div>
              
              {bundle.bundleAssignments.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Included Services:</p>
                  <div className="space-y-1">
                    {bundle.bundleAssignments.slice(0, 3).map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between text-xs">
                        <span className="truncate">{assignment.template.templateName}</span>
                        {assignment.isRequired && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                      </div>
                    ))}
                    {bundle.bundleAssignments.length > 3 && (
                      <p className="text-xs text-gray-400">
                        +{bundle.bundleAssignments.length - 3} more...
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBundles.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bundles found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedClientSize 
                ? 'Try adjusting your search or filters'
                : 'Create your first template bundle to get started'
              }
            </p>
            {!searchTerm && !selectedClientSize && (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Bundle
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
          setEditingBundle(null);
          resetFormData();
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBundle ? 'Edit Template Bundle' : 'Create Template Bundle'}
            </DialogTitle>
            <DialogDescription>
              {editingBundle 
                ? 'Update the template bundle configuration'
                : 'Create a new template bundle with selected services'
              }
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="bundleName">Bundle Name *</Label>
                  <Input
                    id="bundleName"
                    value={formData.bundleName}
                    onChange={(e) => setFormData(prev => ({ ...prev, bundleName: e.target.value }))}
                    placeholder="e.g., Small Business Starter Package"
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this bundle includes and who it's for..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="targetClientSize">Target Client Size *</Label>
                  <Select value={formData.targetClientSize} onValueChange={(value) => setFormData(prev => ({ ...prev, targetClientSize: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="micro">Micro (1-5 employees)</SelectItem>
                      <SelectItem value="small">Small (6-20 employees)</SelectItem>
                      <SelectItem value="medium">Medium (21-100 employees)</SelectItem>
                      <SelectItem value="large">Large (101-500 employees)</SelectItem>
                      <SelectItem value="enterprise">Enterprise (500+ employees)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="targetIndustry">Target Industry</Label>
                  <Input
                    id="targetIndustry"
                    value={formData.targetIndustry}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetIndustry: e.target.value }))}
                    placeholder="e.g., General, Construction, Healthcare"
                  />
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
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    min="1"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 100 }))}
                  />
                </div>
                
                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
                    />
                    <Label htmlFor="isFeatured">Featured Bundle</Label>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Featured bundles are highlighted to clients</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4 mt-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Select Service Templates</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {availableTemplates.map((template: ServiceTemplate) => (
                    <div key={template.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedTemplates.has(template.id)}
                          onCheckedChange={(checked) => handleTemplateSelection(template.id, checked as boolean)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{template.templateName}</h4>
                            <Badge className={getComplexityColor(template.complexityLevel)}>
                              {template.complexityLevel}
                            </Badge>
                            <Badge variant="outline">
                              {template.billingTier.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {template.category.name} • {template.description || 'No description'}
                          </p>
                          <p className="text-sm font-medium">
                            {template.defaultRate ? `$${template.defaultRate}` : 'No default rate'}
                          </p>
                          
                          {selectedTemplates.has(template.id) && (
                            <div className="mt-3 p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                              <div className="grid grid-cols-3 gap-3">
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    checked={assignmentSettings[template.id]?.isRequired || false}
                                    onCheckedChange={(checked) => updateAssignmentSetting(template.id, 'isRequired', checked)}
                                  />
                                  <Label className="text-sm">Required</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    checked={assignmentSettings[template.id]?.isDefaultEnabled !== false}
                                    onCheckedChange={(checked) => updateAssignmentSetting(template.id, 'isDefaultEnabled', checked)}
                                  />
                                  <Label className="text-sm">Default Enabled</Label>
                                </div>
                                <div>
                                  <Label className="text-sm">Custom Rate</Label>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder={template.defaultRate?.toString() || '0'}
                                    value={assignmentSettings[template.id]?.customRate || ''}
                                    onChange={(e) => updateAssignmentSetting(template.id, 'customRate', parseFloat(e.target.value) || undefined)}
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="estimatedMonthlyCost">Estimated Monthly Cost (AUD)</Label>
                  <Input
                    id="estimatedMonthlyCost"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.estimatedMonthlyCost}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedMonthlyCost: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                  />
                  <p className="text-sm text-gray-500 mt-1">Estimated total monthly cost for this bundle</p>
                </div>
                
                <div>
                  <Label htmlFor="bundleDiscountPercentage">Bundle Discount (%)</Label>
                  <Input
                    id="bundleDiscountPercentage"
                    type="number"
                    step="0.1"
                    min="0"
                    max="50"
                    value={formData.bundleDiscountPercentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, bundleDiscountPercentage: parseFloat(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                  <p className="text-sm text-gray-500 mt-1">Discount percentage for purchasing this bundle</p>
                </div>
              </div>
              
              {selectedTemplates.size > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-3">Bundle Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Selected Services:</span>
                      <span>{selectedTemplates.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Required Services:</span>
                      <span>
                        {Object.values(assignmentSettings).filter(s => s.isRequired).length}
                      </span>
                    </div>
                    {formData.bundleDiscountPercentage > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Bundle Discount:</span>
                        <span>{formData.bundleDiscountPercentage}%</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreateModalOpen(false);
              setIsEditModalOpen(false);
              setEditingBundle(null);
              resetFormData();
            }}>
              Cancel
            </Button>
            <Button 
              onClick={editingBundle ? handleUpdateBundle : handleCreateBundle}
              disabled={!formData.bundleName || selectedTemplates.size === 0}
            >
              {editingBundle ? 'Update Bundle' : 'Create Bundle'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplateBundleManager;