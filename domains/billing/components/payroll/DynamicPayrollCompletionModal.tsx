"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  Clock,
  Hash,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Info,
  Calculator,
  Save,
  X,
  Timer,
  Users,
  Building2,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  GetPayrollServiceAgreementsDocument,
  type PayrollDateTimeEntriesInsertInput,
  type BillingItemsInsertInput,
} from "../../graphql/generated/graphql";
import {
  GetPayrollDatesDocument,
  CompletePayrollDateWithTimeDocument,
} from "../../../payrolls/graphql/generated/graphql";
import { useCurrentUser } from "@/hooks/use-current-user";
import { formatCurrency } from "@/lib/utils";

// Simple date formatting function
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

interface TimeEntry {
  serviceId: string;
  timeUnits: number; // 6-minute units (10 units = 1 hour)
  description: string;
  notes: string;
}

interface QuantityEntry {
  serviceId: string;
  quantity: number;
  notes: string;
}

interface ServiceConfirmation {
  serviceId: string;
  confirmed: boolean;
  notes: string;
}

interface CompletionData {
  timeEntries: TimeEntry[];
  quantities: QuantityEntry[];
  confirmations: ServiceConfirmation[];
  employeeCount: number;
  payslipCount: number;
  customQuantities: Record<string, number>;
  completionNotes: string;
}

interface DynamicPayrollCompletionModalProps {
  payrollDateId: string;
  isOpen: boolean;
  onClose: () => void;
  onCompleted?: () => void;
}

export function DynamicPayrollCompletionModal({
  payrollDateId,
  isOpen,
  onClose,
  onCompleted,
}: DynamicPayrollCompletionModalProps) {
  const { currentUser } = useCurrentUser();
  const [completionData, setCompletionData] = useState<CompletionData>({
    timeEntries: [],
    quantities: [],
    confirmations: [],
    employeeCount: 0,
    payslipCount: 0,
    customQuantities: {},
    completionNotes: "",
  });
  const [billingPreview, setBillingPreview] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"time" | "quantity" | "fixed" | "preview">("time");

  // GraphQL queries
  const { data: payrollData, loading: loadingPayroll } = useQuery(
    GetPayrollDateCompletionDataDocument,
    {
      variables: { payrollDateId },
      skip: !payrollDateId,
    }
  );

  const { data: serviceAgreements, loading: loadingServices } = useQuery(
    GetPayrollServiceAgreementsDocument,
    {
      variables: { payrollId: payrollData?.payrollDatesByPk?.payrollId },
      skip: !payrollData?.payrollDatesByPk?.payrollId,
    }
  );

  // GraphQL mutations
  const [completePayrollDate, { loading: completing }] = useMutation(
    CompletePayrollDateWithBillingDocument,
    {
      onCompleted: () => {
        toast.success("Payroll date completed successfully");
        onCompleted?.();
        onClose();
      },
      onError: (error) => {
        toast.error(`Failed to complete payroll date: ${error.message}`);
      },
    }
  );

  const payrollDate = payrollData?.payrollDatesByPk;
  const agreements = serviceAgreements?.payrollServiceAgreements || [];

  // Categorize services by unit type
  const timeBasedServices = agreements.filter(
    (agreement) => agreement.clientServiceAgreement?.service?.billingUnitType?.name === "time"
  );
  const quantityBasedServices = agreements.filter(
    (agreement) =>
      agreement.clientServiceAgreement?.service?.billingUnitType?.name !== "time" &&
      agreement.clientServiceAgreement?.service?.billingUnitType?.name !== "fixed"
  );
  const fixedServices = agreements.filter(
    (agreement) => agreement.clientServiceAgreement?.service?.billingUnitType?.name === "fixed"
  );

  // Initialize completion data when services load
  useEffect(() => {
    if (agreements.length > 0) {
      setCompletionData((prev) => ({
        ...prev,
        timeEntries: timeBasedServices.map((agreement) => ({
          serviceId: agreement.clientServiceAgreement?.service?.id || "",
          timeUnits: 0,
          description: "",
          notes: "",
        })),
        quantities: quantityBasedServices.map((agreement) => ({
          serviceId: agreement.clientServiceAgreement?.service?.id || "",
          quantity: getDefaultQuantity(agreement),
          notes: "",
        })),
        confirmations: fixedServices.map((agreement) => ({
          serviceId: agreement.clientServiceAgreement?.service?.id || "",
          confirmed: true, // Default to confirmed for fixed services
          notes: "",
        })),
      }));
    }
  }, [agreements]);

  // Calculate billing preview when completion data changes
  useEffect(() => {
    calculateBillingPreview();
  }, [completionData, agreements]);

  const getDefaultQuantity = (agreement: any): number => {
    const unitType = agreement.clientServiceAgreement?.service?.billingUnitType;
    if (!unitType) return 0;

    switch (unitType.defaultSource) {
      case "payroll_employees":
        return completionData.employeeCount;
      case "payroll_payslips":
        return completionData.payslipCount;
      case "client_locations":
        // This would come from payroll context
        return payrollData?.payrollDatesByPk?.payroll?.client?.locationCount || 0;
      default:
        return agreement.customQuantity || 1;
    }
  };

  const updateTimeEntry = (serviceId: string, field: keyof TimeEntry, value: any) => {
    setCompletionData((prev) => ({
      ...prev,
      timeEntries: prev.timeEntries.map((entry) =>
        entry.serviceId === serviceId ? { ...entry, [field]: value } : entry
      ),
    }));
  };

  const updateQuantityEntry = (serviceId: string, field: keyof QuantityEntry, value: any) => {
    setCompletionData((prev) => ({
      ...prev,
      quantities: prev.quantities.map((entry) =>
        entry.serviceId === serviceId ? { ...entry, [field]: value } : entry
      ),
    }));
  };

  const updateServiceConfirmation = (serviceId: string, field: keyof ServiceConfirmation, value: any) => {
    setCompletionData((prev) => ({
      ...prev,
      confirmations: prev.confirmations.map((entry) =>
        entry.serviceId === serviceId ? { ...entry, [field]: value } : entry
      ),
    }));
  };

  const calculateBillingPreview = () => {
    const preview: any[] = [];

    // Time-based services
    completionData.timeEntries.forEach((entry) => {
      const agreement = timeBasedServices.find(
        (a) => a.clientServiceAgreement?.service?.id === entry.serviceId
      );
      if (agreement && entry.timeUnits > 0) {
        const service = agreement.clientServiceAgreement?.service;
        const hours = entry.timeUnits / 10;
        const rate = agreement.customRate || service?.baseRate || 0;
        const amount = hours * rate;

        preview.push({
          serviceId: entry.serviceId,
          serviceName: service?.name,
          unitType: "time",
          quantity: entry.timeUnits,
          displayQuantity: `${entry.timeUnits} units (${hours}h)`,
          unitPrice: rate / 10, // Rate per 6-minute unit
          totalAmount: amount,
          description: entry.description || `${service?.name} - ${hours} hours`,
        });
      }
    });

    // Quantity-based services
    completionData.quantities.forEach((entry) => {
      const agreement = quantityBasedServices.find(
        (a) => a.clientServiceAgreement?.service?.id === entry.serviceId
      );
      if (agreement && entry.quantity > 0) {
        const service = agreement.clientServiceAgreement?.service;
        const rate = agreement.customRate || service?.baseRate || 0;
        const amount = entry.quantity * rate;
        const unitType = service?.billingUnitType;

        preview.push({
          serviceId: entry.serviceId,
          serviceName: service?.name,
          unitType: unitType?.name,
          quantity: entry.quantity,
          displayQuantity: `${entry.quantity} ${unitType?.displayName?.toLowerCase() || "units"}`,
          unitPrice: rate,
          totalAmount: amount,
          description: `${service?.name} - ${entry.quantity} ${unitType?.displayName?.toLowerCase() || "units"}`,
        });
      }
    });

    // Fixed services
    completionData.confirmations.forEach((entry) => {
      const agreement = fixedServices.find(
        (a) => a.clientServiceAgreement?.service?.id === entry.serviceId
      );
      if (agreement && entry.confirmed) {
        const service = agreement.clientServiceAgreement?.service;
        const rate = agreement.customRate || service?.baseRate || 0;

        preview.push({
          serviceId: entry.serviceId,
          serviceName: service?.name,
          unitType: "fixed",
          quantity: 1,
          displayQuantity: "Fixed fee",
          unitPrice: rate,
          totalAmount: rate,
          description: `${service?.name} - Fixed fee`,
        });
      }
    });

    setBillingPreview(preview);
  };

  const handleComplete = async () => {
    if (!currentUser?.id) {
      toast.error("User authentication required");
      return;
    }

    try {
      // Create completion context and billing items
      await completePayrollDate({
        variables: {
          payrollDateId,
          completedBy: currentUser.id,
          completionData: {
            employeeCount: completionData.employeeCount,
            payslipCount: completionData.payslipCount,
            customQuantities: completionData.customQuantities,
            notes: completionData.completionNotes,
            timeEntries: completionData.timeEntries,
            quantities: completionData.quantities,
            confirmations: completionData.confirmations,
          },
          billingPreview,
        },
      });
    } catch (error) {
      console.error("Payroll completion error:", error);
    }
  };

  const totalBillingAmount = billingPreview.reduce((sum, item) => sum + item.totalAmount, 0);

  if (loadingPayroll || loadingServices) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading payroll completion data...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!payrollDate) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>Payroll date not found</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Complete Payroll Date - Enhanced Billing
          </DialogTitle>
          <DialogDescription>
            Complete payroll date for {payrollDate.payroll?.name} on{" "}
            {formatDate(payrollDate.adjustedEftDate || payrollDate.originalEftDate)}
          </DialogDescription>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex gap-1 border-b">
          {timeBasedServices.length > 0 && (
            <Button
              variant={activeTab === "time" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("time")}
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Time-based ({timeBasedServices.length})
            </Button>
          )}
          {quantityBasedServices.length > 0 && (
            <Button
              variant={activeTab === "quantity" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("quantity")}
              className="flex items-center gap-2"
            >
              <Hash className="h-4 w-4" />
              Quantity-based ({quantityBasedServices.length})
            </Button>
          )}
          {fixedServices.length > 0 && (
            <Button
              variant={activeTab === "fixed" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("fixed")}
              className="flex items-center gap-2"
            >
              <DollarSign className="h-4 w-4" />
              Fixed Fee ({fixedServices.length})
            </Button>
          )}
          <Button
            variant={activeTab === "preview" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("preview")}
            className="flex items-center gap-2"
          >
            <Calculator className="h-4 w-4" />
            Billing Preview
          </Button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Payroll Context */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Payroll Context
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <Label htmlFor="employeeCount">Employee Count</Label>
                  <Input
                    id="employeeCount"
                    type="number"
                    min="0"
                    value={completionData.employeeCount}
                    onChange={(e) =>
                      setCompletionData((prev) => ({
                        ...prev,
                        employeeCount: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="payslipCount">Payslip Count</Label>
                  <Input
                    id="payslipCount"
                    type="number"
                    min="0"
                    value={completionData.payslipCount}
                    onChange={(e) =>
                      setCompletionData((prev) => ({
                        ...prev,
                        payslipCount: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="0"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="completionNotes">Completion Notes</Label>
                  <Textarea
                    id="completionNotes"
                    value={completionData.completionNotes}
                    onChange={(e) =>
                      setCompletionData((prev) => ({
                        ...prev,
                        completionNotes: e.target.value,
                      }))
                    }
                    placeholder="Any notes about this payroll completion..."
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time-based Services */}
          {activeTab === "time" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  Time-based Services (6-minute units)
                </CardTitle>
                <p className="text-sm text-foreground opacity-60">
                  Enter time spent in 6-minute units (10 units = 1 hour)
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {timeBasedServices.length === 0 ? (
                  <div className="text-center py-8 text-foreground opacity-60">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No time-based services assigned to this payroll</p>
                  </div>
                ) : (
                  timeBasedServices.map((agreement) => {
                    const service = agreement.clientServiceAgreement?.service;
                    const entry = completionData.timeEntries.find(
                      (e) => e.serviceId === service?.id
                    );
                    const hours = (entry?.timeUnits || 0) / 10;
                    const rate = agreement.customRate || service?.baseRate || 0;
                    const amount = hours * rate;

                    return (
                      <Card key={service?.id} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{service?.name}</h4>
                              <p className="text-sm text-foreground opacity-60">
                                {service?.description}
                              </p>
                            </div>
                            <Badge variant="outline">{service?.category}</Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <Label>Time Units (6-min each)</Label>
                              <Input
                                type="number"
                                min="0"
                                value={entry?.timeUnits || 0}
                                onChange={(e) =>
                                  updateTimeEntry(
                                    service?.id || "",
                                    "timeUnits",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                placeholder="0"
                              />
                              <p className="text-xs text-foreground opacity-60 mt-1">
                                = {hours.toFixed(1)} hours
                              </p>
                            </div>
                            <div>
                              <Label>Rate per Hour</Label>
                              <div className="text-lg font-medium mt-2">
                                {formatCurrency(rate)}
                              </div>
                            </div>
                            <div>
                              <Label>Total Amount</Label>
                              <div className="text-lg font-medium mt-2 text-green-600">
                                {formatCurrency(amount)}
                              </div>
                            </div>
                          </div>

                          <div>
                            <Label>Description</Label>
                            <Input
                              value={entry?.description || ""}
                              onChange={(e) =>
                                updateTimeEntry(
                                  service?.id || "",
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Describe the work performed..."
                            />
                          </div>

                          <div>
                            <Label>Notes</Label>
                            <Textarea
                              value={entry?.notes || ""}
                              onChange={(e) =>
                                updateTimeEntry(
                                  service?.id || "",
                                  "notes",
                                  e.target.value
                                )
                              }
                              placeholder="Additional notes..."
                              rows={2}
                            />
                          </div>
                        </div>
                      </Card>
                    );
                  })
                )}
              </CardContent>
            </Card>
          )}

          {/* Quantity-based Services */}
          {activeTab === "quantity" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Quantity-based Services
                </CardTitle>
                <p className="text-sm text-foreground opacity-60">
                  Enter quantities for services that charge per unit
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {quantityBasedServices.length === 0 ? (
                  <div className="text-center py-8 text-foreground opacity-60">
                    <Hash className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No quantity-based services assigned to this payroll</p>
                  </div>
                ) : (
                  quantityBasedServices.map((agreement) => {
                    const service = agreement.clientServiceAgreement?.service;
                    const unitType = service?.billingUnitType;
                    const entry = completionData.quantities.find(
                      (e) => e.serviceId === service?.id
                    );
                    const defaultQuantity = getDefaultQuantity(agreement);
                    const rate = agreement.customRate || service?.baseRate || 0;
                    const amount = (entry?.quantity || 0) * rate;

                    return (
                      <Card key={service?.id} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{service?.name}</h4>
                              <p className="text-sm text-foreground opacity-60">
                                {service?.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline">{unitType?.displayName}</Badge>
                              <p className="text-xs text-foreground opacity-60 mt-1">
                                {unitType?.quantityPrompt}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <Label>{unitType?.quantityPrompt || "Quantity"}</Label>
                              <Input
                                type="number"
                                min="0"
                                value={entry?.quantity || defaultQuantity}
                                onChange={(e) =>
                                  updateQuantityEntry(
                                    service?.id || "",
                                    "quantity",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                placeholder={defaultQuantity.toString()}
                              />
                              {defaultQuantity > 0 && (
                                <p className="text-xs text-foreground opacity-60 mt-1">
                                  Default: {defaultQuantity} from {unitType?.defaultSource?.replace('_', ' ')}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label>Rate per {unitType?.displayName}</Label>
                              <div className="text-lg font-medium mt-2">
                                {formatCurrency(rate)}
                              </div>
                            </div>
                            <div>
                              <Label>Total Amount</Label>
                              <div className="text-lg font-medium mt-2 text-green-600">
                                {formatCurrency(amount)}
                              </div>
                            </div>
                          </div>

                          <div>
                            <Label>Notes</Label>
                            <Textarea
                              value={entry?.notes || ""}
                              onChange={(e) =>
                                updateQuantityEntry(
                                  service?.id || "",
                                  "notes",
                                  e.target.value
                                )
                              }
                              placeholder="Additional notes..."
                              rows={2}
                            />
                          </div>
                        </div>
                      </Card>
                    );
                  })
                )}
              </CardContent>
            </Card>
          )}

          {/* Fixed Services */}
          {activeTab === "fixed" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Fixed Fee Services
                </CardTitle>
                <p className="text-sm text-foreground opacity-60">
                  Confirm fixed fee services to include in billing
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {fixedServices.length === 0 ? (
                  <div className="text-center py-8 text-foreground opacity-60">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No fixed fee services assigned to this payroll</p>
                  </div>
                ) : (
                  fixedServices.map((agreement) => {
                    const service = agreement.clientServiceAgreement?.service;
                    const entry = completionData.confirmations.find(
                      (e) => e.serviceId === service?.id
                    );
                    const rate = agreement.customRate || service?.baseRate || 0;

                    return (
                      <Card key={service?.id} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium">{service?.name}</h4>
                              <p className="text-sm text-foreground opacity-60">
                                {service?.description}
                              </p>
                            </div>
                            <div className="text-right mr-4">
                              <div className="text-lg font-medium">
                                {formatCurrency(rate)}
                              </div>
                              <p className="text-xs text-foreground opacity-60">Fixed fee</p>
                            </div>
                            <Switch
                              checked={entry?.confirmed || false}
                              onCheckedChange={(checked) =>
                                updateServiceConfirmation(
                                  service?.id || "",
                                  "confirmed",
                                  checked
                                )
                              }
                            />
                          </div>

                          {entry?.confirmed && (
                            <div>
                              <Label>Notes</Label>
                              <Textarea
                                value={entry?.notes || ""}
                                onChange={(e) =>
                                  updateServiceConfirmation(
                                    service?.id || "",
                                    "notes",
                                    e.target.value
                                  )
                                }
                                placeholder="Additional notes for this service..."
                                rows={2}
                              />
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })
                )}
              </CardContent>
            </Card>
          )}

          {/* Billing Preview */}
          {activeTab === "preview" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Billing Preview
                </CardTitle>
                <p className="text-sm text-foreground opacity-60">
                  Review billing items that will be generated
                </p>
              </CardHeader>
              <CardContent>
                {billingPreview.length === 0 ? (
                  <div className="text-center py-8 text-foreground opacity-60">
                    <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No billing items to generate</p>
                    <p className="text-sm">Complete service entries to see billing preview</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {billingPreview.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <h4 className="font-medium">{item.serviceName}</h4>
                          <p className="text-sm text-foreground opacity-60">
                            {item.displayQuantity} × {formatCurrency(item.unitPrice)} = {formatCurrency(item.totalAmount)}
                          </p>
                          <p className="text-xs text-foreground opacity-60">
                            {item.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-medium text-green-600">
                            {formatCurrency(item.totalAmount)}
                          </div>
                          <Badge variant="outline">{item.unitType}</Badge>
                        </div>
                      </div>
                    ))}

                    <Separator />

                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span>Total Billing Amount:</span>
                      <span className="text-green-600">
                        {formatCurrency(totalBillingAmount)}
                      </span>
                    </div>

                    {billingPreview.length > 0 && (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          {billingPreview.length} billing item{billingPreview.length !== 1 ? 's' : ''} will be created
                          totaling {formatCurrency(totalBillingAmount)}. These items will be available for
                          approval and invoicing after completion.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleComplete}
            disabled={completing || billingPreview.length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            {completing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Complete Payroll Date
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}