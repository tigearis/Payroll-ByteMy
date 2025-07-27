/**
 * Global setup for Playwright tests
 * Initializes test environment and prepares authentication
 */

import { chromium, FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting Playwright global setup...');

  // Load test environment variables
  dotenv.config({ path: '.env.test' });

  // Create necessary directories
  const authDir = 'playwright/.auth';
  const resultsDir = 'test-results';
  const screenshotsDir = 'e2e/screenshots';

  [authDir, resultsDir, screenshotsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  });

  // Clean up old auth files
  if (fs.existsSync(authDir)) {
    const authFiles = fs.readdirSync(authDir);
    authFiles.forEach(file => {
      if (file.endsWith('.json')) {
        fs.unlinkSync(path.join(authDir, file));
        console.log(`🧹 Cleaned up old auth file: ${file}`);
      }
    });
  }

  // Validate environment variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
    'E2E_ORG_ADMIN_EMAIL',
    'E2E_ORG_ADMIN_PASSWORD',
    'E2E_MANAGER_EMAIL',
    'E2E_MANAGER_PASSWORD',
    'E2E_CONSULTANT_EMAIL',
    'E2E_CONSULTANT_PASSWORD',
    'E2E_VIEWER_EMAIL',
    'E2E_VIEWER_PASSWORD'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    console.error('   Please check your .env.test file');
    throw new Error('Missing required environment variables for testing');
  }

  console.log('✅ Environment variables validated');

  // Test server availability
  const baseURL = config.projects[0].use?.baseURL || 'http://localhost:3000';
  console.log(`🔍 Testing server availability at: ${baseURL}`);

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const response = await page.goto(baseURL, { timeout: 30000 });
    
    if (response?.ok()) {
      console.log('✅ Development server is running and accessible');
    } else {
      throw new Error(`Server responded with status: ${response?.status()}`);
    }
  } catch (error) {
    console.error('❌ Development server is not accessible:', error.message);
    console.error('   Please ensure the server is running with: pnpm dev');
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }

  // Create test metadata
  const testMetadata = {
    setupTime: new Date().toISOString(),
    baseURL,
    testUsers: {
      admin: process.env.E2E_ORG_ADMIN_EMAIL,
      manager: process.env.E2E_MANAGER_EMAIL,
      consultant: process.env.E2E_CONSULTANT_EMAIL,
      viewer: process.env.E2E_VIEWER_EMAIL
    },
    environment: process.env.NODE_ENV || 'development'
  };

  fs.writeFileSync(
    path.join(resultsDir, 'test-metadata.json'),
    JSON.stringify(testMetadata, null, 2)
  );

  console.log('✅ Global setup completed successfully');
}

export default globalSetup;