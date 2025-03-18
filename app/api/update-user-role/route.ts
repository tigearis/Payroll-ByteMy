// app/api/update-user-role/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getServerApolloClient } from '@/lib/apollo-client';
import { UPDATE_STAFF } from '@/graphql/mutations/staff/updateStaff';

export async function POST(req: NextRequest) {
  try {
    // Check authentication and authorization
    const { userId, getToken } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the token to check user role
    const token = await getToken({ template: 'hasura' });
    
    if (!token) {
      return NextResponse.json({ error: 'Failed to verify permissions' }, { status: 403 });
    }

    // Decode the JWT to get the claims
    const tokenParts = token.split('.');
    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
    const hasuraClaims = payload['https://hasura.io/jwt/claims'];
    const userRole = hasuraClaims?.['x-hasura-default-role'];
    
    // Only admins and developers can update user roles
    if (!['admin', 'org_admin'].includes(userRole)) {
      return NextResponse.json({ error: 'Insufficient permissions to update user roles' }, { status: 403 });
    }

    // Parse request body
    const { userId: targetUserId, newRole } = await req.json();
    
    if (!targetUserId || !newRole) {
      return NextResponse.json({ error: 'User ID and role are required' }, { status: 400 });
    }

    // Validate role
    const validRoles = ['admin', 'org_admin', 'manager', 'consultant', 'viewer'];
    if (!validRoles.includes(newRole)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Get Apollo client
    const client = await getServerApolloClient();

    // Execute the GraphQL mutation
    const { data, errors } = await client.mutate({
      mutation: UPDATE_STAFF,
      variables: {
        id: targetUserId,
        role: newRole
      },
      context: {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
    });

    if (errors && errors.length > 0) {
      console.error('GraphQL errors:', errors);
      return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
    }

    if (!data?.update_users_by_pk) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: `User role updated to ${newRole}`,
      user: data.update_users_by_pk
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to update user role'
    }, { status: 500 });
  }
}