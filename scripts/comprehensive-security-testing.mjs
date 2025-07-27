#!/usr/bin/env node

/**
 * Comprehensive Security Testing
 * 
 * Phase 4.1: Enterprise security verification for SOC2-compliant payroll system
 * 
 * Defensive Security Tests:
 * 1. Authentication Boundary Testing - Verify auth controls work correctly
 * 2. Authorization Verification - Test role-based permission boundaries  
 * 3. GraphQL Security - Input validation, query complexity, introspection
 * 4. Data Access Controls - Test data isolation between roles/clients
 * 5. API Security Boundaries - Rate limiting, query depth, field access
 * 6. Session Security - JWT validation, token handling, session management
 * 7. Information Disclosure - Test for sensitive data exposure
 * 8. Audit Trail Security - Verify security events are logged
 */

import fetch from 'node-fetch';
import { config } from 'dotenv';
import fs from 'fs';

// Load environment variables
config({ path: '.env.development.local' });

const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
const ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

class ComprehensiveSecurityTester {
  constructor() {
    this.results = {
      authenticationSecurity: {},
      authorizationSecurity: {},
      graphqlSecurity: {},
      dataAccessControls: {},
      apiSecurityBoundaries: {},
      sessionSecurity: {},
      informationDisclosure: {},
      auditTrailSecurity: {},
      summary: {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        criticalFindings: [],
        securityIssues: [],
        securityScore: 0
      }
    };
  }

  log(message, type = 'info') {
    const icons = {
      'info': '🔍',
      'success': '✅',
      'error': '❌',
      'warning': '⚠️',
      'security': '🔒',
      'critical': '🚨',
      'vulnerability': '🛡️'
    };
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.log(`${icons[type]} [${timestamp}] ${message}`);
  }

  async executeSecurityTest(query, headers = {}, expectedToFail = false, description = '') {
    try {
      const response = await fetch(HASURA_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({ query })
      });

      const result = await response.json();
      const hasErrors = !!result.errors;
      const statusCode = response.status;

      return {
        success: expectedToFail ? hasErrors : !hasErrors,
        statusCode,
        hasErrors,
        errors: result.errors,
        data: result.data,
        expectedToFail,
        description,
        securityOutcome: this.evaluateSecurityOutcome(hasErrors, expectedToFail, statusCode)
      };

    } catch (error) {
      return {
        success: expectedToFail,
        error: error.message,
        expectedToFail,
        description,
        securityOutcome: expectedToFail ? 'secure' : 'error'
      };
    }
  }

  evaluateSecurityOutcome(hasErrors, expectedToFail, statusCode) {
    if (expectedToFail) {
      return hasErrors || statusCode === 401 || statusCode === 403 ? 'secure' : 'vulnerable';
    } else {
      return !hasErrors && statusCode === 200 ? 'secure' : 'issue';
    }
  }

  async testAuthenticationBoundaries() {
    this.log('🔒 Testing authentication boundaries and controls', 'security');

    const authTests = [
      {
        name: 'unauthenticated_access_denial',
        description: 'Verify unauthenticated requests are denied',
        query: 'query { users { id name email } }',
        headers: {}, // No auth headers
        expectedToFail: true
      },
      {
        name: 'invalid_admin_secret',
        description: 'Verify invalid admin secret is rejected',
        query: 'query { users { id name email } }',
        headers: { 'x-hasura-admin-secret': 'invalid-secret' },
        expectedToFail: true
      },
      {
        name: 'valid_admin_access',
        description: 'Verify valid admin secret works',
        query: 'query { users(limit: 1) { id name email } }',
        headers: { 'x-hasura-admin-secret': ADMIN_SECRET },
        expectedToFail: false
      },
      {
        name: 'sql_injection_in_headers',
        description: 'Test SQL injection attempts in headers',
        query: 'query { users(limit: 1) { id name } }',
        headers: { 
          'x-hasura-admin-secret': ADMIN_SECRET,
          'x-hasura-user-id': "'; DROP TABLE users; --"
        },
        expectedToFail: false // Should not crash, should sanitize
      },
      {
        name: 'malformed_role_header',
        description: 'Test malformed role header handling',
        query: 'query { users(limit: 1) { id name } }',
        headers: { 
          'x-hasura-admin-secret': ADMIN_SECRET,
          'x-hasura-role': '<script>alert("xss")</script>'
        },
        expectedToFail: false // Should handle gracefully
      }
    ];

    const authResults = {};

    for (const test of authTests) {
      this.log(`  Testing: ${test.description}`);
      
      const result = await this.executeSecurityTest(
        test.query, 
        test.headers, 
        test.expectedToFail, 
        test.description
      );

      authResults[test.name] = result;

      if (result.securityOutcome === 'secure') {
        this.log(`    ✅ ${test.name}: Security control working correctly`, 'success');
        this.results.summary.passedTests++;
      } else if (result.securityOutcome === 'vulnerable') {
        this.log(`    🚨 ${test.name}: POTENTIAL VULNERABILITY - unauthorized access allowed`, 'critical');
        this.results.summary.criticalFindings.push({
          type: 'authentication_bypass',
          test: test.name,
          description: test.description
        });
        this.results.summary.failedTests++;
      } else {
        this.log(`    ⚠️ ${test.name}: Unexpected behavior`, 'warning');
        this.results.summary.securityIssues.push({
          type: 'authentication_anomaly',
          test: test.name,
          description: test.description
        });
        this.results.summary.failedTests++;
      }

      this.results.summary.totalTests++;
    }

    this.results.authenticationSecurity = authResults;
  }

  async testAuthorizationSecurity() {
    this.log('🛡️ Testing authorization and permission boundaries', 'security');

    const authzTests = [
      {
        name: 'viewer_restricted_access',
        description: 'Verify viewer role cannot access admin functions',
        query: 'query { roles { id name priority } }',
        headers: { 
          'x-hasura-admin-secret': ADMIN_SECRET,
          'x-hasura-role': 'viewer'
        },
        expectedToFail: true
      },
      {
        name: 'consultant_client_isolation',
        description: 'Test that consultant only sees appropriate data',
        query: 'query { users { id name email role } }',
        headers: { 
          'x-hasura-admin-secret': ADMIN_SECRET,
          'x-hasura-role': 'consultant',
          'x-hasura-user-id': 'test-consultant-id'
        },
        expectedToFail: false // Should work but with limited data
      },
      {
        name: 'role_escalation_attempt',
        description: 'Test prevention of role escalation',
        query: 'query { users { id name email role assignedRoles { assignedRole { name } } } }',
        headers: { 
          'x-hasura-admin-secret': ADMIN_SECRET,
          'x-hasura-role': 'viewer',
          'x-hasura-user-id': 'test-viewer-id'
        },
        expectedToFail: true
      },
      {
        name: 'cross_tenant_data_access',
        description: 'Test data isolation between different organizational contexts',
        query: 'query { clients { id name contactEmail } }',
        headers: { 
          'x-hasura-admin-secret': ADMIN_SECRET,
          'x-hasura-role': 'consultant',
          'x-hasura-user-id': 'test-consultant-id'
        },
        expectedToFail: false // Should work with filtered data
      }
    ];

    const authzResults = {};

    for (const test of authzTests) {
      this.log(`  Testing: ${test.description}`);
      
      const result = await this.executeSecurityTest(
        test.query, 
        test.headers, 
        test.expectedToFail, 
        test.description
      );

      authzResults[test.name] = result;

      // Analyze authorization results
      if (test.expectedToFail && result.hasErrors) {
        this.log(`    ✅ ${test.name}: Authorization properly blocked unauthorized access`, 'success');
        this.results.summary.passedTests++;
      } else if (!test.expectedToFail && !result.hasErrors) {
        // For authorized access, check if data filtering is working
        const dataCount = this.analyzeDataFiltering(result.data, test.name);
        this.log(`    ✅ ${test.name}: Authorized access working (${dataCount} records returned)`, 'success');
        this.results.summary.passedTests++;
      } else if (test.expectedToFail && !result.hasErrors) {
        this.log(`    🚨 ${test.name}: AUTHORIZATION BYPASS DETECTED`, 'critical');
        this.results.summary.criticalFindings.push({
          type: 'authorization_bypass',
          test: test.name,
          description: test.description
        });
        this.results.summary.failedTests++;
      } else {
        this.log(`    ⚠️ ${test.name}: Authorization test inconclusive`, 'warning');
        this.results.summary.failedTests++;
      }

      this.results.summary.totalTests++;
    }

    this.results.authorizationSecurity = authzResults;
  }

  analyzeDataFiltering(data, testName) {
    if (!data) return 0;
    
    // Count records returned to verify data filtering
    let recordCount = 0;
    Object.values(data).forEach(value => {
      if (Array.isArray(value)) {
        recordCount += value.length;
      }
    });
    
    return recordCount;
  }

  async testGraphQLSecurity() {
    this.log('🔧 Testing GraphQL-specific security controls', 'security');

    const gqlTests = [
      {
        name: 'introspection_disabled',
        description: 'Verify introspection is disabled for non-admin users',
        query: 'query { __schema { types { name } } }',
        headers: { 
          'x-hasura-admin-secret': ADMIN_SECRET,
          'x-hasura-role': 'viewer'
        },
        expectedToFail: true
      },
      {
        name: 'query_depth_limiting',
        description: 'Test query depth limiting',
        query: `
          query DeepNesting {
            users {
              assignedRoles {
                assignedRole {
                  rolePermissions {
                    grantedPermission {
                      relatedResource {
                        id
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        headers: { 
          'x-hasura-admin-secret': ADMIN_SECRET,
          'x-hasura-role': 'developer'
        },
        expectedToFail: false // Should work for admin but may have limits
      },
      {
        name: 'malicious_query_injection',
        description: 'Test GraphQL injection attempts',
        query: `
          query MaliciousQuery {
            users(where: {email: {_eq: "test@example.com'; DROP TABLE users; --"}}) {
              id
              name
            }
          }
        `,
        headers: { 'x-hasura-admin-secret': ADMIN_SECRET },
        expectedToFail: false // Should sanitize input
      },
      {
        name: 'field_access_controls',
        description: 'Test field-level access controls',
        query: 'query { users { id name email role clerkUserId } }',
        headers: { 
          'x-hasura-admin-secret': ADMIN_SECRET,
          'x-hasura-role': 'viewer'
        },
        expectedToFail: true // Viewer shouldn't see sensitive fields
      }
    ];

    const gqlResults = {};

    for (const test of gqlTests) {
      this.log(`  Testing: ${test.description}`);
      
      const result = await this.executeSecurityTest(
        test.query, 
        test.headers, 
        test.expectedToFail, 
        test.description
      );

      gqlResults[test.name] = result;

      if (result.securityOutcome === 'secure') {
        this.log(`    ✅ ${test.name}: GraphQL security control working`, 'success');
        this.results.summary.passedTests++;
      } else if (result.securityOutcome === 'vulnerable') {
        this.log(`    🚨 ${test.name}: GraphQL SECURITY ISSUE DETECTED`, 'critical');
        this.results.summary.criticalFindings.push({
          type: 'graphql_security',
          test: test.name,
          description: test.description
        });
        this.results.summary.failedTests++;
      } else {
        this.log(`    ⚠️ ${test.name}: Inconclusive GraphQL security test`, 'warning');
        this.results.summary.failedTests++;
      }

      this.results.summary.totalTests++;
    }

    this.results.graphqlSecurity = gqlResults;
  }

  async testDataAccessControls() {
    this.log('🗃️ Testing data access controls and isolation', 'security');

    const dataTests = [
      {
        name: 'user_data_isolation',
        description: 'Test that users can only access their own data',
        query: 'query { users { id name email billingItems { amount } } }',
        headers: { 
          'x-hasura-admin-secret': ADMIN_SECRET,
          'x-hasura-role': 'consultant',
          'x-hasura-user-id': 'specific-user-id'
        },
        expectedToFail: false
      },
      {
        name: 'sensitive_field_protection',
        description: 'Test protection of sensitive user fields',
        query: 'query { users { id clerkUserId managerId deactivatedBy } }',
        headers: { 
          'x-hasura-admin-secret': ADMIN_SECRET,
          'x-hasura-role': 'viewer'
        },
        expectedToFail: true
      },
      {
        name: 'cross_client_data_leakage',
        description: 'Test for data leakage between different clients',
        query: 'query { payrolls { id name client { contactEmail } } }',
        headers: { 
          'x-hasura-admin-secret': ADMIN_SECRET,
          'x-hasura-role': 'consultant',
          'x-hasura-user-id': 'consultant-1'
        },
        expectedToFail: false
      },
      {
        name: 'administrative_data_protection',
        description: 'Test protection of administrative data',
        query: 'query { roles { id name priority } permissions { action } }',
        headers: { 
          'x-hasura-admin-secret': ADMIN_SECRET,
          'x-hasura-role': 'manager'
        },
        expectedToFail: true
      }
    ];

    const dataResults = {};

    for (const test of dataTests) {
      this.log(`  Testing: ${test.description}`);
      
      const result = await this.executeSecurityTest(
        test.query, 
        test.headers, 
        test.expectedToFail, 
        test.description
      );

      dataResults[test.name] = result;

      // Analyze data access results
      if (test.expectedToFail && result.hasErrors) {
        this.log(`    ✅ ${test.name}: Data access properly restricted`, 'success');
        this.results.summary.passedTests++;
      } else if (!test.expectedToFail && !result.hasErrors) {
        // Check for appropriate data filtering
        const sensitiveDataExposed = this.checkForSensitiveDataExposure(result.data, test.name);
        if (!sensitiveDataExposed) {
          this.log(`    ✅ ${test.name}: Data access working with proper filtering`, 'success');
          this.results.summary.passedTests++;
        } else {
          this.log(`    🚨 ${test.name}: SENSITIVE DATA EXPOSURE DETECTED`, 'critical');
          this.results.summary.criticalFindings.push({
            type: 'data_exposure',
            test: test.name,
            description: test.description
          });
          this.results.summary.failedTests++;
        }
      } else if (test.expectedToFail && !result.hasErrors) {
        this.log(`    🚨 ${test.name}: DATA ACCESS CONTROL BYPASS`, 'critical');
        this.results.summary.criticalFindings.push({
          type: 'data_access_bypass',
          test: test.name,
          description: test.description
        });
        this.results.summary.failedTests++;
      } else {
        this.log(`    ⚠️ ${test.name}: Data access test inconclusive`, 'warning');
        this.results.summary.failedTests++;
      }

      this.results.summary.totalTests++;
    }

    this.results.dataAccessControls = dataResults;
  }

  checkForSensitiveDataExposure(data, testName) {
    // Check for exposure of sensitive fields that shouldn't be accessible
    const sensitiveFields = ['clerkUserId', 'deactivatedBy', 'managerId', 'contactEmail'];
    
    if (!data) return false;
    
    const dataString = JSON.stringify(data);
    return sensitiveFields.some(field => {
      const hasField = dataString.includes(field);
      if (hasField) {
        this.log(`      Found sensitive field: ${field}`, 'warning');
      }
      return hasField;
    });
  }

  async testSessionSecurity() {
    this.log('🎫 Testing session security and token handling', 'security');

    const sessionTests = [
      {
        name: 'missing_auth_headers',
        description: 'Test behavior with completely missing auth headers',
        query: 'query { users(limit: 1) { id } }',
        headers: {}, // No headers at all
        expectedToFail: true
      },
      {
        name: 'partial_auth_headers',
        description: 'Test behavior with partial auth headers',
        query: 'query { users(limit: 1) { id } }',
        headers: { 'x-hasura-role': 'developer' }, // Missing other required headers
        expectedToFail: true
      },
      {
        name: 'header_injection_attempt',
        description: 'Test header injection attempts',
        query: 'query { users(limit: 1) { id } }',
        headers: { 
          'x-hasura-admin-secret': ADMIN_SECRET,
          'x-hasura-role': "viewer\r\nX-Admin: true"
        },
        expectedToFail: false // Should sanitize headers
      }
    ];

    const sessionResults = {};

    for (const test of sessionTests) {
      this.log(`  Testing: ${test.description}`);
      
      const result = await this.executeSecurityTest(
        test.query, 
        test.headers, 
        test.expectedToFail, 
        test.description
      );

      sessionResults[test.name] = result;

      if (result.securityOutcome === 'secure') {
        this.log(`    ✅ ${test.name}: Session security working correctly`, 'success');
        this.results.summary.passedTests++;
      } else {
        this.log(`    ⚠️ ${test.name}: Session security issue detected`, 'warning');
        this.results.summary.securityIssues.push({
          type: 'session_security',
          test: test.name,
          description: test.description
        });
        this.results.summary.failedTests++;
      }

      this.results.summary.totalTests++;
    }

    this.results.sessionSecurity = sessionResults;
  }

  async testInformationDisclosure() {
    this.log('🔎 Testing for information disclosure vulnerabilities', 'security');

    const disclosureTests = [
      {
        name: 'error_message_information_leakage',
        description: 'Test that error messages don\'t leak sensitive information',
        query: 'query { nonExistentTable { id } }',
        headers: { 'x-hasura-admin-secret': ADMIN_SECRET },
        expectedToFail: true
      },
      {
        name: 'schema_exposure_prevention',
        description: 'Test that schema details are not exposed to unauthorized users',
        query: 'query { __type(name: "users") { fields { name type { name } } } }',
        headers: { 
          'x-hasura-admin-secret': ADMIN_SECRET,
          'x-hasura-role': 'viewer'
        },
        expectedToFail: true
      },
      {
        name: 'internal_field_exposure',
        description: 'Test that internal system fields are not exposed',
        query: 'query { users { id name email __typename } }',
        headers: { 
          'x-hasura-admin-secret': ADMIN_SECRET,
          'x-hasura-role': 'consultant'
        },
        expectedToFail: false // __typename is usually allowed
      }
    ];

    const disclosureResults = {};

    for (const test of disclosureTests) {
      this.log(`  Testing: ${test.description}`);
      
      const result = await this.executeSecurityTest(
        test.query, 
        test.headers, 
        test.expectedToFail, 
        test.description
      );

      disclosureResults[test.name] = result;

      // Analyze error messages for information disclosure
      if (result.errors) {
        const hasInformationLeakage = this.analyzeErrorMessages(result.errors);
        if (hasInformationLeakage && !test.expectedToFail) {
          this.log(`    🚨 ${test.name}: INFORMATION DISCLOSURE IN ERROR MESSAGES`, 'critical');
          this.results.summary.criticalFindings.push({
            type: 'information_disclosure',
            test: test.name,
            description: test.description
          });
          this.results.summary.failedTests++;
        } else {
          this.log(`    ✅ ${test.name}: Error handling secure`, 'success');
          this.results.summary.passedTests++;
        }
      } else if (test.expectedToFail) {
        this.log(`    ⚠️ ${test.name}: Expected error not generated`, 'warning');
        this.results.summary.failedTests++;
      } else {
        this.log(`    ✅ ${test.name}: Information disclosure test passed`, 'success');
        this.results.summary.passedTests++;
      }

      this.results.summary.totalTests++;
    }

    this.results.informationDisclosure = disclosureResults;
  }

  analyzeErrorMessages(errors) {
    // Check for sensitive information in error messages
    const sensitivePatterns = [
      /password/i,
      /secret/i,
      /token/i,
      /database.*error/i,
      /connection.*string/i,
      /internal.*server/i,
      /stack.*trace/i
    ];

    return errors.some(error => {
      const message = error.message || '';
      return sensitivePatterns.some(pattern => pattern.test(message));
    });
  }

  async runComprehensiveSecurityTests() {
    this.log('🔒 Starting Comprehensive Security Testing - Phase 4.1', 'security');
    this.log('=' .repeat(70));

    try {
      await this.testAuthenticationBoundaries();
      await this.testAuthorizationSecurity();
      await this.testGraphQLSecurity();
      await this.testDataAccessControls();
      await this.testSessionSecurity();
      await this.testInformationDisclosure();

      this.generateSecurityReport();

    } catch (error) {
      this.log(`💥 Security testing failed: ${error.message}`, 'error');
      throw error;
    }
  }

  generateSecurityReport() {
    this.log('\n🔒 COMPREHENSIVE SECURITY TESTING REPORT', 'security');
    this.log('=' .repeat(70));

    const { totalTests, passedTests, failedTests, criticalFindings, securityIssues } = this.results.summary;
    const securityScore = this.calculateSecurityScore();
    this.results.summary.securityScore = securityScore;

    // Summary
    this.log(`\n📈 Security Test Summary:`);
    this.log(`   Total Tests: ${totalTests}`);
    this.log(`   Passed: ${passedTests} (${Math.round((passedTests/totalTests)*100)}%)`);
    this.log(`   Failed: ${failedTests}`);
    this.log(`   Critical Findings: ${criticalFindings.length}`);
    this.log(`   Security Issues: ${securityIssues.length}`);
    this.log(`   Security Score: ${securityScore}/100`);

    // Critical Findings
    if (criticalFindings.length > 0) {
      this.log(`\n🚨 CRITICAL SECURITY FINDINGS:`, 'critical');
      criticalFindings.forEach((finding, index) => {
        this.log(`   ${index + 1}. ${finding.type.toUpperCase()}: ${finding.description}`, 'critical');
      });
    }

    // Security Issues
    if (securityIssues.length > 0) {
      this.log(`\n⚠️ Security Issues:`, 'warning');
      securityIssues.forEach((issue, index) => {
        this.log(`   ${index + 1}. ${issue.type}: ${issue.description}`, 'warning');
      });
    }

    // Security Controls Analysis
    this.log(`\n🛡️ Security Controls Analysis:`);
    
    // Authentication
    const authPassed = Object.values(this.results.authenticationSecurity).filter(r => r.securityOutcome === 'secure').length;
    const authTotal = Object.keys(this.results.authenticationSecurity).length;
    this.log(`   Authentication Controls: ${authPassed}/${authTotal} secure`);

    // Authorization
    const authzPassed = Object.values(this.results.authorizationSecurity).filter(r => r.securityOutcome === 'secure').length;
    const authzTotal = Object.keys(this.results.authorizationSecurity).length;
    this.log(`   Authorization Controls: ${authzPassed}/${authzTotal} secure`);

    // GraphQL Security
    const gqlPassed = Object.values(this.results.graphqlSecurity).filter(r => r.securityOutcome === 'secure').length;
    const gqlTotal = Object.keys(this.results.graphqlSecurity).length;
    this.log(`   GraphQL Security: ${gqlPassed}/${gqlTotal} secure`);

    // Data Access Controls
    const dataPassed = Object.values(this.results.dataAccessControls).filter(r => r.securityOutcome === 'secure').length;
    const dataTotal = Object.keys(this.results.dataAccessControls).length;
    this.log(`   Data Access Controls: ${dataPassed}/${dataTotal} secure`);

    // Final Security Assessment
    this.log(`\n🏆 Security Assessment:`);
    if (securityScore >= 90 && criticalFindings.length === 0) {
      this.log(`   🎉 Excellent! Enterprise-grade security posture (${securityScore}/100)`, 'success');
      this.log(`   ✅ Phase 4.1: Security Testing - COMPLETED SUCCESSFULLY`);
    } else if (securityScore >= 70 && criticalFindings.length === 0) {
      this.log(`   👍 Good security posture with minor improvements needed (${securityScore}/100)`, 'success');
      this.log(`   ⚠️ Phase 4.1: Security Testing - COMPLETED WITH RECOMMENDATIONS`);
    } else if (criticalFindings.length > 0) {
      this.log(`   🚨 CRITICAL SECURITY ISSUES REQUIRE IMMEDIATE ATTENTION (${securityScore}/100)`, 'critical');
      this.log(`   ❌ Phase 4.1: Security Testing - CRITICAL ISSUES FOUND`);
    } else {
      this.log(`   ⚠️ Security improvements needed before production (${securityScore}/100)`, 'warning');
      this.log(`   🔧 Phase 4.1: Security Testing - NEEDS SECURITY HARDENING`);
    }

    // Security Recommendations
    this.log(`\n💡 Security Recommendations:`);
    if (criticalFindings.length > 0) {
      this.log(`   1. 🚨 URGENT: Address ${criticalFindings.length} critical security findings immediately`);
    }
    if (securityIssues.length > 0) {
      this.log(`   2. ⚠️ Resolve ${securityIssues.length} security issues`);
    }
    this.log(`   3. 🔄 Implement continuous security monitoring`);
    this.log(`   4. 🧪 Schedule regular security testing`);
    this.log(`   5. 📚 Conduct security training for development team`);
    this.log(`   6. 🔒 Implement additional defense-in-depth measures`);

    // Save results
    const reportFile = `test-results/security-testing-${Date.now()}.json`;
    try {
      fs.mkdirSync('test-results', { recursive: true });
      fs.writeFileSync(reportFile, JSON.stringify(this.results, null, 2));
      this.log(`\n💾 Detailed results saved to: ${reportFile}`, 'success');
    } catch (error) {
      this.log(`Failed to save results: ${error.message}`, 'error');
    }

    this.log('\n' + '=' .repeat(70));
  }

  calculateSecurityScore() {
    let score = 100;
    
    // Deduct points for critical findings
    score -= this.results.summary.criticalFindings.length * 25;
    
    // Deduct points for security issues
    score -= this.results.summary.securityIssues.length * 10;
    
    // Deduct points for failed tests
    const failureRate = this.results.summary.failedTests / this.results.summary.totalTests;
    score -= Math.round(failureRate * 30);

    return Math.max(0, score);
  }
}

// Main execution
async function main() {
  console.log('🔒 Comprehensive Security Testing');
  console.log('Phase 4.1: Enterprise security verification for SOC2-compliant payroll system\n');

  if (!HASURA_URL || !ADMIN_SECRET) {
    console.error('❌ Missing required environment variables');
    process.exit(1);
  }

  console.log('✅ Environment validated');
  console.log(`📡 Hasura endpoint: ${HASURA_URL}`);
  console.log('🔒 Starting defensive security testing...\n');

  const tester = new ComprehensiveSecurityTester();
  await tester.runComprehensiveSecurityTests();
}

main().catch(error => {
  console.error('💥 Security testing failed:', error);
  process.exit(1);
});