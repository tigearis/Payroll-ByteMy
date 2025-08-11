// domains/analytics/components/PerformanceAnalyticsDashboard.tsx
'use client';

import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Zap,
  Activity,
  Target,
  BarChart3,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePerformanceAnalytics } from '../hooks/use-performance-analytics';
import { PerformanceInsight } from '../services/performance-analytics-service';

// ====================================================================
// PERFORMANCE ANALYTICS DASHBOARD
// Comprehensive performance analytics dashboard with real-time monitoring
// Trend visualization, predictive insights, and business impact analysis
// ====================================================================

interface DashboardFilters {
  timeframe: '1h' | '24h' | '7d' | '30d';
  systemIds: string[];
  metricTypes: string[];
  severityFilter: 'all' | 'critical' | 'warning' | 'info';
}

const PerformanceAnalyticsDashboard: React.FC = () => {
  const {
    dashboardData,
    performanceInsights,
    performanceReport,
    loading,
    error,
    refreshData,
    generateReport
  } = usePerformanceAnalytics();

  const [filters, setFilters] = useState<DashboardFilters>({
    timeframe: '24h',
    systemIds: [],
    metricTypes: [],
    severityFilter: 'all'
  });

  const [selectedSystem, setSelectedSystem] = useState<string>('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshData]);

  // Filter insights based on current filters
  const filteredInsights = useMemo(() => {
    if (!performanceInsights) return [];

    return performanceInsights.filter(insight => {
      if (filters.severityFilter !== 'all' && insight.severity !== filters.severityFilter) {
        return false;
      }

      if (filters.systemIds.length > 0 && !insight.affectedSystems.some(s => filters.systemIds.includes(s))) {
        return false;
      }

      return true;
    });
  }, [performanceInsights, filters]);

  // Prepare chart data for system overview
  const systemHealthChartData = useMemo(() => {
    if (!dashboardData?.systemOverview) return [];

    return dashboardData.systemOverview.map(system => ({
      name: system.systemName,
      health: system.healthScore,
      responseTime: system.currentMetrics.response_time || 0,
      throughput: system.currentMetrics.throughput || 0,
      errorRate: system.currentMetrics.error_rate || 0,
      color: system.healthScore >= 95 ? '#10B981' : 
             system.healthScore >= 80 ? '#F59E0B' : '#EF4444'
    }));
  }, [dashboardData]);

  // Prepare trend chart data for selected system
  const selectedSystemTrendData = useMemo(() => {
    if (!dashboardData?.globalTrends || !selectedSystem) return [];

    const systemTrends = dashboardData.globalTrends.filter(t => t.systemId === selectedSystem);
    const responseTimeTrend = systemTrends.find(t => t.metricType === 'response_time');

    if (!responseTimeTrend) return [];

    return responseTimeTrend.dataPoints.map(point => ({
      timestamp: point.timestamp.toLocaleTimeString(),
      value: point.value,
      baseline: point.baseline
    }));
  }, [dashboardData, selectedSystem]);

  // Calculate insight statistics
  const insightStats = useMemo(() => {
    if (!performanceInsights) return { critical: 0, warning: 0, info: 0, total: 0 };

    const stats = performanceInsights.reduce((acc, insight) => {
      acc[insight.severity]++;
      acc.total++;
      return acc;
    }, { critical: 0, warning: 0, info: 0, total: 0 });

    return stats;
  }, [performanceInsights]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'info': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'degrading': return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getHealthBadgeColor = (healthScore: number) => {
    if (healthScore >= 95) return 'bg-green-100 text-green-800';
    if (healthScore >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const handleGenerateReport = async () => {
    await generateReport(filters.timeframe);
  };

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Loading performance analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Loading Analytics</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button onClick={refreshData} className="mt-2" variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-full">
      {/* Header with Controls */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Real-time performance monitoring, trends, and predictive insights
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-green-50 border-green-200' : ''}
          >
            <Activity className={`w-4 h-4 mr-2 ${autoRefresh ? 'text-green-600' : ''}`} />
            Auto Refresh {autoRefresh ? 'ON' : 'OFF'}
          </Button>
          
          <Button onClick={refreshData} variant="outline" disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button onClick={handleGenerateReport} variant="default">
            <BarChart3 className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Systems Monitored</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.businessImpactSummary?.totalSystemsMonitored || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardData?.businessImpactSummary?.systemsWithIssues || 0} requiring attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Insights</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {insightStats.critical}
            </div>
            <p className="text-xs text-muted-foreground">
              {insightStats.warning} warnings, {insightStats.info} info
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Business Impact</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(dashboardData?.businessImpactSummary?.estimatedDailyImpact || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Estimated daily impact
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {dashboardData?.businessImpactSummary?.topPerformingSystems?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Systems with optimal performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">System Overview</TabsTrigger>
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          <TabsTrigger value="insights">Insights & Alerts</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* System Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Health Overview */}
            <Card>
              <CardHeader>
                <CardTitle>System Health Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={systemHealthChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        fontSize={12}
                      />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        formatter={(value, name) => [
                          `${value}${name === 'health' ? '%' : name === 'responseTime' ? 'ms' : name === 'throughput' ? ' req/s' : '%'}`,
                          name === 'health' ? 'Health Score' : 
                          name === 'responseTime' ? 'Response Time' : 
                          name === 'throughput' ? 'Throughput' : 'Error Rate'
                        ]}
                      />
                      <Legend />
                      <Bar 
                        dataKey="health" 
                        name="Health Score"
                        fill={(entry) => entry?.color || '#8884d8'}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Current System Status */}
            <Card>
              <CardHeader>
                <CardTitle>Current System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemHealthChartData.map((system, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: system.color }}
                        />
                        <div>
                          <p className="font-medium">{system.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {system.responseTime}ms • {system.throughput} req/s
                          </p>
                        </div>
                      </div>
                      <Badge className={getHealthBadgeColor(system.health)}>
                        {system.health}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Average Response Time</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {Math.round(systemHealthChartData.reduce((sum, s) => sum + s.responseTime, 0) / Math.max(1, systemHealthChartData.length))}ms
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Across all monitored systems
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Total Throughput</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {Math.round(systemHealthChartData.reduce((sum, s) => sum + s.throughput, 0))}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Requests per second
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Average Error Rate</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {(systemHealthChartData.reduce((sum, s) => sum + s.errorRate, 0) / Math.max(1, systemHealthChartData.length)).toFixed(2)}%
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Across all monitored systems
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <select
              value={selectedSystem}
              onChange={(e) => setSelectedSystem(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="">Select a system...</option>
              {dashboardData?.systemOverview?.map(system => (
                <option key={system.systemId} value={system.systemId}>
                  {system.systemName}
                </option>
              ))}
            </select>
            
            <select
              value={filters.timeframe}
              onChange={(e) => setFilters(prev => ({ ...prev, timeframe: e.target.value as any }))}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>

          {selectedSystem && selectedSystemTrendData.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  Performance Trend - {dashboardData?.systemOverview?.find(s => s.systemId === selectedSystem)?.systemName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedSystemTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [
                          `${value}ms`,
                          name === 'value' ? 'Response Time' : 'Baseline'
                        ]}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#2563eb" 
                        strokeWidth={2}
                        name="Response Time"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="baseline" 
                        stroke="#94a3b8" 
                        strokeDasharray="5 5"
                        name="Baseline"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">Select a System</p>
                  <p className="text-muted-foreground">Choose a system above to view its performance trends</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* System Trend Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardData?.systemOverview?.map(system => (
              <Card key={system.systemId}>
                <CardHeader>
                  <CardTitle className="text-lg">{system.systemName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(system.trends).map(([metric, trend]) => (
                      <div key={metric} className="flex items-center justify-between">
                        <span className="text-sm capitalize">
                          {metric.replace(/_/g, ' ')}
                        </span>
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(trend)}
                          <span className={`text-sm font-medium ${
                            trend === 'improving' ? 'text-green-600' :
                            trend === 'degrading' ? 'text-red-600' :
                            trend === 'critical' ? 'text-red-700' :
                            'text-gray-600'
                          }`}>
                            {trend}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Insights & Alerts Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <select
              value={filters.severityFilter}
              onChange={(e) => setFilters(prev => ({ ...prev, severityFilter: e.target.value as any }))}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical Only</option>
              <option value="warning">Warning Only</option>
              <option value="info">Info Only</option>
            </select>

            <Badge variant="outline" className="text-red-600 border-red-200">
              {insightStats.critical} Critical
            </Badge>
            <Badge variant="outline" className="text-yellow-600 border-yellow-200">
              {insightStats.warning} Warning
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              {insightStats.info} Info
            </Badge>
          </div>

          <div className="space-y-4">
            {filteredInsights.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-medium">No Issues Found</p>
                    <p className="text-muted-foreground">All systems are performing within expected parameters</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredInsights.map((insight) => (
                <Card key={insight.id} className={`border-l-4 ${
                  insight.severity === 'critical' ? 'border-l-red-500' :
                  insight.severity === 'warning' ? 'border-l-yellow-500' :
                  'border-l-blue-500'
                }`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {getSeverityIcon(insight.severity)}
                        <div>
                          <CardTitle className="text-lg">{insight.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {insight.description}
                          </p>
                        </div>
                      </div>
                      <Badge variant={
                        insight.severity === 'critical' ? 'destructive' :
                        insight.severity === 'warning' ? 'secondary' :
                        'outline'
                      }>
                        {insight.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Affected Systems */}
                      <div>
                        <h4 className="font-medium text-sm mb-2">Affected Systems</h4>
                        <div className="flex flex-wrap gap-2">
                          {insight.affectedSystems.map(systemId => (
                            <Badge key={systemId} variant="outline">
                              {systemId.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Recommendations */}
                      {insight.recommendations.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Recommendations</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {insight.recommendations.slice(0, 3).map((rec, index) => (
                              <li key={index}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Estimated Impact */}
                      {insight.estimatedImpact && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Estimated Impact</h4>
                          <div className="text-sm text-muted-foreground space-y-1">
                            {insight.estimatedImpact.performanceGain && (
                              <p>• Performance: {insight.estimatedImpact.performanceGain}</p>
                            )}
                            {insight.estimatedImpact.costSaving && (
                              <p>• Cost Impact: ${insight.estimatedImpact.costSaving}/day</p>
                            )}
                            {insight.estimatedImpact.userExperienceImprovement && (
                              <p>• User Experience: {insight.estimatedImpact.userExperienceImprovement}</p>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                        <span>Created: {insight.createdAt.toLocaleString()}</span>
                        {insight.expiresAt && (
                          <span>Expires: {insight.expiresAt.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Reports</CardTitle>
              <p className="text-sm text-muted-foreground">
                Generate comprehensive performance analysis reports
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Button onClick={handleGenerateReport} disabled={loading}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Generate New Report
                  </Button>
                  
                  <select
                    value={filters.timeframe}
                    onChange={(e) => setFilters(prev => ({ ...prev, timeframe: e.target.value as any }))}
                    className="px-3 py-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="24h">24 Hour Report</option>
                    <option value="7d">7 Day Report</option>
                    <option value="30d">30 Day Report</option>
                  </select>
                </div>

                {performanceReport && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Latest Report - {performanceReport.reportId}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Generated: {performanceReport.generatedAt.toLocaleString()} • Timeframe: {performanceReport.timeframe}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Executive Summary */}
                        <div>
                          <h3 className="font-semibold mb-3">Executive Summary</h3>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold">
                                {performanceReport.executiveSummary.overallHealthScore}%
                              </div>
                              <div className="text-sm text-muted-foreground">Health Score</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold">
                                {performanceReport.executiveSummary.totalSystemsAnalyzed}
                              </div>
                              <div className="text-sm text-muted-foreground">Systems</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-red-600">
                                {performanceReport.executiveSummary.criticalIssuesFound}
                              </div>
                              <div className="text-sm text-muted-foreground">Critical Issues</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">
                                {performanceReport.executiveSummary.optimizationOpportunities}
                              </div>
                              <div className="text-sm text-muted-foreground">Opportunities</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold">
                                ${performanceReport.executiveSummary.estimatedBusinessImpact.toLocaleString()}
                              </div>
                              <div className="text-sm text-muted-foreground">Impact/Day</div>
                            </div>
                          </div>
                        </div>

                        {/* Key Recommendations */}
                        <div>
                          <h3 className="font-semibold mb-3">Key Recommendations</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {performanceReport.recommendations.immediate.length > 0 && (
                              <div>
                                <h4 className="font-medium text-red-600 mb-2">Immediate Actions</h4>
                                <ul className="space-y-1 text-sm">
                                  {performanceReport.recommendations.immediate.slice(0, 3).map((rec, index) => (
                                    <li key={index} className="text-muted-foreground">• {rec}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {performanceReport.recommendations.shortTerm.length > 0 && (
                              <div>
                                <h4 className="font-medium text-yellow-600 mb-2">Short Term</h4>
                                <ul className="space-y-1 text-sm">
                                  {performanceReport.recommendations.shortTerm.slice(0, 3).map((rec, index) => (
                                    <li key={index} className="text-muted-foreground">• {rec}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {performanceReport.recommendations.longTerm.length > 0 && (
                              <div>
                                <h4 className="font-medium text-blue-600 mb-2">Long Term</h4>
                                <ul className="space-y-1 text-sm">
                                  {performanceReport.recommendations.longTerm.slice(0, 3).map((rec, index) => (
                                    <li key={index} className="text-muted-foreground">• {rec}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceAnalyticsDashboard;