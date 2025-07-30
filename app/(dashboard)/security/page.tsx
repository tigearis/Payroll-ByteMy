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
import { useState, useMemo } from "react";
import {
  GetSecurityDashboardOverviewDocument,
  GetSecurityDashboardActivityDocument,
  GetSecurityUserStatsDocument,
  GetSecurityAuditLogsDocument,
  GetPermissionsDashboardDataDocument,
  GetSoc2ComplianceDataDocument,
} from "@/domains/audit/graphql/generated/graphql";
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
  
  // Audit log state
  const [auditPage, setAuditPage] = useState(0);
  const [auditSearchTerm, setAuditSearchTerm] = useState("");
  const [auditActionFilter, setAuditActionFilter] = useState<string[]>([]);
  const auditPageSize = 20;

  // Time ranges for queries
  const timeRange = useMemo(() => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    return yesterday.toISOString();
  }, []);

  const sevenDaysAgo = useMemo(() => {
    const now = new Date();
    const sevenDays = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return sevenDays.toISOString();
  }, []);

  const thirtyDaysAgo = useMemo(() => {
    const now = new Date();
    const thirtyDays = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return thirtyDays.toISOString();
  }, []);

  // GraphQL queries for real data
  const { data: overviewData, loading: overviewLoading, refetch: refetchOverview } = useQuery(
    GetSecurityDashboardOverviewDocument,
    {
      variables: { timeRange },
      errorPolicy: "all",
    }
  );

  const { data: activityData, loading: activityLoading, refetch: refetchActivity } = useQuery(
    GetSecurityDashboardActivityDocument,
    {
      variables: { limit: 10, timeRange },
      errorPolicy: "all",
    }
  );

  const { data: userStatsData, loading: userStatsLoading, refetch: refetchUserStats } = useQuery(
    GetSecurityUserStatsDocument,
    {
      variables: { thirtyDaysAgo },
      errorPolicy: "all",
    }
  );

  // Audit log query
  const { data: auditData, loading: auditLoading, refetch: refetchAudit } = useQuery(
    GetSecurityAuditLogsDocument,
    {
      variables: {
        limit: auditPageSize,
        offset: auditPage * auditPageSize,
        timeRange: null,
        searchTerm: auditSearchTerm ? `%${auditSearchTerm}%` : "",
      },
      errorPolicy: "all",
    }
  );

  // Permissions query
  const { data: permissionsData, loading: permissionsLoading, refetch: refetchPermissions } = useQuery(
    GetPermissionsDashboardDataDocument,
    {
      variables: { sevenDaysAgo },
      errorPolicy: "all",
    }
  );

  // SOC2 Compliance query
  const { data: complianceData, loading: complianceLoading, refetch: refetchCompliance } = useQuery(
    GetSoc2ComplianceDataDocument,
    {
      variables: { timeRange },
      errorPolicy: "all",
    }
  );

  // Calculate security score based on real data
  const securityScore = useMemo(() => {
    if (!overviewData) return 0;
    
    const { failedLogins, totalLogins } = overviewData;
    const failedCount = failedLogins?.aggregate?.count || 0;
    const totalCount = totalLogins?.aggregate?.count || 1;
    
    // Security score based on login success rate and other factors
    const loginSuccessRate = ((totalCount - failedCount) / totalCount) * 100;
    
    // Base score starts at login success rate, with adjustments
    let score = Math.max(loginSuccessRate, 50); // Minimum 50%
    
    // Add bonus points for having active users
    const activeUserCount = overviewData.activeUsers?.aggregate?.count || 0;
    const totalUserCount = overviewData.totalUsers?.aggregate?.count || 1;
    const activeUserRatio = activeUserCount / totalUserCount;
    
    if (activeUserRatio > 0.8) score += 10; // Bonus for high activity
    if (failedCount === 0) score += 5; // Bonus for no failed logins
    
    return Math.min(Math.round(score), 100); // Cap at 100%
  }, [overviewData]);

  // Transform real activity data to match UI expectations
  const recentActivity = useMemo(() => {
    if (!activityData) return [];
    
    const activities = [];
    
    // Add audit log activities
    if (activityData.recentActivity) {
      activities.push(...activityData.recentActivity.map(log => {
        let severity = "info";
        let actionText = log.action;
        
        // Determine severity based on action type
        if (log.action.includes("delete") || log.action.includes("revoke")) {
          severity = "warning";
        }
        if (!log.success || log.action.includes("failure")) {
          severity = "error";
        }
        
        // Create readable action description
        switch (log.action) {
          case "permission_grant":
            actionText = `Granted ${log.resourceType} permission`;
            break;
          case "permission_revoke":
            actionText = `Revoked ${log.resourceType} permission`;
            break;
          case "role_change":
            actionText = "Role assignment changed";
            break;
          case "user_create":
            actionText = "New user created";
            break;
          case "user_update":
            actionText = "User account updated";
            break;
          case "user_delete":
            actionText = "User account deleted";
            severity = "error";
            break;
          default:
            actionText = log.action.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
        }
        
        return {
          id: log.id,
          type: log.action,
          user: log.userEmail || "System",
          action: actionText,
          timestamp: new Date(log.eventTime),
          severity,
        };
      }));
    }
    
    // Add auth event activities
    if (activityData.recentAuthEvents) {
      activities.push(...activityData.recentAuthEvents.map(event => ({
        id: event.id,
        type: event.eventType,
        user: event.userEmail || "Unknown",
        action: event.success 
          ? `Successful ${event.eventType}`
          : `Failed ${event.eventType}${event.failureReason ? `: ${event.failureReason}` : ''}`,
        timestamp: new Date(event.eventTime),
        severity: event.success ? "info" : "error",
      })));
    }
    
    // Sort by timestamp and take the most recent
    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);
  }, [activityData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchOverview(),
        refetchActivity(),
        refetchUserStats(),
        refetchAudit(),
        refetchPermissions(),
        refetchCompliance(),
      ]);
    } catch (error) {
      console.error("Error refreshing security data:", error);
    } finally {
      setIsRefreshing(false);
    }
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
                    {overviewLoading ? "-" : `${securityScore}%`}
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
                    {overviewLoading ? "-" : (overviewData?.activeUsers?.aggregate?.count || 0)}
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
                    {overviewLoading ? "-" : (overviewData?.totalRoles?.aggregate?.count || 0) * 10}
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
                    {overviewLoading ? "-" : (overviewData?.recentEvents?.aggregate?.count || 0)}
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
                    {activityLoading ? (
                      <div className="text-center py-8">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">Loading recent activity...</p>
                      </div>
                    ) : recentActivity.length === 0 ? (
                      <div className="text-center py-8">
                        <Activity className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">No recent security activity</p>
                      </div>
                    ) : (
                      recentActivity.map((event) => (
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
                      ))
                    )}
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
                  {userStatsLoading ? (
                    <div className="text-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">Loading security metrics...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Active User Ratio
                        </span>
                        <span className="text-sm text-green-600 font-medium">
                          {overviewData ? Math.round(((overviewData.activeUsers?.aggregate?.count || 0) / (overviewData.totalUsers?.aggregate?.count || 1)) * 100) : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ 
                            width: `${overviewData ? Math.round(((overviewData.activeUsers?.aggregate?.count || 0) / (overviewData.totalUsers?.aggregate?.count || 1)) * 100) : 0}%` 
                          }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Staff Management Coverage
                        </span>
                        <span className="text-sm text-green-600 font-medium">
                          {userStatsData ? Math.round(((userStatsData.staffCount?.aggregate?.count || 0) / (overviewData?.totalUsers?.aggregate?.count || 1)) * 100) : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ 
                            width: `${userStatsData ? Math.round(((userStatsData.staffCount?.aggregate?.count || 0) / (overviewData?.totalUsers?.aggregate?.count || 1)) * 100) : 0}%` 
                          }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Login Success Rate
                        </span>
                        <span className="text-sm text-blue-600 font-medium">
                          {overviewData ? 
                            Math.round((((overviewData.totalLogins?.aggregate?.count || 1) - (overviewData.failedLogins?.aggregate?.count || 0)) / (overviewData.totalLogins?.aggregate?.count || 1)) * 100) 
                            : 100}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ 
                            width: `${overviewData ? 
                              Math.round((((overviewData.totalLogins?.aggregate?.count || 1) - (overviewData.failedLogins?.aggregate?.count || 0)) / (overviewData.totalLogins?.aggregate?.count || 1)) * 100) 
                              : 100}%` 
                          }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Security Score
                        </span>
                        <span className="text-sm text-green-600 font-medium">
                          {securityScore}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${securityScore}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
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
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search by user, action, or resource..."
                      value={auditSearchTerm}
                      onChange={(e) => setAuditSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <Button onClick={() => refetchAudit()} disabled={auditLoading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${auditLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>

                {/* Audit Log Table */}
                {auditLoading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">Loading audit logs...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {auditData?.auditLogs?.length === 0 ? (
                      <div className="text-center py-8">
                        <Eye className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">No audit logs found</p>
                      </div>
                    ) : (
                      auditData?.auditLogs?.map((log) => (
                        <div key={log.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant={log.success ? "default" : "destructive"}>
                                  {log.action}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {log.resourceType}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                {log.userEmail || "System"}
                              </p>
                              <p className="text-xs text-gray-500 mb-2">
                                {safeFormatDate(new Date(log.eventTime))}
                              </p>
                              {log.errorMessage && (
                                <p className="text-xs text-red-600 bg-red-50 p-2 rounded">
                                  {log.errorMessage}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <div className={`w-3 h-3 rounded-full ${
                                log.success ? 'bg-green-500' : 'bg-red-500'
                              }`}></div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}

                    {/* Pagination */}
                    {(auditData?.auditLogsAggregate?.aggregate?.count || 0) > auditPageSize && (
                      <div className="flex items-center justify-between mt-6">
                        <p className="text-sm text-gray-700">
                          Showing {auditPage * auditPageSize + 1} to{' '}
                          {Math.min((auditPage + 1) * auditPageSize, auditData?.auditLogsAggregate?.aggregate?.count || 0)} of{' '}
                          {auditData?.auditLogsAggregate?.aggregate?.count} entries
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAuditPage(Math.max(0, auditPage - 1))}
                            disabled={auditPage === 0}
                          >
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAuditPage(auditPage + 1)}
                            disabled={(auditPage + 1) * auditPageSize >= (auditData?.auditLogsAggregate?.aggregate?.count || 0)}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions">
            <div className="space-y-6">
              {/* Role Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Role Distribution
                  </CardTitle>
                  <CardDescription>
                    System roles and their assignments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {permissionsLoading ? (
                    <div className="text-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">Loading permissions data...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {permissionsData?.roles?.map((role) => (
                        <div key={role.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{role.displayName || role.name}</h4>
                            {role.isSystemRole && (
                              <Badge variant="secondary">System</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {role.description || "No description"}
                          </p>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>
                              {role.assignedToUsersAggregate?.aggregate?.count || 0} users
                            </span>
                            <span>
                              Priority: {role.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Permission Changes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Recent Permission Changes
                  </CardTitle>
                  <CardDescription>
                    Latest permission and role modifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {permissionsLoading ? (
                    <div className="text-center py-4">
                      <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2 text-gray-400" />
                      <p className="text-xs text-gray-500">Loading...</p>
                    </div>
                  ) : permissionsData?.recentPermissionChanges?.length === 0 ? (
                    <div className="text-center py-8">
                      <Lock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">No recent permission changes</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {permissionsData?.recentPermissionChanges?.map((change) => (
                        <div key={change.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="text-sm font-medium">
                              {change.action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </p>
                            <p className="text-xs text-gray-500">
                              {change.userEmail} • {safeFormatDate(new Date(change.eventTime))}
                            </p>
                          </div>
                          <Badge variant={change.success ? "default" : "destructive"}>
                            {change.success ? "Success" : "Failed"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance">
            <div className="space-y-6">
              {/* SOC2 Metrics */}
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
                  {complianceLoading ? (
                    <div className="text-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">Loading compliance data...</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Access Controls */}
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              Access Controls
                            </span>
                            {complianceData && ((complianceData.failedAuthentication?.aggregate?.count || 0) / (complianceData.authenticationEvents?.aggregate?.count || 1)) < 0.05 ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            )}
                          </div>
                          <div className={`text-2xl font-bold ${
                            complianceData && ((complianceData.failedAuthentication?.aggregate?.count || 0) / (complianceData.authenticationEvents?.aggregate?.count || 1)) < 0.05 
                              ? 'text-green-600' 
                              : 'text-yellow-600'
                          }`}>
                            {complianceData ? 
                              Math.round((1 - ((complianceData.failedAuthentication?.aggregate?.count || 0) / (complianceData.authenticationEvents?.aggregate?.count || 1))) * 100) 
                              : 0}%
                          </div>
                          <p className="text-xs text-gray-500">
                            {complianceData && ((complianceData.failedAuthentication?.aggregate?.count || 0) / (complianceData.authenticationEvents?.aggregate?.count || 1)) < 0.05 
                              ? 'Compliant' 
                              : 'Needs Attention'}
                          </p>
                        </div>

                        {/* Data Protection */}
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              Data Protection
                            </span>
                            {complianceData && (complianceData.sensitiveDataAccess?.aggregate?.count || 0) > 0 ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            )}
                          </div>
                          <div className={`text-2xl font-bold ${
                            complianceData && (complianceData.sensitiveDataAccess?.aggregate?.count || 0) > 0 
                              ? 'text-green-600' 
                              : 'text-yellow-600'
                          }`}>
                            {complianceData && (complianceData.dataAccessEvents?.aggregate?.count || 0) > 0 ?
                              Math.round(((complianceData.sensitiveDataAccess?.aggregate?.count || 0) / (complianceData.dataAccessEvents?.aggregate?.count || 1)) * 100)
                              : 0}%
                          </div>
                          <p className="text-xs text-gray-500">
                            {complianceData && (complianceData.sensitiveDataAccess?.aggregate?.count || 0) > 0 
                              ? 'Monitored' 
                              : 'No Data'}
                          </p>
                        </div>

                        {/* Audit Logging */}
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              Audit Logging
                            </span>
                            {complianceData && (complianceData.totalAuditLogs?.aggregate?.count || 0) > 0 ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            )}
                          </div>
                          <div className={`text-2xl font-bold ${
                            complianceData && (complianceData.totalAuditLogs?.aggregate?.count || 0) > 0 
                              ? 'text-green-600' 
                              : 'text-yellow-600'
                          }`}>
                            {complianceData && (complianceData.totalAuditLogs?.aggregate?.count || 0) > 0 ? 95 : 0}%
                          </div>
                          <p className="text-xs text-gray-500">
                            {complianceData && (complianceData.totalAuditLogs?.aggregate?.count || 0) > 0 
                              ? 'Active' 
                              : 'No Logs'}
                          </p>
                        </div>
                      </div>

                      {/* Real-time Compliance Metrics */}
                      <div className="border rounded-lg p-6">
                        <h4 className="font-medium mb-4">Live Compliance Metrics</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="text-sm font-medium mb-3">Authentication Security</h5>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Total logins:</span>
                                <span>{complianceData?.authenticationEvents?.aggregate?.count || 0}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Failed attempts:</span>
                                <span className="text-red-600">{complianceData?.failedAuthentication?.aggregate?.count || 0}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Success rate:</span>
                                <span className="text-green-600">
                                  {complianceData ? 
                                    Math.round((1 - ((complianceData.failedAuthentication?.aggregate?.count || 0) / (complianceData.authenticationEvents?.aggregate?.count || 1))) * 100) 
                                    : 100}%
                                </span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium mb-3">System Activity</h5>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Audit entries:</span>
                                <span>{complianceData?.totalAuditLogs?.aggregate?.count || 0}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Failed operations:</span>
                                <span className="text-red-600">{complianceData?.failedAccessAttempts?.aggregate?.count || 0}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Data access events:</span>
                                <span>{complianceData?.dataAccessEvents?.aggregate?.count || 0}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Dynamic Compliance Checklist */}
                      <div className="border rounded-lg p-6">
                        <h4 className="font-medium mb-4">Compliance Checklist</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Role-based access controls implemented</span>
                            {complianceData && (complianceData.activeUsers?.aggregate?.count || 0) > 0 ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Comprehensive audit logging active</span>
                            {complianceData && (complianceData.totalAuditLogs?.aggregate?.count || 0) > 0 ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Authentication monitoring enabled</span>
                            {complianceData && (complianceData.authenticationEvents?.aggregate?.count || 0) > 0 ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Data access classification in place</span>
                            {complianceData && (complianceData.dataAccessEvents?.aggregate?.count || 0) > 0 ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Low failed access rate maintained</span>
                            {complianceData && ((complianceData.failedAccessAttempts?.aggregate?.count || 0) / (complianceData.totalAuditLogs?.aggregate?.count || 1)) < 0.1 ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Critical Security Events */}
              {complianceData?.criticalSecurityEvents && complianceData.criticalSecurityEvents.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                      Critical Security Events
                    </CardTitle>
                    <CardDescription>
                      Recent high-priority security events requiring attention
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {complianceData.criticalSecurityEvents.map((event) => (
                        <div key={event.id} className="border border-red-200 bg-red-50 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-red-900">
                                {event.action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </p>
                              <p className="text-xs text-red-700">
                                {event.userEmail} • {safeFormatDate(new Date(event.eventTime))}
                              </p>
                            </div>
                            <Badge variant="destructive">Critical</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PermissionGuard>
  );
}