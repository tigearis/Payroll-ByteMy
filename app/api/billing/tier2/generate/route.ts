import { NextRequest, NextResponse } from 'next/server';
import { serverApolloClient } from '@/lib/apollo/unified-client';
import { withAuth } from '@/lib/auth/api-auth';
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";
import {
  CheckPayrollCompletionApiTier2Document,
  GetTier2ServicesForApiDocument,
  CheckExistingTier2BillingApiDocument,
  CreateBillingItemApiDocument,
  LogBillingEventApiDocument,
  type CheckPayrollCompletionApiTier2Query,
  type CheckPayrollCompletionApiTier2QueryVariables,
  type GetTier2ServicesForApiQuery,
  type GetTier2ServicesForApiQueryVariables,
  type CheckExistingTier2BillingApiQuery,
  type CheckExistingTier2BillingApiQueryVariables,
  type CreateBillingItemApiMutation,
  type CreateBillingItemApiMutationVariables,
  type LogBillingEventApiMutation,
  type LogBillingEventApiMutationVariables,
} from '@/domains/billing/graphql/generated/graphql';

interface GenerateTier2BillingRequest {
  payrollId: string;
  completedBy: string;
}

interface GenerateTier2BillingResponse {
  success: boolean;
  tier: number;
  payrollId: string;
  itemsCreated: number;
  totalAmount: number;
  message: string;
  error?: string;
}

/**
 * Generate Tier 2 Billing (Payroll Level)
 * Calls the PostgreSQL function to generate billing items for completed payrolls
 */
async function POST(request: NextRequest) {
  try {
    const body = await request.json() as GenerateTier2BillingRequest;
    const { payrollId, completedBy } = body;

    if (!payrollId) {
      return NextResponse.json(
        { success: false, error: 'Payroll ID is required' },
        { status: 400 }
      );
    }

    if (!completedBy) {
      return NextResponse.json(
        { success: false, error: 'Completed By user ID is required' },
        { status: 400 }
      );
    }

    const client = serverApolloClient;

    // First, verify the payroll exists and all payroll dates are completed
    const { data: payrollData } = await client.query<
      CheckPayrollCompletionApiTier2Query,
      CheckPayrollCompletionApiTier2QueryVariables
    >({
      query: CheckPayrollCompletionApiTier2Document,
      variables: { id: payrollId },
      fetchPolicy: 'network-only'
    });

    if (!payrollData?.payrollsByPk) {
      return NextResponse.json(
        { success: false, error: 'Payroll not found' },
        { status: 404 }
      );
    }

    const payroll = payrollData.payrollsByPk;
    const allDatesCompleted = payroll.payrollDates.every((pd: any) => pd.status === 'completed');

    if (!allDatesCompleted) {
      return NextResponse.json(
        { success: false, error: 'All payroll dates must be completed before generating tier 2 billing' },
        { status: 400 }
      );
    }

    // Get tier 2 services (both client agreements and payroll overrides)
    const { data: servicesData } = await client.query<
      GetTier2ServicesForApiQuery,
      GetTier2ServicesForApiQueryVariables
    >({
      query: GetTier2ServicesForApiDocument,
      variables: { 
        payrollId,
        clientId: payroll.clientId 
      },
      fetchPolicy: 'network-only'
    });

    const clientAgreements = servicesData?.clientServiceAgreements || [];
    const payrollAgreements = servicesData?.payrollServiceAgreements || [];
    
    // Combine and deduplicate services (payroll overrides take precedence)
    const allServices = [...clientAgreements, ...payrollAgreements];
    const uniqueServices = allServices.reduce((acc: any[], service: any) => {
      const existing = acc.find((s: any) => s.serviceId === service.serviceId);
      if (!existing) {
        acc.push({ ...service, sourceType: service.payrollId ? 'payroll' : 'client' });
      } else if (service.payrollId) {
        // Replace with payroll override
        const index = acc.findIndex((s: any) => s.serviceId === service.serviceId);
        acc[index] = { ...service, sourceType: 'payroll' };
      }
      return acc;
    }, [] as any[]);

    let itemsCreated = 0;
    let totalAmount = 0;

    // Create billing items for each applicable service
    for (const agreement of uniqueServices) {
      // Check if billing item already exists for this payroll + service (payroll-level)
      const { data: existingData } = await client.query<
        CheckExistingTier2BillingApiQuery,
        CheckExistingTier2BillingApiQueryVariables
      >({
        query: CheckExistingTier2BillingApiDocument,
        variables: { 
          payrollId, 
          serviceId: agreement.serviceId 
        },
        fetchPolicy: 'network-only'
      });

      if (existingData?.billingItems?.length > 0) {
        continue; // Skip if already billed
      }

      // Calculate billing details
      const effectiveRate = agreement.customRate || agreement.service?.defaultRate || agreement.payrollServiceAgreementsByServiceId?.defaultRate || 0;
      const quantity = 1; // Default quantity for tier 2 services
      const itemAmount = quantity * effectiveRate;
      const serviceName = agreement.service?.name || agreement.payrollServiceAgreementsByServiceId?.name || 'Unknown Service';

      const description = `${agreement.service.name} - ${payroll.name}${agreement.sourceType === 'payroll' ? ' (Payroll Override)' : ''}`;

      try {
        await client.mutate<
          CreateBillingItemApiMutation,
          CreateBillingItemApiMutationVariables
        >({
          mutation: CreateBillingItemApiDocument,
          variables: {
            input: {
              payrollId: payrollId,
              clientId: payroll.clientId,
              serviceId: agreement.serviceId,
              serviceName: serviceName,
              description,
              quantity,
              unitPrice: effectiveRate,
              totalAmount: itemAmount,
              staffUserId: completedBy,
              status: 'confirmed'
            }
          }
        });

        itemsCreated++;
        totalAmount += itemAmount;
      } catch (error) {
        logger.error('Failed to create billing item', {
          namespace: 'billing_tier2_api',
          operation: 'create_billing_item',
          classification: DataClassification.CONFIDENTIAL,
          error: error instanceof Error ? error.message : 'Unknown error',
          metadata: {
            payrollId,
            serviceId: agreement.serviceId,
            serviceName: serviceName,
            errorName: error instanceof Error ? error.name : 'UnknownError',
            timestamp: new Date().toISOString()
          }
        });
      }
    }

    // Log the billing generation event
    await client.mutate<
      LogBillingEventApiMutation,
      LogBillingEventApiMutationVariables
    >({
      mutation: LogBillingEventApiDocument,
      variables: {
        input: {
          eventType: 'tier2_billing_generated',
          message: `Generated ${itemsCreated} tier 2 billing items for payroll ${payrollId} (total: $${totalAmount})`,
          createdBy: completedBy
        }
      }
    });

    const result: GenerateTier2BillingResponse = {
      success: true,
      tier: 2,
      payrollId,
      itemsCreated,
      totalAmount,
      message: 'Tier 2 billing items generated successfully'
    };

    return NextResponse.json(result);

  } catch (error) {
    logger.error('Error generating tier 2 billing', {
      namespace: 'billing_tier2_api',
      operation: 'generate_tier2_billing',
      classification: DataClassification.CONFIDENTIAL,
      error: error instanceof Error ? error.message : 'Unknown error',
      metadata: {
        errorName: error instanceof Error ? error.name : 'UnknownError',
        timestamp: new Date().toISOString()
      }
    });
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export { POST };
export default withAuth(POST);