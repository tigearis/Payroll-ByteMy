"use client";

/**
 * Utilities for handling unauthorized access throughout the app
 */

export type UnauthorizedReason =
  | "inactive"
  | "insufficient_permissions"
  | "not_staff"
  | "expired_session"
  | "invalid_token";

export interface UnauthorizedHandlerOptions {
  reason?: UnauthorizedReason;
  useModal?: boolean;
  redirectTo?: string;
  message?: string;
}

/**
 * Build URL for unauthorized page with optional parameters
 */
export function buildUnauthorizedUrl(
  options: UnauthorizedHandlerOptions = {}
): string {
  const params = new URLSearchParams();

  if (options.reason) {
    params.set("reason", options.reason);
  }

  if (options.useModal) {
    params.set("modal", "true");
  }

  if (options.message) {
    params.set("message", options.message);
  }

  return `/unauthorized${params.toString() ? `?${params.toString()}` : ""}`;
}

/**
 * Handle unauthorized access by redirecting to appropriate page/modal
 */
export function handleUnauthorizedAccess(
  options: UnauthorizedHandlerOptions = {}
) {
  if (typeof window === "undefined") {
    // Server-side: cannot handle navigation
    console.warn("handleUnauthorizedAccess called on server-side");
    return;
  }

  const url = buildUnauthorizedUrl(options);

  if (options.redirectTo) {
    window.location.href = options.redirectTo;
  } else {
    window.location.href = url;
  }
}

/**
 * Client-side navigation for unauthorized access (use with Next.js router)
 */
export function navigateToUnauthorized(
  router: { push: (url: string) => void },
  options: UnauthorizedHandlerOptions = {}
) {
  const url = buildUnauthorizedUrl(options);
  router.push(url);
}

/**
 * Get user-friendly error message for unauthorized reasons
 */
export function getUnauthorizedMessage(reason?: UnauthorizedReason): {
  title: string;
  description: string;
  actionable: boolean;
} {
  switch (reason) {
    case "inactive":
      return {
        title: "Account Inactive",
        description:
          "Your account has been deactivated. Please contact an administrator for assistance.",
        actionable: true,
      };
    case "insufficient_permissions":
      return {
        title: "Insufficient Permissions",
        description:
          "You don't have the required permissions to access this resource.",
        actionable: false,
      };
    case "not_staff":
      return {
        title: "Staff Access Required",
        description: "This resource is only available to staff members.",
        actionable: false,
      };
    case "expired_session":
      return {
        title: "Session Expired",
        description: "Your session has expired. Please sign in again.",
        actionable: true,
      };
    case "invalid_token":
      return {
        title: "Authentication Error",
        description:
          "There was an issue with your authentication. Please sign in again.",
        actionable: true,
      };
    default:
      return {
        title: "Access Denied",
        description: "You don't have permission to access this resource.",
        actionable: false,
      };
  }
}
