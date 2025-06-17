#!/usr/bin/env node

/**
 * Simple test script to debug staff creation API
 * Run with: node test-staff-creation.js
 */

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function testStaffCreation() {
  console.log('🧪 Testing staff creation API...');
  console.log('📍 API URL:', API_URL);
  
  try {
    // Test 1: Basic GET request to see if endpoint exists
    console.log('\n1️⃣ Testing GET /api/staff/create');
    
    const getResponse = await fetch(`${API_URL}/api/staff/create`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('GET Response Status:', getResponse.status);
    console.log('GET Response Headers:', Object.fromEntries(getResponse.headers.entries()));
    
    const getText = await getResponse.text();
    console.log('GET Response Body:', getText);
    
    // Test 2: POST request without auth (should fail with 401/403)
    console.log('\n2️⃣ Testing POST /api/staff/create (no auth)');
    
    const postResponse = await fetch(`${API_URL}/api/staff/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        role: 'viewer',
        is_staff: true
      })
    });
    
    console.log('POST Response Status:', postResponse.status);
    console.log('POST Response Headers:', Object.fromEntries(postResponse.headers.entries()));
    
    const postText = await postResponse.text();
    console.log('POST Response Body:', postText);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testStaffCreation();