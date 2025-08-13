import { Plus, X, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ReportMetadata,
  ReportFilter,
  ReportSort,
} from "../../types/report.types";
// FilterOperator type is inferred from ReportFilter

interface FilterBuilderProps {
  metadata: ReportMetadata;
  selectedDomains: string[];
  filters: ReportFilter[];
  sorts: ReportSort[];
  onChange: (filters: ReportFilter[], sorts: ReportSort[]) => void;
  className?: string;
}

const OPERATORS = [
  { value: "equals", label: "Equals" },
  { value: "notEquals", label: "Not Equals" },
  { value: "contains", label: "Contains" },
  { value: "notContains", label: "Not Contains" },
  { value: "greaterThan", label: "Greater Than" },
  { value: "lessThan", label: "Less Than" },
  { value: "between", label: "Between" },
  { value: "in", label: "In" },
  { value: "notIn", label: "Not In" },
  { value: "isNull", label: "Is Null" },
  { value: "isNotNull", label: "Is Not Null" },
];

export function FilterBuilder({
  metadata,
  selectedDomains,
  filters,
  sorts,
  onChange,
  className,
}: FilterBuilderProps) {
  const [newFilter, setNewFilter] = useState<Partial<ReportFilter>>({});
  const [newSort, setNewSort] = useState<Partial<ReportSort>>({});

  const availableFields = selectedDomains.reduce((acc, domain) => {
    const fields = metadata.availableFields?.[domain] || [];
    return {
      ...acc,
      ...Object.fromEntries(
        fields.map(field => [`${domain}.${field}`, `${domain}.${field}`])
      ),
    };
  }, {});

  const addFilter = () => {
    if (!newFilter.field || !newFilter.operator) return;

    const filter: ReportFilter = {
      field: newFilter.field,
      operator: newFilter.operator as ReportFilter["operator"],
      value: newFilter.value,
      conjunction: newFilter.conjunction || "AND",
    };

    onChange([...filters, filter], sorts);
    setNewFilter({});
  };

  const removeFilter = (index: number) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    onChange(newFilters, sorts);
  };

  const addSort = () => {
    if (!newSort.field || !newSort.direction) return;

    const sort: ReportSort = {
      field: newSort.field,
      direction: newSort.direction as "asc" | "desc",
    };

    onChange(filters, [...sorts, sort]);
    setNewSort({});
  };

  const removeSort = (index: number) => {
    const newSorts = [...sorts];
    newSorts.splice(index, 1);
    onChange(filters, newSorts);
  };

  return (
    <div className={className}>
      {/* Filters Section */}
      <div className="space-y-4">
        <h3 className="font-medium">Filters</h3>

        {/* Active Filters */}
        <div className="space-y-2">
          {filters.map((filter, index) => (
            <Card key={index} className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{filter.field}</Badge>
                <span className="text-sm">{filter.operator}</span>
                {filter.value && (
                  <Badge variant="secondary">{filter.value}</Badge>
                )}
                {filter.conjunction && (
                  <Badge variant="outline">{filter.conjunction}</Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFilter(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>

        {/* New Filter */}
        <div className="flex items-center gap-2">
          <Select
            value={newFilter.field}
            onValueChange={value =>
              setNewFilter(prev => ({ ...prev, field: value }))
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select field" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(availableFields).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {String(label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={newFilter.operator}
            onValueChange={value =>
              setNewFilter(prev => ({ ...prev, operator: value as ReportFilter['operator'] }))
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Operator" />
            </SelectTrigger>
            <SelectContent>
              {OPERATORS.map(op => (
                <SelectItem key={op.value} value={op.value}>
                  {op.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {newFilter.operator &&
            !["isNull", "isNotNull"].includes(newFilter.operator) && (
              <Input
                placeholder="Value"
                value={newFilter.value || ""}
                onChange={e =>
                  setNewFilter(prev => ({ ...prev, value: e.target.value }))
                }
                className="w-[200px]"
              />
            )}

          <Button
            variant="secondary"
            size="icon"
            onClick={addFilter}
            disabled={!newFilter.field || !newFilter.operator}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Sorting Section */}
      <div className="space-y-4 mt-8">
        <h3 className="font-medium">Sorting</h3>

        {/* Active Sorts */}
        <div className="space-y-2">
          {sorts.map((sort, index) => (
            <Card key={index} className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{sort.field}</Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <ArrowUpDown className="h-3 w-3" />
                  {sort.direction}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSort(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>

        {/* New Sort */}
        <div className="flex items-center gap-2">
          <Select
            value={newSort.field}
            onValueChange={value =>
              setNewSort(prev => ({ ...prev, field: value }))
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select field" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(availableFields).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {String(label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={newSort.direction}
            onValueChange={value =>
              setNewSort(prev => ({ ...prev, direction: value as "asc" | "desc" }))
            }
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="secondary"
            size="icon"
            onClick={addSort}
            disabled={!newSort.field || !newSort.direction}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
