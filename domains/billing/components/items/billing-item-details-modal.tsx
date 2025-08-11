/**
 * Billing Item Details Modal - Complete Implementation
 * 
 * Provides comprehensive view of billing item details with:
 * - Complete billing information display
 * - Client and payroll context
 * - Service details and rates
 * - Approval history and notes
 * - Audit trail information
 */

"use client";

import { format } from "date-fns";
import { X, Building2, User, Clock, DollarSign, FileText, CheckCircle } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface BillingItemDetailsModalProps {
  item: {
    id: string;
    description?: string | null;
    amount?: number | null;
    quantity: number;
    unitPrice: number;
    status?: string | null;
    isApproved?: boolean | null;
    createdAt?: string | null;
    approvalDate?: string | null;
    notes?: string | null;
    client?: {
      id: string;
      name?: string | null;
      contactEmail?: string | null;
    } | null;
    service?: {
      id: string;
      name?: string | null;
      category?: string | null;
      billingUnit?: string | null;
    } | null;
    staffUser?: {
      id: string;
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
    } | null;
    payroll?: {
      id: string;
      name?: string | null;
    } | null;
    approvedByUser?: {
      id: string;
      firstName?: string | null;
      lastName?: string | null;
    } | null;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function BillingItemDetailsModal({ item, isOpen, onClose }: BillingItemDetailsModalProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(amount);
  };

  const getStatusBadge = () => {
    if (item.isApproved) {
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      );
    }
    
    switch (item.status?.toLowerCase()) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            <X className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {item.status || "Draft"}
          </Badge>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Billing Item Details</span>
            {getStatusBadge()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Item ID</label>
              <p className="font-mono text-sm">{item.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Created Date</label>
              <p>{item.createdAt ? format(new Date(item.createdAt), "PPP") : "—"}</p>
            </div>
          </div>

          <Separator />

          {/* Service Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Service Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Service</label>
                <p className="font-medium">{item.service?.name || "Unknown Service"}</p>
                <p className="text-sm text-gray-500">{item.service?.category}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Billing Unit</label>
                <p>{item.service?.billingUnit || "units"}</p>
              </div>
            </div>
            {item.description && (
              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="text-sm">{item.description}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Financial Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Financial Details
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Quantity</label>
                <p className="text-lg font-semibold">
                  {item.quantity} {item.service?.billingUnit || "units"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Unit Rate</label>
                <p className="text-lg font-semibold font-mono">
                  {formatCurrency(item.unitPrice)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Total Amount</label>
                <p className="text-xl font-bold font-mono text-green-700">
                  {item.amount ? formatCurrency(item.amount) : formatCurrency(item.quantity * item.unitPrice)}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Client and Payroll Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Context Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Client</label>
                <div className="flex items-center mt-1">
                  <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                  <div>
                    <p className="font-medium">{item.client?.name || "Unknown Client"}</p>
                    {item.client?.contactEmail && (
                      <p className="text-sm text-gray-500">{item.client.contactEmail}</p>
                    )}
                  </div>
                </div>
              </div>
              {item.payroll && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Payroll</label>
                  <p className="font-medium">{item.payroll.name}</p>
                </div>
              )}
            </div>

            {item.staffUser && (
              <div>
                <label className="text-sm font-medium text-gray-600">Staff Member</label>
                <div className="flex items-center mt-1">
                  <User className="w-4 h-4 mr-2 text-gray-400" />
                  <div>
                    <p className="font-medium">
                      {item.staffUser.firstName} {item.staffUser.lastName}
                    </p>
                    {item.staffUser.email && (
                      <p className="text-sm text-gray-500">{item.staffUser.email}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Approval Information */}
          {(item.isApproved || item.approvalDate || item.approvedByUser) && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Approval Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  {item.approvalDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Approval Date</label>
                      <p>{format(new Date(item.approvalDate), "PPP 'at' p")}</p>
                    </div>
                  )}
                  {item.approvedByUser && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Approved By</label>
                      <p className="font-medium">
                        {item.approvedByUser.firstName} {item.approvedByUser.lastName}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Notes */}
          {item.notes && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Notes</h3>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{item.notes}</p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}