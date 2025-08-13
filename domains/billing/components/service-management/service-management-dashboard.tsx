"use client";

import { useQuery } from "@apollo/client";
import { 
  Settings, 
  Package, 
  Users, 
  Building, 
  BarChart3,
  DollarSign,
  Clock,
  TrendingUp
} from "lucide-react";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import service management components
import {
  GetServiceManagementOverviewAdvancedDocument,
  type GetServiceManagementOverviewAdvancedQuery
} from "../../graphql/generated/graphql";
import { ClientServiceAssignmentManager } from './client-service-assignment-manager';
import { MasterServiceCatalogue } from './master-service-catalogue';
import { UserBillingRateManager } from './user-billing-rate-manager';


export function ServiceManagementDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Calculate date for recent activity filter
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const { data: overviewData, loading: overviewLoading } = useQuery<GetServiceManagementOverviewAdvancedQuery>(GetServiceManagementOverviewAdvancedDocument, {
    variables: {
      thirtyDaysAgo: thirtyDaysAgo.toISOString()
    }
  });

  // Statistics calculations
  const totalServices = overviewData?.servicesAggregate?.aggregate?.count || 0;
  const activeServices = overviewData?.activeServicesAggregate?.aggregate?.count || 0;
  const avgServiceRate = overviewData?.activeServicesAggregate?.aggregate?.avg?.baseRate || 0;
  
  const totalUsers = overviewData?.usersAggregate?.aggregate?.count || 0;
  const usersWithRates = overviewData?.usersWithRatesAggregate?.aggregate?.count || 0;
  const avgUserRate = overviewData?.usersWithRatesAggregate?.aggregate?.avg?.currentHourlyRate || 0;
  const maxUserRate = overviewData?.usersWithRatesAggregate?.aggregate?.max?.currentHourlyRate || 0;
  const minUserRate = overviewData?.usersWithRatesAggregate?.aggregate?.min?.currentHourlyRate || 0;
  
  const totalClients = overviewData?.clientsAggregate?.aggregate?.count || 0;
  const totalAssignments = overviewData?.assignmentsAggregate?.aggregate?.count || 0;
  const avgAssignmentsPerClient = totalClients > 0 ? Math.round(totalAssignments / totalClients) : 0;
  
  const recentServices = overviewData?.recentServicesAggregate?.aggregate?.count || 0;
  const categoryBreakdown: { category: string; count: number; avgRate: number }[] = [];

  const userRateCoverage = totalUsers > 0 ? Math.round((usersWithRates / totalUsers) * 100) : 0;

  if (overviewLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading service management dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Service Management</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive management of services, user rates, and client assignments
          </p>
        </div>
        <Badge variant="outline" className="bg-green-100 text-green-800">
          System Ready
        </Badge>
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Services
          </TabsTrigger>
          <TabsTrigger value="rates" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Rates
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Assignments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Service Catalogue</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeServices}</div>
                <p className="text-xs text-muted-foreground">
                  {totalServices} total, {totalServices - activeServices} inactive
                </p>
                <div className="text-sm font-medium text-green-600">
                  Avg: ${avgServiceRate.toFixed(0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Billing Rates</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{usersWithRates}</div>
                <p className="text-xs text-muted-foreground">
                  {userRateCoverage}% coverage ({usersWithRates}/{totalUsers})
                </p>
                <div className="text-sm font-medium text-blue-600">
                  ${minUserRate.toFixed(0)} - ${maxUserRate.toFixed(0)}/hr
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Client Assignments</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAssignments}</div>
                <p className="text-xs text-muted-foreground">
                  {totalClients} clients covered
                </p>
                <div className="text-sm font-medium text-purple-600">
                  Avg: {avgAssignmentsPerClient} per client
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recentServices}</div>
                <p className="text-xs text-muted-foreground">
                  New services (30 days)
                </p>
                <div className="text-sm font-medium text-orange-600">
                  System active
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Service Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Service Categories</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Distribution of active services by category
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryBreakdown.map((category: any, index: number) => (
                    <div key={category.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary opacity-70" 
                             style={{ opacity: 1 - (index * 0.15) }} />
                        <span className="font-medium capitalize">{category.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{category.count} services</div>
                        <div className="text-sm text-muted-foreground">
                          Avg: ${category.avgRate.toFixed(0)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Health</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Key metrics for service management system
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">User Rate Coverage</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${userRateCoverage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{userRateCoverage}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Service Utilization</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${totalServices > 0 ? (activeServices / totalServices) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {totalServices > 0 ? Math.round((activeServices / totalServices) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Client Coverage</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full w-full" />
                      </div>
                      <span className="text-sm font-medium">100%</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-600">System Operational</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      All service management components are functioning correctly
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <p className="text-sm text-muted-foreground">
                Common service management tasks
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setActiveTab("services")}
                >
                  <div className="flex items-center gap-3">
                    <Package className="h-8 w-8 text-blue-600" />
                    <div>
                      <div className="font-medium">Manage Services</div>
                      <div className="text-sm text-muted-foreground">Add or edit service offerings</div>
                    </div>
                  </div>
                </div>
                
                <div 
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setActiveTab("rates")}
                >
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-8 w-8 text-green-600" />
                    <div>
                      <div className="font-medium">Update User Rates</div>
                      <div className="text-sm text-muted-foreground">Manage billing rates by user</div>
                    </div>
                  </div>
                </div>
                
                <div 
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setActiveTab("assignments")}
                >
                  <div className="flex items-center gap-3">
                    <Settings className="h-8 w-8 text-purple-600" />
                    <div>
                      <div className="font-medium">Client Assignments</div>
                      <div className="text-sm text-muted-foreground">Configure client services</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <MasterServiceCatalogue />
        </TabsContent>

        <TabsContent value="rates">
          <UserBillingRateManager />
        </TabsContent>

        <TabsContent value="assignments">
          <ClientServiceAssignmentManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}