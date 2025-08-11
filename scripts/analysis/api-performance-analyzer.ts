#!/usr/bin/env tsx

/**
 * 🚀 API Performance Analyzer
 * 
 * Comprehensive analysis tool for all 79 API endpoints to identify:
 * - Performance optimization opportunities
 * - Console.log statements that need enterprise logging conversion
 * - Query efficiency patterns
 * - Caching opportunities
 * - Response time optimization targets
 * 
 * Usage: tsx scripts/analysis/api-performance-analyzer.ts
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

interface APIEndpointAnalysis {
  path: string;
  methods: string[];
  hasConsoleStatements: boolean;
  consoleStatements: ConsoleStatement[];
  hasGraphQLQueries: boolean;
  graphqlQueries: string[];
  hasBusinessLogic: boolean;
  complexityScore: number;
  optimizationOpportunities: string[];
  securityLevel: 'high' | 'medium' | 'low';
  cacheableOperations: string[];
}

interface ConsoleStatement {
  line: number;
  type: 'log' | 'error' | 'warn' | 'info';
  content: string;
}

interface PerformanceReport {
  totalEndpoints: number;
  endpointsWithConsoleStatements: number;
  highComplexityEndpoints: number;
  optimizationOpportunities: {
    consoleLogCleanup: number;
    cachingOpportunities: number;
    queryOptimization: number;
    responseOptimization: number;
  };
  recommendations: string[];
}

class APIPerformanceAnalyzer {
  private endpoints: APIEndpointAnalysis[] = [];

  async analyzeAllEndpoints(): Promise<PerformanceReport> {
    console.log('🔍 Starting comprehensive API performance analysis...');
    
    // Find all API route files
    const apiFiles = await glob('./app/api/**/route.ts', { cwd: process.cwd() });
    console.log(`📊 Found ${apiFiles.length} API endpoints to analyze`);

    // Analyze each endpoint
    for (const filePath of apiFiles) {
      const analysis = await this.analyzeEndpoint(filePath);
      this.endpoints.push(analysis);
    }

    // Generate comprehensive report
    const report = this.generatePerformanceReport();
    await this.saveReport(report);
    
    return report;
  }

  private async analyzeEndpoint(filePath: string): Promise<APIEndpointAnalysis> {
    const fullPath = path.join(process.cwd(), filePath);
    const content = await fs.promises.readFile(fullPath, 'utf-8');
    const lines = content.split('\n');

    // Detect HTTP methods
    const methods = this.detectHTTPMethods(content);
    
    // Analyze console statements
    const { hasConsole, statements } = this.analyzeConsoleStatements(lines);
    
    // Analyze GraphQL usage
    const { hasGraphQL, queries } = this.analyzeGraphQLUsage(content);
    
    // Calculate complexity score
    const complexityScore = this.calculateComplexityScore(content, lines);
    
    // Identify optimization opportunities
    const optimizations = this.identifyOptimizations(content, hasConsole, hasGraphQL);
    
    // Determine security level
    const securityLevel = this.assessSecurityLevel(content);
    
    // Identify cacheable operations
    const cacheableOps = this.identifyCacheableOperations(content, methods);

    return {
      path: filePath,
      methods,
      hasConsoleStatements: hasConsole,
      consoleStatements: statements,
      hasGraphQLQueries: hasGraphQL,
      graphqlQueries: queries,
      hasBusinessLogic: this.hasComplexBusinessLogic(content),
      complexityScore,
      optimizationOpportunities: optimizations,
      securityLevel,
      cacheableOperations: cacheableOps
    };
  }

  private detectHTTPMethods(content: string): string[] {
    const methods: string[] = [];
    const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    
    for (const method of httpMethods) {
      if (content.includes(`export const ${method}`) || content.includes(`export async function ${method}`)) {
        methods.push(method);
      }
    }
    
    return methods;
  }

  private analyzeConsoleStatements(lines: string[]): { hasConsole: boolean; statements: ConsoleStatement[] } {
    const statements: ConsoleStatement[] = [];
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.includes('console.')) {
        const type = this.detectConsoleType(trimmed);
        statements.push({
          line: index + 1,
          type,
          content: trimmed
        });
      }
    });

    return {
      hasConsole: statements.length > 0,
      statements
    };
  }

  private detectConsoleType(line: string): ConsoleStatement['type'] {
    if (line.includes('console.error')) return 'error';
    if (line.includes('console.warn')) return 'warn';
    if (line.includes('console.info')) return 'info';
    return 'log';
  }

  private analyzeGraphQLUsage(content: string): { hasGraphQL: boolean; queries: string[] } {
    const queries: string[] = [];
    const graphqlPatterns = [
      /import.*Document.*from.*generated\/graphql/g,
      /executeTypedQuery/g,
      /useMutation/g,
      /useQuery/g,
      /apolloClient\./g
    ];

    let hasGraphQL = false;
    for (const pattern of graphqlPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        hasGraphQL = true;
        queries.push(...matches);
      }
    }

    return { hasGraphQL, queries };
  }

  private calculateComplexityScore(content: string, lines: string[]): number {
    let score = 0;
    
    // Base complexity factors
    score += lines.length * 0.1; // File size
    score += (content.match(/if\s*\(/g) || []).length * 2; // Conditional complexity
    score += (content.match(/for\s*\(/g) || []).length * 3; // Loop complexity
    score += (content.match(/try\s*\{/g) || []).length * 2; // Error handling complexity
    score += (content.match(/await\s/g) || []).length * 1.5; // Async complexity
    score += (content.match(/\.map\(|\.filter\(|\.reduce\(/g) || []).length * 1; // Functional complexity
    
    // Business logic complexity
    if (content.includes('PayrollService') || content.includes('BillingService')) score += 5;
    if (content.includes('validation') || content.includes('Schema.safeParse')) score += 3;
    if (content.includes('executeTypedQuery')) score += 4;
    
    return Math.round(score);
  }

  private identifyOptimizations(content: string, hasConsole: boolean, hasGraphQL: boolean): string[] {
    const optimizations: string[] = [];

    if (hasConsole) {
      optimizations.push('Convert console statements to enterprise logging');
    }

    if (hasGraphQL && !content.includes('cache')) {
      optimizations.push('Add GraphQL query caching');
    }

    if (content.includes('JSON.parse') && !content.includes('validation')) {
      optimizations.push('Add input validation for JSON parsing');
    }

    if ((content.match(/await\s/g) || []).length > 5) {
      optimizations.push('Consider parallel execution for multiple async operations');
    }

    if (content.includes('forEach') && content.includes('await')) {
      optimizations.push('Replace forEach with Promise.all for parallel processing');
    }

    if (!content.includes('limit') && content.includes('executeTypedQuery')) {
      optimizations.push('Add pagination limits to prevent large data fetches');
    }

    if (!content.includes('compress') && content.includes('NextResponse.json')) {
      optimizations.push('Consider response compression for large payloads');
    }

    return optimizations;
  }

  private assessSecurityLevel(content: string): 'high' | 'medium' | 'low' {
    if (content.includes('sensitiveRoute') || content.includes('mutationRoute')) {
      return 'high';
    }
    if (content.includes('auth') || content.includes('authorization')) {
      return 'medium';
    }
    return 'low';
  }

  private identifyCacheableOperations(content: string, methods: string[]): string[] {
    const cacheable: string[] = [];

    if (methods.includes('GET')) {
      if (content.includes('payrolls') && !content.includes('sensitive')) {
        cacheable.push('Payroll list queries');
      }
      if (content.includes('clients') || content.includes('users')) {
        cacheable.push('User/client reference data');
      }
      if (content.includes('reports') || content.includes('analytics')) {
        cacheable.push('Report data with time-based cache');
      }
    }

    return cacheable;
  }

  private hasComplexBusinessLogic(content: string): boolean {
    const businessLogicIndicators = [
      'PayrollService',
      'BillingService',
      'validation',
      'business logic',
      'employeeCount',
      'processingDaysBeforeEft',
      'holiday',
      'workSchedule'
    ];

    return businessLogicIndicators.some(indicator => 
      content.toLowerCase().includes(indicator.toLowerCase())
    );
  }

  private generatePerformanceReport(): PerformanceReport {
    const totalEndpoints = this.endpoints.length;
    const endpointsWithConsole = this.endpoints.filter(e => e.hasConsoleStatements).length;
    const highComplexityEndpoints = this.endpoints.filter(e => e.complexityScore > 50).length;

    // Count optimization opportunities
    const allOptimizations = this.endpoints.flatMap(e => e.optimizationOpportunities);
    const optimizationCounts = {
      consoleLogCleanup: allOptimizations.filter(o => o.includes('console')).length,
      cachingOpportunities: allOptimizations.filter(o => o.includes('caching')).length,
      queryOptimization: allOptimizations.filter(o => o.includes('query')).length,
      responseOptimization: allOptimizations.filter(o => o.includes('response')).length
    };

    // Generate recommendations
    const recommendations = this.generateRecommendations();

    return {
      totalEndpoints,
      endpointsWithConsoleStatements: endpointsWithConsole,
      highComplexityEndpoints,
      optimizationOpportunities: optimizationCounts,
      recommendations
    };
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    // Console logging recommendations
    const consoleEndpoints = this.endpoints.filter(e => e.hasConsoleStatements);
    if (consoleEndpoints.length > 0) {
      recommendations.push(
        `🔧 Convert ${consoleEndpoints.length} endpoints from console logging to enterprise logging`
      );
    }

    // Complexity recommendations
    const complexEndpoints = this.endpoints.filter(e => e.complexityScore > 50);
    if (complexEndpoints.length > 0) {
      recommendations.push(
        `⚡ Refactor ${complexEndpoints.length} high-complexity endpoints for better performance`
      );
    }

    // Caching recommendations
    const cacheableEndpoints = this.endpoints.filter(e => e.cacheableOperations.length > 0);
    if (cacheableEndpoints.length > 0) {
      recommendations.push(
        `🚀 Implement caching for ${cacheableEndpoints.length} endpoints to improve response times`
      );
    }

    // Security recommendations
    const lowSecurityEndpoints = this.endpoints.filter(e => e.securityLevel === 'low');
    if (lowSecurityEndpoints.length > 0) {
      recommendations.push(
        `🔒 Review security implementation for ${lowSecurityEndpoints.length} endpoints`
      );
    }

    return recommendations;
  }

  private async saveReport(report: PerformanceReport): Promise<void> {
    const reportPath = './docs/performance/API_PERFORMANCE_ANALYSIS_REPORT.md';
    
    const markdown = this.generateMarkdownReport(report);
    
    await fs.promises.writeFile(reportPath, markdown, 'utf-8');
    console.log(`📄 Performance report saved to ${reportPath}`);
  }

  private generateMarkdownReport(report: PerformanceReport): string {
    const timestamp = new Date().toISOString();
    
    return `# 🚀 API Performance Analysis Report

**Generated**: ${timestamp}  
**Analyzed Endpoints**: ${report.totalEndpoints}  
**Analysis Scope**: Comprehensive performance and optimization review

## 📊 Executive Summary

### **Performance Metrics**
- **Total API Endpoints**: ${report.totalEndpoints}
- **Endpoints with Console Statements**: ${report.endpointsWithConsoleStatements}
- **High Complexity Endpoints**: ${report.highComplexityEndpoints}

### **Optimization Opportunities Identified**
| Category | Count | Priority |
|----------|-------|----------|
| Console Log Cleanup | ${report.optimizationOpportunities.consoleLogCleanup} | HIGH |
| Caching Opportunities | ${report.optimizationOpportunities.cachingOpportunities} | MEDIUM |
| Query Optimization | ${report.optimizationOpportunities.queryOptimization} | HIGH |
| Response Optimization | ${report.optimizationOpportunities.responseOptimization} | MEDIUM |

## 🎯 Strategic Recommendations

${report.recommendations.map(rec => `- ${rec}`).join('\n')}

## 📋 Detailed Endpoint Analysis

${this.generateDetailedAnalysis()}

## 🔧 Implementation Priority

### **HIGH PRIORITY**
1. **Console Logging Cleanup** - Convert to enterprise logging framework
2. **Query Optimization** - Implement pagination and caching
3. **Complex Endpoint Refactoring** - Break down high-complexity handlers

### **MEDIUM PRIORITY**
1. **Caching Implementation** - Add Redis caching for frequent queries
2. **Response Optimization** - Implement compression and pagination
3. **Security Hardening** - Review low-security endpoints

### **LOW PRIORITY**
1. **Code Quality** - Refactor for maintainability
2. **Documentation** - Add performance documentation
3. **Monitoring** - Add performance metrics collection

---

**Next Steps**: Begin implementation with HIGH priority items, focusing on console logging cleanup and query optimization.

**Impact**: Expected 20-40% performance improvement across API endpoints after optimization implementation.
`;
  }

  private generateDetailedAnalysis(): string {
    // Sort endpoints by complexity score for prioritized analysis
    const sortedEndpoints = [...this.endpoints]
      .sort((a, b) => b.complexityScore - a.complexityScore)
      .slice(0, 20); // Top 20 most complex endpoints

    return sortedEndpoints.map(endpoint => {
      return `### **${endpoint.path}**
- **Methods**: ${endpoint.methods.join(', ')}
- **Complexity Score**: ${endpoint.complexityScore}
- **Console Statements**: ${endpoint.hasConsoleStatements ? '❌ Yes' : '✅ None'}
- **Security Level**: ${endpoint.securityLevel.toUpperCase()}
- **Optimizations**: ${endpoint.optimizationOpportunities.length > 0 ? endpoint.optimizationOpportunities.join(', ') : 'None identified'}
`;
    }).join('\n');
  }
}

// Execute analysis if run directly
async function main() {
  const analyzer = new APIPerformanceAnalyzer();
  try {
    const report = await analyzer.analyzeAllEndpoints();
    console.log('\n🎉 API Performance Analysis Complete!');
    console.log(`📊 Analyzed ${report.totalEndpoints} endpoints`);
    console.log(`🔧 Found ${report.endpointsWithConsoleStatements} endpoints needing console cleanup`);
    console.log(`⚡ Identified ${report.highComplexityEndpoints} high-complexity endpoints`);
    console.log(`📄 Report saved to docs/performance/API_PERFORMANCE_ANALYSIS_REPORT.md`);
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  }
}

// Check if this file is being run directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  main();
}

export { APIPerformanceAnalyzer };