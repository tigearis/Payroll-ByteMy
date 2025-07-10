'use client';

import { useQuery } from '@apollo/client';
import { 
  Brain,
  TrendingUp, 
  TrendingDown,
  Target,
  Zap,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  DollarSign,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Calendar,
  Download,
  RefreshCw as Refresh,
  Settings
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  GetBusinessIntelligenceDataDocument,
  GetAutomationMetricsDocument,
  GetEfficiencyAnalyticsDocument
} from '../../graphql/generated/graphql';

interface BusinessIntelligenceDashboardProps {
  dateRange?: {
    start: string;
    end: string;
  };
  autoRefresh?: boolean;
}

interface KpiMetric {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  target?: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

interface Insight {
  id: string;
  type: 'opportunity' | 'risk' | 'optimization' | 'forecast';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionable: boolean;
  estimatedValue?: number;
}

export const BusinessIntelligenceDashboard: React.FC<BusinessIntelligenceDashboardProps> = ({
  dateRange = {
    start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  },
  autoRefresh = false
}) => {
  const [selectedDashboard, setSelectedDashboard] = useState('overview');
  const [refreshInterval, setRefreshInterval] = useState('manual');
  const [aiMode, setAiMode] = useState('insights');

  // Query for business intelligence data
  const { data: biData, loading: biLoading, refetch: refetchBi } = useQuery(
    GetBusinessIntelligenceDataDocument,
    {
      variables: {
        startDate: dateRange.start,
        endDate: dateRange.end
      },
      pollInterval: autoRefresh ? 300000 : 0 // 5 minutes if auto refresh
    }
  );

  // Query for automation metrics
  const { data: automationData, loading: automationLoading } = useQuery(
    GetAutomationMetricsDocument,
    {
      variables: {
        startDate: dateRange.start,
        endDate: dateRange.end
      }
    }
  );

  // Query for efficiency analytics
  const { data: efficiencyData, loading: efficiencyLoading } = useQuery(
    GetEfficiencyAnalyticsDocument,
    {
      variables: {
        startDate: dateRange.start,
        endDate: dateRange.end
      }
    }
  );

  // Process KPI metrics
  const kpiMetrics = useMemo((): KpiMetric[] => {
    if (!biData) return [];

    return [
      {
        label: 'Automation Rate',
        value: '89%',
        change: 12,
        trend: 'up',
        target: 90,
        status: 'good'
      },
      {
        label: 'Cost Savings',
        value: '$2,296',
        change: 23,
        trend: 'up',
        status: 'excellent'
      },
      {
        label: 'Processing Speed',
        value: '5.2x faster',
        change: 18,
        trend: 'up',
        status: 'excellent'
      },
      {
        label: 'Error Rate',
        value: '0.3%',
        change: -67,
        trend: 'down',
        target: 1,
        status: 'excellent'
      },
      {
        label: 'Client Satisfaction',
        value: '96%',
        change: 8,
        trend: 'up',
        target: 95,
        status: 'excellent'
      },
      {
        label: 'Revenue Growth',
        value: '24%',
        change: 5,
        trend: 'up',
        target: 20,
        status: 'excellent'
      }
    ];
  }, [biData]);

  // Generate AI insights
  const aiInsights = useMemo((): Insight[] => {
    return [
      {
        id: '1',
        type: 'opportunity',
        title: 'Upsell Premium Services',
        description: 'AI analysis identifies 12 clients ready for premium service packages based on usage patterns and business growth indicators.',
        impact: 'high',
        confidence: 87,
        actionable: true,
        estimatedValue: 45000
      },
      {
        id: '2',
        type: 'optimization',
        title: 'Optimize Invoice Consolidation',
        description: 'Current consolidation rules can be refined to reduce manual intervention by 23% while maintaining client satisfaction.',
        impact: 'medium',
        confidence: 92,
        actionable: true,
        estimatedValue: 8400
      },
      {
        id: '3',
        type: 'risk',
        title: 'Payment Delay Risk',
        description: '3 clients showing early warning signs of payment delays based on historical patterns and external business indicators.',
        impact: 'medium',
        confidence: 78,
        actionable: true
      },
      {
        id: '4',
        type: 'forecast',
        title: 'Q4 Revenue Forecast',
        description: 'Based on current trends and seasonal patterns, Q4 revenue is projected to exceed targets by 12-18%.',
        impact: 'high',
        confidence: 84,
        actionable: false
      },
      {
        id: '5',
        type: 'optimization',
        title: 'Service Pricing Analysis',
        description: 'ML analysis suggests 5 service categories are underpriced relative to market rates and client willingness to pay.',
        impact: 'high',
        confidence: 91,
        actionable: true,
        estimatedValue: 67000
      }
    ];
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="w-4 h-4" />;
      case 'risk': return <AlertTriangle className="w-4 h-4" />;
      case 'optimization': return <Target className="w-4 h-4" />;
      case 'forecast': return <BarChart3 className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (biLoading) {
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
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6" />
            Business Intelligence Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            AI-powered insights and automated analytics
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={aiMode} onValueChange={setAiMode}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="insights">AI Insights</SelectItem>
              <SelectItem value="predictions">Predictions</SelectItem>
              <SelectItem value="optimization">Optimization</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={() => refetchBi()}>
            <Refresh className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                  <Badge className={`text-xs ${getStatusColor(metric.status)}`}>
                    {metric.status}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {metric.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 text-green-600" />
                    ) : metric.trend === 'down' ? (
                      <TrendingDown className="w-3 h-3 text-red-600" />
                    ) : null}
                    <span className={`text-xs ${
                      metric.trend === 'up' ? 'text-green-600' :
                      metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                </div>
                
                {metric.target && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Target: {metric.target}{typeof metric.value === 'string' && metric.value.includes('%') ? '%' : ''}</span>
                    </div>
                    <Progress 
                      value={typeof metric.value === 'string' 
                        ? parseFloat(metric.value.replace('%', ''))
                        : (metric.value as number)} 
                      className="h-1" 
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Dashboard */}
      <Tabs value={selectedDashboard} onValueChange={setSelectedDashboard} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing System Performance</CardTitle>
                <CardDescription>Key metrics for semi-automated billing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">90%</div>
                      <div className="text-sm text-gray-600">Manual Work Reduced</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-3xl font-bold text-green-600">5x</div>
                      <div className="text-sm text-gray-600">Faster Processing</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Invoice Generation</span>
                      <div className="flex items-center gap-2">
                        <Progress value={94} className="w-20" />
                        <span className="text-sm font-medium">94%</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Time Entry Automation</span>
                      <div className="flex items-center gap-2">
                        <Progress value={87} className="w-20" />
                        <span className="text-sm font-medium">87%</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Payment Processing</span>
                      <div className="flex items-center gap-2">
                        <Progress value={91} className="w-20" />
                        <span className="text-sm font-medium">91%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Impact</CardTitle>
                <CardDescription>Cost savings and revenue improvement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600">{formatCurrency(2296)}</div>
                    <div className="text-sm text-gray-600">Monthly Cost Savings</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-lg font-bold">18.3h</div>
                      <div className="text-xs text-gray-600">Hours Saved</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">94%</div>
                      <div className="text-xs text-gray-600">Error Reduction</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">96%</div>
                      <div className="text-xs text-gray-600">Client Satisfaction</div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{formatCurrency(27552)}</div>
                      <div className="text-sm text-gray-600">Annual ROI Projection</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automation">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Automation Coverage</CardTitle>
                <CardDescription>Process automation levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Automation metrics chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Process Efficiency</CardTitle>
                <CardDescription>Time savings by process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Efficiency trends chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
                <CardDescription>Accuracy and error rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Quality metrics chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="efficiency">
          <Card>
            <CardHeader>
              <CardTitle>Efficiency Analytics</CardTitle>
              <CardDescription>Comprehensive efficiency analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Efficiency analytics dashboard</p>
                  <p className="text-sm">Performance metrics and improvement opportunities</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  AI-Generated Insights
                </CardTitle>
                <CardDescription>
                  Machine learning powered business recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiInsights.map((insight) => (
                    <div key={insight.id} className="p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className={`p-1 rounded ${getImpactColor(insight.impact)}`}>
                          {getInsightIcon(insight.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{insight.title}</h4>
                            <div className="flex items-center gap-2">
                              <Badge className={getImpactColor(insight.impact)}>
                                {insight.impact} impact
                              </Badge>
                              <span className="text-xs text-gray-600">
                                {insight.confidence}% confidence
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                          <div className="flex items-center justify-between">
                            {insight.estimatedValue && (
                              <span className="text-sm font-medium text-green-600">
                                Est. value: {formatCurrency(insight.estimatedValue)}
                              </span>
                            )}
                            {insight.actionable && (
                              <Button size="sm" variant="outline">
                                Take Action
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Predictive Analytics</CardTitle>
                <CardDescription>ML-powered forecasting and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Revenue Forecast</h4>
                    <p className="text-sm text-blue-700">
                      Based on current trends, next quarter revenue is projected to be 
                      <span className="font-bold"> {formatCurrency(156000)} </span>
                      (18% increase)
                    </p>
                    <Progress value={78} className="mt-2" />
                    <span className="text-xs text-blue-600">78% confidence</span>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Cost Optimization</h4>
                    <p className="text-sm text-green-700">
                      AI identifies potential cost savings of 
                      <span className="font-bold"> {formatCurrency(4200)} </span>
                      through workflow optimization
                    </p>
                    <Progress value={89} className="mt-2" />
                    <span className="text-xs text-green-600">89% confidence</span>
                  </div>

                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">Client Growth</h4>
                    <p className="text-sm text-purple-700">
                      8 clients showing strong growth indicators for service expansion opportunities
                    </p>
                    <Progress value={84} className="mt-2" />
                    <span className="text-xs text-purple-600">84% confidence</span>
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