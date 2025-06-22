import { useQuery } from "@apollo/client";
import { useCurrentUser } from "./use-current-user";
import { GetUserRoleSecureDocument } from "@/domains/users/graphql/generated/graphql";

export function useUserRole() {
  const { currentUserId, loading: userLoading } = useCurrentUser();

  const { data, loading, error, refetch } = useQuery(
    GetUserRoleSecureDocument,
    {
      variables: { userId: currentUserId! },
      skip: !currentUserId || !!userLoading,
      fetchPolicy: "cache-first",
      errorPolicy: "all",
      onError: err => {
        console.warn(
          "🔒 Role query failed, this is expected in production with restricted permissions:",
          err.message
        );
      },
    }
  );

  const role = data?.user?.role;

  return {
    role: role || "viewer", // Default to viewer if role access is restricted
    loading: userLoading || loading,
    error,
    refetch,
    hasRoleAccess: !!role,
  };
}
