import { Search, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { ReportMetadata } from "../../types/report.types";

interface FieldSelectorProps {
  metadata: ReportMetadata;
  selectedDomains: string[];
  selectedFields: Record<string, string[]>;
  onChange: (domains: string[], fields: Record<string, string[]>) => void;
  className?: string;
}

export function FieldSelector({
  metadata,
  selectedDomains,
  selectedFields,
  onChange,
  className,
}: FieldSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedDomains, setExpandedDomains] = useState<string[]>([]);

  const toggleDomain = (domain: string) => {
    const isSelected = selectedDomains.includes(domain);
    let newDomains: string[];
    const newFields = { ...selectedFields };

    if (isSelected) {
      newDomains = selectedDomains.filter(d => d !== domain);
      delete newFields[domain];
    } else {
      newDomains = [...selectedDomains, domain];
      newFields[domain] = [];
    }

    onChange(newDomains, newFields);
  };

  const toggleField = (domain: string, field: string) => {
    const domainFields = selectedFields[domain] || [];
    const isSelected = domainFields.includes(field);
    const newFields = { ...selectedFields };

    if (isSelected) {
      newFields[domain] = domainFields.filter(f => f !== field);
    } else {
      newFields[domain] = [...domainFields, field];
    }

    // If this is the first field selected in a domain, add the domain
    if (!selectedDomains.includes(domain) && newFields[domain].length > 0) {
      onChange([...selectedDomains, domain], newFields);
    } else {
      onChange(selectedDomains, newFields);
    }
  };

  const toggleExpandDomain = (domain: string) => {
    setExpandedDomains(prev =>
      prev.includes(domain) ? prev.filter(d => d !== domain) : [...prev, domain]
    );
  };

  const filteredDomains = metadata.domains.filter(domain =>
    domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search fields..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Selected Fields Summary */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(selectedFields).map(([domain, fields]) =>
          fields.map(field => (
            <Badge
              key={`${domain}-${field}`}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {domain}.{field}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => toggleField(domain, field)}
              >
                ×
              </Button>
            </Badge>
          ))
        )}
      </div>

      {/* Domain and Field Selection */}
      <ScrollArea className="h-[500px] pr-4">
        <Accordion
          type="multiple"
          value={expandedDomains}
          className="space-y-2"
        >
          {filteredDomains.map(domain => {
            const isDomainSelected = selectedDomains.includes(domain);
            const domainFields = metadata.availableFields?.[domain] || [];
            const selectedDomainFields = selectedFields[domain] || [];

            return (
              <AccordionItem
                key={domain}
                value={domain}
                className="border rounded-lg"
              >
                <AccordionTrigger
                  className="px-4 hover:no-underline [&[data-state=open]>svg]:rotate-90"
                  onClick={() => toggleExpandDomain(domain)}
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={isDomainSelected}
                      onClick={e => {
                        e.stopPropagation();
                        toggleDomain(domain);
                      }}
                    />
                    <span className="font-medium">{domain}</span>
                    <Badge variant="outline" className="ml-2">
                      {selectedDomainFields.length}/{domainFields.length}
                    </Badge>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200" />
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3">
                  <div className="space-y-2 pl-6">
                    {domainFields.map(field => (
                      <div key={field} className="flex items-center gap-2 py-1">
                        <Checkbox
                          checked={selectedDomainFields.includes(field)}
                          onClick={() => toggleField(domain, field)}
                        />
                        <span>{field}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </ScrollArea>
    </div>
  );
}
