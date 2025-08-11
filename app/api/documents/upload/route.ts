import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/api-auth';
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";
import { uploadDocument, validateFileUpload } from '@/lib/storage/document-operations';

interface DocumentUploadResponse {
  success: boolean;
  document?: any | any[]; // Can be single document or array for multi-upload
  message?: string;
  error?: string;
  errors?: string[]; // For partial failures in multi-upload
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
    
    // Handle both single and multiple file uploads
    const files: File[] = [];
    const documentFiles = formData.getAll('document') as File[];
    const fileFiles = formData.getAll('file') as File[];
    
    // Combine both possible field names
    files.push(...documentFiles, ...fileFiles);
    
    // Filter out non-File entries (in case form data contains other types)
    const validFiles = files.filter(f => f instanceof File && f.size > 0);
    
    const clientId = formData.get('clientId') as string | null;
    const payrollId = formData.get('payrollId') as string | null;
    const category = formData.get('category') as string | null;
    const isPublic = formData.get('isPublic') === 'true';
    const metadataStr = formData.get('metadata') as string | null;
    const replaceDocumentId = formData.get('replaceDocumentId') as string | null;

    // Validate required fields
    if (validFiles.length === 0) {
      return NextResponse.json<DocumentUploadResponse>(
        { success: false, error: 'No valid documents provided' },
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

    // Validate all files
    const validationErrors: string[] = [];
    for (const file of validFiles) {
      const validation = validateFileUpload(file);
      if (!validation.isValid) {
        validationErrors.push(`${file.name}: ${validation.error}`);
      }
    }

    if (validationErrors.length > 0) {
      return NextResponse.json<DocumentUploadResponse>(
        { 
          success: false, 
          error: `File validation failed: ${validationErrors.join(', ')}` 
        },
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

    // Handle single file replacement (only works with one file)
    if (replaceDocumentId) {
      if (validFiles.length > 1) {
        return NextResponse.json<DocumentUploadResponse>(
          { success: false, error: 'Document replacement only supports single file upload' },
          { status: 400 }
        );
      }

      const file = validFiles[0];
      // Convert file to buffer
      const fileBuffer = Buffer.from(await file.arrayBuffer());
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
      // Multi-file upload handling
      console.log(`📄 Uploading ${validFiles.length} document(s)`);
      console.log(`👤 Uploaded by: ${session.userId} (${userRole})`);
      console.log(`🏢 Client: ${clientId || 'none'}, 💼 Payroll: ${payrollId || 'none'}`);

      const uploadResults: any[] = [];
      const errors: string[] = [];

      // Process each file
      for (const file of validFiles) {
        try {
          // Convert file to buffer
          const fileBuffer = Buffer.from(await file.arrayBuffer());

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
          uploadResults.push(document);
          console.log(`✅ Successfully uploaded: ${file.name}`);
        } catch (error) {
          const errorMessage = `Failed to upload ${file.name}: ${error}`;
          errors.push(errorMessage);
          console.error(`❌ ${errorMessage}`);
        }
      }

      // Return results
      if (uploadResults.length === 0) {
        return NextResponse.json<DocumentUploadResponse>(
          {
            success: false,
            error: `All uploads failed: ${errors.join(', ')}`,
          },
          { status: 500 }
        );
      }

      const message = validFiles.length === 1 
        ? 'Document uploaded successfully'
        : `${uploadResults.length} of ${validFiles.length} documents uploaded successfully`;

      return NextResponse.json<DocumentUploadResponse>({
        success: true,
        document: uploadResults.length === 1 ? uploadResults[0] : uploadResults,
        message,
        ...(errors.length > 0 && { errors }),
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