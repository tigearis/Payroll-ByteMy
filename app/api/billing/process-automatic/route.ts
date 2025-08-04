import { gql } from '@apollo/client';
import { NextRequest, NextResponse } from 'next/server';
import { serverApolloClient } from '@/lib/apollo/unified-client';
import { withAuth } from '@/lib/auth/api-auth';

interface AutomaticBillingResult {
  success: boolean;
  totalItemsCreated: number;
  totalAmountGenerated: number;
  tier1Results: any[];
  tier2Results: any[];
  tier3Results: any[];
  processedAt: string;
  summary: {
    tier1Count: number;
    tier2Count: number;
    tier3Count: number;
  };
}

/**
 * Process Automatic Billing (All Tiers)
 * Comprehensive automatic billing processing across all three tiers
 */
async function POST(request: NextRequest) {
  try {
    const client = serverApolloClient;
    
    const tier1Results: any[] = [];
    const tier2Results: any[] = [];
    const tier3Results: any[] = [];
    let totalItemsCreated = 0;
    let totalAmountGenerated = 0;

    // =================================================================
    // TIER 1: Process completed payroll dates (last 7 days)
    // =================================================================
    
    const GET_TIER1_CANDIDATES = gql`
      query GetTier1Candidates {
        payrollDates(
          where: {
            status: { _eq: "completed" }
            completedAt: { _gte: "now() - interval '7 days'" }
            _not: {
              billingItems: {
                status: { _neq: "draft" }
              }
            }
          }
          limit: 50
          orderBy: { completedAt: desc }
        ) {
          id
          completedBy
          completedAt
          payrollId
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

    const { data: tier1Data } = await client.query({
      query: GET_TIER1_CANDIDATES,
      fetchPolicy: 'network-only'
    });

    const tier1Candidates = tier1Data?.payrollDates || [];
    
    for (const payrollDate of tier1Candidates) {
      try {
        // Call tier 1 billing generation API internally
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/billing/tier1/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payrollDateId: payrollDate.id,
            completedBy: payrollDate.completedBy
          })
        });

        const result = await response.json();
        tier1Results.push(result);

        if (result.success) {
          totalItemsCreated += result.itemsCreated || 0;
          totalAmountGenerated += result.totalAmount || 0;
        }
      } catch (error) {
        console.error('Error processing tier 1 for payroll date:', payrollDate.id, error);
        tier1Results.push({
          success: false,
          error: 'Failed to process tier 1 billing',
          payrollDateId: payrollDate.id
        });
      }
    }

    // =================================================================
    // TIER 2: Process completed payrolls (last 30 days)
    // =================================================================
    
    const GET_TIER2_CANDIDATES = gql`
      query GetTier2Candidates {
        payrolls(
          where: {
            _not: {
              payrollDates: {
                status: { _neq: "completed" }
              }
            }
            _not: {
              billingItems: {
                payrollDateId: { _is_null: true }
                status: { _neq: "draft" }
              }
            }
            payrollDates: {
              completedAt: { _gte: "now() - interval '30 days'" }
            }
          }
          limit: 25
          orderBy: { updatedAt: desc }
        ) {
          id
          name
          primaryConsultantUserId
          client {
            id
            name
          }
        }
      }
    `;

    const { data: tier2Data } = await client.query({
      query: GET_TIER2_CANDIDATES,
      fetchPolicy: 'network-only'
    });

    const tier2Candidates = tier2Data?.payrolls || [];
    
    for (const payroll of tier2Candidates) {
      try {
        // Call tier 2 billing generation API internally
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/billing/tier2/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payrollId: payroll.id,
            completedBy: payroll.primaryConsultantUserId
          })
        });

        const result = await response.json();
        tier2Results.push(result);

        if (result.success) {
          totalItemsCreated += result.itemsCreated || 0;
          totalAmountGenerated += result.totalAmount || 0;
        }
      } catch (error) {
        console.error('Error processing tier 2 for payroll:', payroll.id, error);
        tier2Results.push({
          success: false,
          error: 'Failed to process tier 2 billing',
          payrollId: payroll.id
        });
      }
    }

    // =================================================================
    // TIER 3: Process monthly billing ready
    // =================================================================
    
    const GET_TIER3_CANDIDATES = gql`
      query GetTier3Candidates {
        monthlyBillingCompletion(
          where: {
            status: { _eq: "ready_to_bill" }
            tier3BillingGenerated: { _eq: false }
            autoBillingEnabled: { _eq: true }
          }
          limit: 20
          orderBy: [{ billingMonth: desc }, { billingReadyAt: asc }]
        ) {
          id
          clientId
          billingMonth
          client {
            id
            name
          }
        }
      }
    `;

    const { data: tier3Data } = await client.query({
      query: GET_TIER3_CANDIDATES,
      fetchPolicy: 'network-only'
    });

    const tier3Candidates = tier3Data?.monthlyBillingCompletion || [];
    
    for (const monthlyRecord of tier3Candidates) {
      try {
        // Call tier 3 billing generation API internally
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/billing/tier3/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clientId: monthlyRecord.clientId,
            billingMonth: monthlyRecord.billingMonth,
            generatedBy: '00000000-0000-0000-0000-000000000000' // System user
          })
        });

        const result = await response.json();
        tier3Results.push(result);

        if (result.success) {
          totalItemsCreated += result.itemsCreated || 0;
          totalAmountGenerated += result.totalAmount || 0;
        }
      } catch (error) {
        console.error('Error processing tier 3 for client:', monthlyRecord.clientId, error);
        tier3Results.push({
          success: false,
          error: 'Failed to process tier 3 billing',
          clientId: monthlyRecord.clientId,
          billingMonth: monthlyRecord.billingMonth
        });
      }
    }

    // =================================================================
    // Log comprehensive billing processing event
    // =================================================================
    
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
          eventType: 'automatic_billing_processed',
          message: `Processed automatic billing: ${totalItemsCreated} items created, $${totalAmountGenerated} total (T1: ${tier1Results.length}, T2: ${tier2Results.length}, T3: ${tier3Results.length})`,
          createdBy: '00000000-0000-0000-0000-000000000000' // System user
        }
      }
    });

    // =================================================================
    // Return comprehensive results
    // =================================================================
    
    const result: AutomaticBillingResult = {
      success: true,
      totalItemsCreated,
      totalAmountGenerated,
      tier1Results,
      tier2Results,
      tier3Results,
      processedAt: new Date().toISOString(),
      summary: {
        tier1Count: tier1Results.length,
        tier2Count: tier2Results.length,
        tier3Count: tier3Results.length
      }
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error processing automatic billing:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check what would be processed without actually doing it
 */
async function GET(request: NextRequest) {
  try {
    const client = serverApolloClient;
    
    // Get counts of what would be processed
    const GET_BILLING_CANDIDATES = gql`
      query GetBillingCandidates {
        # Tier 1 candidates
        tier1Candidates: payrollDatesAggregate(
          where: {
            status: { _eq: "completed" }
            completedAt: { _gte: "now() - interval '7 days'" }
            _not: {
              billingItems: {
                status: { _neq: "draft" }
              }
            }
          }
        ) {
          aggregate {
            count
          }
        }
        
        # Tier 2 candidates
        tier2Candidates: payrollsAggregate(
          where: {
            _not: {
              payrollDates: {
                status: { _neq: "completed" }
              }
            }
            _not: {
              billingItems: {
                payrollDateId: { _is_null: true }
                status: { _neq: "draft" }
              }
            }
            payrollDates: {
              completedAt: { _gte: "now() - interval '30 days'" }
            }
          }
        ) {
          aggregate {
            count
          }
        }
        
        # Tier 3 candidates
        tier3Candidates: monthlyBillingCompletionAggregate(
          where: {
            status: { _eq: "ready_to_bill" }
            tier3BillingGenerated: { _eq: false }
            autoBillingEnabled: { _eq: true }
          }
        ) {
          aggregate {
            count
          }
        }
      }
    `;

    const { data } = await client.query({
      query: GET_BILLING_CANDIDATES,
      fetchPolicy: 'network-only'
    });

    return NextResponse.json({
      success: true,
      candidateCount: {
        tier1: data?.tier1Candidates?.aggregate?.count || 0,
        tier2: data?.tier2Candidates?.aggregate?.count || 0,
        tier3: data?.tier3Candidates?.aggregate?.count || 0
      },
      message: 'Billing candidates retrieved successfully'
    });

  } catch (error) {
    console.error('Error getting billing candidates:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export { POST, GET };
export default withAuth(POST);