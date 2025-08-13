"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReportMetadata } from "../../hooks/useReportMetadata";
import { useReportOperations } from "../../hooks/useReportOperations";
import { DomainSelector } from "./DomainSelector";
import { FieldSelector } from "./FieldSelector";
import { SimpleFilterBuilder } from "./SimpleFilterBuilder";
import { VisualizationConfigurator } from "./VisualizationConfigurator";
import { ReportSummary } from "./ReportSummary";
import { ReportPreview } from "../shared/ReportPreview";
import type { ReportConfig } from "../../types/report.types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function GuidedReportBuilder() {
  const [activeStep, setActiveStep] = useState(0);
  const [config, setConfig] = useState<ReportConfig>({
    domains: [],
    fields: {},
    filters: [],
    sorts: [],
    limit: 100,
    includeRelationships: false,
  });

  const {
    metadata,
    loading: metadataLoading,
    error: metadataError,
  } = useReportMetadata();
  const { generateReport } = useReportOperations();

  const handleConfigChange = (updates: Partial<ReportConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    setActiveStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  };

  const handleGenerateReport = async () => {
    try {
      const job = await generateReport(config);
      toast.success("Report generation started");
      return job;
    } catch (error) {
      toast.error("Failed to generate report");
      console.error(error);
      return null;
    }
  };

  const steps = [
    {
      title: "Select Data",
      description: "Choose which data domains to include",
      component: (
        <DomainSelector
          metadata={metadata}
          selectedDomains={config.domains}
          onChange={domains => handleConfigChange({ domains })}
        />
      ),
    },
    {
      title: "Choose Fields",
      description: "Select the fields to include in your report",
      component: (
        <FieldSelector
          metadata={metadata}
          selectedDomains={config.domains}
          selectedFields={config.fields}
          onChange={(domains, fields) =>
            handleConfigChange({ domains, fields })
          }
        />
      ),
    },
    {
      title: "Add Filters",
      description: "Filter your data to show exactly what you need",
      component: (
        <SimpleFilterBuilder
          metadata={metadata}
          selectedDomains={config.domains}
          filters={config.filters}
          onChange={filters => handleConfigChange({ filters })}
        />
      ),
    },
    {
      title: "Visualize",
      description: "Choose how to display your report data",
      component: (
        <VisualizationConfigurator
          config={config}
          onChange={visualization => handleConfigChange({ visualization })}
        />
      ),
    },
    {
      title: "Review & Save",
      description: "Review your report and save it as a template",
      component: (
        <ReportSummary config={config} onSave={handleGenerateReport} />
      ),
    },
  ];

  // Show loading state while metadata is being fetched
  if (metadataLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Loading report builder...</p>
      </div>
    );
  }

  // Show error state if metadata failed to load
  if (metadataError || !metadata) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="text-destructive mb-4 text-5xl">⚠️</div>
        <h3 className="text-xl font-medium mb-2">
          Failed to load report builder
        </h3>
        <p className="text-muted-foreground mb-6">
          {metadataError || "Could not load report metadata"}
        </p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Tabs value={`step-${activeStep}`} className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          {steps.map((step, index) => (
            <TabsTrigger
              key={index}
              value={`step-${index}`}
              onClick={() => setActiveStep(index)}
              disabled={index > 0 && config.domains.length === 0}
              className="flex flex-col gap-1 h-auto py-2"
            >
              <span className="font-medium">{step.title}</span>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {step.description}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {steps.map((step, index) => (
          <TabsContent key={index} value={`step-${index}`} className="mt-6">
            <Card className="p-6">{step.component}</Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={activeStep === 0}
        >
          Back
        </Button>

        <Button
          onClick={
            activeStep === steps.length - 1 ? handleGenerateReport : handleNext
          }
          disabled={
            (activeStep === 0 && config.domains.length === 0) ||
            (activeStep === 1 &&
              Object.values(config.fields).flat().length === 0)
          }
        >
          {activeStep === steps.length - 1 ? "Generate Report" : "Next"}
        </Button>
      </div>

      {activeStep > 0 && config.domains.length > 0 && (
        <Card className="mt-4 p-4">
          <h3 className="text-lg font-medium mb-4">Preview</h3>
          <ReportPreview config={config} />
        </Card>
      )}
    </div>
  );
}
