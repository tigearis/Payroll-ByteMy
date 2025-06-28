/**
 * Client-Safe Role Security Monitoring
 * Provides role monitoring functionality that can be used in client components
 */

import { Role } from '../auth/permissions';

export interface RoleMismatchEvent {
  userId: string;
  clerkUserId: string;
  jwtRole: string;
  databaseRole: string;
  requestPath: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

class ClientRoleSecurityMonitor {
  private static instance: ClientRoleSecurityMonitor;

  private constructor() {}

  static getInstance(): ClientRoleSecurityMonitor {
    if (!ClientRoleSecurityMonitor.instance) {
      ClientRoleSecurityMonitor.instance = new ClientRoleSecurityMonitor();
    }
    return ClientRoleSecurityMonitor.instance;
  }

  /**
   * Monitor role mismatches from client components
   * Sends data to server-side API for processing
   */
  async monitorRoleMismatch(event: RoleMismatchEvent): Promise<void> {
    try {
      // Send to server-side API endpoint for processing
      await fetch('/api/security/role-mismatch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          timestamp: event.timestamp.toISOString(),
        }),
      });
    } catch (error) {
      console.error('Failed to monitor role mismatch from client:', error);
      // Silently fail - don't break the user experience
    }
  }

  /**
   * Monitor escalation attempts from client components
   */
  async monitorEscalationAttempt(event: {
    userId: string;
    clerkUserId: string;
    currentRole: Role;
    attemptedRole: Role;
    requestPath: string;
    ipAddress: string;
    userAgent: string;
    timestamp: Date;
  }): Promise<void> {
    try {
      await fetch('/api/security/escalation-attempt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          timestamp: event.timestamp.toISOString(),
        }),
      });
    } catch (error) {
      console.error('Failed to monitor escalation attempt from client:', error);
      // Silently fail - don't break the user experience
    }
  }
}

export const clientRoleSecurityMonitor = ClientRoleSecurityMonitor.getInstance();
export default clientRoleSecurityMonitor;