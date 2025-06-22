"use client";

import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { format } from "date-fns";
import {
  Download,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AUDIT_LOG_QUERY = gql`
  query AuditLog(
    $limit: Int!
    $offset: Int!
    $where: audit_log_bool_exp
    $orderBy: [audit_log_order_by!]
  ) {
    audit_log(
      limit: $limit
      offset: $offset
      where: $where
      order_by: $orderBy
    ) {
      id
      user_id
      userrole
      action
      entity_type
      entity_id
      data_classification
      fields_affected
      success
      error_message
      ip_address
      created_at
      user {
        email
        name
      }
    }
    audit_log_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

const ITEMS_PER_PAGE = 50;

export default function AuditLogPage() {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState<string>("all");
  const [filterClassification, setFilterClassification] =
    useState<string>("all");
  const [filterSuccess, setFilterSuccess] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Build where clause
  const where: any = {};

  if (searchTerm) {
    where._or = [
      { user: { email: { _ilike: `%${searchTerm}%` } } },
      { entity_type: { _ilike: `%${searchTerm}%` } },
      { entity_id: { _eq: searchTerm } },
    ];
  }

  if (filterAction !== "all") {
    where.action = { _eq: filterAction };
  }

  if (filterClassification !== "all") {
    where.data_classification = { _eq: filterClassification };
  }

  if (filterSuccess !== "all") {
    where.success = { _eq: filterSuccess === "success" };
  }

  if (dateFrom) {
    where.created_at = { ...where.created_at, _gte: dateFrom };
  }

  if (dateTo) {
    where.created_at = { ...where.created_at, _lte: dateTo };
  }

  const { data, loading, error } = useQuery(AUDIT_LOG_QUERY, {
    variables: {
      limit: ITEMS_PER_PAGE,
      offset: page * ITEMS_PER_PAGE,
      where,
      orderBy: [{ created_at: "desc" }],
    },
  });

  const totalCount = data?.audit_log_aggregate?.aggregate?.count || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handleExport = () => {
    // In production, this would call an API endpoint to generate a secure export
    alert(
      "Export functionality would be implemented with proper security controls"
    );
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "bg-green-100 text-green-800";
      case "UPDATE":
        return "bg-blue-100 text-blue-800";
      case "DELETE":
        return "bg-red-100 text-red-800";
      case "READ":
        return "bg-gray-100 text-gray-800";
      case "EXPORT":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "CRITICAL":
        return "destructive";
      case "HIGH":
        return "secondary";
      case "MEDIUM":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Audit Log</h1>
          <p className="text-muted-foreground">
            Complete audit trail of all system operations
          </p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Email, entity type, or ID"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Action</Label>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="CREATE">Create</SelectItem>
                  <SelectItem value="READ">Read</SelectItem>
                  <SelectItem value="UPDATE">Update</SelectItem>
                  <SelectItem value="DELETE">Delete</SelectItem>
                  <SelectItem value="EXPORT">Export</SelectItem>
                  <SelectItem value="BULK_OPERATION">Bulk Operation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Classification</Label>
              <Select
                value={filterClassification}
                onValueChange={setFilterClassification}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classifications</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filterSuccess} onValueChange={setFilterSuccess}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date From</Label>
              <Input
                type="datetime-local"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Date To</Label>
              <Input
                type="datetime-local"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Audit Entries</CardTitle>
              <CardDescription>
                Showing {page * ITEMS_PER_PAGE + 1} to{" "}
                {Math.min((page + 1) * ITEMS_PER_PAGE, totalCount)} of{" "}
                {totalCount} entries
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading audit logs...</div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              Error loading audit logs
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>Classification</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.audit_log?.map((entry: any) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-mono text-sm">
                          {format(
                            new Date(entry.created_at),
                            "yyyy-MM-dd HH:mm:ss"
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{entry.user?.email}</p>
                            <p className="text-sm text-muted-foreground">
                              {entry.userrole}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getActionColor(entry.action)}>
                            {entry.action}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{entry.entity_type}</p>
                            {entry.entity_id && (
                              <p className="text-xs text-muted-foreground font-mono">
                                {entry.entity_id}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getClassificationColor(
                              entry.data_classification
                            )}
                          >
                            {entry.data_classification}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {entry.success ? (
                            <Badge variant="outline" className="text-green-600">
                              Success
                            </Badge>
                          ) : (
                            <div>
                              <Badge variant="destructive">Failed</Badge>
                              {entry.error_message && (
                                <p className="text-xs text-destructive mt-1">
                                  {entry.error_message}
                                </p>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {entry.ip_address || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Page {page + 1} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    disabled={page >= totalPages - 1}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
