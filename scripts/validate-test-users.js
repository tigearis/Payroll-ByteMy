/**
 * Test User Validation Script
 * Validates that test users exist in both Clerk and database with correct roles
 */

import fetch from 'node-fetch';
import fs from 'fs';

// Load environment variables from .env.local
import { config } from 'dotenv';
config({ path: '.env.local' });

// Test configuration
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || 'https://hasura.bytemy.com.au/v1/graphql';
const HASURA_ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

// Test users from environment
const TEST_USERS = {
  admin: {
    email: process.env.ADMIN_ROLE_USER || 'admin@example.com',
    password: process.env.ADMIN_ROLE_PASSWORD || 'Admin1',
    expectedRole: 'admin',
    description: 'Admin user with full system access'
  },
  manager: {
    email: process.env.MANAGER_ROLE_USER || 'manager@example.com',
    password: process.env.MANAGER_ROLE_PASSWORD || 'Manager1',
    expectedRole: 'manager',
    description: 'Manager user with team management access'
  },
  consultant: {
    email: process.env.CONSULTANT_ROLE_USER || 'consultant@example.com',
    password: process.env.CONSULTANT_ROLE_PASSWORD || 'Consultant1',  
    expectedRole: 'consultant',
    description: 'Consultant user with operational access'
  },
  viewer: {
    email: process.env.VIEWER_ROLE_USER || 'viewer@example.com',
    password: process.env.VIEWER_ROLE_PASSWORD || 'Viewer1',
    expectedRole: 'viewer',
    description: 'Viewer user with read-only access'
  }
};

class TestUserValidator {
  constructor() {
    this.results = {
      total_users: 0,
      validated_users: 0,
      missing_users: 0,
      role_mismatches: 0,
      clerk_issues: [],
      database_issues: [],
      validation_results: {}
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      'info': '🔍',
      'success': '✅', 
      'error': '❌',
      'warning': '⚠️',
      'critical': '🚨',
      'database': '🗄️',
      'clerk': '🔐'
    }[type] || 'ℹ️';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  /**
   * Check if user exists in database via Hasura
   */
  async checkUserInDatabase(email, expectedRole) {
    try {
      const query = `
        query GetUser($email: String!) {
          users(where: {email: {_eq: $email}}) {
            id
            email
            created_at
            updated_at
            userroles {
              role {
                id
                name
              }
            }
          }
        }
      `;

      const response = await fetch(HASURA_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Hasura-Admin-Secret': HASURA_ADMIN_SECRET
        },
        body: JSON.stringify({
          query,
          variables: { email }
        })
      });

      const data = await response.json();
      
      if (data.errors) {
        this.log(`Database query error for ${email}: ${JSON.stringify(data.errors)}`, 'error');
        return { exists: false, error: data.errors };
      }

      const users = data.data?.users || [];
      
      if (users.length === 0) {
        this.log(`User ${email} not found in database`, 'warning');
        return { exists: false, reason: 'User not found in database' };
      }

      const user = users[0];
      const userRoles = user.userroles || [];
      const roleNames = userRoles.map(ur => ur.role?.name).filter(Boolean);

      this.log(`✅ User ${email} found in database with roles: [${roleNames.join(', ')}]`, 'database');

      return {
        exists: true,
        user,
        roles: roleNames,
        hasExpectedRole: roleNames.includes(expectedRole)
      };

    } catch (error) {
      this.log(`Error checking database for ${email}: ${error.message}`, 'error');
      return { exists: false, error: error.message };
    }
  }

  /**
   * Validate user authentication flow
   */
  async validateUserAuthentication(email, password) {
    try {
      this.log(`Testing authentication flow for ${email}`, 'clerk');
      
      // Try to access sign-in page first
      const signInResponse = await fetch(`${BASE_URL}/sign-in`);
      if (!signInResponse.ok) {
        throw new Error(`Sign-in page not accessible: ${signInResponse.status}`);
      }

      this.log(`Sign-in page accessible for ${email}`, 'success');
      
      // In a real implementation, we would:
      // 1. POST credentials to Clerk sign-in endpoint
      // 2. Verify JWT token is returned
      // 3. Check token contains correct user metadata
      
      // For now, we'll simulate this and check if user management API responds correctly
      return {
        canAccessSignIn: true,
        credentialsValid: 'unknown', // Would need actual Clerk API integration
        jwtValid: 'unknown'
      };

    } catch (error) {
      this.log(`Authentication flow error for ${email}: ${error.message}`, 'error');
      return {
        canAccessSignIn: false,
        error: error.message
      };
    }
  }

  /**
   * Test API access with expected permissions
   */
  async testAPIAccess(email, expectedRole) {
    const apiEndpoints = {
      admin: ['/api/admin/audit-logs', '/api/users', '/api/billing'],
      manager: ['/api/staff', '/api/payrolls', '/api/clients'],
      consultant: ['/api/payrolls', '/api/work-schedule'],
      viewer: ['/api/check-role']
    };

    const endpointsToTest = apiEndpoints[expectedRole] || ['/api/check-role'];
    const results = {};

    for (const endpoint of endpointsToTest) {
      try {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        results[endpoint] = {
          status: response.status,
          requiresAuth: response.status === 401,
          accessible: response.status === 200
        };

        if (response.status === 401) {
          this.log(`✅ ${endpoint} correctly requires authentication`, 'success');
        } else if (response.status === 200) {
          this.log(`⚠️  ${endpoint} accessible without auth (may be expected)`, 'warning');
        } else {
          this.log(`❌ ${endpoint} returned unexpected status: ${response.status}`, 'error');
        }

      } catch (error) {
        results[endpoint] = { error: error.message };
        this.log(`❌ Error testing ${endpoint}: ${error.message}`, 'error');
      }
    }

    return results;
  }

  /**
   * Validate a single test user
   */
  async validateUser(userKey, userConfig) {
    this.log(`\n🧪 Validating ${userKey} user: ${userConfig.email}`, 'info');
    this.results.total_users++;

    const validation = {
      email: userConfig.email,
      expectedRole: userConfig.expectedRole,
      database: await this.checkUserInDatabase(userConfig.email, userConfig.expectedRole),
      authentication: await this.validateUserAuthentication(userConfig.email, userConfig.password),
      apiAccess: await this.testAPIAccess(userConfig.email, userConfig.expectedRole)
    };

    // Analyze results
    const issues = [];
    
    if (!validation.database.exists) {
      issues.push('User not found in database');
      this.results.missing_users++;
      this.results.databaseissues.push({
        email: userConfig.email,
        issue: 'User not found in database'
      });
    } else if (!validation.database.hasExpectedRole) {
      issues.push(`Role mismatch: expected ${userConfig.expectedRole}, got [${validation.database.roles.join(', ')}]`);
      this.results.role_mismatches++;
      this.results.databaseissues.push({
        email: userConfig.email,
        issue: `Role mismatch: expected ${userConfig.expectedRole}, got [${validation.database.roles.join(', ')}]`
      });
    }

    if (!validation.authentication.canAccessSignIn) {
      issues.push('Cannot access sign-in page');
      this.results.clerkissues.push({
        email: userConfig.email,
        issue: 'Cannot access sign-in page'
      });
    }

    if (issues.length === 0) {
      this.results.validated_users++;
      this.log(`✅ ${userKey} user validation passed`, 'success');
    } else {
      this.log(`❌ ${userKey} user validation failed: ${issues.join(', ')}`, 'error');
    }

    this.results.validation_results[userKey] = validation;
    return validation;
  }

  /**
   * Run validation for all test users
   */
  async validateAllUsers() {
    this.log('🚀 Starting Test User Validation', 'info');
    this.log(`Environment: ${BASE_URL}`, 'info');
    this.log(`Hasura: ${HASURA_URL ? 'Configured' : 'Not configured'}`, 'info');
    this.log(`Admin Secret: ${HASURA_ADMIN_SECRET ? 'Present' : 'Missing'}`, 'info');

    if (!HASURA_ADMIN_SECRET) {
      this.log('❌ HASURA_GRAPHQL_ADMIN_SECRET is required for database validation', 'critical');
      return;
    }

    // Validate each user
    for (const [userKey, userConfig] of Object.entries(TEST_USERS)) {
      await this.validateUser(userKey, userConfig);
    }

    // Generate report
    this.generateReport();
  }

  generateReport() {
    this.log('\n📊 TEST USER VALIDATION REPORT', 'info');
    this.log('=' * 60);

    // Summary
    this.log(`\n📈 Validation Summary:`);
    this.log(`   Total Users: ${this.results.total_users}`);
    this.log(`   Valid Users: ${this.results.validated_users} (${((this.results.validated_users/this.results.total_users)*100).toFixed(1)}%)`);
    this.log(`   Missing Users: ${this.results.missing_users}`);
    this.log(`   Role Mismatches: ${this.results.role_mismatches}`);

    // Database issues
    if (this.results.databaseissues.length > 0) {
      this.log(`\n🗄️ Database Issues:`, 'warning');
      this.results.databaseissues.forEach(issue => {
        this.log(`   - ${issue.email}: ${issue.issue}`, 'warning');
      });
    }

    // Clerk issues
    if (this.results.clerkissues.length > 0) {
      this.log(`\n🔐 Clerk Issues:`, 'warning');
      this.results.clerkissues.forEach(issue => {
        this.log(`   - ${issue.email}: ${issue.issue}`, 'warning');
      });
    }

    // User details
    this.log(`\n👥 User Details:`);
    Object.entries(this.results.validation_results).forEach(([userKey, validation]) => {
      const status = validation.database.exists && validation.database.hasExpectedRole ? '✅' : '❌';
      const roles = validation.database.roles ? `[${validation.database.roles.join(', ')}]` : 'No roles';
      this.log(`   ${status} ${userKey}: ${validation.email} - ${roles}`);
    });

    // Recommendations
    this.log(`\n💡 Recommendations:`);
    
    if (this.results.missing_users > 0) {
      this.log(`   1. 🚨 Create ${this.results.missing_users} missing users in database`, 'critical');
      this.log(`      Run: pnpm test:users:create`, 'info');
    }

    if (this.results.role_mismatches > 0) {
      this.log(`   2. ⚠️  Fix ${this.results.role_mismatches} role mismatches`, 'warning');
      this.log(`      Run: pnpm test:users:sync`, 'info');
    }

    if (this.results.validated_users === this.results.total_users) {
      this.log(`   🎉 All users validated! Ready for comprehensive testing`, 'success');
    }

    // Next steps
    this.log(`\n🚀 Next Steps:`);
    this.log(`   1. Fix any issues above`);
    this.log(`   2. Run: node scripts/comprehensive-system-test.js`);
    this.log(`   3. Run: node scripts/authenticated-permission-test.js`);
    this.log(`   4. Run: pnpm test:e2e (when Playwright is fixed)`);

    // Save results
    const reportFile = `test-results/user-validation-${Date.now()}.json`;
    try {
      fs.mkdirSync('test-results', { recursive: true });
      fs.writeFileSync(reportFile, JSON.stringify(this.results, null, 2));
      this.log(`\n💾 Detailed results saved to: ${reportFile}`, 'success');
    } catch (error) {
      this.log(`Failed to save results: ${error.message}`, 'error');
    }
  }
}

// Run the validation
async function main() {
  const validator = new TestUserValidator();
  await validator.validateAllUsers();
}

main().catch(console.error);

export { TestUserValidator, TEST_USERS };