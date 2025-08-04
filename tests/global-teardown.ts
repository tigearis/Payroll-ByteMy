import { chromium, FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global test teardown...');
  
  const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000';
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Clean up test data
    await cleanupTestData(page);
    
    // Generate test report summary
    await generateTestSummary();
    
  } catch (error) {
    console.warn('⚠️ Teardown encountered issues:', error);
  } finally {
    await browser.close();
    console.log('✅ Global teardown completed!');
  }
}

async function cleanupTestData(page: any) {
  console.log('🗑️ Cleaning up test data...');
  
  try {
    // Clean up test data created during tests
    const response = await page.request.post('/api/test/cleanup', {
      data: {
        action: 'cleanup_test_data',
        entities: ['billing_items', 'payrolls', 'service_agreements', 'clients', 'services']
      }
    });
    
    if (response.ok()) {
      const result = await response.json();
      console.log('✅ Test data cleanup completed:', result);
    } else {
      console.warn('⚠️ Test data cleanup failed via API');
    }
  } catch (error) {
    console.warn('⚠️ Test data cleanup encountered issues:', error);
  }
}

async function generateTestSummary() {
  console.log('📊 Generating test summary...');
  
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    // Read test results
    const resultsPath = path.join(process.cwd(), 'test-results', 'results.json');
    
    try {
      const resultsData = await fs.readFile(resultsPath, 'utf-8');
      const results = JSON.parse(resultsData);
      
      const summary = {
        timestamp: new Date().toISOString(),
        total: results.stats?.total || 0,
        passed: results.stats?.passed || 0,
        failed: results.stats?.failed || 0,
        skipped: results.stats?.skipped || 0,
        duration: results.stats?.duration || 0,
        environment: {
          nodeVersion: process.version,
          platform: process.platform,
          ci: !!process.env.CI
        }
      };
      
      console.log('📈 Test Summary:');
      console.log(`   Total: ${summary.total}`);
      console.log(`   Passed: ${summary.passed}`);
      console.log(`   Failed: ${summary.failed}`);
      console.log(`   Skipped: ${summary.skipped}`);
      console.log(`   Duration: ${(summary.duration / 1000).toFixed(2)}s`);
      
      // Write summary to file
      const summaryPath = path.join(process.cwd(), 'test-results', 'summary.json');
      await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
      
    } catch (error) {
      console.warn('⚠️ Could not read test results for summary');
    }
    
  } catch (error) {
    console.warn('⚠️ Failed to generate test summary:', error);
  }
}

export default globalTeardown;