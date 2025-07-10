/**
 * Test Core AI Functionality (Internal Components)
 * 
 * Tests the AI components without requiring authentication
 */

// Use require for testing since we have TypeScript files
const path = require('path');
const { execSync } = require('child_process');

// Load environment variables
require('dotenv').config({ path: '.env.development.local' });

// Simple test that doesn't require transpiled modules
console.log("🧪 Testing AI Assistant Integration\n");

// Test 1: Check if files exist
console.log("📁 Checking AI component files...");
const aiFiles = [
  'lib/ai/langchain-service.ts',
  'lib/ai/context-extractor.ts', 
  'lib/ai/input-validator.ts',
  'lib/ai/hasura-query-generator.ts',
  'lib/ai/rate-limiter.ts',
  'lib/ai/security-validator.ts'
];

aiFiles.forEach(file => {
  const fs = require('fs');
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

// Test 2: Check dependencies
console.log("\n📦 Checking AI dependencies...");
try {
  execSync('pnpm list @langchain/core @langchain/ollama langchain isomorphic-dompurify @upstash/redis', { stdio: 'pipe' });
  console.log("✅ All AI dependencies installed");
} catch (error) {
  console.log("❌ Some dependencies missing");
}

// Test 3: Check environment variables
console.log("\n🔧 Checking environment variables...");
console.log(`LLM_API_KEY: ${process.env.LLM_API_KEY ? '✅ Set' : '❌ Missing'}`);
console.log(`UPSTASH_REDIS_URL: ${process.env.UPSTASH_REDIS_URL ? '✅ Set' : '⚠️  Missing (will use in-memory fallback)'}`);
console.log(`UPSTASH_REDIS_TOKEN: ${process.env.UPSTASH_REDIS_TOKEN ? '✅ Set' : '⚠️  Missing (will use in-memory fallback)'}`);

// Test 4: TypeScript compilation
console.log("\n🔍 Checking TypeScript compilation...");
try {
  execSync('npx tsc --noEmit --skipLibCheck lib/ai/*.ts', { stdio: 'pipe' });
  console.log("✅ All AI TypeScript files compile successfully");
} catch (error) {
  console.log("❌ TypeScript compilation errors found");
  console.log(error.stdout?.toString() || error.message);
}

console.log("\n🏁 AI Assistant integration test completed");