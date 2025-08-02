'use client';

import { useQuery, useMutation } from '@apollo/client';
import { Edit2, Save, X, Plus } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  GetClientServiceAgreementsDocument,
  GetServiceCatalogDocument,
  BulkUpdateClientServiceAgreementsDocument
} from '../../graphql/generated/graphql';

interface ClientServiceAgreement {
  id?: string;
  service_id: string;
  service_name: string;
  standard_rate: number;
  custom_rate?: number | undefined;
  billing_unit: string;
  category: string;
  billing_frequency: string;
  is_enabled: boolean;
  effective_date: string;
}

interface ClientServiceAgreementsProps {
  clientId: string;
  clientName: string;
}

const BILLING_FREQUENCIES = [
  'Per Job',
  'Monthly',
  'Quarterly',
  'Annually'
];

export const ClientServiceAgreements: React.FC<ClientServiceAgreementsProps> = ({
  clientId,
  clientName
}) => {
  const [editingAgreements, setEditingAgreements] = useState<ClientServiceAgreement[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  // Get current client service agreements
  const { data: agreementsData, loading: agreementsLoading, refetch } = useQuery(
    GetClientServiceAgreementsDocument,
    {
      variables: { clientId }
    }
  );

  // Get all available services
  const { data: servicesData, loading: servicesLoading, error: servicesError } = useQuery(
    GetServiceCatalogDocument,
    {
      variables: { 
        isActive: true
      }
    }
  );

  // Log any errors for debugging
  if (servicesError) {
    console.error("GetServiceCatalog query error:", servicesError);
  }

  const [bulkUpdateAgreements] = useMutation(BulkUpdateClientServiceAgreementsDocument);

  const handleStartEdit = () => {
    if (!agreementsData?.clientServiceAgreements || !servicesData?.services) {
      return;
    }

    // Create a map of existing agreements
    const existingAgreements = new Map(
      agreementsData.clientServiceAgreements.map((agreement: any) => [
        agreement.serviceId,
        {
          id: agreement.id,
          service_id: agreement.serviceId,
          service_name: agreement.service?.name || 'Unknown Service',
          standard_rate: agreement.service?.defaultRate || 0,
          custom_rate: agreement.customRate || undefined,
          billing_unit: agreement.service?.billingUnit || 'Per Payroll',
          category: agreement.service?.category || 'Processing',
          billing_frequency: agreement.billingFrequency || 'Per Job',
          is_enabled: agreement.isEnabled || false,
          effective_date: agreement.effectiveDate || new Date().toISOString().split('T')[0]
        }
      ])
    );

    // Create agreements for all services
    const allAgreements = servicesData.services.map((service: any) => {
      const existing = existingAgreements.get(service.id);
      return existing || {
        service_id: service.id,
        service_name: service.name || 'Unknown Service',
        standard_rate: service.defaultRate || 0,
        custom_rate: undefined,
        billing_unit: service.billingUnit || 'Per Payroll',
        category: service.category || 'Processing',
        billing_frequency: 'Per Job',
        is_enabled: false,
        effective_date: new Date().toISOString().split('T')[0]
      };
    });

    setEditingAgreements(allAgreements);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const agreementsToInsert = editingAgreements
        .filter(agreement => agreement.is_enabled)
        .map(agreement => ({
          clientId: clientId,
          serviceId: agreement.service_id,
          customRate: agreement.custom_rate || null,
          billingFrequency: agreement.billing_frequency || 'Per Job',
          effectiveDate: agreement.effective_date || new Date().toISOString().split('T')[0],
          isEnabled: agreement.is_enabled,
          isActive: true,
          startDate: agreement.effective_date || new Date().toISOString().split('T')[0],
          endDate: null
        }));

      await bulkUpdateAgreements({
        variables: {
          clientId,
          agreements: agreementsToInsert
        }
      });

      toast.success('Client service agreements updated successfully');
      setIsEditing(false);
      refetch();
    } catch (error) {
      toast.error('Failed to update service agreements');
      console.error('Service agreements update error:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingAgreements([]);
  };

  const updateAgreement = (serviceId: string, field: keyof ClientServiceAgreement, value: any) => {
    setEditingAgreements(prev =>
      prev.map(agreement =>
        agreement.service_id === serviceId
          ? { ...agreement, [field]: value }
          : agreement
      )
    );
  };

  const getEffectiveRate = (agreement: ClientServiceAgreement) => {
    return agreement.custom_rate ?? agreement.standard_rate;
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

  if (agreementsLoading || servicesLoading) {
    return <div className="text-center py-8">Loading service agreements...</div>;
  }

  if (servicesError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Service Agreements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            <p>Error loading service catalog</p>
            <p className="text-sm text-gray-500 mt-2">Please try refreshing the page</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentAgreements = agreementsData?.clientServiceAgreements || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Service Agreements</CardTitle>
            <CardDescription>
              Configure services and rates for {clientName}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={handleStartEdit}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Agreements
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Select services to enable for this client and configure custom rates if needed.
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Enabled</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Standard Rate</TableHead>
                  <TableHead>Custom Rate</TableHead>
                  <TableHead>Billing Unit</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Effective Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {editingAgreements.map((agreement) => (
                  <TableRow key={agreement.service_id}>
                    <TableCell>
                      <Switch
                        checked={agreement.is_enabled}
                        onCheckedChange={(checked) =>
                          updateAgreement(agreement.service_id, 'is_enabled', checked)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{agreement.service_name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(agreement.category)}>
                        {agreement.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        ${agreement.standard_rate}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={agreement.custom_rate || ''}
                        onChange={(e) =>
                          updateAgreement(
                            agreement.service_id,
                            'custom_rate',
                            e.target.value ? parseFloat(e.target.value) : undefined
                          )
                        }
                        placeholder={`$${agreement.standard_rate}`}
                        disabled={!agreement.is_enabled}
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{agreement.billing_unit}</Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={agreement.billing_frequency}
                        onValueChange={(value) =>
                          updateAgreement(agreement.service_id, 'billing_frequency', value)
                        }
                        disabled={!agreement.is_enabled}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {BILLING_FREQUENCIES.map(frequency => (
                            <SelectItem key={frequency} value={frequency}>
                              {frequency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={agreement.effective_date}
                        onChange={(e) =>
                          updateAgreement(agreement.service_id, 'effective_date', e.target.value)
                        }
                        disabled={!agreement.is_enabled}
                        className="w-36"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div>
            {currentAgreements.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No service agreements configured for this client.</p>
                <p className="text-sm">Click "Edit Agreements" to set up services.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Billing Unit</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Effective Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentAgreements.map((agreement) => (
                    <TableRow key={agreement.id}>
                      <TableCell>
                        <div className="font-medium">
                          {agreement.service?.name || 'Unknown Service'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(agreement.service?.category || 'Processing')}>
                          {agreement.service?.category || 'Processing'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            ${agreement.customRate || agreement.service?.defaultRate}
                          </span>
                          {agreement.customRate && (
                            <Badge variant="secondary" className="text-xs">
                              Custom
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {agreement.service?.billingUnit || 'Per Payroll'}
                        </Badge>
                      </TableCell>
                      <TableCell>{agreement.billingFrequency || 'Per Job'}</TableCell>
                      <TableCell>{agreement.contractStartDate || 'Not set'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};