import { gql } from '@apollo/client';
import { NextRequest, NextResponse } from 'next/server';
import { serverApolloClient } from '@/lib/apollo/unified-client';
import { withAuth } from '@/lib/auth/api-auth';
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";

interface GenerateTier1BillingRequest {
  payrollDateId: string;
  completedBy: string;
}

interface GenerateTier1BillingResponse {
  success: boolean;
  tier: number;
  payrollDateId: string;
  itemsCreated: number;
  totalAmount: number;
  message: string;
  error?: string;
}

/**
 * Generate Tier 1 Billing (Payroll Date Level)
 * Calls the PostgreSQL function to generate billing items for completed payroll dates
 */
async function POST(request: NextRequest) {
  try {
    const body = await request.json() as GenerateTier1BillingRequest;
    const { payrollDateId, completedBy } = body;

    if (!payrollDateId) {
      return NextResponse.json(
        { success: false, error: 'Payroll Date ID is required' },
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

    // Call the PostgreSQL function via raw SQL
    const GENERATE_TIER1_BILLING = gql`
      query GenerateTier1Billing($payrollDateId: uuid!, $completedBy: uuid!) {
        generateTier1BillingResult: query(
          query: "SELECT public.generate_tier1_billing($1::uuid, $2::uuid) as result"
          variables: [$payrollDateId, $completedBy]
        ) {
          result
        }
      }
    `;

    // Since the function isn't exposed via GraphQL, we'll use a direct database connection
    // For now, let's create a workaround by checking the payroll date status and generating billing items manually
    
    // First, verify the payroll date exists and is completed
    const CHECK_PAYROLL_DATE = gql`
      query CheckPayrollDate($id: uuid!) {
        payrollDatesByPk(id: $id) {
          id
          status
          payrollId
          completedAt
          completedBy
          payroll {
            id
            name
            clientId
            client {
              id
              name
            }
          }
        }
      }
    `;

    const { data: payrollDateData } = await client.query({
      query: CHECK_PAYROLL_DATE,
      variables: { id: payrollDateId },
      fetchPolicy: 'network-only'
    });

    if (!payrollDateData?.payrollDatesByPk) {
      return NextResponse.json(
        { success: false, error: 'Payroll date not found' },
        { status: 404 }
      );
    }

    const payrollDate = payrollDateData.payrollDatesByPk;

    if (payrollDate.status !== 'completed') {
      return NextResponse.json(
        { success: false, error: 'Payroll date must be completed before generating billing' },
        { status: 400 }
      );
    }

    // Get tier 1 services for this client
    const GET_TIER1_SERVICES = gql`
      query GetTier1Services($clientId: uuid!) {
        clientServiceAgreements(
          where: {
            clientId: { _eq: $clientId }
            isActive: { _eq: true }
            isEnabled: { _eq: true }
            service: { 
              billingTier: { _eq: "payroll_date" }
              isActive: { _eq: true }
            }
            billingFrequency: { _in: ["per_use", "per_payroll_date"] }
          }
        ) {
          id
          serviceId
          customRate
          billingFrequency
          serviceConfiguration
          service {
            id
            name
            description
            billingUnit
            defaultRate
            billingTier
            tierPriority
          }
        }
      }
    `;

    const { data: servicesData } = await client.query({
      query: GET_TIER1_SERVICES,
      variables: { clientId: payrollDate.payroll.clientId },
      fetchPolicy: 'network-only'
    });

    const serviceAgreements = servicesData?.clientServiceAgreements || [];
    let itemsCreated = 0;
    let totalAmount = 0;

    // Create billing items for each applicable service
    for (const agreement of serviceAgreements) {
      // Check if billing item already exists
      const CHECK_EXISTING_BILLING = gql`
        query CheckExistingBilling($payrollDateId: uuid!, $serviceId: uuid!) {
          billingItems(
            where: {
              payrollDateId: { _eq: $payrollDateId }
              serviceId: { _eq: $serviceId }
              status: { _neq: "draft" }
            }
          ) {
            id
          }
        }
      `;

      const { data: existingData } = await client.query({
        query: CHECK_EXISTING_BILLING,
        variables: { 
          payrollDateId, 
          serviceId: agreement.serviceId 
        },
        fetchPolicy: 'network-only'
      });

      if (existingData?.billingItems?.length > 0) {
        continue; // Skip if already billed
      }

      // Calculate billing details
      const effectiveRate = agreement.customRate || agreement.service.defaultRate || 0;
      const quantity = 1; // Default quantity for tier 1 services
      const itemAmount = quantity * effectiveRate;

      // Create billing item
      const CREATE_BILLING_ITEM = gql`
        mutation CreateBillingItem($input: BillingItemsInsertInput!) {
          insertBillingItemsOne(object: $input) {
            id
            description
            totalAmount
          }
        }
      `;

      const description = `${agreement.service.name} - ${payrollDate.payroll.name} (EFT: ${new Date(payrollDate.adjustedEftDate || payrollDate.originalEftDate).toLocaleDateString()})`;

      try {
        await client.mutate({
          mutation: CREATE_BILLING_ITEM,
          variables: {
            input: {
              payrollId: payrollDate.payrollId,
              payrollDateId: payrollDateId,
              clientId: payrollDate.payroll.clientId,
              serviceId: agreement.serviceId,
              serviceName: agreement.service.name,
              description,
              quantity,
              unitPrice: effectiveRate,
              totalAmount: itemAmount,
              amount: itemAmount,
              staffUserId: completedBy,
              status: 'confirmed'
            }
          }
        });

        itemsCreated++;
        totalAmount += itemAmount;
      } catch (error) {
        logger.error('Failed to create billing item', {
          namespace: 'billing_tier1_api',
          operation: 'create_billing_item',
          classification: DataClassification.CONFIDENTIAL,
          error: error instanceof Error ? error.message : 'Unknown error',
          metadata: {
            payrollDateId,
            serviceId: agreement.serviceId,
            serviceName: agreement.service.name,
            errorName: error instanceof Error ? error.name : 'UnknownError',
            timestamp: new Date().toISOString()
          }
        });
      }
    }

    // Log the billing generation event
    const LOG_EVENT = gql`
      mutation LogBillingEvent($input: BillingEventLogInsertInput!) {
        insertBillingEventLogOne(object: $input) {
          id
        }
      }
    `;

    await client.mutate({
      mutation: LOG_EVENT,
      variables: {
        input: {
          eventType: 'tier1_billing_generated',
          message: `Generated ${itemsCreated} tier 1 billing items for payroll date ${payrollDateId} (total: $${totalAmount})`,
          createdBy: completedBy
        }
      }
    });

    const result: GenerateTier1BillingResponse = {
      success: true,
      tier: 1,
      payrollDateId,
      itemsCreated,
      totalAmount,
      message: 'Tier 1 billing items generated successfully'
    };

    return NextResponse.json(result);

  } catch (error) {
    logger.error('Error generating tier 1 billing', {
      namespace: 'billing_tier1_api',
      operation: 'generate_tier1_billing',
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