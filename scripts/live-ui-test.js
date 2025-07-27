/**
 * Live UI Testing Script
 * Tests actual running development server to identify data display issues
 */

import fetch from 'node-fetch';
import fs from 'fs';
import { config } from 'dotenv';
config({ path: '.env.test' });

const BASE_URL = 'http://localhost:3000';

const TEST_USERS = {
  admin: { email: 'admin@example.com', password: 'Admin1', role: 'org_admin' },
  manager: { email: 'manager@example.com', password: 'Manager1', role: 'manager' },
  consultant: { email: 'consultant@example.com', password: 'Consultant1', role: 'consultant' },
  viewer: { email: 'viewer@example.com', password: 'Viewer1', role: 'viewer' }
};

const PAGES_TO_TEST = [
  { path: '/dashboard', name: 'Dashboard', priority: 'high' },
  { path: '/staff', name: 'Staff Management', priority: 'high' },
  { path: '/payrolls', name: 'Payroll Processing', priority: 'high' },
  { path: '/clients', name: 'Client Management', priority: 'high' },
  { path: '/billing', name: 'Billing System', priority: 'high' },
  { path: '/work-schedule', name: 'Work Schedule', priority: 'medium' },
  { path: '/email', name: 'Email Templates', priority: 'medium' },
  { path: '/leave', name: 'Leave Management', priority: 'medium' }
];

class LiveUITester {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      serverRunning: false,
      pagesAccessible: {},
      dataIssues: [],
      uiIssues: [],
      authIssues: [],
      summary: {
        totalPages: 0,
        accessiblePages: 0,
        pagesWithDataIssues: 0,
        criticalIssues: 0
      }
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
      'auth': '🔐'
    }[type] || 'ℹ️';
    
    console.log(`${prefix} ${message}`);
  }

  async checkServerStatus() {
    try {
      const response = await fetch(BASE_URL, { timeout: 5000 });
      this.results.serverRunning = response.ok;
      
      if (response.ok) {
        this.log('Development server is running and accessible', 'success');
        return true;
      } else {
        this.log(`Server responded with status: ${response.status}`, 'error');
        return false;
      }
    } catch (error) {
      this.log(`Server not accessible: ${error.message}`, 'error');
      this.results.serverRunning = false;
      return false;
    }
  }

  async testPageAccess(pagePath, pageName) {
    try {
      this.log(`Testing ${pageName} (${pagePath})`, 'info');
      
      const response = await fetch(`${BASE_URL}${pagePath}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; LiveUITest/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        timeout: 10000
      });

      const content = await response.text();
      
      const pageResult = {
        path: pagePath,
        name: pageName,
        accessible: response.ok,
        status: response.status,
        redirected: response.redirected,
        redirectURL: response.url,
        contentLength: content.length,
        issues: []
      };

      // Check for authentication redirects
      if (response.redirected && response.url.includes('/sign-in')) {
        pageResult.requiresAuth = true;
        this.log(`✅ ${pageName} correctly requires authentication`, 'auth');
      } else if (response.ok) {
        pageResult.requiresAuth = false;
        
        // Analyze page content for data display issues
        const dataIssues = this.analyzePageContent(content, pageName, pagePath);
        pageResult.issues = dataIssues;
        
        if (dataIssues.length > 0) {
          this.results.dataIssues.push(...dataIssues);
          this.results.summary.pagesWithDataIssues++;
          this.log(`⚠️ Found ${dataIssues.length} potential data issues on ${pageName}`, 'warning');
        } else {
          this.log(`✅ ${pageName} loaded successfully`, 'success');
        }
      } else {
        const issue = {
          page: pageName,
          path: pagePath,
          type: 'access',
          severity: 'critical',
          message: `Page not accessible: HTTP ${response.status}`
        };
        pageResult.issues.push(issue);
        this.results.uiIssues.push(issue);
        this.log(`❌ ${pageName} not accessible: ${response.status}`, 'error');
      }

      this.results.pagesAccessible[pagePath] = pageResult;
      this.results.summary.totalPages++;
      
      if (response.ok) {
        this.results.summary.accessiblePages++;
      }

      return pageResult;

    } catch (error) {
      const errorResult = {
        path: pagePath,
        name: pageName,
        accessible: false,
        error: error.message,
        issues: [{
          page: pageName,
          path: pagePath,
          type: 'network',
          severity: 'critical',
          message: `Network error: ${error.message}`
        }]
      };

      this.results.pagesAccessible[pagePath] = errorResult;
      this.results.summary.totalPages++;
      this.log(`❌ Error testing ${pageName}: ${error.message}`, 'error');
      
      return errorResult;
    }
  }

  analyzePageContent(content, pageName, pagePath) {
    const issues = [];

    // Check for error indicators
    const errorPatterns = [
      { pattern: /error/gi, severity: 'high', type: 'error' },
      { pattern: /undefined/gi, severity: 'medium', type: 'data' },
      { pattern: /null/gi, severity: 'medium', type: 'data' },
      { pattern: /loading\.\.\./gi, severity: 'low', type: 'ui' },
      { pattern: /no data available/gi, severity: 'medium', type: 'data' },
      { pattern: /404/gi, severity: 'high', type: 'error' },
      { pattern: /500/gi, severity: 'critical', type: 'error' }
    ];

    errorPatterns.forEach(({ pattern, severity, type }) => {
      const matches = content.match(pattern);
      if (matches && matches.length > 0) {
        issues.push({
          page: pageName,
          path: pagePath,
          type,
          severity,
          message: `Found ${matches.length} instances of '${pattern.source}' indicating potential ${type} issues`,
          count: matches.length
        });
      }
    });

    // Check for missing critical elements based on page type
    const expectedElements = this.getExpectedElements(pagePath);
    expectedElements.forEach(element => {
      if (!this.checkElementInContent(content, element.selector, element.patterns)) {
        issues.push({
          page: pageName,
          path: pagePath,
          type: 'ui',
          severity: element.severity || 'medium',
          message: `Missing expected element: ${element.name}`,
          element: element.name
        });
      }
    });

    // Check for data display patterns
    const dataPatterns = this.getDataPatterns(pagePath);
    dataPatterns.forEach(pattern => {
      if (!this.checkDataInContent(content, pattern.patterns)) {
        issues.push({
          page: pageName,
          path: pagePath,
          type: 'data',
          severity: 'medium',
          message: `Missing expected data: ${pattern.name}`,
          dataType: pattern.name
        });
      }
    });

    return issues;
  }

  getExpectedElements(pagePath) {
    const commonElements = [
      { name: 'Navigation', selector: 'nav', patterns: ['nav', 'navigation', 'menu'], severity: 'medium' },
      { name: 'Header', selector: 'header', patterns: ['header', 'title'], severity: 'low' },
      { name: 'Main Content', selector: 'main', patterns: ['main', 'content'], severity: 'high' }
    ];

    const pageSpecificElements = {
      '/dashboard': [
        { name: 'Dashboard Cards', patterns: ['card', 'metric', 'stats'], severity: 'high' },
        { name: 'Recent Activity', patterns: ['activity', 'recent', 'timeline'], severity: 'medium' }
      ],
      '/staff': [
        { name: 'Staff Table', patterns: ['table', 'employee', 'staff'], severity: 'high' },
        { name: 'User Roles', patterns: ['role', 'permission'], severity: 'medium' }
      ],
      '/payrolls': [
        { name: 'Payroll Table', patterns: ['payroll', 'table', 'calculation'], severity: 'high' },
        { name: 'Processing Status', patterns: ['status', 'processed', 'pending'], severity: 'high' }
      ],
      '/clients': [
        { name: 'Client Table', patterns: ['client', 'table', 'customer'], severity: 'high' },
        { name: 'Contact Information', patterns: ['contact', 'email', 'phone'], severity: 'medium' }
      ],
      '/billing': [
        { name: 'Invoice Table', patterns: ['invoice', 'billing', 'table'], severity: 'high' },
        { name: 'Payment Status', patterns: ['payment', 'paid', 'outstanding'], severity: 'high' }
      ],
      '/work-schedule': [
        { name: 'Schedule Grid', patterns: ['schedule', 'calendar', 'grid'], severity: 'high' },
        { name: 'Staff Assignments', patterns: ['assignment', 'allocated'], severity: 'medium' }
      ]
    };

    return [...commonElements, ...(pageSpecificElements[pagePath] || [])];
  }

  getDataPatterns(pagePath) {
    const dataPatterns = {
      '/dashboard': [
        { name: 'User Count', patterns: [/\d+\s*(users?|staff|employees?)/i] },
        { name: 'Financial Data', patterns: [/\$\d+/, /total/i] },
        { name: 'Date Information', patterns: [/\d{1,2}\/\d{1,2}\/\d{4}/, /\d{4}-\d{2}-\d{2}/] }
      ],
      '/staff': [
        { name: 'Email Addresses', patterns: [/@\w+\.\w+/] },
        { name: 'Role Names', patterns: [/admin|manager|consultant|viewer/i] },
        { name: 'Staff Status', patterns: [/active|inactive/i] }
      ],
      '/payrolls': [
        { name: 'Payroll Amounts', patterns: [/\$\d+\.\d{2}/] },
        { name: 'Payroll Dates', patterns: [/\d{4}-\d{2}-\d{2}/] },
        { name: 'Processing Status', patterns: [/pending|processing|completed/i] }
      ],
      '/clients': [
        { name: 'Client Names', patterns: [/[A-Z][a-z]+\s+[A-Z][a-z]+/] },
        { name: 'Contact Info', patterns: [/@\w+\.\w+/, /\d{3}-\d{3}-\d{4}/] }
      ],
      '/billing': [
        { name: 'Invoice Numbers', patterns: [/INV-\d+/i] },
        { name: 'Billing Amounts', patterns: [/\$\d+\.\d{2}/] },
        { name: 'Payment Status', patterns: [/paid|unpaid|pending/i] }
      ]
    };

    return dataPatterns[pagePath] || [];
  }

  checkElementInContent(content, selector, patterns) {
    return patterns.some(pattern => 
      content.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  checkDataInContent(content, patterns) {
    return patterns.some(pattern => pattern.test(content));
  }

  async runLiveTest() {
    this.log('\n🚀 Starting Live UI Data Testing', 'info');
    this.log(`Testing server at: ${BASE_URL}`, 'info');

    // First check if server is running
    const serverRunning = await this.checkServerStatus();
    if (!serverRunning) {
      this.log('\n❌ Development server is not running or not accessible', 'critical');
      this.log('Please ensure the server is running with: pnpm dev', 'info');
      return this.results;
    }

    this.log('\n📋 Testing page accessibility and data display...', 'info');

    // Test each critical page
    for (const page of PAGES_TO_TEST) {
      await this.testPageAccess(page.path, page.name);
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Generate summary report
    this.generateReport();

    return this.results;
  }

  generateReport() {
    this.log('\n📊 LIVE UI TESTING REPORT', 'info');
    this.log('=' * 60);

    // Server status
    this.log(`\n🖥️  Development Server: ${this.results.serverRunning ? '✅ Running' : '❌ Not accessible'}`, 'info');

    // Overall statistics
    this.log(`\n📈 Test Summary:`);
    this.log(`   Total Pages: ${this.results.summary.totalPages}`);
    this.log(`   Accessible Pages: ${this.results.summary.accessiblePages}`);
    this.log(`   Pages with Data Issues: ${this.results.summary.pagesWithDataIssues}`);
    this.log(`   Total Issues Found: ${this.results.dataIssues.length + this.results.uiIssues.length}`);

    // Page-by-page results
    this.log(`\n📄 Page Results:`);
    Object.entries(this.results.pagesAccessible).forEach(([path, result]) => {
      const status = result.accessible ? '✅' : '❌';
      const authInfo = result.requiresAuth ? ' (requires auth)' : '';
      const issueCount = result.issues ? result.issues.length : 0;
      
      this.log(`   ${status} ${result.name}: ${issueCount} issues${authInfo}`);
    });

    // Critical issues
    const criticalIssues = [...this.results.dataIssues, ...this.results.uiIssues]
      .filter(issue => issue.severity === 'critical');
    
    if (criticalIssues.length > 0) {
      this.log(`\n🚨 Critical Issues:`);
      criticalIssues.forEach((issue, index) => {
        this.log(`   ${index + 1}. ${issue.page}: ${issue.message}`, 'critical');
      });
    }

    // Data issues
    const dataIssues = this.results.dataIssues.filter(issue => issue.type === 'data');
    if (dataIssues.length > 0) {
      this.log(`\n📊 Data Display Issues:`);
      dataIssues.slice(0, 10).forEach((issue, index) => {
        this.log(`   ${index + 1}. ${issue.page}: ${issue.message}`, 'data');
      });
      
      if (dataIssues.length > 10) {
        this.log(`   ... and ${dataIssues.length - 10} more data issues`, 'info');
      }
    }

    // Recommendations
    this.log(`\n💡 Next Steps:`);
    
    if (!this.results.serverRunning) {
      this.log(`   1. 🚨 Start development server: pnpm dev`, 'critical');
    } else if (this.results.summary.accessiblePages === 0) {
      this.log(`   1. 🚨 Check authentication - all pages redirecting to sign-in`, 'critical');
      this.log(`   2. Manual login test: ${BASE_URL}/sign-in`, 'info');
    } else {
      this.log(`   1. 🔍 Manual testing with credentials:`, 'info');
      Object.entries(TEST_USERS).forEach(([key, user]) => {
        this.log(`      - ${key}: ${user.email} / ${user.password}`, 'info');
      });
      
      if (this.results.summary.pagesWithDataIssues > 0) {
        this.log(`   2. 📊 Focus on pages with most data issues:`, 'data');
        
        const pageIssueCounts = {};
        this.results.dataIssues.forEach(issue => {
          pageIssueCounts[issue.page] = (pageIssueCounts[issue.page] || 0) + 1;
        });
        
        Object.entries(pageIssueCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3)
          .forEach(([page, count], index) => {
            this.log(`      ${index + 1}. ${page}: ${count} issues`, 'data');
          });
      }
      
      this.log(`   3. 🔧 Check browser console for JavaScript/GraphQL errors`, 'info');
    }

    // Save results
    try {
      fs.mkdirSync('test-results', { recursive: true });
      
      const reportFile = `test-results/live-ui-test-${Date.now()}.json`;
      fs.writeFileSync(reportFile, JSON.stringify(this.results, null, 2));
      
      this.log(`\n💾 Detailed results saved to: ${reportFile}`, 'success');
    } catch (error) {
      this.log(`Failed to save results: ${error.message}`, 'error');
    }

    this.log('\n🎯 Ready for manual testing!', 'success');
  }
}

// Run the live test
async function main() {
  const tester = new LiveUITester();
  const results = await tester.runLiveTest();
  
  // Final summary
  const issueCount = results.dataIssues.length + results.uiIssues.length;
  if (issueCount > 0) {
    console.log(`\n⚠️ Found ${issueCount} potential issues to investigate manually`);
  } else if (results.serverRunning) {
    console.log(`\n✅ All pages accessible - ready for detailed manual testing`);
  }
}

main().catch(console.error);

export { LiveUITester, TEST_USERS, PAGES_TO_TEST };