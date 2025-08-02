'use client';

// import { useQuery } from '@apollo/client';
import { TrendingUp, TrendingDown, DollarSign, Clock, Users, FileText } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// TODO: Missing GraphQL operations - using mock data instead:
// GetPayrollProfitabilityDocument -> Not available
// GetStaffBillingPerformanceDocument -> GetStaffAnalyticsPerformanceDocument
// import {
//   GetStaffAnalyticsPerformanceDocument
// } from '../../../billing/graphql/generated/graphql';

interface ProfitabilityDashboardProps {
  clientId?: string;
  staffId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className = ''
}) => {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              {icon}
            </div>
            <div>
              <p className="text-sm text-gray-600">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
              {subtitle && (
                <p className="text-xs text-gray-500">{subtitle}</p>
              )}
            </div>
          </div>
          {trend && (
            <div className={`flex items-center gap-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const ProfitabilityDashboard: React.FC<ProfitabilityDashboardProps> = ({
  clientId,
  staffId,
  dateRange
}) => {
  const [viewMode, setViewMode] = useState<'payrolls' | 'staff' | 'clients'>('payrolls');

  // Mock loading states
  const [payrollLoading, setPayrollLoading] = useState(true);
  const [staffLoading, setStaffLoading] = useState(true);
  
  // Mock data for payroll profitability
  const mockPayrolls = [
    {
      id: 'payroll-1',
      name: 'July 2024 Payroll',
      client: { name: 'ABC Company' },
      billingStatus: 'billed',
      actualRevenue: 1250.00,
      estimatedRevenue: 1200.00,
      actualHours: 8.5,
      estimatedHours: 8.0
    },
    {
      id: 'payroll-2',
      name: 'June 2024 Payroll',
      client: { name: 'XYZ Corp' },
      billingStatus: 'draft',
      actualRevenue: 875.50,
      estimatedRevenue: 900.00,
      actualHours: 6.2,
      estimatedHours: 6.5
    },
    {
      id: 'payroll-3',
      name: 'May 2024 Payroll',
      client: { name: 'Tech Solutions Ltd' },
      billingStatus: 'billed',
      actualRevenue: 2100.00,
      estimatedRevenue: 2050.00,
      actualHours: 12.0,
      estimatedHours: 11.5
    }
  ];

  // Mock data for staff performance
  const mockStaffPerformance = [
    {
      id: 'staff-1',
      firstName: 'John',
      lastName: 'Doe',
      computedName: 'John Doe',
      totalRevenue: {
        aggregate: {
          sum: {
            estimatedRevenue: 3500.00
          }
        }
      },
      totalBilledHours: {
        aggregate: {
          sum: {
            actualHours: 24.5
          }
        }
      }
    },
    {
      id: 'staff-2',
      firstName: 'Jane',
      lastName: 'Smith',
      computedName: 'Jane Smith',
      totalRevenue: {
        aggregate: {
          sum: {
            estimatedRevenue: 2800.00
          }
        }
      },
      totalBilledHours: {
        aggregate: {
          sum: {
            actualHours: 18.2
          }
        }
      }
    }
  ];

  // Mock loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setPayrollLoading(false);
      setStaffLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const payrolls = mockPayrolls;
  const staffPerformance = mockStaffPerformance;
  const payrollError = null;
  const staffError = null;

  // Calculate aggregate metrics
  const calculateAggregateMetrics = () => {
    const totalRevenue = payrolls.reduce((sum: number, p: typeof mockPayrolls[0]) => sum + (p.actualRevenue || p.estimatedRevenue || 0), 0);
    const totalHours = payrolls.reduce((sum: number, p: typeof mockPayrolls[0]) => sum + (p.actualHours || p.estimatedHours || 0), 0);
    const totalPayrolls = payrolls.length;
    const averageRevenuePerHour = totalHours > 0 ? totalRevenue / totalHours : 0;
    const averageRevenuePerPayroll = totalPayrolls > 0 ? totalRevenue / totalPayrolls : 0;

    return {
      totalRevenue,
      totalHours,
      totalPayrolls,
      averageRevenuePerHour,
      averageRevenuePerPayroll
    };
  };

  const metrics = calculateAggregateMetrics();

  const getRevenueColor = (revenue: number) => {
    if (revenue >= 1000) return 'text-green-600';
    if (revenue >= 500) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProfitabilityColor = (revenuePerHour: number) => {
    if (revenuePerHour >= 200) return 'bg-green-100 text-green-800';
    if (revenuePerHour >= 150) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (payrollLoading || staffLoading) {
    return <div className="text-center py-8">Loading profitability data...</div>;
  }

  // Handle GraphQL errors gracefully
  if (payrollError || staffError) {
    return (
      <div className="text-center py-8">
        <div className="text-amber-600 mb-4">
          <h3 className="text-lg font-semibold">Profitability Data Unavailable</h3>
          <p className="text-sm">
            Unable to load profitability analytics. This may be due to:
          </p>
          <ul className="text-sm mt-2 text-left max-w-md mx-auto">
            <li>• Billing analytics tables not yet configured</li>
            <li>• Missing profitability data relationships</li>
            <li>• GraphQL schema incompatibilities</li>
          </ul>
        </div>
        <div className="text-gray-500 text-sm">
          Advanced billing analytics are being set up. Basic billing functionality is available.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Profitability Dashboard</h2>
          <p className="text-gray-600">Real-time insights into billing performance and profitability</p>
        </div>
        <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="payrolls">Payroll Jobs</SelectItem>
            <SelectItem value="staff">Staff Performance</SelectItem>
            <SelectItem value="clients">Client Analysis</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={`$${metrics.totalRevenue.toFixed(2)}`}
          subtitle="All payroll jobs"
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: 12.5, isPositive: true }}
        />
        <MetricCard
          title="Total Hours"
          value={`${metrics.totalHours.toFixed(1)}h`}
          subtitle="Time logged"
          icon={<Clock className="h-5 w-5" />}
          trend={{ value: 8.3, isPositive: true }}
        />
        <MetricCard
          title="Revenue/Hour"
          value={`$${metrics.averageRevenuePerHour.toFixed(0)}`}
          subtitle="Average rate"
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: 5.2, isPositive: true }}
        />
        <MetricCard
          title="Payroll Jobs"
          value={metrics.totalPayrolls}
          subtitle="Completed jobs"
          icon={<FileText className="h-5 w-5" />}
        />
      </div>

      {/* Detailed Views */}
      {viewMode === 'payrolls' && (
        <Card>
          <CardHeader>
            <CardTitle>Payroll Job Profitability</CardTitle>
            <CardDescription>
              Revenue and profitability metrics for individual payroll jobs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payroll Job</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Rev/Hour</TableHead>
                  <TableHead>Billing Items</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrolls.map((payroll: typeof mockPayrolls[0]) => (
                  <TableRow key={payroll.id}>
                    <TableCell>
                      <div className="font-medium">{payroll.name}</div>
                      <div className="text-sm text-gray-500">
                        Payroll details
                      </div>
                    </TableCell>
                    <TableCell>{payroll.client?.name || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={payroll.billingStatus === 'billed' ? 'default' : 'secondary'}>
                        {payroll.billingStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${getRevenueColor(payroll.actualRevenue || payroll.estimatedRevenue || 0)}`}>
                        ${(payroll.actualRevenue || payroll.estimatedRevenue || 0).toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>{(payroll.actualHours || payroll.estimatedHours || 0).toFixed(1)}h</TableCell>
                    <TableCell>
                      <Badge className={getProfitabilityColor(((payroll.actualRevenue || payroll.estimatedRevenue || 0) / (payroll.actualHours || payroll.estimatedHours || 1)))}>
                        ${(((payroll.actualRevenue || payroll.estimatedRevenue || 0) / (payroll.actualHours || payroll.estimatedHours || 1)) || 0).toFixed(0)}/h
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        Billing items
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {viewMode === 'staff' && (
        <Card>
          <CardHeader>
            <CardTitle>Staff Performance</CardTitle>
            <CardDescription>
              Billing performance and efficiency metrics by staff member
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Payrolls Worked</TableHead>
                  <TableHead>Total Revenue</TableHead>
                  <TableHead>Hours Logged</TableHead>
                  <TableHead>Revenue/Hour</TableHead>
                  <TableHead>Billing Items</TableHead>
                  <TableHead>Clients Served</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffPerformance.map((staff: typeof mockStaffPerformance[0]) => (
                  <TableRow key={staff.id}>
                    <TableCell>
                      <div className="font-medium">{staff.computedName || `${staff.firstName} ${staff.lastName}`}</div>
                    </TableCell>
                    <TableCell>N/A</TableCell>
                    <TableCell>
                      <span className={`font-medium ${getRevenueColor(staff.totalRevenue?.aggregate?.sum?.estimatedRevenue || 0)}`}>
                        ${(staff.totalRevenue?.aggregate?.sum?.estimatedRevenue || 0).toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>{(staff.totalBilledHours?.aggregate?.sum?.actualHours || 0).toFixed(1)}h</TableCell>
                    <TableCell>
                      <Badge className={getProfitabilityColor(((staff.totalRevenue?.aggregate?.sum?.estimatedRevenue || 0) / (staff.totalBilledHours?.aggregate?.sum?.actualHours || 1)))}>
                        ${(((staff.totalRevenue?.aggregate?.sum?.estimatedRevenue || 0) / (staff.totalBilledHours?.aggregate?.sum?.actualHours || 1)) || 0).toFixed(0)}/h
                      </Badge>
                    </TableCell>
                    <TableCell>N/A</TableCell>
                    <TableCell>N/A</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {viewMode === 'clients' && (
        <Card>
          <CardHeader>
            <CardTitle>Client Profitability Analysis</CardTitle>
            <CardDescription>
              Revenue and profitability breakdown by client
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Client profitability analysis coming soon</p>
              <p className="text-sm">This will show client lifetime value and profitability metrics</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};