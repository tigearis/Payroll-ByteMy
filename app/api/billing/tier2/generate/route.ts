import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/api-auth';
import { serverApolloClient } from '@/lib/apollo/unified-client';
import { gql } from '@apollo/client';

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
    const CHECK_PAYROLL_COMPLETION = gql`
      query CheckPayrollCompletion($id: uuid!) {
        payrollsByPk(id: $id) {
          id
          name
          clientId
          status
          client {
            id
            name
          }
          payrollDates {
            id
            status
          }
        }
      }
    `;

    const { data: payrollData } = await client.query({
      query: CHECK_PAYROLL_COMPLETION,
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
    const GET_TIER2_SERVICES = gql`
      query GetTier2Services($payrollId: uuid!, $clientId: uuid!) {
        # Client service agreements for tier 2
        clientServiceAgreements(
          where: {
            clientId: { _eq: $clientId }
            isActive: { _eq: true }
            isEnabled: { _eq: true }
            service: { 
              billingTier: { _eq: "payroll" }
              isActive: { _eq: true }
            }
            billingFrequency: { _in: ["per_payroll", "per_use"] }
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
        
        # Payroll-specific service agreements (overrides)
        payrollServiceAgreements(
          where: {
            payrollId: { _eq: $payrollId }
            isActive: { _eq: true }
            autoBillingEnabled: { _eq: true }
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
      query: GET_TIER2_SERVICES,
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
      const CHECK_EXISTING_BILLING = gql`
        query CheckExistingBilling($payrollId: uuid!, $serviceId: uuid!) {
          billingItems(
            where: {
              payrollId: { _eq: $payrollId }
              serviceId: { _eq: $serviceId }
              payrollDateId: { _is_null: true }
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
          payrollId, 
          serviceId: agreement.serviceId 
        },
        fetchPolicy: 'network-only'
      });

      if (existingData?.billingItems?.length > 0) {
        continue; // Skip if already billed
      }

      // Calculate billing details
      const effectiveRate = agreement.customRate || agreement.service.defaultRate || 0;
      const quantity = 1; // Default quantity for tier 2 services
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

      const description = `${agreement.service.name} - ${payroll.name}${agreement.sourceType === 'payroll' ? ' (Payroll Override)' : ''}`;

      try {
        await client.mutate({
          mutation: CREATE_BILLING_ITEM,
          variables: {
            input: {
              payrollId: payrollId,
              clientId: payroll.clientId,
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
        console.error('Failed to create billing item:', error);
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
    console.error('Error generating tier 2 billing:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export { POST };
export default withAuth(POST);