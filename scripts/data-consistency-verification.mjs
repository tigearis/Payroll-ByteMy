#!/usr/bin/env node

/**
 * Data Consistency Verification
 * 
 * Phase 3.2: Comprehensive data consistency testing across all system layers:
 * - Database vs Hasura data integrity
 * - Materialized views consistency 
 * - Calculated fields validation
 * - Relationship consistency
 * - Audit trail completeness
 */

import fetch from 'node-fetch';
import { config } from 'dotenv';
import { Client } from 'pg';
import fs from 'fs';

// Load environment variables
config({ path: '.env.development.local' });

// Configuration
const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
const ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;
const DATABASE_URL = process.env.DATABASE_URL;

class DataConsistencyVerifier {
  constructor() {
    this.results = {
      databaseConnection: null,
      hasuraConnection: null,
      consistencyTests: {},
      materializedViews: {},
      calculatedFields: {},
      relationshipIntegrity: {},
      auditTrails: {},
      summary: {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        criticalIssues: [],
        warnings: []
      }
    };
    this.dbClient = null;
  }

  log(message, type = 'info') {
    const icons = {
      'info': '🔍',
      'success': '✅',
      'error': '❌',
      'warning': '⚠️',
      'critical': '🚨',
      'data': '📊'
    };
    console.log(`${icons[type]} ${message}`);
  }

  async initializeConnections() {
    this.log('🔌 Initializing database and Hasura connections');

    try {
      // Test Hasura connection
      const hasuraResponse = await fetch(HASURA_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': ADMIN_SECRET
        },
        body: JSON.stringify({
          query: 'query { __typename }'
        })
      });

      if (!hasuraResponse.ok) {
        throw new Error(`Hasura connection failed: ${hasuraResponse.status}`);
      }

      this.results.hasuraConnection = {
        status: 'connected',
        endpoint: HASURA_URL,
        timestamp: new Date().toISOString()
      };
      this.log('✅ Hasura connection established', 'success');

      // Test database connection
      this.dbClient = new Client({
        connectionString: DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
      });

      await this.dbClient.connect();
      const dbResult = await this.dbClient.query('SELECT NOW() as timestamp, version() as version');
      
      this.results.databaseConnection = {
        status: 'connected',
        timestamp: dbResult.rows[0].timestamp,
        version: dbResult.rows[0].version,
        url: DATABASE_URL.replace(/:[^:]*@/, ':***@') // Hide password
      };
      this.log('✅ Database connection established', 'success');

    } catch (error) {
      this.log(`❌ Connection failed: ${error.message}`, 'error');
      throw error;
    }
  }

  async executeHasuraQuery(query, variables = {}) {
    const response = await fetch(HASURA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': ADMIN_SECRET
      },
      body: JSON.stringify({ query, variables })
    });

    const result = await response.json();
    if (result.errors) {
      throw new Error(`Hasura query failed: ${result.errors[0]?.message}`);
    }

    return result.data;
  }

  async executeDbQuery(query, params = []) {
    const result = await this.dbClient.query(query, params);
    return result.rows;
  }

  async testTableCounts() {
    this.log('📊 Testing table count consistency between database and Hasura', 'data');
    
    const tables = [
      'users', 'clients', 'payrolls', 'roles', 'permissions',
      'user_roles', 'role_permissions', 'audit_logs', 'notes',
      'leave_requests', 'billing_items', 'time_entries'
    ];

    const consistencyResults = {};

    for (const table of tables) {
      try {
        // Get count from database
        const dbResult = await this.executeDbQuery(`SELECT COUNT(*) as count FROM ${table}`);
        const dbCount = parseInt(dbResult[0].count);

        // Get count from Hasura
        const hasuraResult = await this.executeHasuraQuery(`
          query GetTableCount {
            ${table}Aggregate {
              aggregate {
                count
              }
            }
          }
        `);

        const hasuraCount = hasuraResult[`${table}Aggregate`]?.aggregate?.count || 0;

        const isConsistent = dbCount === hasuraCount;
        consistencyResults[table] = {
          databaseCount: dbCount,
          hasuraCount: hasuraCount,
          consistent: isConsistent,
          difference: Math.abs(dbCount - hasuraCount)
        };

        if (isConsistent) {
          this.log(`  ✅ ${table}: ${dbCount} records (consistent)`);
          this.results.summary.passedTests++;
        } else {
          this.log(`  ❌ ${table}: DB=${dbCount}, Hasura=${hasuraCount} (diff: ${Math.abs(dbCount - hasuraCount)})`, 'error');
          this.results.summary.failedTests++;
          this.results.summary.criticalIssues.push({
            type: 'count_mismatch',
            table,
            details: `Database count (${dbCount}) != Hasura count (${hasuraCount})`
          });
        }

        this.results.summary.totalTests++;

      } catch (error) {
        this.log(`  ❌ ${table}: Error - ${error.message}`, 'error');
        consistencyResults[table] = {
          error: error.message,
          consistent: false
        };
        this.results.summary.failedTests++;
        this.results.summary.totalTests++;
      }
    }

    this.results.consistencyTests.tableCounts = consistencyResults;
  }

  async testMaterializedViews() {
    this.log('🔄 Testing materialized views consistency', 'data');

    try {
      // Get list of materialized views
      const mvQuery = `
        SELECT schemaname, matviewname, ispopulated 
        FROM pg_matviews 
        WHERE schemaname = 'public'
      `;
      const mvs = await this.executeDbQuery(mvQuery);

      const mvResults = {};

      for (const mv of mvs) {
        const mvName = mv.matviewname;
        
        try {
          // Check if materialized view is populated
          if (!mv.ispopulated) {
            mvResults[mvName] = {
              populated: false,
              error: 'Materialized view is not populated',
              consistent: false
            };
            this.log(`  ⚠️ ${mvName}: Not populated`, 'warning');
            this.results.summary.warnings.push({
              type: 'mv_not_populated',
              view: mvName
            });
            continue;
          }

          // Get count from materialized view
          const mvCount = await this.executeDbQuery(`SELECT COUNT(*) as count FROM ${mvName}`);
          const count = parseInt(mvCount[0].count);

          // Check if view has recent data (if it has timestamp columns)
          const timestampCheck = await this.executeDbQuery(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = $1 
            AND (column_name LIKE '%created%' OR column_name LIKE '%updated%' OR column_name LIKE '%timestamp%')
            LIMIT 1
          `, [mvName]);

          let lastUpdated = null;
          if (timestampCheck.length > 0) {
            const timestampCol = timestampCheck[0].column_name;
            const lastUpdateResult = await this.executeDbQuery(
              `SELECT MAX(${timestampCol}) as last_updated FROM ${mvName}`
            );
            lastUpdated = lastUpdateResult[0].last_updated;
          }

          mvResults[mvName] = {
            populated: true,
            recordCount: count,
            lastUpdated: lastUpdated,
            consistent: true
          };

          this.log(`  ✅ ${mvName}: ${count} records, last updated: ${lastUpdated || 'N/A'}`);
          this.results.summary.passedTests++;

        } catch (error) {
          mvResults[mvName] = {
            error: error.message,
            consistent: false
          };
          this.log(`  ❌ ${mvName}: Error - ${error.message}`, 'error');
          this.results.summary.failedTests++;
        }

        this.results.summary.totalTests++;
      }

      this.results.materializedViews = mvResults;

    } catch (error) {
      this.log(`❌ Materialized views test failed: ${error.message}`, 'error');
      this.results.materializedViews = { error: error.message };
    }
  }

  async testCalculatedFields() {
    this.log('🧮 Testing calculated fields accuracy', 'data');

    const calculatedFieldTests = {};

    try {
      // Test 1: User billing totals
      this.log('  Testing user billing calculations...');
      
      const billingCalcQuery = `
        SELECT 
          u.id,
          u.name,
          COUNT(bi.id) as billing_items_count,
          COALESCE(SUM(bi.amount), 0) as total_billed
        FROM users u
        LEFT JOIN billing_items bi ON u.id = bi.user_id
        WHERE u.is_staff = true
        GROUP BY u.id, u.name
        ORDER BY total_billed DESC
        LIMIT 5
      `;

      const dbBillingCalc = await this.executeDbQuery(billingCalcQuery);

      // Compare with Hasura aggregation
      const hasuraBillingQuery = `
        query GetUserBillingTotals {
          users(where: {isStaff: {_eq: true}}, limit: 5, orderBy: {billingItems: {amount: DESC}}) {
            id
            name
            billingItemsAggregate {
              aggregate {
                count
                sum {
                  amount
                }
              }
            }
          }
        }
      `;

      const hasuraBillingResult = await this.executeHasuraQuery(hasuraBillingQuery);

      let billingConsistent = true;
      const billingComparisons = [];

      dbBillingCalc.forEach(dbUser => {
        const hasuraUser = hasuraBillingResult.users.find(u => u.id === dbUser.id);
        if (hasuraUser) {
          const dbTotal = parseFloat(dbUser.total_billed) || 0;
          const hasuraTotal = parseFloat(hasuraBillingResult.users.find(u => u.id === dbUser.id)?.billingItemsAggregate?.aggregate?.sum?.amount) || 0;
          
          const consistent = Math.abs(dbTotal - hasuraTotal) < 0.01; // Allow for small floating point differences
          if (!consistent) billingConsistent = false;

          billingComparisons.push({
            userId: dbUser.id,
            userName: dbUser.name,
            dbTotal,
            hasuraTotal,
            consistent
          });
        }
      });

      calculatedFieldTests.billingTotals = {
        consistent: billingConsistent,
        comparisons: billingComparisons
      };

      if (billingConsistent) {
        this.log('  ✅ Billing calculations consistent');
        this.results.summary.passedTests++;
      } else {
        this.log('  ❌ Billing calculations inconsistent', 'error');
        this.results.summary.failedTests++;
      }

      // Test 2: Payroll staff counts
      this.log('  Testing payroll staff counts...');
      
      const payrollStaffQuery = `
        SELECT 
          p.id,
          p.name,
          COUNT(ps.id) as staff_count
        FROM payrolls p
        LEFT JOIN payroll_staff ps ON p.id = ps.payroll_id
        GROUP BY p.id, p.name
        ORDER BY staff_count DESC
        LIMIT 5
      `;

      const dbStaffCounts = await this.executeDbQuery(payrollStaffQuery);

      const hasuraStaffQuery = `
        query GetPayrollStaffCounts {
          payrolls(limit: 5, orderBy: {payrollStaff: {staffUser: {name: DESC}}}) {
            id
            name
            payrollStaffAggregate {
              aggregate {
                count
              }
            }
          }
        }
      `;

      const hasuraStaffResult = await this.executeHasuraQuery(hasuraStaffQuery);

      let staffConsistent = true;
      const staffComparisons = [];

      dbStaffCounts.forEach(dbPayroll => {
        const hasuraPayroll = hasuraStaffResult.payrolls.find(p => p.id === dbPayroll.id);
        if (hasuraPayroll) {
          const dbCount = parseInt(dbPayroll.staff_count);
          const hasuraCount = hasuraPayroll.payrollStaffAggregate.aggregate.count;
          
          const consistent = dbCount === hasuraCount;
          if (!consistent) staffConsistent = false;

          staffComparisons.push({
            payrollId: dbPayroll.id,
            payrollName: dbPayroll.name,
            dbCount,
            hasuraCount,
            consistent
          });
        }
      });

      calculatedFieldTests.staffCounts = {
        consistent: staffConsistent,
        comparisons: staffComparisons
      };

      if (staffConsistent) {
        this.log('  ✅ Staff count calculations consistent');
        this.results.summary.passedTests++;
      } else {
        this.log('  ❌ Staff count calculations inconsistent', 'error');
        this.results.summary.failedTests++;
      }

      this.results.summary.totalTests += 2;

    } catch (error) {
      this.log(`❌ Calculated fields test failed: ${error.message}`, 'error');
      calculatedFieldTests.error = error.message;
      this.results.summary.failedTests++;
      this.results.summary.totalTests++;
    }

    this.results.calculatedFields = calculatedFieldTests;
  }

  async testRelationshipIntegrity() {
    this.log('🔗 Testing relationship integrity', 'data');

    const relationshipTests = {};

    try {
      // Test 1: Orphaned records
      this.log('  Checking for orphaned records...');

      const orphanTests = [
        {
          name: 'payrolls_without_clients',
          query: `
            SELECT COUNT(*) as count 
            FROM payrolls p 
            LEFT JOIN clients c ON p.client_id = c.id 
            WHERE c.id IS NULL
          `
        },
        {
          name: 'users_with_invalid_managers',
          query: `
            SELECT COUNT(*) as count 
            FROM users u1 
            LEFT JOIN users u2 ON u1.manager_id = u2.id 
            WHERE u1.manager_id IS NOT NULL AND u2.id IS NULL
          `
        },
        {
          name: 'user_roles_without_users',
          query: `
            SELECT COUNT(*) as count 
            FROM user_roles ur 
            LEFT JOIN users u ON ur.user_id = u.id 
            WHERE u.id IS NULL
          `
        },
        {
          name: 'role_permissions_without_roles',
          query: `
            SELECT COUNT(*) as count 
            FROM role_permissions rp 
            LEFT JOIN roles r ON rp.role_id = r.id 
            WHERE r.id IS NULL
          `
        }
      ];

      for (const test of orphanTests) {
        const result = await this.executeDbQuery(test.query);
        const orphanCount = parseInt(result[0].count);

        relationshipTests[test.name] = {
          orphanCount,
          hasOrphans: orphanCount > 0
        };

        if (orphanCount === 0) {
          this.log(`  ✅ ${test.name}: No orphaned records`);
          this.results.summary.passedTests++;
        } else {
          this.log(`  ⚠️ ${test.name}: ${orphanCount} orphaned records`, 'warning');
          this.results.summary.warnings.push({
            type: 'orphaned_records',
            test: test.name,
            count: orphanCount
          });
          this.results.summary.failedTests++;
        }

        this.results.summary.totalTests++;
      }

      // Test 2: Circular references
      this.log('  Checking for circular manager references...');
      
      const circularQuery = `
        WITH RECURSIVE manager_chain AS (
          SELECT id, manager_id, name, 1 as level, ARRAY[id] as path
          FROM users
          WHERE manager_id IS NOT NULL
          
          UNION ALL
          
          SELECT u.id, u.manager_id, mc.name, mc.level + 1, mc.path || u.id
          FROM users u
          JOIN manager_chain mc ON u.id = mc.manager_id
          WHERE u.id = ANY(mc.path) AND mc.level < 10
        )
        SELECT COUNT(*) as circular_count
        FROM manager_chain
        WHERE level > 1
      `;

      const circularResult = await this.executeDbQuery(circularQuery);
      const circularCount = parseInt(circularResult[0].circular_count);

      relationshipTests.circular_manager_references = {
        circularCount,
        hasCircular: circularCount > 0
      };

      if (circularCount === 0) {
        this.log('  ✅ No circular manager references');
        this.results.summary.passedTests++;
      } else {
        this.log(`  ❌ ${circularCount} circular manager references found`, 'error');
        this.results.summary.criticalIssues.push({
          type: 'circular_references',
          count: circularCount
        });
        this.results.summary.failedTests++;
      }

      this.results.summary.totalTests++;

    } catch (error) {
      this.log(`❌ Relationship integrity test failed: ${error.message}`, 'error');
      relationshipTests.error = error.message;
      this.results.summary.failedTests++;
      this.results.summary.totalTests++;
    }

    this.results.relationshipIntegrity = relationshipTests;
  }

  async testAuditTrails() {
    this.log('📝 Testing audit trail completeness', 'data');

    const auditTests = {};

    try {
      // Test 1: Recent activity coverage
      this.log('  Checking audit log coverage for recent activities...');

      const recentActivitiesQuery = `
        SELECT 
          'users' as table_name,
          COUNT(*) as recent_changes
        FROM users 
        WHERE updated_at > NOW() - INTERVAL '7 days'
        
        UNION ALL
        
        SELECT 
          'clients' as table_name,
          COUNT(*) as recent_changes
        FROM clients 
        WHERE updated_at > NOW() - INTERVAL '7 days'
        
        UNION ALL
        
        SELECT 
          'payrolls' as table_name,
          COUNT(*) as recent_changes
        FROM payrolls 
        WHERE updated_at > NOW() - INTERVAL '7 days'
      `;

      const recentActivities = await this.executeDbQuery(recentActivitiesQuery);

      const auditCoverageQuery = `
        SELECT 
          resource,
          COUNT(*) as audit_entries
        FROM audit_logs 
        WHERE created_at > NOW() - INTERVAL '7 days'
        GROUP BY resource
      `;

      const auditCoverage = await this.executeDbQuery(auditCoverageQuery);

      const coverageAnalysis = {};
      let totalCoverage = 0;
      let totalActivities = 0;

      for (const activity of recentActivities) {
        const tableName = activity.table_name;
        const changes = parseInt(activity.recent_changes);
        const audits = auditCoverage.find(a => a.resource === tableName)?.audit_entries || 0;
        
        totalActivities += changes;
        totalCoverage += parseInt(audits);

        coverageAnalysis[tableName] = {
          recentChanges: changes,
          auditEntries: parseInt(audits),
          coverageRatio: changes > 0 ? (parseInt(audits) / changes * 100).toFixed(1) : 'N/A'
        };
      }

      const overallCoverage = totalActivities > 0 ? (totalCoverage / totalActivities * 100).toFixed(1) : 0;

      auditTests.auditCoverage = {
        overallCoverage: parseFloat(overallCoverage),
        tableAnalysis: coverageAnalysis,
        adequate: parseFloat(overallCoverage) >= 80
      };

      if (parseFloat(overallCoverage) >= 80) {
        this.log(`  ✅ Audit coverage: ${overallCoverage}% (adequate)`);
        this.results.summary.passedTests++;
      } else {
        this.log(`  ⚠️ Audit coverage: ${overallCoverage}% (below threshold)`, 'warning');
        this.results.summary.warnings.push({
          type: 'low_audit_coverage',
          coverage: parseFloat(overallCoverage)
        });
        this.results.summary.failedTests++;
      }

      // Test 2: Audit log integrity
      this.log('  Checking audit log data integrity...');

      const auditIntegrityQuery = `
        SELECT 
          COUNT(*) as total_logs,
          COUNT(CASE WHEN user_id IS NULL THEN 1 END) as missing_user_id,
          COUNT(CASE WHEN action IS NULL OR action = '' THEN 1 END) as missing_action,
          COUNT(CASE WHEN resource IS NULL OR resource = '' THEN 1 END) as missing_resource,
          COUNT(CASE WHEN created_at IS NULL THEN 1 END) as missing_timestamp
        FROM audit_logs
        WHERE created_at > NOW() - INTERVAL '30 days'
      `;

      const integrityResult = await this.executeDbQuery(auditIntegrityQuery);
      const integrity = integrityResult[0];

      const totalLogs = parseInt(integrity.total_logs);
      const missingFields = parseInt(integrity.missing_user_id) + 
                           parseInt(integrity.missing_action) + 
                           parseInt(integrity.missing_resource) + 
                           parseInt(integrity.missing_timestamp);

      const integrityScore = totalLogs > 0 ? ((totalLogs - missingFields) / totalLogs * 100).toFixed(1) : 100;

      auditTests.auditIntegrity = {
        totalLogs,
        missingFields,
        integrityScore: parseFloat(integrityScore),
        adequate: parseFloat(integrityScore) >= 95
      };

      if (parseFloat(integrityScore) >= 95) {
        this.log(`  ✅ Audit integrity: ${integrityScore}% (excellent)`);
        this.results.summary.passedTests++;
      } else {
        this.log(`  ⚠️ Audit integrity: ${integrityScore}% (missing ${missingFields} fields)`, 'warning');
        this.results.summary.warnings.push({
          type: 'audit_integrity_issues',
          score: parseFloat(integrityScore),
          missingFields
        });
        this.results.summary.failedTests++;
      }

      this.results.summary.totalTests += 2;

    } catch (error) {
      this.log(`❌ Audit trails test failed: ${error.message}`, 'error');
      auditTests.error = error.message;
      this.results.summary.failedTests++;
      this.results.summary.totalTests++;
    }

    this.results.auditTrails = auditTests;
  }

  async runAllConsistencyTests() {
    this.log('🚀 Starting Data Consistency Verification - Phase 3.2', 'info');
    this.log('=' .repeat(60));

    try {
      await this.initializeConnections();

      this.log('\n📊 Testing data consistency across system layers...');
      await this.testTableCounts();

      this.log('\n🔄 Testing materialized views...');
      await this.testMaterializedViews();

      this.log('\n🧮 Testing calculated fields...');
      await this.testCalculatedFields();

      this.log('\n🔗 Testing relationship integrity...');
      await this.testRelationshipIntegrity();

      this.log('\n📝 Testing audit trails...');
      await this.testAuditTrails();

      this.generateConsistencyReport();

    } catch (error) {
      this.log(`💥 Data consistency verification failed: ${error.message}`, 'error');
      throw error;
    } finally {
      if (this.dbClient) {
        await this.dbClient.end();
      }
    }
  }

  generateConsistencyReport() {
    this.log('\n📊 DATA CONSISTENCY VERIFICATION REPORT', 'info');
    this.log('=' .repeat(60));

    const { totalTests, passedTests, failedTests, criticalIssues, warnings } = this.results.summary;
    const successRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

    // Summary
    this.log(`\n📈 Test Summary:`);
    this.log(`   Total Tests: ${totalTests}`);
    this.log(`   Passed: ${passedTests} (${successRate}%)`);
    this.log(`   Failed: ${failedTests}`);
    this.log(`   Critical Issues: ${criticalIssues.length}`);
    this.log(`   Warnings: ${warnings.length}`);

    // Connection Status
    this.log(`\n🔌 Connection Status:`);
    this.log(`   Database: ${this.results.databaseConnection?.status || 'failed'}`);
    this.log(`   Hasura: ${this.results.hasuraConnection?.status || 'failed'}`);

    // Critical Issues
    if (criticalIssues.length > 0) {
      this.log(`\n🚨 Critical Issues:`, 'critical');
      criticalIssues.forEach((issue, index) => {
        this.log(`   ${index + 1}. ${issue.type}: ${issue.details || issue.count}`, 'error');
      });
    }

    // Warnings
    if (warnings.length > 0) {
      this.log(`\n⚠️ Warnings:`, 'warning');
      warnings.forEach((warning, index) => {
        this.log(`   ${index + 1}. ${warning.type}: ${warning.count || warning.coverage || 'Check required'}`, 'warning');
      });
    }

    // Detailed Results
    this.log(`\n📋 Detailed Results:`);
    
    // Table consistency
    if (this.results.consistencyTests.tableCounts) {
      const tables = Object.keys(this.results.consistencyTests.tableCounts);
      const consistentTables = tables.filter(t => this.results.consistencyTests.tableCounts[t].consistent);
      this.log(`   Table Counts: ${consistentTables.length}/${tables.length} consistent`);
    }

    // Materialized views
    if (this.results.materializedViews) {
      const mvs = Object.keys(this.results.materializedViews).filter(k => k !== 'error');
      const populatedMvs = mvs.filter(mv => this.results.materializedViews[mv].populated);
      this.log(`   Materialized Views: ${populatedMvs.length}/${mvs.length} populated`);
    }

    // Audit coverage
    if (this.results.auditTrails.auditCoverage) {
      this.log(`   Audit Coverage: ${this.results.auditTrails.auditCoverage.overallCoverage}%`);
    }

    // Final Assessment
    this.log(`\n🏆 Assessment:`);
    if (criticalIssues.length === 0 && successRate >= 90) {
      this.log(`   🎉 Excellent! Data consistency is maintained across all layers`);
      this.log(`   ✅ Phase 3.2: Data Consistency Verification - COMPLETED SUCCESSFULLY`);
    } else if (criticalIssues.length === 0 && successRate >= 70) {
      this.log(`   👍 Good! Minor consistency issues need attention`);
      this.log(`   ⚠️ Phase 3.2: Data Consistency Verification - COMPLETED WITH WARNINGS`);
    } else {
      this.log(`   ❌ Critical data consistency issues require immediate attention`);
      this.log(`   🚨 Phase 3.2: Data Consistency Verification - NEEDS IMMEDIATE REVIEW`);
    }

    // Recommendations
    this.log(`\n💡 Recommendations:`);
    if (criticalIssues.length > 0) {
      this.log(`   1. 🚨 URGENT: Resolve ${criticalIssues.length} critical data consistency issues`);
    }
    if (warnings.length > 0) {
      this.log(`   2. ⚠️ Address ${warnings.length} data quality warnings`);
    }
    this.log(`   3. 🔄 Set up automated data consistency monitoring`);
    this.log(`   4. 📊 Implement real-time data validation triggers`);
    this.log(`   5. 🧪 Schedule regular consistency verification runs`);

    // Save results
    const reportFile = `test-results/data-consistency-${Date.now()}.json`;
    try {
      fs.mkdirSync('test-results', { recursive: true });
      fs.writeFileSync(reportFile, JSON.stringify(this.results, null, 2));
      this.log(`\n💾 Detailed results saved to: ${reportFile}`, 'success');
    } catch (error) {
      this.log(`Failed to save results: ${error.message}`, 'error');
    }

    this.log('\n' + '=' .repeat(60));
  }
}

// Main execution
async function main() {
  console.log('🔍 Data Consistency Verification');
  console.log('Phase 3.2: Testing data integrity across all system layers\n');

  if (!HASURA_URL || !ADMIN_SECRET || !DATABASE_URL) {
    console.error('❌ Missing required environment variables');
    process.exit(1);
  }

  console.log('✅ Environment validated');
  console.log(`📡 Hasura endpoint: ${HASURA_URL}`);
  console.log(`🗄️ Database connection: ${DATABASE_URL.replace(/:[^:]*@/, ':***@')}\n`);

  const verifier = new DataConsistencyVerifier();
  await verifier.runAllConsistencyTests();
}

main().catch(error => {
  console.error('💥 Data consistency verification failed:', error);
  process.exit(1);
});