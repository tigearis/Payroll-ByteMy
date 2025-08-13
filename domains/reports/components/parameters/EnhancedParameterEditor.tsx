"use client";

import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface ParameterDefinition {
  name: string;
  type: string;
  entityType?: string;
  isRequired: boolean;
}

interface EnhancedParameterEditorProps {
  parameters: Record<string, any>;
  parameterDefinitions: ParameterDefinition[];
  onChange: (parameters: Record<string, any>) => void;
}

export function EnhancedParameterEditor({
  parameters,
  parameterDefinitions,
  onChange,
}: EnhancedParameterEditorProps) {
  const handleParameterChange = (name: string, value: any) => {
    onChange({
      ...parameters,
      [name]: value,
    });
  };

  return (
    <div className="space-y-4">
      {parameterDefinitions.map(param => (
        <div key={param.name} className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-4">
            <Label htmlFor={`param-${param.name}`} className="font-medium">
              {param.name}
              {param.isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="text-xs text-muted-foreground mt-1">
              {param.type}
              {param.entityType ? ` (${param.entityType})` : ""}
            </div>
          </div>

          <div className="col-span-8">
            {param.type === "boolean" ? (
              <div className="flex items-center space-x-2">
                <Switch
                  id={`param-${param.name}`}
                  checked={Boolean(parameters[param.name])}
                  onCheckedChange={checked =>
                    handleParameterChange(param.name, checked)
                  }
                />
                <Label htmlFor={`param-${param.name}`}>
                  {Boolean(parameters[param.name]) ? "True" : "False"}
                </Label>
              </div>
            ) : param.type === "date" ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {parameters[param.name]
                      ? parameters[param.name] instanceof Date
                        ? parameters[param.name].toLocaleDateString("en-AU")
                        : new Date(parameters[param.name]).toLocaleDateString(
                            "en-AU"
                          )
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={
                      parameters[param.name]
                        ? parameters[param.name] instanceof Date
                          ? parameters[param.name]
                          : new Date(parameters[param.name])
                        : undefined
                    }
                    onSelect={date => {
                      if (date) {
                        handleParameterChange(
                          param.name,
                          date.toISOString().split("T")[0]
                        );
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            ) : param.type === "number" ? (
              <Input
                id={`param-${param.name}`}
                type="number"
                value={parameters[param.name] || 0}
                onChange={e =>
                  handleParameterChange(
                    param.name,
                    e.target.value === "" ? 0 : Number(e.target.value)
                  )
                }
                className="w-full"
              />
            ) : (
              <Input
                id={`param-${param.name}`}
                value={parameters[param.name] || ""}
                onChange={e =>
                  handleParameterChange(param.name, e.target.value)
                }
                className="w-full"
                placeholder={`Enter ${param.name}`}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
