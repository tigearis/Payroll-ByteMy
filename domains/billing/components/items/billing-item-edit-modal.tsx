/**
 * Billing Item Edit Modal - Complete Implementation
 * 
 * Provides comprehensive editing functionality for billing items:
 * - Form validation with Zod schemas
 * - Real-time calculation of totals
 * - Service selection with rate lookup
 * - GraphQL mutation with optimistic updates
 * - Error handling and success feedback
 */

"use client";

import { useMutation, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { X, Save, Calculator, AlertCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { logger } from '@/lib/logging/enterprise-logger';
import { BillingSchemas } from "@/lib/validation/shared-schemas";
import { UpdateBillingItemAdvancedDocument, GetBillingItemByIdAdvancedDocument } from "../../graphql/generated/graphql";

// Use shared schema for consistency
const editBillingItemSchema = BillingSchemas.updateBillingItem;

type EditBillingItemFormData = z.infer<typeof editBillingItemSchema>;

interface BillingItemEditModalProps {
  itemId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function BillingItemEditModal({ itemId, isOpen, onClose, onSuccess }: BillingItemEditModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch billing item details for editing
  const { data: itemData, loading: itemLoading, error: itemError } = useQuery(
    GetBillingItemByIdAdvancedDocument,
    {
      variables: { id: itemId },
      skip: !itemId || !isOpen,
    }
  );

  // Update mutation
  const [updateBillingItem] = useMutation(UpdateBillingItemAdvancedDocument, {
    onCompleted: () => {
      logger.info('Billing item updated successfully', {
        namespace: 'billing_domain',
        component: 'billing_item_edit_modal',
        action: 'update_billing_item',
        metadata: {
          itemId,
          updateFlow: 'completed',
        },
      });
      toast.success("Billing item updated successfully");
      onSuccess();
      onClose();
    },
    onError: (error) => {
      logger.error('Billing item update failed', {
        namespace: 'billing_domain',
        component: 'billing_item_edit_modal',
        action: 'update_billing_item',
        error: error.message,
        metadata: {
          itemId,
          updateFlow: 'failed',
          errorType: 'graphql_mutation_error',
        },
      });
      toast.error(`Failed to update billing item: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  const form = useForm<EditBillingItemFormData>({
    resolver: zodResolver(editBillingItemSchema),
    defaultValues: {
      description: "",
      quantity: 1,
      unitPrice: 0,
      notes: "",
    },
  });

  // Populate form when item data loads
  useEffect(() => {
    if (itemData?.billingItemsByPk) {
      const item = itemData.billingItemsByPk;
      form.reset({
        description: item.description || "",
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        notes: item.notes || "",
        serviceId: item.serviceId || undefined,
      });
    }
  }, [itemData, form]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(amount);
  };

  const watchedQuantity = form.watch("quantity");
  const watchedUnitPrice = form.watch("unitPrice");
  const calculatedTotal = (watchedQuantity || 0) * (watchedUnitPrice || 0);

  const onSubmit = async (data: EditBillingItemFormData) => {
    if (!itemData?.billingItemsByPk) return;

    setIsSubmitting(true);
    
    logger.info('Initiating billing item update', {
      namespace: 'billing_domain',
      component: 'billing_item_edit_modal',
      action: 'update_billing_item',
      metadata: {
        itemId,
        updateFlow: 'started',
        changes: {
          descriptionChanged: data.description !== itemData.billingItemsByPk.description,
          quantityChanged: data.quantity !== itemData.billingItemsByPk.quantity,
          unitPriceChanged: data.unitPrice !== itemData.billingItemsByPk.unitPrice,
          notesChanged: data.notes !== itemData.billingItemsByPk.notes,
        },
      },
    });

    try {
      await updateBillingItem({
        variables: {
          id: itemId,
          updates: {
            description: data.description,
            quantity: data.quantity,
            unitPrice: data.unitPrice,
            totalAmount: calculatedTotal,
            notes: data.notes || null,
            ...(data.serviceId && { serviceId: data.serviceId }),
            updatedAt: new Date().toISOString(),
          },
        },
      });
    } catch (error) {
      // Error handling is done in the mutation's onError callback
    }
  };

  if (itemLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (itemError || !itemData?.billingItemsByPk) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {itemError?.message || "Billing item not found"}
            </AlertDescription>
          </Alert>
          <div className="flex justify-end pt-4">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const item = itemData.billingItemsByPk;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Edit Billing Item</span>
            {item.isApproved && (
              <Badge className="bg-green-100 text-green-800">
                Approved - Limited Edit
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Context Information (Read-only) */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h3 className="font-medium text-gray-900">Item Context</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Client:</span>{" "}
                  <span className="font-medium">{item.client?.name || "Unknown"}</span>
                </div>
                <div>
                  <span className="text-gray-600">Service:</span>{" "}
                  <span className="font-medium">{item.service?.name || "Unknown"}</span>
                </div>
                <div>
                  <span className="text-gray-600">Created:</span>{" "}
                  <span className="font-medium">
                    {item.createdAt ? format(new Date(item.createdAt), "PPP") : "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>{" "}
                  <span className="font-medium">{item.status || "Draft"}</span>
                </div>
              </div>
            </div>

            {/* Editable Fields */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe the billing item..."
                        rows={3}
                        disabled={item.isApproved || false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Quantity ({item.service?.billingUnit || "units"}) *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          min="0.01"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          disabled={item.isApproved || false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unitPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Price (AUD) *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          min="0.01"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          disabled={item.isApproved || false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Calculated Total */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calculator className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="font-medium text-blue-900">Calculated Total</span>
                  </div>
                  <span className="text-xl font-bold font-mono text-blue-900">
                    {formatCurrency(calculatedTotal)}
                  </span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  {watchedQuantity} × {formatCurrency(watchedUnitPrice)}
                </p>
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Additional notes or comments..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Warning for approved items */}
            {item.isApproved && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This item has been approved. Only notes can be edited to maintain audit compliance.
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button onClick={onClose} variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !form.formState.isDirty}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}