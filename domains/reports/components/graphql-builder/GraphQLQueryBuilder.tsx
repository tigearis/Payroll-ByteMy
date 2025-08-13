import { useApolloClient } from "@apollo/client";
import { gql } from "@apollo/client";
import { Loader2, Play, Save, Download, Copy } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeEditor } from "@/components/ui/code-editor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { extractParametersFromQuery } from "../../utils/query-utils";
import { EnhancedParameterEditor } from "../parameters/EnhancedParameterEditor";
import { SchemaExplorer } from "../schema-explorer/SchemaExplorer";

interface GraphQLQueryBuilderProps {
  initialQuery?: string;
  onSave?: (
    query: string,
    name: string,
    variables: Record<string, any>
  ) => Promise<void>;
}

export function GraphQLQueryBuilder({
  initialQuery = "",
  onSave,
}: GraphQLQueryBuilderProps) {
  const [query, setQuery] = useState(
    initialQuery ||
      `query MyQuery {
  # Start building your query here
  # Example:
  # users(limit: 10) {
  #   id
  #   name
  #   email
  # }
}`
  );

  const [variables, setVariables] = useState<Record<string, any>>({});
  const [parameterDefinitions, setParameterDefinitions] = useState<any[]>([]);
  const [results, setResults] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeTab, setActiveTab] = useState("query");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");

  const editorRef = useRef<any>(null);
  const { toast } = useToast();
  const apolloClient = useApolloClient();
  const [loading, setLoading] = useState(false);

  // Extract parameters when query changes
  useEffect(() => {
    const paramNames = extractParametersFromQuery(query);

    // Create parameter definitions for any new parameters
    const newDefinitions = paramNames.map(name => {
      const existing = parameterDefinitions.find(p => p.name === name);
      if (existing) return existing;

      // Try to infer the type from the name
      let type = "string";
      let entityType;

      if (name.toLowerCase().includes("id")) {
        type = "entity";

        // Try to infer entity type from parameter name
        if (name.toLowerCase().includes("client")) {
          entityType = "clients";
        } else if (name.toLowerCase().includes("payroll")) {
          entityType = "payrolls";
        } else if (
          name.toLowerCase().includes("staff") ||
          name.toLowerCase().includes("user")
        ) {
          entityType = "staff";
        } else if (name.toLowerCase().includes("department")) {
          entityType = "departments";
        }
      } else if (
        name.toLowerCase().includes("date") ||
        name.toLowerCase().includes("time")
      ) {
        type = "date";
      } else if (
        name.toLowerCase().includes("count") ||
        name.toLowerCase().includes("amount") ||
        name.toLowerCase().includes("number") ||
        name.toLowerCase().includes("limit")
      ) {
        type = "number";
      } else if (
        name.toLowerCase().includes("enabled") ||
        name.toLowerCase().includes("active") ||
        name.toLowerCase().includes("is")
      ) {
        type = "boolean";
      }

      return {
        name,
        type,
        entityType,
        isRequired: true,
      };
    });

    setParameterDefinitions(newDefinitions);

    // Initialize any missing variables
    const newVariables = { ...variables };
    paramNames.forEach(name => {
      if (newVariables[name] === undefined) {
        // Set default values based on type
        const def = newDefinitions.find(d => d.name === name);
        if (def) {
          if (def.type === "number") newVariables[name] = 0;
          else if (def.type === "boolean") newVariables[name] = false;
          else if (def.type === "date")
            newVariables[name] = new Date().toISOString();
          else if (def.type === "array") newVariables[name] = [];
          else newVariables[name] = "";
        }
      }
    });

    setVariables(newVariables);
  }, [query]);

  // No longer needed with simple CodeEditor

  const handleExecuteQuery = async () => {
    try {
      setIsExecuting(true);
      setLoading(true);

      // Replace parameters in the query
      let processedQuery = query;
      Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");

        // Handle different types of values
        let replacementValue;
        if (typeof value === "string") {
          if (value.trim() === "") {
            replacementValue = '""';
          } else {
            // Check if it's an ID reference or a string
            const def = parameterDefinitions.find(p => p.name === key);
            if (def && def.type === "entity") {
              replacementValue = `"${value}"`;
            } else {
              replacementValue = `"${value}"`;
            }
          }
        } else if (value === null) {
          replacementValue = "null";
        } else if (typeof value === "object" && value instanceof Date) {
          replacementValue = `"${value.toISOString()}"`;
        } else {
          replacementValue = JSON.stringify(value);
        }

        processedQuery = processedQuery.replace(regex, replacementValue);
      });

      // Execute the query using Apollo Client
      const result = await apolloClient.query({
        query: gql`${processedQuery}`,
        fetchPolicy: 'network-only', // Always fetch fresh data
        errorPolicy: 'all', // Return partial data even if there are errors
      });

      setResults({
        data: result.data,
        errors: result.errors || [],
        loading: false,
        networkStatus: result.networkStatus,
      });
      setActiveTab("results");
    } catch (error) {
      console.error("Error executing query:", error);
      toast({
        title: "Query execution failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
      setLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!templateName) {
      toast({
        title: "Template name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      if (onSave) {
        await onSave(query, templateName, variables);
        setShowSaveDialog(false);
        setTemplateName("");
        setTemplateDescription("");
        toast({
          title: "Template saved successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to save template",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleCopyResults = () => {
    if (results) {
      navigator.clipboard.writeText(JSON.stringify(results.data, null, 2));
      toast({
        title: "Results copied to clipboard",
      });
    }
  };

  const handleDownloadResults = () => {
    if (results) {
      const blob = new Blob([JSON.stringify(results.data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "query-results.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="query">Query</TabsTrigger>
            <TabsTrigger value="variables">Variables</TabsTrigger>
            <TabsTrigger value="schema">Schema</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSaveDialog(true)}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>

            <Button
              onClick={handleExecuteQuery}
              disabled={isExecuting || loading}
              size="sm"
            >
              {isExecuting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Execute
            </Button>
          </div>
        </div>

        <TabsContent value="query" className="mt-4">
          <div className="border rounded-md">
            <CodeEditor
              height="400px"
              language="graphql"
              value={query}
              onChange={setQuery}
            />
          </div>
        </TabsContent>

        <TabsContent value="variables" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Query Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              {parameterDefinitions.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No parameters detected in the query.
                  <div className="text-sm mt-2">
                    Use{" "}
                    <code className="bg-muted p-1 rounded">
                      {"{{paramName}}"}
                    </code>{" "}
                    syntax in your query to define parameters.
                  </div>
                </div>
              ) : (
                <EnhancedParameterEditor
                  parameters={variables}
                  parameterDefinitions={parameterDefinitions}
                  onChange={setVariables}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schema" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>GraphQL Schema Explorer</CardTitle>
            </CardHeader>
            <CardContent>
              <SchemaExplorer
                onSelectField={field => {
                  if (editorRef.current) {
                    editorRef.current.trigger("keyboard", "type", {
                      text: field,
                    });
                  }
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Query Results</CardTitle>
              {results && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyResults}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadResults}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {!results ? (
                <div className="text-center text-muted-foreground py-8">
                  Execute a query to see results
                </div>
              ) : (
                <div>
                  {results.metadata && (
                    <div className="mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <div>
                          {results.metadata.totalRows} rows returned in{" "}
                          {(results.executionTime / 1000).toFixed(2)}s
                          {results.fromCache && " (from cache)"}
                        </div>
                        {results.metadata.hasMoreRows && (
                          <div className="text-amber-500">
                            More rows available. Consider adding a limit to your
                            query.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="border rounded-md">
                    <CodeEditor
                      height="400px"
                      language="json"
                      value={JSON.stringify(results.data, null, 2)}
                      readOnly
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Template Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Query Template</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="template-name" className="text-sm font-medium">
                Template Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="template-name"
                value={templateName}
                onChange={e => setTemplateName(e.target.value)}
                placeholder="Enter a name for this template"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="template-description"
                className="text-sm font-medium"
              >
                Description
              </label>
              <Input
                id="template-description"
                value={templateDescription}
                onChange={e => setTemplateDescription(e.target.value)}
                placeholder="Optional description"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate}>Save Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
