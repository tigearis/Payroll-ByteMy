/**
 * Minimal service auth for backward compatibility
 */

export function validateServiceAuth(): boolean {
  return true; // Simplified - allow all service requests
}

export function getServiceToken(): string | null {
  return null; // No service token needed in simplified system
}

export function authenticateServiceRequest(): boolean {
  return true; // Allow all service requests in simplified system
}