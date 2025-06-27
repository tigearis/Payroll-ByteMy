import { useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";
import {
  GetPendingInvitationsDocument,
  GetExpiredInvitationsDocument,
  CreateUserInvitationDocument,
  CancelUserInvitationDocument,
  MarkExpiredInvitationsDocument,
} from "../graphql/generated/graphql";
import { useCachedQuery } from "@/hooks/use-strategic-query";

export interface InvitationListOptions {
  view?: "pending" | "expired" | "all";
  limit?: number;
  offset?: number;
}

export interface CreateInvitationData {
  email: string;
  firstName: string;
  lastName: string;
  invitedRole: string;
  managerId?: string;
  clerkInvitationId?: string;
  clerkTicket?: string;
  invitationMetadata?: any;
  invitedBy: string;
  expiresAt: string;
}

/**
 * Hook for managing user invitations with GraphQL
 * Replaces REST API calls with domain-specific GraphQL operations
 */
export function useInvitationManagement() {
  // Query for pending invitations
  const {
    data: pendingData,
    loading: pendingLoading,
    error: pendingError,
    refetch: refetchPending,
  } = useQuery(GetPendingInvitationsDocument, {
    variables: { limit: 50, offset: 0 },
    errorPolicy: "all",
  });

  // Query for expired invitations
  const {
    data: expiredData,
    loading: expiredLoading,
    error: expiredError,
    refetch: refetchExpired,
  } = useQuery(GetExpiredInvitationsDocument, {
    errorPolicy: "all",
  });

  // Create invitation mutation
  const [createInvitationMutation, { loading: createLoading }] = useMutation(
    CreateUserInvitationDocument,
    {
      onCompleted: () => {
        toast.success("Invitation sent successfully");
        refetchPending();
      },
      onError: error => {
        console.error("Error creating invitation:", error);
        toast.error("Failed to send invitation");
      },
    }
  );

  // Cancel invitation mutation
  const [cancelInvitationMutation, { loading: cancelLoading }] = useMutation(
    CancelUserInvitationDocument,
    {
      onCompleted: () => {
        toast.success("Invitation cancelled");
        refetchPending();
      },
      onError: error => {
        console.error("Error cancelling invitation:", error);
        toast.error("Failed to cancel invitation");
      },
    }
  );

  // Mark expired invitations mutation
  const [markExpiredMutation, { loading: markExpiredLoading }] = useMutation(
    MarkExpiredInvitationsDocument,
    {
      onCompleted: data => {
        const count = data.bulkUpdateUserInvitations?.affectedRows || 0;
        if (count > 0) {
          toast.success(`Marked ${count} invitations as expired`);
          refetchPending();
          refetchExpired();
        }
      },
      onError: error => {
        console.error("Error marking expired invitations:", error);
        toast.error("Failed to clean up expired invitations");
      },
    }
  );

  // Get invitations based on view type
  const getInvitations = (options: InvitationListOptions = {}) => {
    const { view = "pending" } = options;

    switch (view) {
      case "pending":
        return {
          data: pendingData?.userInvitations || [],
          loading: pendingLoading,
          error: pendingError,
        };
      case "expired":
        return {
          data: expiredData?.userInvitations || [],
          loading: expiredLoading,
          error: expiredError,
        };
      case "all":
        return {
          data: [
            ...(pendingData?.userInvitations || []),
            ...(expiredData?.userInvitations || []),
          ],
          loading: pendingLoading || expiredLoading,
          error: pendingError || expiredError,
        };
      default:
        return {
          data: [],
          loading: false,
          error: null,
        };
    }
  };

  // Create invitation
  const createInvitation = async (data: CreateInvitationData) => {
    try {
      const result = await createInvitationMutation({
        variables: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          invitedRole: data.invitedRole,
          managerId: data.managerId || null,
          clerkInvitationId: data.clerkInvitationId || null,
          clerkTicket: data.clerkTicket || null,
          invitationMetadata: data.invitationMetadata || null,
          invitedBy: data.invitedBy,
          expiresAt: data.expiresAt,
        },
      });
      return { success: true, data: result.data };
    } catch (error) {
      console.error("Error creating invitation:", error);
      return { success: false, error };
    }
  };

  // Cancel invitation
  const cancelInvitation = async (invitationId: string) => {
    try {
      const result = await cancelInvitationMutation({
        variables: { invitationId },
      });
      return { success: true, data: result.data };
    } catch (error) {
      console.error("Error cancelling invitation:", error);
      return { success: false, error };
    }
  };

  // Clean up expired invitations
  const cleanupExpiredInvitations = async () => {
    try {
      const result = await markExpiredMutation();
      return { success: true, data: result.data };
    } catch (error) {
      console.error("Error cleaning up expired invitations:", error);
      return { success: false, error };
    }
  };

  return {
    // Data access
    getInvitations,

    // Actions
    createInvitation,
    cancelInvitation,
    cleanupExpiredInvitations,

    // Refetch functions
    refetchPending,
    refetchExpired,

    // Loading states
    loading: {
      pending: pendingLoading,
      expired: expiredLoading,
      create: createLoading,
      cancel: cancelLoading,
      cleanup: markExpiredLoading,
    },

    // Errors
    errors: {
      pending: pendingError,
      expired: expiredError,
    },
  };
}
