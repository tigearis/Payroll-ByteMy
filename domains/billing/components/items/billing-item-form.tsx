'use client';

import { useMutation, useQuery } from '@apollo/client';
import { ArrowLeft, Save, X, DollarSign, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const billingItemSchema = z.object({
  description: z.string().min(3, 'Description must be at least 3 characters'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unit: z.string().min(1, 'Unit is required'),
  clientId: z.string().min(1, 'Client is required'),
  notes: z.string().optional(),
});

type BillingItemFormData = z.infer<typeof billingItemSchema>;

interface BillingItemFormProps {
  itemId?: string;
}

// Mock clients data - will be replaced with GraphQL query
const mockClients = [
  { id: '1', name: 'Acme Corp' },
  { id: '2', name: 'Tech Solutions Ltd' },
  { id: '3', name: 'Growth Partners' },
  { id: '4', name: 'Digital Dynamics' },
];

// Mock existing item data for editing
const mockBillingItem = {
  id: '1',
  description: 'Web Development Services - Q1 2024',
  amount: 4500.00,
  quantity: 1,
  unit: 'project',
  clientId: '1',
  notes: 'Complete redesign of company website',
};

const commonUnits = [
  'hour',
  'day',
  'week',
  'month',
  'project',
  'item',
  'service',
  'consultation',
];

export function BillingItemForm({ itemId }: BillingItemFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<BillingItemFormData>({
    description: '',
    amount: 0,
    quantity: 1,
    unit: 'hour',
    clientId: '',
    notes: '',
  });

  // Load existing item data if editing
  useEffect(() => {
    if (itemId) {
      // In real implementation, this would be a GraphQL query
      const existingItem = mockBillingItem;
      setFormData({
        description: existingItem.description,
        amount: existingItem.amount,
        quantity: existingItem.quantity,
        unit: existingItem.unit,
        clientId: existingItem.clientId,
        notes: existingItem.notes || '',
      });
    }
  }, [itemId]);

  const handleInputChange = (field: keyof BillingItemFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    try {
      billingItemSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors below and try again.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In real implementation, this would be a GraphQL mutation
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: itemId ? 'Item Updated' : 'Item Created',
        description: itemId 
          ? 'Billing item has been updated successfully.' 
          : 'New billing item has been created successfully.',
      });
      
      router.push('/billing/items');
    } catch (error) {
      toast({
        title: 'Error',
        description: itemId 
          ? 'Failed to update billing item. Please try again.' 
          : 'Failed to create billing item. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(itemId ? `/billing/items/${itemId}` : '/billing/items');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Item Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="e.g., Web Development Services - Q1 2024"
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Client Selection */}
          <div className="space-y-2">
            <Label htmlFor="clientId">Client *</Label>
            <Select
              value={formData.clientId}
              onValueChange={(value) => handleInputChange('clientId', value)}
            >
              <SelectTrigger className={errors.clientId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a client..." />
              </SelectTrigger>
              <SelectContent>
                {mockClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.clientId && (
              <p className="text-sm text-red-600">{errors.clientId}</p>
            )}
          </div>

          {/* Amount and Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (AUD) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount || ''}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className={errors.amount ? 'border-red-500' : ''}
              />
              {errors.amount && (
                <p className="text-sm text-red-600">{errors.amount}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity || ''}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                placeholder="1"
                className={errors.quantity ? 'border-red-500' : ''}
              />
              {errors.quantity && (
                <p className="text-sm text-red-600">{errors.quantity}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => handleInputChange('unit', value)}
              >
                <SelectTrigger className={errors.unit ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select unit..." />
                </SelectTrigger>
                <SelectContent>
                  {commonUnits.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.unit && (
                <p className="text-sm text-red-600">{errors.unit}</p>
              )}
            </div>
          </div>

          {/* Calculated Total */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Total Amount:</span>
              <span className="text-lg font-bold text-gray-900">
                ${(formData.amount * formData.quantity).toFixed(2)} AUD
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {formData.quantity} {formData.unit}{formData.quantity !== 1 ? 's' : ''} × ${formData.amount.toFixed(2)} each
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Additional Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional details about this billing item..."
              rows={4}
            />
            <p className="text-xs text-gray-500">
              These notes will be visible to managers during approval and may be included in invoices.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting 
            ? (itemId ? 'Updating...' : 'Creating...') 
            : (itemId ? 'Update Item' : 'Create Item')
          }
        </Button>
      </div>
    </form>
  );
}