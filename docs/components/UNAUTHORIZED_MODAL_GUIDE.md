# Unauthorized Access Modal Guide

This guide covers the modal-based unauthorized access system that provides a consistent UI experience when users encounter permission restrictions.

## Overview

The modal-based unauthorized access system allows the app to handle access denied scenarios without taking users away from their current context. This provides better UX than full-page redirects for most scenarios.

## Components

### UnauthorizedModal

The core modal component that displays unauthorized access messages.

```tsx
import { UnauthorizedModal } from "@/components/auth/unauthorized-modal";

<UnauthorizedModal
  open={isOpen}
  onOpenChange={setIsOpen}
  reason="insufficient_permissions"
  onNavigateHome={() => router.push("/dashboard")}
  onGoBack={() => router.back()}
/>;
```

**Props:**

- `open: boolean` - Controls modal visibility
- `onOpenChange: (open: boolean) => void` - Handle modal open/close events
- `reason?: string` - Type of unauthorized access (see reasons below)
- `onNavigateHome?: () => void` - Custom navigation to dashboard
- `onGoBack?: () => void` - Custom navigation back

### useUnauthorizedModal Hook

A React hook that manages modal state and provides convenient methods.

```tsx
import { useUnauthorizedModal } from "@/hooks/use-unauthorized-modal";

function MyComponent() {
  const unauthorizedModal = useUnauthorizedModal();

  const handleUnauthorizedAction = () => {
    unauthorizedModal.show("insufficient_permissions");
  };

  return (
    <>
      <button onClick={handleUnauthorizedAction}>Protected Action</button>

      <UnauthorizedModal
        open={unauthorizedModal.isOpen}
        onOpenChange={open => !open && unauthorizedModal.hide()}
        reason={unauthorizedModal.reason}
        onNavigateHome={unauthorizedModal.handleNavigateHome}
        onGoBack={unauthorizedModal.handleGoBack}
      />
    </>
  );
}
```

## Unauthorized Reasons

The system supports different types of unauthorized access:

- `"insufficient_permissions"` - User lacks required permissions
- `"inactive"` - User account is deactivated
- `"not_staff"` - Staff access required
- `"expired_session"` - User session has expired
- `"invalid_token"` - Authentication token is invalid

Each reason displays appropriate messaging and actions.

## Usage Patterns

### 1. Direct Modal Usage

Best for interactive components that need inline permission checking:

```tsx
import { useUnauthorizedModal } from "@/hooks/use-unauthorized-modal";
import { UnauthorizedModal } from "@/components/auth/unauthorized-modal";

function ProtectedButton() {
  const unauthorizedModal = useUnauthorizedModal();
  const { hasPermission } = useAuth();

  const handleClick = () => {
    if (!hasPermission("payroll:write")) {
      unauthorizedModal.show("insufficient_permissions");
      return;
    }
    // Proceed with action
  };

  return (
    <>
      <Button onClick={handleClick}>Create Payroll</Button>

      <UnauthorizedModal
        open={unauthorizedModal.isOpen}
        onOpenChange={open => !open && unauthorizedModal.hide()}
        reason={unauthorizedModal.reason}
      />
    </>
  );
}
```

### 2. Navigation-Based Usage

Best for route guards and API error handling:

```tsx
import { useRouter } from "next/navigation";
import { navigateToUnauthorized } from "@/lib/auth/unauthorized-handler";

function RouteGuard() {
  const router = useRouter();

  const handleUnauthorized = () => {
    // Show as modal over current page
    navigateToUnauthorized(router, {
      reason: "insufficient_permissions",
      useModal: true,
    });
  };

  return <Button onClick={handleUnauthorized}>Trigger Modal</Button>;
}
```

### 3. Permission Guard Integration

The `ModalPermissionGuard` component provides declarative permission checking with modal support:

```tsx
import { ModalPermissionGuard } from "@/components/auth/modal-permission-guard";

function ProtectedSection() {
  return (
    <ModalPermissionGuard
      resource="payrolls"
      action="write"
      useModal={true}
      modalReason="insufficient_permissions"
    >
      <PayrollManagementPanel />
    </ModalPermissionGuard>
  );
}
```

### 4. API Error Handling

Handle API unauthorized responses with modals:

```tsx
function useApiWithModal() {
  const unauthorizedModal = useUnauthorizedModal();

  const callApi = async () => {
    try {
      const response = await fetch("/api/protected");
      if (response.status === 401) {
        unauthorizedModal.show("expired_session");
        return;
      }
      if (response.status === 403) {
        unauthorizedModal.show("insufficient_permissions");
        return;
      }
      return response.json();
    } catch (error) {
      // Handle other errors
    }
  };

  return { callApi, unauthorizedModal };
}
```

## When to Use Modal vs Full Page

### Use Modal When:

- User is in the middle of a workflow
- The action is part of a larger form or process
- Context switching would be disruptive
- You want to keep the user engaged with the app

### Use Full Page When:

- User is navigating to a completely restricted area
- The entire page requires specific permissions
- You want to provide detailed help/contact information
- The restriction is at the route level

## URL Support

The unauthorized page supports both modal and full-page modes via URL parameters:

```typescript
// Show as modal
router.push("/unauthorized?reason=insufficient_permissions&modal=true");

// Show as full page
router.push("/unauthorized?reason=insufficient_permissions");
```

## Utility Functions

The `lib/auth/unauthorized-handler.ts` provides helper functions:

```tsx
import {
  navigateToUnauthorized,
  buildUnauthorizedUrl,
  getUnauthorizedMessage,
} from "@/lib/auth/unauthorized-handler";

// Build URL with parameters
const url = buildUnauthorizedUrl({
  reason: "insufficient_permissions",
  useModal: true,
});

// Navigate with Next.js router
navigateToUnauthorized(router, {
  reason: "not_staff",
  useModal: true,
});

// Get user-friendly messages
const { title, description } = getUnauthorizedMessage("inactive");
```

## Best Practices

### 1. Choose the Right Approach

- Use modals for inline permission failures
- Use full page for route-level restrictions

### 2. Provide Clear Actions

- Always include "Go Back" and "Dashboard" buttons
- Consider custom actions based on the reason

### 3. Handle Edge Cases

- Check for modal state before showing new modals
- Provide fallbacks for navigation failures

### 4. Accessibility

- Modal automatically handles focus management
- Includes proper ARIA labels and announcements
- Supports keyboard navigation (ESC to close)

### 5. Consistent Messaging

- Use standard unauthorized reasons when possible
- Provide actionable messages when appropriate
- Include support contact for account issues

## Examples

### Basic Permission Check

```tsx
function CreatePayrollButton() {
  const { showUnauthorized, Modal } = useModalUnauthorized();
  const { hasPermission } = useAuth();

  const handleCreate = () => {
    if (!hasPermission("payroll:write")) {
      showUnauthorized("insufficient_permissions");
      return;
    }
    // Proceed with creation
  };

  return (
    <>
      <Button onClick={handleCreate}>Create Payroll</Button>
      <Modal />
    </>
  );
}
```

### Form Protection

```tsx
function PayrollForm() {
  const unauthorizedModal = useUnauthorizedModal();
  const { hasPermission } = useAuth();

  const handleSubmit = data => {
    if (!hasPermission("payroll:write")) {
      unauthorizedModal.show("insufficient_permissions");
      return;
    }

    // Submit form
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button type="submit">Save Payroll</Button>

      <UnauthorizedModal
        open={unauthorizedModal.isOpen}
        onOpenChange={open => !open && unauthorizedModal.hide()}
        reason={unauthorizedModal.reason}
      />
    </form>
  );
}
```

### Route Guard with Modal

```tsx
function ProtectedPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !user.isStaff) {
      navigateToUnauthorized(router, {
        reason: "not_staff",
        useModal: true,
      });
    }
  }, [user, router]);

  return <PageContent />;
}
```

## Migration from Full Page

To migrate existing full-page unauthorized redirects to modals:

1. **Identify the redirect location**:

   ```tsx
   // Before
   router.push("/unauthorized?reason=insufficient_permissions");

   // After
   navigateToUnauthorized(router, {
     reason: "insufficient_permissions",
     useModal: true,
   });
   ```

2. **Replace with hook-based approach**:

   ```tsx
   // Before - redirect approach
   if (!hasPermission) {
     router.push("/unauthorized");
     return;
   }

   // After - modal approach
   const unauthorizedModal = useUnauthorizedModal();

   if (!hasPermission) {
     unauthorizedModal.show("insufficient_permissions");
     return;
   }
   ```

3. **Update permission guards**:

   ```tsx
   // Before
   <PermissionGuard permission="admin">
     <AdminPanel />
   </PermissionGuard>

   // After
   <ModalPermissionGuard
     resource="system"
     action="admin"
     useModal={true}
   >
     <AdminPanel />
   </ModalPermissionGuard>
   ```

This modal-based approach provides a more seamless user experience while maintaining the security and clarity of unauthorized access handling.
