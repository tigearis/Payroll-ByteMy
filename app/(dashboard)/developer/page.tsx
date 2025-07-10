"use client";

import { 
  Code, 
  Database, 
  RefreshCw, 
  Calendar,
  Users,
  Eye,
  TestTube,
  Palette
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ByteMySpinner } from "@/components/ui/bytemy-loading-icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeatureFlagGuard } from "@/lib/feature-flags";

const developerTools = [
  {
    title: "Loading States Gallery",
    description: "Comprehensive showcase of all loading components and states",
    href: "/dev/loading-states",
    icon: Palette,
    badge: "UI Components",
    status: "Ready",
  },
  {
    title: "Component Library",
    description: "Browse all UI components with examples and code",
    href: "/dev/components",
    icon: Palette,
    badge: "Coming Soon",
    status: "Planned",
    disabled: true,
  },
  {
    title: "API Testing Tools",
    description: "Test and debug API endpoints",
    href: "/dev/api-testing",
    icon: Code,
    badge: "Developer Tools",
    status: "Planned",
    disabled: true,
  },
  {
    title: "Database Operations",
    description: "Developer database utilities and cleanup tools",
    href: "/api/developer",
    icon: Database,
    badge: "Database",
    status: "Available",
    external: true,
  },
  {
    title: "Permission Testing",
    description: "Test role-based access control and permissions",
    href: "/dev/permissions",
    icon: Users,
    badge: "Security",
    status: "Planned",
    disabled: true,
  },
  {
    title: "Form Examples",
    description: "Examples of all form patterns and validation",
    href: "/dev/forms",
    icon: TestTube,
    badge: "Examples",
    status: "Planned",
    disabled: true,
  },
  {
    title: "Calendar Testing",
    description: "Test calendar components and date handling",
    href: "/dev/calendar",
    icon: Calendar,
    badge: "Testing",
    status: "Planned",
    disabled: true,
  },
  {
    title: "Error Boundaries",
    description: "Test error handling and boundary components",
    href: "/dev/errors",
    icon: RefreshCw,
    badge: "Error Handling",
    status: "Planned",
    disabled: true,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Ready":
      return "bg-green-100 text-green-800";
    case "Available":
      return "bg-blue-100 text-blue-800";
    case "Planned":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function DeveloperPage() {
  return (
    <FeatureFlagGuard 
      feature="devTools"
      fallback={
        <div className="container mx-auto py-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Developer Tools</h1>
            <p className="text-gray-500 mt-2">
              Developer tools are currently disabled
            </p>
          </div>
          <div className="flex items-center justify-center h-[400px] border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">Developer Tools Unavailable</p>
              <p className="text-sm text-gray-500 mt-2">
                This feature is currently disabled. Please contact your administrator to enable it.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Developer Tools</h1>
        <p className="text-gray-500 mt-2">
          Development utilities, component galleries, and debugging tools
        </p>
      </div>

      {/* Environment Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Environment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Environment:</span>
              <Badge variant="secondary" className="ml-2">
                {process.env.NODE_ENV || "development"}
              </Badge>
            </div>
            <div>
              <span className="font-medium">Build Mode:</span>
              <Badge variant="outline" className="ml-2">
                Next.js 15
              </Badge>
            </div>
            <div>
              <span className="font-medium">TypeScript:</span>
              <Badge variant="outline" className="ml-2">
                5.8+
              </Badge>
            </div>
            <div>
              <span className="font-medium">Tailwind:</span>
              <Badge variant="outline" className="ml-2">
                3.4+
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Developer Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {developerTools.map((tool) => {
          const IconComponent = tool.icon;
          
          return (
            <Card key={tool.title} className={tool.disabled ? "opacity-60" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                      <Badge 
                        variant="secondary" 
                        className="text-xs mt-1"
                      >
                        {tool.badge}
                      </Badge>
                    </div>
                  </div>
                  <Badge 
                    className={getStatusColor(tool.status)}
                  >
                    {tool.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                
                {tool.disabled ? (
                  <Button disabled variant="outline" className="w-full">
                    Coming Soon
                  </Button>
                ) : tool.external ? (
                  <Button asChild variant="outline" className="w-full">
                    <a href={tool.href} target="_blank" rel="noopener noreferrer">
                      <Eye className="w-4 h-4 mr-2" />
                      Open Tool
                    </a>
                  </Button>
                ) : (
                  <Button asChild className="w-full">
                    <Link href={tool.href}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Tool
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dev/loading-states">
                <ByteMySpinner size="sm" className="mr-2" />
                Loading States
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="/api/developer" target="_blank" rel="noopener noreferrer">
                <Database className="w-4 h-4 mr-2" />
                Database Tools
              </a>
            </Button>
            <Button variant="outline" size="sm" disabled>
              <TestTube className="w-4 h-4 mr-2" />
              Component Tests
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Developer Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Development Notes</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <ul className="text-sm text-gray-600">
            <li>This page is only accessible to users with developer role</li>
            <li>Loading states gallery showcases all available loading components</li>
            <li>Database tools provide utilities for cleaning and regenerating test data</li>
            <li>More development tools will be added as needed</li>
            <li>All tools respect the current authentication and permission system</li>
          </ul>
        </CardContent>
      </Card>
      </div>
    </FeatureFlagGuard>
  );
}