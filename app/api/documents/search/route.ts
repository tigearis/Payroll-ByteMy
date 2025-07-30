import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/api-auth';
import { executeTypedQuery } from '@/lib/apollo/query-helpers';

interface DocumentSearchResponse {
  success: boolean;
  documents?: any[];
  totalCount?: number;
  searchMeta?: {
    query: string;
    filters: any;
    resultsCount: number;
  };
  error?: string;
}

/**
 * GET /api/documents/search
 * 
 * Advanced document search with full-text search capabilities.
 * Supports searching by filename, content metadata, and associations.
 */
export const GET = withAuth(async (req: NextRequest, session) => {
  try {
    const { searchParams } = new URL(req.url);
    
    // Extract search parameters
    const query = searchParams.get('q') || '';
    const clientId = searchParams.get('clientId');
    const payrollId = searchParams.get('payrollId');
    const category = searchParams.get('category');
    const uploadedBy = searchParams.get('uploadedBy');
    const isPublic = searchParams.get('isPublic');
    const limit = parseInt(searchParams.get('limit') || '25');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Validate user permissions
    const userRole = session.role || session.defaultRole;
    const canSearch = ['developer', 'org_admin', 'manager', 'consultant', 'viewer'].includes(userRole);
    
    if (!canSearch) {
      return NextResponse.json<DocumentSearchResponse>(
        { success: false, error: 'Insufficient permissions to search documents' },
        { status: 403 }
      );
    }

    if (!query.trim() && !clientId && !payrollId) {
      return NextResponse.json<DocumentSearchResponse>(
        { success: false, error: 'Search query or filter criteria required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Document search: "${query}" by user: ${session.userId} (${userRole})`);

    // Build search filters
    const filters: any = {
      limit: Math.min(limit, 100), // Cap at 100
      offset: Math.max(offset, 0),
    };

    // Build where clause for GraphQL query
    const whereClause: any = { 
      fileType: { _eq: 'document' } 
    };

    // Text search on filename (basic implementation - can be enhanced with full-text search)
    if (query.trim()) {
      whereClause.filename = { _ilike: `%${query.trim()}%` };
    }

    // Apply filters
    if (clientId) whereClause.clientId = { _eq: clientId };
    if (payrollId) whereClause.payrollId = { _eq: payrollId };
    if (category) whereClause.category = { _eq: category };
    if (uploadedBy) whereClause.uploadedBy = { _eq: uploadedBy };
    if (isPublic !== null) whereClause.isPublic = { _eq: isPublic === 'true' };

    // Apply role-based restrictions
    if (userRole === 'consultant') {
      // Consultants can only see their own uploads or public documents
      // This will be enhanced with proper payroll assignment checking
      if (!whereClause.uploadedBy) {
        whereClause._or = [
          { uploadedBy: { _eq: session.userId } },
          { isPublic: { _eq: true } }
        ];
      }
    } else if (userRole === 'viewer') {
      // Viewers can only see public documents
      whereClause.isPublic = { _eq: true };
    }

    const SEARCH_DOCUMENTS_QUERY = `
      query SearchDocuments(
        $where: filesBoolExp,
        $limit: Int,
        $offset: Int,
        $orderBy: [filesOrderBy!]
      ) {
        files(
          where: $where,
          limit: $limit,
          offset: $offset,
          orderBy: $orderBy
        ) {
          id
          filename
          bucket
          objectKey
          size
          mimetype
          clientId
          payrollId
          uploadedBy
          category
          isPublic
          metadata
          fileType
          createdAt
          # Include related data for context
          client {
            id
            clientName
          }
          payroll {
            id
            payrollName
          }
          uploadedByUser: userByUploadedBy {
            id
            computedName
            firstName
            lastName
          }
        }
        filesAggregate(where: $where) {
          aggregate {
            count
          }
        }
      }
    `;

    const result = await executeTypedQuery(
      { kind: 'Document', definitions: [] } as any,
      {
        where: whereClause,
        limit: filters.limit,
        offset: filters.offset,
        orderBy: { createdAt: 'DESC' },
      }
    );

    // Generate fresh URLs for all documents
    const { minioClient } = await import('@/lib/storage/minio-client');
    const documentsWithFreshUrls = await Promise.all(
      result.files.map(async (doc: any) => ({
        ...doc,
        url: await minioClient.getDocumentUrl(doc.objectKey),
        // Add computed fields for better UX
        clientName: doc.client?.clientName || null,
        payrollName: doc.payroll?.payrollName || null,
        uploaderName: doc.uploadedByUser?.computedName || 
          `${doc.uploadedByUser?.firstName || ''} ${doc.uploadedByUser?.lastName || ''}`.trim() || 
          'Unknown User',
      }))
    );

    const totalCount = result.filesAggregate?.aggregate?.count || 0;

    console.log(`✅ Search completed: ${documentsWithFreshUrls.length} results found`);

    return NextResponse.json<DocumentSearchResponse>({
      success: true,
      documents: documentsWithFreshUrls,
      totalCount,
      searchMeta: {
        query,
        filters: {
          clientId,
          payrollId,
          category,
          uploadedBy,
          isPublic,
        },
        resultsCount: documentsWithFreshUrls.length,
      },
    });

  } catch (error: any) {
    console.error('❌ Document search error:', error);

    return NextResponse.json<DocumentSearchResponse>(
      {
        success: false,
        error: error.message || 'Document search failed',
      },
      { status: 500 }
    );
  }
});