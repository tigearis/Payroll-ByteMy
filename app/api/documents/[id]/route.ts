import { NextRequest, NextResponse } from 'next/server';
import { withAuthParams } from '@/lib/auth/api-auth';
import { 
  getDocument, 
  deleteDocument, 
  updateDocumentMetadata,
  getDocumentStream 
} from '@/lib/storage/document-operations';

interface DocumentResponse {
  success: boolean;
  document?: any;
  message?: string;
  error?: string;
}

/**
 * GET /api/documents/[id]
 * 
 * Get a specific document by ID with fresh presigned URL.
 */
export const GET = withAuthParams(async (req: NextRequest, { params }, session) => {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json<DocumentResponse>(
        { success: false, error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Validate user permissions
    const userRole = session.role || session.defaultRole || 'viewer';
    const canView = ['developer', 'org_admin', 'manager', 'consultant', 'viewer'].includes(userRole);
    
    if (!canView) {
      return NextResponse.json<DocumentResponse>(
        { success: false, error: 'Insufficient permissions to view documents' },
        { status: 403 }
      );
    }

    console.log(`📄 Getting document: ${id} for user: ${session.userId} (${userRole})`);

    // Get document
    const document = await getDocument(id, session.databaseId || session.userId || 'anonymous');

    if (!document) {
      return NextResponse.json<DocumentResponse>(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    // Additional permission checks
    if (userRole === 'viewer' && !document.isPublic) {
      return NextResponse.json<DocumentResponse>(
        { success: false, error: 'Document not accessible' },
        { status: 403 }
      );
    }

    if (userRole === 'consultant' && document.uploadedBy !== (session.databaseId || session.userId || 'anonymous') && !document.isPublic) {
      // This will be enhanced with proper payroll assignment checking
      return NextResponse.json<DocumentResponse>(
        { success: false, error: 'Document not accessible' },
        { status: 403 }
      );
    }

    return NextResponse.json<DocumentResponse>({
      success: true,
      document,
    });

  } catch (error: any) {
    console.error('❌ Get document error:', error);

    return NextResponse.json<DocumentResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get document',
      },
      { status: 500 }
    );
  }
});

/**
 * PUT /api/documents/[id]
 * 
 * Update document metadata.
 */
export const PUT = withAuthParams(async (req: NextRequest, { params }, session) => {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json<DocumentResponse>(
        { success: false, error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Validate user permissions
    const userRole = session.role || session.defaultRole || 'viewer';
    const canUpdate = ['developer', 'org_admin', 'manager', 'consultant'].includes(userRole);
    
    if (!canUpdate) {
      return NextResponse.json<DocumentResponse>(
        { success: false, error: 'Insufficient permissions to update documents' },
        { status: 403 }
      );
    }

    // First get the document to check ownership for consultants
    const existingDocument = await getDocument(id, session.databaseId || session.userId || 'anonymous');
    if (!existingDocument) {
      return NextResponse.json<DocumentResponse>(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    // Additional permission checks for consultants
    if (userRole === 'consultant' && existingDocument.uploadedBy !== (session.databaseId || session.userId || 'anonymous')) {
      return NextResponse.json<DocumentResponse>(
        { success: false, error: 'You can only update documents you uploaded' },
        { status: 403 }
      );
    }

    const { filename, category, isPublic, metadata } = body;
    
    console.log(`📝 Updating document: ${id} by user: ${session.userId} (${userRole})`);

    // Update document
    const updatedDocument = await updateDocumentMetadata(
      id,
      { filename, category, isPublic, metadata },
      session.databaseId || session.userId || 'anonymous'
    );

    return NextResponse.json<DocumentResponse>({
      success: true,
      document: updatedDocument,
      message: 'Document updated successfully',
    });

  } catch (error: any) {
    console.error('❌ Update document error:', error);

    return NextResponse.json<DocumentResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update document',
      },
      { status: 500 }
    );
  }
});

/**
 * DELETE /api/documents/[id]
 * 
 * Delete a document from both MinIO and database.
 */
export const DELETE = withAuthParams(async (req: NextRequest, { params }, session) => {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json<DocumentResponse>(
        { success: false, error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Validate user permissions
    const userRole = session.role || session.defaultRole || 'viewer';
    const canDelete = ['developer', 'org_admin', 'manager'].includes(userRole);
    
    if (!canDelete) {
      return NextResponse.json<DocumentResponse>(
        { success: false, error: 'Insufficient permissions to delete documents' },
        { status: 403 }
      );
    }

    console.log(`🗑️ Deleting document: ${id} by user: ${session.userId} (${userRole})`);

    // Delete document
    await deleteDocument(id, session.databaseId || session.userId || 'anonymous');

    return NextResponse.json<DocumentResponse>({
      success: true,
      message: 'Document deleted successfully',
    });

  } catch (error: any) {
    console.error('❌ Delete document error:', error);

    return NextResponse.json<DocumentResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete document',
      },
      { status: 500 }
    );
  }
});