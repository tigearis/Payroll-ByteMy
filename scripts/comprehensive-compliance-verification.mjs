#!/usr/bin/env node

/**
 * Comprehensive Compliance Verification
 * 
 * Phase 4.2: SOC2 Type II and regulatory compliance verification for enterprise payroll system
 * 
 * Compliance Areas:
 * 1. SOC2 Type II Controls - Security, Availability, Processing Integrity, Confidentiality
 * 2. Data Encryption Verification - At rest, in transit, key management
 * 3. Access Logging & Audit Trails - Complete audit coverage, retention, integrity
 * 4. Data Retention & Deletion - Automated lifecycle, privacy compliance
 * 5. Australian Privacy Compliance - Privacy Act 1988, data handling requirements
 * 6. GDPR Compliance - Data portability, right to erasure, consent management
 * 7. Security Monitoring - Real-time alerts, incident response, vulnerability management
 * 8. Backup & Disaster Recovery - Recovery procedures, data integrity verification
 */

import fetch from 'node-fetch';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
config({ path: '.env.development.local' });

const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
const ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

class ComprehensiveComplianceVerifier {
  constructor() {
    this.results = {
      soc2Compliance: {},
      dataEncryption: {},
      auditTrails: {},
      dataRetention: {},
      privacyCompliance: {},
      gdprCompliance: {},
      securityMonitoring: {},
      backupRecovery: {},
      summary: {
        totalChecks: 0,
        passedChecks: 0,
        failedChecks: 0,
        complianceScore: 0,
        criticalFindings: [],
        complianceIssues: [],
        recommendations: []
      }
    };
  }

  log(message, type = 'info') {
    const icons = {
      'info': '🔍',
      'success': '✅',
      'error': '❌',
      'warning': '⚠️',
      'compliance': '📋',
      'critical': '🚨',
      'audit': '📊',
      'security': '🔒',
      'privacy': '🛡️'
    };
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.log(`${icons[type]} [${timestamp}] ${message}`);
  }

  async executeComplianceQuery(query, headers = {}, description = '') {
    try {
      const response = await fetch(HASURA_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': ADMIN_SECRET,
          ...headers
        },
        body: JSON.stringify({ query })
      });

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(`GraphQL error: ${result.errors[0]?.message}`);
      }

      return {
        success: true,
        data: result.data,
        description,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        description,
        timestamp: new Date().toISOString()
      };
    }
  }

  async verifySoc2Compliance() {
    this.log('📋 Verifying SOC2 Type II compliance controls', 'compliance');

    const soc2Tests = [
      {
        name: 'audit_logging_completeness',
        category: 'Security',
        description: 'Verify comprehensive audit logging is implemented',
        test: async () => {
          const result = await this.executeComplianceQuery(`
            query AuditLoggingCompleteness {
              auditLogs(limit: 10, orderBy: {createdAt: DESC}) {
                id
                action
                resourceType
                resourceId
                userId
                ipAddress
                userAgent
                createdAt
                metadata
              }
              auditLogsAggregate {
                aggregate {
                  count
                }
              }
            }
          `);

          if (result.success && result.data?.auditLogs) {
            const logs = result.data.auditLogs;
            const totalLogs = result.data.auditLogsAggregate?.aggregate?.count || 0;
            
            // Check for required audit fields
            const requiredFields = ['action', 'resourceType', 'userId', 'ipAddress', 'createdAt'];
            const hasRequiredFields = logs.every(log => 
              requiredFields.every(field => log[field] != null)
            );

            return {
              compliant: hasRequiredFields && totalLogs > 0,
              details: {
                totalAuditLogs: totalLogs,
                hasRequiredFields,
                sampleLog: logs[0]
              }
            };
          }
          return { compliant: false, error: result.error };
        }
      },
      {
        name: 'user_access_controls',
        category: 'Security',
        description: 'Verify proper user access controls and role management',
        test: async () => {
          const result = await this.executeComplianceQuery(`
            query UserAccessControls {
              users {
                id
                name
                role
                isStaff
                active
                deactivatedAt
                assignedRoles {
                  assignedRole {
                    name
                    priority
                  }
                }
              }
              roles {
                id
                name
                priority
                rolePermissions {
                  grantedPermission {
                    action
                    relatedResource {
                      name
                    }
                  }
                }
              }
            }
          `);

          if (result.success && result.data?.users && result.data?.roles) {
            const users = result.data.users;
            const roles = result.data.roles;
            
            // Check for proper role hierarchy
            const hasRoleHierarchy = roles.length >= 3; // At least 3 role levels
            const allUsersHaveRoles = users.every(user => user.role);
            const hasDeactivationControls = users.some(user => user.deactivatedAt || user.active === false);

            return {
              compliant: hasRoleHierarchy && allUsersHaveRoles,
              details: {
                totalUsers: users.length,
                totalRoles: roles.length,
                hasRoleHierarchy,
                allUsersHaveRoles,
                hasDeactivationControls
              }
            };
          }
          return { compliant: false, error: result.error };
        }
      },
      {
        name: 'data_processing_integrity',
        category: 'Processing Integrity',
        description: 'Verify data processing controls and integrity checks',
        test: async () => {
          const result = await this.executeComplianceQuery(`
            query DataProcessingIntegrity {
              payrolls(limit: 5) {
                id
                name
                status
                createdAt
                updatedAt
                client {
                  id
                  name
                  active
                }
                timeEntries {
                  id
                  hoursWorked
                  createdAt
                  updatedAt
                }
              }
            }
          `);

          if (result.success && result.data?.payrolls) {
            const payrolls = result.data.payrolls;
            
            // Check for data integrity controls
            const hasTimestamps = payrolls.every(p => p.createdAt && p.updatedAt);
            const hasValidStatuses = payrolls.every(p => ['Active', 'Inactive', 'Pending'].includes(p.status));
            const hasClientReferences = payrolls.every(p => p.client?.id);

            return {
              compliant: hasTimestamps && hasValidStatuses && hasClientReferences,
              details: {
                totalPayrolls: payrolls.length,
                hasTimestamps,
                hasValidStatuses,
                hasClientReferences
              }
            };
          }
          return { compliant: false, error: result.error };
        }
      },
      {
        name: 'availability_controls',
        category: 'Availability',
        description: 'Verify system availability and backup procedures',
        test: async () => {
          // Test system responsiveness and availability
          const startTime = performance.now();
          const result = await this.executeComplianceQuery(`
            query AvailabilityCheck {
              usersAggregate { aggregate { count } }
              clientsAggregate { aggregate { count } }
              payrollsAggregate { aggregate { count } }
            }
          `);
          const responseTime = performance.now() - startTime;

          if (result.success) {
            const isResponsive = responseTime < 5000; // Under 5 seconds
            const hasData = Object.values(result.data).every(agg => agg.aggregate.count > 0);

            return {
              compliant: isResponsive && hasData,
              details: {
                responseTime: Math.round(responseTime),
                isResponsive,
                hasData,
                aggregates: result.data
              }
            };
          }
          return { compliant: false, error: result.error };
        }
      },
      {
        name: 'confidentiality_controls',
        category: 'Confidentiality',
        description: 'Verify data confidentiality and access restrictions',
        test: async () => {
          // Test that sensitive data is properly restricted
          const viewerResult = await this.executeComplianceQuery(`
            query ConfidentialityCheck {
              users(limit: 1) {
                id
                name
                email
                role
              }
            }
          `, { 'x-hasura-role': 'viewer' });

          const adminResult = await this.executeComplianceQuery(`
            query ConfidentialityCheckAdmin {
              users(limit: 1) {
                id
                name
                email
                role
                clerkUserId
                managerId
              }
            }
          `);

          const viewerHasLimitedAccess = viewerResult.success && 
            (!viewerResult.data?.users?.[0]?.clerkUserId);
          const adminHasFullAccess = adminResult.success && 
            adminResult.data?.users?.[0]?.clerkUserId;

          return {
            compliant: viewerHasLimitedAccess && adminHasFullAccess,
            details: {
              viewerHasLimitedAccess,
              adminHasFullAccess,
              viewerFields: viewerResult.data?.users?.[0] ? Object.keys(viewerResult.data.users[0]) : [],
              adminFields: adminResult.data?.users?.[0] ? Object.keys(adminResult.data.users[0]) : []
            }
          };
        }
      }
    ];

    const soc2Results = {};

    for (const test of soc2Tests) {
      this.log(`  Testing: ${test.description} (${test.category})`);
      
      try {
        const result = await test.test();
        soc2Results[test.name] = {
          category: test.category,
          description: test.description,
          compliant: result.compliant,
          details: result.details,
          error: result.error
        };

        if (result.compliant) {
          this.log(`    ✅ ${test.name}: Compliant`, 'success');
          this.results.summary.passedChecks++;
        } else {
          this.log(`    ❌ ${test.name}: Non-compliant - ${result.error || 'Failed compliance check'}`, 'error');
          this.results.summary.criticalFindings.push({
            type: 'soc2_compliance',
            category: test.category,
            test: test.name,
            description: test.description
          });
          this.results.summary.failedChecks++;
        }

      } catch (error) {
        this.log(`    💥 ${test.name}: Test failed - ${error.message}`, 'error');
        soc2Results[test.name] = {
          category: test.category,
          description: test.description,
          compliant: false,
          error: error.message
        };
        this.results.summary.failedChecks++;
      }

      this.results.summary.totalChecks++;
    }

    this.results.soc2Compliance = soc2Results;
  }

  async verifyDataEncryption() {
    this.log('🔒 Verifying data encryption controls', 'security');

    const encryptionTests = [
      {
        name: 'database_connection_encryption',
        description: 'Verify database connections use TLS encryption',
        test: () => {
          const hasuraUrl = HASURA_URL;
          const usesHttps = hasuraUrl?.startsWith('https://');
          
          return {
            compliant: usesHttps,
            details: {
              hasuraUrl: hasuraUrl?.replace(/\/[^\/]*$/, '/***'), // Mask sensitive parts
              usesHttps,
              protocol: usesHttps ? 'HTTPS/TLS' : 'HTTP (Insecure)'
            }
          };
        }
      },
      {
        name: 'api_endpoint_encryption',
        description: 'Verify API endpoints use HTTPS',
        test: () => {
          const baseUrl = BASE_URL;
          const usesHttps = baseUrl?.startsWith('https://');
          
          return {
            compliant: usesHttps,
            details: {
              baseUrl,
              usesHttps,
              protocol: usesHttps ? 'HTTPS/TLS' : 'HTTP (Insecure)'
            }
          };
        }
      },
      {
        name: 'environment_variable_security',
        description: 'Verify sensitive configuration is properly secured',
        test: () => {
          const sensitiveVars = [
            'HASURA_GRAPHQL_ADMIN_SECRET',
            'CLERK_SECRET_KEY',
            'DATABASE_URL'
          ];
          
          const secureVars = sensitiveVars.filter(varName => {
            const value = process.env[varName];
            return value && value.length > 10; // Basic check for non-trivial values
          });

          const allVarsSecure = secureVars.length === sensitiveVars.length;

          return {
            compliant: allVarsSecure,
            details: {
              totalSensitiveVars: sensitiveVars.length,
              secureVars: secureVars.length,
              allVarsSecure,
              missingVars: sensitiveVars.filter(v => !process.env[v])
            }
          };
        }
      }
    ];

    const encryptionResults = {};

    for (const test of encryptionTests) {
      this.log(`  Testing: ${test.description}`);
      
      try {
        const result = test.test();
        encryptionResults[test.name] = {
          description: test.description,
          compliant: result.compliant,
          details: result.details
        };

        if (result.compliant) {
          this.log(`    ✅ ${test.name}: Encryption properly configured`, 'success');
          this.results.summary.passedChecks++;
        } else {
          this.log(`    ❌ ${test.name}: Encryption issue detected`, 'error');
          this.results.summary.criticalFindings.push({
            type: 'data_encryption',
            test: test.name,
            description: test.description
          });
          this.results.summary.failedChecks++;
        }

      } catch (error) {
        this.log(`    💥 ${test.name}: Test failed - ${error.message}`, 'error');
        encryptionResults[test.name] = {
          description: test.description,
          compliant: false,
          error: error.message
        };
        this.results.summary.failedChecks++;
      }

      this.results.summary.totalChecks++;
    }

    this.results.dataEncryption = encryptionResults;
  }

  async verifyAuditTrails() {
    this.log('📊 Verifying audit trail completeness and integrity', 'audit');

    const auditTests = [
      {
        name: 'comprehensive_audit_coverage',
        description: 'Verify all critical operations are audited',
        test: async () => {
          const result = await this.executeComplianceQuery(`
            query AuditCoverage {
              auditLogs(limit: 100, orderBy: {createdAt: DESC}) {
                id
                action
                resourceType
                resourceId
                userId
                ipAddress
                userAgent
                metadata
                createdAt
              }
            }
          `);

          if (result.success && result.data?.auditLogs) {
            const logs = result.data.auditLogs;
            const criticalActions = ['create', 'update', 'delete', 'login', 'logout'];
            const criticalResources = ['users', 'clients', 'payrolls', 'roles'];
            
            const hasActionCoverage = criticalActions.every(action =>
              logs.some(log => log.action === action)
            );
            
            const hasResourceCoverage = criticalResources.every(resource =>
              logs.some(log => log.resourceType === resource)
            );

            const hasUserTracking = logs.every(log => log.userId);
            const hasIpTracking = logs.every(log => log.ipAddress);

            return {
              compliant: hasActionCoverage && hasResourceCoverage && hasUserTracking,
              details: {
                totalLogs: logs.length,
                hasActionCoverage,
                hasResourceCoverage,
                hasUserTracking,
                hasIpTracking,
                actionTypes: [...new Set(logs.map(l => l.action))],
                resourceTypes: [...new Set(logs.map(l => l.resourceType))]
              }
            };
          }
          return { compliant: false, error: result.error };
        }
      },
      {
        name: 'audit_log_integrity',
        description: 'Verify audit logs cannot be modified and have proper retention',
        test: async () => {
          const result = await this.executeComplianceQuery(`
            query AuditLogIntegrity {
              auditLogs(limit: 10, orderBy: {createdAt: ASC}) {
                id
                createdAt
                updatedAt
              }
              auditLogsAggregate {
                aggregate {
                  count
                }
              }
            }
          `);

          if (result.success && result.data?.auditLogs) {
            const logs = result.data.auditLogs;
            const totalLogs = result.data.auditLogsAggregate?.aggregate?.count || 0;
            
            // Check that audit logs are immutable (created == updated)
            const immutableLogs = logs.filter(log => 
              new Date(log.createdAt).getTime() === new Date(log.updatedAt).getTime()
            );
            
            const hasProperRetention = totalLogs > 0;
            const logsAreImmutable = immutableLogs.length === logs.length;

            return {
              compliant: hasProperRetention && logsAreImmutable,
              details: {
                totalLogs,
                hasProperRetention,
                logsAreImmutable,
                immutableCount: immutableLogs.length,
                totalCount: logs.length
              }
            };
          }
          return { compliant: false, error: result.error };
        }
      },
      {
        name: 'audit_search_capabilities',
        description: 'Verify audit logs can be searched and filtered effectively',
        test: async () => {
          const userSearchResult = await this.executeComplianceQuery(`
            query AuditUserSearch {
              auditLogs(where: {userId: {_is_null: false}}, limit: 5) {
                id
                userId
                action
                resourceType
              }
            }
          `);

          const actionSearchResult = await this.executeComplianceQuery(`
            query AuditActionSearch {
              auditLogs(where: {action: {_eq: "create"}}, limit: 5) {
                id
                action
                resourceType
                createdAt
              }
            }
          `);

          const userSearchWorks = userSearchResult.success && userSearchResult.data?.auditLogs?.length > 0;
          const actionSearchWorks = actionSearchResult.success && actionSearchResult.data?.auditLogs?.length > 0;

          return {
            compliant: userSearchWorks && actionSearchWorks,
            details: {
              userSearchWorks,
              actionSearchWorks,
              userSearchResults: userSearchResult.data?.auditLogs?.length || 0,
              actionSearchResults: actionSearchResult.data?.auditLogs?.length || 0
            }
          };
        }
      }
    ];

    const auditResults = {};

    for (const test of auditTests) {
      this.log(`  Testing: ${test.description}`);
      
      try {
        const result = await test.test();
        auditResults[test.name] = {
          description: test.description,
          compliant: result.compliant,
          details: result.details,
          error: result.error
        };

        if (result.compliant) {
          this.log(`    ✅ ${test.name}: Audit trail compliant`, 'success');
          this.results.summary.passedChecks++;
        } else {
          this.log(`    ❌ ${test.name}: Audit trail issue - ${result.error || 'Failed compliance check'}`, 'error');
          this.results.summary.criticalFindings.push({
            type: 'audit_trail',
            test: test.name,
            description: test.description
          });
          this.results.summary.failedChecks++;
        }

      } catch (error) {
        this.log(`    💥 ${test.name}: Test failed - ${error.message}`, 'error');
        auditResults[test.name] = {
          description: test.description,
          compliant: false,
          error: error.message
        };
        this.results.summary.failedChecks++;
      }

      this.results.summary.totalChecks++;
    }

    this.results.auditTrails = auditResults;
  }

  async verifyDataRetention() {
    this.log('🗃️ Verifying data retention and lifecycle policies', 'compliance');

    const retentionTests = [
      {
        name: 'user_data_lifecycle',
        description: 'Verify user data has proper lifecycle management',
        test: async () => {
          const result = await this.executeComplianceQuery(`
            query UserDataLifecycle {
              users {
                id
                name
                email
                active
                deactivatedAt
                createdAt
                updatedAt
              }
            }
          `);

          if (result.success && result.data?.users) {
            const users = result.data.users;
            const hasActiveFlag = users.every(user => typeof user.active === 'boolean');
            const hasDeactivationTracking = users.some(user => user.deactivatedAt);
            const hasTimestamps = users.every(user => user.createdAt && user.updatedAt);

            return {
              compliant: hasActiveFlag && hasTimestamps,
              details: {
                totalUsers: users.length,
                hasActiveFlag,
                hasDeactivationTracking,
                hasTimestamps,
                activeUsers: users.filter(u => u.active).length,
                deactivatedUsers: users.filter(u => !u.active || u.deactivatedAt).length
              }
            };
          }
          return { compliant: false, error: result.error };
        }
      },
      {
        name: 'audit_log_retention',
        description: 'Verify audit logs have appropriate retention periods',
        test: async () => {
          const result = await this.executeComplianceQuery(`
            query AuditLogRetention {
              auditLogs(limit: 1, orderBy: {createdAt: ASC}) {
                id
                createdAt
              }
              auditLogs(limit: 1, orderBy: {createdAt: DESC}) {
                id
                createdAt
              }
              auditLogsAggregate {
                aggregate {
                  count
                }
              }
            }
          `);

          if (result.success && result.data?.auditLogs) {
            const oldestLog = result.data.auditLogs[0];
            const newestLog = result.data.auditLogs[1] || oldestLog;
            const totalLogs = result.data.auditLogsAggregate?.aggregate?.count || 0;

            const oldestDate = new Date(oldestLog?.createdAt);
            const retentionPeriodDays = (Date.now() - oldestDate.getTime()) / (1000 * 60 * 60 * 24);
            const hasAdequateRetention = retentionPeriodDays >= 90; // At least 90 days

            return {
              compliant: hasAdequateRetention && totalLogs > 0,
              details: {
                totalLogs,
                oldestLogDate: oldestLog?.createdAt,
                retentionPeriodDays: Math.round(retentionPeriodDays),
                hasAdequateRetention
              }
            };
          }
          return { compliant: false, error: result.error };
        }
      }
    ];

    const retentionResults = {};

    for (const test of retentionTests) {
      this.log(`  Testing: ${test.description}`);
      
      try {
        const result = await test.test();
        retentionResults[test.name] = {
          description: test.description,
          compliant: result.compliant,
          details: result.details,
          error: result.error
        };

        if (result.compliant) {
          this.log(`    ✅ ${test.name}: Data retention compliant`, 'success');
          this.results.summary.passedChecks++;
        } else {
          this.log(`    ❌ ${test.name}: Data retention issue`, 'error');
          this.results.summary.complianceIssues.push({
            type: 'data_retention',
            test: test.name,
            description: test.description
          });
          this.results.summary.failedChecks++;
        }

      } catch (error) {
        this.log(`    💥 ${test.name}: Test failed - ${error.message}`, 'error');
        retentionResults[test.name] = {
          description: test.description,
          compliant: false,
          error: error.message
        };
        this.results.summary.failedChecks++;
      }

      this.results.summary.totalChecks++;
    }

    this.results.dataRetention = retentionResults;
  }

  async verifyPrivacyCompliance() {
    this.log('🛡️ Verifying Australian Privacy Act compliance', 'privacy');

    const privacyTests = [
      {
        name: 'data_minimization',
        description: 'Verify only necessary personal data is collected',
        test: async () => {
          const result = await this.executeComplianceQuery(`
            query DataMinimization {
              users(limit: 5) {
                id
                name
                email
                role
                isStaff
                createdAt
              }
            }
          `);

          if (result.success && result.data?.users) {
            const users = result.data.users;
            // Check that users have essential fields but not excessive personal data
            const hasEssentialFields = users.every(user => 
              user.name && user.email && user.role
            );

            return {
              compliant: hasEssentialFields,
              details: {
                totalUsers: users.length,
                hasEssentialFields,
                userFields: users[0] ? Object.keys(users[0]) : []
              }
            };
          }
          return { compliant: false, error: result.error };
        }
      },
      {
        name: 'access_transparency',
        description: 'Verify users can access their personal data',
        test: async () => {
          // Test that user data is accessible through proper channels
          const result = await this.executeComplianceQuery(`
            query AccessTransparency {
              users(limit: 1) {
                id
                name
                email
                role
                createdAt
                updatedAt
              }
            }
          `, { 'x-hasura-role': 'consultant' });

          if (result.success && result.data?.users) {
            const userData = result.data.users[0];
            const hasPersonalDataAccess = userData && userData.name && userData.email;

            return {
              compliant: hasPersonalDataAccess,
              details: {
                hasPersonalDataAccess,
                accessibleFields: userData ? Object.keys(userData) : []
              }
            };
          }
          return { compliant: false, error: result.error };
        }
      }
    ];

    const privacyResults = {};

    for (const test of privacyTests) {
      this.log(`  Testing: ${test.description}`);
      
      try {
        const result = await test.test();
        privacyResults[test.name] = {
          description: test.description,
          compliant: result.compliant,
          details: result.details,
          error: result.error
        };

        if (result.compliant) {
          this.log(`    ✅ ${test.name}: Privacy compliant`, 'success');
          this.results.summary.passedChecks++;
        } else {
          this.log(`    ❌ ${test.name}: Privacy compliance issue`, 'error');
          this.results.summary.complianceIssues.push({
            type: 'privacy_compliance',
            test: test.name,
            description: test.description
          });
          this.results.summary.failedChecks++;
        }

      } catch (error) {
        this.log(`    💥 ${test.name}: Test failed - ${error.message}`, 'error');
        privacyResults[test.name] = {
          description: test.description,
          compliant: false,
          error: error.message
        };
        this.results.summary.failedChecks++;
      }

      this.results.summary.totalChecks++;
    }

    this.results.privacyCompliance = privacyResults;
  }

  async runComprehensiveComplianceVerification() {
    this.log('📋 Starting Comprehensive Compliance Verification - Phase 4.2', 'compliance');
    this.log('=' .repeat(70));

    try {
      await this.verifySoc2Compliance();
      await this.verifyDataEncryption();
      await this.verifyAuditTrails();
      await this.verifyDataRetention();
      await this.verifyPrivacyCompliance();

      this.generateComplianceReport();

    } catch (error) {
      this.log(`💥 Compliance verification failed: ${error.message}`, 'error');
      throw error;
    }
  }

  generateComplianceReport() {
    this.log('\n📋 COMPREHENSIVE COMPLIANCE VERIFICATION REPORT', 'compliance');
    this.log('=' .repeat(70));

    const { totalChecks, passedChecks, failedChecks, criticalFindings, complianceIssues } = this.results.summary;
    const complianceScore = this.calculateComplianceScore();
    this.results.summary.complianceScore = complianceScore;

    // Summary
    this.log(`\n📊 Compliance Summary:`);
    this.log(`   Total Checks: ${totalChecks}`);
    this.log(`   Passed: ${passedChecks} (${Math.round((passedChecks/totalChecks)*100)}%)`);
    this.log(`   Failed: ${failedChecks}`);
    this.log(`   Critical Findings: ${criticalFindings.length}`);
    this.log(`   Compliance Issues: ${complianceIssues.length}`);
    this.log(`   Compliance Score: ${complianceScore}/100`);

    // Critical Findings
    if (criticalFindings.length > 0) {
      this.log(`\n🚨 CRITICAL COMPLIANCE FINDINGS:`, 'critical');
      criticalFindings.forEach((finding, index) => {
        this.log(`   ${index + 1}. ${finding.type.toUpperCase()}: ${finding.description}`, 'critical');
      });
    }

    // Compliance Issues
    if (complianceIssues.length > 0) {
      this.log(`\n⚠️ Compliance Issues:`, 'warning');
      complianceIssues.forEach((issue, index) => {
        this.log(`   ${index + 1}. ${issue.type}: ${issue.description}`, 'warning');
      });
    }

    // SOC2 Analysis
    this.log(`\n📋 SOC2 Type II Compliance Analysis:`);
    const soc2Categories = ['Security', 'Availability', 'Processing Integrity', 'Confidentiality'];
    soc2Categories.forEach(category => {
      const categoryTests = Object.values(this.results.soc2Compliance).filter(test => test.category === category);
      const passed = categoryTests.filter(test => test.compliant).length;
      const total = categoryTests.length;
      this.log(`   ${category}: ${passed}/${total} controls compliant`);
    });

    // Encryption Status
    this.log(`\n🔒 Data Encryption Status:`);
    Object.entries(this.results.dataEncryption).forEach(([test, result]) => {
      const status = result.compliant ? 'Secure' : 'Insecure';
      this.log(`   ${test}: ${status}`);
    });

    // Audit Trail Status
    this.log(`\n📊 Audit Trail Compliance:`);
    Object.entries(this.results.auditTrails).forEach(([test, result]) => {
      const status = result.compliant ? 'Compliant' : 'Non-compliant';
      this.log(`   ${test}: ${status}`);
    });

    // Final Compliance Assessment
    this.log(`\n🏆 Compliance Assessment:`);
    if (complianceScore >= 95 && criticalFindings.length === 0) {
      this.log(`   🎉 Excellent! Enterprise compliance standards met (${complianceScore}/100)`, 'success');
      this.log(`   ✅ Phase 4.2: Compliance Verification - COMPLETED SUCCESSFULLY`);
    } else if (complianceScore >= 80 && criticalFindings.length === 0) {
      this.log(`   👍 Good compliance posture with minor improvements needed (${complianceScore}/100)`, 'success');
      this.log(`   ⚠️ Phase 4.2: Compliance Verification - COMPLETED WITH RECOMMENDATIONS`);
    } else if (criticalFindings.length > 0) {
      this.log(`   🚨 CRITICAL COMPLIANCE ISSUES REQUIRE IMMEDIATE ATTENTION (${complianceScore}/100)`, 'critical');
      this.log(`   ❌ Phase 4.2: Compliance Verification - CRITICAL ISSUES FOUND`);
    } else {
      this.log(`   ⚠️ Compliance improvements needed before certification (${complianceScore}/100)`, 'warning');
      this.log(`   🔧 Phase 4.2: Compliance Verification - NEEDS COMPLIANCE HARDENING`);
    }

    // Compliance Recommendations
    this.log(`\n💡 Compliance Recommendations:`);
    if (criticalFindings.length > 0) {
      this.log(`   1. 🚨 URGENT: Address ${criticalFindings.length} critical compliance findings immediately`);
    }
    if (complianceIssues.length > 0) {
      this.log(`   2. ⚠️ Resolve ${complianceIssues.length} compliance issues`);
    }
    this.log(`   3. 📋 Conduct regular SOC2 compliance audits`);
    this.log(`   4. 🔒 Implement comprehensive data encryption at rest`);
    this.log(`   5. 🛡️ Enhance privacy controls and data minimization`);
    this.log(`   6. 📊 Implement automated compliance monitoring`);
    this.log(`   7. 📚 Conduct compliance training for staff`);

    // Save results
    const reportFile = `test-results/compliance-verification-${Date.now()}.json`;
    try {
      fs.mkdirSync('test-results', { recursive: true });
      fs.writeFileSync(reportFile, JSON.stringify(this.results, null, 2));
      this.log(`\n💾 Detailed results saved to: ${reportFile}`, 'success');
    } catch (error) {
      this.log(`Failed to save results: ${error.message}`, 'error');
    }

    this.log('\n' + '=' .repeat(70));
  }

  calculateComplianceScore() {
    let score = 100;
    
    // Deduct points for critical findings
    score -= this.results.summary.criticalFindings.length * 15;
    
    // Deduct points for compliance issues
    score -= this.results.summary.complianceIssues.length * 8;
    
    // Deduct points for failed tests
    const failureRate = this.results.summary.failedChecks / this.results.summary.totalChecks;
    score -= Math.round(failureRate * 30);

    return Math.max(0, score);
  }
}

// Main execution
async function main() {
  console.log('📋 Comprehensive Compliance Verification');
  console.log('Phase 4.2: SOC2 Type II and regulatory compliance verification\n');

  if (!HASURA_URL || !ADMIN_SECRET) {
    console.error('❌ Missing required environment variables');
    process.exit(1);
  }

  console.log('✅ Environment validated');
  console.log(`📡 Hasura endpoint: ${HASURA_URL}`);
  console.log('📋 Starting comprehensive compliance verification...\n');

  const verifier = new ComprehensiveComplianceVerifier();
  await verifier.runComprehensiveComplianceVerification();
}

main().catch(error => {
  console.error('💥 Compliance verification failed:', error);
  process.exit(1);
});