// app/(auth)/sign-in/[[...sign-in]]/page.tsx
"use client";

import { useSignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  console.log("Sign-in page rendered, Clerk loaded:", isLoaded);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) {
      setError("Please wait for the page to load completely.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        // Log successful sign-in for debugging
        console.log("Sign-in completed", {
          email: email,
          sessionId: result.createdSessionId,
          authFlow: "manual_signin",
        });

        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      console.error("Sign-in error:", err);
      const errorMessage =
        err &&
        typeof err === "object" &&
        "errors" in err &&
        Array.isArray((err as { errors?: Array<{ message?: string }> }).errors)
          ? (err as { errors: Array<{ message?: string }> }).errors[0]?.message
          : "Sign-in failed. Please try again.";

      // Log failed sign-in attempt for debugging
      console.error("Sign-in failed", {
        email: email,
        authFlow: "manual_signin",
        error: errorMessage || "Unknown error",
      });

      setError(errorMessage || "Sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isLoaded || !signIn) {
      setError("Please wait for the page to load completely.");
      return;
    }

    setIsLoading(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/dashboard",
        redirectUrlComplete: "/dashboard",
      });

      // Note: OAuth sign-in attempt (success logging will happen after redirect)
      console.log("Google OAuth sign-in attempt", {
        authFlow: "oauth_redirect",
        provider: "google",
      });
    } catch (err: unknown) {
      console.error("Google sign-in error:", err);
      const errorMessage =
        err &&
        typeof err === "object" &&
        "errors" in err &&
        Array.isArray((err as { errors?: Array<{ message?: string }> }).errors)
          ? (err as { errors: Array<{ message?: string }> }).errors[0]?.message
          : "Google sign-in failed. Please try again.";

      // Log failed OAuth attempt for debugging
      console.error("Google OAuth sign-in failed", {
        authFlow: "oauth_redirect",
        error: errorMessage || "Unknown error",
      });

      setError(errorMessage || "Google sign-in failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          {/* ByteMy Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/bytemy-payroll-logo.png"
              alt="ByteMy Logo"
              width={600}
              height={180}
              priority
              className="h-auto w-auto"
            />
          </div>

          <p className="text-slate-600">
            Welcome back! Please sign in to continue
          </p>
        </div>

        {/* Sign-in Form */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-slate-200">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 text-center mb-6">
                Sign in to your account
              </h2>
            </div>

            {/* Status Messages */}
            {!isLoaded && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-3"></div>
                  <p className="text-sm text-blue-800">
                    Loading authentication...
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Google Sign-in Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading || !isLoaded}
              className="w-full flex justify-center items-center py-3 px-4 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !isLoaded}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Sign up link */}
            <div className="text-center">
              <Link
                href="/sign-up"
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Don&apos;t have an account? Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
