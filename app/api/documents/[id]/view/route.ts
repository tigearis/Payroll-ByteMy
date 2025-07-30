import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/api-auth';
import { getDocument } from '@/lib/storage/document-operations';

interface DocumentViewResponse {
  success: boolean;
  viewUrl?: string;
  document?: any;
  error?: string;
}

/**
 * GET /api/documents/[id]/view
 * 
 * Get a presigned URL for viewing a document inline (not downloading).
 * Useful for embedding in PDF viewers, image displays, etc.
 */
export const GET = withAuth(async (req: NextRequest, session, { params }) => {
  try {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const expiryMinutes = parseInt(searchParams.get('expiryMinutes') || '60'); // Default 1 hour

    if (!id) {
      return NextResponse.json<DocumentViewResponse>(
        { success: false, error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Validate expiry (max 24 hours for security)
    const maxExpiryMinutes = 24 * 60; // 24 hours
    const safeExpiryMinutes = Math.min(Math.max(expiryMinutes, 5), maxExpiryMinutes);

    // Validate user permissions
    const userRole = session.role || session.defaultRole;
    const canView = ['developer', 'org_admin', 'manager', 'consultant', 'viewer'].includes(userRole);
    
    if (!canView) {
      return NextResponse.json<DocumentViewResponse>(
        { success: false, error: 'Insufficient permissions to view documents' },
        { status: 403 }
      );
    }

    console.log(`👁️ Getting view URL for document: ${id} (expires in ${safeExpiryMinutes}min)`);

    // Get document with fresh presigned URL
    const document = await getDocument(id, session.databaseId || session.userId);

    if (!document) {
      return NextResponse.json<DocumentViewResponse>(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    // Additional permission checks
    if (userRole === 'viewer' && !document.isPublic) {
      return NextResponse.json<DocumentViewResponse>(
        { success: false, error: 'Document not accessible' },
        { status: 403 }
      );
    }

    if (userRole === 'consultant' && document.uploadedBy !== (session.databaseId || session.userId) && !document.isPublic) {
      // This will be enhanced with proper payroll assignment checking
      return NextResponse.json<DocumentViewResponse>(
        { success: false, error: 'Document not accessible' },
        { status: 403 }
      );
    }

    // Get fresh presigned URL with custom expiry
    const { minioClient } = await import('@/lib/storage/minio-client');
    const viewUrl = await minioClient.getDocumentUrl(
      document.objectKey, 
      safeExpiryMinutes * 60 // Convert to seconds
    );

    console.log(`✅ View URL generated for: ${document.filename}`);

    return NextResponse.json<DocumentViewResponse>({
      success: true,
      viewUrl,
      document: {
        id: document.id,
        filename: document.filename,
        mimetype: document.mimetype,
        size: document.size,
        category: document.category,
        createdAt: document.createdAt,
        isPublic: document.isPublic,
        // Don't expose sensitive fields like objectKey or full metadata
      },
    });

  } catch (error: any) {
    console.error('❌ Document view URL error:', error);

    return NextResponse.json<DocumentViewResponse>(
      {
        success: false,
        error: error.message || 'Failed to generate view URL',
      },
      { status: 500 }
    );
  }
});