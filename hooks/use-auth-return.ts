// Clerk auth return type interface
export interface UseAuthReturn {
  user: {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  } | null;
  isSignedIn: boolean;
  isLoaded: boolean;
}

// Re-export for compatibility
export type { UseAuthReturn as ClerkUserAuth };