'use client';

import { useQuery, useMutation } from '@apollo/client';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  GetServiceCatalogDocument, 
  CreateServiceDocument, 
  UpdateServiceDocument, 
  DeleteServiceDocument,
  type ServiceCatalogFragmentFragment 
} from '../../../billing/graphql/generated/graphql';

interface ServiceEditorProps {
  service?: ServiceCatalogFragmentFragment | undefined;
  onSave: () => void;
  onCancel: () => void;
}

const BILLING_UNITS = [
  'Per Payroll',
  'Per Payslip', 
  'Per Employee',
  'Per Hour',
  'Per State',
  'Once Off',
  'Per Month',
  'Per Lodgement'
];

const CATEGORIES = [
  'Setup & Configuration',
  'Processing',
  'Employee Management', 
  'Compliance & Reporting',
  'Consulting'
];

const ServiceEditor: React.FC<ServiceEditorProps> = ({ service, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    standardRate: service?.standardRate?.toString() || '',
    billingUnit: service?.billingUnit || 'Per Payroll',
    category: service?.category || 'Processing',
    isActive: service?.isActive ?? true,
    currency: service?.currency || 'AUD'
  });

  const [createService] = useMutation(CreateServiceDocument);
  const [updateService] = useMutation(UpdateServiceDocument);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const input = {
        name: formData.name,
        description: formData.description,
        standardRate: parseFloat(formData.standardRate),
        billingUnit: formData.billingUnit,
        category: formData.category,
        isActive: formData.isActive,
        currency: formData.currency
      };

      if (service) {
        await updateService({
          variables: {
            id: service.id,
            updates: input
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
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{service ? 'Edit Service' : 'Create New Service'}</CardTitle>
        <CardDescription>
          Configure service details for the billing catalog
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
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
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="standard_rate">Standard Rate</Label>
              <Input
                id="standard_rate"
                type="number"
                step="0.01"
                value={formData.standardRate}
                onChange={(e) => setFormData(prev => ({ ...prev, standardRate: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billing_unit">Billing Unit</Label>
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
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="isActive">Service is active</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {service ? 'Update' : 'Create'} Service
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

interface ServiceCatalogManagerProps {
  showCreateForm?: boolean;
}

export const ServiceCatalogManager: React.FC<ServiceCatalogManagerProps> = ({ 
  showCreateForm = false 
}) => {
  const [editingService, setEditingService] = useState<ServiceCatalogFragmentFragment | null>(null);
  const [showEditor, setShowEditor] = useState(showCreateForm);
  const [filterCategory, setFilterCategory] = useState<string>('');

  const { data, loading, refetch, error } = useQuery(GetServiceCatalogDocument, {
    variables: {
      category: filterCategory ? `%${filterCategory}%` : null,
      isActive: true
    }
  });

  const [deleteService] = useMutation(DeleteServiceDocument);

  const handleEdit = (service: ServiceCatalogFragmentFragment) => {
    setEditingService(service);
    setShowEditor(true);
  };

  const handleDelete = async (service: ServiceCatalogFragmentFragment) => {
    if (!confirm(`Are you sure you want to deactivate "${service.name}"?`)) {
      return;
    }

    try {
      await deleteService({
        variables: { id: service.id }
      });
      toast.success('Service deactivated successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to deactivate service');
      console.error('Service delete error:', error);
    }
  };

  const handleSave = () => {
    setShowEditor(false);
    setEditingService(null);
    refetch();
  };

  const handleCancel = () => {
    setShowEditor(false);
    setEditingService(null);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Setup & Configuration': 'bg-blue-100 text-blue-800',
      'Processing': 'bg-green-100 text-green-800',
      'Employee Management': 'bg-purple-100 text-purple-800',
      'Compliance & Reporting': 'bg-orange-100 text-orange-800',
      'Consulting': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (showEditor) {
    return (
      <div className="flex justify-center">
        <ServiceEditor
          service={editingService || undefined}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Service Catalog</h2>
          <p className="text-gray-600">Manage billing services and rates</p>
        </div>
        <Button onClick={() => setShowEditor(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <Label htmlFor="category-filter">Filter by Category:</Label>
        <Select
          value={filterCategory}
          onValueChange={setFilterCategory}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {CATEGORIES.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading services...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">
          <p>Error loading services: {error.message}</p>
          <button 
            onClick={() => refetch()} 
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {data?.billingPlan?.map((service) => (
            <Card key={service.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{service.name}</h3>
                      <Badge className={getCategoryColor(service.category || '')}>
                        {service.category}
                      </Badge>
                      <Badge variant="outline">
                        {service.billingUnit}
                      </Badge>
                      {!service.isActive && (
                        <Badge variant="destructive">Inactive</Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{service.description}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold">
                        ${service.standardRate} {service.currency}
                      </span>
                      <span className="text-sm text-gray-500">
                        {service.billingUnit}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(service)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(service)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};