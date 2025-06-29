"use client";

import { useSignUp, useUser } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
import * as React from "react";
import { Suspense, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInvitationAcceptance } from "@/domains/auth/hooks/use-invitation-acceptance";

interface InvitationData {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  organizationId?: string;
  [key: string]: unknown;
}

function AcceptInvitationContent() {
  const { user } = useUser();
  const router = useRouter();
  const { isLoaded: _isLoaded, signUp: _signUp, setActive: _setActive } = useSignUp();
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, _setIsLoading] = React.useState(false);
  const [, setInvitationData] = React.useState<InvitationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<{ id: string; invitedRole: string } | null>(null);
  const [acceptanceStep, setAcceptanceStep] = useState<
    "loading" | "form" | "accepting" | "success"
  >("loading");

  const { acceptInvitation, getInvitationByTicket } = useInvitationAcceptance();

  // Handle signed-in users visiting this page
  React.useEffect(() => {
    if (user?.id) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Get parameters from the URL
  const searchParams = useSearchParams();
  const ticket = searchParams.get("ticket");
  const prefilledFirstName = searchParams.get("firstName");
  const prefilledLastName = searchParams.get("lastName");

  // Initialize form fields with prefilled values
  React.useEffect(() => {
    if (prefilledFirstName) {
      setFirstName(prefilledFirstName);
    }
    if (prefilledLastName) {
      setLastName(prefilledLastName);
    }
  }, [prefilledFirstName, prefilledLastName]);

  // Get invitation details by ticket
  const {
    data: invitationData,
    loading: _invitationLoading,
    error: invitationError,
  } = getInvitationByTicket(ticket || "");

  useEffect(() => {
    if (invitationData?.userInvitations?.[0]) {
      setInvitation(invitationData.userInvitations[0]);
      setAcceptanceStep("form");
    } else if (invitationError) {
      setError("Invalid or expired invitation");
      setAcceptanceStep("form");
    }
  }, [invitationData, invitationError]);

  // Extract invitation metadata from JWT token
  React.useEffect(() => {
    if (ticket) {
      // Log invitation acceptance page visit for debugging
      console.log("Invitation acceptance attempt", {
        eventType: "signup_attempt",
        authMethod: "invitation_ticket",
        page: "accept_invitation",
        hasInvitationToken: true,
      });

      try {
        // Validate that the token has the expected JWT format (3 parts separated by dots)
        const tokenParts = ticket.split(".");
        if (tokenParts.length !== 3) {
          console.error(
            "Invalid JWT token format - expected 3 parts, got:",
            tokenParts.length
          );
          return;
        }

        // Get the payload part (second part of JWT)
        const payloadPart = tokenParts[1];

        // Add padding if needed for base64 decoding
        const paddedPayload =
          payloadPart + "=".repeat((4 - (payloadPart.length % 4)) % 4);

        // Try to decode the JWT token to get invitation metadata
        const payload = JSON.parse(atob(paddedPayload));
        console.log("Invitation payload:", payload);

        // Set the invitation data for potential future use
        setInvitationData(payload);

        // For now, we'll need to fetch the actual invitation details from Clerk
        // since the JWT might not contain the metadata directly
      } catch (error) {
        console.error("Error decoding invitation token:", error);
        console.error("Token value:", ticket);
        // Don't block the user flow if token decoding fails
        // The actual invitation processing will happen in Clerk
      }
    }
  }, [ticket]);

  // If there is no invitation token, restrict access to this page
  if (!ticket) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid Invitation</CardTitle>
            <CardDescription>
              No invitation token found. Please use a valid invitation link.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleAcceptInvitation = async () => {
    if (!user || !invitation) return;

    setAcceptanceStep("accepting");
    setError(null);

    try {
      const result = await acceptInvitation({
        invitationId: invitation.id,
        clerkUserId: user.id,
        userEmail: user.emailAddresses[0]?.emailAddress || "",
        userName: user.fullName || user.firstName || "User",
        roleId: invitation.invitedRole, // This might need to be mapped to role ID
      });

      if (result.success) {
        setAcceptanceStep("success");
        // Redirect to dashboard after success
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      } else {
        setError("Failed to accept invitation. Please try again.");
        setAcceptanceStep("form");
      }
    } catch (error) {
      console.error("Accept invitation error:", error);
      setError("An error occurred while accepting the invitation.");
      setAcceptanceStep("form");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Registration</CardTitle>
          <CardDescription>
            You&apos;ve been invited to join. Please complete your account
            setup.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {acceptanceStep === "loading" && (
            <div>Loading invitation details...</div>
          )}
          {acceptanceStep === "form" && (
            <form onSubmit={handleAcceptInvitation} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required
                  disabled={!!prefilledFirstName}
                  placeholder={
                    prefilledFirstName ? "" : "Enter your first name"
                  }
                  className={
                    prefilledFirstName ? "bg-gray-100 text-gray-700" : ""
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  required
                  disabled={!!prefilledLastName}
                  placeholder={prefilledLastName ? "" : "Enter your last name"}
                  className={
                    prefilledLastName ? "bg-gray-100 text-gray-700" : ""
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Create a secure password"
                />
              </div>

              <div id="clerk-captcha" />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Accepting Invitation..." : "Accept Invitation"}
              </Button>
            </form>
          )}
          {acceptanceStep === "accepting" && <div>Accepting invitation...</div>}
          {acceptanceStep === "success" && (
            <div>Invitation accepted successfully!</div>
          )}
          {error && <div className="text-red-500">{error}</div>}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AcceptInvitationContent />
    </Suspense>
  );
}
