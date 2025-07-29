'use client';

import { useMutation, useQuery } from '@apollo/client';
import { 
  Building, 
  Calendar, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Edit, 
  FileText, 
  Hash, 
  Trash2, 
  User, 
  AlertTriangle,
  Archive
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';

interface BillingItemDetailsProps {
  itemId: string;
}

// Mock data - will be replaced with GraphQL query
const mockBillingItem = {
  id: '1',
  description: 'Web Development Services - Q1 2024',
  amount: 4500.00,
  quantity: 1,
  unit: 'project',
  status: 'pending',
  client: { 
    id: '1', 
    name: 'Acme Corp',
    email: 'contact@acmecorp.com'
  },
  createdBy: { 
    id: '1', 
    firstName: 'John', 
    lastName: 'Doe',
    email: 'john.doe@company.com'
  },
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
  approvedAt: null,
  approvedBy: null,
  notes: 'Complete redesign of company website including responsive design, new branding implementation, and content management system integration.',
  totalAmount: 4500.00,
};

export function BillingItemDetails({ itemId }: BillingItemDetailsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // In real implementation, this would be a GraphQL query
  const isLoading = false;
  const item = mockBillingItem;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="text-orange-600 border-orange-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending Approval
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="text-green-600 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="text-red-600 border-red-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case 'archived':
        return (
          <Badge variant="outline" className="text-gray-600 border-gray-200">
            <Archive className="w-3 h-3 mr-1" />
            Archived
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      // In real implementation, this would be a GraphQL mutation
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: 'Item Deleted',
        description: 'The billing item has been deleted successfully.',
      });
      
      router.push('/billing/items');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete billing item. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!item) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2 text-gray-800">
            Billing Item Not Found
          </h3>
          <p className="text-gray-600 mb-4">
            The billing item you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/billing/items">
            <Button>Return to Billing Items</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Item Information */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{item.description}</CardTitle>
              <div className="flex items-center space-x-4">
                {getStatusBadge(item.status)}
                <div className="flex items-center text-sm text-gray-500">
                  <Hash className="w-4 h-4 mr-1" />
                  ID: {item.id}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(item.totalAmount)}
              </div>
              <div className="text-sm text-gray-500">
                {item.quantity} {item.unit}{item.quantity !== 1 ? 's' : ''} × {formatCurrency(item.amount)}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Information */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <Building className="w-4 h-4 mr-2" />
                Client Information
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Name:</span>
                  <span className="ml-2">{item.client.name}</span>
                </div>
                <div>
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">
                    <a 
                      href={`mailto:${item.client.email}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {item.client.email}
                    </a>
                  </span>
                </div>
              </div>
            </div>

            {/* Creation Information */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Created By
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Name:</span>
                  <span className="ml-2">{item.createdBy.firstName} {item.createdBy.lastName}</span>
                </div>
                <div>
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">
                    <a 
                      href={`mailto:${item.createdBy.email}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {item.createdBy.email}
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timestamps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <div className="font-medium">Created</div>
                <div className="text-sm text-gray-500">Item was created and submitted</div>
              </div>
              <div className="text-sm text-gray-600">
                {formatDate(item.createdAt)}
              </div>
            </div>
            
            {item.updatedAt !== item.createdAt && (
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <div className="font-medium">Last Updated</div>
                  <div className="text-sm text-gray-500">Item details were modified</div>
                </div>
                <div className="text-sm text-gray-600">
                  {formatDate(item.updatedAt)}
                </div>
              </div>
            )}

            {item.approvedAt && item.approvedBy && (
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="font-medium text-green-700">Approved</div>
                  <div className="text-sm text-gray-500">
                    Approved by {item.approvedBy.firstName} {item.approvedBy.lastName}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {formatDate(item.approvedAt)}
                </div>
              </div>
            )}

            {item.status === 'pending' && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center text-orange-700">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="font-medium">Pending Approval</span>
                </div>
                <p className="text-sm text-orange-600 mt-1">
                  This item is waiting for manager approval before it can be included in invoices.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {item.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">{item.notes}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Link href={`/billing/items/${itemId}/edit`}>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Item
              </Button>
            </Link>
            
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Billing Item</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this billing item? This action cannot be undone.
                    The item will be permanently removed from the system.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteDialogOpen(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Item'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}