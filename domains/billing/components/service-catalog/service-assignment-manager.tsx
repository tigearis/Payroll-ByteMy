'use client';

import { useQuery, useMutation } from '@apollo/client';
import { Users, Plus, Save, X, Copy, Settings } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  GetServiceCatalogDocument,
  GetClientServiceAgreementsDocument,
  BulkUpdateClientServiceAgreementsDocument,
} from '../../graphql/generated/graphql';

interface ServiceAssignment {
  serviceId: string;
  serviceName: string;
  category: string;
  standardRate: number;
  billingUnit: string;
  customRate?: number;
  billingFrequency: string;
  selected: boolean;
  isActive: boolean;
}

interface ServiceTemplate {
  id: string;
  name: string;
  description: string;
  services: ServiceAssignment[];
}

interface ServiceAssignmentManagerProps {
  clientId: string;
  clientName?: string;
  onAssignmentCompleted?: () => void;
}

const BILLING_FREQUENCIES = [
  'Monthly',
  'Per Payroll',
  'Quarterly',
  'Annually',
  'One-time'
];

const SERVICE_TEMPLATES: ServiceTemplate[] = [
  {
    id: 'startup',
    name: 'Startup Package',
    description: 'Essential services for new businesses',
    services: []
  },
  {
    id: 'enterprise',
    name: 'Enterprise Package',
    description: 'Comprehensive services for large organizations',
    services: []
  },
  {
    id: 'consulting-only',
    name: 'Consulting Only',
    description: 'Consulting and advisory services',
    services: []
  }
];

export const ServiceAssignmentManager: React.FC<ServiceAssignmentManagerProps> = ({
  clientId,
  clientName,
  onAssignmentCompleted
}) => {
  const [serviceAssignments, setServiceAssignments] = useState<ServiceAssignment[]>([]);
  const [activeTab, setActiveTab] = useState('assign');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [globalRateMultiplier, setGlobalRateMultiplier] = useState(1.0);
  const [defaultBillingFrequency, setDefaultBillingFrequency] = useState('Monthly');

  // Get service catalog
  const { data: serviceCatalog, loading: catalogLoading } = useQuery(
    GetServiceCatalogDocument,
    {
      variables: { isActive: true }
    }
  );

  // Get existing client service agreements
  const { data: existingAgreements, loading: agreementsLoading } = useQuery(
    GetClientServiceAgreementsDocument,
    {
      variables: { clientId }
    }
  );

  // Mutation for bulk updating agreements
  const [bulkUpdateAgreements] = useMutation(BulkUpdateClientServiceAgreementsDocument);

  const services = serviceCatalog?.billingPlans || [];
  const currentAgreements = existingAgreements?.clientBillingAssignments || [];

  // Initialize service assignments
  useEffect(() => {
    if (services.length > 0) {
      const assignments = services.map(service => {
        // Check if this service already has an agreement
        const existingAgreement = currentAgreements.find(
          agreement => agreement.billingPlanId === service.id
        );

        return {
          serviceId: service.id,
          serviceName: service.name,
          category: service.category,
          standardRate: service.standardRate,
          billingUnit: service.billingUnit,
          customRate: existingAgreement?.customRate || undefined,
          billingFrequency: existingAgreement?.billingFrequency || defaultBillingFrequency,
          selected: !!existingAgreement,
          isActive: existingAgreement?.isActive || false
        };
      });
      setServiceAssignments(assignments);
    }
  }, [services, currentAgreements, defaultBillingFrequency]);

  // Update service assignment
  const updateAssignment = (serviceId: string, field: keyof ServiceAssignment, value: any) => {
    setServiceAssignments(prev =>
      prev.map(assignment =>
        assignment.serviceId === serviceId
          ? { ...assignment, [field]: value }
          : assignment
      )
    );
  };

  // Apply global rate multiplier
  const applyGlobalRateMultiplier = () => {
    setServiceAssignments(prev =>
      prev.map(assignment => ({
        ...assignment,
        customRate: Math.round(assignment.standardRate * globalRateMultiplier * 100) / 100
      }))
    );
    toast.success(`Applied ${globalRateMultiplier}x rate multiplier to all services`);
  };

  // Apply template
  const applyTemplate = (template: ServiceTemplate) => {
    // For this demo, we'll apply different rate multipliers based on template
    let multiplier = 1.0;
    let frequency = 'Monthly';

    switch (template.id) {
      case 'startup':
        multiplier = 0.8; // 20% discount for startups
        frequency = 'Monthly';
        break;
      case 'enterprise':
        multiplier = 1.2; // 20% premium for enterprise
        frequency = 'Monthly';
        break;
      case 'consulting-only':
        multiplier = 1.5; // Premium rates for consulting
        frequency = 'Per Payroll';
        break;
    }

    setServiceAssignments(prev =>
      prev.map(assignment => {
        // Select certain services based on template
        let shouldSelect = false;
        if (template.id === 'startup') {
          shouldSelect = ['Processing', 'Setup & Configuration'].includes(assignment.category);
        } else if (template.id === 'enterprise') {
          shouldSelect = true; // Select all services
        } else if (template.id === 'consulting-only') {
          shouldSelect = assignment.category === 'Consulting';
        }

        return {
          ...assignment,
          selected: shouldSelect,
          customRate: Math.round(assignment.standardRate * multiplier * 100) / 100,
          billingFrequency: frequency
        };
      })
    );

    toast.success(`Applied ${template.name} template`);
  };

  // Bulk select by category
  const selectByCategory = (category: string, selected: boolean) => {
    setServiceAssignments(prev =>
      prev.map(assignment =>
        assignment.category === category
          ? { ...assignment, selected }
          : assignment
      )
    );
  };

  // Save service assignments
  const saveAssignments = async () => {
    const selectedAssignments = serviceAssignments.filter(assignment => assignment.selected);
    
    if (selectedAssignments.length === 0) {
      toast.error('Please select at least one service');
      return;
    }

    try {
      const agreements = selectedAssignments.map(assignment => ({
        clientId: clientId,
        billingPlanId: assignment.serviceId,
        customRate: assignment.customRate || assignment.standardRate,
        billingFrequency: assignment.billingFrequency,
        effectiveDate: new Date().toISOString().split('T')[0],
        isEnabled: true,
        isActive: true
      }));

      await bulkUpdateAgreements({
        variables: {
          clientId: clientId,
          agreements: agreements
        }
      });

      toast.success(`Assigned ${selectedAssignments.length} services to ${clientName || 'client'}`);
      onAssignmentCompleted?.();
    } catch (error) {
      toast.error('Failed to assign services');
      console.error('Service assignment error:', error);
    }
  };

  const getSelectedCount = () => serviceAssignments.filter(a => a.selected).length;
  const getTotalValue = () => serviceAssignments
    .filter(a => a.selected)
    .reduce((total, a) => total + (a.customRate || a.standardRate), 0);

  const getCategoryServices = (category: string) => 
    serviceAssignments.filter(a => a.category === category);

  const categories = [...new Set(serviceAssignments.map(a => a.category))];

  if (catalogLoading || agreementsLoading) {
    return <div className="text-center py-8">Loading services...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Service Assignment Manager
          </CardTitle>
          <CardDescription>
            {clientName ? `Assign services to ${clientName}` : 'Assign services to client'}
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assign">Assign Services</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="assign" className="space-y-6">
          {/* Service Assignment Table */}
          <Card>
            <CardHeader>
              <CardTitle>Available Services</CardTitle>
              <CardDescription>
                Select services to assign to this client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {categories.map(category => {
                  const categoryServices = getCategoryServices(category);
                  const selectedInCategory = categoryServices.filter(s => s.selected).length;
                  
                  return (
                    <div key={category} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{category}</h3>
                          <Badge variant="outline">
                            {selectedInCategory}/{categoryServices.length} selected
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => selectByCategory(category, true)}
                          >
                            Select All
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => selectByCategory(category, false)}
                          >
                            Clear All
                          </Button>
                        </div>
                      </div>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">Select</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Standard Rate</TableHead>
                            <TableHead>Custom Rate</TableHead>
                            <TableHead>Billing Frequency</TableHead>
                            <TableHead>Unit</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {categoryServices.map((assignment) => (
                            <TableRow key={assignment.serviceId}>
                              <TableCell>
                                <Checkbox
                                  checked={assignment.selected}
                                  onCheckedChange={(checked) =>
                                    updateAssignment(assignment.serviceId, 'selected', checked)
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{assignment.serviceName}</div>
                                  {assignment.isActive && <Badge variant="secondary" className="mt-1">Currently Active</Badge>}
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="font-mono">${assignment.standardRate}</span>
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={assignment.customRate || assignment.standardRate}
                                  onChange={(e) =>
                                    updateAssignment(
                                      assignment.serviceId,
                                      'customRate',
                                      parseFloat(e.target.value) || assignment.standardRate
                                    )
                                  }
                                  disabled={!assignment.selected}
                                  className="w-24"
                                />
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={assignment.billingFrequency}
                                  onValueChange={(value) =>
                                    updateAssignment(assignment.serviceId, 'billingFrequency', value)
                                  }
                                  disabled={!assignment.selected}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {BILLING_FREQUENCIES.map(freq => (
                                      <SelectItem key={freq} value={freq}>
                                        {freq}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm text-gray-600">{assignment.billingUnit}</span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Templates</CardTitle>
              <CardDescription>
                Apply predefined service packages for quick setup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SERVICE_TEMPLATES.map((template) => (
                  <Card key={template.id} className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold">{template.name}</h4>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => applyTemplate(template)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Apply Template
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Operations</CardTitle>
              <CardDescription>
                Apply changes to multiple services at once
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Global Rate Adjustment</h4>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="multiplier">Rate Multiplier:</Label>
                    <Input
                      id="multiplier"
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="5.0"
                      value={globalRateMultiplier}
                      onChange={(e) => setGlobalRateMultiplier(parseFloat(e.target.value) || 1.0)}
                      className="w-24"
                    />
                    <Button onClick={applyGlobalRateMultiplier}>
                      Apply
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Multiply all standard rates by this factor
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Default Billing Frequency</h4>
                  <Select
                    value={defaultBillingFrequency}
                    onValueChange={setDefaultBillingFrequency}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BILLING_FREQUENCIES.map(freq => (
                        <SelectItem key={freq} value={freq}>
                          {freq}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-600">
                    Default frequency for new assignments
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary and Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Selected Services</p>
                <p className="text-2xl font-bold">{getSelectedCount()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Monthly Value</p>
                <p className="text-2xl font-bold text-green-600">
                  ${getTotalValue().toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Agreements</p>
                <p className="text-2xl font-bold">{currentAgreements.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
            </div>

            <Separator />

            <div className="flex justify-end gap-4">
              <Button
                onClick={saveAssignments}
                disabled={getSelectedCount() === 0}
                size="lg"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Service Assignments ({getSelectedCount()})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};