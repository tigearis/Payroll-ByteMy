import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { useCurrentUser } from "./useCurrentUser";

// Separate query for role field with better error handling
const GET_USER_ROLE = gql`
  query GetUserRole($currentUserId: uuid!) {
    users_by_pk(id: $currentUserId) {
      id
      role
    }
  }
`;

// Fallback using a different approach if role field access fails
const GET_USER_ROLE_FALLBACK = gql`
  query GetUserRoleFallback($currentUserId: uuid!) {
    users(where: {id: {_eq: $currentUserId}}) {
      id
      role
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
    variables: { currentUserId },
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