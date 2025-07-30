#!/usr/bin/env node

/**
 * Test script for document management API endpoints
 * Tests the Claude.pdf file that was manually uploaded to MinIO
 */

import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:3000'; // Adjust if running on different port

async function testDocumentAPI() {
  console.log('🧪 Testing Document Management API');
  console.log('='.repeat(50));

  try {
    // Test 1: Health Check
    console.log('\n🏥 1. Testing Health Check...');
    
    const healthResponse = await fetch(`${BASE_URL}/api/documents/health`, {
      headers: {
        'Authorization': 'Bearer test-token', // You'll need a valid JWT token
        'Content-Type': 'application/json',
      }
    });
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check passed');
      console.log('   Status:', healthData.status);
      console.log('   MinIO connected:', healthData.minio?.connected);
      console.log('   Buckets:', healthData.minio?.buckets?.join(', '));
      console.log('   Total objects:', healthData.minio?.stats?.totalObjects);
    } else {
      console.log('❌ Health check failed:', healthResponse.status);
      const error = await healthResponse.text();
      console.log('   Error:', error);
    }

    // Test 2: List Documents
    console.log('\n📋 2. Testing Document List...');
    
    const listResponse = await fetch(`${BASE_URL}/api/documents/list?limit=10`, {
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
      }
    });
    
    if (listResponse.ok) {
      const listData = await listResponse.json();
      console.log('✅ Document list retrieved');
      console.log('   Total documents:', listData.totalCount);
      console.log('   Documents found:', listData.documents?.length || 0);
      
      if (listData.documents?.length > 0) {
        console.log('   Sample document:', {
          id: listData.documents[0].id,
          filename: listData.documents[0].filename,
          size: listData.documents[0].size,
        });
      }
    } else {
      console.log('❌ Document list failed:', listResponse.status);
      const error = await listResponse.text();
      console.log('   Error:', error);
    }

    // Test 3: Search Documents
    console.log('\n🔍 3. Testing Document Search...');
    
    const searchResponse = await fetch(`${BASE_URL}/api/documents/search?q=Claude`, {
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
      }
    });
    
    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      console.log('✅ Document search completed');
      console.log('   Results found:', searchData.documents?.length || 0);
      
      if (searchData.documents?.length > 0) {
        console.log('   Found documents:', searchData.documents.map(d => d.filename));
      }
    } else {
      console.log('❌ Document search failed:', searchResponse.status);
      const error = await searchResponse.text();
      console.log('   Error:', error);
    }

    // Test 4: Test File Upload (simulate uploading Claude.pdf through our API)
    console.log('\n📤 4. Testing Document Upload Simulation...');
    console.log('   Note: The Claude.pdf file you uploaded directly to MinIO won\'t appear in our API');
    console.log('   because it doesn\'t have a corresponding database record.');
    console.log('   To test the full system, you would need to upload through our API.');

    // Test 5: Direct MinIO Access Test
    console.log('\n🔗 5. Testing Direct MinIO Access...');
    console.log('   The Claude.pdf file is accessible via MinIO at:');
    console.log('   - Direct URL: http://192.168.1.229:9768/documents/Claude.pdf');
    console.log('   - Size: 10,101,078 bytes (9.6 MB)');
    console.log('   - Note: This requires authentication or public bucket access');

  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.error('   Make sure the development server is running on', BASE_URL);
  }
}

// Instructions for running the test
console.log('🚀 Document API Test Instructions:');
console.log('1. Make sure your development server is running: pnpm dev');
console.log('2. You\'ll need a valid JWT token for authenticated endpoints');
console.log('3. The Claude.pdf file you uploaded is in MinIO but not in our database');
console.log('4. To fully test the system, upload a file through the UI or API\n');

// Run the test
testDocumentAPI().catch(console.error);