#!/usr/bin/env node

/**
 * Comprehensive Feature Completeness Analysis
 * 
 * Phase 5.2: Analyze feature completeness and identify missing functionality
 * 
 * Analysis Areas:
 * 1. Core Payroll Features - Complete payroll processing workflow verification
 * 2. User Management - Role-based access, user lifecycle, permissions
 * 3. Client Management - CRM features, client onboarding, relationship tracking
 * 4. Billing & Invoicing - Complete billing workflow, payment tracking
 * 5. Leave Management - Leave requests, approvals, accrual tracking
 * 6. Work Scheduling - Staff scheduling, capacity planning, skills management
 * 7. Audit & Compliance - Audit trails, reporting, compliance features
 * 8. Email System - Template management, communication workflows
 * 9. External Integrations - Third-party system connections
 * 10. AI Assistant - Data querying, natural language processing
 */

import fetch from 'node-fetch';
import { config } from 'dotenv';
import fs from 'fs';
import { glob } from 'glob';
import path from 'path';

// Load environment variables
config({ path: '.env.development.local' });

const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
const ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

class ComprehensiveFeatureAnalysis {
  constructor() {
    this.results = {
      corePayroll: {},
      userManagement: {},
      clientManagement: {},
      billingInvoicing: {},
      leaveManagement: {},
      workScheduling: {},
      auditCompliance: {},
      emailSystem: {},
      externalIntegrations: {},
      aiAssistant: {},
      summary: {
        totalFeatures: 0,
        implementedFeatures: 0,
        partialFeatures: 0,
        missingFeatures: 0,
        completenessScore: 0,
        criticalMissing: [],
        partialImplementations: [],
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
      'feature': '🎯',
      'missing': '🔴',
      'partial': '🟡',
      'complete': '🟢'
    };
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.log(`${icons[type]} [${timestamp}] ${message}`);
  }

  async executeFeatureQuery(query, headers = {}, description = '') {
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

  async checkFileExists(patterns) {
    const allFiles = [];
    for (const pattern of patterns) {
      try {
        const files = await glob(pattern, { 
          ignore: ['node_modules/**', '.next/**', 'dist/**', 'build/**'],
          absolute: false
        });
        allFiles.push(...files);
      } catch (error) {
        // Continue if pattern doesn't match
      }
    }
    return allFiles.length > 0;
  }

  async analyzeCorePayrollFeatures() {
    this.log('💰 Analyzing core payroll features', 'feature');

    const payrollFeatures = [
      {
        name: 'payroll_processing',
        description: 'Complete payroll processing workflow',
        test: async () => {
          const result = await this.executeFeatureQuery(`
            query PayrollProcessing {
              payrolls {
                id
                name
                status
                processingStatus
                processingStarted
                processingCompleted
                client {
                  name
                }
                payrollStaff {
                  id
                  staff {
                    name
                  }
                }
                timeEntries {
                  id
                  hoursWorked
                  hourlyRate
                }
              }
            }
          `);

          if (result.success && result.data?.payrolls) {
            const payrolls = result.data.payrolls;
            const hasProcessingStatus = payrolls.some(p => p.processingStatus);
            const hasTimeEntries = payrolls.some(p => p.timeEntries?.length > 0);
            const hasStaff = payrolls.some(p => p.payrollStaff?.length > 0);

            return {
              implemented: hasProcessingStatus && hasTimeEntries && hasStaff,
              details: {
                totalPayrolls: payrolls.length,
                hasProcessingStatus,
                hasTimeEntries,
                hasStaff,
                processablePayrolls: payrolls.filter(p => p.status === 'Active').length
              }
            };
          }
          return { implemented: false, error: result.error };
        }
      },
      {
        name: 'time_entry_management',
        description: 'Time entry creation and management',
        test: async () => {
          const result = await this.executeFeatureQuery(`
            query TimeEntryManagement {
              timeEntries(limit: 10) {
                id
                hoursWorked
                hourlyRate
                date
                approved
                approvedBy
                staff {
                  name
                }
                payroll {
                  name
                }
              }
            }
          `);

          if (result.success && result.data?.timeEntries) {
            const entries = result.data.timeEntries;
            const hasApprovalWorkflow = entries.some(e => e.approved !== null);
            const hasRateTracking = entries.every(e => e.hourlyRate);
            const hasStaffAssignment = entries.every(e => e.staff);

            return {
              implemented: entries.length > 0 && hasRateTracking && hasStaffAssignment,
              details: {
                totalEntries: entries.length,
                hasApprovalWorkflow,
                hasRateTracking,
                hasStaffAssignment,
                approvedEntries: entries.filter(e => e.approved).length
              }
            };
          }
          return { implemented: false, error: result.error };
        }
      },
      {
        name: 'payroll_calculations',
        description: 'Automated payroll calculations and tax processing',
        test: async () => {
          const files = await this.checkFileExists([
            '**/payroll*calculation*.{ts,tsx,js}',
            '**/tax*calculation*.{ts,tsx,js}',
            '**/salary*calculation*.{ts,tsx,js}'
          ]);

          const result = await this.executeFeatureQuery(`
            query PayrollCalculations {
              payrollStaff(limit: 10) {
                id
                baseSalary
                hourlyRate
                overtimeRate
                calculatedPay
                taxDeductions
                netPay
              }
            }
          `);

          const hasCalculationFiles = files;
          const hasCalculationFields = result.success && result.data?.payrollStaff?.some(s => 
            s.calculatedPay || s.taxDeductions || s.netPay
          );

          return {
            implemented: hasCalculationFiles && hasCalculationFields,
            details: {
              hasCalculationFiles,
              hasCalculationFields,
              staffWithCalculations: result.data?.payrollStaff?.filter(s => s.calculatedPay).length || 0
            }
          };
        }
      },
      {
        name: 'payroll_reports',
        description: 'Payroll reporting and export capabilities',
        test: async () => {
          const files = await this.checkFileExists([
            '**/report*.{ts,tsx,js}',
            '**/export*.{ts,tsx,js}',
            '**/payroll*report*.{ts,tsx,js}'
          ]);

          const result = await this.executeFeatureQuery(`
            query PayrollReports {
              payrolls(limit: 5) {
                id
                name
                status
                reportGenerated
                exportData
                payrollStaffAggregate {
                  aggregate {
                    count
                    sum {
                      baseSalary
                    }
                  }
                }
              }
            }
          `);

          return {
            implemented: files && result.success,
            details: {
              hasReportingFiles: files,
              hasAggregateData: result.success && result.data?.payrolls?.some(p => 
                p.payrollStaffAggregate?.aggregate?.count > 0
              )
            }
          };
        }
      }
    ];

    const payrollResults = {};
    for (const feature of payrollFeatures) {
      this.log(`  Testing: ${feature.description}`);
      
      try {
        const result = await feature.test();
        payrollResults[feature.name] = {
          description: feature.description,
          implemented: result.implemented,
          details: result.details,
          error: result.error
        };

        const status = result.implemented ? 'complete' : 'missing';
        this.log(`    ${feature.name}: ${result.implemented ? 'Implemented' : 'Missing/Incomplete'}`, status);
        
        if (result.implemented) {
          this.results.summary.implementedFeatures++;
        } else {
          this.results.summary.missingFeatures++;
          this.results.summary.criticalMissing.push({
            category: 'core_payroll',
            feature: feature.name,
            description: feature.description
          });
        }

      } catch (error) {
        this.log(`    ${feature.name}: Test failed - ${error.message}`, 'error');
        payrollResults[feature.name] = {
          description: feature.description,
          implemented: false,
          error: error.message
        };
        this.results.summary.missingFeatures++;
      }

      this.results.summary.totalFeatures++;
    }

    this.results.corePayroll = payrollResults;
  }

  async analyzeUserManagement() {
    this.log('👥 Analyzing user management features', 'feature');

    const userFeatures = [
      {
        name: 'user_registration_onboarding',
        description: 'User registration and onboarding workflow',
        test: async () => {
          const files = await this.checkFileExists([
            '**/registration*.{ts,tsx,js}',
            '**/onboarding*.{ts,tsx,js}',
            '**/invite*.{ts,tsx,js}'
          ]);

          const result = await this.executeFeatureQuery(`
            query UserOnboarding {
              users {
                id
                name
                email
                role
                isStaff
                active
                onboardingCompleted
                invitationSent
                invitationAccepted
              }
            }
          `);

          return {
            implemented: files && result.success && result.data?.users?.length > 0,
            details: {
              hasOnboardingFiles: files,
              totalUsers: result.data?.users?.length || 0,
              hasOnboardingTracking: result.data?.users?.some(u => u.onboardingCompleted !== undefined),
              hasInvitationSystem: result.data?.users?.some(u => u.invitationSent !== undefined)
            }
          };
        }
      },
      {
        name: 'role_permission_management',
        description: 'Role-based access control and permission management',
        test: async () => {
          const result = await this.executeFeatureQuery(`
            query RolePermissionManagement {
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
              permissions {
                id
                action
                relatedResource {
                  name
                }
              }
              userRoleAssignments {
                id
                user {
                  name
                }
                assignedRole {
                  name
                }
              }
            }
          `);

          if (result.success) {
            const roles = result.data?.roles || [];
            const permissions = result.data?.permissions || [];
            const assignments = result.data?.userRoleAssignments || [];

            const hasRoleHierarchy = roles.length >= 3;
            const hasGranularPermissions = permissions.length >= 10;
            const hasRoleAssignments = assignments.length > 0;

            return {
              implemented: hasRoleHierarchy && hasGranularPermissions && hasRoleAssignments,
              details: {
                totalRoles: roles.length,
                totalPermissions: permissions.length,
                totalAssignments: assignments.length,
                hasRoleHierarchy,
                hasGranularPermissions,
                hasRoleAssignments
              }
            };
          }
          return { implemented: false, error: result.error };
        }
      },
      {
        name: 'user_profile_management',
        description: 'User profile editing and management',
        test: async () => {
          const files = await this.checkFileExists([
            '**/profile*.{ts,tsx,js}',
            '**/user*edit*.{ts,tsx,js}',
            '**/user*form*.{ts,tsx,js}'
          ]);

          const result = await this.executeFeatureQuery(`
            query UserProfileManagement {
              users(limit: 5) {
                id
                name
                email
                phone
                address
                dateOfBirth
                emergencyContact
                bankDetails
                tfn
                superFund
                skills {
                  skill {
                    name
                  }
                }
              }
            }
          `);

          return {
            implemented: files && result.success,
            details: {
              hasProfileFiles: files,
              hasDetailedProfiles: result.data?.users?.some(u => 
                u.phone || u.address || u.emergencyContact
              ),
              hasFinancialDetails: result.data?.users?.some(u => 
                u.bankDetails || u.tfn || u.superFund
              ),
              hasSkillsTracking: result.data?.users?.some(u => u.skills?.length > 0)
            }
          };
        }
      }
    ];

    const userResults = {};
    for (const feature of userFeatures) {
      this.log(`  Testing: ${feature.description}`);
      
      try {
        const result = await feature.test();
        userResults[feature.name] = {
          description: feature.description,
          implemented: result.implemented,
          details: result.details,
          error: result.error
        };

        const status = result.implemented ? 'complete' : 'missing';
        this.log(`    ${feature.name}: ${result.implemented ? 'Implemented' : 'Missing/Incomplete'}`, status);
        
        if (result.implemented) {
          this.results.summary.implementedFeatures++;
        } else {
          this.results.summary.missingFeatures++;
        }

      } catch (error) {
        userResults[feature.name] = {
          description: feature.description,
          implemented: false,
          error: error.message
        };
        this.results.summary.missingFeatures++;
      }

      this.results.summary.totalFeatures++;
    }

    this.results.userManagement = userResults;
  }

  async analyzeClientManagement() {
    this.log('🏢 Analyzing client management features', 'feature');

    const clientFeatures = [
      {
        name: 'client_onboarding',
        description: 'Client onboarding and setup workflow',
        test: async () => {
          const files = await this.checkFileExists([
            '**/client*onboard*.{ts,tsx,js}',
            '**/client*setup*.{ts,tsx,js}',
            '**/client*wizard*.{ts,tsx,js}'
          ]);

          const result = await this.executeFeatureQuery(`
            query ClientOnboarding {
              clients {
                id
                name
                contactEmail
                contactPhone
                address
                abn
                onboardingStatus
                setupCompleted
                active
                createdAt
              }
            }
          `);

          return {
            implemented: files || (result.success && result.data?.clients?.length > 0),
            details: {
              hasOnboardingFiles: files,
              totalClients: result.data?.clients?.length || 0,
              hasOnboardingTracking: result.data?.clients?.some(c => c.onboardingStatus),
              hasBusinessDetails: result.data?.clients?.some(c => c.abn || c.address),
              activeClients: result.data?.clients?.filter(c => c.active).length || 0
            }
          };
        }
      },
      {
        name: 'client_relationship_management',
        description: 'Client relationship and communication tracking',
        test: async () => {
          const result = await this.executeFeatureQuery(`
            query ClientRelationshipManagement {
              clients(limit: 5) {
                id
                name
                assignedUsers {
                  user {
                    name
                    role
                  }
                }
                notes {
                  id
                  title
                  content
                  createdAt
                  author {
                    name
                  }
                }
                communications {
                  id
                  type
                  content
                  sentAt
                }
              }
            }
          `);

          if (result.success && result.data?.clients) {
            const clients = result.data.clients;
            const hasAssignedUsers = clients.some(c => c.assignedUsers?.length > 0);
            const hasNotes = clients.some(c => c.notes?.length > 0);
            const hasCommunications = clients.some(c => c.communications?.length > 0);

            return {
              implemented: hasAssignedUsers || hasNotes || hasCommunications,
              details: {
                hasAssignedUsers,
                hasNotes,
                hasCommunications,
                clientsWithNotes: clients.filter(c => c.notes?.length > 0).length,
                clientsWithAssignedUsers: clients.filter(c => c.assignedUsers?.length > 0).length
              }
            };
          }
          return { implemented: false, error: result.error };
        }
      },
      {
        name: 'client_billing_integration',
        description: 'Client billing and invoice integration',
        test: async () => {
          const result = await this.executeFeatureQuery(`
            query ClientBillingIntegration {
              clients(limit: 5) {
                id
                name
                billingItems {
                  id
                  amount
                  description
                  status
                  dueDate
                }
                invoices {
                  id
                  amount
                  status
                  dueDate
                }
                paymentTerms
                defaultBillingRate
              }
            }
          `);

          if (result.success && result.data?.clients) {
            const clients = result.data.clients;
            const hasBillingItems = clients.some(c => c.billingItems?.length > 0);
            const hasInvoices = clients.some(c => c.invoices?.length > 0);
            const hasPaymentTerms = clients.some(c => c.paymentTerms || c.defaultBillingRate);

            return {
              implemented: hasBillingItems || hasInvoices || hasPaymentTerms,
              details: {
                hasBillingItems,
                hasInvoices,
                hasPaymentTerms,
                clientsWithBilling: clients.filter(c => c.billingItems?.length > 0).length,
                clientsWithInvoices: clients.filter(c => c.invoices?.length > 0).length
              }
            };
          }
          return { implemented: false, error: result.error };
        }
      }
    ];

    const clientResults = {};
    for (const feature of clientFeatures) {
      this.log(`  Testing: ${feature.description}`);
      
      try {
        const result = await feature.test();
        clientResults[feature.name] = {
          description: feature.description,
          implemented: result.implemented,
          details: result.details,
          error: result.error
        };

        const status = result.implemented ? 'complete' : 'missing';
        this.log(`    ${feature.name}: ${result.implemented ? 'Implemented' : 'Missing/Incomplete'}`, status);
        
        if (result.implemented) {
          this.results.summary.implementedFeatures++;
        } else {
          this.results.summary.missingFeatures++;
        }

      } catch (error) {
        clientResults[feature.name] = {
          description: feature.description,
          implemented: false,
          error: error.message
        };
        this.results.summary.missingFeatures++;
      }

      this.results.summary.totalFeatures++;
    }

    this.results.clientManagement = clientResults;
  }

  async analyzeEmailSystem() {
    this.log('📧 Analyzing email system features', 'feature');

    const emailFeatures = [
      {
        name: 'email_template_management',
        description: 'Email template creation and management',
        test: async () => {
          const files = await this.checkFileExists([
            '**/email*template*.{ts,tsx,js}',
            '**/template*manager*.{ts,tsx,js}'
          ]);

          const result = await this.executeFeatureQuery(`
            query EmailTemplateManagement {
              emailTemplates {
                id
                name
                subject
                content
                variables
                active
                category
              }
            }
          `);

          return {
            implemented: files && result.success && result.data?.emailTemplates?.length > 0,
            details: {
              hasTemplateFiles: files,
              totalTemplates: result.data?.emailTemplates?.length || 0,
              activeTemplates: result.data?.emailTemplates?.filter(t => t.active).length || 0,
              hasVariableSupport: result.data?.emailTemplates?.some(t => t.variables)
            }
          };
        }
      },
      {
        name: 'email_sending_tracking',
        description: 'Email sending and delivery tracking',
        test: async () => {
          const result = await this.executeFeatureQuery(`
            query EmailSendingTracking {
              emailLogs {
                id
                recipient
                subject
                status
                sentAt
                deliveredAt
                openedAt
                template {
                  name
                }
              }
            }
          `);

          return {
            implemented: result.success && result.data?.emailLogs?.length > 0,
            details: {
              totalEmailsSent: result.data?.emailLogs?.length || 0,
              hasDeliveryTracking: result.data?.emailLogs?.some(e => e.deliveredAt),
              hasOpenTracking: result.data?.emailLogs?.some(e => e.openedAt),
              successfulEmails: result.data?.emailLogs?.filter(e => e.status === 'sent').length || 0
            }
          };
        }
      }
    ];

    const emailResults = {};
    for (const feature of emailFeatures) {
      this.log(`  Testing: ${feature.description}`);
      
      try {
        const result = await feature.test();
        emailResults[feature.name] = {
          description: feature.description,
          implemented: result.implemented,
          details: result.details,
          error: result.error
        };

        const status = result.implemented ? 'complete' : 'missing';
        this.log(`    ${feature.name}: ${result.implemented ? 'Implemented' : 'Missing/Incomplete'}`, status);
        
        if (result.implemented) {
          this.results.summary.implementedFeatures++;
        } else {
          this.results.summary.missingFeatures++;
        }

      } catch (error) {
        emailResults[feature.name] = {
          description: feature.description,
          implemented: false,
          error: error.message
        };
        this.results.summary.missingFeatures++;
      }

      this.results.summary.totalFeatures++;
    }

    this.results.emailSystem = emailResults;
  }

  async analyzeAIAssistant() {
    this.log('🤖 Analyzing AI assistant features', 'feature');

    const aiFeatures = [
      {
        name: 'natural_language_querying',
        description: 'Natural language database querying',
        test: async () => {
          const files = await this.checkFileExists([
            '**/ai*assistant*.{ts,tsx,js}',
            '**/ai*query*.{ts,tsx,js}',
            '**/data*assistant*.{ts,tsx,js}'
          ]);

          const apiFiles = await this.checkFileExists([
            'app/api/ai-assistant/**/*.{ts,js}'
          ]);

          return {
            implemented: files && apiFiles,
            details: {
              hasAIFiles: files,
              hasAPIEndpoints: apiFiles,
              hasNLPCapability: files && apiFiles
            }
          };
        }
      },
      {
        name: 'ai_data_insights',
        description: 'AI-powered data insights and recommendations',
        test: async () => {
          const files = await this.checkFileExists([
            '**/insight*.{ts,tsx,js}',
            '**/recommendation*.{ts,tsx,js}',
            '**/ai*analytics*.{ts,tsx,js}'
          ]);

          return {
            implemented: files,
            details: {
              hasInsightFiles: files
            }
          };
        }
      }
    ];

    const aiResults = {};
    for (const feature of aiFeatures) {
      this.log(`  Testing: ${feature.description}`);
      
      try {
        const result = await feature.test();
        aiResults[feature.name] = {
          description: feature.description,
          implemented: result.implemented,
          details: result.details,
          error: result.error
        };

        const status = result.implemented ? 'complete' : 'missing';
        this.log(`    ${feature.name}: ${result.implemented ? 'Implemented' : 'Missing/Incomplete'}`, status);
        
        if (result.implemented) {
          this.results.summary.implementedFeatures++;
        } else {
          this.results.summary.missingFeatures++;
        }

      } catch (error) {
        aiResults[feature.name] = {
          description: feature.description,
          implemented: false,
          error: error.message
        };
        this.results.summary.missingFeatures++;
      }

      this.results.summary.totalFeatures++;
    }

    this.results.aiAssistant = aiResults;
  }

  async runComprehensiveFeatureAnalysis() {
    this.log('🎯 Starting Comprehensive Feature Completeness Analysis - Phase 5.2', 'feature');
    this.log('=' .repeat(70));

    try {
      await this.analyzeCorePayrollFeatures();
      await this.analyzeUserManagement();
      await this.analyzeClientManagement();
      await this.analyzeEmailSystem();
      await this.analyzeAIAssistant();

      this.generateFeatureCompletenessReport();

    } catch (error) {
      this.log(`💥 Feature analysis failed: ${error.message}`, 'error');
      throw error;
    }
  }

  generateFeatureCompletenessReport() {
    this.log('\n🎯 COMPREHENSIVE FEATURE COMPLETENESS ANALYSIS REPORT', 'feature');
    this.log('=' .repeat(70));

    const { totalFeatures, implementedFeatures, partialFeatures, missingFeatures, criticalMissing } = this.results.summary;
    const completenessScore = this.calculateCompletenessScore();
    this.results.summary.completenessScore = completenessScore;

    // Summary
    this.log(`\n📊 Feature Completeness Summary:`);
    this.log(`   Total Features Analyzed: ${totalFeatures}`);
    this.log(`   Implemented Features: ${implementedFeatures} (${Math.round((implementedFeatures/totalFeatures)*100)}%)`);
    this.log(`   Partial Features: ${partialFeatures}`);
    this.log(`   Missing Features: ${missingFeatures} (${Math.round((missingFeatures/totalFeatures)*100)}%)`);
    this.log(`   Completeness Score: ${completenessScore}/100`);

    // Critical Missing Features
    if (criticalMissing.length > 0) {
      this.log(`\n🔴 CRITICAL MISSING FEATURES:`, 'missing');
      criticalMissing.forEach((missing, index) => {
        this.log(`   ${index + 1}. ${missing.category.toUpperCase()}: ${missing.description}`, 'missing');
      });
    }

    // Feature Category Analysis
    this.log(`\n📋 Feature Category Analysis:`);
    
    // Core Payroll
    const payrollImplemented = Object.values(this.results.corePayroll).filter(f => f.implemented).length;
    const payrollTotal = Object.keys(this.results.corePayroll).length;
    this.log(`   💰 Core Payroll: ${payrollImplemented}/${payrollTotal} features implemented`);

    // User Management
    const userImplemented = Object.values(this.results.userManagement).filter(f => f.implemented).length;
    const userTotal = Object.keys(this.results.userManagement).length;
    this.log(`   👥 User Management: ${userImplemented}/${userTotal} features implemented`);

    // Client Management
    const clientImplemented = Object.values(this.results.clientManagement).filter(f => f.implemented).length;
    const clientTotal = Object.keys(this.results.clientManagement).length;
    this.log(`   🏢 Client Management: ${clientImplemented}/${clientTotal} features implemented`);

    // Email System
    const emailImplemented = Object.values(this.results.emailSystem).filter(f => f.implemented).length;
    const emailTotal = Object.keys(this.results.emailSystem).length;
    this.log(`   📧 Email System: ${emailImplemented}/${emailTotal} features implemented`);

    // AI Assistant
    const aiImplemented = Object.values(this.results.aiAssistant).filter(f => f.implemented).length;
    const aiTotal = Object.keys(this.results.aiAssistant).length;
    this.log(`   🤖 AI Assistant: ${aiImplemented}/${aiTotal} features implemented`);

    // Feature Details
    this.log(`\n📝 Detailed Feature Analysis:`);
    
    // Show implemented features
    const implementedList = [];
    Object.entries(this.results).forEach(([category, features]) => {
      if (typeof features === 'object' && category !== 'summary') {
        Object.entries(features).forEach(([featureName, feature]) => {
          if (feature.implemented) {
            implementedList.push(`${category}: ${feature.description}`);
          }
        });
      }
    });

    if (implementedList.length > 0) {
      this.log(`\n🟢 Implemented Features (${implementedList.length}):`);
      implementedList.forEach((feature, index) => {
        this.log(`   ${index + 1}. ${feature}`, 'complete');
      });
    }

    // Show missing features
    const missingList = [];
    Object.entries(this.results).forEach(([category, features]) => {
      if (typeof features === 'object' && category !== 'summary') {
        Object.entries(features).forEach(([featureName, feature]) => {
          if (!feature.implemented) {
            missingList.push({
              category,
              name: featureName,
              description: feature.description,
              error: feature.error
            });
          }
        });
      }
    });

    if (missingList.length > 0) {
      this.log(`\n🔴 Missing/Incomplete Features (${missingList.length}):`);
      missingList.forEach((feature, index) => {
        this.log(`   ${index + 1}. ${feature.category}: ${feature.description}${feature.error ? ` (${feature.error})` : ''}`, 'missing');
      });
    }

    // Final Assessment
    this.log(`\n🏆 Feature Completeness Assessment:`);
    if (completenessScore >= 90 && criticalMissing.length === 0) {
      this.log(`   🎉 Excellent! Feature set is comprehensive and production-ready (${completenessScore}/100)`, 'complete');
      this.log(`   ✅ Phase 5.2: Feature Completeness Analysis - COMPLETED SUCCESSFULLY`);
    } else if (completenessScore >= 70) {
      this.log(`   👍 Good feature coverage with some missing functionality (${completenessScore}/100)`, 'partial');
      this.log(`   ⚠️ Phase 5.2: Feature Completeness Analysis - COMPLETED WITH GAPS`);
    } else if (criticalMissing.length > 0) {
      this.log(`   🚨 CRITICAL FEATURES MISSING - SYSTEM INCOMPLETE (${completenessScore}/100)`, 'missing');
      this.log(`   ❌ Phase 5.2: Feature Completeness Analysis - CRITICAL GAPS FOUND`);
    } else {
      this.log(`   ⚠️ Significant feature gaps - not ready for production (${completenessScore}/100)`, 'partial');
      this.log(`   🔧 Phase 5.2: Feature Completeness Analysis - NEEDS FEATURE DEVELOPMENT`);
    }

    // Recommendations
    this.log(`\n💡 Feature Development Recommendations:`);
    if (criticalMissing.length > 0) {
      this.log(`   1. 🚨 URGENT: Implement ${criticalMissing.length} critical missing features`);
    }
    this.log(`   2. 💰 Complete core payroll processing workflow`);
    this.log(`   3. 🏢 Enhance client relationship management features`);
    this.log(`   4. 📧 Implement comprehensive email system`);
    this.log(`   5. 🤖 Develop AI assistant capabilities`);
    this.log(`   6. 📊 Add comprehensive reporting and analytics`);
    this.log(`   7. 🔄 Implement automated workflow features`);
    this.log(`   8. 📱 Consider mobile application development`);

    // Save results
    const reportFile = `test-results/feature-completeness-analysis-${Date.now()}.json`;
    try {
      fs.mkdirSync('test-results', { recursive: true });
      fs.writeFileSync(reportFile, JSON.stringify(this.results, null, 2));
      this.log(`\n💾 Detailed results saved to: ${reportFile}`, 'complete');
    } catch (error) {
      this.log(`Failed to save results: ${error.message}`, 'error');
    }

    this.log('\n' + '=' .repeat(70));
  }

  calculateCompletenessScore() {
    const { totalFeatures, implementedFeatures, missingFeatures, criticalMissing } = this.results.summary;
    
    if (totalFeatures === 0) return 0;
    
    let score = (implementedFeatures / totalFeatures) * 100;
    
    // Deduct extra points for critical missing features
    score -= criticalMissing.length * 10;
    
    return Math.max(0, Math.round(score));
  }
}

// Main execution
async function main() {
  console.log('🎯 Comprehensive Feature Completeness Analysis');
  console.log('Phase 5.2: Analyze feature completeness and identify missing functionality\n');

  if (!HASURA_URL || !ADMIN_SECRET) {
    console.error('❌ Missing required environment variables');
    process.exit(1);
  }

  console.log('✅ Environment validated');
  console.log(`📡 Hasura endpoint: ${HASURA_URL}`);
  console.log('🎯 Starting comprehensive feature analysis...\n');

  const analyzer = new ComprehensiveFeatureAnalysis();
  await analyzer.runComprehensiveFeatureAnalysis();
}

main().catch(error => {
  console.error('💥 Feature analysis failed:', error);
  process.exit(1);
});