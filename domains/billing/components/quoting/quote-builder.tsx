"use client";

import { useQuery, useMutation, gql } from "@apollo/client";
import {
  Plus,
  Minus,
  Save,
  Send,
  Copy,
  Calculator,
  Package,
  User,
  Building,
  Calendar,
  DollarSign,
  FileText,
  Trash2,
} from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

// Validation schema
const quoteSchema = z.object({
  clientId: z.string().optional(),
  prospectName: z.string().optional(),
  prospectEmail: z.string().email().optional(),
  prospectPhone: z.string().optional(),
  prospectCompany: z.string().optional(),
  validUntil: z.string().optional(),
  notes: z.string().optional(),
  termsConditions: z.string().optional(),
  lineItems: z.array(z.object({
    serviceId: z.string().min(1, "Service is required"),
    description: z.string().min(1, "Description is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    unitRate: z.number().min(0, "Rate must be positive"),
    notes: z.string().optional(),
  })).min(1, "At least one line item is required"),
}).refine((data) => data.clientId || data.prospectName, {
  message: "Either select an existing client or enter prospect details",
  path: ["clientId"],
});

type QuoteFormData = z.infer<typeof quoteSchema>;

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  billingUnit: string;
  defaultRate: number;
  currency: string;
}

interface Client {
  id: string;
  name: string;
  contactEmail: string;
  contactPhone: string;
}

interface QuoteTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  serviceBundle: Array<{
    service_name: string;
    default_quantity: number;
    rate_override?: number;
  }>;
  targetClientSize: string;
  estimatedTotal: number;
}

const GET_SERVICES_FOR_QUOTING = gql`
  query GetServicesForQuoting {
    services(where: {isActive: {_eq: true}}, orderBy: {category: ASC, name: ASC}) {
      id
      name
      description
      category
      billingUnit
      defaultRate
      currency
    }
  }
`;

const GET_CLIENTS = gql`
  query GetClients {
    clients(where: {active: {_eq: true}}, orderBy: {name: ASC}) {
      id
      name
      contactEmail
      contactPhone
    }
  }
`;

const GET_QUOTE_TEMPLATES = gql`
  query GetQuoteTemplates {
    quoteTemplates(where: {isActive: {_eq: true}}, orderBy: {name: ASC}) {
      id
      name
      description
      category
      serviceBundle
      targetClientSize
      estimatedTotal
    }
  }
`;

const CREATE_QUOTE = gql`
  mutation CreateQuote($input: QuotesInsertInput!) {
    insertQuotesOne(object: $input) {
      id
      quoteNumber
      totalAmount
      status
      createdAt
    }
  }
`;

const CREATE_QUOTE_LINE_ITEMS = gql`
  mutation CreateQuoteLineItems($items: [QuoteLineItemsInsertInput!]!) {
    insertQuoteLineItems(objects: $items) {
      returning {
        id
        totalAmount
      }
      affectedRows
    }
  }
`;

export function QuoteBuilder({ onQuoteCreated }: { onQuoteCreated?: (quoteId: string) => void }) {
  const [selectedTemplate, setSelectedTemplate] = useState<QuoteTemplate | null>(null);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [isExistingClient, setIsExistingClient] = useState(true);

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      lineItems: [
        {
          serviceId: "",
          description: "",
          quantity: 1,
          unitRate: 0,
          notes: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  // GraphQL queries
  const { data: servicesData, loading: servicesLoading } = useQuery(GET_SERVICES_FOR_QUOTING);
  const { data: clientsData, loading: clientsLoading } = useQuery(GET_CLIENTS);
  const { data: templatesData, loading: templatesLoading } = useQuery(GET_QUOTE_TEMPLATES);

  const [createQuote, { loading: createLoading }] = useMutation(CREATE_QUOTE);
  const [createLineItems] = useMutation(CREATE_QUOTE_LINE_ITEMS);

  const services: Service[] = servicesData?.services || [];
  const clients: Client[] = clientsData?.clients || [];
  const templates: QuoteTemplate[] = templatesData?.quoteTemplates || [];

  // Calculate totals
  const lineItems = form.watch("lineItems");
  const totalAmount = useMemo(() => {
    return lineItems.reduce((sum, item) => {
      return sum + (item.quantity * item.unitRate);
    }, 0);
  }, [lineItems]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  // Handle service selection
  const handleServiceSelect = (index: number, serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      form.setValue(`lineItems.${index}.serviceId`, serviceId);
      form.setValue(`lineItems.${index}.description`, service.name);
      form.setValue(`lineItems.${index}.unitRate`, service.defaultRate);
    }
  };

  // Apply quote template
  const applyTemplate = (template: QuoteTemplate) => {
    setSelectedTemplate(template);
    
    // Clear existing line items
    form.setValue("lineItems", []);
    
    // Add template services as line items
    template.serviceBundle.forEach((bundleItem, index) => {
      const service = services.find(s => s.name === bundleItem.service_name);
      if (service) {
        append({
          serviceId: service.id,
          description: service.name,
          quantity: bundleItem.default_quantity,
          unitRate: bundleItem.rate_override || service.defaultRate,
          notes: `From template: ${template.name}`,
        });
      }
    });
    
    setShowTemplateDialog(false);
    toast.success(`Applied template: ${template.name}`);
  };

  // Submit form
  const onSubmit = async (data: QuoteFormData) => {
    try {
      // Create the quote
      const quoteInput = {
        clientId: isExistingClient ? data.clientId : null,
        prospectName: !isExistingClient ? data.prospectName : null,
        prospectEmail: !isExistingClient ? data.prospectEmail : null,
        prospectPhone: !isExistingClient ? data.prospectPhone : null,
        prospectCompany: !isExistingClient ? data.prospectCompany : null,
        validUntil: data.validUntil || null,
        notes: data.notes || null,
        termsConditions: data.termsConditions || null,
        totalAmount: totalAmount,
        status: "draft",
      };

      const quoteResult = await createQuote({
        variables: { input: quoteInput }
      });

      const quoteId = quoteResult.data?.insertQuotesOne?.id;
      
      if (quoteId) {
        // Create line items
        const lineItemsInput = data.lineItems.map(item => ({
          quoteId: quoteId,
          serviceId: item.serviceId,
          description: item.description,
          quantity: item.quantity,
          unitRate: item.unitRate,
          notes: item.notes || null,
        }));

        await createLineItems({
          variables: { items: lineItemsInput }
        });

        toast.success("Quote created successfully!");
        
        // Reset form
        form.reset();
        setSelectedTemplate(null);
        
        // Callback
        onQuoteCreated?.(quoteId);
      }
    } catch (error) {
      console.error("Error creating quote:", error);
      toast.error("Failed to create quote. Please try again.");
    }
  };

  if (servicesLoading || clientsLoading || templatesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Create New Quote</h2>
          <p className="text-muted-foreground">
            Build a professional quote for your client or prospect
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Package className="w-4 h-4 mr-2" />
                Use Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Choose Quote Template</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {templates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => applyTemplate(template)}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">{template.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-xs">
                          {template.targetClientSize}
                        </Badge>
                        <span className="text-sm font-bold">
                          {formatCurrency(template.estimatedTotal)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Client/Prospect Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={isExistingClient}
                    onChange={() => setIsExistingClient(true)}
                  />
                  <span>Existing Client</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={!isExistingClient}
                    onChange={() => setIsExistingClient(false)}
                  />
                  <span>New Prospect</span>
                </label>
              </div>

              {isExistingClient ? (
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Client</FormLabel>
                      <Select onValueChange={field.onChange} {...(field.value && { value: field.value })}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a client..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              <div>
                                <div className="font-medium">{client.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {client.contactEmail}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="prospectName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="prospectCompany"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="ABC Company Pty Ltd" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="prospectEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@company.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="prospectPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+61 2 1234 5678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quote Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Quote Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="validUntil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valid Until</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional notes or comments about this quote..."
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Services/Line Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Services & Pricing
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ serviceId: "", description: "", quantity: 1, unitRate: 0, notes: "" })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Service {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`lineItems.${index}.serviceId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value);
                              handleServiceSelect(index, value);
                            }} 
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a service..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {services.map((service) => (
                                <SelectItem key={service.id} value={service.id}>
                                  <div>
                                    <div className="font-medium">{service.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {service.billingUnit} - {formatCurrency(service.defaultRate)}
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`lineItems.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input placeholder="Service description..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`lineItems.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`lineItems.${index}.unitRate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit Rate</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01"
                              min="0"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-2">
                      <Label>Total</Label>
                      <div className="flex items-center h-10 px-3 bg-muted rounded-md">
                        <span className="font-medium">
                          {formatCurrency(form.watch(`lineItems.${index}.quantity`) * form.watch(`lineItems.${index}.unitRate`))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <Separator />
              
              <div className="flex justify-end">
                <div className="text-right space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-medium">Total Quote Value:</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    All prices in AUD (excluding GST)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms & Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="termsConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter terms and conditions for this quote..."
                        rows={4}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Button type="button" variant="outline">
              <Copy className="w-4 h-4 mr-2" />
              Save as Template
            </Button>
            <Button type="submit" disabled={createLoading}>
              <Save className="w-4 h-4 mr-2" />
              {createLoading ? "Creating..." : "Create Quote"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}