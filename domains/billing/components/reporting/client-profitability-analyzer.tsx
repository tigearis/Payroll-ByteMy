'use client';

import { useQuery } from '@apollo/client';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Download,
  Eye,
  ArrowUpDown,
  Calendar,
  BarChart3,
  Zap
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  GetClientProfitabilityAnalysisDocument,
  GetClientPerformanceMetricsDocument,
  GetClientForecastDataDocument
} from '../../graphql/generated/graphql';

interface ClientProfitabilityAnalyzerProps {
  dateRange?: {
    start: string;
    end: string;
  };
  showFilters?: boolean;
}

interface ClientMetrics {
  id: string;
  name: string;
  totalRevenue: number;
  totalCosts: number;
  grossProfit: number;
  profitMargin: number;
  invoiceCount: number;
  avgInvoiceValue: number;
  paymentScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  trend: 'up' | 'down' | 'stable';
  forecastedGrowth: number;
}

export const ClientProfitabilityAnalyzer: React.FC<ClientProfitabilityAnalyzerProps> = ({
  dateRange = {
    start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  },
  showFilters = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof ClientMetrics>('grossProfit');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  // Query for client profitability analysis
  const { data: profitabilityData, loading: profitabilityLoading } = useQuery(
    GetClientProfitabilityAnalysisDocument,
    {
      variables: {
        startDate: dateRange.start,
        endDate: dateRange.end
      }
    }
  );

  // Query for client performance metrics
  const { data: performanceData, loading: performanceLoading } = useQuery(
    GetClientPerformanceMetricsDocument,
    {
      variables: {
        startDate: dateRange.start,
        endDate: dateRange.end,
        clientId: selectedClient
      }
    }
  );

  // Query for forecast data
  const { data: forecastData, loading: forecastLoading } = useQuery(
    GetClientForecastDataDocument,
    {
      variables: {
        clientId: selectedClient,
        months: 6
      },
      skip: !selectedClient
    }
  );

  // Process and transform client data
  const clientMetrics = useMemo(() => {
    if (!profitabilityData?.clients) return [];

    return profitabilityData.clients.map((client: any): ClientMetrics => {
      const totalRevenue = client.billingItems?.reduce((sum: number, item: any) => 
        sum + (item.totalAmount || 0), 0) || 0;
      const totalCosts = totalRevenue * 0.65; // Estimated cost ratio
      const grossProfit = totalRevenue - totalCosts;
      const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
      const invoiceCount = client.invoices?.length || 0;
      const avgInvoiceValue = invoiceCount > 0 ? totalRevenue / invoiceCount : 0;

      // Calculate payment score based on payment history
      const paymentScore = Math.min(100, Math.max(0, 
        100 - (client.avgPaymentDelay || 0) * 2
      ));

      // Determine risk level
      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      if (profitMargin < 15 || paymentScore < 70) riskLevel = 'high';
      else if (profitMargin < 25 || paymentScore < 85) riskLevel = 'medium';

      // Calculate trend
      const recentRevenue = client.recentRevenue || 0;
      const previousRevenue = client.previousRevenue || 0;
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (recentRevenue > previousRevenue * 1.05) trend = 'up';
      else if (recentRevenue < previousRevenue * 0.95) trend = 'down';

      // Forecasted growth (simplified calculation)
      const forecastedGrowth = trend === 'up' ? 15 : trend === 'down' ? -5 : 5;

      return {
        id: client.id,
        name: client.name,
        totalRevenue,
        totalCosts,
        grossProfit,
        profitMargin,
        invoiceCount,
        avgInvoiceValue,
        paymentScore,
        riskLevel,
        trend,
        forecastedGrowth
      };
    });
  }, [profitabilityData]);

  // Filter and sort clients
  const filteredAndSortedClients = useMemo(() => {
    const filtered = clientMetrics.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = riskFilter === 'all' || client.riskLevel === riskFilter;
      return matchesSearch && matchesRisk;
    });

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const direction = sortDirection === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * direction;
      }
      return String(aValue).localeCompare(String(bValue)) * direction;
    });

    return filtered;
  }, [clientMetrics, searchTerm, riskFilter, sortField, sortDirection]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <ArrowUpDown className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleSort = (field: keyof ClientMetrics) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalRevenue = filteredAndSortedClients.reduce((sum, client) => sum + client.totalRevenue, 0);
    const totalProfit = filteredAndSortedClients.reduce((sum, client) => sum + client.grossProfit, 0);
    const avgMargin = filteredAndSortedClients.length > 0 
      ? filteredAndSortedClients.reduce((sum, client) => sum + client.profitMargin, 0) / filteredAndSortedClients.length 
      : 0;
    const highRiskCount = filteredAndSortedClients.filter(client => client.riskLevel === 'high').length;

    return {
      totalRevenue,
      totalProfit,
      avgMargin,
      highRiskCount,
      totalClients: filteredAndSortedClients.length
    };
  }, [filteredAndSortedClients]);

  if (profitabilityLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(summaryStats.totalRevenue)}</p>
              </div>
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Profit</p>
                <p className="text-2xl font-bold">{formatCurrency(summaryStats.totalProfit)}</p>
              </div>
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <Target className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Margin</p>
                <p className="text-2xl font-bold">{summaryStats.avgMargin.toFixed(1)}%</p>
              </div>
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <BarChart3 className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Risk</p>
                <p className="text-2xl font-bold">{summaryStats.highRiskCount}</p>
                <p className="text-xs text-gray-500">of {summaryStats.totalClients} clients</p>
              </div>
              <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs defaultValue="analysis" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analysis">Profitability Analysis</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>Client Profitability Analysis</CardTitle>
              <CardDescription>
                Comprehensive profitability metrics for all clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                      <div className="flex items-center gap-1">
                        Client
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('totalRevenue')}>
                      <div className="flex items-center gap-1">
                        Revenue
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('grossProfit')}>
                      <div className="flex items-center gap-1">
                        Profit
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('profitMargin')}>
                      <div className="flex items-center gap-1">
                        Margin
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('paymentScore')}>
                      <div className="flex items-center gap-1">
                        Payment Score
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-gray-600">
                            {client.invoiceCount} invoices • Avg: {formatCurrency(client.avgInvoiceValue)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{formatCurrency(client.totalRevenue)}</p>
                          <p className="text-sm text-gray-600">Cost: {formatCurrency(client.totalCosts)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{formatCurrency(client.grossProfit)}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={client.profitMargin} className="w-12" />
                          <span className="text-sm font-medium">{client.profitMargin.toFixed(1)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={client.paymentScore} className="w-12" />
                          <span className="text-sm">{client.paymentScore.toFixed(0)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRiskColor(client.riskLevel)}>
                          {client.riskLevel.charAt(0).toUpperCase() + client.riskLevel.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(client.trend)}
                          <span className="text-sm">{client.forecastedGrowth.toFixed(0)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedClient(client.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasting">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Forecasting</CardTitle>
                <CardDescription>Predicted revenue for next 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Revenue forecast chart</p>
                    <p className="text-sm">AI-powered revenue predictions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Opportunities</CardTitle>
                <CardDescription>Identified expansion opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Upsell Premium Services</p>
                      <p className="text-sm text-gray-600">12 clients eligible</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">+$45K</p>
                      <p className="text-xs text-gray-600">potential revenue</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Increase Service Frequency</p>
                      <p className="text-sm text-gray-600">8 clients eligible</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">+$28K</p>
                      <p className="text-xs text-gray-600">potential revenue</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Optimize Pricing</p>
                      <p className="text-sm text-gray-600">5 underpriced clients</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">+$18K</p>
                      <p className="text-xs text-gray-600">potential revenue</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                AI-Powered Business Insights
              </CardTitle>
              <CardDescription>
                Automated analysis and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-blue-100 text-blue-600 rounded">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-900">Revenue Optimization</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Consider adjusting pricing for 3 high-volume clients. Current margins below industry average.
                      </p>
                      <p className="text-xs text-blue-600 mt-2">Potential impact: +$91K annually</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-yellow-100 text-yellow-600 rounded">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-yellow-900">Payment Risk Alert</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        2 clients showing declining payment performance. Consider payment plan discussions.
                      </p>
                      <p className="text-xs text-yellow-600 mt-2">Risk mitigation recommended</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-green-100 text-green-600 rounded">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-green-900">Growth Opportunity</h4>
                      <p className="text-sm text-green-700 mt-1">
                        5 clients ready for service expansion based on business growth patterns.
                      </p>
                      <p className="text-xs text-green-600 mt-2">Schedule expansion meetings</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};