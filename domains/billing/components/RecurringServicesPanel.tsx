"use client";

import { useQuery, useMutation, gql } from "@apollo/client";
import {
  Plus,
  Settings,
  Calendar,
  DollarSign,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { safeFormatDate } from "@/lib/utils/date-utils";
import type {
  RecurringServicesPanelProps,
  Service,
} from "../types/billing.types";

interface ClientServiceAssignment {
  id: string;
  serviceId: string;
  clientId: string;
  customRate?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  service: Service;
}

// GraphQL operations for client service assignments
const GET_CLIENT_SERVICE_ASSIGNMENTS = gql`
  query GetClientServiceAssignments($clientId: uuid!) {
    clientServiceAssignments(
      where: { clientId: { _eq: $clientId }, isActive: { _eq: true } }
    ) {
      id
      serviceId
      customRate
      isActive
      createdAt
      updatedAt
      service {
        id
        name
        serviceCode
        description
        baseRate
        category
        chargeBasis
        approvalLevel
      }
    }
  }
`;

const CREATE_CLIENT_SERVICE_ASSIGNMENT = gql`
  mutation CreateClientServiceAssignment(
    $input: ClientServiceAssignmentsInsertInput!
  ) {
    insertClientServiceAssignmentsOne(object: $input) {
      id
      serviceId
      customRate
      isActive
      service {
        id
        name
        serviceCode
        baseRate
        category
      }
    }
  }
`;

const UPDATE_CLIENT_SERVICE_ASSIGNMENT = gql`
  mutation UpdateClientServiceAssignment(
    $id: uuid!
    $updates: ClientServiceAssignmentsSetInput!
  ) {
    updateClientServiceAssignmentsByPk(pkColumns: { id: $id }, _set: $updates) {
      id
      serviceId
      customRate
      isActive
    }
  }
`;

export function RecurringServicesPanel({
  services,
  clients,
  loading,
  onServiceAdd,
  onServiceToggle,
}: RecurringServicesPanelProps) {
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [customRate, setCustomRate] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [nextBillingDate, setNextBillingDate] = useState<Date | null>(null);

  // Get client service assignments for selected client
  const {
    data: assignmentsData,
    loading: assignmentsLoading,
    refetch: refetchAssignments,
  } = useQuery(GET_CLIENT_SERVICE_ASSIGNMENTS, {
    variables: { clientId: selectedClientId },
    skip: !selectedClientId,
  });

  // GraphQL mutations
  const [createClientServiceAssignment] = useMutation(
    CREATE_CLIENT_SERVICE_ASSIGNMENT
  );
  const [updateClientServiceAssignment] = useMutation(
    UPDATE_CLIENT_SERVICE_ASSIGNMENT
  );

  const clientServices: ClientServiceAssignment[] =
    assignmentsData?.clientServiceAssignments || [];

  // Filter available services (those not already assigned to selected client)
  const subscribedServiceIds = new Set(
    clientServices.map((s: ClientServiceAssignment) => s.serviceId)
  );
  const availableServices = services.filter(
    service => !subscribedServiceIds.has(service.id)
  );

  // Get selected client data
  const selectedClient = clients.find(c => c.id === selectedClientId);

  // Calculate monthly total for selected client
  const monthlyTotal = clientServices.reduce(
    (total: number, assignment: ClientServiceAssignment) => {
      const rate = assignment.customRate || assignment.service.baseRate;
      return total + (rate || 0);
    },
    0
  );

  // Get next billing date
  const getNextBillingDate = () => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth;
  };

  // Initialize next billing date on client side to avoid hydration mismatch
  useEffect(() => {
    setNextBillingDate(getNextBillingDate());
  }, []);

  const handleAddService = async () => {
    if (!selectedService || !selectedClientId) return;

    const serviceConfig = services.find(s => s.id === selectedService);
    if (!serviceConfig) return;

    try {
      await createClientServiceAssignment({
        variables: {
          input: {
            clientId: selectedClientId,
            serviceId: serviceConfig.id,
            customRate: customRate ? parseFloat(customRate) : null,
            isActive: true,
          },
        },
      });

      await refetchAssignments();
      onServiceAdd?.(
        selectedClientId,
        selectedService,
        customRate ? parseFloat(customRate) : undefined
      );

      toast.success(`Added ${serviceConfig.name} successfully`);
      setIsDialogOpen(false);
      setSelectedService("");
      setCustomRate("");
    } catch (error) {
      console.error("Error creating client service assignment:", error);
      toast.error("Failed to add service. Please try again.");
    }
  };

  const handleToggleService = async (
    assignmentId: string,
    isActive: boolean
  ) => {
    try {
      await updateClientServiceAssignment({
        variables: {
          id: assignmentId,
          updates: {
            isActive: isActive,
          },
        },
      });

      await refetchAssignments();
      onServiceToggle?.(assignmentId, isActive);

      toast.success(isActive ? "Service activated" : "Service deactivated");
    } catch (error) {
      console.error("Error updating client service assignment:", error);
      toast.error("Failed to update service. Please try again.");
    }
  };

  const handleGenerateMonthlyBilling = async () => {
    if (!selectedClientId) {
      toast.error("Please select a client first");
      return;
    }

    try {
      const response = await fetch("/api/billing/recurring/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientIds: [selectedClientId],
          billingMonth:
            new Date().toISOString().split("T")[0].substring(0, 7) + "-01",
          dryRun: false,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate billing");
      }

      toast.success(
        `Generated billing for ${result.itemsCreated} services totaling $${result.totalAmount?.toFixed(2) || 0}`
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to generate billing: ${errorMessage}`);
    }
  };

  const getCategoryColor = (category?: string | null) => {
    const colors = {
      essential: "bg-primary/10 text-primary",
      standard: "bg-success-500/10 text-success-600",
      premium: "bg-accent text-accent-foreground",
    } as const;
    return (
      colors[(category || "").toLowerCase() as keyof typeof colors] ||
      "bg-muted text-muted-foreground"
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(amount);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                Loading recurring services...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Client Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Recurring Services Management
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage monthly recurring services and automated billing
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="client-select">Select Client</Label>
              <Select
                value={selectedClientId}
                onValueChange={setSelectedClientId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a client to manage services" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedClientId && (
              <div className="pt-6">
                <Button onClick={handleGenerateMonthlyBilling} size="sm">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Generate Billing
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedClientId ? (
        <>
          {/* Overview Cards for Selected Client */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Total
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success-600">
                  {formatCurrency(monthlyTotal)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Recurring revenue per month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Services
                </CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {clientServices.filter(s => s.isActive).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  of {clientServices.length} total services
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Next Billing
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">
                  {nextBillingDate
                    ? safeFormatDate(nextBillingDate, "dd MMM yyyy")
                    : "Loading..."}
                </div>
                <p className="text-xs text-muted-foreground">
                  1st of each month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Automation
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">100%</div>
                <p className="text-xs text-muted-foreground">
                  Auto-generated billing
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Services Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Services for {selectedClient?.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage recurring service subscriptions
                  </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={availableServices.length === 0}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Service
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Recurring Service</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="service-select">Service</Label>
                        <Select
                          value={selectedService}
                          onValueChange={setSelectedService}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableServices.map(service => (
                              <SelectItem key={service.id} value={service.id}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{service.name}</span>
                                  <span className="text-sm text-muted-foreground ml-2">
                                    {service.baseRate
                                      ? formatCurrency(service.baseRate)
                                      : "Custom"}
                                    /month
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {selectedService && (
                          <div className="mt-2 p-3 bg-muted rounded text-sm">
                            {
                              availableServices.find(
                                s => s.id === selectedService
                              )?.description
                            }
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="custom-rate">
                          Custom Rate (optional)
                        </Label>
                        <Input
                          id="custom-rate"
                          type="number"
                          step="0.01"
                          value={customRate}
                          onChange={e => setCustomRate(e.target.value)}
                          placeholder={
                            selectedService
                              ? `Default: ${formatCurrency(availableServices.find(s => s.id === selectedService)?.baseRate || 0)}`
                              : "Leave empty to use base rate"
                          }
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddService}
                          disabled={!selectedService}
                        >
                          Add Service
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {assignmentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : clientServices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No recurring services configured</p>
                  <p className="text-sm">
                    Add services to automatically generate monthly billing
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {clientServices.map(assignment => {
                    const service = assignment.service;
                    const effectiveRate =
                      assignment.customRate || service.baseRate || 0;

                    return (
                      <div
                        key={assignment.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="font-medium">{service.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {service.description}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge
                                  variant="outline"
                                  className={getCategoryColor(service.category)}
                                >
                                  {service.category || "Standard"}
                                </Badge>
                                <Badge variant="outline">
                                  {service.chargeBasis || "monthly"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-medium">
                              {formatCurrency(effectiveRate)}
                            </div>
                            {assignment.customRate && (
                              <Badge variant="secondary" className="text-xs">
                                Custom Rate
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Switch
                              checked={assignment.isActive}
                              onCheckedChange={checked =>
                                handleToggleService(assignment.id, checked)
                              }
                            />
                            <span className="text-sm text-muted-foreground">
                              {assignment.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <RefreshCw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Recurring Services Management
              </h3>
              <p className="text-muted-foreground mb-6">
                Select a client above to manage their recurring service
                subscriptions
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
