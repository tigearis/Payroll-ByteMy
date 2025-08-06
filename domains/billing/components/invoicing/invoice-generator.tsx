'use client';

import { useQuery, useMutation } from '@apollo/client';
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  Send, 
  Download, 
  Eye, 
  Plus,
  Minus,
  CheckCircle,
  AlertTriangle,
  Clock,
  Save
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
  GetBillingItemsForInvoiceDocument,
  GetClientForInvoiceDocument,
  CreateInvoiceDocument,
  GenerateInvoiceDocument,
  type BillingInvoiceFragmentFragment
} from '../../graphql/generated/graphql';

interface InvoiceItem {
  id?: string;
  billingItemId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  serviceName?: string;
  selected: boolean;
}

interface InvoiceGeneratorProps {
  clientId?: string;
  payrollIds?: string[];
  billingPeriodId?: string;
  onInvoiceGenerated?: (invoiceId: string) => void;
  onClose?: () => void;
}

export const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({
  clientId,
  payrollIds = [],
  billingPeriodId,
  onInvoiceGenerated,
  onClose
}) => {
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [currency, setCurrency] = useState('AUD');
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize invoice date on client side to avoid hydration mismatch
  useEffect(() => {
    if (!invoiceDate) {
      setInvoiceDate(new Date().toISOString().split('T')[0]);
    }
  }, [invoiceDate]);

  // Auto-generate invoice number
  useEffect(() => {
    const generateInvoiceNumber = () => {
      const prefix = 'INV';
      const timestamp = Date.now().toString().slice(-6);
      const clientPrefix = clientId ? clientId.slice(0, 4).toUpperCase() : 'GEN';
      return `${prefix}-${clientPrefix}-${timestamp}`;
    };

    if (!invoiceNumber) {
      setInvoiceNumber(generateInvoiceNumber());
    }
  }, [clientId, invoiceNumber]);

  // Auto-set due date (30 days from invoice date)
  useEffect(() => {
    if (invoiceDate && !dueDate) {
      const date = new Date(invoiceDate);
      date.setDate(date.getDate() + 30);
      setDueDate(date.toISOString().split('T')[0]);
    }
  }, [invoiceDate, dueDate]);

  // Query for billing items to include in invoice
  const { data: billingItemsData, loading: billingItemsLoading } = useQuery(
    GetBillingItemsForInvoiceDocument,
    {
      variables: {
        ...(clientId && { clientId }),
        ...(payrollIds.length > 0 && { payrollIds })
      },
      skip: !clientId && payrollIds.length === 0 && !billingPeriodId
    }
  );

  // Query for client information
  const { data: clientData } = useQuery(GetClientForInvoiceDocument, {
    variables: { clientId: clientId! },
    skip: !clientId
  });

  // Create invoice mutation
  const [createInvoice] = useMutation(CreateInvoiceDocument, {
    onCompleted: (data) => {
      toast.success('Invoice created successfully');
      if (onInvoiceGenerated && data.insertBillingInvoiceOne?.id) {
        onInvoiceGenerated(data.insertBillingInvoiceOne.id);
      }
    },
    onError: (error) => {
      toast.error(`Failed to create invoice: ${error.message}`);
    }
  });

  // Generate invoice PDF mutation
  const [generateInvoicePdf] = useMutation(GenerateInvoiceDocument);

  // Load billing items when data is available
  useEffect(() => {
    if (billingItemsData?.billingItems) {
      const items: InvoiceItem[] = billingItemsData.billingItems.map((item: any) => ({
        id: item.id,
        billingItemId: item.id,
        description: item.description || item.serviceName || 'Service',
        quantity: item.quantity || 1,
        unitPrice: parseFloat(item.unitPrice || item.hourlyRate || '0'),
        amount: parseFloat(item.totalAmount || item.amount || '0'),
        serviceName: item.serviceName,
        selected: true
      }));
      setInvoiceItems(items);
      setSelectedItems(new Set(items.map(item => item.id!)));
    }
  }, [billingItemsData]);

  const handleItemSelection = (itemId: string, selected: boolean) => {
    const newSelected = new Set(selectedItems);
    if (selected) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleItemUpdate = (itemId: string, field: keyof InvoiceItem, value: any) => {
    setInvoiceItems(items => 
      items.map(item => {
        if (item.id === itemId) {
          const updated = { ...item, [field]: value };
          // Recalculate amount if quantity or unitPrice changed
          if (field === 'quantity' || field === 'unitPrice') {
            updated.amount = updated.quantity * updated.unitPrice;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const addCustomItem = () => {
    const newItem: InvoiceItem = {
      id: `custom-${Date.now()}`,
      description: '',
      quantity: 1,
      unitPrice: 0,
      amount: 0,
      selected: true
    };
    setInvoiceItems([...invoiceItems, newItem]);
    setSelectedItems(new Set([...selectedItems, newItem.id!]));
  };

  const removeItem = (itemId: string) => {
    setInvoiceItems(items => items.filter(item => item.id !== itemId));
    setSelectedItems(new Set([...selectedItems].filter(id => id !== itemId)));
  };

  const calculateTotals = () => {
    const selectedInvoiceItems = invoiceItems.filter(item => selectedItems.has(item.id!));
    const subtotal = selectedInvoiceItems.reduce((sum, item) => sum + item.amount, 0);
    const gst = subtotal * 0.1; // 10% GST for Australia
    const total = subtotal + gst;

    return { subtotal, gst, total, itemCount: selectedInvoiceItems.length };
  };

  const handleGenerateInvoice = async () => {
    try {
      setIsGenerating(true);

      const selectedInvoiceItems = invoiceItems.filter(item => selectedItems.has(item.id!));
      
      if (selectedInvoiceItems.length === 0) {
        toast.error('Please select at least one item for the invoice');
        return;
      }

      const { total } = calculateTotals();

      // Create the invoice
      const invoiceResult = await createInvoice({
        variables: {
          input: {
            invoiceNumber,
            ...(clientId && { clientId }),
            ...(billingPeriodId && { billingPeriodId }),
            issuedDate: invoiceDate,
            dueDate,
            totalAmount: total,
            currency,
            notes,
            status: 'draft',
            payrollCount: payrollIds.length,
            totalHours: selectedInvoiceItems.reduce((sum, item) => 
              sum + (item.serviceName?.includes('hour') ? item.quantity : 0), 0
            )
          }
        }
      });

      if (invoiceResult.data?.insertBillingInvoiceOne?.id) {
        // Create invoice items
        for (const item of selectedInvoiceItems) {
          // This would be handled by a separate mutation or within the same transaction
        }

        setShowPreview(false);
        if (onClose) onClose();
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const { subtotal, gst, total, itemCount } = calculateTotals();

  if (billingItemsLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <Clock className="w-6 h-6 mr-2 animate-spin" />
            Loading billing items...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Invoice Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Generate Invoice
          </CardTitle>
          <CardDescription>
            Create a new invoice from selected billing items
            {clientData?.clientsByPk?.name && ` for ${clientData.clientsByPk.name}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoice-number">Invoice Number</Label>
              <Input
                id="invoice-number"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="INV-001"
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="NZD">NZD - New Zealand Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoice-date">Invoice Date</Label>
              <Input
                id="invoice-date"
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="due-date">Due Date</Label>
              <Input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes or payment terms..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Invoice Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Invoice Items</CardTitle>
            <Button onClick={addCustomItem} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Item
            </Button>
          </div>
          <CardDescription>
            Select and configure items to include in this invoice
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invoiceItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No billing items found for the selected criteria</p>
              <Button onClick={addCustomItem} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Custom Item
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedItems.size === invoiceItems.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedItems(new Set(invoiceItems.map(item => item.id!)));
                        } else {
                          setSelectedItems(new Set());
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-24">Quantity</TableHead>
                  <TableHead className="w-32">Unit Price</TableHead>
                  <TableHead className="w-32">Amount</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.has(item.id!)}
                        onCheckedChange={(checked) => 
                          handleItemSelection(item.id!, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.description}
                        onChange={(e) => handleItemUpdate(item.id!, 'description', e.target.value)}
                        placeholder="Service description"
                      />
                      {item.serviceName && (
                        <Badge variant="secondary" className="mt-1">
                          {item.serviceName}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemUpdate(item.id!, 'quantity', parseInt(e.target.value) || 0)}
                        min="0"
                        step="1"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => handleItemUpdate(item.id!, 'unitPrice', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        ${item.amount.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {!item.billingItemId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id!)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Invoice Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Items ({itemCount})</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (10%)</span>
              <span>${gst.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)} {currency}</span>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button 
              onClick={() => setShowPreview(true)}
              variant="outline"
              disabled={itemCount === 0}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button 
              onClick={handleGenerateInvoice}
              disabled={itemCount === 0 || isGenerating}
            >
              {isGenerating ? (
                <Clock className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Generate Invoice
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Invoice Preview</DialogTitle>
            <DialogDescription>
              Review the invoice before generating
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Invoice header preview */}
            <div className="border rounded-lg p-6 bg-gray-50">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold">INVOICE</h1>
                  <p className="text-gray-600">{invoiceNumber}</p>
                </div>
                <div className="text-right">
                  <p><strong>Date:</strong> {invoiceDate}</p>
                  <p><strong>Due:</strong> {dueDate}</p>
                </div>
              </div>

              {clientData?.clientsByPk && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Bill To:</h3>
                  <p>{clientData.clientsByPk.name}</p>
                  {clientData.clientsByPk.contactPerson && (
                    <p>{clientData.clientsByPk.contactPerson}</p>
                  )}
                  {clientData.clientsByPk.contactEmail && (
                    <p>{clientData.clientsByPk.contactEmail}</p>
                  )}
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoiceItems
                    .filter(item => selectedItems.has(item.id!))
                    .map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell>${item.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (10%):</span>
                  <span>${gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>${total.toFixed(2)} {currency}</span>
                </div>
              </div>

              {notes && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Notes:</h4>
                  <p className="text-gray-700">{notes}</p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close Preview
            </Button>
            <Button onClick={handleGenerateInvoice} disabled={isGenerating}>
              {isGenerating ? (
                <Clock className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Generate Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};