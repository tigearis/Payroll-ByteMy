"use client";

import { useUser } from "@clerk/nextjs";
import {
  FileText,
  Download,
  Settings,
  Filter,
  SortAsc,
  SortDesc,
  Loader2,
  BarChart3,
  Database,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface ReportMetadata {
  availableFields: Record<string, string[]>;
  relationships: Record<string, Record<string, string>>;
  domains: string[];
}

interface ReportRequest {
  domains: string[];
  fields: Record<string, string[]>;
  filters?: Record<string, any>;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  limit?: number;
  includeRelationships?: boolean;
}

interface ReportResult {
  success: boolean;
  data: any[];
  metadata: {
    totalRecords: number;
    domains: string[];
    fields: Record<string, string[]>;
  };
}

export function ReportBuilder() {
  const { user } = useUser();
  const [metadata, setMetadata] = useState<ReportMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<ReportResult | null>(null);

  // Report configuration state
  const [selectedDomains, setSelectedDomains] = useState<string[]>(["clients"]);
  const [selectedFields, setSelectedFields] = useState<
    Record<string, string[]>
  >({
    clients: ["name", "contact_person", "active"],
  });
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [limit, setLimit] = useState<number>(100);
  const [includeRelationships, setIncludeRelationships] = useState(true);

  // Load metadata on component mount
  useEffect(() => {
    loadMetadata();
  }, []);

  const loadMetadata = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/reports/generate");
      if (!response.ok) {
        throw new Error("Failed to load report metadata");
      }
      const result = await response.json();
      setMetadata(result.data);
    } catch (error) {
      console.error("Error loading metadata:", error);
      toast.error("Failed to load report configuration");
    } finally {
      setLoading(false);
    }
  };

  const handleDomainToggle = (domain: string) => {
    setSelectedDomains(prev => {
      if (prev.includes(domain)) {
        // Remove domain and its fields
        const newDomains = prev.filter(d => d !== domain);
        const newFields = { ...selectedFields };
        delete newFields[domain];
        setSelectedFields(newFields);
        return newDomains;
      } else {
        // Add domain with default fields
        const newDomains = [...prev, domain];
        const defaultFields =
          metadata?.availableFields[domain]?.slice(0, 3) || [];
        setSelectedFields(prev => ({
          ...prev,
          [domain]: defaultFields,
        }));
        return newDomains;
      }
    });
  };

  const handleFieldToggle = (domain: string, field: string) => {
    setSelectedFields(prev => {
      const currentFields = prev[domain] || [];
      if (currentFields.includes(field)) {
        return {
          ...prev,
          [domain]: currentFields.filter(f => f !== field),
        };
      } else {
        return {
          ...prev,
          [domain]: [...currentFields, field],
        };
      }
    });
  };

  const handleSelectAllFields = (domain: string) => {
    const allFields = metadata?.availableFields[domain] || [];
    setSelectedFields(prev => ({
      ...prev,
      [domain]: allFields,
    }));
  };

  const handleClearAllFields = (domain: string) => {
    setSelectedFields(prev => ({
      ...prev,
      [domain]: [],
    }));
  };

  const generateReport = async () => {
    if (selectedDomains.length === 0) {
      toast.error("Please select at least one domain");
      return;
    }

    const hasFields = Object.values(selectedFields).some(
      fields => fields.length > 0
    );
    if (!hasFields) {
      toast.error("Please select at least one field");
      return;
    }

    setGenerating(true);
    try {
      const request: ReportRequest = {
        domains: selectedDomains,
        fields: selectedFields,
        filters: Object.keys(filters).length > 0 ? filters : undefined,
        sortBy: sortBy || undefined,
        sortOrder,
        limit,
        includeRelationships,
      };

      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate report");
      }

      const result: ReportResult = await response.json();
      setResult(result);
      toast.success(
        `Report generated with ${result.metadata.totalRecords} records`
      );
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate report"
      );
    } finally {
      setGenerating(false);
    }
  };

  const downloadCSV = () => {
    if (!result?.data || result.data.length === 0) {
      toast.error("No data to download");
      return;
    }

    try {
      // Convert data to CSV
      const headers = Object.keys(result.data[0]);
      const csvContent = [
        headers.join(","),
        ...result.data.map(row =>
          headers
            .map(header => {
              const value = row[header];
              // Escape commas and quotes in CSV
              if (
                typeof value === "string" &&
                (value.includes(",") || value.includes('"'))
              ) {
                return `"${value.replace(/"/g, '""')}"`;
              }
              return value || "";
            })
            .join(",")
        ),
      ].join("\n");

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("CSV file downloaded successfully");
    } catch (error) {
      console.error("Error downloading CSV:", error);
      toast.error("Failed to download CSV file");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading report configuration...</span>
      </div>
    );
  }

  if (!metadata) {
    return (
      <div className="p-8 text-center">
        <Database className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">
          Failed to load report configuration
        </h3>
        <p className="text-gray-600 mb-4">Please try refreshing the page</p>
        <Button onClick={loadMetadata}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Report Builder</h2>
        <p className="text-muted-foreground">
          Create custom reports by selecting domains, fields, and filters
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Report Configuration
              </CardTitle>
              <CardDescription>
                Select domains and fields for your report
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Domain Selection */}
              <div>
                <Label className="text-sm font-medium">Domains</Label>
                <div className="mt-2 space-y-2">
                  {metadata.domains.map(domain => (
                    <div key={domain} className="flex items-center space-x-2">
                      <Checkbox
                        id={`domain-${domain}`}
                        checked={selectedDomains.includes(domain)}
                        onCheckedChange={() => handleDomainToggle(domain)}
                      />
                      <Label
                        htmlFor={`domain-${domain}`}
                        className="text-sm font-medium capitalize"
                      >
                        {domain.replace("_", " ")}
                      </Label>
                      {selectedDomains.includes(domain) && (
                        <Badge variant="secondary" className="ml-auto">
                          {selectedFields[domain]?.length || 0} fields
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Field Selection */}
              {selectedDomains.map(domain => (
                <div key={domain}>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium capitalize">
                      {domain.replace("_", " ")} Fields
                    </Label>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSelectAllFields(domain)}
                      >
                        All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleClearAllFields(domain)}
                      >
                        None
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {metadata.availableFields[domain]?.map(field => (
                      <div key={field} className="flex items-center space-x-2">
                        <Checkbox
                          id={`field-${domain}-${field}`}
                          checked={
                            selectedFields[domain]?.includes(field) || false
                          }
                          onCheckedChange={() =>
                            handleFieldToggle(domain, field)
                          }
                        />
                        <Label
                          htmlFor={`field-${domain}-${field}`}
                          className="text-sm capitalize"
                        >
                          {field.replace("_", " ")}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <Separator />

              {/* Options */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-relationships"
                    checked={includeRelationships}
                    onCheckedChange={checked =>
                      setIncludeRelationships(checked as boolean)
                    }
                  />
                  <Label htmlFor="include-relationships" className="text-sm">
                    Include related data
                  </Label>
                </div>

                <div>
                  <Label htmlFor="limit" className="text-sm font-medium">
                    Record Limit
                  </Label>
                  <Input
                    id="limit"
                    type="number"
                    value={limit}
                    onChange={e => setLimit(parseInt(e.target.value) || 100)}
                    min="1"
                    max="10000"
                    className="mt-1"
                  />
                </div>
              </div>

              <Button
                onClick={generateReport}
                disabled={generating || selectedDomains.length === 0}
                className="w-full"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Filters and Sorting */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Sorting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sort-by" className="text-sm font-medium">
                  Sort By
                </Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select field to sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedDomains.map(domain =>
                      metadata.availableFields[domain]?.map(field => (
                        <SelectItem
                          key={`${domain}.${field}`}
                          value={`${domain}.${field}`}
                        >
                          {domain.replace("_", " ")} - {field.replace("_", " ")}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sort-order" className="text-sm font-medium">
                  Sort Order
                </Label>
                <Select
                  value={sortOrder}
                  onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">
                      <SortAsc className="h-4 w-4 mr-2" />
                      Ascending
                    </SelectItem>
                    <SelectItem value="desc">
                      <SortDesc className="h-4 w-4 mr-2" />
                      Descending
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-4">
          {result ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Report Results
                    </CardTitle>
                    <CardDescription>
                      {result.metadata.totalRecords} records from{" "}
                      {result.metadata.domains.join(", ")}
                    </CardDescription>
                  </div>
                  <Button onClick={downloadCSV} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        {result.data.length > 0 &&
                          Object.keys(result.data[0]).map(header => (
                            <th
                              key={header}
                              className="text-left p-2 font-medium"
                            >
                              {header.replace("_", " ")}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.data.slice(0, 10).map((row, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          {Object.values(row).map((value, cellIndex) => (
                            <td key={cellIndex} className="p-2">
                              {value?.toString() || ""}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {result.data.length > 10 && (
                    <p className="text-sm text-gray-600 mt-2">
                      Showing first 10 of {result.data.length} records. Download
                      CSV for full data.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Report Preview
                </CardTitle>
                <CardDescription>
                  Configure your report and click "Generate Report" to see
                  results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                  <p>No report generated yet</p>
                  <p className="text-sm">
                    Select domains and fields, then generate your report
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
