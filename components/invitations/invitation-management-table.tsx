"use client";

import { Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInvitationManagement } from "@/domains/auth";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { useEnhancedPermissions } from "@/lib/auth";


interface Invitation {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  invitedRole: string;
  status: string;
  invitedAt: string;
  expiresAt: string;
  invitedByUser?: {
    name: string;
    email: string;
  };
}

interface InvitationManagementTableProps {
  view: "pending" | "expired" | "cleanup";
}

export function InvitationManagementTable({
  view,
}: InvitationManagementTableProps) {
  const { hasPermission } = useEnhancedPermissions();
  
  if (!hasPermission('staff:write')) {
    return null;
  }
  const { getInvitations, cleanupExpiredInvitations, loading, errors } =
    useInvitationManagement();

  const invitationData = getInvitations({
    view: view === "cleanup" ? "expired" : view,
  });
  const invitations = invitationData.data as Invitation[];

  const handleCleanup = async () => {
    const result = await cleanupExpiredInvitations();
    if (result.success) {
      const count = result.data?.bulkUpdateUserInvitations?.affectedRows || 0;
      toast.success(`Cleaned up ${count} expired invitations`);
    }
  };

  if (invitationData.loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Invitations...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (invitationData.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">
            {invitationData.error.message || "Failed to load invitations"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {view === "pending" && "Pending Invitations"}
          {view === "expired" && "Expired Invitations"}
          {view === "cleanup" && "Cleanup Expired Invitations"}
        </CardTitle>
        {view === "cleanup" && invitations.length > 0 && (
          <Button
            onClick={handleCleanup}
            disabled={loading.cleanup}
            variant="destructive"
            size="sm"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {loading.cleanup
              ? "Cleaning..."
              : `Clean Up ${invitations.length} Expired`}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {invitations.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            {view === "pending" && "No pending invitations"}
            {view === "expired" && "No expired invitations"}
            {view === "cleanup" && "No expired invitations to clean up"}
          </p>
        ) : (
          <div className="space-y-4">
            {invitations.map(invitation => (
              <div
                key={invitation.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">
                      {invitation.firstName} {invitation.lastName}
                    </h4>
                    <Badge
                      variant={
                        invitation.status === "pending"
                          ? "default"
                          : invitation.status === "expired"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {invitation.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {invitation.email} • Role: {invitation.invitedRole}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Invited:{" "}
                    {new Date(invitation.invitedAt).toLocaleDateString()} •
                    Expires:{" "}
                    {new Date(invitation.expiresAt).toLocaleDateString()}
                    {invitation.invitedByUser && (
                      <> • By: {invitation.invitedByUser.name}</>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
