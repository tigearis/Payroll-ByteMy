# Modal Implementation Guide

This guide provides comprehensive documentation for implementing modals in the Payroll-ByteMy application, covering patterns, best practices, and architectural decisions.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Modal Types and Use Cases](#modal-types-and-use-cases)
3. [Implementation Patterns](#implementation-patterns)
4. [Permission Integration](#permission-integration)
5. [Accessibility and UX](#accessibility-and-ux)
6. [Error Handling](#error-handling)
7. [Performance Optimization](#performance-optimization)
8. [Best Practices](#best-practices)
9. [Examples](#examples)
10. [Troubleshooting](#troubleshooting)

## Architecture Overview

### Three-Tier Modal System

The application uses a three-tier modal architecture with clear recommendations:

#### 1. Radix Dialog (✅ Recommended)
```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
```

**Advantages:**
- Full accessibility support (focus trap, ARIA labels, ESC handling)
- Flexible composition pattern
- Built on `@radix-ui/react-dialog` primitives
- Used in 85% of current implementations

#### 2. Alert Dialog (✅ For Confirmations)
```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
```

**Use Cases:**
- Confirmation dialogs
- Destructive action warnings
- Simple yes/no decisions

#### 3. Basic Modal (❌ Deprecated)
The basic modal component should not be used for new implementations due to limited accessibility features.

## Modal Types and Use Cases

### 1. Form Modals
**Primary use case**: Creating or editing entities with complex forms

**Examples:**
- `CreateUserModal` - Staff creation with role assignment
- `EditUserModal` - User profile editing
- `UserFormModal` - Multi-mode create/edit modal

**Characteristics:**
- React Hook Form integration
- Zod schema validation
- Permission-based field visibility
- Loading states and error handling

### 2. Confirmation Dialogs
**Primary use case**: Confirming destructive or important actions

**Examples:**
- Client deletion confirmation
- Payroll finalization confirmation
- Data export warnings

**Characteristics:**
- AlertDialog component
- Clear action/cancel buttons
- Warning styling for destructive actions

### 3. Information Modals
**Primary use case**: Displaying or editing simple content

**Examples:**
- `NotesModal` - Adding/editing notes
- Help dialogs
- Status information

**Characteristics:**
- Simple content display
- Minimal interaction
- Single action focus

### 4. Multi-Mode Modals
**Primary use case**: Components that handle both creation and editing

**Characteristics:**
- Mode-based props (`"create" | "edit"`)
- Dynamic schema validation
- Conditional field rendering

## Implementation Patterns

### Standard Props Interface

```tsx
interface ModalProps {
  // Required modal controls
  isOpen: boolean;
  onClose: () => void;
  
  // Entity data (for edit mode)
  user?: UserType;
  
  // Dependencies
  managers: Manager[];
  
  // Permissions
  permissions: UserPermissions | null;
  currentUserRole: string | null;
  
  // Callbacks
  onSuccess?: () => void;
}
```

### Form Modal Template

```tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@clerk/nextjs";

// Schema definition
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  // ... other fields
});

type FormData = z.infer<typeof schema>;

interface MyModalProps {
  isOpen: boolean;
  onClose: () => void;
  permissions: UserPermissions | null;
}

export function MyModal({ isOpen, onClose, permissions }: MyModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getToken } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const handleSubmit = async (data: FormData) => {
    // Permission check
    if (!permissions?.canCreate) {
      toast.error("You don't have permission to create this resource");
      return;
    }

    setIsSubmitting(true);
    try {
      // API call implementation
      const token = await getToken({ template: "hasura" });
      const response = await fetch("/api/endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create resource");
      }

      toast.success("Resource created successfully");
      form.reset();
      onClose();
    } catch (error) {
      console.error("Create error:", error);
      toast.error(error instanceof Error ? error.message : "Creation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return; // Prevent close during submission
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Resource</DialogTitle>
          <DialogDescription>
            Fill in the information below to create a new resource.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter name"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email"
                      type="email"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Resource
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

### Confirmation Dialog Template

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isDestructive?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isDestructive = false,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmationDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={isDestructive ? "bg-red-600 hover:bg-red-700" : ""}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

## Permission Integration

### Permission Checking Patterns

#### Early Return Pattern
```tsx
const handleSubmit = async (data: FormData) => {
  // Check permissions first
  if (!permissions?.canCreate) {
    toast.error("You don't have permission to create users");
    return;
  }

  if (!canAssignRole(data.role)) {
    toast.error(`You cannot assign the ${data.role} role`);
    return;
  }

  // Proceed with submission
};
```

#### Conditional Rendering
```tsx
// Modal-level permission check
if (!canManageUsers && !canInviteUsers) {
  return null;
}

// Field-level permission check
{hasPermission("staff:write") && (
  <FormField name="managerId" />
)}
```

#### Permission Props
```tsx
interface ModalProps {
  permissions: UserPermissions | null;
  currentUserRole: string | null;
}

// Usage
<CreateUserModal
  permissions={permissions}
  currentUserRole={currentUserRole}
  // ... other props
/>
```

### Role-Based Modal Behavior

```tsx
// Dynamic field visibility based on role
const canAssignManager = userRole === "org_admin" || userRole === "manager";
const availableRoles = getRolesByPermission(currentUserRole);

// Conditional form fields
{canAssignManager && (
  <FormField
    control={form.control}
    name="managerId"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Manager</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select a manager" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {managers.map(manager => (
              <SelectItem key={manager.id} value={manager.id}>
                {manager.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormItem>
    )}
  />
)}
```

## Accessibility and UX

### Built-in Accessibility Features

When using Radix Dialog, the following accessibility features are automatically provided:

- **Focus Management**: Focus is trapped within the modal
- **Keyboard Navigation**: ESC key closes modal, Enter submits forms
- **ARIA Labels**: Proper `aria-labelledby` and `aria-describedby`
- **Screen Reader Support**: Appropriate announcements for modal open/close

### Manual Accessibility Enhancements

#### Focus Management
```tsx
import { useEffect, useRef } from "react";

export function MyModal({ isOpen }: { isOpen: boolean }) {
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && firstFieldRef.current) {
      // Focus first field when modal opens
      firstFieldRef.current.focus();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <Input ref={firstFieldRef} placeholder="Focus me first" />
      </DialogContent>
    </Dialog>
  );
}
```

#### Screen Reader Support
```tsx
<DialogContent>
  <DialogHeader>
    <DialogTitle>Create User</DialogTitle>
    <DialogDescription>
      Add a new user to the system. They will receive an invitation email.
    </DialogDescription>
  </DialogHeader>
  
  {/* Use sr-only for screen reader only content */}
  <div className="sr-only">
    Required fields are marked with an asterisk
  </div>
</DialogContent>
```

### Loading States and UX

#### Button Loading States
```tsx
<Button type="submit" disabled={isSubmitting}>
  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  {isSubmitting ? "Creating..." : "Create User"}
</Button>
```

#### Form Field Disabling
```tsx
<Input
  {...field}
  disabled={isSubmitting}
  placeholder="Enter email address"
/>

<Select disabled={isSubmitting}>
  <SelectTrigger>
    <SelectValue placeholder="Select role" />
  </SelectTrigger>
</Select>
```

#### Close Prevention During Operations
```tsx
const handleClose = () => {
  // Prevent closing during submission
  if (isSubmitting) {
    return;
  }
  
  // Reset form and close
  form.reset();
  onClose();
};

<Dialog open={isOpen} onOpenChange={handleClose}>
```

## Error Handling

### Comprehensive Error Handling Pattern

```tsx
const handleSubmit = async (data: FormData) => {
  setIsSubmitting(true);
  try {
    const response = await fetch("/api/endpoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    // Check response status first
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorText = await response.text();
        if (errorText) {
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorData.details || errorMessage;
          } catch {
            errorMessage = errorText;
          }
        }
      } catch {
        // Use default error message
      }
      throw new Error(errorMessage);
    }

    // Parse JSON response
    let responseData;
    try {
      const responseText = await response.text();
      if (!responseText) {
        throw new Error("Empty response from server");
      }
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      throw new Error("Invalid response format from server");
    }

    // Success handling
    toast.success("Operation completed successfully");
    form.reset();
    onClose();
  } catch (error) {
    console.error("Operation failed:", error);
    const errorMessage = error instanceof Error ? error.message : "Operation failed";
    toast.error(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};
```

### GraphQL Error Handling

```tsx
const [updateUser] = useMutation(UpdateUserDocument, {
  onCompleted: (data) => {
    toast.success("User updated successfully");
    form.reset();
    onClose();
  },
  onError: (error) => {
    console.error("GraphQL error:", error);
    
    if (error.graphQLErrors.length > 0) {
      const graphQLError = error.graphQLErrors[0];
      toast.error(`Update failed: ${graphQLError.message}`);
    } else if (error.networkError) {
      toast.error("Network error: Please check your connection");
    } else {
      toast.error("Failed to update user");
    }
  },
});
```

### Form Validation Errors

```tsx
// React Hook Form with Zod handles validation errors automatically
const form = useForm<FormData>({
  resolver: zodResolver(schema),
  // Validation errors appear under each field via FormMessage
});

// Custom validation
const validateEmail = async (email: string) => {
  const existingUser = await checkEmailExists(email);
  if (existingUser) {
    form.setError("email", {
      type: "manual",
      message: "This email is already in use",
    });
    return false;
  }
  return true;
};
```

## Performance Optimization

### Lazy Loading

```tsx
import { lazy, Suspense } from "react";

// Lazy load heavy modal components
const CreateUserModal = lazy(() => import("./create-user-modal"));

function MyComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {isModalOpen && (
        <CreateUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </Suspense>
  );
}
```

### Memoization

```tsx
import { useMemo } from "react";

function UserFormModal({ managers, currentUserRole }: Props) {
  // Memoize expensive calculations
  const availableRoles = useMemo(() => {
    return getRolesByPermission(currentUserRole);
  }, [currentUserRole]);

  const filteredManagers = useMemo(() => {
    return managers.filter(manager => manager.isActive);
  }, [managers]);

  // ... rest of component
}
```

### Apollo Client Optimizations

```tsx
const [createUser] = useMutation(CreateUserDocument, {
  // Optimistic response for immediate UI feedback
  optimisticResponse: {
    insertUser: {
      __typename: "users",
      id: "temp-id",
      name: data.name,
      email: data.email,
      role: data.role,
      isActive: true,
    },
  },
  
  // Update cache to reflect changes
  update: (cache, { data }) => {
    if (data?.insertUser) {
      cache.modify({
        fields: {
          users(existingUsers = []) {
            const newUserRef = cache.writeFragment({
              data: data.insertUser,
              fragment: UserFragmentDocument,
            });
            return [...existingUsers, newUserRef];
          },
        },
      });
    }
  },
});
```

## Best Practices

### ✅ Recommended Patterns

1. **Use Radix Dialog** for all new modal implementations
2. **Implement React Hook Form + Zod** for form validation
3. **Add permission checking** at the component level
4. **Include loading states** and disable controls during submission
5. **Use toast notifications** for user feedback
6. **Implement form reset** on modal close
7. **Add proper TypeScript interfaces** for all props
8. **Include accessibility attributes** and focus management

### ❌ Anti-Patterns to Avoid

1. **Using basic Modal component** (deprecated)
2. **Missing permission checks** before sensitive operations
3. **No loading states** during async operations
4. **Allowing modal close** during critical operations
5. **Missing error boundaries** for robust error handling
6. **Hardcoded styling** instead of design system tokens
7. **Missing TypeScript types** for props and data

### Component Structure Standards

```
domains/{domain}/components/
├── create-{entity}-modal.tsx    # Creation modals
├── edit-{entity}-modal.tsx      # Edit modals  
├── {entity}-form-modal.tsx      # Multi-mode modals
└── specialized-modal.tsx        # Domain-specific modals
```

### File Naming Conventions

- **Create Modals**: `create-{entity}-modal.tsx`
- **Edit Modals**: `edit-{entity}-modal.tsx`
- **Multi-Mode**: `{entity}-form-modal.tsx`
- **Specialized**: `{purpose}-modal.tsx` (e.g., `notes-modal.tsx`)

## Examples

### Complete Form Modal Example

See the `CreateUserModal` component in `/domains/users/components/create-user-modal.tsx` for a complete implementation that includes:

- React Hook Form + Zod validation
- Permission-based field visibility
- Role assignment logic
- API integration with error handling
- Loading states and accessibility

### Confirmation Dialog Example

```tsx
// Usage in a component
const [showDeleteDialog, setShowDeleteDialog] = useState(false);

const handleDeleteClient = async () => {
  try {
    await deleteClient(clientId);
    toast.success("Client deleted successfully");
    router.push("/clients");
  } catch (error) {
    toast.error("Failed to delete client");
  } finally {
    setShowDeleteDialog(false);
  }
};

// Render the dialog
<ConfirmationDialog
  isOpen={showDeleteDialog}
  onClose={() => setShowDeleteDialog(false)}
  onConfirm={handleDeleteClient}
  title="Delete Client"
  description={`Are you sure you want to delete "${client?.name}"? This action cannot be undone.`}
  isDestructive={true}
  confirmText="Delete Client"
/>
```

## Troubleshooting

### Common Issues and Solutions

#### Modal Not Opening
```tsx
// Check state management
const [isOpen, setIsOpen] = useState(false);

// Verify the trigger
<Button onClick={() => setIsOpen(true)}>Open Modal</Button>

// Ensure proper props
<Dialog open={isOpen} onOpenChange={setIsOpen}>
```

#### Form Not Submitting
```tsx
// Check form submission handler
<form onSubmit={form.handleSubmit(handleSubmit)}>

// Verify button type
<Button type="submit">Submit</Button> // Not type="button"

// Check for validation errors
console.log("Form errors:", form.formState.errors);
```

#### Permission Issues
```tsx
// Debug permission checks
console.log("Permissions:", permissions);
console.log("Can create:", permissions?.canCreate);
console.log("Current role:", currentUserRole);

// Verify permission logic
if (!permissions?.canCreate) {
  console.log("Permission denied: canCreate is false");
  return;
}
```

#### Accessibility Issues
```tsx
// Ensure proper ARIA labels
<DialogTitle>Clear, descriptive title</DialogTitle>
<DialogDescription>Helpful description text</DialogDescription>

// Check focus management
useEffect(() => {
  if (isOpen && firstFieldRef.current) {
    firstFieldRef.current.focus();
  }
}, [isOpen]);
```

#### Styling Issues
```tsx
// Use design system classes
<DialogContent className="sm:max-w-[500px]"> // Standard width
<Button variant="outline"> // Consistent button styles
<FormMessage /> // Automatic error styling
```

### Debugging Checklist

- [ ] Modal opens when trigger is clicked
- [ ] Form validation works correctly
- [ ] Permission checks are in place
- [ ] Loading states display during submission
- [ ] Error messages appear for failures
- [ ] Success feedback is provided
- [ ] Modal closes after successful submission
- [ ] Form resets on close
- [ ] Keyboard navigation works (ESC, Enter, Tab)
- [ ] Screen reader announcements are appropriate

## Related Documentation

- [Permission System Guide](/docs/PERMISSION_SYSTEM_GUIDE.md)
- [Form Handling Best Practices](/docs/components/README.md)
- [Accessibility Guidelines](/docs/components/README.md)
- [Design System Components](/docs/components/README.md)

---

*Last Updated: December 2024*
*Next Review: January 2025*