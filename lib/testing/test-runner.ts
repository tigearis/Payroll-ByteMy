// lib/testing/test-runner.ts
import { logger, DataClassification } from '@/lib/logging/enterprise-logger';
import { payrollApiTestSuite } from '@/tests/integration/api/payroll-api-tests';
import { payrollWorkflowE2ETestSuite } from '@/tests/integration/e2e/payroll-workflow-tests';
import { optimizationSystemsTestSuite } from '@/tests/integration/performance/optimization-systems-tests';
import { integrationTestFramework, TestResult } from './integration-test-framework';

// ====================================================================
// COMPREHENSIVE TEST RUNNER
// Orchestrates all integration test suites with detailed reporting
// Performance analytics and business impact assessment
// ====================================================================

interface TestRunConfiguration {
  suites: string[];
  parallel: boolean;
  continueOnFailure: boolean;
  generateReport: boolean;
  reportFormat: 'json' | 'html' | 'both';
  outputDirectory: string;
  performanceThresholds: {
    maxFailureRate: number;
    maxAverageResponseTime: number;
    minThroughput: number;
  };
}

interface TestRunSummary {
  runId: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  configuration: TestRunConfiguration;
  suites: {
    suiteId: string;
    suiteName: string;
    results: TestResult[];
    summary: {
      total: number;
      passed: number;
      failed: number;
      skipped: number;
      passRate: number;
      averageDuration: number;
    };
    performance: {
      averageResponseTime: number;
      totalThroughput: number;
      errorRate: number;
    };
  }[];
  overallSummary: {
    totalTests: number;
    totalPassed: number;
    totalFailed: number;
    totalSkipped: number;
    overallPassRate: number;
    totalDuration: number;
    averageTestDuration: number;
  };
  performanceAnalysis: {
    apiPerformance: {
      averageResponseTime: number;
      throughput: number;
      errorRate: number;
    };
    optimizationValidation: {
      systemsValidated: number;
      averageImprovement: number;
      performanceTargetsMet: number;
    };
    e2eWorkflows: {
      workflowsCompleted: number;
      averageWorkflowTime: number;
      businessProcessSuccess: number;
    };
  };
  businessImpactAnalysis: {
    criticalIssuesFound: number;
    performanceRegressions: number;
    optimizationValidations: number;
    businessProcessCoverage: number;
  };
  recommendations: string[];
}

class IntegrationTestRunner {
  private runId: string;
  private startTime: Date;
  private results: Map<string, TestResult[]> = new Map();
  
  constructor() {
    this.runId = `test-run-${Date.now()}`;
    this.startTime = new Date();
  }

  /**
   * Execute all registered test suites
   */
  async runAllTests(config: Partial<TestRunConfiguration> = {}): Promise<TestRunSummary> {
    const configuration: TestRunConfiguration = {
      suites: ['payroll-api-tests', 'optimization-systems-performance', 'payroll-workflow-e2e'],
      parallel: false,
      continueOnFailure: true,
      generateReport: true,
      reportFormat: 'both',
      outputDirectory: './test-reports',
      performanceThresholds: {
        maxFailureRate: 5, // 5% max failure rate
        maxAverageResponseTime: 2000, // 2 seconds max average
        minThroughput: 10 // 10 requests/sec minimum
      },
      ...config
    };

    logger.info('Starting comprehensive integration test run', {
      namespace: 'integration_test_runner',
      operation: 'run_start',
      classification: DataClassification.INTERNAL,
      metadata: {
        runId: this.runId,
        configuration,
        timestamp: new Date().toISOString()
      }
    });

    const suiteResults: TestRunSummary['suites'] = [];

    try {
      // Execute test suites
      if (configuration.parallel) {
        // Parallel execution
        const suitePromises = configuration.suites.map(suiteId => 
          this.executeSuite(suiteId).catch(error => {
            logger.error('Test suite execution failed', {
              namespace: 'integration_test_runner',
              operation: 'suite_execution_error',
              classification: DataClassification.INTERNAL,
              error: error.message,
              metadata: { suiteId, runId: this.runId }
            });
            
            if (!configuration.continueOnFailure) {
              throw error;
            }
            return [];
          })
        );

        const allResults = await Promise.all(suitePromises);
        
        configuration.suites.forEach((suiteId, index) => {
          if (allResults[index]) {
            this.results.set(suiteId, allResults[index]);
          }
        });
      } else {
        // Sequential execution
        for (const suiteId of configuration.suites) {
          try {
            const results = await this.executeSuite(suiteId);
            this.results.set(suiteId, results);
          } catch (error) {
            logger.error('Test suite execution failed', {
              namespace: 'integration_test_runner',
              operation: 'suite_execution_error',
              classification: DataClassification.INTERNAL,
              error: error instanceof Error ? error.message : String(error),
              metadata: { suiteId, runId: this.runId }
            });

            if (!configuration.continueOnFailure) {
              throw error;
            }
          }
        }
      }

      // Process results for each suite
      for (const [suiteId, results] of this.results) {
        const suiteName = this.getSuiteName(suiteId);
        
        const summary = {
          total: results.length,
          passed: results.filter(r => r.status === 'passed').length,
          failed: results.filter(r => r.status === 'failed').length,
          skipped: results.filter(r => r.status === 'skipped').length,
          passRate: results.length > 0 ? (results.filter(r => r.status === 'passed').length / results.length) * 100 : 0,
          averageDuration: results.length > 0 ? results.reduce((sum, r) => sum + r.duration, 0) / results.length : 0
        };

        const performance = {
          averageResponseTime: this.calculateAverageResponseTime(results),
          totalThroughput: this.calculateTotalThroughput(results),
          errorRate: this.calculateErrorRate(results)
        };

        suiteResults.push({
          suiteId,
          suiteName,
          results,
          summary,
          performance
        });
      }

      // Generate comprehensive test run summary
      const endTime = new Date();
      const testRunSummary = this.generateTestRunSummary(
        configuration,
        suiteResults,
        endTime
      );

      // Generate reports if requested
      if (configuration.generateReport) {
        await this.generateReports(testRunSummary, configuration);
      }

      logger.info('Integration test run completed', {
        namespace: 'integration_test_runner',
        operation: 'run_complete',
        classification: DataClassification.INTERNAL,
        metadata: {
          runId: this.runId,
          duration: testRunSummary.duration,
          totalTests: testRunSummary.overallSummary.totalTests,
          passRate: testRunSummary.overallSummary.overallPassRate,
          timestamp: endTime.toISOString()
        }
      });

      return testRunSummary;

    } catch (error) {
      logger.error('Integration test run failed', {
        namespace: 'integration_test_runner',
        operation: 'run_error',
        classification: DataClassification.INTERNAL,
        error: error instanceof Error ? error.message : String(error),
        metadata: { runId: this.runId }
      });

      throw error;
    }
  }

  /**
   * Execute a specific test suite
   */
  private async executeSuite(suiteId: string): Promise<TestResult[]> {
    logger.info('Executing test suite', {
      namespace: 'integration_test_runner',
      operation: 'suite_execution_start',
      classification: DataClassification.INTERNAL,
      metadata: { suiteId, runId: this.runId }
    });

    const results = await integrationTestFramework.executeSuite(suiteId);

    logger.info('Test suite execution completed', {
      namespace: 'integration_test_runner',
      operation: 'suite_execution_complete',
      classification: DataClassification.INTERNAL,
      metadata: {
        suiteId,
        runId: this.runId,
        totalTests: results.length,
        passedTests: results.filter(r => r.status === 'passed').length,
        failedTests: results.filter(r => r.status === 'failed').length
      }
    });

    return results;
  }

  /**
   * Generate comprehensive test run summary
   */
  private generateTestRunSummary(
    configuration: TestRunConfiguration,
    suiteResults: TestRunSummary['suites'],
    endTime: Date
  ): TestRunSummary {
    const duration = endTime.getTime() - this.startTime.getTime();
    
    // Calculate overall summary
    const totalTests = suiteResults.reduce((sum, suite) => sum + suite.summary.total, 0);
    const totalPassed = suiteResults.reduce((sum, suite) => sum + suite.summary.passed, 0);
    const totalFailed = suiteResults.reduce((sum, suite) => sum + suite.summary.failed, 0);
    const totalSkipped = suiteResults.reduce((sum, suite) => sum + suite.summary.skipped, 0);
    const overallPassRate = totalTests > 0 ? (totalPassed / totalTests) * 100 : 0;
    const averageTestDuration = totalTests > 0 
      ? suiteResults.reduce((sum, suite) => sum + (suite.summary.averageDuration * suite.summary.total), 0) / totalTests 
      : 0;

    // Performance analysis
    const apiSuite = suiteResults.find(s => s.suiteId === 'payroll-api-tests');
    const optimizationSuite = suiteResults.find(s => s.suiteId === 'optimization-systems-performance');
    const e2eSuite = suiteResults.find(s => s.suiteId === 'payroll-workflow-e2e');

    const performanceAnalysis = {
      apiPerformance: {
        averageResponseTime: apiSuite?.performance.averageResponseTime || 0,
        throughput: apiSuite?.performance.totalThroughput || 0,
        errorRate: apiSuite?.performance.errorRate || 0
      },
      optimizationValidation: {
        systemsValidated: optimizationSuite?.results.length || 0,
        averageImprovement: this.calculateAverageImprovement(optimizationSuite?.results || []),
        performanceTargetsMet: this.calculateTargetsMet(optimizationSuite?.results || [])
      },
      e2eWorkflows: {
        workflowsCompleted: e2eSuite?.summary.passed || 0,
        averageWorkflowTime: e2eSuite?.summary.averageDuration || 0,
        businessProcessSuccess: e2eSuite?.summary.passRate || 0
      }
    };

    // Business impact analysis
    const businessImpactAnalysis = {
      criticalIssuesFound: suiteResults.reduce((sum, suite) => 
        sum + suite.results.filter(r => 
          r.status === 'failed' && 
          r.metadata.priority === 'critical'
        ).length, 0),
      performanceRegressions: suiteResults.reduce((sum, suite) =>
        sum + suite.results.filter(r =>
          r.performance && 
          r.performance.responseTime > configuration.performanceThresholds.maxAverageResponseTime
        ).length, 0),
      optimizationValidations: optimizationSuite?.summary.passed || 0,
      businessProcessCoverage: Math.round(((e2eSuite?.summary.passed || 0) / Math.max(1, e2eSuite?.summary.total || 1)) * 100)
    };

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      suiteResults,
      performanceAnalysis,
      businessImpactAnalysis,
      configuration
    );

    return {
      runId: this.runId,
      startTime: this.startTime,
      endTime,
      duration,
      configuration,
      suites: suiteResults,
      overallSummary: {
        totalTests,
        totalPassed,
        totalFailed,
        totalSkipped,
        overallPassRate: Math.round(overallPassRate * 100) / 100,
        totalDuration: duration,
        averageTestDuration: Math.round(averageTestDuration)
      },
      performanceAnalysis,
      businessImpactAnalysis,
      recommendations
    };
  }

  /**
   * Generate recommendations based on test results
   */
  private generateRecommendations(
    suiteResults: TestRunSummary['suites'],
    performanceAnalysis: TestRunSummary['performanceAnalysis'],
    businessImpactAnalysis: TestRunSummary['businessImpactAnalysis'],
    configuration: TestRunConfiguration
  ): string[] {
    const recommendations: string[] = [];

    // Performance recommendations
    if (performanceAnalysis.apiPerformance.averageResponseTime > configuration.performanceThresholds.maxAverageResponseTime) {
      recommendations.push(`API response times averaging ${Math.round(performanceAnalysis.apiPerformance.averageResponseTime)}ms exceed threshold of ${configuration.performanceThresholds.maxAverageResponseTime}ms. Consider optimizing slow queries.`);
    }

    if (performanceAnalysis.apiPerformance.throughput < configuration.performanceThresholds.minThroughput) {
      recommendations.push(`API throughput of ${Math.round(performanceAnalysis.apiPerformance.throughput)} requests/sec is below minimum of ${configuration.performanceThresholds.minThroughput}. Consider connection pool optimization.`);
    }

    // Critical issue recommendations
    if (businessImpactAnalysis.criticalIssuesFound > 0) {
      recommendations.push(`${businessImpactAnalysis.criticalIssuesFound} critical issue(s) found. Address these immediately before production deployment.`);
    }

    // Performance regression recommendations
    if (businessImpactAnalysis.performanceRegressions > 0) {
      recommendations.push(`${businessImpactAnalysis.performanceRegressions} performance regression(s) detected. Review recent changes and optimization systems.`);
    }

    // Test coverage recommendations
    const overallPassRate = suiteResults.reduce((sum, s) => sum + s.summary.passRate, 0) / suiteResults.length;
    if (overallPassRate < 95) {
      recommendations.push(`Overall test pass rate of ${Math.round(overallPassRate)}% is below recommended 95%. Review failing tests and improve system reliability.`);
    }

    // Optimization system recommendations
    if (performanceAnalysis.optimizationValidation.systemsValidated < 5) {
      recommendations.push(`Only ${performanceAnalysis.optimizationValidation.systemsValidated} optimization systems validated. Increase test coverage for all 11 optimization systems.`);
    }

    // Business process recommendations
    if (performanceAnalysis.e2eWorkflows.businessProcessSuccess < 90) {
      recommendations.push(`Business process success rate of ${Math.round(performanceAnalysis.e2eWorkflows.businessProcessSuccess)}% needs improvement. Review end-to-end workflow reliability.`);
    }

    // If no issues found
    if (recommendations.length === 0) {
      recommendations.push('All tests passed successfully with excellent performance. System is ready for production deployment.');
    }

    return recommendations;
  }

  /**
   * Generate detailed test reports
   */
  private async generateReports(
    summary: TestRunSummary,
    configuration: TestRunConfiguration
  ): Promise<void> {
    const outputDir = configuration.outputDirectory;
    
    // Ensure output directory exists
    const fs = await import('fs');
    const path = await import('path');
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate JSON report
    if (configuration.reportFormat === 'json' || configuration.reportFormat === 'both') {
      const jsonReport = JSON.stringify(summary, null, 2);
      const jsonPath = path.join(outputDir, `integration-test-report-${this.runId}.json`);
      fs.writeFileSync(jsonPath, jsonReport);
      
      logger.info('JSON test report generated', {
        namespace: 'integration_test_runner',
        operation: 'json_report_generated',
        classification: DataClassification.INTERNAL,
        metadata: { reportPath: jsonPath, runId: this.runId }
      });
    }

    // Generate HTML report
    if (configuration.reportFormat === 'html' || configuration.reportFormat === 'both') {
      const htmlReport = this.generateHtmlReport(summary);
      const htmlPath = path.join(outputDir, `integration-test-report-${this.runId}.html`);
      fs.writeFileSync(htmlPath, htmlReport);
      
      logger.info('HTML test report generated', {
        namespace: 'integration_test_runner',
        operation: 'html_report_generated',
        classification: DataClassification.INTERNAL,
        metadata: { reportPath: htmlPath, runId: this.runId }
      });
    }
  }

  /**
   * Generate HTML report
   */
  private generateHtmlReport(summary: TestRunSummary): string {
    const passColor = summary.overallSummary.overallPassRate >= 95 ? '#10B981' : 
                     summary.overallSummary.overallPassRate >= 80 ? '#F59E0B' : '#EF4444';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Integration Test Report - ${summary.runId}</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            margin: 0; 
            padding: 20px; 
            background-color: #f8fafc;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { 
            background: white; 
            padding: 30px; 
            border-radius: 12px; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        .summary-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
            gap: 20px; 
            margin-bottom: 30px; 
        }
        .summary-card { 
            background: white; 
            padding: 25px; 
            border-radius: 12px; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .metric { 
            font-size: 2.5rem; 
            font-weight: bold; 
            margin: 10px 0; 
            color: ${passColor};
        }
        .suite-section { 
            background: white; 
            margin-bottom: 30px; 
            border-radius: 12px; 
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .suite-header { 
            background: #f1f5f9; 
            padding: 20px 30px; 
            border-bottom: 1px solid #e2e8f0;
        }
        .suite-content { padding: 30px; }
        .test-row { 
            display: flex; 
            justify-content: space-between; 
            align-items: center;
            padding: 15px 0; 
            border-bottom: 1px solid #f1f5f9;
        }
        .test-row:last-child { border-bottom: none; }
        .status-passed { color: #10B981; font-weight: bold; }
        .status-failed { color: #EF4444; font-weight: bold; }
        .status-skipped { color: #6B7280; font-weight: bold; }
        .recommendations { 
            background: #FEF3C7; 
            border: 1px solid #F59E0B;
            border-radius: 8px; 
            padding: 20px; 
            margin-top: 20px; 
        }
        .recommendation { 
            margin: 10px 0; 
            padding: 10px; 
            background: white; 
            border-radius: 6px;
        }
        .performance-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .performance-metric {
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        }
        .performance-value {
            font-size: 1.5rem;
            font-weight: bold;
            color: #374151;
        }
        .performance-label {
            font-size: 0.875rem;
            color: #6B7280;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Integration Test Report</h1>
            <p><strong>Run ID:</strong> ${summary.runId}</p>
            <p><strong>Duration:</strong> ${Math.round(summary.duration / 1000)}s</p>
            <p><strong>Executed:</strong> ${summary.startTime.toLocaleString()}</p>
        </div>

        <div class="summary-grid">
            <div class="summary-card">
                <h3>Overall Results</h3>
                <div class="metric">${summary.overallSummary.overallPassRate.toFixed(1)}%</div>
                <p>Pass Rate</p>
                <p>${summary.overallSummary.totalPassed}/${summary.overallSummary.totalTests} tests passed</p>
            </div>
            
            <div class="summary-card">
                <h3>Performance</h3>
                <div class="metric">${Math.round(summary.performanceAnalysis.apiPerformance.averageResponseTime)}ms</div>
                <p>Avg Response Time</p>
                <p>${Math.round(summary.performanceAnalysis.apiPerformance.throughput)} req/sec throughput</p>
            </div>
            
            <div class="summary-card">
                <h3>Business Impact</h3>
                <div class="metric">${summary.businessImpactAnalysis.optimizationValidations}</div>
                <p>Systems Validated</p>
                <p>${summary.businessImpactAnalysis.criticalIssuesFound} critical issues</p>
            </div>
        </div>

        ${summary.suites.map(suite => `
            <div class="suite-section">
                <div class="suite-header">
                    <h2>${suite.suiteName}</h2>
                    <div class="performance-grid">
                        <div class="performance-metric">
                            <div class="performance-value">${suite.summary.passRate.toFixed(1)}%</div>
                            <div class="performance-label">Pass Rate</div>
                        </div>
                        <div class="performance-metric">
                            <div class="performance-value">${Math.round(suite.performance.averageResponseTime)}ms</div>
                            <div class="performance-label">Avg Response</div>
                        </div>
                        <div class="performance-metric">
                            <div class="performance-value">${Math.round(suite.performance.totalThroughput)}</div>
                            <div class="performance-label">Throughput</div>
                        </div>
                        <div class="performance-metric">
                            <div class="performance-value">${suite.performance.errorRate.toFixed(1)}%</div>
                            <div class="performance-label">Error Rate</div>
                        </div>
                    </div>
                </div>
                <div class="suite-content">
                    ${suite.results.map(test => `
                        <div class="test-row">
                            <div>
                                <strong>${test.testName}</strong>
                                <br><small>${test.description || 'No description'}</small>
                            </div>
                            <div style="text-align: right;">
                                <span class="status-${test.status}">${test.status.toUpperCase()}</span>
                                <br><small>${Math.round(test.duration)}ms</small>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('')}

        <div class="recommendations">
            <h3>Recommendations</h3>
            ${summary.recommendations.map(rec => `
                <div class="recommendation">${rec}</div>
            `).join('')}
        </div>
    </div>
</body>
</html>`;
  }

  // Helper methods
  private getSuiteName(suiteId: string): string {
    const suiteNames = {
      'payroll-api-tests': 'Payroll API Tests',
      'optimization-systems-performance': 'Optimization Systems Performance Tests',
      'payroll-workflow-e2e': 'Payroll Workflow E2E Tests'
    };
    return suiteNames[suiteId] || suiteId;
  }

  private calculateAverageResponseTime(results: TestResult[]): number {
    const testsWithPerformance = results.filter(r => r.performance?.responseTime);
    if (testsWithPerformance.length === 0) return 0;
    
    return testsWithPerformance.reduce((sum, r) => sum + r.performance!.responseTime, 0) / testsWithPerformance.length;
  }

  private calculateTotalThroughput(results: TestResult[]): number {
    const testsWithPerformance = results.filter(r => r.performance?.throughput);
    if (testsWithPerformance.length === 0) return 0;
    
    return testsWithPerformance.reduce((sum, r) => sum + r.performance!.throughput, 0);
  }

  private calculateErrorRate(results: TestResult[]): number {
    const testsWithPerformance = results.filter(r => r.performance?.errorRate !== undefined);
    if (testsWithPerformance.length === 0) return 0;
    
    return testsWithPerformance.reduce((sum, r) => sum + r.performance!.errorRate, 0) / testsWithPerformance.length;
  }

  private calculateAverageImprovement(results: TestResult[]): number {
    const improvementTests = results.filter(r => 
      r.metadata && typeof r.metadata.performanceImprovement === 'number'
    );
    
    if (improvementTests.length === 0) return 0;
    
    return improvementTests.reduce((sum, r) => sum + r.metadata.performanceImprovement, 0) / improvementTests.length;
  }

  private calculateTargetsMet(results: TestResult[]): number {
    return results.filter(r => r.status === 'passed').length;
  }
}

// Export singleton instance
export const testRunner = new IntegrationTestRunner();

// Export types
export type {
  TestRunConfiguration,
  TestRunSummary
};