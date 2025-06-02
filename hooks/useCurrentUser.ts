import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";

const GET_CURRENT_USER = gql`
  query GetCurrentUser($clerkId: String!) {
    users(where: { clerk_user_id: { _eq: $clerkId } }) {
      id
      name
      email
      role
      is_staff
      manager_id
      clerk_user_id
      created_at
      updated_at
    }
  }
`;

export function useCurrentUser() {
  const { userId: clerkUserId } = useAuth();

  const { data, loading, error, refetch } = useQuery(GET_CURRENT_USER, {
    variables: { clerkId: clerkUserId },
    skip: !clerkUserId,
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
    onError: (err) => {
      console.error("useCurrentUser GraphQL error:", err);
      console.error("Clerk User ID:", clerkUserId);
      // Note: User sync is now handled by Clerk webhooks automatically
      // If user is not found, check that webhook processing is working correctly
    },
  });

  const currentUser = data?.users?.[0] || null;

  // Ensure currentUserId is always a valid UUID or null
  const currentUserId = currentUser?.id || null;

  // Validate that currentUserId is a UUID format if it exists
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const validCurrentUserId =
    currentUserId && uuidRegex.test(currentUserId) ? currentUserId : null;

  if (currentUserId && !validCurrentUserId) {
    console.error("⚠️ Invalid UUID format for currentUserId:", currentUserId);
  }

  // Log if user not found (this is now expected to be handled by webhooks)
  if (clerkUserId && !loading && !currentUser && !error) {
    console.warn("⚠️ User not found in database for Clerk ID:", clerkUserId);
    console.warn("📝 This should be automatically synced via Clerk webhooks");
    console.warn("🔧 Check that webhook processing is working correctly");
  }

  return {
    currentUser,
    currentUserId: validCurrentUserId, // Always return a valid UUID or null
    clerkUserId,
    loading,
    error,
    refetch,
  };
}
