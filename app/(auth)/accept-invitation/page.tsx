"use client";

import { useUser } from "@clerk/nextjs";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ByteMySpinner } from "@/components/ui/bytemy-loading-icon";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type InvitationStatus = "loading" | "ready" | "accepting" | "success" | "error" | "invalid";

function AcceptInvitationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoaded: userLoaded } = useUser();
  
  const ticket = searchParams.get("ticket");
  const [status, setStatus] = useState<InvitationStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [_invitation, setInvitation] = useState<unknown>(null);

  // Check invitation validity when component loads
  useEffect(() => {
    if (!ticket) {
      setStatus("invalid");
      setError("No invitation ticket provided");
      return;
    }

    if (userLoaded) {
      if (user) {
        setStatus("ready");
      } else {
        // Redirect to sign-in with return URL
        window.location.href = `/sign-in?redirect_url=${encodeURIComponent(window.location.href)}`;
      }
    }
  }, [ticket, user, userLoaded]);

  const acceptInvitation = async () => {
    if (!user || !ticket) return;

    setStatus("accepting");
    
    try {
      const response = await fetch("/api/invitations/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkTicket: ticket,
          clerkUserId: user.id,
          userEmail: user.emailAddresses[0]?.emailAddress,
          userName: user.fullName || `${user.firstName} ${user.lastName}`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus("success");
        setInvitation(result.invitation);
        toast.success("Welcome to the team!", {
          description: result.message,
        });
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setStatus("error");
        setError(result.error || "Failed to accept invitation");
        toast.error("Failed to accept invitation", {
          description: result.error,
        });
      }
    } catch (_err: unknown) {
      setStatus("error");
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred", {
        description: "Please try again or contact support",
      });
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return <ByteMySpinner size="default" />;
      case "ready":
        return <Clock className="h-8 w-8 text-blue-500" />;
      case "accepting":
        return <ByteMySpinner size="default" />;
      case "success":
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case "error":
        return <XCircle className="h-8 w-8 text-red-500" />;
      case "invalid":
        return <AlertCircle className="h-8 w-8 text-orange-500" />;
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case "loading":
        return {
          title: "Loading...",
          description: "Validating your invitation",
        };
      case "ready":
        return {
          title: "Accept Invitation",
          description: "You've been invited to join the team. Click below to accept your invitation and create your account.",
        };
      case "accepting":
        return {
          title: "Accepting Invitation...",
          description: "Setting up your account and assigning permissions",
        };
      case "success":
        return {
          title: "Welcome to the Team!",
          description: "Your invitation has been accepted successfully. You'll be redirected to the dashboard shortly.",
        };
      case "error":
        return {
          title: "Invitation Error",
          description: error || "There was a problem accepting your invitation",
        };
      case "invalid":
        return {
          title: "Invalid Invitation",
          description: error || "This invitation link is not valid",
        };
      default:
        return {
          title: "Unknown Status",
          description: "Please refresh the page and try again",
        };
    }
  };

  const { title, description } = getStatusMessage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ticket && (
              <div className="text-xs text-gray-500 text-center">
                Invitation ID: {ticket.substring(0, 8)}...
              </div>
            )}
            
            {status === "ready" && (
              <Button 
                onClick={acceptInvitation} 
                className="w-full"
                size="lg"
              >
                Accept Invitation
              </Button>
            )}
            
            {status === "error" && (
              <div className="space-y-2">
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline" 
                  className="w-full"
                >
                  Try Again
                </Button>
                <Button 
                  onClick={() => router.push("/")} 
                  variant="ghost" 
                  className="w-full"
                >
                  Go Home
                </Button>
              </div>
            )}
            
            {status === "invalid" && (
              <Button 
                onClick={() => router.push("/")} 
                variant="outline" 
                className="w-full"
              >
                Go Home
              </Button>
            )}
          </div>
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