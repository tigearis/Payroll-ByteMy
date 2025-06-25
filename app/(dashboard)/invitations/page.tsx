// app/(dashboard)/invitations/page.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { InvitationManagementTable } from "@/components/invitations/invitation-management-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, AlertTriangle, UserCheck, Send, HelpCircle } from "lucide-react";

export default function InvitationsPage() {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role as string || "consultant";

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Invitations</h1>
          <p className="text-muted-foreground">
            Manage and resend team member invitations
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invitations</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Loading...</div>
            <p className="text-xs text-muted-foreground">Awaiting acceptance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Loading...</div>
            <p className="text-xs text-muted-foreground">Need to be resent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Loading...</div>
            <p className="text-xs text-muted-foreground">Successfully joined</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Loading...</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Management Table */}
      <InvitationManagementTable view="pending" />

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Invitation Management Help
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Resending Invitations</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Pending and expired invitations can be resent</li>
                <li>• Original invitation link will be cancelled</li>
                <li>• New expiration date will be set</li>
                <li>• All actions are logged for audit purposes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Permission Levels</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Consultant:</strong> View own invitation status</li>
                <li>• <strong>Manager:</strong> Resend own sent invitations</li>
                <li>• <strong>Org Admin:</strong> Manage all invitations</li>
                <li>• <strong>Developer:</strong> Full access + cleanup tools</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}