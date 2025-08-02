import { NextRequest, NextResponse } from 'next/server';
import { withAuthParams } from '@/lib/auth/api-auth';
import { executeTypedQuery } from '@/lib/apollo/query-helpers';
import { UpdateBillingItemAdvancedDocument, type UpdateBillingItemAdvancedMutation } from '@/domains/billing/graphql/generated/graphql';

/**
 * POST /api/billing/items/[id]/approve
 * 
 * Approves a billing item, marking it as ready for invoicing.
 * Requires manager-level permissions.
 */
export const POST = withAuthParams(async (req: NextRequest, { params }, session: any) => {
  try {
    const { id } = await params;
    const body = await req.json();
    const { notes } = body;

    // Check if user has permission to approve billing items
    const userRole = session.role || session.defaultRole || 'viewer';
    if (!['developer', 'org_admin', 'manager'].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions to approve billing items' },
        { status: 403 }
      );
    }

    // Approve the billing item
    const result = await executeTypedQuery<UpdateBillingItemAdvancedMutation>(
      UpdateBillingItemAdvancedDocument,
      {
        id,
        updates: {
          status: 'confirmed',
          isApproved: true,
          approvalDate: new Date().toISOString(),
          approvedBy: session.userId,
          notes: notes || null
        }
      }
    );

    if (!result?.updateBillingItemsByPk) {
      throw new Error('Failed to update billing item');
    }

    return NextResponse.json({
      success: true,
      data: result.updateBillingItemsByPk,
      message: 'Billing item approved successfully'
    });

  } catch (error) {
    console.error('Error approving billing item:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to approve billing item',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
});