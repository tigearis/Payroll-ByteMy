'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Users, 
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Target,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download
} from 'lucide-react';

// GraphQL Queries
const GET_COST_REVENUE_ANALYTICS = gql`
  query GetCostRevenueAnalytics(
    $startDate: date!
    $endDate: date!
    $clientId: uuid
    $userId: uuid
    $limit: Int = 100
  ) {
    payrollCostAnalysis(
      where: {
        completedAt: { _gte: $startDate, _lte: $endDate }
        clientId: { _eq: $clientId }
      }
      orderBy: { completedAt: DESC }
      limit: $limit
    ) {
      payrollDateId
      payrollId
      payrollName
      clientId
      clientName
      billingMonth
      payrollDateStatus
      completedAt
      completedBy
      totalTimeMinutes
      totalHours
      totalInternalCost
      uniqueUsersWorked
      totalRevenue
      billingItemsCount
      estimatedProfit
      profitMarginPercentage
      revenuePerHour
      costPerHour
    }
    
    userProductivityAnalysis(
      where: {
        userId: { _eq: $userId }
      }
      orderBy: { revenuePerHour30d: DESC }
      limit: 50
    ) {
      userId
      firstName
      lastName
      computedName
      defaultHourlyRate
      costCenter
      billingCategory
      totalHoursLast30Days
      totalInternalCost30d
      payrollDatesWorked30d
      totalRevenueGenerated30d
      revenuePerHour30d
      profitGenerated30d
      efficiencyRatio30d
    }
    
    monthlyBillingDashboard(
      where: {
        billingMonth: { _gte: $startDate, _lte: $endDate }
        clientId: { _eq: $clientId }
      }
      orderBy: { billingMonth: DESC }
      limit: 12
    ) {
      id
      clientId
      clientName
      billingMonth
      totalPayrolls
      completedPayrolls
      totalPayrollDates
      completedPayrollDates
      status
      billingReadyAt
      billingGeneratedAt
      completionPercentage
      billingItemsCount
      totalBillingAmount
      activeServiceAgreements
    }
    
    clients(
      where: { active: { _eq: true } }
      orderBy: { name: ASC }
    ) {
      id
      name
    }
    
    users(
      where: { active: { _eq: true } }
      orderBy: { computedName: ASC }
    ) {
      id
      computedName
      defaultHourlyRate
      costCenter
      billingCategory
    }
  }
`;

interface PayrollCostAnalysis {
  payrollDateId: string;
  payrollId: string;
  payrollName: string;
  clientId: string;
  clientName: string;
  billingMonth: string;
  payrollDateStatus: string;
  completedAt: string;
  completedBy: string;
  totalTimeMinutes: number;
  totalHours: number;
  totalInternalCost: number;
  uniqueUsersWorked: number;
  totalRevenue: number;
  billingItemsCount: number;
  estimatedProfit: number;
  profitMarginPercentage: number;
  revenuePerHour: number;
  costPerHour: number;
}

interface UserProductivityAnalysis {
  userId: string;
  firstName: string;
  lastName: string;
  computedName: string;
  defaultHourlyRate: number;
  costCenter?: string;
  billingCategory: string;
  totalHoursLast30Days: number;
  totalInternalCost30d: number;
  payrollDatesWorked30d: number;
  totalRevenueGenerated30d: number;
  revenuePerHour30d: number;
  profitGenerated30d: number;
  efficiencyRatio30d: number;
}

interface MonthlyBillingDashboard {
  id: string;
  clientId: string;
  clientName: string;
  billingMonth: string;
  totalPayrolls: number;
  completedPayrolls: number;
  totalPayrollDates: number;
  completedPayrollDates: number;
  status: string;
  billingReadyAt?: string;
  billingGeneratedAt?: string;
  completionPercentage: number;
  billingItemsCount: number;
  totalBillingAmount: number;
  activeServiceAgreements: number;
}

interface FilterState {
  startDate: string;
  endDate: string;
  clientId: string;
  userId: string;
  timeRange: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const CostRevenueAnalyticsDashboard: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    clientId: '',
    userId: '',
    timeRange: '30d'
  });

  const { data, loading, error, refetch } = useQuery(GET_COST_REVENUE_ANALYTICS, {
    variables: {
      startDate: filters.startDate,
      endDate: filters.endDate,
      clientId: filters.clientId || undefined,
      userId: filters.userId || undefined
    },
    fetchPolicy: 'cache-and-network'
  });

  const payrollAnalysis = data?.payrollCostAnalysis || [];
  const userProductivity = data?.userProductivityAnalysis || [];
  const monthlyDashboard = data?.monthlyBillingDashboard || [];
  const clients = data?.clients || [];
  const users = data?.users || [];

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const totalRevenue = payrollAnalysis.reduce((sum: number, item: PayrollCostAnalysis) => sum + item.totalRevenue, 0);
    const totalCost = payrollAnalysis.reduce((sum: number, item: PayrollCostAnalysis) => sum + item.totalInternalCost, 0);
    const totalProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    const totalHours = payrollAnalysis.reduce((sum: number, item: PayrollCostAnalysis) => sum + item.totalHours, 0);
    const averageRevenuePerHour = totalHours > 0 ? totalRevenue / totalHours : 0;
    const averageCostPerHour = totalHours > 0 ? totalCost / totalHours : 0;
    const totalPayrolls = payrollAnalysis.length;
    const uniqueClients = new Set(payrollAnalysis.map((item: PayrollCostAnalysis) => item.clientId)).size;

    return {
      totalRevenue,
      totalCost,
      totalProfit,
      profitMargin,
      totalHours,
      averageRevenuePerHour,
      averageCostPerHour,
      totalPayrolls,
      uniqueClients
    };
  }, [payrollAnalysis]);

  // Prepare chart data
  const monthlyTrendData = useMemo(() => {
    const monthlyData = new Map();
    
    payrollAnalysis.forEach((item: PayrollCostAnalysis) => {
      const month = new Date(item.completedAt).toLocaleDateString('en-AU', { 
        month: 'short', 
        year: 'numeric' 
      });
      
      if (!monthlyData.has(month)) {
        monthlyData.set(month, {
          month,
          revenue: 0,
          cost: 0,
          profit: 0,
          hours: 0,
          payrolls: 0
        });
      }
      
      const current = monthlyData.get(month);
      current.revenue += item.totalRevenue;
      current.cost += item.totalInternalCost;
      current.profit += item.estimatedProfit;
      current.hours += item.totalHours;
      current.payrolls += 1;
    });
    
    return Array.from(monthlyData.values()).sort((a, b) => 
      new Date(a.month).getTime() - new Date(b.month).getTime()
    );
  }, [payrollAnalysis]);

  const clientProfitabilityData = useMemo(() => {
    const clientData = new Map();
    
    payrollAnalysis.forEach((item: PayrollCostAnalysis) => {
      if (!clientData.has(item.clientId)) {
        clientData.set(item.clientId, {
          clientName: item.clientName,
          revenue: 0,
          cost: 0,
          profit: 0,
          hours: 0,
          payrolls: 0
        });
      }
      
      const current = clientData.get(item.clientId);
      current.revenue += item.totalRevenue;
      current.cost += item.totalInternalCost;
      current.profit += item.estimatedProfit;
      current.hours += item.totalHours;
      current.payrolls += 1;
    });
    
    return Array.from(clientData.values())
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 10);
  }, [payrollAnalysis]);

  const userEfficiencyData = useMemo(() => {
    return userProductivity
      .filter((user: UserProductivityAnalysis) => user.totalHoursLast30Days > 0)
      .map((user: UserProductivityAnalysis) => ({
        name: user.computedName,
        efficiency: user.efficiencyRatio30d,
        revenuePerHour: user.revenuePerHour30d,
        totalHours: user.totalHoursLast30Days,
        totalRevenue: user.totalRevenueGenerated30d,
        category: user.billingCategory
      }))
      .sort((a: any, b: any) => b.efficiency - a.efficiency)
      .slice(0, 15);
  }, [userProductivity]);

  const handleTimeRangeChange = (range: string) => {
    const endDate = new Date();
    let startDate = new Date();
    
    switch (range) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '6m':
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }
    
    setFilters(prev => ({
      ...prev,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      timeRange: range
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4 animate-pulse" />
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load analytics: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Cost vs Revenue Analytics
          </h1>
          <p className="text-gray-600">
            Comprehensive analysis of billing performance and consultant productivity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Label>Time Range:</Label>
              <Select value={filters.timeRange} onValueChange={handleTimeRangeChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="6m">Last 6 months</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Label>Client:</Label>
              <Select value={filters.clientId} onValueChange={(value) => setFilters(prev => ({ ...prev, clientId: value }))}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All clients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All clients</SelectItem>
                  {clients.map((client: any) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Label>User:</Label>
              <Select value={filters.userId} onValueChange={(value) => setFilters(prev => ({ ...prev, userId: value }))}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All users</SelectItem>
                  {users.map((user: any) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.computedName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Label>From:</Label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-40"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Label>To:</Label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-40"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(summaryMetrics.totalRevenue)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatCurrency(summaryMetrics.averageRevenuePerHour)}/hour
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(summaryMetrics.totalCost)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatCurrency(summaryMetrics.averageCostPerHour)}/hour
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Profit</p>
                <p className={`text-2xl font-bold ${summaryMetrics.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(summaryMetrics.totalProfit)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatPercentage(summaryMetrics.profitMargin)} margin
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Activity</p>
                <p className="text-2xl font-bold">{summaryMetrics.totalPayrolls}</p>
                <p className="text-xs text-gray-500">
                  {summaryMetrics.uniqueClients} clients • {summaryMetrics.totalHours.toFixed(1)}h
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="clients">Client Analysis</TabsTrigger>
          <TabsTrigger value="users">User Performance</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Cost Trend</CardTitle>
              <CardDescription>Monthly comparison of revenue, costs, and profit</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="Revenue" />
                  <Line type="monotone" dataKey="cost" stroke="#F59E0B" strokeWidth={2} name="Cost" />
                  <Line type="monotone" dataKey="profit" stroke="#3B82F6" strokeWidth={2} name="Profit" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Hours and Payrolls Trend</CardTitle>
              <CardDescription>Monthly workload and volume metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="hours" fill="#8884d8" name="Hours" />
                  <Bar dataKey="payrolls" fill="#82ca9d" name="Payrolls" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Profitability Analysis</CardTitle>
              <CardDescription>Top 10 clients by profit contribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clientProfitabilityData.map((client: any, index: number) => {
                  const profitMargin = client.revenue > 0 ? (client.profit / client.revenue) * 100 : 0;
                  return (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{client.clientName}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span>{client.payrolls} payrolls</span>
                          <span>{client.hours.toFixed(1)} hours</span>
                          <span>{formatPercentage(profitMargin)} margin</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Revenue:</span>
                          <span className="font-medium">{formatCurrency(client.revenue)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Profit:</span>
                          <span className={`font-medium ${client.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(client.profit)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Client Revenue Distribution</CardTitle>
              <CardDescription>Revenue breakdown by top clients</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={clientProfitabilityData.slice(0, 8)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.clientName} (${((entry.percent || 0) * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="revenue"
                  >
                    {clientProfitabilityData.slice(0, 8).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Efficiency Analysis</CardTitle>
              <CardDescription>Top performing consultants by efficiency ratio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userEfficiencyData.map((user: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Badge variant="outline" className="text-xs">
                            {user.category}
                          </Badge>
                          <span>{user.totalHours.toFixed(1)}h</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Efficiency:</span>
                        <span className="font-medium">{formatPercentage(user.efficiency)}</span>
                        {user.efficiency >= 100 ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">{formatCurrency(user.revenuePerHour)}/h</span>
                        <span className="text-gray-500">•</span>
                        <span className="font-medium">{formatCurrency(user.totalRevenue)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>User Performance Comparison</CardTitle>
              <CardDescription>Revenue per hour comparison across consultants</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userEfficiencyData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="revenuePerHour" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {monthlyDashboard.map((month: MonthlyBillingDashboard) => (
              <Card key={month.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{month.clientName}</CardTitle>
                  <CardDescription>
                    {new Date(month.billingMonth).toLocaleDateString('en-AU', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Completion</span>
                      <span>{formatPercentage(month.completionPercentage)}</span>
                    </div>
                    <Progress value={month.completionPercentage} className="mt-1" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Payrolls:</span>
                      <p className="font-medium">{month.completedPayrolls}/{month.totalPayrolls}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Dates:</span>
                      <p className="font-medium">{month.completedPayrollDates}/{month.totalPayrollDates}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Revenue:</span>
                      <p className="font-medium">{formatCurrency(month.totalBillingAmount)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Items:</span>
                      <p className="font-medium">{month.billingItemsCount}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={month.status === 'billed' ? 'default' : 'outline'}
                    >
                      {month.status.replace('_', ' ')}
                    </Badge>
                    {month.status === 'billed' && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  
                  {month.billingReadyAt && (
                    <p className="text-xs text-gray-500">
                      Ready: {new Date(month.billingReadyAt).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CostRevenueAnalyticsDashboard;