/**
 * Graceful Clients List - Reference Implementation
 * 
 * This component demonstrates graceful error handling and fallback patterns
 * for permission-based failures in GraphQL operations.
 * 
 * REAL IMPLEMENTATIONS OF THESE PATTERNS:
 * - Permission-based error boundaries: /components/graphql-error-boundary.tsx:73-157
 * - Graceful query with fallbacks: /hooks/use-graceful-query.ts:74-100
 * - Permission error detection: /app/(dashboard)/security/page.tsx:185
 * - Fallback data patterns: Used in user management components throughout /domains/users/
 * 
 * KEY PATTERNS DEMONSTRATED:
 * - useGracefulQuery hook for permission-aware data fetching
 * - GraphQLErrorBoundary for containing permission failures
 * - Fallback data when permissions are insufficient
 * - Graceful degradation without breaking user experience
 * - Permission-specific error messaging
 * 
 * PRODUCTION USAGE:
 * - GraphQLErrorBoundary: Used as wrapper in multiple components
 * - useGracefulQuery: Core infrastructure for permission-aware queries
 * - Permission checks: Throughout /domains/users/components/ with toast notifications
 * 
 * NOTE: This component is NOT used in production - it serves as
 * architectural documentation for graceful error handling patterns.
 */

"use client";

import { Building2, Users, AlertCircle } from "lucide-react";
import { GraphQLErrorBoundary } from "@/components/graphql-error-boundary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GetClientsDocument } from "@/domains/clients/graphql/generated/graphql";
import { useGracefulQuery } from "@/hooks/use-graceful-query";

// Example fallback data for when permissions fail
const FALLBACK_CLIENTS = [
  {
    id: "fallback-1",
    name: "Sample Client 1",
    active: true,
    contact_person: "N/A",
    contact_email: "N/A",
  },
  {
    id: "fallback-2",
    name: "Sample Client 2",
    active: true,
    contact_person: "N/A",
    contact_email: "N/A",
  },
];

interface Client {
  id: string;
  name: string;
  active: boolean;
  contact_person?: string;
  contact_email?: string;
  created_at?: string;
  updated_at?: string;
  payrolls?: Array<{
    id: string;
    name: string;
    status: string;
  }>;
}

function ClientCard({ client }: { client: Client }) {
  return (
    <Card key={client.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {client.name}
          </CardTitle>
          <Badge variant={client.active ? "default" : "secondary"}>
            {client.active ? "Active" : "Inactive"}
          </Badge>
        </div>
        {client.contact_person && client.contact_person !== "N/A" && (
          <CardDescription>
            Contact: {client.contact_person}
            {client.contact_email &&
              client.contact_email !== "N/A" &&
              ` (${client.contact_email})`}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          {client.payrolls ? (
            <span>
              {client.payrolls.length} payroll
              {client.payrolls.length !== 1 ? "s" : ""}
            </span>
          ) : (
            <span>Payroll info not available</span>
          )}
        </div>

        {client.created_at && (
          <div className="text-xs text-muted-foreground mt-2">
            Created: {new Date(client.created_at).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ClientsListContent() {
  const {
    data,
    loading,
    error,
    refetch,
    hasPermissionError,
    permissionError,
    canRetry,
  } = useGracefulQuery<{ clients: Client[] }>(GetClientsDocument, {
    fallbackData: { clients: FALLBACK_CLIENTS },
    contextName: "Clients List",
    showPermissionErrors: true,
  });

  const clients = data?.clients || [];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Status Banner */}
      {hasPermissionError && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Limited Data View: Some fields may not be visible due to
                permission restrictions.
              </span>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              Showing basic client information. Contact your administrator for
              full access.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Retry Button */}
      {error && canRetry && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => refetch()} className="gap-2">
            <AlertCircle className="h-4 w-4" />
            Retry Loading
          </Button>
        </div>
      )}

      {/* Clients Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients.map(client => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>

      {/* Empty State */}
      {clients.length === 0 && !loading && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No clients found
            </h3>
            <p className="text-gray-500">
              {hasPermissionError
                ? "You may not have permission to view clients."
                : "Get started by adding your first client."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Main component wrapped with error boundary
export function GracefulClientsList() {
  return (
    <GraphQLErrorBoundary
      showErrorDetails={process.env.NODE_ENV === "development"}
      onError={(error, errorInfo) => {
        // Could send to error reporting service
        console.error("Clients list error:", error, errorInfo);
      }}
    >
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground">
            Manage your client relationships and view their payroll information.
          </p>
        </div>

        <ClientsListContent />
      </div>
    </GraphQLErrorBoundary>
  );
}

export default GracefulClientsList;
