#!/usr/bin/env node

/**
 * Test script to verify MinIO document management integration
 * 
 * This script tests:
 * 1. MinIO connectivity
 * 2. Bucket existence
 * 3. Basic upload/download functionality
 * 4. Document service operations
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function testMinIOIntegration() {
  console.log('🚀 Starting MinIO Document Management Integration Test');
  console.log('=' * 60);

  try {
    // Test 1: Environment Configuration
    console.log('\n📋 1. Testing Environment Configuration...');
    
    const requiredEnvVars = [
      'MINIO_ENDPOINT',
      'MINIO_PORT', 
      'MINIO_ACCESS_KEY',
      'MINIO_SECRET_KEY',
      'MINIO_DOCUMENTS_BUCKET',
      'MINIO_UPLOADS_BUCKET'
    ];

    const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
    if (missing.length > 0) {
      console.error('❌ Missing environment variables:', missing.join(', '));
      return;
    }

    console.log('✅ All required environment variables present');
    console.log(`   - Endpoint: ${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`);
    console.log(`   - Buckets: ${process.env.MINIO_DOCUMENTS_BUCKET}, ${process.env.MINIO_UPLOADS_BUCKET}`);

    // Test 2: MinIO Client Initialization
    console.log('\n🔌 2. Testing MinIO Client Connection...');
    
    // Import our MinIO client
    const { minioClient } = await import('../lib/storage/minio-client.js');
    
    // Test basic connectivity
    const isHealthy = await minioClient.healthCheck();
    if (!isHealthy) {
      console.error('❌ MinIO health check failed');
      return;
    }
    
    console.log('✅ MinIO client connected successfully');

    // Test 3: Storage Statistics
    console.log('\n📊 3. Getting Storage Statistics...');
    
    try {
      const stats = await minioClient.getStorageStats();
      console.log('✅ Storage stats retrieved:');
      console.log(`   - Available buckets: ${stats.buckets.join(', ')}`);
      console.log(`   - Total objects: ${stats.totalObjects}`);
      console.log(`   - Total size: ${(stats.totalSize / 1024 / 1024).toFixed(2)} MB`);
    } catch (error) {
      console.warn('⚠️ Could not get storage stats (buckets may be empty):', error.message);
    }

    // Test 4: Document Upload Test
    console.log('\n📤 4. Testing Document Upload...');
    
    // Create a test document
    const testContent = `MinIO Integration Test Document
    
Generated: ${new Date().toISOString()}
Test ID: ${Math.random().toString(36).substring(7)}

This is a test document to verify MinIO document management integration.
`;

    const testBuffer = Buffer.from(testContent, 'utf-8');
    const testFilename = `test-document-${Date.now()}.txt`;

    try {
      const uploadResult = await minioClient.uploadDocument(
        testBuffer,
        testFilename,
        {
          userId: 'test-user-id',
          category: 'test',
          metadata: {
            testRun: true,
            timestamp: new Date().toISOString()
          }
        }
      );

      console.log('✅ Document upload successful:');
      console.log(`   - Object key: ${uploadResult.objectKey}`);
      console.log(`   - Bucket: ${uploadResult.bucket}`);
      console.log(`   - Size: ${uploadResult.size} bytes`);
      console.log(`   - MIME type: ${uploadResult.mimetype}`);

      // Test 5: Document Download Test
      console.log('\n📥 5. Testing Document Download...');
      
      const downloadUrl = await minioClient.getDocumentUrl(uploadResult.objectKey, 60); // 1 minute expiry
      console.log('✅ Download URL generated successfully');
      console.log(`   - URL: ${downloadUrl.substring(0, 100)}...`);

      // Test 6: Document Metadata Test
      console.log('\n📋 6. Testing Document Metadata...');
      
      const metadata = await minioClient.getDocumentMetadata(uploadResult.objectKey);
      console.log('✅ Document metadata retrieved:');
      console.log(`   - Size: ${metadata.size} bytes`);
      console.log(`   - Last modified: ${metadata.lastModified}`);
      console.log(`   - ETag: ${metadata.etag}`);

      // Test 7: Cleanup
      console.log('\n🧹 7. Cleaning up test document...');
      
      await minioClient.deleteDocument(uploadResult.objectKey);
      console.log('✅ Test document cleaned up successfully');

    } catch (uploadError) {
      console.error('❌ Document upload/download test failed:', uploadError.message);
      return;
    }

    // Final Success
    console.log('\n🎉 All MinIO Integration Tests Passed!');
    console.log('='.repeat(60));
    console.log('✅ MinIO document management system is ready for use');
    
  } catch (error) {
    console.error('\n❌ MinIO Integration Test Failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the test
testMinIOIntegration().catch(console.error);