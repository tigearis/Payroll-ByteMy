'use client';

import { useQuery } from '@apollo/client';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  FileText, 
  Clock,
  Target,
  BarChart3,
  PieChart,
  Download,
  Filter,
  Calendar,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  GetFinancialPerformanceDataDocument,
  GetRevenueAnalyticsDocument,
  GetClientProfitabilityDocument,
  type FinancialKpiFragment
} from '../../graphql/generated/graphql';

interface FinancialPerformanceDashboardProps {
  dateRange?: {
    start: string;
    end: string;
  };
  clientId?: string;
  showFilters?: boolean;
}

interface KpiCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  description?: string;
}

export const FinancialPerformanceDashboard: React.FC<FinancialPerformanceDashboardProps> = ({
  dateRange = {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  },
  clientId,
  showFilters = true
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [comparisonPeriod, setComparisonPeriod] = useState('previous');

  // Calculate comparison period
  const getComparisonPeriod = () => {
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    const diffTime = end.getTime() - start.getTime();
    
    const comparisonEnd = new Date(start.getTime() - 1);
    const comparisonStart = new Date(comparisonEnd.getTime() - diffTime);
    
    return {
      start: comparisonStart.toISOString().split('T')[0],
      end: comparisonEnd.toISOString().split('T')[0]
    };
  };

  const comparison = getComparisonPeriod();

  // Query for financial performance data
  const { data: performanceData, loading: performanceLoading } = useQuery(
    GetFinancialPerformanceDataDocument,
    {
      variables: {
        startDate: dateRange.start,
        endDate: dateRange.end,
        comparisonStart: comparison.start,
        comparisonEnd: comparison.end,
        clientId
      }
    }
  );

  // Query for revenue analytics
  const { data: revenueData, loading: revenueLoading } = useQuery(
    GetRevenueAnalyticsDocument,
    {
      variables: {
        startDate: dateRange.start,
        endDate: dateRange.end,
        clientId
      }
    }
  );

  // Query for client profitability
  const { data: profitabilityData, loading: profitabilityLoading } = useQuery(
    GetClientProfitabilityDocument,
    {
      variables: {
        startDate: dateRange.start,
        endDate: dateRange.end,
        limit: 10
      }
    }
  );

  // Calculate KPIs
  const kpis = useMemo(() => {
    if (!performanceData) return [];

    const current = performanceData.currentPeriod;
    const previous = performanceData.previousPeriod;

    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD'
      }).format(amount);
    };

    const cards: KpiCard[] = [
      {
        title: 'Total Revenue',
        value: formatCurrency(current?.totalRevenue || 0),
        change: calculateChange(current?.totalRevenue || 0, previous?.totalRevenue || 0),
        changeType: current?.totalRevenue >= previous?.totalRevenue ? 'positive' : 'negative',
        icon: <DollarSign className="w-6 h-6" />,
        description: 'Total invoiced amount'
      },
      {
        title: 'Gross Profit',
        value: formatCurrency(current?.grossProfit || 0),
        change: calculateChange(current?.grossProfit || 0, previous?.grossProfit || 0),
        changeType: current?.grossProfit >= previous?.grossProfit ? 'positive' : 'negative',
        icon: <TrendingUp className="w-6 h-6" />,
        description: 'Revenue minus direct costs'
      },
      {
        title: 'Profit Margin',
        value: `${((current?.grossProfit || 0) / (current?.totalRevenue || 1) * 100).toFixed(1)}%`,
        change: calculateChange(
          (current?.grossProfit || 0) / (current?.totalRevenue || 1),
          (previous?.grossProfit || 0) / (previous?.totalRevenue || 1)
        ),
        changeType: (current?.grossProfit || 0) / (current?.totalRevenue || 1) >= 
                   (previous?.grossProfit || 0) / (previous?.totalRevenue || 1) ? 'positive' : 'negative',
        icon: <Target className="w-6 h-6" />,
        description: 'Profitability percentage'
      },
      {
        title: 'Active Clients',
        value: current?.activeClients || 0,
        change: calculateChange(current?.activeClients || 0, previous?.activeClients || 0),
        changeType: current?.activeClients >= previous?.activeClients ? 'positive' : 'negative',
        icon: <Users className="w-6 h-6" />,
        description: 'Clients with active billing'
      },
      {
        title: 'Invoices Generated',
        value: current?.invoiceCount || 0,
        change: calculateChange(current?.invoiceCount || 0, previous?.invoiceCount || 0),
        changeType: current?.invoiceCount >= previous?.invoiceCount ? 'positive' : 'negative',
        icon: <FileText className="w-6 h-6" />,
        description: 'Total invoices issued'
      },
      {
        title: 'Avg Collection Time',
        value: `${current?.avgCollectionDays || 0} days`,
        change: calculateChange(previous?.avgCollectionDays || 0, current?.avgCollectionDays || 0), // Reversed for collection time
        changeType: (current?.avgCollectionDays || 0) <= (previous?.avgCollectionDays || 0) ? 'positive' : 'negative',
        icon: <Clock className="w-6 h-6" />,
        description: 'Average payment collection time'
      }
    ];

    return cards;
  }, [performanceData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'positive': return <TrendingUp className="w-4 h-4" />;
      case 'negative': return <TrendingDown className="w-4 h-4" />;
      default: return null;
    }
  };

  if (performanceLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
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
      {/* Filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Period:</span>
              </div>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Compare to:</span>
              </div>
              <Select value={comparisonPeriod} onValueChange={setComparisonPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="previous">Previous period</SelectItem>
                  <SelectItem value="year-ago">Year ago</SelectItem>
                  <SelectItem value="budget">Budget target</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    {kpi.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                    <p className="text-2xl font-bold">{kpi.value}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className={`flex items-center gap-1 text-sm ${getChangeColor(kpi.changeType)}`}>
                  {getChangeIcon(kpi.changeType)}
                  <span>{Math.abs(kpi.change).toFixed(1)}%</span>
                </div>
                <span className="text-xs text-gray-500">vs prev period</span>
              </div>
              
              {kpi.description && (
                <p className="text-xs text-gray-500 mt-2">{kpi.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Revenue Overview</TabsTrigger>
          <TabsTrigger value="clients">Client Analysis</TabsTrigger>
          <TabsTrigger value="services">Service Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends & Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly revenue performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Revenue trend chart</p>
                    <p className="text-sm">Interactive chart showing monthly revenue patterns</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Service Type</CardTitle>
                <CardDescription>Breakdown of revenue by billing categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueData?.serviceBreakdown?.map((service: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full bg-blue-${(index + 1) * 100}`}></div>
                        <span className="text-sm font-medium">{service.serviceName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {formatCurrency(service.revenue)}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {((service.revenue / (revenueData?.totalRevenue || 1)) * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      <PieChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Service breakdown chart</p>
                      <p className="text-sm">Revenue distribution by service categories</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Clients</CardTitle>
                <CardDescription>Clients by revenue contribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profitabilityData?.topClients?.map((client: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-gray-600">{client.invoiceCount} invoices</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(client.revenue)}</p>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${
                            client.profitMargin > 30 ? 'bg-green-500' :
                            client.profitMargin > 20 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                          <span className="text-sm text-gray-600">{client.profitMargin}% margin</span>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Client performance analysis</p>
                      <p className="text-sm">Revenue and profitability by client</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Client Health Metrics</CardTitle>
                <CardDescription>Client satisfaction and payment patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Payment Performance</span>
                    <div className="flex items-center gap-2">
                      <Progress value={87} className="w-20" />
                      <span className="text-sm text-gray-600">87%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Client Retention</span>
                    <div className="flex items-center gap-2">
                      <Progress value={94} className="w-20" />
                      <span className="text-sm text-gray-600">94%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Billing Accuracy</span>
                    <div className="flex items-center gap-2">
                      <Progress value={98} className="w-20" />
                      <span className="text-sm text-gray-600">98%</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="flex items-center justify-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Healthy</span>
                        </div>
                        <p className="text-2xl font-bold">{profitabilityData?.healthyClients || 0}</p>
                        <p className="text-xs text-gray-600">clients</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1 text-yellow-600">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm font-medium">At Risk</span>
                        </div>
                        <p className="text-2xl font-bold">{profitabilityData?.atRiskClients || 0}</p>
                        <p className="text-xs text-gray-600">clients</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Service Performance Analysis</CardTitle>
              <CardDescription>Revenue and profitability by service categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Service performance analytics</p>
                <p className="text-sm">Detailed analysis of service profitability and demand</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Trends & Forecasting</CardTitle>
              <CardDescription>Predictive analytics and business intelligence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Predictive analytics dashboard</p>
                <p className="text-sm">AI-powered forecasting and trend analysis</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};