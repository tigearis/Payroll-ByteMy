// app/(dashboard)/ai-assistant/page.tsx
import { AIChat } from "@/components/ai-chat";

export default function AIAssistantPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI Assistant</h2>
        <p className="text-muted-foreground">
          Get help and insights from our AI assistant
        </p>
      </div>
      <AIChat />
    </div>
  );
}
