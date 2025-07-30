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
import { 
  CreateBillingItemDocument, 
  UpdateBillingItemDocument, 
  GetClientsForBillingDocument,
  GetBillingItemsByPayrollDocument
} from '../../graphql/generated/graphql';

const billingItemSchema = z.object({
  description: z.string().min(3, 'Description must be at least 3 characters'),
  unitPrice: z.number().min(0.01, 'Amount must be greater than 0'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  clientId: z.string().min(1, 'Client is required'),
  notes: z.string().optional(),
});

type BillingItemFormData = z.infer<typeof billingItemSchema>;

interface BillingItemFormProps {
  itemId?: string;
}

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
    unitPrice: 0,
    quantity: 1,
    clientId: '',
    notes: '',
  });

  // Get clients for dropdown
  const { data: clientsData, loading: clientsLoading } = useQuery(GetClientsForBillingDocument);
  
  // GraphQL mutations
  const [createBillingItem] = useMutation(CreateBillingItemDocument, {
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Billing item created successfully.',
      });
      router.push('/billing/items');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create billing item: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  const [updateBillingItem] = useMutation(UpdateBillingItemDocument, {
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Billing item updated successfully.',
      });
      router.push('/billing/items');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update billing item: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  const clients = clientsData?.clients || [];

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
      return;
    }

    setIsSubmitting(true);

    try {
      const inputData = {
        description: formData.description,
        unitPrice: formData.unitPrice,
        quantity: formData.quantity,
        clientId: formData.clientId,
        notes: formData.notes || null,
        status: 'draft',
      };

      if (itemId) {
        await updateBillingItem({
          variables: {
            id: itemId,
            updates: inputData
          }
        });
      } else {
        await createBillingItem({
          variables: {
            input: inputData
          }
        });
      }
    } catch (error) {
      // Error handling is done in the mutation's onError callback
      console.error('Form submission error:', error);
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
              disabled={clientsLoading}
            >
              <SelectTrigger className={errors.clientId ? 'border-red-500' : ''}>
                <SelectValue placeholder={clientsLoading ? "Loading clients..." : "Select a client..."} />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unitPrice">Unit Price (AUD) *</Label>
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.unitPrice || ''}
                onChange={(e) => handleInputChange('unitPrice', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className={errors.unitPrice ? 'border-red-500' : ''}
              />
              {errors.unitPrice && (
                <p className="text-sm text-red-600">{errors.unitPrice}</p>
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
          </div>

          {/* Calculated Total */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Total Amount:</span>
              <span className="text-lg font-bold text-gray-900">
                ${(formData.unitPrice * formData.quantity).toFixed(2)} AUD
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {formData.quantity} item{formData.quantity !== 1 ? 's' : ''} × ${formData.unitPrice.toFixed(2)} each
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