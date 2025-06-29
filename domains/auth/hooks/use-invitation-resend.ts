import { useMutation } from "@apollo/client";
import { toast } from "sonner";
import { useCachedQuery } from "@/hooks/use-strategic-query";
import {
  ResendUserInvitationDocument,
  GetInvitationByIdDocument,
} from "../graphql/generated/graphql";

export interface ResendInvitationData {
  invitationId: string;
  newExpiresAt: string;
  newClerkTicket?: string;
  newClerkInvitationId?: string;
}

/**
 * Hook for resending user invitations with GraphQL
 * Replaces REST API calls for invitation resending
 */
export function useInvitationResend() {
  // Resend invitation mutation
  const [resendInvitationMutation, { loading: resendLoading }] = useMutation(
    ResendUserInvitationDocument,
    {
      onCompleted: () => {
        toast.success("Invitation resent successfully");
      },
      onError: error => {
        console.error("Error resending invitation:", error);
        toast.error("Failed to resend invitation");
      },
    }
  );

  // Get invitation details for resending
  const getInvitationForResend = (invitationId: string) => {
    return useCachedQuery(GetInvitationByIdDocument, "invitations", {
      variables: { invitationId },
      skip: !invitationId,
      errorPolicy: "all",
    });
  };

  // Resend invitation
  const resendInvitation = async (data: ResendInvitationData) => {
    try {
      const variables: any = {
        invitationId: data.invitationId,
        newExpiresAt: data.newExpiresAt,
      };

      if (data.newClerkTicket) {
        variables.newClerkTicket = data.newClerkTicket;
      }

      if (data.newClerkInvitationId) {
        variables.newClerkInvitationId = data.newClerkInvitationId;
      }

      const result = await resendInvitationMutation({ variables });
      return { success: true, data: result.data };
    } catch (error) {
      console.error("Error resending invitation:", error);
      return { success: false, error };
    }
  };

  return {
    // Actions
    resendInvitation,
    getInvitationForResend,

    // Loading states
    loading: {
      resend: resendLoading,
    },
  };
}
