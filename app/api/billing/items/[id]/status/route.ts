import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/api-auth';
import { executeTypedQuery } from '@/lib/apollo/query-helpers';
import { 
  GetBillingItemByIdDocument,
  UpdateBillingItemDocument,
  CreateBillingItemLogDocument
} from '@/domains/billing/graphql/generated/graphql';

interface StatusTransitionRequest {
  newStatus: 'draft' | 'confirmed' | 'invoiced' | 'paid' | 'rejected';
  notes?: string;
  reason?: string;
}

// Define valid status transitions
const VALID_TRANSITIONS = {
  'draft': ['confirmed', 'rejected'],
  'confirmed': ['invoiced', 'rejected', 'draft'],
  'invoiced': ['paid', 'confirmed'],
  'paid': [], // Final state
  'rejected': ['draft']
};

/**
 * PUT /api/billing/items/[id]/status
 * 
 * Manages status transitions for billing items with proper workflow validation.
 * Includes audit logging and permission checks for each transition type.
 */
export const PUT = withAuth(async (req: NextRequest, session, { params }) => {
  try {
    const { id } = params;
    const body: StatusTransitionRequest = await req.json();
    const { newStatus, notes, reason } = body;

    if (!newStatus) {
      return NextResponse.json(
        { success: false, error: 'New status is required' },
        { status: 400 }
      );
    }

    // Get current billing item
    const billingItemData = await executeTypedQuery(
      GetBillingItemByIdDocument,
      { id },
      session
    );

    const billingItem = billingItemData?.billingItemById;
    if (!billingItem) {
      return NextResponse.json(
        { success: false, error: 'Billing item not found' },
        { status: 404 }
      );
    }

    const currentStatus = billingItem.status;

    // Validate status transition
    if (!VALID_TRANSITIONS[currentStatus]?.includes(newStatus)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid status transition from '${currentStatus}' to '${newStatus}'`,
          validTransitions: VALID_TRANSITIONS[currentStatus] || []
        },
        { status: 400 }
      );
    }

    // Check permissions based on status transition
    const userRole = session.role || session.defaultRole;
    
    // Define permission requirements for different transitions
    const requiresManagerPermission = [
      'confirmed', // Approving items
      'rejected'   // Rejecting items
    ].includes(newStatus);

    const requiresAdminPermission = [
      'paid'       // Marking as paid (financial operation)
    ].includes(newStatus);

    if (requiresAdminPermission && !['developer', 'org_admin'].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: `Only administrators can transition items to '${newStatus}' status` },
        { status: 403 }
      );
    }

    if (requiresManagerPermission && !['developer', 'org_admin', 'manager'].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: `Insufficient permissions to transition to '${newStatus}' status` },
        { status: 403 }
      );
    }

    // Prepare update data based on new status
    const updateData: any = {
      status: newStatus,
      notes: notes || billingItem.notes
    };

    // Add status-specific fields
    switch (newStatus) {
      case 'confirmed':
        updateData.isApproved = true;
        updateData.approvalDate = new Date().toISOString();
        updateData.approvedBy = session.userId;
        break;
        
      case 'rejected':
        updateData.isApproved = false;
        updateData.approvalDate = new Date().toISOString();
        updateData.approvedBy = session.userId;
        updateData.notes = notes || reason || 'Item rejected';
        break;
        
      case 'invoiced':
        updateData.invoicedDate = new Date().toISOString();
        break;
        
      case 'paid':
        updateData.paidDate = new Date().toISOString();
        break;
        
      case 'draft':
        // Reset approval fields when moving back to draft
        updateData.isApproved = false;
        updateData.approvalDate = null;
        updateData.approvedBy = null;
        updateData.invoicedDate = null;
        updateData.paidDate = null;
        break;
    }

    // Update the billing item
    const updatedItem = await executeTypedQuery(
      UpdateBillingItemDocument,
      {
        id,
        updates: updateData
      },
      session
    );

    if (!updatedItem?.updateBillingItemById) {
      throw new Error('Failed to update billing item status');
    }

    // Create audit log entry
    try {
      await executeTypedQuery(
        CreateBillingItemLogDocument,
        {
          input: {
            billingItemId: id,
            action: 'status_change',
            oldValue: currentStatus,
            newValue: newStatus,
            notes: notes || reason || `Status changed from ${currentStatus} to ${newStatus}`,
            userId: session.userId
          }
        },
        session
      );
    } catch (logError) {
      console.warn('Failed to create audit log entry:', logError);
      // Don't fail the main operation if logging fails
    }

    return NextResponse.json({
      success: true,
      data: {
        billingItem: updatedItem.updateBillingItemById,
        statusTransition: {
          from: currentStatus,
          to: newStatus,
          reason: reason || notes,
          changedBy: session.userId,
          changedAt: new Date().toISOString()
        }
      },
      message: `Billing item status changed from '${currentStatus}' to '${newStatus}'`
    });

  } catch (error) {
    console.error('Error updating billing item status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update billing item status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
});

/**
 * GET /api/billing/items/[id]/status
 * 
 * Returns current status and available transitions for a billing item
 */
export const GET = withAuth(async (req: NextRequest, session, { params }) => {
  try {
    const { id } = params;

    // Get current billing item
    const billingItemData = await executeTypedQuery(
      GetBillingItemByIdDocument,
      { id },
      session
    );

    const billingItem = billingItemData?.billingItemById;
    if (!billingItem) {
      return NextResponse.json(
        { success: false, error: 'Billing item not found' },
        { status: 404 }
      );
    }

    const currentStatus = billingItem.status;
    const availableTransitions = VALID_TRANSITIONS[currentStatus] || [];

    // Filter transitions based on user permissions
    const userRole = session.role || session.defaultRole;
    const allowedTransitions = availableTransitions.filter(status => {
      if (['paid'].includes(status) && !['developer', 'org_admin'].includes(userRole)) {
        return false;
      }
      if (['confirmed', 'rejected'].includes(status) && !['developer', 'org_admin', 'manager'].includes(userRole)) {
        return false;
      }
      return true;
    });

    return NextResponse.json({
      success: true,
      data: {
        currentStatus,
        availableTransitions: allowedTransitions,
        allPossibleTransitions: availableTransitions,
        statusHistory: billingItem.statusHistory || [],
        permissions: {
          canApprove: ['developer', 'org_admin', 'manager'].includes(userRole),
          canMarkPaid: ['developer', 'org_admin'].includes(userRole),
          canReject: ['developer', 'org_admin', 'manager'].includes(userRole)
        }
      }
    });

  } catch (error) {
    console.error('Error getting billing item status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get billing item status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
});