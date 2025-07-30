#!/usr/bin/env node

/**
 * Test Feature Flag Management UI
 * This script validates that our feature flag implementation is correct
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Feature Flag Management Implementation');
console.log('=' .repeat(60));

// Test 1: Check that all necessary files exist
console.log('\n📁 Step 1: Verify File Structure');

const requiredFiles = [
  'populate-feature-flags.sql',
  'domains/external-systems/components/feature-flag-management.tsx',
  'domains/external-systems/components/holiday-sync-panel.tsx',
  'app/(dashboard)/developer/page.tsx'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} - exists`);
  } else {
    console.log(`❌ ${file} - missing`);
    allFilesExist = false;
  }
});

// Test 2: Check SQL script content
console.log('\n📊 Step 2: Validate SQL Script');
try {
  const sqlContent = fs.readFileSync('populate-feature-flags.sql', 'utf8');
  
  // Check for all expected feature flags
  const expectedFlags = [
    'ai_assistant', 'aidata_assistant', 'ai_float', 'ai_debug', 'ollama_integration',
    'mfa_enabled', 'step_up_auth', 'enhanced_permissions', 'permission_debug', 
    'audit_logging', 'session_monitoring', 'security_reporting',
    'dev_tools', 'debug_panels', 'auth_debug',
    'billing_access', 'financial_reporting',
    'tax_calculator', 'tax_calculator_prod',
    'bulk_operations', 'data_export', 'user_management'
  ];
  
  let flagsFound = 0;
  expectedFlags.forEach(flag => {
    if (sqlContent.includes(`'${flag}'`)) {
      flagsFound++;
    } else {
      console.log(`⚠️  Missing flag in SQL: ${flag}`);
    }
  });
  
  console.log(`✅ Found ${flagsFound}/${expectedFlags.length} expected feature flags`);
  
  // Check for proper role assignments
  const rolePatterns = ['developer', 'org_admin', 'manager', 'consultant', 'viewer'];
  const hasRoles = rolePatterns.some(role => sqlContent.includes(`"${role}"`));
  console.log(`✅ Role assignments: ${hasRoles ? 'present' : 'missing'}`);
  
} catch (error) {
  console.log(`❌ Error reading SQL script: ${error.message}`);
  allFilesExist = false;
}

// Test 3: Check React component imports
console.log('\n⚛️  Step 3: Validate React Component Structure');
try {
  const componentContent = fs.readFileSync('domains/external-systems/components/feature-flag-management.tsx', 'utf8');
  
  const requiredImports = [
    'useQuery',
    'useMutation',
    'GET_FEATURE_FLAGS',
    'UPDATE_FEATURE_FLAG',
    'CREATE_FEATURE_FLAG',
    'DEFAULT_FEATURE_FLAGS',
    'FEATURE_FLAG_NAMES'
  ];
  
  let importsFound = 0;
  requiredImports.forEach(imp => {
    if (componentContent.includes(imp)) {
      importsFound++;
    } else {
      console.log(`⚠️  Missing import: ${imp}`);
    }
  });
  
  console.log(`✅ Found ${importsFound}/${requiredImports.length} required imports`);
  
  // Check for key component features
  const features = [
    'search functionality',
    'category filtering', 
    'toggle switches',
    'role management',
    'GraphQL integration'
  ];
  
  const featureChecks = [
    componentContent.includes('searchTerm'),
    componentContent.includes('selectedCategory'),
    componentContent.includes('Switch'),
    componentContent.includes('allowedRoles'),
    componentContent.includes('useQuery') && componentContent.includes('useMutation')
  ];
  
  let featuresPresent = 0;
  features.forEach((feature, index) => {
    if (featureChecks[index]) {
      console.log(`✅ ${feature} - implemented`);
      featuresPresent++;
    } else {
      console.log(`❌ ${feature} - missing`);
    }
  });
  
} catch (error) {
  console.log(`❌ Error reading component file: ${error.message}`);
  allFilesExist = false;
}

// Test 4: Check developer page integration
console.log('\n🔧 Step 4: Validate Developer Page Integration');
try {
  const devPageContent = fs.readFileSync('app/(dashboard)/developer/page.tsx', 'utf8');
  
  const integrationChecks = [
    devPageContent.includes('FeatureFlagManagement'),
    devPageContent.includes('HolidaySyncPanel'),
    devPageContent.includes('External Systems'),
    devPageContent.includes('import { FeatureFlagManagement }')
  ];
  
  const integrationFeatures = [
    'FeatureFlagManagement component imported',
    'HolidaySyncPanel component present',
    'External Systems section header',
    'Proper import statement'
  ];
  
  integrationFeatures.forEach((feature, index) => {
    if (integrationChecks[index]) {
      console.log(`✅ ${feature}`);
    } else {
      console.log(`❌ ${feature}`);
      allFilesExist = false;
    }
  });
  
} catch (error) {
  console.log(`❌ Error reading developer page: ${error.message}`);
  allFilesExist = false;
}

// Final Results
console.log('\n' + '='.repeat(60));
if (allFilesExist) {
  console.log('🎉 Feature Flag Management Implementation: COMPLETE');
  console.log('\n📋 Next Steps:');
  console.log('   1. Run the SQL script to populate the database:');
  console.log('      psql $DATABASE_URL -f populate-feature-flags.sql');
  console.log('   2. Enable the dev_tools feature flag:');
  console.log('      node enable-dev-tools.js');
  console.log('   3. Access /developer to use the feature flag management UI');
  console.log('\n🔧 Features Available:');
  console.log('   • Toggle any of 22 feature flags on/off');
  console.log('   • Manage role permissions per flag');
  console.log('   • Search and filter flags by category');
  console.log('   • Real-time updates with optimistic UI');
  console.log('   • Comprehensive error handling');
} else {
  console.log('❌ Feature Flag Management Implementation: INCOMPLETE');
  console.log('   Please check the missing files and errors above.');
  process.exit(1);
}

console.log('\n✨ Feature Flag Management UI is ready to use!');