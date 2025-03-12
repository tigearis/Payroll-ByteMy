// app/(auth)/sign-in/[[...sign-in]]/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSignIn } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Define a type for Clerk errors
interface ClerkError {
  errors?: Array<{
    longMessage?: string;
    message?: string;
    code?: string;
  }>;
}

export default function SignInPage() {
  const router = useRouter()
  const { isLoaded, signIn, setActive } = useSignIn()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<"signIn" | "forgotPassword" | "resetPassword">("signIn")
  const [secondFactor, setSecondFactor] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isLoaded) {
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Start the sign in process using the email and password
      const result = await signIn.create({
        identifier: email,
        password,
      })

      if (result.status === "complete") {
        // Set the session active
        await setActive({ session: result.createdSessionId })
        // Redirect to dashboard
        router.push("/dashboard")
      } else {
        // Handle incomplete flows
        setError("Sign-in process couldn't be completed. Please try again.")
      }
    } catch (err: unknown) {
      // Handle specific errors with proper typing
      const clerkError = err as ClerkError
      if (clerkError.errors && clerkError.errors.length > 0) {
        const errorMessage = clerkError.errors[0]?.longMessage || 
                            clerkError.errors[0]?.message || 
                            "Invalid credentials"
        setError(errorMessage)
      } else {
        setError("Something went wrong. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Send the password reset code to the user's email
  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isLoaded || !email) {
      setError("Please enter your email address")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      })

      // Explicitly change to reset password view after success
      setView("resetPassword")
      
    } catch (err: unknown) {
      // Handle specific errors with proper typing
      const clerkError = err as ClerkError
      if (clerkError.errors && clerkError.errors.length > 0) {
        const errorMessage = clerkError.errors[0]?.longMessage || 
                            clerkError.errors[0]?.message || 
                            "Failed to send reset email"
        setError(errorMessage)
      } else {
        setError("Something went wrong. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Reset the user's password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isLoaded || !password || !code) {
      setError("Please enter both the code and your new password")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      })

      if (result.status === "needs_second_factor") {
        setSecondFactor(true)
      } else if (result.status === "complete") {
        // Set the active session
        await setActive({ session: result.createdSessionId })
        // Redirect to dashboard
        router.push("/dashboard")
      }
    } catch (err: unknown) {
      // Handle specific errors with proper typing
      const clerkError = err as ClerkError
      if (clerkError.errors && clerkError.errors.length > 0) {
        const errorMessage = clerkError.errors[0]?.longMessage || 
                            clerkError.errors[0]?.message || 
                            "Failed to reset password"
        setError(errorMessage)
      } else {
        setError("Something went wrong. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Forgot password view (request reset code)
  if (view === "forgotPassword") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Card className="w-[350px] shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              Enter your email to receive a reset code
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSendResetCode}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  placeholder="name@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                className="w-full" 
                type="submit" 
                disabled={isLoading || !isLoaded}
              >
                {isLoading ? "Sending..." : "Send Reset Code"}
              </Button>
              <Button 
                className="w-full" 
                variant="outline" 
                type="button"
                onClick={() => setView("signIn")}
              >
                Back to Sign In
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    )
  }

  // Reset password view (enter code and new password)
  if (view === "resetPassword") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Card className="w-[350px] shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create New Password</CardTitle>
            <CardDescription className="text-center">
              Enter the code sent to your email and your new password
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-code">Reset Code</Label>
                <Input
                  id="reset-code"
                  placeholder="Enter code from email"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
              {secondFactor && (
                <div className="bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-100 p-3 rounded-md">
                  Two-factor authentication is required. Please use your authenticator app.
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                className="w-full" 
                type="submit" 
                disabled={isLoading || !isLoaded || secondFactor}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
              <Button 
                className="w-full" 
                variant="outline" 
                type="button"
                onClick={() => setView("signIn")}
              >
                Back to Sign In
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    )
  }

  // Sign in view (default)
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="w-[350px] shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setView("forgotPassword");
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isLoading || !isLoaded}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}