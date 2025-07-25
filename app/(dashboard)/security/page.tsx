"use client";

import { useQuery } from "@apollo/client";
import {
  Shield,
  Users,
  Eye,
  Settings,
  Clock,
  Lock,
  AlertTriangle,
  CheckCircle,
  Activity,
  TrendingUp,
  Download,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { safeFormatDate } from "@/lib/utils/date-utils";

// Mock data for initial implementation - will be replaced with real queries
const mockSecurityOverview = {
  totalUsers: 45,
  activeUsers: 42,
  inactiveUsers: 3,
  totalPermissions: 156,
  recentEvents: 23,
  securityScore: 94,
};

const mockRecentActivity = [
  {
    id: "1",
    type: "permission_grant",
    user: "john.doe@company.com",
    action: "Granted payroll:write permission",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    severity: "info",
  },
  {
    id: "2",
    type: "role_change",
    user: "jane.smith@company.com",
    action: "Role changed from consultant to manager",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    severity: "warning",
  },
  {
    id: "3",
    type: "login_attempt",
    user: "failed.user@external.com",
    action: "Failed login attempt",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    severity: "error",
  },
  {
    id: "4",
    type: "permission_revoke",
    user: "temp.user@company.com",
    action: "Revoked access to billing data",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    severity: "info",
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "error":
      return "text-red-600 bg-red-50";
    case "warning":
      return "text-yellow-600 bg-yellow-50";
    case "info":
    default:
      return "text-blue-600 bg-blue-50";
  }
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "error":
      return <AlertTriangle className="w-4 h-4" />;
    case "warning":
      return <Clock className="w-4 h-4" />;
    case "info":
    default:
      return <CheckCircle className="w-4 h-4" />;
  }
};

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleExportAuditLog = () => {
    // Placeholder for audit log export functionality
    console.log("Exporting audit log...");
  };

  return (
    <PermissionGuard permissions={["security.read"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Security Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor system security, permissions, and compliance status
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw 
                className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} 
              />
              Refresh
            </Button>
            <Button onClick={handleExportAuditLog}>
              <Download className="w-4 h-4 mr-2" />
              Export Audit Log
            </Button>
          </div>
        </div>

        {/* Security Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Security Score
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {mockSecurityOverview.securityScore}%
                  </p>
                </div>
                <Shield className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Users
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {mockSecurityOverview.activeUsers}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Permissions
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {mockSecurityOverview.totalPermissions}
                  </p>
                </div>
                <Lock className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Recent Events
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {mockSecurityOverview.recentEvents}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 shadow-md rounded-lg">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Security Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Recent Security Activity
                  </CardTitle>
                  <CardDescription>
                    Latest security events and permission changes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRecentActivity.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start space-x-3 p-3 rounded-lg border"
                      >
                        <div
                          className={`p-2 rounded-full ${getSeverityColor(
                            event.severity
                          )}`}
                        >
                          {getSeverityIcon(event.severity)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {event.action}
                          </p>
                          <p className="text-sm text-gray-500">{event.user}</p>
                          <p className="text-xs text-gray-400">
                            {safeFormatDate(event.timestamp)}
                          </p>
                        </div>
                        <Badge
                          variant={
                            event.severity === "error"
                              ? "destructive"
                              : event.severity === "warning"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {event.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Security Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Security Metrics
                  </CardTitle>
                  <CardDescription>
                    System security health indicators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Two-Factor Authentication Coverage
                      </span>
                      <span className="text-sm text-green-600 font-medium">
                        85%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: "85%" }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Password Policy Compliance
                      </span>
                      <span className="text-sm text-green-600 font-medium">
                        92%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: "92%" }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Session Management
                      </span>
                      <span className="text-sm text-blue-600 font-medium">
                        98%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: "98%" }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Permission Accuracy
                      </span>
                      <span className="text-sm text-green-600 font-medium">
                        96%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: "96%" }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Audit Log Tab */}
          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Security Audit Log
                </CardTitle>
                <CardDescription>
                  Detailed log of all security-related events and actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Audit Log Viewer
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Advanced audit log viewing will be implemented here with real-time
                    filtering, search, and export capabilities.
                  </p>
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Audit Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Permission Management
                </CardTitle>
                <CardDescription>
                  Manage user permissions, roles, and access controls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Permission Management Interface
                  </h3>
                  <p className="text-gray-500 mb-4">
                    User permission overrides, role assignments, and access control
                    management will be implemented here as part of the modern
                    permissions system.
                  </p>
                  <Button variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    View User Permissions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  SOC2 Compliance Status
                </CardTitle>
                <CardDescription>
                  Monitor compliance with SOC2 Type II requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Access Controls
                        </span>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-green-600">98%</div>
                      <p className="text-xs text-gray-500">Compliant</p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Data Protection
                        </span>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-green-600">95%</div>
                      <p className="text-xs text-gray-500">Compliant</p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Audit Logging
                        </span>
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div className="text-2xl font-bold text-yellow-600">87%</div>
                      <p className="text-xs text-gray-500">Needs Attention</p>
                    </div>
                  </div>

                  <div className="border rounded-lg p-6">
                    <h4 className="font-medium mb-4">Compliance Checklist</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Multi-factor authentication enforced</span>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Role-based access controls implemented</span>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Data encryption at rest and in transit</span>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Comprehensive audit logging</span>
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Regular security assessments</span>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PermissionGuard>
  );
}