import { gql } from "@apollo/client";
import { adminApolloClient } from "@/lib/apollo/server-client";
import { securityConfig } from "./config";

// GraphQL mutation to log authentication events
const LOG_AUTH_EVENT = gql`
  mutation LogAuthEvent(
    $event_type: String!
    $user_id: String
    $user_email: String
    $ip_address: String
    $user_agent: String
    $success: Boolean!
    $failure_reason: String
    $metadata: jsonb
  ) {
    insert_audit_auth_events_one(
      object: {
        event_type: $event_type
        user_id: $user_id
        user_email: $user_email
        ip_address: $ip_address
        user_agent: $user_agent
        success: $success
        failure_reason: $failure_reason
        metadata: $metadata
      }
    ) {
      id
    }
  }
`;

// Auth event types
export enum AuthEventType {
  LOGIN = "login",
  LOGOUT = "logout",
  SIGNUP = "signup",
  PASSWORD_RESET = "password_reset",
  PASSWORD_CHANGE = "password_change",
  MFA_ENABLED = "mfa_enabled",
  MFA_DISABLED = "mfa_disabled",
  MFA_CHALLENGE = "mfa_challenge",
  MFA_SUCCESS = "mfa_success",
  MFA_FAILURE = "mfa_failure",
  ACCOUNT_LOCKED = "account_locked",
  ACCOUNT_UNLOCKED = "account_unlocked",
  SESSION_EXPIRED = "session_expired",
  INVALID_TOKEN = "invalid_token",
  INVITATION_ACCEPTED = "invitation_accepted",
  ROLE_CHANGED = "role_changed",
  PERMISSION_CHANGED = "permission_changed",
}

interface AuthEventLogParams {
  eventType: AuthEventType;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  failureReason?: string;
  metadata?: Record<string, any>;
}

/**
 * Log an authentication event to the audit trail
 *
 * @param params The event parameters to log
 * @returns A promise that resolves when the event is logged
 */
export async function logAuthEvent({
  eventType,
  userId,
  userEmail,
  ipAddress,
  userAgent,
  success,
  failureReason,
  metadata = {},
}: AuthEventLogParams): Promise<boolean> {
  // Skip logging if audit is disabled
  if (!securityConfig.audit.enabled) {
    return true;
  }

  try {
    await adminApolloClient.mutate({
      mutation: LOG_AUTH_EVENT,
      variables: {
        event_type: eventType,
        user_id: userId,
        user_email: userEmail,
        ip_address: ipAddress,
        user_agent: userAgent,
        success,
        failure_reason: failureReason,
        metadata,
      },
    });

    return true;
  } catch (error) {
    console.error("Failed to log auth event:", error);
    // Don't throw - we don't want auth logging to block the main flow
    return false;
  }
}

/**
 * Log a successful login event
 */
export async function logSuccessfulLogin(
  userId: string,
  userEmail: string,
  ipAddress: string,
  userAgent: string
): Promise<void> {
  await logAuthEvent({
    eventType: AuthEventType.LOGIN,
    userId,
    userEmail,
    ipAddress,
    userAgent,
    success: true,
    metadata: {
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Log a failed login attempt
 */
export async function logFailedLogin(
  userEmail: string,
  ipAddress: string,
  userAgent: string,
  reason: string
): Promise<void> {
  await logAuthEvent({
    eventType: AuthEventType.LOGIN,
    userEmail,
    ipAddress,
    userAgent,
    success: false,
    failureReason: reason,
    metadata: {
      timestamp: new Date().toISOString(),
      attemptCount: 1, // This would be incremented by the caller
    },
  });
}

/**
 * Log MFA status changes
 */
export async function logMfaStatusChange(
  userId: string,
  userEmail: string,
  enabled: boolean,
  ipAddress: string,
  userAgent: string
): Promise<void> {
  await logAuthEvent({
    eventType: enabled ? AuthEventType.MFA_ENABLED : AuthEventType.MFA_DISABLED,
    userId,
    userEmail,
    ipAddress,
    userAgent,
    success: true,
    metadata: {
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Log role or permission changes
 */
export async function logRoleChange(
  userId: string,
  userEmail: string,
  oldRole: string,
  newRole: string,
  changedBy: string,
  ipAddress: string
): Promise<void> {
  await logAuthEvent({
    eventType: AuthEventType.ROLE_CHANGED,
    userId,
    userEmail,
    ipAddress,
    success: true,
    metadata: {
      timestamp: new Date().toISOString(),
      oldRole,
      newRole,
      changedBy,
    },
  });
}
