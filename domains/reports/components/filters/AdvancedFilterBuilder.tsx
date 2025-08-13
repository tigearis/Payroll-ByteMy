import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FilterGroup,
  FilterCondition,
  FilterOperator,
  FilterConjunction,
  createFilterCondition,
  createFilterGroup,
} from "../../types/filter.types";

interface AdvancedFilterBuilderProps {
  availableFields: Record<string, { name: string; type: string }>;
  filter: FilterGroup;
  onChange: (filter: FilterGroup) => void;
  className?: string;
}

export function AdvancedFilterBuilder({
  availableFields,
  filter,
  onChange,
  className,
}: AdvancedFilterBuilderProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const updateCondition = (
    path: number[],
    updates: Partial<FilterCondition>
  ) => {
    const newFilter = { ...filter };
    let current: any = newFilter;

    // Navigate to the parent group
    for (let i = 0; i < path.length - 1; i++) {
      current = current.conditions[path[i]];
    }

    // Update the condition
    const lastIndex = path[path.length - 1];
    current.conditions[lastIndex] = {
      ...current.conditions[lastIndex],
      ...updates,
    };

    onChange(newFilter);
  };

  const addCondition = (path: number[]) => {
    const newFilter = { ...filter };
    let current: any = newFilter;

    // Navigate to the target group
    for (const index of path) {
      current = current.conditions[index];
    }

    // Add new condition
    current.conditions.push(createFilterCondition("", "equals"));

    onChange(newFilter);
  };

  const addGroup = (path: number[]) => {
    const newFilter = { ...filter };
    let current: any = newFilter;

    // Navigate to the target group
    for (const index of path) {
      current = current.conditions[index];
    }

    // Add new group
    current.conditions.push(createFilterGroup("AND"));

    onChange(newFilter);
  };

  const removeItem = (path: number[]) => {
    const newFilter = { ...filter };
    let current: any = newFilter;

    // Navigate to the parent group
    for (let i = 0; i < path.length - 1; i++) {
      current = current.conditions[path[i]];
    }

    // Remove the item
    const lastIndex = path[path.length - 1];
    current.conditions.splice(lastIndex, 1);

    onChange(newFilter);
  };

  const updateConjunction = (
    path: number[],
    conjunction: FilterConjunction
  ) => {
    const newFilter = { ...filter };
    let current: any = newFilter;

    // Navigate to the target group
    for (const index of path) {
      current = current.conditions[index];
    }

    current.conjunction = conjunction;
    onChange(newFilter);
  };

  const renderFilterItem = (
    item: FilterCondition | FilterGroup,
    path: number[]
  ) => {
    if ("conditions" in item) {
      // Render filter group
      const groupId = path.join("-");
      const isExpanded = expandedGroups.has(groupId);

      return (
        <Card key={groupId} className="mt-2">
          <CardHeader className="p-3">
            <div className="flex items-center gap-2">
              <CollapsibleTrigger
                onClick={() => toggleGroup(groupId)}
                className="hover:bg-accent p-1 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
              <Select
                value={item.conjunction}
                onValueChange={(value: FilterConjunction) =>
                  updateConjunction(path, value)
                }
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AND">AND</SelectItem>
                  <SelectItem value="OR">OR</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(path)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="p-3 pt-0">
              {item.conditions.map((condition, index) =>
                renderFilterItem(condition, [...path, index])
              )}
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addCondition(path)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Condition
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addGroup(path)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Group
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      );
    } else {
      // Render filter condition
      return (
        <div key={path.join("-")} className="flex items-center gap-2 mt-2">
          <Select
            value={item.field}
            onValueChange={value => updateCondition(path, { field: value })}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select field" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(availableFields).map(([field, info]) => (
                <SelectItem key={field} value={field}>
                  {info.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={item.operator}
            onValueChange={value =>
              updateCondition(path, {
                operator: value as FilterOperator,
              })
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Operator" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="equals">Equals</SelectItem>
              <SelectItem value="notEquals">Not Equals</SelectItem>
              <SelectItem value="contains">Contains</SelectItem>
              <SelectItem value="notContains">Not Contains</SelectItem>
              <SelectItem value="greaterThan">Greater Than</SelectItem>
              <SelectItem value="lessThan">Less Than</SelectItem>
              <SelectItem value="between">Between</SelectItem>
              <SelectItem value="in">In</SelectItem>
              <SelectItem value="notIn">Not In</SelectItem>
              <SelectItem value="isNull">Is Null</SelectItem>
              <SelectItem value="isNotNull">Is Not Null</SelectItem>
            </SelectContent>
          </Select>

          {!["isNull", "isNotNull"].includes(item.operator) && (
            <>
              <Input
                value={item.value || ""}
                onChange={e => updateCondition(path, { value: e.target.value })}
                className="w-[200px]"
                placeholder="Value"
              />
              {item.operator === "between" && (
                <Input
                  value={item.valueEnd || ""}
                  onChange={e =>
                    updateCondition(path, { valueEnd: e.target.value })
                  }
                  className="w-[200px]"
                  placeholder="End Value"
                />
              )}
            </>
          )}

          <Button variant="ghost" size="sm" onClick={() => removeItem(path)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    }
  };

  return (
    <div className={className}>
      <Collapsible defaultOpen className="space-y-2">
        {renderFilterItem(filter, [])}
      </Collapsible>
    </div>
  );
}
