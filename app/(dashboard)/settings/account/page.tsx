// app/(dashboard)/settings/account/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useUser, useClerk } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function AccountSettings() {
  const { user, isLoaded } = useUser()
  const { openUserProfile } = useClerk()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [loading, setLoading] = useState(false)

  // Load user data when component mounts
  useEffect(() => {
    if (isLoaded && user) {
      setFirstName(user.firstName || "")
      setLastName(user.lastName || "")
    }
  }, [isLoaded, user])

  const syncUserWithDatabase = async (firstName: string, lastName: string) => {
    try {
      console.log(`Syncing user (${user?.id}) with database:`, { firstName, lastName });
      
      const response = await fetch(`/api/user/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
        }),
      });
  
      const responseData = await response.json();
      console.log('Database sync response:', responseData);
  
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to sync user with database');
      }
  
      return responseData;
    } catch (error) {
      console.error('Error syncing with database:', error);
      throw error;
    }
  };
  
  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // First update the user in Clerk
      console.log("Updating user in Clerk:", { firstName, lastName });
      await user.update({
        firstName,
        lastName,
      });
      
      // Then sync the updates with your database
      console.log("Now syncing with database");
      const result = await syncUserWithDatabase(firstName, lastName);
      console.log("Sync result:", result);
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleManageAccount = () => {
    openUserProfile()
  }

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Account Settings</h2>
        <p className="text-muted-foreground">Manage your account information.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={user?.primaryEmailAddress?.emailAddress || ""} 
                disabled 
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed here. Please contact support.</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleUpdateProfile} 
            disabled={loading || (!firstName.trim() && !lastName.trim()) || (firstName === user?.firstName && lastName === user?.lastName)}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>Manage your account security settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline" onClick={handleManageAccount}>
              Manage Account Security
            </Button>
            <p className="text-xs text-muted-foreground">
              Opens Clerk's user profile interface for managing passwords and security settings.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}