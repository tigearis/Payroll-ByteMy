// app/(dashboard)/ai-assistant/page.tsx
import { AIChat } from "@/components/ai/chat-interface";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { PageHeader } from "@/components/patterns/page-header";
import { FeatureFlagGuard } from "@/lib/feature-flags";

export default function AIAssistantPage() {
  return (
    <FeatureFlagGuard
      feature="aiAssistant"
      fallback={
        <div className="container mx-auto py-6 space-y-6">
          <PageHeader
            title="AI Assistant"
            description="AI Assistant is currently disabled"
            breadcrumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "AI Assistant" },
            ]}
          />
          <div className="flex items-center justify-center h-[400px] border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">
                AI Assistant Unavailable
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This feature is currently disabled. Please contact your
                administrator to enable it.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <PermissionGuard action="read">
        <div className="container mx-auto py-6 space-y-6">
          <PageHeader
            title="AI Assistant"
            description="Get help and insights from our AI assistant"
            breadcrumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "AI Assistant" },
            ]}
          />
          <div className="h-[600px]">
            <AIChat
              context={{
                pathname: "/ai-assistant",
                suggestions: [
                  "Show me recent payrolls",
                  "List active clients",
                  "What's today's schedule?",
                  "How many staff are working today?",
                  "Show upcoming holidays",
                  "List all consultants",
                ],
              }}
            />
          </div>
        </div>
      </PermissionGuard>
    </FeatureFlagGuard>
  );
}
