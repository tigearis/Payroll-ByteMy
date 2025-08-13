"use client";

import {
  BarChart3,
  TrendingUp,
  Users,
  Brain,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Settings,
  Target,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/patterns/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BusinessIntelligenceDashboard } from "@/domains/billing/components/reporting/business-intelligence-dashboard";
import { ClientProfitabilityAnalyzer } from "@/domains/billing/components/reporting/client-profitability-analyzer";
import { FinancialPerformanceDashboard } from "@/domains/billing/components/reporting/financial-performance-dashboard";

export default function BillingReportsPage() {
  const [selectedDateRange, setSelectedDateRange] = useState("30d");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>("all");

  // Calculate date range based on selection
  const getDateRange = () => {
    const end = new Date();
    const start = new Date();

    switch (selectedDateRange) {
      case "7d":
        start.setDate(end.getDate() - 7);
        break;
      case "30d":
        start.setDate(end.getDate() - 30);
        break;
      case "90d":
        start.setDate(end.getDate() - 90);
        break;
      case "1y":
        start.setFullYear(end.getFullYear() - 1);
        break;
      default:
        start.setDate(end.getDate() - 30);
    }

    return {
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
    };
  };

  const dateRange = getDateRange();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title="Advanced Analytics & Reports"
        description="Comprehensive business intelligence and financial performance analytics"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Billing", href: "/billing" },
          { label: "Reports" },
        ]}
        metadata={[
          {
            label: "Automation Rate",
            value: (
              <span className="inline-flex items-center gap-1">
                <Target className="w-3 h-3" /> 90%
              </span>
            ) as any,
          },
          {
            label: "Growth YTD",
            value: (
              <span className="inline-flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> 24%
              </span>
            ) as any,
          },
        ]}
      />

      {/* Global Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Date Range:</span>
              </div>
              <Select
                value={selectedDateRange}
                onValueChange={setSelectedDateRange}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Client:</span>
              </div>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  <SelectItem value="enterprise">Enterprise Clients</SelectItem>
                  <SelectItem value="sme">SME Clients</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={autoRefresh ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`}
                />
                Auto Refresh
              </Button>

              <Button variant="outline" size="sm" onClick={() => window.dispatchEvent(new CustomEvent('billing-reports:export'))}>
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>

              <Button variant="outline" size="sm" onClick={() => window.location.assign('/settings') }>
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  System Efficiency
                </p>
                <p className="text-3xl font-bold text-blue-600">89%</p>
                <p className="text-xs text-gray-500">Billing automation rate</p>
              </div>
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <Zap className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Cost Savings
                </p>
                <p className="text-3xl font-bold text-green-600">$2.3K</p>
                <p className="text-xs text-gray-500">Monthly savings</p>
              </div>
              <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Client Satisfaction
                </p>
                <p className="text-3xl font-bold text-purple-600">96%</p>
                <p className="text-xs text-gray-500">Based on feedback</p>
              </div>
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Error Rate</p>
                <p className="text-3xl font-bold text-orange-600">0.3%</p>
                <p className="text-xs text-gray-500">94% reduction</p>
              </div>
              <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                <Target className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Reports Tabs */}
      <Tabs defaultValue="financial" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Financial Performance
          </TabsTrigger>
          <TabsTrigger
            value="profitability"
            className="flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Client Profitability
          </TabsTrigger>
          <TabsTrigger value="intelligence" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Business Intelligence
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Automation Metrics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="financial">
          <FinancialPerformanceDashboard
            dateRange={dateRange}
            {...(selectedClient !== "all" && { clientId: selectedClient })}
            showFilters={true}
          />
        </TabsContent>

        <TabsContent value="profitability">
          <ClientProfitabilityAnalyzer
            dateRange={dateRange}
            showFilters={true}
          />
        </TabsContent>

        <TabsContent value="intelligence">
          <BusinessIntelligenceDashboard
            dateRange={dateRange}
            autoRefresh={autoRefresh}
          />
        </TabsContent>

        <TabsContent value="automation">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Semi-Automated Billing Impact</CardTitle>
                <CardDescription>
                  Comprehensive impact analysis of the automated billing system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Impact Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg bg-blue-50">
                      <div className="text-3xl font-bold text-blue-600">
                        90%
                      </div>
                      <div className="text-sm text-blue-800">
                        Manual Work Reduced
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        From Excel to Automation
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg bg-green-50">
                      <div className="text-3xl font-bold text-green-600">
                        5x
                      </div>
                      <div className="text-sm text-green-800">
                        Faster Processing
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        Time to Invoice
                      </div>
                    </div>
                  </div>

                  {/* Monthly Savings Breakdown */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">
                      Monthly Cost Savings Breakdown
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Labor Cost Reduction</span>
                        <span className="font-medium">$1,840</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Error Prevention</span>
                        <span className="font-medium">$320</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Process Efficiency</span>
                        <span className="font-medium">$136</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between items-center font-bold">
                          <span>Total Monthly Savings</span>
                          <span className="text-green-600">$2,296</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Annual ROI */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        $27,552
                      </div>
                      <div className="text-sm text-gray-600">Annual ROI</div>
                      <div className="text-xs text-gray-500 mt-1">
                        387% return on investment
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Automation Metrics</CardTitle>
                <CardDescription>
                  Real-time automation performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Invoice Generation
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: "94%" }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold">94%</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Time Entry Processing
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: "87%" }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold">87%</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Service Catalog
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: "91%" }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold">91%</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Consolidation</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-600 h-2 rounded-full"
                            style={{ width: "89%" }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold">89%</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-blue-600">
                          18.3h
                        </div>
                        <div className="text-xs text-gray-600">
                          Hours Saved/Month
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">
                          94%
                        </div>
                        <div className="text-xs text-gray-600">
                          Error Reduction
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm font-medium text-yellow-800">
                        Next Optimization Target
                      </div>
                      <div className="text-xs text-yellow-700 mt-1">
                        Achieve 95% automation rate by Q1 2025
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Success Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">
            Semi-Automated Billing System Success
          </CardTitle>
          <CardDescription className="text-blue-700">
            Comprehensive transformation from manual Excel processes to
            intelligent automation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">90%</div>
              <div className="text-sm text-blue-800">
                Manual Work Eliminated
              </div>
              <div className="text-xs text-blue-600">
                From Excel to Automation
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-600">$27.6K</div>
              <div className="text-sm text-green-800">Annual Cost Savings</div>
              <div className="text-xs text-green-600">387% ROI</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-600">96%</div>
              <div className="text-sm text-purple-800">Client Satisfaction</div>
              <div className="text-xs text-purple-600">
                Improved Service Quality
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-orange-600">24/7</div>
              <div className="text-sm text-orange-800">
                Automated Processing
              </div>
              <div className="text-xs text-orange-600">
                Real-time Operations
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
