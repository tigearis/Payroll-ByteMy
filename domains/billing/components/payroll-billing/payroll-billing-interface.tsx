'use client';

import { useQuery, useMutation } from '@apollo/client';
import { Clock, DollarSign, Users, FileText, Save, Check } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useDatabaseUserId } from '@/hooks/use-database-user-id';
import { 
  GetPayrollByIdForBillingDocumentDocument,
  GetNewclientServiceAgreementsDocument,
  CreateBillingItemAdvancedDocument
} from '../../graphql/generated/graphql';
import { TimeEntryModal } from '../time-tracking/time-entry-modal';

interface ServiceSelection {
  service_id: string;
  service_name: string;
  billing_unit: string;
  standard_rate: number;
  effective_rate: number;
  auto_quantity: number;
  quantity: number;
  notes: string;
  selected: boolean;
}

interface PayrollBillingInterfaceProps {
  payrollId: string;
  onBillingCompleted?: () => void;
}

export const PayrollBillingInterface: React.FC<PayrollBillingInterfaceProps> = ({
  payrollId,
  onBillingCompleted
}) => {
  const { databaseUserId } = useDatabaseUserId();
  const [serviceSelections, setServiceSelections] = useState<ServiceSelection[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [timeEntries, setTimeEntries] = useState<any[]>([]);

  // Real GraphQL queries - get the specific payroll by ID
  const { data: payrollData, loading: payrollLoading } = useQuery(GetPayrollByIdForBillingDocumentDocument, {
    variables: { payrollId },
    fetchPolicy: "cache-and-network"
  });

  const { data: servicesData, loading: servicesLoading } = useQuery(GetNewclientServiceAgreementsDocument, {
    variables: { 
      ...(payrollData?.payrollsByPk?.clientId && { clientId: payrollData.payrollsByPk.clientId })
    },
    skip: !payrollData?.payrollsByPk?.clientId,
    fetchPolicy: "cache-and-network"
  });

  // Real mutation for creating billing items
  const [createBillingItem] = useMutation(CreateBillingItemAdvancedDocument, {
    onCompleted: (data) => {
      toast.success(`Created billing item: ${data.insertBillingItemsOne?.description}`);
      onBillingCompleted?.();
    },
    onError: (error) => {
      toast.error(`Failed to create billing item: ${error.message}`);
    }
  });

  // Get the specific payroll from the single record query
  const payroll = payrollData?.payrollsByPk;
  const clientServices = servicesData?.clientServiceAgreements || [];

  // Calculate auto-quantities based on payroll data and service type
  const calculateAutoQuantity = (billingUnit: string, payrollData: any): number => {
    if (!payrollData) return 1;
    
    switch (billingUnit) {
      case 'Per Payslip':
        // Use employee count as approximation for payslip count
        return payrollData.employeeCount || 0;
      case 'Per Employee':
        return payrollData.employeeCount || 0;
      case 'Per New Employee':
        return payrollData.newEmployees || 0;
      case 'Per Terminated Employee':
        return payrollData.terminatedEmployees || 0;
      case 'Per Payroll':
      case 'Per Month':
      case 'Once Off':
        return 1;
      default:
        return 1;
    }
  };

  // Initialize service selections when data loads
  useEffect(() => {
    if (payroll && clientServices.length > 0) {
      const selections = clientServices.map((serviceAgreement: any) => {
        const serviceData = serviceAgreement.service;
        const effectiveRate = serviceAgreement.customRate || serviceData?.defaultRate || 0;
        const autoQuantity = calculateAutoQuantity(serviceData?.billingUnit || 'hour', payroll);
        return {
          service_id: serviceAgreement.serviceId || serviceData?.id || '',
          service_name: serviceData?.name || 'Unknown Service',
          billing_unit: serviceData?.billingUnit || 'hour',
          standard_rate: serviceData?.defaultRate || 0,
          effective_rate: effectiveRate,
          auto_quantity: autoQuantity,
          quantity: autoQuantity,
          notes: '',
          selected: false
        };
      });
      setServiceSelections(selections);
    }
  }, [payroll, clientServices]);

  const updateServiceSelection = (serviceId: string, field: keyof ServiceSelection, value: any) => {
    setServiceSelections(prev =>
      prev.map(selection =>
        selection.service_id === serviceId
          ? { ...selection, [field]: value }
          : selection
      )
    );
  };

  const getSelectedServices = () => {
    return serviceSelections.filter(selection => selection.selected);
  };

  const calculateTotal = () => {
    return getSelectedServices().reduce(
      (total, selection) => total + (selection.quantity * selection.effective_rate),
      0
    );
  };

  const calculateProfitabilityPreview = () => {
    const totalRevenue = calculateTotal();
    const estimatedCost = totalHours * 150; // Assuming $150/hour average cost
    const profit = totalRevenue - estimatedCost;
    const margin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

    return {
      revenue: totalRevenue,
      cost: estimatedCost,
      profit,
      margin
    };
  };

  const handleSaveBilling = async () => {
    if (!payroll || !databaseUserId) {
      toast.error('Required data not available');
      return;
    }

    const selectedServices = getSelectedServices();
    if (selectedServices.length === 0) {
      toast.error('Please select at least one service');
      return;
    }

    try {
      let createdItemsCount = 0;

      // Create each billing item individually using the real mutation
      for (const selection of selectedServices) {
        const itemData = {
          payrollId: payrollId,
          clientId: payroll.clientId,
          serviceId: selection.service_id,
          description: selection.service_name,
          quantity: selection.quantity,
          unitPrice: selection.effective_rate,
          totalAmount: selection.quantity * selection.effective_rate,
          amount: selection.quantity * selection.effective_rate,
          serviceName: selection.service_name,
          hourlyRate: selection.effective_rate,
          status: 'draft',
          isApproved: false,
          staffUserId: databaseUserId,
          notes: selection.notes || null
        };

        await createBillingItem({
          variables: {
            input: itemData
          }
        });
        
        createdItemsCount++;
      }

      // Note: Time entry creation would need a separate GraphQL operation
      // For now, focusing on billing items creation

      const successMessage = `Created ${createdItemsCount} billing item${createdItemsCount > 1 ? 's' : ''} successfully`;
      toast.success(successMessage);
      
      // Reset selections
      setServiceSelections(prev => prev.map(s => ({ ...s, selected: false })));
      
      onBillingCompleted?.();
    } catch (error) {
      toast.error('Failed to create billing items');
      console.error('Billing creation error:', error);
    }
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

  if (payrollLoading || servicesLoading) {
    return <div className="text-center py-8">Loading billing interface...</div>;
  }

  if (!payroll) {
    return (
      <div className="text-center py-8">
        <div className="text-amber-600 mb-4">
          <h3 className="text-lg font-semibold">Billing Interface Unavailable</h3>
          <p className="text-sm">
            Payroll billing data could not be loaded. This may be due to:
          </p>
          <ul className="text-sm mt-2 text-left max-w-md mx-auto">
            <li>• Missing payroll data</li>
            <li>• Billing tables not yet configured</li>
            <li>• GraphQL schema mismatches</li>
          </ul>
        </div>
        <div className="text-gray-500 text-sm">
          Please contact support if this issue persists.
        </div>
      </div>
    );
  }

  const profitability = calculateProfitabilityPreview();

  return (
    <div className="space-y-6">
      {/* Payroll Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll Job Details</CardTitle>
          <CardDescription>
            Configure billing for {payroll.name} - {payroll.client?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Payslips</p>
                <p className="font-semibold">{payroll.employeeCount || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Employees</p>
                <p className="font-semibold">{payroll.employeeCount || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">New Employees</p>
                <p className="font-semibold">{payroll.newEmployees || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Terminated</p>
                <p className="font-semibold">{payroll.terminatedEmployees || 0}</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Badge variant={payroll.billingStatus === 'ready_to_bill' ? 'default' : 'secondary'}>
              {payroll.billingStatus || 'Pending'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Service Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Service Selection</CardTitle>
          <CardDescription>
            Select services performed for this payroll job
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Select</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceSelections.map((selection) => (
                <TableRow key={selection.service_id}>
                  <TableCell>
                    <Checkbox
                      checked={selection.selected}
                      onCheckedChange={(checked) =>
                        updateServiceSelection(selection.service_id, 'selected', checked)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{selection.service_name}</div>
                      <div className="text-sm text-gray-500">{selection.billing_unit}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor('Processing')}>
                      Processing
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      <span>{selection.effective_rate}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={selection.quantity}
                      onChange={(e) =>
                        updateServiceSelection(
                          selection.service_id,
                          'quantity',
                          parseInt(e.target.value) || 0
                        )
                      }
                      disabled={!selection.selected}
                      className="w-20"
                      min="0"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      ${(selection.quantity * selection.effective_rate).toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Textarea
                      value={selection.notes}
                      onChange={(e) =>
                        updateServiceSelection(selection.service_id, 'notes', e.target.value)
                      }
                      disabled={!selection.selected}
                      placeholder="Additional notes..."
                      rows={1}
                      className="min-h-8"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Time Tracking */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Time Tracking</CardTitle>
              <CardDescription>
                Log time spent on this payroll job for profitability analysis
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowTimeModal(true)}
            >
              <Clock className="h-4 w-4 mr-2" />
              Add Time Entry
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold">{totalHours.toFixed(1)} hours</div>
            <div className="text-sm text-gray-600">
              {timeEntries.length} time entries
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Selected Services</p>
                <p className="text-2xl font-bold">{getSelectedServices().length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${calculateTotal().toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Time Logged</p>
                <p className="text-2xl font-bold">{totalHours.toFixed(1)}h</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Profit Margin</p>
                <p className={`text-2xl font-bold ${profitability.margin > 30 ? 'text-green-600' : 'text-orange-600'}`}>
                  {profitability.margin.toFixed(1)}%
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex justify-end gap-4">
              <Button
                onClick={handleSaveBilling}
                disabled={getSelectedServices().length === 0}
                size="lg"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Billing Items
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Entry Modal */}
      {showTimeModal && (
        <TimeEntryModal
          payrollId={payrollId}
          clientId={payroll.clientId}
          onClose={() => setShowTimeModal(false)}
          onTimeEntriesUpdate={(entries, total) => {
            setTimeEntries(entries);
            setTotalHours(total);
          }}
        />
      )}
    </div>
  );
};