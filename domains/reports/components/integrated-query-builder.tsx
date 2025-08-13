"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useCustomQueryTemplates } from "../hooks/useCustomQueryTemplates";
import { QueryAuditViewer } from "./audit/QueryAuditViewer";
import { GraphQLQueryBuilder } from "./graphql-builder/GraphQLQueryBuilder";
import { QueryTemplateManager } from "./templates/QueryTemplateManager";

export function IntegratedQueryBuilder() {
  const [activeTab, setActiveTab] = useState("builder");
  const [currentQuery, setCurrentQuery] = useState("");
  const { toast } = useToast();
  const { saveTemplate, templates, loading } = useCustomQueryTemplates();

  const handleSaveTemplate = async (
    query: string,
    name: string,
    variables: Record<string, any>
  ) => {
    try {
      await saveTemplate({
        name,
        queryType: "GraphQL",
        queryText: query,
        parameters: Object.entries(variables).map(([name, value]) => ({
          name,
          type: typeof value,
          isRequired: true,
          defaultValue: value,
        })),
        isPublic: false,
      });

      toast({
        title: "Template saved",
        description: `Query template "${name}" has been saved successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error saving template",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleSelectTemplate = (template: any) => {
    setCurrentQuery(template.queryText);
    setActiveTab("builder");
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="builder">Query Builder</TabsTrigger>
          <TabsTrigger value="templates">Saved Templates</TabsTrigger>
          <TabsTrigger value="history">Execution History</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Query Builder</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <GraphQLQueryBuilder
                initialQuery={currentQuery}
                onSave={handleSaveTemplate}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Saved Query Templates</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <QueryTemplateManager
                templates={templates}
                loading={loading}
                onSelect={handleSelectTemplate}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Query Execution History</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <QueryAuditViewer limit={50} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
