import { Plus, Trash2, Calculator } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Aggregation,
  AggregationFunction,
  GroupBy,
  CalculatedField,
} from "../../types/filter.types";

interface AggregationBuilderProps {
  availableFields: Record<string, { name: string; type: string }>;
  aggregations: Aggregation[];
  groupBy: GroupBy[];
  calculatedFields: CalculatedField[];
  onChange: (
    aggregations: Aggregation[],
    groupBy: GroupBy[],
    calculatedFields: CalculatedField[]
  ) => void;
  className?: string;
}

export function AggregationBuilder({
  availableFields,
  aggregations,
  groupBy,
  calculatedFields,
  onChange,
  className,
}: AggregationBuilderProps) {
  const [showCalculatedFieldDialog, setShowCalculatedFieldDialog] =
    useState(false);
  const [newCalculatedField, setNewCalculatedField] = useState<
    Partial<CalculatedField>
  >({
    name: "",
    expression: "",
    referencedFields: [],
  });

  const addAggregation = () => {
    const newAggregations: Aggregation[] = [
      ...aggregations,
      {
        name: "",
        function: "sum" as AggregationFunction,
        field: "",
      },
    ];
    onChange(newAggregations, groupBy, calculatedFields);
  };

  const updateAggregation = (index: number, updates: Partial<Aggregation>) => {
    const newAggregations = [...aggregations];
    newAggregations[index] = { ...newAggregations[index], ...updates };
    onChange(newAggregations, groupBy, calculatedFields);
  };

  const removeAggregation = (index: number) => {
    const newAggregations = aggregations.filter((_, i) => i !== index);
    onChange(newAggregations, groupBy, calculatedFields);
  };

  const addGroupBy = () => {
    const newGroupBy = [...groupBy, { field: "" }];
    onChange(aggregations, newGroupBy, calculatedFields);
  };

  const updateGroupBy = (index: number, updates: Partial<GroupBy>) => {
    const newGroupBy = [...groupBy];
    newGroupBy[index] = { ...newGroupBy[index], ...updates };
    onChange(aggregations, newGroupBy, calculatedFields);
  };

  const removeGroupBy = (index: number) => {
    const newGroupBy = groupBy.filter((_, i) => i !== index);
    onChange(aggregations, newGroupBy, calculatedFields);
  };

  const addCalculatedField = () => {
    if (!newCalculatedField.name || !newCalculatedField.expression) return;

    const newCalculatedFields = [
      ...calculatedFields,
      {
        name: newCalculatedField.name,
        expression: newCalculatedField.expression,
        referencedFields: newCalculatedField.referencedFields || [],
      } as CalculatedField,
    ];
    onChange(aggregations, groupBy, newCalculatedFields);
    setShowCalculatedFieldDialog(false);
    setNewCalculatedField({ name: "", expression: "", referencedFields: [] });
  };

  const removeCalculatedField = (index: number) => {
    const newCalculatedFields = calculatedFields.filter((_, i) => i !== index);
    onChange(aggregations, groupBy, newCalculatedFields);
  };

  return (
    <div className={className}>
      {/* Aggregations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Aggregations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aggregations.map((agg, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={agg.name}
                  onChange={e =>
                    updateAggregation(index, { name: e.target.value })
                  }
                  placeholder="Name"
                  className="w-[200px]"
                />

                <Select
                  value={agg.function}
                  onValueChange={value =>
                    updateAggregation(index, {
                      function: value as AggregationFunction,
                    })
                  }
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sum">Sum</SelectItem>
                    <SelectItem value="avg">Average</SelectItem>
                    <SelectItem value="min">Minimum</SelectItem>
                    <SelectItem value="max">Maximum</SelectItem>
                    <SelectItem value="count">Count</SelectItem>
                    <SelectItem value="countDistinct">
                      Count Distinct
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={agg.field}
                  onValueChange={value =>
                    updateAggregation(index, { field: value })
                  }
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

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAggregation(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button variant="outline" size="sm" onClick={addAggregation}>
              <Plus className="h-4 w-4 mr-2" />
              Add Aggregation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Group By */}
      <Card className="mt-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Group By</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {groupBy.map((group, index) => (
              <div key={index} className="flex items-center gap-2">
                <Select
                  value={group.field}
                  onValueChange={value =>
                    updateGroupBy(index, { field: value })
                  }
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

                {availableFields[group.field]?.type === "date" && (
                  <Select
                    value={group.timeUnit}
                    onValueChange={value =>
                      updateGroupBy(index, { timeUnit: value as any })
                    }
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Time unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="year">Year</SelectItem>
                      <SelectItem value="quarter">Quarter</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="day">Day</SelectItem>
                    </SelectContent>
                  </Select>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeGroupBy(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button variant="outline" size="sm" onClick={addGroupBy}>
              <Plus className="h-4 w-4 mr-2" />
              Add Group By
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Calculated Fields */}
      <Card className="mt-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Calculated Fields</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCalculatedFieldDialog(true)}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Add Calculation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {calculatedFields.map((field, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div>
                  <div className="font-medium">{field.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {field.expression}
                  </div>
                  <div className="flex gap-1 mt-1">
                    {field.referencedFields.map(ref => (
                      <Badge key={ref} variant="secondary">
                        {ref}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCalculatedField(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Calculated Field Dialog */}
      <Dialog
        open={showCalculatedFieldDialog}
        onOpenChange={setShowCalculatedFieldDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Calculated Field</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={newCalculatedField.name}
                onChange={e =>
                  setNewCalculatedField(prev => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="Enter field name"
              />
            </div>
            <div className="space-y-2">
              <Label>Expression</Label>
              <Input
                value={newCalculatedField.expression}
                onChange={e =>
                  setNewCalculatedField(prev => ({
                    ...prev,
                    expression: e.target.value,
                  }))
                }
                placeholder="Enter calculation expression"
              />
            </div>
            <div className="space-y-2">
              <Label>Referenced Fields</Label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(availableFields).map(([field, info]) => (
                  <div key={field} className="flex items-center gap-2">
                    <Switch
                      checked={newCalculatedField.referencedFields?.includes(
                        field
                      )}
                      onCheckedChange={checked => {
                        setNewCalculatedField(prev => ({
                          ...prev,
                          referencedFields: checked
                            ? [...(prev.referencedFields || []), field]
                            : prev.referencedFields?.filter(f => f !== field),
                        }));
                      }}
                    />
                    <span>{info.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCalculatedFieldDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={addCalculatedField}>Add Field</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
