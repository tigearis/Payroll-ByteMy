/**
 * Hasura Dynamic Query AI Assistant
 *
 * A conversational data assistant that answers questions by dynamically
 * generating and executing GraphQL queries against Hasura. Focused on
 * providing direct answers without exposing technical details.
 */

"use client";

import { useUser } from "@clerk/nextjs";
import {
  Send,
  Copy,
  Download,
  CheckCircle,
  Loader2,
  Bot,
  User,
  BarChart3,
  Database,
  Lightbulb,
  TrendingUp,
  Calendar,
  Users,
  DollarSign,
  FileText,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface DataMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  type: "question" | "answer" | "error" | "insight";
  metadata?: {
    query?: string;
    data?: any;
    summary?: string;
    insights?: string[];
    recordCount?: number;
    executionTime?: number;
    businessContext?: string;
  };
}

interface DataContext {
  pathname: string;
  businessArea?: string;
  pageData?: Record<string, any>;
}

interface HasuraDataAssistantProps {
  context: DataContext;
  className?: string;
  height?: string;
}

export function HasuraDataAssistant({
  context,
  className,
  height = "600px",
}: HasuraDataAssistantProps) {
  const { user } = useUser();
  const [messages, setMessages] = useState<DataMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load contextual suggestions when component mounts
  useEffect(() => {
    loadSuggestedQuestions();
  }, [context.pathname]);

  // Load suggested questions based on current context
  const loadSuggestedQuestions = async () => {
    try {
      const response = await fetch(
        `/api/ai-assistant/query?pathname=${encodeURIComponent(context.pathname)}`,
        {
          headers: {
            "x-hasura-role": (user?.publicMetadata?.role as string) || "viewer",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSuggestedQuestions(
          data.suggestions?.map((s: any) => s.title || s) || []
        );
      }
    } catch (error) {
      console.error("Error loading suggestions:", error);
    }
  };

  // Send question to the AI assistant
  const handleAskQuestion = useCallback(
    async (question?: string) => {
      const questionToAsk = question || inputValue.trim();
      if (!questionToAsk || isLoading) return;

      const userMessage: DataMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: questionToAsk,
        timestamp: new Date(),
        type: "question",
      };

      setMessages(prev => [...prev, userMessage]);
      setInputValue("");
      setIsLoading(true);

      try {
        const startTime = Date.now();

        const response = await fetch("/api/ai-assistant/query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-hasura-role": (user?.publicMetadata?.role as string) || "viewer",
          },
          body: JSON.stringify({
            request: questionToAsk,
            context: {
              pathname: context.pathname,
              pageData: context.pageData,
            },
            executeQuery: true,
          }),
        });

        const executionTime = Date.now() - startTime;

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Unknown error" }));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const data = await response.json();

        // Create assistant message with business-focused response
        const assistantMessage: DataMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: formatBusinessResponse(data, questionToAsk),
          timestamp: new Date(),
          type: data.data ? "answer" : "insight",
          metadata: {
            query: data.query,
            data: data.data,
            summary: data.summary,
            recordCount: calculateRecordCount(data.data),
            executionTime,
            businessContext: determineBusinessContext(questionToAsk),
          },
        };

        setMessages(prev => [...prev, assistantMessage]);
      } catch (error) {
        console.error("Error asking question:", error);

        const errorMessage: DataMessage = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: handleErrorResponse(error as Error),
          timestamp: new Date(),
          type: "error",
        };

        setMessages(prev => [...prev, errorMessage]);
        toast.error("Failed to get answer");
      } finally {
        setIsLoading(false);
      }
    },
    [inputValue, isLoading, context, user]
  );

  // Format the AI response in a business-friendly way
  const formatBusinessResponse = (
    data: any,
    originalQuestion: string
  ): string => {
    if (!data.data) {
      return data.explanation || "I couldn't retrieve data for that question.";
    }

    // If we have a summary from the AI, use it as the primary response
    if (data.summary) {
      return data.summary;
    }

    // Generate a basic summary based on the data
    const recordCount = calculateRecordCount(data.data);
    const businessContext = determineBusinessContext(originalQuestion);

    if (recordCount === 0) {
      return `No ${businessContext} found matching your criteria. You may want to adjust your search parameters or timeframe.`;
    }

    if (recordCount === 1) {
      return `Found 1 ${businessContext} matching your request. Here are the details:`;
    }

    return `Found ${recordCount} ${businessContext} based on your query. Here's what the data shows:`;
  };

  // Calculate total record count from nested data structure
  const calculateRecordCount = (data: any): number => {
    if (!data) return 0;

    let total = 0;
    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value)) {
        total += value.length;
      } else if (value && typeof value === "object") {
        total += 1;
      }
    }
    return total;
  };

  // Determine business context from the question
  const determineBusinessContext = (question: string): string => {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes("client")) return "clients";
    if (lowerQuestion.includes("payroll")) return "payrolls";
    if (lowerQuestion.includes("staff") || lowerQuestion.includes("user"))
      return "staff members";
    if (lowerQuestion.includes("schedule") || lowerQuestion.includes("time"))
      return "schedule entries";
    if (lowerQuestion.includes("revenue") || lowerQuestion.includes("billing"))
      return "financial records";
    if (lowerQuestion.includes("leave") || lowerQuestion.includes("holiday"))
      return "leave entries";
    if (lowerQuestion.includes("skill")) return "skills";

    return "records";
  };

  // Handle different types of errors with helpful messages
  const handleErrorResponse = (error: Error): string => {
    const message = error.message.toLowerCase();

    if (message.includes("permission") || message.includes("access")) {
      return "I don't have permission to access that information. Please check with your administrator if you need access to this data.";
    }

    if (message.includes("rate limit")) {
      return "I'm receiving too many requests right now. Please wait a moment and try again.";
    }

    if (message.includes("authentication")) {
      return "There was an authentication issue. Please try refreshing the page and logging in again.";
    }

    return "I encountered an issue while trying to answer your question. Please try rephrasing your question or try again later.";
  };

  // Handle input key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
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

  // Export data as CSV or JSON
  const exportData = (data: any, format: "json" | "csv" = "json") => {
    if (!data) return;

    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `payroll-data-export-${timestamp}.${format}`;

    if (format === "json") {
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
    }

    toast.success(`Data exported as ${format.toUpperCase()}`);
  };

  // Get icon based on business context
  const getContextIcon = (context: string) => {
    switch (context) {
      case "clients":
        return <Users className="h-4 w-4" />;
      case "payrolls":
        return <FileText className="h-4 w-4" />;
      case "financial records":
        return <DollarSign className="h-4 w-4" />;
      case "schedule entries":
        return <Calendar className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  return (
    <div
      className={cn("flex flex-col border rounded-lg bg-white", className)}
      style={{ height }}
    >
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold">Data Assistant</h3>
          <Badge variant="outline" className="text-xs">
            Hasura Dynamic Query
          </Badge>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Ask questions about your data and get instant insights
        </p>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <Card className="border-dashed">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  <span>How can I help you today?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">
                  I can help you understand your business data by answering
                  questions like:
                </p>

                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <BarChart3 className="h-3 w-3" />
                    <span>"How many active clients do we have?"</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <TrendingUp className="h-3 w-3" />
                    <span>"Show me payrolls from this month"</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <Users className="h-3 w-3" />
                    <span>"Who are our most valuable clients?"</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <Calendar className="h-3 w-3" />
                    <span>"What's the team schedule for today?"</span>
                  </div>
                </div>

                {suggestedQuestions.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-2">
                        Quick questions for this page:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {suggestedQuestions
                          .slice(0, 3)
                          .map((question, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs cursor-pointer hover:bg-blue-50 hover:border-blue-200"
                              onClick={() => handleAskQuestion(question)}
                            >
                              {question}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {messages.map(message => (
            <div
              key={message.id}
              className={cn(
                "flex items-start space-x-3",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="flex-shrink-0 mt-1">
                  <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              )}

              <div
                className={cn(
                  "max-w-[85%] rounded-lg",
                  message.role === "user"
                    ? "bg-blue-600 text-white p-3"
                    : "bg-gray-50 border"
                )}
              >
                {message.role === "assistant" && (
                  <div className="p-3 pb-0">
                    <div className="flex items-center space-x-2 mb-2">
                      {message.metadata?.businessContext &&
                        getContextIcon(message.metadata.businessContext)}
                      <span className="font-medium text-sm">
                        {message.type === "answer"
                          ? "Data Insights"
                          : message.type === "error"
                            ? "Issue"
                            : "Response"}
                      </span>
                      {message.metadata?.recordCount !== undefined && (
                        <Badge variant="outline" className="text-xs">
                          {message.metadata.recordCount} records
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="p-3">
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </div>

                  {/* Data Visualization for Assistant Messages */}
                  {message.role === "assistant" && message.metadata?.data && (
                    <div className="mt-3 space-y-3">
                      {/* Quick Stats */}
                      <div className="bg-white rounded border p-3">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                          <span>Query Results</span>
                          <div className="flex items-center space-x-2">
                            {message.metadata.executionTime && (
                              <span>{message.metadata.executionTime}ms</span>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 p-0"
                              onClick={() => exportData(message.metadata!.data)}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Simple data preview */}
                        <div className="text-xs bg-gray-50 rounded p-2 max-h-32 overflow-y-auto">
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(message.metadata.data, null, 2)}
                          </pre>
                        </div>
                      </div>

                      {/* Business Insights */}
                      {message.metadata.insights &&
                        message.metadata.insights.length > 0 && (
                          <div className="bg-blue-50 rounded border border-blue-200 p-3">
                            <div className="flex items-center space-x-2 mb-2">
                              <Lightbulb className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-800">
                                Key Insights
                              </span>
                            </div>
                            <ul className="text-xs space-y-1 text-blue-700">
                              {message.metadata.insights.map(
                                (insight, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start space-x-1"
                                  >
                                    <span>•</span>
                                    <span>{insight}</span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                    </div>
                  )}

                  <div className="text-xs opacity-70 mt-2 flex items-center justify-between">
                    <span>{message.timestamp.toLocaleTimeString()}</span>
                    {message.role === "assistant" && message.content && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 opacity-50 hover:opacity-100"
                        onClick={() => copyToClipboard(message.content)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {message.role === "user" && (
                <div className="flex-shrink-0 mt-1">
                  <div className="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div className="bg-gray-50 border rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  <span className="text-sm text-gray-600">
                    Analyzing your data...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about your data..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={() => handleAskQuestion()}
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

        <div className="text-xs text-gray-500 mt-2 flex items-center justify-between">
          <span>
            I'll generate and execute GraphQL queries to answer your questions
          </span>
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span>Secure & Role-based</span>
          </div>
        </div>
      </div>
    </div>
  );
}
