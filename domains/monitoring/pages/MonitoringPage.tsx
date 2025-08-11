// domains/monitoring/pages/MonitoringPage.tsx
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Shield,
  Bell,
  Database,
} from "lucide-react";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdvancedMonitoringDashboard } from "../components/AdvancedMonitoringDashboard";
import { AlertManagementPanel } from "../components/AlertManagementPanel";
import { SystemDetailModal } from "../components/SystemDetailModal";
import { useAdvancedMonitoring } from "../hooks/use-advanced-monitoring";

// ====================================================================
// MONITORING PAGE
// Unified monitoring interface for all optimization systems
// Complete oversight with dashboards, alerts, and system management
// ====================================================================

export const MonitoringPage: React.FC = () => {
  const { systems, globalHealth, alerts, loading } = useAdvancedMonitoring();

  const [selectedSystemId, setSelectedSystemId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "alerts">(
    "dashboard"
  );

  // Calculate quick stats for header
  const criticalAlerts = alerts.filter(a => a.severity === "critical").length;
  const warningAlerts = alerts.filter(a => a.severity === "warning").length;
  const healthySystems = systems.filter(
    s => s.health.status === "healthy"
  ).length;

  const getHealthStatusColor = () => {
    if (globalHealth.score >= 90) return "text-green-600 bg-green-100";
    if (globalHealth.score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getHealthStatusIcon = () => {
    if (globalHealth.score >= 90) return <Shield className="h-5 w-5" />;
    if (globalHealth.score >= 70) return <AlertTriangle className="h-5 w-5" />;
    return <AlertTriangle className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    System Monitoring Center
                  </h1>
                  <p className="text-sm text-gray-600">
                    Advanced monitoring & observability for all optimization
                    systems
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Status Overview */}
            <div className="flex items-center space-x-4">
              {/* Global Health Score */}
              <div className="flex items-center space-x-2">
                <Badge className={`px-3 py-1 ${getHealthStatusColor()}`}>
                  {getHealthStatusIcon()}
                  <span className="ml-2 font-medium">
                    Global Health: {globalHealth.score}%
                  </span>
                </Badge>
              </div>

              {/* System Status */}
              <div className="flex items-center space-x-2 text-sm">
                <Badge className="bg-green-100 text-green-800">
                  <Database className="h-3 w-3 mr-1" />
                  {healthySystems}/{systems.length} Healthy
                </Badge>
              </div>

              {/* Alert Status */}
              <div className="flex items-center space-x-2">
                {criticalAlerts > 0 && (
                  <Badge className="bg-red-100 text-red-800">
                    <Bell className="h-3 w-3 mr-1" />
                    {criticalAlerts} Critical
                  </Badge>
                )}
                {warningAlerts > 0 && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {warningAlerts} Warnings
                  </Badge>
                )}
                {criticalAlerts === 0 && warningAlerts === 0 && (
                  <Badge className="bg-green-100 text-green-800">
                    <Shield className="h-3 w-3 mr-1" />
                    All Clear
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6">
            <Tabs
              value={activeTab}
              onValueChange={(value: any) => setActiveTab(value)}
            >
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger
                  value="dashboard"
                  className="flex items-center space-x-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Dashboard</span>
                </TabsTrigger>
                <TabsTrigger
                  value="alerts"
                  className="flex items-center space-x-2"
                >
                  <Bell className="h-4 w-4" />
                  <span>Alerts</span>
                  {criticalAlerts + warningAlerts > 0 && (
                    <Badge className="ml-1 px-1 py-0 text-xs bg-red-600 text-white">
                      {criticalAlerts + warningAlerts}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        <Tabs
          value={activeTab}
          onValueChange={(value: any) => setActiveTab(value)}
        >
          <TabsContent value="dashboard" className="mt-0">
            <AdvancedMonitoringDashboard />
          </TabsContent>

          <TabsContent value="alerts" className="mt-0">
            <AlertManagementPanel />
          </TabsContent>
        </Tabs>
      </div>

      {/* System Detail Modal */}
      <SystemDetailModal
        systemId={selectedSystemId}
        isOpen={selectedSystemId !== null}
        onClose={() => setSelectedSystemId(null)}
      />

      {/* Quick Actions Floating Menu */}
      {(criticalAlerts > 0 || globalHealth.score < 70) && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">
                  Attention Required
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  {criticalAlerts > 0 &&
                    `${criticalAlerts} critical alert${criticalAlerts > 1 ? "s" : ""}`}
                  {criticalAlerts > 0 && globalHealth.score < 70 && ", "}
                  {globalHealth.score < 70 &&
                    `Global health: ${globalHealth.score}%`}
                </p>
                <div className="flex space-x-2 mt-3">
                  <Button
                    size="sm"
                    onClick={() => setActiveTab("alerts")}
                    className="text-xs"
                  >
                    View Alerts
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveTab("dashboard")}
                    className="text-xs"
                  >
                    Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Indicator */}
      {loading && (
        <div className="fixed top-20 right-6 z-40">
          <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg shadow-sm border border-blue-200 flex items-center space-x-2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <span className="text-sm">Updating monitoring data...</span>
          </div>
        </div>
      )}
    </div>
  );
};
