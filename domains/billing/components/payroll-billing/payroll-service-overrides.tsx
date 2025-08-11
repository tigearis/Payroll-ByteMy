'use client';

import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { format } from 'date-fns';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Settings, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  DollarSign,
  Package,
  Building,
  Users,
  Clock,
  Zap
} from 'lucide-react';
import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

// GraphQL Queries and Mutations
const GET_PAYROLL_SERVICE_AGREEMENTS = gql`
  query GetPayrollServiceAgreements(
    $payrollId: uuid!
    $limit: Int = 50
    $offset: Int = 0
  ) {
    payrollServiceAgreements(
      where: { payrollId: { _eq: $payrollId } }
      limit: $limit
      offset: $offset
      orderBy: [{ createdAt: DESC }]
    ) {
      id
      payrollId
      serviceId
      clientServiceAgreementId
      customRate
      customQuantity
      customDescription
      isOneTime
      isActive
      billingFrequency
      autoBillingEnabled
      billingNotes
      billingItemsGenerated
      generatedAt
      generatedBy
      serviceConfiguration
      createdAt
      updatedAt
      createdBy
      
      payrollServiceAgreementsByServiceId {
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
      }
      
      clientServiceAgreement {
        id
        customRate
        billingFrequency
        isActive
      }
      
    }
    
    payrollsByPk(id: $payrollId) {
      id
      name
      clientId
      status
      primaryConsultantUserId
      backupConsultantUserId
      
      client {
        id
        name
        contactEmail
        active
        
        serviceAgreements(
          where: { isActive: { _eq: true } }
          orderBy: [{ createdAt: DESC }]
        ) {
          id
          serviceId
          customRate
          billingFrequency
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
          }
        }
      }
      
      payrollDates(orderBy: { originalEftDate: ASC }) {
        id
        originalEftDate
        adjustedEftDate
        status
        completedAt
        completedBy
      }
    }
    
    services(
      where: { 
        isActive: { _eq: true }
      }
      orderBy: [{ name: ASC }]
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
      tierPriority
    }
  }
`;

const CREATE_PAYROLL_SERVICE_OVERRIDE = gql`
  mutation CreatePayrollServiceOverride($input: PayrollServiceAgreementsInsertInput!) {
    insertPayrollServiceAgreementsOne(object: $input) {
      id
      serviceId
      customRate
      billingFrequency
      isActive
      autoBillingEnabled
    }
  }
`;

const UPDATE_PAYROLL_SERVICE_OVERRIDE = gql`
  mutation UpdatePayrollServiceOverride(
    $id: uuid!
    $updates: PayrollServiceAgreementsSetInput!
  ) {
    updatePayrollServiceAgreementsByPk(
      pkColumns: { id: $id }
      _set: $updates
    ) {
      id
      customRate
      billingFrequency
      isActive
      autoBillingEnabled
    }
  }
`;

const DELETE_PAYROLL_SERVICE_OVERRIDE = gql`
  mutation DeletePayrollServiceOverride($id: uuid!) {
    updatePayrollServiceAgreementsByPk(
      pkColumns: { id: $id }
      _set: { isActive: false }
    ) {
      id
    }
  }
`;

interface PayrollServiceOverride {
  id: string;
  payrollId: string;
  serviceId: string;
  clientServiceAgreementId?: string;
  customRate?: number;
  customQuantity?: number;
  customDescription?: string;
  isOneTime: boolean;
  isActive: boolean;
  billingFrequency: string;
  autoBillingEnabled: boolean;
  billingNotes?: string;
  billingItemsGenerated: boolean;
  generatedAt?: string;
  generatedBy?: string;
  serviceConfiguration?: any;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  payrollServiceAgreementsByServiceId: Service;
  clientServiceAgreement?: ClientServiceAgreement;
  payroll: Payroll;
  recentBillingItems: BillingItem[];
}

interface Payroll {
  id: string;
  name: string;
  clientId: string;
  status: string;
  primaryConsultantUserId?: string;
  backupConsultantUserId?: string;
  client: Client;
  payrollDates: PayrollDate[];
}

interface Client {
  id: string;
  name: string;
  contactEmail: string;
  active: boolean;
  serviceAgreements: ClientServiceAgreement[];
}

interface ClientServiceAgreement {
  id: string;
  serviceId: string;
  customRate?: number;
  billingFrequency: string;
  service: Service;
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
}


interface PayrollDate {
  id: string;
  originalEftDate: string;
  adjustedEftDate?: string;
  status: string;
  completedAt?: string;
  completedBy?: string;
}

interface User {
  id: string;
  computedName: string;
}

interface BillingItem {
  id: string;
  description: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface OverrideFormData {
  serviceId: string;
  customRate?: number;
  customQuantity?: number;
  customDescription?: string;
  isOneTime: boolean;
  billingFrequency: string;
  autoBillingEnabled: boolean;
  billingNotes?: string;
  serviceConfiguration?: string;
}

interface PayrollServiceOverridesProps {
  payrollId: string;
}

const PayrollServiceOverrides: React.FC<PayrollServiceOverridesProps> = ({
  payrollId
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOverride, setEditingOverride] = useState<PayrollServiceOverride | null>(null);
  const [overrideType, setOverrideType] = useState<'new' | 'existing'>('existing');
  
  const [formData, setFormData] = useState<OverrideFormData>({
    serviceId: '',
    customQuantity: 1,
    customDescription: '',
    isOneTime: false,
    billingFrequency: 'per_payroll',
    autoBillingEnabled: true,
    billingNotes: '',
    serviceConfiguration: ''
  });

  const { data, loading, error, refetch } = useQuery(GET_PAYROLL_SERVICE_AGREEMENTS, {
    variables: { payrollId },
    fetchPolicy: 'cache-and-network'
  });

  const [createOverride] = useMutation(CREATE_PAYROLL_SERVICE_OVERRIDE);
  const [updateOverride] = useMutation(UPDATE_PAYROLL_SERVICE_OVERRIDE);
  const [deleteOverride] = useMutation(DELETE_PAYROLL_SERVICE_OVERRIDE);

  const overrides = data?.payrollServiceAgreements || [];
  const payroll = data?.payrollsByPk;
  const availableServices = data?.services || [];

  // Filter overrides by search term
  const filteredOverrides = overrides.filter((override: PayrollServiceOverride) =>
    override.payrollServiceAgreementsByServiceId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    override.payrollServiceAgreementsByServiceId.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    override.customDescription?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get client service agreements that can be overridden
  const clientAgreements = payroll?.client?.serviceAgreements || [];
  
  // Get services that can be added as overrides (not already overridden)
  const availableForOverride = availableServices.filter((service: Service) =>
    !overrides.find((override: PayrollServiceOverride) => override.serviceId === service.id && override.isActive)
  );

  const handleCreateOverride = async () => {
    try {
      const clientAgreement = overrideType === 'existing' ? 
        clientAgreements.find((ca: any) => ca.serviceId === formData.serviceId) : null;
      
      await createOverride({
        variables: {
          input: {
            payrollId,
            serviceId: formData.serviceId,
            clientServiceAgreementId: clientAgreement?.id || null,
            customRate: formData.customRate || null,
            customQuantity: formData.customQuantity || null,
            customDescription: formData.customDescription || null,
            isOneTime: formData.isOneTime,
            isActive: true,
            billingFrequency: formData.billingFrequency,
            autoBillingEnabled: formData.autoBillingEnabled,
            billingNotes: formData.billingNotes || null,
            serviceConfiguration: formData.serviceConfiguration ? JSON.parse(formData.serviceConfiguration) : null,
            billingItemsGenerated: false
          }
        }
      });
      
      toast({
        title: "Success",
        description: "Payroll service override created successfully"
      });
      
      setIsCreateModalOpen(false);
      resetFormData();
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create payroll service override",
        variant: "destructive"
      });
    }
  };

  const handleUpdateOverride = async () => {
    if (!editingOverride) return;
    
    try {
      await updateOverride({
        variables: {
          id: editingOverride.id,
          updates: {
            customRate: formData.customRate || null,
            customQuantity: formData.customQuantity || null,
            customDescription: formData.customDescription || null,
            isOneTime: formData.isOneTime,
            billingFrequency: formData.billingFrequency,
            autoBillingEnabled: formData.autoBillingEnabled,
            billingNotes: formData.billingNotes || null,
            serviceConfiguration: formData.serviceConfiguration ? JSON.parse(formData.serviceConfiguration) : null,
            updatedAt: new Date().toISOString()
          }
        }
      });
      
      toast({
        title: "Success",
        description: "Payroll service override updated successfully"
      });
      
      setIsEditModalOpen(false);
      setEditingOverride(null);
      resetFormData();
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payroll service override",
        variant: "destructive"
      });
    }
  };

  const handleDeleteOverride = async (overrideId: string) => {
    if (!confirm('Are you sure you want to delete this payroll service override?')) return;
    
    try {
      await deleteOverride({
        variables: { id: overrideId }
      });
      
      toast({
        title: "Success",
        description: "Payroll service override deleted successfully"
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete payroll service override",
        variant: "destructive"
      });
    }
  };

  const openEditModal = (override: PayrollServiceOverride) => {
    setEditingOverride(override);
    setFormData({
      serviceId: override.serviceId,
      ...(override.customRate && { customRate: override.customRate }),
      customQuantity: override.customQuantity || 1,
      customDescription: override.customDescription || '',
      isOneTime: override.isOneTime,
      billingFrequency: override.billingFrequency,
      autoBillingEnabled: override.autoBillingEnabled,
      billingNotes: override.billingNotes || '',
      serviceConfiguration: override.serviceConfiguration ? JSON.stringify(override.serviceConfiguration, null, 2) : ''
    });
    setIsEditModalOpen(true);
  };

  const resetFormData = () => {
    setFormData({
      serviceId: '',
      customQuantity: 1,
      customDescription: '',
      isOneTime: false,
      billingFrequency: 'per_payroll',
      autoBillingEnabled: true,
      billingNotes: '',
      serviceConfiguration: ''
    });
    setOverrideType('existing');
  };

  const getBillingTierColor = (tier: string) => {
    switch (tier) {
      case 'payroll_date': return 'bg-orange-100 text-orange-800';
      case 'payroll': return 'bg-blue-100 text-blue-800';
      case 'client_monthly': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (override: PayrollServiceOverride) => {
    if (!override.isActive) return 'bg-gray-100 text-gray-800';
    if (override.billingItemsGenerated) return 'bg-green-100 text-green-800';
    if (!override.autoBillingEnabled) return 'bg-yellow-100 text-yellow-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getStatusText = (override: PayrollServiceOverride) => {
    if (!override.isActive) return 'Deleted';
    if (override.billingItemsGenerated) return 'Billed';
    if (!override.autoBillingEnabled) return 'Manual';
    return 'Active';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4 animate-spin" />
          <p className="text-gray-500">Loading payroll service overrides...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load payroll service overrides: {error.message}
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
            <FileText className="h-6 w-6" />
            {payroll?.name} - Service Overrides
          </h1>
          <p className="text-gray-600">
            Manage service-specific billing overrides for this payroll
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetFormData(); setIsCreateModalOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Override
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Payroll Overview */}
      {payroll && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Payroll Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm text-gray-500">Client</Label>
                <p className="font-medium">{payroll.client.name}</p>
                <p className="text-sm text-gray-600">{payroll.client.contactEmail}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Payroll Status</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{payroll.status}</Badge>
                  {payroll.client.active ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Payroll Dates</Label>
                <p className="font-medium">
                  {payroll.payrollDates.length} dates
                </p>
                <p className="text-sm text-gray-600">
                  {payroll.payrollDates.filter((pd: any) => pd.status === 'completed').length} completed
                </p>
              </div>
            </div>
            
            {payroll.payrollDates.length > 0 && (
              <div className="mt-4">
                <Label className="text-sm text-gray-500 mb-2 block">Payroll Dates</Label>
                <div className="flex flex-wrap gap-2">
                  {payroll.payrollDates.slice(0, 5).map((date: PayrollDate) => (
                    <Badge 
                      key={date.id} 
                      variant={date.status === 'completed' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {format(new Date(date.adjustedEftDate || date.originalEftDate), 'dd MM yyyy')}
                    </Badge>
                  ))}
                  {payroll.payrollDates.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{payroll.payrollDates.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search service overrides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Total: {overrides.length}</span>
              <span>Active: {overrides.filter((o: PayrollServiceOverride) => o.isActive).length}</span>
              <span>Billed: {overrides.filter((o: PayrollServiceOverride) => o.billingItemsGenerated).length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Overrides */}
      <div className="space-y-4">
        {filteredOverrides.map((override: PayrollServiceOverride) => (
          <Card key={override.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-medium">{override.payrollServiceAgreementsByServiceId.name}</h3>
                    <Badge className={getStatusColor(override)}>
                      {getStatusText(override)}
                    </Badge>
                    <Badge className={getBillingTierColor(override.payrollServiceAgreementsByServiceId.billingTier)}>
                      {override.payrollServiceAgreementsByServiceId.billingTier.replace('_', ' ')}
                    </Badge>
                    {override.isOneTime && (
                      <Badge variant="outline">One-time</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{override.payrollServiceAgreementsByServiceId.category}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {override.customDescription || override.payrollServiceAgreementsByServiceId.description || 'No description available'}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditModal(override)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteOverride(override.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <Label className="text-sm text-gray-500">Override Rate</Label>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      ${override.customRate || override.payrollServiceAgreementsByServiceId.defaultRate || 0}
                    </span>
                    <span className="text-gray-500">per {override.payrollServiceAgreementsByServiceId.billingUnit}</span>
                  </div>
                  {override.clientServiceAgreement && (
                    <p className="text-xs text-blue-600">
                      (Client default: ${override.clientServiceAgreement.customRate || override.payrollServiceAgreementsByServiceId.defaultRate || 0})
                    </p>
                  )}
                </div>
                
                <div>
                  <Label className="text-sm text-gray-500">Billing Frequency</Label>
                  <p className="font-medium">{override.billingFrequency.replace('_', ' ')}</p>
                  {override.customQuantity && override.customQuantity > 1 && (
                    <p className="text-xs text-gray-500">Quantity: {override.customQuantity}</p>
                  )}
                </div>
                
                <div>
                  <Label className="text-sm text-gray-500">Auto Billing</Label>
                  <div className="flex items-center gap-2">
                    {override.autoBillingEnabled ? (
                      <>
                        <Zap className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Enabled</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="text-yellow-600">Manual</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm text-gray-500">Billing Status</Label>
                  <div className="flex items-center gap-2">
                    {override.billingItemsGenerated ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Generated</span>
                      </>
                    ) : (
                      <>
                        <Package className="h-4 w-4 text-blue-600" />
                        <span className="text-blue-600">Pending</span>
                      </>
                    )}
                  </div>
                  {override.generatedAt && (
                    <p className="text-xs text-gray-500">
                      {format(new Date(override.generatedAt), 'dd MM yyyy')}
                    </p>
                  )}
                </div>
              </div>
              
              {override.billingNotes && (
                <div className="p-3 bg-yellow-50 rounded border-l-4 border-yellow-400 mb-4">
                  <p className="text-sm">
                    <strong>Notes:</strong> {override.billingNotes}
                  </p>
                </div>
              )}
              
              {override.recentBillingItems && override.recentBillingItems.length > 0 && (
                <div>
                  <Label className="text-sm text-gray-500 mb-2 block">Recent Billing Items</Label>
                  <div className="space-y-1">
                    {override.recentBillingItems.slice(0, 3).map((item: BillingItem) => (
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
                  </div>
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t text-xs text-gray-500 flex items-center justify-between">
                <div>
                  Created: {format(new Date(override.createdAt), 'dd MM yyyy')}
                </div>
                {override.updatedAt !== override.createdAt && (
                  <div>
                    Updated: {format(new Date(override.updatedAt), 'dd MM yyyy')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOverrides.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No service overrides found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Create service overrides to customize billing for this specific payroll'
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Override
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
          setEditingOverride(null);
          resetFormData();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingOverride ? 'Edit Service Override' : 'Add Service Override'}
            </DialogTitle>
            <DialogDescription>
              {editingOverride 
                ? 'Update the service override configuration for this payroll'
                : 'Create a service-specific billing override for this payroll'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {!editingOverride && (
              <div>
                <Label>Override Type</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={overrideType === 'existing'}
                      onChange={() => setOverrideType('existing')}
                    />
                    <span>Override existing client service</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={overrideType === 'new'}
                      onChange={() => setOverrideType('new')}
                    />
                    <span>Add new service</span>
                  </label>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="serviceId">Service *</Label>
              {!editingOverride && (
                <Select value={formData.serviceId} onValueChange={(value) => setFormData(prev => ({ ...prev, serviceId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {overrideType === 'existing' 
                      ? clientAgreements.map((agreement: ClientServiceAgreement) => (
                          <SelectItem key={agreement.id} value={agreement.serviceId}>
                            <div>
                              <div className="font-medium">{agreement.service.name}</div>
                              <div className="text-sm text-gray-500">
                                {agreement.service.category} • ${agreement.customRate || agreement.service.defaultRate || 0}
                              </div>
                            </div>
                          </SelectItem>
                        ))
                      : availableForOverride.map((service: Service) => (
                          <SelectItem key={service.id} value={service.id}>
                            <div>
                              <div className="font-medium">{service.name}</div>
                              <div className="text-sm text-gray-500">
                                {service.category} • ${service.defaultRate || 0}
                              </div>
                            </div>
                          </SelectItem>
                        ))
                    }
                  </SelectContent>
                </Select>
              )}
              {editingOverride && (
                <Input value={editingOverride.payrollServiceAgreementsByServiceId.name} disabled />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customRate">Custom Rate (AUD)</Label>
                <Input
                  id="customRate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.customRate || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      ...(val ? { customRate: parseFloat(val) } : {})
                    }));
                  }}
                  placeholder="Override rate"
                />
              </div>
              
              <div>
                <Label htmlFor="customQuantity">Quantity</Label>
                <Input
                  id="customQuantity"
                  type="number"
                  min="1"
                  value={formData.customQuantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, customQuantity: parseInt(e.target.value) || 1 }))}
                />
              </div>
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
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="customDescription">Custom Description</Label>
              <Textarea
                id="customDescription"
                value={formData.customDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, customDescription: e.target.value }))}
                placeholder="Optional custom description for this override..."
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isOneTime"
                  checked={formData.isOneTime}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isOneTime: checked }))}
                />
                <Label htmlFor="isOneTime">One-time service</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="autoBillingEnabled"
                  checked={formData.autoBillingEnabled}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, autoBillingEnabled: checked }))}
                />
                <Label htmlFor="autoBillingEnabled">Auto billing enabled</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="billingNotes">Billing Notes</Label>
              <Textarea
                id="billingNotes"
                value={formData.billingNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, billingNotes: e.target.value }))}
                placeholder="Optional notes about this override..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="serviceConfiguration">Service Configuration (JSON)</Label>
              <Textarea
                id="serviceConfiguration"
                value={formData.serviceConfiguration}
                onChange={(e) => setFormData(prev => ({ ...prev, serviceConfiguration: e.target.value }))}
                placeholder='{"key": "value"}'
                rows={4}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional JSON configuration for service-specific settings
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreateModalOpen(false);
              setIsEditModalOpen(false);
              setEditingOverride(null);
              resetFormData();
            }}>
              Cancel
            </Button>
            <Button onClick={editingOverride ? handleUpdateOverride : handleCreateOverride}>
              {editingOverride ? 'Update Override' : 'Create Override'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PayrollServiceOverrides;