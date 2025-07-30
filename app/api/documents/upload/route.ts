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
    const file = formData.get('document') as File;
    const clientId = formData.get('clientId') as string | null;
    const payrollId = formData.get('payrollId') as string | null;
    const category = formData.get('category') as string | null;
    const isPublic = formData.get('isPublic') === 'true';
    const metadataStr = formData.get('metadata') as string | null;

    // Validate required fields
    if (!file) {
      return NextResponse.json<DocumentUploadResponse>(
        { success: false, error: 'No document provided' },
        { status: 400 }
      );
    }

    // Validate user permissions
    const userRole = session.role || session.defaultRole;
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
        { success: false, error: validation.error },
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

    console.log(`📄 Uploading document: ${file.name} (${file.size} bytes)`);
    console.log(`👤 Uploaded by: ${session.userId} (${userRole})`);
    console.log(`🏢 Client: ${clientId || 'none'}, 💼 Payroll: ${payrollId || 'none'}`);

    // Upload document
    const document = await uploadDocument({
      filename: file.name,
      fileBuffer,
      clientId: clientId || undefined,
      payrollId: payrollId || undefined,
      category: (category as any) || 'other',
      isPublic,
      metadata,
      uploadedBy: session.userId,
    });

    return NextResponse.json<DocumentUploadResponse>({
      success: true,
      document,
      message: 'Document uploaded successfully',
    });

  } catch (error: any) {
    console.error('❌ Document upload error:', error);

    return NextResponse.json<DocumentUploadResponse>(
      {
        success: false,
        error: error.message || 'Failed to upload document',
      },
      { status: 500 }
    );
  }
});