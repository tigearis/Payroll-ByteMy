import { useMutation } from "@apollo/client";
import { toast } from "sonner";
import { useCachedQuery } from "@/hooks/use-strategic-query";
import {
  GetInvitationByTicketDocument,
  CompleteInvitationAcceptanceDocument,
  AssignInvitationRoleDocument,
} from "../graphql/generated/graphql";

export interface AcceptInvitationData {
  invitationId: string;
  clerkUserId: string;
  userEmail: string;
  userName: string;
  roleId: string;
}

/**
 * Hook for accepting user invitations with GraphQL
 * Replaces REST API calls for invitation acceptance
 */
export function useInvitationAcceptance() {
  // Complete invitation acceptance mutation
  const [completeAcceptanceMutation, { loading: acceptanceLoading }] =
    useMutation(CompleteInvitationAcceptanceDocument, {
      onCompleted: () => {
        toast.success("Invitation accepted successfully");
      },
      onError: error => {
        console.error("Error accepting invitation:", error);
        toast.error("Failed to accept invitation");
      },
    });

  // Assign role mutation
  const [assignRoleMutation, { loading: roleAssignLoading }] = useMutation(
    AssignInvitationRoleDocument,
    {
      onCompleted: () => {
        toast.success("Role assigned successfully");
      },
      onError: error => {
        console.error("Error assigning role:", error);
        toast.error("Failed to assign role");
      },
    }
  );

  // Get invitation by Clerk ticket
  const getInvitationByTicket = (clerkTicket: string) => {
    return useCachedQuery(GetInvitationByTicketDocument, "invitations", {
      variables: { clerkTicket },
      skip: !clerkTicket,
      errorPolicy: "all",
    });
  };

  // Accept invitation (complete flow)
  const acceptInvitation = async (data: AcceptInvitationData) => {
    try {
      // Step 1: Complete invitation acceptance and create user
      const acceptanceResult = await completeAcceptanceMutation({
        variables: {
          invitationId: data.invitationId,
          clerkUserId: data.clerkUserId,
          userEmail: data.userEmail,
          userName: data.userName,
        },
      });

      if (!acceptanceResult.data?.insertUser?.id) {
        throw new Error("Failed to create user record");
      }

      const userId = acceptanceResult.data.insertUser.id;

      // Step 2: Assign role to the newly created user
      const roleResult = await assignRoleMutation({
        variables: {
          userId,
          roleId: data.roleId,
          invitationId: data.invitationId,
        },
      });

      return {
        success: true,
        data: {
          user: acceptanceResult.data,
          role: roleResult.data,
        },
      };
    } catch (error) {
      console.error("Error accepting invitation:", error);
      return { success: false, error };
    }
  };

  return {
    // Actions
    acceptInvitation,
    getInvitationByTicket,

    // Loading states
    loading: {
      acceptance: acceptanceLoading,
      roleAssign: roleAssignLoading,
      total: acceptanceLoading || roleAssignLoading,
    },
  };
}
