/**
 * AI Chat Interface Component
 *
 * Main chat interface for the AI assistant with message history,
 * query generation, and result visualization
 */

"use client";

import { useUser } from "@clerk/nextjs";
import {
  Send,
  Copy,
  AlertCircle,
  CheckCircle,
  Loader2,
  Bot,
  User,
  Code,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { QueryResult } from "@/components/query-result";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  type?: "chat" | "query" | "error";
  metadata?: {
    query?: string;
    explanation?: string;
    data?: any;
    errors?: any[];
    security?: {
      isValid: boolean;
      report: string;
    };
  };
}

interface ChatContext {
  pathname: string;
  suggestions?: string[];
  pageData?: Record<string, any>;
}

interface AIChatProps {
  context: ChatContext;
  compact?: boolean;
  className?: string;
}

export function AIChat({ context, compact = false, className }: AIChatProps) {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "query">("chat");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen for suggestion clicks from the floating assistant
  useEffect(() => {
    const handleSuggestionClick = (event: CustomEvent) => {
      const { suggestion } = event.detail;
      handleSendMessage(suggestion);
    };

    window.addEventListener(
      "ai-suggestion-click",
      handleSuggestionClick as EventListener
    );
    return () => {
      window.removeEventListener(
        "ai-suggestion-click",
        handleSuggestionClick as EventListener
      );
    };
  }, []);

  // Send message to AI
  const handleSendMessage = useCallback(
    async (message?: string) => {
      const messageToSend = message || inputValue.trim();
      if (!messageToSend || isLoading) return;

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: messageToSend,
        timestamp: new Date(),
        type: "chat",
      };

      setMessages(prev => [...prev, userMessage]);
      setInputValue("");
      setIsLoading(true);

      try {
        // Determine if this is a data request that should execute a query
        const isDataRequest =
          messageToSend.toLowerCase().includes("show") ||
          messageToSend.toLowerCase().includes("list") ||
          messageToSend.toLowerCase().includes("get") ||
          messageToSend.toLowerCase().includes("find") ||
          messageToSend.toLowerCase().includes("what") ||
          messageToSend.toLowerCase().includes("how many") ||
          messageToSend.toLowerCase().includes("display") ||
          messageToSend.toLowerCase().includes("retrieve");

        // Always use query endpoint for data requests, regardless of active tab
        if (isDataRequest) {
          console.log(
            "🔍 Detected data request, routing to query generation:",
            messageToSend
          );
          await handleQueryGeneration(messageToSend, userMessage);
        } else {
          console.log(
            "💬 Detected chat request, routing to regular chat:",
            messageToSend
          );
          await handleChatMessage(messageToSend, userMessage);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            "Sorry, I encountered an error processing your message. Please try again.",
          timestamp: new Date(),
          type: "error",
        };
        setMessages(prev => [...prev, errorMessage]);
        toast.error("Failed to send message");
      } finally {
        setIsLoading(false);
      }
    },
    [inputValue, isLoading, context]
  );

  // Handle regular chat messages
  const handleChatMessage = async (message: string, userMessage: Message) => {
    const response = await fetch("/api/ai-assistant/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-role": (user?.publicMetadata?.role as string) || "viewer",
      },
      body: JSON.stringify({
        message,
        conversationHistory: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp.toISOString(),
        })),
        context: {
          pathname: context.pathname,
          pageData: context.pageData,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: data.response,
      timestamp: new Date(),
      type: "chat",
    };

    setMessages(prev => [...prev, assistantMessage]);
  };

  // Handle query generation and execution
  const handleQueryGeneration = async (
    message: string,
    userMessage: Message
  ) => {
    try {
      console.log("🚀 Starting query generation for:", message);

      const response = await fetch("/api/ai-assistant/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-hasura-role": (user?.publicMetadata?.role as string) || "viewer",
        },
        body: JSON.stringify({
          request: message,
          context: {
            pathname: context.pathname,
            pageData: context.pageData,
          },
          executeQuery: true,
        }),
      });

      console.log("📡 Query API response status:", response.status);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        console.log("❌ Query API failed with:", errorData);

        // Handle specific error cases
        if (response.status === 403) {
          const assistantMessage: Message = {
            id: `error-${Date.now()}`,
            role: "assistant",
            content: `I don't have permission to access that data. ${errorData.error || ""}`,
            timestamp: new Date(),
            type: "error",
          };
          setMessages(prev => [...prev, assistantMessage]);
          return;
        }

        if (response.status === 429) {
          const assistantMessage: Message = {
            id: `error-${Date.now()}`,
            role: "assistant",
            content:
              "I'm receiving too many requests right now. Please wait a moment and try again.",
            timestamp: new Date(),
            type: "error",
          };
          setMessages(prev => [...prev, assistantMessage]);
          return;
        }

        // For other errors, fall back to chat
        console.warn(
          "🔄 Query generation failed, falling back to chat:",
          errorData
        );
        console.warn(
          "🔄 User role:",
          (user?.publicMetadata?.role as string) || "viewer"
        );
        console.warn("🔄 Response status:", response.status);

        // Show user feedback about why query failed
        const fallbackMessage: Message = {
          id: `fallback-${Date.now()}`,
          role: "assistant",
          content: `I couldn't execute a data query (${errorData.error || "Unknown error"}), but I can still help explain things. If you need to retrieve actual data, you may need elevated permissions.`,
          timestamp: new Date(),
          type: "chat",
        };
        setMessages(prev => [...prev, fallbackMessage]);

        await handleChatMessage(message, userMessage);
        return;
      }

      const data = await response.json();
      console.log("✅ Query generation successful:", data);

      const assistantMessage: Message = {
        id: `query-${Date.now()}`,
        role: "assistant",
        content: data.explanation,
        timestamp: new Date(),
        type: "query",
        metadata: {
          query: data.query,
          explanation: data.explanation,
          data: data.data,
          errors: data.errors,
          security: data.security,
        },
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Query generation error:", error);

      // Fall back to regular chat for network errors
      try {
        const fallbackMessage: Message = {
          id: `fallback-${Date.now()}`,
          role: "assistant",
          content:
            "I'm having trouble generating a data query right now. Let me try to help you with general information instead.",
          timestamp: new Date(),
          type: "chat",
        };
        setMessages(prev => [...prev, fallbackMessage]);

        // Try regular chat as fallback
        await handleChatMessage(message, userMessage);
      } catch (fallbackError) {
        console.error("Fallback chat also failed:", fallbackError);
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            "I'm experiencing technical difficulties. Please try again later.",
          timestamp: new Date(),
          type: "error",
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    }
  };

  // Handle input key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Copy text to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  // Export data as JSON
  const exportData = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully");
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Tab Selection */}
      {!compact && (
        <Tabs
          value={activeTab}
          onValueChange={value => setActiveTab(value as "chat" | "query")}
        >
          <TabsList className="grid w-full grid-cols-2 mb-2">
            <TabsTrigger value="chat" className="text-xs">
              <Bot className="h-3 w-3 mr-1" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="query" className="text-xs">
              <Code className="h-3 w-3 mr-1" />
              Query
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* Messages Area */}
      <ScrollArea className={cn("flex-1", compact ? "p-2" : "p-3")}>
        <div className="space-y-3">
          {messages.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="p-4 text-center">
                <Bot className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 mb-2">
                  Hi! I'm your AI assistant. I can help you with:
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>• Generating reports and queries</div>
                  <div>• Analyzing payroll data</div>
                  <div>• Answering questions about your system</div>
                </div>
                {context.suggestions && context.suggestions.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-600 mb-2">
                      Try asking:
                    </p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {context.suggestions
                        .slice(0, 2)
                        .map((suggestion, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs cursor-pointer hover:bg-blue-50"
                            onClick={() => handleSendMessage(suggestion)}
                          >
                            {suggestion}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {messages.map(message => (
            <div
              key={message.id}
              className={cn(
                "flex items-start space-x-2",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="flex-shrink-0">
                  <Bot className="h-6 w-6 text-blue-600 mt-1" />
                </div>
              )}

              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-3",
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                )}
              >
                <div className="text-sm whitespace-pre-wrap">
                  {message.content}
                </div>

                {/* Enhanced Query Results */}
                {message.type === "query" && message.metadata && (
                  <div className="mt-3 space-y-3">
                    {/* Security Status */}
                    {message.metadata.security && (
                      <div className="flex items-center space-x-2">
                        {message.metadata.security.isValid ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-xs">
                          {message.metadata.security.isValid
                            ? "Security: Approved"
                            : "Security: Blocked"}
                        </span>
                      </div>
                    )}

                    {/* Rich Query Results with QueryResult component */}
                    {message.metadata.data && message.metadata.query && (
                      <div className="border rounded-lg p-1 bg-white">
                        <QueryResult
                          content={JSON.stringify({
                            query: message.metadata.query,
                            data: message.metadata.data,
                            summary: message.content, // Use the AI's explanation as summary
                            insights: message.metadata.errors ? [] : undefined, // Add insights if no errors
                          })}
                        />
                      </div>
                    )}

                    {/* Fallback for query without data */}
                    {message.metadata.query && !message.metadata.data && (
                      <div className="bg-gray-800 text-green-300 p-3 rounded text-xs font-mono">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">GraphQL Query</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-green-300 hover:text-green-100"
                            onClick={() =>
                              copyToClipboard(message.metadata!.query!)
                            }
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <pre className="whitespace-pre-wrap overflow-x-auto text-xs">
                          {message.metadata.query}
                        </pre>
                      </div>
                    )}

                    {/* Errors */}
                    {message.metadata.errors &&
                      message.metadata.errors.length > 0 && (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            {message.metadata.errors
                              .map(error => error.message)
                              .join(", ")}
                          </AlertDescription>
                        </Alert>
                      )}
                  </div>
                )}

                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>

              {message.role === "user" && (
                <div className="flex-shrink-0">
                  <User className="h-6 w-6 text-gray-600 mt-1" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start space-x-2">
              <Bot className="h-6 w-6 text-blue-600 mt-1" />
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className={cn("border-t", compact ? "p-2" : "p-3")}>
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              compact
                ? "Ask me anything..."
                : activeTab === "query"
                  ? "Ask for data or generate a query..."
                  : "Ask me anything..."
            }
            disabled={isLoading}
            className="flex-1 text-sm"
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            size="sm"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
