"use client";

import { useState, useEffect, useMemo } from "react";
import { BarChart3, LineChart, PieChart, Table, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ReportPreview } from "../shared/ReportPreview";
import type { ReportConfig } from "../../types/report.types";

interface VisualizationConfiguratorProps {
  config: ReportConfig;
  onChange: (visualization: any) => void;
}

interface VisualizationOptions {
  type: string;
  options: {
    xAxis?: string;
    yAxis?: string;
    groupBy?: string;
    secondaryGroupBy?: string;
    showLegend?: boolean;
    showTotals?: boolean;
    colorScheme?: string;
    stacked?: boolean;
    limit?: number;
    sort?: {
      field: string;
      direction: "asc" | "desc";
    };
    dateFormat?: string;
    numberFormat?: string;
  };
}

export function VisualizationConfigurator({
  config,
  onChange,
}: VisualizationConfiguratorProps) {
  const [visualization, setVisualization] = useState<VisualizationOptions>({
    type: "table",
    options: {
      showTotals: true,
      showLegend: true,
      colorScheme: "default",
      limit: 100,
    },
  });

  // Get all available fields from the config
  const allFields = useMemo(() => {
    return Object.entries(config.fields || {}).flatMap(([domain, fields]) =>
      fields.map(field => ({
        path: `${domain}.${field}`,
        domain,
        field,
        label: `${domain}: ${field}`,
      }))
    );
  }, [config.fields]);

  // Categorize fields by likely type
  const fieldCategories = useMemo(() => {
    const dateFields = allFields.filter(
      f =>
        f.field.includes("date") ||
        f.field.includes("time") ||
        f.field.includes("created_at") ||
        f.field.includes("updated_at")
    );

    const numericFields = allFields.filter(
      f =>
        f.field.includes("amount") ||
        f.field.includes("total") ||
        f.field.includes("count") ||
        f.field.includes("price") ||
        f.field.includes("cost") ||
        f.field.includes("quantity") ||
        f.field.includes("number") ||
        f.field.includes("id")
    );

    const categoryFields = allFields.filter(
      f =>
        f.field.includes("name") ||
        f.field.includes("type") ||
        f.field.includes("category") ||
        f.field.includes("status") ||
        f.field.includes("state")
    );

    return { dateFields, numericFields, categoryFields };
  }, [allFields]);

  // Suggest visualization type based on selected fields
  useEffect(() => {
    const { dateFields, numericFields, categoryFields } = fieldCategories;
    const fieldCount = allFields.length;

    let suggestedType = "table";
    let suggestedOptions: any = {};

    if (fieldCount > 10) {
      suggestedType = "table";
    } else if (dateFields.length > 0 && numericFields.length > 0) {
      suggestedType = "line";
      suggestedOptions = {
        xAxis: dateFields[0].path,
        yAxis: numericFields[0].path,
      };
    } else if (numericFields.length > 0 && categoryFields.length > 0) {
      if (categoryFields.length === 1 && numericFields.length >= 1) {
        suggestedType = "pie";
        suggestedOptions = {
          groupBy: categoryFields[0].path,
          yAxis: numericFields[0].path,
        };
      } else {
        suggestedType = "bar";
        suggestedOptions = {
          xAxis: categoryFields[0].path,
          yAxis: numericFields[0].path,
        };
      }
    }

    // Only update if we haven't set a visualization type yet
    if (!visualization.options.xAxis && !visualization.options.yAxis) {
      setVisualization({
        type: suggestedType,
        options: {
          ...visualization.options,
          ...suggestedOptions,
        },
      });
    }
  }, [config.fields, fieldCategories, allFields, visualization.options]);

  // Update parent component when options change
  useEffect(() => {
    onChange(visualization);
  }, [visualization, onChange]);

  const handleTypeChange = (type: string) => {
    setVisualization(prev => ({
      ...prev,
      type,
    }));
  };

  const handleOptionChange = (key: string, value: any) => {
    setVisualization(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [key]: value,
      },
    }));
  };

  const colorSchemes = [
    { value: "default", label: "Default" },
    { value: "categorical", label: "Categorical" },
    { value: "sequential", label: "Sequential" },
    { value: "diverging", label: "Diverging" },
    { value: "monochrome", label: "Monochrome" },
  ];

  const dateFormats = [
    { value: "dd/MM/yyyy", label: "DD/MM/YYYY" },
    { value: "MM/dd/yyyy", label: "MM/DD/YYYY" },
    { value: "yyyy-MM-dd", label: "YYYY-MM-DD" },
    { value: "dd MMM yyyy", label: "DD Mon YYYY" },
    { value: "MMMM dd, yyyy", label: "Month DD, YYYY" },
  ];

  const numberFormats = [
    { value: "standard", label: "1,234.56" },
    { value: "compact", label: "1.2K" },
    { value: "percent", label: "12.34%" },
    { value: "currency", label: "$1,234.56" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Visualization</h3>
        <p className="text-sm text-muted-foreground">
          Choose how to display your report data
        </p>
      </div>

      <Tabs value={visualization.type} onValueChange={handleTypeChange}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="table" className="flex items-center">
            <Table className="h-4 w-4 mr-2" />
            Table
          </TabsTrigger>
          <TabsTrigger value="bar" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Bar Chart
          </TabsTrigger>
          <TabsTrigger value="line" className="flex items-center">
            <LineChart className="h-4 w-4 mr-2" />
            Line Chart
          </TabsTrigger>
          <TabsTrigger value="pie" className="flex items-center">
            <PieChart className="h-4 w-4 mr-2" />
            Pie Chart
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Table Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Show Row Totals</Label>
                  <Switch
                    checked={visualization.options.showTotals}
                    onCheckedChange={checked =>
                      handleOptionChange("showTotals", checked)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Group By</Label>
                  <Select
                    value={visualization.options.groupBy || ""}
                    onValueChange={value =>
                      handleOptionChange("groupBy", value || undefined)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {allFields.map(field => (
                        <SelectItem key={field.path} value={field.path}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <Select
                    value={visualization.options.sort?.field || ""}
                    onValueChange={value => {
                      if (!value) {
                        handleOptionChange("sort", undefined);
                      } else {
                        handleOptionChange("sort", {
                          field: value,
                          direction:
                            visualization.options.sort?.direction || "asc",
                        });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {allFields.map(field => (
                        <SelectItem key={field.path} value={field.path}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {visualization.options.sort?.field && (
                  <div className="space-y-2">
                    <Label>Sort Direction</Label>
                    <div className="flex space-x-2">
                      <Button
                        variant={
                          visualization.options.sort.direction === "asc"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          handleOptionChange("sort", {
                            ...visualization.options.sort,
                            direction: "asc",
                          })
                        }
                      >
                        <ArrowUp className="h-4 w-4 mr-2" />
                        Ascending
                      </Button>
                      <Button
                        variant={
                          visualization.options.sort.direction === "desc"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          handleOptionChange("sort", {
                            ...visualization.options.sort,
                            direction: "desc",
                          })
                        }
                      >
                        <ArrowDown className="h-4 w-4 mr-2" />
                        Descending
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Row Limit: {visualization.options.limit}</Label>
                  <Slider
                    defaultValue={[visualization.options.limit || 100]}
                    min={10}
                    max={500}
                    step={10}
                    onValueChange={value =>
                      handleOptionChange("limit", value[0])
                    }
                  />
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Label>Format Options</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Configure Display Formats
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Date Format</Label>
                        <Select
                          value={
                            visualization.options.dateFormat || "dd/MM/yyyy"
                          }
                          onValueChange={value =>
                            handleOptionChange("dateFormat", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {dateFormats.map(format => (
                              <SelectItem
                                key={format.value}
                                value={format.value}
                              >
                                {format.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Number Format</Label>
                        <Select
                          value={
                            visualization.options.numberFormat || "standard"
                          }
                          onValueChange={value =>
                            handleOptionChange("numberFormat", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {numberFormats.map(format => (
                              <SelectItem
                                key={format.value}
                                value={format.value}
                              >
                                {format.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bar">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Bar Chart Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>X-Axis (Categories)</Label>
                  <Select
                    value={visualization.options.xAxis || ""}
                    onValueChange={value => handleOptionChange("xAxis", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {allFields.map(field => (
                        <SelectItem key={field.path} value={field.path}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Y-Axis (Values)</Label>
                  <Select
                    value={visualization.options.yAxis || ""}
                    onValueChange={value => handleOptionChange("yAxis", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldCategories.numericFields.length > 0
                        ? fieldCategories.numericFields.map(field => (
                            <SelectItem key={field.path} value={field.path}>
                              {field.label}
                            </SelectItem>
                          ))
                        : allFields.map(field => (
                            <SelectItem key={field.path} value={field.path}>
                              {field.label}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Group By (Series)</Label>
                  <Select
                    value={visualization.options.secondaryGroupBy || ""}
                    onValueChange={value =>
                      handleOptionChange("secondaryGroupBy", value || undefined)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {allFields.map(field => (
                        <SelectItem key={field.path} value={field.path}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Color Scheme</Label>
                  <Select
                    value={visualization.options.colorScheme || "default"}
                    onValueChange={value =>
                      handleOptionChange("colorScheme", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorSchemes.map(scheme => (
                        <SelectItem key={scheme.value} value={scheme.value}>
                          {scheme.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Show Legend</Label>
                  <Switch
                    checked={visualization.options.showLegend}
                    onCheckedChange={checked =>
                      handleOptionChange("showLegend", checked)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Stacked</Label>
                  <Switch
                    checked={visualization.options.stacked}
                    onCheckedChange={checked =>
                      handleOptionChange("stacked", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="line">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Line Chart Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>X-Axis (Time)</Label>
                  <Select
                    value={visualization.options.xAxis || ""}
                    onValueChange={value => handleOptionChange("xAxis", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldCategories.dateFields.length > 0
                        ? fieldCategories.dateFields.map(field => (
                            <SelectItem key={field.path} value={field.path}>
                              {field.label}
                            </SelectItem>
                          ))
                        : allFields.map(field => (
                            <SelectItem key={field.path} value={field.path}>
                              {field.label}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Y-Axis (Values)</Label>
                  <Select
                    value={visualization.options.yAxis || ""}
                    onValueChange={value => handleOptionChange("yAxis", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldCategories.numericFields.length > 0
                        ? fieldCategories.numericFields.map(field => (
                            <SelectItem key={field.path} value={field.path}>
                              {field.label}
                            </SelectItem>
                          ))
                        : allFields.map(field => (
                            <SelectItem key={field.path} value={field.path}>
                              {field.label}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Group By (Series)</Label>
                  <Select
                    value={visualization.options.groupBy || ""}
                    onValueChange={value =>
                      handleOptionChange("groupBy", value || undefined)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {fieldCategories.categoryFields.length > 0
                        ? fieldCategories.categoryFields.map(field => (
                            <SelectItem key={field.path} value={field.path}>
                              {field.label}
                            </SelectItem>
                          ))
                        : allFields.map(field => (
                            <SelectItem key={field.path} value={field.path}>
                              {field.label}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Color Scheme</Label>
                  <Select
                    value={visualization.options.colorScheme || "default"}
                    onValueChange={value =>
                      handleOptionChange("colorScheme", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorSchemes.map(scheme => (
                        <SelectItem key={scheme.value} value={scheme.value}>
                          {scheme.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Show Legend</Label>
                  <Switch
                    checked={visualization.options.showLegend}
                    onCheckedChange={checked =>
                      handleOptionChange("showLegend", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pie">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pie Chart Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category Field (Segments)</Label>
                  <Select
                    value={visualization.options.groupBy || ""}
                    onValueChange={value =>
                      handleOptionChange("groupBy", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldCategories.categoryFields.length > 0
                        ? fieldCategories.categoryFields.map(field => (
                            <SelectItem key={field.path} value={field.path}>
                              {field.label}
                            </SelectItem>
                          ))
                        : allFields.map(field => (
                            <SelectItem key={field.path} value={field.path}>
                              {field.label}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Value Field</Label>
                  <Select
                    value={visualization.options.yAxis || ""}
                    onValueChange={value => handleOptionChange("yAxis", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldCategories.numericFields.length > 0
                        ? fieldCategories.numericFields.map(field => (
                            <SelectItem key={field.path} value={field.path}>
                              {field.label}
                            </SelectItem>
                          ))
                        : allFields.map(field => (
                            <SelectItem key={field.path} value={field.path}>
                              {field.label}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Color Scheme</Label>
                  <Select
                    value={visualization.options.colorScheme || "default"}
                    onValueChange={value =>
                      handleOptionChange("colorScheme", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorSchemes.map(scheme => (
                        <SelectItem key={scheme.value} value={scheme.value}>
                          {scheme.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Show Legend</Label>
                  <Switch
                    checked={visualization.options.showLegend}
                    onCheckedChange={checked =>
                      handleOptionChange("showLegend", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <h4 className="text-sm font-medium mb-2">Preview</h4>
        <Card className="p-4">
          <ReportPreview config={{ ...config, visualization }} />
        </Card>
      </div>
    </div>
  );
}
