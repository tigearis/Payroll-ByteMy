"use client";

import { useQuery, useMutation } from "@apollo/client";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import {
  GetServiceCatalogForQuotesDocument,
  DeactivateServiceDocument,
  type ServiceCatalogFragmentFragment,
} from "../../../billing/graphql/generated/graphql";

interface ServiceEditorProps {
  service?: ServiceCatalogFragmentFragment | undefined;
  onSave: () => void;
  onCancel: () => void;
}

const BILLING_UNITS = [
  "Per Payroll",
  "Per Payslip",
  "Per Employee",
  "Per Hour",
  "Per State",
  "Once Off",
  "Per Month",
  "Per Lodgement",
];

const CATEGORIES = [
  "Setup & Configuration",
  "Processing",
  "Employee Management",
  "Compliance & Reporting",
  "Consulting",
];

const ServiceEditor: React.FC<ServiceEditorProps> = ({
  service,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: service?.name || "",
    description: service?.description || "",
    standardRate: service?.defaultRate?.toString() || "",
    billingUnit: service?.billingUnit || "Per Payroll",
    category: service?.category || "Processing",
    isActive: service?.isActive ?? true,
    currency: service?.currency || "AUD",
  });

  // Mock mutation functions for ServiceEditor
  const createService = async (options: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      data: {
        createService: {
          id: `service-${Date.now()}`,
          ...options.variables.input,
        },
      },
    };
  };

  const updateService = async (options: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      data: {
        updateService: {
          id: options.variables.id,
          ...options.variables.updates,
        },
      },
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const input = {
        name: formData.name,
        description: formData.description,
        standardRate: parseFloat(formData.standardRate),
        billingUnit: formData.billingUnit,
        category: formData.category,
        isActive: formData.isActive,
        currency: formData.currency,
      };

      if (service) {
        await updateService({
          variables: {
            id: service.id,
            updates: input,
          },
        });
        toast.success("Service updated successfully");
      } else {
        await createService({
          variables: { input },
        });
        toast.success("Service created successfully");
      }

      onSave();
    } catch (error) {
      toast.error("Failed to save service");
      console.error("Service save error:", error);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{service ? "Edit Service" : "Create New Service"}</CardTitle>
        <CardDescription>
          Configure service details for the billing catalog
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e =>
                  setFormData(prev => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={value =>
                  setFormData(prev => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e =>
                setFormData(prev => ({ ...prev, description: e.target.value }))
              }
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="standard_rate">Standard Rate</Label>
              <Input
                id="standard_rate"
                type="number"
                step="0.01"
                value={formData.standardRate}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    standardRate: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billing_unit">Billing Unit</Label>
              <Select
                value={formData.billingUnit}
                onValueChange={value =>
                  setFormData(prev => ({ ...prev, billingUnit: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BILLING_UNITS.map(unit => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={value =>
                  setFormData(prev => ({ ...prev, currency: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AUD">AUD</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={checked =>
                setFormData(prev => ({ ...prev, isActive: checked }))
              }
            />
            <Label htmlFor="isActive">Service is active</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {service ? "Update" : "Create"} Service
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

interface ServiceCatalogManagerProps {
  showCreateForm?: boolean;
}

export const ServiceCatalogManager: React.FC<ServiceCatalogManagerProps> = ({
  showCreateForm = false,
}) => {
  const [editingService, setEditingService] =
    useState<ServiceCatalogFragmentFragment | null>(null);
  const [showEditor, setShowEditor] = useState(showCreateForm);
  const [filterCategory, setFilterCategory] = useState<string>("");

  // Real GraphQL queries - use the quotes document that doesn't have hardcoded category filter
  const { data, loading, error, refetch } = useQuery(
    GetServiceCatalogForQuotesDocument,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  // Real mutation for deactivating services (since we don't have delete, we deactivate)
  const [deactivateService] = useMutation(DeactivateServiceDocument, {
    onCompleted: () => {
      toast.success("Service deactivated successfully");
      // Refetch will be handled automatically by Apollo cache
    },
    onError: error => {
      toast.error(`Failed to deactivate service: ${error.message}`);
    },
  });

  const handleEdit = (service: ServiceCatalogFragmentFragment) => {
    setEditingService(service);
    setShowEditor(true);
  };

  const handleDelete = async (service: ServiceCatalogFragmentFragment) => {
    if (!confirm(`Are you sure you want to deactivate "${service.name}"?`)) {
      return;
    }

    try {
      await deactivateService({
        variables: { id: service.id },
      });
    } catch (error) {
      console.error("Service deactivate error:", error);
    }
  };

  const handleSave = () => {
    setShowEditor(false);
    setEditingService(null);
    // Apollo cache will automatically update the list
  };

  const handleCancel = () => {
    setShowEditor(false);
    setEditingService(null);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Setup & Configuration": "bg-primary/10 text-primary",
      Processing: "bg-success-500/10 text-success-600",
      "Employee Management": "bg-accent text-accent-foreground",
      "Compliance & Reporting": "bg-warning-500/10 text-warning-600",
      Consulting: "bg-muted text-muted-foreground",
    } as const;
    return (
      colors[category as keyof typeof colors] || "bg-muted text-foreground"
    );
  };

  if (showEditor) {
    return (
      <div className="flex justify-center">
        <ServiceEditor
          service={editingService || undefined}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Export listener for services */}
      <ExportServicesListener services={data?.services || []} />
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Service Catalog</h2>
          <p className="text-muted-foreground">
            Manage billing services and rates
          </p>
        </div>
        <Button onClick={() => setShowEditor(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <Label htmlFor="category-filter">Filter by Category:</Label>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">
          Loading services...
        </div>
      ) : error ? (
        <div className="text-center py-8 text-destructive">
          <p>Error loading services: {error.message}</p>
          <button
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {data?.services
            ?.filter(
              (service: (typeof data.services)[0]) =>
                !filterCategory ||
                filterCategory === "all" ||
                service.category === filterCategory
            )
            .map((service: (typeof data.services)[0]) => (
              <Card key={service.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {service.name}
                        </h3>
                        <Badge
                          className={getCategoryColor(service.category || "")}
                        >
                          {service.category}
                        </Badge>
                        <Badge variant="outline">{service.billingUnit}</Badge>
                        {!service.isActive && (
                          <Badge variant="destructive">Inactive</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-medium text-foreground">
                          ${service.defaultRate} {service.currency}
                        </span>
                        <span className="text-muted-foreground">
                          {service.billingUnit}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleEdit(service as ServiceCatalogFragmentFragment)
                        }
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleDelete(
                            service as ServiceCatalogFragmentFragment
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

// Listener component to handle services:export and download CSV
const ExportServicesListener: React.FC<{ services: any[] }> = ({
  services,
}) => {
  useEffect(() => {
    const handleExport = () => {
      const headers = [
        "Service",
        "Category",
        "Billing Unit",
        "Rate",
        "Currency",
        "Active",
      ];
      const escape = (val: unknown) => {
        const s = String(val ?? "");
        const escaped = s.replace(/"/g, '""');
        return `"${escaped}"`;
      };
      const rows = (services || []).map((s: any) => [
        escape(s.name),
        escape(s.category),
        escape(s.billingUnit),
        escape(s.defaultRate),
        escape(s.currency || "AUD"),
        escape(s.isActive ? "Yes" : "No"),
      ]);
      const csv = [
        headers.map(escape).join(","),
        ...rows.map(r => r.join(",")),
      ].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `services-export-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
    window.addEventListener("services:export", handleExport);
    return () => window.removeEventListener("services:export", handleExport);
  }, [services]);
  return null;
};
