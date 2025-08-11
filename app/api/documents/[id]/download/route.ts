import { NextRequest, NextResponse } from 'next/server';
import { withAuthParams } from '@/lib/auth/api-auth';
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";
import { getDocument, getDocumentStream } from '@/lib/storage/document-operations';

/**
 * GET /api/documents/[id]/download
 * 
 * Download a document directly (forces download instead of inline view).
 * Includes proper authentication and permission checking.
 */
export const GET = withAuthParams(async (req: NextRequest, { params }, session) => {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Validate user permissions
    const userRole = session.role || session.defaultRole || 'viewer';
    const canDownload = ['developer', 'org_admin', 'manager', 'consultant', 'viewer'].includes(userRole);
    
    if (!canDownload) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions to download documents' },
        { status: 403 }
      );
    }

    console.log(`⬇️ Downloading document: ${id} for user: ${session.userId} (${userRole})`);

    // Get document metadata first
    const document = await getDocument(id, session.databaseId || session.userId || 'anonymous');

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    // Additional permission checks
    if (userRole === 'viewer' && !document.isPublic) {
      return NextResponse.json(
        { success: false, error: 'Document not accessible' },
        { status: 403 }
      );
    }

    if (userRole === 'consultant' && document.uploadedBy !== (session.databaseId || session.userId || 'anonymous') && !document.isPublic) {
      // This will be enhanced with proper payroll assignment checking
      return NextResponse.json(
        { success: false, error: 'Document not accessible' },
        { status: 403 }
      );
    }

    // Get document stream
    const documentStream = await getDocumentStream(id, session.databaseId || session.userId || 'anonymous');

    // Set appropriate headers for download
    const headers = new Headers({
      'Content-Type': document.mimetype || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(document.filename)}"`,
      'Content-Length': document.size.toString(),
      'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    });

    // Convert Node.js stream to web stream for NextResponse
    const readableStream = new ReadableStream({
      start(controller) {
        documentStream.on('data', (chunk) => {
          controller.enqueue(new Uint8Array(chunk));
        });
        
        documentStream.on('end', () => {
          controller.close();
        });
        
        documentStream.on('error', (error) => {
          console.error('❌ Stream error during download:', error);
          controller.error(error);
        });
      },
    });

    console.log(`✅ Document download started: ${document.filename}`);

    return new NextResponse(readableStream, {
      status: 200,
      headers,
    });

  } catch (error: any) {
    console.error('❌ Document download error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to download document',
      },
      { status: 500 }
    );
  }
});