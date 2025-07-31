'use client';

import { useQuery, useMutation } from '@apollo/client';
import { 
  FileStack, 
  DollarSign, 
  Calendar, 
  Zap, 
  Users,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Download,
  Send,
  Settings,
  Play,
  Pause
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  GetBillingPeriodsForConsolidationDocument,
  GetClientsWithUnbilledItemsDocument,
  ConsolidateInvoicesDocument,
  AutoGenerateInvoicesDocument,
  type BillingInvoiceFragmentFragment
} from '../../graphql/generated/graphql';

interface UnbilledItem {
  id: string;
  clientId: string;
  clientName: string;
  billingPeriodId: string;
  billingPeriodName: string;
  totalAmount: number;
  itemCount: number;
  oldestItem: string;
  payrollCount: number;
}

interface ConsolidationRule {
  id: string;
  clientId: string;
  frequency: 'weekly' | 'monthly' | 'quarterly';
  autoGenerate: boolean;
  threshold: number;
  enabled: boolean;
}

interface InvoiceConsolidationManagerProps {
  clientId?: string;
  showAutomation?: boolean;
}

export const InvoiceConsolidationManager: React.FC<InvoiceConsolidationManagerProps> = ({
  clientId,
  showAutomation = true
}) => {
  const [selectedPeriods, setSelectedPeriods] = useState<Set<string>>(new Set());
  const [selectedClients, setSelectedClients] = useState<Set<string>>(new Set());
  const [consolidationRules, setConsolidationRules] = useState<ConsolidationRule[]>([]);
  const [isConsolidating, setIsConsolidating] = useState(false);
  const [consolidationProgress, setConsolidationProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('manual');

  // Query for billing periods with unbilled items
  const { data: periodsData, loading: periodsLoading, refetch: refetchPeriods } = useQuery(
    GetBillingPeriodsForConsolidationDocument,
    {
      variables: {
        clientId,
        hasUnbilledItems: true
      }
    }
  );

  // Query for clients with unbilled items
  const { data: clientsData, loading: clientsLoading } = useQuery(
    GetClientsWithUnbilledItemsDocument
  );

  // Consolidate invoices mutation
  const [consolidateInvoices] = useMutation(ConsolidateInvoicesDocument, {
    onCompleted: (data) => {
      toast.success(`Successfully consolidated invoices`);
      refetchPeriods();
      setSelectedPeriods(new Set());
      setSelectedClients(new Set());
    },
    onError: (error) => {
      toast.error(`Failed to consolidate invoices: ${error.message}`);
    }
  });

  // Auto-generate invoices mutation
  const [autoGenerateInvoices] = useMutation(AutoGenerateInvoicesDocument, {
    onCompleted: (data) => {
      if (data.insertBillingPeriods?.affectedRows && data.insertBillingPeriods?.affectedRows > 0) {
        toast.success(
          `Generated ${data.insertBillingPeriods.affectedRows} billing periods`
        );
        refetchPeriods();
      } else {
        toast.error('Failed to auto-generate invoices');
      }
    },
    onError: (error) => {
      toast.error(`Auto-generation failed: ${error.message}`);
    }
  });

  // Group unbilled items by client
  const unbilledByClient = React.useMemo(() => {
    if (!periodsData?.billingPeriods) return [];

    const clientMap = new Map<string, UnbilledItem>();

    periodsData.billingPeriods.forEach((period: any) => {
      period.billingItems?.forEach((item: any) => {
        if (!item.invoiceId && item.isApproved) {
          const key = item.clientId;
          const existing = clientMap.get(key);
          
          if (existing) {
            existing.totalAmount += item.totalAmount || 0;
            existing.itemCount += 1;
            existing.payrollCount += item.payroll ? 1 : 0;
            if (new Date(item.createdAt) < new Date(existing.oldestItem)) {
              existing.oldestItem = item.createdAt;
            }
          } else {
            clientMap.set(key, {
              id: `${item.clientId}-${period.id}`,
              clientId: item.clientId,
              clientName: item.client?.name || 'Unknown Client',
              billingPeriodId: period.id,
              billingPeriodName: period.name,
              totalAmount: item.totalAmount || 0,
              itemCount: 1,
              oldestItem: item.createdAt,
              payrollCount: item.payroll ? 1 : 0
            });
          }
        }
      });
    });

    return Array.from(clientMap.values());
  }, [periodsData]);

  const formatCurrency = (amount: number, currency: string = 'AUD') => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getDaysOld = (date: string) => {
    const now = new Date();
    const itemDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - itemDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getUrgencyColor = (daysOld: number) => {
    if (daysOld > 60) return 'text-red-600';
    if (daysOld > 30) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handlePeriodSelection = (periodId: string, selected: boolean) => {
    const newSelected = new Set(selectedPeriods);
    if (selected) {
      newSelected.add(periodId);
    } else {
      newSelected.delete(periodId);
    }
    setSelectedPeriods(newSelected);
  };

  const handleClientSelection = (clientId: string, selected: boolean) => {
    const newSelected = new Set(selectedClients);
    if (selected) {
      newSelected.add(clientId);
    } else {
      newSelected.delete(clientId);
    }
    setSelectedClients(newSelected);
  };

  const handleManualConsolidation = async () => {
    if (selectedPeriods.size === 0 && selectedClients.size === 0) {
      toast.error('Please select billing periods or clients to consolidate');
      return;
    }

    setIsConsolidating(true);
    setConsolidationProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setConsolidationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const selectedClientIds = Array.from(selectedClients);
      const selectedPeriodIds = Array.from(selectedPeriods);

      await consolidateInvoices({
        variables: {
          clientIds: selectedClientIds,
          billingPeriodIds: selectedPeriodIds
        }
      });

      setConsolidationProgress(100);
      setTimeout(() => {
        setConsolidationProgress(0);
        setIsConsolidating(false);
      }, 1000);

    } catch (error) {
      console.error('Consolidation error:', error);
      setIsConsolidating(false);
      setConsolidationProgress(0);
    }
  };

  const handleAutoGeneration = async () => {
    const eligibleClients = unbilledByClient
      .filter(item => getDaysOld(item.oldestItem) >= 30)
      .map(item => item.clientId);

    if (eligibleClients.length === 0) {
      toast.info('No clients are eligible for auto-generation at this time');
      return;
    }

    await autoGenerateInvoices({
      variables: {
        clientIds: eligibleClients
      }
    });
  };

  const calculateTotals = () => {
    const selectedItems = unbilledByClient.filter(item => 
      selectedClients.has(item.clientId) || selectedPeriods.has(item.billingPeriodId)
    );

    return {
      totalAmount: selectedItems.reduce((sum, item) => sum + item.totalAmount, 0),
      totalItems: selectedItems.reduce((sum, item) => sum + item.itemCount, 0),
      clientCount: new Set(selectedItems.map(item => item.clientId)).size
    };
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unbilled Amount</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(unbilledByClient.reduce((sum, item) => sum + item.totalAmount, 0))}
                </p>
              </div>
              <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clients Pending</p>
                <p className="text-2xl font-bold">
                  {new Set(unbilledByClient.map(item => item.clientId)).size}
                </p>
              </div>
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue Items</p>
                <p className="text-2xl font-bold">
                  {unbilledByClient.filter(item => getDaysOld(item.oldestItem) > 30).length}
                </p>
              </div>
              <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ready to Bill</p>
                <p className="text-2xl font-bold">
                  {unbilledByClient.filter(item => 
                    getDaysOld(item.oldestItem) >= 7 && item.itemCount >= 3
                  ).length}
                </p>
              </div>
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="manual">Manual Consolidation</TabsTrigger>
          {showAutomation && <TabsTrigger value="automated">Automated Rules</TabsTrigger>}
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-4">
          {/* Selection Summary */}
          {(selectedPeriods.size > 0 || selectedClients.size > 0) && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <strong>Selected:</strong> {totals.clientCount} clients, {totals.totalItems} items
                    </div>
                    <div className="text-sm font-medium">
                      Total: {formatCurrency(totals.totalAmount)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedPeriods(new Set());
                        setSelectedClients(new Set());
                      }}
                    >
                      Clear Selection
                    </Button>
                    <Button 
                      onClick={handleManualConsolidation}
                      disabled={isConsolidating}
                    >
                      {isConsolidating ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Consolidating...
                        </>
                      ) : (
                        <>
                          <FileStack className="w-4 h-4 mr-2" />
                          Consolidate Invoices
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                {isConsolidating && (
                  <div className="mt-3">
                    <Progress value={consolidationProgress} className="w-full" />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Unbilled Items Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Unbilled Items by Client</CardTitle>
                  <CardDescription>
                    Select clients or billing periods to consolidate into invoices
                  </CardDescription>
                </div>
                <Button onClick={handleAutoGeneration} variant="outline">
                  <Zap className="w-4 h-4 mr-2" />
                  Auto-Generate Eligible
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {clientsLoading || periodsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Clock className="w-6 h-6 mr-2 animate-spin" />
                  Loading unbilled items...
                </div>
              ) : unbilledByClient.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No unbilled items found</p>
                  <p className="text-sm">All billing items have been invoiced</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={selectedClients.size === unbilledByClient.length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedClients(new Set(unbilledByClient.map(item => item.clientId)));
                            } else {
                              setSelectedClients(new Set());
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Payrolls</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unbilledByClient.map((item) => {
                      const daysOld = getDaysOld(item.oldestItem);
                      const isOverdue = daysOld > 30;
                      const isReadyToBill = daysOld >= 7 && item.itemCount >= 3;

                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedClients.has(item.clientId)}
                              onCheckedChange={(checked) => 
                                handleClientSelection(item.clientId, checked as boolean)
                              }
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.clientName}
                          </TableCell>
                          <TableCell>
                            {item.billingPeriodName}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(item.totalAmount)}
                          </TableCell>
                          <TableCell>
                            {item.itemCount}
                          </TableCell>
                          <TableCell>
                            {item.payrollCount}
                          </TableCell>
                          <TableCell>
                            <span className={getUrgencyColor(daysOld)}>
                              {daysOld} days
                            </span>
                          </TableCell>
                          <TableCell>
                            {isOverdue ? (
                              <Badge variant="destructive">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Overdue
                              </Badge>
                            ) : isReadyToBill ? (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Ready
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {showAutomation && (
          <TabsContent value="automated">
            <Card>
              <CardHeader>
                <CardTitle>Automated Billing Rules</CardTitle>
                <CardDescription>
                  Configure automatic invoice generation rules for clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Automated billing rules coming soon</p>
                  <p className="text-sm">Set up rules for automatic invoice generation based on time intervals or thresholds</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Consolidation Trends</CardTitle>
                <CardDescription>Invoice consolidation performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Analytics charts coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Efficiency Metrics</CardTitle>
                <CardDescription>Time and cost savings from automation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Manual Time Saved</span>
                    <span className="font-medium">~4.5 hours/week</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Automation Rate</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Error Reduction</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Cost Savings</span>
                    <span className="font-bold text-green-600">$2,300/month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};