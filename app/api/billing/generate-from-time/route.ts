import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/api-auth';
import { executeTypedQuery } from '@/lib/apollo/query-helpers';
import { 
  GetTimeEntriesByPayrollDocument,
  CreateBillingItemDocument,
  GetClientServicesWithRatesDocument,
  type GetTimeEntriesByPayrollQuery,
  type CreateBillingItemMutation,
  type GetClientServicesWithRatesQuery
} from '@/domains/billing/graphql/generated/graphql';

interface GenerateBillingRequest {
  payrollId: string;
  clientId?: string;
  staffUserId?: string;
  consolidateByService?: boolean;
}

/**
 * POST /api/billing/generate-from-time
 * 
 * Automatically generates billing items from time entries for a specific payroll.
 * This enables the automation of converting tracked work hours into billable items.
 */
export const POST = withAuth(async (req: NextRequest, session) => {
  try {
    const body: GenerateBillingRequest = await req.json();
    const { payrollId, clientId, staffUserId, consolidateByService = false } = body;

    if (!payrollId) {
      return NextResponse.json(
        { success: false, error: 'Payroll ID is required' },
        { status: 400 }
      );
    }

    // Get time entries for the payroll
    const timeEntriesData = await executeTypedQuery<GetTimeEntriesByPayrollQuery>(
      GetTimeEntriesByPayrollDocument,
      { payrollId }
    );

    if (!timeEntriesData?.timeEntries?.length) {
      return NextResponse.json(
        { success: false, error: 'No time entries found for this payroll' },
        { status: 404 }
      );
    }

    let timeEntries = timeEntriesData.timeEntries;

    // Filter by client and/or staff user if specified
    if (clientId) {
      timeEntries = timeEntries.filter(entry => entry.clientId === clientId);
    }
    if (staffUserId) {
      timeEntries = timeEntries.filter(entry => entry.staffUserId === staffUserId);
    }

    if (!timeEntries.length) {
      return NextResponse.json(
        { success: false, error: 'No matching time entries found' },
        { status: 404 }
      );
    }

    // Get client service rates for pricing
    const clientServices = new Map();
    const uniqueClientIds = [...new Set(timeEntries.map(entry => entry.clientId))];
    
    for (const cId of uniqueClientIds) {
      const servicesData = await executeTypedQuery<GetClientServicesWithRatesQuery>(
        GetClientServicesWithRatesDocument,
        { clientId: cId }
      );
      clientServices.set(cId, servicesData?.clientServiceAgreements || []);
    }

    const generatedItems = [];

    if (consolidateByService) {
      // Group time entries by client and service (using default hourly service)
      const groupedEntries = new Map();
      
      timeEntries.forEach(entry => {
        const key = `${entry.clientId}-hourly`;
        if (!groupedEntries.has(key)) {
          groupedEntries.set(key, {
            clientId: entry.clientId,
            staffUserId: entry.staffUserId,
            entries: [],
            totalHours: 0,
            descriptions: new Set()
          });
        }
        
        const group = groupedEntries.get(key);
        group.entries.push(entry);
        group.totalHours += entry.hoursSpent;
        group.descriptions.add(entry.description);
      });

      // Create consolidated billing items
      for (const [key, group] of groupedEntries) {
        const services = clientServices.get(group.clientId) || [];
        const hourlyService = services.find((s: any) => 
          s.service?.billingUnit?.toLowerCase().includes('hour')
        );
        
        const hourlyRate = hourlyService?.customRate || hourlyService?.service?.defaultRate || 150;
        
        const billingItemData = {
          description: `Professional Services - ${Array.from(group.descriptions).join(', ')}`,
          unitPrice: hourlyRate,
          quantity: Math.round(group.totalHours * 100) / 100, // Round to 2 decimal places
          clientId: group.clientId,
          staffUserId: group.staffUserId,
          payrollId,
          serviceName: hourlyService?.service?.name || 'Professional Services',
          hourlyRate,
          status: 'draft',
          notes: `Generated from ${group.entries.length} time entries`
        };

        const createdItem = await executeTypedQuery<CreateBillingItemMutation>(
          CreateBillingItemDocument,
          { input: billingItemData }
        );

        generatedItems.push(createdItem?.insertBillingItemsOne);
      }
    } else {
      // Create individual billing items for each time entry
      for (const entry of timeEntries) {
        const services = clientServices.get(entry.clientId) || [];
        const hourlyService = services.find((s: any) => 
          s.service?.billingUnit?.toLowerCase().includes('hour')
        );
        
        const hourlyRate = hourlyService?.customRate || hourlyService?.service?.defaultRate || 150;
        
        const billingItemData = {
          description: entry.description || 'Professional Services',
          unitPrice: hourlyRate,
          quantity: entry.hoursSpent,
          clientId: entry.clientId,
          staffUserId: entry.staffUserId,
          payrollId,
          serviceName: hourlyService?.service?.name || 'Professional Services',
          hourlyRate,
          status: 'draft',
          notes: `Generated from time entry on ${entry.workDate}`
        };

        const createdItem = await executeTypedQuery<CreateBillingItemMutation>(
          CreateBillingItemDocument,
          { input: billingItemData }
        );

        generatedItems.push(createdItem?.insertBillingItemsOne);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        itemsGenerated: generatedItems.length,
        totalTimeEntries: timeEntries.length,
        consolidatedByService: consolidateByService,
        items: generatedItems
      }
    });

  } catch (error) {
    console.error('Error generating billing items from time entries:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate billing items',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
});