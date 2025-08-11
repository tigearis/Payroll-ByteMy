// domains/monitoring/components/AlertManagementPanel.tsx
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Search,
  Bell,
  Settings,
  Archive,
  Eye,
} from "lucide-react";
import React, { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";
import { useAdvancedMonitoring } from "../hooks/use-advanced-monitoring";

// ====================================================================
// ALERT MANAGEMENT PANEL
// Comprehensive alert handling with filtering, prioritization, and actions
// Real-time alert monitoring with automated escalation
// ====================================================================

interface AlertFilters {
  severity: "all" | "info" | "warning" | "critical";
  status: "all" | "active" | "acknowledged" | "resolved";
  system: "all" | string;
  search: string;
}

interface AlertRuleConfig {
  id: string;
  name: string;
  condition: string;
  severity: "info" | "warning" | "critical";
  enabled: boolean;
  autoResolve: boolean;
  escalationTime: number; // minutes
  recipients: string[];
}

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "critical":
      return <XCircle className="h-4 w-4 text-red-600" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    case "info":
      return <Info className="h-4 w-4 text-blue-600" />;
    default:
      return <Bell className="h-4 w-4 text-gray-600" />;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "bg-red-100 text-red-800 border-red-200";
    case "warning":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "info":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const alertTime = new Date(timestamp);
  const diffMs = now.getTime() - alertTime.getTime();

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
};

export const AlertManagementPanel: React.FC = () => {
  const {
    alerts,
    systems,
    loading,
    dismissAlert,
    acknowledgeAlert,
    refreshAll,
  } = useAdvancedMonitoring();

  const [filters, setFilters] = useState<AlertFilters>({
    severity: "all",
    status: "all",
    system: "all",
    search: "",
  });

  const [showRules, setShowRules] = useState(false);
  const [alertRules, setAlertRules] = useState<AlertRuleConfig[]>([]);
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);

  // Initialize default alert rules
  useEffect(() => {
    const defaultRules: AlertRuleConfig[] = [
      {
        id: "response_time_high",
        name: "High Response Time",
        condition: "response_time > 1000ms",
        severity: "warning",
        enabled: true,
        autoResolve: true,
        escalationTime: 15,
        recipients: ["admin@company.com"],
      },
      {
        id: "error_rate_critical",
        name: "Critical Error Rate",
        condition: "error_rate > 5%",
        severity: "critical",
        enabled: true,
        autoResolve: false,
        escalationTime: 5,
        recipients: ["admin@company.com", "support@company.com"],
      },
      {
        id: "memory_usage_high",
        name: "High Memory Usage",
        condition: "memory_usage > 90%",
        severity: "warning",
        enabled: true,
        autoResolve: true,
        escalationTime: 30,
        recipients: ["admin@company.com"],
      },
      {
        id: "system_down",
        name: "System Down",
        condition: "availability < 95%",
        severity: "critical",
        enabled: true,
        autoResolve: false,
        escalationTime: 1,
        recipients: [
          "admin@company.com",
          "support@company.com",
          "oncall@company.com",
        ],
      },
    ];
    setAlertRules(defaultRules);
  }, []);

  // Log alert panel access
  useEffect(() => {
    logger.info("Alert management panel accessed", {
      namespace: "alert_management_panel",
      operation: "panel_access",
      classification: DataClassification.INTERNAL,
      metadata: {
        totalAlerts: alerts.length,
        criticalAlerts: alerts.filter(a => a.severity === "critical").length,
        warningAlerts: alerts.filter(a => a.severity === "warning").length,
        timestamp: new Date().toISOString(),
      },
    });
  }, [alerts]);

  // Filter alerts based on current filters
  const filteredAlerts = alerts.filter(alert => {
    if (filters.severity !== "all" && alert.severity !== filters.severity) {
      return false;
    }

    if (filters.system !== "all" && alert.systemId !== filters.system) {
      return false;
    }

    if (
      filters.search &&
      !alert.message.toLowerCase().includes(filters.search.toLowerCase()) &&
      !alert.systemName.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }

    // Status filtering (simulated based on acknowledged status)
    if (filters.status !== "all") {
      if (filters.status === "acknowledged" && !alert.acknowledged)
        return false;
      if (filters.status === "active" && alert.acknowledged) return false;
    }

    return true;
  });

  const handleBulkAction = async (action: "acknowledge" | "dismiss") => {
    for (const alertId of selectedAlerts) {
      try {
        if (action === "acknowledge") {
          await acknowledgeAlert(alertId);
        } else {
          await dismissAlert(alertId);
        }
      } catch (error) {
        logger.error(`Bulk ${action} failed for alert`, {
          namespace: "alert_management_panel",
          operation: `bulk_${action}_error`,
          classification: DataClassification.INTERNAL,
          error: error instanceof Error ? error.message : String(error),
          metadata: { alertId },
        });
      }
    }
    setSelectedAlerts([]);
  };

  const toggleAlertRule = (ruleId: string, enabled: boolean) => {
    setAlertRules(prev =>
      prev.map(rule => (rule.id === ruleId ? { ...rule, enabled } : rule))
    );

    logger.info("Alert rule toggled", {
      namespace: "alert_management_panel",
      operation: "toggle_alert_rule",
      classification: DataClassification.INTERNAL,
      metadata: { ruleId, enabled },
    });
  };

  const alertCounts = {
    total: alerts.length,
    critical: alerts.filter(a => a.severity === "critical").length,
    warning: alerts.filter(a => a.severity === "warning").length,
    info: alerts.filter(a => a.severity === "info").length,
    acknowledged: alerts.filter(a => a.acknowledged).length,
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Alert Management</h2>
          <p className="text-gray-600">
            Monitor and manage system alerts across all optimization systems
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={showRules ? "secondary" : "outline"}
            onClick={() => setShowRules(!showRules)}
            className="flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Alert Rules</span>
          </Button>
          <Button onClick={refreshAll} className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Alerts
                </p>
                <p className="text-2xl font-bold">{alertCounts.total}</p>
              </div>
              <Bell className="h-6 w-6 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Critical</p>
                <p className="text-2xl font-bold text-red-600">
                  {alertCounts.critical}
                </p>
              </div>
              <XCircle className="h-6 w-6 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Warning</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {alertCounts.warning}
                </p>
              </div>
              <AlertTriangle className="h-6 w-6 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Info</p>
                <p className="text-2xl font-bold text-blue-600">
                  {alertCounts.info}
                </p>
              </div>
              <Info className="h-6 w-6 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">
                  Acknowledged
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {alertCounts.acknowledged}
                </p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Rules Panel */}
      {showRules && (
        <Card>
          <CardHeader>
            <CardTitle>Alert Rules Configuration</CardTitle>
            <CardDescription>
              Configure automatic alert generation and escalation rules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alertRules.map(rule => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{rule.name}</h4>
                      <Badge className={getSeverityColor(rule.severity)}>
                        {rule.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{rule.condition}</p>
                    <p className="text-xs text-gray-500">
                      Escalation: {rule.escalationTime}min | Auto-resolve:{" "}
                      {rule.autoResolve ? "Yes" : "No"} | Recipients:{" "}
                      {rule.recipients.length}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={enabled =>
                        toggleAlertRule(rule.id, enabled)
                      }
                    />
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button className="w-full" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Add New Rule
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search alerts..."
                value={filters.search}
                onChange={e =>
                  setFilters(prev => ({ ...prev, search: e.target.value }))
                }
                className="pl-10"
              />
            </div>

            <Select
              value={filters.severity}
              onValueChange={(value: any) =>
                setFilters(prev => ({ ...prev, severity: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.system}
              onValueChange={value =>
                setFilters(prev => ({ ...prev, system: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="System" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Systems</SelectItem>
                {systems.map(system => (
                  <SelectItem key={system.id} value={system.id}>
                    {system.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.status}
              onValueChange={(value: any) =>
                setFilters(prev => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedAlerts.length > 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              {selectedAlerts.length} alert
              {selectedAlerts.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex space-x-2">
              <Button size="sm" onClick={() => handleBulkAction("acknowledge")}>
                <Eye className="h-3 w-3 mr-1" />
                Acknowledge
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction("dismiss")}
              >
                <Archive className="h-3 w-3 mr-1" />
                Dismiss
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedAlerts([])}
              >
                Clear Selection
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Alerts Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Alerts ({filteredAlerts.length})</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const allIds = filteredAlerts.map(a => a.id);
                  setSelectedAlerts(
                    selectedAlerts.length === allIds.length ? [] : allIds
                  );
                }}
              >
                {selectedAlerts.length === filteredAlerts.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-gray-500">Loading alerts...</div>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="text-center h-32 flex items-center justify-center">
              <div className="text-gray-500">
                {alerts.length === 0 ? (
                  <>
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p>No alerts - all systems healthy!</p>
                  </>
                ) : (
                  <p>No alerts match current filters</p>
                )}
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={
                        selectedAlerts.length === filteredAlerts.length &&
                        filteredAlerts.length > 0
                      }
                      onChange={() => {
                        const allIds = filteredAlerts.map(a => a.id);
                        setSelectedAlerts(
                          selectedAlerts.length === allIds.length ? [] : allIds
                        );
                      }}
                      className="rounded border-gray-300"
                    />
                  </TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>System</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.map(alert => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedAlerts.includes(alert.id)}
                        onChange={() => {
                          setSelectedAlerts(prev =>
                            prev.includes(alert.id)
                              ? prev.filter(id => id !== alert.id)
                              : [...prev, alert.id]
                          );
                        }}
                        className="rounded border-gray-300"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getSeverityIcon(alert.severity)}
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{alert.systemName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="text-sm">{alert.message}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {formatTimeAgo(alert.timestamp)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {alert.acknowledged ? (
                        <Badge className="bg-green-100 text-green-800">
                          <Eye className="h-3 w-3 mr-1" />
                          Acknowledged
                        </Badge>
                      ) : (
                        <Badge className="bg-orange-100 text-orange-800">
                          <Bell className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      )}
                      {alert.autoRecovery && (
                        <Badge className="ml-1 bg-blue-100 text-blue-800">
                          Auto-Recovery
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {!alert.acknowledged && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => acknowledgeAlert(alert.id)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => dismissAlert(alert.id)}
                        >
                          <Archive className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
