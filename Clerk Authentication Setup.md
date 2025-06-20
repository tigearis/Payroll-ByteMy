<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" class="logo" width="120"/>

# Complete Clerk Authentication Integration with Hasura for Next.js Applications

This comprehensive guide provides a complete implementation strategy for integrating Clerk authentication with Hasura GraphQL, including user synchronization, role management, invitation systems, and database operations through Next.js middleware and webhooks. The integration leverages Clerk's JWT authentication, metadata management, and invitation system to create a seamless user management experience.

## Clerk and Hasura JWT Authentication Setup

The foundation of this integration relies on Clerk's JWT template system to authenticate requests with Hasura. Your existing JWT template is correctly configured with the Hasura namespace and claims structure[^1][^2]. The template includes the essential `x-hasura-user-id`, `x-hasura-default-role`, and `x-hasura-allowed-roles` claims that Hasura requires for authentication and authorization[^2][^11].

To ensure proper authentication flow, the JWT secret must be configured in your Hasura instance using the `HASURA_GRAPHQL_JWT_SECRET` environment variable[^1][^2]. This should point to your Clerk JWKS endpoint at `https://<YOUR_FRONTEND_API>/.well-known/jwks.json`. The JWT configuration enables Hasura to verify tokens issued by Clerk and extract the necessary session variables for permission rules[^2][^10].

The authentication process works by having Clerk generate a JWT token with the required Hasura claims when users sign in. This token is then passed in the `Authorization: Bearer <JWT>` header of GraphQL requests to Hasura, allowing the engine to verify user identity and apply appropriate access controls based on the user's role and metadata[^2][^18].

## Next.js Middleware Implementation

The middleware layer serves as the critical component for handling authentication state and user synchronization. The middleware should intercept all requests to protected routes and ensure users are properly authenticated with valid Clerk sessions[^3].

```javascript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/admin(.*)",
  "/api/graphql",
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect();
  }

  // Add custom headers for Hasura if authenticated
  if (auth().userId) {
    const response = NextResponse.next();
    response.headers.set("x-clerk-user-id", auth().userId);
    return response;
  }
});
```

The middleware should also handle role-based route protection, ensuring users can only access resources appropriate to their permission level. For your system, this means restricting administrative functions to users with Developer, Admin, or Manager roles while allowing basic access to Consultants and Viewers[^3].

## User Synchronization via Webhooks

Webhook implementation is crucial for maintaining data consistency between Clerk and your database. The webhook endpoint should handle multiple event types including user creation, updates, and deletions[^5][^8]. Here's the recommended webhook structure:

```javascript
import { Webhook } from "svix";
import { headers } from "next/headers";

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add CLERK_WEBHOOK_SECRET to .env.local");
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", { status: 400 });
  }

  const { id, ...attributes } = evt.data;
  const eventType = evt.type;

  switch (eventType) {
    case "user.created":
      await syncUserToDatabase(evt.data);
      break;
    case "user.updated":
      await updateUserInDatabase(evt.data);
      break;
    case "user.deleted":
      await deactivateUserInDatabase(evt.data.id);
      break;
  }

  return new Response("", { status: 200 });
}
```

The webhook system should handle user lifecycle events by creating appropriate database entries, updating user information, and managing user status changes[^5][^8]. When users are deleted from Clerk, the system should set them as inactive in your database rather than performing hard deletes, maintaining audit trails as specified in your requirements.

## Role Management and Metadata Synchronization

User metadata management is essential for maintaining role consistency between Clerk and your database[^6][^7]. The system should utilize Clerk's public metadata to store the user's current role, which feeds into the JWT claims for Hasura authorization[^7][^13].

```javascript
// Update user role in Clerk metadata
async function updateUserRole(userId, newRole) {
  const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: {
      role: newRole,
      lastRoleUpdate: new Date().toISOString(),
    },
  });

  // Also update in your database
  await updateUserRoleInDatabase(userId, newRole);
}
```

The role update process should be bidirectional, ensuring changes made in your application interface are reflected in both Clerk's metadata and your database[^7][^13]. This maintains consistency across all authentication and authorization checks while providing the flexibility to manage roles through your application interface.

## Invitation Management System

The invitation system leverages Clerk's built-in invitation functionality while providing application-level management interfaces[^4][^12][^15]. The system should support creating invitations, tracking their status, and handling acceptance workflows.

```javascript
// Create invitation with role assignment
async function createInvitation(email, role, inviterUserId) {
  const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  try {
    const invitation = await clerkClient.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/accept-invitation`,
      publicMetadata: {
        role: role,
        invitedBy: inviterUserId,
        invitedAt: new Date().toISOString(),
      },
    });

    // Track invitation in your database
    await trackInvitationInDatabase({
      clerkInvitationId: invitation.id,
      email: email,
      role: role,
      invitedBy: inviterUserId,
      status: "pending",
    });

    return invitation;
  } catch (error) {
    console.error("Failed to create invitation:", error);
    throw error;
  }
}
```

The invitation management interface should allow authorized users (Developers, Admins, and Managers) to view pending invitations, resend expired invitations, and revoke unnecessary invitations[^12][^15]. The system should also provide status tracking and audit trails for all invitation activities.

## Permission-Based Access Control

Access control implementation should align with your role hierarchy, restricting administrative functions to appropriate user levels[^11]. The permission system should integrate with both Hasura's row-level security and your application's route protection mechanisms.

```javascript
// Permission check utility
function hasPermission(userRole, requiredPermission) {
  const roleHierarchy = {
    viewer: ["read"],
    consultant: ["read", "create"],
    manager: ["read", "create", "update", "invite"],
    admin: ["read", "create", "update", "invite", "delete"],
    org_admin: ["read", "create", "update", "invite", "delete", "manage_roles"],
  };

  return roleHierarchy[userRole]?.includes(requiredPermission) || false;
}
```

User management operations should respect the permission hierarchy, ensuring only authorized roles can perform sensitive operations like role changes, user deactivation, and invitation management. The system should prevent privilege escalation and maintain proper audit logging for all administrative actions.

## Database Integration and Synchronization

The database synchronization process should handle the complex relationship between Clerk user data and your multi-table user structure[^8]. The synchronization should populate the users table with Clerk data while maintaining relationships with the roles and user_roles tables.

```javascript
async function syncUserToDatabase(clerkUserData) {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Insert or update user
    const userResult = await client.query(`
      INSERT INTO users (clerk_user_id, name, email, username, image, role, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      ON CONFLICT (clerk_user_id)
      DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        username = EXCLUDED.username,
        image = EXCLUDED.image,
        updated_at = NOW()
      RETURNING id
    `, [
      clerkUserData.id,
      `${clerkUserData.first_name} ${clerkUserData.last_name}`,
      clerkUserData.email_addresses[^0]?.email_address,
      clerkUserData.username,
      clerkUserData.image_url,
      clerkUserData.public_metadata?.role || 'viewer'
    ])

    // Handle role assignments if using user_roles table
    const userRole = clerkUserData.public_metadata?.role || 'viewer'
    await assignRoleToUser(client, userResult.rows[^0].id, userRole)

    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
```

The synchronization process should handle both initial user creation and subsequent updates, ensuring data consistency across all related tables while maintaining referential integrity and audit trails.

## Conclusion

This comprehensive integration strategy provides a robust foundation for Clerk and Hasura authentication with complete user management capabilities. The system leverages Clerk's authentication infrastructure while maintaining full control over user data and permissions through your application interface. The webhook-based synchronization ensures data consistency, while the role-based access control provides appropriate security boundaries for different user types. The invitation management system streamlines user onboarding while maintaining administrative oversight and audit capabilities. This architecture supports scalable user management with the flexibility to adapt to evolving business requirements while maintaining security and data integrity.

<div style="text-align: center">⁂</div>

[^1]: <https://clerk.com/docs/integrations/databases/hasura>
[^2]: <https://hasura.io/docs/2.0/auth/authentication/jwt/>
[^3]: <https://devcodef1.com/news/1258625/next-js-clerk-middleware>
[^4]: <https://clerk.com/docs/users/invitations>
[^5]: <https://clerk.com/docs/webhooks/overview>
[^6]: <https://www.youtube.com/watch?v=JXyiG2rvh1Y>
[^7]: <https://clerk.com/docs/users/metadata>
[^8]: <https://stackoverflow.com/questions/79581599/problem-storing-user-in-database-using-clerk-webhooks>
[^10]: <https://hasura.io/learn/graphql/hasura-authentication/integrations/clerk/>
[^11]: <https://dev.to/dristy03/hasura-custom-authentication-using-jwt-cik>
[^12]: <https://clerk.com/docs/custom-flows/manage-organization-invitations>
[^13]: <https://clerk.com/docs/references/backend/user/update-user-metadata>
[^15]: <https://clerk.com/docs/organizations/invitations>
[^18]: <https://github.com/clerk/clerk-hasura-starter>

Integration Strategy: Clerk + Hasura in Next.js

1. Authentication Middleware
   Use Clerk’s Next.js middleware to validate JWTs and protect routes. For example, in middleware.ts at the project root include Clerk’s middleware and route matcher
   clerk.com
   :
   import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();
export const config = { matcher: ['/((?!\_next|[^?]_\\.(?:html?|css|js(?!on)|...))._)','/(api|trpc)(._)'] };
This ensures every request passes through Clerk. To require authentication on specific routes, use auth.protect() or check auth().userId within middleware
clerk.com
. For example:
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
const protectedRoutes = createRouteMatcher(['/app/(._)', '/admin/(.\*)']);
export default clerkMiddleware(async ({ auth }, req) => {
if (protectedRoutes(req)) {
await auth.protect(); // redirects to sign-in if no session
}
});
Within route handlers or API routes, use await auth() to get the current session. For example, in a Next.js App Router handler:
import { auth } from '@clerk/nextjs/server';
export async function POST(request) {
const { userId, sessionId } = await auth();
if (!userId) return new Response('Unauthorized', { status: 401 });
// proceed with userId...
} 2. Hasura Claims & Token Passing
Configure Clerk’s Hasura JWT template so that each issued token contains the Hasura namespace with session variables (like x-hasura-user-id, x-hasura-default-role, x-hasura-allowed-roles). In the Clerk Dashboard under JWT Templates, create or use the Hasura template – it pre-populates the required claims
clerk.com
. For dynamic roles, set the JWT claim to use {{user.publicMetadata.role}}. For example:
{
"claims": {
"jwt": {
"hasura.io": {
"x-hasura-user-id": "{{user.id}}",
"x-hasura-default-role": "{{user.publicMetadata.role}}",
"x-hasura-allowed-roles": ["{{user.publicMetadata.role}}", "anonymous"]
}
}
}
}
Configure Hasura’s JWT secret to use Clerk’s JWKS endpoint (e.g. https://<YOUR_CLERK_DOMAIN>/.well-known/jwks.json)
clerk.com
. When calling Hasura, include the Clerk JWT. For client-side GraphQL calls, use Clerk’s useAuth().getToken and attach it as a Bearer token
clerk.com
. For example, using Fetch:
const { getToken } = useAuth();
const token = await getToken({ template: 'hasura' });
await fetch(process.env.NEXT_PUBLIC_HASURA_URL, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Authorization': `Bearer ${token}`
},
body: JSON.stringify({ query: MY_GRAPHQL_QUERY })
});
On the server side (e.g. in a Next.js route), you can also generate the JWT via Clerk’s Backend SDK. For example, in an App Router API route:
import { auth, clerkClient } from '@clerk/nextjs/server';
export async function POST(req) {
const { userId, sessionId } = await auth();
if (!userId) return new Response('Unauthorized', { status: 401 });
const client = await clerkClient();
const { jwt: token } = await client.sessions.getToken(sessionId, 'hasura');
// Call Hasura with the token
}
This pattern (using auth() and client.sessions.getToken) is shown in Clerk’s docs
clerk.com
. You may also inject Hasura headers directly: read auth() or currentUser() to get userId and user.publicMetadata.role, then include them as custom headers (x-hasura-user-id, etc.) in your Hasura request if not using JWT mode. 3. User Sync to Hasura
Webhooks for User Events
Set up a secure webhook endpoint (e.g. /api/webhooks/clerk) to receive Clerk events. In Clerk Dashboard > Webhooks, add a new endpoint and subscribe to events like user.created, user.updated, and organization.membership.created. Verify incoming requests via Svix signature (using svix-signature header and Clerk’s signing secret). For example:
import { verifyClerkWebhookSignature } from '@clerk/clerk-sdk-node';

export async function POST(req: NextRequest) {
const payload = await req.json();
const sig = req.headers.get('svix-signature')!;
if (!verifyClerkWebhookSignature(sig, process.env.CLERK_WEBHOOK_SECRET!, JSON.stringify(payload))) {
return new Response('Bad signature', { status: 400 });
}
// Process payload.data based on event type...
}
Handle relevant events: when a new user signs up (user.created) or when an invited user joins (organization.membership.created – triggered when a user accepts an org invite
linkedin.com
), extract the user’s Clerk ID, name, email, role, image, and any custom flags (publicMetadata.is_staff, etc.). Then upsert into your Hasura users table and maintain the many-to-many user_roles link. For example, using Hasura’s GraphQL API:
// Pseudocode for inserting/updating user:
const mutation = `mutation UpsertUser($user: users_insert_input!) {
    insert_users_one(object: $user, on_conflict: {
      constraint: users_pkey, update_columns: [first_name, last_name, email, image, role, is_staff]
    }) { id }
  }`;
const variables = {
user: {
id: data.id,
first_name: data.first_name,
last_name: data.last_name,
email: data.email_addresses[0]?.email_address || null,
image: data.image_url || null,
role: data.public_metadata?.role || 'user',
is_staff: data.public_metadata?.is_staff || false
}
};
await fetch(process.env.HASURA_URL, { headers: { 'x-hasura-admin-secret': HASURA_ADMIN_SECRET }, method: 'POST', body: JSON.stringify({ query: mutation, variables }) });
Then update the join table: e.g. ensure a corresponding row in user_roles links this user to the role(s) in roles table. (You may need to insert into roles table first if using non-enum roles.) Use GraphQL mutations (such as insert_user_roles) with on_conflict to avoid duplicates. Repeat for role changes in later steps.
Ensure Consistent Role Fields
If your users table has a role enum column, map publicMetadata.role to it. On any webhook indicating a metadata change (e.g. user.updated), update the user’s role in Hasura and adjust user_roles. For example:
const mutation = `mutation ($id: uuid!, $role: roles_enum!) {
    update_users_by_pk(pk_columns: {id: $id}, _set: {role: $role}) { id }
  }`;
await fetch(HASURA_URL, { headers: {...}, method: 'POST', body: JSON.stringify({ query: mutation, variables: { id: data.id, role: data.public_metadata.role } }) });
Log all sync operations and handle errors gracefully (retry on transient failures) for auditability. 4. Invitation Management
Leverage Clerk Organizations for invites. Restrict invites to admin roles (e.g. Developers/Admins/Managers). In the admin UI, use Clerk’s useOrganization() hook (client-side) to invite and list pending invitations
clerk.com
clerk.com
. For example, an Invite Member form:
'use client';
import { useOrganization } from '@clerk/nextjs';
export function InviteMemberForm() {
const { organization, invitations } = useOrganization();
// form state...
async function onSubmit(e) {
e.preventDefault();
await organization.inviteMember({ emailAddress: email, role: selectedRole });
await invitations?.revalidate?.(); // refresh invite list
}
return (

<form onSubmit={onSubmit}>
<input name="email" value={email} onChange=... placeholder="Email" />
{/_ Role selector omitted for brevity _/}
<button type="submit">Invite</button>
</form>
);
}
This uses Clerk’s built-in inviteMember() method
clerk.com
. To list pending invites, use useOrganization() with invitations and render a table
clerk.com
. For example:
export function InvitationList() {
const { invitations, memberships } = useOrganization();
return (
<table>
<thead><tr><th>Email</th><th>Invited</th><th>Role</th><th>Actions</th></tr></thead>
<tbody>
{invitations?.data?.map(inv => (
<tr key={inv.id}>
<td>{inv.emailAddress}</td>
<td>{new Date(inv.createdAt).toLocaleDateString()}</td>
<td>{inv.role}</td>
<td>
<button onClick={async () => {
await inv.revoke();
await Promise.all([memberships?.revalidate, invitations?.revalidate]);
}}>Revoke</button>
</td>
</tr>
))}
</tbody>
</table>
);
}
This snippet (from Clerk docs) shows using inv.revoke() to cancel an invite
clerk.com
. To “resend” an invite, you can revoke and re-invite the same email. After an invite is accepted, Clerk will either redirect the user to sign-up/sign-in (with a \_\_clerk_ticket token in URL)
clerk.com
. Once the user joins the organization, Clerk emits organization.membership.created. The webhook handler from step 3 will catch this and sync the new member into Hasura. You can also poll Clerk’s membership list via organization.getMemberships() if needed, but webhooks are more robust for syncing. 5. Role Management
Build an admin interface to manage user roles. For each user, allow updating their publicMetadata.role via Clerk’s Backend SDK and reflecting that change in Hasura. In Next.js (server), use clerkClient.users.updateUser:
const client = await clerkClient();
await client.users.updateUser(userId, { publicMetadata: { role: newRole } });
Then issue a Hasura mutation to update users.role and adjust user_roles. For example:
mutation UpdateRole($id: uuid!, $role: roles_enum!) {
  update_users_by_pk(pk_columns: {id: $id}, _set: {role: $role}) { id }
  delete_user_roles(where: {user_id: {_eq: $id}}) { affected_rows }
  insert_user_roles(objects: [{user_id: $id, role_id: $roleId}]) { affected_rows }
}
Replace $roleId by looking up the corresponding role record. Run these mutations via Hasura’s API. Clerk’s JWT claims will update on next token retrieval, so new tokens will carry the updated role. You may prompt users to re-login or simply rely on token refreshing (Clerk tokens are short-lived and fetched per request
clerk.com
). Ensure the UI and server enforce permissions: only users with admin-level roles (e.g. “Developer”, “Manager”, “Admin”) can use this interface. In Next.js route handlers or page loaders, check the current user’s role (from currentUser().public_metadata.role or via a roles query) and return a 403 if unauthorized.
6. User Deactivation
Provide a “Deactivate” action for admins. When triggered, call Clerk’s deleteUser() API and mark the user inactive in Hasura. For example:
const client = await clerkClient();
await client.users.deleteUser(userId);
await fetch(HASURA_URL, {
  headers: { 'x-hasura-admin-secret': HASURA_ADMIN_SECRET },
  method: 'POST',
  body: JSON.stringify({
    query: `
      mutation Deactivate($id: uuid!) {
update_users_by_pk(pk_columns: {id: $id}, \_set: {active: false}) { id }
}`,
variables: { id: userId }
})
});
Here, users.active is a boolean flag. Do not delete the row, only set active=false for auditing. Deletion of the Clerk account will also revoke all sessions. Note: Clerk will emit a user.deleted webhook event (you may choose to ignore it or use it to double-check the flag). The key is to prevent the user from signing in (since the account is gone) while preserving their history in the DB. 7. Security & Error Handling
Access Control: Wrap all admin pages and API routes with role checks. On the client, use Clerk hooks (e.g. useUser()) to hide admin UIs. On the server, use await auth() or await currentUser() and verify publicMetadata.role. For example:
const { userId } = await auth();
const user = await clerkClient().users.getUser(userId);
const role = user.publicMetadata.role;
if (!['Admin','Manager','Developer'].includes(role)) {
return new Response('Forbidden', { status: 403 });
}
Clerk’s own helpers support guarding routes as well
clerk.com
.
Error Handling: In webhook and API code, use try/catch around network calls and mutations. Log errors to a monitoring system or console. For example, if a Hasura sync fails, catch it and log details to help debugging. Return appropriate HTTP status codes on failure. Clerk webhooks will retry automatically on 5xx errors, so ensure your webhook handler returns 500 on transient issues.
Logging: Add logs for key actions (invite sent, user synced, role change, deactivation). In Next.js, consider a logging library or just console.error. Store logs externally if audit trails are needed. 8. UI Components & Clerk Elements
Admin Pages: Use Next.js App Router with server and client components. Wrap the app in <ClerkProvider> so you can use Clerk hooks. Protect /admin/\* routes via middleware or page logic.
Invite Member Form: (Client-side component) Use useOrganization() as shown above to invite by email and role
clerk.com
. Include a select/dropdown for roles (fetched via organization.getRoles()).
Invitation List Table: (Client) Display pending invitations with Revoke buttons
clerk.com
. Include pagination if needed (invitations.fetchNext(), etc. as in [38]).
User List: (Either fetch from Hasura or use Clerk’s Admin UI API) Show all users, their roles, and active status. For each user, include:
A Role dropdown (for admin to change role).
A Deactivate button. Disable or hide these controls if the current user lacks permission.
UseUser/useAuth Hooks: In client components (like forms), use useUser() (to get details of the logged-in user) and useAuth() (to call getToken) as needed.
Server-side Fetching: To display Hasura data (users, roles), you may write Next.js server components or route handlers that query Hasura. In those, attach the Clerk JWT (via getToken) as auth, or use an admin secret if server-side trust is acceptable.
Clerk Elements: Leverage Clerk’s pre-built components for login/logout (e.g. <SignIn/>, <UserButton/>) in the app as needed. Use Clerk’s organization UI if you prefer not to custom-build all flows; but the above custom components are recommended for full control and integration with Hasura.
All implementations should maintain clear separation of concerns (authentication, database sync, UI). By following Clerk’s middleware and API patterns
clerk.com
clerk.com
, and using webhooks for asynchronous sync, the system will remain secure and consistent. Sources: Clerk’s documentation on Hasura integration and middleware
clerk.com
clerk.com
, Clerk webhook guides
linkedin.com
, and the Hasura auth tutorials
clerk.com
informed this approach.
Citations
Favicon
Next.js: clerkMiddleware() | Next.js

<https://clerk.com/docs/references/nextjs/clerk-middleware>
Favicon
Next.js: clerkMiddleware() | Next.js

<https://clerk.com/docs/references/nextjs/clerk-middleware>
Favicon
Integrations: Integrate Hasura with Clerk

<https://clerk.com/docs/integrations/databases/hasura>
Favicon
Integrations: Integrate Hasura with Clerk

<https://clerk.com/docs/integrations/databases/hasura>
Favicon
Integrations: Integrate Hasura with Clerk

<https://clerk.com/docs/integrations/databases/hasura>
Favicon
JS Backend SDK: getToken()

<https://clerk.com/docs/references/backend/sessions/get-token>
Favicon
Webhooks: Real-Time Communication for Modern Applications

<https://www.linkedin.com/pulse/webhooks-real-time-communication-modern-applications-monzil-pifdc>
Favicon
Custom Flows: Build a custom flow for creating and managing organization invitations

<https://clerk.com/docs/custom-flows/manage-organization-invitations>
Favicon
Custom Flows: Build a custom flow for creating and managing organization invitations

<https://clerk.com/docs/custom-flows/manage-organization-invitations>
Favicon
Custom Flows: Build a custom flow for creating and managing organization invitations

<https://clerk.com/docs/custom-flows/manage-organization-invitations>
Favicon
Custom Flows: Build a custom flow for creating and managing organization invitations

<https://clerk.com/docs/custom-flows/manage-organization-invitations>
Favicon
Custom Flows: Handle accepting organization invitation links

<https://clerk.com/docs/custom-flows/accept-organization-invitations>
Favicon
Integrations: Integrate Hasura with Clerk

<https://clerk.com/docs/integrations/databases/hasura>
All Sources
Favicon
clerk
Excellent point! An auth context is crucial for managing authentication state throughout your application. Let me create a comprehensive auth context that integrates with both Clerk and your database.Now let me create the accompanying API routes and show how to integrate this auth context into your application:## How to Integrate the Auth Context

### 1. **Update Your App Layout**

The auth context should wrap your entire application to provide authentication state everywhere:

```typescript
// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import { AuthProvider } from "@/lib/auth-context";
import { ApolloProviderWrapper } from "@/lib/apollo-client";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <AuthProvider fallback={<LoadingScreen />}>
            <ApolloProviderWrapper>{children}</ApolloProviderWrapper>
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
```

### 2. **Key Features of the Auth Context**

The auth context provides:

- **Unified authentication state** from both Clerk and your database
- **Role-based access control** with utility functions
- **Automatic user synchronisation** when users first sign in
- **Invitation management** functions
- **Permission flags** for common operations
- **HOC and hooks** for protecting components

### 3. **Usage Examples**

**In Client Components:**

```typescript
const { user, isAdmin, canManageUsers } = useAuth();
```

**For Protected Routes:**

```typescript
export default withAuth(MyComponent, {
  roles: [Role.Manager, Role.Admin],
  redirectTo: "/unauthorized",
});
```

**For Conditional Rendering:**

```typescript
const { hasAccess } = useRoleAccess([Role.Manager, Role.Admin]);
if (hasAccess) {
  // Show admin content
}
```

### 4. **Performance Optimisations**

The auth context includes several optimisations:

- Caches user data to prevent redundant API calls
- Only fetches when authentication state changes
- Provides loading states to prevent UI flicker
- Handles errors gracefully with fallbacks

### 5. **Error Handling**

The context automatically handles:

- Missing users in the database (creates them)
- Network errors with retry logic
- Permission errors with proper messages
- Token refresh for expired sessions

This auth context provides a complete solution for managing authentication state throughout your application while maintaining synchronisation between Clerk and your database.

# Complete Clerk Authentication Integration with Hasura for Next.js App Router

This comprehensive guide provides step-by-step implementation for integrating Clerk authentication with Hasura GraphQL engine in a Next.js App Router application, including user synchronisation, role management, and invitation systems.

## Initial Setup and Core Configuration

### Environment Configuration

Create a complete environment setup for your Next.js application:

```bash
# .env.local
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Hasura Configuration
NEXT_PUBLIC_HASURA_GRAPHQL_API=http://localhost:8080/v1/graphql
HASURA_GRAPHQL_ADMIN_SECRET=your-admin-secret
HASURA_GRAPHQL_DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

### Install Required Dependencies

```bash
npm install @clerk/nextjs @apollo/client graphql
npm install --save-dev @types/node
```

## JWT Token Configuration for Hasura

### Creating the JWT Template in Clerk

Navigate to your Clerk Dashboard and create a new JWT template specifically for Hasura:

1. Go to **JWT Templates** → **New Template**
2. Name it "hasura"
3. Configure with dynamic role claims:

```json
{
  "https://hasura.io/jwt/claims": {
    "x-hasura-user-id": "{{user.id}}",
    "x-hasura-default-role": "{{user.publicMetadata.role || 'viewer'}}",
    "x-hasura-allowed-roles": "{{user.publicMetadata.allowedRoles || ['viewer']}}",
    "x-hasura-user-email": "{{user.primaryEmailAddress.emailAddress}}",
    "x-hasura-username": "{{user.username}}"
  }
}
```

### Configuring Hasura to Verify Clerk JWT Tokens

For Hasura Cloud or self-hosted instances, set the JWT secret configuration:

```yaml
# docker-compose.yml for local development
version: "3.6"
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: postgrespassword
    volumes:
      - db_data:/var/lib/postgresql/data

  hasura:
    image: hasura/graphql-engine:v2.36.0
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    environment:
      HASURA_GRAPHQL_DATABASE_URL: postgres://postgres:postgrespassword@postgres:5432/postgres
      HASURA_GRAPHQL_ENABLE_CONSOLE: "true"
      HASURA_GRAPHQL_DEV_MODE: "true"
      HASURA_GRAPHQL_ADMIN_SECRET: "myadminsecretkey"
      HASURA_GRAPHQL_JWT_SECRET: |
        {
          "jwk_url": "https://your-frontend-api.clerk.accounts.dev/.well-known/jwks.json"
        }

volumes:
  db_data:
```

## Database Schema and Synchronisation

### PostgreSQL Database Schema

Create the required tables with proper constraints and indexes:

```sql
-- Roles table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL CHECK (name IN ('viewer', 'consultant', 'manager', 'admin', 'org_admin')),
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    priority INTEGER DEFAULT 0,
    is_system_role BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table with Clerk integration
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_user_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    username VARCHAR(255) UNIQUE,
    image TEXT,
    role VARCHAR(50) DEFAULT 'viewer' REFERENCES roles(name),
    is_staff BOOLEAN DEFAULT false,
    manager_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User roles junction table
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

-- Create indexes for performance
CREATE INDEX idx_users_clerk_user_id ON users(clerk_user_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_manager_id ON users(manager_id);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);

-- Insert default roles
INSERT INTO roles (name, display_name, description, priority) VALUES
    ('viewer', 'Viewer', 'Can view content only', 1),
    ('consultant', 'Consultant', 'Can view and create content', 2),
    ('manager', 'Manager', 'Can manage team members and content', 3),
    ('admin', 'Administrator', 'Full system access', 4),
    ('org_admin', 'Organisation Administrator', 'Organisation-wide administrative access', 5);
```

### Webhook Handler for User Synchronisation

Create a comprehensive webhook handler that syncs Clerk users with your database:

```typescript
// app/api/webhooks/clerk/route.ts
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db"; // Your database connection
import { sql } from "@/lib/sql"; // SQL query builder

interface UserEventData {
  id: string;
  email_addresses: Array<{ email_address: string; id: string }>;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  username: string | null;
  public_metadata: Record<string, any>;
  created_at: number;
  updated_at: number;
}

// Webhook processing table for idempotency
const ensureIdempotency = async (webhookId: string): Promise<boolean> => {
  try {
    await db.execute(sql`
      INSERT INTO processed_webhooks (id, processed_at)
      VALUES (${webhookId}, NOW())
    `);
    return true;
  } catch (error) {
    // Webhook already processed
    return false;
  }
};

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET to your environment variables"
    );
  }

  // Get headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", { status: 400 });
  }

  // Check idempotency
  const isNewWebhook = await ensureIdempotency(svix_id);
  if (!isNewWebhook) {
    return new Response("Webhook already processed", { status: 200 });
  }

  // Get body
  const payload = await req.text();
  const body = JSON.parse(payload);

  // Verify webhook
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", { status: 400 });
  }

  // Handle different event types
  const eventType = evt.type;

  switch (eventType) {
    case "user.created":
      await handleUserCreated(evt.data as UserEventData);
      break;
    case "user.updated":
      await handleUserUpdated(evt.data as UserEventData);
      break;
    case "user.deleted":
      await handleUserDeleted(evt.data);
      break;
    default:
      console.log(`Unhandled webhook type: ${eventType}`);
  }

  return new Response("", { status: 200 });
}

async function handleUserCreated(userData: UserEventData) {
  const primaryEmail = userData.email_addresses[0]?.email_address;
  const fullName =
    [userData.first_name, userData.last_name].filter(Boolean).join(" ") || null;

  await db.transaction(async (tx) => {
    // Create user
    const [user] = await tx.execute(sql`
      INSERT INTO users (
        clerk_user_id, name, email, username, image, role, created_at, updated_at
      ) VALUES (
        ${userData.id},
        ${fullName},
        ${primaryEmail},
        ${userData.username},
        ${userData.image_url},
        ${userData.public_metadata.role || "viewer"},
        ${new Date(userData.created_at)},
        ${new Date(userData.updated_at)}
      )
      ON CONFLICT (clerk_user_id) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        username = EXCLUDED.username,
        image = EXCLUDED.image,
        updated_at = EXCLUDED.updated_at
      RETURNING id, role
    `);

    // Assign role in junction table
    const [roleRecord] = await tx.execute(sql`
      SELECT id FROM roles WHERE name = ${user.role}
    `);

    if (roleRecord) {
      await tx.execute(sql`
        INSERT INTO user_roles (user_id, role_id)
        VALUES (${user.id}, ${roleRecord.id})
        ON CONFLICT (user_id, role_id) DO NOTHING
      `);
    }
  });
}

async function handleUserUpdated(userData: UserEventData) {
  const primaryEmail = userData.email_addresses[0]?.email_address;
  const fullName =
    [userData.first_name, userData.last_name].filter(Boolean).join(" ") || null;

  await db.execute(sql`
    UPDATE users SET
      name = ${fullName},
      email = ${primaryEmail},
      username = ${userData.username},
      image = ${userData.image_url},
      updated_at = ${new Date(userData.updated_at)}
    WHERE clerk_user_id = ${userData.id}
  `);
}

async function handleUserDeleted(userData: { id: string }) {
  await db.execute(sql`
    DELETE FROM users WHERE clerk_user_id = ${userData.id}
  `);
}
```

## Next.js Middleware Implementation

### Configure Clerk Middleware

Create a middleware configuration that protects routes and handles authentication:

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)", // Webhook endpoints must be public
]);

// Define route-specific permissions
const isAdminRoute = createRouteMatcher(["/admin(.*)", "/api/admin(.*)"]);

const isManagerRoute = createRouteMatcher(["/manage(.*)", "/api/manage(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Public routes don't require authentication
  if (isPublicRoute(req)) return;

  // Get authentication state
  const { userId, sessionClaims, protect } = await auth();

  // Require authentication for all non-public routes
  if (!userId) {
    return protect();
  }

  // Check role-based access
  const userRole = sessionClaims?.metadata?.role;

  if (isAdminRoute(req)) {
    if (!["admin", "org_admin"].includes(userRole)) {
      return new Response("Forbidden", { status: 403 });
    }
  }

  if (isManagerRoute(req)) {
    if (!["manager", "admin", "org_admin"].includes(userRole)) {
      return new Response("Forbidden", { status: 403 });
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

### App Layout with ClerkProvider

```typescript
// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

## Role Management and Metadata Updates

### API Route for Role Updates

Create an API route that updates both database and Clerk metadata:

```typescript
// app/api/users/[userId]/role/route.ts
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "@/lib/sql";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Verify admin access
    const { userId: currentUserId, sessionClaims } = await auth();
    const currentUserRole = sessionClaims?.metadata?.role;

    if (!["admin", "org_admin"].includes(currentUserRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { role } = await request.json();

    // Validate role
    const validRoles = [
      "viewer",
      "consultant",
      "manager",
      "admin",
      "org_admin",
    ];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Update database
    await db.transaction(async (tx) => {
      // Update user role
      await tx.execute(sql`
        UPDATE users SET role = ${role}, updated_at = NOW()
        WHERE id = ${params.userId}
      `);

      // Update user_roles junction table
      const [roleRecord] = await tx.execute(sql`
        SELECT id FROM roles WHERE name = ${role}
      `);

      // Remove existing roles
      await tx.execute(sql`
        DELETE FROM user_roles WHERE user_id = ${params.userId}
      `);

      // Add new role
      await tx.execute(sql`
        INSERT INTO user_roles (user_id, role_id)
        VALUES (${params.userId}, ${roleRecord.id})
      `);
    });

    // Get Clerk user ID
    const [user] = await db.execute(sql`
      SELECT clerk_user_id FROM users WHERE id = ${params.userId}
    `);

    if (user?.clerk_user_id) {
      // Update Clerk metadata
      const client = await clerkClient();
      await client.users.updateUserMetadata(user.clerk_user_id, {
        publicMetadata: {
          role,
          allowedRoles: getRoleHierarchy(role),
          roleUpdatedAt: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({ success: true, role });
  } catch (error) {
    console.error("Role update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function getRoleHierarchy(role: string): string[] {
  const hierarchy = {
    viewer: ["viewer"],
    consultant: ["viewer", "consultant"],
    manager: ["viewer", "consultant", "manager"],
    admin: ["viewer", "consultant", "manager", "admin"],
    org_admin: ["viewer", "consultant", "manager", "admin", "org_admin"],
  };
  return hierarchy[role as keyof typeof hierarchy] || ["viewer"];
}
```

## Invitation System Implementation

### Create Invitation API

```typescript
// app/api/invitations/route.ts
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "@/lib/sql";

export async function POST(req: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth();
    const userRole = sessionClaims?.metadata?.role;

    // Only managers and above can send invitations
    if (!["manager", "admin", "org_admin"].includes(userRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { emailAddress, role = "viewer", customMessage } = await req.json();

    // Create database entry for pending user
    const [pendingUser] = await db.execute(sql`
      INSERT INTO users (
        clerk_user_id,
        email,
        role,
        created_at,
        updated_at
      ) VALUES (
        'pending_' || gen_random_uuid(),
        ${emailAddress},
        ${role},
        NOW(),
        NOW()
      )
      RETURNING id
    `);

    // Send Clerk invitation
    const client = await clerkClient();
    const invitation = await client.invitations.createInvitation({
      emailAddress,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/accept-invitation`,
      publicMetadata: {
        invitedBy: userId,
        role,
        dbUserId: pendingUser.id,
        customMessage,
      },
      notify: true,
    });

    // Update pending user with invitation ID
    await db.execute(sql`
      UPDATE users 
      SET clerk_user_id = 'pending_' || ${invitation.id}
      WHERE id = ${pendingUser.id}
    `);

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.emailAddress,
        status: invitation.status,
      },
    });
  } catch (error: any) {
    console.error("Invitation error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// List invitations
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "pending";
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    const client = await clerkClient();
    const invitations = await client.invitations.getInvitationList({
      status: status as "pending" | "accepted" | "revoked",
      limit,
      offset,
    });

    // Enhance with database information
    const enhancedInvitations = await Promise.all(
      invitations.data.map(async (inv) => {
        const [dbUser] = await db.execute(sql`
          SELECT id, role FROM users 
          WHERE clerk_user_id = 'pending_' || ${inv.id}
        `);

        return {
          ...inv,
          role: dbUser?.role || "viewer",
          dbUserId: dbUser?.id,
        };
      })
    );

    return NextResponse.json({
      data: enhancedInvitations,
      totalCount: invitations.totalCount,
    });
  } catch (error) {
    console.error("List invitations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch invitations" },
      { status: 500 }
    );
  }
}
```

### Invitation Management UI

```tsx
// app/admin/invitations/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

interface Invitation {
  id: string;
  emailAddress: string;
  status: "pending" | "accepted" | "revoked";
  createdAt: number;
  publicMetadata: any;
  role: string;
}

export default function InvitationsPage() {
  const { getToken } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [newInviteEmail, setNewInviteEmail] = useState("");
  const [newInviteRole, setNewInviteRole] = useState("viewer");

  useEffect(() => {
    fetchInvitations();
  }, [filter]);

  const fetchInvitations = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`/api/invitations?status=${filter}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setInvitations(data.data || []);
    } catch (error) {
      console.error("Failed to fetch invitations:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          emailAddress: newInviteEmail,
          role: newInviteRole,
        }),
      });

      if (response.ok) {
        setNewInviteEmail("");
        fetchInvitations();
      }
    } catch (error) {
      console.error("Failed to send invitation:", error);
    }
  };

  const resendInvitation = async (invitationId: string) => {
    try {
      const token = await getToken();
      await fetch(`/api/invitations/${invitationId}/resend`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchInvitations();
    } catch (error) {
      console.error("Failed to resend invitation:", error);
    }
  };

  if (loading) return <div>Loading invitations...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Invitations</h1>

      {/* Send new invitation form */}
      <form onSubmit={sendInvitation} className="mb-8 p-4 border rounded">
        <h2 className="text-lg font-semibold mb-4">Send New Invitation</h2>
        <div className="flex gap-4">
          <input
            type="email"
            value={newInviteEmail}
            onChange={(e) => setNewInviteEmail(e.target.value)}
            placeholder="Email address"
            className="flex-1 px-3 py-2 border rounded"
            required
          />
          <select
            value={newInviteRole}
            onChange={(e) => setNewInviteRole(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="viewer">Viewer</option>
            <option value="consultant">Consultant</option>
            <option value="manager">Manager</option>
            <option value="admin">Administrator</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Send Invitation
          </button>
        </div>
      </form>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {["pending", "accepted", "revoked"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded ${
              filter === status
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Invitations list */}
      <div className="space-y-2">
        {invitations.map((invitation) => (
          <div
            key={invitation.id}
            className="flex items-center justify-between p-4 border rounded"
          >
            <div>
              <p className="font-medium">{invitation.emailAddress}</p>
              <p className="text-sm text-gray-600">
                Role: {invitation.role} | Status: {invitation.status}
              </p>
              <p className="text-xs text-gray-500">
                Sent: {new Date(invitation.createdAt).toLocaleDateString()}
              </p>
            </div>
            {invitation.status === "pending" && (
              <button
                onClick={() => resendInvitation(invitation.id)}
                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Resend
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Hasura GraphQL Integration

### Apollo Client Setup with Authentication

```typescript
// lib/apollo-client.ts
"use client";
import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";

export function useApolloClient() {
  const { getToken } = useAuth();

  return useMemo(() => {
    const httpLink = new HttpLink({
      uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_API,
    });

    const authLink = setContext(async (_, { headers }) => {
      const token = await getToken({ template: "hasura" });

      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        },
      };
    });

    const errorLink = onError(
      ({ graphQLErrors, networkError, operation, forward }) => {
        if (graphQLErrors) {
          graphQLErrors.forEach(({ message, locations, path, extensions }) => {
            // Handle permission errors
            if (extensions?.code === "access-denied") {
              console.error("Access denied:", message);
              // Redirect to unauthorised page or show error
            }
          });
        }

        if (networkError) {
          console.error("Network error:", networkError);
        }
      }
    );

    return new ApolloClient({
      link: from([errorLink, authLink, httpLink]),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: "cache-and-network",
        },
      },
    });
  }, [getToken]);
}

// Provider component
export function ApolloProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = useApolloClient();

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
```

### Server-Side GraphQL Queries

```typescript
// app/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server";
import { GraphQLClient } from "graphql-request";

const GET_USER_DATA = `
  query GetUserData($userId: String!) {
    users(where: { clerk_user_id: { _eq: $userId } }) {
      id
      name
      email
      role
      manager {
        id
        name
      }
      user_roles {
        role {
          name
          display_name
          permissions
        }
      }
    }
  }
`;

async function getUserData(userId: string, token: string) {
  const client = new GraphQLClient(process.env.HASURA_GRAPHQL_API!, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  return client.request(GET_USER_DATA, { userId });
}

export default async function DashboardPage() {
  const { userId, getToken } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const token = await getToken({ template: "hasura" });
  const userData = await getUserData(userId, token!);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-2">User Information</h2>
        <pre>{JSON.stringify(userData, null, 2)}</pre>
      </div>
    </div>
  );
}
```

## Production Best Practices

### Environment Configuration for Production

```bash
# .env.production
# Clerk Production Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SECRET=whsec_...
CLERK_ENCRYPTION_KEY=your-32-byte-encryption-key

# Hasura Production Configuration
HASURA_GRAPHQL_ADMIN_SECRET=strong-production-secret
HASURA_GRAPHQL_JWT_SECRET='{"jwk_url":"https://your-production-domain.clerk.accounts.dev/.well-known/jwks.json"}'
HASURA_GRAPHQL_ENABLE_CONSOLE=false
HASURA_GRAPHQL_ENABLE_TELEMETRY=false

# Database Configuration
DATABASE_URL=postgresql://user:password@production-host:5432/dbname?sslmode=require
```

### Security Considerations

1. **JWT Security**: Always use JWKS endpoints for automatic key rotation
2. **Rate Limiting**: Implement rate limiting on invitation endpoints
3. **Webhook Verification**: Always verify webhook signatures
4. **Environment Isolation**: Use separate keys for development and production
5. **Database Security**: Enable SSL for database connections

### Performance Optimisation

```typescript
// Cache authentication state in server components
import { cache } from "react";
import { auth } from "@clerk/nextjs/server";

export const getCachedAuth = cache(async () => {
  return await auth();
});

// Use in multiple components without redundant calls
export async function ServerComponent() {
  const { userId } = await getCachedAuth();
  // Component logic
}
```

### Error Handling and Monitoring

```typescript
// Comprehensive error handling for production
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: string
): Promise<{ data?: T; error?: string }> {
  try {
    const data = await operation();
    return { data };
  } catch (error) {
    console.error(`Error in ${context}:`, error);

    // Log to monitoring service
    if (process.env.NODE_ENV === "production") {
      // Send to Sentry, LogRocket, etc.
    }

    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
```

## Complete Implementation Checklist

- [ ] Set up Clerk application and configure JWT template
- [ ] Configure Hasura with JWKS endpoint
- [ ] Create PostgreSQL database schema
- [ ] Implement webhook handler for user synchronisation
- [ ] Configure Next.js middleware with role-based access
- [ ] Create role management API endpoints
- [ ] Implement invitation system with database tracking
- [ ] Set up Apollo/GraphQL client with authentication
- [ ] Create invitation management UI
- [ ] Configure production environment variables
- [ ] Implement comprehensive error handling
- [ ] Set up monitoring and logging
- [ ] Test authentication flows thoroughly
- [ ] Deploy with proper security configurations

This implementation provides a complete, production-ready authentication system that seamlessly integrates Clerk with Hasura while maintaining synchronisation with your PostgreSQL database and supporting comprehensive role management and invitation workflows.
// app/api/auth/me/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from '@/lib/sql';

export async function GET() {
try {
const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [user] = await db.execute(sql`
      SELECT
        u.id,
        u.clerk_user_id as "clerkUserId",
        u.name,
        u.email,
        u.username,
        u.image,
        u.role,
        u.is_staff as "isStaff",
        u.manager_id as "managerId",
        u.created_at as "createdAt",
        u.updated_at as "updatedAt",
        json_build_object(
          'id', m.id,
          'name', m.name,
          'email', m.email
        ) as manager,
        (
          SELECT json_agg(
            json_build_object(
              'role', json_build_object(
                'id', r.id,
                'name', r.name,
                'displayName', r.display_name,
                'priority', r.priority
              )
            )
          )
          FROM user_roles ur
          JOIN roles r ON ur.role_id = r.id
          WHERE ur.user_id = u.id
        ) as "userRoles"
      FROM users u
      LEFT JOIN users m ON u.manager_id = m.id
      WHERE u.clerk_user_id = ${clerkUserId}
    `);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);

} catch (error) {
console.error('Error fetching user:', error);
return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
}

// app/api/auth/sync/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from '@/lib/sql';

export async function POST(req: NextRequest) {
try {
const { userId: authUserId } = await auth();

    if (!authUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { clerkUserId, email, name, username, image, role } = await req.json();

    // Verify the user is syncing their own data
    if (clerkUserId !== authUserId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Create or update user
    const [user] = await db.execute(sql`
      INSERT INTO users (
        clerk_user_id, name, email, username, image, role, created_at, updated_at
      ) VALUES (
        ${clerkUserId},
        ${name},
        ${email},
        ${username},
        ${image},
        ${role || 'viewer'},
        NOW(),
        NOW()
      )
      ON CONFLICT (clerk_user_id) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        username = EXCLUDED.username,
        image = EXCLUDED.image,
        updated_at = NOW()
      RETURNING *
    `);

    // Assign default role in junction table
    const [roleRecord] = await db.execute(sql`
      SELECT id FROM roles WHERE name = ${user.role}
    `);

    if (roleRecord) {
      await db.execute(sql`
        INSERT INTO user_roles (user_id, role_id)
        VALUES (${user.id}, ${roleRecord.id})
        ON CONFLICT (user_id, role_id) DO NOTHING
      `);
    }

    return NextResponse.json(user);

} catch (error) {
console.error('Error syncing user:', error);
return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
}

// app/layout.tsx - Updated with Auth Provider
import { ClerkProvider } from '@clerk/nextjs';
import { AuthProvider } from '@/lib/auth-context';
import { ApolloProviderWrapper } from '@/lib/apollo-client';
import { Inter } from 'next/font/google';
import './globals.css';
import LoadingSpinner from '@/components/loading-spinner';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
children,
}: {
children: React.ReactNode;
}) {
return (
<ClerkProvider>

<html lang="en">
<body className={inter.className}>
<AuthProvider fallback={<LoadingSpinner />}>
<ApolloProviderWrapper>
{children}
</ApolloProviderWrapper>
</AuthProvider>
</body>
</html>
</ClerkProvider>
);
}

// components/loading-spinner.tsx
export default function LoadingSpinner() {
return (

<div className="flex items-center justify-center min-h-screen">
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
</div>
);
}

// Example usage in a component
// app/dashboard/page.tsx
'use client';
import { useAuth } from '@/lib/auth-context';
import { Role } from '@/types/enums';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
const {
user,
isAdmin,
isManager,
canViewReports,
getInvitations,
sendInvitation
} = useAuth();

const [invitations, setInvitations] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
if (canViewReports) {
loadInvitations();
}
}, [canViewReports]);

const loadInvitations = async () => {
try {
setLoading(true);
const data = await getInvitations('pending');
setInvitations(data);
} catch (error) {
console.error('Failed to load invitations:', error);
} finally {
setLoading(false);
}
};

const handleSendInvite = async () => {
try {
await sendInvitation('<newuser@example.com>', Role.Consultant);
await loadInvitations();
} catch (error) {
console.error('Failed to send invitation:', error);
}
};

return (

<div className="p-6">
<h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold">Welcome, {user?.name || 'User'}</h2>
        <p className="text-gray-600">Role: {user?.role}</p>
      </div>

      {isAdmin && (
        <div className="bg-blue-50 p-4 rounded mb-4">
          <p className="font-medium">Admin Panel</p>
          <p>You have full system access</p>
        </div>
      )}

      {isManager && (
        <div className="bg-green-50 p-4 rounded mb-4">
          <p className="font-medium">Manager Tools</p>
          <button
            onClick={handleSendInvite}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Send Invitation
          </button>
        </div>
      )}

      {canViewReports && (
        <div className="bg-gray-50 p-4 rounded">
          <p className="font-medium">Pending Invitations: {invitations.length}</p>
        </div>
      )}
    </div>

);
}

// Example of protecting a page with HOC
// app/admin/settings/page.tsx
'use client';
import { withAuth } from '@/lib/auth-context';
import { Role } from '@/types/enums';

function AdminSettingsPage() {
return (

<div className="p-6">
<h1 className="text-2xl font-bold">Admin Settings</h1>
<p>Only admins can see this page</p>
</div>
);
}

export default withAuth(AdminSettingsPage, {
roles: [Role.Admin, Role.Developer],
redirectTo: '/dashboard',
});

// Example of conditional rendering with useRoleAccess
// components/nav-menu.tsx
'use client';
import { useRoleAccess } from '@/lib/auth-context';
import { Role } from '@/types/enums';
import Link from 'next/link';

export default function NavMenu() {
const adminAccess = useRoleAccess([Role.Admin, Role.Developer]);
const managerAccess = useRoleAccess(Role.Manager);

return (

<nav className="flex gap-4">
<Link href="/dashboard">Dashboard</Link>

      {managerAccess.hasAccess && (
        <Link href="/team">Team Management</Link>
      )}

      {adminAccess.hasAccess && (
        <Link href="/admin">Admin Panel</Link>
      )}
    </nav>

);
}

// Utility functions for server components
// lib/auth-helpers.ts
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { sql } from '@/lib/sql';
import { Role } from '@/types/enums';
import { redirect } from 'next/navigation';

export async function requireAuth() {
const { userId } = await auth();

if (!userId) {
redirect('/sign-in');
}

return userId;
}

export async function requireRole(roles: Role | Role[]) {
const userId = await requireAuth();

const [user] = await db.execute(sql`SELECT role FROM users WHERE clerk_user_id = ${userId}`);

const allowedRoles = Array.isArray(roles) ? roles : [roles];

if (!user || !allowedRoles.includes(user.role as Role)) {
redirect('/unauthorized');
}

return user;
}

// Usage in server component
// app/admin/page.tsx
import { requireRole } from '@/lib/auth-helpers';
import { Role } from '@/types/enums';

export default async function AdminPage() {
await requireRole([Role.Admin, Role.Developer]);

return (

<div className="p-6">
<h1 className="text-2xl font-bold">Admin Dashboard</h1>
{/_ Admin content _/}
</div>
);
}
// lib/auth-context.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth as useClerkAuth, useUser as useClerkUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Role } from '@/types/enums';

// Types
interface DatabaseUser {
id: string;
clerkUserId: string;
name: string | null;
email: string | null;
username: string | null;
image: string | null;
role: Role;
isStaff: boolean;
managerId: string | null;
manager?: {
id: string;
name: string;
email: string;
} | null;
userRoles?: Array<{
role: {
id: string;
name: string;
displayName: string;
priority: number;
};
}>;
createdAt: Date;
updatedAt: Date;
}

interface AuthContextType {
// Clerk authentication state
isLoaded: boolean;
isSignedIn: boolean;
userId: string | null;
sessionId: string | null;

// Database user data
user: DatabaseUser | null;
isLoadingUser: boolean;
userError: Error | null;

// Role utilities
hasRole: (role: Role | Role[]) => boolean;
hasAnyRole: (roles: Role[]) => boolean;
hasAllRoles: (roles: Role[]) => boolean;
isAdmin: boolean;
isManager: boolean;
isConsultant: boolean;
isViewer: boolean;
canManageUsers: boolean;
canViewReports: boolean;

// Actions
refreshUser: () => Promise<void>;
updateUserRole: (userId: string, newRole: Role) => Promise<void>;
signOut: () => Promise<void>;
getToken: (options?: { template?: string }) => Promise<string | null>;

// Invitation management
sendInvitation: (email: string, role: Role, customMessage?: string) => Promise<void>;
getInvitations: (status?: 'pending' | 'accepted' | 'revoked') => Promise<any[]>;
resendInvitation: (invitationId: string) => Promise<void>;
}

interface AuthProviderProps {
children: React.ReactNode;
fallback?: React.ReactNode;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook
export function useAuth() {
const context = useContext(AuthContext);
if (!context) {
throw new Error('useAuth must be used within an AuthProvider');
}
return context;
}

// Helper function to check role hierarchy
const roleHierarchy: Record<Role, number> = {
[Role.Viewer]: 1,
[Role.Consultant]: 2,
[Role.Manager]: 3,
[Role.Admin]: 4,
[Role.Developer]: 5, // maps to 'admin' in database
};

// Auth Provider Component
export function AuthProvider({ children, fallback }: AuthProviderProps) {
const router = useRouter();
const {
isLoaded: clerkLoaded,
isSignedIn,
userId: clerkUserId,
sessionId,
getToken: clerkGetToken,
signOut: clerkSignOut,
} = useClerkAuth();
const { user: clerkUser } = useClerkUser();

const [user, setUser] = useState<DatabaseUser | null>(null);
const [isLoadingUser, setIsLoadingUser] = useState(true);
const [userError, setUserError] = useState<Error | null>(null);

// Fetch user data from database
const fetchUser = useCallback(async () => {
if (!clerkUserId) {
setUser(null);
setIsLoadingUser(false);
return;
}

    try {
      setIsLoadingUser(true);
      setUserError(null);

      const token = await clerkGetToken();
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
      setUserError(error as Error);

      // If user not found in database, create them
      if ((error as any)?.message?.includes('not found')) {
        await createUserInDatabase();
      }
    } finally {
      setIsLoadingUser(false);
    }

}, [clerkUserId, clerkGetToken]);

// Create user in database if missing
const createUserInDatabase = async () => {
if (!clerkUser) return;

    try {
      const token = await clerkGetToken();
      const response = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkUserId: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress,
          name: clerkUser.fullName,
          username: clerkUser.username,
          image: clerkUser.imageUrl,
          role: clerkUser.publicMetadata?.role || Role.Viewer,
        }),
      });

      if (response.ok) {
        await fetchUser();
      }
    } catch (error) {
      console.error('Error creating user in database:', error);
    }

};

// Load user data when authentication state changes
useEffect(() => {
if (clerkLoaded && isSignedIn && clerkUserId) {
fetchUser();
} else if (clerkLoaded && !isSignedIn) {
setUser(null);
setIsLoadingUser(false);
}
}, [clerkLoaded, isSignedIn, clerkUserId, fetchUser]);

// Role checking utilities
const hasRole = useCallback((role: Role | Role[]) => {
if (!user) return false;

    if (Array.isArray(role)) {
      return role.includes(user.role);
    }

    return user.role === role;

}, [user]);

const hasAnyRole = useCallback((roles: Role[]) => {
if (!user) return false;
return roles.some(role => user.role === role);
}, [user]);

const hasAllRoles = useCallback((roles: Role[]) => {
if (!user) return false;
// For single role system, user can only have all roles if checking for their single role
return roles.length === 1 && roles[0] === user.role;
}, [user]);

// Role-based boolean flags
const isAdmin = hasRole([Role.Admin, Role.Developer]);
const isManager = hasRole(Role.Manager) || isAdmin;
const isConsultant = hasRole(Role.Consultant) || isManager;
const isViewer = !!user; // All authenticated users are at least viewers

// Permission flags
const canManageUsers = isManager;
const canViewReports = isConsultant;

// Actions
const refreshUser = useCallback(async () => {
await fetchUser();
}, [fetchUser]);

const updateUserRole = useCallback(async (userId: string, newRole: Role) => {
if (!canManageUsers) {
throw new Error('Insufficient permissions to update user roles');
}

    try {
      const token = await clerkGetToken();
      const response = await fetch(`/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update role');
      }

      // Refresh current user if updating self
      if (userId === user?.id) {
        await refreshUser();
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }

}, [canManageUsers, clerkGetToken, user?.id, refreshUser]);

const signOut = useCallback(async () => {
await clerkSignOut();
setUser(null);
router.push('/');
}, [clerkSignOut, router]);

const getToken = useCallback(async (options?: { template?: string }) => {
return await clerkGetToken(options);
}, [clerkGetToken]);

// Invitation management
const sendInvitation = useCallback(async (
email: string,
role: Role,
customMessage?: string
) => {
if (!canManageUsers) {
throw new Error('Insufficient permissions to send invitations');
}

    try {
      const token = await clerkGetToken();
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailAddress: email,
          role,
          customMessage
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send invitation');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending invitation:', error);
      throw error;
    }

}, [canManageUsers, clerkGetToken]);

const getInvitations = useCallback(async (
status: 'pending' | 'accepted' | 'revoked' = 'pending'
) => {
try {
const token = await clerkGetToken();
const response = await fetch(`/api/invitations?status=${status}`, {
headers: {
'Authorization': `Bearer ${token}`,
},
});

      if (!response.ok) {
        throw new Error('Failed to fetch invitations');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching invitations:', error);
      throw error;
    }

}, [clerkGetToken]);

const resendInvitation = useCallback(async (invitationId: string) => {
if (!canManageUsers) {
throw new Error('Insufficient permissions to resend invitations');
}

    try {
      const token = await clerkGetToken();
      const response = await fetch(`/api/invitations/${invitationId}/resend`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to resend invitation');
      }
    } catch (error) {
      console.error('Error resending invitation:', error);
      throw error;
    }

}, [canManageUsers, clerkGetToken]);

// Loading state
const isLoaded = clerkLoaded && !isLoadingUser;

// Context value
const value: AuthContextType = {
// State
isLoaded,
isSignedIn: isSignedIn ?? false,
userId: user?.id ?? null,
sessionId,
user,
isLoadingUser,
userError,

    // Role utilities
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    isManager,
    isConsultant,
    isViewer,
    canManageUsers,
    canViewReports,

    // Actions
    refreshUser,
    updateUserRole,
    signOut,
    getToken,
    sendInvitation,
    getInvitations,
    resendInvitation,

};

// Show fallback while loading
if (!isLoaded && fallback) {
return <>{fallback}</>;
}

return (
<AuthContext.Provider value={value}>
{children}
</AuthContext.Provider>
);
}

// HOC for protecting components
export function withAuth<P extends object>(
Component: React.ComponentType<P>,
options?: {
roles?: Role[];
fallback?: React.ComponentType;
redirectTo?: string;
}
) {
return function ProtectedComponent(props: P) {
const { isSignedIn, user, isLoaded, hasAnyRole } = useAuth();
const router = useRouter();

    useEffect(() => {
      if (isLoaded && !isSignedIn && options?.redirectTo) {
        router.push(options.redirectTo);
      }
    }, [isLoaded, isSignedIn, router]);

    if (!isLoaded) {
      return options?.fallback ? <options.fallback /> : <div>Loading...</div>;
    }

    if (!isSignedIn) {
      return options?.fallback ? <options.fallback /> : null;
    }

    if (options?.roles && !hasAnyRole(options.roles)) {
      return <div>Access denied. Insufficient permissions.</div>;
    }

    return <Component {...props} />;

};
}

// Utility hook for role-based rendering
export function useRoleAccess(requiredRoles: Role | Role[]) {
const { hasRole, hasAnyRole, isLoaded, isSignedIn } = useAuth();

const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
const hasAccess = isSignedIn && hasAnyRole(roles);

return {
hasAccess,
isChecking: !isLoaded,
isAuthenticated: isSignedIn,
};
}
