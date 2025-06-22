"use client";

import { Calendar, Clock, GitBranch } from "lucide-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePayrollVersionHistory } from "@/hooks/use-payroll-versioning";

// Local date formatting function
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

interface PayrollVersionHistoryProps {
  payrollId: string;
}

export function PayrollVersionHistory({
  payrollId,
}: PayrollVersionHistoryProps) {
  const router = useRouter();
  const { versionHistory, loading, error, refetch } =
    usePayrollVersionHistory(payrollId);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Version History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Version History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600">
            Error loading version history: {error.message}
          </div>
          <Button onClick={() => refetch()} variant="outline" className="mt-2">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!versionHistory.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Version History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No version history available.</p>
        </CardContent>
      </Card>
    );
  }

  const getVersionStatusBadge = (version: any) => {
    if (version.is_current) {
      return <Badge variant="default">Current</Badge>;
    }
    if (
      version.active &&
      version.go_live_date > new Date().toISOString().split("T")[0]
    ) {
      return <Badge variant="secondary">Scheduled</Badge>;
    }
    if (!version.active) {
      return <Badge variant="outline">Inactive</Badge>;
    }
    return <Badge variant="outline">Past</Badge>;
  };

  const getVersionReasonDisplay = (reason: string) => {
    const reasonMap: Record<string, string> = {
      initial_creation: "Initial Creation",
      schedule_change: "Schedule Change",
      consultant_change: "Consultant Change",
      client_change: "Client Change",
      correction: "Correction",
      annual_review: "Annual Review",
    };
    return reasonMap[reason] || reason;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          Version History
          <Badge variant="outline">{versionHistory.length} versions</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {versionHistory.map((version: any) => (
            <div
              key={version.id}
              className={`border rounded-lg p-4 ${
                version.is_current
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">
                      Version {version.version_number}
                    </h4>
                    {getVersionStatusBadge(version)}
                    <Badge variant="outline" className="text-xs">
                      {getVersionReasonDisplay(version.version_reason)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                    {version.go_live_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Go-live: {formatDate(version.go_live_date)}</span>
                      </div>
                    )}

                    {version.superseded_date && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          Superseded: {formatDate(version.superseded_date)}
                        </span>
                      </div>
                    )}
                  </div>

                  {version.is_current && (
                    <div className="mt-2 text-sm text-blue-600">
                      This is the currently active version of this payroll.
                    </div>
                  )}

                  {version.active &&
                    version.go_live_date >
                      new Date().toISOString().split("T")[0] && (
                      <div className="mt-2 text-sm text-orange-600">
                        This version is scheduled to go live on{" "}
                        {formatDate(version.go_live_date)}.
                      </div>
                    )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      router.push(`/payrolls/${version.id}`);
                    }}
                  >
                    View
                  </Button>

                  {!version.is_current && version.active && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // TODO: Create new version based on this one
                        console.log("Clone version:", version.id);
                      }}
                    >
                      Clone
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <Button onClick={() => refetch()} variant="outline" size="sm">
            Refresh History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
