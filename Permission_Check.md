# Claude Code Authentication & Permissions Security Audit

Please perform a comprehensive analysis of the authentication and authorisation system across the entire codebase. I need you to examine every aspect of how permissions are handled and provide detailed findings.

## Phase 1: System Discovery and Mapping

First, scan the entire codebase and create a complete inventory of:

### Backend Systems

1. **Authentication mechanisms** - identify all login/auth flows, session management, token handling
2. **Permission/role definitions** - find where roles are defined, what permissions exist, role hierarchies
3. **Middleware layers** - examine all authentication/authorisation middleware (Express, Koa, FastAPI, etc.)
4. **API route protection** - check every API endpoint for auth requirements
5. **Database permissions** - examine user tables, role assignments, permission storage
6. **Server-side session management** - cookie handling, JWT validation, refresh tokens

### Frontend Systems

7. **Component-level permissions** - scan all React/Vue/Angular components for auth logic
8. **Props-based authentication** - find components that receive auth props and how they're used
9. **Page-level protection** - examine all pages/views for authentication requirements
10. **Route guards** - identify client-side route protection (React Router, Vue Router, Angular Guards)
11. **Context/Provider patterns** - find auth contexts, providers, and global state management
12. **Conditional rendering** - locate components that show/hide based on permissions
13. **Form validation** - examine forms for role-based field access or submission rules

### Cross-cutting Concerns

14. **State management** - Redux, Vuex, Zustand stores handling authentication
15. **HTTP interceptors** - Axios, Fetch interceptors for token handling
16. **Configuration files** - find all auth-related config files, environment variables, and settings
17. **Static route definitions** - Next.js pages, file-based routing with auth requirements

Create a comprehensive map showing:

- All authentication entry points (login pages, API endpoints, OAuth flows)
- Complete role hierarchy structure
- Permission matrices (which roles can do what)
- Critical security boundaries in the application
- **Frontend component tree** with auth-enabled components highlighted
- **Route structure** showing protected vs public routes
- **Middleware chain** for both API and frontend routing
- **Props flow** for authentication data through component hierarchy
- **State management** patterns for auth data
- **API-to-component** permission mapping

## Phase 2: Deep Dive Analysis - Find Inconsistencies

Analyse the codebase for the following specific issues:

## Phase 2: Deep Dive Analysis - Find Inconsistencies

Analyse the codebase for the following specific issues:

### Backend Authentication & Authorization Issues

- **Developer role restrictions**: Verify that developer roles require additional access/approval for any system operations
- **Privilege escalation paths**: Look for any code that might allow lower-privileged users to gain higher permissions
- **API endpoint inconsistencies**: Find endpoints with different auth patterns for similar operations
- **Middleware bypass opportunities**: Check for routes that skip authentication middleware
- **Database permission gaps**: Verify proper role-based database access controls

### Frontend Component-Level Issues

- **Inconsistent component protection**: Find similar components with different auth approaches
- **Props validation gaps**: Identify components receiving auth props without proper validation
- **Conditional rendering flaws**: Look for UI elements that show/hide incorrectly based on permissions
- **Component composition issues**: Find parent/child components with conflicting auth logic
- **State synchronisation problems**: Identify auth state inconsistencies between components

### Route & Navigation Security Issues

- **Route guard inconsistencies**: Find protected routes using different guard implementations
- **Client-side routing bypasses**: Look for ways to navigate to protected routes without proper auth
- **Deep linking vulnerabilities**: Check if direct URL access bypasses route protection
- **Dynamic route permission gaps**: Examine parameterised routes for proper auth checking
- **Redirect logic flaws**: Find inconsistent or vulnerable redirect handling after auth events

### Cross-Stack Permission Inconsistencies

- **Frontend-backend permission mismatches**: Find operations allowed in UI but blocked by API (or vice versa)
- **State management conflicts**: Identify conflicting auth states between different state systems
- **Caching permission errors**: Look for stale permission data in client-side caches
- **Real-time update issues**: Find websocket/SSE connections that don't respect permission changes

### Middleware & Interceptor Problems

- **Middleware ordering issues**: Find incorrect middleware execution order affecting auth
- **HTTP interceptor conflicts**: Identify conflicting token handling in different interceptors
- **Error handling inconsistencies**: Find middleware that handles auth failures differently
- **Request transformation problems**: Look for auth data being lost or corrupted in middleware

## Phase 3: Improper Implementation Analysis

Examine the codebase for these specific security anti-patterns:

## Phase 3: Improper Implementation Analysis

Examine the codebase for these specific security anti-patterns across all layers:

### Backend Code-Level Issues

- **Hardcoded credentials or permissions**: Find any embedded secrets, default passwords, or hardcoded role assignments
- **Insecure permission storage**: Look for permissions stored in easily modifiable locations
- **Race conditions**: Find authentication/authorisation code that might be vulnerable to timing attacks
- **SQL injection in auth queries**: Examine dynamic permission queries for injection vulnerabilities
- **API rate limiting gaps**: Check for missing rate limiting on authentication endpoints

### Frontend Component Security Issues

- **Client-side security reliance**: Identify any security logic that depends only on client-side validation
- **Sensitive data in component state**: Find components storing auth tokens or sensitive data insecurely
- **Props drilling security data**: Look for authentication data being passed through unnecessary component layers
- **Local storage misuse**: Find sensitive auth data stored in localStorage/sessionStorage
- **Component lifecycle auth issues**: Examine useEffect/mounted hooks for auth logic problems

### Route & Navigation Security Flaws

- **Client-side route protection only**: Find routes protected only on frontend without backend validation
- **Route parameter injection**: Look for auth logic vulnerable to URL parameter manipulation
- **History manipulation bypass**: Check for ways to bypass route guards through browser history
- **Lazy loading security gaps**: Examine dynamically loaded routes/components for auth issues
- **Service worker auth bypass**: Find service workers that might cache protected content inappropriately

### Page-Level Security Problems

- **Server-side rendering auth issues**: Check SSR pages for proper authentication on initial load
- **Static generation with auth**: Find statically generated pages that should be dynamic based on auth
- **Page transition auth gaps**: Look for authentication checks missed during page transitions
- **Meta tag information leakage**: Find pages leaking sensitive info in meta tags or titles
- **Preloading protected resources**: Check for resources being preloaded without auth checks

### Middleware & Request Handling Issues

- **Middleware exception handling**: Find middleware that fails insecurely when auth systems are down
- **CORS configuration problems**: Check for overly permissive CORS settings affecting auth
- **Content Security Policy gaps**: Find CSP configurations that might allow auth bypasses
- **Header manipulation vulnerabilities**: Look for auth headers that can be manipulated
- **Session fixation vulnerabilities**: Check for session handling that allows fixation attacks

### State Management Security Issues

- **Global state pollution**: Find auth data leaking into global state inappropriately
- **State persistence vulnerabilities**: Check for sensitive auth state being persisted insecurely
- **Redux/state devtools exposure**: Find auth data exposed through development tools
- **State synchronisation race conditions**: Look for auth state updates that create security gaps
- **Memory leaks with auth data**: Find components that don't properly cleanup sensitive data

### Props & Component Communication Issues

- **Prop validation bypasses**: Find components that don't validate received auth props
- **Context provider security**: Check auth contexts for improper data exposure
- **Event handler auth issues**: Find event handlers that don't re-validate permissions
- **Callback prop security**: Look for callback props that might bypass auth checks
- **Children prop auth delegation**: Find components that improperly delegate auth to children

## Phase 4: Redundant and Blocking Code Analysis

## Phase 4: Redundant and Blocking Code Analysis

### Backend Redundancy Issues

- **Duplicate API middleware**: Find identical auth middleware applied multiple times
- **Overlapping route protection**: Identify API routes with redundant permission checks
- **Unused permission definitions**: Find defined permissions that are never actually used
- **Dead authentication code**: Locate auth-related code that's no longer referenced
- **Redundant database queries**: Find multiple queries for the same auth data in single requests

### Frontend Component Redundancy

- **Duplicate component auth logic**: Find identical permission checking patterns across components
- **Redundant route guards**: Identify multiple guards checking the same conditions
- **Overlapping conditional rendering**: Find nested components with duplicate permission checks
- **Unused auth props**: Identify props passed to components but never used
- **Redundant state management**: Find multiple stores/contexts managing the same auth data

### Cross-Layer Redundancy

- **Frontend-backend double checking**: Find operations checked both client and server side unnecessarily
- **Multiple interceptor checks**: Identify HTTP interceptors with overlapping auth logic
- **Redundant validation layers**: Find form validation and API validation doing identical checks
- **Duplicate error handling**: Identify multiple layers handling the same auth errors

### Performance Blocking Issues

- **Over-restrictive permission checks**: Find code that blocks legitimate operations due to overly strict checks
- **Synchronous auth operations**: Identify blocking auth calls that should be asynchronous
- **Excessive re-authentication**: Find code that re-authenticates users unnecessarily
- **Heavy permission calculations**: Locate complex permission logic that could be optimised
- **Circular dependency issues**: Find permission checks that create circular reference problems

### User Experience Blocking Issues

- **Over-zealous route protection**: Find routes that are protected when they shouldn't be
- **Premature authentication prompts**: Identify code that prompts for auth too early
- **Unnecessary re-renders**: Find auth-related state changes causing excessive component re-renders
- **Blocking UI interactions**: Locate auth checks that prevent valid user interactions
- **Overly complex permission workflows**: Find user flows made unnecessarily complex by auth requirements

### Development & Maintenance Blocking Issues

- **Tightly coupled auth logic**: Find auth code that's hard to modify due to tight coupling
- **Hardcoded permission assumptions**: Locate code that assumes specific permission structures
- **Inflexible role hierarchies**: Find role systems that are difficult to extend
- **Non-configurable auth settings**: Identify auth behaviour that should be configurable but isn't
- **Testing impediments**: Find auth code that makes testing difficult or impossible

### System Resource Blocking Issues

- **Memory leaks in auth components**: Find components that don't properly cleanup auth-related resources
- **Database connection pooling issues**: Identify auth operations that don't release database connections
- **Caching inefficiencies**: Find auth operations that bypass appropriate caching
- **Network request bottlenecks**: Locate auth operations that create unnecessary network overhead
- **Event listener accumulation**: Find auth-related event listeners that aren't properly removed

## Phase 6: Component, Props, Pages, Routes & Middleware Deep Analysis

### React/Vue/Angular Component Analysis

For every component in the codebase, examine:

- **Auth prop interfaces**: Document all props related to authentication (user, permissions, roles, isAuthenticated, etc.)
- **Prop type validation**: Check if auth props have proper TypeScript/PropTypes validation
- **Default prop handling**: Verify how components behave when auth props are missing or undefined
- **Component lifecycle auth**: Examine useEffect, componentDidMount, etc. for auth-related operations
- **Conditional rendering patterns**: Map all instances of permission-based show/hide logic
- **Event handler permissions**: Check if onClick, onSubmit, etc. validate permissions before executing
- **Child component prop passing**: Trace how auth data flows down the component tree
- **Hook usage patterns**: For React, examine custom auth hooks (useAuth, usePermissions, etc.)

### Page-Level Authentication Analysis

For every page/view/screen:

- **Page-level guards**: Document authentication requirements for each page
- **Data fetching permissions**: Check if page data fetching respects user permissions
- **Dynamic content loading**: Verify permission-based content loading on pages
- **Meta data security**: Check if page titles, descriptions expose sensitive information
- **URL parameter security**: Examine how pages handle auth-related URL parameters
- **Server-side rendering auth**: For SSR, verify proper authentication on initial page load
- **Client-side hydration**: Check auth state consistency during hydration
- **Page transition security**: Verify auth checks during navigation between pages

### Route Protection & Navigation Analysis

For every route definition:

- **Route guard implementation**: Document all route guards and their logic
- **Nested route permissions**: Check permission inheritance in nested/child routes
- **Dynamic route parameters**: Verify auth checks for parameterised routes (e.g., /user/:id)
- **Redirect logic**: Examine auth-based redirects and their security implications
- **Route loading states**: Check auth validation during route loading/lazy loading
- **History API security**: Verify protection against history manipulation
- **Deep linking security**: Test direct URL access for protected routes
- **Route middleware chain**: Document middleware execution order for each route

### Middleware Layer Analysis

For every middleware function:

- **Authentication middleware**: Map all auth-related middleware and their scope
- **Authorisation middleware**: Document permission-checking middleware
- **Error handling middleware**: Check how auth failures are handled in middleware
- **Middleware ordering**: Verify correct execution order of auth middleware
- **Request transformation**: Check if middleware properly handles auth data transformation
- **Response modification**: Verify middleware doesn't expose sensitive auth data in responses
- **Bypass conditions**: Look for conditions where middleware might be skipped
- **Performance impact**: Assess performance cost of auth middleware on different routes

### State Management & Context Analysis

- **Global auth state**: Map all global state related to authentication (Redux, Vuex, Context, etc.)
- **State persistence**: Check how auth state is persisted across browser sessions
- **State synchronisation**: Verify auth state consistency across different parts of the application
- **State update patterns**: Document how auth state changes propagate through the system
- **Context providers**: For React, examine AuthContext, UserContext, etc. implementations
- **State selectors**: Check if state selectors properly handle undefined/null auth states
- **Action creators**: Verify auth-related actions and their side effects
- **State cleanup**: Check if auth state is properly cleaned up on logout/session expiry

## Phase 5: Developer Role Specific Analysis

## Phase 7: Developer Role Specific Analysis

### Backend Developer Role Enforcement

- **API endpoint restrictions**: Verify that all developer-accessible endpoints require proper approval workflows
- **Database operation controls**: Ensure developers cannot perform direct database operations without oversight
- **System configuration access**: Check that developers need elevated permissions for config changes
- **Administrative boundary enforcement**: Verify developers cannot bypass admin-only API restrictions
- **Audit trail completeness**: Ensure all developer API actions are properly logged and traceable

### Frontend Developer Role Implementation

- **Component access controls**: Verify developer-only components require additional authentication
- **Page-level restrictions**: Check that developer-accessible pages implement proper approval workflows
- **Route protection for dev tools**: Ensure development/admin routes are properly protected
- **UI element visibility**: Verify developer-specific UI elements are conditionally rendered correctly
- **Form submission controls**: Check that developer forms require approval before submission

### Cross-Stack Developer Role Validation

- **Frontend-backend permission alignment**: Ensure developer permissions are consistent between UI and API
- **State management for dev roles**: Verify developer role state is properly managed across components
- **Navigation restrictions**: Check that developers cannot navigate to unauthorized areas
- **Real-time permission updates**: Ensure developer role changes are reflected immediately across the system

### Developer Workflow Security

- **Approval process integration**: Verify that developer actions properly integrate with approval workflows
- **Escalation procedure implementation**: Check that developers must follow proper escalation for privileged operations
- **Multi-factor authentication**: Ensure developer accounts require additional authentication factors
- **Session management**: Verify developer sessions have appropriate timeout and security measures
- **Role inheritance prevention**: Ensure developers cannot inherit or assume administrative permissions

### Development Environment Separation

- **Production access controls**: Verify developers have appropriate restrictions in production environments
- **Development tool access**: Check that development tools are not accessible to non-developer roles
- **Debug information exposure**: Ensure developer-specific debug info is not exposed to other roles
- **Testing environment permissions**: Verify proper permission boundaries between dev/test/prod environments

### Developer-Specific Monitoring

- **Enhanced logging for developer actions**: Check that developer operations have additional logging requirements
- **Real-time monitoring**: Verify developer activities are monitored with appropriate alerting
- **Permission change tracking**: Ensure changes to developer permissions are properly tracked
- **Access pattern analysis**: Check for unusual access patterns from developer accounts

## Deliverable Requirements

Provide a comprehensive report with:

### Executive Summary

- Overall security posture assessment
- High-priority vulnerabilities found
- Systemic issues requiring immediate attention

### Detailed Findings

For each issue found, provide:

- **Exact file paths and line numbers** where the issue occurs
- **Code snippets** demonstrating the problem (component code, middleware, route definitions, etc.)
- **Risk assessment** (Critical/High/Medium/Low) with CVSS scores where applicable
- **Affected system layers** (Backend API, Frontend Components, Routes, Middleware, etc.)
- **Specific remediation steps** with code examples and refactoring suggestions
- **Business impact** of the vulnerability and potential exploit scenarios
- **Component/route/middleware dependencies** that might be affected by fixes

### Architecture Analysis

- **Component hierarchy security**: Visual map of auth-enabled components and their relationships
- **Route protection matrix**: Table showing which routes are protected by which guards/middleware
- **Permission flow diagrams**: How permissions flow from backend through middleware to frontend components
- **Props inheritance chains**: How auth props are passed through component hierarchies
- **Middleware execution flow**: Order and conditions of middleware execution for different routes
- **State management patterns**: How auth state is managed across different state systems

### Recommendations

- **Critical security fixes** for immediate attention across all layers
- **Component refactoring suggestions** to standardise auth patterns
- **Route protection improvements** with consistent guard implementations
- **Middleware optimisation** to eliminate redundancy and improve performance
- **Props interface standardisation** for consistent auth data passing
- **State management consolidation** to reduce complexity and improve maintainability
- **Page-level security enhancements** for better user experience and security
- **Cross-layer consistency improvements** to align frontend and backend permissions
- **Performance optimisations** to reduce auth-related overhead
- **Testing strategy recommendations** for comprehensive auth testing coverage

### Implementation Roadmap

- **Phase 1**: Critical security vulnerabilities (API endpoints, route bypasses, privilege escalation)
- **Phase 2**: Component and middleware consistency fixes
- **Phase 3**: Performance optimisation and redundancy elimination
- **Phase 4**: Long-term architectural improvements and standardisation
- **Phase 5**: Enhanced monitoring and developer role enforcement
- **Phase 6**: Documentation and testing infrastructure improvements

Please be thorough in your analysis and provide specific, actionable recommendations for each issue you identify. Focus particularly on ensuring the developer role hierarchy is properly implemented and that no security boundaries can be bypassed.
