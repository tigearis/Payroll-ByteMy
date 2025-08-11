// domains/security/components/SecurityMonitoringDashboard.tsx
'use client';

import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye,
  Activity,
  Target,
  Users,
  Lock,
  Zap,
  RefreshCw,
  Download,
  Settings,
  AlertCircle,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  FileText,
  Search
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
import { useSecurityMonitoring } from '../hooks/use-security-monitoring';
import { SecurityEvent, SecurityThreat, ComplianceViolation } from '../services/security-monitoring-service';

// ====================================================================
// SECURITY MONITORING DASHBOARD
// Comprehensive security monitoring dashboard with threat detection
// Real-time security event monitoring and compliance management
// ====================================================================

interface DashboardFilters {
  timeframe: '1h' | '24h' | '7d' | '30d';
  severityFilter: 'all' | 'critical' | 'high' | 'medium' | 'low';
  eventTypeFilter: 'all' | 'authentication' | 'authorization' | 'data_access' | 'system_change';
  threatStatusFilter: 'all' | 'detected' | 'investigating' | 'contained' | 'resolved';
  complianceFramework: 'all' | 'SOC2' | 'GDPR' | 'CUSTOM';
}

const SecurityMonitoringDashboard: React.FC = () => {
  const {
    securityMetrics,
    securityEvents,
    activeThreats,
    complianceViolations,
    loading,
    error,
    refreshData,
    generateSecurityReport
  } = useSecurityMonitoring();

  const [filters, setFilters] = useState<DashboardFilters>({
    timeframe: '24h',
    severityFilter: 'all',
    eventTypeFilter: 'all',
    threatStatusFilter: 'all',
    complianceFramework: 'all'
  });

  const [selectedThreat, setSelectedThreat] = useState<SecurityThreat | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshData]);

  // Filter security events based on current filters
  const filteredSecurityEvents = useMemo(() => {
    if (!securityEvents) return [];

    return securityEvents.filter(event => {
      if (filters.severityFilter !== 'all' && event.severity !== filters.severityFilter) {
        return false;
      }

      if (filters.eventTypeFilter !== 'all' && event.type !== filters.eventTypeFilter) {
        return false;
      }

      // Timeframe filtering is handled by the service
      return true;
    });
  }, [securityEvents, filters]);

  // Filter active threats
  const filteredThreats = useMemo(() => {
    if (!activeThreats) return [];

    return activeThreats.filter(threat => {
      if (filters.threatStatusFilter !== 'all' && threat.status !== filters.threatStatusFilter) {
        return false;
      }

      if (filters.severityFilter !== 'all' && threat.severity !== filters.severityFilter) {
        return false;
      }

      return true;
    });
  }, [activeThreats, filters]);

  // Filter compliance violations
  const filteredViolations = useMemo(() => {
    if (!complianceViolations) return [];

    return complianceViolations.filter(violation => {
      if (filters.complianceFramework !== 'all' && violation.framework !== filters.complianceFramework) {
        return false;
      }

      return true;
    });
  }, [complianceViolations, filters]);

  // Prepare chart data for security events over time
  const securityEventChartData = useMemo(() => {
    if (!securityEvents) return [];

    const eventsByHour = new Map<string, { [key: string]: number }>();
    const now = new Date();
    
    // Initialize last 24 hours
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourKey = `${hour.getHours()}:00`;
      eventsByHour.set(hourKey, {
        time: hourKey,
        authentication: 0,
        data_access: 0,
        system_change: 0,
        total: 0
      });
    }

    // Count events by hour and type
    securityEvents.forEach(event => {
      const eventHour = new Date(event.timestamp);
      const hourKey = `${eventHour.getHours()}:00`;
      
      if (eventsByHour.has(hourKey)) {
        const hourData = eventsByHour.get(hourKey)!;
        hourData[event.type] = (hourData[event.type] || 0) + 1;
        hourData.total = hourData.total + 1;
      }
    });

    return Array.from(eventsByHour.values());
  }, [securityEvents]);

  // Prepare threat severity distribution data
  const threatSeverityData = useMemo(() => {
    if (!activeThreats) return [];

    const severityCounts = activeThreats.reduce((acc, threat) => {
      acc[threat.severity] = (acc[threat.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(severityCounts).map(([severity, count]) => ({
      name: severity,
      value: count,
      color: {
        critical: '#EF4444',
        high: '#F97316',
        medium: '#EAB308',
        low: '#22C55E'
      }[severity] || '#6B7280'
    }));
  }, [activeThreats]);

  // Calculate security trends
  const securityTrends = useMemo(() => {
    if (!securityMetrics) return null;

    const currentEvents = securityEvents?.length || 0;
    const currentThreats = activeThreats?.length || 0;
    const currentViolations = complianceViolations?.filter(v => v.status === 'open').length || 0;

    // This would typically compare to previous periods
    return {
      eventsChange: 15, // +15% (placeholder)
      threatsChange: -8, // -8% (improvement)
      violationsChange: -12, // -12% (improvement)
      riskScoreChange: -5 // -5 points (improvement)
    };
  }, [securityMetrics, securityEvents, activeThreats, complianceViolations]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'medium': return <Activity className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getThreatTypeIcon = (type: string) => {
    switch (type) {
      case 'brute_force': return <Lock className="w-4 h-4 text-red-500" />;
      case 'privilege_escalation': return <TrendingUp className="w-4 h-4 text-orange-500" />;
      case 'data_exfiltration': return <Download className="w-4 h-4 text-red-600" />;
      case 'session_hijacking': return <Users className="w-4 h-4 text-purple-500" />;
      default: return <ShieldAlert className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleString();
  };

  const handleGenerateReport = async () => {
    await generateSecurityReport(filters.timeframe);
  };

  if (loading && !securityMetrics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Loading security monitoring data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Security Monitoring Error</AlertTitle>
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
          <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <span>Security Monitoring</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time security monitoring, threat detection, and compliance management
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
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Security Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Risk Score</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {securityMetrics?.riskScore || 0}/100
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              {securityTrends?.riskScoreChange && (
                <>
                  {securityTrends.riskScoreChange < 0 ? (
                    <TrendingDown className="w-3 h-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingUp className="w-3 h-3 text-red-500 mr-1" />
                  )}
                  {Math.abs(securityTrends.riskScoreChange)} points from last period
                </>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {activeThreats?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {securityMetrics?.resolvedThreats || 0} resolved this period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {securityMetrics?.complianceScore || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {complianceViolations?.filter(v => v.status === 'open').length || 0} open violations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {securityMetrics?.totalEvents || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {securityMetrics?.criticalEvents || 0} critical events today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Security Overview</TabsTrigger>
          <TabsTrigger value="threats">Threat Detection</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="events">Security Events</TabsTrigger>
        </TabsList>

        {/* Security Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Security Events Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Security Events (Last 24 Hours)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={securityEventChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="authentication" 
                        stackId="1"
                        stroke="#3B82F6" 
                        fill="#3B82F6"
                        name="Authentication"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="data_access" 
                        stackId="1"
                        stroke="#10B981" 
                        fill="#10B981"
                        name="Data Access"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="system_change" 
                        stackId="1"
                        stroke="#F59E0B" 
                        fill="#F59E0B"
                        name="System Changes"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Threat Severity Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Active Threats by Severity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {threatSeverityData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={threatSeverityData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {threatSeverityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <p className="text-lg font-medium text-green-700">No Active Threats</p>
                        <p className="text-sm text-muted-foreground">All systems are secure</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Security Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Mean Time to Detection</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {securityMetrics?.meanTimeToDetection || 0}min
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Average time to identify threats
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Mean Time to Response</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {securityMetrics?.meanTimeToResponse || 0}min
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Average response time to threats
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Security Efficiency</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {securityMetrics ? Math.round(
                    (securityMetrics.resolvedThreats / Math.max(1, securityMetrics.resolvedThreats + (activeThreats?.length || 0))) * 100
                  ) : 0}%
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Threat resolution rate
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Threat Detection Tab */}
        <TabsContent value="threats" className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <select
              value={filters.threatStatusFilter}
              onChange={(e) => setFilters(prev => ({ ...prev, threatStatusFilter: e.target.value as any }))}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="detected">Detected</option>
              <option value="investigating">Investigating</option>
              <option value="contained">Contained</option>
              <option value="resolved">Resolved</option>
            </select>
            
            <select
              value={filters.severityFilter}
              onChange={(e) => setFilters(prev => ({ ...prev, severityFilter: e.target.value as any }))}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical Only</option>
              <option value="high">High Only</option>
              <option value="medium">Medium Only</option>
              <option value="low">Low Only</option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredThreats.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-medium text-green-700">No Threats Detected</p>
                    <p className="text-muted-foreground">All security systems are operating normally</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredThreats.map((threat) => (
                <Card 
                  key={threat.id} 
                  className={`border-l-4 ${
                    threat.severity === 'critical' ? 'border-l-red-500' :
                    threat.severity === 'high' ? 'border-l-orange-500' :
                    threat.severity === 'medium' ? 'border-l-yellow-500' :
                    'border-l-green-500'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {getThreatTypeIcon(threat.type)}
                        <div>
                          <CardTitle className="text-lg capitalize">
                            {threat.type.replace(/_/g, ' ')} Attack
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            Detected: {formatTimestamp(threat.detectedAt)} • Risk Score: {threat.riskScore}/100
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getSeverityColor(threat.severity)} variant="outline">
                          {threat.severity.toUpperCase()}
                        </Badge>
                        <Badge variant={
                          threat.status === 'resolved' ? 'secondary' :
                          threat.status === 'contained' ? 'outline' :
                          'destructive'
                        }>
                          {threat.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Affected Systems and Users */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-sm mb-2">Affected Systems</h4>
                          <div className="flex flex-wrap gap-1">
                            {threat.affectedSystems.map(systemId => (
                              <Badge key={systemId} variant="outline" className="text-xs">
                                {systemId.replace(/_/g, ' ')}
                              </Badge>
                            ))}
                            {threat.affectedSystems.length === 0 && (
                              <span className="text-xs text-muted-foreground">No systems directly affected</span>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-sm mb-2">Affected Users</h4>
                          <div className="flex flex-wrap gap-1">
                            {threat.affectedUsers.map(userId => (
                              <Badge key={userId} variant="outline" className="text-xs">
                                {userId}
                              </Badge>
                            ))}
                            {threat.affectedUsers.length === 0 && (
                              <span className="text-xs text-muted-foreground">No users directly affected</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Threat Indicators */}
                      {threat.indicators.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Threat Indicators</h4>
                          <div className="space-y-1">
                            {threat.indicators.slice(0, 3).map((indicator, index) => (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <span className="font-medium">{indicator.type}:</span>
                                <span className="text-muted-foreground">{indicator.value}</span>
                                <Badge variant="outline" className="text-xs">
                                  {indicator.confidence}% confidence
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Mitigation Actions */}
                      {threat.mitigationActions.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Mitigation Actions</h4>
                          <div className="space-y-1">
                            {threat.mitigationActions.slice(0, 3).map((action, index) => (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <span>{action.action}</span>
                                <Badge variant={
                                  action.status === 'completed' ? 'secondary' :
                                  action.status === 'in_progress' ? 'outline' :
                                  'destructive'
                                }>
                                  {action.status.replace(/_/g, ' ')}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                        <div className="text-xs text-muted-foreground">
                          Confidence: {threat.confidenceLevel}% • Last Updated: {formatTimestamp(threat.lastUpdated)}
                        </div>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedThreat(threat)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <select
              value={filters.complianceFramework}
              onChange={(e) => setFilters(prev => ({ ...prev, complianceFramework: e.target.value as any }))}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="all">All Frameworks</option>
              <option value="SOC2">SOC2</option>
              <option value="GDPR">GDPR</option>
              <option value="CUSTOM">Custom Rules</option>
            </select>

            <Badge variant="outline" className="text-green-600 border-green-200">
              Compliance Score: {securityMetrics?.complianceScore || 0}%
            </Badge>
          </div>

          <div className="space-y-4">
            {filteredViolations.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-medium text-green-700">No Compliance Violations</p>
                    <p className="text-muted-foreground">All compliance requirements are being met</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredViolations.map((violation) => (
                <Card 
                  key={violation.id} 
                  className={`border-l-4 ${
                    violation.severity === 'critical' ? 'border-l-red-500' :
                    violation.severity === 'high' ? 'border-l-orange-500' :
                    violation.severity === 'medium' ? 'border-l-yellow-500' :
                    'border-l-blue-500'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{violation.ruleName}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Framework: {violation.framework} • Detected: {formatTimestamp(violation.detectedAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getSeverityColor(violation.severity)} variant="outline">
                          {violation.severity.toUpperCase()}
                        </Badge>
                        <Badge variant={violation.status === 'remediated' ? 'secondary' : 'destructive'}>
                          {violation.status.toUpperCase().replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-sm mb-1">Expected Value</h4>
                          <p className="text-sm text-muted-foreground">{JSON.stringify(violation.expectedValue)}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm mb-1">Actual Value</h4>
                          <p className="text-sm text-muted-foreground">{JSON.stringify(violation.actualValue)}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-2">Risk Assessment</h4>
                        <div className="flex items-center space-x-4 text-sm">
                          <span>Business Impact: <Badge variant="outline">{violation.riskAssessment.businessImpact}</Badge></span>
                          <span>Likelihood: <Badge variant="outline">{violation.riskAssessment.likelihood}</Badge></span>
                          <span>Risk Score: <Badge variant="outline">{violation.riskAssessment.riskScore}/100</Badge></span>
                        </div>
                      </div>

                      {violation.remediationPlan.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Remediation Plan</h4>
                          <div className="space-y-2">
                            {violation.remediationPlan.slice(0, 3).map((plan, index) => (
                              <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                                <span>{plan.action}</span>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="text-xs">
                                    {plan.priority}
                                  </Badge>
                                  <Badge variant={
                                    plan.status === 'completed' ? 'secondary' :
                                    plan.status === 'in_progress' ? 'outline' :
                                    'destructive'
                                  }>
                                    {plan.status.replace(/_/g, ' ')}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Security Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <select
              value={filters.eventTypeFilter}
              onChange={(e) => setFilters(prev => ({ ...prev, eventTypeFilter: e.target.value as any }))}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="all">All Event Types</option>
              <option value="authentication">Authentication</option>
              <option value="authorization">Authorization</option>
              <option value="data_access">Data Access</option>
              <option value="system_change">System Changes</option>
              <option value="network_activity">Network Activity</option>
            </select>
            
            <select
              value={filters.severityFilter}
              onChange={(e) => setFilters(prev => ({ ...prev, severityFilter: e.target.value as any }))}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
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

          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredSecurityEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <Eye className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm font-medium text-muted-foreground">No security events match current filters</p>
                  </div>
                ) : (
                  filteredSecurityEvents.slice(0, 20).map((event) => (
                    <div 
                      key={event.id} 
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        {getSeverityIcon(event.severity)}
                        <div>
                          <p className="font-medium text-sm capitalize">
                            {event.type.replace(/_/g, ' ')} - {event.action}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTimestamp(event.timestamp)} • User: {event.userId || 'System'} • IP: {event.ipAddress || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getSeverityColor(event.severity)} variant="outline">
                          {event.severity}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Risk: {event.riskScore}/100
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityMonitoringDashboard;