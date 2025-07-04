"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import { useSignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
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

export default function SignUpPage() {
  const { isLoaded, signUp } = useSignUp();

  // Monitor sign-up completion status for debugging
  useEffect(() => {
    if (isLoaded && signUp) {
      if (signUp.status === "complete") {
        // Log successful signup for debugging
        console.log("Sign-up completed", {
          signUpId: signUp.id,
          authFlow: "clerk_elements",
          method: "email_password",
          verificationStatus: signUp.verifications.emailAddress?.status,
        });
      }
    }
  }, [isLoaded, signUp]);

  // Handle Google OAuth signup
  const handleGoogleSignUp = async () => {
    console.log("Google OAuth sign-up attempt", {
      authFlow: "oauth_redirect",
      provider: "google",
      page: "signup",
    });
  };

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
        </div>

        <SignUp.Root fallback={<div>Loading...</div>}>
          <Clerk.Loading>
            {(isGlobalLoading: boolean) => (
              <>
                <SignUp.Step name="start">
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>Create your account</CardTitle>
                      <CardDescription>
                        Welcome! Please fill in the details to get started.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-y-4">
                      {/* Social Sign-up Buttons */}
                      <div className="grid gap-2">
                        <Clerk.Connection name="google" asChild>
                          <Button
                            variant="outline"
                            type="button"
                            disabled={isGlobalLoading}
                            onClick={handleGoogleSignUp}
                          >
                            <Icons.google className="mr-2 h-4 w-4" />
                            Continue with Google
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

                      {/* First Name */}
                      <Clerk.Field name="firstName" className="space-y-2">
                        <Clerk.Label asChild>
                          <Label>First name</Label>
                        </Clerk.Label>
                        <Clerk.Input type="text" required asChild>
                          <Input />
                        </Clerk.Input>
                        <Clerk.FieldError className="block text-sm text-destructive" />
                      </Clerk.Field>

                      {/* Last Name */}
                      <Clerk.Field name="lastName" className="space-y-2">
                        <Clerk.Label asChild>
                          <Label>Last name</Label>
                        </Clerk.Label>
                        <Clerk.Input type="text" required asChild>
                          <Input />
                        </Clerk.Input>
                        <Clerk.FieldError className="block text-sm text-destructive" />
                      </Clerk.Field>

                      {/* Email Input */}
                      <Clerk.Field name="emailAddress" className="space-y-2">
                        <Clerk.Label asChild>
                          <Label>Email address</Label>
                        </Clerk.Label>
                        <Clerk.Input type="email" required asChild>
                          <Input />
                        </Clerk.Input>
                        <Clerk.FieldError className="block text-sm text-destructive" />
                      </Clerk.Field>

                      {/* Password Input */}
                      <Clerk.Field name="password" className="space-y-2">
                        <Clerk.Label asChild>
                          <Label>Password</Label>
                        </Clerk.Label>
                        <Clerk.Input type="password" required asChild>
                          <Input />
                        </Clerk.Input>
                        <Clerk.FieldError className="block text-sm text-destructive" />
                      </Clerk.Field>
                    </CardContent>
                    <CardFooter>
                      <div className="grid w-full gap-y-4">
                        <SignUp.Action submit asChild>
                          <Button
                            disabled={isGlobalLoading}
                            onClick={handleFormSubmit}
                          >
                            <Clerk.Loading>
                              {(isLoading: boolean) => {
                                return isLoading ? (
                                  <Icons.spinner className="size-4 animate-spin" />
                                ) : (
                                  "Create Account"
                                );
                              }}
                            </Clerk.Loading>
                          </Button>
                        </SignUp.Action>

                        <Button variant="link" size="sm" asChild>
                          <Link href="/sign-in">
                            Already have an account? Sign in
                          </Link>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </SignUp.Step>
              </>
            )}
          </Clerk.Loading>
        </SignUp.Root>
      </div>
    </div>
  );
}
