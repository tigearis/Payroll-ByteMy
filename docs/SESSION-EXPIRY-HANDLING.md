# Session Expiry Handling

This document explains the implementation of session expiry handling in the Payroll Matrix application, specifically addressing the `JWTExpired` error that was causing UI issues.

## Problem

Users were experiencing the following issues:

1. GraphQL errors with message: `Could not verify JWT: JWTExpired`
2. UI components (like Client Payrolls table) not rendering correctly
3. Toast error messages appearing unexpectedly
4. No automatic session refresh or graceful handling of expired tokens

## Solution

We've implemented a comprehensive session expiry handling system with the following components:

### 1. Enhanced Apollo Error Link (`lib/apollo-client.ts`)

- Added detection for JWT expiration errors in GraphQL responses
- Implemented a custom event system (`SESSION_EXPIRED_EVENT`) to notify the application when a JWT expires
- Enhanced retry logic to avoid retrying auth errors (which need token refresh instead)
- Clear token cache when JWT expiry is detected

```typescript
// Check for auth errors that need token refresh
if (
  err.extensions?.code === "invalid-jwt" ||
  err.extensions?.code === "access-denied" ||
  err.message.includes("JWTExpired") ||
  err.message.includes("Could not verify JWT")
) {
  console.log("🔄 Detected JWT expiry, clearing cache and retrying");

  // Dispatch custom event for session expiry handler
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(SESSION_EXPIRED_EVENT, {
        detail: { error: err, operation: operation.operationName },
      })
    );
  }

  // Clear token cache
  tokenCache = { token: null, expiresAt: 0 };

  // ... token refresh and retry logic ...
}
```

### 2. Global Session Expiry Handler (`lib/session-expiry-handler.tsx`)

- Created a dedicated component to monitor for session expiry events
- Listens for:
  - Custom `SESSION_EXPIRED_EVENT` from Apollo
  - Global error events that might indicate JWT expiration
  - Unhandled promise rejections related to auth
- Implements a token refresh workflow:
  1. Detect expired token
  2. Clear Apollo cache
  3. Attempt to refresh user data and token via `refreshUserData()`
  4. Show appropriate UI feedback
  5. Redirect to login if refresh fails

```typescript
// Handle session expiry
const handleSessionExpiry = useCallback(async () => {
  // Prevent multiple simultaneous refresh attempts
  if (isRefreshing || isSessionExpired) {
    return;
  }

  setIsRefreshing(true);

  try {
    console.log("🔄 Session appears to be expired, attempting refresh...");

    // Clear Apollo cache to remove any stale data
    await apolloClient.clearStore();

    // Attempt to refresh user data and token
    await refreshUserData();

    // Check if we're still authenticated after refresh
    if (isAuthenticated) {
      console.log("✅ Session refreshed successfully");
      toast.success("Session refreshed", {
        description: "Your session has been refreshed successfully.",
        duration: 3000,
      });
    } else {
      // If refresh failed and we're not authenticated, handle as expired
      setIsSessionExpired(true);
      showSessionExpiredMessage();
    }
  } catch (error) {
    console.error("❌ Failed to refresh session:", error);
    setIsSessionExpired(true);
    showSessionExpiredMessage();
  } finally {
    setIsRefreshing(false);
  }
}, [
  isRefreshing,
  isSessionExpired,
  apolloClient,
  refreshUserData,
  isAuthenticated,
]);
```

### 3. Integration with Application (`app/providers.tsx`)

- Added the `SessionExpiryHandler` to the provider tree
- Ensures it's available throughout the application
- Positioned after `AuthProvider` but before other components to handle session issues early

```tsx
<AuthProvider>
  <StrictDatabaseGuard>
    {/* Global session expiry handler */}
    <SessionExpiryHandler />
    {children}
  </StrictDatabaseGuard>
</AuthProvider>
```

## User Experience

With this implementation, users will experience:

1. **Automatic Token Refresh**: When a token expires, the system will attempt to refresh it silently
2. **Success Notification**: If refresh succeeds, a brief toast will confirm the session was refreshed
3. **Clear Error Messaging**: If refresh fails, a user-friendly message explains the session expired
4. **Easy Re-authentication**: A "Sign In" button in the toast allows immediate action
5. **Automatic Redirect**: If no action is taken, automatic redirect to login after 15 seconds

## SOC 2 Compliance

This implementation supports SOC 2 compliance requirements:

- **Session Management**: Proper handling of token expiry and session timeouts
- **Audit Logging**: Console logs for session expiry events and refresh attempts
- **Authentication Controls**: Ensures only authenticated users can access protected resources
- **User Experience**: Clear feedback when authentication state changes

## Technical Notes

1. **Token Caching**: The app caches tokens for 30 minutes (client-side) or 5 minutes less than actual expiry (server-side)
2. **Event System**: Uses custom events to decouple error detection from handling
3. **Debouncing**: Prevents multiple simultaneous refresh attempts
4. **Memory Management**: Uses proper cleanup in useEffect hooks to prevent memory leaks

## Future Improvements

Potential enhancements to consider:

1. **Proactive Refresh**: Refresh tokens before they expire (e.g., at 80% of their lifetime)
2. **Background Refresh**: Implement a background interval to check token validity
3. **Session Timeout Warning**: Warn users before their session expires
4. **Offline Support**: Handle token refresh when connectivity is restored after being offline

## Testing

To test this implementation:

1. Let a session expire naturally (tokens typically last 1 hour)
2. Observe the automatic refresh attempt
3. Verify UI components recover after refresh
4. Test manual refresh by clicking "Sign In" in the expiry toast
5. Verify redirect behavior if no action is taken
