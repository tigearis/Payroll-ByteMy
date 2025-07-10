/**
 * Hasura Dynamic Query AI Assistant Page
 * 
 * Demonstrates the conversational data assistant that answers questions
 * about business data by dynamically generating GraphQL queries.
 */

import { 
  Database, 
  Zap, 
  Shield, 
  BarChart3, 
  Users, 
  FileText, 
  Calendar,
  DollarSign,
  Lightbulb
} from "lucide-react";
import { HasuraDataAssistant } from "@/components/ai/hasura-data-assistant";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FeatureFlagGuard } from "@/lib/feature-flags";

export default function DataAssistantPage() {
  return (
    <FeatureFlagGuard 
      feature="aiDataAssistant"
      fallback={
        <div className="container mx-auto py-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold tracking-tight">Data Assistant</h1>
              <Badge variant="outline" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                Feature Disabled
              </Badge>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              The AI Data Assistant is currently disabled.
            </p>
          </div>
          <div className="flex items-center justify-center h-[400px] border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">Data Assistant Unavailable</p>
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
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-bold tracking-tight">Hasura Data Assistant</h1>
          <Badge variant="outline" className="text-xs">
            <Zap className="h-3 w-3 mr-1" />
            Dynamic Query AI
          </Badge>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Ask questions about your business data in natural language. The AI assistant will dynamically 
          generate GraphQL queries, execute them against Hasura, and provide business insights.
        </p>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-base">
              <Database className="h-4 w-4 text-blue-500" />
              <span>Dynamic Queries</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm">
              Automatically generates and executes GraphQL queries based on your questions
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-base">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Secure Access</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm">
              Respects your role-based permissions and security policies
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-base">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              <span>Business Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm">
              Provides actionable insights and summaries, not just raw data
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Main Assistant Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Data Assistant */}
        <div className="lg:col-span-3">
          <HasuraDataAssistant
            context={{
              pathname: "/ai-assistant/data-assistant",
              businessArea: "dashboard",
            }}
            height="700px"
          />
        </div>

        {/* Side Panel - Example Questions */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                <span>Try These Questions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="flex items-center space-x-2 text-sm font-medium">
                  <Users className="h-3 w-3" />
                  <span>Client Management</span>
                </h4>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• "How many active clients do we have?"</li>
                  <li>• "Who are our newest clients?"</li>
                  <li>• "Show me clients without recent activity"</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="flex items-center space-x-2 text-sm font-medium">
                  <FileText className="h-3 w-3" />
                  <span>Payroll Operations</span>
                </h4>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• "Show me payrolls from this month"</li>
                  <li>• "Which payrolls are behind schedule?"</li>
                  <li>• "What's our average processing time?"</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="flex items-center space-x-2 text-sm font-medium">
                  <Calendar className="h-3 w-3" />
                  <span>Staff & Scheduling</span>
                </h4>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• "Who's working today?"</li>
                  <li>• "Show me team capacity this week"</li>
                  <li>• "List staff with specific skills"</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="flex items-center space-x-2 text-sm font-medium">
                  <DollarSign className="h-3 w-3" />
                  <span>Financial Insights</span>
                </h4>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• "What's our revenue this quarter?"</li>
                  <li>• "Show me billing performance"</li>
                  <li>• "Which clients are most profitable?"</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Ask Your Question</p>
                  <p className="text-xs text-gray-600">Type any question about your business data</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium">AI Understands</p>
                  <p className="text-xs text-gray-600">The AI analyzes your intent and schema</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Query Generated</p>
                  <p className="text-xs text-gray-600">GraphQL query is automatically created</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">4</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Get Insights</p>
                  <p className="text-xs text-gray-600">Receive business insights, not just data</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Note */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Security & Permissions</p>
              <p className="text-xs text-blue-600 mt-1">
                All queries respect your role-based permissions. You'll only see data you're authorized to access. 
                The AI assistant never performs write operations - it only reads data for analysis.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </FeatureFlagGuard>
  );
}