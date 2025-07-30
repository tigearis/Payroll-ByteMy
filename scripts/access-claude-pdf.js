#!/usr/bin/env node

/**
 * Script to access the Claude.pdf file that was manually uploaded to MinIO
 * Demonstrates different ways to access the file
 */

import { Client as MinioClient } from 'minio';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function accessClaudePdf() {
  console.log('🧪 Testing Access to Claude.pdf');
  console.log('='.repeat(50));

  try {
    // Create MinIO client
    const client = new MinioClient({
      endPoint: process.env.MINIO_ENDPOINT || '192.168.1.229',
      port: parseInt(process.env.MINIO_PORT || '9768'),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || 'admin',
      secretKey: process.env.MINIO_SECRET_KEY || 'MiniH4rr!51604',
    });

    const fileName = 'Claude.pdf';
    const bucketName = 'documents';

    console.log(`\n📁 Checking for ${fileName} in ${bucketName} bucket...`);

    // Check if file exists
    try {
      const stat = await client.statObject(bucketName, fileName);
      console.log('✅ File found!');
      console.log(`   Size: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   Last Modified: ${stat.lastModified}`);
      console.log(`   Content Type: ${stat.metaData?.['content-type'] || 'Unknown'}`);
      console.log(`   ETag: ${stat.etag}`);
    } catch (error) {
      console.log('❌ File not found or inaccessible');
      console.log('   Error:', error.message);
      return;
    }

    // Generate different types of URLs
    console.log('\n🔗 Generating Access URLs...');

    // 1. Standard presigned URL (1 hour)
    try {
      const standardUrl = await client.presignedGetObject(bucketName, fileName, 3600);
      console.log('\n1️⃣  Standard Access URL (1 hour expiry):');
      console.log('   URL:', standardUrl);
      console.log('   Use: Click this URL in your browser or use with curl');
    } catch (error) {
      console.log('❌ Failed to generate standard URL:', error.message);
    }

    // 2. Short-term URL (5 minutes) - good for testing
    try {
      const shortUrl = await client.presignedGetObject(bucketName, fileName, 300);
      console.log('\n2️⃣  Short-term URL (5 minutes expiry):');
      console.log('   URL:', shortUrl);
      console.log('   Use: For quick testing - expires in 5 minutes');
    } catch (error) {
      console.log('❌ Failed to generate short URL:', error.message);
    }

    // 3. Long-term URL (24 hours) - good for sharing
    try {
      const longUrl = await client.presignedGetObject(bucketName, fileName, 86400);
      console.log('\n3️⃣  Long-term URL (24 hours expiry):');
      console.log('   URL:', longUrl);
      console.log('   Use: For sharing or embedding in applications');
    } catch (error) {
      console.log('❌ Failed to generate long URL:', error.message);
    }

    // 4. Test download with curl command
    console.log('\n🔧 Testing Access Methods:');
    
    const testUrl = await client.presignedGetObject(bucketName, fileName, 600); // 10 minutes
    
    console.log('\n📥 Download with curl:');
    console.log(`   curl -o "Downloaded-Claude.pdf" "${testUrl}"`);
    
    console.log('\n🌐 Open in browser:');
    console.log(`   Copy this URL to your browser: ${testUrl}`);
    
    console.log('\n📱 Test with wget:');
    console.log(`   wget -O "Claude-from-minio.pdf" "${testUrl}"`);

    // 5. Information about API integration
    console.log('\n📋 API Integration Notes:');
    console.log('   ❌ This file is NOT accessible through our document management API');
    console.log('   ❌ Reason: No database record exists (file was uploaded directly to MinIO)');
    console.log('   ✅ Solution: Upload the file through the document management UI');
    console.log('   ✅ Alternative: Create a database record manually (see HOW-TO-ACCESS-CLAUDE-PDF.md)');

    // 6. Show what the API would return
    console.log('\n🔍 What the Document API would show:');
    console.log('   GET /api/documents/list → Would NOT include Claude.pdf');
    console.log('   GET /api/documents/search?q=Claude → Would return 0 results');
    console.log('   Reason: Document management API only shows files with database records');

    console.log('\n✅ Access Test Complete!');
    console.log('   The Claude.pdf file is accessible via the URLs above');
    console.log('   For full document management features, upload through the UI');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('   Check your MinIO configuration and network connectivity');
  }
}

// Show usage instructions
console.log('📖 Claude.pdf Access Guide');
console.log('This script helps you access the Claude.pdf file you uploaded to MinIO');
console.log('Run: node scripts/access-claude-pdf.js\n');

// Run the test
accessClaudePdf().catch(console.error);