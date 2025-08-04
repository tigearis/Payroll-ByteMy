import { NextRequest, NextResponse } from 'next/server';
import { serverApolloClient } from '@/lib/apollo/unified-client';
import { withAuth } from '@/lib/auth/api-auth';
import { gql } from '@apollo/client';

/**
 * Recurring Billing Generation API
 * Generates monthly recurring service fees based on client subscriptions
 */

interface GenerateRecurringBillingRequest {
  billingMonth: string; // YYYY-MM-DD format (1st of month)
  clientIds?: string[]; // Optional: specific clients, otherwise all active
  serviceCode?: string; // Optional: specific service, otherwise all active
  dryRun?: boolean; // Preview mode
}

interface RecurringBillingResult {
  success: boolean;
  billingMonth: string;
  itemsCreated: number;
  totalAmount: number;
  clientsProcessed: number;
  errors: string[];
  warnings: string[];
  items?: Array<{
    clientId: string;
    clientName: string;
    serviceCode: string;
    serviceName: string;
    amount: number;
    prorated: boolean;
    reason?: string;
  }>;
}

// Standard recurring services configuration (from Tier 1 document)
const RECURRING_SERVICES_CONFIG = {
  'MONTHLY_SERVICE': {
    serviceCode: 'MONTHLY_SERVICE',
    serviceName: 'Monthly Servicing Fee',
    baseRate: 150.00,
    newClientProration: true,
    terminationProration: true,
    minimumCharge: 50.00,
    autoApproval: true,
    description: 'Base client relationship fee covering account management and support'
  },
  'SYSTEM_MAINTENANCE': {
    serviceCode: 'SYSTEM_MAINTENANCE',
    serviceName: 'System Maintenance Fee',
    baseRate: 75.00,
    newClientProration: false, // Full fee regardless of start date
    terminationProration: true,
    autoApproval: true,
    description: 'Technology platform maintenance and infrastructure costs'
  },
  'COMPLIANCE_MONITORING': {
    serviceCode: 'COMPLIANCE_MONITORING',
    serviceName: 'Compliance Monitoring Fee',
    baseRate: 50.00,
    newClientProration: true,
    terminationProration: true,
    autoApproval: true,
    description: 'Ongoing compliance monitoring and regulatory updates'
  },
  'PREMIUM_SUPPORT': {
    serviceCode: 'PREMIUM_SUPPORT',
    serviceName: 'Premium Support Package',
    baseRate: 200.00,
    newClientProration: true,
    terminationProration: true,
    minimumCharge: 100.00,
    autoApproval: false, // Requires manual approval
    description: 'Priority support and dedicated account manager'
  },
  'DATA_BACKUP_SECURITY': {
    serviceCode: 'DATA_BACKUP_SECURITY',
    serviceName: 'Data Backup & Security Package',
    baseRate: 100.00,
    newClientProration: true,
    terminationProration: true,
    minimumCharge: 50.00,
    autoApproval: true,
    description: 'Enhanced data backup and security monitoring'
  }
};

async function POST(request: NextRequest) {
  try {
    const body = await request.json() as GenerateRecurringBillingRequest;
    const { billingMonth, clientIds, serviceCode, dryRun = false } = body;

    // Validate billing month
    const billingDate = new Date(billingMonth);
    if (isNaN(billingDate.getTime()) || billingDate.getDate() !== 1) {
      return NextResponse.json(
        { success: false, error: 'Billing month must be the 1st of a month (YYYY-MM-01)' },
        { status: 400 }
      );
    }

    console.log(`Starting recurring billing generation for ${billingMonth}`, {
      clientIds: clientIds?.length || 'all',
      serviceCode: serviceCode || 'all',
      dryRun
    });

    const client = serverApolloClient;
    const result: RecurringBillingResult = {
      success: true,
      billingMonth,
      itemsCreated: 0,
      totalAmount: 0,
      clientsProcessed: 0,
      errors: [],
      warnings: [],
      items: []
    };

    // 1. Get active clients with potential recurring services
    const GET_ACTIVE_CLIENTS = gql`
      query GetActiveClients($clientIds: [uuid!]) {
        clients(
          where: {
            active: { _eq: true }
            ${clientIds ? 'id: { _in: $clientIds }' : ''}
          }
          orderBy: [{ name: ASC }]
        ) {
          id
          name
          createdAt
          # For now, we'll simulate recurring service subscriptions
          # In real implementation, this would be from client_recurring_services table
        }
      }
    `;

    const { data: clientsData } = await client.query({
      query: GET_ACTIVE_CLIENTS,
      variables: clientIds ? { clientIds } : {},
      fetchPolicy: 'network-only'
    });

    const clients = clientsData?.clients || [];
    console.log(`Found ${clients.length} active clients for billing`);

    // 2. For each client, check what recurring services they should have
    for (const clientData of clients) {
      try {
        result.clientsProcessed++;

        // Check if billing already exists for this client/month
        const CHECK_EXISTING_BILLING = gql`
          query CheckExistingBilling($clientId: uuid!, $billingMonth: date!, $serviceCode: String) {
            billingItems(
              where: {
                clientId: { _eq: $clientId }
                billingPeriodStart: { _eq: $billingMonth }
                generatedFrom: { _eq: "recurring_schedule" }
                ${serviceCode ? 'serviceCode: { _eq: $serviceCode }' : ''}
              }
            ) {
              id
              serviceCode
              totalAmount
            }
          }
        `;

        const { data: existingData } = await client.query({
          query: CHECK_EXISTING_BILLING,
          variables: { 
            clientId: clientData.id, 
            billingMonth: billingMonth,
            ...(serviceCode && { serviceCode })
          },
          fetchPolicy: 'network-only'
        });

        const existingBilling = existingData?.billingItems || [];
        const existingServiceCodes = new Set(existingBilling.map((item: any) => item.serviceCode));

        // 3. Determine which services this client should have
        // For now, we'll apply standard services to all clients
        // In real implementation, this would come from client_recurring_services table
        const clientServices = await determineClientRecurringServices(clientData, serviceCode);

        // 4. Generate billing for each service not already billed
        for (const service of clientServices) {
          if (existingServiceCodes.has(service.serviceCode)) {
            console.log(`Skipping ${service.serviceCode} for ${clientData.name} - already billed`);
            continue;
          }

          try {
            // Calculate amount with pro-ration if needed
            const billingAmount = await calculateRecurringFeeAmount(
              service,
              billingDate,
              clientData
            );

            if (billingAmount <= 0) {
              result.warnings.push(`${clientData.name}: ${service.serviceCode} calculated $0 - skipping`);
              continue;
            }

            // Create billing item (unless dry run)
            if (!dryRun) {
              await createRecurringBillingItem({
                clientId: clientData.id,
                clientName: clientData.name,
                service,
                amount: billingAmount,
                billingMonth: billingDate,
                prorated: billingAmount < service.baseRate
              });
            }

            // Track results
            result.items!.push({
              clientId: clientData.id,
              clientName: clientData.name,
              serviceCode: service.serviceCode,
              serviceName: service.serviceName,
              amount: billingAmount,
              prorated: billingAmount < service.baseRate,
              reason: billingAmount < service.baseRate ? 'Pro-rated for partial month' : undefined
            });

            result.itemsCreated++;
            result.totalAmount += billingAmount;

            console.log(`Generated ${service.serviceCode} for ${clientData.name}: $${billingAmount.toFixed(2)}`);

          } catch (error: any) {
            result.errors.push(`${clientData.name} - ${service.serviceCode}: ${error.message}`);
            console.error(`Service billing error:`, error);
          }
        }

      } catch (error: any) {
        result.errors.push(`Client ${clientData.name}: ${error.message}`);
        console.error(`Client processing error:`, error);
      }
    }

    // 5. Log the generation event (if not dry run)
    if (!dryRun && result.itemsCreated > 0) {
      await logRecurringBillingGeneration(result);
    }

    console.log('Recurring billing generation completed:', {
      itemsCreated: result.itemsCreated,
      totalAmount: result.totalAmount,
      clientsProcessed: result.clientsProcessed,
      errors: result.errors.length,
      warnings: result.warnings.length,
      dryRun
    });

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Recurring billing generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error',
        billingMonth: '',
        itemsCreated: 0,
        totalAmount: 0,
        clientsProcessed: 0,
        errors: [error.message],
        warnings: []
      },
      { status: 500 }
    );
  }
}

/**
 * Determine which recurring services a client should have
 * In real implementation, this would query client_recurring_services table
 */
async function determineClientRecurringServices(clientData: any, serviceCodeFilter?: string) {
  // For now, apply standard services to all clients
  // Later this will be configurable per client
  const standardServices = [
    RECURRING_SERVICES_CONFIG.MONTHLY_SERVICE,
    RECURRING_SERVICES_CONFIG.SYSTEM_MAINTENANCE,
    // Add COMPLIANCE_MONITORING for clients created after a certain date
    ...(new Date(clientData.createdAt) > new Date('2024-01-01') ? [RECURRING_SERVICES_CONFIG.COMPLIANCE_MONITORING] : [])
  ];

  // Filter by specific service if requested
  if (serviceCodeFilter) {
    return standardServices.filter(service => service.serviceCode === serviceCodeFilter);
  }

  return standardServices;
}

/**
 * Calculate recurring fee amount with pro-ration logic
 */
async function calculateRecurringFeeAmount(
  service: any,
  billingMonth: Date,
  clientData: any
): Promise<number> {
  const baseRate = service.customRate || service.baseRate;
  
  // Check for pro-ration scenarios
  const clientHistory = await getClientHistory(clientData.id, billingMonth);
  
  // New client pro-ration
  if (clientHistory.startedDuringMonth && service.newClientProration) {
    const daysInMonth = getDaysInMonth(billingMonth);
    const daysActive = daysInMonth - clientHistory.startDay + 1;
    const prorationMultiplier = daysActive / daysInMonth;
    const proratedAmount = baseRate * prorationMultiplier;
    
    // Apply minimum charge if specified
    return Math.max(proratedAmount, service.minimumCharge || 0);
  }
  
  // Termination pro-ration
  if (clientHistory.terminatedDuringMonth && service.terminationProration) {
    const daysInMonth = getDaysInMonth(billingMonth);
    const daysActive = clientHistory.terminationDay;
    const prorationMultiplier = daysActive / daysInMonth;
    return baseRate * prorationMultiplier;
  }
  
  return baseRate;
}

/**
 * Create recurring billing item in database
 */
async function createRecurringBillingItem({
  clientId,
  clientName,
  service,
  amount,
  billingMonth,
  prorated
}: {
  clientId: string;
  clientName: string;
  service: any;
  amount: number;
  billingMonth: Date;
  prorated: boolean;
}) {
  const CREATE_BILLING_ITEM = gql`
    mutation CreateRecurringBillingItem($input: BillingItemsInsertInput!) {
      insertBillingItemsOne(object: $input) {
        id
        totalAmount
      }
    }
  `;

  const description = `${service.serviceName} - ${formatMonth(billingMonth)}${prorated ? ' (Pro-rated)' : ''}`;
  
  const billingItemInput = {
    clientId,
    serviceName: service.serviceName,
    description,
    serviceCode: service.serviceCode,
    
    quantity: 1,
    unitPrice: amount,
    totalAmount: amount,
    amount,
    
    autoGenerated: true,
    generatedFrom: 'recurring_schedule',
    
    status: service.autoApproval ? 'approved' : 'draft',
    requiresApproval: !service.autoApproval,
    approvalLevel: service.autoApproval ? 'auto' : 'review',
    
    billingPeriodStart: billingMonth.toISOString().split('T')[0],
    billingPeriodEnd: getEndOfMonth(billingMonth).toISOString().split('T')[0],
    billingTier: 'recurring',
    
    rateJustification: prorated 
      ? `Pro-rated ${service.serviceName} for partial month`
      : `Standard recurring ${service.serviceName} fee`
  };

  const result = await serverApolloClient.mutate({
    mutation: CREATE_BILLING_ITEM,
    variables: { input: billingItemInput }
  });

  const billingItemId = result.data?.insertBillingItemsOne?.id;

  // Log in recurring billing log for audit trail
  if (billingItemId) {
    const LOG_RECURRING_BILLING = gql`
      mutation LogRecurringBilling($input: RecurringBillingLogInsertInput!) {
        insertRecurringBillingLogOne(object: $input) {
          id
        }
      }
    `;

    try {
      await serverApolloClient.mutate({
        mutation: LOG_RECURRING_BILLING,
        variables: {
          input: {
            clientId,
            serviceCode: service.serviceCode,
            billingMonth: billingMonth.toISOString().split('T')[0],
            generatedAt: new Date().toISOString(),
            billingItemId,
            amount,
            prorated,
            prorationReason: prorated ? 'Pro-rated for partial month' : null,
            generatedBySystem: true
          }
        }
      });
    } catch (error) {
      console.error('Failed to log recurring billing:', error);
      // Don't fail the entire process for logging errors
    }
  }

  return billingItemId;
}

/**
 * Get client history for pro-ration calculations
 */
async function getClientHistory(clientId: string, billingMonth: Date) {
  // For now, return default values
  // In real implementation, this would check client creation/termination dates
  return {
    startedDuringMonth: false,
    terminatedDuringMonth: false,
    startDay: 1,
    terminationDay: getDaysInMonth(billingMonth)
  };
}

/**
 * Log recurring billing generation event
 */
async function logRecurringBillingGeneration(result: RecurringBillingResult) {
  const LOG_EVENT = gql`
    mutation LogBillingEvent($input: BillingEventLogInsertInput!) {
      insertBillingEventLogOne(object: $input) {
        id
      }
    }
  `;

  try {
    await serverApolloClient.mutate({
      mutation: LOG_EVENT,
      variables: {
        input: {
          eventType: 'recurring_billing_generated',
          message: `Generated ${result.itemsCreated} recurring billing items for ${result.clientsProcessed} clients (${result.billingMonth}) - Total: $${result.totalAmount.toFixed(2)}`,
          metadata: {
            billingMonth: result.billingMonth,
            itemsCreated: result.itemsCreated,
            totalAmount: result.totalAmount,
            clientsProcessed: result.clientsProcessed,
            errors: result.errors,
            warnings: result.warnings
          }
        }
      }
    });
  } catch (error) {
    console.error('Failed to log billing generation event:', error);
  }
}

// Helper functions
function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function getEndOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function formatMonth(date: Date): string {
  return date.toLocaleDateString('en-AU', { year: 'numeric', month: 'long' });
}

export { POST };
export default withAuth(POST);