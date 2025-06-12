"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { 
  AlertTriangle, 
  Shield, 
  Activity, 
  Users, 
  FileText,
  Lock,
  Eye,
  TrendingUp,
  CheckCircle,
  XCircle
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const SECURITY_OVERVIEW_QUERY = gql`
  query SecurityOverview {
    # Security metrics for the last 24 hours
    metrics_24h: audit_log_aggregate(
      where: { created_at: { _gte: "now() - interval '24 hours'" } }
    ) {
      aggregate {
        count
      }
      nodes {
        success
        data_classification
        action
      }
    }
    
    # Failed operations
    failed_operations: audit_log_aggregate(
      where: { 
        success: { _eq: false }
        created_at: { _gte: "now() - interval '24 hours'" }
      }
    ) {
      aggregate {
        count
      }
      nodes {
        user {
          email
        }
        entity_type
        action
        error_message
        created_at
      }
    }
    
    # Critical data access
    critical_access: audit_log_aggregate(
      where: { 
        data_classification: { _eq: "CRITICAL" }
        created_at: { _gte: "now() - interval '7 days'" }
      }
    ) {
      aggregate {
        count
      }
      nodes {
        user {
          email
          role
        }
        entity_type
        action
        created_at
      }
    }
    
    # Unresolved security events
    security_events: security_event_log(
      where: { resolved: { _eq: false } }
      order_by: { created_at: desc }
      limit: 5
    ) {
      id
      event_type
      severity
      details
      created_at
      user {
        email
      }
    }
    
    # Recent compliance checks
    compliance_checks: compliance_check(
      order_by: { performed_at: desc }
      limit: 1
    ) {
      id
      check_type
      status
      findings
      remediation_required
      performed_at
      next_check_due
    }
    
    # Data access patterns
    data_access_7d: data_access_log_aggregate(
      where: { accessed_at: { _gte: "now() - interval '7 days'" } }
    ) {
      aggregate {
        count
        sum {
          record_count
        }
      }
      nodes {
        data_classification
        data_type
      }
    }
  }
`;

export default function SecurityDashboard() {
  const { data, loading, error, refetch } = useQuery(SECURITY_OVERVIEW_QUERY, {
    pollInterval: 30000, // Refresh every 30 seconds
  });
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="h-12 w-12 animate-pulse mx-auto mb-4" />
          <p>Loading security dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load security data. Please check your permissions.
        </AlertDescription>
      </Alert>
    );
  }

  // Calculate security score
  const totalOps = data.metrics_24h.aggregate.count || 1;
  const failedOps = data.failed_operations.aggregate.count;
  const successRate = ((totalOps - failedOps) / totalOps * 100).toFixed(1);
  const criticalEvents = data.security_events.filter(
    (e: any) => e.severity === "critical" || e.severity === "error"
  );
  
  // Compliance status
  const latestCompliance = data.compliance_checks[0];
  const complianceStatus = latestCompliance?.status || "unknown";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Security & Compliance</h1>
          <p className="text-muted-foreground">
            Monitor security events, audit trails, and compliance status
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Critical Alerts */}
      {criticalEvents.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Critical Security Events</AlertTitle>
          <AlertDescription>
            {criticalEvents.length} unresolved critical events require immediate attention
          </AlertDescription>
          <Button 
            variant="destructive" 
            size="sm" 
            className="mt-2"
            onClick={() => router.push("/security/events")}
          >
            View Events
          </Button>
        </Alert>
      )}

      {/* Security Score Card */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Health Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-4xl font-bold">
                {successRate}%
              </div>
              <p className="text-sm text-muted-foreground">
                Operation Success Rate (24h)
              </p>
            </div>
            <div className="text-right space-y-2">
              <Badge 
                variant={complianceStatus === "passed" ? "default" : 
                        complianceStatus === "warning" ? "secondary" : "destructive"}
                className="text-sm"
              >
                Compliance: {complianceStatus}
              </Badge>
              <div className="text-sm text-muted-foreground">
                Next check: {latestCompliance?.next_check_due ? 
                  format(new Date(latestCompliance.next_check_due), "MMM d, yyyy") : 
                  "Not scheduled"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Operations
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.metrics_24h.aggregate.count}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Failed Operations
            </CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {data.failed_operations.aggregate.count}
            </div>
            <p className="text-xs text-muted-foreground">
              Requires investigation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Critical Access
            </CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.critical_access.aggregate.count}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Data Accessed
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.data_access_7d.aggregate.sum?.record_count || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Records in 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="failures">Failed Operations</TabsTrigger>
          <TabsTrigger value="critical">Critical Access</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        {/* Security Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Unresolved Security Events</CardTitle>
                  <CardDescription>
                    Events requiring investigation or resolution
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/security/events">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {data.security_events.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p>No unresolved security events</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.security_events.map((event: any) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{event.event_type}</span>
                          <Badge
                            variant={
                              event.severity === "critical" ? "destructive" :
                              event.severity === "error" ? "destructive" :
                              event.severity === "warning" ? "secondary" : "default"
                            }
                          >
                            {event.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {event.user?.email || "System"} • {" "}
                          {formatDistanceToNow(new Date(event.created_at))} ago
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Investigate
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Failed Operations Tab */}
        <TabsContent value="failures" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Failed Operations</CardTitle>
                  <CardDescription>
                    Operations that failed in the last 24 hours
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/security/audit">View Audit Log</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {data.failed_operations.nodes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p>No failed operations in the last 24 hours</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.failed_operations.nodes.slice(0, 5).map((op: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {op.action} {op.entity_type}
                          </span>
                          <Badge variant="destructive">Failed</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {op.user?.email} • {" "}
                          {formatDistanceToNow(new Date(op.created_at))} ago
                        </p>
                        <p className="text-sm text-destructive">
                          {op.error_message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Critical Access Tab */}
        <TabsContent value="critical" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Critical Data Access</CardTitle>
                  <CardDescription>
                    Access to critical classified data in the last 7 days
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/security/access">View Access Log</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {data.critical_access.nodes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-2" />
                  <p>No critical data access in the last 7 days</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.critical_access.nodes.slice(0, 5).map((access: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {access.action} {access.entity_type}
                          </span>
                          <Badge variant="destructive">CRITICAL</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {access.user?.email} ({access.user?.role}) • {" "}
                          {formatDistanceToNow(new Date(access.created_at))} ago
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Compliance Status</CardTitle>
                  <CardDescription>
                    Latest compliance check results
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/security/compliance">View History</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!latestCompliance ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2" />
                  <p>No compliance checks performed yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{latestCompliance.check_type}</p>
                      <p className="text-sm text-muted-foreground">
                        Performed {formatDistanceToNow(new Date(latestCompliance.performed_at))} ago
                      </p>
                    </div>
                    <Badge
                      variant={
                        latestCompliance.status === "passed" ? "default" :
                        latestCompliance.status === "warning" ? "secondary" : "destructive"
                      }
                      className="text-lg px-4 py-1"
                    >
                      {latestCompliance.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  {latestCompliance.findings?.issues && latestCompliance.findings.issues.length > 0 && (
                    <div className="border rounded-lg p-4 space-y-2">
                      <p className="font-medium text-sm">Issues Found:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {latestCompliance.findings.issues.map((issue: string, idx: number) => (
                          <li key={idx} className="text-sm text-muted-foreground">
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {latestCompliance.remediation_required && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Remediation Required</AlertTitle>
                      <AlertDescription>
                        {latestCompliance.remediation_notes || "Please review and address the issues found."}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common security and compliance tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/security/audit">
                <FileText className="mr-2 h-4 w-4" />
                View Full Audit Log
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/security/access-review">
                <Users className="mr-2 h-4 w-4" />
                Perform Access Review
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/security/reports">
                <TrendingUp className="mr-2 h-4 w-4" />
                Generate Compliance Report
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}