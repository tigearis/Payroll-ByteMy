/**
 * Comprehensive System Test Suite
 * Tests all 11 business domains and their interactions
 */

import fetch from 'node-fetch';
import fs from 'fs';

// Test configuration
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;

// Test users with different role levels (from database and Clerk)
const TEST_USERS = {
  developer: {
    email: process.env.E2E_DEVELOPER_EMAIL || 'admin@example.com',
    password: process.env.E2E_DEVELOPER_PASSWORD || 'Admin1',
    level: 5,
    role: 'admin', // Maps to highest level in your system
    description: 'Admin user with full system access'
  },
  org_admin: {
    email: process.env.E2E_ORG_ADMIN_EMAIL || 'admin@example.com', 
    password: process.env.E2E_ORG_ADMIN_PASSWORD || 'Admin1',
    level: 4,
    role: 'admin',
    description: 'Admin user with organizational management access'
  },
  manager: {
    email: process.env.E2E_MANAGER_EMAIL || 'manager@example.com',
    password: process.env.E2E_MANAGER_PASSWORD || 'Manager1',
    level: 3,
    role: 'manager',
    description: 'Manager user with team and client management access'
  },
  consultant: {
    email: process.env.E2E_CONSULTANT_EMAIL || 'consultant@example.com',
    password: process.env.E2E_CONSULTANT_PASSWORD || 'Consultant1',
    level: 2,
    role: 'consultant',
    description: 'Consultant user with limited operational access'
  },
  viewer: {
    email: process.env.E2E_VIEWER_EMAIL || 'viewer@example.com',
    password: process.env.E2E_VIEWER_PASSWORD || 'Viewer1',
    level: 1,
    role: 'viewer',
    description: 'Viewer user with read-only dashboard access'
  }
};

// Domain testing configuration
const DOMAIN_TESTS = {
  // Critical security domains
  auth: {
    priority: 'CRITICAL',
    endpoints: ['/api/auth/validate', '/api/sync-current-user'],
    permissions: ['auth.read', 'auth.create', 'auth.update'],
    ui_routes: ['/sign-in', '/sign-up']
  },
  audit: {
    priority: 'CRITICAL', 
    endpoints: ['/api/admin/audit-logs'],
    permissions: ['audit.read', 'audit.create'],
    ui_routes: ['/security']
  },
  permissions: {
    priority: 'CRITICAL',
    endpoints: ['/api/check-role'],
    permissions: ['permissions.read', 'permissions.update'],
    ui_routes: ['/admin/permissions']
  },
  
  // Core business domains
  billing: {
    priority: 'HIGH',
    endpoints: ['/api/billing', '/api/reports/billing'],
    permissions: ['billing.read', 'billing.create', 'billing.update', 'billing.delete'],
    ui_routes: ['/billing']
  },
  payrolls: {
    priority: 'HIGH',
    endpoints: ['/api/payrolls', '/api/payroll-dates'],
    permissions: ['payrolls.read', 'payrolls.create', 'payrolls.update', 'payrolls.delete'],
    ui_routes: ['/payrolls', '/payroll-schedule']
  },
  users: {
    priority: 'HIGH',
    endpoints: ['/api/staff', '/api/invitations', '/api/users'],
    permissions: ['users.read', 'users.create', 'users.update', 'users.delete'],
    ui_routes: ['/staff', '/invitations']
  },
  clients: {
    priority: 'HIGH',
    endpoints: ['/api/clients'],
    permissions: ['clients.read', 'clients.create', 'clients.update', 'clients.delete'],
    ui_routes: ['/clients']
  },
  
  // Supporting domains
  work_schedule: {
    priority: 'MEDIUM',
    endpoints: ['/api/work-schedule', '/api/workload'],
    permissions: ['workschedule.read', 'workschedule.create', 'workschedule.update'],
    ui_routes: ['/work-schedule']
  },
  email: {
    priority: 'MEDIUM',
    endpoints: ['/api/email'],
    permissions: ['email.read', 'email.create', 'email.send'],
    ui_routes: ['/email']
  },
  leave: {
    priority: 'MEDIUM',
    endpoints: ['/api/leave'],
    permissions: ['leave.read', 'leave.create', 'leave.update', 'leave.approve'],
    ui_routes: ['/leave']
  },
  notes: {
    priority: 'MEDIUM',
    endpoints: [],
    permissions: ['notes.read', 'notes.create', 'notes.update', 'notes.delete'],
    ui_routes: []
  },
  external_systems: {
    priority: 'MEDIUM',
    endpoints: ['/api/holidays'],
    permissions: ['externalsystems.read'],
    ui_routes: []
  }
};

class SystemTester {
  constructor() {
    this.results = {
      total_tests: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      domains: {},
      permission_issues: [],
      data_display_issues: [],
      integration_issues: []
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      'info': '🔍',
      'success': '✅', 
      'error': '❌',
      'warning': '⚠️',
      'critical': '🚨'
    }[type] || 'ℹ️';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async testDomainEndpoints(domain, domainConfig) {
    this.log(`Testing ${domain} domain endpoints`, 'info');
    const results = {};
    
    for (const endpoint of domainConfig.endpoints) {
      try {
        this.log(`Testing endpoint: ${endpoint}`);
        
        // Test endpoint accessibility
        const response = await fetch(`${BASE_URL}${endpoint}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        results[endpoint] = {
          status: response.status,
          accessible: response.status !== 404,
          requires_auth: response.status === 401,
          error: response.status >= 500 ? await response.text() : null
        };
        
        if (response.status === 200) {
          this.results.passed++;
          this.log(`✅ ${endpoint} - ${response.status}`);
        } else if (response.status === 401) {
          this.results.passed++; // Expected for protected routes
          this.log(`🔒 ${endpoint} - Requires authentication (${response.status})`);
        } else {
          this.results.failed++;
          this.log(`❌ ${endpoint} - ${response.status}`, 'error');
        }
        
        this.results.total_tests++;
        
      } catch (error) {
        this.results.failed++;
        this.results.total_tests++;
        results[endpoint] = { error: error.message };
        this.log(`❌ ${endpoint} - Error: ${error.message}`, 'error');
      }
    }
    
    return results;
  }

  async testUIRoutes(domain, domainConfig) {
    this.log(`Testing ${domain} domain UI routes`);
    const results = {};
    
    for (const route of domainConfig.ui_routes) {
      try {
        this.log(`Testing UI route: ${route}`);
        
        const response = await fetch(`${BASE_URL}${route}`);
        
        results[route] = {
          status: response.status,
          accessible: response.status === 200,
          redirects_to_auth: response.url?.includes('/sign-in') || false,
          content_length: response.headers.get('content-length')
        };
        
        if (response.status === 200) {
          this.results.passed++;
          this.log(`✅ ${route} - Accessible`);
        } else if (response.url?.includes('/sign-in')) {
          this.results.passed++; // Expected redirect for protected routes
          this.log(`🔒 ${route} - Redirects to authentication`);
        } else {
          this.results.failed++;
          this.log(`❌ ${route} - Status: ${response.status}`, 'warning');
        }
        
        this.results.total_tests++;
        
      } catch (error) {
        this.results.failed++;
        this.results.total_tests++;
        results[route] = { error: error.message };
        this.log(`❌ ${route} - Error: ${error.message}`, 'error');
      }
    }
    
    return results;
  }

  async testPermissionBoundaries(domain, domainConfig) {
    this.log(`Testing ${domain} permission boundaries`);
    const results = {};
    
    // Test each permission level against the domain
    for (const [role, user] of Object.entries(TEST_USERS)) {
      results[role] = {};
      
      for (const permission of domainConfig.permissions) {
        // This would require actual authentication - for now just log the test
        this.log(`Would test: ${role} (level ${user.level}) -> ${permission}`);
        results[role][permission] = { test_needed: true };
        this.results.total_tests++;
        this.results.skipped++; // Marking as skipped until we implement auth
      }
    }
    
    return results;
  }

  async testDomain(domain, domainConfig) {
    this.log(`\n🧪 Testing ${domain.toUpperCase()} Domain (${domainConfig.priority} Priority)`, 'info');
    
    const domainResults = {
      priority: domainConfig.priority,
      endpoints: await this.testDomainEndpoints(domain, domainConfig),
      ui_routes: await this.testUIRoutes(domain, domainConfig),
      permissions: await this.testPermissionBoundaries(domain, domainConfig)
    };
    
    this.results.domains[domain] = domainResults;
    return domainResults;
  }

  async runSystemIntegrationTests() {
    this.log('\n🔗 Running System Integration Tests', 'info');
    
    // Test 1: Authentication Flow Integration
    try {
      this.log('Testing auth flow integration...');
      // Would test sign-in -> dashboard -> protected route navigation
      this.results.total_tests++;
      this.results.skipped++;
    } catch (error) {
      this.log(`Integration test failed: ${error.message}`, 'error');
      this.results.integrationissues.push({
        test: 'auth_flow_integration',
        error: error.message
      });
    }
    
    // Test 2: Permission System Integration
    try {
      this.log('Testing permission system integration...');
      // Would test role changes -> UI updates -> API access changes
      this.results.total_tests++;
      this.results.skipped++;
    } catch (error) {
      this.log(`Permission integration test failed: ${error.message}`, 'error');
      this.results.integrationissues.push({
        test: 'permission_system_integration', 
        error: error.message
      });
    }
    
    // Test 3: Data Flow Integration
    try {
      this.log('Testing data flow integration...');
      // Would test GraphQL -> Apollo Client -> UI updates
      this.results.total_tests++;
      this.results.skipped++;
    } catch (error) {
      this.log(`Data flow integration test failed: ${error.message}`, 'error');
      this.results.integrationissues.push({
        test: 'data_flow_integration',
        error: error.message
      });
    }
  }

  async runAllTests() {
    this.log('🚀 Starting Comprehensive System Test Suite\n', 'info');
    
    // Test all domains in priority order
    const criticalDomains = Object.entries(DOMAIN_TESTS).filter(([_, config]) => config.priority === 'CRITICAL');
    const highDomains = Object.entries(DOMAIN_TESTS).filter(([_, config]) => config.priority === 'HIGH');
    const mediumDomains = Object.entries(DOMAIN_TESTS).filter(([_, config]) => config.priority === 'MEDIUM');
    
    // Test critical domains first
    for (const [domain, config] of criticalDomains) {
      await this.testDomain(domain, config);
    }
    
    // Test high priority domains
    for (const [domain, config] of highDomains) {
      await this.testDomain(domain, config);
    }
    
    // Test medium priority domains
    for (const [domain, config] of mediumDomains) {
      await this.testDomain(domain, config);
    }
    
    // Run integration tests
    await this.runSystemIntegrationTests();
    
    // Generate final report
    this.generateReport();
  }

  generateReport() {
    this.log('\n📊 COMPREHENSIVE TEST REPORT', 'info');
    this.log('=' * 50);
    
    // Overall stats
    this.log(`\n📈 Overall Results:`);
    this.log(`   Total Tests: ${this.results.total_tests}`);
    this.log(`   Passed: ${this.results.passed} (${((this.results.passed/this.results.total_tests)*100).toFixed(1)}%)`);
    this.log(`   Failed: ${this.results.failed} (${((this.results.failed/this.results.total_tests)*100).toFixed(1)}%)`);
    this.log(`   Skipped: ${this.results.skipped} (${((this.results.skipped/this.results.total_tests)*100).toFixed(1)}%)`);
    
    // Domain breakdown
    this.log(`\n🏗️ Domain Test Results:`);
    Object.entries(this.results.domains).forEach(([domain, results]) => {
      const endpointCount = Object.keys(results.endpoints).length;
      const routeCount = Object.keys(results.ui_routes).length;
      this.log(`   ${domain.toUpperCase()} (${results.priority}):`);
      this.log(`     Endpoints tested: ${endpointCount}`);
      this.log(`     UI routes tested: ${routeCount}`);
    });
    
    // Issues summary
    if (this.results.permissionissues.length > 0) {
      this.log(`\n🔐 Permission Issues Found: ${this.results.permissionissues.length}`, 'warning');
      this.results.permissionissues.forEach(issue => {
        this.log(`   - ${issue.test}: ${issue.error}`, 'warning');
      });
    }
    
    if (this.results.datadisplay_issues.length > 0) {
      this.log(`\n📊 Data Display Issues Found: ${this.results.datadisplay_issues.length}`, 'warning');
      this.results.datadisplay_issues.forEach(issue => {
        this.log(`   - ${issue.component}: ${issue.error}`, 'warning');
      });
    }
    
    if (this.results.integrationissues.length > 0) {
      this.log(`\n🔗 Integration Issues Found: ${this.results.integrationissues.length}`, 'error');
      this.results.integrationissues.forEach(issue => {
        this.log(`   - ${issue.test}: ${issue.error}`, 'error');
      });
    }
    
    // Recommendations
    this.log(`\n💡 Recommendations:`);
    
    if (this.results.failed > 0) {
      this.log(`   1. Fix ${this.results.failed} failed tests before deployment`, 'critical');
    }
    
    if (this.results.skipped > 0) {
      this.log(`   2. Implement authentication for ${this.results.skipped} skipped permission tests`, 'warning');
    }
    
    this.log(`   3. Set up E2E testing framework for comprehensive UI testing`, 'info');
    this.log(`   4. Implement automated permission boundary testing`, 'info');
    this.log(`   5. Add data integrity validation for GraphQL operations`, 'info');
    
    // Save results to file
    const reportFile = `test-results/comprehensive-test-${Date.now()}.json`;
    try {
      fs.mkdirSync('test-results', { recursive: true });
      fs.writeFileSync(reportFile, JSON.stringify(this.results, null, 2));
      this.log(`\n💾 Detailed results saved to: ${reportFile}`, 'success');
    } catch (error) {
      this.log(`Failed to save results: ${error.message}`, 'error');
    }
  }
}

// Run the tests
async function main() {
  const tester = new SystemTester();
  await tester.runAllTests();
}

// Run if this is the main module
main().catch(console.error);

export { SystemTester, DOMAIN_TESTS, TEST_USERS };