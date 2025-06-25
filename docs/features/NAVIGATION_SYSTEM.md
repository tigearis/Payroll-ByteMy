# Navigation System Documentation

This guide documents the permission-based navigation system, patterns, and architectural decisions implemented in the Payroll-ByteMy application.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Permission-Based Navigation](#permission-based-navigation)
3. [Navigation Components](#navigation-components)
4. [Route Protection](#route-protection)
5. [Mobile Navigation](#mobile-navigation)
6. [Implementation Patterns](#implementation-patterns)
7. [Accessibility](#accessibility)
8. [Troubleshooting](#troubleshooting)

## Architecture Overview

### Navigation Component Hierarchy

The application uses a three-tier navigation architecture:

1. **Sidebar Navigation** (`/components/sidebar.tsx`) - Primary navigation for desktop
2. **Main Navigation** (`/components/main-nav.tsx`) - Header navigation bar
3. **User Navigation** (`/domains/users/components/user-nav.tsx`) - User profile dropdown

### Permission Integration

All navigation components integrate with the role-based permission system to show/hide routes based on user permissions and roles.

```typescript
// Role Hierarchy (Higher numbers include lower permissions)
developer(5)    → Full system access + dev tools
org_admin(4)    → Organization management (all except dev tools)
manager(3)      → Team and payroll management
consultant(2)   → Basic payroll processing
viewer(1)       → Read-only access
```

## Permission-Based Navigation

### Route Permission Mapping

Each route in the navigation system has associated permission requirements:

```typescript
const routes = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    checkAccess: () => true, // Always accessible
  },
  {
    href: "/clients",
    label: "Clients",
    icon: Users,
    checkAccess: (auth: any) => auth.hasPermission("client:read"),
  },
  {
    href: "/payrolls",
    label: "Payrolls",
    icon: Calculator,
    checkAccess: (auth: any) => auth.hasPermission("payroll:read"),
  },
  {
    href: "/staff",
    label: "Staff",
    icon: UserCog,
    checkAccess: (auth: any) => auth.hasPermission("staff:read"),
  },
  {
    href: "/security",
    label: "Security",
    icon: Shield,
    checkAccess: (auth: any) => auth.hasPermission("audit:read"),
  },
];
```

### Permission Filtering Logic

Navigation components filter routes based on authentication state and permissions:

```typescript
const accessibleRoutes = routes.filter(route => {
  // Hide routes marked as hidden
  if (route.hidden) {
    return false;
  }
  
  // Filter out dev-only routes in production
  if (route.devOnly && process.env.NODE_ENV === "production") {
    return false;
  }
  
  // Check authentication and permissions
  if (!authContext.isLoading && authContext.isAuthenticated) {
    return route.checkAccess ? route.checkAccess(authContext) : true;
  }
  
  return false;
});
```

### Dynamic Route Visibility

Routes are dynamically shown/hidden based on:

- **User Authentication**: Must be authenticated to see protected routes
- **Role Permissions**: Must have specific permissions for each route
- **Environment**: Dev-only routes hidden in production
- **Feature Flags**: Routes can be temporarily hidden with `hidden: true`

## Navigation Components

### 1. Sidebar Navigation

**Location**: `/components/sidebar.tsx`

**Features**:
- Collapsible sidebar with toggle
- Permission-based route filtering
- Role display with user information
- Theme toggle integration
- Loading states during authentication

**Implementation Pattern**:
```typescript
export function Sidebar() {
  const authContext = useAuthContext();
  const { sidebarCollapsed, toggleSidebar } = useLayoutPreferences();

  // Filter routes based on permissions
  const accessibleRoutes = routes.filter(route => {
    if (route.hidden) return false;
    
    if (!authContext.isLoading && authContext.isAuthenticated) {
      return route.checkAccess(authContext);
    }
    return false;
  });

  return (
    <div className={cn("sidebar", sidebarCollapsed && "collapsed")}>
      {accessibleRoutes.map(route => (
        <NavigationItem key={route.href} route={route} />
      ))}
    </div>
  );
}
```

**Permission Integration**:
- Routes filtered based on `hasPermission()` checks
- Role information displayed to user
- Loading states while permissions are being fetched

### 2. Main Navigation

**Location**: `/components/main-nav.tsx`

**Features**:
- Horizontal navigation bar
- Permission-based filtering (same logic as sidebar)
- Active route highlighting
- Responsive design (hidden labels on small screens)

**Recent Improvements**:
- Added permission checks (previously missing)
- Consistent filtering logic with sidebar
- Hidden route support for temporary feature disabling

**Implementation Pattern**:
```typescript
export function MainNav() {
  const pathname = usePathname();
  const authContext = useAuthContext();

  const routes = allRoutes.filter(route => {
    if (route.devOnly && process.env.NODE_ENV === "production") {
      return false;
    }
    
    if (route.hidden) {
      return false;
    }
    
    if (!authContext.isLoading && authContext.isAuthenticated) {
      return route.checkAccess ? route.checkAccess(authContext) : true;
    }
    
    return false;
  });

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {routes.map(route => (
        <Button
          key={route.href}
          variant={route.active ? "default" : "ghost"}
          asChild
        >
          <Link href={route.href}>
            <route.icon className="h-4 w-4" />
            <span className="hidden md:inline-block">{route.label}</span>
          </Link>
        </Button>
      ))}
    </nav>
  );
}
```

### 3. User Navigation

**Location**: `/domains/users/components/user-nav.tsx`

**Features**:
- User avatar with fallback to initials
- Profile and settings access
- Permission-based settings visibility
- Sign-out functionality

**Permission Implementation**:
```typescript
export function UserNav() {
  const { hasPermission } = useAuthContext();

  return (
    <DropdownMenu>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          Profile
        </DropdownMenuItem>
        {hasPermission("settings:write") && (
          <DropdownMenuItem onClick={() => router.push("/settings/account")}>
            Settings
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleSignOut}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## Route Protection

### Middleware-Level Protection

**Location**: `/middleware.ts`

The application uses Clerk middleware for route protection:

```typescript
export default clerkMiddleware(async (auth, req) => {
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);
  
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Protect all other routes
  const authResult = await auth.protect();
  
  // SOC2-compliant audit logging
  await logRouteAccess(authResult, req);
  
  return NextResponse.next();
});
```

### Page-Level Protection

Individual pages can add additional protection:

```typescript
// Example from security page
export default function SecurityPage() {
  const { checkPermission } = useEnhancedPermissions();
  
  const securityReadPermission = checkPermission("security", "read");
  
  if (!securityReadPermission.granted) {
    return (
      <Alert>
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          You don't have permission to view security information.
        </AlertDescription>
      </Alert>
    );
  }

  return <SecurityDashboard />;
}
```

### Navigation Guard Patterns

```typescript
// Permission Guard Component
export function PermissionGuard({ 
  permission, 
  children, 
  fallback 
}: PermissionGuardProps) {
  const { hasPermission } = useAuthContext();
  
  if (!hasPermission(permission)) {
    return fallback || <AccessDenied />;
  }
  
  return children;
}

// Usage in navigation
<PermissionGuard permission="staff:read">
  <Link href="/staff">Staff Management</Link>
</PermissionGuard>
```

## Mobile Navigation

### Responsive Design Patterns

The navigation system adapts to different screen sizes:

**Sidebar Behavior**:
- Desktop: Fixed sidebar with collapse/expand
- Tablet: Overlay sidebar with backdrop
- Mobile: Full-screen overlay navigation

**Main Navigation**:
- Desktop: Full labels with icons
- Mobile: Icons only with tooltips

**Implementation**:
```typescript
// Responsive sidebar
<div className={cn(
  "sidebar",
  "fixed inset-y-0 z-50 w-72", // Desktop
  "lg:translate-x-0", // Always visible on large screens
  sidebarCollapsed && "lg:w-16", // Collapsed state
  "max-lg:translate-x-[-100%]", // Hidden on mobile by default
  isMobileMenuOpen && "max-lg:translate-x-0" // Show on mobile when toggled
)}>
```

### Mobile Menu Toggle

```typescript
export function MobileMenuToggle() {
  const { isMobileMenuOpen, toggleMobileMenu } = useLayoutPreferences();
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleMobileMenu}
      className="lg:hidden"
    >
      {isMobileMenuOpen ? <X /> : <Menu />}
    </Button>
  );
}
```

## Implementation Patterns

### Route Configuration Pattern

```typescript
interface NavigationRoute {
  href: string;
  label: string;
  icon: LucideIcon;
  active?: boolean; // For main nav active state
  checkAccess: (auth: AuthContext) => boolean;
  devOnly?: boolean; // Development only routes
  hidden?: boolean; // Temporarily hidden routes
}
```

### Permission Check Function Pattern

```typescript
// Standard permission check
checkAccess: (auth: any) => auth.hasPermission("resource:action")

// Role-based check
checkAccess: (auth: any) => auth.userRole === "developer"

// Complex permission logic
checkAccess: (auth: any) => {
  return auth.hasPermission("staff:read") || 
         auth.hasPermission("staff:write");
}

// Always accessible
checkAccess: () => true
```

### Loading State Management

```typescript
export function Navigation() {
  const { isLoaded } = useUser();
  const authContext = useAuthContext();

  // Show loading skeleton while auth data loads
  if (!isLoaded || authContext.isLoading) {
    return <NavigationSkeleton />;
  }

  // Show login prompt if not authenticated
  if (!authContext.isAuthenticated) {
    return <LoginPrompt />;
  }

  // Render normal navigation
  return <NavigationContent />;
}
```

## Accessibility

### Keyboard Navigation

All navigation components support keyboard navigation:

- **Tab**: Navigate between navigation items
- **Enter/Space**: Activate navigation links
- **Escape**: Close mobile menu or dropdowns
- **Arrow Keys**: Navigate within dropdown menus

### Screen Reader Support

```typescript
// Proper ARIA labels for navigation
<nav aria-label="Main navigation">
  <ul role="list">
    {routes.map(route => (
      <li key={route.href}>
        <Link 
          href={route.href}
          aria-label={`Navigate to ${route.label}`}
          aria-current={route.active ? "page" : undefined}
        >
          <route.icon aria-hidden="true" />
          <span>{route.label}</span>
        </Link>
      </li>
    ))}
  </ul>
</nav>
```

### Focus Management

```typescript
// Skip link for keyboard users
<a 
  href="#main-content" 
  className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-50"
>
  Skip to main content
</a>

// Focus indicators
<Link 
  className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  href={route.href}
>
```

### Color and Contrast

Navigation uses design system tokens for accessibility:

```typescript
// High contrast for active states
<Button 
  variant={isActive ? "default" : "ghost"}
  className={cn(
    "text-foreground hover:text-accent-foreground",
    isActive && "bg-accent text-accent-foreground"
  )}
>
```

## Troubleshooting

### Common Issues and Solutions

#### Navigation Items Not Showing

**Problem**: Expected navigation items are missing

**Debugging Steps**:
```typescript
// 1. Check authentication state
console.log("Auth context:", authContext);
console.log("Is authenticated:", authContext.isAuthenticated);
console.log("Is loading:", authContext.isLoading);

// 2. Check user permissions
console.log("User permissions:", authContext.permissions);
console.log("User role:", authContext.userRole);

// 3. Check specific permission
console.log("Has client:read:", authContext.hasPermission("client:read"));

// 4. Check route configuration
console.log("Route config:", route);
console.log("Check access result:", route.checkAccess(authContext));
```

**Common Causes**:
- User lacks required permissions
- Route is marked as `hidden: true`
- Route is `devOnly` and app is in production
- Authentication context still loading

#### Permission Changes Not Reflected

**Problem**: Navigation doesn't update after permission changes

**Solution**:
```typescript
// Ensure auth context refreshes after role changes
const { refetchUser } = useAuthContext();

// After role update
await updateUserRole(userId, newRole);
await refetchUser(); // Refresh permissions
```

#### Mobile Navigation Issues

**Problem**: Mobile menu not opening/closing properly

**Debugging**:
```typescript
// Check mobile menu state
console.log("Mobile menu open:", isMobileMenuOpen);
console.log("Sidebar collapsed:", sidebarCollapsed);

// Check CSS classes
console.log("Sidebar classes:", document.querySelector('.sidebar')?.className);
```

#### Active State Not Working

**Problem**: Active navigation item not highlighted

**Solution**:
```typescript
// Ensure pathname matching is correct
const pathname = usePathname();
const isActive = pathname === route.href || pathname.startsWith(route.href + "/");

// For complex routes, use custom logic
const isActive = useMemo(() => {
  if (route.href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname.startsWith(route.href);
}, [pathname, route.href]);
```

### Performance Issues

#### Slow Navigation Rendering

**Problem**: Navigation takes time to render on page load

**Optimization**:
```typescript
// Memoize expensive calculations
const accessibleRoutes = useMemo(() => {
  return routes.filter(route => {
    if (route.hidden) return false;
    if (!authContext.isAuthenticated) return false;
    return route.checkAccess(authContext);
  });
}, [routes, authContext.isAuthenticated, authContext.permissions]);

// Use React.memo for navigation items
const NavigationItem = React.memo(({ route }: { route: NavigationRoute }) => {
  return (
    <Link href={route.href}>
      <route.icon />
      <span>{route.label}</span>
    </Link>
  );
});
```

### Testing Navigation

#### Unit Tests

```typescript
// Test permission filtering
describe("Navigation filtering", () => {
  it("should show routes for admin users", () => {
    const mockAuth = {
      isAuthenticated: true,
      userRole: "org_admin",
      hasPermission: jest.fn(() => true),
    };
    
    const result = filterRoutes(routes, mockAuth);
    expect(result).toHaveLength(routes.length);
  });

  it("should hide restricted routes for viewers", () => {
    const mockAuth = {
      isAuthenticated: true,
      userRole: "viewer",
      hasPermission: jest.fn((permission) => {
        return permission === "client:read" || permission === "payroll:read";
      }),
    };
    
    const result = filterRoutes(routes, mockAuth);
    expect(result.some(r => r.href === "/security")).toBe(false);
  });
});
```

#### Integration Tests

```typescript
// Test navigation behavior
describe("Navigation integration", () => {
  it("should navigate between pages correctly", async () => {
    render(<NavigationWithAuth />);
    
    const staffLink = screen.getByRole("link", { name: /staff/i });
    await user.click(staffLink);
    
    expect(window.location.pathname).toBe("/staff");
  });
});
```

## Related Documentation

- [Permission System Guide](/docs/PERMISSION_SYSTEM_GUIDE.md)
- [Authentication System](/docs/architecture/AUTHENTICATION_SYSTEM_DOCUMENTATION.md)
- [Component Documentation](/docs/components/README.md)
- [Accessibility Guidelines](/docs/components/README.md)

---

*Last Updated: December 2024*
*Next Review: January 2025*