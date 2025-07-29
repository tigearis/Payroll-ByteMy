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
import { 
  getInvitationFlowState, 
  getInvitationRedirectAction, 
  logInvitationFlow 
} from "@/lib/invitation-utils";

type InvitationStatus = "loading" | "ready" | "accepting" | "success" | "error" | "invalid";

function AcceptInvitationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoaded: userLoaded } = useUser();
  
  const ticket = searchParams.get("__clerk_ticket");
  const [status, setStatus] = useState<InvitationStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [_invitation, setInvitation] = useState<unknown>(null);
  
  // Email conflict detection
  const [emailConflictDetected, setEmailConflictDetected] = useState(false);

  // Check invitation validity when component loads
  useEffect(() => {
    if (!ticket) {
      setStatus("invalid");
      setError("No invitation ticket provided");
      return;
    }

    if (userLoaded) {
      if (user) {
        // User is authenticated, ready to accept invitation
        setStatus("ready");
        
        // Log the authenticated state
        const searchParams = new URLSearchParams(window.location.search);
        const invitationState = getInvitationFlowState(searchParams);
        logInvitationFlow("accept-invitation-authenticated", invitationState, {
          userId: user.id,
          userEmail: user.emailAddresses[0]?.emailAddress,
        });
      } else {
        // User not authenticated - handle invitation flow redirect
        const searchParams = new URLSearchParams(window.location.search);
        const invitationState = getInvitationFlowState(searchParams);
        
        logInvitationFlow("accept-invitation-unauthenticated", invitationState);
        
        if (invitationState.hasTicket && invitationState.ticketData) {
          const redirectAction = getInvitationRedirectAction(
            invitationState.ticketData,
            window.location.href
          );
          
          console.log("🔄 Handling invitation redirect:", redirectAction);
          
          switch (redirectAction.action) {
            case 'redirect_sign_up':
              console.log("✅ Redirecting to sign-up for new user invitation");
              window.location.href = redirectAction.redirectUrl!;
              break;
              
            case 'redirect_sign_in':
              console.log("✅ Redirecting to sign-in for existing user invitation");
              window.location.href = redirectAction.redirectUrl!;
              break;
              
            case 'already_complete':
              console.log("ℹ️ Invitation already complete, user should be signed in");
              // This shouldn't happen if user is not authenticated, but handle gracefully
              setStatus("error");
              setError("Invitation was already completed but user is not signed in");
              break;
              
            default:
              console.warn("⚠️ Unknown invitation redirect action, falling back to sign-up");
              window.location.href = `/sign-up?redirect_url=${encodeURIComponent(window.location.href)}`;
          }
        } else {
          // No valid ticket, fall back to basic sign-up
          console.log("⚠️ No valid invitation ticket, redirecting to basic sign-up");
          window.location.href = `/sign-up?redirect_url=${encodeURIComponent(window.location.href)}`;
        }
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
        // Check if this is an email conflict error
        const errorMessage = result.error || "Failed to accept invitation";
        const isEmailConflict = errorMessage.toLowerCase().includes('email') && 
                               (errorMessage.toLowerCase().includes('already') || 
                                errorMessage.toLowerCase().includes('exist') ||
                                errorMessage.toLowerCase().includes('use'));
        
        if (isEmailConflict) {
          setEmailConflictDetected(true);
          console.log("🔍 Email conflict detected during invitation acceptance");
        }
        
        setStatus("error");
        setError(errorMessage);
        toast.error("Failed to accept invitation", {
          description: errorMessage,
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
          description: "You've been invited to join the team. Click below to accept your invitation.",
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
                {emailConflictDetected ? (
                  <>
                    <div className="p-3 bg-blue-100 rounded text-sm text-blue-800 mb-3">
                      <strong>Email Conflict:</strong> This email might already be associated with a different account.
                    </div>
                    <Button 
                      onClick={() => {
                        // Clear current session and try signing in
                        window.location.href = `/sign-in?redirect_url=${encodeURIComponent(window.location.href)}`;
                      }}
                      className="w-full"
                    >
                      Sign In with Existing Account
                    </Button>
                    <Button 
                      onClick={() => window.location.reload()} 
                      variant="outline" 
                      className="w-full"
                    >
                      Try Again
                    </Button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
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