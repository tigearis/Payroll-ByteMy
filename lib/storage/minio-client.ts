import { fileTypeFromBuffer } from 'file-type';
import { Client as MinioClient } from 'minio';

/**
 * MinIO Document Storage Client
 * 
 * Handles document storage operations for the payroll system.
 * Note: Avatar uploads continue to use Clerk - this is ONLY for documents.
 */

interface MinioConfig {
  endPoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
}

class MinioDocumentClient {
  private client: MinioClient;
  private config: MinioConfig;
  private documentsBucket: string;
  private uploadsBucket: string;

  constructor() {
    this.config = {
      endPoint: process.env.MINIO_ENDPOINT || '192.168.1.229',
      port: parseInt(process.env.MINIO_PORT || '9768'),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || 'admin',
      secretKey: process.env.MINIO_SECRET_KEY || 'MiniH4rr!51604',
    };

    this.documentsBucket = process.env.MINIO_DOCUMENTS_BUCKET || 'documents';
    this.uploadsBucket = process.env.MINIO_UPLOADS_BUCKET || 'uploads';

    this.client = new MinioClient(this.config);
    this.initializeBuckets();
  }

  /**
   * Initialize MinIO buckets if they don't exist
   */
  private async initializeBuckets(): Promise<void> {
    try {
      const buckets = [this.documentsBucket, this.uploadsBucket];
      
      for (const bucket of buckets) {
        const exists = await this.client.bucketExists(bucket);
        if (!exists) {
          await this.client.makeBucket(bucket, 'us-east-1');
          console.log(`✅ Created MinIO bucket: ${bucket}`);
        }
      }
    } catch (error) {
      console.error('❌ Failed to initialize MinIO buckets:', error);
      throw new Error(`MinIO bucket initialization failed: ${error}`);
    }
  }

  /**
   * Generate object key path for documents
   */
  private generateObjectKey(
    clientId?: string, 
    payrollId?: string, 
    category?: string, 
    filename?: string
  ): string {
    const timestamp = Date.now();
    const sanitizedFilename = filename?.replace(/[^a-zA-Z0-9.-]/g, '_') || 'file';
    
    if (clientId && payrollId) {
      return `${clientId}/${payrollId}/${category || 'general'}/${timestamp}_${sanitizedFilename}`;
    } else if (clientId) {
      return `${clientId}/${category || 'general'}/${timestamp}_${sanitizedFilename}`;
    } else {
      return `general/${category || 'uncategorized'}/${timestamp}_${sanitizedFilename}`;
    }
  }

  /**
   * Upload document to MinIO
   */
  async uploadDocument(
    fileBuffer: Buffer,
    filename: string,
    options: {
      clientId?: string;
      payrollId?: string;
      category?: string;
      userId: string;
      metadata?: Record<string, any>;
    }
  ): Promise<{
    objectKey: string;
    bucket: string;
    url: string;
    size: number;
    mimetype: string;
  }> {
    try {
      // Detect file type
      const fileType = await fileTypeFromBuffer(fileBuffer);
      const mimetype = fileType?.mime || 'application/octet-stream';
      
      // Generate object key
      const objectKey = this.generateObjectKey(
        options.clientId,
        options.payrollId,
        options.category,
        filename
      );

      // Prepare metadata
      const minioMetadata = {
        'uploaded-by': options.userId,
        'original-filename': filename,
        'upload-timestamp': new Date().toISOString(),
        ...options.metadata,
      };

      // Upload to MinIO
      const uploadInfo = await this.client.putObject(
        this.documentsBucket,
        objectKey,
        fileBuffer,
        fileBuffer.length,
        {
          'Content-Type': mimetype,
          ...minioMetadata,
        }
      );

      console.log(`📄 Document uploaded to MinIO: ${objectKey}`);

      return {
        objectKey,
        bucket: this.documentsBucket,
        url: await this.getDocumentUrl(objectKey),
        size: fileBuffer.length,
        mimetype,
      };
    } catch (error) {
      console.error('❌ MinIO document upload failed:', error);
      throw new Error(`Document upload failed: ${error}`);
    }
  }

  /**
   * Get presigned URL for document access
   */
  async getDocumentUrl(objectKey: string, expirySeconds: number = 3600): Promise<string> {
    try {
      return await this.client.presignedGetObject(
        this.documentsBucket,
        objectKey,
        expirySeconds
      );
    } catch (error) {
      console.error('❌ Failed to generate presigned URL:', error);
      throw new Error(`Failed to generate document URL: ${error}`);
    }
  }

  /**
   * Delete document from MinIO
   */
  async deleteDocument(objectKey: string): Promise<void> {
    try {
      await this.client.removeObject(this.documentsBucket, objectKey);
      console.log(`🗑️ Document deleted from MinIO: ${objectKey}`);
    } catch (error) {
      console.error('❌ Failed to delete document:', error);
      throw new Error(`Document deletion failed: ${error}`);
    }
  }

  /**
   * Get document metadata
   */
  async getDocumentMetadata(objectKey: string): Promise<{
    size: number;
    lastModified: Date;
    etag: string;
    metadata: Record<string, any>;
  }> {
    try {
      const stat = await this.client.statObject(this.documentsBucket, objectKey);
      return {
        size: stat.size,
        lastModified: stat.lastModified,
        etag: stat.etag,
        metadata: stat.metaData || {},
      };
    } catch (error) {
      console.error('❌ Failed to get document metadata:', error);
      throw new Error(`Failed to get document metadata: ${error}`);
    }
  }

  /**
   * Stream document content
   */
  async getDocumentStream(objectKey: string): Promise<NodeJS.ReadableStream> {
    try {
      return await this.client.getObject(this.documentsBucket, objectKey);
    } catch (error) {
      console.error('❌ Failed to get document stream:', error);
      throw new Error(`Failed to stream document: ${error}`);
    }
  }

  /**
   * Copy document to new location
   */
  async copyDocument(
    sourceObjectKey: string,
    destinationObjectKey: string
  ): Promise<void> {
    try {
      await this.client.copyObject(
        this.documentsBucket,
        destinationObjectKey,
        `${this.documentsBucket}/${sourceObjectKey}`
      );
      console.log(`📋 Document copied: ${sourceObjectKey} -> ${destinationObjectKey}`);
    } catch (error) {
      console.error('❌ Failed to copy document:', error);
      throw new Error(`Document copy failed: ${error}`);
    }
  }

  /**
   * List documents in a specific path
   */
  async listDocuments(prefix?: string): Promise<Array<{
    name: string;
    size: number;
    lastModified: Date;
    etag: string;
  }>> {
    try {
      const objects: any[] = [];
      const stream = this.client.listObjects(this.documentsBucket, prefix, true);
      
      return new Promise((resolve, reject) => {
        stream.on('data', (obj) => objects.push(obj));
        stream.on('end', () => resolve(objects));
        stream.on('error', reject);
      });
    } catch (error) {
      console.error('❌ Failed to list documents:', error);
      throw new Error(`Document listing failed: ${error}`);
    }
  }

  /**
   * Health check for MinIO connection
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.bucketExists(this.documentsBucket);
      return true;
    } catch (error) {
      console.error('❌ MinIO health check failed:', error);
      return false;
    }
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(): Promise<{
    totalObjects: number;
    totalSize: number;
    buckets: string[];
  }> {
    try {
      const buckets = await this.client.listBuckets();
      const documents = await this.listDocuments();
      
      const totalSize = documents.reduce((sum, doc) => sum + doc.size, 0);
      
      return {
        totalObjects: documents.length,
        totalSize,
        buckets: buckets.map(b => b.name),
      };
    } catch (error) {
      console.error('❌ Failed to get storage stats:', error);
      throw new Error(`Storage stats failed: ${error}`);
    }
  }
}

// Export singleton instance
export const minioClient = new MinioDocumentClient();
export default minioClient;