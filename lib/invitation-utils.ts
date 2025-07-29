/**
 * Invitation Flow Utilities
 * 
 * Handles Clerk invitation ticket detection and flow management
 * for both custom sign-up and accept-invitation pages
 */

import { extractClerkTicketData, type ClerkTicketUserData } from './clerk-ticket-utils';

export interface InvitationTicketData {
  ticket: string;
  status: 'sign_up' | 'sign_in' | 'complete';
  redirectUrl?: string;
  // Enhanced with ticket-first user data
  userData?: ClerkTicketUserData;
}

export interface InvitationFlowState {
  hasTicket: boolean;
  ticketData: InvitationTicketData | null;
  isInvitationFlow: boolean;
  shouldUseTicketStrategy: boolean;
}

/**
 * Extract Clerk invitation parameters from URL search params
 * Enhanced with ticket-first user data extraction
 */
export function extractInvitationParams(searchParams: URLSearchParams): InvitationTicketData | null {
  const ticket = searchParams.get('__clerk_ticket');
  const status = searchParams.get('__clerk_status') as 'sign_up' | 'sign_in' | 'complete' | null;
  const redirectUrl = searchParams.get('redirect_url');

  if (!ticket) {
    return null;
  }

  // Extract user data from ticket using ticket-first strategy
  let userData: ClerkTicketUserData | undefined;
  const ticketValidation = extractClerkTicketData(ticket);
  if (ticketValidation.isValid && ticketValidation.userData) {
    userData = ticketValidation.userData;
    console.log("🎫 Extracted user data from invitation ticket:", {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      fullName: userData.fullName,
      invitationId: userData.invitationId,
      role: userData.role
    });
  } else {
    console.warn("⚠️ Could not extract user data from invitation ticket:", ticketValidation.error);
  }

  return {
    ticket,
    status: status || 'sign_up', // Default to sign_up if status not provided
    redirectUrl: redirectUrl || undefined,
    userData, // Include extracted user data
  };
}

/**
 * Get invitation flow state from current URL
 */
export function getInvitationFlowState(searchParams: URLSearchParams): InvitationFlowState {
  const ticketData = extractInvitationParams(searchParams);
  const hasTicket = ticketData !== null;
  const isInvitationFlow = hasTicket;
  const shouldUseTicketStrategy = hasTicket && ticketData?.status === 'sign_up';

  return {
    hasTicket,
    ticketData,
    isInvitationFlow,
    shouldUseTicketStrategy,
  };
}

/**
 * Build sign-up URL with invitation ticket parameters
 */
export function buildSignUpUrlWithTicket(
  baseSignUpUrl: string, 
  ticket: string, 
  redirectUrl?: string
): string {
  const url = new URL(baseSignUpUrl, window.location.origin);
  url.searchParams.set('__clerk_ticket', ticket);
  
  if (redirectUrl) {
    url.searchParams.set('redirect_url', redirectUrl);
  }
  
  return url.toString();
}

/**
 * Build sign-in URL with invitation ticket parameters
 */
export function buildSignInUrlWithTicket(
  baseSignInUrl: string,
  ticket: string,
  redirectUrl?: string
): string {
  const url = new URL(baseSignInUrl, window.location.origin);
  url.searchParams.set('__clerk_ticket', ticket);
  
  if (redirectUrl) {
    url.searchParams.set('redirect_url', redirectUrl);
  }
  
  return url.toString();
}

/**
 * Determine redirect action based on Clerk status
 */
export function getInvitationRedirectAction(
  ticketData: InvitationTicketData,
  currentUrl: string
): {
  action: 'redirect_sign_up' | 'redirect_sign_in' | 'already_complete' | 'handle_locally';
  redirectUrl?: string;
} {
  const baseRedirectUrl = ticketData.redirectUrl || currentUrl;

  switch (ticketData.status) {
    case 'sign_up':
      return {
        action: 'redirect_sign_up',
        redirectUrl: buildSignUpUrlWithTicket('/sign-up', ticketData.ticket, baseRedirectUrl),
      };
      
    case 'sign_in':
      return {
        action: 'redirect_sign_in', 
        redirectUrl: buildSignInUrlWithTicket('/sign-in', ticketData.ticket, baseRedirectUrl),
      };
      
    case 'complete':
      return {
        action: 'already_complete',
      };
      
    default:
      return {
        action: 'handle_locally',
      };
  }
}

/**
 * Log invitation flow debugging information
 */
export function logInvitationFlow(context: string, state: InvitationFlowState, additionalData?: any) {
  console.log(`🎫 Invitation Flow [${context}]:`, {
    hasTicket: state.hasTicket,
    status: state.ticketData?.status,
    ticket: state.ticketData?.ticket ? `${state.ticketData.ticket.substring(0, 20)}...` : 'None',
    redirectUrl: state.ticketData?.redirectUrl,
    shouldUseTicketStrategy: state.shouldUseTicketStrategy,
    isInvitationFlow: state.isInvitationFlow,
    ...additionalData,
  });
}