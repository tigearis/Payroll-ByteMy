"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GraphQLQueryBuilder } from "../graphql-builder/GraphQLQueryBuilder";
import { useAIQueryGeneration } from "../../hooks/useAIQueryGeneration";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function AIAssistedQueryBuilder() {
  const [prompt, setPrompt] = useState("");
  const [generatedQuery, setGeneratedQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I can help you create GraphQL queries for your reports. Describe what data you're looking for, and I'll generate a query for you.",
      timestamp: new Date(),
    },
  ]);

  const { generateQueryFromPrompt } = useAIQueryGeneration();

  const handleGenerateQuery = async () => {
    if (!prompt) return;

    // Add user message to conversation
    const userMessage: Message = {
      role: "user",
      content: prompt,
      timestamp: new Date(),
    };

    setConversation(prev => [...prev, userMessage]);
    setIsGenerating(true);

    try {
      // Call the AI to generate a query
      const result = await generateQueryFromPrompt(prompt);

      // Extract the query from the result
      const query = result.query || "";
      setGeneratedQuery(query);

      // Add assistant message to conversation
      const assistantMessage: Message = {
        role: "assistant",
        content:
          result.explanation ||
          "I've generated a query based on your description.",
        timestamp: new Date(),
      };

      setConversation(prev => [...prev, assistantMessage]);

      // Clear the prompt
      setPrompt("");

      toast.success("Query generated successfully");
    } catch (error) {
      console.error("Failed to generate query:", error);

      // Add error message to conversation
      const errorMessage: Message = {
        role: "assistant",
        content:
          "Sorry, I couldn't generate a query based on your description. Please try again with more details.",
        timestamp: new Date(),
      };

      setConversation(prev => [...prev, errorMessage]);

      toast.error("Failed to generate query");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerateQuery();
    }
  };

  const examplePrompts = [
    "Show me payroll totals by department for last quarter",
    "List all staff with leave requests pending approval",
    "Compare client billing this month vs last month",
    "Show me top 10 clients by revenue",
    "Find employees who worked overtime last month",
  ];

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">AI-Assisted Query Builder</h3>
        <p className="text-sm text-muted-foreground">
          Describe the report you want to create in natural language
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {examplePrompts.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => handleExampleClick(example)}
                >
                  <Sparkles className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="line-clamp-2">{example}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-4">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-base">
                Chat with AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 h-[300px] pr-4 mb-4">
                <div className="space-y-4">
                  {conversation.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isGenerating && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                        <div className="flex items-center">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span className="text-sm">Generating query...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Describe the report you want to create..."
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isGenerating}
                  className="flex-1"
                />
                <Button
                  onClick={handleGenerateQuery}
                  disabled={!prompt || isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {generatedQuery && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Generated Query</CardTitle>
          </CardHeader>
          <CardContent>
            <GraphQLQueryBuilder initialQuery={generatedQuery} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
