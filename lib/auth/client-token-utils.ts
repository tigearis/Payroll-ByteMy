/**
 * Minimal token utilities for backward compatibility
 */

export function decodeJWTToken(token: string): any {
  try {
    const base64Payload = token.split('.')[1];
    return JSON.parse(atob(base64Payload));
  } catch (error) {
    console.error("Failed to decode JWT token:", error);
    return null;
  }
}

// Other utilities can be added here as needed
export function getClientToken() {
  // Placeholder for client token functionality
  return null;
}

export function refreshClientToken() {
  // Placeholder for token refresh functionality
  return Promise.resolve(null);
}

export function clearClientTokens() {
  // Placeholder for clearing tokens
}