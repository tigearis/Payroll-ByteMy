// app/(dashboard)/settings/account/page.tsx
"use client";

import { useQuery } from "@apollo/client";
import { useUser } from "@clerk/nextjs";
import { Lock, Eye, Monitor, Sidebar, Layout, RefreshCw } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/patterns/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ByteMyLoadingIcon } from "@/components/ui/bytemy-loading-icon";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GetUserProfileSettingsDocument } from "@/domains/users";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useLayoutPreferences } from "@/lib/preferences/layout-preferences";

export default function AccountSettings() {
  const { user: clerkUser, isLoaded } = useUser();
  const { currentUserId } = useCurrentUser();
  const { layoutType, setLayoutType } = useLayoutPreferences();

  const [activeTab, setActiveTab] = useState("account");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // GraphQL operations
  const { data: userData, loading: userLoading } = useQuery(
    GetUserProfileSettingsDocument,
    {
      variables: { id: currentUserId! },
      skip: !currentUserId,
      fetchPolicy: "cache-and-network",
    }
  );

  const handlePasswordReset = async () => {
    try {
      setPasswordLoading(true);
      // For now, we'll show a message directing users to use email reset
      alert(
        "Please use the 'Forgot Password' link on the login page to reset your password"
      );
    } catch (error) {
      console.error("Error with password reset:", error);
      alert("Failed to initiate password reset");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!isLoaded || userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <ByteMyLoadingIcon title="Loading settings..." size="default" />
      </div>
    );
  }

  const dbUser = userData?.usersByPk;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Account Settings"
        description="Manage your account information and preferences."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Settings", href: "/settings" },
          { label: "Account" },
        ]}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                View your account details and status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Account ID</Label>
                  <p className="text-sm text-muted-foreground">{dbUser?.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Clerk ID</Label>
                  <p className="text-sm text-muted-foreground">
                    {dbUser?.clerkUserId}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Member Since</Label>
                  <p className="text-sm text-muted-foreground">{"N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Updated</Label>
                  <p className="text-sm text-muted-foreground">{"N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Password Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Password
              </CardTitle>
              <CardDescription>
                Change your account password for better security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Current Password</h4>
                    <p className="text-sm text-gray-600">••••••••••</p>
                  </div>
                  <Button
                    onClick={handlePasswordReset}
                    disabled={passwordLoading}
                    variant="outline"
                  >
                    {passwordLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Reset Password
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                A password reset link will be sent to your email address. You
                can then create a new password securely.
              </p>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Active Sessions
              </CardTitle>
              <CardDescription>
                Manage devices that are signed into your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Monitor className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Current Session</span>
                        <Badge variant="secondary" className="text-xs">
                          This device
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Last active:{" "}
                        {clerkUser?.lastSignInAt
                          ? new Date(
                              clerkUser.lastSignInAt
                            ).toLocaleDateString()
                          : "Now"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {clerkUser?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded-lg">
                  <p>
                    For security reasons, only your current session is
                    displayed. If you suspect unauthorized access, please change
                    your password immediately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for important updates
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Marketing Emails</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about new features and updates
                  </p>
                </div>
                <Switch />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Time Zone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">Eastern Time</SelectItem>
                    <SelectItem value="pst">Pacific Time</SelectItem>
                    <SelectItem value="aest">
                      Australian Eastern Time
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Dashboard Layout</Label>
                <div className="flex gap-2">
                  <Button
                    variant={layoutType === "sidebar" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLayoutType("sidebar")}
                    className="flex items-center gap-2"
                  >
                    <Sidebar className="h-4 w-4" />
                    Sidebar
                  </Button>
                  <Button
                    variant={layoutType === "header" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLayoutType("header")}
                    className="flex items-center gap-2"
                  >
                    <Layout className="h-4 w-4" />
                    Header
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred dashboard layout style
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
