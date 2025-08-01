// Simple Node.js test for holiday sync
import { execSync } from 'child_process';

async function testHolidaySync() {
  try {
    console.log('🚀 Testing holiday sync via local API...');
    
    const response = await fetch('http://localhost:3001/api/holidays/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: This will fail without proper authentication
        // But should give us the error details
      },
      body: JSON.stringify({ force: false })
    });
    
    const result = await response.text();
    
    console.log('Status:', response.status);
    console.log('Response:', result);
    
    if (!response.ok) {
      console.error('❌ Request failed with status:', response.status);
    } else {
      console.log('✅ Request succeeded');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testHolidaySync();