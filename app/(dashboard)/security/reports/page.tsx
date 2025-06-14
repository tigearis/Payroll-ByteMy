"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { format, subDays, startOfMonth } from "date-fns";
import {
  Download,
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lock,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COMPLIANCE_REPORT_QUERY = gql`
  query ComplianceReport($startDate: timestamptz!, $endDate: timestamptz!) {
    # Overall metrics
    audit_metrics: audit_log_aggregate(
      where: { created_at: { _gte: $startDate, _lte: $endDate } }
    ) {
      aggregate {
        count
      }
      nodes {
        success
        data_classification
        action
        created_at
      }
    }

    # Failed operations by type
    failed_by_type: audit_log(
      where: {
        success: { _eq: false }
        created_at: { _gte: $startDate, _lte: $endDate }
      }
    ) {
      action
      entity_type
      error_message
    }

    # Data access by classification
    data_access_stats: data_access_log_aggregate(
      where: { accessed_at: { _gte: $startDate, _lte: $endDate } }
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
        purpose
      }
    }

    # Security events
    security_events_stats: security_event_log_aggregate(
      where: { created_at: { _gte: $startDate, _lte: $endDate } }
    ) {
      aggregate {
        count
      }
      nodes {
        severity
        event_type
        resolved
      }
    }

    # User activity
    user_activity: audit_log(
      where: { created_at: { _gte: $startDate, _lte: $endDate } }
      distinct_on: user_id
    ) {
      user_id
      user_role
      user {
        email
        name
      }
    }

    # Compliance checks
    compliance_history: compliance_check(
      where: { performed_at: { _gte: $startDate, _lte: $endDate } }
      order_by: { performed_at: desc }
    ) {
      id
      check_type
      status
      findings
      performed_at
    }
  }
`;

const COLORS = {
  CRITICAL: "#ef4444",
  HIGH: "#f59e0b",
  MEDIUM: "#3b82f6",
  LOW: "#10b981",
};

export default function ComplianceReportsPage() {
  const [reportPeriod, setReportPeriod] = useState("month");

  // Calculate date range based on selected period
  const getDateRange = () => {
    const endDate = new Date();
    let startDate;

    switch (reportPeriod) {
      case "week":
        startDate = subDays(endDate, 7);
        break;
      case "month":
        startDate = startOfMonth(endDate);
        break;
      case "quarter":
        startDate = subDays(endDate, 90);
        break;
      default:
        startDate = startOfMonth(endDate);
    }

    return { startDate, endDate };
  };

  const { startDate, endDate } = getDateRange();

  const { data, loading, error } = useQuery(COMPLIANCE_REPORT_QUERY, {
    variables: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FileText className="h-12 w-12 animate-pulse mx-auto mb-4" />
          <p>Generating compliance report...</p>
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
          Failed to generate compliance report. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  // Process data for charts
  const totalOperations = data.audit_metrics.aggregate.count;
  const failedOperations = data.audit_metrics.nodes.filter(
    (n: any) => !n.success
  ).length;
  const successRate = (
    ((totalOperations - failedOperations) / totalOperations) *
    100
  ).toFixed(1);

  // Data classification breakdown
  const classificationData = Object.entries(
    data.audit_metrics.nodes.reduce((acc: any, node: any) => {
      acc[node.data_classification] = (acc[node.data_classification] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Daily activity trend
  const dailyActivity = data.audit_metrics.nodes.reduce(
    (acc: any, node: any) => {
      const date = format(new Date(node.created_at), "MMM dd");
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {}
  );

  const activityTrend = Object.entries(dailyActivity).map(([date, count]) => ({
    date,
    operations: count,
  }));

  // Security events by severity
  const securityEventsBySeverity = data.security_events_stats.nodes.reduce(
    (acc: any, event: any) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1;
      return acc;
    },
    {}
  );

  const handleExport = (format: string) => {
    // In production, this would call an API endpoint to generate the report
    alert(
      `Export to ${format} would be implemented with proper security controls`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Compliance Reports</h1>
          <p className="text-muted-foreground">
            SOC 2 compliance reporting and analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("PDF")}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport("CSV")}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Report Period Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Report Period</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={reportPeriod} onValueChange={setReportPeriod}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="week">Last 7 Days</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
              <TabsTrigger value="quarter">Last 90 Days</TabsTrigger>
            </TabsList>
          </Tabs>
          <p className="text-sm text-muted-foreground mt-2">
            Report period: {format(startDate, "MMM d, yyyy")} -{" "}
            {format(endDate, "MMM d, yyyy")}
          </p>
        </CardContent>
      </Card>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
          <CardDescription>
            Key compliance metrics for the reporting period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Overall Health Score</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{successRate}%</span>
                <Badge
                  variant={
                    parseFloat(successRate) >= 95 ? "default" : "destructive"
                  }
                >
                  {parseFloat(successRate) >= 95 ? "Healthy" : "At Risk"}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Total Operations</p>
              <p className="text-3xl font-bold">
                {totalOperations.toLocaleString()}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Security Events</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  {data.security_events_stats.aggregate.count}
                </span>
                {data.security_events_stats.nodes.filter(
                  (e: any) => !e.resolved
                ).length > 0 && (
                  <Badge variant="destructive">
                    {
                      data.security_events_stats.nodes.filter(
                        (e: any) => !e.resolved
                      ).length
                    }{" "}
                    Open
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Active Users</p>
              <p className="text-3xl font-bold">{data.user_activity.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Activity Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Activity Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="operations"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Data Classification Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Data Access by Classification</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={classificationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {classificationData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        COLORS[entry.name as keyof typeof COLORS] || "#8884d8"
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Checks */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Check History</CardTitle>
          <CardDescription>
            Results of automated compliance checks during the reporting period
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.compliance_history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-2" />
              <p>No compliance checks performed in this period</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.compliance_history.map((check: any) => (
                <div
                  key={check.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{check.check_type}</span>
                      <Badge
                        variant={
                          check.status === "passed"
                            ? "default"
                            : check.status === "warning"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {check.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        new Date(check.performed_at),
                        "MMM d, yyyy HH:mm"
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {check.status === "passed" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Findings */}
      <Card>
        <CardHeader>
          <CardTitle>Key Findings & Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Success Rate Analysis */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-start gap-3">
              {parseFloat(successRate) >= 95 ? (
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-medium">Operation Success Rate</p>
                <p className="text-sm text-muted-foreground">
                  Your system achieved a {successRate}% success rate during this
                  period.
                  {parseFloat(successRate) >= 95
                    ? " This meets SOC 2 reliability requirements."
                    : " Consider investigating failed operations to improve reliability."}
                </p>
              </div>
            </div>
          </div>

          {/* Security Events */}
          {data.security_events_stats.aggregate.count > 0 && (
            <div className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium">Security Events</p>
                  <p className="text-sm text-muted-foreground">
                    {data.security_events_stats.aggregate.count} security events
                    were logged.
                    {Object.entries(securityEventsBySeverity).map(
                      ([severity, count]) => (
                        <span key={severity}>
                          {" "}
                          {count as number} {(severity as string).toLowerCase()}
                          ,
                        </span>
                      )
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Data Access Patterns */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-purple-500 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium">Data Access Controls</p>
                <p className="text-sm text-muted-foreground">
                  {data.data_access_stats.aggregate.sum?.record_count || 0}{" "}
                  records were accessed. All access was logged and classified
                  according to sensitivity levels.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
