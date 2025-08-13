"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { useAIQueryGeneration } from "../../hooks/useAIQueryGeneration";
import { useReportMetadata } from "../../hooks/useReportMetadata";

interface AIQuerySuggestionsProps {
  onSelectQuery: (query: string) => void;
}

export function AIQuerySuggestions({ onSelectQuery }: AIQuerySuggestionsProps) {
  const [suggestions, setSuggestions] = useState<
    { title: string; query: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const { generateQueryFromPrompt } = useAIQueryGeneration();
  const { metadata } = useReportMetadata();

  // Generate suggestions based on user context
  useEffect(() => {
    const generateSuggestions = async () => {
      if (!metadata) return;

      setLoading(true);

      try {
        // These would be contextual prompts based on user role, recent activity, etc.
        const contextualPrompts = [
          "Show me a summary of payroll data for the current month",
          "List staff members with upcoming leave",
          "Show me clients with outstanding invoices",
          "Summarize work hours by department for the last week",
        ];

        // Generate a query for each prompt
        const results = await Promise.all(
          contextualPrompts.slice(0, 3).map(async prompt => {
            try {
              const result = await generateQueryFromPrompt(prompt);
              return {
                title: prompt,
                query: result.query,
              };
            } catch (error) {
              console.error("Error generating suggestion:", error);
              return null;
            }
          })
        );

        setSuggestions(
          results.filter(Boolean) as { title: string; query: string }[]
        );
      } catch (error) {
        console.error("Error generating suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    generateSuggestions();
  }, [metadata, generateQueryFromPrompt]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center">
          <Sparkles className="h-4 w-4 mr-2 text-amber-500" />
          Suggested Queries
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">
              Generating suggestions...
            </span>
          </div>
        ) : suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-between text-left h-auto py-3"
              onClick={() => onSelectQuery(suggestion.query)}
            >
              <span className="line-clamp-2">{suggestion.title}</span>
              <ArrowRight className="h-4 w-4 ml-2 flex-shrink-0" />
            </Button>
          ))
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p>No suggestions available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
