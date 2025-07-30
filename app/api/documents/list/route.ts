import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/api-auth';
import { listDocuments } from '@/lib/storage/document-operations';

interface DocumentListResponse {
  success: boolean;
  documents?: any[];
  totalCount?: number;
  pagination?: {
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  error?: string;
}

/**
 * GET /api/documents/list
 * 
 * List documents with filtering and pagination.
 * Supports filtering by client, payroll, category, and other parameters.
 */
export const GET = withAuth(async (req: NextRequest, session) => {
  try {
    const { searchParams } = new URL(req.url);
    
    // Extract query parameters
    const clientId = searchParams.get('clientId');
    const payrollId = searchParams.get('payrollId');
    const category = searchParams.get('category');
    const uploadedBy = searchParams.get('uploadedBy');
    const isPublic = searchParams.get('isPublic');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Validate user permissions
    const userRole = session.role || session.defaultRole;
    const canView = ['developer', 'org_admin', 'manager', 'consultant', 'viewer'].includes(userRole);
    
    if (!canView) {
      return NextResponse.json<DocumentListResponse>(
        { success: false, error: 'Insufficient permissions to view documents' },
        { status: 403 }
      );
    }

    // Build filters object
    const filters: any = {
      limit: Math.min(limit, 100), // Cap at 100
      offset: Math.max(offset, 0),
    };

    if (clientId) filters.clientId = clientId;
    if (payrollId) filters.payrollId = payrollId;
    if (category) filters.category = category;
    if (uploadedBy) filters.uploadedBy = uploadedBy;
    if (isPublic !== null) filters.isPublic = isPublic === 'true';

    // For consultants and viewers, add additional restrictions
    if (userRole === 'consultant') {
      // Consultants can only see their own uploads or public documents
      // This will be enhanced with proper payroll assignment checking
      if (!filters.uploadedBy) {
        filters.uploadedBy = session.databaseId || session.userId;
      }
    } else if (userRole === 'viewer') {
      // Viewers can only see public documents
      filters.isPublic = true;
    }

    console.log(`📋 Listing documents for user: ${session.userId} (${userRole})`);
    console.log(`🔍 Filters:`, filters);

    // Get documents
    const result = await listDocuments(filters, session.databaseId || session.userId);

    const hasMore = result.totalCount > (filters.offset + result.documents.length);

    return NextResponse.json<DocumentListResponse>({
      success: true,
      documents: result.documents,
      totalCount: result.totalCount,
      pagination: {
        limit: filters.limit,
        offset: filters.offset,
        hasMore,
      },
    });

  } catch (error: any) {
    console.error('❌ Document list error:', error);

    return NextResponse.json<DocumentListResponse>(
      {
        success: false,
        error: error.message || 'Failed to list documents',
      },
      { status: 500 }
    );
  }
});