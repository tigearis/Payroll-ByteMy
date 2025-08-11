"use client";

import { useMutation, useQuery, gql } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Calculator, AlertTriangle, TrendingUp, Clock, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useDatabaseUserId } from "@/hooks/use-database-user-id";

// Validation schema matching database constraints
const completionMetricsSchema = z.object({
  // Core deliverables (required)
  payslipsProcessed: z.number().min(0, "Must be 0 or greater"),
  employeesProcessed: z.number().min(0, "Must be 0 or greater"),
  
  // Complexity indicators
  newStarters: z.number().min(0).optional(),
  terminations: z.number().min(0).optional(),
  leaveCalculations: z.number().min(0).optional(),
  bonusPayments: z.number().min(0).optional(),
  taxAdjustments: z.number().min(0).optional(),
  
  // Additional services
  superContributions: z.number().min(0).optional(),
  workersCompClaims: z.number().min(0).optional(),
  garnishmentOrders: z.number().min(0).optional(),
  
  // Statutory (optional - only for specific periods)
  paygSummaries: z.number().min(0).optional(),
  fbtCalculations: z.number().min(0).optional(),
  
  // Quality metrics
  exceptionsHandled: z.number().min(0).optional(),
  correctionsRequired: z.number().min(0).optional(),
  clientCommunications: z.number().min(0).optional(),
  
  // Notes
  generationNotes: z.string().optional(),
});

type CompletionMetricsFormData = z.infer<typeof completionMetricsSchema>;

interface PayrollCompletionMetricsFormProps {
  payrollDateId: string;
  payrollName: string;
  clientName: string;
  eftDate: string;
  onComplete?: (success: boolean) => void;
}

// Service rate mappings (from Tier 1 document)
const SERVICE_RATES = {
  payslipsProcessed: 2.50,
  newStarters: 25.00,
  terminations: 35.00,
  leaveCalculations: 5.00,
  bonusPayments: 8.00,
  taxAdjustments: 12.00,
  superContributions: 1.50,
  paygSummaries: 4.50,
  fbtCalculations: 25.00,
  workersCompClaims: 15.00,
  garnishmentOrders: 10.00,
};

export function PayrollCompletionMetricsForm({
  payrollDateId,
  payrollName,
  clientName,
  eftDate,
  onComplete
}: PayrollCompletionMetricsFormProps) {
  const { databaseUserId } = useDatabaseUserId();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch existing metrics using GraphQL query
  const GET_EXISTING_METRICS = gql`
    query GetPayrollCompletionMetrics($payrollDateId: uuid!) {
      payrollCompletionMetrics(where: { payrollDateId: { _eq: $payrollDateId } }) {
        id
        payslipsProcessed
        employeesProcessed
        newStarters
        terminations
        leaveCalculations
        bonusPayments
        taxAdjustments
        superContributions
        workersCompClaims
        garnishmentOrders
        paygSummaries
        fbtCalculations
        exceptionsHandled
        correctionsRequired
        clientCommunications
        generationNotes
        billingGenerated
        billingGeneratedAt
      }
    }
  `;

  const { data: existingMetrics, loading } = useQuery(GET_EXISTING_METRICS, {
    variables: { payrollDateId },
    errorPolicy: "all",
    skip: !payrollDateId
  });

  const form = useForm<CompletionMetricsFormData>({
    resolver: zodResolver(completionMetricsSchema),
    defaultValues: {
      payslipsProcessed: 0,
      employeesProcessed: 0,
      newStarters: undefined,
      terminations: undefined,
      leaveCalculations: undefined,
      bonusPayments: undefined,
      taxAdjustments: undefined,
      superContributions: undefined,
      workersCompClaims: undefined,
      garnishmentOrders: undefined,
      exceptionsHandled: undefined,
      correctionsRequired: undefined,
      clientCommunications: undefined,
      paygSummaries: undefined,
      fbtCalculations: undefined,
      generationNotes: undefined,
    }
  });

  // Load existing data when available
  useEffect(() => {
    if (existingMetrics?.payrollCompletionMetrics?.[0]) {
      const metrics = existingMetrics.payrollCompletionMetrics[0];
      form.reset({
        payslipsProcessed: metrics.payslipsProcessed || 0,
        employeesProcessed: metrics.employeesProcessed || 0,
        newStarters: metrics.newStarters || undefined,
        terminations: metrics.terminations || undefined,
        leaveCalculations: metrics.leaveCalculations || undefined,
        bonusPayments: metrics.bonusPayments || undefined,
        taxAdjustments: metrics.taxAdjustments || undefined,
        superContributions: metrics.superContributions || undefined,
        workersCompClaims: metrics.workersCompClaims || undefined,
        garnishmentOrders: metrics.garnishmentOrders || undefined,
        paygSummaries: metrics.paygSummaries || undefined,
        fbtCalculations: metrics.fbtCalculations || undefined,
        exceptionsHandled: metrics.exceptionsHandled || undefined,
        correctionsRequired: metrics.correctionsRequired || undefined,
        clientCommunications: metrics.clientCommunications || undefined,
        generationNotes: metrics.generationNotes || undefined,
      });
    }
  }, [existingMetrics, form]);

  const onSubmit = async (data: CompletionMetricsFormData) => {
    if (!databaseUserId) {
      toast.error("User authentication required");
      return;
    }

    setIsSubmitting(true);
    try {
      const isUpdate = !!existingMetrics?.payrollCompletionMetrics?.[0];
      
      // For now, we'll use a direct API call since GraphQL mutations may not be ready
      const response = await fetch('/api/billing/tier1/completion-metrics', {
        method: isUpdate ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payrollDateId,
          completedBy: databaseUserId,
          metrics: data,
          generateBilling: true // Auto-generate billing if metrics are valid
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save metrics');
      }

      toast.success(
        isUpdate 
          ? "Completion metrics updated successfully" 
          : "Payroll completed and billing generated successfully"
      );

      if (result.billingGenerated) {
        toast.success(
          `Generated ${result.itemsCreated} billing items totaling $${result.totalAmount?.toFixed(2) || 0}`
        );
      }
      
      onComplete?.(true);
    } catch (error: any) {
      toast.error(`Failed to save metrics: ${error.message}`);
      onComplete?.(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate estimated billing impact
  const calculateEstimatedRevenue = () => {
    const values = form.getValues();
    let total = 0;
    
    // Core services
    total += values.payslipsProcessed * SERVICE_RATES.payslipsProcessed;
    total += (values.newStarters || 0) * SERVICE_RATES.newStarters;
    total += (values.terminations || 0) * SERVICE_RATES.terminations;
    total += (values.leaveCalculations || 0) * SERVICE_RATES.leaveCalculations;
    total += (values.bonusPayments || 0) * SERVICE_RATES.bonusPayments;
    total += (values.taxAdjustments || 0) * SERVICE_RATES.taxAdjustments;
    total += (values.superContributions || 0) * SERVICE_RATES.superContributions;
    total += (values.workersCompClaims || 0) * SERVICE_RATES.workersCompClaims;
    total += (values.garnishmentOrders || 0) * SERVICE_RATES.garnishmentOrders;
    
    // Statutory services
    if (values.paygSummaries) {
      total += values.paygSummaries * SERVICE_RATES.paygSummaries;
    }
    if (values.fbtCalculations) {
      total += values.fbtCalculations * SERVICE_RATES.fbtCalculations;
    }
    
    return total;
  };

  // Calculate complexity score for visual indicator
  const calculateComplexityScore = () => {
    const values = form.getValues();
    let score = 0;
    
    // Base complexity
    score += Math.min(values.payslipsProcessed * 0.1, 10);
    
    // High complexity indicators
    score += (values.newStarters || 0) * 2;
    score += (values.terminations || 0) * 3;
    score += (values.bonusPayments || 0) * 1;
    score += (values.taxAdjustments || 0) * 2;
    score += (values.exceptionsHandled || 0) * 1.5;
    score += (values.correctionsRequired || 0) * 2;
    
    return Math.min(score, 100);
  };

  const estimatedRevenue = calculateEstimatedRevenue();
  const complexityScore = calculateComplexityScore();
  const isExisting = !!existingMetrics?.payrollCompletionMetrics?.[0];
  const billingGenerated = existingMetrics?.payrollCompletionMetrics?.[0]?.billingGenerated;

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading completion metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Payroll Completion Metrics
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {payrollName} • {clientName} • EFT: {new Date(eftDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {billingGenerated && (
              <Badge className="bg-green-100 text-green-800">
                <TrendingUp className="h-3 w-3 mr-1" />
                Billing Generated
              </Badge>
            )}
            {complexityScore > 50 && (
              <Badge variant="outline" className="bg-orange-50 text-orange-700">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Complex Payroll
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estimated Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${estimatedRevenue.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Complexity Score</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{complexityScore.toFixed(0)}</p>
                  <Progress value={complexityScore} className="flex-1 h-2" />
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-lg font-semibold">
                  {isExisting ? "Update Mode" : "New Completion"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Core Deliverables */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 text-green-700 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Core Deliverables
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="payslipsProcessed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payslips Processed *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          {...field} 
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Standard rate: ${SERVICE_RATES.payslipsProcessed} per payslip
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="employeesProcessed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employees Processed *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Total number of employees in this payroll
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            {/* Complexity Indicators */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 text-blue-700 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Complexity Indicators
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="newStarters"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Starters</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormDescription>
                        ${SERVICE_RATES.newStarters} per new employee
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="terminations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Terminations</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormDescription>
                        ${SERVICE_RATES.terminations} per termination
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="leaveCalculations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Leave Calculations</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormDescription>
                        ${SERVICE_RATES.leaveCalculations} per calculation
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            {/* Additional Services */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 text-purple-700">Additional Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="bonusPayments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bonus Payments</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormDescription>
                        ${SERVICE_RATES.bonusPayments} per payment
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="taxAdjustments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Adjustments</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormDescription>
                        ${SERVICE_RATES.taxAdjustments} per adjustment
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="superContributions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Super Contributions</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormDescription>
                        ${SERVICE_RATES.superContributions} per employee
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            {/* Statutory Services */}
            <Card className="p-6 bg-slate-50">
              <h3 className="font-semibold mb-4 text-slate-700">Statutory Services (Seasonal)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="paygSummaries"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PAYG Summaries</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          {...field}
                          value={field.value || ""}
                          onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormDescription>
                        ${SERVICE_RATES.paygSummaries} per summary (year-end only)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="fbtCalculations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>FBT Calculations</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          {...field}
                          value={field.value || ""}
                          onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormDescription>
                        ${SERVICE_RATES.fbtCalculations} per calculation
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            {/* Quality Metrics */}
            <Card className="p-6 bg-orange-50">
              <h3 className="font-semibold mb-4 text-orange-700 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Quality Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="exceptionsHandled"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exceptions Handled</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormDescription>
                        Payroll exceptions requiring manual intervention
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="correctionsRequired"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Corrections Required</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormDescription>
                        Post-processing corrections needed
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="clientCommunications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Communications</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormDescription>
                        Client calls/emails during processing
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            {/* Notes */}
            <FormField
              control={form.control}
              name="generationNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any additional notes about this payroll completion, special circumstances, or billing considerations..."
                      className="min-h-[100px]"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    These notes will be included in the billing justification
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1"
                size="lg"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting 
                  ? "Processing..." 
                  : isExisting 
                    ? "Update Metrics & Regenerate Billing" 
                    : "Complete Payroll & Generate Billing"
                }
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}