'use client';

import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Package, 
  Users, 
  Building, 
  Star, 
  DollarSign,
  Settings,
  FileCheck,
  Zap
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

// GraphQL Queries and Mutations
const GET_ONBOARDING_DATA = gql`
  query GetOnboardingData {
    clientTemplateBundles(
      where: { isActive: { _eq: true } }
      orderBy: [{ isFeatured: DESC }, { displayOrder: ASC }]
    ) {
      id
      bundleName
      description
      targetClientSize
      targetIndustry
      complexityLevel
      isFeatured
      bundleDiscountPercentage
      estimatedMonthlyCost
      
      bundleAssignments: bundleTemplateAssignments(
        orderBy: { displayOrder: ASC }
      ) {
        id
        isRequired
        isDefaultEnabled
        customRate
        customBillingFrequency
        customDescription
        template: serviceTemplate {
          id
          templateName
          description
          defaultRate
          complexityLevel
          billingTier
          defaultBillingFrequency
          category {
            id
            name
          }
        }
      }
    }
    
    serviceTemplates(
      where: { isActive: { _eq: true } }
      orderBy: [{ isPopular: DESC }, { displayOrder: ASC }]
    ) {
      id
      templateName
      description
      defaultRate
      complexityLevel
      billingTier
      defaultBillingFrequency
      isPopular
      category {
        id
        name
      }
    }
    
    clients(
      where: { active: { _eq: true } }
      orderBy: { name: ASC }
    ) {
      id
      name
      contactEmail
      active
    }
  }
`;

const CREATE_ONBOARDING_SESSION = gql`
  mutation CreateOnboardingSession($input: ClientOnboardingSessionsInsertInput!) {
    insertClientOnboardingSessionsOne(object: $input) {
      id
      sessionName
      status
      totalEstimatedCost
      servicesCount
    }
  }
`;

const CREATE_SERVICE_SELECTIONS = gql`
  mutation CreateServiceSelections($selections: [OnboardingServiceSelectionsInsertInput!]!) {
    insertOnboardingServiceSelections(objects: $selections) {
      affectedRows
      returning {
        id
        isSelected
        customRate
      }
    }
  }
`;

const UPDATE_ONBOARDING_SESSION = gql`
  mutation UpdateOnboardingSession(
    $id: uuid!
    $updates: ClientOnboardingSessionsSetInput!
  ) {
    updateClientOnboardingSessionsByPk(
      pkColumns: { id: $id }
      _set: $updates
    ) {
      id
      status
      completionPercentage
      totalEstimatedCost
    }
  }
`;

const CREATE_CLIENT_SERVICE_AGREEMENTS = gql`
  mutation CreateClientServiceAgreements($agreements: [ClientServiceAgreementsInsertInput!]!) {
    insertClientServiceAgreements(objects: $agreements) {
      affectedRows
      returning {
        id
        serviceId
        customRate
        isActive
      }
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
  isFeatured: boolean;
  bundleDiscountPercentage?: number;
  estimatedMonthlyCost?: number;
  bundleAssignments: BundleAssignment[];
}

interface BundleAssignment {
  id: string;
  isRequired: boolean;
  isDefaultEnabled: boolean;
  customRate?: number;
  customBillingFrequency?: string;
  customDescription?: string;
  template: ServiceTemplate;
}

interface ServiceTemplate {
  id: string;
  templateName: string;
  description?: string;
  defaultRate?: number;
  complexityLevel: string;
  billingTier: string;
  defaultBillingFrequency: string;
  isPopular?: boolean;
  category: {
    id: string;
    name: string;
  };
}

interface Client {
  id: string;
  name: string;
  contactEmail: string;
  active: boolean;
}

interface ServiceSelection {
  templateId: string;
  isSelected: boolean;
  customRate?: number;
  customBillingFrequency?: string;
  customDescription?: string;
  isRequired: boolean;
  selectionSource: 'bundle' | 'manual' | 'recommended';
}

interface OnboardingFormData {
  clientId: string;
  sessionName: string;
  selectedBundleId?: string;
  clientSize: string;
  industry: string;
  serviceSelections: Record<string, ServiceSelection>;
}

const ONBOARDING_STEPS = [
  { id: 'client', title: 'Select Client', description: 'Choose the client for onboarding' },
  { id: 'bundle', title: 'Choose Bundle', description: 'Select a service bundle or start from scratch' },
  { id: 'services', title: 'Configure Services', description: 'Customize your service selection' },
  { id: 'review', title: 'Review & Confirm', description: 'Review and finalize your configuration' }
];

interface ClientOnboardingWizardProps {
  onComplete?: (sessionId: string) => void;
  onCancel?: () => void;
}

const ClientOnboardingWizard: React.FC<ClientOnboardingWizardProps> = ({
  onComplete,
  onCancel
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingSessionId, setOnboardingSessionId] = useState<string | null>(null);
  const [formData, setFormData] = useState<OnboardingFormData>({
    clientId: '',
    sessionName: '',
    selectedBundleId: '',
    clientSize: 'medium',
    industry: 'General',
    serviceSelections: {}
  });

  const { data, loading, error } = useQuery(GET_ONBOARDING_DATA, {
    fetchPolicy: 'cache-and-network'
  });

  const [createSession] = useMutation(CREATE_ONBOARDING_SESSION);
  const [createSelections] = useMutation(CREATE_SERVICE_SELECTIONS);
  const [updateSession] = useMutation(UPDATE_ONBOARDING_SESSION);
  const [createAgreements] = useMutation(CREATE_CLIENT_SERVICE_AGREEMENTS);

  const bundles = data?.clientTemplateBundles || [];
  const templates = data?.serviceTemplates || [];
  const clients = data?.clients || [];

  const selectedClient = clients.find((c: Client) => c.id === formData.clientId);
  const selectedBundle = bundles.find((b: TemplateBundle) => b.id === formData.selectedBundleId);

  // Calculate progress percentage
  const progressPercentage = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  // Filter bundles by client size and industry
  const filteredBundles = bundles.filter((bundle: TemplateBundle) => {
    const sizeMatch = !formData.clientSize || bundle.targetClientSize === formData.clientSize;
    const industryMatch = !formData.industry || bundle.targetIndustry === formData.industry || bundle.targetIndustry === 'General';
    return sizeMatch && industryMatch;
  });

  // Calculate total cost
  const calculateTotalCost = () => {
    let total = 0;
    Object.entries(formData.serviceSelections).forEach(([templateId, selection]) => {
      if (selection.isSelected) {
        const template = templates.find((t: ServiceTemplate) => t.id === templateId);
        const rate = selection.customRate || template?.defaultRate || 0;
        total += rate;
      }
    });
    
    // Apply bundle discount if applicable
    if (selectedBundle?.bundleDiscountPercentage) {
      total = total * (1 - selectedBundle.bundleDiscountPercentage / 100);
    }
    
    return total;
  };

  // Initialize service selections when bundle is selected
  useEffect(() => {
    if (selectedBundle) {
      const newSelections: Record<string, ServiceSelection> = {};
      
      selectedBundle.bundleAssignments.forEach((assignment: any) => {
        newSelections[assignment.template.id] = {
          templateId: assignment.template.id,
          isSelected: assignment.isDefaultEnabled,
          customRate: assignment.customRate || undefined,
          customBillingFrequency: assignment.customBillingFrequency || assignment.template.defaultBillingFrequency,
          customDescription: assignment.customDescription || undefined,
          isRequired: assignment.isRequired,
          selectionSource: 'bundle'
        };
      });
      
      setFormData(prev => ({ ...prev, serviceSelections: newSelections }));
    }
  }, [selectedBundle]);

  const handleNext = async () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      // Create onboarding session on first step completion
      if (currentStep === 0 && !onboardingSessionId) {
        try {
          const result = await createSession({
            variables: {
              input: {
                clientId: formData.clientId,
                sessionName: formData.sessionName || `${selectedClient?.name} Onboarding`,
                selectedBundleId: formData.selectedBundleId || null,
                status: 'in_progress',
                totalEstimatedCost: 0,
                servicesCount: 0
              }
            }
          });
          setOnboardingSessionId(result.data.insertClientOnboardingSessionsOne.id);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to create onboarding session",
            variant: "destructive"
          });
          return;
        }
      }
      
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleServiceSelectionChange = (templateId: string, updates: Partial<ServiceSelection>) => {
    setFormData(prev => ({
      ...prev,
      serviceSelections: {
        ...prev.serviceSelections,
        [templateId]: {
          ...prev.serviceSelections[templateId],
          ...updates
        }
      }
    }));
  };

  const handleComplete = async () => {
    if (!onboardingSessionId) return;
    
    try {
      const selectedServices = Object.entries(formData.serviceSelections)
        .filter(([_, selection]) => selection.isSelected);
      
      // Create service selections
      const selectionInputs = selectedServices.map(([templateId, selection]) => ({
        onboardingSessionId,
        templateId,
        isSelected: true,
        isRequired: selection.isRequired,
        selectionSource: selection.selectionSource,
        customRate: selection.customRate || null,
        customBillingFrequency: selection.customBillingFrequency || null,
        customDescription: selection.customDescription || null,
        autoBillingEnabled: true,
        requiresApproval: false
      }));
      
      await createSelections({
        variables: { selections: selectionInputs }
      });
      
      // Update session status
      await updateSession({
        variables: {
          id: onboardingSessionId,
          updates: {
            status: 'completed',
            completedAt: new Date().toISOString(),
            totalEstimatedCost: calculateTotalCost(),
            servicesCount: selectedServices.length,
            completionPercentage: 100
          }
        }
      });
      
      toast({
        title: "Success",
        description: "Client onboarding completed successfully"
      });
      
      if (onComplete) {
        onComplete(onboardingSessionId);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete onboarding",
        variant: "destructive"
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Client Selection
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Select Client</h3>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="clientId">Client *</Label>
                  <Select value={formData.clientId} onValueChange={(value) => setFormData(prev => ({ ...prev, clientId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client: Client) => (
                        <SelectItem key={client.id} value={client.id}>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            {client.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="sessionName">Session Name</Label>
                  <Input
                    id="sessionName"
                    value={formData.sessionName}
                    onChange={(e) => setFormData(prev => ({ ...prev, sessionName: e.target.value }))}
                    placeholder={selectedClient ? `${selectedClient.name} Onboarding` : 'Onboarding Session'}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientSize">Client Size</Label>
                    <Select value={formData.clientSize} onValueChange={(value) => setFormData(prev => ({ ...prev, clientSize: value }))}>
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
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={formData.industry}
                      onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                      placeholder="e.g., General, Construction, Healthcare"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 1: // Bundle Selection
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Choose Service Bundle</h3>
              <p className="text-gray-600 mb-6">
                Select a pre-configured bundle or start with a custom configuration
              </p>
              
              <div className="grid gap-4">
                {/* Custom Option */}
                <Card 
                  className={`cursor-pointer transition-all ${!formData.selectedBundleId ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'}`}
                  onClick={() => setFormData(prev => ({ ...prev, selectedBundleId: '' }))}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <Settings className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Custom Configuration</h4>
                        <p className="text-sm text-gray-600">Build your own service package from scratch</p>
                      </div>
                      {!formData.selectedBundleId && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Bundle Options */}
                {filteredBundles.map((bundle: TemplateBundle) => (
                  <Card 
                    key={bundle.id}
                    className={`cursor-pointer transition-all ${formData.selectedBundleId === bundle.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'}`}
                    onClick={() => setFormData(prev => ({ ...prev, selectedBundleId: bundle.id }))}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <Package className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{bundle.bundleName}</h4>
                            {bundle.isFeatured && (
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {bundle.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <Badge variant="outline">{bundle.targetClientSize}</Badge>
                            <Badge variant="outline">{bundle.complexityLevel}</Badge>
                            <span className="text-gray-500">
                              {bundle.bundleAssignments.length} services
                            </span>
                            {bundle.estimatedMonthlyCost && (
                              <span className="font-medium text-green-600">
                                ${bundle.estimatedMonthlyCost}/month
                              </span>
                            )}
                            {bundle.bundleDiscountPercentage && bundle.bundleDiscountPercentage > 0 && (
                              <Badge className="bg-green-100 text-green-800">
                                {bundle.bundleDiscountPercentage}% off
                              </Badge>
                            )}
                          </div>
                        </div>
                        {formData.selectedBundleId === bundle.id && (
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 2: // Service Configuration
        const availableTemplates = formData.selectedBundleId ? 
          selectedBundle?.bundleAssignments.map((a: any) => a.template) || [] :
          templates;
          
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Configure Services</h3>
              <p className="text-gray-600 mb-6">
                {formData.selectedBundleId 
                  ? 'Review and customize the services in your selected bundle'
                  : 'Select the services you want to include'
                }
              </p>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {availableTemplates.map((template: ServiceTemplate) => {
                  const selection = formData.serviceSelections[template.id];
                  const isSelected = selection?.isSelected || false;
                  const isRequired = selection?.isRequired || false;
                  
                  return (
                    <Card key={template.id} className={`${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={isSelected}
                            disabled={isRequired}
                            onCheckedChange={(checked) => {
                              if (!isRequired) {
                                handleServiceSelectionChange(template.id, { 
                                  isSelected: checked as boolean,
                                  templateId: template.id,
                                  selectionSource: formData.selectedBundleId ? 'bundle' : 'manual',
                                  isRequired: false
                                });
                              }
                            }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{template.templateName}</h4>
                              {template.isPopular && (
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              )}
                              {isRequired && (
                                <Badge variant="destructive" className="text-xs">Required</Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {template.category.name}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {template.description || 'No description available'}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-gray-500">
                                {template.billingTier.replace('_', ' ')}
                              </span>
                              <span className="font-medium">
                                {selection?.customRate || template.defaultRate 
                                  ? `$${selection?.customRate || template.defaultRate}` 
                                  : 'No rate set'
                                }
                              </span>
                              <span className="text-gray-500">
                                {template.defaultBillingFrequency.replace('_', ' ')}
                              </span>
                            </div>
                            
                            {isSelected && (
                              <div className="mt-3 p-3 bg-white rounded border">
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <Label className="text-sm">Custom Rate (AUD)</Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      placeholder={template.defaultRate?.toString() || '0'}
                                      value={selection?.customRate || ''}
                                      onChange={(e) => {
                                        const value = parseFloat(e.target.value);
                                        handleServiceSelectionChange(template.id, {
                                          ...(value > 0 && { customRate: value })
                                        });
                                      }}
                                      className="mt-1"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-sm">Billing Frequency</Label>
                                    <Select 
                                      value={selection?.customBillingFrequency || template.defaultBillingFrequency}
                                      onValueChange={(value) => handleServiceSelectionChange(template.id, {
                                        customBillingFrequency: value
                                      })}
                                    >
                                      <SelectTrigger className="mt-1">
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
                                </div>
                                <div className="mt-3">
                                  <Label className="text-sm">Custom Description</Label>
                                  <Textarea
                                    placeholder="Optional custom description for this service..."
                                    value={selection?.customDescription || ''}
                                    onChange={(e) => {
                                      const value = e.target.value.trim();
                                      handleServiceSelectionChange(template.id, {
                                        ...(value && { customDescription: value })
                                      });
                                    }}
                                    className="mt-1"
                                    rows={2}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 3: // Review & Confirm
        const selectedServices = Object.entries(formData.serviceSelections)
          .filter(([_, selection]) => selection.isSelected);
        const totalCost = calculateTotalCost();
        
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Review & Confirm</h3>
              <p className="text-gray-600 mb-6">
                Please review your onboarding configuration before finalizing
              </p>
              
              <div className="space-y-6">
                {/* Client Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Client Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Client:</span>
                        <p className="font-medium">{selectedClient?.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Contact:</span>
                        <p className="font-medium">{selectedClient?.contactEmail}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Size:</span>
                        <p className="font-medium">{formData.clientSize}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Industry:</span>
                        <p className="font-medium">{formData.industry}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Bundle Summary */}
                {selectedBundle && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Selected Bundle
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{selectedBundle.bundleName}</h4>
                        {selectedBundle.isFeatured && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{selectedBundle.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <Badge variant="outline">{selectedBundle.complexityLevel}</Badge>
                        {selectedBundle.bundleDiscountPercentage && selectedBundle.bundleDiscountPercentage > 0 && (
                          <Badge className="bg-green-100 text-green-800">
                            {selectedBundle.bundleDiscountPercentage}% discount applied
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Services Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileCheck className="h-5 w-5" />
                      Selected Services ({selectedServices.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedServices.map(([templateId, selection]) => {
                        const template = templates.find((t: ServiceTemplate) => t.id === templateId);
                        if (!template) return null;
                        
                        const rate = selection.customRate || template.defaultRate || 0;
                        
                        return (
                          <div key={templateId} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h5 className="font-medium">{template.templateName}</h5>
                                {selection.isRequired && (
                                  <Badge variant="destructive" className="text-xs">Required</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{template.category.name}</p>
                              <p className="text-xs text-gray-500">
                                {selection.customBillingFrequency?.replace('_', ' ') || template.defaultBillingFrequency.replace('_', ' ')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${rate}</p>
                              {selection.customRate && selection.customRate !== template.defaultRate && (
                                <p className="text-xs text-blue-600">Custom rate</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Cost Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Cost Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Services Total:</span>
                        <span>${Object.entries(formData.serviceSelections)
                          .filter(([_, selection]) => selection.isSelected)
                          .reduce((sum, [templateId, selection]) => {
                            const template = templates.find((t: ServiceTemplate) => t.id === templateId);
                            const rate = selection.customRate || template?.defaultRate || 0;
                            return sum + rate;
                          }, 0).toFixed(2)}</span>
                      </div>
                      {selectedBundle?.bundleDiscountPercentage && selectedBundle.bundleDiscountPercentage > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Bundle Discount ({selectedBundle.bundleDiscountPercentage}%):</span>
                          <span>-${(Object.entries(formData.serviceSelections)
                            .filter(([_, selection]) => selection.isSelected)
                            .reduce((sum, [templateId, selection]) => {
                              const template = templates.find((t: ServiceTemplate) => t.id === templateId);
                              const rate = selection.customRate || template?.defaultRate || 0;
                              return sum + rate;
                            }, 0) * selectedBundle.bundleDiscountPercentage / 100).toFixed(2)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-medium text-lg">
                        <span>Total Estimated Cost:</span>
                        <span>${totalCost.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.clientId && formData.clientSize && formData.industry;
      case 1:
        return true; // Bundle selection is optional
      case 2:
        return Object.values(formData.serviceSelections).some(s => s.isSelected);
      case 3:
        return true;
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Zap className="mx-auto h-12 w-12 text-gray-400 mb-4 animate-pulse" />
          <p className="text-gray-500">Loading onboarding wizard...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load onboarding data: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Client Onboarding Wizard</h2>
            <Badge variant="outline">
              Step {currentStep + 1} of {ONBOARDING_STEPS.length}
            </Badge>
          </div>
          
          <Progress value={progressPercentage} className="mb-4" />
          
          <div className="flex items-center justify-between text-sm">
            <div>
              <h3 className="font-medium">{ONBOARDING_STEPS[currentStep].title}</h3>
              <p className="text-gray-600">{ONBOARDING_STEPS[currentStep].description}</p>
            </div>
            {selectedClient && (
              <div className="text-right">
                <p className="font-medium">{selectedClient.name}</p>
                <p className="text-gray-600">{selectedClient.contactEmail}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={currentStep === 0 ? onCancel : handlePrevious}
              disabled={loading}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {currentStep === 0 ? 'Cancel' : 'Previous'}
            </Button>
            
            <div className="flex items-center gap-4">
              {currentStep === ONBOARDING_STEPS.length - 1 && (
                <div className="text-right text-sm">
                  <p className="text-gray-600">Total Services: {Object.values(formData.serviceSelections).filter(s => s.isSelected).length}</p>
                  <p className="font-medium">Estimated Cost: ${calculateTotalCost().toFixed(2)}</p>
                </div>
              )}
              
              <Button 
                onClick={currentStep === ONBOARDING_STEPS.length - 1 ? handleComplete : handleNext}
                disabled={!canProceed() || loading}
              >
                {currentStep === ONBOARDING_STEPS.length - 1 ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Onboarding
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientOnboardingWizard;