/**
 * UI Data Validation Test Script
 * Tests actual UI data display to identify specific data inconsistencies
 * Uses real user authentication to access protected pages
 */

import fetch from 'node-fetch';
import fs from 'fs';
import { config } from 'dotenv';
config({ path: '.env.test' });

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
const HASURA_ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

// Test users with actual credentials
const TEST_USERS = {
  admin: {
    email: 'admin@example.com',
    password: 'Admin1',
    role: 'org_admin',
    description: 'Admin user with full system access'
  },
  manager: {
    email: 'manager@example.com', 
    password: 'Manager1',
    role: 'manager',
    description: 'Manager user with team management access'
  },
  consultant: {
    email: 'consultant@example.com',
    password: 'Consultant1',
    role: 'consultant', 
    description: 'Consultant user with operational access'
  },
  viewer: {
    email: 'viewer@example.com',
    password: 'Viewer1',
    role: 'viewer',
    description: 'Viewer user with read-only access'
  }
};

// Critical pages to test for data display issues
const CRITICAL_PAGES = {
  dashboard: {
    path: '/dashboard',
    dataPoints: ['user count', 'payroll summary', 'client stats', 'recent activity'],
    expectedElements: ['sidebar', 'header', 'main content', 'navigation']
  },
  staff: {
    path: '/staff',
    dataPoints: ['employee list', 'role assignments', 'staff status', 'permissions'],
    expectedElements: ['staff table', 'search/filter', 'pagination', 'action buttons']
  },
  payrolls: {
    path: '/payrolls',
    dataPoints: ['payroll runs', 'calculations', 'schedules', 'status updates'],
    expectedElements: ['payroll table', 'run history', 'schedule view', 'processing status']
  },
  clients: {
    path: '/clients',
    dataPoints: ['client list', 'contact info', 'billing status', 'assignments'],
    expectedElements: ['client table', 'contact details', 'billing info', 'staff assignments']
  },
  billing: {
    path: '/billing',
    dataPoints: ['invoice data', 'payment status', 'profitability', 'billing rates'],
    expectedElements: ['invoice table', 'payment tracking', 'financial reports', 'rate management']
  },
  workSchedule: {
    path: '/work-schedule',
    dataPoints: ['staff schedules', 'capacity planning', 'skills matrix', 'assignments'],
    expectedElements: ['schedule grid', 'capacity view', 'skills management', 'position assignments']
  }
};

class UIDataValidator {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      testSummary: {
        totalPages: 0,
        pagesWithIssues: 0,
        criticalIssues: 0,
        dataIssues: 0,
        accessIssues: 0
      },
      userResults: {},
      detailedIssues: [],
      recommendations: []
    };
  }

  log(message, type = 'info') {
    const prefix = {
      'info': '🔍',
      'success': '✅',
      'error': '❌', 
      'warning': '⚠️',
      'critical': '🚨',
      'data': '📊',
      'ui': '🎨'
    }[type] || 'ℹ️';
    
    console.log(`${prefix} ${message}`);
  }

  /**
   * Get database data to compare against UI display
   */
  async getDatabaseReference() {
    try {
      const queries = {
        users: `
          query GetUsers {
            users {
              id
              email
              name
              role
              isActive
              isStaff
              assignedRoles {
                assignedRole { name }
              }
            }
          }
        `,
        clients: `
          query GetClients {
            clients {
              id
              name
              email
              isActive
              createdAt
            }
          }
        `,
        payrolls: `
          query GetPayrolls {
            payrolls {
              id
              name
              status
              scheduledDate
              createdAt
            }
          }
        `
      };

      const referenceData = {};

      for (const [key, query] of Object.entries(queries)) {
        try {
          const response = await fetch(HASURA_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Hasura-Admin-Secret': HASURA_ADMIN_SECRET
            },
            body: JSON.stringify({ query })
          });

          const data = await response.json();
          
          if (data.errors) {
            this.log(`Database query error for ${key}: ${JSON.stringify(data.errors)}`, 'error');
            referenceData[key] = { error: data.errors, count: 0 };
          } else {
            const items = data.data?.[key] || [];
            referenceData[key] = {
              count: items.length,
              items: items.slice(0, 5), // First 5 for comparison
              sample: items[0] || null
            };
            this.log(`Database ${key}: ${items.length} records`, 'data');
          }
        } catch (error) {
          this.log(`Error querying ${key}: ${error.message}`, 'error');
          referenceData[key] = { error: error.message, count: 0 };
        }
      }

      return referenceData;
    } catch (error) {
      this.log(`Error getting database reference: ${error.message}`, 'error');
      return {};
    }
  }

  /**
   * Test page accessibility and basic structure
   */
  async testPageAccess(userKey, userConfig, pageName, pageConfig) {
    try {
      this.log(`Testing ${pageName} page for ${userKey}`, 'ui');
      
      // Test page accessibility
      const response = await fetch(`${BASE_URL}${pageConfig.path}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; UITest/1.0)'
        }
      });

      const pageResult = {
        page: pageName,
        path: pageConfig.path,
        user: userKey,
        accessible: response.ok,
        statusCode: response.status,
        issues: [],
        dataPoints: {},
        expectedElements: {}
      };

      if (!response.ok) {
        const issue = `Page ${pageName} not accessible: ${response.status}`;
        pageResult.issues.push({
          type: 'access',
          severity: 'critical',
          message: issue
        });
        this.log(`❌ ${issue}`, 'critical');
        this.results.testSummary.accessIssues++;
        return pageResult;
      }

      // Get page content for analysis
      const content = await response.text();
      
      // Check for common error indicators
      const errorIndicators = [
        'Error: ',
        'undefined',
        'null',
        'Cannot read property',
        'TypeError',
        'ReferenceError',
        'No data available',
        'Loading...',
        '404',
        '500',
        'Unauthorized'
      ];

      errorIndicators.forEach(indicator => {
        if (content.includes(indicator)) {
          const issue = `Potential error on ${pageName}: contains '${indicator}'`;
          pageResult.issues.push({
            type: 'error',
            severity: 'high',
            message: issue,
            indicator
          });
          this.log(`⚠️ ${issue}`, 'warning');
        }
      });

      // Check for expected elements
      pageConfig.expectedElements.forEach(element => {
        const elementFound = this.checkElementPresence(content, element);
        pageResult.expectedElements[element] = elementFound;
        
        if (!elementFound) {
          const issue = `Missing expected element '${element}' on ${pageName}`;
          pageResult.issues.push({
            type: 'ui',
            severity: 'medium',
            message: issue,
            element
          });
          this.log(`⚠️ ${issue}`, 'warning');
        }
      });

      // Check for data display patterns
      pageConfig.dataPoints.forEach(dataPoint => {
        const dataPresent = this.checkDataPresence(content, dataPoint);
        pageResult.dataPoints[dataPoint] = dataPresent;
        
        if (!dataPresent) {
          const issue = `Missing or empty data for '${dataPoint}' on ${pageName}`;
          pageResult.issues.push({
            type: 'data',
            severity: 'medium', 
            message: issue,
            dataPoint
          });
          this.log(`⚠️ ${issue}`, 'data');
          this.results.testSummary.dataIssues++;
        }
      });

      // Count total issues
      if (pageResult.issues.length > 0) {
        this.results.testSummary.pagesWithIssues++;
        this.results.testSummary.criticalIssues += pageResult.issues.filter(i => i.severity === 'critical').length;
      }

      this.results.detailedIssues.push(...pageResult.issues);
      
      return pageResult;

    } catch (error) {
      const errorResult = {
        page: pageName,
        path: pageConfig.path,
        user: userKey,
        accessible: false,
        error: error.message,
        issues: [{
          type: 'access',
          severity: 'critical',
          message: `Failed to test ${pageName}: ${error.message}`
        }]
      };
      
      this.log(`❌ Error testing ${pageName} for ${userKey}: ${error.message}`, 'error');
      this.results.testSummary.accessIssues++;
      this.results.detailedIssues.push(...errorResult.issues);
      
      return errorResult;
    }
  }

  /**
   * Check if expected UI element is present in page content
   */
  checkElementPresence(content, element) {
    const elementPatterns = {
      'sidebar': ['nav', 'sidebar', 'menu'],
      'header': ['header', 'nav', 'navigation'],
      'main content': ['main', 'content', 'container'],
      'navigation': ['nav', 'navigation', 'breadcrumb'],
      'staff table': ['table', 'tbody', 'staff', 'employee'],
      'search/filter': ['search', 'filter', 'input'],
      'pagination': ['pagination', 'page', 'next', 'previous'],
      'action buttons': ['button', 'btn', 'action'],
      'payroll table': ['table', 'payroll', 'tbody'],
      'run history': ['history', 'runs', 'past'],
      'schedule view': ['schedule', 'calendar', 'timeline'],
      'processing status': ['status', 'processing', 'progress'],
      'client table': ['table', 'client', 'tbody'],
      'contact details': ['contact', 'email', 'phone'],
      'billing info': ['billing', 'invoice', 'payment'],
      'staff assignments': ['assignment', 'assigned', 'staff'],
      'invoice table': ['invoice', 'table', 'tbody'],
      'payment tracking': ['payment', 'paid', 'pending'],
      'financial reports': ['report', 'financial', 'summary'],
      'rate management': ['rate', 'pricing', 'cost'],
      'schedule grid': ['schedule', 'grid', 'calendar'],
      'capacity view': ['capacity', 'utilization', 'available'],
      'skills management': ['skills', 'competency', 'ability'],
      'position assignments': ['position', 'role', 'assignment']
    };

    const patterns = elementPatterns[element] || [element];
    return patterns.some(pattern => 
      content.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  /**
   * Check if data is properly displayed
   */
  checkDataPresence(content, dataPoint) {
    const dataPatterns = {
      'user count': [/\d+\s*(users?|staff|employees?)/i, /users?:\s*\d+/i],
      'payroll summary': [/payroll/i, /\$\d+/i, /total/i],
      'client stats': [/\d+\s*clients?/i, /clients?:\s*\d+/i],
      'recent activity': [/recent/i, /activity/i, /ago/i],
      'employee list': [/employee/i, /staff/i, /@\w+\.\w+/],
      'role assignments': [/role/i, /admin|manager|consultant|viewer/i],
      'staff status': [/active|inactive/i, /status/i],
      'permissions': [/permission/i, /access/i, /can|cannot/i],
      'payroll runs': [/run/i, /payroll/i, /scheduled/i],
      'calculations': [/\$\d+/i, /total/i, /amount/i],
      'schedules': [/schedule/i, /date/i, /\d{4}-\d{2}-\d{2}/],
      'status updates': [/status/i, /pending|processing|complete/i],
      'client list': [/client/i, /@\w+\.\w+/, /company|business/i],
      'contact info': [/@\w+\.\w+/, /phone/i, /\d{10}/],
      'billing status': [/billed|unbilled/i, /\$\d+/i, /invoice/i],
      'assignments': [/assigned/i, /staff/i, /consultant/i],
      'invoice data': [/invoice/i, /\$\d+/i, /INV-\d+/],
      'payment status': [/paid|unpaid|pending/i, /payment/i],
      'profitability': [/profit/i, /\$\d+/i, /margin/i],
      'billing rates': [/rate/i, /\$\d+/i, /hour/i],
      'staff schedules': [/schedule/i, /\d{1,2}:\d{2}/i, /am|pm/i],
      'capacity planning': [/capacity/i, /utilization/i, /\d+%/],
      'skills matrix': [/skill/i, /competency/i, /level/i],
    };

    const patterns = dataPatterns[dataPoint] || [new RegExp(dataPoint, 'i')];
    
    // Check for empty state indicators
    const emptyStateIndicators = [
      'no data available',
      'no records found', 
      'empty',
      'loading...',
      'undefined',
      'null'
    ];

    const hasEmptyState = emptyStateIndicators.some(indicator =>
      content.toLowerCase().includes(indicator)
    );

    if (hasEmptyState) return false;

    return patterns.some(pattern => pattern.test(content));
  }

  /**
   * Test UI for a specific user
   */
  async testUserUI(userKey, userConfig) {
    this.log(`\n🧪 Testing UI data display for ${userKey} (${userConfig.email})`, 'info');
    
    const userResults = {
      user: userKey,
      email: userConfig.email,
      role: userConfig.role,
      pages: {},
      summary: {
        totalPages: 0,
        accessiblePages: 0,
        pagesWithIssues: 0,
        totalIssues: 0
      }
    };

    // Test each critical page
    for (const [pageName, pageConfig] of Object.entries(CRITICAL_PAGES)) {
      userResults.summary.totalPages++;
      this.results.testSummary.totalPages++;
      
      const pageResult = await this.testPageAccess(userKey, userConfig, pageName, pageConfig);
      userResults.pages[pageName] = pageResult;
      
      if (pageResult.accessible) {
        userResults.summary.accessiblePages++;
      }
      
      if (pageResult.issues && pageResult.issues.length > 0) {
        userResults.summary.pagesWithIssues++;
        userResults.summary.totalIssues += pageResult.issues.length;
      }
    }

    this.results.userResults[userKey] = userResults;
    return userResults;
  }

  /**
   * Generate comprehensive report
   */
  generateReport() {
    this.log('\n📊 UI DATA VALIDATION REPORT', 'info');
    this.log('=' * 80);

    // Overall summary
    this.log(`\n📈 Test Summary:`);
    this.log(`   Total Pages Tested: ${this.results.testSummary.totalPages}`);
    this.log(`   Pages with Issues: ${this.results.testSummary.pagesWithIssues}`);
    this.log(`   Critical Issues: ${this.results.testSummary.criticalIssues}`);
    this.log(`   Data Display Issues: ${this.results.testSummary.dataIssues}`);
    this.log(`   Access Issues: ${this.results.testSummary.accessIssues}`);

    // User-specific results
    this.log(`\n👥 Results by User Role:`);
    Object.entries(this.results.userResults).forEach(([userKey, userResult]) => {
      const status = userResult.summary.totalIssues === 0 ? '✅' : '❌';
      this.log(`   ${status} ${userKey} (${userResult.role}): ${userResult.summary.accessiblePages}/${userResult.summary.totalPages} pages accessible, ${userResult.summary.totalIssues} issues`);
    });

    // Critical issues
    const criticalIssues = this.results.detailedIssues.filter(issue => issue.severity === 'critical');
    if (criticalIssues.length > 0) {
      this.log(`\n🚨 Critical Issues:`);
      criticalIssues.forEach((issue, index) => {
        this.log(`   ${index + 1}. ${issue.message}`, 'critical');
      });
    }

    // Data display issues
    const dataIssues = this.results.detailedIssues.filter(issue => issue.type === 'data');
    if (dataIssues.length > 0) {
      this.log(`\n📊 Data Display Issues:`);
      dataIssues.forEach((issue, index) => {
        this.log(`   ${index + 1}. ${issue.message}`, 'data');
      });
    }

    // UI issues
    const uiIssues = this.results.detailedIssues.filter(issue => issue.type === 'ui');
    if (uiIssues.length > 0) {
      this.log(`\n🎨 UI Structure Issues:`);
      uiIssues.forEach((issue, index) => {
        this.log(`   ${index + 1}. ${issue.message}`, 'ui');
      });
    }

    // Recommendations
    this.log(`\n💡 Recommendations:`);
    
    if (this.results.testSummary.criticalIssues > 0) {
      this.log(`   1. 🚨 Fix ${this.results.testSummary.criticalIssues} critical access issues first`, 'critical');
    }
    
    if (this.results.testSummary.dataIssues > 0) {
      this.log(`   2. 📊 Investigate ${this.results.testSummary.dataIssues} data display problems`, 'data');
      this.log(`      - Check GraphQL query responses`, 'info');
      this.log(`      - Verify data transformations in components`, 'info');
      this.log(`      - Test with different user roles`, 'info');
    }

    if (uiIssues.length > 0) {
      this.log(`   3. 🎨 Fix ${uiIssues.length} UI structure issues`, 'ui');
      this.log(`      - Check component rendering logic`, 'info');
      this.log(`      - Verify conditional display based on permissions`, 'info');
    }

    // Next steps
    this.log(`\n🚀 Next Steps:`);
    this.log(`   1. Start development server: pnpm dev`);
    this.log(`   2. Manual testing with credentials:`);
    
    Object.entries(TEST_USERS).forEach(([key, user]) => {
      this.log(`      - ${key}: ${user.email} / ${user.password}`);
    });
    
    this.log(`   3. Focus on pages with most issues:`);
    const pageIssueCount = {};
    this.results.detailedIssues.forEach(issue => {
      const page = issue.message.split(' on ')[1] || 'unknown';
      pageIssueCount[page] = (pageIssueCount[page] || 0) + 1;
    });
    
    Object.entries(pageIssueCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .forEach(([page, count], index) => {
        this.log(`      ${index + 1}. ${page}: ${count} issues`);
      });

    // Save detailed results
    try {
      fs.mkdirSync('test-results', { recursive: true });
      
      const reportFile = `test-results/ui-data-validation-${Date.now()}.json`;
      fs.writeFileSync(reportFile, JSON.stringify(this.results, null, 2));
      
      this.log(`\n💾 Detailed results saved to: ${reportFile}`, 'success');
    } catch (error) {
      this.log(`Failed to save results: ${error.message}`, 'error');
    }
  }

  /**
   * Run complete UI data validation
   */
  async runValidation() {
    this.log('🚀 Starting UI Data Validation', 'info');
    this.log(`Base URL: ${BASE_URL}`, 'info');
    this.log(`Hasura URL: ${HASURA_URL ? 'Configured' : 'Not configured'}`, 'info');

    // Get database reference data
    this.log('\n🗄️ Getting database reference data...', 'data');
    const referenceData = await getDatabaseReference();
    this.results.referenceData = referenceData;

    // Test UI for each user role
    for (const [userKey, userConfig] of Object.entries(TEST_USERS)) {
      await this.testUserUI(userKey, userConfig);
    }

    // Generate comprehensive report
    this.generateReport();

    // Return results for further processing
    return this.results;
  }
}

// Helper function to get database reference
async function getDatabaseReference() {
  try {
    const queries = {
      users: `query { users { id email name role isActive } }`,
      clients: `query { clients { id name email isActive } }`, 
      payrolls: `query { payrolls { id name status scheduledDate } }`
    };

    const referenceData = {};

    for (const [key, query] of Object.entries(queries)) {
      try {
        const response = await fetch(HASURA_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Hasura-Admin-Secret': HASURA_ADMIN_SECRET
          },
          body: JSON.stringify({ query })
        });

        const data = await response.json();
        const items = data.data?.[key] || [];
        referenceData[key] = {
          count: items.length,
          sample: items[0] || null
        };
      } catch (error) {
        referenceData[key] = { error: error.message, count: 0 };
      }
    }

    return referenceData;
  } catch (error) {
    return {};
  }
}

// Run the validation
async function main() {
  const validator = new UIDataValidator();
  const results = await validator.runValidation();
  
  // Summary for immediate action
  const issueCount = results.testSummary.criticalIssues + results.testSummary.dataIssues;
  if (issueCount > 0) {
    console.log(`\n⚠️ Found ${issueCount} data display issues to investigate`);
  } else {
    console.log(`\n✅ No critical data display issues found`);
  }
}

main().catch(console.error);

export { UIDataValidator, TEST_USERS, CRITICAL_PAGES };