import { NextRequest, NextResponse } from 'next/server';
import { withAuthParams } from '@/lib/auth/api-auth';
import { executeTypedQuery, executeTypedMutation } from '@/lib/apollo/query-helpers';
import { 
  GetBillingItemByIdAdvancedDocument,
  GetBillingItemByIdAdvancedQuery,
  UpdateBillingItemAdvancedDocument,
  UpdateBillingItemAdvancedMutation
} from '@/domains/billing/graphql/generated/graphql';
import { CreateAuditLogDocument, CreateAuditLogMutation } from '@/domains/audit/graphql/generated/graphql';

interface StatusTransitionRequest {
  newStatus: 'draft' | 'confirmed' | 'invoiced' | 'paid' | 'rejected';
  notes?: string;
  reason?: string;
}

// Define valid status transitions
const VALID_TRANSITIONS: Record<string, string[]> = {
  'draft': ['confirmed', 'rejected'],
  'confirmed': ['invoiced', 'rejected', 'draft'], 
  'invoiced': ['paid', 'confirmed'],
  'paid': ['draft'], // Allow reverting from paid if needed
  'rejected': ['draft']
};

/**
 * PUT /api/billing/items/[id]/status
 * 
 * Manages status transitions for billing items with proper workflow validation.
 * Includes audit logging and permission checks for each transition type.
 */
export const PUT = withAuthParams(async (req: NextRequest, { params }, session: any) => {
  try {
    const { id } = await params;
    const body: StatusTransitionRequest = await req.json();
    const { newStatus, notes, reason } = body;

    if (!newStatus) {
      return NextResponse.json(
        { success: false, error: 'New status is required' },
        { status: 400 }
      );
    }

    // Get current billing item
    const billingItemData = await executeTypedQuery<GetBillingItemByIdAdvancedQuery>(
      GetBillingItemByIdAdvancedDocument,
      { id }
    );

    const billingItem = billingItemData?.billingItemsByPk;
    if (!billingItem) {
      return NextResponse.json(
        { success: false, error: 'Billing item not found' },
        { status: 404 }
      );
    }

    const currentStatus = (billingItem as any).status || 'draft';

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
    const userRole = session.role || session.defaultRole || 'viewer';
    
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
    const updatedItem = await executeTypedQuery<UpdateBillingItemAdvancedMutation>(
      UpdateBillingItemAdvancedDocument,
      {
        id,
        updates: updateData
      }
    );

    if (!updatedItem?.updateBillingItemsByPk) {
      throw new Error('Failed to update billing item status');
    }

    // Create audit log entry for SOC2 compliance
    try {
      const auditMetadata = {
        billingItemId: id,
        previousStatus: currentStatus,
        newStatus: newStatus,
        reason: reason || notes || 'Status change',
        clientId: billingItem.clientId,
        amount: billingItem.totalAmount || billingItem.amount,
        timestamp: new Date().toISOString()
      };

      await executeTypedMutation<CreateAuditLogMutation>(
        CreateAuditLogDocument,
        {
          userId: session.userId,
          action: `STATUS_CHANGE_${currentStatus.toUpperCase()}_TO_${newStatus.toUpperCase()}`,
          resourceType: 'billing_item',
          resourceId: id,
          metadata: auditMetadata,
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1',
          userAgent: req.headers.get('user-agent') || 'Unknown'
        }
      );

      console.log(`✅ Audit log created: Billing item ${id} status changed from ${currentStatus} to ${newStatus} by user ${session.userId}`);
    } catch (auditError: any) {
      console.error('❌ Failed to create audit log for billing status change:', auditError);
      // Don't fail the entire operation for audit log failures, but log the error
      // In production, this might be escalated to monitoring systems
    }

    return NextResponse.json({
      success: true,
      data: {
        billingItem: updatedItem.updateBillingItemsByPk,
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
export const GET = withAuthParams(async (req: NextRequest, { params }, session: any) => {
  try {
    const { id } = await params;

    // Get current billing item
    const billingItemData = await executeTypedQuery<GetBillingItemByIdAdvancedQuery>(
      GetBillingItemByIdAdvancedDocument,
      { id }
    );

    const billingItem = billingItemData?.billingItemsByPk;
    if (!billingItem) {
      return NextResponse.json(
        { success: false, error: 'Billing item not found' },
        { status: 404 }
      );
    }

    const currentStatus = (billingItem as any).status || 'draft';
    const availableTransitions = VALID_TRANSITIONS[currentStatus] || [];

    // Filter transitions based on user permissions
    const userRole = session.role || session.defaultRole || 'viewer';
    const allowedTransitions = availableTransitions.filter((status: string) => {
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
        statusHistory: (billingItem as any).statusHistory || [],
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