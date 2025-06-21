"use client";

import { useSignUp, useUser } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
import * as React from "react";
import { Suspense } from "react";
import { toast } from "sonner";

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
  const { isLoaded, signUp, setActive } = useSignUp();
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [, setInvitationData] =
    React.useState<InvitationData | null>(null);

  // Handle signed-in users visiting this page
  React.useEffect(() => {
    if (user?.id) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Get parameters from the URL
  const searchParams = useSearchParams();
  const token = searchParams.get("__clerk_ticket");
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

  // Extract invitation metadata from JWT token
  React.useEffect(() => {
    if (token) {
      try {
        // Validate that the token has the expected JWT format (3 parts separated by dots)
        const tokenParts = token.split(".");
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
        console.error("Token value:", token);
        // Don't block the user flow if token decoding fails
        // The actual invitation processing will happen in Clerk
      }
    }
  }, [token]);

  // If there is no invitation token, restrict access to this page
  if (!token) {
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

  // Handle submission of the sign-up form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isLoaded) {
      return;
    }

    try {
      if (!token) {
        return;
      }

      // Create a new sign-up with the supplied invitation token.
      // The ticket strategy automatically verifies the email address.
      const signUpAttempt = await signUp.create({
        strategy: "ticket",
        ticket: token,
        firstName,
        lastName,
        password,
      });

      // If the sign-up was completed, set the session to active
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });

        // Mark onboarding as complete in user metadata
        try {
          const response = await fetch("/api/auth/complete-onboarding", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              invitationToken: token,
              completedAt: new Date().toISOString(),
            }),
          });

          if (response.ok) {
            console.log("✅ Onboarding marked as complete");
          } else {
            console.warn("⚠️ Failed to mark onboarding as complete");
          }
        } catch (onboardingError) {
          console.error(
            "❌ Error updating onboarding status:",
            onboardingError
          );
        }

        toast.success("Account created successfully!");
        router.push("/dashboard");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error("Sign-up not complete:", signUpAttempt);
        toast.error("Sign-up could not be completed. Please try again.");
      }
    } catch (err: unknown) {
      console.error("Sign-up error:", err);
      const errorMessage =
        err && typeof err === "object" && "errors" in err
          ? (err as { errors?: Array<{ message?: string }> }).errors?.[0]
              ?.message
          : "An error occurred during sign-up";
      toast.error(errorMessage || "An error occurred during sign-up");
    } finally {
      setIsLoading(false);
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={!!prefilledFirstName}
                placeholder={prefilledFirstName ? "" : "Enter your first name"}
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
                onChange={(e) => setLastName(e.target.value)}
                required
                disabled={!!prefilledLastName}
                placeholder={prefilledLastName ? "" : "Enter your last name"}
                className={prefilledLastName ? "bg-gray-100 text-gray-700" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Create a secure password"
              />
            </div>

            <div id="clerk-captcha" />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Complete Registration"}
            </Button>
          </form>
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
