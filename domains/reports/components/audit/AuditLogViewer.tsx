import { useAuth } from "@clerk/nextjs";
import { format } from "date-fns";
import {
  Search,
  AlertTriangle,
  Clock,
  Download,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRole } from "@/hooks/use-permissions";
import {
  AuditEvent,
  AuditEventType,
  AuditSeverity,
} from "../../types/audit.types";

interface AuditLogViewerProps {
  events: AuditEvent[];
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  className?: string;
}

export function AuditLogViewer({
  events,
  onLoadMore,
  hasMore,
  loading,
  className,
}: AuditLogViewerProps) {
  const { isConsultantOrAbove } = useRole();
  const { userId } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEventType, setSelectedEventType] = useState<
    AuditEventType | ""
  >("");
  const [selectedSeverity, setSelectedSeverity] = useState<AuditSeverity | "">(
    ""
  );
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);

  const toggleEvent = (eventId: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch =
      searchTerm === "" ||
      event.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.resource.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.resource.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      selectedEventType === "" || event.eventType === selectedEventType;

    const matchesSeverity =
      selectedSeverity === "" || event.severity === selectedSeverity;

    return matchesSearch && matchesType && matchesSeverity;
  });

  const getSeverityColor = (severity: AuditSeverity) => {
    const colors: Record<AuditSeverity, string> = {
      INFO: "bg-blue-100 text-blue-800",
      WARNING: "bg-yellow-100 text-yellow-800",
      ERROR: "bg-red-100 text-red-800",
      CRITICAL: "bg-purple-100 text-purple-800",
    };
    return colors[severity];
  };

  const downloadAuditLog = () => {
    const csv = [
      [
        "Timestamp",
        "Event Type",
        "Severity",
        "User ID",
        "Resource Type",
        "Resource ID",
        "Details",
      ].join(","),
      ...filteredEvents.map(event =>
        [
          format(event.timestamp, "yyyy-MM-dd HH:mm:ss"),
          event.eventType,
          event.severity,
          event.context.userId,
          event.resource.type,
          event.resource.id,
          JSON.stringify(event.details),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={className}>
      {/* Filters */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search audit logs..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <Select
          value={selectedEventType}
          onValueChange={value => setSelectedEventType(value as AuditEventType)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Event Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Events</SelectItem>
            <SelectItem value="REPORT_GENERATED">Report Generated</SelectItem>
            <SelectItem value="REPORT_DOWNLOADED">Report Downloaded</SelectItem>
            <SelectItem value="FIELD_ACCESS_DENIED">Access Denied</SelectItem>
            <SelectItem value="SECURITY_POLICY_UPDATED">
              Policy Updated
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={selectedSeverity}
          onValueChange={value => setSelectedSeverity(value as AuditSeverity)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Severities</SelectItem>
            <SelectItem value="INFO">Info</SelectItem>
            <SelectItem value="WARNING">Warning</SelectItem>
            <SelectItem value="ERROR">Error</SelectItem>
            <SelectItem value="CRITICAL">Critical</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={downloadAuditLog}
          title="Download CSV"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {/* Events List */}
      <ScrollArea className="h-[600px]">
        <div className="space-y-2">
          {filteredEvents.map(event => (
            <Card key={event.id} className="relative">
              <CollapsibleTrigger
                onClick={() => toggleEvent(event.id)}
                className="w-full"
              >
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {event.severity !== "INFO" && (
                        <AlertTriangle
                          className={`h-4 w-4 ${
                            event.severity === "CRITICAL"
                              ? "text-red-500"
                              : "text-yellow-500"
                          }`}
                        />
                      )}
                      <Badge
                        className={getSeverityColor(event.severity)}
                        variant="secondary"
                      >
                        {event.severity}
                      </Badge>
                      <CardTitle className="text-sm font-medium">
                        {event.eventType}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {format(event.timestamp, "MMM d, yyyy HH:mm:ss")}
                      </div>
                      {expandedEvents.has(event.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-0 pb-3">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Resource</div>
                        <div className="mt-1">
                          <Badge variant="outline">{event.resource.type}</Badge>
                          <span className="ml-2">{event.resource.id}</span>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">User</div>
                        <div className="mt-1">
                          <span>{event.context.userId}</span>
                          {event.context.roles && (
                            <div className="flex gap-1 mt-1">
                              {event.context.roles.map(role => (
                                <Badge
                                  key={role}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="font-medium mb-2">Details</div>
                      <pre className="text-sm bg-muted p-2 rounded overflow-auto">
                        {JSON.stringify(event.details, null, 2)}
                      </pre>
                    </div>

                    {event.metadata && (
                      <div>
                        <div className="font-medium mb-2">Metadata</div>
                        <div className="text-sm text-muted-foreground">
                          <div>IP: {event.context.ipAddress}</div>
                          <div>User Agent: {event.context.userAgent}</div>
                          {Object.entries(event.metadata).map(
                            ([key, value]) => (
                              <div key={key}>
                                {key}: {String(value)}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedEvent(event)}
                      >
                        View Full Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          ))}

          {hasMore && (
            <div className="flex justify-center py-4">
              <Button variant="outline" onClick={onLoadMore} disabled={loading}>
                {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Event Details Dialog */}
      <Dialog
        open={selectedEvent !== null}
        onOpenChange={() => setSelectedEvent(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit Event Details</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <pre className="text-sm bg-muted p-4 rounded overflow-auto">
                {JSON.stringify(selectedEvent, null, 2)}
              </pre>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
