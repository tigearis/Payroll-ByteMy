#!/usr/bin/env node

/**
 * Simple MinIO connectivity test
 * Tests the raw MinIO connection without our TypeScript modules
 */

import { Client as MinioClient } from 'minio';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function testMinIOConnectivity() {
  console.log('🚀 Testing MinIO Connectivity');
  console.log('='.repeat(50));

  try {
    // Create MinIO client with configuration from .env
    const minioClient = new MinioClient({
      endPoint: process.env.MINIO_ENDPOINT || '192.168.1.229',
      port: parseInt(process.env.MINIO_PORT || '9768'),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || 'admin',
      secretKey: process.env.MINIO_SECRET_KEY || '[REDACTED_MINIO_SECRET]',
    });

    console.log('📋 Configuration:');
    console.log(`   - Endpoint: ${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`);
    console.log(`   - SSL: ${process.env.MINIO_USE_SSL === 'true' ? 'enabled' : 'disabled'}`);
    console.log(`   - Access Key: ${process.env.MINIO_ACCESS_KEY}`);
    console.log(`   - Buckets: ${process.env.MINIO_DOCUMENTS_BUCKET}, ${process.env.MINIO_UPLOADS_BUCKET}`);

    // Test 1: Check if buckets exist
    console.log('\n🔍 1. Checking bucket existence...');
    
    const documentsBucket = process.env.MINIO_DOCUMENTS_BUCKET || 'documents';
    const uploadsBucket = process.env.MINIO_UPLOADS_BUCKET || 'uploads';
    
    const documentsExists = await minioClient.bucketExists(documentsBucket);
    const uploadsExists = await minioClient.bucketExists(uploadsBucket);
    
    console.log(`   - ${documentsBucket}: ${documentsExists ? '✅ exists' : '❌ missing'}`);
    console.log(`   - ${uploadsBucket}: ${uploadsExists ? '✅ exists' : '❌ missing'}`);
    
    if (!documentsExists || !uploadsExists) {
      console.log('⚠️  Some buckets are missing, but connection is working');
    }

    // Test 2: List all buckets
    console.log('\n📦 2. Listing all available buckets...');
    
    const buckets = await minioClient.listBuckets();
    console.log(`   Found ${buckets.length} buckets:`);
    buckets.forEach(bucket => {
      console.log(`   - ${bucket.name} (created: ${bucket.creationDate})`);
    });

    // Test 3: Simple upload test to documents bucket (if it exists)
    if (documentsExists) {
      console.log('\n📤 3. Testing document upload...');
      
      const testContent = `MinIO Test Document
Generated: ${new Date().toISOString()}
Test successful!`;
      
      const testBuffer = Buffer.from(testContent, 'utf-8');
      const testFileName = `test-${Date.now()}.txt`;
      
      await minioClient.putObject(
        documentsBucket,
        testFileName,
        testBuffer,
        testBuffer.length,
        { 'Content-Type': 'text/plain' }
      );
      
      console.log(`   ✅ Successfully uploaded: ${testFileName}`);
      
      // Test 4: Generate download URL
      console.log('\n📥 4. Testing download URL generation...');
      
      const downloadUrl = await minioClient.presignedGetObject(
        documentsBucket,
        testFileName,
        60 // 1 minute expiry
      );
      
      console.log(`   ✅ Download URL generated (60s expiry)`);
      console.log(`   URL: ${downloadUrl.substring(0, 80)}...`);
      
      // Test 5: Cleanup
      console.log('\n🧹 5. Cleaning up test file...');
      
      await minioClient.removeObject(documentsBucket, testFileName);
      console.log(`   ✅ Test file removed: ${testFileName}`);
    } else {
      console.log('\n⚠️  Skipping upload test - documents bucket not found');
    }

    // Success
    console.log('\n🎉 MinIO Connection Test Passed!');
    console.log('='.repeat(50));
    console.log('✅ MinIO server is accessible and working correctly');
    
  } catch (error) {
    console.error('\n❌ MinIO Connection Test Failed:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Common troubleshooting tips
    console.log('\n🔧 Troubleshooting tips:');
    console.log('   1. Check if MinIO server is running');
    console.log('   2. Verify network connectivity to 192.168.1.229:9768');
    console.log('   3. Confirm access credentials are correct');
    console.log('   4. Check firewall settings');
    
    process.exit(1);
  }
}

// Run the test
testMinIOConnectivity().catch(console.error);