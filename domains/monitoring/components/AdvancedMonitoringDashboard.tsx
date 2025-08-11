// domains/monitoring/components/AdvancedMonitoringDashboard.tsx
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Database,
  Server,
  Zap,
  BarChart3,
  Settings,
  RefreshCw,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import {
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
} from "recharts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";
import { useAdvancedMonitoring } from "../hooks/use-advanced-monitoring";

// ====================================================================
// ADVANCED MONITORING DASHBOARD
// Comprehensive oversight of all 11 optimization systems
// Real-time health monitoring, alerting, and recommendations
// ====================================================================

interface SystemHealthCardProps {
  systemId: string;
  name: string;
  type:
    | "cache"
    | "database"
    | "query"
    | "connection"
    | "analytics"
    | "real-time";
  health: {
    score: number;
    status: "healthy" | "warning" | "critical";
    issues: string[];
    recommendations: string[];
  };
  metrics: {
    [key: string]: number | string;
  };
  onRefresh: () => void;
  onViewDetails: () => void;
}

const SystemHealthCard: React.FC<SystemHealthCardProps> = ({
  systemId,
  name,
  type,
  health,
  metrics,
  onRefresh,
  onViewDetails,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "critical":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "critical":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "cache":
        return <Database className="h-5 w-5" />;
      case "database":
        return <Server className="h-5 w-5" />;
      case "query":
        return <Zap className="h-5 w-5" />;
      case "analytics":
        return <BarChart3 className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  return (
    <Card className="relative hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          {getTypeIcon(type)}
          <CardTitle className="text-sm font-medium">{name}</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            className={`${getStatusColor(health.status)} flex items-center space-x-1`}
          >
            {getStatusIcon(health.status)}
            <span className="text-xs font-medium capitalize">
              {health.status}
            </span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Health Score</span>
          <span className="text-2xl font-bold">{health.score}%</span>
        </div>
        <Progress value={health.score} className="w-full" />

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {Object.entries(metrics)
            .slice(0, 4)
            .map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-600 capitalize">
                  {key.replace("_", " ")}
                </span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
        </div>

        {/* Issues Summary */}
        {health.issues.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {health.issues.length} issue{health.issues.length > 1 ? "s" : ""}{" "}
              detected
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onRefresh}
            className="flex-1 text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={onViewDetails}
            className="flex-1 text-xs"
          >
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface PerformanceTrendsChartProps {
  data: Array<{
    timestamp: string;
    [key: string]: number | string;
  }>;
  metrics: string[];
  title: string;
}

const PerformanceTrendsChart: React.FC<PerformanceTrendsChartProps> = ({
  data,
  metrics,
  title,
}) => {
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tick={{ fontSize: 12 }}
              tickFormatter={value => new Date(value).toLocaleTimeString()}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              labelFormatter={value => new Date(value).toLocaleString()}
              formatter={(value: any, name: string) => [
                typeof value === "number"
                  ? Math.round(value * 100) / 100
                  : value,
                name.replace("_", " ").toUpperCase(),
              ]}
            />
            {metrics.map((metric, index) => (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

interface SystemDistributionChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  title: string;
}

const SystemDistributionChart: React.FC<SystemDistributionChartProps> = ({
  data,
  title,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: any) => [value, "Score"]} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const AdvancedMonitoringDashboard: React.FC = () => {
  const {
    systems,
    globalHealth,
    performanceTrends,
    alerts,
    recommendations,
    loading,
    error,
    refreshSystem,
    refreshAll,
    dismissAlert,
    implementRecommendation,
  } = useAdvancedMonitoring();

  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshAll();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshAll]);

  // Log dashboard access
  useEffect(() => {
    logger.info("Advanced monitoring dashboard accessed", {
      namespace: "advanced_monitoring_dashboard",
      operation: "dashboard_access",
      classification: DataClassification.INTERNAL,
      metadata: {
        totalSystems: systems.length,
        healthySystemsCount: systems.filter(s => s.health.status === "healthy")
          .length,
        alertsCount: alerts.length,
        timestamp: new Date().toISOString(),
      },
    });
  }, [systems, alerts]);

  const getOverallHealthColor = () => {
    if (globalHealth.score >= 90) return "text-green-600";
    if (globalHealth.score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const criticalAlerts = alerts.filter(a => a.severity === "critical");
  const warningAlerts = alerts.filter(a => a.severity === "warning");

  // Prepare charts data
  const systemHealthDistribution = systems.map((system, index) => ({
    name: system.name.split(" ")[0],
    value: system.health.score,
    color: ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1"][index % 5],
  }));

  if (loading && systems.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading monitoring data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="m-4">
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading monitoring data: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header with Global Health */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Monitoring Dashboard</h1>
          <p className="text-gray-600">
            Real-time oversight of {systems.length} optimization systems
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-600">Global Health Score</div>
            <div className={`text-3xl font-bold ${getOverallHealthColor()}`}>
              {globalHealth.score}%
            </div>
          </div>
          <Button
            onClick={refreshAll}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh All</span>
          </Button>
          <Button
            variant={autoRefresh ? "secondary" : "outline"}
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="flex items-center space-x-2"
          >
            <Activity className="h-4 w-4" />
            <span>{autoRefresh ? "Auto: ON" : "Auto: OFF"}</span>
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>
              {criticalAlerts.length} Critical Alert
              {criticalAlerts.length > 1 ? "s" : ""}
            </strong>
            {criticalAlerts.map(alert => (
              <div key={alert.id} className="mt-1 text-sm">
                • {alert.systemName}: {alert.message}
              </div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">System Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance Trends</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Issues</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Systems Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {systems.map(system => (
              <SystemHealthCard
                key={system.id}
                systemId={system.id}
                name={system.name}
                type={system.type}
                health={system.health}
                metrics={system.metrics}
                onRefresh={() => refreshSystem(system.id)}
                onViewDetails={() => setSelectedSystem(system.id)}
              />
            ))}
          </div>

          {/* Distribution Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SystemDistributionChart
              data={systemHealthDistribution}
              title="System Health Distribution"
            />
            <Card>
              <CardHeader>
                <CardTitle>System Status Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-green-600">
                      {
                        systems.filter(s => s.health.status === "healthy")
                          .length
                      }
                    </div>
                    <div className="text-sm text-gray-600">Healthy</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-yellow-600">
                      {
                        systems.filter(s => s.health.status === "warning")
                          .length
                      }
                    </div>
                    <div className="text-sm text-gray-600">Warning</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-red-600">
                      {
                        systems.filter(s => s.health.status === "critical")
                          .length
                      }
                    </div>
                    <div className="text-sm text-gray-600">Critical</div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Average Response Time
                  </div>
                  <div className="text-xl font-bold">
                    {Math.round(
                      systems.reduce(
                        (sum, s) =>
                          sum + ((s.metrics.response_time as number) || 0),
                        0
                      ) / systems.length
                    )}
                    ms
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <PerformanceTrendsChart
            data={performanceTrends.overall}
            metrics={["response_time", "throughput", "error_rate"]}
            title="Overall Performance Trends"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceTrendsChart
              data={performanceTrends.cache}
              metrics={["hit_rate", "memory_usage"]}
              title="Cache Performance"
            />
            <PerformanceTrendsChart
              data={performanceTrends.database}
              metrics={["query_time", "connection_utilization"]}
              title="Database Performance"
            />
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">
                  Critical Alerts ({criticalAlerts.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {criticalAlerts.length === 0 ? (
                  <p className="text-green-600">No critical alerts</p>
                ) : (
                  criticalAlerts.map(alert => (
                    <Alert key={alert.id} className="border-red-200">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex justify-between items-start">
                          <div>
                            <strong>{alert.systemName}</strong>
                            <p className="text-sm">{alert.message}</p>
                            <p className="text-xs text-gray-600">
                              {new Date(alert.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => dismissAlert(alert.id)}
                          >
                            Dismiss
                          </Button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-yellow-600">
                  Warning Alerts ({warningAlerts.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {warningAlerts.length === 0 ? (
                  <p className="text-green-600">No warning alerts</p>
                ) : (
                  warningAlerts.map(alert => (
                    <Alert key={alert.id} className="border-yellow-200">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex justify-between items-start">
                          <div>
                            <strong>{alert.systemName}</strong>
                            <p className="text-sm">{alert.message}</p>
                            <p className="text-xs text-gray-600">
                              {new Date(alert.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => dismissAlert(alert.id)}
                          >
                            Dismiss
                          </Button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid gap-4">
            {recommendations.map(rec => (
              <Card key={rec.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{rec.title}</CardTitle>
                      <CardDescription className="flex items-center space-x-2">
                        <Badge
                          className={
                            rec.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : rec.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }
                        >
                          {rec.priority} priority
                        </Badge>
                        <span>•</span>
                        <span className="text-sm">{rec.systemName}</span>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        Potential Impact
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        +{rec.estimatedImprovement}%
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{rec.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      Complexity: {rec.implementationComplexity} | Est. time:{" "}
                      {rec.estimatedTimeHours}h
                    </div>
                    <Button
                      onClick={() => implementRecommendation(rec.id)}
                      className="flex items-center space-x-2"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Implement</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
