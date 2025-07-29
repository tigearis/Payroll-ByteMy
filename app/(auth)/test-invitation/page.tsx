'use client'

import * as React from 'react'
import { useSignUp, useUser } from '@clerk/nextjs'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestInvitationPage() {
  const { user } = useUser()
  const router = useRouter()
  const { isLoaded, signUp, setActive } = useSignUp()
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')  
  const [password, setPassword] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState('')

  // Handle signed-in users visiting this page
  React.useEffect(() => {
    if (user?.id) {
      router.push('/dashboard')
    }
  }, [user, router])

  // Get the token from the query params
  const token = useSearchParams().get('__clerk_ticket')

  // If there is no invitation token, restrict access to this page
  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Invitation Token</CardTitle>
            <CardDescription>
              No invitation token found. Please check your invitation link.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Handle submission of the sign-up form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!isLoaded) return

    try {
      if (!token) return null

      setIsSubmitting(true)
      console.log('🎫 Creating sign-up with ticket:', token.substring(0, 20) + '...')

      // Create a new sign-up with the supplied invitation token.
      // After the below call, the user's email address will be
      // automatically verified because of the invitation token.
      const signUpAttempt = await signUp.create({
        strategy: 'ticket',
        ticket: token,
        firstName,
        lastName,
        password,
      })

      console.log('Sign-up attempt result:', {
        status: signUpAttempt.status,
        createdSessionId: signUpAttempt.createdSessionId
      })

      // If the sign-up was completed, set the session to active
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.push('/dashboard')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error('Sign-up not complete:', JSON.stringify(signUpAttempt, null, 2))
        setError('Sign-up could not be completed. Please try again.')
      }
    } catch (err: any) {
      console.error('Sign-up error:', JSON.stringify(err, null, 2))
      setError(err.errors?.[0]?.message || err.message || 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Invitation</CardTitle>
          <CardDescription>
            Fill out the form below to create your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div id="clerk-captcha" />
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting || !firstName || !lastName || !password}
            >
              {isSubmitting ? 'Creating Account...' : 'Complete Sign Up'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}