import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/api-auth';
import { uploadDocument, validateFileUpload } from '@/lib/storage/document-operations';

interface DocumentUploadResponse {
  success: boolean;
  document?: any;
  message?: string;
  error?: string;
}

/**
 * POST /api/documents/upload
 * 
 * Upload documents associated with clients and/or payrolls.
 * Note: This is separate from avatar uploads which use Clerk.
 */
export const POST = withAuth(async (req: NextRequest, session) => {
  try {
    const formData = await req.formData();
    const file = formData.get('document') as File || formData.get('file') as File;
    const clientId = formData.get('clientId') as string | null;
    const payrollId = formData.get('payrollId') as string | null;
    const category = formData.get('category') as string | null;
    const isPublic = formData.get('isPublic') === 'true';
    const metadataStr = formData.get('metadata') as string | null;
    const replaceDocumentId = formData.get('replaceDocumentId') as string | null;

    // Validate required fields
    if (!file) {
      return NextResponse.json<DocumentUploadResponse>(
        { success: false, error: 'No document provided' },
        { status: 400 }
      );
    }

    // Validate user permissions
    const userRole = session.role || session.defaultRole || 'viewer';
    const canUpload = ['developer', 'org_admin', 'manager', 'consultant'].includes(userRole);
    
    if (!canUpload) {
      return NextResponse.json<DocumentUploadResponse>(
        { success: false, error: 'Insufficient permissions to upload documents' },
        { status: 403 }
      );
    }

    // Additional validation for consultants
    if (userRole === 'consultant') {
      // Consultants can only upload to payrolls they're assigned to
      // This will be enhanced with proper assignment checking
      if (!payrollId) {
        return NextResponse.json<DocumentUploadResponse>(
          { 
            success: false, 
            error: 'Consultants must specify a payroll for document uploads' 
          },
          { status: 403 }
        );
      }
    }

    // Validate file
    const validation = validateFileUpload(file);
    if (!validation.isValid) {
      return NextResponse.json<DocumentUploadResponse>(
        { success: false, error: validation.error || 'File validation failed' },
        { status: 400 }
      );
    }

    // Parse metadata
    let metadata = {};
    try {
      if (metadataStr) {
        metadata = JSON.parse(metadataStr);
      }
    } catch (error) {
      return NextResponse.json<DocumentUploadResponse>(
        { success: false, error: 'Invalid metadata JSON' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    if (replaceDocumentId) {
      console.log(`🔄 Replacing document: ${replaceDocumentId} with ${file.name} (${file.size} bytes)`);
      console.log(`👤 Replaced by: ${session.userId} (${userRole})`);

      // First, get the original document to preserve metadata
      const { getDocument, deleteDocument } = await import('@/lib/storage/document-operations');
      const originalDocument = await getDocument(replaceDocumentId, session.databaseId || session.userId || 'anonymous');
      
      if (!originalDocument) {
        return NextResponse.json<DocumentUploadResponse>(
          { success: false, error: 'Original document not found' },
          { status: 404 }
        );
      }

      // Delete the old document
      await deleteDocument(replaceDocumentId, session.databaseId || session.userId || 'anonymous');

      // Upload the new document with the same metadata and relationships
      const uploadOptions: any = {
        filename: file.name,
        fileBuffer,
        category: (category as any) || originalDocument.category,
        isPublic: isPublic !== undefined ? isPublic : originalDocument.isPublic,
        metadata: metadata || originalDocument.metadata,
        uploadedBy: session.databaseId || session.userId || 'anonymous',
      };
      
      if (originalDocument.clientId) {
        uploadOptions.clientId = originalDocument.clientId;
      }
      if (originalDocument.payrollId) {
        uploadOptions.payrollId = originalDocument.payrollId;
      }
      
      const document = await uploadDocument(uploadOptions);

      return NextResponse.json<DocumentUploadResponse>({
        success: true,
        document,
        message: 'Document replaced successfully',
      });
    } else {
      console.log(`📄 Uploading document: ${file.name} (${file.size} bytes)`);
      console.log(`👤 Uploaded by: ${session.userId} (${userRole})`);
      console.log(`🏢 Client: ${clientId || 'none'}, 💼 Payroll: ${payrollId || 'none'}`);

      // Upload document
      const uploadOptions: any = {
        filename: file.name,
        fileBuffer,
        category: (category as any) || 'other',
        isPublic,
        metadata,
        uploadedBy: session.databaseId || session.userId || 'anonymous',
      };
      
      if (clientId) {
        uploadOptions.clientId = clientId;
      }
      if (payrollId) {
        uploadOptions.payrollId = payrollId;
      }
      
      const document = await uploadDocument(uploadOptions);

      return NextResponse.json<DocumentUploadResponse>({
        success: true,
        document,
        message: 'Document uploaded successfully',
      });
    }

  } catch (error: any) {
    console.error('❌ Document upload error:', error);

    return NextResponse.json<DocumentUploadResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload document',
      },
      { status: 500 }
    );
  }
});