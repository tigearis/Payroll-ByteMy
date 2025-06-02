"use client";

import { useQuery, gql } from "@apollo/client";
import { isAuthError } from "@/lib/apollo-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw, User } from "lucide-react";
import { toast } from "sonner";

const GET_USERS = gql`
  query GetUsers($limit: Int = 10) {
    users(limit: $limit) {
      id
      name
      email
      role
      is_staff
      clerk_user_id
    }
  }
`;

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  is_staff: boolean;
  clerk_user_id?: string;
}

export function EnhancedUsersList() {
  const { loading, error, data, refetch } = useQuery(GET_USERS, {
    variables: { limit: 10 },
    notifyOnNetworkStatusChange: true,
    onError: (err) => {
      console.error("Query error:", err);

      // Check if it's an auth error using the helper
      if (isAuthError(err)) {
        toast.error("Authentication error. Please sign in again.");
        // The enhanced Apollo client will automatically retry with a fresh token
        return;
      }

      // Handle other errors
      toast.error(`Failed to load users: ${err.message}`);
    },
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Users (Loading...)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">
            Error Loading Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {isAuthError(error)
                ? "Authentication error - the system will automatically retry with a fresh token."
                : error.message}
            </p>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="w-full"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const users: User[] = data?.users || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Users ({users.length})
          </span>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No users found
          </p>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                  {user.is_staff && (
                    <div className="text-xs text-green-600 mt-1">Staff</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
