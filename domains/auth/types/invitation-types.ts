export type InvitationStatus = "pending" | "accepted" | "expired" | "cancelled";

export interface InvitationFormData {
  email: string;
  firstName: string;
  lastName: string;
  invitedRole: string;
  managerId?: string;
}

export interface InvitationMetadata {
  source?: string;
  invitationType?: "manual" | "bulk" | "automated";
  additionalInfo?: Record<string, any>;
}

export interface InvitationListItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  invitedRole: string;
  status: InvitationStatus;
  invitedAt: string;
  expiresAt: string;
  acceptedAt?: string;
  invitedByUser?: {
    id: string;
    name: string;
    email: string;
  };
  managerUser?: {
    id: string;
    name: string;
    email: string;
  };
}
