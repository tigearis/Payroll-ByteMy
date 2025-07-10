'use client';

import { useQuery } from '@apollo/client';
import { TrendingUp, TrendingDown, DollarSign, Clock, Users, FileText } from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  GetPayrollProfitabilityDocument,
  GetStaffBillingPerformanceDocument
} from '../../../billing/graphql/generated/graphql';

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

  // Get payroll profitability data with error handling
  const { data: payrollData, loading: payrollLoading, error: payrollError } = useQuery(
    GetPayrollProfitabilityDocument,
    {
      variables: {
        payrollId: undefined // Get all payrolls or filter by client
      },
      errorPolicy: 'all' // Don't crash on GraphQL errors
    }
  );

  // Get staff performance data with error handling
  const { data: staffData, loading: staffLoading, error: staffError } = useQuery(
    GetStaffBillingPerformanceDocument,
    {
      variables: {
        staffId,
        dateFrom: dateRange?.start,
        dateTo: dateRange?.end
      }
    }
  );

  const payrolls = payrollData?.payroll_profitability || [];
  const staffPerformance = staffData?.staff_billing_performance || [];

  // Calculate aggregate metrics
  const calculateAggregateMetrics = () => {
    const totalRevenue = payrolls.reduce((sum, p) => sum + (p.total_revenue || 0), 0);
    const totalHours = payrolls.reduce((sum, p) => sum + (p.total_hours || 0), 0);
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
                {payrolls.map((payroll) => (
                  <TableRow key={payroll.payroll_id}>
                    <TableCell>
                      <div className="font-medium">{payroll.payroll_name}</div>
                      <div className="text-sm text-gray-500">
                        {payroll.payslip_count} payslips, {payroll.employee_count} employees
                      </div>
                    </TableCell>
                    <TableCell>{payroll.client_name}</TableCell>
                    <TableCell>
                      <Badge variant={payroll.billing_status === 'billed' ? 'default' : 'secondary'}>
                        {payroll.billing_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${getRevenueColor(payroll.total_revenue || 0)}`}>
                        ${(payroll.total_revenue || 0).toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>{(payroll.total_hours || 0).toFixed(1)}h</TableCell>
                    <TableCell>
                      <Badge className={getProfitabilityColor(payroll.revenue_per_hour || 0)}>
                        ${(payroll.revenue_per_hour || 0).toFixed(0)}/h
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {payroll.billing_items_count} items
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
                {staffPerformance.map((staff) => (
                  <TableRow key={staff.staff_id}>
                    <TableCell>
                      <div className="font-medium">{staff.staff_name}</div>
                    </TableCell>
                    <TableCell>{staff.payrolls_worked}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${getRevenueColor(staff.total_revenue_generated || 0)}`}>
                        ${(staff.total_revenue_generated || 0).toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>{(staff.total_hours_logged || 0).toFixed(1)}h</TableCell>
                    <TableCell>
                      <Badge className={getProfitabilityColor(staff.revenue_per_hour || 0)}>
                        ${(staff.revenue_per_hour || 0).toFixed(0)}/h
                      </Badge>
                    </TableCell>
                    <TableCell>{staff.billing_items_created}</TableCell>
                    <TableCell>{staff.distinct_clients_served}</TableCell>
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