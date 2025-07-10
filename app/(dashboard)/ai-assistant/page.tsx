// app/(dashboard)/ai-assistant/page.tsx
import { AIChat } from "@/components/ai/chat-interface";
import { FeatureFlagGuard } from "@/lib/feature-flags";

export default function AIAssistantPage() {
  return (
    <FeatureFlagGuard 
      feature="aiAssistant"
      fallback={
        <div className="container mx-auto py-6 space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">AI Assistant</h2>
            <p className="text-muted-foreground">
              AI Assistant is currently disabled
            </p>
          </div>
          <div className="flex items-center justify-center h-[400px] border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">AI Assistant Unavailable</p>
              <p className="text-sm text-gray-500 mt-2">
                This feature is currently disabled. Please contact your administrator to enable it.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <div className="container mx-auto py-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Assistant</h2>
          <p className="text-muted-foreground">
            Get help and insights from our AI assistant
          </p>
        </div>
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
    </FeatureFlagGuard>
  );
}
