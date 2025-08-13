"use client";

import { useState } from "react";
import { Check, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DomainSelectorProps {
  metadata: any;
  selectedDomains: string[];
  onChange: (domains: string[]) => void;
}

interface DomainInfo {
  name: string;
  displayName: string;
  description: string;
  icon?: string;
  fieldCount: number;
}

export function DomainSelector({
  metadata,
  selectedDomains,
  onChange,
}: DomainSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Process metadata to get domain information
  const domains: DomainInfo[] = metadata?.domains
    ? Object.entries(metadata.domains).map(([name, domain]: [string, any]) => ({
        name,
        displayName: domain.displayName || name,
        description: domain.description || `Data related to ${name}`,
        icon: domain.icon,
        fieldCount: domain.fields?.length || 0,
      }))
    : [
        // Default domains if metadata is not loaded yet
        {
          name: "payrolls",
          displayName: "Payrolls",
          description: "Payroll records and processing data",
          fieldCount: 15,
        },
        {
          name: "staff",
          displayName: "Staff",
          description: "Employee and staff member information",
          fieldCount: 12,
        },
        {
          name: "clients",
          displayName: "Clients",
          description: "Client accounts and related information",
          fieldCount: 10,
        },
        {
          name: "leave",
          displayName: "Leave",
          description: "Leave requests and balances",
          fieldCount: 8,
        },
        {
          name: "billing",
          displayName: "Billing",
          description: "Invoices, payments, and billing information",
          fieldCount: 14,
        },
        {
          name: "work_schedule",
          displayName: "Work Schedule",
          description: "Work schedules and roster information",
          fieldCount: 9,
        },
      ];

  // Filter domains based on search term
  const filteredDomains = domains.filter(
    domain =>
      domain.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      domain.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleDomain = (domainName: string) => {
    if (selectedDomains.includes(domainName)) {
      onChange(selectedDomains.filter(d => d !== domainName));
    } else {
      onChange([...selectedDomains, domainName]);
    }
  };

  // Domain icons mapping
  const domainIcons: Record<string, React.ReactNode> = {
    payrolls: <span className="text-xl">💰</span>,
    staff: <span className="text-xl">👥</span>,
    clients: <span className="text-xl">🏢</span>,
    leave: <span className="text-xl">🏖️</span>,
    billing: <span className="text-xl">📊</span>,
    work_schedule: <span className="text-xl">📅</span>,
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Select Data Domains</h3>
        <p className="text-sm text-muted-foreground">
          Choose the types of data you want to include in your report
        </p>
      </div>

      <div className="relative">
        <Input
          placeholder="Search domains..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="mb-4"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDomains.map(domain => (
          <Card
            key={domain.name}
            className={`cursor-pointer transition-all ${
              selectedDomains.includes(domain.name)
                ? "border-primary ring-2 ring-primary/20"
                : "hover:border-primary/50"
            }`}
            onClick={() => handleToggleDomain(domain.name)}
          >
            <CardContent className="p-4 flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {domainIcons[domain.name] || (
                  <span className="text-xl">📁</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{domain.displayName}</h4>
                  {selectedDomains.includes(domain.name) && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {domain.description}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {domain.fieldCount} fields
                  </Badge>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Info className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View schema information for {domain.displayName}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedDomains.length > 0 && (
        <div className="mt-4 p-4 bg-muted rounded-md">
          <h4 className="text-sm font-medium mb-2">Selected Domains</h4>
          <div className="flex flex-wrap gap-2">
            {selectedDomains.map(domain => {
              const domainInfo = domains.find(d => d.name === domain);
              return (
                <Badge key={domain} variant="secondary" className="px-3 py-1">
                  {domainInfo?.displayName || domain}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={e => {
                      e.stopPropagation();
                      handleToggleDomain(domain);
                    }}
                  >
                    <span className="sr-only">Remove</span>
                    <span aria-hidden="true">&times;</span>
                  </Button>
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
