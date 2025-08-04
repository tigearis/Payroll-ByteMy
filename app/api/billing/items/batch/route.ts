import { NextRequest, NextResponse } from 'next/server';
import { 
  UpdateBillingItemAdvancedDocument,
  DeleteBillingItemAdvancedDocument,
  GetBillingItemsAdvancedDocument,
  type UpdateBillingItemAdvancedMutation,
  type DeleteBillingItemAdvancedMutation,
  type GetBillingItemsAdvancedQuery
} from '@/domains/billing/graphql/generated/graphql';
import { executeTypedQuery } from '@/lib/apollo/query-helpers';
import { withAuth } from '@/lib/auth/api-auth';

interface BatchOperationRequest {
  operation: 'approve' | 'reject' | 'delete' | 'update_status';
  itemIds: string[];
  data?: {
    status?: string;
    notes?: string;
    approvalNotes?: string;
  };
}

/**
 * POST /api/billing/items/batch
 * 
 * Performs batch operations on multiple billing items.
 * Supports approve, reject, delete, and status updates.
 */
export const POST = withAuth(async (req: NextRequest, session) => {
  try {
    const body: BatchOperationRequest = await req.json();
    const { operation, itemIds, data = {} } = body;

    if (!operation || !itemIds?.length) {
      return NextResponse.json(
        { success: false, error: 'Operation and item IDs are required' },
        { status: 400 }
      );
    }

    if (itemIds.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Maximum 100 items can be processed in a single batch' },
        { status: 400 }
      );
    }

    // Check permissions based on operation
    const userRole = session.role || session.defaultRole || 'viewer';
    const requiresManagerRole = ['approve', 'reject', 'delete'].includes(operation);
    
    if (requiresManagerRole && !['developer', 'org_admin', 'manager'].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: `Insufficient permissions for ${operation} operation` },
        { status: 403 }
      );
    }

    // Get existing items to validate they exist
    const existingItemsData = await executeTypedQuery<GetBillingItemsAdvancedQuery>(
      GetBillingItemsAdvancedDocument,
      { 
        where: { id: { _in: itemIds } },
        limit: itemIds.length 
      }
    );

    const existingItems = existingItemsData?.billingItems || [];
    const foundItemIds = existingItems.map(item => item.id);
    const notFoundIds = itemIds.filter(id => !foundItemIds.includes(id));

    if (notFoundIds.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Items not found: ${notFoundIds.join(', ')}`,
          notFoundIds 
        },
        { status: 404 }
      );
    }

    const results = [];
    const errors = [];

    // Process each operation
    switch (operation) {
      case 'approve':
        for (const itemId of itemIds) {
          try {
            const result = await executeTypedQuery<UpdateBillingItemAdvancedMutation>(
              UpdateBillingItemAdvancedDocument,
              {
                id: itemId,
                updates: {
                  status: 'confirmed',
                  isApproved: true,
                  approvalDate: new Date().toISOString(),
                  approvedBy: session.userId,
                  notes: data.approvalNotes || null
                }
              }
            );
            results.push({ itemId, success: true, data: result?.updateBillingItemsByPk });
          } catch (error) {
            errors.push({ itemId, error: error instanceof Error ? error.message : 'Unknown error' });
          }
        }
        break;

      case 'reject':
        for (const itemId of itemIds) {
          try {
            const result = await executeTypedQuery<UpdateBillingItemAdvancedMutation>(
              UpdateBillingItemAdvancedDocument,
              {
                id: itemId,
                updates: {
                  status: 'rejected',
                  isApproved: false,
                  approvalDate: new Date().toISOString(),
                  approvedBy: session.userId,
                  notes: data.approvalNotes || 'Rejected via batch operation'
                }
              }
            );
            results.push({ itemId, success: true, data: result?.updateBillingItemsByPk });
          } catch (error) {
            errors.push({ itemId, error: error instanceof Error ? error.message : 'Unknown error' });
          }
        }
        break;

      case 'delete':
        for (const itemId of itemIds) {
          try {
            const result = await executeTypedQuery<DeleteBillingItemAdvancedMutation>(
              DeleteBillingItemAdvancedDocument,
              { id: itemId }
            );
            results.push({ itemId, success: true, deleted: true });
          } catch (error) {
            errors.push({ itemId, error: error instanceof Error ? error.message : 'Unknown error' });
          }
        }
        break;

      case 'update_status':
        if (!data.status) {
          return NextResponse.json(
            { success: false, error: 'Status is required for update_status operation' },
            { status: 400 }
          );
        }
        
        for (const itemId of itemIds) {
          try {
            const result = await executeTypedQuery<UpdateBillingItemAdvancedMutation>(
              UpdateBillingItemAdvancedDocument,
              {
                id: itemId,
                updates: {
                  status: data.status,
                  notes: data.notes || null
                }
              }
            );
            results.push({ itemId, success: true, data: result?.updateBillingItemsByPk });
          } catch (error) {
            errors.push({ itemId, error: error instanceof Error ? error.message : 'Unknown error' });
          }
        }
        break;

      default:
        return NextResponse.json(
          { success: false, error: `Unsupported operation: ${operation}` },
          { status: 400 }
        );
    }

    const successCount = results.length;
    const errorCount = errors.length;

    return NextResponse.json({
      success: errorCount === 0,
      data: {
        operation,
        totalItems: itemIds.length,
        successCount,
        errorCount,
        results,
        errors: errorCount > 0 ? errors : undefined
      },
      message: `Batch ${operation} completed: ${successCount} successful, ${errorCount} failed`
    });

  } catch (error) {
    console.error('Error in batch billing operation:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to perform batch operation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
});