"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GuidedReportBuilder } from "@/domains/reports/components/guided-builder/GuidedReportBuilder";
import { AIAssistedQueryBuilder } from "@/domains/reports/components/ai-assisted/AIAssistedQueryBuilder";
import { GraphQLQueryBuilder } from "@/domains/reports/components/graphql-builder/GraphQLQueryBuilder";
import { SavedReportsList } from "@/domains/reports/components/shared/SavedReportsList";
import { AIQuerySuggestions } from "@/domains/reports/components/ai-assisted/AIQuerySuggestions";
import { useReportTemplates } from "@/domains/reports/hooks/useReportTemplates";
import type { ReportTemplate } from "@/domains/reports/types/report.types";

export function ReportBuilder() {
  const [activeTab, setActiveTab] = useState("guided");
  const [selectedTemplate, setSelectedTemplate] =
    useState<ReportTemplate | null>(null);
  const { templates } = useReportTemplates();

  const handleTemplateSelect = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setActiveTab("guided"); // Switch to guided builder when selecting a template
  };

  const handleQuerySelect = (query: string) => {
    setActiveTab("advanced");
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="guided">Guided Builder</TabsTrigger>
          <TabsTrigger value="ai">AI-Assisted</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Query Builder</TabsTrigger>
          <TabsTrigger value="saved">Saved Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="guided" className="mt-6">
          <GuidedReportBuilder />
        </TabsContent>

        <TabsContent value="ai" className="mt-6">
          <AIAssistedQueryBuilder />
        </TabsContent>

        <TabsContent value="advanced" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <Card className="p-4">
                <GraphQLQueryBuilder />
              </Card>
            </div>
            <div className="md:col-span-1">
              <AIQuerySuggestions onSelectQuery={handleQuerySelect} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
          <SavedReportsList onSelect={handleTemplateSelect} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
