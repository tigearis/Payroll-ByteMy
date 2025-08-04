import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global test setup...');
  
  // Set up test environment
  process.env.NODE_ENV = 'test';
  process.env.SKIP_AUTH = 'true'; // Skip authentication for E2E tests
  
  // Wait for the server to be ready
  const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000';
  console.log(`⏳ Waiting for server at ${baseURL}...`);
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Wait for the server to respond
  let retries = 0;
  const maxRetries = 30;
  
  while (retries < maxRetries) {
    try {
      const response = await page.goto(baseURL, { timeout: 5000 });
      if (response && response.ok()) {
        console.log('✅ Server is ready!');
        break;
      }
    } catch (error) {
      retries++;
      console.log(`⏳ Attempt ${retries}/${maxRetries} - Server not ready, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  if (retries >= maxRetries) {
    throw new Error('❌ Server failed to start within expected time');
  }
  
  // Create test data if needed
  await setupTestData(page);
  
  await browser.close();
  console.log('✅ Global setup completed!');
}

async function setupTestData(page: any) {
  console.log('🗃️ Setting up test data...');
  
  try {
    // Create test users, clients, services, etc.
    // This would typically involve API calls to set up test data
    
    // Example: Create test client
    const response = await page.request.post('/api/test/setup', {
      data: {
        action: 'create_test_data',
        entities: ['clients', 'services', 'users', 'payrolls']
      }
    });
    
    if (response.ok()) {
      console.log('✅ Test data created successfully');
    } else {
      console.warn('⚠️ Failed to create test data via API, tests will create data as needed');
    }
  } catch (error) {
    console.warn('⚠️ Test data setup failed, tests will create data as needed:', error);
  }
}

export default globalSetup;