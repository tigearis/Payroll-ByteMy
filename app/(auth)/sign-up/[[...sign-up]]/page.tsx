"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import { useSignUp, useClerk, useUser } from "@clerk/nextjs";
import { Clock, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { ByteMyLoadingIcon } from "@/components/ui/bytemy-loading-icon";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  getInvitationFlowState, 
  logInvitationFlow 
} from "@/lib/invitation-utils";
import { 
  extractClerkTicketData, 
  isTicketExpired,
  type ClerkTicketUserData 
} from "@/lib/clerk-ticket-utils";

// Custom invitation sign-up form using ticket strategy
interface InvitationSignUpFormProps {
  clerkTicket: string;
  ticketData?: ClerkTicketUserData | undefined;
  onSuccess: () => void;
  onError: (error: any) => void;
}

function InvitationSignUpForm({ clerkTicket, ticketData, onSuccess, onError }: InvitationSignUpFormProps) {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded || !signUp) return;
    if (!clerkTicket) {
      onError(new Error('No invitation token found'));
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('🎫 Creating sign-up with ticket strategy (simplified)');

      // Create a new sign-up with the supplied invitation token
      // After this call, the user's email address will be automatically verified
      const signUpAttempt = await signUp.create({
        strategy: 'ticket',
        ticket: clerkTicket,
        firstName,
        lastName,
        password,
      });

      console.log('Sign-up attempt status:', signUpAttempt.status);

      // If the sign-up was completed, set the session to active
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        onSuccess();
      } else {
        // If the status is not complete, check why. User may need to complete further steps.
        console.error('Sign-up not complete:', JSON.stringify(signUpAttempt, null, 2));
        onError(signUpAttempt);
      }
    } catch (err: any) {
      console.error('Invitation sign-up error:', JSON.stringify(err, null, 2));
      onError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* First Name */}
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          type="text"
          name="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          placeholder="Enter first name"
        />
      </div>

      {/* Last Name */}
      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          type="text"
          name="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          placeholder="Enter last name"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter password"
        />
      </div>

      {/* CAPTCHA placeholder */}
      <div id="clerk-captcha" />

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting || !firstName || !lastName || !password}
      >
        {isSubmitting ? 'Creating Account...' : 'Sign Up'}
      </Button>
    </form>
  );
}

export default function SignUpPage() {
  const { isLoaded, signUp } = useSignUp();
  const { setActive } = useClerk();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();

  // Get the invitation token directly from URL (as per Clerk docs)
  const token = searchParams.get('__clerk_ticket');

  // Handle signed-in users visiting this page
  React.useEffect(() => {
    if (user?.id) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Simple check for invitation flow
  const hasInvitationToken = !!token;
  
  // State for invitation ticket handling (keep for backward compatibility)
  const [invitationState, setInvitationState] = useState(getInvitationFlowState(searchParams));
  
  // State for ticket validation
  const [ticketValidation, setTicketValidation] = useState<{
    isValid: boolean;
    isExpired: boolean;
    userData?: ClerkTicketUserData;
    error?: string;
    validatedAt?: Date;
  }>({
    isValid: true,
    isExpired: false
  });

  // Centralized loading state management
  const [isInitializing, setIsInitializing] = useState(true);
  const [isTicketValidating, setIsTicketValidating] = useState(false);
  
  // Email conflict error recovery
  const [emailConflictError, setEmailConflictError] = useState<{
    hasConflict: boolean;
    email?: string;
    suggestedAction?: 'sign_in' | 'different_email';
    message?: string;
  }>({
    hasConflict: false
  });
  

  // Email conflict detection utility
  const detectEmailConflict = useCallback((error: any): boolean => {
    if (!error) return false;
    
    // Check for Clerk email conflict error codes
    const errorCode = error.code || error.type || '';
    const errorMessage = error.message || error.toString() || '';
    
    // Known Clerk email conflict patterns
    const emailConflictPatterns = [
      'email_address_unavailable',
      'identifier_already_exists',
      'form_identifier_exists',
      'email_address_exists',
      'identifier_not_allowed_creation',
      'not_allowed_access',
      'email.*already.*use',
      'email.*taken',
      'email.*exist',
      'identifier.*exist',
      'already.*in.*use',
      'multiple.*accounts.*same.*email'
    ];
    
    return emailConflictPatterns.some(pattern => 
      errorCode.toLowerCase().includes(pattern.toLowerCase()) ||
      errorMessage.toLowerCase().match(new RegExp(pattern, 'i'))
    );
  }, []);

  // Handle email conflict error recovery
  const handleEmailConflictError = useCallback((error: any, email?: string) => {
    if (!detectEmailConflict(error)) return false;
    
    console.log("🔍 Email conflict detected:", { 
      error: error.message || error,
      email,
      errorCode: error.code || error.type 
    });
    
    setEmailConflictError({
      hasConflict: true,
      ...(email && { email }),
      suggestedAction: invitationState.hasTicket ? 'sign_in' : 'different_email',
      message: invitationState.hasTicket 
        ? `This email is already associated with an existing account. Please sign in to accept your invitation.`
        : `This email is already in use. Please try a different email address or sign in to your existing account.`
    });
    
    return true; // Indicates the error was handled
  }, [invitationState.hasTicket, detectEmailConflict]);

  // Simplified ticket validation without timeouts
  useEffect(() => {
    const validateTicket = async () => {
      setIsTicketValidating(true);
      setIsInitializing(true);
      
      const newInvitationState = getInvitationFlowState(searchParams);
      setInvitationState(newInvitationState);
      
      // Perform comprehensive ticket validation for invitation flows
      if (newInvitationState.hasTicket && newInvitationState.ticketData?.ticket) {
        console.log("🎫 Validating invitation ticket before form render...");
        
        try {
          // Add small delay to prevent UI flashing
          await new Promise(resolve => setTimeout(resolve, 100));
          
          const validation = extractClerkTicketData(newInvitationState.ticketData.ticket);
          const validationResult = {
            isValid: validation.isValid,
            isExpired: validation.isValid && validation.userData ? isTicketExpired(validation.userData) : false,
            ...(validation.userData && { userData: validation.userData }),
            ...(validation.error && { error: validation.error }),
            validatedAt: new Date()
          };
          
          console.log("🔍 Ticket validation result:", {
            isValid: validationResult.isValid,
            isExpired: validationResult.isExpired,
            hasUserData: !!validationResult.userData,
            email: validationResult.userData?.email,
            firstName: validationResult.userData?.firstName,
            lastName: validationResult.userData?.lastName,
            invitationId: validationResult.userData?.invitationId,
            error: validationResult.error
          });
          
          setTicketValidation(validationResult);
          
          // Log validation outcome
          if (!validationResult.isValid) {
            console.error("❌ Ticket validation failed:", validationResult.error);
          } else if (validationResult.isExpired) {
            console.warn("⚠️ Ticket has expired");
          } else {
            console.log("✅ Ticket validation passed");
          }
        } catch (error) {
          console.error("❌ Ticket validation error:", error);
          setTicketValidation({
            isValid: false,
            isExpired: false,
            error: "Validation failed unexpectedly"
          });
        }
      } else {
        // No ticket, reset validation state
        setTicketValidation({
          isValid: true,
          isExpired: false
        });
      }
      
      // Clear loading states
      setIsTicketValidating(false);
      setIsInitializing(false);
    };

    validateTicket().catch(console.error);
  }, [searchParams]);

  // Separate effect for Clerk state logging and initialization completion
  useEffect(() => {
    if (isLoaded && !isTicketValidating) {
      console.log("🔍 SignUp Page State:", {
        isLoaded,
        signUpExists: !!signUp,
        signUpStatus: signUp?.status,
        step: signUp?.status,
        verifications: signUp ? Object.keys(signUp.verifications) : [],
        hasInvitationTicket: invitationState.hasTicket,
        shouldUseTicketStrategy: invitationState.shouldUseTicketStrategy,
        ticketValid: ticketValidation.isValid,
        ticketExpired: ticketValidation.isExpired,
        isInitializing,
        isTicketValidating
      });
      
      logInvitationFlow("sign-up-page-loaded", invitationState);
      
      // Mark initialization as complete when both Clerk and ticket validation are done
      if (isInitializing) {
        setIsInitializing(false);
      }
    }
  }, [isLoaded, signUp, invitationState, ticketValidation, isTicketValidating, isInitializing]);

  // Monitor sign-up errors for email conflicts
  useEffect(() => {
    if (isLoaded && signUp) {
      // Check for email address verification errors
      const emailVerification = signUp.verifications?.emailAddress;
      if (emailVerification?.error) {
        const emailFromForm = signUp.emailAddress;
        if (handleEmailConflictError(emailVerification.error, emailFromForm || undefined)) {
          console.log("🔄 Email conflict handled during verification");
        }
      }
      
      // Check for general sign-up errors
      if (signUp.status === "missing_requirements") {
        // Look for errors in attempts if they exist
        const attemptErrors = (signUp as any).attempts?.map((attempt: any) => attempt.error).filter(Boolean);
        if (attemptErrors && attemptErrors.length > 0) {
          const emailFromForm = signUp.emailAddress;
          attemptErrors.forEach((error: any) => {
            if (handleEmailConflictError(error, emailFromForm || undefined)) {
              console.log("🔄 Email conflict handled during sign-up attempt");
            }
          });
        }
      }
    }
  }, [isLoaded, signUp, handleEmailConflictError]);

  // Monitor sign-up completion status and handle invitation redirects
  useEffect(() => {
    if (isLoaded && signUp) {
      if (signUp.status === "complete") {
        console.log("Sign-up completed", {
          signUpId: signUp.id,
          authFlow: "clerk_elements",
          method: invitationState.hasTicket ? "invitation_ticket" : "email_password",
          verificationStatus: signUp.verifications.emailAddress?.status,
          hasInvitationTicket: invitationState.hasTicket,
        });
        
        // If this was an invitation flow, redirect back to accept invitation
        if (invitationState.hasTicket) {
          const redirectUrl = searchParams.get('redirect_url');
          console.log("🎉 Invitation sign-up completed, redirecting back to invitation");
          
          if (redirectUrl) {
            window.location.href = redirectUrl;
          } else {
            router.push('/accept-invitation');
          }
        }
      }
    }
  }, [isLoaded, signUp, invitationState.hasTicket, searchParams, router]);

  // Handle Google OAuth signup
  const handleGoogleSignUp = async () => {
    console.log("Google OAuth sign-up attempt", {
      authFlow: "oauth_redirect",
      provider: "google",
      page: "signup",
    });
  };

  // Removed custom ticket strategy - Clerk Elements handles this automatically

  // Handle form submission logging
  const handleFormSubmit = useCallback(async (_e: React.FormEvent) => {
    try {
      console.log("Email sign-up attempt", {
        authFlow: "clerk_elements",
        method: "email_password",
        page: "signup",
      });
    } catch (error) {
      // Log signup failure for debugging
      console.error("Sign-up failed", {
        authFlow: "clerk_elements",
        page: "signup",
        error: error instanceof Error ? error.message : "Unknown signup error",
      });
    }
  }, []);

  return (
    <div className="grid w-full grow items-center px-4 sm:justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          {/* ByteMy Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/bytemy-payroll-logo.png"
              alt="ByteMy Logo"
              width={300}
              height={90}
              priority
              className="h-20 w-auto"
            />
          </div>

          <p className="mt-2 text-sm text-gray-600">
            Create your account to get started
          </p>
          
          {/* Debug Info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs space-y-1">
              <div>Debug: Loaded={isLoaded ? 'Yes' : 'No'}, SignUp={signUp ? 'Yes' : 'No'}, Status={signUp?.status || 'None'}</div>
              <div>Loading: Init={isInitializing ? 'Yes' : 'No'}, TicketValidating={isTicketValidating ? 'Yes' : 'No'}</div>
              <div>Ticket: HasTicket={invitationState.hasTicket ? 'Yes' : 'No'}, Valid={ticketValidation.isValid ? 'Yes' : 'No'}, Expired={ticketValidation.isExpired ? 'Yes' : 'No'}</div>
              {false && (
                <div className="text-orange-600 font-semibold">⏰ Timeout Protection Activated</div>
              )}
              {ticketValidation.userData && (
                <div>UserData: Email={ticketValidation.userData.email || 'None'}, Name={ticketValidation.userData.firstName || 'None'} {ticketValidation.userData.lastName || ''}</div>
              )}
              {ticketValidation.error && (
                <div className="text-red-600">Error: {ticketValidation.error}</div>
              )}
            </div>
          )}
        </div>

        {/* Timeout Warning */}
        {false && (
          <Card className="w-full border-orange-200 bg-orange-50 mb-4">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Loading Taking Longer Than Expected
              </CardTitle>
              <CardDescription className="text-orange-700">
                The page is taking longer to load than usual. You can still continue, but some features might be limited.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline"
                onClick={() => {
                  // Timeout reset removed
                  window.location.reload();
                }}
                className="w-full"
              >
                Refresh Page
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Email Conflict Error Recovery */}
        {emailConflictError.hasConflict && (
          <Card className="w-full border-blue-200 bg-blue-50 mb-4">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center">
                <AlertCircle className="mr-2 h-5 w-5" />
                Email Already in Use
              </CardTitle>
              <CardDescription className="text-blue-700">
                {emailConflictError.message}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {emailConflictError.email && (
                <div className="p-3 bg-blue-100 rounded text-sm text-blue-800">
                  <strong>Email:</strong> {emailConflictError.email}
                </div>
              )}
              
              <div className="flex flex-col space-y-2">
                {emailConflictError.suggestedAction === 'sign_in' ? (
                  <>
                    <Button 
                      onClick={() => {
                        const redirectUrl = window.location.href;
                        router.push(`/sign-in?redirect_url=${encodeURIComponent(redirectUrl)}`);
                      }}
                      className="w-full"
                    >
                      Sign In to Accept Invitation
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setEmailConflictError({ hasConflict: false })}
                      className="w-full"
                    >
                      Try Different Approach
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      onClick={() => router.push('/sign-in')}
                      className="w-full"
                    >
                      Sign In Instead
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setEmailConflictError({ hasConflict: false })}
                      className="w-full"
                    >
                      Use Different Email
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ticket Validation Error Handling */}
        {invitationState.hasTicket && !ticketValidation.isValid && (
          <Card className="w-full border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Invalid Invitation</CardTitle>
              <CardDescription className="text-red-700">
                The invitation link you're using is not valid or has been corrupted.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-red-100 rounded text-sm text-red-800">
                <strong>Error:</strong> {ticketValidation.error}
              </div>
              <div className="text-sm text-red-700">
                Please check that you're using the correct invitation link, or contact the person who invited you for a new invitation.
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                  className="flex-1"
                >
                  Try Again
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/')}
                  className="flex-1"
                >
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {invitationState.hasTicket && ticketValidation.isValid && ticketValidation.isExpired && (
          <Card className="w-full border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800">Invitation Expired</CardTitle>
              <CardDescription className="text-orange-700">
                This invitation link has expired and can no longer be used.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-orange-700">
                Invitation links typically expire after a certain period for security reasons. 
                Please contact the person who invited you to request a new invitation.
              </div>
              {ticketValidation.validatedAt && (
                <div className="text-xs text-orange-600">
                  Checked at: {ticketValidation.validatedAt.toLocaleString()}
                </div>
              )}
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/')}
                  className="flex-1"
                >
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Show form only if no ticket or ticket is valid and not expired */}
        {(!invitationState.hasTicket || (ticketValidation.isValid && !ticketValidation.isExpired)) && (
          <>
            {/* For invitation flows, use simple ticket strategy */}
            {hasInvitationToken ? (
              
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Complete Your Invitation</CardTitle>
                    <CardDescription>
                      You've been invited to join! Fill out your details below.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <InvitationSignUpForm 
                      clerkTicket={token}
                      ticketData={ticketValidation.userData}
                      onSuccess={() => router.push('/dashboard')}
                      onError={(error) => {
                        console.error('Invitation sign-up error:', error);
                      }}
                    />
                  </CardContent>
                </Card>
              
            ) : (
              <SignUp.Root fallback={
          <Card className="w-full">
            <CardHeader>
              <CardTitle>
                {isTicketValidating ? "Validating Invitation..." : "Loading..."}
              </CardTitle>
              <CardDescription>
                {isTicketValidating 
                  ? "Checking your invitation details..."
                  : "Initializing sign-up form..."
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ByteMyLoadingIcon 
                title={isTicketValidating ? "Validating invitation ticket" : "Setting up account creation"}
                description={isTicketValidating ? "Please wait while we verify your invitation" : "Please wait while we prepare the form"}
                size="lg"
              />
            </CardContent>
          </Card>
        }>
          <Clerk.Loading>
            {(isGlobalLoading: boolean) => (
              <>
                <SignUp.Step name="start">
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>
                        {invitationState.hasTicket ? "Complete Your Invitation" : "Create your account"}
                      </CardTitle>
                      <CardDescription>
                        {invitationState.hasTicket 
                          ? "You've been invited to join the team. Complete your account setup below."
                          : "Welcome! Please fill in the details to get started."
                        }
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-y-4">
                      {/* CAPTCHA Widget - Clerk Elements will use this automatically */}
                      <SignUp.Captcha />

                      {/* Social Sign-up Buttons */}
                      {!invitationState.hasTicket && (
                        <>
                          <div className="grid gap-2">
                            <Clerk.Connection name="google" asChild>
                              <Button
                                variant="outline"
                                type="button"
                                disabled={isGlobalLoading || isInitializing || isTicketValidating}
                                onClick={handleGoogleSignUp}
                              >
                                <Clerk.Loading>
                                  {(isLoading: boolean) => {
                                    const showLoading = isLoading || isGlobalLoading || isInitializing || isTicketValidating;
                                    return showLoading ? (
                                      <>
                                        <ByteMyLoadingIcon size="sm" title="Connecting..." />
                                        <span className="ml-2">Connecting...</span>
                                      </>
                                    ) : (
                                      <>
                                        <Icons.google className="mr-2 h-4 w-4" />
                                        Continue with Google
                                      </>
                                    );
                                  }}
                                </Clerk.Loading>
                              </Button>
                            </Clerk.Connection>
                          </div>

                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                              <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                              </span>
                            </div>
                          </div>
                        </>
                      )}

                      {/* First Name - conditional rendering based on ticket data */}
                      {(!invitationState.hasTicket || !ticketValidation.userData?.firstName) && (
                        <Clerk.Field name="firstName" className="space-y-2">
                          <Clerk.Label asChild>
                            <Label>First name</Label>
                          </Clerk.Label>
                          <Clerk.Input type="text" required asChild>
                            <Input />
                          </Clerk.Input>
                          <Clerk.FieldError className="block text-sm text-destructive" />
                        </Clerk.Field>
                      )}

                      {/* Show first name from ticket if available */}
                      {invitationState.hasTicket && ticketValidation.userData?.firstName && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">First name</Label>
                          <div className="px-3 py-2 bg-gray-50 border rounded-md text-sm text-gray-700">
                            {ticketValidation.userData.firstName}
                            <span className="ml-2 text-xs text-green-600">✓ From invitation</span>
                          </div>
                        </div>
                      )}

                      {/* Last Name - conditional rendering based on ticket data */}
                      {(!invitationState.hasTicket || !ticketValidation.userData?.lastName) && (
                        <Clerk.Field name="lastName" className="space-y-2">
                          <Clerk.Label asChild>
                            <Label>Last name</Label>
                          </Clerk.Label>
                          <Clerk.Input type="text" required asChild>
                            <Input />
                          </Clerk.Input>
                          <Clerk.FieldError className="block text-sm text-destructive" />
                        </Clerk.Field>
                      )}

                      {/* Show last name from ticket if available */}
                      {invitationState.hasTicket && ticketValidation.userData?.lastName && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Last name</Label>
                          <div className="px-3 py-2 bg-gray-50 border rounded-md text-sm text-gray-700">
                            {ticketValidation.userData.lastName}
                            <span className="ml-2 text-xs text-green-600">✓ From invitation</span>
                          </div>
                        </div>
                      )}

                      {/* Email Input - only show if no invitation ticket (Clerk auto-fills from ticket) */}
                      {!invitationState.hasTicket && (
                        <Clerk.Field name="emailAddress" className="space-y-2">
                          <Clerk.Label asChild>
                            <Label>Email address</Label>
                          </Clerk.Label>
                          <Clerk.Input type="email" required asChild>
                            <Input />
                          </Clerk.Input>
                          <Clerk.FieldError className="block text-sm text-destructive" />
                        </Clerk.Field>
                      )}

                      {/* Show email info for invitation users */}
                      {invitationState.hasTicket && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Email address</Label>
                          <div className="px-3 py-2 bg-gray-50 border rounded-md text-sm text-gray-700">
                            {ticketValidation.userData?.email || "Pre-filled from invitation"}
                            <span className="ml-2 text-xs text-green-600">✓ From invitation</span>
                          </div>
                        </div>
                      )}

                      {/* Password Input - Always required */}
                      <Clerk.Field name="password" className="space-y-2">
                        <Clerk.Label asChild>
                          <Label>
                            Password
                            <span className="text-red-500">*</span>
                          </Label>
                        </Clerk.Label>
                        <Clerk.Input 
                          type="password" 
                          required 
                          asChild
                        >
                          <Input placeholder="Enter a secure password" />
                        </Clerk.Input>
                        <Clerk.FieldError className="block text-sm text-destructive" />
                      </Clerk.Field>
                    </CardContent>
                    <CardFooter>
                      <div className="grid w-full gap-y-4">
                        <SignUp.Action submit asChild>
                          <Button
                            disabled={isGlobalLoading || isInitializing || isTicketValidating}
                            onClick={handleFormSubmit}
                          >
                            <Clerk.Loading>
                              {(isLoading: boolean) => {
                                const showLoading = isLoading || isGlobalLoading || isInitializing || isTicketValidating;
                                return showLoading ? (
                                  <ByteMyLoadingIcon
                                    title={isTicketValidating ? "Validating..." : "Creating account..."}
                                    size="default"
                                  />
                                ) : (
                                  "Create Account"
                                );
                              }}
                            </Clerk.Loading>
                          </Button>
                        </SignUp.Action>

                        {!invitationState.hasTicket && (
                          <Button variant="link" size="sm" asChild>
                            <Link href="/sign-in">
                              Already have an account? Sign in
                            </Link>
                          </Button>
                        )}
                        
                        {invitationState.hasTicket && (
                          <p className="text-sm text-gray-600 text-center">
                            Your email will be automatically verified as part of the invitation process.
                          </p>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                </SignUp.Step>

                {/* Email Verification Step */}
                <SignUp.Step name="verifications">
                  <SignUp.Strategy name="email_code">
                    <Card className="w-full">
                      <CardHeader>
                        <CardTitle>Verify your email</CardTitle>
                        <CardDescription>
                          We sent a verification code to your email address. Please enter it below.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-y-4">
                        <Clerk.Field name="code" className="space-y-2">
                          <Clerk.Label asChild>
                            <Label>Verification Code</Label>
                          </Clerk.Label>
                          <Clerk.Input type="otp" required asChild>
                            <Input placeholder="Enter verification code" />
                          </Clerk.Input>
                          <Clerk.FieldError className="block text-sm text-destructive" />
                        </Clerk.Field>
                      </CardContent>
                      <CardFooter>
                        <div className="grid w-full gap-y-4">
                          <SignUp.Action submit asChild>
                            <Button disabled={isGlobalLoading || isInitializing}>
                              <Clerk.Loading>
                                {(isLoading: boolean) => {
                                  const showLoading = isLoading || isGlobalLoading || isInitializing;
                                  return showLoading ? (
                                    <ByteMyLoadingIcon
                                      title="Verifying..."
                                      size="default"
                                    />
                                  ) : (
                                    "Verify Email"
                                  );
                                }}
                              </Clerk.Loading>
                            </Button>
                          </SignUp.Action>

                          <SignUp.Action resend asChild>
                            <Button variant="link" size="sm" disabled={isGlobalLoading || isInitializing}>
                              <Clerk.Loading>
                                {(isLoading: boolean) => {
                                  const showLoading = isLoading || isGlobalLoading || isInitializing;
                                  return showLoading ? "Sending..." : "Didn't receive a code? Resend";
                                }}
                              </Clerk.Loading>
                            </Button>
                          </SignUp.Action>
                        </div>
                      </CardFooter>
                    </Card>
                  </SignUp.Strategy>
                </SignUp.Step>

                {/* Continue Step (if needed) */}
                <SignUp.Step name="continue">
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>Complete your profile</CardTitle>
                      <CardDescription>
                        Please provide any additional information needed.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-y-4">
                      {/* Additional fields will be rendered here by Clerk if needed */}
                      <div className="text-center text-sm text-muted-foreground">
                        Completing your account setup...
                      </div>
                    </CardContent>
                    <CardFooter>
                      <SignUp.Action submit asChild>
                        <Button disabled={isGlobalLoading || isInitializing} className="w-full">
                          <Clerk.Loading>
                            {(isLoading: boolean) => {
                              const showLoading = isLoading || isGlobalLoading || isInitializing;
                              return showLoading ? (
                                <ByteMyLoadingIcon
                                  title="Finishing setup..."
                                  size="default"
                                />
                              ) : (
                                "Complete Sign Up"
                              );
                            }}
                          </Clerk.Loading>
                        </Button>
                      </SignUp.Action>
                    </CardFooter>
                  </Card>
                </SignUp.Step>
              </>
            )}
          </Clerk.Loading>
        </SignUp.Root>
            )}
          </>
        )}
      </div>
    </div>
  );
}
