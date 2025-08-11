import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ShieldAlert, RefreshCcw } from "lucide-react";
import { useReportOperations } from "../../hooks/useReportOperations";
import { useReportMetadata } from "../../hooks/useReportMetadata";
import { FieldSelector } from "./FieldSelector";
import { AdvancedFilterBuilder } from "../filters/AdvancedFilterBuilder";
import { AggregationBuilder } from "../aggregations/AggregationBuilder";
import { PreviewPane } from "./PreviewPane";
import { TemplateManager } from "../templates/TemplateManager";
import type { ReportConfig, ReportTemplate } from "../../types/report.types";
import type {
  FilterGroup,
  Aggregation,
  GroupBy,
  CalculatedField,
} from "../../types/filter.types";

export function ReportBuilder() {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const {
    metadata,
    error: metadataError,
    loading: metadataLoading,
    refresh: refreshMetadata,
  } = useReportMetadata();
  const { generateReport, templates, templatesLoading } = useReportOperations();

  const [activeTab, setActiveTab] = useState("fields");
  const [config, setConfig] = useState<ReportConfig>({
    domains: [],
    fields: {},
    filters: [],
    sorts: [],
    limit: 100,
    includeRelationships: false,
  });

  const [filter, setFilter] = useState<FilterGroup>({
    conjunction: "AND",
    conditions: [],
  });

  const [aggregations, setAggregations] = useState<Aggregation[]>([]);
  const [groupBy, setGroupBy] = useState<GroupBy[]>([]);
  const [calculatedFields, setCalculatedFields] = useState<CalculatedField[]>(
    []
  );

  const handleConfigChange = (updates: Partial<ReportConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleTemplateSelect = (template: ReportTemplate) => {
    setConfig({
      domains: template.domains,
      fields: template.fields,
      filters: template.filters || [],
      sorts: template.sorts || [],
      limit: template.limit || 100,
      includeRelationships: false,
      template: template,
    });
  };

  const handleGenerateReport = async () => {
    try {
      const reportConfig = {
        ...config,
        filter,
        aggregations,
        groupBy,
        calculatedFields,
      };

      const job = await generateReport(reportConfig);
      toast.success("Report generation started");
      return job;
    } catch (error) {
      toast.error("Failed to generate report");
      console.error(error);
    }
  };

  // Handle authentication loading
  if (!authLoaded) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      </Card>
    );
  }

  // Handle not signed in
  if (!isSignedIn) {
    return (
      <Card className="p-6">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please sign in to access the reports system.
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  // Handle metadata loading
  if (metadataLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      </Card>
    );
  }

  // Handle metadata error
  if (metadataError || !metadata) {
    return (
      <Card className="p-6">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Access Error</AlertTitle>
          <AlertDescription>{metadataError}</AlertDescription>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshMetadata}
            className="mt-4"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </Alert>
      </Card>
    );
  }

  const availableFields = Object.fromEntries(
    Object.entries(metadata.availableFields)
      .map(([domain, fields]) =>
        fields.map(field => [
          `${domain}.${field}`,
          {
            name: `${domain}.${field}`,
            type: metadata.fieldTypes[field] || "string",
          },
        ])
      )
      .flat()
  );

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Configuration Panel */}
      <div className="col-span-5">
        <Card className="h-full">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="fields" className="flex-1">
                Fields
              </TabsTrigger>
              <TabsTrigger value="filters" className="flex-1">
                Filters
              </TabsTrigger>
              <TabsTrigger value="aggregations" className="flex-1">
                Aggregations
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex-1">
                Templates
              </TabsTrigger>
            </TabsList>

            <TabsContent value="fields" className="p-4">
              <FieldSelector
                metadata={metadata}
                selectedDomains={config.domains}
                selectedFields={config.fields}
                onChange={(domains, fields) =>
                  handleConfigChange({ domains, fields })
                }
              />
            </TabsContent>

            <TabsContent value="filters" className="p-4">
              <AdvancedFilterBuilder
                availableFields={availableFields}
                filter={filter}
                onChange={setFilter}
              />
            </TabsContent>

            <TabsContent value="aggregations" className="p-4">
              <AggregationBuilder
                availableFields={availableFields}
                aggregations={aggregations}
                groupBy={groupBy}
                calculatedFields={calculatedFields}
                onChange={(newAggs, newGroupBy, newCalcFields) => {
                  setAggregations(newAggs);
                  setGroupBy(newGroupBy);
                  setCalculatedFields(newCalcFields);
                }}
              />
            </TabsContent>

            <TabsContent value="templates" className="p-4">
              <TemplateManager
                templates={templates}
                onSelect={handleTemplateSelect}
                currentConfig={config}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Preview Panel */}
      <div className="col-span-7">
        <PreviewPane
          config={{
            ...config,
            filter,
            aggregations,
            groupBy,
            calculatedFields,
          }}
          onGenerateReport={handleGenerateReport}
          className="h-full"
        />
      </div>
    </div>
  );
}
