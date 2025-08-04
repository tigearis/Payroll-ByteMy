import { minioClient } from './minio-client';
import { executeTypedQuery } from '@/lib/apollo/query-helpers';
import { randomUUID } from 'crypto';
import { auditLogger } from '@/lib/audit/audit-logger';
import { 
  InsertFileDocument, 
  GetFileByIdDocument, 
  ListFilesDocument, 
  UpdateFileMetadataDocument, 
  DeleteFileDocument 
} from '@/shared/types/generated/graphql';

/**
 * High-level document operations service
 * 
 * Provides business logic for document management including:
 * - Database record management
 * - File storage operations
 * - Permission validation
 * - Audit logging
 */

export interface DocumentUploadOptions {
  filename: string;
  fileBuffer: Buffer;
  clientId?: string;
  payrollId?: string;
  category?: 'contract' | 'invoice' | 'report' | 'timesheet' | 'correspondence' | 'other';
  isPublic?: boolean;
  metadata?: Record<string, any>;
  uploadedBy: string;
}

export interface DocumentRecord {
  id: string;
  filename: string;
  bucket: string;
  objectKey: string;
  size: number;
  mimetype: string;
  url: string;
  clientId?: string;
  payrollId?: string;
  uploadedBy: string;
  category?: string;
  isPublic: boolean;
  metadata: Record<string, any>;
  fileType: string;
  createdAt: string;
}

/**
 * Upload a document and create database record
 */
export async function uploadDocument(
  options: DocumentUploadOptions
): Promise<DocumentRecord> {
  try {
    // Upload to MinIO
    const uploadResult = await minioClient.uploadDocument(
      options.fileBuffer,
      options.filename,
      {
        ...(options.clientId ? { clientId: options.clientId } : {}),
        ...(options.payrollId ? { payrollId: options.payrollId } : {}),
        ...(options.category ? { category: options.category } : {}),
        userId: options.uploadedBy,
        metadata: options.metadata || {},
      }
    );

    // Create database record
    const documentData = {
      filename: options.filename,
      bucket: uploadResult.bucket,
      objectKey: uploadResult.objectKey,
      size: uploadResult.size,
      mimetype: uploadResult.mimetype,
      url: uploadResult.url,
      clientId: options.clientId,
      payrollId: options.payrollId,
      uploadedBy: options.uploadedBy,
      category: options.category || 'other',
      isPublic: options.isPublic || false,
      metadata: options.metadata || {},
      fileType: 'document',
    };

    // Insert file record into database
    const result = await executeTypedQuery(InsertFileDocument, {
      input: documentData
    }) as { insertFile: DocumentRecord };

    if (!result?.insertFile) {
      throw new Error('Failed to create document record in database');
    }

    // Log successful document upload for audit
    await auditLogger.log({
      userId: options.uploadedBy,
      action: 'DOCUMENT_UPLOAD',
      entityType: 'file',
      entityId: result.insertFile.id,
      success: true,
      metadata: {
        filename: options.filename,
        category: options.category,
        clientId: options.clientId,
        payrollId: options.payrollId,
        size: uploadResult.size,
      }
    });

    console.log(`📄 Document record created in database: ${options.filename} (ID: ${result.insertFile.id})`);

    return result.insertFile;
  } catch (error) {
    console.error('❌ Document upload operation failed:', error);
    
    // Cleanup: Delete from MinIO if database insertion failed
    try {
      // This will be implemented when we have the object key
    } catch (cleanupError) {
      console.error('❌ Failed to cleanup after upload error:', cleanupError);
    }
    
    throw new Error(`Document upload failed: ${error}`);
  }
}

/**
 * Get document by ID with fresh presigned URL
 */
export async function getDocument(
  documentId: string,
  requestingUserId: string
): Promise<DocumentRecord | null> {
  try {
    // Get document from database
    const result = await executeTypedQuery(GetFileByIdDocument, {
      id: documentId
    }) as { fileById: DocumentRecord | null };

    if (!result?.fileById) {
      return null;
    }

    const document = result.fileById;

    // Log document access for audit
    await auditLogger.dataAccess(
      requestingUserId,
      'READ',
      'file',
      documentId
    );

    // Generate fresh presigned URL
    const freshUrl = await minioClient.getDocumentUrl(document.objectKey);

    return {
      ...document,
      url: freshUrl,
    };
  } catch (error) {
    console.error('❌ Failed to get document:', error);
    throw new Error(`Failed to retrieve document: ${error}`);
  }
}

/**
 * Delete document (both MinIO and database)
 */
export async function deleteDocument(
  documentId: string,
  requestingUserId: string
): Promise<void> {
  try {
    // First try to get the document for audit logging
    let document: DocumentRecord | null = null;
    try {
      document = await getDocument(documentId, requestingUserId);
    } catch (error) {
      console.warn(`⚠️ Could not retrieve document for audit logging: ${error}`);
      // Continue with deletion even if we can't get document details
    }

    // If we couldn't get the document via getDocument, try direct database query
    if (!document) {
      try {
        const result = await executeTypedQuery(GetFileByIdDocument, {
          id: documentId
        }) as { fileById: DocumentRecord | null };
        document = result?.fileById || null;
      } catch (error) {
        console.warn(`⚠️ Could not retrieve document via direct query: ${error}`);
      }
    }

    // If we still don't have document info, we'll delete what we can
    if (!document) {
      console.warn(`⚠️ Proceeding with deletion without document metadata for ID: ${documentId}`);
    }

    let minioDeleted = false;
    let databaseDeleted = false;

    // Try to delete from MinIO if we have the object key
    if (document?.objectKey) {
      try {
        await minioClient.deleteDocument(document.objectKey);
        minioDeleted = true;
        console.log(`🗑️ Document deleted from MinIO: ${document.objectKey}`);
      } catch (error) {
        console.error(`❌ Failed to delete from MinIO: ${error}`);
        // Continue with database deletion even if MinIO fails
      }
    } else {
      console.warn(`⚠️ No object key available, skipping MinIO deletion for document ID: ${documentId}`);
    }

    // Try to delete from database
    try {
      const deleteResult = await executeTypedQuery(DeleteFileDocument, {
        id: documentId
      }) as { deleteFileById: { id: string } | null };

      if (deleteResult?.deleteFileById) {
        databaseDeleted = true;
        console.log(`🗑️ Document deleted from database: ${documentId}`);
      } else {
        console.warn(`⚠️ Database deletion returned no result for document ID: ${documentId}`);
      }
    } catch (error) {
      console.error(`❌ Failed to delete from database: ${error}`);
    }

    // Log audit event if possible
    if (document) {
      try {
        await auditLogger.dataModification(
          requestingUserId,
          'DELETE',
          'file',
          documentId,
          {
            filename: document.filename,
            category: document.category,
            clientId: document.clientId,
            payrollId: document.payrollId,
            minioDeleted,
            databaseDeleted,
          }
        );
      } catch (error) {
        console.error(`❌ Failed to log audit event: ${error}`);
      }
    }

    // Report final status
    if (minioDeleted || databaseDeleted) {
      const status = [];
      if (minioDeleted) status.push('MinIO');
      if (databaseDeleted) status.push('database');
      console.log(`✅ Document deletion completed from: ${status.join(', ')} (ID: ${documentId})`);
    } else {
      throw new Error('Failed to delete document from both MinIO and database');
    }

  } catch (error) {
    console.error('❌ Document deletion process failed:', error);
    throw new Error(`Document deletion failed: ${error}`);
  }
}

/**
 * List documents with filtering
 */
export async function listDocuments(
  filters: {
    clientId?: string;
    payrollId?: string;
    category?: string;
    uploadedBy?: string;
    isPublic?: boolean;
    limit?: number;
    offset?: number;
  } = {},
  requestingUserId: string
): Promise<{
  documents: DocumentRecord[];
  totalCount: number;
}> {
  try {
    // Build where clause
    const whereClause: any = { fileType: { _eq: 'document' } };
    
    if (filters.clientId) whereClause.clientId = { _eq: filters.clientId };
    if (filters.payrollId) whereClause.payrollId = { _eq: filters.payrollId };
    if (filters.category) whereClause.category = { _eq: filters.category };
    if (filters.uploadedBy) whereClause.uploadedBy = { _eq: filters.uploadedBy };
    if (filters.isPublic !== undefined) whereClause.isPublic = { _eq: filters.isPublic };

    // Query documents from database
    const result = await executeTypedQuery(ListFilesDocument, {
      where: whereClause,
      limit: filters.limit || 50,
      offset: filters.offset || 0,
      orderBy: [{ createdAt: 'DESC' }]
    }) as { 
      files: DocumentRecord[] | null; 
      filesAggregate: { aggregate: { count: number } } | null;
    };

    // Log document list access for audit
    await auditLogger.log({
      userId: requestingUserId,
      action: 'LIST',
      entityType: 'file',
      success: true,
      metadata: { 
        resultCount: result.files?.length || 0
      }
    });

    // Generate fresh URLs for all documents
    const documentsWithFreshUrls = await Promise.all(
      (result.files || []).map(async (doc: any) => ({
        ...doc,
        url: await minioClient.getDocumentUrl(doc.objectKey),
      }))
    );

    return {
      documents: documentsWithFreshUrls,
      totalCount: result.filesAggregate?.aggregate?.count || 0,
    };
  } catch (error) {
    console.error('❌ Failed to list documents:', error);
    throw new Error(`Failed to list documents: ${error}`);
  }
}

/**
 * Update document metadata
 */
export async function updateDocumentMetadata(
  documentId: string,
  updates: {
    filename?: string;
    category?: string;
    isPublic?: boolean;
    metadata?: Record<string, any>;
  },
  requestingUserId: string
): Promise<DocumentRecord> {
  try {
    // Update document metadata in database
    const result = await executeTypedQuery(UpdateFileMetadataDocument, {
      id: documentId,
      updates: updates
    }) as { updateFileById: DocumentRecord | null };

    if (!result?.updateFileById) {
      throw new Error('Document not found or update failed');
    }

    // Log document metadata update for audit
    await auditLogger.dataModification(
      requestingUserId,
      'UPDATE',
      'file',
      documentId,
      undefined, // old values would need to be fetched separately
      updates
    );

    // Generate fresh URL
    const freshUrl = await minioClient.getDocumentUrl(result.updateFileById.objectKey);

    console.log(`📝 Document metadata updated: ${documentId}`);

    return {
      ...result.updateFileById,
      url: freshUrl,
    };
  } catch (error) {
    console.error('❌ Failed to update document metadata:', error);
    throw new Error(`Document update failed: ${error}`);
  }
}

/**
 * Get document download stream
 */
export async function getDocumentStream(
  documentId: string,
  requestingUserId: string
): Promise<NodeJS.ReadableStream> {
  try {
    const document = await getDocument(documentId, requestingUserId);
    if (!document) {
      throw new Error('Document not found');
    }

    return await minioClient.getDocumentStream(document.objectKey);
  } catch (error) {
    console.error('❌ Failed to get document stream:', error);
    throw new Error(`Document stream failed: ${error}`);
  }
}

/**
 * Validate file upload
 */
export function validateFileUpload(
  file: File | Buffer,
  options: {
    maxSize?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}
): { isValid: boolean; error?: string } {
  const maxSize = options.maxSize || 50 * 1024 * 1024; // 50MB default
  const allowedTypes = options.allowedTypes || [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain',
    'text/csv',
  ];

  // Size check
  const fileSize = file instanceof File ? file.size : file.length;
  if (fileSize > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`,
    };
  }

  // Type check (basic - will be enhanced with actual file type detection)
  if (file instanceof File && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type ${file.type} is not allowed`,
    };
  }

  return { isValid: true };
}