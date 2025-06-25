// lib/auth/client-auth-logger.ts
import { toast } from "sonner";

export type AuthEventType = 
  | "login_attempt"
  | "login_success" 
  | "login_failure"
  | "logout"
  | "signup_attempt"
  | "signup_success"
  | "signup_failure"
  | "invitation_accepted"
  | "password_reset"
  | "mfa_challenge"
  | "mfa_success"
  | "mfa_failure"
  | "session_timeout"
  | "oauth_login"
  | "oauth_failure";

export type AuthMethod = 
  | "email_password"
  | "google_oauth"
  | "clerk_elements"
  | "invitation_ticket"
  | "password_reset"
  | "mfa";

export interface AuthEventData {
  eventType: AuthEventType;
  authMethod?: AuthMethod;
  success?: boolean;
  failureReason?: string;
  metadata?: Record<string, any>;
  showToast?: boolean; // Whether to show user-facing notification
}

export class ClientAuthLogger {
  private static instance: ClientAuthLogger;

  static getInstance(): ClientAuthLogger {
    if (!ClientAuthLogger.instance) {
      ClientAuthLogger.instance = new ClientAuthLogger();
    }
    return ClientAuthLogger.instance;
  }

  /**
   * Log an authentication event from the client side
   */
  async logAuthEvent(data: AuthEventData): Promise<boolean> {
    try {
      const eventData = {
        ...data,
        success: data.success ?? true,
        clientInfo: {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          // Note: IP address will be determined server-side from request headers
        }
      };

      const response = await fetch("/api/auth/log-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        const error = await response.json();
        console.warn("Failed to log auth event:", error);
        return false;
      }

      // Show user-facing notification if requested
      if (data.showToast && data.success) {
        this.showSuccessToast(data.eventType);
      } else if (data.showToast && !data.success) {
        this.showErrorToast(data.eventType, data.failureReason);
      }

      return true;
    } catch (error) {
      console.error("Client auth logging error:", error);
      return false;
    }
  }

  /**
   * Log successful login
   */
  async logLogin(method: AuthMethod, metadata?: Record<string, any>): Promise<boolean> {
    return this.logAuthEvent({
      eventType: "login_success",
      authMethod: method,
      success: true,
      metadata: metadata || {},
      showToast: false // Let the app handle success messages
    });
  }

  /**
   * Log failed login attempt
   */
  async logLoginFailure(method: AuthMethod, reason: string, metadata?: Record<string, any>): Promise<boolean> {
    return this.logAuthEvent({
      eventType: "login_failure",
      authMethod: method,
      success: false,
      failureReason: reason,
      metadata: metadata || {},
      showToast: false // Let the app handle error messages
    });
  }

  /**
   * Log successful signup
   */
  async logSignup(method: AuthMethod, metadata?: Record<string, any>): Promise<boolean> {
    return this.logAuthEvent({
      eventType: "signup_success",
      authMethod: method,
      success: true,
      metadata: metadata || {},
      showToast: false
    });
  }

  /**
   * Log failed signup attempt
   */
  async logSignupFailure(method: AuthMethod, reason: string, metadata?: Record<string, any>): Promise<boolean> {
    return this.logAuthEvent({
      eventType: "signup_failure",
      authMethod: method,
      success: false,
      failureReason: reason,
      metadata: metadata || {},
      showToast: false
    });
  }

  /**
   * Log successful invitation acceptance
   */
  async logInvitationAccepted(metadata?: Record<string, any>): Promise<boolean> {
    return this.logAuthEvent({
      eventType: "invitation_accepted",
      authMethod: "invitation_ticket",
      success: true,
      metadata: metadata || {},
      showToast: false
    });
  }

  /**
   * Log logout event
   */
  async logLogout(metadata?: Record<string, any>): Promise<boolean> {
    return this.logAuthEvent({
      eventType: "logout",
      success: true,
      metadata: metadata || {},
      showToast: false
    });
  }

  /**
   * Log OAuth login success
   */
  async logOAuthLogin(provider: string, metadata?: Record<string, any>): Promise<boolean> {
    return this.logAuthEvent({
      eventType: "oauth_login",
      authMethod: "google_oauth", // Extend this for other providers
      success: true,
      metadata: { provider, ...metadata },
      showToast: false
    });
  }

  /**
   * Log OAuth login failure
   */
  async logOAuthFailure(provider: string, reason: string, metadata?: Record<string, any>): Promise<boolean> {
    return this.logAuthEvent({
      eventType: "oauth_failure",
      authMethod: "google_oauth",
      success: false,
      failureReason: reason,
      metadata: { provider, ...metadata },
      showToast: false
    });
  }

  /**
   * Log MFA events
   */
  async logMFAEvent(eventType: "mfa_challenge" | "mfa_success" | "mfa_failure", reason?: string, metadata?: Record<string, any>): Promise<boolean> {
    return this.logAuthEvent({
      eventType,
      authMethod: "mfa",
      success: eventType === "mfa_success",
      failureReason: reason || "",
      metadata: metadata || {},
      showToast: false
    });
  }

  /**
   * Show success toast notification
   */
  private showSuccessToast(eventType: AuthEventType): void {
    const messages: Record<AuthEventType, string> = {
      login_success: "Successfully signed in",
      signup_success: "Account created successfully",
      invitation_accepted: "Welcome to the team!",
      logout: "Successfully signed out",
      oauth_login: "Successfully signed in with OAuth",
      mfa_success: "Multi-factor authentication successful",
      password_reset: "Password reset successful",
      // Add more as needed
      login_attempt: "",
      login_failure: "",
      signup_attempt: "",
      signup_failure: "",
      mfa_challenge: "",
      mfa_failure: "",
      session_timeout: "",
      oauth_failure: ""
    };

    const message = messages[eventType];
    if (message) {
      toast.success(message);
    }
  }

  /**
   * Show error toast notification
   */
  private showErrorToast(eventType: AuthEventType, reason?: string): void {
    const defaultMessages: Record<AuthEventType, string> = {
      login_failure: "Sign in failed",
      signup_failure: "Account creation failed",
      oauth_failure: "OAuth sign in failed",
      mfa_failure: "Multi-factor authentication failed",
      session_timeout: "Session expired",
      // Add more as needed
      login_attempt: "",
      login_success: "",
      signup_attempt: "",
      signup_success: "",
      invitation_accepted: "",
      logout: "",
      oauth_login: "",
      password_reset: "",
      mfa_challenge: "",
      mfa_success: ""
    };

    const defaultMessage = defaultMessages[eventType];
    const message = reason ? `${defaultMessage}: ${reason}` : defaultMessage;
    
    if (message) {
      toast.error(message);
    }
  }

  /**
   * Batch log multiple events (useful for complex auth flows)
   */
  async logMultipleEvents(events: AuthEventData[]): Promise<boolean[]> {
    const results = await Promise.allSettled(
      events.map(event => this.logAuthEvent(event))
    );

    return results.map(result => 
      result.status === "fulfilled" ? result.value : false
    );
  }
}

// Export singleton instance
export const clientAuthLogger = ClientAuthLogger.getInstance();