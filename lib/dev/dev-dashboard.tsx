"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, Zap, Code, TestTube, BookOpen } from 'lucide-react';

// Import test components
import { JWTTestPanel } from './test-components/jwt-test-panel';
import { HasuraWebSocketTest } from './test-components/hasura-websocket-test';
import { DirectWebSocketTest } from './test-components/direct-websocket-test';
import { SubscriptionTest } from './test-components/subscription-test';
import { SimpleWebSocketTest } from './test-components/simple-websocket-test';

// Import examples
import { EnhancedUsersList } from './examples/enhanced-users-list';
import { GracefulClientsList } from './examples/graceful-clients-list';

export const UnifiedDevDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const testSuites = [
    {
      id: 'authentication',
      name: 'Authentication Testing',
      description: 'JWT tokens, Clerk integration, and Hasura claims testing',
      icon: <Shield className="h-5 w-5" />,
      category: 'critical',
      component: <JWTTestPanel />
    },
    {
      id: 'websocket',
      name: 'WebSocket Testing',
      description: 'Hasura WebSocket connectivity and real-time subscriptions',
      icon: <Zap className="h-5 w-5" />,
      category: 'critical',
      component: <HasuraWebSocketTest />
    },
    {
      id: 'direct-websocket',
      name: 'Direct WebSocket',
      description: 'Low-level WebSocket protocol testing and debugging',
      icon: <Code className="h-5 w-5" />,
      category: 'debugging',
      component: <DirectWebSocketTest />
    },
    {
      id: 'subscriptions',
      name: 'Apollo Subscriptions',
      description: 'GraphQL subscriptions through Apollo Client',
      icon: <TestTube className="h-5 w-5" />,
      category: 'debugging',
      component: <SubscriptionTest />
    },
    {
      id: 'simple-websocket',
      name: 'Basic WebSocket',
      description: 'Simple WebSocket connectivity testing',
      icon: <Zap className="h-5 w-5" />,
      category: 'debugging',
      component: <SimpleWebSocketTest />
    }
  ];

  const examples = [
    {
      id: 'enhanced-users',
      name: 'Enhanced Error Handling',
      description: 'User list with advanced GraphQL error handling patterns',
      icon: <BookOpen className="h-5 w-5" />,
      component: <EnhancedUsersList />
    },
    {
      id: 'graceful-clients',
      name: 'Graceful Fallbacks',
      description: 'Client list with permission-based graceful degradation',
      icon: <BookOpen className="h-5 w-5" />,
      component: <GracefulClientsList />
    }
  ];

  const getCategoryBadge = (category: string) => {
    const variants = {
      critical: 'destructive',
      debugging: 'secondary',
      reference: 'outline'
    } as const;
    
    return <Badge variant={variants[category as keyof typeof variants]}>{category}</Badge>;
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Development Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive testing and debugging toolkit for development and production troubleshooting
        </p>
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span className="font-medium text-yellow-800">Production Access</span>
          </div>
          <p className="mt-1 text-sm text-yellow-700">
            This dashboard is accessible in production for authorized developers to debug issues.
            Use responsibly and avoid running tests that could impact system performance.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="testing">Testing Suite</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  <span>Critical Tests</span>
                </CardTitle>
                <CardDescription>Essential authentication and connectivity tests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {testSuites.filter(suite => suite.category === 'critical').map(suite => (
                    <div key={suite.id} className="flex items-center space-x-2">
                      {suite.icon}
                      <span className="text-sm">{suite.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5 text-blue-500" />
                  <span>Debugging Tools</span>
                </CardTitle>
                <CardDescription>Advanced debugging and protocol testing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {testSuites.filter(suite => suite.category === 'debugging').map(suite => (
                    <div key={suite.id} className="flex items-center space-x-2">
                      {suite.icon}
                      <span className="text-sm">{suite.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-green-500" />
                  <span>Reference Examples</span>
                </CardTitle>
                <CardDescription>Best practices and error handling patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {examples.map(example => (
                    <div key={example.id} className="flex items-center space-x-2">
                      {example.icon}
                      <span className="text-sm">{example.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <div className="grid gap-4">
            {testSuites.map(suite => (
              <Card key={suite.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      {suite.icon}
                      <span>{suite.name}</span>
                    </CardTitle>
                    {getCategoryBadge(suite.category)}
                  </div>
                  <CardDescription>{suite.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {suite.component}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Reference Implementations</h3>
            <p className="text-muted-foreground">
              These examples demonstrate error handling patterns and best practices used throughout the codebase.
              While not used in production, they serve as architectural documentation.
            </p>
          </div>
          
          <div className="grid gap-4">
            {examples.map(example => (
              <Card key={example.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {example.icon}
                    <span>{example.name}</span>
                  </CardTitle>
                  <CardDescription>{example.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {example.component}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="docs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Development Documentation</CardTitle>
              <CardDescription>Key resources and implementation patterns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Authentication Architecture</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Pure Clerk native integration with <code>getToken({`{template: "hasura"}`})</code></li>
                  <li>JWT template configuration for Hasura claims mapping</li>
                  <li>Hierarchical RBAC with 18 granular permissions</li>
                  <li>Real implementations: <code>/app/(dashboard)/staff/page.tsx:310-330</code></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">GraphQL Error Handling</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Enhanced error detection with <code>isAuthError()</code> helper</li>
                  <li>Graceful permission fallbacks with <code>useGracefulQuery</code></li>
                  <li>Structured error processing with <code>handleGraphQLError()</code></li>
                  <li>Real implementations: <code>/hooks/use-graceful-query.ts:74-100</code></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">WebSocket & Real-time</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Apollo Client WebSocket links with automatic token forwarding</li>
                  <li>25+ GraphQL subscriptions for real-time updates</li>
                  <li>Connection fallback to polling when WebSocket fails</li>
                  <li>Real implementations: <code>/lib/apollo/links/websocket-link.ts</code></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Security Compliance</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>SOC2 compliance with comprehensive audit logging</li>
                  <li>Multi-level data classification (CRITICAL, HIGH, MEDIUM, LOW)</li>
                  <li>Enhanced route monitoring with suspicious pattern detection</li>
                  <li>Real implementations: <code>/lib/security/enhanced-route-monitor.ts</code></li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};