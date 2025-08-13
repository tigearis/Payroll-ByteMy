"use client";

import { useState, useMemo } from "react";
import { Plus, X, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { createFilterCondition } from "../../types/filter.types";
import type {
  FilterGroup,
  FilterCondition,
  FilterOperator,
} from "../../types/filter.types";

interface SimpleFilterBuilderProps {
  metadata: any;
  selectedDomains: string[];
  filters: any[];
  onChange: (filters: any[]) => void;
}

interface FieldInfo {
  name: string;
  displayName: string;
  path: string;
  type: string;
  domain: string;
}

export function SimpleFilterBuilder({
  metadata,
  selectedDomains,
  filters,
  onChange,
}: SimpleFilterBuilderProps) {
  const [filterGroup, setFilterGroup] = useState<FilterGroup>(() => {
    // Initialize from existing filters if available
    if (
      filters &&
      filters.length > 0 &&
      typeof filters[0] === "object" &&
      "conjunction" in filters[0]
    ) {
      return filters[0] as FilterGroup;
    }

    return {
      conjunction: "AND",
      conditions: [],
    };
  });

  // Get available fields from selected domains
  const availableFields = useMemo(() => {
    if (!metadata?.domains) return [];

    return selectedDomains
      .flatMap(domain => {
        const domainData = metadata.domains[domain];
        if (!domainData?.fields) return [];

        return domainData.fields.map((field: any) => ({
          name: field.name,
          displayName: field.displayName || field.name,
          path: `${domain}.${field.name}`,
          type: field.type || "string",
          domain,
        }));
      })
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [metadata, selectedDomains]);

  const handleAddCondition = () => {
    if (availableFields.length === 0) return;

    const newCondition: FilterCondition = {
      field: availableFields[0].path,
      operator: "equals",
      value: "",
    };

    setFilterGroup(prev => ({
      ...prev,
      conditions: [...prev.conditions, newCondition],
    }));
  };

  const handleRemoveCondition = (index: number) => {
    setFilterGroup(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index),
    }));
  };

  const handleConditionChange = (
    index: number,
    updates: Partial<FilterCondition>
  ) => {
    setFilterGroup(prev => ({
      ...prev,
      conditions: prev.conditions.map((condition, i) => {
        if (i === index && "field" in condition) {
          return { ...condition, ...updates } as FilterCondition;
        }
        return condition;
      }),
    }));
  };

  const handleConjunctionChange = (conjunction: "AND" | "OR") => {
    setFilterGroup(prev => ({ ...prev, conjunction }));
  };

  const handleApplyFilters = () => {
    onChange([filterGroup]);
  };

  // Common filter presets based on available fields
  const filterPresets = useMemo(() => {
    const presets = [];

    // Check if we have date fields
    const dateFields = availableFields.filter(
      field =>
        field.type === "date" ||
        field.name.includes("date") ||
        field.name.includes("time")
    );

    if (dateFields.length > 0) {
      // Get current date values
      const today = new Date();
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      const firstDayOfLastMonth = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1
      );
      const lastDayOfLastMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        0
      );

      // Format dates in ISO format
      const todayStr = today.toISOString().split("T")[0];
      const firstDayOfMonthStr = firstDayOfMonth.toISOString().split("T")[0];
      const firstDayOfLastMonthStr = firstDayOfLastMonth
        .toISOString()
        .split("T")[0];
      const lastDayOfLastMonthStr = lastDayOfLastMonth
        .toISOString()
        .split("T")[0];

      presets.push({
        name: "Current month",
        filter: createFilterCondition(
          dateFields[0].path,
          "greaterThan",
          firstDayOfMonthStr
        ),
      });

      presets.push({
        name: "Last month",
        filter: createFilterCondition(
          dateFields[0].path,
          "between",
          firstDayOfLastMonthStr,
          lastDayOfLastMonthStr
        ),
      });
    }

    // Check if we have status fields
    const statusFields = availableFields.filter(
      field => field.name.includes("status") || field.name.includes("state")
    );

    if (statusFields.length > 0) {
      presets.push({
        name: "Active only",
        filter: createFilterCondition(statusFields[0].path, "equals", "active"),
      });

      presets.push({
        name: "Pending approval",
        filter: createFilterCondition(
          statusFields[0].path,
          "equals",
          "pending"
        ),
      });
    }

    // Check if we have boolean active/enabled fields
    const booleanFields = availableFields.filter(
      field =>
        field.type === "boolean" &&
        (field.name.includes("active") || field.name.includes("enabled"))
    );

    if (booleanFields.length > 0) {
      presets.push({
        name: "Active records only",
        filter: createFilterCondition(booleanFields[0].path, "equals", true),
      });
    }

    return presets;
  }, [availableFields]);

  // Get field info by path
  const getFieldByPath = (path: string) => {
    return availableFields.find(field => field.path === path);
  };

  // Get appropriate operators for a field type
  const getOperatorsForField = (fieldPath: string) => {
    const field = getFieldByPath(fieldPath);
    if (!field) return [];

    const commonOperators: Array<{ value: FilterOperator; label: string }> = [
      { value: "equals", label: "Equals" },
      { value: "notEquals", label: "Not Equals" },
      { value: "isNull", label: "Is Empty" },
      { value: "isNotNull", label: "Is Not Empty" },
    ];

    switch (field.type) {
      case "string":
        return [
          ...commonOperators,
          { value: "contains", label: "Contains" },
          { value: "notContains", label: "Does Not Contain" },
          { value: "startsWith", label: "Starts With" },
          { value: "endsWith", label: "Ends With" },
        ];
      case "number":
        return [
          ...commonOperators,
          { value: "greaterThan", label: "Greater Than" },
          { value: "lessThan", label: "Less Than" },
          { value: "between", label: "Between" },
        ];
      case "date":
        return [
          ...commonOperators,
          { value: "greaterThan", label: "After" },
          { value: "lessThan", label: "Before" },
          { value: "between", label: "Between" },
        ];
      case "boolean":
        return commonOperators;
      default:
        return commonOperators;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Filter Criteria</h3>
        <p className="text-sm text-muted-foreground">
          Add conditions to filter your report data
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label>Match</Label>
          <div className="inline-block w-[180px]">
            <Select
              value={filterGroup.conjunction}
              onValueChange={value =>
                handleConjunctionChange(value as "AND" | "OR")
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AND">ALL conditions (AND)</SelectItem>
                <SelectItem value="OR">ANY condition (OR)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleAddCondition}
          disabled={availableFields.length === 0}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Condition
        </Button>
      </div>

      {filterGroup.conditions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
          <Filter className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No filters added yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Add conditions to filter your report data
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={handleAddCondition}
            disabled={availableFields.length === 0}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Condition
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filterGroup.conditions.map((condition, index) => {
            if (!("field" in condition)) return null; // Skip nested groups for now

            const fieldInfo = getFieldByPath(condition.field);
            const operators = getOperatorsForField(condition.field);
            const isDateField =
              fieldInfo?.type === "date" || fieldInfo?.name.includes("date");
            const isBooleanField = fieldInfo?.type === "boolean";
            const needsValue =
              condition.operator !== "isNull" &&
              condition.operator !== "isNotNull";
            const needsSecondValue = condition.operator === "between";

            return (
              <Card key={index} className="p-4">
                <div className="flex flex-wrap gap-2">
                  <div className="w-[200px]">
                    <Select
                      value={condition.field}
                      onValueChange={value =>
                        handleConditionChange(index, { field: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableFields.map(field => (
                          <SelectItem key={field.path} value={field.path}>
                            {field.domain}: {field.displayName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-[150px]">
                    <Select
                      value={condition.operator}
                      onValueChange={value =>
                        handleConditionChange(index, {
                          operator: value as FilterOperator,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {operators.map(op => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {needsValue && (
                    <>
                      {isDateField ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-[150px] justify-start text-left font-normal"
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {condition.value
                                ? new Date(
                                    condition.value as string
                                  ).toLocaleDateString("en-AU")
                                : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={
                                condition.value
                                  ? new Date(condition.value as string)
                                  : undefined
                              }
                              onSelect={date =>
                                handleConditionChange(index, {
                                  value: date
                                    ? date.toISOString().split("T")[0]
                                    : "",
                                })
                              }
                            />
                          </PopoverContent>
                        </Popover>
                      ) : isBooleanField ? (
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={Boolean(condition.value)}
                            onCheckedChange={checked =>
                              handleConditionChange(index, { value: checked })
                            }
                          />
                          <Label>
                            {Boolean(condition.value) ? "True" : "False"}
                          </Label>
                        </div>
                      ) : (
                        <Input
                          value={(condition.value as string) || ""}
                          onChange={e =>
                            handleConditionChange(index, {
                              value: e.target.value,
                            })
                          }
                          className="w-[200px]"
                          placeholder="Value"
                        />
                      )}

                      {needsSecondValue && (
                        <>
                          <span className="text-muted-foreground">and</span>
                          {isDateField ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-[150px] justify-start text-left font-normal"
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {condition.valueEnd
                                    ? new Date(
                                        condition.valueEnd as string
                                      ).toLocaleDateString("en-AU")
                                    : "End date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <CalendarComponent
                                  mode="single"
                                  selected={
                                    condition.valueEnd
                                      ? new Date(condition.valueEnd as string)
                                      : undefined
                                  }
                                  onSelect={date =>
                                    handleConditionChange(index, {
                                      valueEnd: date
                                        ? date.toISOString().split("T")[0]
                                        : "",
                                    })
                                  }
                                />
                              </PopoverContent>
                            </Popover>
                          ) : (
                            <Input
                              value={(condition.valueEnd as string) || ""}
                              onChange={e =>
                                handleConditionChange(index, {
                                  valueEnd: e.target.value,
                                })
                              }
                              className="w-[200px]"
                              placeholder="End Value"
                            />
                          )}
                        </>
                      )}
                    </>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveCondition(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {filterPresets.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Common Filters</h4>
          <div className="flex flex-wrap gap-2">
            {filterPresets.map((preset, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => {
                  setFilterGroup(prev => ({
                    ...prev,
                    conditions: [...prev.conditions, preset.filter],
                  }));
                }}
              >
                {preset.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleApplyFilters}
          disabled={filterGroup.conditions.length === 0}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
