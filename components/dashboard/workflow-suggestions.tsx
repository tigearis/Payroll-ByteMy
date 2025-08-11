"use client";

import { 
  Lightbulb, 
  ArrowRight, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  Zap,
  TrendingUp,
  Target,
  X
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WorkflowSuggestion {
  id: string;
  type: 'optimization' | 'urgent' | 'opportunity' | 'automation' | 'compliance';
  title: string;
  description: string;
  reasoning: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  estimatedSavings?: {
    time?: string;
    cost?: number;
  };
  actions: Array<{
    label: string;
    href?: string;
    onClick?: () => void;
    primary?: boolean;
  }>;
  dismissible?: boolean;
  deadline?: Date;
  completedActions?: string[];
}

interface WorkflowSuggestionsProps {
  suggestions: WorkflowSuggestion[];
  onDismiss?: (suggestionId: string) => void;
  onActionClick?: (suggestionId: string, actionLabel: string) => void;
  loading?: boolean;
}

const suggestionTypeConfig = {
  optimization: {
    icon: TrendingUp,
    color: "text-primary",
    bgColor: "bg-primary/5",
    borderColor: "border-primary/20",
    label: "Optimization",
  },
  urgent: {
    icon: AlertCircle,
    color: "text-error-600",
    bgColor: "bg-error-100/50", 
    borderColor: "border-error-200",
    label: "Urgent",
  },
  opportunity: {
    icon: Target,
    color: "text-green-600",
    bgColor: "bg-green-100/50",
    borderColor: "border-green-200", 
    label: "Opportunity",
  },
  automation: {
    icon: Zap,
    color: "text-warning-600",
    bgColor: "bg-warning-100/50",
    borderColor: "border-warning-200",
    label: "Automation",
  },
  compliance: {
    icon: CheckCircle2,
    color: "text-primary",
    bgColor: "bg-muted/50",
    borderColor: "border-border",
    label: "Compliance",
  },
};

const impactLabels = {
  high: { label: "High Impact", color: "text-green-700 bg-green-100" },
  medium: { label: "Medium Impact", color: "text-warning-700 bg-warning-100" },
  low: { label: "Low Impact", color: "text-muted-foreground bg-muted" },
};

const effortLabels = {
  low: { label: "Quick Win", color: "text-green-700 bg-green-100" },
  medium: { label: "Moderate Effort", color: "text-warning-700 bg-warning-100" },
  high: { label: "Major Project", color: "text-error-700 bg-error-100" },
};

function SuggestionCard({ 
  suggestion, 
  onDismiss, 
  onActionClick 
}: { 
  suggestion: WorkflowSuggestion;
  onDismiss?: (id: string) => void;
  onActionClick?: (id: string, action: string) => void;
}) {
  const [dismissed, setDismissed] = useState(false);
  const config = suggestionTypeConfig[suggestion.type];
  const Icon = config.icon;
  
  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.(suggestion.id);
  };

  const isOverdue = suggestion.deadline && suggestion.deadline < new Date();
  const isUrgent = suggestion.type === 'urgent' || isOverdue;

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      config.bgColor,
      config.borderColor,
      isUrgent && "ring-2 ring-error-200"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Icon className={cn("h-5 w-5", config.color)} />
            <Badge variant="outline" className={cn("text-xs", config.color)}>
              {config.label}
            </Badge>
            {isUrgent && (
              <Badge variant="destructive" className="text-xs">
                Urgent
              </Badge>
            )}
          </div>
          {suggestion.dismissible && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleDismiss}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        <CardTitle className="text-base font-medium leading-tight">
          {suggestion.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-foreground">
          {suggestion.description}
        </p>

        {/* Impact and Effort Badges */}
        <div className="flex gap-2">
          <Badge className={impactLabels[suggestion.impact].color}>
            {impactLabels[suggestion.impact].label}
          </Badge>
          <Badge className={effortLabels[suggestion.effort].color}>
            {effortLabels[suggestion.effort].label}
          </Badge>
        </div>

        {/* Estimated Savings */}
        {suggestion.estimatedSavings && (
          <div className="text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>Potential savings:</span>
            </div>
            <ul className="ml-4 mt-1 text-xs space-y-1">
              {suggestion.estimatedSavings.time && (
                <li>⏱️ {suggestion.estimatedSavings.time}</li>
              )}
              {suggestion.estimatedSavings.cost && (
                <li>💰 ${suggestion.estimatedSavings.cost.toLocaleString()}/year</li>
              )}
            </ul>
          </div>
        )}

        {/* Deadline Warning */}
        {suggestion.deadline && (
          <Alert className={isOverdue ? "border-error-200 bg-error-100" : "border-warning-200 bg-warning-100"}>
            <Clock className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {isOverdue ? "Overdue" : "Due"}: {suggestion.deadline.toLocaleDateString()}
            </AlertDescription>
          </Alert>
        )}

        {/* Reasoning */}
        <details className="text-sm">
          <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
            Why this suggestion?
          </summary>
          <p className="mt-2 text-foreground text-xs leading-relaxed">
            {suggestion.reasoning}
          </p>
        </details>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t">
          {suggestion.actions.map((action, index) => (
            <Button
              key={index}
              variant={action.primary ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => {
                if (action.onClick) {
                  action.onClick();
                } else if (onActionClick) {
                  onActionClick(suggestion.id, action.label);
                }
              }}
              asChild={!!action.href}
            >
              {action.href ? (
                <Link href={action.href} className="flex items-center gap-1">
                  {action.label}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              ) : (
                <span className="flex items-center gap-1">
                  {action.label}
                  <ArrowRight className="h-3 w-3" />
                </span>
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * WorkflowSuggestions Component
 * 
 * AI-powered suggestions for workflow optimization, 
 * urgent actions, and business opportunities
 */
export function WorkflowSuggestions({
  suggestions,
  onDismiss,
  onActionClick,
  loading
}: WorkflowSuggestionsProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-muted rounded w-48 animate-pulse"></div>
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="text-center py-8">
        <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          No suggestions at this time
        </h3>
        <p className="text-muted-foreground">
          AI-powered workflow suggestions will appear here to help optimize your processes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Workflow Suggestions
          </h2>
          <Badge variant="secondary" className="text-xs">
            {suggestions.length}
          </Badge>
        </div>
        <Button variant="outline" size="sm">
          Configure AI
        </Button>
      </div>

      <div className="grid gap-4">
        {suggestions.map((suggestion) => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            onDismiss={onDismiss}
            onActionClick={onActionClick}
          />
        ))}
      </div>
    </div>
  );
}