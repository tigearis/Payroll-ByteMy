import { useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";

// Types for actor token operations
export interface ActorTokenRequest {
  targetUserId: string;
  expiresInSeconds?: number;
  purpose?: string;
}

export interface ActorTokenResponse {
  success: boolean;
  actorToken: {
    id: string;
    token: string;
    url: string;
    status: string;
    expiresAt: string;
    actor: {
      userId: string;
      email?: string;
      role: string;
    };
    target: {
      userId: string;
      email?: string;
      role?: string;
    };
    purpose: string;
  };
  usage: {
    consumeUrl: string;
    consumeInstructions: string;
    revokeEndpoint: string;
  };
}

export interface RevokeTokenResponse {
  success: boolean;
  message: string;
  revokedToken: {
    id: string;
    status: string;
    revokedAt: string;
    revokedBy: {
      userId: string;
      email?: string;
      role: string;
    };
  };
}

/**
 * Hook for managing actor tokens in development environments
 *
 * This hook provides utilities for creating and revoking actor tokens,
 * which allow developers and AI systems to impersonate users for testing purposes.
 *
 * @example
 * ```typescript
 * const { createActorToken, revokeActorToken, isLoading, error } = useActorTokens();
 *
 * // Create a token to impersonate a consultant user
 * const token = await createActorToken({
 *   targetUserId: 'user_2a...',
 *   purpose: 'testing_consultant_permissions'
 * });
 *
 * // Use the token URL to sign in as that user
 * window.open(token.usage.consumeUrl, '_blank');
 *
 * // Later, revoke the token
 * await revokeActorToken(token.actorToken.id);
 * ```
 */
export function useActorTokens() {
  const { isSignedIn, userId } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if we're in development environment
  const isDevelopment = process.env.NODE_ENV === "development";

  /**
   * Create an actor token for user impersonation
   */
  const createActorToken = useCallback(
    async (request: ActorTokenRequest): Promise<ActorTokenResponse | null> => {
      if (!isDevelopment) {
        setError("Actor tokens are only available in development environment");
        return null;
      }

      if (!isSignedIn || !userId) {
        setError("You must be signed in to create actor tokens");
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/dev/actor-tokens", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            targetUserId: request.targetUserId,
            expiresInSeconds: request.expiresInSeconds || 600, // Default 10 minutes
            purpose: request.purpose || "development_testing",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create actor token");
        }

        console.log("🎭 Actor token created:", {
          tokenId: data.actorToken.id,
          target: data.actorToken.target.email,
          purpose: data.actorToken.purpose,
          expiresAt: data.actorToken.expiresAt,
        });

        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("🚨 Actor token creation failed:", errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isDevelopment, isSignedIn, userId]
  );

  /**
   * Revoke an actor token
   */
  const revokeActorToken = useCallback(
    async (tokenId: string): Promise<RevokeTokenResponse | null> => {
      if (!isDevelopment) {
        setError("Actor tokens are only available in development environment");
        return null;
      }

      if (!isSignedIn || !userId) {
        setError("You must be signed in to revoke actor tokens");
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/dev/actor-tokens/${tokenId}/revoke`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to revoke actor token");
        }

        console.log("🎭 Actor token revoked:", {
          tokenId: data.revokedToken.id,
          revokedAt: data.revokedToken.revokedAt,
        });

        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("🚨 Actor token revocation failed:", errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isDevelopment, isSignedIn, userId]
  );

  /**
   * Get information about the actor token API
   */
  const getActorTokenInfo = useCallback(async () => {
    if (!isDevelopment) {
      return null;
    }

    try {
      const response = await fetch("/api/dev/actor-tokens");
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("🚨 Failed to get actor token info:", err);
      return null;
    }
  }, [isDevelopment]);

  /**
   * Helper function to impersonate a user by opening their actor token URL
   */
  const impersonateUser = useCallback(
    async (
      targetUserId: string,
      purpose: string = "manual_testing",
      openInNewTab: boolean = true
    ) => {
      const tokenResponse = await createActorToken({
        targetUserId,
        purpose,
        expiresInSeconds: 1800, // 30 minutes for manual testing
      });

      if (tokenResponse) {
        const url = tokenResponse.usage.consumeUrl;

        if (openInNewTab) {
          window.open(url, "_blank");
        } else {
          window.location.href = url;
        }

        return tokenResponse;
      }

      return null;
    },
    [createActorToken]
  );

  return {
    createActorToken,
    revokeActorToken,
    getActorTokenInfo,
    impersonateUser,
    isLoading,
    error,
    isDevelopment,
    canUseActorTokens: isDevelopment && isSignedIn,
  };
}
