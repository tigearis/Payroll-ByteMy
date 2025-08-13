"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Star, StarOff, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FieldSelectorProps {
  metadata: any;
  selectedDomains: string[];
  selectedFields: Record<string, string[]>;
  onChange: (domains: string[], fields: Record<string, string[]>) => void;
}

interface FieldInfo {
  name: string;
  displayName: string;
  type: string;
  description: string;
  domain: string;
  recommended?: boolean;
  sensitive?: boolean;
}

export function FieldSelector({
  metadata,
  selectedDomains,
  selectedFields,
  onChange,
}: FieldSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all"); // Default to "all"
  const [showRecommendedOnly, setShowRecommendedOnly] = useState(false);

  // Update activeTab when selectedDomains changes
  useEffect(() => {
    if (selectedDomains.length > 0 && activeTab === "all") {
      setActiveTab(selectedDomains[0]);
    } else if (selectedDomains.length === 0) {
      setActiveTab("all");
    } else if (!selectedDomains.includes(activeTab) && activeTab !== "all") {
      setActiveTab(selectedDomains[0]);
    }
  }, [selectedDomains, activeTab]);

  // Debug logging
  useEffect(() => {
    console.log("FieldSelector mounted/updated");
    console.log("Selected domains:", selectedDomains);
    console.log("Metadata:", metadata);
    console.log("Active tab:", activeTab);
  }, [selectedDomains, metadata, activeTab]);

  // Process metadata to get field information
  const allFields: FieldInfo[] = useMemo(() => {
    console.log("Computing allFields from metadata:", metadata);
    console.log("Selected domains for fields:", selectedDomains);

    if (!metadata?.domains) {
      console.log("No metadata.domains available");
      return [];
    }

    const fields = selectedDomains
      .flatMap(domain => {
        const domainData = metadata.domains[domain];
        if (!domainData?.fields) {
          console.log(`No fields found for domain: ${domain}`);
          return [];
        }

        console.log(
          `Found ${domainData.fields.length} fields for domain: ${domain}`
        );
        return domainData.fields.map((field: any) => ({
          name: field.name,
          displayName: field.displayName || field.name,
          type: field.type || "string",
          description: field.description || `${field.name} field`,
          domain,
          recommended: field.recommended || false,
          sensitive: field.sensitive || false,
        }));
      })
      .sort((a, b) => {
        // Sort recommended fields first
        if (a.recommended && !b.recommended) return -1;
        if (!a.recommended && b.recommended) return 1;
        return a.displayName.localeCompare(b.displayName);
      });

    console.log(`Processed ${fields.length} total fields from all domains`);
    return fields;
  }, [metadata, selectedDomains]);

  // Get recommended fields
  const recommendedFields = useMemo(() => {
    return allFields.filter(field => field.recommended);
  }, [allFields]);

  // Filter fields based on search term and active tab
  const filteredFields = useMemo(() => {
    let fields = allFields;

    // Filter by tab (domain)
    if (activeTab !== "all") {
      fields = fields.filter(field => field.domain === activeTab);
      console.log(
        `Filtered to ${fields.length} fields for domain: ${activeTab}`
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      fields = fields.filter(
        field =>
          field.displayName.toLowerCase().includes(term) ||
          field.description.toLowerCase().includes(term) ||
          field.domain.toLowerCase().includes(term)
      );
    }

    // Filter by recommended only
    if (showRecommendedOnly) {
      fields = fields.filter(field => field.recommended);
    }

    return fields;
  }, [allFields, activeTab, searchTerm, showRecommendedOnly]);

  // Group fields by domain
  const fieldsByDomain = useMemo(() => {
    const grouped: Record<string, FieldInfo[]> = {};

    filteredFields.forEach(field => {
      if (!grouped[field.domain]) {
        grouped[field.domain] = [];
      }
      grouped[field.domain].push(field);
    });

    console.log("Fields grouped by domain:", Object.keys(grouped));
    return grouped;
  }, [filteredFields]);

  const isFieldSelected = (domain: string, fieldName: string) => {
    return selectedFields[domain]?.includes(fieldName) || false;
  };

  const handleToggleField = (domain: string, fieldName: string) => {
    const currentFields = { ...selectedFields };

    if (!currentFields[domain]) {
      currentFields[domain] = [];
    }

    if (currentFields[domain].includes(fieldName)) {
      currentFields[domain] = currentFields[domain].filter(
        f => f !== fieldName
      );
      if (currentFields[domain].length === 0) {
        delete currentFields[domain];
      }
    } else {
      currentFields[domain] = [...currentFields[domain], fieldName];
    }

    onChange(selectedDomains, currentFields);
  };

  const handleSelectAllInDomain = (domain: string) => {
    const currentFields = { ...selectedFields };
    const domainFields = allFields
      .filter(field => field.domain === domain)
      .map(field => field.name);

    currentFields[domain] = domainFields;
    onChange(selectedDomains, currentFields);
  };

  const handleDeselectAllInDomain = (domain: string) => {
    const currentFields = { ...selectedFields };
    delete currentFields[domain];
    onChange(selectedDomains, currentFields);
  };

  const handleSelectRecommended = () => {
    const currentFields = { ...selectedFields };

    recommendedFields.forEach(field => {
      if (!currentFields[field.domain]) {
        currentFields[field.domain] = [];
      }
      if (!currentFields[field.domain].includes(field.name)) {
        currentFields[field.domain] = [
          ...currentFields[field.domain],
          field.name,
        ];
      }
    });

    onChange(selectedDomains, currentFields);
  };

  // Count selected fields
  const selectedFieldsCount = Object.values(selectedFields).reduce(
    (count, fields) => count + fields.length,
    0
  );

  // If no domains selected, show a message
  if (selectedDomains.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground mb-4">
          Please select at least one domain in the previous step
        </p>
        <Button onClick={() => setActiveTab("all")}>Go Back</Button>
      </div>
    );
  }

  // If no fields available, show a message
  if (allFields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground mb-4">
          {metadata
            ? "No fields available for the selected domains"
            : "Loading metadata..."}
        </p>
        <pre className="text-xs text-left bg-muted p-4 rounded-md max-w-full overflow-auto">
          {JSON.stringify(
            {
              metadataAvailable: !!metadata,
              selectedDomains,
              domainsInMetadata: metadata
                ? Object.keys(metadata.domains || {})
                : [],
            },
            null,
            2
          )}
        </pre>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Select Fields</h3>
        <p className="text-sm text-muted-foreground">
          Choose the fields you want to include in your report
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative flex-1 mr-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search fields..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => setShowRecommendedOnly(!showRecommendedOnly)}
        >
          {showRecommendedOnly ? (
            <StarOff className="h-4 w-4" />
          ) : (
            <Star className="h-4 w-4" />
          )}
          {showRecommendedOnly ? "Show All" : "Recommended"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full overflow-x-auto flex-nowrap">
          <TabsTrigger value="all">All Fields</TabsTrigger>
          {selectedDomains.map(domain => (
            <TabsTrigger key={domain} value={domain} className="capitalize">
              {domain.replace(/_/g, " ")}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm">
            {filteredFields.length} fields available
            {selectedFieldsCount > 0 && `, ${selectedFieldsCount} selected`}
          </div>

          <Button variant="outline" size="sm" onClick={handleSelectRecommended}>
            Select Recommended
          </Button>
        </div>

        <TabsContent value="all" className="mt-2">
          <ScrollArea className="h-[400px] pr-4">
            {Object.entries(fieldsByDomain).map(([domain, fields]) => (
              <div key={domain} className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium capitalize">
                    {domain.replace(/_/g, " ")}
                  </h4>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSelectAllInDomain(domain)}
                    >
                      Select All
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeselectAllInDomain(domain)}
                    >
                      Clear
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {fields.map(field => (
                    <FieldItem
                      key={`${domain}.${field.name}`}
                      field={field}
                      selected={isFieldSelected(domain, field.name)}
                      onToggle={() => handleToggleField(domain, field.name)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </ScrollArea>
        </TabsContent>

        {selectedDomains.map(domain => (
          <TabsContent key={domain} value={domain} className="mt-2">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium capitalize">
                {domain.replace(/_/g, " ")} Fields
              </h4>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSelectAllInDomain(domain)}
                >
                  Select All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeselectAllInDomain(domain)}
                >
                  Clear
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {filteredFields
                  .filter(field => field.domain === domain)
                  .map(field => (
                    <FieldItem
                      key={`${domain}.${field.name}`}
                      field={field}
                      selected={isFieldSelected(domain, field.name)}
                      onToggle={() => handleToggleField(domain, field.name)}
                    />
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>

      {selectedFieldsCount > 0 && (
        <div className="mt-4 p-4 bg-muted rounded-md">
          <h4 className="text-sm font-medium mb-2">Selected Fields</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedFields).map(([domain, fields]) =>
              fields.map(field => {
                const fieldInfo = allFields.find(
                  f => f.domain === domain && f.name === field
                );
                return (
                  <Badge
                    key={`${domain}.${field}`}
                    variant="secondary"
                    className="px-3 py-1"
                  >
                    <span className="capitalize">
                      {domain.replace(/_/g, " ")}
                    </span>
                    .{fieldInfo?.displayName || field}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1"
                      onClick={() => handleToggleField(domain, field)}
                    >
                      <span className="sr-only">Remove</span>
                      <span aria-hidden="true">&times;</span>
                    </Button>
                  </Badge>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface FieldItemProps {
  field: FieldInfo;
  selected: boolean;
  onToggle: () => void;
}

function FieldItem({ field, selected, onToggle }: FieldItemProps) {
  return (
    <div
      className={`flex items-center p-2 rounded-md ${
        selected ? "bg-primary/10" : "hover:bg-muted"
      }`}
    >
      <Checkbox checked={selected} onCheckedChange={() => onToggle()} />
      <div className="ml-3 flex-1">
        <div className="flex items-center">
          <span className="font-medium">{field.displayName}</span>
          {field.recommended && (
            <Star className="h-3 w-3 ml-1 text-amber-500" />
          )}
          {field.sensitive && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 ml-1 text-red-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>This field contains sensitive data</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{field.description}</p>
      </div>
      <Badge variant="outline" className="ml-2">
        {field.type}
      </Badge>
    </div>
  );
}
