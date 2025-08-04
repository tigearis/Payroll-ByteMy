'use client';

import { useQuery, useMutation } from '@apollo/client';
import { Clock, DollarSign, FileText, Users, Zap, CheckCircle, AlertTriangle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { useDatabaseUserId } from '@/hooks/use-database-user-id';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { 
  GetTimeEntriesByPayrollDocumentDocument,
  GetClientsForBillingItemsAdvancedDocument,
  GetUsersForBillingItemsAdvancedDocument,
  CreateBillingItemAdvancedDocument
} from '../../graphql/generated/graphql';

// Mock types
interface TimeEntry {
  id: string;
  clientId: string;
  staffUserId: string; 
  hoursSpent: number;
  description: string;
  workDate: string;
}

interface Client {
  id: string;
  name: string;
}

interface StaffMember {
  id: string;
  firstName?: string;
  lastName?: string;
  computedName?: string;
}

interface BillingGenerationModalProps {
  payrollId: string;
  payrollName: string;
  onGenerated?: (itemsGenerated: number) => void;
  trigger?: React.ReactNode;
}

interface GenerationStats {
  totalTimeEntries: number;
  totalHours: number;
  estimatedRevenue: number;
  clientsInvolved: number;
  staffInvolved: number;
}

export function BillingGenerationModal({ 
  payrollId, 
  payrollName, 
  onGenerated,
  trigger 
}: BillingGenerationModalProps) {
  const { toast } = useToast();
  const { databaseUserId } = useDatabaseUserId();
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('all');
  const [consolidateByService, setConsolidateByService] = useState(true);
  const [generationResult, setGenerationResult] = useState<{
    itemsGenerated: number;
    totalTimeEntries: number;
  } | null>(null);

  // Real GraphQL queries re-enabled
  const { data: timeEntriesData, loading: timeEntriesLoading, refetch: refetchTimeEntries } = useQuery(
    GetTimeEntriesByPayrollDocumentDocument,
    {
      variables: { payrollId },
      skip: !payrollId,
      fetchPolicy: "cache-and-network",
    }
  );

  const { data: clientsData, loading: clientsLoading } = useQuery(
    GetClientsForBillingItemsAdvancedDocument,
    { fetchPolicy: "cache-and-network" }
  );

  const { data: usersData, loading: usersLoading } = useQuery(
    GetUsersForBillingItemsAdvancedDocument,
    { fetchPolicy: "cache-and-network" }
  );

  const [createBillingItem] = useMutation(CreateBillingItemAdvancedDocument, {
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Billing item created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create billing item: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Process real data from GraphQL queries
  const timeEntries = timeEntriesData?.timeEntries || [];
  const clients = clientsData?.clients || [];
  const staffMembers = usersData?.users || [];
  
  // Use all time entries (no need to filter by processing status for now)
  const availableTimeEntries = timeEntries;

  // Calculate generation statistics using real data
  const stats: GenerationStats = React.useMemo(() => {
    let filteredEntries = availableTimeEntries;
    
    if (selectedClientId !== 'all') {
      filteredEntries = filteredEntries.filter((entry: any) => entry.clientId === selectedClientId);
    }
    
    if (selectedStaffId !== 'all') {
      filteredEntries = filteredEntries.filter((entry: any) => entry.staffUserId === selectedStaffId);
    }

    const totalHours = filteredEntries.reduce((sum: number, entry: any) => sum + (entry.hoursSpent || 0), 0);
    const estimatedRevenue = totalHours * 150; // Default hourly rate
    const clientsInvolved = new Set(filteredEntries.map((entry: any) => entry.clientId)).size;
    const staffInvolved = new Set(filteredEntries.map((entry: any) => entry.staffUserId)).size;

    return {
      totalTimeEntries: filteredEntries.length,
      totalHours,
      estimatedRevenue,
      clientsInvolved,
      staffInvolved
    };
  }, [availableTimeEntries, selectedClientId, selectedStaffId]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationResult(null);

    try {
      const response = await fetch('/api/billing/generate-from-time', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payrollId,
          clientId: selectedClientId !== 'all' ? selectedClientId : undefined,
          staffUserId: selectedStaffId !== 'all' ? selectedStaffId : undefined,
          consolidateByService
        }),
      });

      const result = await response.json();

      if (result.success) {
        setGenerationResult(result.data);
        toast({
          title: 'Success',
          description: `Generated ${result.data.itemsGenerated} billing items from ${result.data.totalTimeEntries} time entries.`,
        });
        onGenerated?.(result.data.itemsGenerated);
      } else {
        throw new Error(result.error || 'Failed to generate billing items');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate billing items',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setGenerationResult(null);
    setSelectedClientId('all');
    setSelectedStaffId('all');
    setConsolidateByService(true);
  };

  // Get unique staff members who have time entries for this payroll
  const payrollStaffMembers = React.useMemo(() => {
    const staffIds = new Set(availableTimeEntries.map((entry: any) => entry.staffUserId));
    return staffMembers.filter((staff: any) => staffIds.has(staff.id));
  }, [availableTimeEntries, staffMembers]);

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Zap className="w-4 h-4 mr-2" />
      Generate Billing
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Generate Billing Items
          </DialogTitle>
          <DialogDescription>
            Convert time entries from <strong>{payrollName}</strong> into billing items
          </DialogDescription>
        </DialogHeader>

        {generationResult ? (
          // Success Result View
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Billing items generated successfully!</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {generationResult.itemsGenerated}
                  </div>
                  <div className="text-sm text-gray-600">Items Generated</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {generationResult.totalTimeEntries}
                  </div>
                  <div className="text-sm text-gray-600">Time Entries Processed</div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleClose} className="flex-1">
                Done
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.open('/billing/items', '_blank')}
              >
                View Items
              </Button>
            </div>
          </div>
        ) : (
          // Generation Configuration View
          <div className="space-y-6">
            {/* Time Entries Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Time Entries Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(timeEntriesLoading || clientsLoading || usersLoading) ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : timeEntries.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                    <p>No time entries found for this payroll</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{stats.totalTimeEntries}</div>
                      <div className="text-sm text-gray-600">Time Entries</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{stats.totalHours.toFixed(1)}h</div>
                      <div className="text-sm text-gray-600">Total Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{stats.clientsInvolved}</div>
                      <div className="text-sm text-gray-600">Clients</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{formatCurrency(stats.estimatedRevenue)}</div>
                      <div className="text-sm text-gray-600">Est. Revenue</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Generation Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Client Filter</Label>
                    <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Clients</SelectItem>
                        {clients.map((client: Client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Staff Filter</Label>
                    <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Staff</SelectItem>
                        {payrollStaffMembers.map((staff: any) => (
                          <SelectItem key={staff.id} value={staff.id}>
                            {staff.computedName || `${staff.firstName} ${staff.lastName}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="consolidate"
                    checked={consolidateByService}
                    onCheckedChange={setConsolidateByService}
                  />
                  <Label htmlFor="consolidate" className="text-sm">
                    Consolidate by service type
                  </Label>
                </div>
                <p className="text-xs text-gray-500">
                  {consolidateByService 
                    ? 'Group multiple time entries into consolidated billing items by service'
                    : 'Create individual billing items for each time entry'
                  }
                </p>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || stats.totalTimeEntries === 0}
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate {stats.totalTimeEntries} Items
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}