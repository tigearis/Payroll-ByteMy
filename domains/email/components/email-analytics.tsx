'use client';

// Email Analytics Component
// Security Classification: HIGH - Email performance and delivery analytics
// SOC2 Compliance: Email delivery audit and compliance reporting

import { useQuery } from '@apollo/client';
import { 
  Mail,
  Send,
  CheckCircle,
  XCircle,
  Eye,
  BarChart3,
  TrendingUp,
  Clock,
  Users,
  Calendar,
  Activity,
  Loader2
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  GetEmailAnalyticsDocument,
  GetRecentEmailActivityDocument,
  GetEmailSendLogsDocument,
  type GetEmailAnalyticsQuery,
  type GetRecentEmailActivityQuery,
  type GetEmailSendLogsQuery
} from '../graphql/generated/graphql';
import type { EmailCategory } from '../types';
import { EMAIL_CATEGORIES } from '../types/template-types';

interface EmailAnalyticsProps {
  timeRange?: '7d' | '30d' | '90d' | '1y';
  userId?: string;
  category?: EmailCategory;
  className?: string;
}

interface AnalyticsMetric {
  label: string;
  value: number;
  change?: number;
  icon: React.ReactNode;
  color: string;
}

export function EmailAnalytics({ 
  timeRange = '30d', 
  userId,
  category,
  className 
}: EmailAnalyticsProps) {
  // State
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [selectedCategory, setSelectedCategory] = useState<EmailCategory | 'all'>(category || 'all');

  // Calculate date range
  const dateRange = useMemo(() => {
    const now = new Date();
    const ranges = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };
    
    const daysBack = ranges[selectedTimeRange];
    const fromDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    
    return {
      fromDate: fromDate.toISOString(),
      toDate: now.toISOString()
    };
  }, [selectedTimeRange]);

  // GraphQL queries
  const { data: analyticsData, loading: analyticsLoading } = useQuery<GetEmailAnalyticsQuery>(
    GetEmailAnalyticsDocument,
    {
      variables: {
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
        userId: userId || undefined
      }
    }
  );

  const { data: recentActivity, loading: activityLoading } = useQuery<GetRecentEmailActivityQuery>(
    GetRecentEmailActivityDocument,
    {
      variables: {
        limit: 10,
        userId: userId || undefined
      }
    }
  );

  const { data: emailLogs, loading: logsLoading } = useQuery<GetEmailSendLogsQuery>(
    GetEmailSendLogsDocument,
    {
      variables: {
        limit: 50,
        senderId: userId || undefined,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate
      }
    }
  );

  // Calculate metrics
  const metrics: AnalyticsMetric[] = useMemo(() => {
    if (!analyticsData) return [];

    const totalSent = analyticsData.emailSendLogsAggregate?.aggregate?.count || 0;
    const delivered = analyticsData.deliveredEmails?.aggregate?.count || 0;
    const failed = analyticsData.failedEmails?.aggregate?.count || 0;
    const sent = analyticsData.sentEmails?.aggregate?.count || 0;

    const deliveryRate = totalSent > 0 ? (delivered / totalSent) * 100 : 0;
    const failureRate = totalSent > 0 ? (failed / totalSent) * 100 : 0;

    return [
      {
        label: 'Total Emails',
        value: totalSent,
        icon: <Mail className="h-4 w-4" />,
        color: 'text-blue-600'
      },
      {
        label: 'Successfully Sent',
        value: sent,
        icon: <Send className="h-4 w-4" />,
        color: 'text-green-600'
      },
      {
        label: 'Delivered',
        value: delivered,
        icon: <CheckCircle className="h-4 w-4" />,
        color: 'text-green-600'
      },
      {
        label: 'Failed',
        value: failed,
        icon: <XCircle className="h-4 w-4" />,
        color: 'text-red-600'
      },
      {
        label: 'Delivery Rate',
        value: Math.round(deliveryRate),
        icon: <TrendingUp className="h-4 w-4" />,
        color: deliveryRate > 95 ? 'text-green-600' : deliveryRate > 90 ? 'text-yellow-600' : 'text-red-600'
      },
      {
        label: 'Failure Rate',
        value: Math.round(failureRate),
        icon: <BarChart3 className="h-4 w-4" />,
        color: failureRate < 5 ? 'text-green-600' : failureRate < 10 ? 'text-yellow-600' : 'text-red-600'
      }
    ];
  }, [analyticsData]);

  // Group recent activity by category
  const activityByCategory = useMemo(() => {
    if (!recentActivity?.emailSendLogs) return {};
    
    return recentActivity.emailSendLogs.reduce((acc, log) => {
      const category = log.emailTemplate?.category || 'other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(log);
      return acc;
    }, {} as Record<string, any[]>);
  }, [recentActivity]);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'failed':
      case 'bounced':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (analyticsLoading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Header and Controls */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Email Analytics</h2>
            <p className="text-muted-foreground">
              Monitor email performance and delivery statistics
            </p>
          </div>

          <div className="flex gap-2">
            <Select value={selectedTimeRange} onValueChange={(value: '7d' | '30d' | '90d' | '1y') => setSelectedTimeRange(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={(value: EmailCategory | 'all') => setSelectedCategory(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.values(EMAIL_CATEGORIES).map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {metrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className={metric.color}>
                    {metric.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {metric.label.includes('Rate') ? `${metric.value}%` : metric.value.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {metric.label}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Views */}
        <Tabs defaultValue="activity" className="w-full">
          <TabsList>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="logs">Email Logs</TabsTrigger>
            <TabsTrigger value="categories">By Category</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Email Activity
                </CardTitle>
                <CardDescription>
                  Latest email sending activity across all categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activityLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : recentActivity?.emailSendLogs && recentActivity.emailSendLogs.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivity.emailSendLogs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{log.subject}</div>
                          <div className="text-sm text-muted-foreground">
                            To: {log.recipientEmails.join(', ')}
                          </div>
                          {log.emailTemplate && (
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">
                                {log.emailTemplate.name}
                              </Badge>
                              {log.emailTemplate.category && (
                                <Badge variant="secondary">
                                  {EMAIL_CATEGORIES[log.emailTemplate.category as EmailCategory]?.name || log.emailTemplate.category}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(log.sendStatus || 'unknown')}>
                            {log.sendStatus || 'unknown'}
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            {log.createdAt ? new Date(log.createdAt).toLocaleDateString() : 'Unknown'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent email activity
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Logs
                </CardTitle>
                <CardDescription>
                  Detailed email sending logs for audit and troubleshooting
                </CardDescription>
              </CardHeader>
              <CardContent>
                {logsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : emailLogs?.emailSendLogs && emailLogs.emailSendLogs.length > 0 ? (
                  <div className="space-y-2">
                    {emailLogs.emailSendLogs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-2 border rounded text-sm">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{log.subject}</div>
                          <div className="text-muted-foreground">
                            {log.recipientEmails.length} recipient(s)
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(log.sendStatus || 'unknown')}>
                            {log.sendStatus || 'unknown'}
                          </Badge>
                          <span className="text-muted-foreground">
                            {new Date(log.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No email logs found
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(activityByCategory).map(([categoryId, logs]) => {
                const categoryInfo = EMAIL_CATEGORIES[categoryId as EmailCategory];
                
                return (
                  <Card key={categoryId}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">
                        {categoryInfo?.name || categoryId}
                      </CardTitle>
                      <CardDescription>
                        {logs.length} email(s) in the selected period
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {logs.slice(0, 3).map((log) => (
                          <div key={log.id} className="text-sm">
                            <div className="font-medium truncate">{log.subject}</div>
                            <div className="flex items-center justify-between">
                              <Badge className={getStatusColor(log.sendStatus)}>
                                {log.sendStatus}
                              </Badge>
                              <span className="text-muted-foreground">
                                {log.createdAt ? new Date(log.createdAt).toLocaleDateString() : 'Unknown'}
                              </span>
                            </div>
                          </div>
                        ))}
                        {logs.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{logs.length - 3} more
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}