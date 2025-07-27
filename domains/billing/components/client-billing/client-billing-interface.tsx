'use client';

import { useQuery, useMutation } from '@apollo/client';
import { Plus, Clock, DollarSign, Save, Check, X } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import {
  GetClientServiceAgreementsDocument,
  GetServiceCatalogDocument,
  CreateBillingItemDocument,
  CreateTimeEntryDocument,
} from '../../graphql/generated/graphql';
import { TimeEntryModal } from '../time-tracking/time-entry-modal';

interface BillingItem {
  id?: string;
  billingPlanId?: string;
  serviceName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  notes: string;
  isCustom: boolean;
  selected: boolean;
}

interface ClientBillingInterfaceProps {
  clientId: string;
  onBillingCompleted?: () => void;
}

export const ClientBillingInterface: React.FC<ClientBillingInterfaceProps> = ({
  clientId,
  onBillingCompleted
}) => {
  const [billingItems, setBillingItems] = useState<BillingItem[]>([]);
  const [showServiceCatalog, setShowServiceCatalog] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [timeEntries, setTimeEntries] = useState<any[]>([]);
  const [totalHours, setTotalHours] = useState(0);

  // Custom billing item form
  const [customItem, setCustomItem] = useState({
    serviceName: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    notes: ''
  });

  // Get client service agreements for service catalog
  const { data: serviceAgreements, loading: agreementsLoading } = useQuery(
    GetClientServiceAgreementsDocument,
    {
      variables: { clientId }
    }
  );

  // Get full service catalog for adding new services
  const { data: serviceCatalog, loading: catalogLoading } = useQuery(
    GetServiceCatalogDocument,
    {
      variables: { isActive: true }
    }
  );

  // Mutations
  const [createBillingItem] = useMutation(CreateBillingItemDocument);
  const [createTimeEntry] = useMutation(CreateTimeEntryDocument);

  const clientServices = serviceAgreements?.clientBillingAssignments || [];
  const availableServices = serviceCatalog?.billingPlans || [];

  // Add custom billing item
  const addCustomItem = () => {
    if (!customItem.serviceName || !customItem.description || customItem.unitPrice <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newItem: BillingItem = {
      serviceName: customItem.serviceName,
      description: customItem.description,
      quantity: customItem.quantity,
      unitPrice: customItem.unitPrice,
      amount: customItem.quantity * customItem.unitPrice,
      notes: customItem.notes,
      isCustom: true,
      selected: true
    };

    setBillingItems(prev => [...prev, newItem]);
    
    // Reset form
    setCustomItem({
      serviceName: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      notes: ''
    });

    toast.success('Custom billing item added');
  };

  // Add service from catalog
  const addServiceFromCatalog = (service: any) => {
    // Check if this service is already added
    const exists = billingItems.some(item => 
      item.billingPlanId === service.id || 
      (item.serviceName === service.name && !item.isCustom)
    );

    if (exists) {
      toast.error('This service is already added');
      return;
    }

    const newItem: BillingItem = {
      billingPlanId: service.id,
      serviceName: service.name,
      description: service.description || service.name,
      quantity: 1,
      unitPrice: service.standardRate,
      amount: service.standardRate,
      notes: '',
      isCustom: false,
      selected: true
    };

    setBillingItems(prev => [...prev, newItem]);
    toast.success(`Added ${service.name} to billing items`);
  };

  // Update billing item
  const updateBillingItem = (index: number, field: keyof BillingItem, value: any) => {
    setBillingItems(prev =>
      prev.map((item, i) => {
        if (i === index) {
          const updated = { ...item, [field]: value };
          // Recalculate amount if quantity or unit price changed
          if (field === 'quantity' || field === 'unitPrice') {
            updated.amount = updated.quantity * updated.unitPrice;
          }
          return updated;
        }
        return item;
      })
    );
  };

  // Remove billing item
  const removeBillingItem = (index: number) => {
    setBillingItems(prev => prev.filter((_, i) => i !== index));
  };

  // Get selected billing items
  const getSelectedItems = () => {
    return billingItems.filter(item => item.selected);
  };

  // Calculate total
  const calculateTotal = () => {
    return getSelectedItems().reduce((total, item) => total + item.amount, 0);
  };

  // Save billing items
  const handleSaveBilling = async () => {
    const selectedItems = getSelectedItems();
    if (selectedItems.length === 0) {
      toast.error('Please select at least one billing item');
      return;
    }

    try {
      let billingItemsCreated = 0;
      const createdBillingItemIds: string[] = [];

      // Create each billing item
      for (const item of selectedItems) {
        try {
          const result = await createBillingItem({
            variables: {
              input: {
                clientId: clientId,
                billingPlanId: item.billingPlanId || undefined,
                description: item.description,
                serviceName: item.serviceName,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                amount: item.amount,
                notes: item.notes || undefined,
                status: 'draft',
                isApproved: false
              }
            }
          });

          if (result.data?.insertBillingItem?.id) {
            createdBillingItemIds.push(result.data.insertBillingItem.id);
            billingItemsCreated++;
          }
        } catch (itemError) {
          console.error('Failed to create billing item:', itemError);
          toast.error(`Failed to create ${item.serviceName}`);
        }
      }

      // Create time entries if any exist and link them to the first billing item
      let timeEntriesCreated = 0;
      if (timeEntries.length > 0 && createdBillingItemIds.length > 0) {
        const primaryBillingItemId = createdBillingItemIds[0];
        
        for (const timeEntry of timeEntries) {
          try {
            await createTimeEntry({
              variables: {
                input: {
                  clientId: clientId,
                  billingItemId: primaryBillingItemId,
                  workDate: timeEntry.work_date,
                  hoursSpent: timeEntry.hours_spent,
                  description: timeEntry.description,
                  staffUserId: timeEntry.staff_user_id || undefined
                }
              }
            });
            timeEntriesCreated++;
          } catch (timeEntryError) {
            console.error('Failed to create time entry:', timeEntryError);
          }
        }
      }

      const successMessage = timeEntriesCreated > 0 
        ? `Created ${billingItemsCreated} billing items and ${timeEntriesCreated} time entries successfully`
        : `Created ${billingItemsCreated} billing items successfully`;
      
      toast.success(successMessage);
      
      // Clear the form
      setBillingItems([]);
      setTimeEntries([]);
      setTotalHours(0);
      
      onBillingCompleted?.();
    } catch (error) {
      toast.error('Failed to create billing items');
      console.error('Billing creation error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Client Billing</CardTitle>
          <CardDescription>
            Add billing items directly for this client
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Custom Billing Item Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add Custom Billing Item</CardTitle>
          <CardDescription>
            Create a custom billing item for this client
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="serviceName">Service Name</Label>
              <Input
                id="serviceName"
                value={customItem.serviceName}
                onChange={(e) => setCustomItem(prev => ({ ...prev, serviceName: e.target.value }))}
                placeholder="e.g., Consulting Services"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={customItem.description}
                onChange={(e) => setCustomItem(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the service"
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={customItem.quantity}
                onChange={(e) => setCustomItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
              />
            </div>
            <div>
              <Label htmlFor="unitPrice">Unit Price ($)</Label>
              <Input
                id="unitPrice"
                type="number"
                min="0"
                step="0.01"
                value={customItem.unitPrice}
                onChange={(e) => setCustomItem(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={customItem.notes}
                onChange={(e) => setCustomItem(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes about this item"
                rows={2}
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={addCustomItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Item
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowServiceCatalog(!showServiceCatalog)}
            >
              {showServiceCatalog ? 'Hide' : 'Show'} Service Catalog
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Service Catalog */}
      {showServiceCatalog && (
        <Card>
          <CardHeader>
            <CardTitle>Service Catalog</CardTitle>
            <CardDescription>
              Add items from the standard service catalog
            </CardDescription>
          </CardHeader>
          <CardContent>
            {catalogLoading ? (
              <div>Loading services...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableServices.map((service) => (
                  <Card key={service.id} className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{service.name}</h4>
                        <Badge variant="secondary">{service.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{service.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">${service.standardRate} {service.billingUnit}</span>
                        <Button
                          size="sm"
                          onClick={() => addServiceFromCatalog(service)}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Billing Items List */}
      {billingItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Billing Items</CardTitle>
            <CardDescription>
              Review and modify billing items before saving
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Select</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Checkbox
                        checked={item.selected}
                        onCheckedChange={(checked) =>
                          updateBillingItem(index, 'selected', checked)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.serviceName}</div>
                        {item.isCustom && <Badge variant="outline" className="mt-1">Custom</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.description}
                        onChange={(e) =>
                          updateBillingItem(index, 'description', e.target.value)
                        }
                        className="min-w-[200px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateBillingItem(index, 'quantity', parseInt(e.target.value) || 1)
                        }
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateBillingItem(index, 'unitPrice', parseFloat(e.target.value) || 0)
                        }
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">${item.amount.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.notes}
                        onChange={(e) =>
                          updateBillingItem(index, 'notes', e.target.value)
                        }
                        placeholder="Notes..."
                        className="min-w-[150px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBillingItem(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Time Tracking */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Time Tracking</CardTitle>
              <CardDescription>
                Log time spent on work for this client
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

      {/* Summary and Actions */}
      {billingItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Billing Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Selected Items</p>
                  <p className="text-2xl font-bold">{getSelectedItems().length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${calculateTotal().toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Time Logged</p>
                  <p className="text-2xl font-bold">{totalHours.toFixed(1)}h</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Rate</p>
                  <p className="text-2xl font-bold">
                    {totalHours > 0 ? `$${(calculateTotal() / totalHours).toFixed(0)}/h` : '-'}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end gap-4">
                <Button
                  onClick={handleSaveBilling}
                  disabled={getSelectedItems().length === 0}
                  size="lg"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Billing Items
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Time Entry Modal */}
      {showTimeModal && (
        <TimeEntryModal
          payrollId=""
          clientId={clientId}
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