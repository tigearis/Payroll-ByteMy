"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ShieldX, AlertTriangle } from "lucide-react";
import type { PermissionResult } from "@/hooks/use-enhanced-permissions";

interface PermissionDeniedProps {
  result: PermissionResult;
  showSuggestions?: boolean;
}

export function PermissionDenied({
  result,
  showSuggestions = true,
}: PermissionDeniedProps) {
  const { reason, requiredRole, currentRole, suggestions } = result;

  return (
    <div className="p-4 max-w-md mx-auto">
      <Alert variant="destructive">
        <ShieldX className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription className="mt-2">
          {reason || "You do not have permission to access this resource."}
        </AlertDescription>
      </Alert>

      {requiredRole && currentRole && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
            <span className="text-sm text-yellow-800">
              Required role: <strong>{requiredRole}</strong> (you have:{" "}
              <strong>{currentRole}</strong>)
            </span>
          </div>
        </div>
      )}

      {showSuggestions && suggestions && suggestions.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            What you can do:
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => (window.location.href = "/dashboard")}
        >
          Dashboard
        </Button>
      </div>
    </div>
  );
}
