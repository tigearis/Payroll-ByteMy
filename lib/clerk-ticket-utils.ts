/**
 * Clerk Ticket Utilities
 * 
 * Functions for extracting and validating data from Clerk JWT invitation tickets
 * Implements ticket-first strategy for user data extraction
 */

export interface ClerkTicketUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  invitationId?: string;
  organizationId?: string;
  role?: string;
  ticketType?: string;
  issuedAt?: number;
  expiresAt?: number;
}

export interface ClerkTicketValidationResult {
  isValid: boolean;
  invitationId?: string;
  userData?: ClerkTicketUserData;
  error?: string;
  rawPayload?: any;
}

/**
 * Extract and validate data from a Clerk JWT invitation ticket
 * Implements ticket-first strategy for reliable data extraction
 */
export function extractClerkTicketData(clerkTicket: string): ClerkTicketValidationResult {
  if (!clerkTicket || typeof clerkTicket !== 'string') {
    return {
      isValid: false,
      error: 'Invalid ticket: missing or not a string'
    };
  }

  try {
    // Validate JWT structure (header.payload.signature)
    const parts = clerkTicket.split('.');
    if (parts.length !== 3) {
      return {
        isValid: false,
        error: 'Invalid JWT format: expected 3 parts separated by dots'
      };
    }

    // Decode the payload
    const base64Payload = parts[1];
    if (!base64Payload) {
      return {
        isValid: false,
        error: 'Invalid JWT: missing payload'
      };
    }

    const decodedPayload = JSON.parse(atob(base64Payload));
    
    // Extract invitation ID (required)
    const invitationId = decodedPayload.sid || decodedPayload.invitation_id;
    if (!invitationId) {
      return {
        isValid: false,
        error: 'Invalid invitation ticket: no invitation ID found',
        rawPayload: decodedPayload
      };
    }

    // Extract user data with multiple field name support
    const userData: ClerkTicketUserData = {
      email: decodedPayload.email || decodedPayload.email_address,
      firstName: decodedPayload.first_name || decodedPayload.given_name,
      lastName: decodedPayload.last_name || decodedPayload.family_name,
      fullName: decodedPayload.name || decodedPayload.full_name,
      invitationId,
      organizationId: decodedPayload.org_id || decodedPayload.organization_id,
      role: decodedPayload.role || decodedPayload.org_role,
      ticketType: decodedPayload.ticket_type || 'invitation',
      issuedAt: decodedPayload.iat,
      expiresAt: decodedPayload.exp,
    };

    return {
      isValid: true,
      invitationId,
      userData,
      rawPayload: decodedPayload
    };

  } catch (decodeError) {
    return {
      isValid: false,
      error: `Failed to decode JWT ticket: ${decodeError instanceof Error ? decodeError.message : 'Unknown error'}`
    };
  }
}

/**
 * Validate ticket expiration
 */
export function isTicketExpired(ticketData: ClerkTicketUserData): boolean {
  if (!ticketData.expiresAt) {
    return false; // No expiration data, assume valid
  }

  const expirationTime = ticketData.expiresAt * 1000; // Convert to milliseconds
  return Date.now() > expirationTime;
}

/**
 * Get the most reliable name data from ticket
 * Priority: 1) firstName/lastName, 2) fullName parsed, 3) fallback
 */
export function getReliableNameFromTicket(
  ticketData: ClerkTicketUserData, 
  fallbackName?: string
): { firstName: string; lastName: string; source: string } {
  
  // Best case: separate firstName/lastName in ticket
  if (ticketData.firstName && ticketData.lastName) {
    return {
      firstName: ticketData.firstName,
      lastName: ticketData.lastName,
      source: 'ticket-separated'
    };
  }
  
  // Second best: fullName in ticket
  if (ticketData.fullName) {
    const nameParts = ticketData.fullName.trim().split(/\s+/);
    return {
      firstName: nameParts[0] || "",
      lastName: nameParts.length > 1 ? nameParts.slice(1).join(" ") : "",
      source: 'ticket-fullname'
    };
  }
  
  // Fallback to provided name
  if (fallbackName) {
    const nameParts = fallbackName.trim().split(/\s+/);
    return {
      firstName: nameParts[0] || "",
      lastName: nameParts.length > 1 ? nameParts.slice(1).join(" ") : "",
      source: 'fallback'
    };
  }
  
  // No name data available
  return {
    firstName: "",
    lastName: "",
    source: 'empty'
  };
}

/**
 * Enhanced ticket validation that includes database invitation lookup
 * This function should only be used on the server side (API routes)
 * For client-side usage, use extractClerkTicketData() instead
 */
export async function extractClerkTicketDataWithInvitation(clerkTicket: string): Promise<ClerkTicketValidationResult & { invitationData?: any }> {
  // First, validate the JWT ticket
  const jwtResult = extractClerkTicketData(clerkTicket);
  
  if (!jwtResult.isValid || !jwtResult.invitationId) {
    return jwtResult;
  }

  // For server-side usage only - make API call instead of direct import
  try {
    const response = await fetch('/api/invitations/lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clerkInvitationId: jwtResult.invitationId })
    });

    if (!response.ok) {
      console.warn('Failed to fetch invitation data via API');
      return jwtResult;
    }

    const { invitation } = await response.json();

    if (invitation) {
      // Merge JWT data with database invitation data
      const enhancedUserData: ClerkTicketUserData = {
        ...jwtResult.userData,
        // Prioritize database invitation data for names
        firstName: invitation.firstName || jwtResult.userData?.firstName,
        lastName: invitation.lastName || jwtResult.userData?.lastName,
        email: invitation.email || jwtResult.userData?.email,
        role: invitation.invitedRole || jwtResult.userData?.role,
      };

      return {
        ...jwtResult,
        userData: enhancedUserData,
        invitationData: invitation
      };
    }

    // If no invitation found in database, return original JWT result
    return jwtResult;

  } catch (error) {
    console.warn('Failed to fetch invitation data from database:', error);
    // Return original JWT result even if database lookup fails
    return jwtResult;
  }
}

/**
 * Get the most reliable email from ticket
 * Priority: 1) ticket email, 2) fallback email
 */
export function getReliableEmailFromTicket(
  ticketData: ClerkTicketUserData,
  fallbackEmail?: string
): { email: string; source: string } {
  
  if (ticketData.email) {
    return {
      email: ticketData.email,
      source: 'ticket'
    };
  }
  
  if (fallbackEmail) {
    return {
      email: fallbackEmail,
      source: 'fallback'
    };
  }
  
  return {
    email: "",
    source: 'empty'
  };
}

/**
 * Debug logging helper for ticket data
 */
export function logTicketData(context: string, ticketData: ClerkTicketUserData, additionalData?: any) {
  console.log(`🎫 Ticket Data [${context}]:`, {
    email: ticketData.email,
    firstName: ticketData.firstName,
    lastName: ticketData.lastName,
    fullName: ticketData.fullName,
    invitationId: ticketData.invitationId,
    role: ticketData.role,
    hasOrgData: !!ticketData.organizationId,
    ticketType: ticketData.ticketType,
    isExpired: isTicketExpired(ticketData),
    expiresAt: ticketData.expiresAt ? new Date(ticketData.expiresAt * 1000).toISOString() : 'Unknown',
    ...additionalData
  });
}