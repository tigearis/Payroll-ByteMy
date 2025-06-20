import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { useCurrentUser } from "./useCurrentUser";

// Import extracted GraphQL operations
const GET_USER_ROLE = gql`
  query GetUserRole($userId: uuid!) {
    users_by_pk(id: $userId) {
      id
      role
      is_staff
      is_active
    }
  }
`;

const GET_USER_ROLE_FALLBACK = gql`
  query GetUserRoleFallback($userId: uuid!) {
    users_by_pk(id: $userId) {
      id
      role
      is_staff
      is_active
      clerk_user_id
    }
  }
`;

export function useUserRole() {
  const { currentUserId, loading: userLoading } = useCurrentUser();
  
  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery(GET_USER_ROLE, {
    variables: { userId: currentUserId },
    skip: !currentUserId || !!userLoading,
    fetchPolicy: "cache-first",
    errorPolicy: "all",
    onError: (err) => {
      console.warn("🔒 Role query failed, this is expected in production with restricted permissions:", err.message);
    },
  });

  const role = data?.users_by_pk?.role;

  return {
    role: role || "viewer", // Default to viewer if role access is restricted
    loading: userLoading || loading,
    error,
    refetch,
    hasRoleAccess: !!role,
  };
}