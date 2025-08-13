import { useQuery } from "@apollo/client";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import { Eye, Clock, AlertCircle, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GET_QUERY_EXECUTION_HISTORY } from "../../graphql/custom-query-operations";

interface QueryExecution {
  id: string;
  queryText: string;
  queryType: string;
  parameters?: any;
  executedAt?: string | null;
  status: string;
  resultCount?: number | null;
  executionTime: number;
  fromCache?: boolean | null;
  errorMessage?: string | null;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface QueryAuditViewerProps {
  limit?: number;
  className?: string;
}

export function QueryAuditViewer({
  limit = 20,
  className,
}: QueryAuditViewerProps) {
  const { user } = useUser();
  const [selectedExecution, setSelectedExecution] = useState<QueryExecution | null>(null);


  // Fetch query executions
  const { data, loading, error, refetch } = useQuery(
    GET_QUERY_EXECUTION_HISTORY,
    {
      variables: { limit },
      fetchPolicy: "cache-first",
    }
  );

  // Use real data from GraphQL query
  const executions: QueryExecution[] = data?.queryExecutions || [];

  // Refresh data every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (user?.id) {
        refetch();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [user?.id, refetch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error loading audit logs: {error.message}
      </div>
    );
  }

  return (
    <div className={className}>
      {executions.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          No query executions found
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Results</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {executions.map(execution => (
              <TableRow key={execution.id}>
                <TableCell>
                  {execution.executedAt ? format(
                    new Date(execution.executedAt),
                    "dd/MM/yyyy HH:mm:ss"
                  ) : "N/A"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{execution.queryType}</Badge>
                </TableCell>
                <TableCell>
                  {execution.status === "success" ? (
                    <Badge
                      variant="default"
                      className="flex items-center gap-1 bg-green-100 text-green-800 border-green-200"
                    >
                      <Check className="h-3 w-3" />
                      Success
                    </Badge>
                  ) : execution.status === "processing" ? (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Clock className="h-3 w-3 animate-spin" />
                      Processing
                    </Badge>
                  ) : (
                    <Badge
                      variant="destructive"
                      className="flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" />
                      Failed
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {execution.executionTime
                    ? `${(execution.executionTime / 1000).toFixed(2)}s`
                    : "-"}
                  {execution.fromCache && (
                    <Badge variant="outline" className="ml-2">
                      Cached
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {execution.resultCount !== null
                    ? `${execution.resultCount} rows`
                    : "-"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedExecution(execution)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Execution Details Dialog */}
      <Dialog
        open={!!selectedExecution}
        onOpenChange={open => {
          if (!open) setSelectedExecution(null);
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Query Execution Details</DialogTitle>
          </DialogHeader>

          {selectedExecution && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Execution Time</h3>
                  <p>
                    {selectedExecution.executedAt ? format(
                      new Date(selectedExecution.executedAt),
                      "dd/MM/yyyy HH:mm:ss"
                    ) : "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Status</h3>
                  <p>
                    {selectedExecution.status === "success" ? (
                      <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Success</Badge>
                    ) : selectedExecution.status === "processing" ? (
                      <Badge variant="secondary">Processing</Badge>
                    ) : (
                      <Badge variant="destructive">Failed</Badge>
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Duration</h3>
                  <p>
                    {selectedExecution.executionTime
                      ? `${(selectedExecution.executionTime / 1000).toFixed(2)}s`
                      : "-"}
                    {selectedExecution.fromCache && (
                      <Badge variant="outline" className="ml-2">
                        Cached
                      </Badge>
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Results</h3>
                  <p>
                    {selectedExecution.resultCount !== null
                      ? `${selectedExecution.resultCount} rows`
                      : "-"}
                  </p>
                </div>
              </div>

              {selectedExecution.errorMessage && (
                <div>
                  <h3 className="font-medium text-sm text-red-500">Error</h3>
                  <p className="text-red-500">
                    {selectedExecution.errorMessage}
                  </p>
                </div>
              )}

              <div>
                <h3 className="font-medium text-sm">Query</h3>
                <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-60">
                  {selectedExecution.queryText}
                </pre>
              </div>

              {selectedExecution.parameters && (
                <div>
                  <h3 className="font-medium text-sm">Parameters</h3>
                  <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify(selectedExecution.parameters, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
