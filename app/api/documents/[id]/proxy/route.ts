import { NextRequest, NextResponse } from 'next/server';
import { withAuthParams } from '@/lib/auth/api-auth';
import { getDocument, getDocumentStream } from '@/lib/storage/document-operations';

/**
 * GET /api/documents/[id]/proxy
 * 
 * Proxy endpoint for serving documents with proper CORS headers
 * This allows external viewers (Office Online, Google Docs) to access documents
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
    const userRole = session.role || session.defaultRole;
    const canView = ['developer', 'org_admin', 'manager', 'consultant', 'viewer'].includes(userRole);
    
    if (!canView) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions to view documents' },
        { status: 403 }
      );
    }

    console.log(`🔗 Proxying document: ${id} for user: ${session.userId} (${userRole})`);

    // Get document metadata first
    const document = await getDocument(id, session.databaseId || session.userId);

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

    if (userRole === 'consultant' && document.uploadedBy !== (session.databaseId || session.userId) && !document.isPublic) {
      return NextResponse.json(
        { success: false, error: 'Document not accessible' },
        { status: 403 }
      );
    }

    // Get document stream
    const documentStream = await getDocumentStream(id, session.databaseId || session.userId);

    // Set headers for external viewer compatibility
    const headers = new Headers({
      'Content-Type': document.mimetype || 'application/octet-stream',
      'Content-Disposition': `inline; filename="${encodeURIComponent(document.filename)}"`,
      'Content-Length': document.size.toString(),
      'Cache-Control': 'public, max-age=3600', // 1 hour cache
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
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
          console.error('❌ Stream error during proxy:', error);
          controller.error(error);
        });
      },
    });

    console.log(`✅ Document proxy started: ${document.filename}`);

    return new NextResponse(readableStream, {
      status: 200,
      headers,
    });

  } catch (error: any) {
    console.error('❌ Document proxy error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to proxy document',
      },
      { status: 500 }
    );
  }
});