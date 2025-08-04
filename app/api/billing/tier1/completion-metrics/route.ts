import { NextRequest, NextResponse } from 'next/server';
import { serverApolloClient } from '@/lib/apollo/unified-client';
import { withAuth } from '@/lib/auth/api-auth';
import { gql } from '@apollo/client';
import { Tier1BillingEngine, type PayrollCompletionMetrics } from '@/domains/billing/services/tier1-billing-engine';

/**
 * Tier 1 Immediate Billing System - Completion Metrics API
 * Handles payroll completion metrics creation/update and billing generation
 */

interface CompletionMetricsRequest {
  payrollDateId: string;
  completedBy: string;
  metrics: Omit<PayrollCompletionMetrics, 'payrollDateId' | 'completedBy' | 'completedAt'>;
  generateBilling?: boolean;
}

interface CompletionMetricsResponse {
  success: boolean;
  metricsId?: string;
  billingGenerated?: boolean;
  itemsCreated?: number;
  totalAmount?: number;
  message: string;
  error?: string;
}

/**
 * POST - Create new payroll completion metrics
 */
async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CompletionMetricsRequest;
    const { payrollDateId, completedBy, metrics, generateBilling = true } = body;

    // Validate required fields
    if (!payrollDateId || !completedBy) {
      return NextResponse.json(
        { success: false, error: 'Payroll Date ID and Completed By are required' },
        { status: 400 }
      );
    }

    // Validate metrics
    if (metrics.payslipsProcessed < 0 || metrics.employeesProcessed < 0) {
      return NextResponse.json(
        { success: false, error: 'Core metrics cannot be negative' },
        { status: 400 }
      );
    }

    const client = serverApolloClient;

    // 1. Check if payroll date exists and is not already completed
    const CHECK_PAYROLL_DATE = gql`
      query CheckPayrollDate($payrollDateId: uuid!) {
        payrollDates(where: { id: { _eq: $payrollDateId } }) {
          id
          status
          payroll {
            id
            name
            client {
              id
              name
            }
          }
        }
        # Check if metrics already exist
        existingMetrics: payrollCompletionMetrics(where: { payrollDateId: { _eq: $payrollDateId } }) {
          id
          billingGenerated
        }
      }
    `;

    const { data: checkData } = await client.query({
      query: CHECK_PAYROLL_DATE,
      variables: { payrollDateId },
      fetchPolicy: 'network-only'
    });

    if (!checkData?.payrollDates?.[0]) {
      return NextResponse.json(
        { success: false, error: 'Payroll date not found' },
        { status: 404 }
      );
    }

    if (checkData.existingMetrics?.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Completion metrics already exist for this payroll date. Use PUT to update.' },
        { status: 409 }
      );
    }

    const payrollDate = checkData.payrollDates[0];

    // 2. Create completion metrics
    const CREATE_METRICS = gql`
      mutation CreateCompletionMetrics($input: PayrollCompletionMetricsInsertInput!) {
        insertPayrollCompletionMetricsOne(object: $input) {
          id
          payrollDateId
          completedAt
          billingGenerated
        }
      }
    `;

    const completionData = {
      payrollDateId,
      completedBy,
      completedAt: new Date().toISOString(),
      payslipsProcessed: metrics.payslipsProcessed,
      employeesProcessed: metrics.employeesProcessed,
      newStarters: metrics.newStarters || 0,
      terminations: metrics.terminations || 0,
      leaveCalculations: metrics.leaveCalculations || 0,
      bonusPayments: metrics.bonusPayments || 0,
      taxAdjustments: metrics.taxAdjustments || 0,
      superContributions: metrics.superContributions || 0,
      workersCompClaims: metrics.workersCompClaims || 0,
      garnishmentOrders: metrics.garnishmentOrders || 0,
      paygSummaries: metrics.paygSummaries,
      fbtCalculations: metrics.fbtCalculations,
      exceptionsHandled: metrics.exceptionsHandled || 0,
      correctionsRequired: metrics.correctionsRequired || 0,
      clientCommunications: metrics.clientCommunications || 0,
      generationNotes: metrics.generationNotes,
      billingGenerated: false,
    };

    const { data: metricsData } = await client.mutate({
      mutation: CREATE_METRICS,
      variables: { input: completionData }
    });

    const metricsId = metricsData?.insertPayrollCompletionMetricsOne?.id;
    
    if (!metricsId) {
      throw new Error('Failed to create completion metrics');
    }

    // 3. Update payroll date status to completed
    const UPDATE_PAYROLL_STATUS = gql`
      mutation UpdatePayrollDateStatus($payrollDateId: uuid!, $completedBy: uuid!) {
        updatePayrollDates(
          where: { id: { _eq: $payrollDateId } }
          _set: { 
            status: "completed",
            completedAt: "now()",
            completedBy: $completedBy
          }
        ) {
          affectedRows
        }
      }
    `;

    await client.mutate({
      mutation: UPDATE_PAYROLL_STATUS,
      variables: { payrollDateId, completedBy }
    });

    // 4. Generate billing if requested
    let billingResult = null;
    if (generateBilling && (metrics.payslipsProcessed > 0 || hasSignificantActivity(metrics))) {
      const billingEngine = new Tier1BillingEngine();
      
      const fullMetrics: PayrollCompletionMetrics = {
        payrollDateId,
        completedBy,
        completedAt: new Date().toISOString(),
        ...metrics
      };

      billingResult = await billingEngine.generateBillingFromMetrics(
        payrollDateId,
        fullMetrics,
        completedBy
      );

      if (!billingResult.success) {
        console.error('Billing generation failed:', billingResult.errors);
        // Continue anyway - metrics were saved successfully
      }
    }

    // 5. Log the completion event
    const LOG_EVENT = gql`
      mutation LogCompletionEvent($input: BillingEventLogInsertInput!) {
        insertBillingEventLogOne(object: $input) {
          id
        }
      }
    `;

    await client.mutate({
      mutation: LOG_EVENT,
      variables: {
        input: {
          eventType: 'payroll_completion_with_metrics',
          message: `Payroll ${payrollDate.payroll.name} completed with ${metrics.payslipsProcessed} payslips processed`,
          metadata: {
            payrollDateId,
            clientId: payrollDate.payroll.client.id,
            clientName: payrollDate.payroll.client.name,
            payrollName: payrollDate.payroll.name,
            metricsId,
            billingGenerated: !!billingResult?.success,
            itemsCreated: billingResult?.itemsCreated || 0,
            totalAmount: billingResult?.totalAmount || 0
          },
          createdBy: completedBy
        }
      }
    });

    const response: CompletionMetricsResponse = {
      success: true,
      metricsId,
      billingGenerated: !!billingResult?.success,
      itemsCreated: billingResult?.itemsCreated || 0,
      totalAmount: billingResult?.totalAmount || 0,
      message: billingResult?.success 
        ? `Payroll completed and ${billingResult.itemsCreated} billing items generated`
        : 'Payroll completed successfully'
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Error creating completion metrics:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT - Update existing payroll completion metrics
 */
async function PUT(request: NextRequest) {
  try {
    const body = await request.json() as CompletionMetricsRequest;
    const { payrollDateId, completedBy, metrics, generateBilling = false } = body;

    if (!payrollDateId) {
      return NextResponse.json(
        { success: false, error: 'Payroll Date ID is required' },
        { status: 400 }
      );
    }

    const client = serverApolloClient;

    // 1. Check if metrics exist
    const CHECK_EXISTING = gql`
      query CheckExistingMetrics($payrollDateId: uuid!) {
        payrollCompletionMetrics(where: { payrollDateId: { _eq: $payrollDateId } }) {
          id
          billingGenerated
          billingGeneratedAt
        }
        payrollDates(where: { id: { _eq: $payrollDateId } }) {
          id
          payroll {
            id
            name
            client {
              id
              name
            }
          }
        }
      }
    `;

    const { data: checkData } = await client.query({
      query: CHECK_EXISTING,
      variables: { payrollDateId },
      fetchPolicy: 'network-only'
    });

    if (!checkData?.payrollCompletionMetrics?.[0]) {
      return NextResponse.json(
        { success: false, error: 'Completion metrics not found. Use POST to create new metrics.' },
        { status: 404 }
      );
    }

    const existingMetrics = checkData.payrollCompletionMetrics[0];
    const payrollDate = checkData.payrollDates[0];

    // 2. Update metrics
    const UPDATE_METRICS = gql`
      mutation UpdateCompletionMetrics($payrollDateId: uuid!, $updates: PayrollCompletionMetricsSetInput!) {
        updatePayrollCompletionMetrics(
          where: { payrollDateId: { _eq: $payrollDateId } }
          _set: $updates
        ) {
          affectedRows
          returning {
            id
            billingGenerated
            updatedAt
          }
        }
      }
    `;

    const updates = {
      payslipsProcessed: metrics.payslipsProcessed,
      employeesProcessed: metrics.employeesProcessed,
      newStarters: metrics.newStarters || 0,
      terminations: metrics.terminations || 0,
      leaveCalculations: metrics.leaveCalculations || 0,
      bonusPayments: metrics.bonusPayments || 0,
      taxAdjustments: metrics.taxAdjustments || 0,
      superContributions: metrics.superContributions || 0,
      workersCompClaims: metrics.workersCompClaims || 0,
      garnishmentOrders: metrics.garnishmentOrders || 0,
      paygSummaries: metrics.paygSummaries,
      fbtCalculations: metrics.fbtCalculations,
      exceptionsHandled: metrics.exceptionsHandled || 0,
      correctionsRequired: metrics.correctionsRequired || 0,
      clientCommunications: metrics.clientCommunications || 0,
      generationNotes: metrics.generationNotes,
      // Reset billing status if regenerating
      billingGenerated: generateBilling ? false : existingMetrics.billingGenerated,
      billingGeneratedAt: generateBilling ? null : existingMetrics.billingGeneratedAt,
    };

    await client.mutate({
      mutation: UPDATE_METRICS,
      variables: { payrollDateId, updates }
    });

    // 3. Regenerate billing if requested
    let billingResult = null;
    if (generateBilling) {
      // First, delete existing auto-generated billing items for this payroll date
      const DELETE_EXISTING_BILLING = gql`
        mutation DeleteExistingBilling($payrollDateId: uuid!) {
          deleteBillingItems(
            where: { 
              payrollDateId: { _eq: $payrollDateId }
              autoGenerated: { _eq: true }
              billingTier: { _eq: "tier1" }
            }
          ) {
            affectedRows
          }
        }
      `;

      const deleteResult = await client.mutate({
        mutation: DELETE_EXISTING_BILLING,
        variables: { payrollDateId }
      });

      console.log(`Deleted ${deleteResult.data?.deleteBillingItems?.affectedRows || 0} existing billing items`);

      // Generate new billing
      if (metrics.payslipsProcessed > 0 || hasSignificantActivity(metrics)) {
        const billingEngine = new Tier1BillingEngine();
        
        const fullMetrics: PayrollCompletionMetrics = {
          payrollDateId,
          completedBy: completedBy || 'system',
          completedAt: new Date().toISOString(),
          ...metrics
        };

        billingResult = await billingEngine.generateBillingFromMetrics(
          payrollDateId,
          fullMetrics,
          completedBy || 'system'
        );
      }
    }

    const response: CompletionMetricsResponse = {
      success: true,
      billingGenerated: !!billingResult?.success,
      itemsCreated: billingResult?.itemsCreated || 0,
      totalAmount: billingResult?.totalAmount || 0,
      message: billingResult?.success 
        ? `Metrics updated and ${billingResult.itemsCreated} billing items regenerated`
        : 'Completion metrics updated successfully'
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Error updating completion metrics:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET - Retrieve payroll completion metrics
 */
async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const payrollDateId = searchParams.get('payrollDateId');

    if (!payrollDateId) {
      return NextResponse.json(
        { success: false, error: 'Payroll Date ID is required' },
        { status: 400 }
      );
    }

    const client = serverApolloClient;

    const GET_METRICS = gql`
      query GetCompletionMetrics($payrollDateId: uuid!) {
        payrollCompletionMetrics(where: { payrollDateId: { _eq: $payrollDateId } }) {
          id
          payrollDateId
          completedBy
          completedAt
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
          createdAt
          updatedAt
          completedByUser {
            id
            firstName
            lastName
            computedName
          }
        }
        payrollDates(where: { id: { _eq: $payrollDateId } }) {
          id
          originalEftDate
          adjustedEftDate
          status
          payroll {
            id
            name
            client {
              id
              name
            }
          }
          billingItems(
            where: { 
              autoGenerated: { _eq: true }
              billingTier: { _eq: "tier1" }
            }
            orderBy: [{ createdAt: DESC }]
          ) {
            id
            serviceCode
            serviceName
            description
            quantity
            unitPrice
            totalAmount
            status
            approvalLevel
            rateJustification
            createdAt
          }
        }
      }
    `;

    const { data } = await client.query({
      query: GET_METRICS,
      variables: { payrollDateId },
      fetchPolicy: 'network-only'
    });

    return NextResponse.json({
      success: true,
      metrics: data?.payrollCompletionMetrics?.[0] || null,
      payrollDate: data?.payrollDates?.[0] || null,
      billingItems: data?.payrollDates?.[0]?.billingItems || []
    });

  } catch (error: any) {
    console.error('Error fetching completion metrics:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to determine if metrics show significant activity
 */
function hasSignificantActivity(metrics: any): boolean {
  return (
    metrics.newStarters > 0 ||
    metrics.terminations > 0 ||
    metrics.leaveCalculations > 0 ||
    metrics.bonusPayments > 0 ||
    metrics.taxAdjustments > 0 ||
    metrics.superContributions > 0 ||
    (metrics.paygSummaries && metrics.paygSummaries > 0) ||
    (metrics.fbtCalculations && metrics.fbtCalculations > 0)
  );
}

export { POST, PUT, GET };
export default withAuth(POST);