import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/api-auth';
import { serverApolloClient } from '@/lib/apollo/unified-client';
import { 
  GetTimeEntriesByPayrollDocumentDocument, 
  GetNewclientServiceAgreementsDocument, 
  CreateBillingItemAdvancedDocument,
  GetNewServiceCatalogDocument 
} from '@/domains/billing/graphql/generated/graphql';

interface GenerateBillingRequest {
  payrollId: string;
  clientId?: string;
  staffUserId?: string;
  consolidateByService?: boolean;
}

/**
 * Generate billing items from time entries
 */
async function POST(request: NextRequest) {
  try {
    const body = await request.json() as GenerateBillingRequest;
    const { payrollId, clientId, staffUserId, consolidateByService = true } = body;

    if (!payrollId) {
      return NextResponse.json(
        { success: false, error: 'Payroll ID is required' },
        { status: 400 }
      );
    }

    const client = serverApolloClient;

    // Get time entries for the payroll
    const { data: timeEntriesData } = await client.query({
      query: GetTimeEntriesByPayrollDocumentDocument,
      variables: { payrollId },
      fetchPolicy: 'network-only'
    });

    let timeEntries = timeEntriesData.timeEntries || [];

    // Filter by client if specified
    if (clientId) {
      timeEntries = timeEntries.filter((entry: any) => entry.clientId === clientId);
    }

    // Filter by staff user if specified
    if (staffUserId) {
      timeEntries = timeEntries.filter((entry: any) => entry.staffUserId === staffUserId);
    }

    if (timeEntries.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          itemsGenerated: 0,
          totalTimeEntries: 0,
          message: 'No time entries found for the specified criteria'
        }
      });
    }

    // Get service catalog for default rates
    const { data: serviceCatalogData } = await client.query({
      query: GetNewServiceCatalogDocument,
      variables: {},
      fetchPolicy: 'network-only'
    });

    const services = serviceCatalogData.services || [];
    const defaultHourlyRate = 150; // Default rate per hour if no service found

    let billingItemsCreated = 0;

    if (consolidateByService) {
      // Group time entries by client
      const entriesByClient = timeEntries.reduce((acc: any, entry: any) => {
        if (!acc[entry.clientId]) {
          acc[entry.clientId] = [];
        }
        acc[entry.clientId].push(entry);
        return acc;
      }, {});

      // Create consolidated billing items per client
      for (const [currentClientId, clientEntries] of Object.entries(entriesByClient) as [string, any[]][]) {
        const totalHours = clientEntries.reduce((sum, entry) => sum + (entry.hoursSpent || 0), 0);
        const clientName = clientEntries[0]?.client?.name || 'Unknown Client';

        // Look for client service agreements to get custom rates
        let hourlyRate = defaultHourlyRate;
        try {
          const { data: serviceAgreementsData } = await client.query({
            query: GetNewclientServiceAgreementsDocument,
            variables: { clientId: currentClientId },
            fetchPolicy: 'network-only'
          });

          if (serviceAgreementsData.clientServiceAgreements.length > 0) {
            const agreement = serviceAgreementsData.clientServiceAgreements[0];
            hourlyRate = agreement.customRate || defaultHourlyRate;
          }
        } catch (error) {
          console.warn('Could not fetch service agreements for client:', currentClientId);
        }

        const totalAmount = totalHours * hourlyRate;

        try {
          await client.mutate({
            mutation: CreateBillingItemAdvancedDocument,
            variables: {
              input: {
                clientId: currentClientId,
                serviceName: 'Consulting Services',
                description: `Time tracking services for ${clientName} (${totalHours} hours @ $${hourlyRate}/hr)`,
                quantity: totalHours,
                unitPrice: hourlyRate,
                totalAmount,
                status: 'pending',
                isApproved: false,
                notes: `Generated from ${clientEntries.length} time entries`
              }
            }
          });

          billingItemsCreated++;
        } catch (error) {
          console.error('Failed to create billing item for client:', currentClientId, error);
        }
      }
    } else {
      // Create individual billing items for each time entry
      for (const entry of timeEntries) {
        const hourlyRate = defaultHourlyRate; // Could be enhanced with client-specific rates
        const totalAmount = (entry.hoursSpent || 0) * hourlyRate;

        try {
          await client.mutate({
            mutation: CreateBillingItemAdvancedDocument,
            variables: {
              input: {
                clientId: entry.clientId,
                serviceName: 'Consulting Services',
                description: entry.description || `Time tracking services for ${entry.client?.name || 'Client'}`,
                quantity: entry.hoursSpent || 0,
                unitPrice: hourlyRate,
                totalAmount,
                status: 'pending',
                isApproved: false,
                notes: `Generated from time entry on ${entry.workDate}`
              }
            }
          });

          billingItemsCreated++;
        } catch (error) {
          console.error('Failed to create billing item for time entry:', entry.id, error);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        itemsGenerated: billingItemsCreated,
        totalTimeEntries: timeEntries.length,
        consolidationMode: consolidateByService ? 'by-client' : 'individual'
      }
    });

  } catch (error) {
    console.error('Error generating billing from time entries:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export { POST };
export default withAuth(POST);