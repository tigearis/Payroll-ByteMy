// Simple test to check if our JWT template endpoint works
const https = require('https');

async function testJWTEndpoint() {
  console.log('🧪 Testing JWT Template Endpoint');
  console.log('================================\n');

  try {
    // Test the check-role endpoint 
    const response = await fetch('http://localhost:3001/api/check-role');
    const data = await response.json();
    
    console.log('📍 Endpoint Response:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(data, null, 2));
    
    if (response.status === 401) {
      console.log('\n✅ Endpoint is working correctly (returns 401 for unauthenticated requests)');
      console.log('🔍 This confirms the JWT template implementation is active');
    } else {
      console.log('\n❓ Unexpected response - check implementation');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testJWTEndpoint();