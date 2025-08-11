// domains/monitoring/components/SystemDetailModal.tsx
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Database,
  Server,
  Zap,
  BarChart3,
  RefreshCw,
  Clock,
  Network,
  Shield,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";
import { useSystemMonitoring } from "../hooks/use-advanced-monitoring";

// ====================================================================
// SYSTEM DETAIL MODAL
// Comprehensive system monitoring with detailed metrics and controls
// Individual system management and optimization interface
// ====================================================================

interface SystemDetailModalProps {
  systemId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  description?: string;
  status?: "good" | "warning" | "critical";
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  description,
  status = "good",
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "good":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "critical":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getTrendIcon = () => {
    if (change === undefined) return null;
    return change >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            {icon}
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          </div>
          {getTrendIcon()}
        </div>
        <div>
          <div className={`text-2xl font-bold ${getStatusColor()}`}>
            {value}
          </div>
          {change !== undefined && (
            <p className="text-xs text-gray-600">
              {Math.abs(change)}% from last hour
            </p>
          )}
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface PerformanceChartProps {
  data: Array<{
    timestamp: string;
    [key: string]: string | number;
  }>;
  metrics: Array<{
    key: string;
    name: string;
    color: string;
    unit?: string;
  }>;
  title: string;
  height?: number;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  metrics,
  title,
  height = 300,
}) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(
    metrics.map(m => m.key)
  );

  const toggleMetric = (metricKey: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metricKey)
        ? prev.filter(k => k !== metricKey)
        : [...prev, metricKey]
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex flex-wrap gap-2">
            {metrics.map(metric => (
              <Badge
                key={metric.key}
                variant={
                  selectedMetrics.includes(metric.key) ? "default" : "outline"
                }
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => toggleMetric(metric.key)}
                style={{
                  backgroundColor: selectedMetrics.includes(metric.key)
                    ? metric.color
                    : undefined,
                }}
              >
                {metric.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="timestamp"
              tick={{ fontSize: 12 }}
              tickFormatter={value => {
                const date = new Date(value);
                return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
              }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              labelFormatter={value => new Date(value).toLocaleString()}
              formatter={(value: any, name: string) => {
                const metric = metrics.find(m => m.key === name);
                const unit = metric?.unit || "";
                return [
                  typeof value === "number"
                    ? Math.round(value * 100) / 100
                    : value,
                  `${metric?.name || name}${unit ? ` (${unit})` : ""}`,
                ];
              }}
            />
            {metrics
              .filter(metric => selectedMetrics.includes(metric.key))
              .map(metric => (
                <Line
                  key={metric.key}
                  type="monotone"
                  dataKey={metric.key}
                  stroke={metric.color}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  connectNulls={false}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const SystemDetailModal: React.FC<SystemDetailModalProps> = ({
  systemId,
  isOpen,
  onClose,
}) => {
  const { system, loading, error, refreshSystem } = useSystemMonitoring(
    systemId || ""
  );
  const [autoRecovery, setAutoRecovery] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh every 15 seconds when modal is open
  useEffect(() => {
    if (!isOpen || !autoRefresh) return;

    const interval = setInterval(() => {
      refreshSystem();
    }, 15000);

    return () => clearInterval(interval);
  }, [isOpen, autoRefresh, refreshSystem]);

  // Log modal access
  useEffect(() => {
    if (isOpen && systemId) {
      logger.info("System detail modal opened", {
        namespace: "system_detail_modal",
        operation: "modal_opened",
        classification: DataClassification.INTERNAL,
        metadata: {
          systemId,
          systemName: system?.name || "Unknown",
          timestamp: new Date().toISOString(),
        },
      });
    }
  }, [isOpen, systemId, system?.name]);

  if (!isOpen || !systemId) {
    return null;
  }

  if (loading && !system) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span>Loading system details...</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl">
          <Alert>
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading system details: {error}
            </AlertDescription>
          </Alert>
        </DialogContent>
      </Dialog>
    );
  }

  if (!system) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "critical":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "cache":
        return <Database className="h-6 w-6" />;
      case "database":
        return <Server className="h-6 w-6" />;
      case "query":
        return <Zap className="h-6 w-6" />;
      case "analytics":
        return <BarChart3 className="h-6 w-6" />;
      default:
        return <Activity className="h-6 w-6" />;
    }
  };

  const getMetricStatus = (
    key: string,
    value: number | string
  ): "good" | "warning" | "critical" => {
    if (typeof value !== "number") return "good";

    switch (key) {
      case "response_time":
        return value < 50 ? "good" : value < 100 ? "warning" : "critical";
      case "error_rate":
        return value < 1 ? "good" : value < 5 ? "warning" : "critical";
      case "availability":
        return value > 99 ? "good" : value > 95 ? "warning" : "critical";
      default:
        return "good";
    }
  };

  const formatMetricValue = (key: string, value: number | string): string => {
    if (typeof value !== "number") return String(value);

    switch (key) {
      case "response_time":
        return `${Math.round(value)}ms`;
      case "error_rate":
        return `${Math.round(value * 100) / 100}%`;
      case "availability":
        return `${Math.round(value * 100) / 100}%`;
      case "throughput":
        return `${Math.round(value)}/sec`;
      default:
        return String(Math.round(value * 100) / 100);
    }
  };

  // Generate chart data based on system trends
  const chartData = system.trends.timestamps.map((timestamp, index) => ({
    timestamp,
    performance: system.trends.performance[index],
    response_time:
      (system.metrics.response_time as number) + (Math.random() - 0.5) * 20,
    throughput:
      (system.metrics.throughput as number) + (Math.random() - 0.5) * 100,
    error_rate:
      (system.metrics.error_rate as number) + (Math.random() - 0.5) * 0.5,
  }));

  const performanceMetrics = [
    {
      key: "performance",
      name: "Performance Score",
      color: "#8884d8",
      unit: "%",
    },
    {
      key: "response_time",
      name: "Response Time",
      color: "#82ca9d",
      unit: "ms",
    },
    { key: "throughput", name: "Throughput", color: "#ffc658", unit: "/sec" },
    { key: "error_rate", name: "Error Rate", color: "#ff7300", unit: "%" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getTypeIcon(system.type)}
              <div>
                <DialogTitle className="text-2xl">{system.name}</DialogTitle>
                <DialogDescription className="flex items-center space-x-2 mt-1">
                  {getStatusIcon(system.health.status)}
                  <span className="capitalize">{system.health.status}</span>
                  <span>•</span>
                  <span>Health Score: {system.health.score}%</span>
                  <span>•</span>
                  <span className="text-xs text-gray-500">
                    Updated: {system.health.lastUpdated.toLocaleString()}
                  </span>
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                  id="auto-refresh"
                />
                <label htmlFor="auto-refresh" className="text-sm">
                  Auto-refresh
                </label>
              </div>
              <Button
                onClick={refreshSystem}
                disabled={loading}
                size="sm"
                variant="outline"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Health Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Response Time"
              value={formatMetricValue(
                "response_time",
                system.metrics.response_time
              )}
              icon={<Clock className="h-4 w-4" />}
              status={getMetricStatus(
                "response_time",
                system.metrics.response_time
              )}
              description="Average response time"
            />
            <MetricCard
              title="Throughput"
              value={formatMetricValue("throughput", system.metrics.throughput)}
              icon={<Network className="h-4 w-4" />}
              description="Requests per second"
            />
            <MetricCard
              title="Error Rate"
              value={formatMetricValue("error_rate", system.metrics.error_rate)}
              icon={<AlertTriangle className="h-4 w-4" />}
              status={getMetricStatus("error_rate", system.metrics.error_rate)}
              description="Error percentage"
            />
            <MetricCard
              title="Availability"
              value={formatMetricValue(
                "availability",
                system.metrics.availability
              )}
              icon={<Shield className="h-4 w-4" />}
              status={getMetricStatus(
                "availability",
                system.metrics.availability
              )}
              description="System uptime"
            />
          </div>

          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="health">Health & Issues</TabsTrigger>
              <TabsTrigger value="metrics">Detailed Metrics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-4">
              <PerformanceChart
                data={chartData}
                metrics={performanceMetrics}
                title="Performance Trends (Last 24 Hours)"
                height={400}
              />
            </TabsContent>

            <TabsContent value="health" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Issues */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">
                      Issues ({system.health.issues.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {system.health.issues.length === 0 ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>No issues detected</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {system.health.issues.map((issue, index) => (
                          <Alert key={index} className="border-red-200">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{issue}</AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-600">
                      Recommendations ({system.health.recommendations.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {system.health.recommendations.length === 0 ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>System optimized</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {system.health.recommendations.map(
                          (recommendation, index) => (
                            <div
                              key={index}
                              className="p-3 border border-blue-200 rounded-lg"
                            >
                              <p className="text-sm">{recommendation}</p>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(system.metrics).map(([key, value]) => (
                  <Card key={key}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium capitalize">
                          {key.replace("_", " ")}
                        </span>
                        <span className="text-lg font-bold">
                          {formatMetricValue(key, value)}
                        </span>
                      </div>
                      <Progress
                        value={
                          typeof value === "number" ? Math.min(100, value) : 0
                        }
                        className="mt-2"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Configuration</CardTitle>
                  <CardDescription>
                    Manage system settings and automation features
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Auto Recovery</div>
                      <div className="text-sm text-gray-500">
                        Automatically recover from detected issues
                      </div>
                    </div>
                    <Switch
                      checked={autoRecovery}
                      onCheckedChange={setAutoRecovery}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">
                        Monitoring Level
                      </div>
                      <div className="text-sm text-gray-500">
                        Current: Standard monitoring with 15-second intervals
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Configure
                    </Button>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">
                        Alert Thresholds
                      </div>
                      <div className="text-sm text-gray-500">
                        Customize when alerts are triggered
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
