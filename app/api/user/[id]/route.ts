// app/api/user/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { gql } from '@apollo/client';
import { adminApolloClient } from "@/lib/apollo-client";

// Update user mutation
const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($clerkId: String!, $name: String) {
    update_users(
      where: { clerk_user_id: { _eq: $clerkId } },
      _set: { 
        name: $name,
        updated_at: "now()"
      }
    ) {
      returning {
        id
        name
        updated_at
        role
      }
    }
  }
`;

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Authentication check
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Users can only update their own profiles
    if (userId !== params.id) {
      return NextResponse.json({ error: 'Forbidden: Can only update your own profile' }, { status: 403 });
    }
    
    // Parse request body
    const { firstName, lastName } = await req.json();
    const fullName = [firstName, lastName].filter(Boolean).join(' ');
    
    // Update the user in the database
    const { data, errors } = await adminApolloClient.mutate({
      mutation: UPDATE_USER_PROFILE,
      variables: {
        clerkId: userId,
        name: fullName
      }
    });
    
    if (errors) {
      console.error("GraphQL errors:", errors);
      return NextResponse.json({ error: "Failed to update user profile" }, { status: 500 });
    }
    
    const updatedUser = data?.update_users?.returning?.[0];
    
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to update user profile' 
    }, { status: 500 });
  }
}