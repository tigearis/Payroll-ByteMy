// scripts/test-single-auth.js
// Test authentication for a single user

import { createClerkClient } from '@clerk/clerk-sdk-node';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
});

async function testAuthentication() {
  const testEmail = 'developer@test.payroll.com';
  const testPassword = 'DevSecure2024!@#$';
  
  console.log('🧪 Testing authentication for:', testEmail);
  console.log('Password:', testPassword);
  
  try {
    // Try to authenticate using Clerk's API
    const signInAttempt = await clerk.signIns.create({
      identifier: testEmail,
      password: testPassword,
    });
    
    console.log('✅ Authentication successful!');
    console.log('Status:', signInAttempt.status);
    console.log('User ID:', signInAttempt.userId);
    
  } catch (error) {
    console.error('❌ Authentication failed:');
    console.error('Error:', error.message);
    if (error.errors) {
      error.errors.forEach(err => {
        console.error(`- ${err.message} (${err.code})`);
      });
    }
  }
}

testAuthentication();